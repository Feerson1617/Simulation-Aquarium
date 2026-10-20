"""Focused scientific and persistence checks on the final engine and read-only teacher data."""
import copy,json,os
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path('/tmp/aquarium-learning-additional')/datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S');OUT.mkdir(parents=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/').split('?')[0];report={'checks':[],'errors':[]}
def passed(s):report['checks'].append(s);print('PASS',s,flush=True)
def click(p,s):p.locator('[data-learn="'+s+'"]').filter(visible=True).first.click()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 try:
  c=b.new_context(viewport={'width':1024,'height':768});p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:report['errors'].append(str(e)));p.goto(URL);p.locator('[data-learn-grade="8"]').click();click(p,'free')
  source=p.evaluate('JSON.parse(localStorage.getItem("aquarium-learning-tank-v1:8:free"))');s=copy.deepcopy(source);s['entities']=[e for e in s['entities'] if e['species']=='waterweed'];s.pop('genetics',None);s.pop('spatial',None);s.update(day=45.3,substrate='bare',detritus=0,algae=0,co2Dose=0,autoFeed=False,feedReserve=0,light='basic',hours=14,filter='none',flow=0,air=False);s['params'].update(no3=0,no2=0,nh4=0,po4=0,fe=0,co2=0);before=sum(e['biomass'] for e in s['entities']);after=p.evaluate('s=>window.aquariumSimulationProbe(s,.5)',s);assert sum(e['biomass'] for e in after['entities'])==before;assert after['ecology']['lastFlux']['photosynthesis']==0;assert after['params']['no3']==0 and after['params']['po4']==0;assert after['ecology']['lastFlux']['respiration']>0;passed('real engine: plants stop growth/photosynthesis under exhausted resources while respiration continues')
  click(p,'notebook');p.locator('[data-learning-note="prior"]').fill('Meine erste Erklärung.');p.locator('[data-learning-note="reflection"]').fill('Meine überarbeitete Erklärung mit Grenzen.');click(p,'close');click(p,'home');click(p,'teacher');p.locator('[data-learning-product]').first.click();assert 'Meine erste Erklärung.' in p.locator('.learn-panel').inner_text();assert 'Meine überarbeitete Erklärung' in p.locator('.learn-panel').inner_text();passed('teacher reads separated prior knowledge and later reflection from local learning product')
  # Open help with keyboard and retain modal focus; target remains independent from canvas.
  click(p,'close');p.locator('[data-learn-grade="8"]').click();click(p,'free');click(p,'observe');p.locator('[data-learn-help="load"]').focus();p.keyboard.press('Enter');assert p.locator('.learn-help-pop').is_visible();assert p.evaluate('document.querySelector(".learn-panel").inert');p.keyboard.press('Tab');assert p.evaluate('document.querySelector(".learn-help-pop").contains(document.activeElement)');p.keyboard.press('Escape');assert not p.locator('.learn-help-pop').count();assert p.evaluate('document.querySelector("#scene").inert');click(p,'close');passed('keyboard help traps focus and keeps the aquarium gated until the panel closes')
  c.close();c=b.new_context(viewport={'width':1024,'height':768});c.add_init_script("Storage.prototype.setItem=function(){throw new DOMException('Test quota','QuotaExceededError')}");p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:report['errors'].append(str(e)));p.goto(URL);p.locator('[data-learn-grade="8"]').click();click(p,'free');assert p.evaluate('window.aquariumLearningSnapshot().storageError.length>0');assert p.locator('.learn-storage').is_visible();click(p,'notebook');p.locator('[data-learning-note="hypothesis"]').fill('Ungespeicherte Arbeit bleibt exportierbar.');
  with p.expect_download() as dl:click(p,'export')
  target=OUT/'quota-product.json';dl.value.save_as(str(target));assert json.loads(target.read_text())['notes']['hypothesis']=='Ungespeicherte Arbeit bleibt exportierbar.';passed('blocked local storage warns visibly and still permits an accountless file export')
  assert not report['errors'],report['errors'];report['status']='passed'
 except Exception as e:report['status']='failed';report['failure']=str(e);p.screenshot(path=str(OUT/'failure.png'));raise
 finally:(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('RESULTS',OUT,flush=True);b.close()
