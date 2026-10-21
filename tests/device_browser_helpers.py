"""Shared real-UI checks for the bounded device correction; no quest-state writes."""
import json
from pathlib import Path
from playwright.sync_api import expect
from learning_technical_browser_helpers import technical_start
ROOT=Path(__file__).resolve().parents[1]

def rendered(p):
    frame=p.evaluate('window.aquariumSnapshot().graphics.renderFrame')
    p.wait_for_function('(frame)=>{const g=window.aquariumSnapshot().graphics;return g.renderFrame>frame+2 && g.triangles>3000}',arg=frame)
    boxes=p.locator('.equipment-anchors button:visible').evaluate_all('(buttons)=>buttons.map(b=>{const r=b.getBoundingClientRect();return {key:b.dataset.equipment,x:r.x,y:r.y,w:r.width,h:r.height}})')
    for i,a in enumerate(boxes):
        assert a['x']>=0 and a['y']>=0
        for b in boxes[i+1:]:
            assert a['x']+a['w']<=b['x'] or b['x']+b['w']<=a['x'] or a['y']+a['h']<=b['y'] or b['y']+b['h']<=a['y'],(a,b)

def settings(p):
    if not p.locator('[data-act="open-settings"]:visible').count():p.locator('[data-panel="shop"]').click()
    p.locator('[data-act="open-settings"]').click()

def expert_checks(p,mode,touch,out,continued_focus,dialog_keyboard):
    p.locator('[data-learn="expert"]').click();p.locator('[data-start="free"]').click()
    fixture=ROOT/'tests/fixtures/legacy-window-light-b5751b0.json'
    p.locator('#import-file').set_input_files(str(fixture))
    key='aquarium-scenario-v1:foodweb'
    def saved():return p.evaluate('(k)=>JSON.parse(localStorage.getItem(k))',key)
    p.wait_for_function('(k)=>JSON.parse(localStorage.getItem(k))?.light==="sun"',arg=key)
    before=saved();assert before['feedRate']==.65 and before['light']=='sun'
    settings(p);expect(p.locator('#equipment-controls')).to_be_hidden()
    for field,value in [('hours','12'),('intensity','90')]:
        control=p.locator(f'[data-expert-control="{field}"]');input=control.locator('input');input.click();expect(input).to_be_focused()
        input.fill('');control.locator('[data-expert-save]').click();expect(control.locator('[data-control-error]')).to_contain_text('Bitte')
        assert saved()==before if field=='hours' else saved()['intensity']==95
        input.fill(value);control.locator('[data-expert-save]').click();expect(p.locator(f'[data-expert-setting="{field}"]')).to_be_focused()
    updated=saved();assert updated['hours']==12 and updated['intensity']==90 and updated['light']=='sun'
    assert {k:v for k,v in updated.items() if k not in ['hours','intensity']}=={k:v for k,v in before.items() if k not in ['hours','intensity']}
    assert not p.locator('[data-equipment="light"]:visible').count()
    rendered(p);p.screenshot(path=str(out/f'{mode}-window-light-settings.png'))
    p.locator('[data-panel="care"]').click();field=p.locator('[data-expert-setting="feedRate"]')
    field.click();expect(field).to_be_focused();expect(field).to_have_value('0.65');expect(p.get_by_role('slider',name='Tägliche Futtermenge drehen')).to_have_attribute('aria-valuenow','0.65')
    field.fill('');p.locator('[data-expert-save="feedRate"]').click();assert saved()['feedRate']==.65
    expect(p.locator('[data-control-error]')).to_contain_text('0 bis 5')
    field.fill('0,65');p.locator('[data-expert-save="feedRate"]').click();assert saved()['feedRate']==.65
    expect(p.get_by_role('slider',name='Tägliche Futtermenge drehen')).to_have_attribute('aria-valuenow','0.65')
    # Original menu trigger is removed on opening: anchor fallback must still work.
    settings(p);p.locator('[data-device-open="filter"]').click();dialog_keyboard(p)
    dial=p.get_by_role('slider');dial.focus();p.keyboard.press('ArrowLeft');p.keyboard.press('ArrowRight')
    p.locator('[data-equipment-value]').fill('40');p.locator('[data-equipment-save]').focus();p.keyboard.press('Enter');continued_focus(p)
    assert p.evaluate('document.activeElement.dataset.equipment')=='filter'
    p.locator('[data-equipment="temperature"]').click();expect(p.locator('.equipment-sheet h2')).to_have_text('Heizstab einstellen');dialog_keyboard(p);p.keyboard.press('Escape');continued_focus(p)
    assert saved()['setTemp']==before['setTemp']
    for name in ['air','skimmer']:
        for enabled in [False,True]:
            anchor=p.locator(f'[data-equipment="{name}"]');anchor.tap() if touch else anchor.click();dialog_keyboard(p)
            toggle=p.locator('[data-equipment-toggle]');toggle.tap() if touch else toggle.press('Space');assert toggle.is_checked()==enabled
            if name=='skimmer' and not enabled:rendered(p);p.screenshot(path=str(out/f'{mode}-skimmer-editor.png'))
            p.locator('[data-equipment-save]').click();continued_focus(p)
            assert saved()[name]==enabled;expect(anchor).to_be_visible()
    final=saved();assert final['bacteria']==before['bacteria'] and final['bacteria2']==before['bacteria2']
    assert final['params']==before['params'] and final['history']==before['history'] and final['entities']==before['entities']
    rendered(p);p.screenshot(path=str(out/f'{mode}-expert-devices.png'))
    p.reload();p.locator('[data-learn="expert"]').click();p.locator('[data-scenarios]').click();p.locator('[data-scenario-start="foodweb"]').click()
    restored=saved();assert restored['hours']==12 and restored['intensity']==90 and restored['feedRate']==.65 and restored['flow']==40
    assert restored['history']==final['history'] and restored['entities']==final['entities'] and restored['params']==final['params']
    settings(p)
    expect(p.locator('[data-expert-setting="hours"]')).to_have_value('12');expect(p.locator('[data-expert-setting="intensity"]')).to_have_value('90')
    p.locator('[data-act="close-panel"]').click();p.locator('.learn-expert-entry').click()

def adoption_checks(p,mode,touch,out):
    technical_start(p,8)
    def action(name):p.locator(f'[data-learn="{name}"]').filter(visible=True).first.click()
    def live():return p.evaluate('JSON.parse(localStorage.getItem("aquarium-learning-tank-v1:8:free"))')
    action('investigate')
    for key in ['question','hypothesis','prediction','plan']:
        p.locator(f'[data-learning-note="{key}"]').fill('Gleicher Anfang, eine Änderung. Ich beobachte die tatsächlichen Werte.')
    for tool,value in [('temperature','26'),('water','50')]:
        p.locator(f'[data-learning-tool-choice="{tool}"]').click();p.locator('[data-learning-value]').fill(value)
        p.locator('[data-learning-days]').fill('2');p.locator('[data-learning-repetitions]').fill('1');action('compare')
        result=p.evaluate('window.aquariumLearningSnapshot().comparison.runs[0].finalTest');action('show-test');actual=live()
        # The existing loader records one load event; every other saved field is exact.
        assert actual['events'][0]['title']=='Spielstand geladen' and actual['events'][0]['day']==result['day']
        assert actual['events'][1:]==result['events'][:99]
        assert {k:v for k,v in actual.items() if k!='events'}=={k:v for k,v in result.items() if k!='events'}
        expected=p.evaluate('s=>window.aquariumSimulationProbe(s,1)',result);action('advance');assert live()['params']==expected['params'] and live()['day']==result['day']+1
        if tool=='temperature':assert live()['setTemp']==26
        action('investigate')
    action('close');rendered(p);p.screenshot(path=str(out/f'{mode}-adopted-test.png'));action('home')
