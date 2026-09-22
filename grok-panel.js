/* Halco Job Notes — in-app Grok panel.
   Drop next to app.js and load after it.
   Auth: window.HALCO_GROK_PROXY or localStorage["halco-xai-key"]
*/
(function () {
  if (window.__halcoGrokPanel) return;
  window.__halcoGrokPanel = true;

  var MODEL = window.HALCO_GROK_MODEL || "grok-4-fast";
  var API = window.HALCO_GROK_PROXY || "https://api.x.ai/v1/chat/completions";
  var SYSTEM =
    window.HALCO_GROK_SYSTEM ||
    "You are Grok inside Halco Job Notes, a phone app Jacob W uses in the field for Halco Energy job invoice notes. Voice: short field-tech English. No fluff. Do not invent readings, part numbers, or findings. Note format starts with 'Job Invoice Summary - {date}' then '{Last} - {Invoice}', then job type, equipment, body, then 'Thank you,' / 'Jacob W'. If you draft a full note, put it in a markdown fence labeled halco-note.";

  var history = [];

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
    return {
      jobType: (window.state && state.jobType) || null,
      kind: (window.state && state.kind) || "Maintenance",
      date: val("jobDate"),
      lastName: val("lastName"),
      invoice: val("invoice"),
      systemId: sysSel ? sysSel.value : "",
      systemName: sysName,
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

  function key() {
    return localStorage.getItem("halco-xai-key") || "";
  }

  function css() {
    var s = document.createElement("style");
    s.textContent =
      "#grokFab{position:fixed;right:12px;bottom:84px;z-index:40;width:52px;height:52px;border-radius:16px;background:#3d8bfd;color:#fff;font-weight:800;font-size:18px;border:0}" +
      "#grokSheet{position:fixed;left:0;right:0;bottom:0;top:18%;z-index:60;background:#152033;border-top:1px solid #334155;display:none;flex-direction:column;padding:12px 12px calc(12px + env(safe-area-inset-bottom))}" +
      "#grokSheet.on{display:flex}" +
      "#grokHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}" +
      "#grokLog{flex:1;overflow:auto;background:#0f1620;border:1px solid #334155;border-radius:12px;padding:10px;white-space:pre-wrap;font-size:14px}" +
      "#grokRow{display:flex;gap:8px;margin-top:8px}" +
      "#grokIn{flex:1;min-height:48px;border-radius:12px;border:1px solid #334155;background:#0f1620;color:#e8eef6;padding:12px;font:inherit}" +
      "#grokSheet button{appearance:none;border:0;border-radius:12px;padding:12px;min-height:48px;background:#3d8bfd;color:#fff;font-weight:700}" +
      "#grokSheet button.ghost{background:#243044;color:#e8eef6;border:1px solid #334155}" +
      "#grokApply{display:none;margin-top:8px;background:#1f8a55}";
    document.head.appendChild(s);
  }

  function ui() {
    var fab = document.createElement("button");
    fab.id = "grokFab";
    fab.type = "button";
    fab.textContent = "G";
    fab.title = "Grok";
    var sheet = document.createElement("div");
    sheet.id = "grokSheet";
    sheet.innerHTML =
      '<div id="grokHead"><strong>Grok</strong><span>' +
      '<button class="ghost" type="button" id="grokKeyBtn">Key</button> ' +
      '<button class="ghost" type="button" id="grokClose">Close</button></span></div>' +
      '<div id="grokLog">Ask Grok to draft or clean up this job note.</div>' +
      '<button type="button" id="grokApply">Apply to notes</button>' +
      '<div id="grokRow"><textarea id="grokIn" placeholder="Tell Grok what to write…"></textarea>' +
      '<button type="button" id="grokSend">Send</button></div>';
    document.body.appendChild(fab);
    document.body.appendChild(sheet);
    fab.onclick = function () {
      sheet.classList.add("on");
    };
    $("grokClose").onclick = function () {
      sheet.classList.remove("on");
    };
    $("grokKeyBtn").onclick = function () {
      var next = prompt("xAI API key for this phone (stored only on device)", key() || "");
      if (next === null) return;
      if (next.trim()) localStorage.setItem("halco-xai-key", next.trim());
      else localStorage.removeItem("halco-xai-key");
      toast("Key saved on device");
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

  async function send() {
    var input = $("grokIn");
    var text = input.value.trim();
    if (!text) return;
    if (!window.HALCO_GROK_PROXY && !key()) {
      $("grokKeyBtn").click();
      if (!key()) return;
    }
    input.value = "";
    appendLog("You", text);
    var snap = snapshot();
    history.push({ role: "user", content: text });
    var messages = [
      { role: "system", content: SYSTEM },
      {
        role: "system",
        content: "Current job snapshot:\n" + JSON.stringify(snap, null, 2)
      }
    ].concat(history);

    var headers = { "Content-Type": "application/json" };
    if (!window.HALCO_GROK_PROXY && key()) {
      headers.Authorization = "Bearer " + key();
    }

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
      appendLog("Grok", out);
      var note = extractNote(out);
      if (note) {
        apply.dataset.note = note;
        apply.style.display = "block";
      }
    } catch (err) {
      appendLog("Error", String(err.message || err) + "\nIf this is CORS, use a proxy (window.HALCO_GROK_PROXY).");
    }
  }

  function boot() {
    css();
    ui();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
