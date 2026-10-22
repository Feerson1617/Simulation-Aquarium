/** View identities and immutable tank checkpoints. No biological rates or RNG calls. */
import {compressArchiveText, decompressArchiveText} from "./vendor/lz-string.mjs";
export const VIEW_VERSION = 1;
const clone = value => structuredClone(value);
const archiveCache = new WeakMap();
export function packTankArchive(raw) {
  const text=JSON.stringify(raw);
  const packed={version:2,codec:"lz-string-utf16-v1",length:text.length,data:compressArchiveText(text)};
  archiveCache.set(packed,{data:packed.data,length:packed.length,value:raw});
  return packed;
}
function decodedArchive(raw) {
  if (!raw || raw.version === 1) return raw;
  if (raw.version !== 2 || raw.codec !== "lz-string-utf16-v1" || typeof raw.data !== "string" ||
      raw.data.length > 2500000 || !Number.isInteger(raw.length) || raw.length < 1 || raw.length > 2500000)
    throw new Error("Unbekanntes oder zu großes Beckenarchiv.");
  const cached=archiveCache.get(raw);
  if (cached?.data === raw.data && cached.length === raw.length) return cached.value;
  const text=decompressArchiveText(raw.data);
  if (typeof text !== "string" || text.length !== raw.length) throw new Error("Beckenarchiv ist beschädigt.");
  const value=JSON.parse(text);
  if (value?.version !== 1) throw new Error("Unbekanntes Beckenarchiv.");
  archiveCache.set(raw,{data:raw.data,length:raw.length,value});return value;
}
export function unpackTankArchive(raw) {return clone(decodedArchive(raw));}
const unsafe = key => ["__proto__", "constructor", "prototype"].includes(key);
export function stateId(value) {
  let h = 2166136261;
  for (const c of JSON.stringify(value)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0");
}
export function investigationId() {
  return crypto.randomUUID(); // identity only; never consumes the simulation's random state
}

// Small structural patches preserve actual states without storing 57 complete copies.
function changes(before, after, path = [], out = []) {
  if (Object.is(before, after)) return out;
  if (!before || !after || typeof before !== "object" || typeof after !== "object" ||
      Array.isArray(before) !== Array.isArray(after) ||
      (Array.isArray(before) && before.length !== after.length)) {
    out.push({path, value: clone(after)}); return out;
  }
  for (const key of Object.keys(before))
    if (!Object.hasOwn(after, key)) out.push({path: [...path, key], remove: true});
  for (const key of Object.keys(after)) {
    if (unsafe(key)) throw new Error("Unzulässiger Zustandsschlüssel.");
    changes(before[key], after[key], [...path, key], out);
  }
  return out;
}
export function tankArchive(state) {
  return {version: VIEW_VERSION, base: clone(state), frames: [{time: state.day, stateId: stateId(state), patch: []}]};
}
export function appendTankFrame(archive, before, state) {
  archive.frames.push({time: state.day, stateId: stateId(state), patch: changes(before, state)});
}
export function archivedTank(archive, time) {
  archive=decodedArchive(archive);
  if (!archive || archive.version !== VIEW_VERSION || !archive.frames.some(f => f.time === time)) return null;
  let state = clone(archive.base);
  for (const frame of archive.frames) {
    for (const operation of frame.patch) {
      if (!operation.path.length) {state = clone(operation.value); continue;}
      let parent = state;
      for (const key of operation.path.slice(0, -1)) {
        if (unsafe(key) || !Object.hasOwn(parent, key)) throw new Error("Ungültiger Zustandspfad.");
        parent = parent[key];
      }
      const key = operation.path.at(-1);
      if (unsafe(key)) throw new Error("Ungültiger Zustandspfad.");
      if (operation.remove) delete parent[key]; else parent[key] = clone(operation.value);
    }
    if (frame.time === time) {
      if (state.day !== time || stateId(state) !== frame.stateId) throw new Error("Beckenzustand und Kennung widersprechen sich.");
      return state;
    }
  }
  return null;
}

/** A typed action, not journal differences or a required difference in the result. */
export function interventionEvent(before, after, tool, value) {
  const setting = {temperature: "setTemp", light: "hours", filter: "flow", co2: "co2Dose", feed: "feedRate"}[tool];
  const fields = s => setting ? {value: s[setting], ...(tool === "feed" ? {enabled: s.autoFeed} : {})} :
    tool === "nutrients" ? {nitrate: s.params.no3, phosphate: s.params.po4} :
    tool === "plants" ? {plants: s.entities.filter(e => e.species === "waterweed" && !e.dead).map(e => e.uid)} :
    {liters: s.liters};
  const a = fields(before), b = fields(after);
  const effective = tool === "water" ? value > 0 && before.liters > 0 : stateId(a) !== stateId(b);
  return {version: 1, type: tool, value, effective, before: a, after: b,
    ...(tool === "water" ? {exchangedLiters: before.liters * value / 100} : {})};
}
export function comparisonSeries(session) {
  return [...(session.comparisonHistory || []), session.comparison].filter(Boolean);
}
export function rowsAtTimes(run, kind) {
  const axis = kind === "population" ? "generation" : "day";
  return [...new Set([...run.control, ...run.test].map(s => s[axis]))].sort((a,b) => a-b)
    .map(time => ({time, control: run.control.find(s => s[axis] === time) || null,
      test: run.test.find(s => s[axis] === time) || null}));
}
const index = (value, length, fallback = 0) => Number.isInteger(value) && value >= 0 && value < length ? value : fallback;
/** The sole result selector for cards, scene, chart, table, inspection and exports. */
export function resolveComparisonView(session, request = {}) {
  const series = comparisonSeries(session);
  if (!series.length) return null;
  const seriesIndex = index(request.series ?? session.study?.series, series.length, series.length-1);
  const comparison = series[seriesIndex], runIndex = index(request.run ?? session.study?.run, comparison.runs.length);
  const run = comparison.runs[runIndex], rows = rowsAtTimes(run, comparison.kind);
  const cfg=comparison.configuration || {};
  // Old files have no original identity. This local label must survive validation
  // (which may reorder configuration keys), without inventing an original UUID.
  const seriesId = comparison.id || `legacy-${seriesIndex}-${stateId([comparison.kind,
    comparison.tool ?? cfg.tool ?? null,comparison.value ?? cfg.value ?? null,comparison.days ?? cfg.days ?? null,
    comparison.environment ?? cfg.environment ?? null,comparison.generations ?? cfg.generations ?? null,
    cfg.baseline?.fingerprint ?? null,comparison.runs.map(r=>r.seed ?? null)])}`;
  const selected = request.time ?? (session.view?.seriesId === seriesId && session.view.run === runIndex ? session.view.time : null);
  const row = rows.find(r => r.time === selected) || rows.filter(r => r.control && r.test).at(-1) || rows.at(-1);
  const context = {version: VIEW_VERSION, investigationId: comparison.id || null, attemptId: comparison.attemptId || null,
    revision: comparison.configuration?.modelVersion || null, seriesId, series: seriesIndex,
    run: runIndex, repetition: run.repetition || runIndex+1, time: row.time,
    axis: comparison.kind === "population" ? "generation" : "day", side: request.side || session.view?.side || "both"};
  const sides = Object.fromEntries(["control", "test"].map(side => {
    const sample = row[side];
    let state = null;
    if (sample && comparison.kind === "ecology") {
      state = archivedTank(run.tanks?.[side], row.time);
      // Old records only contain their final state, never invent an earlier picture.
      if (!state) {
        const final = run[side === "control" ? "finalControl" : "finalTest"];
        if (final?.day === row.time) state = clone(final);
      }
    }
    return [side, {sample: sample ? clone(sample) : null, state, stateId: state ? stateId(state) : null,
      availability: !sample ? "ended" : state ? "state" : "measurements-only"}];
  }));
  context.stateIds = Object.fromEntries(Object.entries(sides).map(([side,data])=>[side,data.stateId]));
  return {context, comparison, run, rows, row: clone(row), sides};
}
export function selectComparisonView(session, request = {}) {
  const view = resolveComparisonView(session, request);
  if (view) session.view = clone(view.context);
  return view;
}
export function bindComparison(comparison, attemptId, id = investigationId()) {
  comparison.id = id; comparison.attemptId = attemptId; comparison.viewVersion = VIEW_VERSION;
  return comparison;
}

/** Bounded, verified view-only archive import. Biological saves still use the game's loader. */
export function validateTankArchive(raw, samples) {
  if (!raw) return null;
  const decoded=decodedArchive(raw);
  if (decoded.version !== VIEW_VERSION || !Array.isArray(decoded.frames) || decoded.frames.length !== samples.length || decoded.frames.length > 57)
    throw new Error("Ungültiges Beckenarchiv.");
  const archive = clone(decoded);
  if (JSON.stringify(archive).length > 2500000) throw new Error("Beckenarchiv ist zu groß.");
  for (let i=0; i<archive.frames.length; i++) {
    const f = archive.frames[i];
    if (f.time !== samples[i].day || !Array.isArray(f.patch) || f.patch.length > 12000 || !/^[\da-f]{8}$/.test(f.stateId))
      throw new Error("Beckenarchiv und Messzeiten widersprechen sich.");
    for (const op of f.patch)
      if (!Array.isArray(op.path) || op.path.length > 24 || op.path.some(k => typeof k !== "string" || unsafe(k)))
        throw new Error("Ungültiger Zustandspfad.");
    const state = archivedTank(archive, f.time), sample = samples[i];
    if (!state || !Array.isArray(state.entities) || state.entities.length > 240 || !state.params ||
        ["temp", "oxygen", "no2", "no3", "co2"].some(k => Number.isFinite(sample[k]) && state.params[k] !== sample[k]))
      throw new Error("Beckenarchiv und Messwerte widersprechen sich.");
  }
  return raw.version === 2 ? clone(raw) : archive;
}
