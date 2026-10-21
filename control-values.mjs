/** One numeric contract for text, touch, keyboard, simulation and saved evidence. */
export function controlNumber(raw) {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : NaN;
  if (typeof raw !== "string" || !/^[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(raw.trim())) return NaN;
  return Number(raw.trim().replace(",", "."));
}
export function validControlValue(value, def) {
  return !!def && Number.isFinite(value) && value >= def.min && value <= def.max &&
    Math.abs((value - def.min) / def.step - Math.round((value - def.min) / def.step)) < 1e-6;
}
export function requireControlValue(raw, def) {
  const value = controlNumber(raw);
  if (!validControlValue(value, def))
    throw new Error(`${def?.label || "Wert"}: Bitte ${def?.min} bis ${def?.max} ${def?.unit || ""} in Schritten von ${def?.step} eingeben. Dezimalkomma ist erlaubt.`);
  return value;
}
export function snapControlValue(value, def) {
  return Number(Math.max(def.min, Math.min(def.max, def.min + Math.round((value - def.min) / def.step) * def.step)).toFixed(6));
}
export const EQUIPMENT_CONTROLS = {
  temperature: { label: "Heizstab · Solltemperatur", unit: "°C", min: 15, max: 33, step: .5, field: "setTemp" },
  light: { label: "Licht · täglich eingeschaltet", unit: "h/Tag", min: 0, max: 24, step: 1, field: "hours" },
  filter: { label: "Filter · Durchfluss", unit: "%", min: 0, max: 100, step: 5, field: "flow" },
  intensity: { label: "Licht · Helligkeit", unit: "%", min: 0, max: 140, step: 5, field: "intensity" },
};
export function applyEquipmentSetting(payload, key, raw, def = EQUIPMENT_CONTROLS[key]) {
  const value = requireControlValue(raw, def), next = structuredClone(payload);
  if (!EQUIPMENT_CONTROLS[key]) throw new Error("Unbekanntes Gerät.");
  next[EQUIPMENT_CONTROLS[key].field] = value;
  if (key === "temperature") next.heater = true;
  return next;
}
/** A heater cannot refrigerate below room temperature. Simplified Newton cooling, days. */
export function advanceWaterTemperature(state, days) {
  const room = 22, target = state.heater ? Math.max(room, state.setTemp) : room;
  state.params.temp += (target - state.params.temp) * (1 - Math.exp(-.2 * days));
}
