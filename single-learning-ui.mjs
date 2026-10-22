import {SINGLE_MISSIONS,LEGACY_MISSION_TARGETS} from "./single-learning-missions.mjs";
import {SINGLE_STORAGE,createSingleM1,selectSinglePlant,predictSingle,beginSingleObservation,advanceSingleObservation,resetSingleForDark,darkenSingle,singleObservationChoices,answerSingle,currentSingleRun,singleContext,serializeSingle,encodeSingle,decodeSingle,validateSingle} from "./single-learning-model.mjs";
import {stateId} from "./learning-context.mjs";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
const number=v=>Number.isFinite(v)?v.toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
const button=(id,label,extra="")=>`<button data-single="${id}" ${extra}>${label}</button>`;
const observing=s=>s && ["light-observing","dark-observing"].includes(s.stage);
export function mountSingleAquariumUI(host) {
  const root=document.createElement("div");root.id="learning-root";host.root.append(root);
  let session=null,active=false,timer=null,dialog=null,feedback="",feedbackKind="neutral",storageError="",opener=null,importedLegacy=null;
  const assetErrors=[];
  const oldKeys=()=>{try{return Object.keys(localStorage).filter(k=>k.startsWith("aquarium-learning-")||k.startsWith(SINGLE_STORAGE+":archive:"));}catch{return [];}};
  function readSaved(){try{return localStorage.getItem(SINGLE_STORAGE);}catch{storageError="Der lokale Speicher ist nicht verfügbar. Sichere deinen Stand als Datei.";return null;}}
  function save() {
    if(!session)return true;
    try{localStorage.setItem(SINGLE_STORAGE,encodeSingle(session));storageError="";return true;}
    catch{storageError="Dein Browser konnte nicht speichern. Sichere deinen Stand jetzt als Datei.";pause();return false;}
  }
  function pause(){clearInterval(timer);timer=null;host.pause();}
  function bindTank() {host.open(session.tank,true);session.tank=host.getState();}
  function archiveCurrent() {
    if(!session)return true;
    try{localStorage.setItem(SINGLE_STORAGE+":archive:"+session.attemptId+":"+Date.now(),encodeSingle(session));return true;}
    catch{storageError="Der bisherige Durchgang konnte nicht gesichert werden. Speichere ihn zuerst als Datei.";return false;}
  }
  function start() {
    pause();dialog=null;feedback="";
    if(!session) {
      const saved=readSaved();
      try{session=saved?validateSingle(decodeSingle(saved),host):createSingleM1(host);}
      catch(error){storageError="Die gespeicherte Datei konnte nicht geöffnet werden. Sie bleibt erhalten: "+error.message;dialog="recovery";render();return;}
    }
    active=true;bindTank();save();render();
  }
  function download(data,name="Aquarium-Licht-Ergebnis.json") {
    const text=typeof data==="string"?data:JSON.stringify(data,null,2),url=URL.createObjectURL(new Blob([text],{type:"application/json"}));
    const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function tick() {
    if(!active||dialog||document.hidden){pause();render();return;}
    if(session.tank!==host.getState())throw new Error("Die aktive Aquariumzuordnung ist verloren gegangen.");
    advanceSingleObservation(session,{types:host.types,advance:(tank,days)=>{
      if(tank!==host.getState())throw new Error("Kein zweites Becken erlaubt.");host.advanceCurrent(days);
    }});
    if(!observing(session))pause();save();render();
  }
  function play() {
    if(!observing(session) && !beginSingleObservation(session,host.types))return;
    pause();timer=setInterval(tick,650);feedback="";save();render();
  }
  function choosePlant(uid) {
    if(!active||dialog)return;
    if(!selectSinglePlant(session,uid,host.types)){feedback="Wähle für diese Frage eine lebende Wasserpflanze.";feedbackKind="neutral";render();return;}
    host.comparisonRenderer()?.select(uid);feedback="Diese Pflanze ist ausgewählt.";feedbackKind="neutral";save();render();
  }
  function shuffled(list,key) {
    const offset=parseInt(stateId(session.attemptId+key),16)%list.length;
    return [...list.slice(offset),...list.slice(0,offset)];
  }
  function questionOptions(rows,key) {return `<div class="single-options">${shuffled(rows,key).map(x=>button("answer",esc(x.text),`data-single-choice="${x.id}"`)).join("")}</div>`;}
  function chart() {
    const runs=session.runs.filter(r=>r.samples.length),values=runs.flatMap(r=>r.samples.map(x=>x.oxygen));
    if(!values.length)return "";
    const lo=Math.min(...values)-.05,hi=Math.max(...values)+.05;
    return `<figure class="single-chart"><svg viewBox="0 0 360 140" role="img" aria-label="Gespeicherte Sauerstoffverläufe über jeweils drei Tage"><path d="M35 15 V110 H345" fill="none" stroke="currentColor"/>${runs.map((r,i)=>`<polyline data-run-id="${r.id}" points="${r.samples.map(p=>`${35+(p.day-r.startSnapshot.day)/3*310},${110-(p.oxygen-lo)/(hi-lo)*90}`).join(" ")}" fill="none" stroke="${i?"#965f32":"#306c63"}" stroke-width="3" ${i?'stroke-dasharray="7 4"':""}/>`).join("")}<text x="0" y="18">${number(hi)}</text><text x="0" y="112">${number(lo)}</text><text x="35" y="132">Anfang</text><text x="294" y="132">3 Tage</text></svg><figcaption>Durchgezogen: mit Licht · gestrichelt: ohne Licht · Sauerstoff in mg/L</figcaption></figure>`;
  }
  function table() {return `<table class="single-results"><caption>Gespeicherte Beobachtungen · Sauerstoff in mg/L</caption><thead><tr><th>Durchgang</th><th>Anfang</th><th>Nach 3 Tagen</th></tr></thead><tbody>${session.runs.map(r=>`<tr data-run-id="${r.id}" data-state-id="${r.archive.frames.at(-1).stateId}" data-time="${r.samples.at(-1).day}"><th>${r.condition==="daily-light"?"Mit Licht (8 h täglich)":"Ohne Licht"}</th><td>${number(r.samples[0].oxygen)}</td><td>${number(r.samples.at(-1).oxygen)}</td></tr>`).join("")}</tbody></table>`;}
  function task() {
    const s=session,r=currentSingleRun(s),plant=s.tank.entities.find(e=>e.uid===s.selection),selected=plant?host.types[plant.species]?.name:"Wasserpflanze";
    let title="",body="",action="";
    if(s.stage==="plant") {title="Schau dir eine Wasserpflanze an.";body="Tippe auf eine Pflanze im Aquarium. Du kannst sie auch mit der Schaltfläche auswählen.";action=button("plant","Wasserpest auswählen",'class="single-primary"');}
    if(s.stage==="prediction") {title="Geben Pflanzen auch ohne Licht Sauerstoff ab?";body=`Ausgewählt: ${esc(selected)}. Was vermutest du?`;action=`<div class="single-options">${["Ja","Nein","Ich bin unsicher"].map((x,i)=>button("prediction",x,`data-choice="${i}"`)).join("")}</div>`;}
    if(s.stage==="light-ready") {title="Beobachte zuerst mit täglichem Licht.";body="Die Lampe leuchtet 8 Stunden täglich. Wir beobachten 3 Tage und merken die Sauerstoffwerte automatisch.";action=button("play","Entwicklung ansehen",'class="single-primary"');}
    if(observing(s)) {title=timer?"Beobachte den Sauerstoffwert.":"Die Beobachtung ist angehalten.";body="Die Werte gehören zum sichtbaren Aquarium. Während du liest oder Hilfe öffnest, kannst du die Entwicklung anhalten.";action=button(timer?"pause":"play",timer?"Anhalten":"Weiter beobachten",'class="single-primary"');}
    if(s.stage==="light-finished") {title="Der erste Verlauf ist gespeichert.";body=`Sauerstoff: ${number(r.samples[0].oxygen)} → ${number(r.samples.at(-1).oxygen)} mg/L. Jetzt starten wir noch einmal gleich und ändern nur das Licht.`;action=button("reset","Mit gleichem Anfang noch einmal",'class="single-primary"');}
    if(s.stage==="reset-ready") {title="Der Anfang ist wiederhergestellt.";body=`Gleiche Tiere, Pflanzen, Wasserwerte und Tageszeit. Sauerstoff: ${number(s.tank.params.oxygen)} mg/L. Jetzt ändern wir nur das Licht.`;action=button("darken","Lampe ausschalten",'class="single-primary"');}
    if(s.stage==="dark-ready") {title="Beobachte jetzt ohne Licht.";body="Die Lampe bleibt ausgeschaltet. Wir beobachten wieder 3 Tage ab demselben Anfang.";action=button("play","Entwicklung ohne Licht ansehen",'class="single-primary"');}
    if(s.stage==="compare") {title="Vergleiche jeden Endwert mit seinem Anfang.";action=table()+questionOptions(singleObservationChoices(s),"observation")+button("curves","Verläufe ansehen");}
    if(s.stage==="explain") {title="Welche Erklärung passt zu den Verläufen?";action=questionOptions([{id:"processes",text:"Ohne Licht fehlt die Bildung durch Licht. Verbrauch läuft weiter; Luft kann Sauerstoff liefern."},{id:"no-respiration",text:"Ohne Licht hören Pflanzen und Tiere auf, Sauerstoff zu verbrauchen."},{id:"net-proof",text:"Ein steigender Wert beweist, dass die Pflanzen im Dunkeln Sauerstoff bilden."}],"explanation")+button("curves","Beobachtungen ansehen");}
    if(s.stage==="complete") {title="Du hast beide Verläufe erklärt.";body="Der Gesamtwert entsteht aus mehreren Vorgängen: Bildung bei Licht, weiterlaufendem Verbrauch und Austausch mit der Luft. Ein Anstieg allein zeigt nicht die Sauerstoffbildung der Pflanze.";action=button("export","Ergebnis speichern",'class="single-primary"')+button("repeat","Noch einmal untersuchen");}
    if(s.stage==="failed") {title="Dieser Durchgang ist beendet.";body="Im Aquarium sind kritische Bedingungen entstanden. Es werden keine weiteren Messwerte erzeugt. Dein bisheriger Verlauf bleibt gespeichert.";action=button("export","Bisherigen Stand speichern",'class="single-primary"')+button("repeat","Mit neuem Durchgang beginnen");}
    return `<section class="single-task" data-persistent-hud data-single-stage="${s.stage}" aria-label="Aktuelle Aufgabe"><small>Dein Auftrag</small><h2 tabindex="-1">${title}</h2>${body?`<p>${body}</p>`:""}${action}<footer>${button("help","Tipp")}${["explain","complete"].includes(s.stage)?button("process","An der Pflanze erklären"):""}</footer>${feedback?`<p class="single-feedback" data-kind="${feedbackKind}" role="status">${({error:"✕",success:"✓",neutral:"•"})[feedbackKind]} ${esc(feedback)}</p>`:""}</section>`;
  }
  function home() {
    return `<main class="single-home"><p>Ökosystem-Werkstatt · Klassen 8–10</p><h1>Biologie im Aquarium</h1><p>Eine Frage. Dein Aquarium. Deine Beobachtung.</p>${[8,9,10].map(grade=>`<section><h2>Klasse ${grade}</h2><div class="single-missions">${SINGLE_MISSIONS.filter(m=>m.grade===grade).map(m=>`<article><h3>${esc(m.title)}</h3>${m.ready?button("start",session||readSaved()?"M1 fortsetzen":"M1 beginnen",`class="single-primary" data-single-mission="${m.id}"`):"<p>In Vorbereitung</p>"}</article>`).join("")}</div></section>`).join("")}<nav><a href="?expert=1">Freies Spiel & Tutorial</a>${button("teacher","Lehrkraft und frühere Ergebnisse")}</nav></main>`;
  }
  function modal() {
    let title="",body="";
    if(dialog==="menu") {title="Menü";body=button("home","Zur Missionsauswahl")+button("export","Stand als Datei speichern")+button("load","Sicherung öffnen")+button("display","Darstellung")+button("teacher","Lehrkraft und frühere Ergebnisse")+`<a href="?expert=1">Freies Spiel & Tutorial</a>`;if(session.stage==="complete")body+=`<label>Deine eigene kurze Erklärung (freiwillig)<textarea data-single-note maxlength="20000">${esc(session.ownText)}</textarea></label>`;}
    if(dialog==="help") {title="Tipp zu deiner Aufgabe";const n=session.hintLevel||0;body=`<p>${n===0?(session.stage==="plant"?"Suche die grünen Pflanzen im Aquarium. Die Schaltfläche wählt dieselbe Wasserpest aus.":session.stage==="reset-ready"?"Die Lampe sitzt über dem Aquarium. Du kannst sie dort oder mit der Schaltfläche ausschalten.":"Schau auf den Sauerstoffwert. Vergleiche den Anfang mit dem Ende desselben Durchgangs."):n===1?"Ein Wert kann steigen oder fallen. Prüfe erst die gespeicherten Zahlen; sie zeigen die gesamte Veränderung.":"Denke getrennt an Bildung bei Licht, Verbrauch durch Lebewesen und Austausch mit der Luft."}</p>${n<2?button("more-help","Weiterer Tipp"):""}`;}
    if(dialog==="curves") {title="Deine gespeicherten Beobachtungen";body=table()+chart()+"<p>Beide Durchgänge begannen vollständig gleich, zur selben Tageszeit. Geändert wurde nur die Beleuchtung. Die gespeicherten Daten laufen nicht weiter.</p>";}
    if(dialog==="process") {title="An deiner Wasserpflanze";body=`<p>${esc(host.types[session.tank.entities.find(e=>e.uid===session.selection)?.species]?.name || "Deine Pflanze")}</p><div class="single-process" data-selected-plant="${session.selection}"><p>☀ Licht → Pflanze → Sauerstoff im Wasser</p><p>Pflanzen, Tiere und kleine Lebewesen verbrauchen Sauerstoff – auch ohne Licht.</p><p>Luft ↔ Wasser: Sauerstoff kann hinzukommen oder abgegeben werden.</p></div><p>Das erklärt Vorgänge. Der gemessene Gesamtwert allein zeigt nicht jeden einzelnen Anteil.</p>`;}
    if(dialog==="display") {title="Darstellung";body=host.profiles.map(p=>button("profile",esc(p.label||p.name||p.id),`data-profile="${p.id}" aria-pressed="${host.graphics().id===p.id}"`)).join("");}
    if(dialog==="recovery") {title="Deinen Stand erhalten";body="<p>Die vorhandene Sicherung wird nicht überschrieben.</p>"+button("raw-export","Gespeicherte Sicherung herunterladen")+button("load","Andere Sicherung öffnen");}
    if(dialog==="teacher") {
      title="Lehrkraft und Archiv";const keys=oldKeys();
      body=`<p>M1 ist der neue Prototyp. M2–M6 folgen nach Sichtabnahme. Frühere Abschlüsse bleiben historische Belege; sie zählen nicht als neuer M1-Abschluss.</p><a href="./docs/single-aquarium/MISSIONS.md" target="_blank" rel="noopener">Missionszuordnung und Unterrichtsergänzungen</a><p>Ein-Merkmals-Genetik, Wald, Fossilien und Meeresmüll bleiben im bisherigen Material erhalten. Die sechs Missionen ersetzen nicht das gesamte Fachcurriculum.</p><details><summary>Frühere lokale Stände (${keys.length})</summary>${keys.map((key,i)=>`<p>${esc(LEGACY_MISSION_TARGETS[key.split(":").at(-1)] || key)} ${button("archive-file","Unverändert als Datei sichern",`data-key-index="${i}"`)}</p>`).join("")}</details>${importedLegacy?`<p>Geöffnetes historisches Produkt: ${esc(importedLegacy.profile?.mission || importedLegacy.type || "früherer Stand")}. Die Daten werden nicht als neuer Versuch übernommen.</p>`:""}<a href="?expert=1">Bestehende Expertenwerkzeuge öffnen</a>${button("load","Datei ansehen oder M1-Sicherung öffnen")}`;
    }
    return `<div class="single-shade"><section class="single-dialog" role="dialog" aria-modal="true" aria-label="${title}"><header><h2 tabindex="-1">${title}</h2>${button("close","Schließen")}</header>${body}</section></div>`;
  }
  function render() {
    document.documentElement.classList.add("learning-mode","single-aquarium");
    document.documentElement.classList.toggle("learning-home",!active);
    const content=active?`<header class="single-brand" data-persistent-hud><small>Klasse 8 · Licht und Sauerstoff</small><span>Was machen Pflanzen im Dunkeln?</span></header><div class="single-menu" data-persistent-hud>${button("menu","Menü",'aria-haspopup="dialog"')}</div>${task()}${["light-ready","light-observing","light-finished","reset-ready","dark-ready","dark-observing"].includes(session.stage)?`<aside class="single-meter" data-persistent-hud data-state-id="${singleContext(session).stateId}" data-time="${session.tank.day}"><small>Sauerstoff</small><strong data-single-oxygen>${number(session.tank.params.oxygen)} <span>mg/L</span></strong><span>${session.tank.hours===0?"Lampe aus":"Tagesrhythmus · 8 h Licht"}</span>${currentSingleRun(session)?.status==="running"?`<span data-single-clock>${number(session.tank.day-currentSingleRun(session).startSnapshot.day)} von 3 Tagen · ${timer?"läuft":"angehalten"}</span>`:""}</aside>`:""}`:home();
    root.innerHTML=`<div class="single-surface" ${dialog?"inert":""}>${content}</div>${dialog?modal():""}${storageError?`<aside class="single-storage" role="alert">${esc(storageError)} ${button("export","Stand als Datei speichern")}${button("retry-save","Erneut speichern")}</aside>`:""}${assetErrors.length?`<p class="single-asset-error" role="status">Ein Modell konnte nicht geladen werden. Deine Werte bleiben erhalten.</p>`:""}<input data-single-file type="file" accept="application/json,.json" hidden>`;
    host.sceneInert(!active||!!dialog);host.interactive(active&&!dialog);host.layout(false);
  }
  function openDialog(name,from) {pause();dialog=name;opener=from?.dataset.single||"menu";render();root.querySelector('.single-dialog h2')?.focus();}
  root.addEventListener("click",event=>{
    const b=event.target.closest("[data-single]");if(!b)return;
    event.stopPropagation();
    const a=b.dataset.single;
    try {
      if(a==="start"){start();return;}
      if(["menu","help","teacher","display","curves","process"].includes(a)){openDialog(a,b);return;}
      if(a==="close"){dialog=null;render();root.querySelector(`[data-single="${opener}"]`)?.focus();return;}
      if(a==="home"){pause();save();active=false;dialog=null;render();return;}
      if(a==="plant"){const p=session.tank.entities.find(e=>e.species==="waterweed"&&!e.dead);if(p)choosePlant(p.uid);return;}
      if(a==="prediction"){if(predictSingle(session,Number(b.dataset.choice))){feedback="Deine Vermutung ist gespeichert. Prüfen wir sie an den Beobachtungen.";feedbackKind="neutral";}save();render();return;}
      if(a==="play"){play();return;}
      if(a==="pause"){pause();save();render();return;}
      if(a==="reset"){pause();if(resetSingleForDark(session)){bindTank();feedback="Der vollständige gleiche Anfang ist wieder da.";feedbackKind="neutral";}save();render();return;}
      if(a==="darken"){if(darkenSingle(session)){feedback="Nur das Licht wurde geändert.";feedbackKind="neutral";}save();render();return;}
      if(a==="answer") {const correct=answerSingle(session,b.dataset.singleChoice);feedbackKind=correct?"success":"error";feedback=correct?"Dein Beleg ist gespeichert.":session.stage==="compare"?"Prüfe Anfang und Ende jedes Durchgangs noch einmal.":"Trenne die Bildung bei Licht vom gesamten Sauerstoffwert. Denke auch an Verbrauch und Luft.";save();render();return;}
      if(a==="more-help"){session.hintLevel=Math.min(2,(session.hintLevel||0)+1);save();render();return;}
      if(a==="export"){if(session)download(serializeSingle(session));return;}
      if(a==="retry-save"){save();render();return;}
      if(a==="raw-export"){download(localStorage.getItem(SINGLE_STORAGE),"Aquarium-vorhandene-Sicherung.json");return;}
      if(a==="repeat"){pause();if(archiveCurrent()){session=createSingleM1(host);bindTank();feedback="Ein neuer Durchgang beginnt. Dein vorheriges Ergebnis liegt im Archiv.";feedbackKind="neutral";save();}render();return;}
      if(a==="profile"){host.setGraphics(b.dataset.profile);render();return;}
      if(a==="archive-file"){const key=oldKeys()[Number(b.dataset.keyIndex)];if(key)download(localStorage.getItem(key),"Aquarium-historischer-Stand.json");return;}
      if(a==="load"){pause();root.querySelector('[data-single-file]').click();return;}
    } catch(error){pause();feedback=error.message;feedbackKind="error";render();}
  });
  root.addEventListener("input",e=>{if(e.target.matches('[data-single-note]')&&session){session.ownText=e.target.value;session.ownTextOrigin=session.ownText?"own-input":"absent";save();}});
  root.addEventListener("change",async e=>{
    if(!e.target.matches('[data-single-file]')||!e.target.files[0])return;
    try {
      const file=e.target.files[0];if(file.size>10000000)throw new Error("Die Datei ist zu groß.");
      const raw=decodeSingle(await file.text());
      if(raw.type!=="aquarium-single-investigation"){importedLegacy=raw;openDialog("teacher");return;}
      const next=validateSingle(raw,host);if(!archiveCurrent()){render();return;}
      session=next;active=true;dialog=null;bindTank();save();feedback="Dein Stand ist geladen. Die Entwicklung bleibt angehalten.";feedbackKind="neutral";render();
    }catch(error){storageError="Öffnen fehlgeschlagen: "+error.message;render();}
  });
  document.addEventListener("keydown",e=>{
    if(!dialog)return;
    if(e.key==="Escape"){e.preventDefault();e.stopImmediatePropagation();dialog=null;render();root.querySelector(`[data-single="${opener}"]`)?.focus();}
    if(e.key==="Tab") {
      const list=[...root.querySelectorAll('.single-dialog button,.single-dialog a,.single-dialog input,.single-dialog textarea,.single-dialog summary')].filter(x=>!x.disabled&&x.getClientRects().length);
      const first=list[0],last=list.at(-1);
      if((e.shiftKey&&document.activeElement===first)||(!e.shiftKey&&document.activeElement===last)){e.preventDefault();(e.shiftKey?last:first)?.focus();}
    }
  },true);
  document.addEventListener("visibilitychange",()=>{if(document.hidden&&session){pause();save();render();}});
  window.addEventListener("beforeunload",()=>{pause();save();});
  document.querySelector('#scene')?.addEventListener('assetfailed',e=>{assetErrors.push(e.detail);render();});
  host.pause();render();
  return {active:()=>active,blocksScene:()=>!active||!!dialog,select:choosePlant,
    deviceContext:()=>({visible:active&&!dialog&&session.stage==="reset-ready",tools:["light"],focus:"light"}),
    openDevice:key=>{if(key==="light"&&active&&!dialog&&session.stage==="reset-ready"){darkenSingle(session);save();render();}},
    deviceView:()=>null,deviceState:()=>null,tweezersChanged:()=>{},refresh:()=>{},
    snapshot:()=>({screen:active?"single-active":"single-home",profile:active?session.tank.learning:null,
      session:session?serializeSingle(session):null,context:session?singleContext(session):null,running:!!timer,dialog,storageError,assetErrors,
      renderer:active&&host.comparisonRenderer()?{mainStateId:stateId(host.comparisonRenderer().state),sameState:host.comparisonRenderer().state===host.getState(),objects:[...host.comparisonRenderer().objects.keys()],stats:host.comparisonRenderer().getStats()}:null})};
}
