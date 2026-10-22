/** Two immutable tank scenes, one existing WebGL context and the existing models. */
export function createTankViews(host) {
  let main = null, entries = [], last = 0, frames = 0, error = null, drawTimes = [];
  const dispose = () => {
    if (main) {main.learningDraw = null; main.renderer.setScissorTest(false);}
    for (const e of entries) e.view.destroy();
    entries = []; main?.resize(); main = null;
  };
  function update(root, sides, onSelect, selected) {
    const source = host.comparisonRenderer?.();
    if (!source) {error = "Die 3D-Ansicht ist hier nicht verfügbar. Die Messwerte bleiben lesbar."; return;}
    main = source;
    for (const side of ["control", "test"]) {
      const container = root.querySelector(`[data-tank-viewport="${side}"]`), data = sides[side];
      container?.addEventListener("assetfailed",event=>{
        error="Ein Modell konnte nicht geladen werden: "+event.detail+". Deine Messwerte bleiben erhalten.";
        const status=root.querySelector("[data-workspace-render-status]");if(status)status.textContent=error;
      });
      let entry = entries.find(e => e.side === side);
      if (!container || !data.state) {
        if (entry) {entry.view.destroy(); entries = entries.filter(e => e !== entry);}
        continue;
      }
      if (entry && entry.stateId !== data.stateId) {
        entry.view.destroy(); entries = entries.filter(e => e !== entry); entry = null;
      }
      if (!entry) {
        const view = host.createComparisonView(container, data.state, uid => onSelect(side, uid));
        entry = {side, stateId: data.stateId, view}; entries.push(entry);
      }
      entry.view.container = container;
      entry.view.selected = selected?.side === side ? selected.uid : null;
      entry.view.resize();
      container.addEventListener("pointerup", event => {
        if (event.target.closest("button")) return;
        const v = entry.view, rect = container.getBoundingClientRect();
        v.pointer.set(2*(event.clientX-rect.left)/rect.width-1, 1-2*(event.clientY-rect.top)/rect.height);
        v.raycaster.setFromCamera(v.pointer, v.camera);
        const hit = v.raycaster.intersectObjects([...v.objects.values()].map(o=>o.group), true)[0];
        let object = hit?.object;
        while (object && !object.userData.uid) object = object.parent;
        if (object) onSelect(side, object.userData.uid);
      });
    }
    main.learningDraw = () => {
      const now = performance.now();
      if (now-last < 1000/24 || document.hidden) return;
      last = now;
      const renderer = main.renderer, outer = renderer.domElement.getBoundingClientRect();
      renderer.setScissorTest(false); renderer.clear(); renderer.setScissorTest(true);
      try {
        for (const e of entries) {
          const r = e.view.container.getBoundingClientRect();
          if (!r.width || !r.height || r.bottom < 0 || r.top > innerHeight) continue;
          const clip = root.querySelector(".coherent-views").getBoundingClientRect();
          const left=Math.max(r.left,clip.left,outer.left),right=Math.min(r.right,clip.right,outer.right);
          const top=Math.max(r.top,clip.top,outer.top),bottom=Math.min(r.bottom,clip.bottom,outer.bottom);
          if (right<=left || bottom<=top) continue;
          const x = r.left-outer.left, y = outer.bottom-r.bottom;
          if (Math.abs(e.view.camera.aspect-r.width/r.height) > .0001) e.view.resize();
          const focusDevice=e.side === "test" && document.documentElement.classList.contains("device-adjusting");
          const focusObject=focusDevice ? e.view.tank.children.find(o=>o.name.startsWith("equipment:heater:")) :
            selected?.side === e.side && selected.uid ? e.view.objects.get(selected.uid)?.group : null;
          const focusKey=focusDevice ? "heater" : focusObject ? "fish-"+selected.uid : "overview";
          if (e.focusKey !== focusKey) {e.view.resize();e.focusKey=focusKey;}
          e.view.camera.zoom=focusObject ? 2.3 : 1;e.view.camera.updateProjectionMatrix();
          if (focusObject) {focusObject.getWorldPosition(e.view.controls.target);e.view.controls.update();}
          renderer.setViewport(x,y,r.width,r.height); renderer.setScissor(left-outer.left,outer.bottom-bottom,right-left,bottom-top);
          e.view.animate();
        }
        drawTimes.push(performance.now()-now);if(drawTimes.length>120)drawTimes.shift();
        frames++;
      } catch (e) {
        error = "Die 3D-Ansicht konnte nicht gezeichnet werden. Deine Messwerte sind gespeichert.";
        root.querySelector("[data-workspace-render-status]").textContent = error;
        console.error("Learning tank view", e);
      } finally {
        renderer.setScissorTest(false); renderer.setViewport(0,0,outer.width,outer.height);
      }
    };
  }
  return {update, dispose, get: side => entries.find(e=>e.side===side)?.view,
    snapshot: () => ({frames, error, contexts: main ? 1 : 0,
      drawMilliseconds:drawTimes.length ? {samples:drawTimes.length,mean:drawTimes.reduce((a,b)=>a+b,0)/drawTimes.length,max:Math.max(...drawTimes)} : null,
      memory:main ? {...main.renderer.info.memory} : null,
      sides: entries.map(e=>({side:e.side,stateId:e.stateId,objects:e.view.objects.size,
        detailModels:[...e.view.objects.values()].filter(o=>o.group.userData.natural).length,
        ids:[...e.view.objects.keys()],day:e.view.state.day,seed:e.view.state.seed}))})};
}
