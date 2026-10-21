import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  runLearningComparison,
  snapshotLearningPlan,
  planMatchesComparison,
  validateLearningProduct,
  validateLearningComparison,
  learningSample,
  comparisonCSV,
  measurementCSV,
  POPULATION_METRICS,
} from "../learning-model.mjs";
import {
  createLearningPopulation,
  repeatLearningPopulation,
  crossLearningPopulation,
  compareLearningPopulations,
  populationCounts,
  reproductiveWeight,
  validateLearningPopulation,
} from "../learning-population.mjs";
import { TRANSFER, missionById } from "../learning-content.mjs";
const profile = {
  version: 1,
  grade: 10,
  mode: "missions",
  mission: "10-restore",
};
const baseline = () => ({
  day: 45,
  seed: 47291,
  params: {
    temp: 25,
    ph: 7.15,
    nh4: 0.015,
    no2: 0.015,
    no3: 12,
    po4: 0.4,
    fe: 0.08,
    oxygen: 7.8,
    co2: 8,
  },
  detritus: 0.3,
  algae: 0.2,
  liters: 180,
  entities: [],
  learning: profile,
});
// Algorithmic edge cases use a deterministic host. The browser suite additionally
// reproduces the original 10-restore case with the unchanged real hd/Qf engine.
const host = {
  types: {},
  normalize: structuredClone,
  waterChange(s) {
    s.protected = true;
  },
  advance(s, dt) {
    s.day += dt;
    s.failed = !s.protected && s.day >= 48;
  },
};
const notes = {
  question: "Welche Maßnahme wirkt?",
  hypothesis: "Ich vermute eine Wirkung.",
  prediction: "Späterer Verlauf unterscheidet sich.",
  plan: "50 % Wasserwechsel, Kontrolle unverändert.",
};
const study = { tool: "water", value: 50, days: 14, repetitions: 1 };
const config = () =>
  snapshotLearningPlan({
    kind: "ecology",
    baseline: baseline(),
    study,
    profile,
    notes,
    metrics: ["oxygen", "no2"],
  });
const comparison = (days = 14) =>
  runLearningComparison(
    baseline(),
    {
      ...study,
      days,
      configuration: snapshotLearningPlan({
        kind: "ecology",
        baseline: baseline(),
        study: { ...study, days },
        profile,
        notes,
        metrics: ["oxygen", "no2"],
      }),
    },
    host,
  );
const csvRows = (csv) => {
  const rows = csv.split("\r\n").map((line) =>
    line
      .slice(1, -1)
      .split('";"')
      .map((v) => v.replaceAll('""', '"')),
  );
  return rows
    .slice(1)
    .map((row) => Object.fromEntries(rows[0].map((k, i) => [k, row[i]])));
};
test("R1: an early failure stops only that side; no padded or invented samples", () => {
  const c = comparison(),
    r = c.runs[0];
  assert.equal(r.control.length, 13);
  assert.equal(r.test.length, 57);
  assert.deepEqual(r.status.control, {
    state: "failed",
    cause: null,
    start: 45,
    end: 48,
    requestedEnd: 59,
    reason:
      "Biologischer Modellabbruch: kritischer Beckenverlauf. Keine weiteren Messungen berechnet.",
  });
  assert.equal(r.status.test.state, "completed");
  assert.equal(r.status.test.end, 59);
  assert.ok(r.control.every((s) => s.day <= 48));
  assert.equal(validateLearningComparison(c).runs[0].test.length, 57);
  const missing = csvRows(comparisonCSV(c)).find(
    (r) =>
      r.Seite === "Kontrolle" &&
      r.Messzeit === "59" &&
      r.Messschluessel === "oxygen",
  );
  assert.equal(missing.Wert, "");
  assert.equal(missing.Wertstatus, "keine Folgemessung");
  assert.equal(missing.Laufstatus, "failed");
});
test("R1: failure in the last requested step still has a reason and exact time", () => {
  const r = comparison(3).runs[0];
  assert.equal(r.control.length, r.test.length);
  assert.equal(r.status.control.state, "failed");
  assert.equal(r.status.control.end, 48);
  assert.ok(r.status.control.reason);
  assert.equal(r.status.test.state, "completed");
});
test("R2/R3: JSON round trip keeps actual run, frozen planning, status, manual data and provenance", () => {
  const c = comparison();
  c.planning = structuredClone(notes);
  const raw = {
    version: 2,
    type: "aquarium-learning-product",
    profile,
    notes: { ...notes, plan: "Später bearbeiteter Plan" },
    support: "guided",
    model: {
      title: "ETS-Fachcurriculum",
      pages: "19–20",
      scope: "Qualitatives Modell",
    },
    modelVersion: "learning-devices-3",
    comparison: c,
    currentPlan: config(),
    measurements: [
      { ...learningSample(baseline(), {}), metrics: ["oxygen", "respiration"] },
    ],
    measurementMetrics: ["oxygen", "respiration"],
  };
  const clean = validateLearningProduct(JSON.parse(JSON.stringify(raw)));
  assert.equal(clean.comparison.tool, "water");
  assert.equal(clean.comparison.value, 50);
  assert.equal(clean.comparison.days, 14);
  assert.equal(clean.comparison.runs[0].seed, 47291);
  assert.equal(clean.comparison.configuration.baseline.time, 45);
  assert.equal(clean.comparison.planning.plan, notes.plan);
  assert.equal(clean.notes.plan, "Später bearbeiteter Plan");
  assert.equal(clean.comparison.runs[0].status.control.end, 48);
  assert.equal(clean.comparison.runs[0].status.test.end, 59);
  assert.equal(clean.support, "guided");
  assert.equal(clean.model.title, "ETS-Fachcurriculum");
  assert.equal(clean.measurements[0].respiration, null);
  assert.deepEqual(clean.measurementMetrics, ["oxygen", "respiration"]);
  assert.ok(!("finalControl" in clean.comparison.runs[0]));
});
test("R2: old valid products remain readable, with honest missing provenance", async () => {
  for (const grade of [8, 9]) {
    const source = JSON.parse(
      await readFile(
        new URL(`./fixtures/learning-v1-grade-${grade}.json`, import.meta.url),
      ),
    );
    const checked = validateLearningProduct(source);
    assert.equal(checked.profile.grade, grade);
    assert.equal(checked.comparison.configuration, null);
    assert.deepEqual(checked.measurements, source.measurements);
    assert.equal(
      checked.comparison.planning.prediction,
      source.comparison.planning.prediction,
    );
    if (grade === 8) {
      assert.equal(checked.comparison.tool, source.comparison.tool);
      assert.equal(checked.comparison.value, source.comparison.value);
      assert.equal(checked.comparison.days, source.comparison.days);
    } else {
      assert.equal(
        checked.comparison.environment,
        source.comparison.environment,
      );
      assert.deepEqual(checked.population.archive, source.population.archive);
    }
  }
  const p = validateLearningProduct({
    version: 1,
    type: "aquarium-learning-product",
    profile,
    notes: { prediction: "Altbestand" },
    comparison: {
      kind: "ecology",
      runs: [
        {
          control: [learningSample(baseline(), {})],
          test: [learningSample(baseline(), {})],
        },
      ],
    },
  });
  assert.equal(p.comparison.configuration, null);
  assert.equal(p.comparison.tool, null);
  assert.equal(p.notes.prediction, "Altbestand");
});
test("R3: baseline, intervention, duration and prediction changes cannot relabel an old result", () => {
  const c = comparison();
  assert.ok(planMatchesComparison(c, config()));
  for (const changed of [
    { ...study, value: 60 },
    { ...study, days: 3 },
    { ...study, repetitions: 2 },
  ])
    assert.ok(
      !planMatchesComparison(
        c,
        snapshotLearningPlan({
          kind: "ecology",
          baseline: baseline(),
          study: changed,
          profile,
          notes,
        }),
      ),
    );
  const s = baseline();
  s.day = 46;
  assert.ok(
    !planMatchesComparison(
      c,
      snapshotLearningPlan({
        kind: "ecology",
        baseline: s,
        study,
        profile,
        notes,
      }),
    ),
  );
  const old = JSON.stringify(c.configuration);
  notes.plan += " Neue Planung.";
  assert.ok(!planMatchesComparison(c, config()));
  assert.equal(JSON.stringify(c.configuration), old);
  notes.plan = notes.plan.replace(" Neue Planung.", "");
  assert.ok(
    planMatchesComparison(
      c,
      snapshotLearningPlan({
        kind: "ecology",
        baseline: baseline(),
        study,
        profile,
        notes: { ...notes, observation: "Spätere Auswertung" },
        metrics: [],
      }),
    ),
  );
});
test("R4: carbon transfer separates anthropogenic background evidence from local model data", () => {
  const mission = missionById("10-carbon"),
    material = TRANSFER[mission.transfer];
  assert.match(mission.curriculum, /anthropogene/);
  assert.match(material.facts.join(" "), /Fossile Verbrennung/);
  assert.match(material.facts.join(" "), /Landnutzung/);
  assert.match(material.consolidation, /Hintergrundquelle/);
  assert.match(material.limits, /keine globale Emissionssimulation/);
  assert.ok(material.sources.some((s) => s[1].includes("ipcc.ch")));
  assert.equal(material.tasks.length, 3);
});
function mendel(seed) {
  let p = createLearningPopulation(seed);
  p = crossLearningPopulation(p, 1, 6);
  assert.equal(populationCounts(p).Aa, 24);
  const mother = p.individuals.find((i) => i.sex === "♀"),
    father = p.individuals.find((i) => i.sex === "♂");
  return crossLearningPopulation(p, mother.uid, father.uid);
}
test("R5: same seed reproduces actual F1/F2; new seeds change draws while keeping founders", () => {
  const p = mendel(47291),
    again = mendel(47291),
    other = mendel(98765);
  assert.deepEqual(p, again);
  assert.notDeepEqual(
    p.individuals.map((i) => i.loci),
    other.individuals.map((i) => i.loci),
  );
  assert.deepEqual(
    repeatLearningPopulation(p, 98765),
    createLearningPopulation(98765),
  );
  assert.equal(validateLearningPopulation(p).initialSeed, 47291);
  assert.throws(() => repeatLearningPopulation(p, -1));
});
test("R6: counts, phenotype weights and reproductive success reconstruct from each run archive", () => {
  const c = compareLearningPopulations(
    createLearningPopulation(47291),
    "dark",
    6,
    3,
  );
  for (const run of c.runs)
    for (const side of ["control", "test"]) {
      const p = run.archives[side],
        valid = validateLearningPopulation(p);
      assert.equal(valid.archive.length, p.archive.length);
      for (const row of run[side])
        assert.deepEqual(
          populationCounts({
            generation: row.generation,
            individuals: p.archive.filter(
              (i) => i.generation === row.generation,
            ),
          }),
          row,
        );
      for (const event of p.events) {
        const children = p.archive.filter(
          (i) => i.generation === event.generation,
        );
        for (const id of event.parents) {
          const parent = p.archive.find((i) => i.uid === id);
          assert.equal(
            event.offspring[id],
            children.filter((i) => i.parents.includes(id)).length,
          );
          assert.equal(
            event.weights[id],
            reproductiveWeight(parent, side === "control" ? "neutral" : "dark"),
          );
        }
        assert.equal(
          Object.values(event.offspring).reduce((a, b) => a + b, 0),
          children.length * 2,
        );
      }
    }
  const clean = validateLearningComparison(c);
  assert.equal(clean.runs[2].archives.test.events.length, 6);
  assert.equal(clean.environment, "dark");
  assert.equal(clean.generations, 6);
  assert.ok(clean.assumption);
  const fixed = crossLearningPopulation(createLearningPopulation(), 1, 4);
  const lost = compareLearningPopulations(fixed, "light", 5, 2);
  for (const run of lost.runs)
    for (const side of ["control", "test"]) {
      assert.ok(run[side].every((s) => s.a === 0));
      assert.ok(
        run.archives[side].archive
          .filter((i) => i.generation > 1)
          .every((i) => i.loci.A.join("") === "AA"),
      );
    }
  const reverse = compareLearningPopulations(
    createLearningPopulation(),
    "light",
    6,
    3,
  );
  assert.ok(
    c.runs.reduce((s, r) => s + r.test.at(-1).A, 0) >
      reverse.runs.reduce((s, r) => s + r.test.at(-1).A, 0),
  );
  const neutral = compareLearningPopulations(
    createLearningPopulation(),
    "neutral",
    4,
    2,
  );
  for (const r of neutral.runs)
    assert.deepEqual(r.archives.control, r.archives.test);
});
test("R6: malformed evidence cannot silently change phenotype, frequencies or parent success", () => {
  const p = mendel(47291),
    wrong = structuredClone(p);
  wrong.archive.at(-1).phenotype = "wrong";
  assert.throws(() => validateLearningPopulation(wrong));
  const c = compareLearningPopulations(
    createLearningPopulation(),
    "light",
    3,
    1,
  );
  c.runs[0].archives.test.events[0].offspring[1]++;
  assert.throws(() => validateLearningComparison(c));
  const wrongWeight = compareLearningPopulations(
    createLearningPopulation(),
    "dark",
    2,
    1,
  );
  wrongWeight.runs[0].archives.test.events[0].weights[1] = 0.5;
  assert.throws(() => validateLearningComparison(wrongWeight));
});
test("R7/R8: own observations export without a comparison, preserve units and unknown versus zero", () => {
  const a = {
      ...learningSample(baseline(), {}),
      metrics: ["oxygen", "respiration"],
    },
    b = { ...a, day: 46, oxygen: 0, respiration: 0 };
  const rows = csvRows(
    measurementCSV([a, b], { profile, metrics: ["oxygen", "respiration"] }),
  );
  const unknown = rows.find(
      (r) => r.Messzeit === "45" && r.Messschluessel === "respiration",
    ),
    zero = rows.find(
      (r) => r.Messzeit === "46" && r.Messschluessel === "respiration",
    );
  assert.equal(unknown.Wert, "");
  assert.equal(unknown.Wertstatus, "unbekannt");
  assert.equal(zero.Wert, "0");
  assert.equal(zero.Wertstatus, "berechnet");
  assert.equal(zero.Einheit, "mg O₂/L je Schritt");
  assert.equal(zero.Mission, "10-restore");
  assert.ok(rows.every((r) => r.Datensatztyp === "manual"));
});
test("R8: CSV identifies profile, intervention value, units, model, seed, time step and failure", () => {
  const rows = csvRows(comparisonCSV(comparison())),
    row = rows.find((r) => r.Seite === "Versuch" && r.Messschluessel === "no2");
  assert.equal(row.Klasse, "10");
  assert.equal(row.Eingriff, "Einmaliger Wasserwechsel");
  assert.equal(row.Eingriffswert, "50");
  assert.equal(row.Eingriffseinheit, "%");
  assert.equal(row.Modellstand, "learning-devices-3");
  assert.equal(row.Seed, "47291");
  assert.equal(row.Zeitschritt, "0.25");
  assert.equal(row["Geplante Dauer"], "14");
  assert.equal(row["Tatsaechliche Dauer"], "14");
  assert.equal(row.Messgroesse, "Nitrit");
  assert.equal(row.Einheit, "mg/L");
  const pop = csvRows(
    comparisonCSV(
      compareLearningPopulations(createLearningPopulation(), "dark", 1, 1),
    ),
  );
  assert.equal(pop.find((r) => r.Messschluessel === "AA").Typ, "Anzahl");
  assert.equal(pop.find((r) => r.Messschluessel === "A").Typ, "Anteil");
});

test("R2/R3: an unfinished edited draft cannot make a valid previous result unreadable", () => {
  const currentPlan = config();
  currentPlan.days = 99;
  currentPlan.value = NaN;
  const product = {
    version: 2,
    type: "aquarium-learning-product",
    profile,
    notes,
    currentPlan,
    comparison: comparison(),
  };
  const read = validateLearningProduct(JSON.parse(JSON.stringify(product)));
  assert.equal(read.currentPlan.incomplete, true);
  assert.equal(read.currentPlan.days, 99);
  assert.equal(read.currentPlan.value, null);
  assert.equal(read.comparison.days, 14);
  assert.equal(read.comparison.value, 50);
  assert.equal(read.comparison.runs[0].status.test.end, 59);
  assert.throws(() =>
    validateLearningComparison({
      ...comparison(),
      configuration: { ...config(), days: 99 },
    }),
  );
});

test("R8: imported textual metadata stays literal in spreadsheet CSV, numbers remain numeric", () => {
  const data = comparison();
  data.configuration.modelVersion = "=1+1";
  data.runs[0].status.control.reason = "-text";
  const row = csvRows(comparisonCSV(data))[0];
  assert.equal(row.Modellstand, "'=1+1");
  assert.equal(row.Abbruchgrund, "'-text");
  assert.equal(row.Wert, "25");
});
