#!/usr/bin/env python3
"""Legacy expert flows and complete touch tutorial, using isolated browser profiles."""
import hashlib
import json
import os
import subprocess
import tempfile
import traceback
import urllib.request
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

from PIL import Image, ImageStat
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
TOOLS = Path(os.environ.get('AQUARIUM_READINESS_RESULTS', '/tmp/aquarium-readiness'))
URL = os.environ.get('AQUARIUM_URL', 'http://127.0.0.1:8000/aquarium-simulation/?expert=1')
RUN = TOOLS / 'results' / datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S.%fZ')
RUN.mkdir(parents=True)
report = {'url': URL, 'commit': subprocess.check_output(['git', '-C', str(ROOT), 'rev-parse', 'HEAD'], text=True).strip(),
          'checks': [], 'page_errors': [], 'console_errors': [], 'warnings': [], 'external_requests': [], 'failed_requests': [], 'http_errors': []}


def passed(name, **details):
    report['checks'].append({'name': name, 'status': 'passed', **details})
    print('PASS:', name, flush=True)


def saved(page):
    return page.evaluate('JSON.parse(localStorage.getItem("aquarium-werkstatt-v1"))')


def snapshot(page):
    return page.evaluate('window.aquariumSnapshot()')


def assert_restored(before, after):
    # The existing loader adds a journal entry and defaults an absent failureCause.
    # All simulation, tank, entity, water, measurement and tutorial state must match.
    before = dict(before)
    after = dict(after)
    previous_events = before.pop('events')
    loaded_events = after.pop('events')
    assert loaded_events[0]['title'] == 'Spielstand geladen'
    assert loaded_events[0]['day'] == before['day']
    assert loaded_events[1:] == previous_events[:99]
    if 'failureCause' not in before and before['failed'] is False:
        assert after.pop('failureCause') == 'nutrients'
    assert before == after, {key: (before.get(key), after.get(key)) for key in before.keys() | after.keys() if before.get(key) != after.get(key)}


def act(page, selector, touch=False):
    target = page.locator(selector).filter(visible=True).first
    target.tap() if touch else target.click()


def close_panel(page, touch=False):
    if page.locator('[data-act="close-panel"]:visible').count():
        act(page, '[data-act="close-panel"]', touch)


def capture(page, name):
    path = RUN / f'{name}.png'
    page.screenshot(path=str(path))
    im = Image.open(path).convert('RGB')
    assert max(ImageStat.Stat(im).stddev) > 5, 'Screenshot is unexpectedly uniform'
    return str(path)


def boot(context):
    page = context.new_page()
    page.set_default_timeout(30000)
    page.on('pageerror', lambda error: report['page_errors'].append(str(error)))
    def console(message):
        record = {'text': message.text[:1200], 'location': message.location}
        if message.type == 'error':
            report['console_errors'].append(record)
        elif message.type == 'warning':
            report['warnings'].append(record)
    page.on('console', console)
    page.on('request', lambda request: report['external_requests'].append(request.url[:200])
            if request.url.startswith(('http:', 'https:')) and not request.url.startswith('http://127.0.0.1:8000/') else None)
    page.on('requestfailed', lambda request: report['failed_requests'].append({'url': request.url[:200], 'failure': request.failure}))
    page.on('response', lambda response: report['http_errors'].append({'url': response.url[:200], 'status': response.status}) if response.status >= 400 else None)
    # Profile selection has its own integration test. This readiness suite fixes
    # a presentation profile so desktop input and the complete touch tutorial
    # remain reproducible without affecting any biological save.
    page.add_init_script("if (!localStorage.getItem('aquarium-graphics-v1')) localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
    response = page.goto(URL, wait_until='load')
    assert response.status == 200
    assert page.title() == 'Aquarium — Ökosystem-Werkstatt'
    page.wait_for_function('typeof window.aquariumSnapshot === "function"')
    expect(page.locator('[data-start="free"]')).to_be_visible()
    expect(page.locator('[data-start="tutorial"]')).to_be_visible()
    page.wait_for_function('window.aquariumSnapshot().graphics?.drawCalls > 0')
    return page


def place_tank(page, tutorial=False, touch=False):
    act(page, '[data-act="tutorial-action"]' if tutorial else '[data-act="choose-tank"]', touch)
    act(page, '[data-buy="tank-120"]', touch)
    expect(page.locator('[data-act="place-tank"]')).to_be_enabled()
    act(page, '[data-act="place-tank"]', touch)
    page.wait_for_function('JSON.parse(localStorage.getItem("aquarium-werkstatt-v1")).tankPlaced === true')
    assert saved(page)['liters'] == 120
    page.wait_for_function('window.aquariumSnapshot().graphics?.triangles > 14')
    expect(page.locator('#scene canvas')).to_be_visible()


class Scripts(HTMLParser):
    def __init__(self):
        super().__init__()
        self.scripts = []
        self.current = None
    def handle_starttag(self, tag, attrs):
        if tag == 'script':
            self.current = []
    def handle_data(self, text):
        if self.current is not None:
            self.current.append(text)
    def handle_endtag(self, tag):
        if tag == 'script' and self.current is not None:
            self.scripts.append(''.join(self.current))
            self.current = None


try:
    original = (ROOT / 'index.html').read_bytes()
    parser = Scripts()
    parser.feed(original.decode())
    assert parser.scripts
    with tempfile.TemporaryDirectory(prefix='aquarium-check-', dir='/tmp') as folder:
        for i, script in enumerate(parser.scripts):
            target = Path(folder) / f'embedded-{i}.mjs'
            target.write_text(script)
            subprocess.run(['node', '--check', str(target)], check=True)
    passed('JavaScript syntax', modules=len(parser.scripts))
    with urllib.request.urlopen(URL, timeout=15) as response:
        served = response.read()
        assert response.status == 200 and 'text/html' in response.headers['Content-Type']
        assert hashlib.sha256(served).digest() == hashlib.sha256(original).digest()
    passed('HTTP project subpath serves exact repository HTML', bytes=len(served))

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path='/usr/bin/chromium', headless=True,
            args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        report['browser'] = browser.version
        desktop = browser.new_context(viewport={'width': 1440, 'height': 1000}, device_scale_factor=1)
        page = boot(desktop)
        passed('Desktop start screen and WebGL', screenshot=capture(page, 'desktop-start'))
        act(page, '[data-start="free"]')
        assert saved(page)['mode'] == 'free' and saved(page)['tankPlaced'] is False
        place_tank(page)
        passed('Free game: place 120 litre aquarium', snapshot=snapshot(page), screenshot=capture(page, 'desktop-tank'))

        act(page, '[data-panel="shop"]')
        act(page, '[data-department="pflanzen"]')
        assert page.locator('[data-species]:visible').count() > 0
        plant = page.locator('[data-species]:visible').first.get_attribute('data-species')
        act(page, f'[data-species="{plant}"]')
        act(page, '[data-act="add-species"]')
        page.wait_for_function('window.aquariumSnapshot().plants === 1')
        page.wait_for_function('window.aquariumSnapshot().graphics.detailModels >= 1', timeout=60000)
        act(page, '[data-department="tiere"]')
        fish = page.locator('[data-species]:visible').first.get_attribute('data-species')
        act(page, f'[data-species="{fish}"]')
        act(page, '[data-act="add-species"]')
        page.wait_for_function('window.aquariumSnapshot().animals === 1')
        page.wait_for_function('window.aquariumSnapshot().graphics.detailModels >= 2', timeout=60000)
        close_panel(page)
        passed('Plant and animal catalogs, insertion and 3D model loading', plant=plant, animal=fish,
               snapshot=snapshot(page), screenshot=capture(page, 'desktop-populated'))

        act(page, '[data-panel="lab"]')
        act(page, '[data-act="quick-test"]')
        assert 'no2' in saved(page)['measurements']
        act(page, '[data-panel="time"]')
        before_day = snapshot(page)['day']
        act(page, '[data-advance="1"]')
        assert snapshot(page)['day'] == before_day + 1
        assert not snapshot(page)['failed']
        passed('Water measurements and one simulated day')

        with page.expect_download() as download_info:
            act(page, '[data-act="export"]')
        export_path = RUN / 'test-save.json'
        download_info.value.save_as(str(export_path))
        exported = json.loads(export_path.read_text())
        assert exported['tankPlaced'] is True and len(exported['entities']) == 2
        before_reload = saved(page)
        page.reload(wait_until='load')
        act(page, '[data-start="resume"]')
        assert_restored(before_reload, saved(page))
        passed('Save export and localStorage restoration after reload')
        desktop.close()

        imported_context = browser.new_context(viewport={'width': 1180, 'height': 820})
        imported_page = boot(imported_context)
        act(imported_page, '[data-start="free"]')
        imported_page.locator('#import-file').set_input_files(str(export_path))
        imported_page.wait_for_function('window.aquariumSnapshot().entities === 2', polling=100)
        assert_restored(exported, saved(imported_page))
        passed('Save file import into a fresh browser profile')
        imported_context.close()

        tablet = browser.new_context(viewport={'width': 1180, 'height': 820}, device_scale_factor=1, is_mobile=True, has_touch=True)
        page = boot(tablet)
        assert page.evaluate('navigator.maxTouchPoints > 0')
        act(page, '[data-start="tutorial"]', True)
        assert saved(page)['mode'] == 'tutorial'
        place_tank(page, tutorial=True, touch=True)
        assert saved(page)['tutorialStep'] == 1
        passed('Tablet touch: tutorial start and aquarium placement', screenshot=capture(page, 'tablet-tutorial'))

        for product, field, value in [('substrate-sand', 'substrate', 'sand'), ('filter-internal120', 'filter', 'internal120'), ('light-basic', 'light', 'basic')]:
            act(page, '[data-act="tutorial-action"]', True)
            act(page, f'[data-buy="{product}"]', True)
            assert saved(page)[field] == value
            close_panel(page, True)
            act(page, '[data-act="tutorial-next"]', True)
        act(page, '[data-act="tutorial-action"]', True)
        act(page, '[data-species]', True)
        act(page, '[data-act="add-species"]', True)
        assert snapshot(page)['plants'] == 1
        close_panel(page, True)
        act(page, '[data-act="tutorial-next"]', True)
        act(page, '[data-act="tutorial-action"]', True)
        act(page, '[data-act="quick-test"]', True)
        assert 'no2' in saved(page)['measurements']
        close_panel(page, True)
        act(page, '[data-act="tutorial-next"]', True)
        act(page, '[data-act="tutorial-action"]', True)
        act(page, '[data-advance="7"]', True)
        assert snapshot(page)['day'] >= 7 and not snapshot(page)['failed']
        close_panel(page, True)
        act(page, '[data-act="tutorial-next"]', True)
        act(page, '[data-act="tutorial-action"]', True)
        act(page, '[data-species]', True)
        assert saved(page)['tutorialReadSpecies'] is True
        act(page, '[data-act="close-modal"]', True)
        close_panel(page, True)
        act(page, '[data-act="tutorial-next"]', True)
        assert saved(page)['tutorialCompleted'] is True and saved(page)['mode'] == 'free'
        expect(page.locator('#modal-root')).to_contain_text('Tutorial abgeschlossen')
        passed('Tablet touch: all eight tutorial stages completed', screenshot=capture(page, 'tablet-tutorial-complete'))
        act(page, '[data-act="close-modal"]', True)
        page.set_viewport_size({'width': 820, 'height': 1180})
        expect(page.locator('#scene canvas')).to_be_visible()
        assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
        act(page, '[data-panel="lab"]', True)
        expect(page.locator('[data-act="quick-test"]')).to_be_visible()
        close_panel(page, True)
        passed('Tablet portrait resize and touch menu', screenshot=capture(page, 'tablet-portrait'))
        report['final_snapshot'] = snapshot(page)
        tablet.close()
        browser.close()

    assert not report['page_errors'], report['page_errors']
    assert not report['failed_requests'], report['failed_requests']
    assert not report['http_errors'], report['http_errors']
    # Python's static server reports the browser's automatic favicon request as 404.
    # Record this existing missing asset separately; never suppress other errors.
    unexpected_console = [error for error in report['console_errors']
                          if not (error['location'].get('url', '').endswith('/favicon.ico') and '404' in error['text'])]
    assert not unexpected_console, unexpected_console
    assert not report['external_requests'], report['external_requests']
    passed('No JavaScript errors, failed game requests or external runtime requests', missing_favicon=len(report['console_errors']))
    assert (ROOT / 'index.html').read_bytes() == original
    passed('Game file unchanged by validation')
    report['status'] = 'passed'
except Exception as error:
    report['status'] = 'failed'
    report['failure'] = str(error)
    report['traceback'] = traceback.format_exc()
    try:
        if 'page' in globals() and not page.is_closed():
            capture(page, 'failure')
            report['failure_ui'] = page.locator('body').inner_text()[:12000]
    except Exception:
        pass
    print(report['traceback'], flush=True)
    raise
finally:
    (RUN / 'report.json').write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
    (TOOLS / 'results' / 'latest-run.txt').write_text(str(RUN) + '\n')
    print('Report:', RUN / 'report.json', flush=True)
