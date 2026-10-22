"""Render cap only: an intentionally crowded fixture, without advancing biology."""
import copy,json,os
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1];OUT=Path('/tmp/aquarium-population-browser');OUT.mkdir(exist_ok=True)
fixture=json.loads((ROOT/'tests/fixtures/legacy-v1.json').read_text());template=copy.deepcopy(fixture['entities'][1]);fixture.update(liters=700,day=45.35,nextId=102)
fixture['entities']=fixture['entities'][:1]
for uid in range(2,102):
 e=copy.deepcopy(template);e.update(uid=uid,species='molly',sex='♂',genotype='AA',variant='black',x=(uid%10-4.5)*.5,z=(uid//10%3-1)*.7);fixture['entities'].append(e)
report={'errors':[]}
with sync_playwright()as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']);page=browser.new_page(viewport={'width':1250,'height':900});page.set_default_timeout(120000);page.on('pageerror',lambda e:report['errors'].append(str(e)))
 try:
  page.goto(os.environ.get('AQUARIUM_TEST_URL','http://127.0.0.1:8000/aquarium-simulation/?expert=1'));page.locator('button[data-graphics-profile="ipad"]').click();page.locator('[data-start="free"]').click();page.locator('#import-file').set_input_files({'name':'crowded-render-test.json','mimeType':'application/json','buffer':json.dumps(fixture).encode()});page.locator('[data-act="close-panel"]').click()
  page.wait_for_function('window.aquariumRenderedIndividuals().filter(e=>e.fish).length===64')
  expect(page.locator('.population-view-note')).to_contain_text('64 von 100');before=page.evaluate('localStorage.getItem("aquarium-werkstatt-v1")');state=json.loads(before);assert len([e for e in state['entities']if e['species']=='molly'])==100
  page.screenshot(path=str(OUT/'ipad-64-of-100.png'),timeout=120000)
  page.locator('#genetics-button').click();assert page.evaluate('window.aquariumGeneticsSnapshot().population.living')==100
  page.locator('[data-gen-page="1"]').click();page.locator('[data-gen-inspect="101"]').click()
  page.wait_for_function('window.aquariumRenderedIndividuals().some(e=>e.uid===101)');assert page.evaluate('window.aquariumRenderedIndividuals().filter(e=>e.fish).length')==64
  page.locator('[data-act="close-panel"]').click();page.locator('[data-panel="time"]').click();page.locator('[data-graphics-setting]').select_option('high');page.wait_for_function('window.aquariumRenderedIndividuals().filter(e=>e.fish).length===100');assert page.evaluate('localStorage.getItem("aquarium-werkstatt-v1")')==before
  assert not report['errors'],report['errors'];report.update(status='passed',living=100,ipadRendered=64,desktopRendered=100,selected=101,saveUnchanged=True)
  print('PASS: 100 fish remain simulated/saved; iPad draws 64 with a visible notice and selected fish; Desktop draws all 100.',flush=True)
 except Exception as error:
  report.update(status='failed',failure=str(error));raise
 finally:
  (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));browser.close()
