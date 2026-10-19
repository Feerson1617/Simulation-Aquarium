/** Aquascaping phase 1. Original procedural assets; no external services or dependencies. */
export const AQUASCAPING_DECOR = [
  { id: 'spiderwood', name: 'Verzweigte Fingerwurzel', shape: 'spiderwood', color: '#846046', water: 'fresh', minL: 60,
    footprint: [.78, .49], description: 'Fein verzweigtes Holz für Süßwasser. Zwischen den Ästen finden kleine Tiere Deckung; die Oberfläche kann Biofilme tragen. Holz vor dem Einsatz wässern.' },
  { id: 'mopani', name: 'Knorrige Savannenwurzel', shape: 'mopani', color: '#5f4030', water: 'fresh', minL: 60,
    footprint: [.65, .44], description: 'Eine schwere, knorrige Süßwasserwurzel mit ausgewaschenen Vertiefungen. Sie schafft Schatten und Aufsitzflächen. Abgegebene Huminstoffe werden im aktuellen Modell nicht zusätzlich berechnet.' },
  { id: 'slate', name: 'Geschichtete Schieferterrasse', shape: 'slate', color: '#66737a', water: 'both', minL: 30,
    footprint: [.70, .46], description: 'Flache, versetzt geschichtete Steinplatten bilden Vorsprünge und geschützte Spalten. Die Struktur gliedert Reviere und bietet Aufsitzflächen; keine automatische Filterwirkung.' },
  { id: 'dragonstone', name: 'Zerklüfteter Drachenstein', shape: 'dragonstone', color: '#a28a61', water: 'fresh', minL: 60,
    footprint: [.55, .40], description: 'Warme Ockerfarben, markante Grate und ausgewaschene Mulden für Süßwasser-Aquascapes. Vor dem Einsetzen gründlich reinigen. Das Spiel leitet aus der Gesteinsform keine garantierten Wasserwerte ab.' },
  { id: 'basaltarch', name: 'Dunkler Basaltbogen', shape: 'basaltarch', color: '#414b4d', water: 'both', minL: 60,
    footprint: [.77, .46], description: 'Ein dunkler Felsbogen mit tatsächlich offenem Durchgang. Er schafft einen Unterschlupf und unterbricht Sichtachsen. Für Süß- und Meerwasser verwendbar.' },
  { id: 'reefcave', name: 'Poröse Riffhöhle', shape: 'reefcave', color: '#c8c1a6', water: 'salt', minL: 120,
    footprint: [.77, .49], description: 'Helles, porös wirkendes Riffgestein mit einer offenen Höhle und Aufsitzflächen für Meerwasser. Die Oberfläche kann von Biofilmen besiedelt werden. Besiedlung und Mineralabgabe werden noch nicht gesondert simuliert.' },
].map(item => ({ ...item, aquascape: true }));

const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
export const isMovable = (entity, species) => !!species && !entity.dead && ['plant', 'decor'].includes(species.category);
const floating = species => species.shape === 'floating';

/** Conservative footprints in tank coordinates, including rotation and displayed size. */
export function footprint(entity, species) {
  const size = species.footprint || (species.category === 'plant' ? [.13, .13]
    : { root: [.73, .44], stone: [.58, .43], reefrock: [.59, .44], cave: [.67, .38], shell: [.24, .16] }[species.shape] || [.35, .35]);
  const scale = Number.isFinite(entity.scale) ? entity.scale : 1;
  const c = Math.abs(Math.cos(entity.rotation || 0)), s = Math.abs(Math.sin(entity.rotation || 0));
  return { x: (size[0] * c + size[1] * s) * scale, z: (size[0] * s + size[1] * c) * scale };
}

export function placementCandidate(state, entity, speciesById, x, z) {
  const species = speciesById[entity.species];
  if (!isMovable(entity, species) || !Number.isFinite(x) || !Number.isFinite(z)) return { valid: false, reason: 'Dieses Objekt lässt sich nicht mit der Pinzette bewegen.' };
  const half = footprint(entity, species);
  const maxX = Math.min(3.2, 3.45 - half.x), maxZ = Math.min(1.3, 1.50 - half.z);
  if (maxX < 0 || maxZ < 0) return { valid: false, reason: 'Das Objekt ist für diese Fläche zu groß.' };
  x = clamp(x, -maxX, maxX); z = clamp(z, -maxZ, maxZ);
  const candidate = { x, z };
  const intersects = (otherX, otherZ, otherHalf) => Math.abs(x - otherX) < half.x + otherHalf.x + .035
    && Math.abs(z - otherZ) < half.z + otherHalf.z + .035;
  for (const other of state.entities) {
    if (other.uid === entity.uid || other.dead) continue;
    const type = speciesById[other.species];
    if (!type || !['plant', 'decor', 'coral'].includes(type.category) || floating(species) !== floating(type)) continue;
    if (intersects(other.x, other.z, footprint(other, type))) return { ...candidate, valid: false, reason: 'Hier steht bereits eine Pflanze oder feste Einrichtung.' };
  }
  if (!floating(species)) {
    const fixed = [];
    if (['sponge', 'internal120', 'internal240'].includes(state.filter)) fixed.push([2.97, -1.34, .20, .20]);
    else if (state.filter !== 'none') fixed.push([3.25, -1.3, .07, .08]);
    if (state.heater) fixed.push([-3.2, -1.4, .10, .12]);
    if (state.skimmer) fixed.push([-3.2, -1.25, .20, .20]);
    if (fixed.some(([fx, fz, hx, hz]) => intersects(fx, fz, { x: hx, z: hz }))) return { ...candidate, valid: false, reason: 'Halte Abstand zur festen Technik.' };
  }
  return { ...candidate, valid: true, reason: '' };
}

export function findFreePosition(state, entity, speciesById) {
  const first = placementCandidate(state, entity, speciesById, entity.x, entity.z);
  if (first.valid) return first;
  const spots = [];
  for (let x = -3; x <= 3.01; x += .3) for (let z = -1.2; z <= 1.21; z += .3) spots.push({ x, z });
  spots.sort((a, b) => Math.hypot(a.x - entity.x, a.z - entity.z) - Math.hypot(b.x - entity.x, b.z - entity.z));
  for (const spot of spots) {
    const candidate = placementCandidate(state, entity, speciesById, spot.x, spot.z);
    if (candidate.valid) return candidate;
  }
  return null;
}

export function substrateHeight(state, x, z) {
  return state.substrate === 'bare' ? .065 : .24 + Math.sin(x * 2) * .04 - z * .04;
}

/** Bundle named local modules, styles and catalog images into the existing download. */
export async function createStandaloneDocument(baseURL, fetchResource = fetch) {
  const read = async path => { const response=await fetchResource(new URL(path,baseURL));if(!response.ok)throw new Error('Die Spieldatei konnte nicht vollständig geladen werden.');return response; };
  let html=await (await read('./index.html')).text();
  const script=html.match(/<script type="module">([\s\S]*?)<\/script>/);
  if(!script)throw new Error('Spielmodul fehlt.');
  const modules=new Map(),ordered=[],imports=/^import \{([^}]+)\} from ["'](\.\/[^"']+\.mjs)["'];?\s*$/gm;
  const visit=async path=>{if(modules.has(path))return modules.get(path);let source=await (await read(path)).text();const id='__aquariumModule'+modules.size;modules.set(path,id);for(const match of [...source.matchAll(imports)])await visit(match[2]);ordered.push({path,id,source});return id;};
  for(const match of [...script[1].matchAll(imports)])await visit(match[2]);
  const rewrite=source=>source.replace(imports,(_all,names,path)=>'const {'+names.replace(/\bas\b/g,':')+'}='+modules.get(path)+';');
  const chunks=[];
  for(const module of ordered){let source=module.source;const exports=[...source.matchAll(/^export (?:async )?(?:function|class|const|let) (\w+)/gm)].map(m=>m[1]);
    const assets=[...new Set([...source.matchAll(/["'](\.\/assets\/(?:catalog|realism|species)\/[^"']+\.(?:webp|glb))["']/g)].map(m=>m[1]))];
    for(let i=0;i<assets.length;i+=4)await Promise.all(assets.slice(i,i+4).map(async path=>{const bytes=new Uint8Array(await (await read(path)).arrayBuffer());let binary='';for(let j=0;j<bytes.length;j++)binary+=String.fromCharCode(bytes[j]);source=source.split(path).join((path.endsWith('.glb')?'data:model/gltf-binary;base64,':'data:image/webp;base64,')+btoa(binary));}));
    source=rewrite(source).replace(/^export (?=(?:async )?(?:function|class|const|let)\b)/gm,'');chunks.push('const '+module.id+'=(()=>{'+source+'\nreturn {'+exports.join(',')+'};})();');
  }
  const bundled=(chunks.join('\n')+'\n'+rewrite(script[1])).replace(/<\/script/gi,'<\\/script');
  html=html.replace(script[0],()=>'<script type="module">'+bundled+'</script>');
  const links=[...html.matchAll(/<link rel="stylesheet" href="(\.\/[^" ]+\.css)">/g)];
  for(const [tag,path] of links){const css=await (await read(path)).text();html=html.replace(tag,()=>'<style>'+css+'</style>');}
  return html;
}

function surfaceTexture(T, kind, seed) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d'), image = ctx.createImageData(128, 128);
  for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
    const noise = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
    const grain = noise - Math.floor(noise);
    let light = 155 + grain * 55;
    if (kind === 'wood') light -= Math.pow(Math.abs(Math.sin(x * .22 + Math.sin(y * .025) * 1.8)), 12) * 75;
    else if (kind === 'slate') light -= Math.pow(Math.abs(Math.sin(y * .21 + Math.sin(x * .04))), 14) * 55;
    else light -= Math.pow(Math.abs(Math.sin(x * .17) * Math.cos(y * .23)), 18) * 100;
    const i = (y * 128 + x) * 4;
    image.data[i] = image.data[i + 1] = image.data[i + 2] = light;
    image.data[i + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  const texture = new T.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = T.RepeatWrapping;
  texture.repeat.set(kind === 'wood' ? 2 : 1, 1);
  texture.colorSpace = T.SRGBColorSpace;
  return texture;
}

/** Detailed but bounded procedural meshes, merged by the existing renderer afterwards. */
export function createAquascapeDecoration(entity, species, T) {
  if (!species.aquascape) return null;
  const group = new T.Group();
  const kind = ['spiderwood', 'mopani'].includes(species.shape) ? 'wood' : species.shape === 'slate' ? 'slate' : 'rock';
  const texture = surfaceTexture(T, kind, entity.uid);
  const material = new T.MeshStandardMaterial({ color: species.color, map: texture, bumpMap: texture, bumpScale: .035, roughness: .9 });
  const dark = new T.MeshStandardMaterial({ color: kind === 'wood' ? '#3f3027' : '#777a69', map: texture, roughness: .98 });
  const add = (geometry, mat, x, y, z, scale = [1, 1, 1]) => {
    const mesh = new T.Mesh(geometry, mat);
    mesh.position.set(x, y, z); mesh.scale.set(...scale); mesh.castShadow = mesh.receiveShadow = true;
    group.add(mesh); return mesh;
  };
  const rock = (x, y, z, sx, sy, sz, index = 0, mat = material) => {
    const geometry = new T.IcosahedronGeometry(1, 2), p = geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      // Coordinate-based deformation keeps duplicate vertices coincident at face seams.
      const px = p.getX(i), py = p.getY(i), pz = p.getZ(i);
      const d = 1 + Math.sin(px * 8 + index) * Math.sin(py * 7 - pz * 6) * .13;
      p.setXYZ(i, px * d, py * d, pz * d);
    }
    geometry.computeVertexNormals();
    return add(geometry, mat, x, y, z, [sx, sy, sz]);
  };
  const branch = (points, radius, mat = material) => {
    for (let i = 1; i < points.length; i++) {
      const a = new T.Vector3(...points[i - 1]), b = new T.Vector3(...points[i]);
      const delta = b.clone().sub(a), taper = 1 - (i - 1) / points.length * .7;
      const mesh = add(new T.CylinderGeometry(radius * taper * .65, radius * taper, delta.length(), 9), mat,
        (a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
      mesh.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize());
    }
  };
  switch (species.shape) {
    case 'spiderwood':
      rock(0, .15, 0, .24, .16, .22);
      for (let i = 0; i < 7; i++) {
        const angle = i * 2.4, x = Math.cos(angle), z = Math.sin(angle);
        branch([[x * .62, .025, z * .36], [x * .30, .16, z * .20], [0, .28, 0], [x * .22, .65, z * .12], [x * .43, .96 - i * .045, z * .24]], .065);
      }
      break;
    case 'mopani':
      rock(-.13, .22, 0, .42, .26, .28);
      rock(.18, .48, -.04, .24, .45, .22, 2);
      branch([[-.59, .03, .21], [-.24, .16, .13], [.16, .4, -.06], [.42, .70, -.18]], .14);
      branch([[.58, .04, .18], [.30, .14, .09], [.04, .37, -.08]], .12);
      rock(.13, .78, -.025, .15, .09, .15, 4, dark);
      break;
    case 'slate':
      for (let i = 0; i < 5; i++) {
        const plate = rock((i % 2 ? .13 : -.10), .08 + i * .115, (i % 3 - 1) * .07, .49 - i * .035, .065, .31, i);
        plate.rotation.y = i * .22;
      }
      rock(-.48, .10, .22, .14, .10, .16, 8, dark);
      break;
    case 'dragonstone':
      for (let i = 0; i < 5; i++) {
        const stone = rock((i - 2) * .14, .39 - Math.abs(i - 2) * .07, (i % 2 ? .12 : -.10), .14, .44 - Math.abs(i - 2) * .06, .22, i);
        stone.rotation.z = -.22;
      }
      for (let i = 0; i < 9; i++) rock((i % 3 - 1) * .19, .18 + Math.floor(i / 3) * .19, .15, .055, .035, .025, i, dark);
      break;
    case 'basaltarch':
    case 'reefcave': {
      const reef = species.shape === 'reefcave';
      for (let i = 0; i < 9; i++) {
        const angle = i / 8 * Math.PI;
        rock(Math.cos(angle) * .48, .12 + Math.sin(angle) * .51, Math.sin(i * 2) * .045,
          .20, .19, reef ? .33 : .28, i);
      }
      if (reef) for (let i = 0; i < 12; i++) {
        const angle = i / 11 * Math.PI;
        rock(Math.cos(angle) * .48, .13 + Math.sin(angle) * .52, .30, .035, .025, .015, i, dark);
      }
      break;
    }
  }
  // The host batches meshes by material. All geometries in a batch must use
  // the same indexing scheme (icosahedra are non-indexed, cylinders are indexed).
  group.traverse(mesh => {
    if (mesh.isMesh && mesh.geometry.index) {
      const indexed = mesh.geometry;
      mesh.geometry = indexed.toNonIndexed(); indexed.dispose();
    }
  });
  return group;
}

export class AquascapingController {
  constructor(view, T, speciesById, { onCommit, onModeChange, onMessage }) {
    this.view = view; this.T = T; this.species = speciesById;
    this.onCommit = onCommit; this.onModeChange = onModeChange; this.onMessage = onMessage;
    this.canvas = view.renderer.domElement; this.enabled = false; this.drag = null; this.release = null;
    this.selected = null; this.bottomCache = new Map(); this.listeners = [];
    this.tool = this.buildTweezers(); this.tool.visible = false; view.life.add(this.tool);
    this.marker = new T.Mesh(new T.TorusGeometry(.23, .012, 5, 36), new T.MeshBasicMaterial({ color: '#d9d7a3', depthTest: false, transparent: true, opacity: .9 }));
    this.marker.rotation.x = -Math.PI / 2; this.marker.renderOrder = 24; this.marker.visible = false;
    view.life.add(this.marker);
    this.canvas.tabIndex = 0;
    this.canvas.setAttribute('aria-describedby', 'aquascape-instructions');
    const listen = (target, type, fn) => { target.addEventListener(type, fn, true); this.listeners.push([target, type, fn]); };
    listen(this.canvas, 'pointerdown', event => this.pointerDown(event));
    listen(this.canvas, 'pointermove', event => this.pointerMove(event));
    listen(this.canvas, 'pointerup', event => this.pointerUp(event));
    listen(this.canvas, 'pointercancel', event => this.pointerCancel(event));
    listen(this.canvas, 'lostpointercapture', event => { if (this.drag?.pointerId === event.pointerId) this.cancelDrag(); });
    listen(this.canvas, 'wheel', event => { if (this.enabled) this.consume(event); });
    listen(window, 'keydown', event => this.keyDown(event));
    listen(window, 'blur', () => this.cancelDrag());
    listen(window, 'resize', () => this.cancelDrag());
    listen(document, 'visibilitychange', () => { if (document.hidden) this.cancelDrag(); });
    listen(this.canvas, 'webglcontextlost', () => this.setEnabled(false));
  }

  buildTweezers() {
    const T = this.T, tool = new T.Group();
    const steel = new T.MeshStandardMaterial({ color: '#bbc9ca', roughness: .24, metalness: .85 });
    const grip = new T.MeshStandardMaterial({ color: '#77888c', roughness: .36, metalness: .75 });
    this.jaws = [];
    for (const side of [-1, 1]) {
      const pivot = new T.Group(); pivot.position.y = 1.65;
      const curve = new T.CatmullRomCurve3([
        new T.Vector3(side * .025, 0, 0), new T.Vector3(side * .085, -.65, -.025),
        new T.Vector3(side * .09, -1.30, 0), new T.Vector3(side * .055, -1.65, .07),
      ]);
      const arm = new T.Mesh(new T.TubeGeometry(curve, 16, .022, 6, false), steel);
      pivot.add(arm);
      const tip = new T.Mesh(new T.BoxGeometry(.035, .13, .07), grip);
      tip.position.set(side * .055, -1.60, .07); pivot.add(tip);
      // Shallow ribs are a single reusable grip mesh per arm rather than many draw calls.
      const sleeve = new T.Mesh(new T.CylinderGeometry(.032, .027, .42, 8), grip);
      sleeve.position.set(side * .075, -.52, -.02); pivot.add(sleeve);
      pivot.userData.side = side; tool.add(pivot); this.jaws.push(pivot);
    }
    const bridge = new T.Mesh(new T.SphereGeometry(.055, 10, 6), steel);
    bridge.scale.set(1, 1.5, .6); bridge.position.y = 1.65; tool.add(bridge);
    tool.rotation.y = -.35;
    tool.traverse(mesh => { if (mesh.isMesh) mesh.castShadow = true; });
    return tool;
  }

  consume(event) { event.preventDefault(); event.stopImmediatePropagation(); }

  setEnabled(enabled, uid = null) {
    enabled = !!enabled && this.view.interactive !== false && this.view.state.tankPlaced !== false;
    this.cancelDrag(); this.finishRelease();
    this.enabled = enabled;
    if (enabled) {
      this.view.placeUid = null;
      const damping = this.view.controls.enableDamping;
      this.view.controls.enableDamping = false; this.view.controls.update(); this.view.controls.enableDamping = damping;
      if (uid !== null) this.selected = uid;
      this.canvas.focus({ preventScroll: true });
    }
    this.view.controls.enabled = !enabled && this.view.interactive !== false && !this.view.placeUid;
    this.canvas.style.cursor = enabled ? 'grab' : '';
    this.view.container.dataset.tweezers = String(enabled);
    this.onModeChange?.(enabled);
  }

  reset() { this.setEnabled(false); this.selected = null; this.bottomCache.clear(); }

  ray(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.view.pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    this.view.camera.updateMatrixWorld();
    this.view.raycaster.setFromCamera(this.view.pointer, this.view.camera);
    return this.view.raycaster;
  }

  groundPoint(event, entity) {
    const T = this.T, type = this.species[entity.species];
    const y = floating(type) ? 3.43 : substrateHeight(this.view.state, entity.x, entity.z);
    const point = new T.Vector3();
    if (!this.ray(event).ray.intersectPlane(new T.Plane(new T.Vector3(0, 1, 0), -y), point)) return null;
    return { x: point.x / this.view.life.scale.x, z: point.z };
  }

  pick(event) {
    this.view.scene.updateMatrixWorld(true);
    const hits = this.ray(event).intersectObjects([...this.view.objects.values()].map(item => item.group), true);
    if (hits.length) {
      let node = hits[0].object;
      while (node && !node.userData.uid) node = node.parent;
      const entity = this.view.state.entities.find(item => item.uid === node?.userData.uid);
      return entity && isMovable(entity, this.species[entity.species]) ? entity : null;
    }
    // Small touch targets get a modest screen-space tolerance; animals remain excluded.
    const tolerance = event.pointerType === 'touch' ? 32 : 16;
    let nearest = null, distance = tolerance;
    for (const entity of this.view.state.entities) {
      if (!isMovable(entity, this.species[entity.species])) continue;
      const item = this.view.objects.get(entity.uid);
      if (!item?.group.visible) continue;
      const screen = this.screenPosition(item.group);
      const d = Math.hypot(screen.x - event.clientX, screen.y - event.clientY);
      if (d < distance) { nearest = entity; distance = d; }
    }
    return nearest;
  }

  pointerDown(event) {
    if (!this.enabled) return;
    this.consume(event);
    if (this.drag || event.isPrimary === false || event.button !== 0) return;
    this.finishRelease();
    const entity = this.pick(event);
    if (!entity) { this.onMessage?.('Greife eine Pflanze oder Dekoration. Tiere werden nicht verschoben.'); return; }
    const point = this.groundPoint(event, entity);
    if (!point) return;
    this.selected = entity.uid; this.view.select(entity.uid);
    this.drag = { entity, pointerId: event.pointerId, original: { x: entity.x, z: entity.z, aquascapePlaced: entity.aquascapePlaced },
      offset: { x: entity.x - point.x, z: entity.z - point.z }, last: { x: entity.x, z: entity.z }, age: 0, blocked: false };
    this.canvas.setPointerCapture(event.pointerId);
    this.canvas.style.cursor = 'grabbing'; this.canvas.focus({ preventScroll: true });
    this.onMessage?.('Gegriffen. Ziehen zum Versetzen · Esc bricht ab.');
  }

  pointerMove(event) {
    if (!this.enabled) return;
    this.consume(event);
    if (!this.drag || this.drag.pointerId !== event.pointerId) return;
    const d = this.drag, point = this.groundPoint(event, d.entity);
    if (!point) return;
    const candidate = placementCandidate(this.view.state, d.entity, this.species, point.x + d.offset.x, point.z + d.offset.z);
    const wasBlocked = d.blocked;
    d.blocked = !candidate.valid;
    if (candidate.valid) {
      d.last = { x: candidate.x, z: candidate.z };
    }
    if (d.blocked !== wasBlocked) this.onMessage?.(d.blocked ? candidate.reason + ' Beim Loslassen bleibt die letzte freie Stelle.' : 'Freie Stelle. Loslassen setzt das Objekt ab.');
    this.marker.material.color.set(d.blocked ? '#df927f' : '#d9d7a3');
  }

  pointerUp(event) {
    if (!this.enabled) return;
    this.consume(event);
    if (!this.drag || this.drag.pointerId !== event.pointerId) return;
    this.pointerMove(event);
    const d = this.drag;
    this.drag = null;
    if (this.canvas.hasPointerCapture(event.pointerId)) this.canvas.releasePointerCapture(event.pointerId);
    const moved = Math.hypot(d.last.x - d.original.x, d.last.z - d.original.z) > .0001;
    let stored = true;
    if (moved) {
      d.entity.x = d.last.x; d.entity.z = d.last.z;
      d.entity.aquascapePlaced = true; stored = this.onCommit?.(d.entity) !== false;
    }
    this.release = { entity: d.entity, age: 0, lifted: Math.min(1, d.age / .16) * .16 };
    this.canvas.style.cursor = 'grab';
    this.onMessage?.(moved ? stored ? 'Abgesetzt und gespeichert. Du kannst das nächste Objekt greifen.' : 'Abgesetzt. Browserspeicherung gesperrt – sichere deinen Spielstand als Datei.' : 'Position beibehalten. Ziehe das Objekt an eine freie Stelle.');
  }

  pointerCancel(event) { if (this.enabled) this.consume(event); if (this.drag?.pointerId === event.pointerId) this.cancelDrag(); }

  cancelDrag() {
    const d = this.drag;
    if (!d) return;
    this.drag = null;
    d.entity.x = d.original.x; d.entity.z = d.original.z;
    if (d.original.aquascapePlaced === undefined) delete d.entity.aquascapePlaced;
    else d.entity.aquascapePlaced = d.original.aquascapePlaced;
    if (this.canvas.hasPointerCapture(d.pointerId)) this.canvas.releasePointerCapture(d.pointerId);
    this.tool.visible = false; this.marker.visible = false; this.canvas.style.cursor = this.enabled ? 'grab' : '';
    this.onMessage?.('Verschieben abgebrochen. Die Ausgangsposition bleibt erhalten.');
  }

  finishRelease() { this.release = null; this.tool.visible = false; this.marker.visible = false; }

  keyDown(event) {
    if (!this.enabled) return;
    if (event.key === 'Escape') { this.consume(event); this.setEnabled(false); return; }
    if (document.activeElement !== this.canvas || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    this.consume(event);
    if (this.drag) return;
    const entity = this.view.state.entities.find(item => item.uid === this.selected);
    if (!entity || !isMovable(entity, this.species[entity.species])) return;
    this.finishRelease();
    const step = event.shiftKey ? .3 : .1;
    const candidate = placementCandidate(this.view.state, entity, this.species,
      entity.x + (event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0),
      entity.z + (event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0));
    if (!candidate.valid) { this.onMessage?.(candidate.reason); return; }
    entity.x = candidate.x; entity.z = candidate.z; entity.aquascapePlaced = true;
    this.release = { entity, age: 0, lifted: .08 };
    const stored = this.onCommit?.(entity) !== false;
    this.onMessage?.(stored ? 'Position mit Pfeiltasten angepasst und gespeichert.' : 'Position angepasst. Browserspeicherung gesperrt – sichere deinen Spielstand als Datei.');
  }

  bottomOffset(item) {
    const group = item.group, key = group.uuid + ':' + group.scale.y.toFixed(4);
    let cached = this.bottomCache.get(group.userData.uid);
    if (cached?.key !== key) {
      group.updateWorldMatrix(true, true);
      const box = new this.T.Box3().setFromObject(group);
      cached = { key, offset: Number.isFinite(box.min.y) ? box.min.y - group.position.y : 0,
        height: Number.isFinite(box.max.y) ? Math.max(.1, box.max.y - box.min.y) : .3 };
      this.bottomCache.set(group.userData.uid, cached);
    }
    return cached;
  }

  update(dt) {
    const active = this.drag || this.release;
    if (active) this.view.selection.visible = false;
    if (active) active.age += dt;
    if (active && !this.view.state.entities.includes(active.entity)) { this.cancelDrag(); this.finishRelease(); }
    for (const entity of this.view.state.entities) {
      if (!entity.aquascapePlaced && this.drag?.entity !== entity && this.release?.entity !== entity) continue;
      const type = this.species[entity.species], item = this.view.objects.get(entity.uid);
      if (!item || !isMovable(entity, type) || !item.group.children.length) continue;
      const position = this.drag?.entity === entity ? this.drag.last : entity;
      const bottom = this.bottomOffset(item);
      const lift = this.drag?.entity === entity ? Math.min(1, this.drag.age / .16) * .16
        : this.release?.entity === entity ? this.release.lifted * Math.max(0, 1 - this.release.age / .25) : 0;
      const y = floating(type) ? 3.43 : substrateHeight(this.view.state, position.x, position.z) - bottom.offset;
      item.group.position.x = position.x; item.group.position.z = position.z;
      item.group.position.y = y + lift;
      if (this.drag?.entity === entity || this.release?.entity === entity) {
        this.tool.visible = true; this.marker.visible = true;
        const open = this.drag ? 1 - Math.min(1, this.drag.age / .16) : Math.min(1, this.release.age / .18);
        const graspHeight = Math.min(.6, bottom.height * .6);
        this.tool.position.set(position.x, y + graspHeight + lift + open * .10, position.z);
        for (const jaw of this.jaws) jaw.rotation.z = jaw.userData.side * (.015 + open * .13);
        this.marker.position.set(position.x, floating(type) ? 3.44 : substrateHeight(this.view.state, position.x, position.z) + .025, position.z);
      }
    }
    if (this.release && this.release.age > .30) this.finishRelease();
    if (!this.drag && !this.release) { this.tool.visible = false; this.marker.visible = false; }
  }

  screenPosition(group) {
    group.updateWorldMatrix(true, true);
    const box = new this.T.Box3().setFromObject(group);
    const point = box.isEmpty() ? group.getWorldPosition(new this.T.Vector3()) : box.getCenter(new this.T.Vector3());
    point.project(this.view.camera);
    const rect = this.canvas.getBoundingClientRect();
    return { x: rect.left + (point.x + 1) / 2 * rect.width, y: rect.top + (1 - point.y) / 2 * rect.height };
  }

  inspect() {
    return { enabled: this.enabled, phase: this.drag ? 'dragging' : this.release ? 'releasing' : 'idle', selected: this.selected,
      blocked: this.drag?.blocked || false, toolVisible: this.tool.visible, camera: this.view.camera.position.toArray(),
      preview: this.drag ? { ...this.drag.last } : null, jawAngles: this.jaws.map(jaw => jaw.rotation.z),
      targets: this.view.state.entities.filter(entity => isMovable(entity, this.species[entity.species])).map(entity => {
        const item = this.view.objects.get(entity.uid);
        const bounds = item ? new this.T.Box3().setFromObject(item.group) : null;
        return { uid: entity.uid, species: entity.species, x: entity.x, z: entity.z,
          bottomY: bounds && !bounds.isEmpty() ? bounds.min.y : null,
          screen: item ? this.screenPosition(item.group) : null };
      }) };
  }

  destroy() {
    this.reset();
    for (const [target, type, fn] of this.listeners) target.removeEventListener(type, fn, true);
    this.listeners = [];
    const geometries = new Set(), materials = new Set();
    for (const object of [this.tool, this.marker]) {
      object.removeFromParent();
      object.traverse(node => { if (node.isMesh) { geometries.add(node.geometry); materials.add(node.material); } });
    }
    geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
  }
}
