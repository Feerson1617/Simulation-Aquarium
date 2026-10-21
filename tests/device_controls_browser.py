"""Real UI regressions for device input, persistence and Quest 1.
Run against a local server or AQUARIUM_URL=.../pr-preview/pr-8/.
Uses isolated browser contexts; does not overwrite an existing browser profile.
"""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

URL = os.environ.get('AQUARIUM_URL', 'http://127.0.0.1:8000/aquarium-simulation/')
OUT = Path(os.environ.get('AQUARIUM_DEVICE_RESULTS', '/tmp/aquarium-device-regressions'))
OUT.mkdir(parents=True, exist_ok=True)
report = {'checks': [], 'errors': []}

def action(p, name):
    p.locator(f'[data-learn="{name}"]').filter(visible=True).first.click()

def start(p, grade, mission=None):
    p.locator(f'[data-learn-grade="{grade}"]').click()
    action(p, 'missions' if mission else 'free')
    if mission:
        p.locator(f'[data-learn-mission="{mission}"]').click()

def home(p):
    if p.locator('[data-learn="close"]:visible').count():
        action(p, 'close')
    action(p, 'more'); action(p, 'home')

def tank(p, grade):
    return p.evaluate('(g)=>JSON.parse(localStorage.getItem("aquarium-learning-tank-v1:"+g+":free"))', grade)

with sync_playwright() as w:
    launch = {'args': ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']}
    if os.environ.get('AQUARIUM_CHROMIUM'):
        launch['executable_path'] = os.environ['AQUARIUM_CHROMIUM']
    b = w.chromium.launch(**launch)
    try:
        for touch in [False, True]:
            c = b.new_context(viewport={'width': 768 if touch else 1360, 'height': 1024}, has_touch=touch, is_mobile=touch)
            c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
            p = c.new_page(); p.set_default_timeout(45000)
            p.on('pageerror', lambda error: report['errors'].append(str(error)))
            p.goto(URL); p.wait_for_function('!!window.aquariumLearningSnapshot')
            for grade in [8, 9, 10]:
                start(p, grade)
                before = tank(p, grade)
                for key, value in [('temperature', '26,5'), ('filter', '40'), ('light', '10')]:
                    anchor = p.locator(f'[data-equipment="{key}"]')
                    anchor.tap() if touch else anchor.click()
                    editor = p.locator('.equipment-sheet')
                    assert not editor.locator('[data-learning-days]').count()
                    field = editor.locator('[data-equipment-value]')
                    dial = editor.get_by_role('slider').first
                    box = dial.bounding_box(); assert box['width'] >= 44 and box['height'] >= 44
                    if key == 'temperature':
                        field.fill(''); editor.locator('[data-equipment-save]').click()
                        expect(editor.locator('[data-control-error]')).to_contain_text('20 bis 30')
                        field.fill('24,5'); dial.focus(); p.keyboard.press('ArrowUp')
                        expect(dial).to_have_attribute('aria-valuenow', '25')
                        if not touch:
                            p.mouse.move(box['x'] + box['width']/2, box['y'] + box['height']/2)
                            p.mouse.down(); p.mouse.move(box['x'] + box['width']/2, box['y'] + box['height']/2 - 16); p.mouse.up()
                            expect(dial).to_have_attribute('aria-valuenow', '26')
                    field.fill(value)
                    editor.locator('[data-equipment-save]').tap() if touch else editor.locator('[data-equipment-save]').click()
                now = tank(p, grade)
                assert now['day'] == before['day'] and now['params'] == before['params']
                assert now['setTemp'] == 26.5 and now['flow'] == 40 and now['hours'] == 10
                assert now['bacteria'] == before['bacteria'] and now['bacteria2'] == before['bacteria2']
                action(p, 'advance'); after = tank(p, grade)
                assert 25 < after['params']['temp'] < 26.5 and after['setTemp'] == 26.5
                p.reload(); start(p, grade); saved = tank(p, grade)
                assert saved['setTemp'] == 26.5 and saved['flow'] == 40 and saved['hours'] == 10
                p.screenshot(path=str(OUT/f'{"touch" if touch else "mouse"}-free-{grade}.png'))
                home(p)
                report['checks'].append(f'{touch=}, grade {grade}: device controls, validation, time response, reload')
            start(p, 8, '8-ecosystem'); action(p, 'observe')
            p.locator('[data-quest-answer="0"]').click(); p.locator('[data-quest-answer="1"]').click(); action(p, 'investigate')
            p.locator('[data-learning-value]').fill('25'); action(p, 'compare')
            assert p.evaluate('window.aquariumLearningSnapshot().quest.step') == 2
            p.locator('[data-learning-value]').fill('24,5'); action(p, 'compare')
            assert p.evaluate('window.aquariumLearningSnapshot().quest.step') == 3
            p.locator('[data-learning-value]').fill('26'); p.locator('[data-quest-answer="0"]').click()
            assert p.evaluate('window.aquariumLearningSnapshot().quest.step') == 3
            action(p, 'compare'); p.locator('[data-quest-answer="1"]').click()
            assert p.evaluate('window.aquariumLearningSnapshot().quest.step') == 4
            p.locator('[data-learning-value]').fill('24,5'); p.locator('[data-quest-answer="0"]').click()
            assert p.evaluate('window.aquariumLearningSnapshot().quest.step') == 4
            action(p, 'compare'); assert p.evaluate('window.aquariumLearningSnapshot().quest.step') == 3
            p.locator('[data-quest-answer="0"]').click(); p.locator('[data-quest-answer="0"]').click()
            assert p.evaluate('window.aquariumLearningSnapshot().quest.step') == 5
            p.reload(); start(p, 8, '8-ecosystem'); assert p.evaluate('window.aquariumLearningSnapshot().quest.step') == 5
            report['checks'].append(f'{touch=}: Quest 1 no-op, decimal input, stale result and conclusion, recompute, completion, reload')
            c.close()
        assert not report['errors'], report['errors']
        report['status'] = 'passed'
    finally:
        (OUT/'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
        b.close()
