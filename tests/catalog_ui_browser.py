"""Real UI regression and browser captures. No rendered images are fabricated."""
import base64
import copy
import json
import os
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/ui-model-review/evidence'
OUT.mkdir(parents=True, exist_ok=True)
LEGACY = json.loads((ROOT / 'tests/fixtures/legacy-v1.json').read_text())
report = {'checks': [], 'errors': [], 'screenshots': [], 'model_status': 'existing models; no new reconstruction accepted'}

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

def click(page, selector):
    page.locator(selector).filter(visible=True).first.click()

def shot(page, name, locator=None):
    path = OUT / (name + '.png')
    (locator or page).screenshot(path=str(path), timeout=120000)
    report['screenshots'].append(path.name)

def fixture(species, salt=False):
    payload = copy.deepcopy(LEGACY)
    entity = copy.deepcopy(payload['entities'][0])
    entity.update(uid=1, species=species, x=0, z=0, rotation=0, scale=1, dead=False, age=15, health=100)
    payload.update(entities=[entity], nextId=2, day=45.35)
    if salt:
        payload['water'] = 'salt'
        payload['params'].update(salinity=34, kh=8, calcium=420)
    return payload

def restore(page, payload):
    if page.locator('[data-act="close-modal"]:visible').count():
        click(page, '[data-act="close-modal"]')
    page.locator('#import-file').set_input_files({'name': 'review-fixture.json', 'mimeType': 'application/json', 'buffer': json.dumps(payload).encode()})
    page.wait_for_function('''(s)=>{
        const actual=JSON.parse(localStorage.getItem("aquarium-werkstatt-v1"));
        return actual?.entities.length===s.entities.length && actual?.water===s.water
            && actual?.entities[0]?.species===s.entities[0].species && actual?.day===s.day;
    }''', arg=payload)
    if page.locator('[data-act="close-panel"]:visible').count():
        click(page, '[data-act="close-panel"]')
    page.wait_for_function('window.aquariumSnapshot().graphics.detailModels===1')

server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT.parent)))
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}/'
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('AQUARIUM_CHROMIUM') or p.chromium.executable_path,
            args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])

        def boot(directory, touch=False):
            context = browser.new_context(viewport={'width': 820 if touch else 1360, 'height': 1180 if touch else 960},
                has_touch=touch, is_mobile=touch, device_scale_factor=1)
            page = context.new_page()
            page.set_default_timeout(90000)
            page.on('pageerror', lambda error: report['errors'].append(str(error)))
            page.goto(base + directory.name + '/')
            click(page, 'button[data-graphics-profile="ipad"]')
            click(page, '[data-start="free"]')
            restore(page, fixture('guppy'))
            return context, page

        baseline = Path(os.environ.get('AQUARIUM_BASELINE_DIR', '../aquarium-baseline')).resolve()
        if baseline.exists():
            context, page = boot(baseline)
            click(page, '[data-panel="care"]')
            click(page, '[data-entity="1"]')
            shot(page, 'before-object-guppy', page.locator('#drawer-root .drawer'))
            click(page, '#drawer-root [data-species="guppy"]')
            shot(page, 'before-species-guppy', page.locator('#modal-root .modal'))
            context.close()

        context, page = boot(ROOT)
        for species, department, salt in [('guppy', 'tiere', False), ('molly', 'tiere', False), ('cory', 'tiere', False),
                ('anubias', 'pflanzen', False), ('nerite', 'tiere', False),
                ('softleather', 'tiere', True), ('stone', 'deko', False)]:
            restore(page, fixture(species, salt))
            before = page.evaluate('JSON.parse(localStorage.getItem("aquarium-werkstatt-v1")).entities')
            click(page, '[data-panel="care"]')
            click(page, '[data-entity="1"]')
            drawer = page.locator('#drawer-root')
            image = drawer.locator('.detail-visual img')
            expect(image).to_have_attribute('src', './assets/catalog/' + species + '.webp')
            page.wait_for_function('document.querySelector("#drawer-root .detail-visual img")?.naturalWidth>0')
            assert drawer.locator('.detail-visual svg').count() == 0
            assert drawer.locator('[data-entity-setting="x"],[data-entity-setting="z"],[data-act="place-selected"]').count() == 0
            assert drawer.locator('[data-entity-setting="rotation"],[data-entity-setting="scale"]').count() == 2
            assert page.evaluate('JSON.parse(localStorage.getItem("aquarium-werkstatt-v1")).entities') == before
            shot(page, 'after-object-' + species, drawer.locator('.drawer'))
            click(page, '#drawer-root [data-species="' + species + '"]')
            expect(page.locator('#modal-root .detail-visual img')).to_have_attribute('src', './assets/catalog/' + species + '.webp')
            page.wait_for_function('document.querySelector("#modal-root .detail-visual img")?.naturalWidth>0')
            if species in ['guppy', 'molly']:
                expect(page.locator('label[for="fish-variant"]')).to_have_text('Farbe')
            if species == 'guppy':
                page.locator('[data-fish-variant]').select_option('red')
                page.wait_for_function('window.aquariumShopAppearance()?.variant==="red"')
                assert page.locator('[data-lesson-genotype]').count() + page.locator('.lesson-purchase').count() > 0
            shot(page, 'after-species-' + species, page.locator('#modal-root .modal'))
            click(page, '[data-act="close-modal"]')
            click(page, '[data-act="close-panel"]')
            report['checks'].append('catalog and placed detail: ' + species)

        restore(page, fixture('anubias'))
        target = page.evaluate('window.aquariumAquascapingSnapshot().targets[0]')
        page.mouse.click(target['screen']['x'], target['screen']['y'])
        expect(page.locator('#drawer-root .detail-visual img')).to_have_attribute('src', './assets/catalog/anubias.webp')
        expect(page.locator('[data-act="tweezers-selected"]')).to_be_visible()
        click(page, '[data-act="close-panel"]')
        report['checks'].append('actual 3D scene selection opens the same catalog image')

        for species, salt in [('guppy', False), ('nerite', False), ('softleather', True)]:
            restore(page, fixture(species, salt))
            target = page.evaluate('window.aquariumAquascapingSnapshot().targets[0]')
            assert target['species'] == species
            camera = page.evaluate('window.aquariumAquascapingSnapshot().camera')
            click(page, '#tweezers-button')
            page.mouse.move(target['screen']['x'], target['screen']['y'])
            page.mouse.down()
            assert page.evaluate('window.aquariumAquascapingSnapshot().phase') == 'dragging'
            page.mouse.move(target['screen']['x'] + 110, target['screen']['y'] - 10, steps=12)
            page.wait_for_function('window.aquariumAquascapingSnapshot().toolVisible')
            report['tweezers_instruction'] = page.locator('#aquascape-instructions').inner_text()
            during = page.evaluate('window.aquariumAquascapingSnapshot()')
            assert during['camera'] == camera
            if species == 'guppy':
                assert during['targets'][0]['centerY'] > target['centerY'] - .25
                shot(page, 'tweezers-guppy-swimming-height')
            page.mouse.up()
            page.wait_for_function('window.aquariumAquascapingSnapshot().phase==="idle"')
            after = page.evaluate('JSON.parse(localStorage.getItem("aquarium-werkstatt-v1")).entities[0]')
            assert abs(after['x'] - target['x']) + abs(after['z'] - target['z']) > .03
            assert after['aquascapePlaced'] is True
            page.keyboard.press('Escape')
            report['checks'].append('real tweezers drag and save: ' + species)

        click(page, '[data-panel="shop"]')
        click(page, '[data-act="open-settings"]')
        assert page.locator('input[data-setting="salinity"][type="range"]').count() == 1
        click(page, '[data-panel="time"]')
        assert page.locator('[data-speed]').count() > 0
        expect(page.locator('[data-graphics-setting]')).to_be_visible()
        click(page, '[data-act="close-panel"]')
        report['checks'].append('water, time and graphics controls remain available')

        click(page, '[data-panel="time"]')
        page.locator('[data-graphics-setting]').select_option('maximum')
        page.wait_for_function('window.aquariumSnapshot().graphics.graphicsProfile==="maximum"')
        click(page, '[data-act="close-panel"]')

        # Capture the same existing pilot candidates and the two quality references
        # with the application's real orbit interaction, under identical lighting.
        for species in ['guppy', 'cory', 'anubias', 'neon', 'molly']:
            click(page, '[data-act="specimen-gallery"]')
            if not page.locator('[data-preview="' + species + '"]').count():
                click(page, '[data-specimen-category="' + ('plant' if species == 'anubias' else 'fish') + '"]')
            click(page, '[data-preview="' + species + '"]')
            page.wait_for_function('(id)=>document.querySelector("#specimen-stage")?.dataset.ready===id', arg=species)
            stage = page.locator('#specimen-stage')
            stage.scroll_into_view_if_needed()
            shot(page, 'existing-' + species + '-front', stage)
            box = stage.bounding_box()
            x, y = box['x'] + box['width'] * .5, box['y'] + box['height'] * .5
            for angle in ['oblique', 'rear']:
                page.mouse.move(x, y)
                page.mouse.down()
                page.mouse.move(x + box['width'] * .23, y + box['height'] * .04, steps=20)
                page.mouse.up()
                page.evaluate('()=>new Promise(r=>setTimeout(r,400))')
                shot(page, 'existing-' + species + '-' + angle, stage)
            click(page, '[data-act="close-modal"]')
        report['checks'].append('15 actual browser model views; existing assets only')
        context.close()

        context, page = boot(ROOT, touch=True)
        restore(page, fixture('anubias'))
        click(page, '[data-panel="care"]')
        click(page, '[data-entity="1"]')
        expect(page.locator('#drawer-root .detail-visual img')).to_have_attribute('src', './assets/catalog/anubias.webp')
        assert page.locator('[data-entity-setting="x"],[data-entity-setting="z"]').count() == 0
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        shot(page, 'ipad-touch-object-anubias')
        context.close()

        context = browser.new_context(viewport={'width': 1360, 'height': 960})
        page = context.new_page()
        page.set_default_timeout(90000)
        page.on('pageerror', lambda error: report['errors'].append(str(error)))
        page.goto(base + ROOT.name + '/')
        click(page, 'button[data-graphics-profile="ipad"]')
        click(page, '[data-start="tutorial"]')
        expect(page.locator('[data-act="tutorial-action"],[data-act="choose-tank"]').filter(visible=True).first).to_be_visible()
        shot(page, 'tutorial-start')
        context.close()
        browser.close()
        assert not report['errors'], report['errors']
        report['status'] = 'passed'
except Exception as error:
    report.update(status='failed', failure=str(error))
    raise
finally:
    server.shutdown()
    (OUT / 'browser-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False, indent=2), flush=True)
    for name in ['after-object-guppy.png', 'existing-guppy-front.png', 'existing-neon-front.png']:
        path = OUT / name
        if path.exists():
            print('BROWSER_PNG ' + name + ' ' + base64.b64encode(path.read_bytes()).decode(), flush=True)
