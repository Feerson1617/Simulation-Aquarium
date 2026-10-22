import { controlNumber, snapControlValue, validControlValue } from "./control-values.mjs";
const esc = v => String(v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
export function dialControl(def, value, attributes = "", compact = false) {
  const numeric = controlNumber(value);
  const current = validControlValue(numeric, def) ? numeric : def.min;
  const input=`<label>${esc(def.label)} (${esc(def.unit)})<input type="text" inputmode="decimal" autocomplete="off" data-control-input ${attributes} value="${esc(value ?? "")}" required></label>`;
  return `<div class="device-value ${compact ? "device-compact" : ""}" data-dial-control data-min="${def.min}" data-max="${def.max}" data-step="${def.step}">
    <button type="button" class="device-dial" role="slider" aria-label="${esc(def.label)} drehen" aria-valuemin="${def.min}" aria-valuemax="${def.max}" aria-valuenow="${current}" aria-valuetext="${current} ${esc(def.unit)}" style="--dial-angle:${-135 + (current-def.min)/(def.max-def.min)*270}deg"><span aria-hidden="true"></span></button>
    <div>${compact ? `<p>${esc(def.label)}</p><output data-dial-reading>${current} ${esc(def.unit)}</output>` : input}
    <div class="device-increments"><button type="button" data-dial-step="-1" aria-label="${esc(def.label)} verringern">−</button><button type="button" data-dial-step="1" aria-label="${esc(def.label)} erhöhen">+</button></div></div>
    ${compact ? `<details class="device-numeric"><summary>Wert eingeben</summary>${input}</details>` : ""}
    <small class="device-dial-help"><span class="device-help-touch">Rädchen mit dem Finger nach oben/unten ziehen.</span><span class="device-help-keyboard">Rädchen ziehen oder Pfeiltasten nutzen.</span></small>
    <p data-control-error role="alert"></p></div>`;
}
/** Event delegation survives panel redraws; a drag never rotates the aquarium camera. */
export function mountDials(root) {
  let drag = null;
  const definition = box => ({ min: Number(box.dataset.min), max: Number(box.dataset.max), step: Number(box.dataset.step) });
  const update = (box, value) => {
    const def = definition(box), input = box.querySelector("[data-control-input]");
    input.value = String(snapControlValue(value, def));
    input.dispatchEvent(new Event("input", { bubbles: true }));
  };
  root.addEventListener("input", e => {
    const box = e.target.closest("[data-dial-control]");
    if (!box) return;
    const def = definition(box), value = controlNumber(e.target.value), dial = box.querySelector(".device-dial");
    const valid = validControlValue(value, def);
    e.target.setAttribute("aria-invalid", String(!valid));
    if (!valid) return;
    box.querySelector("[data-control-error]").textContent = "";
    dial.setAttribute("aria-valuenow", value);
    dial.setAttribute("aria-valuetext", value + " " + box.querySelector("label").textContent.split("(").at(-1).replace(")", ""));
    dial.style.setProperty("--dial-angle", (-135 + (value-def.min)/(def.max-def.min)*270) + "deg");
    const reading=box.querySelector('[data-dial-reading]');
    if (reading) reading.textContent=dial.getAttribute('aria-valuetext');
  });
  root.addEventListener("click", e => {
    const button = e.target.closest("[data-dial-step]");
    if (!button) return;
    const box = button.closest("[data-dial-control]"), def = definition(box);
    const old = controlNumber(box.querySelector("input").value);
    update(box, (Number.isFinite(old) ? old : def.min) + Number(button.dataset.dialStep)*def.step);
  });
  root.addEventListener("keydown", e => {
    const dial = e.target.closest(".device-dial");
    if (!dial) return;
    const box = dial.closest("[data-dial-control]"), def = definition(box), value = Number(dial.getAttribute("aria-valuenow"));
    const delta = {ArrowUp:1,ArrowRight:1,ArrowDown:-1,ArrowLeft:-1,PageUp:5,PageDown:-5}[e.key];
    if (delta !== undefined || ["Home","End"].includes(e.key)) {
      e.preventDefault(); e.stopPropagation();
      update(box, e.key === "Home" ? def.min : e.key === "End" ? def.max : value + delta*def.step);
    }
  });
  root.addEventListener("pointerdown", e => {
    const dial = e.target.closest(".device-dial");
    if (!dial || !e.isPrimary || e.button !== 0) return;
    e.preventDefault(); e.stopPropagation(); dial.focus(); dial.setPointerCapture(e.pointerId);
    drag = {dial, id:e.pointerId, y:e.clientY, value:Number(dial.getAttribute("aria-valuenow"))};
  });
  root.addEventListener("pointermove", e => {
    if (!drag || drag.id !== e.pointerId) return;
    const box = drag.dial.closest("[data-dial-control]"), def = definition(box);
    update(box, drag.value + Math.round((drag.y-e.clientY)/8)*def.step);
  });
  const end = e => { if (drag?.id === e.pointerId) drag = null; };
  root.addEventListener("pointerup", end); root.addEventListener("pointercancel", end); root.addEventListener("lostpointercapture", end);
}
