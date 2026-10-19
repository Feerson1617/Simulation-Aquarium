"""Integration on the real engine, real controls and isolated browser profiles."""
import json,os
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1]
OUT=Path('/tmp/aquarium-ecosystem-results')/datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S');OUT.mkdir(parents=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
legacy=json.loads((ROOT/'tests/fixtures/legacy-v1.json').read_text());report={'checks':[],'errors':[],'failed_requests':[]}
def passed(name):report['checks'].append(name);print('PASS',name,flush=True)
def click(p,s):p.locator(s).filter(visible=True).first.click()
def home(p):
 if not p.locator('[data-act="home"]:visible').count():click(p,'[data-panel="time"]')
 click(p,'[data-act="home"]')
def raw(p,key):return p.evaluate('(key)=>localStorage.getItem(key)',key)
def saved(p,key):return json.loads(raw(p,key))
def scenario(p,id):click(p,'[data-scenarios]');click(p,f'[data-scenario-start="{id}"]')
def probe(p,s,days):return p.evaluate('([s,d])=>window.aquariumSimulationProbe(s,d)',[s,days])
def clone(s):return json.loads(json.dumps(s))
with sync_playwright() as playwright:
 browser=playwright.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 try:
  context=browser.new_context(viewport={'width':1360,'height':960},accept_downloads=True)
  page=context.new_page();page.set_default_timeout(20000);page.on('pageerror',lambda e:report['errors'].append(str(e)));page.on('requestfailed',lambda r:report['failed_requests'].append(r.url))
  # Seed only once; reload must use the actual saved state.
  page.goto(URL);page.locator('button[data-graphics-profile="ipad"]').click();page.evaluate('(s)=>localStorage.setItem("aquarium-werkstatt-v1",JSON.stringify(s))',legacy);page.reload();click(page,'[data-start="resume"]')
  click(page,'#ecosystem-button');initial=page.evaluate('window.aquariumAnalysisSnapshot()')
  for tab in ['web','microbes','nitrogen','carbon','energy','factors']:
   click(page,f'[data-eco-tab="{tab}"]');assert page.locator('.study-content').inner_text().strip()
  assert page.evaluate('window.aquariumAnalysisSnapshot()')==initial
  page.screenshot(path=str(OUT/'analysis-factors.png'));click(page,'[data-eco-close]');home(page)
  passed('six analysis tabs use real state without simulation advancement')
  free=raw(page,'aquarium-werkstatt-v1');scenario(page,'supply');key='aquarium-scenario-v1:supply';s=saved(page,key)
  assert raw(page,'aquarium-werkstatt-v1')==free
  click(page,'#ecosystem-button');click(page,'[data-eco-tab="web"]');expect(page.locator('.eco-gap')).to_have_count(1)
  page.screenshot(path=str(OUT/'foodweb.png'));click(page,'.eco-gap');click(page,'[data-eco-hint]');page.locator('#eco-candidate').select_option('ramshorn');assert 'kann die untersuchte Nahrungsbeziehung' in page.locator('.eco-gap-panel').inner_text()
  page.locator('#eco-candidate').select_option('trochus');assert 'Wasserart passt nicht' in page.locator('.eco-gap-panel').inner_text();page.screenshot(path=str(OUT/'supply-gap.png'));click(page,'[data-eco-close]')
  passed('actual gap, incremental hints and environmental suitability')
  starved=probe(page,s,2);fed=clone(s);fed.update(autoFeed=True,foodType='protein',feedRate=.65);fed=probe(page,fed,2)
  health=lambda x:sum(e['health'] for e in x['entities'] if e['species']=='assassin')/2
  assert health(fed)>health(starved)+5,(health(fed),health(starved))
  prey=clone(s);snail=clone(prey['entities'][-1]);snail.update(uid=prey['nextId'],species='ramshorn',dead=False,health=100);prey['nextId']+=1;prey['entities'].append(snail)
  assert health(probe(page,prey,1))>health(probe(page,s,1))
  assert saved(page,key)['day']==s['day'];passed('real engine health responds to alternative feed and actual prey; probes are isolated')
  click(page,'[data-panel="shop"]');click(page,'[data-department="bedarf"]');page.screenshot(path=str(OUT/'catalog-products.png'));click(page,'[data-product="food-protein"]');click(page,'#modal-root [data-buy="food-protein"]');click(page,'[data-act="close-panel"]')
  click(page,'#ecosystem-button');expect(page.locator('.eco-gap')).to_have_count(0);expect(page.locator('.study-edge.dim')).to_have_count(0);click(page,'[data-eco-close]');passed('actual shop feeding updates the network immediately')
  page.wait_for_function('!document.querySelector(".scenario-session").hidden');click(page,'.scenario-session');click(page,'[data-scenario-hint]');page.locator('#scenario-notes').fill('Hypothese: Versorgung prüfen.');click(page,'[data-scenario-close]')
  before=saved(page,key);assert before['scenario']['notes']=='Hypothese: Versorgung prüfen.'
  page.reload();scenario(page,'supply');assert saved(page,key)['scenario']['notes']==before['scenario']['notes'];assert raw(page,'aquarium-werkstatt-v1')==free
  passed('scenario hints, notes and reload keep free save byte-identical')
  page.wait_for_function('!document.querySelector(".scenario-session").hidden');click(page,'.scenario-session');page.once('dialog',lambda d:d.accept());click(page,'[data-scenario-reset="supply"]');assert saved(page,key)['scenario']['attempt']==2;assert saved(page,key+':previous')['scenario']['notes']==before['scenario']['notes'];assert raw(page,'aquarium-werkstatt-v1')==free
  passed('restart increments attempt and retains local backup without overwriting free save')
  click(page,'[data-panel="time"]')
  with page.expect_download() as download:click(page,'[data-act="export"]')
  path=OUT/'scenario-export.json';download.value.save_as(path);assert json.loads(path.read_text())['scenario']['id']=='supply'
  page.locator('#import-file').set_input_files(str(path));page.wait_for_function('document.querySelector("#toast-root").textContent.includes("Spielstand geladen")');assert raw(page,'aquarium-werkstatt-v1')==free
  passed('scenario export/import routes to correct slot')
  home(page)
  for id in ['foodweb','water','leaves','microbes']:
   scenario(page,id);s=saved(page,'aquarium-scenario-v1:'+id);result=probe(page,s,2);assert result['ecology']['lastFlux'] is not None;assert all(v>=0 for v in result['params'].values())
   click(page,'#ecosystem-button');click(page,'[data-eco-tab="web"]');snap=page.evaluate('window.aquariumAnalysisSnapshot()');assert snap['web']['nodes'];click(page,'[data-eco-close]')
   if id=='foodweb':
    assert not snap['web']['gaps'];assert not result['failed'];assert all(e['health']>80 for e in result['entities'] if e['species']=='guppy')
    night=clone(s);night['day']=45;night=probe(page,night,.2);day=clone(s);day['day']=45.3;day=probe(page,day,.2)
    assert night['ecology']['lastFlux']['photosynthesis']==0;assert night['ecology']['lastFlux']['respiration']>0;assert day['ecology']['lastFlux']['photosynthesis']>0
    page.screenshot(path=str(OUT/'scenario-aquarium.png'))
   if id=='leaves':
    bright=clone(s);bright.update(hours=8,intensity=80);bright=probe(page,bright,3);dim=probe(page,s,3)
    planthealth=lambda data:sum(e['health'] for e in data['entities'] if e['species']=='waterweed');assert planthealth(bright)>planthealth(dim)
   if id=='water':
    changed=clone(s);changed['params']['no2']*=.3;changed['params']['nh4']*=.3;changed['bacteria2']=.8
    assert probe(page,changed,1)['params']['no2']<probe(page,s,1)['params']['no2']
   home(page);assert raw(page,'aquarium-werkstatt-v1')==free
  passed('all five scenarios share the engine and preserve free save; research stable and plant/water interventions effective')
  passed('photosynthesis stops at night while respiration continues')
  click(page,'[data-start="resume"]');assert saved(page,'aquarium-werkstatt-v1')['entities']==legacy['entities'];passed('legacy free aquarium resumes after all scenarios')
  context.close();context=browser.new_context(viewport={'width':768,'height':1024},is_mobile=True,has_touch=True);page=context.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)));page.goto(URL);page.locator('button[data-graphics-profile="ipad"]').click()
  page.locator('[data-scenarios]').tap();page.locator('[data-scenario-start="foodweb"]').tap();page.locator('#ecosystem-button').tap();page.locator('[data-eco-tab="microbes"]').tap();assert page.get_by_role('dialog',name='Ökosystem untersuchen',exact=True).bounding_box()['width']<=768;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path=str(OUT/'analysis-touch.png'));page.locator('[data-eco-close]').tap()
  passed('tablet portrait touch operates scenarios and analysis without page overflow')
  assert not report['errors'],report['errors'];assert not report['failed_requests'],report['failed_requests'];passed('no JavaScript exceptions or failed requests')
  report['status']='passed'
 except Exception as error:
  report['status']='failed';report['failure']=str(error);page.screenshot(path=str(OUT/'failure.png'));raise
 finally:
  (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('RESULTS',OUT,flush=True);browser.close()
