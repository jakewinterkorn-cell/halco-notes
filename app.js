const STOCK_TO="jacob@halcoenergy.com";
const BOT_BRIEF=["Halco Job Notes app \u2014 for the invoices bot","","Live app (phone):","https://raw.githack.com/jakewinterkorn-cell/halco-notes/main/index.html","","Source:","https://github.com/jakewinterkorn-cell/halco-notes","","Templates:","https://raw.githack.com/jakewinterkorn-cell/halco-notes/main/templates.js","","How this lines up with how you already work","","1. Still draft the note the same way: photos, last name, invoice, equipment type, readings.","2. Use the same template list as the app: gas furnace, coil + condenser, coil + heat pump, air handler + heat pump, ductless 1:1, high-efficiency boiler, gas boiler, combi, gas tank WH, electric tank WH, tankless, heat pump WH, humidifier, Sanidry, ERV.","3. Note shape:","Job Invoice Summary - Month D, YYYY","Last - Invoice","","Service | Maintenance | Prepaid Maintenance","Equipment:","body","","Thank you,","Jacob W","","4. Leave blank fill-ins out. Do not invent ohms, CO, delta T, or part numbers.","5. Show the note. Save to Google Drive folder Halco Invoices only after I approve.","6. Parts email stays separate: To jacob@halcoenergy.com, subject Last - invoice, body is the part lines only. Draft only. Send only when I say send.","7. Do not handle inbox replies.","","What the app does that you do not need to copy","","- Phone dock: Build, Copy, Email, Truck Stock.","- App Email button sends only Extra job information, with a blank To. Not the Halco address.","- Truck Stock is a different email (pickup list to jacob@halcoenergy.com). That is not the parts email.","- Job data is only on the phone. You will not see open jobs unless I paste the note or send screenshots.","","Treat the live URL and templates.js as the source of truth for wording. Keep Drive save and the parts-email rule as you already do them."].join("\n");
const state={jobType:null,kind:"Maintenance",photos:[],lib:null};
window.state=state;
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.style.display="block";setTimeout(function(){t.style.display="none";},1400);}
function $(id){return document.getElementById(id);}
function val(id){const el=$(id);return el?el.value.trim():"";}
function setPreview(text){var el=$("preview");if(!el)return;if("value" in el)el.value=text;else el.textContent=text;}
function getPreview(){var el=$("preview");if(!el)return"";return ("value" in el?el.value:el.textContent)||"";}
function loadLib(){if(typeof DEFAULT_LIB==="undefined"){window.DEFAULT_LIB={systems:[{id:"service-blank",name:"Service",system:"Service",equipmentHint:"",fills:[],bullets:[],extras:[]}]};}try{const raw=localStorage.getItem("halco-lib");state.lib=raw?JSON.parse(raw):structuredClone(DEFAULT_LIB);}catch(e){state.lib=structuredClone(DEFAULT_LIB);}if(state.lib&&state.lib.systems){state.lib.systems.forEach(function(s){(s.fills||[]).forEach(function(f){f.def="";});});}}
function saveLib(){localStorage.setItem("halco-lib",JSON.stringify(state.lib));}
function currentSystem(){return state.lib.systems.find(function(s){return s.id===document.getElementById("systemSel").value;})||state.lib.systems[0];}
function fillMap(){const map={};document.querySelectorAll("[data-fill]").forEach(function(el){map[el.dataset.fill]=el.value.trim();});return map;}
function applyFills(text,map){var out=text;Object.entries(map).forEach(function(kv){out=out.replaceAll("{"+kv[0]+"}",kv[1]||"");});var hsi=map.hsi?(" Tested hot surface igniter - "+map.hsi+" ohms (within range)."):"";var cap=map.cap?(" Tested capacitor - "+map.cap+"."):"";out=out.replaceAll("{hsiLine}",hsi).replaceAll("{capLine}",cap);out=out.replace(/\{[a-zA-Z0-9]+\}/g,"");out=out.replace(/Inspected and replaced\s*\.?/i,"Inspected air filter.");out=out.replace(/\s{2,}/g," ").replace(/ \./g,".");return out.trim();}
function keepExtra(line){if(!line)return false;if(/:\s*$/.test(line))return false;if(/:\s*\)/.test(line))return false;if(/\{\w+\}/.test(line))return false;if(/,\s*,/.test(line))return false;if(/CO\s*,\s*O2\s*,/.test(line))return false;return true;}
function formatDate(iso){if(!iso)return"";var p=iso.split("-");return new Date(Number(p[0]),Number(p[1])-1,Number(p[2])).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});}
function addField(box,id,label,isArea){var lab=document.createElement("label");lab.textContent=label;var el=document.createElement(isArea?"textarea":"input");el.id=id;box.appendChild(lab);box.appendChild(el);}
function renderFills(){var box=$("fillFields");box.innerHTML="";if(state.jobType==="service"){addField(box,"svcFor","Service call for");addField(box,"svcFindings","Findings",true);addField(box,"svcRecs","Recommendations",true);addField(box,"svcFix","Solution / Fix",true);return;}var sys=currentSystem();(sys.fills||[]).forEach(function(f){var lab=document.createElement("label");lab.textContent=f.label+"  (leave blank to omit)";var inp=document.createElement("input");inp.dataset.fill=f.key;inp.value="";box.appendChild(lab);box.appendChild(inp);});}
function renderSystems(){var sel=$("systemSel");sel.innerHTML="";state.lib.systems.forEach(function(s){var o=document.createElement("option");o.value=s.id;o.textContent=s.name;sel.appendChild(o);});}
function jobTag(){var last=val("lastName")||"(last name)";var inv=val("invoice")||"(invoice #)";return last+" - "+inv;}
function buildServiceBody(){var parts=[];var callFor=val("svcFor");var findings=val("svcFindings");var recs=val("svcRecs");var fix=val("svcFix");if(callFor)parts.push("Service call for: "+callFor);if(findings)parts.push("Findings:\n"+findings);if(recs)parts.push("Recommendations:\n"+recs);if(fix)parts.push("Solution/Fix:\n"+fix);var extra=val("extraNotes");if(extra)parts.push(extra);return parts.join("\n\n");}
function buildNotes(){var sys=currentSystem();var map=fillMap();var date=formatDate(val("jobDate"))||formatDate(new Date().toISOString().slice(0,10));var last=val("lastName")||"(Customer last name)";var inv=val("invoice")||"(invoice #)";var equip=val("equipment")||sys.equipmentHint||"";var typeLine=state.jobType==="service"?"Service":(state.kind||"Maintenance");var extra=val("extraNotes");var body="";if(state.jobType==="service"){body=buildServiceBody();}else{var bullets=(sys.bullets||[]).map(function(b){return "- "+applyFills(b,map);}).filter(function(line){return line.replace(/^[-\s]+/,"").length;});var extraKeep=(sys.extras||[]).map(function(e){return applyFills(e,map);}).filter(keepExtra);if(bullets.length)body+=bullets.join("\n");if(extraKeep.length)body+=(body?"\n":"")+extraKeep.join("\n");if(extra)body+=(body?"\n\n":"")+extra;}var lines=["Job Invoice Summary - "+date,last+" - "+inv,"",typeLine];if(equip)lines.push(equip+":");if(body)lines.push(body);lines.push("");lines.push("Thank you,");lines.push("Jacob W");var notes=lines.join("\n");setPreview(notes);return notes;}
function showTab(name){["Job","Lib","Bot"].forEach(function(n){var pane=$("pane"+n);var btn=$("tab"+n);if(pane)pane.classList.toggle("hidden",n.toLowerCase()!==name);if(btn)btn.className=n.toLowerCase()===name?"":"ghost";});}
function addPhotos(files){[].slice.call(files).forEach(function(file){var reader=new FileReader();reader.onload=function(){state.photos.push({name:file.name,data:reader.result});drawPhotos();};reader.readAsDataURL(file);});}
function drawPhotos(){var g=$("photoGrid");if(!g)return;g.innerHTML="";state.photos.forEach(function(p,i){var img=document.createElement("img");img.src=p.data;img.onclick=function(){if(confirm("Remove this photo?")){state.photos.splice(i,1);drawPhotos();}};g.appendChild(img);});}
function renderStockBoxes(){var wrap=$("stockBoxes");if(!wrap)return;wrap.innerHTML="";for(var i=1;i<=10;i++){var lab=document.createElement("label");lab.textContent="Item "+i;var inp=document.createElement("input");inp.id="stock"+i;inp.placeholder="Part / item";wrap.appendChild(lab);wrap.appendChild(inp);}}
function updateStockHeader(){var h=$("stockHeader");if(h)h.textContent="Pickup for "+jobTag();}
function stockItems(){var items=[];for(var i=1;i<=10;i++){var v=val("stock"+i);if(v)items.push(v);}return items;}
function sendStockEmail(){updateStockHeader();var items=stockItems();if(!items.length){alert("Add at least one item.");return;}var email=val("stockEmail")||STOCK_TO;$("stockEmail").value=email;localStorage.setItem("halco-stock-email",email);var tag=jobTag();var body=["Truck stock pickup",tag,""].concat(items.map(function(it){return "- "+it;})).join("\n");location.href="mailto:"+encodeURIComponent(email)+"?subject="+encodeURIComponent("Truck Stock - "+tag)+"&body="+encodeURIComponent(body);}
function sendJobEmail(){var extra=val("extraNotes");if(!extra){alert("Extra job information is empty.");return;}location.href="mailto:?subject="+encodeURIComponent(jobTag())+"&body="+encodeURIComponent(extra);}
function notesNow(){var t=getPreview().trim();if(!t||t.indexOf("Pick a type")===0)return buildNotes();return t;}
function onTap(el,fn){if(!el)return;el.addEventListener("click",fn);}
function normalizeFills(fills){
  var out={};
  if(!fills||typeof fills!=="object")return out;
  var alias={co:"exhCO",exhaustco:"exhCO",exhaust_co:"exhCO",exhaust:"exhCO",supplyco:"supplyCO",supply_co:"supplyCO",stacktemp:"stack",stack_temp:"stack"};
  Object.keys(fills).forEach(function(k){
    if(fills[k]==null||String(fills[k]).trim()==="")return;
    var nk=alias[String(k).toLowerCase()]||k;
    out[nk]=String(fills[k]).trim();
  });
  return out;
}
function combustionLine(f){
  var bits=[];
  if(f.exhCO)bits.push("CO "+f.exhCO);
  if(f.supplyCO)bits.push("Supply CO "+f.supplyCO);
  if(f.o2)bits.push("O2 "+f.o2);
  if(f.co2)bits.push("CO2 "+f.co2);
  if(f.stack)bits.push("stack "+f.stack);
  return bits.length?"(Exhaust combustion: "+bits.join(", ")+")":"";
}
function applyFromBot(fields){
  if(!fields||typeof fields!=="object")return;
  if(fields.jobType==="service"||fields.jobType==="maintenance"){
    state.jobType=fields.jobType;
    document.querySelectorAll("[data-job]").forEach(function(b){b.classList.toggle("on",b.dataset.job===state.jobType);});
    $("maintKindWrap").classList.toggle("hidden",state.jobType!=="maintenance");
    if(state.jobType==="service")$("systemSel").value="service-blank";
    renderFills();
  }
  if(fields.kind==="Maintenance"||fields.kind==="Prepaid Maintenance"){
    state.kind=fields.kind;
    document.querySelectorAll("[data-kind]").forEach(function(b){b.classList.toggle("on",b.dataset.kind===state.kind);});
  }
  if(fields.systemId&&state.jobType!=="service"){
    var opt=document.querySelector("#systemSel option[value='"+fields.systemId+"']");
    if(opt){$("systemSel").value=fields.systemId;renderFills();}
  }
  ["jobDate","lastName","invoice","equipment","extraNotes","svcFor","svcFindings","svcRecs","svcFix"].forEach(function(id){
    if(fields[id]!=null&&$(id))$(id).value=String(fields[id]);
  });
  var norm=normalizeFills(fields.fills);
  var applied={};
  if(Object.keys(norm).length){
    document.querySelectorAll("[data-fill]").forEach(function(el){
      if(norm[el.dataset.fill]!=null){el.value=norm[el.dataset.fill];applied[el.dataset.fill]=true;}
    });
  }
  var leftover={};
  ["exhCO","supplyCO","o2","co2","stack"].forEach(function(k){if(norm[k]&&!applied[k])leftover[k]=norm[k];});
  var line=combustionLine(leftover);
  if(line){
    if(state.jobType==="service"&&$("svcFindings")){
      var cur=val("svcFindings");
      if(cur.indexOf(line)===-1)$("svcFindings").value=cur?cur+"\n"+line:line;
    }else if($("extraNotes")){
      var extra=val("extraNotes");
      if(extra.indexOf(line)===-1)$("extraNotes").value=extra?extra+"\n"+line:line;
    }
  }
  if(Array.isArray(fields.stock)&&fields.stock.length){
    showTab("job");
    $("stockCard").classList.remove("hidden");
    for(var i=0;i<10;i++){var el=$("stock"+(i+1));if(el&&fields.stock[i])el.value=String(fields.stock[i]);}
  }
  updateStockHeader();
  if(state.jobType)buildNotes();
}
window.halcoApplyFields=applyFromBot;
window.halcoAddJobPhotos=function(photos){
  (photos||[]).forEach(function(p){if(p&&p.data)state.photos.push({name:p.name||"photo",data:p.data});});
  drawPhotos();
};
function init(){if($("jsFlag"))$("jsFlag").textContent="Ready";loadLib();renderSystems();renderFills();renderStockBoxes();$("libEdit").value=JSON.stringify(state.lib,null,2);$("jobDate").value=new Date().toISOString().slice(0,10);$("stockEmail").value=localStorage.getItem("halco-stock-email")||STOCK_TO;["lastName","invoice"].forEach(function(id){$(id).addEventListener("input",updateStockHeader);});document.querySelectorAll("[data-job]").forEach(function(btn){onTap(btn,function(){state.jobType=btn.dataset.job;document.querySelectorAll("[data-job]").forEach(function(b){b.classList.toggle("on",b===btn);});$("maintKindWrap").classList.toggle("hidden",state.jobType!=="maintenance");if(state.jobType==="service")$("systemSel").value="service-blank";renderFills();});});document.querySelectorAll("[data-kind]").forEach(function(btn){onTap(btn,function(){state.kind=btn.dataset.kind;document.querySelectorAll("[data-kind]").forEach(function(b){b.classList.toggle("on",b===btn);});});});$("systemSel").onchange=renderFills;onTap($("buildBtn"),function(){buildNotes();toast("Built");});onTap($("copyNotesBtn"),function(){navigator.clipboard.writeText(notesNow());toast("Notes copied");});onTap($("mailBtn"),sendJobEmail);onTap($("stockBtn"),function(){showTab("job");$("stockCard").classList.remove("hidden");updateStockHeader();$("stockCard").scrollIntoView({behavior:"smooth"});});onTap($("stockAdd"),sendStockEmail);$("photoInput").onchange=function(e){addPhotos(e.target.files);};onTap($("resetBtn"),function(){if(!confirm("Clear this job?"))return;["lastName","invoice","equipment","extraNotes","svcFor","svcFindings","svcRecs","svcFix"].forEach(function(id){if($(id))$(id).value="";});for(var i=1;i<=10;i++){if($("stock"+i))$("stock"+i).value="";}setPreview("");state.photos=[];drawPhotos();updateStockHeader();});onTap($("tabJob"),function(){showTab("job");});onTap($("tabLib"),function(){showTab("lib");});onTap($("tabBot"),function(){showTab("bot");});onTap($("copyBotBrief"),function(){navigator.clipboard.writeText(BOT_BRIEF);toast("Bot brief copied");});$("libSave").onclick=function(){try{state.lib=JSON.parse($("libEdit").value);saveLib();renderSystems();renderFills();toast("Library saved");}catch(err){alert(err.message);}};$("libReset").onclick=function(){state.lib=structuredClone(DEFAULT_LIB);$("libEdit").value=JSON.stringify(state.lib,null,2);saveLib();renderSystems();renderFills();toast("Defaults restored");};}
init();
