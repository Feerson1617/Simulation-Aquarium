import { inheritGenotype, punnettSquare } from "./genetics.mjs";
import { phenotypeFor } from "./fish-variants.mjs";
/** Shared Mendelian functions, finite non-overlapping generations; no natural-time claim. */
export function populationRandom(state) {
  state.seed = (Math.imul(state.seed, 1664525) + 1013904223) >>> 0;
  return state.seed / 4294967296;
}
const genetic = (text) => ({
  model: "molly-mono",
  loci: { A: text.split("") },
});
export function populationCounts(population) {
  const counts = { AA: 0, Aa: 0, aa: 0 };
  for (const i of population.individuals) counts[i.loci.A.join("")]++;
  const n = population.individuals.length;
  return {
    generation: population.generation,
    n,
    ...counts,
    A: n ? (counts.AA * 2 + counts.Aa) / (2 * n) : 0,
    a: n ? (counts.aa * 2 + counts.Aa) / (2 * n) : 0,
    dark: n ? (counts.AA + counts.Aa) / n : 0,
    light: n ? counts.aa / n : 0,
  };
}
export function createLearningPopulation(seed = 47291, size = 24) {
  if (
    !Number.isInteger(size) ||
    size < 4 ||
    size > 80 ||
    !Number.isInteger(seed) ||
    seed < 0 ||
    seed > 4294967295
  )
    throw new Error("Populationsgröße: 4–80; Seed: ganze Zahl 0–4294967295.");
  const p = {
    version: 1,
    seed: seed >>> 0,
    initialSeed: seed >>> 0,
    generation: 0,
    nextId: 1,
    individuals: [],
    archive: [],
    history: [],
    events: [],
  };
  for (let i = 0; i < size; i++) {
    const loci = genetic(["AA", "Aa", "aa"][i % 3]).loci;
    p.individuals.push({
      uid: p.nextId++,
      sex: i % 2 ? "♂" : "♀",
      model: "molly-mono",
      loci,
      phenotype: phenotypeFor("molly-mono", loci),
      parents: [],
      generation: 0,
    });
  }
  p.archive = p.individuals.map((x) => structuredClone(x));
  p.history.push(populationCounts(p));
  return p;
}
export function reproductiveWeight(individual, environment) {
  if (!["neutral", "dark", "light"].includes(environment))
    throw new Error("Unbekannte Modellumwelt.");
  if (environment === "neutral") return 1;
  const dark = individual.phenotype === "black";
  return (environment === "dark" ? dark : !dark) ? 1 : 0.5;
}
function weighted(pool, p, environment) {
  const weights = pool.map((i) => reproductiveWeight(i, environment)),
    sum = weights.reduce((a, b) => a + b, 0);
  let pick = populationRandom(p) * sum;
  for (let i = 0; i < pool.length; i++) {
    pick -= weights[i];
    if (pick < 0) return pool[i];
  }
  return pool.at(-1);
}
function child(p, a, b) {
  const loci = inheritGenotype(a, b, () => populationRandom(p));
  return {
    uid: p.nextId++,
    sex: populationRandom(p) < 0.5 ? "♀" : "♂",
    model: "molly-mono",
    loci,
    phenotype: phenotypeFor("molly-mono", loci),
    parents: [a.uid, b.uid],
    generation: p.generation + 1,
  };
}
function commitGeneration(p, next, event) {
  if (p.generation >= 30 || p.archive.length + next.length > 5000)
    throw new Error(
      "Versuchsgrenze erreicht: exportiere und starte eine neue Untersuchung.",
    );
  p.generation++;
  p.individuals = next;
  p.archive.push(...structuredClone(next));
  p.history.push(populationCounts(p));
  p.events.push({
    ...event,
    generation: p.generation,
    offspring: Object.fromEntries(
      event.parents.map((id) => [
        id,
        next.filter((c) => c.parents.includes(id)).length,
      ]),
    ),
  });
  return p;
}
export function nextLearningGeneration(population, environment = "neutral") {
  const p = structuredClone(population),
    f = p.individuals.filter((x) => x.sex === "♀"),
    m = p.individuals.filter((x) => x.sex === "♂");
  if (!f.length || !m.length)
    throw new Error(
      "Nur ein Geschlecht vorhanden: diese Population kann keine nächste Generation bilden. Kein automatischer Ersatz.",
    );
  const next = Array.from({ length: p.individuals.length }, () =>
    child(p, weighted(f, p, environment), weighted(m, p, environment)),
  );
  return commitGeneration(p, next, {
    kind: "population",
    environment,
    parents: p.individuals.map((i) => i.uid),
    weights: Object.fromEntries(
      p.individuals.map((i) => [i.uid, reproductiveWeight(i, environment)]),
    ),
  });
}
export function crossLearningPopulation(
  population,
  motherId,
  fatherId,
  size = 24,
) {
  if (!Number.isInteger(size) || size < 4 || size > 80)
    throw new Error("Nachkommenzahl: 4–80.");
  const p = structuredClone(population),
    mother = p.individuals.find((i) => i.uid === motherId),
    father = p.individuals.find((i) => i.uid === fatherId);
  if (!mother || !father || mother.sex !== "♀" || father.sex !== "♂")
    throw new Error(
      "Wähle ein Weibchen und ein Männchen aus der aktuellen Generation.",
    );
  const prediction = punnettSquare(mother, father),
    next = Array.from({ length: size }, () => child(p, mother, father));
  return commitGeneration(p, next, {
    kind: "cross",
    parents: [mother.uid, father.uid],
    prediction,
  });
}
export function compareLearningPopulations(
  initial,
  environment,
  generations = 5,
  repetitions = 3,
  configuration = null,
) {
  if (
    !Number.isInteger(generations) ||
    generations < 1 ||
    generations > 15 ||
    !Number.isInteger(repetitions) ||
    repetitions < 1 ||
    repetitions > 4
  )
    throw new Error("1–15 Generationen, 1–4 Wiederholungen.");
  const runs = [];
  for (let r = 0; r < repetitions; r++) {
    let control = structuredClone(initial),
      test = structuredClone(initial);
    control.seed = test.seed = (initial.seed + r * 104729) >>> 0;
    const run = {
      repetition: r + 1,
      seed: control.seed,
      initial: populationCounts(initial),
      control: [populationCounts(control)],
      test: [populationCounts(test)],
      stopped: null,
    };
    run.status = {};
    for (const side of ["control", "test"]) {
      let p = side === "control" ? control : test;
      const status = {
        state: "completed",
        start: p.generation,
        end: p.generation,
        requestedEnd: p.generation + generations,
        reason: null,
      };
      for (let g = 0; g < generations; g++) {
        try {
          p = nextLearningGeneration(
            p,
            side === "control" ? "neutral" : environment,
          );
        } catch (e) {
          status.state = "stopped";
          status.reason = e.message;
          break;
        }
        run[side].push(populationCounts(p));
        status.end = p.generation;
      }
      run.status[side] = status;
      (run.archives ??= {})[side] = p;
    }
    run.stopped = Object.values(run.status).some((s) => s.state !== "completed")
      ? "Mindestens eine Population konnte nicht weitergerechnet werden; Status je Seite beachten."
      : null;
    runs.push(run);
  }
  return {
    version: 2,
    kind: "population",
    configuration: configuration ? structuredClone(configuration) : null,
    environment,
    generations,
    repetitions,
    runs,
    assumption: environment === "neutral"
      ? "Neutrale Elternwahl: alle Phänotypen haben Gewicht 1. Unterschiede zwischen Wiederholungen entstehen durch Zufall; kein Selektionsvorteil."
      : "Helle/dunkle Modellumwelt: passender Phänotyp erhält Gewicht 1, anderer 0,5 für die Elternwahl. Hypothetische relative Fortpflanzungschance; kein gemessener Molly-Wert.",
  };
}

/** Repeat the same founders, never the already selected descendants. */
export function repeatLearningPopulation(
  population,
  seed = population.initialSeed ?? 47291,
) {
  if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295)
    throw new Error("Seed: 0–4294967295.");
  const founders = population.archive.filter((i) => i.generation === 0);
  if (founders.length < 4 || founders.length > 80)
    throw new Error("Ausgangsgenetik fehlt.");
  const p = {
    version: 1,
    seed,
    initialSeed: seed,
    generation: 0,
    nextId: Math.max(...founders.map((i) => i.uid)) + 1,
    individuals: structuredClone(founders),
    archive: structuredClone(founders),
    history: [],
    events: [],
  };
  p.history.push(populationCounts(p));
  return p;
}
/** Bounded, read-only records. No imported state is advanced or installed in the tank. */
export function validateLearningPopulation(raw) {
  if (raw == null) return null;
  const integer = (v, min, max) => {
    if (!Number.isInteger(v) || v < min || v > max)
      throw new Error("Ungültiges Populationsarchiv.");
    return v;
  };
  const list = (v, max) => {
    if (!Array.isArray(v) || v.length > max)
      throw new Error("Populationsarchiv überschreitet die Grenze.");
    return v;
  };
  const seed = integer(raw.seed, 0, 4294967295),
    generation = integer(raw.generation, 0, 30);
  const archive = list(raw.archive, 5000).map((i) => {
    const alleles = i?.loci?.A;
    if (
      !Array.isArray(alleles) ||
      alleles.length !== 2 ||
      !alleles.every((a) => ["A", "a"].includes(a)) ||
      !["AA", "Aa", "aa"].includes(alleles.join("")) ||
      !["♀", "♂"].includes(i.sex)
    )
      throw new Error("Ungültiger Genetikbeleg.");
    const phenotype = phenotypeFor("molly-mono", { A: alleles });
    if (i.phenotype !== phenotype)
      throw new Error("Genotyp und Modellphänotyp widersprechen sich.");
    const parents = list(i.parents, 2).map((id) => integer(id, 1, 1000000));
    if (![0, 2].includes(parents.length))
      throw new Error("Elternbeleg unvollständig.");
    return {
      uid: integer(i.uid, 1, 1000000),
      sex: i.sex,
      model: "molly-mono",
      loci: { A: [...alleles] },
      phenotype,
      parents,
      generation: integer(i.generation, 0, generation),
    };
  });
  const byId = new Map(archive.map((i) => [i.uid, i]));
  if (!archive.length || byId.size !== archive.length)
    throw new Error("Individuennummern fehlen oder sind doppelt.");
  for (const i of archive) {
    if (i.generation === 0 ? i.parents.length !== 0 : i.parents.length !== 2)
      throw new Error("Generation und Elternbeleg widersprechen sich.");
    for (const id of i.parents)
      if (!byId.has(id) || byId.get(id).generation !== i.generation - 1)
        throw new Error("Eltern fehlen im Archiv.");
    if (
      i.parents.length &&
      (byId.get(i.parents[0]).sex !== "♀" || byId.get(i.parents[1]).sex !== "♂")
    )
      throw new Error("Elternrollen widersprechen dem Modell.");
  }
  const individuals = list(raw.individuals, 80).map((i) => {
    const item = byId.get(i?.uid);
    if (
      !item ||
      item.generation !== generation ||
      JSON.stringify(i.loci) !== JSON.stringify(item.loci) ||
      i.phenotype !== item.phenotype ||
      i.sex !== item.sex
    )
      throw new Error("Aktuelle Population widerspricht dem Archiv.");
    return structuredClone(item);
  });
  if (
    individuals.length < 4 ||
    new Set(individuals.map((i) => i.uid)).size !== individuals.length
  )
    throw new Error("Ungültige Individuenzahl.");
  const history = list(raw.history, 31).map((row, index) => {
    const expected = populationCounts({
      generation: index,
      individuals: archive.filter((i) => i.generation === index),
    });
    for (const key of Object.keys(expected))
      if (
        !Number.isFinite(row[key]) ||
        Math.abs(row[key] - expected[key]) > 1e-9
      )
        throw new Error("Häufigkeiten stimmen nicht mit dem Archiv überein.");
    return expected;
  });
  if (history.length !== generation + 1)
    throw new Error("Generationsnachweis unvollständig.");
  const events = list(raw.events, 30).map((event, index) => {
    const g = integer(event.generation, 1, generation);
    if (g !== index + 1 || !["cross", "population"].includes(event.kind))
      throw new Error("Ungültiges Fortpflanzungsereignis.");
    const parents = list(event.parents, 80).map((id) =>
      integer(id, 1, 1000000),
    );
    if (
      !parents.length ||
      parents.some((id) => byId.get(id)?.generation !== g - 1)
    )
      throw new Error("Elternereignis unvollständig.");
    const children = archive.filter((i) => i.generation === g),
      offspring = {};
    for (const id of parents) {
      offspring[id] = children.filter((i) => i.parents.includes(id)).length;
      if (event.offspring?.[id] !== offspring[id])
        throw new Error(
          "Fortpflanzungserfolg stimmt nicht mit Nachkommen überein.",
        );
    }
    if (children.some((c) => c.parents.some((id) => !parents.includes(id))))
      throw new Error("Tatsächliche Eltern fehlen.");
    const clean = { kind: event.kind, generation: g, parents, offspring };
    if (event.kind === "population") {
      if (!["neutral", "dark", "light"].includes(event.environment))
        throw new Error("Modellumwelt fehlt.");
      clean.environment = event.environment;
      clean.weights = {};
      for (const id of parents) {
        const weight = reproductiveWeight(byId.get(id), event.environment);
        if (event.weights?.[id] !== weight)
          throw new Error("Elternwahlgewicht widerspricht dem Phänotyp.");
        clean.weights[id] = weight;
      }
    } else {
      if (parents.length !== 2)
        throw new Error("Kreuzung braucht zwei Eltern.");
      clean.prediction = punnettSquare(
        byId.get(parents[0]),
        byId.get(parents[1]),
      );
      clean.predictionText =
        typeof event.predictionText === "string"
          ? event.predictionText.slice(0, 20000)
          : "";
    }
    return clean;
  });
  if (events.length !== generation)
    throw new Error("Generationsereignisse fehlen.");
  return {
    version: 1,
    seed,
    initialSeed:
      raw.initialSeed == null ? null : integer(raw.initialSeed, 0, 4294967295),
    generation,
    nextId: integer(raw.nextId, Math.max(...byId.keys()) + 1, 1000001),
    individuals,
    archive,
    history,
    events,
  };
}
