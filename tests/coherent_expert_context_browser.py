"""Restore a genuinely produced product and inspect it in the technical view.

This is a saved-evidence regression, not a newly earned quest completion. Supply
the selected.json created through real actions by coherent_workspace_browser.py.
"""
import hashlib,json,os,subprocess,traceback,xml.etree.ElementTree as ET
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
from biology_browser_helpers import action
ROOT=Path(__file__).resolve().parents[1];ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium')
OUT=Path(os.environ.get('AQUARIUM_EXPERT_RESULTS','/tmp/coherent-expert-context'))/ENGINE;OUT.mkdir(parents=True,exist_ok=True)
fixture=Path(os.environ.get('AQUARIUM_SELECTED_PRODUCT',str(ROOT/'docs/coherent-learning/evidence/prototype/webkit/selected.json')))
product=json.loads(fixture.read_text());selected=product['viewContext']
slot='aquarium-learning-tank-v1:8:8-ecosystem';tank=product['comparison']['runs'][0]['initialControl']
session={**product,'version':1,'baseline':tank,'view':selected,'study':{**product['currentPlan'],'metric':'temp','series':selected['series'],'run':selected['run']},'planId':'saved-product-plan'}
source_ui=Path(os.environ.get('AQUARIUM_UI_SOURCE',str(ROOT/'learning-ui.mjs')))
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
report={'engine':ENGINE,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'url':URL,'fixture':str(fixture),'fixture_sha256':hashlib.sha256(fixture.read_bytes()).hexdigest(),'source_ui_sha256':hashlib.sha256(source_ui.read_bytes()).hexdigest(),'expected':selected,'errors':[],'http_requests':[]}
with sync_playwright() as pw:
 launch={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {}
 if ENGINE=='webkit' and os.environ.get('AQUARIUM_WEBKIT'):launch['executable_path']=os.environ['AQUARIUM_WEBKIT']
 b=getattr(pw,ENGINE).launch(**launch);c=b.new_context(viewport={'width':1366,'height':1024},accept_downloads=True)
 c.add_init_script('localStorage.setItem("aquarium-graphics-v1",JSON.stringify({version:1,profile:"ipad"}));'+f'localStorage.setItem({json.dumps(slot)},{json.dumps(json.dumps(tank))});localStorage.setItem({json.dumps("aquarium-learning-notes-v1:"+slot)},{json.dumps(json.dumps(session))})')
 p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:report['errors'].append(str(e)))
 p.on('request',lambda r:report['http_requests'].append(r.url) if r.url.startswith(('http:','https:')) else None)
 try:
  p.goto(URL);p.wait_for_function('!!window.aquariumLearningSnapshot')
  action(p,'teacher');p.locator('[data-teacher="mission"]').select_option('8-ecosystem');action(p,'teacher-launch')
  v=p.evaluate('window.aquariumLearningSnapshot().view');assert v==selected
  chart=p.locator('.learn-results .learn-chart');report['actual_time_before_assertion']=chart.get_attribute('data-view-time');report['actual_series_before_assertion']=chart.get_attribute('data-series-id')
  expect(p.locator('.learn-results')).to_have_attribute('data-series-id',v['seriesId'])
  expect(chart).to_have_attribute('data-view-time','45.25');expect(chart).to_have_attribute('data-series-id',v['seriesId'])
  expect(p.locator('.learn-results')).to_contain_text('Wiederholung 2')
  assert p.locator('tr[data-table-time="45.25"][aria-current="true"]').count()==1
  for action_name,name in [('csv','selected.csv'),('chart','selected.svg')]:
   with p.expect_download() as d:action(p,action_name)
   d.value.save_as(str(OUT/name))
  csv=(OUT/'selected.csv').read_text();assert v['investigationId'] in csv and '45.25' in csv
  svg=ET.fromstring((OUT/'selected.svg').read_text());assert svg.attrib['data-series-id']==v['seriesId'] and svg.attrib['data-view-time']=='45.25'
  assert any('data-time-cursor' in e.attrib for e in svg.iter())
  p.locator('[data-learning-run]').select_option('0');assert p.evaluate('window.aquariumLearningSnapshot().view.repetition')==1
  p.locator('[data-coherent-time]').select_option('48');expect(chart).to_have_attribute('data-view-time','48')
  action(p,'show-test');expect(p.locator('[data-saved-view]')).to_have_attribute('data-repetition','1')
  assert not report['errors']
  if 'standalone-' in URL:assert not [u for u in report['http_requests'] if u!=URL and not u.endswith('/favicon.ico')]
  report['status']='passed';print('PASS technical view uses selected historical series/repetition/time in chart, table, CSV, SVG and saved side',flush=True)
 except Exception as e:
  report.update(status='failed',failure=repr(e));traceback.print_exc()
  try:p.screenshot(path=str(OUT/'failure.png'))
  except Exception:pass
  raise
 finally:(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('REPORT',OUT/'report.json',flush=True);b.close()
