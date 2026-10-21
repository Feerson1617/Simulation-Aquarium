"""Real UI regressions for device input, persistence and Quest 1.
Run against a local server or AQUARIUM_URL=.../pr-preview/pr-8/.
Uses isolated browser contexts; does not overwrite an existing browser profile.
"""
import json, os, subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
from device_browser_helpers import expert_checks, adoption_checks

ROOT = Path(__file__).resolve().parents[1]
URL = os.environ.get('AQUARIUM_URL', 'http://127.0.0.1:8000/aquarium-simulation/')
OUT = Path(os.environ.get('AQUARIUM_DEVICE_RESULTS', '/tmp/aquarium-device-regressions'))
OUT.mkdir(parents=True, exist_ok=True)
report = {'checks': [], 'errors': [], 'failed_requests': [], 'console_errors': [], 'commit': subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()}

def passed(text):
    report['checks'].append(text); print('PASS',text,flush=True)

def continued_focus(p):
    assert p.evaluate('document.activeElement !== document.body && document.activeElement.isConnected && !document.activeElement.closest("[inert],[hidden]") && !!document.activeElement.getClientRects().length')
    before=p.evaluate('window.__deviceFocusBefore=document.activeElement;document.activeElement.dataset')
    p.keyboard.press('Tab'); p.keyboard.press('Shift+Tab')
    assert p.evaluate('document.activeElement===window.__deviceFocusBefore'),(before,p.evaluate('document.activeElement.outerHTML'))

def dialog_keyboard(p):
    editor=p.locator('.equipment-sheet')
    close=editor.locator('[data-equipment-close]'); save=editor.locator('[data-equipment-save]')
    close.focus(); p.keyboard.press('Shift+Tab'); expect(save).to_be_focused()
    p.keyboard.press('Tab'); expect(close).to_be_focused()
    assert p.evaluate('document.documentElement.classList.contains("device-adjusting") && document.querySelector("#learning-root").inert')

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
        for mode, touch, width in [('mouse',False,1366),('touch-portrait',True,768),('touch-landscape',True,1366)]:
            c = b.new_context(viewport={'width': width, 'height': 1024}, has_touch=touch, is_mobile=touch)
            c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
            p = c.new_page(); p.set_default_timeout(45000)
            p.on('pageerror', lambda error: report['errors'].append(str(error)))
            p.on('requestfailed',lambda request: report['failed_requests'].append({'url':request.url,'failure':request.failure}))
            p.on('console',lambda message: report['console_errors'].append({'text':message.text,'location':message.location}) if message.type=='error' else None)
            p.goto(URL); p.wait_for_function('!!window.aquariumLearningSnapshot')
            for grade in [8, 9, 10]:
                start(p, grade)
                before = tank(p, grade)
                for key, value in [('temperature', '26,5'), ('filter', '40'), ('light', '10')]:
                    anchor = p.locator(f'[data-equipment="{key}"]')
                    anchor.tap() if touch else anchor.click()
                    editor = p.locator('.equipment-sheet')
                    dialog_keyboard(p)
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
                        else:
                            session=c.new_cdp_session(p);x=box['x']+box['width']/2;y=box['y']+box['height']/2
                            session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
                            session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y-16}]})
                            session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
                            expect(dial).to_have_attribute('aria-valuenow','26')
                            session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
                            session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y-8}]})
                            session.send('Input.dispatchTouchEvent',{'type':'touchCancel','touchPoints':[]});session.detach()
                            assert tank(p,grade)['params']==before['params']
                    field.fill(value)
                    if key=='light':editor.locator('[data-equipment-intensity]').fill('85')
                    editor.locator('[data-equipment-save]').tap() if touch else editor.locator('[data-equipment-save]').click()
                    continued_focus(p)
                    assert p.evaluate('document.activeElement.dataset.equipment')==key
                    if key=='temperature':
                        anchor.click(); editor.locator('[data-equipment-value]').fill('20'); p.keyboard.press('Escape'); continued_focus(p)
                        assert tank(p,grade)['setTemp']==26.5
                now = tank(p, grade)
                assert now['day'] == before['day'] and now['params'] == before['params']
                assert now['setTemp'] == 26.5 and now['flow'] == 40 and now['hours'] == 10 and now['intensity']==85
                assert now['bacteria'] == before['bacteria'] and now['bacteria2'] == before['bacteria2']
                action(p, 'advance'); after = tank(p, grade)
                assert 25 < after['params']['temp'] < 26.5 and after['setTemp'] == 26.5
                p.reload(); start(p, grade); saved = tank(p, grade)
                assert saved['setTemp'] == 26.5 and saved['flow'] == 40 and saved['hours'] == 10 and saved['intensity']==85
                # Installed aerator stays spatially reachable when switched off.
                before_switch=tank(p,grade)
                for enabled in [False,True]:
                    anchor=p.locator('[data-equipment="air"]'); anchor.tap() if touch else anchor.click()
                    expect(p.locator('[data-equipment-toggle]')).to_be_checked() if not enabled else expect(p.locator('[data-equipment-toggle]')).not_to_be_checked()
                    p.locator('[data-equipment-toggle]').set_checked(enabled);p.locator('[data-equipment-save]').click();continued_focus(p)
                    assert tank(p,grade)['air']==enabled
                    expect(anchor).to_be_visible()
                assert tank(p,grade)['params']==before_switch['params'] and tank(p,grade)['day']==before_switch['day']
                p.screenshot(path=str(OUT/f'{mode}-free-{grade}.png'))
                home(p)
                passed(f'{mode}, grade {grade}: device input, modal keyboard, save/cancel focus, live persistence, aerator off/on, gradual time response, reload')
            start(p, 8, '8-ecosystem'); action(p, 'observe')
            p.locator('[data-quest-answer="0"]').click(); p.locator('[data-quest-answer="1"]').click(); action(p, 'investigate')
            p.locator('[data-learning-value]').fill('25');action(p,'compare');assert p.evaluate('window.aquariumLearningSnapshot().quest.step')==2
            # Real device entry returns focus to the rebuilt investigation tools.
            action(p,'device-temperature');dialog_keyboard(p);p.locator('[data-equipment-value]').fill('20');p.locator('[data-equipment-save]').click();continued_focus(p)
            assert p.evaluate('document.activeElement.dataset.learningToolChoice==="temperature" || document.activeElement.dataset.learn==="device-temperature"')
            assert p.evaluate('window.aquariumLearningSnapshot().study.value')==20
            action(p,'compare');r=p.evaluate('window.aquariumLearningSnapshot().comparison.runs[0]');assert 22<r['finalTest']['params']['temp']<25
            action(p,'device-temperature');p.locator('[data-equipment-value]').fill('26');p.keyboard.press('Escape');continued_focus(p);assert p.evaluate('window.aquariumLearningSnapshot().study.value')==20
            p.locator('[data-learning-value]').fill('25'); action(p, 'compare')
            assert p.evaluate('window.aquariumLearningSnapshot().quest.step') == 3
            p.locator('[data-quest-answer="0"]').click();assert p.evaluate('window.aquariumLearningSnapshot().quest.step')==3
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
            passed(f'{mode}: Quest 1 device plan/cancel focus, 20/24.5/25/26 C, no-op, stale result/conclusion, recompute, completion, reload')
            home(p);expert_checks(p,mode,touch,OUT,continued_focus,dialog_keyboard);passed(f'{mode}: genuine old window-light save, unchanged history, 0.65 feed, expert focus, aerator/skimmer off/on, reload')
            adoption_checks(p,mode,touch,OUT);passed(f'{mode}: adopt and continue test tank; persistent heater and one-off water change use actual core exactly once')
            c.close()
        assert not report['errors'], report['errors']
        assert not report['failed_requests'],report['failed_requests']
        assert not report['console_errors'],report['console_errors']
        report['status'] = 'passed'
    except Exception as error:
        report.update(status='failed',failure=str(error))
        try:p.screenshot(path=str(OUT/'failure.png'))
        except Exception:pass
        raise
    finally:
        (OUT/'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
        b.close()
