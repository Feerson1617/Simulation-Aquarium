import {harbourMeasure,HARBOUR_MEASURES} from "./learning-regional-workspace.mjs";
import {pendingActivity,ACTIVITIES} from "./learning-activities.mjs";
/** Short learner tasks. Scientific background remains in learning-content and teacher views. */
import {populationExplanation} from "./biology-quality.mjs";

const pick = (prompt, choices, correct, feedback) => ({
  prompt,
  choices,
  correct,
  feedback,
});
const q = (id, title, goal, experiment, observe, prediction, conclusion) => ({
  id,
  title,
  goal,
  experiment,
  observe,
  prediction,
  conclusion,
});
const ecology = (tool, value, metric, label, unit = "") => ({
  kind: "ecology",
  tool,
  value,
  metric,
  label,
  unit,
});
const population = {
  kind: "population",
  metric: "dark",
  label: "dunkle Fische",
  unit: "Anteil",
};
const living = pick(
  "Was lebt im Aquarium?",
  ["Ein Fisch", "Das Wasser", "Das Licht"],
  0,
  "Ja. Ein Fisch ist ein Lebewesen.",
);
const pair = pick(
  "Was bleibt am Anfang gleich?",
  [
    "Die Tiere und Pflanzen",
    "Die spätere Lichtdauer",
    "Die späteren Messwerte",
  ],
  0,
  "Ja. Beide Becken starten mit denselben Tieren und Pflanzen.",
);
const trend = "Was erwartest du in Becken 2?";
export const QUESTS = Object.fromEntries(
  [
    q(
      "8-ecosystem",
      "Ein Aquarium ist ein Ökosystem",
      "Zum Lebensraum gehören Lebewesen und Umweltbedingungen.",
      ecology("temperature", 27, "temp", "Temperatur", "°C"),
      pick(
        "Was ist kein Lebewesen?",
        ["Das Wasser", "Ein Fisch", "Eine Pflanze"],
        0,
        "Ja. Wasser gehört trotzdem zum Lebensraum.",
      ),
      "In welchem Becken ist das Wasser nach gleicher Spielzeit wärmer?",
      pick(
        "Was gehört zum Lebensraum?",
        [
          "Lebewesen und ihre Umgebung",
          "Nur die Fische",
          "Nur Tiere und Pflanzen",
        ],
        0,
        "Tiere, Pflanzen und Wasser gehören zusammen. Die Temperatur wirkt auf die Lebewesen.",
      ),
    ),
    q(
      "8-oxygen",
      "Woher kommt der Sauerstoff?",
      "Licht ermöglicht die Sauerstoffbildung durch Pflanzen.",
      ecology("light", 0, "oxygen", "Sauerstoff", "mg/L"),
      pair,
      "Was passiert ohne Licht mit dem Sauerstoff?",
      pick(
        "Was fällt ohne Licht weg?",
        [
          "Die Sauerstoffbildung durch Licht",
          "Jeder Sauerstoffverbrauch",
          "Der Austausch mit der Luft",
        ],
        0,
        "Pflanzen geben bei Licht Sauerstoff ab. Ohne Licht fällt diese Quelle weg. Tiere und Pflanzen verbrauchen weiter Sauerstoff. Auch die Luft wirkt auf den Wert.",
      ),
    ),
    q(
      "8-foodweb",
      "Wer ist mit wem verbunden?",
      "Futterreste werden Teil des Stoffkreislaufs.",
      ecology("feed", 2, "organic", "Reste", ""),
      living,
      "Was passiert bei mehr Futter mit den Resten?",
      pick(
        "Was geschieht mit Futterresten?",
        [
          "Kleine Lebewesen bauen sie ab",
          "Der Filter macht sie zu nichts",
          "Sie werden wieder zu Licht",
        ],
        0,
        "Kleine Lebewesen bauen Reste ab. Dabei werden Nährstoffe frei. Pflanzen können sie aufnehmen. Stoffe werden wieder genutzt; Energie geht auch als Wärme nach außen.",
      ),
    ),
    q(
      "8-health",
      "Den Fischen geht es nicht gut.",
      "Eine Pflegemaßnahme mit einem Vergleich prüfen.",
      ecology("water", 50, "fishOutcome", "Fische: Überleben und Zustand", "Punkte"),
      pick(
        "Worauf solltest du achten?",
        [
          "Auf die Fische und das Wasser",
          "Nur auf klares Wasser",
          "Nur auf die Farbe des Kieses",
        ],
        0,
        "Ja. Schau auf die Tiere und auf das Wasser.",
      ),
      "Wie geht es den Fischen nach deiner Maßnahme?",
      pick(
        "Was zeigt der Versuch?",
        [
          "Ob die Maßnahme hier geholfen hat",
          "Dass klares Wasser immer gut ist",
          "Dass es nur eine Ursache geben kann",
        ],
        0,
        "Vergleiche die Fische und die Wasserwerte. Eine Maßnahme kann helfen. Damit ist noch nicht jede Ursache geklärt.",
      ),
    ),
    q(
      "8-forest",
      "Vom Aquarium in den Wald",
      "Pflanzen brauchen Licht – auch im Wald.",
      ecology("light", 0, "plantBiomass", "Pflanzenmenge", ""),
      living,
      "Wie wachsen Pflanzen ohne Licht?",
      pick(
        "Was passt auch zum Wald?",
        [
          "Auch Bäume brauchen Licht",
          "Waldboden ist dasselbe wie Wasser",
          "Jede Aquariumpflanze wächst im Wald",
        ],
        0,
        "Auch Bäume brauchen Licht. Der Wald hat aber Boden und andere Tiere. Nicht alles aus dem Aquarium passt zum Wald.",
      ),
    ),
    q(
      "9-traits",
      "Gleiche Art, verschiedene Individuen",
      "Gleiche Farbe kann verschiedene Erbanlagen haben.",
      { kind: "traits" },
      pick(
        "Was kannst du direkt sehen?",
        ["Die Farbe", "Die Erbanlagen", "Die späteren Nachkommen"],
        0,
        "Ja. Die Farbe ist sichtbar.",
      ),
      "Haben gleichfarbige Fische immer gleiche Erbanlagen?",
      pick(
        "Was hast du gesehen?",
        [
          "AA und Aa können gleich aussehen",
          "Gleiche Farbe bedeutet immer gleiche Erbanlagen",
          "Erbanlagen sind mit bloßem Auge sichtbar",
        ],
        0,
        "Genotyp heißt: die Erbanlagen. Phänotyp heißt: das sichtbare Merkmal. Hier sehen AA und Aa beide dunkel aus. Die Buchstaben gehören zu unserem Farbversuch.",
      ),
    ),
    q(
      "9-mendel",
      "Eine Kreuzung vorhersagen",
      "Jedes Elternteil gibt eine Genvariante weiter.",
      { kind: "cross" },
      {...living,prompt:"Was erkennst du in der Population?"},
      "Welche Farbe erwartest du bei den Nachkommen?",
      pick(
        "Woher kommen die Erbanlagen eines Nachkommen?",
        [
          "Von beiden Eltern",
          "Nur von der Mutter",
          "Die Fische wählen sie selbst",
        ],
        0,
        "Jedes Elternteil gibt eine Genvariante weiter. Eine Genvariante heißt Allel. Welche Variante weitergeht, wird zufällig bestimmt.",
      ),
    ),
    q(
      "9-population",
      "Eine Population verändert sich",
      "Nachkommen und Zufall verändern Farbanteile.",
      population,
      pick(
        "Was ist eine Population?",
        [
          "Eine Gruppe derselben Art",
          "Ein einzelner Fisch",
          "Alle Tiere der Erde",
        ],
        0,
        "Hier untersuchst du eine Gruppe derselben Art.",
      ),
      "Wie verändert sich der Anteil dunkler Fische?",
      pick(
        "Warum können sich Farbanteile ändern?",
        [
          "Unterschiedlich viele Nachkommen und Zufall",
          "Ein Fisch wählt neue Erbanlagen",
          "Dunkel ist immer besser",
        ],
        0,
        "Manche Tiere haben mehr Nachkommen. Dadurch können ihre Varianten häufiger werden. Das heißt Selektion. Auch Zufall verändert Anteile. Das heißt Drift.",
      ),
    ),
    q(
      "9-darwin",
      "Darwin und Lamarck prüfen",
      "Selektion verändert Gruppen über Generationen.",
      population,
      pick(
        "Was ist schon vor dem Versuch verschieden?",
        [
          "Die Farben der Fische",
          "Die Fischart",
          "Die Anzahl der Generationen",
        ],
        0,
        "Die Farbvarianten sind schon vorher vorhanden.",
      ),
      "Werden dunkle Fische in dunkler Umgebung häufiger?",
      pick(
        "Welche Erklärung passt zur Auswahl der Eltern?",
        [
          "Vorhandene Varianten haben verschieden viele Nachkommen",
          "Ein Fisch wird dunkel, weil er es braucht",
          "Alle Fische verändern gezielt ihre Erbanlagen",
        ],
        0,
        "Die Tiere haben nicht alle gleich viele Nachkommen. Über Generationen kann sich die Gruppe ändern. Einzelne Fische wählen keine neuen Erbanlagen aus Bedarf.",
      ),
    ),
    q(
      "10-enrichment",
      "Zu viele Nährstoffe",
      "Zusätzliche Nährstoffe können Algen fördern.",
      ecology("nutrients", 40, "algae", "Algenmenge", ""),
      living,
      "Was passiert bei mehr Nährstoffen mit den Algen?",
      pick(
        "Warum kann zu viel Dünger schaden?",
        [
          "Mehr Algen können später mehr Sauerstoffverbrauch bedeuten",
          "Nährstoffe sind dasselbe wie Sauerstoff",
          "Mehr Algen sind immer gut für Fische",
        ],
        0,
        "Mehr Nährstoffe können Algen fördern. Werden Reste abgebaut, wird Sauerstoff verbraucht. Wie stark das passiert, hängt auch von Licht und Wasserbewegung ab.",
      ),
    ),
    q(
      "10-carbon",
      "Kohlenstoff in Bewegung",
      "Kohlenstoff wechselt zwischen Luft, Wasser und Lebewesen.",
      ecology("co2", 6, "co2", "Kohlenstoffdioxid", "mg/L"),
      pick(
        "Was gehört zu Pflanzen und Tieren?",
        ["Kohlenstoff", "Nur Wasser", "Nur Sauerstoff"],
        0,
        "Kohlenstoff steckt in Lebewesen und in Kohlenstoffdioxid.",
      ),
      "Was passiert bei mehr Zufuhr mit dem Kohlenstoffdioxid?",
      pick(
        "Was passiert beim Verbrennen von Kohle?",
        [
          "Gespeicherter Kohlenstoff gelangt als Kohlenstoffdioxid in die Luft",
          "Kohlenstoff verschwindet",
          "Es wirkt nur auf das Aquarium",
        ],
        0,
        "Pflanzen nehmen Kohlenstoffdioxid auf. Atmung gibt es wieder ab. Menschen bringen durch Kohle, Öl und Gas zusätzlichen Kohlenstoff in die Luft. Das Aquarium berechnet diese weltweiten Mengen nicht.",
      ),
    ),
    q(
      "10-restore",
      "Ein gestörtes System stabilisieren",
      "Die Wirkung einer Maßnahme anhand von Daten prüfen.",
      ecology("water", 50, "fishOutcome", "Fische: Überleben und Zustand", "Punkte"),
      pick(
        "Was braucht ein fairer Vergleich?",
        [
          "Zwei gleiche Becken am Anfang",
          "Zwei ganz verschiedene Becken",
          "Nur einen Wert am Ende",
        ],
        0,
        "Ja. Nur eine Bedingung soll sich unterscheiden.",
      ),
      "Wie geht es den Fischen nach deiner Maßnahme?",
      pick(
        "Wie prüfst du deine Entscheidung?",
        [
          "Mit beiden Verläufen und mehreren Werten",
          "Nur mit dem schönsten Becken",
          "Mit einem Wert ohne Vergleich",
        ],
        0,
        "Prüfe den ganzen Verlauf. Eine schnelle Verbesserung muss nicht dauerhaft sein. Auch die Ursache des Problems bleibt wichtig.",
      ),
    ),
    q(
      "10-northsea",
      "Vom Becken in die Nordsee",
      "Nährstoffeinträge können auch im Meer Folgen haben.",
      ecology("nutrients", 40, "algae", "Algenmenge", ""),
      living,
      "Was bewirken zusätzliche Nährstoffe für Algen?",
      pick(
        "Welche Maßnahme passt zum Problem?",
        [
          "Weniger Nährstoffe über Flüsse eintragen",
          "Mehr Nährstoffe ins Meer leiten",
          "Aquariumwerte für die ganze Nordsee übernehmen",
        ],
        0,
        "Nährstoffe gelangen auch über Flüsse ins Meer. Weniger Eintrag kann helfen. Das Becken zeigt nicht die ganze Nordsee.",
      ),
    ),
    q(
      "10-wadden",
      "Wattenmeer nutzen und schützen",
      "Müllschutz braucht passende Maßnahmen.",
      {kind:"case"},
      pick(
        "Verfolge einen Müllweg: Quelle, Müll, Tier. Was hilft gegen neuen Müll?",
        ["Müll an Land und im Hafen vermeiden","Die Aquariumlampe heller machen","Plastik als Dünger benutzen"],
        0,
        "Vermeidung beginnt vor dem Eintrag ins Meer.",
      ),
      "Welche Schutzmaßnahme lässt sich am Hafen umsetzen?",
      pick(
        "Müll kann Tiere verletzen. Wie vermeiden wir neuen Müll?",
        [
          "Mehrweg nutzen und Müll vermeiden",
          "Nur Wasser austauschen",
          "Plastik als Pflanzennährstoff nutzen",
        ],
        0,
        "Weniger Müll schützt Tiere. Mehrweg braucht Rückgabe und Reinigung. Plastik ist kein Pflanzennährstoff. Unser Wasserwert misst keine Plastikschäden.",
      ),
    ),
  ].map((d) => [d.id, d]),
);
export const STEP_NAMES = [
  "Anschauen",
  "Vermuten",
  "Ausprobieren",
  "Vergleichen",
  "Erklären",
];
export function questConclusion(d, result) {
  if(d.experiment.kind === "case" && HARBOUR_MEASURES[harbourMeasure(result)]) {
    const m=HARBOUR_MEASURES[harbourMeasure(result)];
    return pick("Welche Begründung passt zu deiner Maßnahme?",[m.conclusion,"Ein Wasserwechsel im Aquarium entfernt Meeresmüll","Diese Maßnahme löst alle Meeresprobleme"],0,m.conclusion+". "+m.effort+". "+m.objection+".");
  }
  if (d.experiment.kind !== "population") return d.conclusion;
  const environment = result?.configuration?.environment ?? result?.environment;
  if (environment === "neutral") return pick(
    "Welche Erklärung passt ohne Farbvorteil?",
    ["Zufall kann die Anteile verändern", "Dunkle Fische haben hier immer einen Vorteil", "Die Fische wählen ihre Erbanlagen"],
    0, populationExplanation("neutral"));
  return {...d.conclusion, feedback: populationExplanation(environment) + (d.id === "9-darwin" ? " Im Farbversuch werden vorhandene Varianten weitergegeben. Fossilien liefern zusätzliche Funde aus der Natur." : " Dominant heißt nicht: im Vorteil.")};
}
export function newQuest(id,choiceSeed = globalThis.crypto?.getRandomValues(new Uint32Array(1))[0] ?? Date.now()>>>0) {
  if (!QUESTS[id]) return null;
  return {
    version: 2,
    activities: [],
    choiceSeed: choiceSeed>>>0,
    id,
    step: 0,
    observed: false,
    entries: [],
    result: null,
    feedback: "",
    collapsed: false,
  };
}
export function comparisonReading(comp, experiment) {
  const run = comp?.runs?.[0];
  if (!run) return null;
  const axis = comp.kind === "population" ? "generation" : "day";
  const row = run.control
    .map((control) => ({
      time: control[axis],
      control,
      test: run.test.find((test) => test[axis] === control[axis]),
    }))
    .filter(
      (r) =>
        Number.isFinite(r.control?.[experiment.metric]) &&
        Number.isFinite(r.test?.[experiment.metric]),
    )
    .at(-1);
  if (!row) return null;
  return {
    kind: comp.kind,
    key: experiment.metric,
    repetition: run.repetition || 1,
    sampleSize: comp.kind === "population" ? Math.min(row.control.n,row.test.n) : null,
    label: experiment.label,
    unit: experiment.unit,
    time: row.time,
    control: row.control[experiment.metric],
    test: row.test[experiment.metric],
    fish: experiment.metric === "fishOutcome" ? {control:{fishAlive:row.control.fishAlive,fishDead:row.control.fishDead,health:row.control.health},test:{fishAlive:row.test.fishAlive,fishDead:row.test.fishDead,health:row.test.health}} : null,
    statuses: structuredClone(run.status || {}),
    configuration: structuredClone(comp.configuration || null),
  };
}
export function resultTolerance(metric,result={}) {
  if (["dark","light"].includes(metric)) return .5/(result.sampleSize || 100);
  if (["A","a"].includes(metric)) return .25/(result.sampleSize || 100);
  return ({temp:.1,oxygen:.05,co2:.1,algae:.005,organic:.01,plantBiomass:.01,fishOutcome:1,health:1,loadLevel:0,fishAlive:0})[metric] ?? .001;
}
export function resultQuestion(q, result) {
  if (q.experiment.kind === "case") return {prompt:"Welche Folge gehört zu deiner Schutzmaßnahme?",choices:[HARBOUR_MEASURES[harbourMeasure(result)]?.effort || "Weniger Müll, aber auch Aufwand für Rückgabe oder Sammlung","Alle Meeresprobleme sind damit gelöst","Das Aquarium misst nun Plastikschäden"],correct:0};
  if (q.experiment.kind === "traits")
    return {
      prompt: "Haben alle dunklen Fische dieselben Erbanlagen?",
      choices: ["Nein", "Ja"],
      correct: 0,
    };
  if (q.experiment.kind === "cross")
    return {
      prompt: "Welche Farben haben deine Nachkommen?",
      choices: ["Nur dunkel", "Nur hell", "Dunkel und hell"],
      correct: result?.dark === 1 ? 0 : result?.light === 1 ? 1 : 2,
    };
  if (q.experiment.metric === "fishOutcome" && result?.fish) {
    const a=result.fish.control,b=result.fish.test,difference=a.fishAlive-b.fishAlive;
    const healthDifference=(a.health ?? 0)-(b.health ?? 0);
    return {prompt:"Wo leben mehr Fische – oder bei gleicher Zahl gesündere?",choices:["In Becken 1","In Becken 2","Etwa gleich"],correct:difference ? difference>0?0:1 : Math.abs(healthDifference)<=1 ? 2 : healthDifference>0?0:1};
  }
  return {
    prompt:
      q.experiment.kind === "population"
        ? "Wo ist der Anteil dunkler Fische größer?"
        : {
            temp: "Wo ist die Temperatur höher?",
            oxygen: "Wo ist mehr Sauerstoff?",
            health: "Wo geht es den lebenden Fischen besser?",
            fishOutcome: "Wo überleben mehr Fische in besserem Zustand?",
            organic: "Wo gibt es mehr Reste?",
            plantBiomass: "Wo gibt es mehr Pflanzen?",
            algae: "Wo gibt es mehr Algen?",
            co2: "Wo ist mehr Kohlenstoffdioxid?",
            loadLevel: "Wo sind die Wasserprobleme größer?",
          }[q.experiment.metric],
    choices:
      q.experiment.kind === "population"
        ? ["In Gruppe 1", "In Gruppe 2", "Etwa gleich groß"]
        : ["In Becken 1", "In Becken 2", "Etwa gleich"],
    correct: Number.isInteger(result?.displayPrecision)
      ? Math.round(result.control*10**result.displayPrecision) === Math.round(result.test*10**result.displayPrecision) ? 2 : result.control > result.test ? 0 : 1
      : !result
      ? -1
      : Math.abs(result.control-result.test) <= resultTolerance(q.experiment.metric,result)
        ? 2
        : result.control > result.test
          ? 0
          : 1,
  };
}
/** Only real UI/engine handlers call events. A missing or irrelevant action cannot advance a task. */
export function questEvent(state, event, evidence = {}) {
  if (!state || !QUESTS[state.id]) return false;
  if (event === "observe") {
    state.observed = true;
    return false;
  }
  const d = QUESTS[state.id],
    kind = d.experiment.kind;
  if (![2, 3, 4].includes(state.step) || event !== kind) return false;
  if (state.version === 2 && pendingActivity(state,2)) {state.feedback=pendingActivity(state,2).prompt;return false;}
  if (state.version === 2 && kind === "cross" && !evidence.mendel?.complete) {state.feedback="Untersuche zuerst AA × aa (F1), danach Aa × Aa (F2).";return false;}
  if (state.version === 2 && kind === "population" && !evidence.populationPair?.complete) {state.feedback="Vergleiche erst zwei neutrale Wiederholungen, danach eine Umgebung mit Farbvorteil.";return false;}
  if (kind === "case" && !evidence.result?.measure) return false;
  if (
    kind === "ecology" &&
    (!evidence.changed || evidence.compatible === false || !evidence.result)
  )
    return false;
  if (
    kind === "population" &&
    (!evidence.result ||
      evidence.compatible === false ||
      evidence.generations < 2)
  )
    return false;
  if (kind === "cross" && (!evidence.result || evidence.generation < 1))
    return false;
  if (kind === "traits" && (!evidence.hasAA || !evidence.hasAa)) return false;
  state.result = structuredClone(evidence.result || { kind: "traits" });
  // Measurements must be inspected again after a changed experiment.
  if (state.activities) state.activities=state.activities.filter(a=>!(ACTIVITIES[state.id] || []).some(d=>d.id===a.id && d.phase>=3));
  delete state.fossilOrder;
  state.entries = state.entries.filter((e) => e.step < 2);
  state.entries.push({
    step: 2,
    event,
    origin:"game-action",
    evidence: structuredClone(evidence),
    at: new Date().toISOString(),
  });
  state.step = 3;
  state.feedback = "Der Versuch ist fertig. Vergleiche jetzt die Ergebnisse.";
  return true;
}
export function answerQuest(state, index, inspectedResult = state?.result) {
  if (!state || !QUESTS[state.id] || !Number.isInteger(index)) return false;
  const d = QUESTS[state.id],
    step = state.step,
    result = step === 3 ? inspectedResult : state.result;
  const question =
    step === 0
      ? d.observe
      : step === 1
        ? { prompt: predictionPrompt(d), choices: predictionChoices(d) }
        : step === 3
          ? resultQuestion(d, inspectedResult)
          : step === 4
            ? questConclusion(d, result)
            : null;
  if (!question || index < 0 || index >= question.choices.length) return false;
  state.feedbackKind = "error";
  const activity=pendingActivity(state,step);
  if (activity) {state.feedback=activity.prompt;return false;}
  if (step === 0 && !state.observed) {
    state.feedback = d.experiment.kind === "case" ? "Wähle zuerst ein Objekt im Hafenfall." : "Schau zuerst ins Aquarium. Öffne „Beobachten“.";
    return false;
  }
  if (step === 3 && !result) {
    state.feedback = "Starte zuerst den Versuch.";
    return false;
  }
  if (step !== 1 && index !== question.correct) {
    state.feedback = step === 3
      ? d.experiment.kind === "cross" ? "Zähle die Farben im tatsächlich entstandenen Wurf. Ein theoretisches Verhältnis ist keine feste Anzahl."
        : d.experiment.kind === "traits" ? "Vergleiche AA und Aa: Beide können dunkel aussehen."
        : d.experiment.kind === "case" ? "Prüfe Tiernutzen und den Aufwand für die Menschen am Hafen."
        : d.experiment.metric === "fishOutcome" && result.fish ? `Vergleiche zuerst das Überleben: ${result.fish.control.fishAlive} Fische leben in Becken 1, ${result.fish.test.fishAlive} in Becken 2. Bei gleicher Zahl prüfst du ihren Zustand.`
        : `Vergleiche ${d.experiment.label}: ${result.control?.toLocaleString("de-DE",{maximumFractionDigits:result.displayPrecision ?? 3})} in Becken/Gruppe 1 und ${result.test?.toLocaleString("de-DE",{maximumFractionDigits:result.displayPrecision ?? 3})} in 2. Kleine Unterschiede können etwa gleich sein.`
      : (step === 0 ? d.observe.feedback : questConclusion(d,result).feedback).replace(/^(Ja|Richtig)\.\s*/,"").split(". ")[0] + ". Probiere deine Zuordnung erneut.";
    return false;
  }
  state.entries.push({
    step,
    question: question.prompt,
    answer: question.choices[index],
    choiceIndex:index,
    origin:"selection",
    at: new Date().toISOString(),
  });
  state.step++;
  state.feedbackKind = step === 1 ? "neutral" : "success";
  if (step === 3 && d.experiment.kind !== "case") {
    const prediction=state.entries.find(e=>e.step===1);
    let observed=d.experiment.kind === "traits" ? 1 : question.correct;
    if (d.experiment.kind === "population" && result.populationPair?.neutral?.final) {
      const values=result.populationPair.neutral.final.map(r=>r.test.dark);
      observed=Math.max(...values)-Math.min(...values) > .5/(result.sampleSize || 24) ? 1 : 0;
    }
    state.predictionCheck={selection:prediction?.answer || "Nicht dokumentiert",observed:predictionChoices(d)[observed] || question.choices[question.correct],matches:prediction?.choiceIndex===observed};
  }
  state.feedback =
    step === 1
      ? "Deine Vermutung ist gespeichert. Probiere es aus."
      : question.feedback || "Ja. Das passt zu deinen Ergebnissen.";
  return true;
}
export function predictionPrompt(d) {
  if (d.experiment.kind === "population") return "Was erwartest du bei den neutralen Wiederholungen?";
  if (d.experiment.kind === "ecology") return "Nach gleich langer Spielzeit: " + ({temp:"Welches Becken ist wärmer?",oxygen:"In welchem Becken gibt es mehr Sauerstoff?",organic:"In welchem Becken bleiben mehr Reste?",health:"Welches Becken hilft den Fischen mehr?",fishOutcome:"Welches Becken hilft den Fischen mehr?",plantBiomass:"In welchem Becken gibt es mehr Pflanzenmasse?",algae:"In welchem Becken gibt es mehr Algen?",co2:"In welchem Becken gibt es mehr Kohlenstoffdioxid?",loadLevel:"In welchem Becken sind die Wasserprobleme größer?"})[d.experiment.metric];
  if (d.experiment.kind === "cross") return "Welche Farben erwartest du in der F2 aus Aa × Aa?";
  return d.prediction;
}
export function predictionChoices(d) {
  if (d.experiment.kind === "case") return ["Mehrweg mit Rückgabe","Sammlung von Netzen und Leinen","Ich möchte zuerst die Folgen prüfen"];
  if (d.experiment.kind === "traits")
    return ["Ja", "Nein", "Ich bin noch unsicher"];
  if (d.experiment.kind === "cross")
    return ["Nur dunkel", "Nur hell", "Dunkel und hell"];
  if (d.experiment.kind === "population")
    return ["Die neutralen Wiederholungen enden gleich","Die Endanteile der neutralen Wiederholungen unterscheiden sich","Ich bin noch unsicher"];
  const labels=Object.fromEntries(["temp","oxygen","health","fishOutcome","organic","plantBiomass","algae","co2","loadLevel"].map(k=>[k,["Becken 1","Becken 2","In beiden etwa gleich"]]));
  return labels[d.experiment.metric];
}
/** Bounded, read-only quest records; no imported record can advance the simulation. */
export function validateQuest(raw, mission) {
  if (raw == null) return null;
  if (
    ![1,2].includes(raw.version) ||
    raw.id !== mission ||
    !QUESTS[raw.id] ||
    !Number.isInteger(raw.step) ||
    raw.step < 0 ||
    raw.step > 5 ||
    !Array.isArray(raw.entries) ||
    raw.entries.length > 5
  )
    throw new Error("Ungültiges Questbuch.");
  if (
    raw.entries.length !== raw.step ||
    typeof raw.observed !== "boolean" ||
    typeof raw.collapsed !== "boolean" ||
    typeof raw.feedback !== "string" ||
    raw.feedback.length > 2000
  )
    throw new Error("Unvollständiges Questbuch.");
  for (const [i, e] of raw.entries.entries()) {
    if (!e || e.step !== i || typeof e.at !== "string" || e.at.length > 80)
      throw new Error("Ungültige Questantwort.");
    if (i === 2) {
      if (
        e.event !== QUESTS[raw.id].experiment.kind ||
        !e.evidence ||
        typeof e.evidence !== "object"
      )
        throw new Error("Ungültiger Versuchsbeleg.");
    } else if (
      typeof e.question !== "string" ||
      typeof e.answer !== "string" ||
      e.question.length > 2000 ||
      e.answer.length > 2000
    )
      throw new Error("Ungültige Questantwort.");
  }
  if (raw.step >= 3 && (!raw.result || typeof raw.result !== "object"))
    throw new Error("Versuchsergebnis fehlt.");
  if (raw.version === 2 && (!Array.isArray(raw.activities) || raw.activities.length > 30)) throw new Error("Lernhandlungen fehlen.");
  // Plain bounded JSON is read only and never used as commands or executable state.
  const text = JSON.stringify(raw);
  if (text.length > 32000) throw new Error("Questbuch ist zu groß.");
  return JSON.parse(text);
}
