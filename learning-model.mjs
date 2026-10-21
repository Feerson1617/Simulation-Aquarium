import {
  GRADE_PROFILES,
  MISSIONS,
  missionById,
  SUPPORT,
} from "./learning-content.mjs";
import { createScenario } from "./scenarios.mjs";
import { initializeIndividual } from "./genetics.mjs";
import { validateLearningPopulation } from "./learning-population.mjs";
export const LEARNING_MODEL_REVISION = "learning-evidence-2";
export const POPULATION_METRICS = {
  AA: ["Genotyp AA", "Anzahl"],
  Aa: ["Genotyp Aa", "Anzahl"],
  aa: ["Genotyp aa", "Anzahl"],
  n: ["Individuen", "Anzahl"],
  A: ["Allel A", "Anteil (0–1)"],
  a: ["Allel a", "Anteil (0–1)"],
  dark: ["Dunkler Phänotyp", "Anteil (0–1)"],
  light: ["Heller Phänotyp", "Anteil (0–1)"],
};
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
    ![8, 9, 10].includes(tag.grade) ||
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
        (k) =>
          Object.hasOwn(LEARNING_TOOLS, k) ||
          ["cross", "selection"].includes(k),
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
  ].filter((k) => Object.hasOwn(LEARNING_METRICS, k));
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
    photosynthesis: state.ecology?.lastFlux?.photosynthesis ?? null,
    respiration: state.ecology?.lastFlux?.respiration ?? null,
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
  const def = Object.hasOwn(LEARNING_TOOLS, key) ? LEARNING_TOOLS[key] : null;
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
      if (!host.add(s, "waterweed", true))
        throw new Error("Für die Pflanze ist kein freier Platz vorhanden.");
  return s;
}
export function runLearningComparison(
  baseline,
  { tool, value, days = 3, repetitions = 2, configuration = null },
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
    row.status = {};
    for (const side of ["control", "test"]) {
      const state = side === "control" ? control : test;
      const status = {
        state: "completed",
        start: state.day,
        end: state.day,
        requestedEnd: initial.day + days,
        reason: null,
      };
      const markFailure = () => {
        if (!state.failed) return false;
        status.state = "failed";
        status.cause =
          typeof state.failureCause === "string"
            ? state.failureCause.slice(0, 80)
            : null;
        const label =
          {
            nitrite: "Nitritbelastung",
            oxygen: "Sauerstoffmangel",
            ammonia: "Ammoniakbelastung",
            nutrients: "Versorgung/Lebensbedingungen",
          }[status.cause] || status.cause;
        status.reason = label
          ? "Biologischer Modellabbruch; vom Rechenkern zugeordnete Ursache: " +
            label +
            ". Dies ist eine Modelldiagnose, kein Nachweis einer einzigen realen Ursache. Keine weiteren Messungen berechnet."
          : "Biologischer Modellabbruch: kritischer Beckenverlauf. Keine weiteren Messungen berechnet.";
        status.end = state.day;
        return true;
      };
      for (let n = 0; n < days * 4; n++) {
        if (markFailure()) break;
        host.advance(state, 0.25);
        row[side].push(learningSample(state, host.types));
        status.end = state.day;
        if (markFailure()) break; // includes failure in the final requested step
      }
      row.status[side] = status;
    }
    row.stopped = Object.values(row.status).some((s) => s.state !== "completed")
      ? "Mindestens eine Seite ist ausgefallen. Die andere Seite wird unabhängig weitergerechnet; danach kein vollständiger Paarvergleich."
      : null;
    row.finalControl = control;
    row.finalTest = test;
    runs.push(row);
  }
  return {
    version: 2,
    kind: "ecology",
    configuration: configuration ? structuredClone(configuration) : null,
    tool,
    value,
    days,
    repetitions,
    runs,
    source:
      "Gleicher bestehender biologischer Rechenkern, gleiche Anfangszustände je Paar; nur ein definierter Eingriff. Wiederholungen unterscheiden den Zufallsstart, keine Messfehler vorgetäuscht.",
  };
}
/** Non-cryptographic identity of the actual starting state, used only to detect plan changes. */
export function learningFingerprint(value) {
  let h = 2166136261;
  for (const c of JSON.stringify(value))
    h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0");
}
export function snapshotLearningPlan({
  kind,
  baseline,
  population,
  study,
  profile,
  notes,
  metrics = [],
}) {
  const source = kind === "population" ? population : baseline;
  return structuredClone({
    kind,
    profile,
    modelVersion: LEARNING_MODEL_REVISION,
    tool: kind === "ecology" ? study.tool : null,
    value:
      kind === "ecology"
        ? (study.value ?? LEARNING_TOOLS[study.tool]?.value)
        : null,
    days: kind === "ecology" ? study.days : null,
    environment: kind === "population" ? study.environment : null,
    generations: kind === "population" ? study.generations : null,
    repetitions: study.repetitions,
    baseline: {
      time: source.day ?? source.generation,
      seed: source.seed,
      fingerprint: learningFingerprint(source),
      size: source.entities?.length ?? source.individuals?.length,
    },
    planning: Object.fromEntries(
      ["question", "hypothesis", "prediction", "plan"].map((k) => [
        k,
        notes[k] || "",
      ]),
    ),
    metrics,
  });
}
export function planMatchesComparison(comparison, plan) {
  if (!comparison?.configuration) return false;
  const { metrics: _old, ...old } = comparison.configuration,
    { metrics: _new, ...next } = plan;
  return JSON.stringify(old) === JSON.stringify(next);
}
export function comparisonTimes(run, kind) {
  const axis = kind === "population" ? "generation" : "day";
  return [...new Set([...run.control, ...run.test].map((s) => s[axis]))]
    .sort((a, b) => a - b)
    .map((time) => ({
      time,
      control: run.control.find((s) => s[axis] === time),
      test: run.test.find((s) => s[axis] === time),
    }));
}
export function comparisonCSV(comparison) {
  const population = comparison.kind === "population",
    c = comparison.configuration || {},
    defs = population ? POPULATION_METRICS : LEARNING_METRICS,
    profile = c.profile || comparison.profile || {},
    metrics =
      comparison.kind === "manual" ? comparison.metrics : Object.keys(defs),
    rows = [
      [
        "CSV-Schema",
        "Datensatztyp",
        "Klasse",
        "Modus",
        "Mission",
        "Modellstand",
        "Eingriff",
        "Eingriffswert",
        "Eingriffseinheit",
        "Modellumwelt",
        "Geplante Dauer",
        "Dauereinheit",
        "Ausgangszeit",
        "Ausgangslage Kennung",
        "Wiederholung",
        "Seed",
        "Seite",
        "Laufstatus",
        "Endzeit",
        "Tatsaechliche Dauer",
        "Abbruchgrund",
        "Zeitschritt",
        "Messzeit",
        "Messschluessel",
        "Messgroesse",
        "Einheit",
        "Typ",
        "Wert",
        "Wertstatus",
      ],
    ];
  for (const run of comparison.runs) {
    const times =
      comparison.kind === "manual"
        ? run.control.map((s) => ({ time: s.day, control: s }))
        : comparisonTimes(run, comparison.kind);
    for (const side of comparison.kind === "manual"
      ? ["control"]
      : ["control", "test"]) {
      const samples = run[side],
        status = run.status?.[side];
      for (const row of times)
        for (const key of metrics) {
          const sample = row[side],
            def = defs[key],
            value = sample?.[key],
            measured =
              sample && (!sample.metrics || sample.metrics.includes(key)),
            label =
              side === "control"
                ? comparison.kind === "manual"
                  ? "Eigenes Becken"
                  : "Kontrolle"
                : "Versuch",
            unit = def[1],
            type =
              unit === "Anzahl"
                ? "Anzahl"
                : unit.includes("Anteil")
                  ? "Anteil"
                  : ["relativ", "Stufe 0–2", "Modellindex %"].includes(unit)
                    ? "Modellindex"
                    : "Messgröße";
          rows.push([
            "2",
            comparison.kind,
            profile.grade,
            profile.mode,
            profile.mission || "Freies Forschen",
            c.modelVersion ||
              comparison.modelVersion ||
              "Altbestand – nicht dokumentiert",
            LEARNING_TOOLS[c.tool || comparison.tool]?.label ||
              (population ? "Elternwahl" : ""),
            c.value ?? comparison.value,
            LEARNING_TOOLS[c.tool || comparison.tool]?.unit,
            c.environment || comparison.environment,
            c.days ??
              c.generations ??
              comparison.days ??
              comparison.generations,
            population ? "Generationen" : "Modelltage",
            c.baseline?.time ?? samples[0]?.day ?? samples[0]?.generation,
            c.baseline?.fingerprint,
            run.repetition,
            run.seed ?? c.baseline?.seed,
            label,
            status?.state || "nicht dokumentiert",
            status?.end ?? samples.at(-1)?.day ?? samples.at(-1)?.generation,
            (status?.end ?? samples.at(-1)?.day ?? samples.at(-1)?.generation) -
              (status?.start ?? samples[0]?.day ?? samples[0]?.generation),
            status?.reason || "",
            comparison.kind === "manual"
              ? "manuell – siehe Messzeit"
              : population
                ? 1
                : 0.25,
            row.time,
            key,
            def[0],
            unit,
            type,
            measured && Number.isFinite(value) ? value : "",
            !sample
              ? "keine Folgemessung"
              : !measured
                ? "nicht freigegeben"
                : Number.isFinite(value)
                  ? "berechnet"
                  : "unbekannt",
          ]);
        }
    }
  }
  return rows
    .map((row) =>
      row
        .map((v) => '"' + String(v ?? "").replaceAll('"', '""') + '"')
        .join(";"),
    )
    .join("\r\n");
}
export function measurementCSV(
  measurements,
  { profile, metrics, modelVersion = LEARNING_MODEL_REVISION },
) {
  return comparisonCSV({
    kind: "manual",
    profile,
    metrics,
    modelVersion,
    runs: [{ repetition: 1, control: measurements, test: [] }],
  });
}
export function normalizeTeacher(raw = {}) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    throw new Error("Ungültige Unterrichtskonfiguration.");
  return {
    version: 1,
    grade: [8, 9, 10].includes(Number(raw.grade)) ? Number(raw.grade) : 8,
    mission:
      missionById(raw.mission)?.grade === Number(raw.grade)
        ? raw.mission
        : MISSIONS.find(
            (m) =>
              m.grade ===
              ([8, 9, 10].includes(Number(raw.grade)) ? Number(raw.grade) : 8),
          ).id,
    support: Object.hasOwn(SUPPORT, raw.support) ? raw.support : "partial",
    help: raw.help !== false,
    unlockTools: [
      ...new Set(
        (Array.isArray(raw.unlockTools) ? raw.unlockTools : []).filter(
          (k) =>
            Object.hasOwn(LEARNING_TOOLS, k) ||
            ["cross", "selection"].includes(k),
        ),
      ),
    ],
    unlockMetrics: [
      ...new Set(
        (Array.isArray(raw.unlockMetrics) ? raw.unlockMetrics : []).filter(
          (k) => Object.hasOwn(LEARNING_METRICS, k),
        ),
      ),
    ],
  };
}
const evidenceText = (v, length = 2000) =>
  typeof v === "string" ? v.slice(0, length) : null;
function evidenceNumber(v, min = 0, max = 1000000, integer = false) {
  if (
    !Number.isFinite(v) ||
    v < min ||
    v > max ||
    (integer && !Number.isInteger(v))
  )
    throw new Error("Ungültige Zahl im Lernbeleg.");
  return v;
}
function evidenceList(v, max) {
  if (!Array.isArray(v) || v.length > max)
    throw new Error("Lernbeleg überschreitet die zulässige Größe.");
  return v;
}
function evidenceNotes(raw = {}) {
  const notes = {};
  for (const key of [
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
    notes[key] = evidenceText(raw?.[key], 20000) || "";
  return notes;
}
function evidenceMetrics(raw, population = false) {
  const defs = population ? POPULATION_METRICS : LEARNING_METRICS;
  return [
    ...new Set(
      evidenceList(raw, 20).map((k) => {
        if (!Object.hasOwn(defs, k))
          throw new Error("Unbekannte Messgröße im Lernbeleg.");
        return k;
      }),
    ),
  ];
}
function evidenceSamples(raw, population = false, limit = 100, manual = false) {
  let previous = -Infinity;
  return evidenceList(raw, limit).map((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row))
      throw new Error("Ungültiger Messpunkt.");
    const axis = population ? "generation" : "day",
      time = evidenceNumber(row[axis]);
    if (time < previous || (!manual && time === previous))
      throw new Error("Messzeiten sind nicht geordnet.");
    previous = time;
    const clean = { [axis]: time },
      defs = population ? POPULATION_METRICS : LEARNING_METRICS;
    for (const key of Object.keys(defs)) {
      if (
        !population &&
        ["photosynthesis", "respiration"].includes(key) &&
        row[key] === null
      )
        clean[key] = null;
      else
        clean[key] = evidenceNumber(
          row[key],
          0,
          ["A", "a", "dark", "light"].includes(key) ? 1 : 1000000,
        );
    }
    if (population) {
      if (
        ![clean.AA, clean.Aa, clean.aa, clean.n].every(Number.isInteger) ||
        clean.n < 4 ||
        clean.n > 80 ||
        clean.AA + clean.Aa + clean.aa !== clean.n ||
        Math.abs(clean.A - (clean.AA * 2 + clean.Aa) / (2 * clean.n)) > 1e-9 ||
        Math.abs(clean.A + clean.a - 1) > 1e-9 ||
        Math.abs(clean.dark - (clean.AA + clean.Aa) / clean.n) > 1e-9 ||
        Math.abs(clean.dark + clean.light - 1) > 1e-9
      )
        throw new Error("Populationszählungen widersprechen sich.");
    } else clean.failed = row.failed === true;
    if (row.metrics != null) clean.metrics = evidenceMetrics(row.metrics);
    return clean;
  });
}
function evidenceConfiguration(raw, draft = false) {
  let incomplete = false;
  const planNumber = (value, min, max, integer = false) => {
    try {
      return evidenceNumber(value, min, max, integer);
    } catch (error) {
      if (!draft) throw error;
      incomplete = true;
      return Number.isFinite(value) && Math.abs(value) <= 1000000
        ? value
        : null;
    }
  };
  if (raw == null) return null;
  if (!["ecology", "population"].includes(raw.kind))
    throw new Error("Unbekannter Untersuchungsplan.");
  const population = raw.kind === "population",
    baseline = raw.baseline;
  if (!baseline || !/^[a-f0-9]{8}$/.test(baseline.fingerprint))
    throw new Error("Kennung der Ausgangslage fehlt.");
  const clean = {
    kind: raw.kind,
    profile: normalizeLearningTag(raw.profile),
    modelVersion: evidenceText(raw.modelVersion, 80),
    tool: population ? null : raw.tool,
    value: population ? null : raw.value,
    days: population ? null : planNumber(raw.days, 1, 14, true),
    environment: population ? raw.environment : null,
    generations: population ? planNumber(raw.generations, 1, 15, true) : null,
    repetitions: planNumber(raw.repetitions, 1, 4, true),
    baseline: {
      time: evidenceNumber(baseline.time),
      seed: evidenceNumber(baseline.seed, 0, 4294967295, true),
      fingerprint: baseline.fingerprint,
      size: evidenceNumber(baseline.size, 0, 5000, true),
    },
    planning: Object.fromEntries(
      ["question", "hypothesis", "prediction", "plan"].map((k) => [
        k,
        evidenceText(raw.planning?.[k], 20000) || "",
      ]),
    ),
    metrics: evidenceMetrics(raw.metrics || [], population),
  };
  if (population) {
    if (!["neutral", "dark", "light"].includes(clean.environment))
      throw new Error("Modellumwelt fehlt.");
  } else {
    if (!Object.hasOwn(LEARNING_TOOLS, clean.tool))
      throw new Error("Unbekanntes Werkzeug im Plan.");
    const d = LEARNING_TOOLS[clean.tool];
    if (
      !Number.isFinite(clean.value) ||
      clean.value < d.min ||
      clean.value > d.max ||
      Math.abs(
        (clean.value - d.min) / d.step -
          Math.round((clean.value - d.min) / d.step),
      ) > 1e-6
    ) {
      if (!draft) throw new Error("Ungültiger dokumentierter Eingriff.");
      incomplete = true;
      if (!Number.isFinite(clean.value) || Math.abs(clean.value) > 1000000)
        clean.value = null;
    }
  }
  if (incomplete) clean.incomplete = true;
  return clean;
}
export function validateLearningProduct(raw) {
  if (
    !raw ||
    ![1, 2].includes(raw.version) ||
    raw.type !== "aquarium-learning-product" ||
    !normalizeLearningTag(raw.profile) ||
    !raw.notes ||
    typeof raw.notes !== "object" ||
    Array.isArray(raw.notes)
  )
    throw new Error("Kein gültiges Lernprodukt.");
  const profile = normalizeLearningTag(raw.profile),
    measurements = evidenceSamples(raw.measurements || [], false, 300, true),
    measurementMetrics = evidenceMetrics(
      raw.measurementMetrics || [
        ...new Set(
          measurements.flatMap((s) => s.metrics || learningMetrics(profile)),
        ),
      ],
    );
  return {
    version: raw.version,
    type: raw.type,
    profile,
    notes: evidenceNotes(raw.notes),
    created: evidenceText(raw.created, 80),
    support: Object.hasOwn(SUPPORT, raw.support) ? raw.support : null,
    model:
      raw.model && typeof raw.model === "object"
        ? Object.fromEntries(
            ["title", "url", "pages", "scope"].map((k) => [
              k,
              evidenceText(raw.model[k]),
            ]),
          )
        : null,
    modelVersion: evidenceText(raw.modelVersion, 80),
    comparison: validateLearningComparison(raw.comparison),
    currentPlan: evidenceConfiguration(raw.currentPlan, true),
    measurements,
    measurementMetrics,
    population: validateLearningPopulation(raw.population),
    populationRepeats: evidenceList(raw.populationRepeats || [], 20).map(
      (item) => ({
        seed: evidenceNumber(item.seed, 0, 4294967295, true),
        final: evidenceSamples([item.final], true)[0],
      }),
    ),
  };
}
/** Read-only data, metadata and genealogical evidence; imported engine payloads are never executed. */
export function validateLearningComparison(raw) {
  if (raw == null) return null;
  if (
    !["ecology", "population"].includes(raw.kind) ||
    !Array.isArray(raw.runs) ||
    !raw.runs.length ||
    raw.runs.length > 4
  )
    throw new Error("Ungültige Vergleichsdaten.");
  const population = raw.kind === "population",
    axis = population ? "generation" : "day",
    configuration = evidenceConfiguration(raw.configuration);
  const runs = raw.runs.map((run, i) => {
    const clean = {
      repetition: i + 1,
      seed:
        run.seed == null ? null : evidenceNumber(run.seed, 0, 4294967295, true),
      status: {},
    };
    for (const side of ["control", "test"]) {
      clean[side] = evidenceSamples(run[side], population);
      if (!clean[side].length) throw new Error("Messreihe ist leer.");
      const first = clean[side][0][axis],
        last = clean[side].at(-1)[axis],
        old = run.status?.[side],
        failed =
          clean[side].at(-1).failed === true ||
          run[side === "control" ? "finalControl" : "finalTest"]?.failed ===
            true;
      const requestedEnd =
        old?.requestedEnd ??
        (configuration
          ? configuration.baseline.time +
            (population ? configuration.generations : configuration.days)
          : first +
            (population
              ? raw.generations || last - first
              : raw.days || last - first));
      const state =
        old?.state ||
        (failed
          ? "failed"
          : run.stopped || last < requestedEnd
            ? "stopped"
            : "completed");
      if (
        !["completed", "failed", "stopped"].includes(state) ||
        (old && (old.start !== first || old.end !== last)) ||
        requestedEnd < last ||
        (state === "completed" && requestedEnd !== last)
      )
        throw new Error("Laufstatus und Messzeiten widersprechen sich.");
      clean.status[side] = {
        state,
        start: first,
        end: last,
        requestedEnd: evidenceNumber(requestedEnd),
        cause: evidenceText(
          old?.cause ||
            run[side === "control" ? "finalControl" : "finalTest"]
              ?.failureCause,
          80,
        ),
        reason: evidenceText(
          old?.reason ||
            (state !== "completed"
              ? run.stopped ||
                "Modellabbruch im älteren Export; genauer Grund nicht dokumentiert."
              : null),
        ),
      };
    }
    clean.stopped =
      evidenceText(run.stopped) ||
      (Object.values(clean.status).some((s) => s.state !== "completed")
        ? "Mindestens eine Seite beendet; Status je Seite beachten."
        : null);
    if (population && run.archives) {
      clean.archives = {
        control: validateLearningPopulation(run.archives.control),
        test: validateLearningPopulation(run.archives.test),
      };
      for (const side of ["control", "test"]) {
        const p = clean.archives[side];
        if (!p) throw new Error("Laufarchiv fehlt.");
        for (const sample of clean[side]) {
          const h = p.history.find((h) => h.generation === sample.generation);
          if (
            !h ||
            Object.keys(POPULATION_METRICS).some(
              (k) => Math.abs(h[k] - sample[k]) > 1e-9,
            )
          )
            throw new Error("Laufarchiv und Zeitreihe widersprechen sich.");
        }
      }
    }
    return clean;
  });
  const clean = {
    version: raw.version === 2 ? 2 : 1,
    kind: raw.kind,
    configuration,
    runs,
    planning: evidenceNotes(raw.planning || configuration?.planning),
    source: evidenceText(raw.source),
    assumption: evidenceText(raw.assumption),
    repetitions: runs.length,
  };
  if (population) {
    if (
      raw.environment != null &&
      !["neutral", "dark", "light"].includes(raw.environment)
    )
      throw new Error("Modellumwelt fehlt.");
    clean.environment = raw.environment ?? configuration?.environment ?? null;
    clean.generations =
      raw.generations == null
        ? (configuration?.generations ?? null)
        : evidenceNumber(raw.generations, 1, 15, true);
  } else {
    if (raw.tool != null && !Object.hasOwn(LEARNING_TOOLS, raw.tool))
      throw new Error("Eingriff fehlt.");
    clean.tool = raw.tool ?? configuration?.tool ?? null;
    clean.value =
      raw.value == null
        ? (configuration?.value ?? null)
        : evidenceNumber(
            raw.value,
            LEARNING_TOOLS[clean.tool]?.min || 0,
            LEARNING_TOOLS[clean.tool]?.max || 1000000,
          );
    clean.days =
      raw.days == null
        ? (configuration?.days ?? null)
        : evidenceNumber(raw.days, 1, 14, true);
  }
  if (
    configuration &&
    (configuration.kind !== clean.kind ||
      configuration.repetitions !== runs.length ||
      (population
        ? configuration.environment !== clean.environment ||
          configuration.generations !== clean.generations
        : configuration.tool !== clean.tool ||
          configuration.value !== clean.value ||
          configuration.days !== clean.days))
  )
    throw new Error("Lauf und feste Konfiguration widersprechen sich.");
  return clean;
}
