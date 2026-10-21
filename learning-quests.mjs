import {pendingActivity} from "./learning-activities.mjs";
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
      ecology("temperature", 20, "temp", "Temperatur", "°C"),
      pick(
        "Was ist kein Lebewesen?",
        ["Das Wasser", "Ein Fisch", "Eine Pflanze"],
        0,
        "Ja. Wasser gehört trotzdem zum Lebensraum.",
      ),
      "Was passiert mit der Temperatur bei einem kühleren Heizer?",
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
      living,
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
        "Was hilft gegen neuen Meeresmüll?",
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
  if (d.experiment.kind !== "population") return d.conclusion;
  const environment = result?.configuration?.environment ?? result?.environment;
  if (environment === "neutral") return pick(
    "Welche Erklärung passt ohne Farbvorteil?",
    ["Zufall kann die Anteile verändern", "Dunkle Fische haben hier immer einen Vorteil", "Die Fische wählen ihre Erbanlagen"],
    0, populationExplanation("neutral"));
  return {...d.conclusion, feedback: populationExplanation(environment) + (d.id === "9-darwin" ? " Im Farbversuch werden vorhandene Varianten weitergegeben. Fossilien liefern zusätzliche Funde aus der Natur." : " Dominant heißt nicht: im Vorteil.")};
}
export function newQuest(id) {
  if (!QUESTS[id]) return null;
  return {
    version: 2,
    activities: [],
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
    label: experiment.label,
    unit: experiment.unit,
    time: row.time,
    control: row.control[experiment.metric],
    test: row.test[experiment.metric],
    fish: experiment.metric === "fishOutcome" ? {control:{fishAlive:row.control.fishAlive,fishDead:row.control.fishDead},test:{fishAlive:row.test.fishAlive,fishDead:row.test.fishDead}} : null,
    statuses: structuredClone(run.status || {}),
    configuration: structuredClone(comp.configuration || null),
  };
}
export function resultQuestion(q, result) {
  if (q.experiment.kind === "case") return {prompt:"Welche Folge gehört zu deiner Schutzmaßnahme?",choices:["Weniger Müll, aber auch Aufwand für Rückgabe oder Sammlung","Alle Meeresprobleme sind damit gelöst","Das Aquarium misst nun Plastikschäden"],correct:0};
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
    correct: !result
      ? -1
      : Math.round(result.control * 1000) === Math.round(result.test * 1000)
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
  if (state.activities) state.activities=state.activities.filter(a=>!["survival","oxygen-too","early","late"].includes(a.id));
  state.entries = state.entries.filter((e) => e.step < 2);
  state.entries.push({
    step: 2,
    event,
    evidence: structuredClone(evidence),
    at: new Date().toISOString(),
  });
  state.step = 3;
  state.feedback = "Der Versuch ist fertig. Vergleiche jetzt die Ergebnisse.";
  return true;
}
export function answerQuest(state, index) {
  if (!state || !QUESTS[state.id] || !Number.isInteger(index)) return false;
  const d = QUESTS[state.id],
    step = state.step;
  const question =
    step === 0
      ? d.observe
      : step === 1
        ? { prompt: d.prediction, choices: predictionChoices(d) }
        : step === 3
          ? resultQuestion(d, state.result)
          : step === 4
            ? questConclusion(d, state.result)
            : null;
  if (!question || index < 0 || index >= question.choices.length) return false;
  const activity=pendingActivity(state,step);
  if (activity) {state.feedback=activity.prompt;return false;}
  if (step === 0 && !state.observed) {
    state.feedback = "Schau zuerst ins Aquarium. Öffne „Beobachten“.";
    return false;
  }
  if (step === 3 && !state.result) {
    state.feedback = "Starte zuerst den Versuch.";
    return false;
  }
  if (step !== 1 && index !== question.correct) {
    state.feedback =
      step === 3
        ? "Schau noch einmal auf die Ergebnisse. Versuche es erneut."
        : "Schau noch einmal hin. Versuche es erneut.";
    return false;
  }
  state.entries.push({
    step,
    question: question.prompt,
    answer: question.choices[index],
    at: new Date().toISOString(),
  });
  state.step++;
  state.feedback =
    step === 1
      ? "Deine Vermutung ist gespeichert. Probiere es aus."
      : question.feedback || "Ja. Das passt zu deinen Ergebnissen.";
  return true;
}
export function predictionChoices(d) {
  if (d.experiment.kind === "case") return ["Mehrweg mit Rückgabe","Sammlung von Netzen und Leinen","Ich möchte zuerst die Folgen prüfen"];
  if (d.experiment.kind === "traits")
    return ["Ja", "Nein", "Ich bin noch unsicher"];
  if (d.experiment.kind === "cross")
    return ["Nur dunkel", "Nur hell", "Dunkel und hell"];
  if (d.experiment.kind === "population")
    return [
      "Der Anteil steigt.",
      "Der Anteil sinkt.",
      "Der Anteil bleibt gleich.",
    ];
  const labels = {
    temp: [
      "Das Wasser wird wärmer.",
      "Das Wasser wird kühler.",
      "Die Temperatur bleibt gleich.",
    ],
    oxygen: [
      "Es gibt mehr Sauerstoff.",
      "Es gibt weniger Sauerstoff.",
      "Es bleibt gleich viel Sauerstoff.",
    ],
    fishOutcome: ["Becken 2 hilft den Fischen mehr.","Becken 1 hilft den Fischen mehr.","Beide Becken helfen gleich."],
    health: [
      "Den Fischen geht es besser.",
      "Den Fischen geht es schlechter.",
      "Den Fischen geht es gleich.",
    ],
    organic: [
      "Es bleiben mehr Reste.",
      "Es bleiben weniger Reste.",
      "Es bleibt gleich viel übrig.",
    ],
    plantBiomass: [
      "Die Pflanzen wachsen stärker.",
      "Die Pflanzen wachsen schwächer.",
      "Die Pflanzen wachsen gleich stark.",
    ],
    algae: [
      "Es gibt mehr Algen.",
      "Es gibt weniger Algen.",
      "Die Algenmenge bleibt gleich.",
    ],
    co2: [
      "Es gibt mehr Kohlenstoffdioxid.",
      "Es gibt weniger Kohlenstoffdioxid.",
      "Die Menge bleibt gleich.",
    ],
    loadLevel: [
      "Die Probleme nehmen zu.",
      "Die Probleme nehmen ab.",
      "Die Probleme bleiben gleich.",
    ],
  };
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
