"""Real grade flows, paired engine data, teacher tools and responsive DOM over WebGL."""
import json,os
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1]
OUT=Path('/tmp/aquarium-learning-results')/datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S');OUT.mkdir(parents=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/').split('?')[0]
report={'checks':[],'errors':[],'failed_requests':[],'screenshots':[]}
def passed(name):report['checks'].append(name);print('PASS',name,flush=True)
def click(p,a):p.locator('[data-learn="'+a+'"]').filter(visible=True).first.click()
def snap(p):return p.evaluate('window.aquariumLearningSnapshot()')
def screenshot(p,name):p.screenshot(path=str(OUT/name));report['screenshots'].append(name)
def prepare(p,grade,mode='free',mission=None):
 p.locator(f'[data-learn-grade="{grade}"]').click()
 if mode=='free':click(p,'free')
 else:click(p,'missions');p.locator(f'[data-learn-mission="{mission}"]').click()
def plan(p):
 for key,text in {'question':'Wie verändert eine Bedingung den Verlauf?','hypothesis':'Ich vermute eine Veränderung durch den Eingriff.','prediction':'Im Versuch erwarte ich einen anderen Verlauf als in der Kontrolle.','plan':'Ich ändere eine Bedingung, messe beide und halte den Anfang gleich.'}.items():
  loc=p.locator(f'[data-learning-note="{key}"]')
  if loc.count():loc.first.fill(text)
def attach(p):p.on('pageerror',lambda e:report['errors'].append(str(e)));p.on('requestfailed',lambda r:report['failed_requests'].append(r.url))
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get('AQUARIUM_CHROMIUM','/usr/bin/chromium'),args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 try:
  context=browser.new_context(viewport={'width':1360,'height':960},accept_downloads=True);page=context.new_page();page.set_default_timeout(90000);attach(page)
  page.goto(URL);page.wait_for_function('!!window.aquariumLearningSnapshot');expect(page.locator('[data-learn-grade]')).to_have_count(3);assert not page.locator('[data-start]:visible').count();screenshot(page,'01-grade-start.png');passed('grade selection precedes learning mode; legacy controls are hidden')
  legacy=json.loads((ROOT/'tests/fixtures/legacy-v1.json').read_text());page.evaluate('(s)=>localStorage.setItem("aquarium-werkstatt-v1",JSON.stringify(s))',legacy);free_saved=page.evaluate('localStorage.getItem("aquarium-werkstatt-v1")')
  for grade in [8,9,10]:
   prepare(page,grade);assert snap(page)['grade']==grade;assert page.locator('#scene canvas').count()==1;assert page.evaluate('document.querySelector("#scene canvas").width>100');assert not page.locator('.toolbar:visible').count();assert not page.locator('.timebar:visible').count()
   screenshot(page,f'0{grade-6}-grade-{grade}-playfield.png');click(page,'observe');text=page.locator('.learn-panel').inner_text()
   if grade==8:assert not any(k in text for k in ['Nitrit\n','Nitrat\n','Ammonium\n','Kohlenstoffdioxid\n']);assert 'Wasserbelastung' in text
   if grade==9:assert 'Modellgenotypen einblenden' in text;assert 'Temperatur' not in text
   if grade==10:assert 'Nährstoffe' in text and 'Wasserbelastung' in text
   click(page,'measure');assert len(snap(page)['measurements'])==1
   page.locator('[data-learn-help="load"]').click();expect(page.get_by_role('dialog',name='Begriffshilfe')).to_be_visible();page.keyboard.press('Escape');assert not page.locator('.learn-help-pop').count();assert page.evaluate('document.querySelector("#scene").inert');click(page,'close');assert not page.evaluate('document.querySelector("#scene").inert')
   passed(f'grade {grade}: reduced observations, contextual help, actual measurement, camera gating')
   click(page,'investigate');
   if grade==9:click(page,'population-compare')
   else:click(page,'compare')
   assert snap(page)['comparison'] is None
   plan(page)
   if grade==9:
    page.locator('[data-learning-environment]').select_option('dark');click(page,'population-compare');comp=snap(page)['comparison'];assert comp['kind']=='population';assert comp['runs'][0]['control'][0]==comp['runs'][0]['test'][0];assert comp['runs'][0]['test'][-1]['A']!=comp['runs'][0]['control'][-1]['A']
   else:
    page.locator('[data-learning-tool]').select_option('light');page.locator('[data-learning-value]').fill('0');click(page,'compare');comp=snap(page)['comparison'];assert comp['kind']=='ecology';run=comp['runs'][0];assert run['initialControl']==run['initialTest'];assert len(run['control'])==13
    expected=page.evaluate('s=>window.aquariumSimulationProbe(s,3)',run['initialControl']);assert expected['params']==run['finalControl']['params'];modified=json.loads(json.dumps(run['initialTest']));modified['hours']=0;expected=page.evaluate('s=>window.aquariumSimulationProbe(s,3)',modified);assert expected['params']==run['finalTest']['params'];assert run['finalControl']['params']['oxygen']>run['finalTest']['params']['oxygen'];assert any(x['photosynthesis']>0 for x in run['control'][1:]);assert all(x['photosynthesis']==0 for x in run['test'][1:]);assert all(x['respiration']>0 for x in run['control'][1:]);assert comp['planning']['prediction']
   assert page.locator('.learn-chart').count()==1;page.locator('.learn-chart').scroll_into_view_if_needed();screenshot(page,f'grade-{grade}-comparison.png')
   with page.expect_download() as dl:click(page,'export')
   f=OUT/f'grade-{grade}-product.json';dl.value.save_as(str(f));product=json.loads(f.read_text());assert product['profile']['grade']==grade and product['comparison']['runs'];assert product['notes']['hypothesis']
   with page.expect_download() as dl:click(page,'csv')
   f=OUT/f'grade-{grade}-data.csv';dl.value.save_as(str(f));assert len(f.read_text().splitlines())>10
   with page.expect_download() as dl:click(page,'chart')
   f=OUT/f'grade-{grade}-chart.svg';dl.value.save_as(str(f));assert 'xmlns="http://www.w3.org/2000/svg"' in f.read_text()
   passed(f'grade {grade}: genuine paired data and exported JSON/CSV/SVG, hypothesis required')
   click(page,'close')
   if grade==9:
    click(page,'material');click(page,'genes');plan(page);page.locator('[data-learning-mother]').select_option('1');page.locator('[data-learning-father]').select_option('6');click(page,'punnett');assert page.locator('.learn-panel table').count()>=1;click(page,'cross');p=snap(page)['population'];assert all(i['loci']['A']==['A','a'] for i in p['individuals']);assert all(i['parents']==[1,6] for i in p['individuals']);click(page,'cross');p=snap(page)['population'];assert p['generation']==2 and len(p['archive'])==72;assert any(i['loci']['A']==['a','a'] for i in p['individuals']);screenshot(page,'grade-9-f2.png');click(page,'close');passed('real Mendel F1/F2 with predictions, Punnett probabilities and archived parent identities')
   before=snap(page);page.reload();page.wait_for_function('!!window.aquariumLearningSnapshot');prepare(page,grade);after=snap(page);assert after['notes']==before['notes'];assert after['comparison']==before['comparison'];assert after['measurements']==before['measurements'];assert after['population']==before['population'];click(page,'home');assert page.evaluate('localStorage.getItem("aquarium-werkstatt-v1")')==free_saved
   passed(f'grade {grade}: notes, data, populations and measurements survive reload; legacy save unchanged')
  # Every mission is an actual selectable and runnable learning flow.
  missions={8:['8-ecosystem','8-oxygen','8-foodweb','8-health','8-forest'],9:['9-traits','9-mendel','9-population','9-darwin'],10:['10-enrichment','10-carbon','10-restore','10-northsea','10-wadden']}
  for grade,ids in missions.items():
   for id in ids:
    prepare(page,grade,'missions',id);assert snap(page)['profile']['mission']==id;click(page,'mission-info');text=page.locator('.learn-panel').inner_text();assert 'Dein Erkenntnisziel' in text
    if id in ['8-forest','9-darwin','10-northsea','10-wadden']:assert page.locator('.learn-transfer').count();assert page.locator('.learn-transfer a').count()>0
    if id=='10-wadden':assert 'Plastik ist kein Pflanzennährstoff' in text;screenshot(page,'grade-10-wadden-transfer.png')
    click(page,'close');click(page,'advance');assert page.evaluate('window.aquariumSnapshot().day')==46;click(page,'home')
   passed(f'grade {grade}: every mission opens with its own reconstruction and actual biological simulation')
  # Offline teacher preparation and differentiated surfaces.
  click(page,'teacher');page.locator('[data-teacher="grade"]').select_option('8');page.locator('[data-teacher="mission"]').select_option('8-oxygen');page.locator('[data-teacher="support"]').select_option('guided');page.locator('[data-teacher="help"]').uncheck();page.locator('[data-teacher-metric="no2"]').check();screenshot(page,'teacher-preparation.png')
  with page.expect_download() as dl:click(page,'config-export')
  config=OUT/'teacher-config.json';dl.value.save_as(str(config));assert json.loads(config.read_text())['support']=='guided'
  click(page,'teacher-launch');assert snap(page)['support']=='guided' and snap(page)['help']==False;assert not page.locator('[data-learn-help]:visible').count();assert 'no2' in snap(page)['visibleMetrics'];plan(page);page.locator('[data-learning-value]').fill('0');click(page,'compare');guided=snap(page)['comparison'];assert guided['runs'];click(page,'close');click(page,'observe');assert 'Nitrit' in page.locator('.learn-panel').inner_text();click(page,'close');click(page,'home');click(page,'teacher')
  page.locator('[data-teacher="support"]').select_option('independent');click(page,'teacher-launch');click(page,'compare');independent=snap(page)['comparison'];assert independent['runs']==guided['runs'];assert snap(page)['support']=='independent';click(page,'close');click(page,'home');click(page,'teacher');page.locator('[data-teacher="support"]').select_option('partial');page.locator('[data-learning-import="config"]').set_input_files(str(config));expect(page.locator('[data-teacher="support"]')).to_have_value('guided')
  page.locator('[data-learning-import="product"]').set_input_files(str(OUT/'grade-8-product.json'));expect(page.locator('.learn-panel')).to_contain_text('Lernprodukt Klasse 8');expect(page.locator('.learn-panel .learn-chart')).to_have_count(1);passed('teacher prep, local config import/export, product inspection; support changes leave engine results identical')
  click(page,'teacher-reset');assert page.evaluate('!!localStorage.getItem("aquarium-learning-tank-v1:8:8-oxygen:previous")');click(page,'teacher-restore');assert page.evaluate('JSON.parse(localStorage.getItem("aquarium-learning-notes-v1:aquarium-learning-tank-v1:8:8-oxygen")).comparison!==null');passed('study reset creates a local backup and teacher can restore notes and real comparison')
  click(page,'close');click(page,'expert');assert snap(page)['screen']=='expert';page.locator('[data-graphics-profile="ipad"]').click();page.locator('[data-start="resume"]').click();assert page.evaluate('window.aquariumSnapshot().catalogCount')==144;assert page.locator('.toolbar:visible').count();assert not page.evaluate('document.querySelector("#scene").inert');passed('expert mode resumes old save and full catalog without replacing it with a learning tank')
  context.close();context=browser.new_context(viewport={'width':768,'height':1024},is_mobile=True,has_touch=True);page=context.new_page();page.set_default_timeout(90000);attach(page);page.goto(URL);page.wait_for_function('!!window.aquariumLearningSnapshot');prepare(page,8,'missions','8-oxygen');click(page,'observe');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');screenshot(page,'ipad-grade-8-observe.png');page.locator('[data-learn-help="oxygen"]').tap();assert page.locator('.learn-help-pop').is_visible();page.locator('[data-learn="help-close"]').tap();click(page,'close');click(page,'tweezers');assert page.locator('[data-learn="tweezers"]').get_attribute('aria-pressed')=='true';assert page.evaluate('window.aquariumAquascapingSnapshot().enabled');page.keyboard.press('Escape');assert page.locator('[data-learn="tweezers"]').get_attribute('aria-pressed')=='false';click(page,'home');prepare(page,9);click(page,'material');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');screenshot(page,'ipad-grade-9-genetics.png');click(page,'close');click(page,'home');prepare(page,10,'missions','10-wadden');click(page,'mission-info');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');screenshot(page,'ipad-grade-10-transfer.png');passed('tablet portrait touch: all grades, help, modal scrolling, no horizontal overflow and real tweezers')
  assert not report['errors'],report['errors'];assert not report['failed_requests'],report['failed_requests'];passed('no JavaScript exceptions or failed asset requests');report['status']='passed'
 except Exception as error:
  report['status']='failed';report['failure']=str(error);screenshot(page,'failure.png');raise
 finally:
  (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('RESULTS',OUT,flush=True);browser.close()
