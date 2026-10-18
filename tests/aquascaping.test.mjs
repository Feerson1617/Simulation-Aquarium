import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { AQUASCAPING_DECOR, createStandaloneDocument, findFreePosition, footprint, isMovable, placementCandidate, substrateHeight } from '../aquascaping.mjs';

const types = Object.fromEntries([
  ...AQUASCAPING_DECOR.map(item => ({ ...item, category: 'decor' })),
  { id: 'plant', category: 'plant' }, { id: 'floating', category: 'plant', shape: 'floating' },
  { id: 'fish', category: 'fish' }, { id: 'coral', category: 'coral' },
  { id: 'stone', category: 'decor', shape: 'stone' },
].map(item => [item.id, item]));
const entity = (species = 'plant', extra = {}) => ({ uid: 1, species, x: 0, z: 0, scale: 1, rotation: 0, dead: false, ...extra });
const state = (entities = [], extra = {}) => ({ entities, filter: 'none', heater: false, skimmer: false, substrate: 'sand', ...extra });

test('six distinct decorations declare their intended water and physical footprint', () => {
  assert.equal(AQUASCAPING_DECOR.length, 6);
  assert.equal(new Set(AQUASCAPING_DECOR.map(item => item.id)).size, 6);
  assert.equal(new Set(AQUASCAPING_DECOR.map(item => item.shape)).size, 6);
  assert.deepEqual(new Set(AQUASCAPING_DECOR.map(item => item.water)), new Set(['fresh', 'both', 'salt']));
  for (const item of AQUASCAPING_DECOR) assert.ok(item.footprint.every(value => value > 0) && item.description.length > 80);
});

test('only living plants and decoration can be manipulated', () => {
  assert.equal(isMovable(entity(), types.plant), true);
  assert.equal(isMovable(entity('stone'), types.stone), true);
  assert.equal(isMovable(entity('fish'), types.fish), false);
  assert.equal(isMovable(entity('coral'), types.coral), false);
  assert.equal(isMovable(entity('plant', { dead: true }), types.plant), false);
  assert.equal(isMovable(entity('unknown'), undefined), false);
});

test('tank limits include rotated, scaled footprints and retain old save-file bounds', () => {
  for (const item of AQUASCAPING_DECOR) for (const rotation of [0, Math.PI / 4, Math.PI / 2, 2.8]) {
    const object = entity(item.id, { rotation, scale: 1.7 });
    const half = footprint(object, types[item.id]);
    for (const sign of [-1, 1]) {
      const position = placementCandidate(state(), object, types, sign * 100, sign * 100);
      if (half.x > 3.45 || half.z > 1.50) {
        assert.equal(position.valid, false, 'An oversized rotated footprint must be rejected');
        continue;
      }
      assert.equal(position.valid, true, item.id);
      assert.ok(Math.abs(position.x) + half.x <= 3.450001);
      assert.ok(Math.abs(position.z) + half.z <= 1.500001);
      assert.ok(Math.abs(position.x) <= 3.2 && Math.abs(position.z) <= 1.3);
    }
  }
});

test('non-finite coordinates and oversized objects cannot enter the simulation', () => {
  assert.equal(placementCandidate(state(), entity(), types, NaN, 0).valid, false);
  assert.equal(placementCandidate(state(), entity(), types, 0, Infinity).valid, false);
  assert.equal(placementCandidate(state(), entity('spiderwood', { scale: 50 }), types, 0, 0).valid, false);
});

test('overlap with solid decoration and plant bases is rejected, including rotations', () => {
  const obstacle = entity('spiderwood', { uid: 2, x: 1, z: 0, rotation: Math.PI / 3 });
  assert.equal(placementCandidate(state([obstacle]), entity(), types, 1, 0).valid, false);
  assert.equal(placementCandidate(state([obstacle]), entity(), types, -2, .9).valid, true);
  assert.equal(placementCandidate(state([entity('plant', { uid: 3 })]), entity(), types, .1, 0).valid, false);
});

test('the manipulated object does not collide with its own old position', () => {
  const object = entity('stone');
  assert.equal(placementCandidate(state([object]), object, types, 0, 0).valid, true);
});

test('floating plants use the surface layer rather than colliding with floor decor', () => {
  const floatingPlant = entity('floating');
  assert.equal(placementCandidate(state([entity('stone', { uid: 2 })]), floatingPlant, types, 0, 0).valid, true);
  assert.equal(placementCandidate(state([entity('floating', { uid: 2 })]), floatingPlant, types, 0, 0).valid, false);
});

test('internal filter, heater and skimmer keep their placement clearance', () => {
  assert.equal(placementCandidate(state([], { filter: 'internal120' }), entity(), types, 2.97, -1.3).valid, false);
  assert.equal(placementCandidate(state([], { filter: 'external300' }), entity(), types, 3.2, -1.3).valid, false);
  assert.equal(placementCandidate(state([], { heater: true }), entity(), types, -3.2, -1.3).valid, false);
  assert.equal(placementCandidate(state([], { skimmer: true }), entity(), types, -3.2, -1.25).valid, false);
});

test('new decoration finds an actual free site without moving existing objects', () => {
  const obstacle = entity('stone', { uid: 2 }), tank = state([obstacle]);
  const before = JSON.stringify(tank);
  const position = findFreePosition(tank, entity('slate'), types);
  assert.equal(position.valid, true);
  assert.ok(Math.hypot(position.x, position.z) > .5);
  assert.equal(JSON.stringify(tank), before);
});

test('a crowded tank reports no free site instead of stacking new objects', () => {
  const wallType = { category: 'decor', footprint: [10, 10] };
  assert.equal(findFreePosition(state([entity('wall', { uid: 2 })]), entity('slate'), { ...types, wall: wallType }), null);
});

test('substrate anchoring follows the rendered sand slope and bare glass', () => {
  assert.equal(substrateHeight(state([], { substrate: 'bare' }), 2, 1), .065);
  assert.equal(substrateHeight(state(), 0, 0), .24);
  assert.ok(Math.abs(substrateHeight(state(), .5, -.8) - (.24 + Math.sin(1) * .04 + .032)) < 1e-12);
});

test('standalone HTML bundles the module and CSS with valid JavaScript under a project path', async () => {
  const requests = [];
  const html = await createStandaloneDocument('https://example.test/Simulation-Aquarium/', async url => {
    requests.push(url.pathname);
    const content = await readFile(new URL('../' + url.pathname.replace('/Simulation-Aquarium/', ''), import.meta.url));
    return { ok: true, text: async () => content.toString(), arrayBuffer: async () => content };
  });
  assert.ok(requests.includes('/Simulation-Aquarium/ecology.mjs'));
  assert.ok(requests.includes('/Simulation-Aquarium/assets/catalog/betta.webp'));
  assert.ok(requests.every(path=>path.startsWith('/Simulation-Aquarium/')));
  assert.ok(!html.includes('src=\"./assets/catalog/'));
  assert.ok(!html.split('</head>')[0].includes('<link rel="stylesheet" href="./aquascaping.css">'));
  assert.ok(!/import \{[^;]*\} from "\.\/aquascaping\.mjs";/.test(html));
  assert.ok(html.includes('class AquascapingController'));
  const script = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
  const checked = spawnSync(process.execPath, ['--input-type=module', '--check'], { input: script, encoding: 'utf8' });
  assert.equal(checked.status, 0, checked.stderr);
});
