import {pendingActivity,REGIONAL_CASES,OBSERVATION_METRICS,choiceOrder,questHint} from "./learning-activities.mjs";
import {populationExplanation} from "./biology-quality.mjs";
/** The regular learner surface. Technical evidence views remain in learning-ui. */
import {
  QUESTS,
  STEP_NAMES,
  predictionChoices,
  predictionPrompt,
  resultQuestion,
  questConclusion,
} from "./learning-quests.mjs";
import { HELP } from "./learning-content.mjs";
import { populationCounts } from "./learning-population.mjs";
import { genotypeText } from "./fish-variants.mjs";
export const STUDENT_METRICS = {
  temp: ["Temperatur", "°C"],
  oxygen: ["Sauerstoff", "mg/L"],
  no3: ["Nitrat", "mg/L"],
  no2: ["Nitrit", "mg/L"],
  co2: ["Kohlenstoffdioxid", "mg/L"],
  algae: ["Algenmenge", ""],
  organic: ["Reste", ""],
  plantBiomass: ["Pflanzenmenge", ""],
  health: ["Lebende Fische: Zustand", "Punkte"],
  fishAlive: ["Lebende Fische", "Anzahl"],
  fishDead: ["Verstorbene Fische", "Anzahl"],
  fishOutcome: ["Fische: Überleben und Zustand", "Punkte"],
  otherAnimals: ["Andere Tiere", "Anzahl"],
  individuals: ["Tiere", "Anzahl"],
  loadLevel: ["Probleme im Wasser", "Stufe"],
  photosynthesis: ["Sauerstoff durch Licht", ""],
  respiration: ["Sauerstoffverbrauch", ""],
  dark: ["Dunkle Fische", "Anteil"],
  light: ["Helle Fische", "Anteil"],
  A: ["Genvariante A", "Anteil"],
  a: ["Genvariante a", "Anteil"],
  AA: ["AA", "Anzahl"],
  Aa: ["Aa", "Anzahl"],
  aa: ["aa", "Anzahl"],
  n: ["Fische", "Anzahl"],
};
export const STUDENT_TOOLS = {
  light: [
    "Licht",
    "Stunden pro Tag",
    "Wie lange soll das Licht jeden Tag an sein?",
  ],
  feed: [
    "Futter",
    "Portionen pro Tag",
    "Wie viel Futter sollen die Tiere bekommen?",
  ],
  water: [
    "Frisches Wasser",
    "%",
    "Wie viel Wasser möchtest du einmal austauschen?",
  ],
  plants: [
    "Pflanzen",
    "Stück",
    "Wie viele Wasserpest-Pflanzen möchtest du ergänzen?",
  ],
  temperature: ["Heizer", "°C", "Welche Temperatur stellst du ein?"],
  filter: ["Filter", "% Durchfluss", "Wie stark soll der vorhandene Filter das Wasser bewegen?"],
  nutrients: [
    "Nährstoffe",
    "Stufe",
    "Wie viel Nährstoff möchtest du dazugeben?",
  ],
  co2: ["Kohlenstoffdioxid", "Stufe", "Wie stark soll die Zufuhr sein?"],
};
export function createStudentViews(api) {
  const { esc, num, button, helpButton, panelHeader, options } = api;
  const state = () => api.state();
  function quest(inline = false) {
    const { session, tag, panel } = state(),
      s = session.quest,
      observedResult = api.questionResult ? api.questionResult() : s?.result,
      d = QUESTS[tag.mission];
    if (!d) return "";
    const done = s.step === 5, legacy = s.version === 1 || (state().temperaturePrototype && s.visualEvidenceVersion !== 1) || (state().regionalWorkspace && s.visualCaseVersion !== 1), activity = done ? null : pendingActivity(s);
    if (!inline && panel) return "";
    if (!inline && (s.collapsed || panel))
      return `<aside class="learn-quest-chip">${button("quest-toggle", done ? "Quest fertig ✓" : `Questbuch · ${s.step + 1} von 5`, 'aria-expanded="false"')}</aside>`;
    let body = "";
    if (done)
      body = `<h2 tabindex="-1">${legacy ? "Früherer Abschluss" : "Geschafft!"}</h2>${legacy ? "<p>Dein früherer Stand bleibt erhalten. Neue Lernhandlungen beginnst du mit „Noch einmal“.</p>" : ""}<p>${esc(questConclusion(d, s.result).feedback)}</p>${button("notebook", "Meine Ergebnisse")}${button("quest-restart", "Noch einmal")}`;
    else {
      const step = s.step,
        q =
          step === 0
            ? d.observe
            : step === 1
              ? { prompt: predictionPrompt(d), choices: predictionChoices(d) }
              : step === 3
                ? resultQuestion(d, observedResult)
                : step === 4
                  ? questConclusion(d, s.result)
                  : null;
      body = `<small>Aufgabe ${step + 1} von 5 · ${STEP_NAMES[step]}</small><h2 tabindex="-1">${esc(activity?.prompt || q?.prompt || experimentTask(d))}</h2>`;
      if (step === 0) body += button("observe", d.experiment.kind === "case" ? "Küstenfall ansehen" : state().populationWorkspace ? "Population anschauen" : "Aquarium anschauen");
      if (step === 4 && d.id === "10-northsea") body += `<p class="learn-case">${esc(REGIONAL_CASES[d.id].text)}</p>`;
      if (step === 2 && !panel && !(state().prototype && session.comparison && session.view?.mode !== "plan")) {
        const device=d.experiment.kind === "ecology" && ["temperature","light","filter"].includes(d.experiment.tool);
        body += button(device ? "device-"+d.experiment.tool : ["traits","cross","case"].includes(d.experiment.kind) ? "material" : "investigate", device ? ({temperature:"Heizstab einstellen",light:"Beleuchtung einstellen",filter:"Filter einstellen"})[d.experiment.tool] : d.experiment.kind === "traits" ? "Erbanlagen ansehen" : d.experiment.kind === "cross" ? "Eltern wählen" : "Versuch öffnen");
      }
      if (step === 3 && !state().prototype) {
        body += reading(observedResult);
        body += button(
          ["cross","traits","case"].includes(d.experiment.kind)
            ? "material"
            : "investigate",
          "Ergebnisse ansehen",
        );
      }
      if (activity) body += activityControl(activity);
      if (q && !activity)
        body += `<div class="learn-quest-answers">${choiceOrder(s,"phase-"+s.step,q.choices.length).map(i => `<button data-quest-answer="${i}">${esc(q.choices[i])}</button>`).join("")}</div>`;
    }
    if (!done && s.step === 3 && state().populationWorkspace && !observedResult) body=`<h2>Sieh dir die aktuelle Nachkommengeneration an.</h2>${button("cohort-latest","Zur aktuellen Generation")}`;
    if (!done && s.step === 3 && ["ecology","population"].includes(d.experiment.kind) && !observedResult)
      body = `<h2 tabindex="-1">Zu deinem aktuellen Plan fehlt hier ein vollständiger Vergleich.</h2><p>Wähle einen Zeitpunkt mit beiden Seiten. Frühere Reihen bleiben zum Ansehen erhalten.</p>${state().prototype && session.comparison && !api.matches() ? button("workspace-plan","Neuen Versuch planen") : button("latest-series","Aktuellen Versuch ansehen")}`;
    if (!done && state().help !== false) body += state().support === "guided" || s.showHint ? `<p class="learn-step-hint">${esc(questHint(d,s,state().support))}</p>` : button("quest-hint","Tipp");
    if (s.predictionCheck && s.step >= 4) body += `<details class="learn-prediction-check"><summary>Deine Vermutung prüfen</summary><p>Ausgewählt: ${esc(s.predictionCheck.selection)}</p><p>Beobachtet: ${esc(s.predictionCheck.observed)}</p><p>${s.predictionCheck.matches ? "Das passt zu deiner Vermutung." : "Die Beobachtung passt hier nicht zu deiner Vermutung. Das ist ein Anlass zum Weiterfragen."}</p></details>`;
    return `<aside class="learn-quest ${inline ? "learn-quest-inline" : ""}" aria-label="Questbuch"><header><strong>${esc(d.title)}</strong>${inline ? "" : button("quest-toggle", "−", 'aria-label="Questbuch einklappen" aria-expanded="true"')}</header><progress value="${s.step}" max="5" aria-label="Erledigte Aufgaben">${s.step} von 5</progress>${body}<p class="learn-quest-feedback" data-feedback-kind="${s.feedbackKind || "neutral"}" role="status" aria-live="polite">${esc(done ? "" : s.feedback)}</p></aside>`;
  }
  function activityControl(a) {
    if (a.kind === "view") return `<section class="learn-activity"><button data-activity-view="${a.action}">${esc(a.prompt)}</button></section>`;
    return `<section class="learn-activity"><p class="learn-card-from">${esc(a.from)} →</p><div class="learn-quest-answers">${choiceOrder(state().session.quest,a.id,a.targets.length).map(i=>`<button data-activity-id="${a.id}" data-activity-choice="${i}">${esc(a.targets[i])}</button>`).join("")}</div></section>`;
  }
  function experimentTask(d) {
    if(state().prototype && state().session.comparison && state().session.view?.mode !== "plan") return "Beobachte beide Becken. Starte den Verlauf an der gemeinsamen Versuchsuhr.";
    const e = d.experiment;
    if (e.kind === "case") return "Wähle eine Schutzmaßnahme. Prüfe die Folgen für Tiere und Menschen.";
    if (e.kind === "traits")
      return "Zeige die Erbanlagen. Vergleiche die dunklen Fische.";
    if (e.kind === "cross")
      return "Untersuche zuerst AA × aa. Kreuze danach zwei Aa-Nachkommen miteinander.";
    if (e.kind === "population")
      return "Starte zwei neutrale Wiederholungen. Vergleiche danach eine Umgebung mit Farbvorteil.";
    return ({temperature:"Erwärme das Wasser mit dem Heizstab.",light:"Stelle die Beleuchtung ein und vergleiche.",filter:"Stelle den Filter ein und vergleiche."})[e.tool] || `Ändere ${STUDENT_TOOLS[e.tool][0]}. Starte den Versuch.`;
  }
  function reading(r) {
    if (!r) return "";
    if (r.kind === "case") return `<p>Deine Maßnahme: ${esc(r.measure)}.</p><p>Vergleiche ihren Nutzen für Tiere mit dem Aufwand für Menschen.</p>`;
    if (r.kind === "traits")
      return "<p>Dunkle Fische können AA oder Aa haben.</p>";
    if (r.kind === "cross")
      return `${r.mendel?.f1 ? `<p>F1: ${r.mendel.f1.counts.n} Aa-Nachkommen.</p><p>F2: Aa × Aa, Erwartung 3:1; dein Wurf:</p>` : ""}<p>${r.n} Nachkommen: ${Math.round(r.dark * r.n)} dunkel, ${Math.round(r.light * r.n)} hell.</p>`;
    if (r.fish) return `<div class="learn-two learn-reading">${["control","test"].map((side,i)=>`<div><small>Becken ${i+1}</small><strong>${r.fish[side].fishAlive} leben</strong><span>${r.fish[side].fishDead} gestorben</span><span>${r.fish[side].health == null ? "Keine lebenden Fische" : `Zustand der lebenden Fische: ${num(r.fish[side].health,0)} Punkte`}</span></div>`).join("")}</div>`;
    const fraction = r.unit === "Anteil",
      value = (v) =>
        fraction ? num(v * 100, 1) + " %" : num(v, r.key === "temp" || r.label === "Temperatur" ? 1 : 3) + " " + esc(r.unit || "");
    return `${r.fish ? `<p>Becken 1: ${r.fish.control.fishAlive} leben, ${r.fish.control.fishDead} gestorben. Becken 2: ${r.fish.test.fishAlive} leben, ${r.fish.test.fishDead} gestorben.</p>` : ""}<div class="learn-two learn-reading"><div><small>${r.kind === "population" ? "Gruppe" : "Becken"} 1</small><strong>${value(r.control)}</strong></div><div><small>${r.kind === "population" ? "Gruppe" : "Becken"} 2</small><strong>${value(r.test)}</strong></div></div><small>${esc(r.label)} · Wiederholung ${r.repetition || 1} · ${r.kind === "population" ? "Generation" : "Tag"} ${num(r.time)}</small>`;
  }
  function observe() {
    const { session, tag, s, w, types, showGenes, unlockedMetrics } = state();
    if (tag.mission === "10-wadden") return material();
    let content = "";
    if (tag.grade === 9)
      content = `<p>Schau auf die Farbe der Fische.</p><ul>${s.entities
        .filter((e) => !e.dead && types[e.species]?.category === "fish")
        .map(
          (e) =>
            `<li>${esc(types[e.species].name)} · ${e.variant === "gold" ? "gold" : "dunkel"}</li>`,
        )
        .join("")}</ul>${button("material", "Farbe und Erbanlagen")}`;
    else {
      const sample=api.sample(),keys=OBSERVATION_METRICS[tag.mission] || ["oxygen","fishAlive"];
      content=`<dl class="learn-values">${keys.map(k=>`<div><dt>${esc(STUDENT_METRICS[k][0])}${k === "oxygen" ? helpButton("oxygen") : ""}</dt><dd>${num(sample[k],k === "fishAlive" ? 0 : 2)} ${esc(STUDENT_METRICS[k][1])}</dd></div>`).join("")}</dl><p>${api.healthText()}</p>`;
    }
    return (
      panelHeader("Beobachten", "observe") +
      content +
      (unlockedMetrics?.length
        ? `<details><summary>Weitere freigegebene Werte</summary><dl class="learn-values">${unlockedMetrics.map((k) => `<div><dt>${esc(STUDENT_METRICS[k][0])} ${["no2", "no3"].includes(k) ? helpButton("nitrogen") : ""}</dt><dd>${num(api.sample()[k], 3)} ${esc(STUDENT_METRICS[k][1])}</dd></div>`).join("")}</dl></details>`
        : "") +
      `<div class="learn-actions">${button("measure", "Werte merken")}${button("advance", "1 Tag warten")}</div><small>${session.measurements.length} Messungen gespeichert.</small>${session.measurements.length ? api.manual() : ""}${tag.mode === "free" ? `<details><summary>Becken verändern</summary>${api.form("care")}${button("apply", "Anwenden")}</details>` : ""}`
    );
  }
  function results() {
    const {session} = state(), v = api.comparisonView();
    if (!v) return "";
    const {comparison:all,run,context,rows,row:r} = v;
    const c = {...all,runs:[run]}, series = [...(session.comparisonHistory || []),session.comparison].filter(Boolean);
    const keys = c.kind === "population" ? ["dark","light","A"] : api.studentMetrics();
    const key = keys.includes(session.study.metric) ? session.study.metric : keys[0];
    const value = sample => !sample ? "keine Folgemessung" : !Number.isFinite(sample[key]) ? "—" :
      c.kind === "population" && ["dark","light","A"].includes(key) ? num(sample[key]*100,1)+" %" : num(sample[key],key === "temp" ? 1 : 3);
    const stale = context.series === series.length-1 && !api.matches();
    return `<section class="learn-results" data-selected-series="${context.series}" data-series-id="${esc(context.seriesId)}" data-view-time="${context.time}" data-repetition="${context.repetition}"><h3>Dein Vergleich</h3>
      ${series.length>1 ? `<details><summary>Versuche vergleichen</summary><label>Versuchsreihe<select data-learning-series>${options(series.map((item,i)=>[i,`${i+1}: ${item.kind === "population" ? item.environment === "neutral" ? "Keine Farbe bevorzugt" : item.environment === "dark" ? "Dunkle Farbe bevorzugt" : "Helle Farbe bevorzugt" : "Beckenversuch"}`]),context.series)}</select></label></details>` : ""}
      <p data-learning-result-state role="status" class="${stale ? "learn-outdated" : ""}">${stale ? "Der Plan wurde geändert. Diese Werte gehören zum gespeicherten Versuch." : c.kind === "population" ? "Gruppe 1: keine Farbe bevorzugt. Gruppe 2: deine Umgebung." : "Becken 1: Einstellung bleibt gleich. Becken 2: gewählter Eingriff. Beide Becken entwickeln sich weiter."}</p>
      ${all.runs.length>1 ? `<label>Verlauf<select data-learning-run>${options(all.runs.map((r,i)=>[i,`Wiederholung ${r.repetition || i+1}`]),context.run)}</select></label>` : ""}
      <label>Zeitpunkt<select data-coherent-time>${rows.map(x=>`<option value="${x.time}" ${x.time===context.time ? "selected" : ""}>${c.kind === "population" ? "Generation" : "Tag"} ${num(x.time)}</option>`).join("")}</select></label>
      <label>Was möchtest du ansehen?<select data-learning-metric>${options(keys.map(k=>[k,STUDENT_METRICS[k][0]]),key)}</select></label>
      ${c.kind === "population" ? `<p>${esc(populationExplanation(c.environment))}</p>` : ""}
      ${session.inspection && session.inspection.time === context.time ? `<p data-inspected-time>Angesehener Zeitpunkt: Tag ${num(context.time)}.</p>` : ""}
      ${r.control && r.test ? reading({kind:c.kind,label:STUDENT_METRICS[key][0],unit:STUDENT_METRICS[key][1],key,time:context.time,repetition:context.repetition,control:r.control[key],test:r.test[key]}) : `<p>Kein vollständiger Paarvergleich zu diesem Zeitpunkt. Becken 1: ${value(r.control)}. Becken 2: ${value(r.test)}.</p>`}
      ${api.plot(c,key,context)}<p class="learn-caption">Eine Linie zeigt ${c.kind === "population" ? "eine Gruppe" : "ein Becken"}. Der Zeiger markiert den gewählten Zeitpunkt.</p>
      ${Object.values(run.status || {}).some(s=>s.state === "failed") ? "<p>Ein Becken konnte nicht weiterlaufen. Seine Linie endet dort; danach fehlen seine Werte.</p>" : ""}
      <details><summary>Alle Werte</summary><div class="learn-table-wrap"><table><thead><tr><th>${c.kind === "population" ? "Generation" : "Tag"}</th><th>${c.kind === "population" ? "Gruppe" : "Becken"} 1</th><th>${c.kind === "population" ? "Gruppe" : "Becken"} 2</th></tr></thead><tbody>${rows.map(x=>`<tr data-table-time="${x.time}" ${x.time===context.time ? 'aria-current="true"' : ""}><td>${num(x.time)}</td><td>${value(x.control)}</td><td>${value(x.test)}</td></tr>`).join("")}</tbody></table></div></details>
      <div class="learn-actions">${button("export","Für die Lehrkraft speichern")}${button("csv","Gewählte Werte speichern")}${button("chart","Verlauf als Bild speichern")}${c.kind === "ecology" ? button("show-control",state().prototype ? "Becken 1 auswählen" : "Becken 1 ansehen")+button("show-test",state().prototype ? "Becken 2 auswählen" : "Becken 2 ansehen") : ""}</div></section>`;
  }
  function investigation(hideResults = false) {
    const { session, tag } = state();
    if (tag.mission === "10-wadden") return material();
    if (tag.grade === 9 && !api.tools().includes("selection"))
      return breeding();
    const population = tag.grade === 9;
    return (
      panelHeader("Ausprobieren", population ? "selection" : "control") +
      `<p>${population ? "Beide Gruppen starten gleich. " + populationExplanation(session.study.environment) : "Beide Becken starten gleich. Du änderst nur Becken 2."}</p>${tag.mode === "free" ? '<label>Deine Idee (freiwillig)<input data-learning-note="question" maxlength="20000" value="' + esc(session.notes.question || "") + '"></label>' : ""}${
        population
          ? `<label>Umgebung<select data-learning-environment>${options(
              [
                ["neutral", "Keine Farbe bevorzugt"],
                ["dark", "Dunkel: dunkle Fische öfter als Eltern"],
                ["light", "Hell: helle Fische öfter als Eltern"],
              ],
              session.study.environment,
            )}</select></label><label>Generationen<input type="number" data-learning-generations min="1" max="15" value="${session.study.generations}"></label><small>Eine Generation: Eltern bekommen Nachkommen. Das ist kein einzelner Tag.</small>`
          : api.form("study") +
            `<details class="learn-observation-window"><summary>Beobachtungszeitraum: ${session.study.days} Spieltage</summary><p>So lange beobachtest du beide Becken. Einstellungen bleiben erhalten.</p><label>Beobachtungszeitraum in Spieltagen<input type="number" data-learning-days min="1" max="14" step="1" value="${session.study.days}"></label></details>`
      }${button(population ? "population-compare" : "compare", "Versuch starten")}<details class="learn-observation-options"><summary>Beobachten und wiederholen</summary><label>Wie oft?<input type="number" data-learning-repetitions min="1" max="4" value="${session.study.repetitions}"></label>${!population ? button("baseline", "Dieses Becken als Anfang nehmen") : ""}</details>${results()}`
    );
  }
  function breeding(workspace = false) {
    const { session, showGenes } = state(),
      p = session.population,
      c = populationCounts(p);
    const select = (sex, key, label) =>
      `<label>${label}<select data-learning-${key}>${options(
        p.individuals
          .filter((i) => i.sex === sex)
          .map((i) => [
            i.uid,
            `Fisch ${i.uid} · ${i.phenotype === "gold" ? "hell" : "dunkel"}${showGenes ? " · " + genotypeText(i.loci) : ""}`,
          ]),
        session[key] ||
          p.individuals.find(
            (i) =>
              i.sex === sex &&
              (key !== "father" || genotypeText(i.loci) === "aa"),
          )?.uid,
      )}</select></label>`;
    return (
      (workspace ? "<h3>Eltern für die nächste Generation wählen</h3>" : panelHeader("Farbe und Nachkommen", "genotype")) +
      `${workspace ? "" : "<p>Diese Fische gehören zum Farbversuch. Die Tiere im Aquarium bleiben dort.</p>"}<small>Eine Generation fasst Aufwachsen und Fortpflanzung zusammen.</small>${showGenes ? "<p>Genotyp: Erbanlagen. Phänotyp: sichtbares Merkmal. Hier ist A dominant: AA und Aa sehen dunkel aus. aa ist hell. Dominant beschreibt hier die Farbe, nicht einen Vorteil.</p>" : ""}<div class="learn-two">${select("♀", "mother", "Mutter")}${select("♂", "father", "Vater")}</div><div class="learn-actions">${workspace ? "" : button("genes", showGenes ? "Erbanlagen ausblenden" : "Erbanlagen zeigen")}${button("cross", "Nachkommen erzeugen")}</div>${workspace ? "" : `<h3>Generation ${p.generation} · ${c.n} Fische</h3><p>${Math.round(c.dark * c.n)} dunkel · ${Math.round(c.light * c.n)} hell</p><div class="learn-population">${p.individuals.map((i) => `<button data-learning-individual="${i.uid}" class="${i.phenotype === "gold" ? "gold" : "dark"}" aria-label="Fisch ${i.uid} ansehen"><strong>Fisch ${i.uid} ${i.sex}</strong><span>${showGenes ? genotypeText(i.loci) : i.phenotype === "gold" ? "hell" : "dunkel"}</span></button>`).join("")}</div><p data-individual-detail role="status"></p>`}<div class="learn-actions">${button("population-new", "Versuch wiederholen")}${button("export", "Für die Lehrkraft speichern")}${api.tools().includes("selection") ? button("investigate", "Gruppen vergleichen") : ""}</div>`
    );
  }
  function notebook() {
    const { session, tag } = state(),
      d = QUESTS[tag.mission];
    return (
      panelHeader("Meine Ergebnisse", "results") +
      `${
        d
          ? `<h3>${esc(d.title)}</h3><p>${session.quest.step} von 5 Aufgaben erledigt.</p><ol>${session.quest.entries
              .filter((e) => e.answer)
              .map(
                (e) =>
                  `<li>${e.viewContext ? `<small>Deine Antwort zu ${e.viewContext.axis === "generation" ? "Generation" : "Tag"} ${num(e.viewContext.time)} · Wiederholung ${e.viewContext.repetition}</small><br>` : ""}${esc(e.question)}<br><strong>${esc(e.answer)}</strong></li>`,
              )
              .join(
                "",
              )}</ol>${session.quest.step === 5 ? `<p>${esc(questConclusion(d, session.quest.result).feedback)}</p>` : button("quest-open", "Zur Aufgabe")}`
          : `<p>Du bestimmst deinen Weg.</p><details><summary>Hilfe beim Forschen</summary><ol><li>Schau dir das Becken an.</li><li>Wähle eine eigene Frage.</li><li>Was glaubst du, wird passieren?</li><li>Probiere es aus. Vergleiche beide Verläufe.</li><li>Was hast du herausgefunden?</li></ol><label>Deine Vermutung (freiwillig)<textarea data-learning-note="prediction" maxlength="20000">${esc(session.notes.prediction || "")}</textarea></label>${button("investigate", "Ausprobieren")}</details><label>Was möchtest du untersuchen?<textarea data-learning-note="question" maxlength="20000">${esc(session.notes.question || "")}</textarea></label><label>Was hast du herausgefunden?<textarea data-learning-note="explanation" maxlength="20000">${esc(session.notes.explanation || "")}</textarea></label>`
      }${
        session.earlierNotes
          ? `<details><summary>Frühere Ergebnisse</summary>${Object.values(
              session.earlierNotes,
            )
              .filter(Boolean)
              .map((v) => `<p>${esc(v)}</p>`)
              .join("")}</details>`
          : ""
      }${state().prototype && (!session.comparison || session.view?.mode === "plan") ? `<p>Für diesen Plan gibt es noch keine Vergleichswerte.</p>${session.comparison ? button("latest-series","Vorherige Ergebnisse ansehen") : ""}` : session.comparison ? results() : ""}<details><summary>Eigene Begründung (freiwillig)</summary><label>Warum denkst du das?<textarea data-learning-note="explanation" maxlength="20000">${esc(session.notes.explanation || "")}</textarea></label></details>${api.manual()}<div class="learn-actions">${button("export", "Für die Lehrkraft speichern")}${button("export-text", "Ergebnis speichern")}</div><small>Dein Stand bleibt auf diesem Gerät gespeichert.</small>`
    );
  }
  function material() {
    const { tag, types } = state();
    if (tag.mission === "10-wadden") return panelHeader("Ein Hafen am Wattenmeer") + `<p>${esc(REGIONAL_CASES[tag.mission].text)}</p><p>Wähle deine Maßnahme im Questbuch.</p>`;
    if (tag.grade === 9) return breeding();
    const descriptions = {
      guppy: "Ein kleiner Fisch. Er frisst Futter und braucht Sauerstoff.",
      ramshorn: "Eine Schnecke. Sie frisst Algen und Reste.",
      amanoshrimp: "Eine Garnele. Sie frisst Algen und Reste.",
      waterweed: "Eine Pflanze. Sie braucht Licht und Nährstoffe.",
      anubias: "Eine langsam wachsende Pflanze.",
      javamoss: "Ein Moos. Kleine Tiere finden darin Schutz.",
      spiderwood: "Ein Stück Holz. Es bietet Verstecke.",
    };
    return (
      panelHeader("Tiere und Pflanzen", "species") +
      `<p>Wer braucht was?</p><div class="learn-catalog">${api
        .catalog()
        .filter((id) => types[id])
        .map(
          (id) =>
            `<article><strong>${esc(types[id].name)}</strong><p>${descriptions[id] || "Schau dir diese Art an."}</p>${button("species-" + id, "Ansehen")}</article>`,
        )
        .join("")}</div>`
    );
  }
  function glossary() {
    const { tag } = state(),
      keys =
        tag.grade === 9
          ? ["observe", "genotype", "selection"]
          : [
              "observe",
              "oxygen",
              "nutrients",
              "load",
              "control",
              ...(tag.mission === "10-carbon" ? ["carbon"] : []),
            ];
    return (
      panelHeader("Wörterhilfe") +
      keys
        .map(
          (k) =>
            `<details><summary>${esc(HELP[k].term)}</summary><p>${esc(HELP[k][tag.grade])}</p></details>`,
        )
        .join("")
    );
  }
  function more() {
    return (
      panelHeader("Mehr") +
      `<div class="learn-actions">${(state().prototype || state().populationWorkspace || state().regionalWorkspace) ? button("notebook","Meine Ergebnisse") : ""}${state().help === false ? "" : button("glossary", "Wörterhilfe")}${(state().prototype || state().populationWorkspace || state().regionalWorkspace) ? "" : button("tweezers", "Pinzette")}${button("display", "Darstellung")}${button("teacher", "Lehrkraftmodus")}${button("home", "Zum Start")}</div>${api.attempts?.() || ""}`
    );
  }
  return {
    quest,
    observe,
    investigation,
    breeding,
    notebook,
    material,
    glossary,
    results,
    reading,
    more,
  };
}
