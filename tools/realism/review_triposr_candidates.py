"""Normalize three reconstructed candidates and compare them inside the real game.

Only a temporary Actions checkout is overlaid. Original production GLB bytes are
restored in finally; no branch, runtime source or accepted model is published.
"""
import base64
import copy
import hashlib
import json
import os
import struct
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import numpy as np
import trimesh
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs/ui-model-review/feasibility'
GLBS = OUT / 'normalized'
SHOTS = OUT / 'browser'
GLBS.mkdir(exist_ok=True)
SHOTS.mkdir(exist_ok=True)
legacy = json.loads((ROOT / 'tests/fixtures/legacy-v1.json').read_text())
trial = json.loads((OUT / 'report.json').read_text())
report = {'accepted_models': 0, 'production_assets_changed': False,
          'temporary_runtime_overlay': True, 'normalization': [], 'captures': [],
          'errors': [], 'console_errors': [], 'quality_decision': 'awaiting visual review'}
source = (ROOT / 'index.html').read_text()
start = source.find('function G1(')
report['legacy_color_markup'] = source[start:start+2500] if start >= 0 else 'not found'
saved = {}
prior = json.loads((OUT / 'runtime-review.json').read_text()) if (OUT / 'runtime-review.json').exists() else {}
report['reused_capture_run'] = None
# Corrected normalization requires new trial captures; retain baseline images only.
for path in SHOTS.glob('trial-*.jpg'):
    path.unlink()
report['graphics_profile'] = 'ultra'
report['audits'] = [item for item in prior.get('audits', []) if item['phase']=='existing']
report['captures'] = [path.name for path in SHOTS.glob('*.jpg')]

def glb_bounds(path):
    """Account for normalized integer accessors that trimesh 4.0.5 reads as raw shorts."""
    data = path.read_bytes()
    size = struct.unpack_from('<I', data, 12)[0]
    doc = json.loads(data[20:20+size])
    mesh_boxes = []
    for mesh in doc['meshes']:
        lows, highs = [], []
        for primitive in mesh['primitives']:
            accessor = doc['accessors'][primitive['attributes']['POSITION']]
            low, high = np.array(accessor['min'], dtype=float), np.array(accessor['max'], dtype=float)
            divisor = {5120:127,5121:255,5122:32767,5123:65535}.get(accessor['componentType'], 1) if accessor.get('normalized') else 1
            lows.append(np.maximum(-1, low/divisor) if accessor.get('normalized') and accessor['componentType'] in [5120,5122] else low/divisor)
            highs.append(high/divisor)
        mesh_boxes.append((np.min(lows, axis=0), np.max(highs, axis=0)))
    points = []
    def visit(index, parent):
        node = doc['nodes'][index]
        if 'matrix' in node:
            local = np.array(node['matrix']).reshape((4,4), order='F')
        else:
            q = node.get('rotation', [0,0,0,1])
            local = trimesh.transformations.quaternion_matrix([q[3], q[0], q[1], q[2]])
            local[:3,:3] = local[:3,:3] @ np.diag(node.get('scale', [1,1,1]))
            local[:3,3] = node.get('translation', [0,0,0])
        world = parent @ local
        if 'mesh' in node:
            low, high = mesh_boxes[node['mesh']]
            for x in [low[0],high[0]]:
                for y in [low[1],high[1]]:
                    for z in [low[2],high[2]]:
                        points.append((world @ [x,y,z,1])[:3])
        for child in node.get('children', []):
            visit(child, world)
    for node in doc['scenes'][doc.get('scene',0)]['nodes']:
        visit(node, np.eye(4))
    return np.array([np.min(points,axis=0),np.max(points,axis=0)])

def normalize(species):
    path = OUT / species / '0/mesh.obj'
    if not path.exists():
        return False
    mesh = trimesh.load(path, force='mesh', process=False)
    assert len(mesh.vertices) and len(mesh.faces)
    assert np.isfinite(mesh.vertices).all()
    assert mesh.visual.uv is not None and len(mesh.visual.uv) == len(mesh.vertices)
    # Explicit UV texture; keep original .obj/.png unmodified for audit.
    texture = Image.open(path.parent / 'texture.png').convert('RGBA')
    original = ROOT / 'assets/species' / (species + '-desktop.glb')
    extents = np.diff(glb_bounds(original), axis=0)[0]
    # Official TripoSR convention: x back, y right, z up (tsr/utils.py).
    # Match the game's x right, y up, z front without reshaping broad plants.
    transform = np.eye(4)
    transform[:3, :3] = [[0, 1, 0], [0, 0, 1], [1, 0, 0]]
    mesh.apply_transform(transform)
    axis = 1 if species == 'anubias' else 0
    mesh.apply_scale(float(extents[axis] / mesh.extents[axis]))
    center = mesh.bounds.mean(axis=0)
    mesh.apply_translation([-center[0], -mesh.bounds[0, 1] if species == 'anubias' else -center[1], -center[2]])
    material = trimesh.visual.material.PBRMaterial(name='TripoSR_baked_photo', baseColorTexture=texture,
        metallicFactor=0.0, roughnessFactor=0.65, doubleSided=True)
    mesh.visual = trimesh.visual.texture.TextureVisuals(uv=mesh.visual.uv.copy(), material=material)
    assert max(mesh.extents) < 5, 'Candidate must use game units, not raw normalized shorts'
    result = mesh.export(file_type='glb')
    assert result[:4] == b'glTF' and struct.unpack_from('<I', result, 8)[0] == len(result)
    json_length = struct.unpack_from('<I', result, 12)[0]
    doc = json.loads(result[20:20+json_length])
    assert all('uri' not in b for b in doc['buffers'])
    assert all('uri' not in image for image in doc['images'])
    path = GLBS / (species + '.glb')
    path.write_bytes(result)
    report['normalization'].append({'species': species, 'vertices': len(mesh.vertices),
        'triangles': len(mesh.faces), 'texture': list(texture.size), 'bytes': len(result),
        'sha256': hashlib.sha256(result).hexdigest(), 'bounds': mesh.bounds.tolist(),
        'source_axes': 'TripoSR x-back/y-right/z-up -> game x-right/y-up/z-front',
        'source_photo': next(s for s in trial['sources'] if s['id'] == species)})
    return True

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

def click(page, selector):
    page.locator(selector).filter(visible=True).first.click()

def capture(page, name, locator=None):
    path = SHOTS / (name + '.jpg')
    (locator or page).screenshot(path=str(path), type='jpeg', quality=88, timeout=120000)
    report['captures'].append(path.name)

def payload(species):
    data = copy.deepcopy(legacy)
    entity = copy.deepcopy(data['entities'][0])
    payload.serial = getattr(payload, 'serial', 1000) + 1
    entity.update(uid=payload.serial, species=species, x=0, z=0, scale=1, rotation=0, sex='♂', variant='natural', dead=False, health=100)
    data.update(day=45.35, entities=[entity], nextId=payload.serial+1)
    return data

server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Quiet, directory=str(ROOT.parent)))
threading.Thread(target=server.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{server.server_port}/{ROOT.name}/'
ready = []
try:
    requested = os.environ.get('AQUARIUM_REVIEW_SPECIES', 'guppy,cory,anubias').split(',')
    assert all(species in ['guppy','cory','anubias'] for species in requested)
    ready = [species for species in requested if normalize(species)]
    assert ready, 'No reconstruction bytes available'
    with sync_playwright() as p:
        for phase in ['existing', 'trial']:
            candidates = ready + (['neon','molly'] if phase == 'existing' else [])
            pending = [species for species in candidates if not all((SHOTS / (phase+'-'+species+'-'+angle+'.jpg')).exists() for angle in ['front','oblique','rear'])]
            if not pending:
                continue
            if phase == 'trial':
                for species in ready:
                    path = ROOT / 'assets/species' / (species + '-desktop.glb')
                    saved[path] = path.read_bytes()
                    path.write_bytes((GLBS / (species + '.glb')).read_bytes())
            browser = p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
            page = browser.new_page(viewport={'width':1360,'height':960}, device_scale_factor=1)
            page.set_default_timeout(120000)
            page.on('pageerror', lambda error: report['errors'].append(str(error)))
            page.on('console', lambda message: report['console_errors'].append(message.text[:1000]) if message.type=='error' and 'favicon' not in message.text else None)
            page.goto(url)
            click(page, 'button[data-graphics-profile="ipad"]')
            click(page, '[data-start="free"]')
            click(page, '[data-panel="time"]')
            page.locator('[data-graphics-setting]').select_option('ultra')
            page.wait_for_function('window.aquariumSnapshot().graphics.graphicsProfile==="ultra"')
            click(page, '[data-act="close-panel"]')
            data = payload(ready[0])
            page.locator('#import-file').set_input_files({'name':'trial.json','mimeType':'application/json','buffer':json.dumps(data).encode()})
            page.wait_for_function('(uid)=>JSON.parse(localStorage.getItem("aquarium-werkstatt-v1"))?.entities[0]?.uid===uid', arg=data['entities'][0]['uid'])
            page.wait_for_function('window.aquariumSnapshot().graphics.detailModels===1')
            if page.locator('[data-act="close-panel"]:visible').count():
                click(page, '[data-act="close-panel"]')
            for species in pending:
                if phase == 'trial':
                    data = payload(species)
                    page.locator('#import-file').set_input_files({'name':'trial.json','mimeType':'application/json','buffer':json.dumps(data).encode()})
                    page.wait_for_function('(uid)=>JSON.parse(localStorage.getItem("aquarium-werkstatt-v1"))?.entities[0]?.uid===uid', arg=data['entities'][0]['uid'])
                    page.wait_for_function('window.aquariumSnapshot().graphics.detailModels===1')
                    if page.locator('[data-act="close-panel"]:visible').count():
                        click(page, '[data-act="close-panel"]')
                    click(page, '[data-act="front"]')
                    capture(page, phase+'-'+species+'-aquarium-front')
                    click(page, '[data-act="camera"]')
                    capture(page, phase+'-'+species+'-aquarium-oblique')
                click(page, '[data-act="specimen-gallery"]')
                if not page.locator('[data-preview="'+species+'"]').count():
                    click(page, '[data-specimen-category="'+('plant' if species=='anubias' else 'fish')+'"]')
                click(page, '[data-preview="'+species+'"]')
                page.wait_for_function('(id)=>document.querySelector("#specimen-stage")?.dataset.ready===id', arg=species)
                stage = page.locator('#specimen-stage')
                stage.scroll_into_view_if_needed()
                report.setdefault('audits', []).append({'phase':phase,'species':species,
                    'audit':page.evaluate('(id)=>window.aquariumModelAudit(id)', species)})
                capture(page, phase+'-'+species+'-front', stage)
                box = stage.bounding_box()
                x,y=box['x']+box['width']*.5, box['y']+box['height']*.5
                for angle in ['oblique','rear']:
                    page.mouse.move(x,y);page.mouse.down()
                    page.mouse.move(x+box['width']*.23,y+box['height']*.04,steps=20);page.mouse.up()
                    page.evaluate('()=>new Promise(resolve=>setTimeout(resolve,400))')
                    capture(page, phase+'-'+species+'-'+angle, stage)
                click(page, '[data-act="close-modal"]')
            browser.close()
    assert not report['errors'], report['errors']
    report['status'] = 'captured-for-visual-review'
except Exception as error:
    report.update(status='failed', failure=str(error))
    raise
finally:
    for path, data in saved.items():
        path.write_bytes(data)
    server.shutdown()
    (OUT / 'runtime-review.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(report, ensure_ascii=False, indent=2), flush=True)
    for path in sorted(SHOTS.glob('*.jpg')):
        if not path.name.startswith('trial-') or any(path.name.startswith('trial-'+name+'-') for name in ready):
            print('MODEL_JPEG '+path.name+' '+base64.b64encode(path.read_bytes()).decode(), flush=True)
