/* Halco Job Notes — live Grok panel at the top, with photo attach and field fill.
   Auth: window.HALCO_GROK_PROXY or localStorage["halco-xai-key"]
*/
(function () {
  if (window.__halcoGrokPanel) return;
  window.__halcoGrokPanel = true;

  var MODEL = window.HALCO_GROK_MODEL || "grok-4-fast";
  var API = window.HALCO_GROK_PROXY || "https://api.x.ai/v1/chat/completions";
  var SYSTEM =
    window.HALCO_GROK_SYSTEM ||
    [
      "You are Grok inside Halco Job Notes, a phone app Jacob W uses in the field for Halco Energy job invoice notes.",
      "Voice: short field-tech English. No fluff. Do not invent readings, part numbers, findings, last names, or invoice numbers.",
      "When the user sends text or photos, extract only what is clearly present and transfer it into the app by returning a markdown fence labeled halco-fields containing one JSON object.",
      "Allowed keys: jobType (service|maintenance), kind (Maintenance|Prepaid Maintenance), systemId, jobDate (YYYY-MM-DD), lastName, invoice, equipment, extraNotes, svcFor, svcFindings, svcRecs, svcFix, fills (object), stock (array of item strings).",
      "systemId must be one of: gas-furnace, coil-condenser, coil-hp, air-handler-hp, ductless, he-boiler, gas-boiler, combi, wh-gas, wh-elec, tankless, hpwh, humidifier, sanidry, erv, service-blank.",
      "fills keys: filter, hsi, rise, supplyCO, exhCO, o2, co2, stack, cap, delta, baseCO, volts, upper, lower, temp.",
      "Combustion analyzer photos: read the CO ppm and put the number only in fills.exhCO (example: 35). Put O2 in fills.o2, CO2 in fills.co2, stack temp in fills.stack, supply-air CO in fills.supplyCO. Always include fills when a reading is visible in the photo. Do not drop CO just because other readings are missing.",
      "Put free-text job notes that belong in the email into extraNotes. Put service call details into svcFor / svcFindings / svcRecs / svcFix. Put truck-stock part lines into stock.",
      "Omit any key you cannot fill. Do not guess. After the fence, one short sentence on what you filled. If you also draft a full note, put that in a fence labeled halco-note."
    ].join(" ");

  var history = [];
  var pendingPhotos = [];

  function $(id) {
    return document.getElementById(id);
  }
  function val(id) {
    var el = $(id);
    return el ? String(el.value || "").trim() : "";
  }
  function toast(msg) {
    if (typeof window.toast === "function") window.toast(msg);
    else alert(msg);
  }

  function snapshot() {
    var fills = {};
    document.querySelectorAll("[data-fill]").forEach(function (el) {
      fills[el.dataset.fill] = el.value.trim();
    });
    var sysSel = $("systemSel");
    var sysName = "";
    if (sysSel && sysSel.selectedIndex >= 0) {
      sysName = sysSel.options[sysSel.selectedIndex].textContent;
    }
    var st = window.state || {};
    var systems = (st.lib && st.lib.systems) || [];
    return {
      jobType: st.jobType || null,
      kind: st.kind || "Maintenance",
      date: val("jobDate"),
      lastName: val("lastName"),
      invoice: val("invoice"),
      systemId: sysSel ? sysSel.value : "",
      systemName: sysName,
      systems: systems.map(function (s) { return { id: s.id, name: s.name }; }),
      equipment: val("equipment"),
      fills: fills,
      extraNotes: val("extraNotes"),
      preview: val("preview"),
      svcFor: val("svcFor"),
      svcFindings: val("svcFindings"),
      svcRecs: val("svcRecs"),
      svcFix: val("svcFix")
    };
  }

  function extractNote(text) {
    var m = text.match(/```halco-note\s*([\s\S]*?)```/i);
    return m ? m[1].trim() : null;
  }
  function extractFields(text) {
    var m = text.match(/```halco-fields\s*([\s\S]*?)```/i);
    if (!m) return null;
    try { return JSON.parse(m[1].trim()); } catch (e) { return null; }
  }
  function stripFences(text) {
    return text
      .replace(/```halco-fields\s*[\s\S]*?```/gi, "")
      .replace(/```halco-note\s*[\s\S]*?```/gi, "")
      .trim();
  }
  function filledKeys(fields) {
    if (!fields) return [];
    return Object.keys(fields).filter(function (k) {
      var v = fields[k];
      if (v == null || v === "") return false;
      if (Array.isArray(v) && !v.length) return false;
      if (typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length) return false;
      return true;
    });
  }

  function key() {
    return localStorage.getItem("halco-xai-key") || "";
  }

  function css() {
    var s = document.createElement("style");
    s.textContent =
      "#grokTop{background:#1c2533;border:1px solid #334155;border-radius:16px;padding:12px;margin:0 0 14px}" +
      "#grokTopHead{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px}" +
      "#grokTopHead strong{font-size:16px}" +
      "#grokBody{display:block}" +
      "#grokLog{max-height:160px;overflow:auto;background:#0f1620;border:1px solid #334155;border-radius:12px;padding:10px;white-space:pre-wrap;font-size:14px;margin-top:8px}" +
      "#grokPhotos{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}" +
      "#grokPhotos img{width:64px;height:64px;object-fit:cover;border-radius:8px;border:1px solid #334155}" +
      "#grokRow{display:flex;gap:8px;align-items:flex-end}" +
      "#grokIn{flex:1;min-height:48px;border-radius:12px;border:1px solid #334155;background:#0f1620;color:#e8eef6;padding:12px;font:inherit}" +
      "#grokTop button{appearance:none;border:0;border-radius:12px;padding:12px;min-height:48px;background:#3d8bfd;color:#fff;font-weight:700}" +
      "#grokTop button.ghost{background:#243044;color:#e8eef6;border:1px solid #334155}" +
      "#grokApply{display:none;margin-top:8px;background:#1f8a55;width:100%}";
    document.head.appendChild(s);
  }

  function drawPhotos() {
    var box = $("grokPhotos");
    if (!box) return;
    box.innerHTML = "";
    pendingPhotos.forEach(function (p, i) {
      var img = document.createElement("img");
      img.src = p.data;
      img.title = "Tap to remove";
      img.onclick = function () {
        pendingPhotos.splice(i, 1);
        drawPhotos();
      };
      box.appendChild(img);
    });
  }

  function addPhotos(files) {
    [].slice.call(files || []).forEach(function (file) {
      if (!file.type || file.type.indexOf("image/") !== 0) return;
      var reader = new FileReader();
      reader.onload = function () {
        pendingPhotos.push({ name: file.name, data: reader.result });
        drawPhotos();
      };
      reader.readAsDataURL(file);
    });
  }

  function ui() {
    var main = document.querySelector("main");
    if (!main) return;
    var panel = document.createElement("div");
    panel.id = "grokTop";
    panel.innerHTML =
      '<div id="grokTopHead"><strong>Live bot</strong>' +
      '<button class="ghost" type="button" id="grokKeyBtn">Key</button></div>' +
      '<div id="grokBody">' +
      '<div id="grokRow">' +
      '<input id="grokPhotoIn" type="file" accept="image/*" multiple hidden />' +
      '<button class="ghost" type="button" id="grokPhotoBtn">Photo</button>' +
      '<textarea id="grokIn" placeholder="Add photos, then type the job…"></textarea>' +
      '<button type="button" id="grokSend">Send</button></div>' +
      '<div id="grokPhotos"></div>' +
      '<div id="grokLog">Photos and text fill the job fields below.</div>' +
      '<button type="button" id="grokApply">Apply full note</button></div>';
    var tabs = main.querySelector(".tabs");
    if (tabs) main.insertBefore(panel, tabs);
    else main.insertBefore(panel, main.firstChild);

    $("grokKeyBtn").onclick = function () {
      var next = prompt("xAI API key for this phone (stored only on device)", key() || "");
      if (next === null) return;
      if (next.trim()) localStorage.setItem("halco-xai-key", next.trim());
      else localStorage.removeItem("halco-xai-key");
      toast("Key saved on device");
    };
    $("grokPhotoBtn").onclick = function () {
      $("grokPhotoIn").click();
    };
    $("grokPhotoIn").onchange = function (e) {
      addPhotos(e.target.files);
      e.target.value = "";
    };
    $("grokSend").onclick = send;
    $("grokIn").addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });
    $("grokApply").onclick = function () {
      var note = $("grokApply").dataset.note;
      if (!note) return;
      var preview = $("preview");
      if (preview) preview.value = note;
      toast("Notes updated");
    };
  }

  function appendLog(who, text) {
    var log = $("grokLog");
    log.textContent += "\n\n" + who + "\n" + text;
    log.scrollTop = log.scrollHeight;
  }

  function userContent(text, photos) {
    if (!photos.length) return text;
    var parts = [];
    if (text) parts.push({ type: "text", text: text });
    else parts.push({ type: "text", text: "Read these photos and fill the matching Halco job fields. If a combustion analyzer is shown, put the CO ppm number in fills.exhCO, O2 in fills.o2, CO2 in fills.co2, and stack temp in fills.stack." });
    photos.forEach(function (p) {
      parts.push({ type: "image_url", image_url: { url: p.data } });
    });
    return parts;
  }

  async function send() {
    var input = $("grokIn");
    var text = input.value.trim();
    if (!text && !pendingPhotos.length) return;
    if (!window.HALCO_GROK_PROXY && !key()) {
      $("grokKeyBtn").click();
      if (!key()) return;
    }
    input.value = "";
    var photos = pendingPhotos.slice();
    pendingPhotos = [];
    drawPhotos();
    if (photos.length && typeof window.halcoAddJobPhotos === "function") window.halcoAddJobPhotos(photos);
    appendLog("You", (text || "(photos only)") + (photos.length ? " [" + photos.length + " photo]" : ""));
    var snap = snapshot();
    history.push({ role: "user", content: userContent(text, photos) });
    var messages = [
      { role: "system", content: SYSTEM },
      { role: "system", content: "Current job snapshot:\n" + JSON.stringify(snap, null, 2) }
    ].concat(history);

    var headers = { "Content-Type": "application/json" };
    if (!window.HALCO_GROK_PROXY && key()) headers.Authorization = "Bearer " + key();

    var apply = $("grokApply");
    apply.style.display = "none";
    apply.dataset.note = "";

    try {
      var res = await fetch(API, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ model: MODEL, messages: messages, stream: false })
      });
      if (!res.ok) throw new Error("HTTP " + res.status + " " + (await res.text()).slice(0, 240));
      var data = await res.json();
      var out =
        (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) ||
        data.output_text ||
        JSON.stringify(data);
      history.push({ role: "assistant", content: out });
      var fields = extractFields(out);
      var keys = filledKeys(fields);
      if (fields && typeof window.halcoApplyFields === "function") {
        window.halcoApplyFields(fields);
        toast(keys.length ? "Filled: " + keys.join(", ") : "Nothing to fill");
      }
      var visible = stripFences(out);
      if (keys.length) visible = (visible ? visible + "\n" : "") + "Filled: " + keys.join(", ");
      appendLog("Grok", visible || "(no reply text)");
      var note = extractNote(out);
      if (note) {
        apply.dataset.note = note;
        apply.style.display = "block";
      }
    } catch (err) {
      appendLog("Error", String(err.message || err) + "\nIf this is CORS, the phone browser blocked api.x.ai. A proxy is required.");
    }
  }

  function boot() {
    css();
    ui();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
