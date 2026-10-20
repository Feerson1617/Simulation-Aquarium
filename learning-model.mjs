import {
  GRADE_PROFILES,
  MISSIONS,
  missionById,
  SUPPORT,
} from "./learning-content.mjs";
import { createScenario } from "./scenarios.mjs";
import { initializeIndividual } from "./genetics.mjs";
export const LEARNING_VERSION = 1;
export const LEARNING_TOOLS = {
  light: {
    label: "Beleuchtungsdauer",
    unit: "h/Tag",
    min: 0,
    max: 14,
    step: 1,
    value: 8,
    description:
      "Nur die tägliche Lichtdauer ändern; Intensität bleibt gleich.",
  },
  feed: {
    label: "Tägliche Futtermenge",
    unit: "Modellportionen",
    min: 0,
    max: 3,
    step: 0.25,
    value: 0.65,
    description:
      "Futtersorte bleibt gleich. Nicht gefressene Anteile können organische Reste bilden.",
  },
  water: {
    label: "Einmaliger Wasserwechsel",
    unit: "%",
    min: 0,
    max: 70,
    step: 10,
    value: 30,
    description:
      "Ein festgelegter Anteil wird einmal durch dasselbe Frischwasser ersetzt.",
  },
  nutrients: {
    label: "Einmaliger Nährstoffeintrag",
    unit: "mg Nitrat/L",
    min: 0,
    max: 60,
    step: 5,
    value: 20,
    description:
      "Definierte Mischung: zusätzlich 1 mg Phosphat je 30 mg Nitrat. Eine gekoppelte Eintragsvariable.",
  },
  plants: {
    label: "Zusätzliche Wasserpest",
    unit: "Pflanzen",
    min: 0,
    max: 3,
    step: 1,
    value: 1,
    description: "Gleiche Art und Ausgangsgröße; benötigter Raum wird geprüft.",
  },
  temperature: {
    label: "Zieltemperatur",
    unit: "°C",
    min: 20,
    max: 30,
    step: 1,
    value: 25,
    description:
      "Der Heizer nähert die Wassertemperatur schrittweise an den Sollwert an.",
  },
  co2: {
    label: "Kohlenstoffdioxid-Zufuhr",
    unit: "Modellstufe",
    min: 0,
    max: 10,
    step: 1,
    value: 3,
    description:
      "Kalibrierte Dosierstufe, keine Menge eines realen CO₂-Geräts.",
  },
};
export const LEARNING_METRICS = {
  temp: ["Temperatur", "°C"],
  oxygen: ["Sauerstoff", "mg/L"],
  no3: ["Nitrat", "mg/L"],
  no2: ["Nitrit", "mg/L"],
  co2: ["Kohlenstoffdioxid", "mg/L"],
  algae: ["Algenbestand", "relativ"],
  organic: ["Organische Reste", "relativ"],
  plantBiomass: ["Pflanzenbiomasse", "relativ"],
  health: ["Tierkondition", "Modellindex %"],
  individuals: ["Tiere", "Anzahl"],
  photosynthesis: ["Fotosynthese im letzten Schritt", "mg O₂/L je Schritt"],
  respiration: ["Atmung im letzten Schritt", "mg O₂/L je Schritt"],
  loadLevel: ["Wasserbelastung", "Stufe 0–2"],
};
export function normalizeLearningTag(tag) {
  if (tag == null) return null;
  if (
    tag.version !== 1 ||
    !GRADE_PROFILES[tag.grade] ||
    !["missions", "free"].includes(tag.mode) ||
    (tag.mode === "missions" && missionById(tag.mission)?.grade !== tag.grade)
  )
    throw new Error("Ungültiges Lernprofil.");
  return {
    version: 1,
    grade: tag.grade,
    mode: tag.mode,
    mission: tag.mode === "missions" ? tag.mission : null,
  };
}
export function learningSlot(tag) {
  const t = normalizeLearningTag(tag);
  if (!t) throw new Error("Lernprofil fehlt.");
  return "aquarium-learning-tank-v1:" + t.grade + ":" + (t.mission || "free");
}
export function learningTools(tag, teacher = {}) {
  const t = normalizeLearningTag(tag),
    m = missionById(t.mission);
  return [
    ...new Set([
      ...(m?.tools || GRADE_PROFILES[t.grade].tools),
      ...(teacher.unlockTools || []).filter(
        (k) => LEARNING_TOOLS[k] || ["cross", "selection"].includes(k),
      ),
    ]),
  ];
}
export function learningMetrics(tag, teacher = {}) {
  const t = normalizeLearningTag(tag),
    m = missionById(t.mission);
  const base =
    t.grade === 9
      ? ["individuals", "health"]
      : ["oxygen", "health", "algae", "plantBiomass", "organic"];
  return [
    ...new Set([
      ...base,
      ...(m?.metrics || []),
      ...(teacher.unlockMetrics || []),
    ]),
  ].filter((k) => LEARNING_METRICS[k]);
}
/** The indicator is an OR over explicit warning pathways, never an averaged chemical score. */
export function waterIndicators(state) {
  const p = state.params,
    ammoniaFraction =
      1 / (1 + 10 ** (0.09018 + 2729.92 / (p.temp + 273.15) - p.ph)),
    nh3 = (p.nh4 * ammoniaFraction * 17) / 18;
  const paths = [
    {
      key: "organic",
      label: "organische Reste",
      level: state.detritus >= 5 ? 2 : state.detritus >= 1.5 ? 1 : 0,
    },
    {
      key: "nitrite",
      label: "Nitrit im Modell",
      level: p.no2 >= 0.5 ? 2 : p.no2 >= 0.1 ? 1 : 0,
    },
    {
      key: "ammonia",
      label: "berechnetes Ammoniak",
      level: nh3 >= 0.1 ? 2 : nh3 >= 0.02 ? 1 : 0,
    },
    {
      key: "oxygen",
      label: "Sauerstoffmangel",
      level: p.oxygen < 2 ? 2 : p.oxygen < 5 ? 1 : 0,
    },
  ];
  const level = Math.max(...paths.map((x) => x.level)),
    excess = p.no3 > 35 || p.po4 > 2,
    deficit = p.no3 < 2 || p.po4 < 0.1 || p.fe < 0.02;
  return {
    oxygen: p.oxygen < 5 ? "niedrig" : p.oxygen > 9 ? "hoch" : "ausreichend",
    nutrients: excess ? "Überschuss" : deficit ? "Mangel" : "angemessen",
    nutrientNote:
      excess && deficit
        ? "Ein Überschuss kann mit dem Mangel eines anderen Nährstoffs zusammen auftreten."
        : "Versorgungsindikator für das ausgewählte Süßwassermodell; Ansprüche unterscheiden sich.",
    load: ["gering", "erhöht", "kritisch"][level],
    level,
    reasons: paths.filter((x) => x.level).map((x) => x.label),
    paths,
    nh3,
    warning:
      "Didaktische Schwellen für diese Modellsituation, keine universellen Grenzwerte. Auch bei geringer Belastung können andere Artansprüche verletzt sein.",
  };
}
export function learningSample(state, types) {
  const alive = state.entities.filter((e) => !e.dead),
    animals = alive.filter((e) =>
      ["fish", "invert"].includes(types[e.species]?.category),
    ),
    ind = waterIndicators(state);
  return {
    day: state.day,
    temp: state.params.temp,
    oxygen: state.params.oxygen,
    no3: state.params.no3,
    no2: state.params.no2,
    co2: state.params.co2,
    algae: state.algae,
    organic: state.detritus,
    plantBiomass: alive
      .filter((e) => types[e.species]?.category === "plant")
      .reduce((s, e) => s + e.biomass, 0),
    health: animals.length
      ? animals.reduce((s, e) => s + e.health, 0) / animals.length
      : 0,
    individuals: animals.length,
    photosynthesis: state.ecology?.lastFlux?.photosynthesis ?? 0,
    respiration: state.ecology?.lastFlux?.respiration ?? 0,
    loadLevel: ind.level,
    failed: !!state.failed,
  };
}
export function createLearningTank(tag, host) {
  const t = normalizeLearningTag(tag),
    m = missionById(t.mission),
    s = createScenario(m?.scenario === "water" ? "water" : "foodweb", host);
  delete s.scenario;
  s.learning = t;
  const keep = { anubias: 1, waterweed: 3, javamoss: 1, spiderwood: 1 };
  s.entities = s.entities.filter((e) => {
    if (
      ["anubias", "waterweed", "javamoss", "spiderwood", "stone"].includes(
        e.species,
      )
    ) {
      const take = (keep[e.species] || 0) > 0;
      keep[e.species] = (keep[e.species] || 0) - 1;
      return take;
    }
    return true;
  });
  s.seed = 47291;
  if (t.grade === 9) {
    s.entities = s.entities.filter(
      (e) => !["guppy", "ramshorn", "amanoshrimp"].includes(e.species),
    );
    if (s.genetics) {
      s.genetics.pedigree = {};
      s.genetics.pairs = {};
    }
    for (const [genotype, sex] of [
      ["AA", "♀"],
      ["aa", "♂"],
      ["Aa", "♀"],
      ["Aa", "♂"],
    ]) {
      const e = host.add(s, "molly", false);
      if (!e) throw new Error("Lernbesatz konnte nicht eingesetzt werden.");
      initializeIndividual(s, e, {
        variant: genotype === "aa" ? "gold" : "black",
        genotype,
        sex,
        replace: true,
      });
      e.age = 30;
    }
  }
  s.hadLife = true;
  return s;
}
export function applyLearningIntervention(payload, key, value, host) {
  const def = LEARNING_TOOLS[key];
  if (
    !def ||
    !Number.isFinite(value) ||
    value < def.min ||
    value > def.max ||
    Math.abs(
      (value - def.min) / def.step - Math.round((value - def.min) / def.step),
    ) > 1e-6
  )
    throw new Error("Ungültiger Eingriff.");
  const s = structuredClone(payload);
  if (key === "light") s.hours = value;
  if (key === "feed") {
    s.autoFeed = true;
    s.feedRate = value;
  }
  if (key === "temperature") {
    s.heater = true;
    s.setTemp = value;
  }
  if (key === "co2") s.co2Dose = value;
  if (key === "water") host.waterChange(s, value);
  if (key === "nutrients") {
    s.params.no3 += value;
    s.params.po4 += value / 30;
  }
  if (key === "plants")
    for (let n = 0; n < value; n++)
      if (!host.add(s, "waterweed", false))
        throw new Error("Für die Pflanze ist kein freier Platz vorhanden.");
  return s;
}
export function runLearningComparison(
  baseline,
  { tool, value, days = 3, repetitions = 2 },
  host,
) {
  if (
    !Number.isInteger(days) ||
    days < 1 ||
    days > 14 ||
    !Number.isInteger(repetitions) ||
    repetitions < 1 ||
    repetitions > 4
  )
    throw new Error("1–14 Tage und 1–4 Wiederholungen wählen.");
  const runs = [];
  for (let r = 0; r < repetitions; r++) {
    let control = host.normalize(structuredClone(baseline));
    control.seed = (baseline.seed + r * 104729) >>> 0;
    const initial = structuredClone(control),
      test = applyLearningIntervention(control, tool, value, host),
      row = {
        repetition: r + 1,
        seed: control.seed,
        initialControl: structuredClone(initial),
        initialTest: structuredClone(initial),
        control: [learningSample(control, host.types)],
        test: [learningSample(test, host.types)],
        stopped: null,
      };
    for (let n = 0; n < days * 4; n++) {
      if (control.failed || test.failed) {
        row.stopped =
          "Modellabbruch wegen kritischem Beckenverlauf; keine weiteren Daten erfunden.";
        break;
      }
      host.advance(control, 0.25);
      host.advance(test, 0.25);
      row.control.push(learningSample(control, host.types));
      row.test.push(learningSample(test, host.types));
    }
    row.finalControl = control;
    row.finalTest = test;
    runs.push(row);
  }
  return {
    version: 1,
    kind: "ecology",
    tool,
    value,
    days,
    repetitions,
    runs,
    source:
      "Gleicher bestehender biologischer Rechenkern, gleiche Anfangszustände je Paar; nur ein definierter Eingriff. Wiederholungen unterscheiden den Zufallsstart, keine Messfehler vorgetäuscht.",
  };
}
export function comparisonCSV(comparison) {
  const rows = [
    [
      "Wiederholung",
      "Becken",
      "Tag / Generation",
      ...(comparison.kind === "population"
        ? ["AA", "Aa", "aa", "A", "a", "dark", "light"]
        : Object.keys(LEARNING_METRICS)),
    ],
  ];
  for (const run of comparison.runs)
    for (const tank of ["control", "test"])
      for (const sample of run[tank])
        rows.push([
          run.repetition,
          tank === "control" ? "Kontrolle" : "Versuch",
          sample.day ?? sample.generation,
          ...rows[0].slice(3).map((k) => sample[k]),
        ]);
  return rows
    .map((r) =>
      r.map((v) => '"' + String(v ?? "").replaceAll('"', '""') + '"').join(";"),
    )
    .join("\r\n");
}
export function normalizeTeacher(raw = {}) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    throw new Error("Ungültige Unterrichtskonfiguration.");
  return {
    version: 1,
    grade: GRADE_PROFILES[raw.grade] ? Number(raw.grade) : 8,
    mission:
      missionById(raw.mission)?.grade === Number(raw.grade)
        ? raw.mission
        : MISSIONS.find(
            (m) =>
              m.grade === (GRADE_PROFILES[raw.grade] ? Number(raw.grade) : 8),
          ).id,
    support: SUPPORT[raw.support] ? raw.support : "partial",
    help: raw.help !== false,
    unlockTools: [
      ...new Set(
        (Array.isArray(raw.unlockTools) ? raw.unlockTools : []).filter(
          (k) => LEARNING_TOOLS[k] || ["cross", "selection"].includes(k),
        ),
      ),
    ],
    unlockMetrics: [
      ...new Set(
        (Array.isArray(raw.unlockMetrics) ? raw.unlockMetrics : []).filter(
          (k) => LEARNING_METRICS[k],
        ),
      ),
    ],
  };
}
export function validateLearningProduct(raw) {
  if (
    !raw ||
    raw.version !== 1 ||
    raw.type !== "aquarium-learning-product" ||
    !normalizeLearningTag(raw.profile) ||
    typeof raw.notes !== "object" ||
    !raw.notes
  )
    throw new Error("Kein gültiges Lernprodukt.");
  const notes = {};
  for (const k of [
    "prior",
    "question",
    "hypothesis",
    "prediction",
    "plan",
    "observation",
    "explanation",
    "reflection",
    "transfer",
    "assessment",
  ])
    notes[k] =
      typeof raw.notes[k] === "string" ? raw.notes[k].slice(0, 20000) : "";
  return {
    version: 1,
    type: raw.type,
    profile: normalizeLearningTag(raw.profile),
    notes,
    created: typeof raw.created === "string" ? raw.created.slice(0, 80) : null,
    comparison: validateLearningComparison(raw.comparison),
  };
}

/** Read-only imports retain finite sampled data; no imported JavaScript or engine states are executed. */
export function validateLearningComparison(raw) {
  if (raw == null) return null;
  if (
    !["ecology", "population"].includes(raw.kind) ||
    !Array.isArray(raw.runs) ||
    raw.runs.length < 1 ||
    raw.runs.length > 4
  )
    throw new Error("Ungültige Vergleichsdaten.");
  const keys =
    raw.kind === "population"
      ? ["generation", "AA", "Aa", "aa", "A", "a", "dark", "light", "n"]
      : ["day", ...Object.keys(LEARNING_METRICS)];
  const runs = raw.runs.map((r, i) => {
    const clean = { repetition: i + 1 };
    for (const tank of ["control", "test"]) {
      if (!Array.isArray(r[tank]) || r[tank].length < 1 || r[tank].length > 100)
        throw new Error("Ungültige Messreihe.");
      clean[tank] = r[tank].map((row) => {
        if (!row || typeof row !== "object")
          throw new Error("Ungültiger Messpunkt.");
        const result = {};
        for (const key of keys) {
          if (!Number.isFinite(row[key]))
            throw new Error("Messwerte müssen endliche Zahlen sein.");
          result[key] = row[key];
        }
        return result;
      });
    }
    if (clean.control.length !== clean.test.length)
      throw new Error("Vergleichsreihen passen nicht zusammen.");
    return clean;
  });
  return { kind: raw.kind, runs };
}
