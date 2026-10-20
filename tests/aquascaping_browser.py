"""Real pointer / touch regression tests. Requires local Python Playwright + Chromium.

Starts a temporary loopback HTTP server and tests the GitHub Pages project subpath.
Only isolated test browser profiles and generated test saves are used.
"""
import copy
import json
import math
import os
import threading
from datetime import datetime, timezone
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
RESULTS = Path(os.environ.get('AQUARIUM_TEST_RESULTS', '/tmp/aquarium-phase1-results')) / datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S')
RESULTS.mkdir(parents=True)
LEGACY = json.loads((ROOT / 'tests/fixtures/legacy-v1.json').read_text())
report = {'checks': [], 'page_errors': [], 'console_errors': [], 'external_requests': [], 'resource_errors': []}


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def passed(name, **details):
    report['checks'].append({'name': name, 'status': 'passed', **details})
    print('PASS:', name, flush=True)


def info(page):
    return page.evaluate('window.aquariumAquascapingSnapshot()')


def saved(page):
    return page.evaluate('JSON.parse(localStorage.getItem("aquarium-werkstatt-v1"))')


def target(page, species):
    return next(item for item in info(page)['targets'] if item['species'] == species)


def screenshot(page, name):
    path = RESULTS / f'{name}.png'
    page.screenshot(path=str(path))
    return str(path)


def action(page, selector):
    page.locator(selector).filter(visible=True).first.click()


def import_save(page, payload):
    page.locator('#import-file').set_input_files({'name': 'test-aquarium.json', 'mimeType': 'application/json', 'buffer': json.dumps(payload).encode()})
    page.wait_for_function('''(expected)=> {
      const actual=JSON.parse(localStorage.getItem('aquarium-werkstatt-v1'));
      return actual?.entities.length===expected.length && expected.every((entity,index)=>
        ['uid','species','x','z'].every(key=>actual.entities[index][key]===entity[key]));
    }''', arg=payload['entities'], polling=100)
    page.evaluate('()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))')


def layout(*species_ids):
    save = copy.deepcopy(LEGACY)
    save['entities'] = []
    for uid, species in enumerate(species_ids, 1):
        entity = copy.deepcopy(LEGACY['entities'][0])
        entity.update(uid=uid, species=species, x=-1.5 if uid == 1 else 1.3, z=0, rotation=0, scale=1)
        save['entities'].append(entity)
    save['nextId'] = len(save['entities']) + 1
    return save


def start_drag(page, species):
    item = target(page, species)
    page.mouse.move(item['screen']['x'], item['screen']['y'])
    page.mouse.down()
    assert info(page)['phase'] == 'dragging', 'Pointer must pick the visible model'
    page.wait_for_function('window.aquariumAquascapingSnapshot().toolVisible', polling=100)
    return item


server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT.parent)))
threading.Thread(target=server.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:{server.server_port}/{ROOT.name}/'
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('AQUARIUM_CHROMIUM') or ('/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else p.chromium.executable_path), headless=True,
                                   args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])

        def boot(**options):
            context = browser.new_context(**options)
            page = context.new_page()
            page.set_default_timeout(45000)
            page.on('pageerror', lambda error: report['page_errors'].append(str(error)))
            page.on('console', lambda message: report['console_errors'].append({'text': message.text[:1000], 'url': message.location.get('url', '')}) if message.type == 'error' else None)
            page.on('request', lambda request: report['external_requests'].append(request.url[:200]) if request.url.startswith(('http:', 'https:')) and not request.url.startswith(f'http://127.0.0.1:{server.server_port}/') else None)
            page.on('response', lambda response: report['resource_errors'].append({'url': response.url, 'status': response.status}) if response.status >= 400 and not response.url.endswith('/favicon.ico') else None)
            response = page.goto(URL, wait_until='load')
            assert response.status == 200
            if page.locator('button[data-graphics-profile=\"ipad\"]').count():
                page.locator('button[data-graphics-profile=\"ipad\"]').click()
            expect(page.locator('[data-start="free"]')).to_be_visible()
            expect(page.locator('#tweezers-button')).to_be_hidden()
            return context, page

        context, page = boot(viewport={'width': 1280, 'height': 900}, device_scale_factor=1)
        action(page, '[data-start="free"]')
        expect(page.locator('#tweezers-button')).to_be_disabled()
        import_save(page, LEGACY)
        assert saved(page)['version'] == 1
        assert [{k:v for k,v in e.items() if k not in ['scale','rotation']} for e in saved(page)['entities']] == [{k:v for k,v in e.items() if k not in ['scale','rotation']} for e in LEGACY['entities']]
        assert all(saved(page)['spatial']['originalOverrides'][str(e['uid'])]['rotation']==e['rotation'] for e in LEGACY['entities'])
        page.wait_for_function('window.aquariumSnapshot().graphics.detailModels===2', polling=100)
        expect(page.locator('#tweezers-button')).to_be_enabled()
        passed('Legacy v1 save imports unchanged; new tool available only after tank placement')

        import_save(page, layout('spiderwood'))
        action(page, '#tweezers-button')
        before = target(page, 'spiderwood')
        camera = info(page)['camera']
        start_drag(page, 'spiderwood')
        page.mouse.move(before['screen']['x'] + 145, before['screen']['y'] - 15, steps=8)
        assert info(page)['blocked'] is False
        preview = info(page)['preview']
        assert math.hypot(preview['x'] - before['x'], preview['z'] - before['z']) > .2
        # Saving during a held gesture must retain the last committed position.
        page.locator('[data-act="save"]').focus()
        page.keyboard.press('Enter')
        assert saved(page)['entities'][0]['x'] == before['x']
        assert saved(page)['entities'][0]['z'] == before['z']
        # Finish this gesture, then capture a separate clean demonstration drag.
        page.mouse.up()
        page.keyboard.press('Escape')
        import_save(page, layout('spiderwood'))
        action(page, '#tweezers-button')
        before = start_drag(page, 'spiderwood')
        page.mouse.move(before['screen']['x'] + 145, before['screen']['y'] - 15, steps=8)
        holding = info(page)
        assert holding['toolVisible'] and holding['phase'] == 'dragging'
        screenshot(page, 'mouse-tweezers-holding')
        page.mouse.up()
        page.wait_for_function('window.aquariumAquascapingSnapshot().phase==="idle"', polling=100)
        after = target(page, 'spiderwood')
        assert math.hypot(after['x'] - before['x'], after['z'] - before['z']) > .2
        assert info(page)['camera'] == camera
        assert saved(page)['entities'][0]['aquascapePlaced'] is True
        assert abs(after['bottomY'] - .065 * page.evaluate('window.aquariumPhysicalSnapshot().tank.y')) < .025
        mouse_save = saved(page)
        screenshot(page, 'mouse-tweezers-placed')
        passed('Mouse drag: real 3D grasp/lift/release, stationary camera, substrate anchoring and saved coordinates')

        page.reload(wait_until='load')
        action(page, '[data-start="resume"]')
        assert saved(page)['entities'] == mouse_save['entities']
        passed('Moved coordinates survive page reload in the existing save format')

        action(page, '#tweezers-button')
        original = target(page, 'spiderwood')
        start_drag(page, 'spiderwood')
        page.mouse.move(original['screen']['x'] - 110, original['screen']['y'], steps=5)
        page.keyboard.press('Escape')
        page.mouse.up()
        assert not info(page)['enabled']
        assert saved(page)['entities'] == mouse_save['entities']
        assert target(page, 'spiderwood')['x'] == original['x']
        passed('Escape cancels the gesture without changing committed positions')

        import_save(page, layout('spiderwood', 'slate'))
        action(page, '#tweezers-button')
        before = start_drag(page, 'spiderwood')
        obstacle = target(page, 'slate')['screen']
        blocked = False
        for dx, dy in [(0, 0), (0, 35), (0, -35), (-50, 0), (50, 0)]:
            page.mouse.move(obstacle['x'] + dx, obstacle['y'] + dy, steps=3)
            if info(page)['blocked']:
                blocked = True
                break
        assert blocked, 'Dragging onto a rock must report an obstruction'
        screenshot(page, 'collision-blocked')
        page.mouse.up()
        page.wait_for_function('window.aquariumAquascapingSnapshot().phase==="idle"', polling=100)
        assert abs(target(page, 'spiderwood')['x'] - target(page, 'slate')['x']) > .7
        passed('Visible collision feedback prevents overlap with existing hardscape')

        import_save(page, layout('spiderwood'))
        action(page, '#tweezers-button')
        before = start_drag(page, 'spiderwood')
        page.mouse.move(1650, before['screen']['y'], steps=10)
        page.mouse.up()
        page.wait_for_function('window.aquariumAquascapingSnapshot().phase==="idle"', polling=100)
        edge = target(page, 'spiderwood')
        assert abs(edge['x']) + .78 <= 3.45001 and abs(edge['z']) + .49 <= 1.50001
        assert info(page)['camera'] == camera
        passed('Pointer capture outside the canvas keeps the full object inside tank walls')
        action(page, '#tweezers-button')

        # Test the actual shop and all six rendered additions, not just catalog metadata.
        empty = layout()
        import_save(page, empty)
        action(page, '[data-panel="shop"]')
        action(page, '[data-department="deko"]')
        action(page, '[data-waterfilter="all"]')
        for species in ['spiderwood', 'mopani', 'slate', 'dragonstone', 'basaltarch']:
            action(page, f'[data-species="{species}"]')
            action(page, '[data-act="add-species"]')
        assert len(saved(page)['entities']) == 5
        action(page, '[data-species="reefcave"]')
        action(page, '[data-act="add-species"]')
        assert len(saved(page)['entities']) == 5, 'Marine hardscape must not be added to fresh water'
        expect(page.locator('#toast-root')).to_contain_text('Meerwasser')
        action(page, '[data-act="close-modal"]')
        action(page, '[data-act="close-panel"]')
        page.wait_for_function('window.aquariumSnapshot().graphics.triangles>8000', polling=100)
        screenshot(page, 'five-freshwater-decorations')
        assert all(item['bottomY'] is not None for item in info(page)['targets'])
        passed('Five new freshwater-compatible decorations purchased, placed freely and rendered')

        action(page, '[data-panel="shop"]')
        action(page, '[data-act="open-settings"]')
        action(page, '[data-water-type="salt"]')
        action(page, '[data-panel="shop"]')
        action(page, '[data-department="deko"]')
        action(page, '[data-waterfilter="salt"]')
        assert page.locator('[data-species="spiderwood"]').count() == 0
        action(page, '[data-species="reefcave"]')
        action(page, '[data-act="add-species"]')
        action(page, '[data-act="close-panel"]')
        assert any(item['species'] == 'reefcave' for item in saved(page)['entities'])
        screenshot(page, 'marine-reef-cave')
        passed('Sixth decoration renders in salt water; shop respects freshwater/marine distinctions')
        context.close()

        context, page = boot(viewport={'width': 1180, 'height': 820}, device_scale_factor=1, has_touch=True, is_mobile=True)
        action(page, '[data-start="free"]')
        plant_save = layout('anubias')
        import_save(page, plant_save)
        page.wait_for_function('window.aquariumSnapshot().graphics.detailModels===1', polling=100)
        page.locator('#tweezers-button').tap()
        initial = target(page, 'anubias')
        camera = info(page)['camera']
        cdp = context.new_cdp_session(page)
        point = initial['screen']
        touch = lambda x, y: {'x': x, 'y': y, 'id': 1, 'radiusX': 3, 'radiusY': 3, 'force': 1}
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [touch(point['x'], point['y'])]})
        assert info(page)['phase'] == 'dragging'
        for step in range(1, 6):
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [touch(point['x'] + step * 22, point['y'] - step * 3)]})
        page.wait_for_function('window.aquariumAquascapingSnapshot().toolVisible', polling=100)
        screenshot(page, 'touch-tweezers-plant')
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        page.wait_for_function('window.aquariumAquascapingSnapshot().phase==="idle"', polling=100)
        moved = target(page, 'anubias')
        assert math.hypot(moved['x'] - initial['x'], moved['z'] - initial['z']) > .1
        assert info(page)['camera'] == camera
        assert saved(page)['entities'][0]['aquascapePlaced'] is True
        touch_saved = saved(page)
        passed('Real touch drag moves a plant, locks the camera and saves the result')

        point = moved['screen']
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [touch(point['x'], point['y'])]})
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [touch(point['x'] - 75, point['y'])]})
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchCancel', 'touchPoints': []})
        assert info(page)['phase'] == 'idle'
        assert saved(page)['entities'] == touch_saved['entities']
        assert target(page, 'anubias')['x'] == moved['x']
        passed('Touch cancellation restores the original position and retains the saved game')

        page.locator('#aquascape-instructions [data-act="tweezers"]').tap()
        assert not info(page)['enabled']
        page.set_viewport_size({'width': 820, 'height': 1180})
        page.locator('#tweezers-button').tap()
        expect(page.locator('#aquascape-instructions')).to_be_visible()
        assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth')
        screenshot(page, 'touch-portrait-tool')
        page.keyboard.press('Escape')

        # Reach keyboard mode through the existing object detail panel.
        action(page, '[data-panel="care"]')
        action(page, '[data-entity="1"]')
        action(page, '[data-act="tweezers-selected"]')
        before = saved(page)['entities'][0]['x']
        page.keyboard.press('ArrowRight')
        assert abs(saved(page)['entities'][0]['x'] - before - .1) < 1e-6
        passed('Portrait UI fits; selected plants can also be moved and saved with arrow keys')
        context.close()
        browser.close()

    assert not report['page_errors'], report['page_errors']
    assert not report['resource_errors'], report['resource_errors']
    unexpected = [error for error in report['console_errors'] if not (error['url'].endswith('/favicon.ico') and '404' in error['text'])]
    assert not unexpected, unexpected
    assert not report['external_requests'], report['external_requests']
    passed('No JavaScript, shader, missing module/stylesheet or external runtime request errors')
    report['status'] = 'passed'
except Exception as error:
    report['status'] = 'failed'
    report['failure'] = str(error)
    raise
finally:
    server.shutdown()
    (RESULTS / 'report.json').write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
    print('Results:', RESULTS, flush=True)
