import { EQUIPMENT_CONTROLS, requireControlValue } from "./control-values.mjs";
import { dialControl, mountDials } from "./control-dial.mjs";
const kinds = {temperature:"heater", light:"light", filter:"filter"};
const names = {temperature:"Heizstab", light:"Licht", filter:"Filter"};
/** Accessible hit areas follow actual equipment bounds, including external filters. */
export function mountEquipmentUI(host, T) {
  const root = document.createElement("section");
  root.id = "equipment-controls"; root.setAttribute("aria-label", "Geräte im Aquarium");
  root.innerHTML = `<div class="equipment-anchors">${Object.keys(kinds).map(key => `<button type="button" data-equipment="${key}" aria-label="${names[key]} einstellen">${names[key]} ↻</button>`).join("")}</div><div class="equipment-editor"></div>`;
  host.root.append(root); mountDials(root);
  let opened = null, returnFocus = null, outline = null, outlined = null;
  const materials = new Map();
  const meshFor = key => host.view()?.tank.children.find(o => o.name.startsWith("equipment:" + kinds[key] + ":"));
  function clearOutline() {
    if (outline) { outline.removeFromParent(); outline.geometry.dispose(); outline.material.dispose(); }
    for (const [material, original] of materials) {
      material.emissive?.copy(original.color); material.emissiveIntensity = original.intensity;
    }
    materials.clear(); outline = null; outlined = null;
  }
  function highlight(key) {
    const object = meshFor(key), view = host.view();
    if (!object || !view) {clearOutline(); return;}
    if (object !== outlined) {
      clearOutline(); outlined = object;
      object.traverse(part => {if (part.material?.emissive && !materials.has(part.material)) {
        const material = part.material; materials.set(material,{color:material.emissive.clone(),intensity:material.emissiveIntensity});
        material.emissive.set("#f4c357");material.emissiveIntensity = .9;
      }});
      outline = new T.Mesh(new T.BoxGeometry(1,1,1),new T.MeshBasicMaterial({color:"#ffd778",wireframe:true,transparent:true,opacity:.95,depthTest:false}));
      outline.renderOrder = 1000; view.scene.add(outline);
    }
    object.updateWorldMatrix(true,true);
    const box = new T.Box3().setFromObject(object);
    box.getCenter(outline.position); box.getSize(outline.scale); outline.scale.addScalar(.04);
  }
  function close(restore = true) {
    opened = null; root.querySelector(".equipment-editor").innerHTML = ""; root.classList.remove("editing");
    clearOutline(); host.lock(false);
    if (restore && returnFocus?.isConnected) returnFocus.focus();
  }
  function open(key, options = {}) {
    if (!meshFor(key)) {host.notify("Dieses Gerät ist noch nicht eingebaut. Wähle es im Zooladen."); return;}
    returnFocus = document.activeElement;
    const def = options.definition || EQUIPMENT_CONTROLS[key], state = host.state();
    opened = {key, def, ...options}; host.lock(true); root.classList.add("editing");
    root.querySelector(".equipment-editor").innerHTML = `<section role="dialog" aria-modal="true" aria-label="${names[key]} einstellen" class="equipment-sheet"><header><h2>${names[key]} einstellen</h2><button type="button" data-equipment-close aria-label="Geräteregler schließen">×</button></header><p>${options.scope === "study" ? "Versuchsbecken 2 · Die Ausgangslage bleibt für den Vergleich gesichert." : "Aktuelles Becken · Die Einstellung bleibt bis zur nächsten Änderung bestehen."}</p>${dialControl(def, options.value ?? state[def.field || EQUIPMENT_CONTROLS[key].field], "data-equipment-value")}${key === "light" && options.scope !== "study" ? dialControl(EQUIPMENT_CONTROLS.intensity, state.intensity, "data-equipment-intensity") : ""}<p data-equipment-reading>${key === "temperature" ? `Wasser jetzt: ${state.params.temp.toLocaleString("de-DE",{maximumFractionDigits:1})} °C. Der Sollwert wirkt erst mit der Zeit. Ein Heizstab kühlt nicht aktiv unter 22 °C Raumtemperatur.` : key === "filter" ? "Du regelst den Durchfluss des vorhandenen Filters. Seine Bakterien bleiben erhalten; die Wasserwerte reagieren mit der Zeit." : "Die Lampe folgt dieser täglichen Beleuchtungsdauer. Sauerstoff und Wachstum reagieren im zeitlichen Verlauf."}</p><button type="button" data-equipment-save>${options.scope === "study" ? "Für Versuch übernehmen" : "Einstellung speichern"}</button></section>`;
    highlight(key); root.querySelector(".device-dial").focus();
  }
  root.addEventListener("click", e => {
    const choose = e.target.closest("[data-equipment]");
    if (choose) { host.choose(choose.dataset.equipment); return; }
    if (e.target.closest("[data-equipment-close]")) {
      const cancel = opened?.onCancel; close(); cancel?.(); return;
    }
    if (!e.target.closest("[data-equipment-save]") || !opened) return;
    try {
      const value = requireControlValue(root.querySelector("[data-equipment-value]").value, opened.def), saved = opened;
      // Keep invalid drafts open, close only after the state mutation succeeds.
      const extra = root.querySelector("[data-equipment-intensity]");
      const intensity = extra ? requireControlValue(extra.value, EQUIPMENT_CONTROLS.intensity) : null;
      saved.onCommit(value, intensity); close(false);
    } catch (error) {
      root.querySelector("[data-control-error]").textContent = error.message;
      root.querySelector("[data-equipment-value]").focus();
    }
  });
  root.addEventListener("keydown", e => {
    if (e.key === "Escape" && opened) {e.preventDefault(); e.stopPropagation(); const cancel = opened.onCancel;close();cancel?.();}
    if (e.key === "Tab" && opened) {
      const controls = [...root.querySelectorAll('.equipment-sheet button,.equipment-sheet input')];
      if (e.shiftKey && e.target === controls[0]) {e.preventDefault();controls.at(-1).focus();}
      else if (!e.shiftKey && e.target === controls.at(-1)) {e.preventDefault();controls[0].focus();}
    }
  });
  let down = null;
  const canvas = host.view()?.renderer.domElement;
  canvas?.addEventListener("pointerdown", e => {down = [e.clientX,e.clientY];}, true);
  canvas?.addEventListener("pointerup", e => {
    const context = host.context(), view = host.view();
    if (!down || !context.visible || opened || view.aquascaping?.enabled || Math.hypot(e.clientX-down[0],e.clientY-down[1]) > 10) return;
    down = null;
    const rect = canvas.getBoundingClientRect();
    view.pointer.set((e.clientX-rect.left)/rect.width*2-1,1-(e.clientY-rect.top)/rect.height*2);
    view.raycaster.setFromCamera(view.pointer,view.camera);
    const equipment = context.tools.filter(key => kinds[key]).map(meshFor).filter(Boolean);
    const hit = view.raycaster.intersectObjects([...equipment,...view.life.children],true)[0];
    let object = hit?.object;
    while(object && !equipment.includes(object)) object = object.parent;
    const key = Object.keys(kinds).find(key => meshFor(key) === object);
    if (!key) return;
    e.preventDefault(); requestAnimationFrame(() => host.choose(key));
  }, true);
  let last = 0;
  function frame(time) {
    requestAnimationFrame(frame);
    if (time-last < 80) return; last = time;
    const context = host.context(), view = host.view();
    root.hidden = !context.visible || !view || view.state.tankPlaced === false;
    if (root.hidden) { if (opened) close(false); else clearOutline(); return; }
    const rect = view.renderer.domElement.getBoundingClientRect(), outer = host.root.getBoundingClientRect();
    for (const key of Object.keys(kinds)) {
      const button = root.querySelector(`[data-equipment="${key}"]`), object = meshFor(key);
      button.hidden = !object || !context.tools.includes(key) || (opened && opened.key !== key);
      if (button.hidden) continue;
      object.updateWorldMatrix(true,true);
      const center = new T.Box3().setFromObject(object).getCenter(new T.Vector3()).project(view.camera);
      button.hidden = center.z < -1 || center.z > 1;
      button.style.left = Math.max(50,Math.min(outer.width-65,rect.left-outer.left+(center.x+1)*rect.width/2)) + "px";
      button.style.top = Math.max(80,Math.min(outer.height-170,rect.top-outer.top+(1-center.y)*rect.height/2-42)) + "px";
    }
    if (opened || context.focus) highlight(opened?.key || context.focus); else clearOutline();
  }
  requestAnimationFrame(frame);
  return {open, close};
}
