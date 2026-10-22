/** Evidence origins are explicit. Never infer authorship from an old sentence. */
export const ORIGIN_LABELS = {
  "own-input":"Eigene Eingabe", selection:"Auswahl", "game-action":"Spielhandlung",
  simulation:"Messwert aus dem Simulationsmodell", "game-explanation":"Spielerklärung",
  unknown:"Herkunft nicht dokumentiert",
};
export function noteOrigins(notes, origins = {}) {
  return Object.fromEntries(Object.keys(notes || {}).map(k => [k,
    origins[k] === "own-input" ? "own-input" : "unknown"]));
}
export function learningProvenance(session) {
  return {version:1, notes:noteOrigins(session.notes,session.noteOrigins),
    questAnswers:"selection", experiments:"game-action", measurements:"simulation", explanations:"game-explanation"};
}
/** A selected F2 forecast belongs to F2, never to the preceding F1 or a later cross. */
export function crossingPrediction(session,generation,targetGeneration=null) {
  if (typeof session.notes?.prediction === "string" && session.notes.prediction.trim())
    return {predictionText:session.notes.prediction,predictionOrigin:session.noteOrigins?.prediction === "own-input" ? "own-input" : "unknown"};
  const selected=session.quest?.id === "9-mendel" && generation === targetGeneration
    ? session.quest.entries.find(e=>e.step===1)?.answer : null;
  return selected ? {predictionText:selected,predictionOrigin:"selection",predictionTargetGeneration:targetGeneration}
    : {predictionText:"",predictionOrigin:"unknown"};
}
export function validateProvenance(raw, notes) {
  if (raw == null) return {version:1,notes:noteOrigins(notes),legacy:true};
  if (raw.version !== 1 || !raw.notes || typeof raw.notes !== "object") throw new Error("Ungültige Herkunftsangaben.");
  for (const source of Object.values(raw.notes)) if (!["own-input","unknown"].includes(source)) throw new Error("Unbekannte Textherkunft.");
  return {version:1,notes:noteOrigins(notes,raw.notes),questAnswers:"selection",experiments:"game-action",measurements:"simulation",explanations:"game-explanation"};
}
