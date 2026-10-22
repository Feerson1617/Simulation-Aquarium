"""Current-head boundary checks: real zero actions, failed side, evidence times and regional tools."""
import os,json,hashlib,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
from biology_browser_helpers import action,reveal,activities
ROOT=Path(__file__).resolve().parents[1];ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium');OUT=Path(os.environ.get('AQUARIUM_FINAL_RESULTS','/tmp/aquarium-final-boundaries'))/ENGINE;OUT.mkdir(parents=True,exist_ok=True)
report={'engine':ENGINE,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'sources':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in ROOT.iterdir() if p.suffix in ['.mjs','.html','.css']},'checks':[],'errors':[],'requests':[]}
def snap(p):return p.evaluate('window.aquariumLearningSnapshot()')
def choose(p,i):p.locator(f'[data-quest-answer="{i}"]:visible').first.click()
def start(p,g,m):p.locator(f'[data-learn-grade="{g}"]').click();action(p,'missions');p.locator(f'[data-learn-mission="{m}"]').click()
def prepare(p,g,m):start(p,g,m);action(p,'observe');action(p,'close');activities(p);choose(p,0);choose(p,1)
def end(p):
 field=p.locator('[data-coherent-time]:visible').first;field.select_option(field.locator('option').last.get_attribute('value'))
def passed(name):report['checks'].append(name);print('PASS',name,flush=True)
def export(p,name):
 if not p.locator('[data-learn=export]:visible').count():action(p,'more');action(p,'notebook')
 with p.expect_download() as d:action(p,'export')
 f=OUT/name;d.value.save_as(str(f));data=json.loads(f.read_text());p.evaluate('async d=>(await import("./learning-model.mjs")).validateLearningProduct(d)',data);return data
with sync_playwright() as pw:
 launch={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
 b=getattr(pw,ENGINE).launch(**launch);c=b.new_context(viewport={'width':1366,'height':960},device_scale_factor=1,accept_downloads=True)
 c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))");p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:report['errors'].append(str(e)));p.on('requestfailed',lambda r:report['requests'].append(r.url))
 try:
  p.goto('http://127.0.0.1:8000/aquarium-simulation/');p.wait_for_function('!!window.aquariumLearningSnapshot')
  prepare(p,10,'10-restore');baseline=p.evaluate('localStorage.getItem("aquarium-learning-tank-v1:10:10-restore")')
  reveal(p.locator('[data-learning-value]')).fill('0');action(p,'compare');end(p);s=snap(p)
  assert s['quest']['step']==2 and len(s['quest']['entries'])==2
  assert not s['comparison']['runs'][0]['intervention']['effective'];assert s['comparison']['runs'][0]['control']==s['comparison']['runs'][0]['test']
  passed('zero water observed through end cannot earn an intervention; actual two trajectories remain equal')
  action(p,'workspace-plan');reveal(p.locator('[data-learning-value]')).fill('50');reveal(p.locator('[data-learning-days]')).fill('14');action(p,'compare');end(p);s=snap(p)
  assert s['quest']['step']==3 and s['view']['time']==59
  assert s['view']['stateIds']['control'] is None and s['viewSamples']['control'] is None
  assert s['quest']['result']['time']==s['quest']['result']['viewContext']['time']==48.25
  assert s['quest']['entries'][2]['evidence']['observedViewContext']['time']==59
  p.locator('[data-activity-view=early]').click();assert snap(p)['view']['time']==45.25
  p.locator('[data-activity-view=late]').click();assert snap(p)['view']['time']==59
  expect(p.locator('[data-view-side=control]')).to_contain_text('Keine weitere Szene')
  assert p.evaluate('localStorage.getItem("aquarium-learning-tank-v1:10:10-restore")')==baseline
  p.screenshot(path=str(OUT/'restore-missing-control.png'));data=export(p,'restore-context.json')
  assert data['viewContext']['time']==59 and data['quest']['result']['viewContext']['time']==48.25
  passed('failed side: early/late real scenes and metrics; paired result retains its own actual time, current single-side view stays read only')
  action(p,'home');prepare(p,8,'8-oxygen');reveal(p.locator('[data-learning-value]')).fill('8');action(p,'compare');end(p);s=snap(p)
  assert s['quest']['step']==2 and not s['comparison']['runs'][0]['intervention']['effective'];assert s['comparison']['runs'][0]['control']==s['comparison']['runs'][0]['test']
  passed('unchanged lamp observed through end cannot earn an intervention')
  action(p,'home');prepare(p,10,'10-northsea');action(p,'compare');end(p)
  correct=snap(p)['questionResult'];choose(p,2 if abs(correct['control']-correct['test'])<=.005 else 0 if correct['control']>correct['test'] else 1)
  activities(p);choose(p,0);assert snap(p)['quest']['step']==5
  expect(p.locator('#scene')).not_to_be_visible();assert not p.locator('[data-coherent-time]:visible').count()
  action(p,'more');action(p,'display');expect(p.get_by_role('heading',name='Darstellung',exact=True)).to_be_visible();p.keyboard.press('Escape')
  action(p,'more');action(p,'glossary');expect(p.locator('#learning-root')).to_contain_text('Wörterhilfe');p.keyboard.press('Escape')
  action(p,'quest-restart');expect(p.locator('#learning-root')).to_contain_text('Mit gleichen Bedingungen wiederholen');action(p,'close')
  data=export(p,'northsea-context.json');assert data['visibleDomain']=='regional-northsea' and data['processEvidence']['10-northsea']['links']
  passed('regional transition has no aquarium clock; display, glossary, restart, source links and qualitative evidence remain reachable')
  # Actual loader tags new and undocumented old chemistry without rescaling any concentration.
  tank=json.loads(p.evaluate('localStorage.getItem("aquarium-learning-tank-v1:10:10-northsea")'));old=dict(tank);old.pop('chemistry',None)
  out=p.evaluate('s=>window.aquariumSimulationProbe(s,0)',old);assert out['chemistry']['version']==0;assert out['params']==old['params']
  out=p.evaluate('s=>window.aquariumSimulationProbe(s,0)',tank);assert out['chemistry']['version']==1;assert out['params']==tank['params']
  report['pool_probe']={'old':out['params']['nh4'],'new_contract':out['chemistry']};passed('actual core loader preserves old concentrations with unknown basis and new declared TAN basis')
  assert not report['errors'];assert not report['requests'];report['status']='passed'
 except Exception as e:
  report.update(status='failed',failure=str(e))
  try:p.screenshot(path=str(OUT/'failure.png'))
  except Exception:pass
  raise
 finally:
  (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));b.close();print('RESULTS',OUT,flush=True)
