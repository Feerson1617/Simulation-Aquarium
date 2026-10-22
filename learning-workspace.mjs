import {resolveComparisonView, stateId} from "./learning-context.mjs";
import {applyLearningIntervention, learningSample, LEARNING_TOOLS, waterIndicators} from "./learning-model.mjs";

/** Approved aquarium comparison. Plans and archived results never share a state. */
export const AQUARIUM_WORKSPACES = {
  "8-ecosystem": ["Was verändert der Heizstab?", "temp", "Wassertemperatur", "°C"],
  "8-oxygen": ["Was verändert das Licht?", "oxygen", "Sauerstoff", "mg/L"],
  "8-foodweb": ["Was geschieht mit Futterresten?", "organic", "Reste", ""],
  "8-health": ["Was hilft den Fischen?", "fishAlive", "Lebende Fische", ""],
  "8-forest": ["Was brauchen Pflanzen?", "plantBiomass", "Pflanzenmasse", "relativ zum Anfang"],
  "10-enrichment": ["Was bewirken zusätzliche Nährstoffe?", "algae", "Algenmenge", "Modellwert"],
  "10-carbon": ["Wohin gelangt Kohlenstoff?", "co2", "Kohlenstoffdioxid", "mg/L"],
  "10-restore": ["Hilft die Maßnahme dauerhaft?", "fishAlive", "Lebende Fische", ""],
  "10-northsea": ["Was bewirken Nährstoffe im Becken?", "algae", "Algenmenge", "Modellwert"],
};
export function aquariumWorkspaceProfile(tag, session) {
  return AQUARIUM_WORKSPACES[tag.mission] || ["Dein eigener Beckenvergleich", "oxygen", "Sauerstoff", "mg/L"];
}
export function temperatureView(session, host, revision) {
  const result = session.view?.mode !== "plan" && resolveComparisonView(session);
  if (result) return {...result, mode:"result"};
  const control = structuredClone(session.baseline), tool = session.study.tool || "temperature", value = session.study.value ?? LEARNING_TOOLS[tool].value;
  const test = applyLearningIntervention(control, tool, Number.isFinite(value) ? value : LEARNING_TOOLS[tool].value, host);
  return {mode:"plan",context:{version:1,investigationId:session.planId,attemptId:session.attemptId,
    revision,seriesId:session.planId,series:null,run:0,repetition:1,time:control.day,axis:"day",side:"both",
    stateIds:{control:stateId(control),test:stateId(test)}},
    sides:Object.fromEntries([["control",control],["test",test]].map(([side,state])=>[side,
      {state,stateId:stateId(state),sample:learningSample(state,host.types),availability:"state"}]))};
}
export function temperatureRunLabel(days) {
  return Number.isInteger(days) && days>=1 && days<=14 ? `${days} ${days===1 ? "Spieltag" : "Spieltage"} gemeinsam beobachten` : "Beobachtung starten";
}
const n = (v,d=1) => Number.isFinite(v) ? v.toLocaleString("de-DE",{maximumFractionDigits:d,minimumFractionDigits:d}) : "—";
export function temperatureWorkspace({session, view, quest, esc, button, helpButton, types, results, panelBody, playing, tag = {grade:8,mission:"8-ecosystem"}, form = "", process = ""}) {
  const result = view.mode === "result", selected = session.prototypeSelection;
  const [title,metric,metricLabel,unit] = aquariumWorkspaceProfile(tag,session), temp = metric === "temp";
  const tool = result ? view.comparison.tool : session.study.tool;
  const toolLabel = ({temperature:"Heizer",light:"Licht",filter:"Filter",water:"Wasserwechsel",feed:"Futter",nutrients:"Nährstoffe",co2:"CO₂-Zufuhr",plants:"Zusätzliche Pflanzen"})[tool];
  const setting = state => tool === "temperature" ? `${n(state?.setTemp)} °C` : tool === "light" ? `${n(state?.hours,0)} Stunden täglich` : tool === "filter" ? `${n(state?.flow,0)} % Durchfluss` : null;
  const startBiomass=(view.run?.control[0] || learningSample(session.baseline,types)).plantBiomass;
  const reading = data => metric === "plantBiomass" ? (startBiomass > 0 ? n(data.sample?.plantBiomass / startBiomass,2) : "kein Anfangsbestand") : n(data.sample?.[metric],metric === "fishAlive" ? 0 : temp ? 1 : 2);
  const card = (side, index) => {
    const data = view.sides[side], s = data.state, sample = data.sample;
    const label = `Becken ${index+1}`, heater = s?.setTemp;
    const fish = s?.entities.find(e=>!e.dead && types[e.species]?.category === "fish");
    const risks=s && metric === "fishAlive" ? waterIndicators(s).paths.filter(p=>p.level).map(p=>({organic:"Viele organische Reste",nitrite:"Schädliche Stoffe im Wasser",ammonia:"Schädliche Stoffe im Wasser",oxygen:"Zu wenig Sauerstoff"})[p.key]) : [];
    return `<article class="coherent-tank ${side}" aria-current="${view.context.side === side}" data-view-side="${side}" data-state-id="${data.stateId || "unknown"}" data-view-time="${view.context.time}">
      <header><span class="coherent-side">${index+1}</span><div><h2>${label}${view.context.side === side ? ' <small>ausgewählt</small>' : ""}</h2><p>${setting(s) ? `${esc(toolLabel)} ${side === "control" ? "bleibt" : "steht"} ${tool === "temperature" ? "auf " : ""}<b>${setting(s)}</b>` : side === "control" ? "Ohne deinen Eingriff" : `${esc(toolLabel)} · ${result ? "ausgeführter" : "geplanter"} Eingriff`}</p></div></header>
      <div class="coherent-tank-window" data-tank-viewport="${side}" role="group" aria-label="${label}: ${data.state ? "3D-Ansicht" : "Messwertansicht"}">
        ${!s ? `<p class="coherent-unavailable">${data.availability === "ended" ? "Dieses Becken konnte hier nicht mehr weiterlaufen. Keine weitere Szene oder Messung vorhanden." : "Für diesen früheren Zeitpunkt sind nur Messwerte gespeichert. Ein damaliges Beckenbild fehlt."}</p>` : ""}
      </div><div class="coherent-instrument"><small>${metricLabel}</small><strong data-water-reading="${side}">${reading(data)} <span>${unit}</span></strong>${sample ? `<small>${sample.fishAlive ?? "—"} lebende Fische${metric === "fishAlive" ? ` · ${sample.fishDead ?? 0} gestorben · ${sample.health == null ? "keine lebenden Fische" : `Zustand ${n(sample.health,0)} / 100`}` : ""}</small>${risks.length ? `<small role="status">⚠ ${[...new Set(risks)].join(" · ")}</small>` : ""}` : "<small>Keine Folgemessung</small>"}</div>
      <footer>${!result && index === 1 && ["temperature","light","filter"].includes(tool) ? button("device-"+tool,({temperature:"Heizstab in Becken 2 einstellen",light:"Licht in Becken 2 einstellen",filter:"Filter in Becken 2 einstellen"})[tool], 'class="coherent-primary"') : `<span>${result ? "Gespeicherter Zustand" : "Gleicher Besatz · gleiche Wasserwerte"}</span>`}
      ${fish && !result ? `<div class="coherent-object-tools"><button data-coherent-pick="${side}" data-coherent-uid="${fish.uid}" disabled>Fisch zeigen</button><button data-coherent-water="${side}" disabled>Wasser ansehen</button></div>` : ""}</footer></article>`;
  };
  const picked = selected && view.sides[selected.side].state?.entities.find(e=>e.uid === selected.uid);
  const inspector = selected?.water ? `Du betrachtest das Wasser in Becken ${selected.side === "control" ? 1 : 2}. Die Temperatur ist eine Umweltbedingung.` : picked ?
    `Du betrachtest ${esc(types[picked.species]?.name || "ein Lebewesen")}, Nr. ${picked.uid}, in Becken ${selected.side === "control" ? 1 : 2}.` : "Tippe auf einen Fisch. Mit „Wasser ansehen“ wählst du seine Umgebung.";
  return `<header class="coherent-header"><div><small>Klasse ${tag.grade} · ${tag.mode === "free" ? "Freies Forschen" : "Ein Lebensraum im Vergleich"}</small><h1>${esc(title)}</h1></div><div>${tag.mode === "free" ? button("research-own","Eigenes Becken") : ""}${button("more","Mehr")}</div></header>
    <main class="coherent-workspace" data-workspace-mode="${view.mode}" data-investigation-id="${view.context.investigationId || "legacy"}" data-attempt-id="${view.context.attemptId || "unknown"}">
      <section class="coherent-views"><div class="coherent-clock"><strong>${result ? "Gemeinsame Versuchsuhr" : "Ausgangssituation"}</strong><span>Tag ${n(view.context.time,2)}${result ? ` · Wiederholung ${view.context.repetition}` : " · noch keine Zeit vergangen"}</span>${helpButton("control")}</div>
        <div class="coherent-tanks">${card("control",0)}${card("test",1)}</div>
        <p class="coherent-inspector" role="status">${result ? "Wähle einen Zeitpunkt. Beide Beckenbilder und Messkarten wechseln zusammen." : inspector}</p>
        <p data-workspace-render-status role="status"></p>${process}
        ${tag.mission === "8-oxygen" ? `<details class="coherent-data"><summary>Wege des Sauerstoffs</summary><p>Licht → Pflanzen: Sauerstoffbildung. Tiere und Pflanzen → Atmung: Sauerstoffverbrauch. Luft ↔ Wasser: Gasaustausch.</p><p>Auch im Dunkeln kann der Messwert steigen, wenn genug Sauerstoff aus der Luft ins Wasser gelangt.</p></details>` : ""}${result ? `<div class="coherent-timeline"><label>Zeitpunkt<select data-coherent-time>${view.rows.map(r=>`<option value="${r.time}" ${r.time===view.context.time ? "selected" : ""}>Tag ${n(r.time,2)}</option>`).join("")}</select></label>${button(playing ? "workspace-pause" : "workspace-play",playing ? "Anhalten" : "Verlauf abspielen")}${button("workspace-plan","Neuen Versuch planen")}</div><details class="coherent-data"><summary>Verlauf und Werte ansehen</summary>${results}</details>` :
          `<div class="coherent-run"><p>${temp ? "Nur der Heizstab in Becken 2 wird verändert." : "Dein Eingriff betrifft nur Becken 2."} Beide Becken entwickeln sich weiter.</p>${!temp ? form : ""}${!session.quest || session.quest.step >= 2 ? `${button("compare",temperatureRunLabel(session.study.days),'class="coherent-primary"')}<details><summary>Versuchseinstellungen</summary><label>Spieltage<input type="number" data-learning-days min="1" max="14" value="${session.study.days}"></label><label>Wiederholungen<input type="number" data-learning-repetitions min="1" max="4" value="${session.study.repetitions}"></label></details>` : ""}</div>`}
      </section><aside class="coherent-notebook" aria-label="Untersuchungsauftrag">${quest || `<section class="coherent-note"><h2>Was möchtest du herausfinden?</h2><p>Wähle einen Eingriff für Becken 2. Du brauchst keine Aufgaben oder Texte auszufüllen.</p>${button("baseline","Eigenes Becken als neuen Anfang nehmen")}${button("notebook","Notizen und Ergebnisse")}</section>`}${panelBody || ""}</aside>
    </main>`;
}
