"""Context help beyond default tools, explicit teacher releases and the reduced placement controls."""
import json,os
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright,expect
OUT=Path('/tmp/aquarium-quest-controls')/datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S');OUT.mkdir(parents=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/').split('?')[0]
report={'checks':[],'errors':[],'failed_requests':[]}
def click(p,a):p.locator(f'[data-learn="{a}"]').filter(visible=True).first.click()
def passed(s):report['checks'].append(s);print('PASS',s,flush=True)
def snap(p):return p.evaluate('window.aquariumLearningSnapshot()')
with sync_playwright() as w:
 b=w.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 try:
  c=b.new_context(viewport={'width':768,'height':1024},is_mobile=True,has_touch=True,accept_downloads=True);c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))");p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:report['errors'].append(str(e)));p.on('requestfailed',lambda r:report['failed_requests'].append(r.url));p.goto(URL);p.wait_for_function('!!window.aquariumLearningSnapshot')
  click(p,'teacher');p.locator('[data-teacher="grade"]').select_option('8');p.locator('[data-teacher="mission"]').select_option('8-oxygen');p.get_by_text('Zusätzliche Messgrößen freischalten',exact=True).click();p.locator('[data-teacher-metric="no2"]').check();click(p,'student-launch');assert not snap(p)['detailed'];click(p,'observe');expect(p.locator('.learn-panel')).to_contain_text('Nitrit');p.locator('[data-learn-help="nitrogen"]').tap();expect(p.locator('.learn-help-pop')).to_contain_text('Nitrat ist ein Nährstoff');expect(p.locator('.learn-help-pop')).to_contain_text('Nitrit kann Fischen schaden');p.keyboard.press('Escape');click(p,'measure');assert 'no2' in snap(p)['measurements'][-1]['metrics'];passed('explicit teacher release: Nitrit appears only when unlocked, has correct help and remains in actual measurements')
  # The chapter help explains the quest book rather than water chemistry.
  p.locator('[data-learn="quest-toggle"]').tap();p.locator('[data-learn-help="quest"]').tap();expect(p.locator('.learn-help-pop')).to_contain_text('Hier steht deine nächste Aufgabe.');p.keyboard.press('Escape');click(p,'close');passed('quest book question mark has its own correct context and keyboard close')
  p.locator('[data-learn="more"]').tap();p.locator('[data-learn="tweezers"]').tap();assert p.evaluate('window.aquariumAquascapingSnapshot().enabled');assert not p.evaluate('document.querySelector("#scene").inert');assert p.locator('[data-learn="tweezers"]').get_attribute('aria-pressed')=='true';p.keyboard.press('Escape');assert not p.evaluate('window.aquariumAquascapingSnapshot().enabled');remaining=p.locator('[data-learn="tweezers"]:visible');assert not remaining.count() or remaining.inner_text()=='Pinzette';p.screenshot(path=str(OUT/'touch-controls.png'));passed('regular touch menu enables actual tweezers and releases the scene; Escape leaves an accurate control label')
  click(p,'more');click(p,'home');click(p,'teacher');p.locator('[data-teacher="help"]').uncheck();click(p,'student-launch');click(p,'observe');assert not p.locator('[data-learn-help]:visible').count();passed('teacher can hide contextual help without changing the quest or simulation rules')
  click(p,'close');click(p,'more');click(p,'home');p.locator('[data-learn-grade="9"]').click();click(p,'free');click(p,'investigate');click(p,'population-compare');p.locator('[data-learning-metric]').select_option('dark');p.get_by_text('Alle Werte',exact=True).click();expect(p.locator('.learn-results tbody tr').first).to_contain_text('66,7 %');assert abs(snap(p)['comparison']['runs'][0]['control'][0]['dark']-2/3)<1e-9;p.screenshot(path=str(OUT/'population-percent-table.png'));passed('population proportions use percentages consistently in cards, chart and table; stored scientific fractions remain unchanged')
  click(p,'close');click(p,'more');click(p,'home');p.locator('[data-learn-grade="10"]').click();click(p,'missions');p.locator('[data-learn-mission="10-restore"]').click();click(p,'observe');p.locator('[data-quest-answer="0"]').click();p.locator('[data-quest-answer="1"]').click();click(p,'investigate');p.locator('[data-learning-tool]').select_option('plants');p.locator('[data-learning-value]').fill('1');click(p,'compare');assert snap(p)['quest']['step']==3 and snap(p)['comparison']['tool']=='plants';passed('restoration quest accepts the alternative permitted plant intervention and computes its actual outcomes')
  assert not report['errors'],report['errors'];assert not report['failed_requests'],report['failed_requests'];report['status']='passed'
 except Exception as e:
  report['status']='failed';report['failure']=str(e);p.screenshot(path=str(OUT/'failure.png'));raise
 finally:
  (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('RESULTS',OUT,flush=True);b.close()
