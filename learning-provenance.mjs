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
export function validateProvenance(raw, notes) {
  if (raw == null) return {version:1,notes:noteOrigins(notes),legacy:true};
  if (raw.version !== 1 || !raw.notes || typeof raw.notes !== "object") throw new Error("Ungültige Herkunftsangaben.");
  for (const source of Object.values(raw.notes)) if (!["own-input","unknown"].includes(source)) throw new Error("Unbekannte Textherkunft.");
  return {version:1,notes:noteOrigins(notes,raw.notes),questAnswers:"selection",experiments:"game-action",measurements:"simulation",explanations:"game-explanation"};
}
