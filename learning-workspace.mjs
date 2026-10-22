import {resolveComparisonView, stateId} from "./learning-context.mjs";
import {applyLearningIntervention, learningSample} from "./learning-model.mjs";

/** The temperature prototype only; other workspaces await the explicit visual gate. */
export function temperatureView(session, host, revision) {
  const result = session.view?.mode !== "plan" && resolveComparisonView(session);
  if (result) return {...result, mode:"result"};
  const control = structuredClone(session.baseline), value = session.study.value ?? control.setTemp;
  const test = applyLearningIntervention(control, "temperature", value, host);
  return {mode:"plan",context:{version:1,investigationId:session.planId,attemptId:session.attemptId,
    revision,seriesId:session.planId,series:null,run:0,repetition:1,time:control.day,axis:"day",side:"both"},
    sides:Object.fromEntries([["control",control],["test",test]].map(([side,state])=>[side,
      {state,stateId:stateId(state),sample:learningSample(state,host.types),availability:"state"}]))};
}
const n = (v,d=1) => Number.isFinite(v) ? v.toLocaleString("de-DE",{maximumFractionDigits:d,minimumFractionDigits:d}) : "—";
export function temperatureWorkspace({session, view, quest, esc, button, helpButton, types, results, panelBody, playing}) {
  const result = view.mode === "result", selected = session.prototypeSelection;
  const card = (side, index) => {
    const data = view.sides[side], s = data.state, sample = data.sample;
    const label = `Becken ${index+1}`, heater = s?.setTemp;
    const fish = s?.entities.find(e=>!e.dead && types[e.species]?.category === "fish");
    return `<article class="coherent-tank ${side}" data-view-side="${side}" data-state-id="${data.stateId || "unknown"}" data-view-time="${view.context.time}">
      <header><span class="coherent-side">${index+1}</span><div><h2>${label}</h2><p>Heizer ${side === "control" ? "bleibt" : "steht"} auf <b>${n(heater)} °C</b></p></div></header>
      <div class="coherent-tank-window" data-tank-viewport="${side}" role="group" aria-label="${label}: ${data.state ? "3D-Ansicht" : "Messwertansicht"}">
        ${!s ? `<p class="coherent-unavailable">${data.availability === "ended" ? "Dieses Becken konnte hier nicht mehr weiterlaufen. Keine weitere Szene oder Messung vorhanden." : "Für diesen früheren Zeitpunkt sind nur Messwerte gespeichert. Ein damaliges Beckenbild fehlt."}</p>` : ""}
      </div><div class="coherent-instrument"><small>Wassertemperatur</small><strong data-water-reading="${side}">${n(sample?.temp)} <span>°C</span></strong>${sample ? `<small>${sample.fishAlive ?? "—"} lebende Fische</small>` : "<small>Keine Folgemessung</small>"}</div>
      <footer>${!result && index === 1 ? button("device-temperature","Heizstab in Becken 2 einstellen", 'class="coherent-primary"') : `<span>${result ? "Gespeicherter Zustand" : "Gleicher Besatz · gleiche Wasserwerte"}</span>`}
      ${fish && !result ? `<div class="coherent-object-tools"><button data-coherent-pick="${side}" data-coherent-uid="${fish.uid}">Fisch zeigen</button><button data-coherent-water="${side}">Wasser ansehen</button></div>` : ""}</footer></article>`;
  };
  const picked = selected && view.sides[selected.side].state?.entities.find(e=>e.uid === selected.uid);
  const inspector = selected?.water ? `Du betrachtest das Wasser in Becken ${selected.side === "control" ? 1 : 2}. Die Temperatur ist eine Umweltbedingung.` : picked ?
    `Du betrachtest ${esc(types[picked.species]?.name || "ein Lebewesen")}, Nr. ${picked.uid}, in Becken ${selected.side === "control" ? 1 : 2}.` : "Tippe auf einen Fisch. Mit „Wasser ansehen“ wählst du seine Umgebung.";
  return `<header class="coherent-header"><div><small>Klasse 8 · Ein Lebensraum im Vergleich</small><h1>Was verändert der Heizstab?</h1></div>${button("more","Mehr")}</header>
    <main class="coherent-workspace" data-workspace-mode="${view.mode}" data-investigation-id="${view.context.investigationId || "legacy"}" data-attempt-id="${view.context.attemptId || "unknown"}">
      <section class="coherent-views"><div class="coherent-clock"><strong>${result ? "Gemeinsame Versuchsuhr" : "Ausgangssituation"}</strong><span>Tag ${n(view.context.time,2)}${result ? ` · Wiederholung ${view.context.repetition}` : " · noch keine Zeit vergangen"}</span>${helpButton("control")}</div>
        <div class="coherent-tanks">${card("control",0)}${card("test",1)}</div>
        <p class="coherent-inspector" role="status">${result ? "Wähle einen Zeitpunkt. Beide Beckenbilder und Messkarten wechseln zusammen." : inspector}</p>
        <p data-workspace-render-status role="status"></p>
        ${result ? `<div class="coherent-timeline"><label>Zeitpunkt<select data-coherent-time>${view.rows.map(r=>`<option value="${r.time}" ${r.time===view.context.time ? "selected" : ""}>Tag ${n(r.time,2)}</option>`).join("")}</select></label>${button(playing ? "workspace-pause" : "workspace-play",playing ? "Anhalten" : "Verlauf abspielen")}${button("workspace-plan","Neuen Versuch planen")}</div><details class="coherent-data"><summary>Verlauf und Werte ansehen</summary>${results}</details>` :
          `<div class="coherent-run"><p>Nur der Heizstab in Becken 2 wird verändert. Beide Becken entwickeln sich weiter.</p>${session.quest.step >= 2 ? `${button("compare","3 Spieltage gemeinsam beobachten",'class="coherent-primary"')}<details><summary>Versuchseinstellungen</summary><label>Spieltage<input type="number" data-learning-days min="1" max="14" value="${session.study.days}"></label><label>Wiederholungen<input type="number" data-learning-repetitions min="1" max="4" value="${session.study.repetitions}"></label></details>` : ""}</div>`}
      </section><aside class="coherent-notebook" aria-label="Untersuchungsauftrag">${quest}${panelBody || ""}</aside>
    </main>`;
}
