"""Use the prototype's ordinary tools without losing the selected investigation.

No quest completion is injected. Plan exports are intentionally unexecuted.
"""
import hashlib,json,os,subprocess,time,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
from biology_browser_helpers import action,reveal,activities

ROOT=Path(__file__).resolve().parents[1]
ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium')
OUT=Path(os.environ.get('AQUARIUM_TOOLS_RESULTS','/tmp/aquarium-coherent-tools'))/ENGINE
OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
sources={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in ROOT.iterdir() if p.suffix in ['.mjs','.html','.css']}
report={'engine':ENGINE,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'sources':sources,'checks':[],'errors':[]}
def snap(p):return p.evaluate('window.aquariumLearningSnapshot()')
def passed(name,**extra):report['checks'].append({'name':name,**extra});print('PASS',name,flush=True)
def ready(p):p.wait_for_function('window.aquariumLearningSnapshot().prototype.render.sides.length===2&&window.aquariumLearningSnapshot().prototype.render.sides.every(s=>s.detailModels===s.objects)&&window.aquariumLearningSnapshot().prototype.render.frames>2')
def same(p,view):
 ready(p);s=snap(p);assert s['view']==view
 for r in s['prototype']['render']['sides']:
  assert r['day']==view['time'] and r['stateId']==view['stateIds'][r['side']]
 assert not p.evaluate('document.documentElement.scrollWidth>innerWidth')
def export(p,name):
 with p.expect_download() as d:action(p,'export')
 d.value.save_as(str(OUT/name));return json.loads((OUT/name).read_text())
def heater(p,value):
 action(p,'device-temperature');reveal(p.locator('[data-equipment-value]')).fill(str(value));p.locator('[data-equipment-save]').click()
with sync_playwright() as pw:
 launch={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {}
 if ENGINE=='webkit' and os.environ.get('AQUARIUM_WEBKIT'):launch['executable_path']=os.environ['AQUARIUM_WEBKIT']
 b=getattr(pw,ENGINE).launch(**launch)
 c=b.new_context(viewport={'width':768,'height':1024},is_mobile=True,has_touch=True,accept_downloads=True)
 c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
 p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:report['errors'].append(str(e)))
 try:
  p.goto(URL);p.wait_for_function('!!window.aquariumLearningSnapshot');p.locator('[data-learn-grade="8"]').click();action(p,'missions');p.locator('[data-learn-mission="8-ecosystem"]').click();ready(p)
  v=snap(p)['view'];assert v['time']==45 and v['investigationId']
  action(p,'more');same(p,v);assert not p.locator('[data-learn="tweezers"]').count();action(p,'notebook');same(p,v)
  expect(p.locator('.coherent-notebook')).to_contain_text('Für diesen Plan gibt es noch keine Vergleichswerte')
  initial=export(p,'initial-plan.json');assert initial['viewContext'] is None and initial['visiblePlan']['context']==v
  validated=p.evaluate('async x=>(await import("./learning-model.mjs")).validateLearningProduct(x)',initial);assert validated['visiblePlan']==initial['visiblePlan']
  action(p,'close');action(p,'observe');action(p,'close');activities(p)
  for n in [0,1]:p.locator(f'[data-quest-answer="{n}"]:visible').first.click()
  heater(p,27);reveal(p.locator('[data-learning-days]')).fill('4');expect(p.locator('[data-learn="compare"]')).to_have_text('4 Spieltage gemeinsam beobachten')
  action(p,'compare');p.locator('[data-coherent-time]:visible').first.select_option('49');ready(p)
  v=snap(p)['view'];assert v['time']==49
  action(p,'more');same(p,v);action(p,'notebook');same(p,v)
  expect(p.locator('.learn-results').last).to_have_attribute('data-view-time','49')
  measured=export(p,'selected-result.json');assert measured['viewContext']==v and measured['visiblePlan'] is None
  action(p,'more');action(p,'glossary');same(p,v);action(p,'close');action(p,'more');action(p,'display');same(p,v)
  for profile in ['high','ipad']:
   p.locator('[data-learning-graphics]').select_option(profile);same(p,v)
  action(p,'close');same(p,v)
  passed('Results, More, glossary and graphics profile changes retain the selected two actual tank states',view=v)
  action(p,'workspace-plan');heater(p,26);plan=snap(p)['view'];assert plan['time']==45 and plan['investigationId']!=v['investigationId']
  action(p,'more');action(p,'notebook');same(p,plan)
  assert not p.locator('.learn-results').count();expect(p.locator('.coherent-notebook')).to_contain_text('Für diesen Plan gibt es noch keine Vergleichswerte')
  unexecuted=export(p,'unexecuted-plan-with-history.json');assert unexecuted['viewContext'] is None
  assert unexecuted['visiblePlan']['context']==plan and unexecuted['comparison']['id']==v['investigationId']
  assert unexecuted['visiblePlan']['test']['params']['temp']==25 and unexecuted['visiblePlan']['test']['setTemp']==26
  action(p,'more');action(p,'teacher');p.locator('[data-learning-import="product"]').set_input_files(str(OUT/'unexecuted-plan-with-history.json'))
  expect(p.locator('.learn-plan-evidence')).to_contain_text('Noch nicht durchgeführter Versuchsplan')
  expect(p.locator('.learn-imported-product')).to_contain_text('Gespeicherte frühere Messreihe')
  passed('Fresh and changed plans export actual prepared states; teacher sees earlier results separately; duration action follows the chosen four days')
  assert not report['errors'];report['status']='passed'
 except Exception as e:
  report.update(status='failed',failure=repr(e));traceback.print_exc()
  try:p.screenshot(path=str(OUT/'failure.png'))
  except Exception:pass
  raise
 finally:
  report['sources_unchanged']=all(hashlib.sha256((ROOT/k).read_bytes()).hexdigest()==v for k,v in sources.items())
  (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('REPORT',OUT/'report.json',flush=True);b.close()
