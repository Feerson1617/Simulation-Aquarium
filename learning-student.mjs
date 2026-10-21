/** The regular learner surface. Technical evidence views remain in learning-ui. */
import {
  QUESTS,
  STEP_NAMES,
  predictionChoices,
  resultQuestion,
} from "./learning-quests.mjs";
import { HELP } from "./learning-content.mjs";
import { populationCounts } from "./learning-population.mjs";
import { genotypeText } from "./fish-variants.mjs";
export const STUDENT_METRICS = {
  temp: ["Temperatur", "°C"],
  oxygen: ["Sauerstoff", "mg/L"],
  no3: ["Pflanzennährstoff", "mg/L"],
  no2: ["Schädlicher Stoff", "mg/L"],
  co2: ["Kohlenstoffdioxid", "mg/L"],
  algae: ["Algenmenge", ""],
  organic: ["Reste", ""],
  plantBiomass: ["Pflanzenmenge", ""],
  health: ["Zustand der Fische", "Punkte"],
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
      d = QUESTS[tag.mission];
    if (!d) return "";
    const done = s.step === 5;
    if (!inline && (s.collapsed || panel))
      return `<aside class="learn-quest-chip">${button("quest-toggle", done ? "Quest fertig ✓" : `Questbuch · ${s.step + 1} von 5`, 'aria-expanded="false"')}</aside>`;
    let body = "";
    if (done)
      body = `<h2 tabindex="-1">Geschafft!</h2><p>${esc(d.conclusion.feedback)}</p>${button("notebook", "Meine Ergebnisse")}${button("quest-restart", "Noch einmal")}`;
    else {
      const step = s.step,
        q =
          step === 0
            ? d.observe
            : step === 1
              ? { prompt: d.prediction, choices: predictionChoices(d) }
              : step === 3
                ? resultQuestion(d, s.result)
                : step === 4
                  ? d.conclusion
                  : null;
      body = `<small>Aufgabe ${step + 1} von 5 · ${STEP_NAMES[step]}</small><h2 tabindex="-1">${esc(q?.prompt || experimentTask(d))}</h2>`;
      if (step === 0) body += button("observe", "Aquarium anschauen");
      if (step === 2)
        body += `<p>${esc(experimentTask(d))}</p>${button(d.experiment.kind === "traits" || d.experiment.kind === "cross" ? "material" : "investigate", d.experiment.kind === "traits" ? "Erbanlagen ansehen" : d.experiment.kind === "cross" ? "Eltern wählen" : "Versuch öffnen")}`;
      if (step === 3) {
        body += reading(s.result);
        body += button(
          d.experiment.kind === "cross" || d.experiment.kind === "traits"
            ? "material"
            : "investigate",
          "Ergebnisse ansehen",
        );
      }
      if (q)
        body += `<div class="learn-quest-answers">${q.choices.map((c, i) => `<button data-quest-answer="${i}">${esc(c)}</button>`).join("")}</div>`;
    }
    return `<aside class="learn-quest ${inline ? "learn-quest-inline" : ""}" aria-label="Questbuch"><header><strong>${esc(d.title)}</strong>${inline ? "" : button("quest-toggle", "−", 'aria-label="Questbuch einklappen" aria-expanded="true"')}</header><progress value="${s.step}" max="5" aria-label="Erledigte Aufgaben">${s.step} von 5</progress>${body}<p class="learn-quest-feedback" role="status" aria-live="polite">${esc(done ? "" : s.feedback)}</p></aside>`;
  }
  function experimentTask(d) {
    const e = d.experiment;
    if (e.kind === "traits")
      return "Zeige die Erbanlagen. Vergleiche die dunklen Fische.";
    if (e.kind === "cross")
      return "Wähle zwei Eltern. Erzeuge ihre Nachkommen.";
    if (e.kind === "population")
      return "Vergleiche die Gruppen über mindestens zwei Generationen.";
    return `Ändere ${STUDENT_TOOLS[e.tool][0]}. Starte den Versuch.`;
  }
  function reading(r) {
    if (!r) return "";
    if (r.kind === "traits")
      return "<p>Dunkle Fische können AA oder Aa haben.</p>";
    if (r.kind === "cross")
      return `<p>${r.n} Nachkommen: ${Math.round(r.dark * r.n)} dunkel, ${Math.round(r.light * r.n)} hell.</p>`;
    const fraction = r.unit === "Anteil",
      value = (v) =>
        fraction ? num(v * 100, 1) + " %" : num(v, 3) + " " + esc(r.unit || "");
    return `<div class="learn-two learn-reading"><div><small>${r.kind === "population" ? "Gruppe" : "Becken"} 1</small><strong>${value(r.control)}</strong></div><div><small>${r.kind === "population" ? "Gruppe" : "Becken"} 2</small><strong>${value(r.test)}</strong></div></div><small>${esc(r.label)} · ${r.kind === "population" ? "Generation" : "Tag"} ${num(r.time)}</small>`;
  }
  function observe() {
    const { session, tag, s, w, types, showGenes } = state();
    let content = "";
    if (tag.grade === 9)
      content = `<p>Schau auf die Farbe der Fische.</p><ul>${s.entities
        .filter((e) => !e.dead && types[e.species]?.category === "fish")
        .map(
          (e) =>
            `<li>${esc(types[e.species].name)} · ${e.variant === "gold" ? "gold" : "dunkel"}</li>`,
        )
        .join("")}</ul>${button("material", "Farbe und Erbanlagen")}`;
    else
      content = `<dl class="learn-values"><div><dt>Temperatur</dt><dd>${num(s.params.temp, 1)} °C</dd></div><div><dt>Sauerstoff ${helpButton("oxygen")}</dt><dd>${esc(w.oxygen)}</dd></div><div><dt>Nährstoffe ${helpButton("nutrients")}</dt><dd>${esc(w.nutrients)}</dd></div><div><dt>Probleme im Wasser ${helpButton("load")}</dt><dd>${esc(w.load)}</dd></div></dl><p>${api.healthText()}</p>`;
    return (
      panelHeader("Beobachten", "observe") +
      content +
      `<div class="learn-actions">${button("measure", "Werte merken")}${button("advance", "1 Tag warten")}</div><small>${session.measurements.length} Messungen gespeichert.</small>${session.measurements.length ? api.manual() : ""}${tag.mode === "free" && tag.grade !== 9 ? `<details><summary>Becken verändern</summary>${api.form("care")}${button("apply", "Anwenden")}</details>` : ""}`
    );
  }
  function results() {
    const { session, tag } = state(),
      c = session.comparison;
    if (!c) return "";
    const keys =
        c.kind === "population" ? ["dark", "light", "A"] : api.studentMetrics(),
      key = keys.includes(session.study.metric)
        ? session.study.metric
        : keys[0];
    const rows = api.times(c.runs[0], c.kind),
      r = rows
        .filter(
          (x) =>
            Number.isFinite(x.control?.[key]) && Number.isFinite(x.test?.[key]),
        )
        .at(-1);
    const stale = !api.matches();
    return `<section class="learn-results"><h3>Dein Vergleich</h3><p data-learning-result-state role="status" class="${stale ? "learn-outdated" : ""}">${stale ? "Du hast etwas geändert. Starte den Versuch neu." : c.kind === "population" ? "Gruppe 1: keine Farbe bevorzugt. Gruppe 2: deine Umgebung." : "Becken 1 blieb gleich. Becken 2 wurde verändert."}</p><label>Was möchtest du ansehen?<select data-learning-metric>${options(
      keys.map((k) => [k, STUDENT_METRICS[k][0]]),
      key,
    )}</select></label>${r ? reading({ kind: c.kind, label: STUDENT_METRICS[key][0], unit: STUDENT_METRICS[key][1], time: r.time, control: r.control[key], test: r.test[key] }) : ""}${api.plot(c, key)}<p class="learn-caption">Eine Linie zeigt ein Becken. Vergleiche beide Linien.</p>${c.runs[0].status?.control?.state === "failed" || c.runs[0].status?.test?.state === "failed" ? "<p>Ein Becken konnte nicht weiterlaufen. Die Linie endet dort. Vergleiche nur Zeitpunkte mit zwei Werten.</p>" : ""}<details><summary>Alle Werte</summary><div class="learn-table-wrap"><table><thead><tr><th>${c.kind === "population" ? "Generation" : "Tag"}</th><th>${c.kind === "population" ? "Gruppe" : "Becken"} 1</th><th>${c.kind === "population" ? "Gruppe" : "Becken"} 2</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${num(r.time)}</td><td>${r.control ? num(r.control[key], 3) : "beendet"}</td><td>${r.test ? num(r.test[key], 3) : "beendet"}</td></tr>`).join("")}</tbody></table></div></details><div class="learn-actions">${button("export", "Für die Lehrkraft speichern")}${c.kind === "ecology" ? button("show-control", "Becken 1 ansehen") + button("show-test", "Becken 2 ansehen") : ""}</div></section>`;
  }
  function investigation() {
    const { session, tag } = state();
    if (tag.grade === 9 && !api.tools().includes("selection"))
      return breeding();
    const population = tag.grade === 9;
    return (
      panelHeader("Ausprobieren", population ? "selection" : "control") +
      `<p>${population ? "Beide Gruppen starten gleich. Hier wählen wir passende Farben öfter als Eltern. Auch Zufall wirkt mit." : "Beide Becken starten gleich. Du änderst nur Becken 2."}</p>${tag.mode === "free" ? '<label>Deine Idee (freiwillig)<input data-learning-note="question" maxlength="20000" value="' + esc(session.notes.question || "") + '"></label>' : ""}${
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
            `<label>Tage<input type="number" data-learning-days min="1" max="14" value="${session.study.days}"></label>`
      }<details><summary>Versuch wiederholen</summary><label>Wie oft?<input type="number" data-learning-repetitions min="1" max="4" value="${session.study.repetitions}"></label>${!population ? button("baseline", "Dieses Becken als Anfang nehmen") : ""}</details>${button(population ? "population-compare" : "compare", "Versuch starten")}${results()}`
    );
  }
  function breeding() {
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
      panelHeader("Farbe und Nachkommen", "genotype") +
      `<p>Diese Fische gehören zum Farbversuch. Die Tiere im Aquarium bleiben dort.</p>${showGenes ? "<p>Genotyp: Erbanlagen. Phänotyp: sichtbares Merkmal. Hier ist A dominant: AA und Aa sehen dunkel aus. aa ist hell. Dominant beschreibt hier die Farbe, nicht einen Vorteil.</p>" : ""}<div class="learn-two">${select("♀", "mother", "Mutter")}${select("♂", "father", "Vater")}</div><div class="learn-actions">${button("genes", showGenes ? "Erbanlagen ausblenden" : "Erbanlagen zeigen")}${button("cross", "Nachkommen erzeugen")}</div><h3>Generation ${p.generation} · ${c.n} Fische</h3><p>${Math.round(c.dark * c.n)} dunkel · ${Math.round(c.light * c.n)} hell</p><div class="learn-population">${p.individuals.map((i) => `<button data-learning-individual="${i.uid}" class="${i.phenotype === "gold" ? "gold" : "dark"}" aria-label="Fisch ${i.uid} ansehen"><strong>Fisch ${i.uid} ${i.sex}</strong><span>${showGenes ? genotypeText(i.loci) : i.phenotype === "gold" ? "hell" : "dunkel"}</span></button>`).join("")}</div><p data-individual-detail role="status"></p><div class="learn-actions">${button("population-new", "Versuch wiederholen")}${button("export", "Für die Lehrkraft speichern")}${api.tools().includes("selection") ? button("investigate", "Gruppen vergleichen") : ""}</div>`
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
                  `<li>${esc(e.question)}<br><strong>${esc(e.answer)}</strong></li>`,
              )
              .join(
                "",
              )}</ol>${session.quest.step === 5 ? `<p>${esc(d.conclusion.feedback)}</p>` : button("quest-open", "Zur Aufgabe")}`
          : `<p>Du bestimmst deinen Weg.</p><label>Was möchtest du untersuchen?<textarea data-learning-note="question" maxlength="20000">${esc(session.notes.question || "")}</textarea></label><label>Was hast du herausgefunden?<textarea data-learning-note="explanation" maxlength="20000">${esc(session.notes.explanation || "")}</textarea></label>`
      }${
        session.earlierNotes
          ? `<details><summary>Frühere Ergebnisse</summary>${Object.values(
              session.earlierNotes,
            )
              .filter(Boolean)
              .map((v) => `<p>${esc(v)}</p>`)
              .join("")}</details>`
          : ""
      }${session.comparison ? results() : ""}${api.manual()}<div class="learn-actions">${button("export", "Für die Lehrkraft speichern")}${button("export-text", "Ergebnis speichern")}</div><small>Dein Stand bleibt auf diesem Gerät gespeichert.</small>`
    );
  }
  function material() {
    const { tag, types } = state();
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
      `<div class="learn-actions">${button("glossary", "Wörterhilfe")}${button("tweezers", "Pinzette")}${button("display", "Darstellung")}${button("teacher", "Lehrkraftmodus")}${button("home", "Zum Start")}</div>`
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
