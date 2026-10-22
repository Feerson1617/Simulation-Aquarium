"""Check the generated single HTML over HTTP, not a native file: offline claim.

Generate it with createStandaloneDocument before running. No module imports from
the repository are allowed in this browser test: all game resources must be inline.
"""
import json,os,subprocess,time,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
from biology_browser_helpers import action,activities,reveal
ROOT=Path(__file__).resolve().parents[1];ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium')
URL=os.environ.get('AQUARIUM_STANDALONE_URL','http://127.0.0.1:8000/standalone-coherent/')
OUT=Path(os.environ.get('AQUARIUM_STANDALONE_RESULTS','/tmp/coherent-standalone'))/ENGINE;OUT.mkdir(parents=True,exist_ok=True)
report={'engine':ENGINE,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'url':URL,'native_file_test':'not executed; HTTP does not prove native file: behaviour','errors':[],'http_requests':[]}
def snap(p):return p.evaluate('window.aquariumLearningSnapshot()')
def choose(p,n):p.locator(f'[data-quest-answer="{n}"]:visible').first.click()
with sync_playwright() as pw:
 launch={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {}
 if ENGINE=='webkit' and os.environ.get('AQUARIUM_WEBKIT'):launch['executable_path']=os.environ['AQUARIUM_WEBKIT']
 b=getattr(pw,ENGINE).launch(**launch)
 c=b.new_context(viewport={'width':1366,'height':1024},accept_downloads=True)
 c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
 p=c.new_page();p.set_default_timeout(120000);p.on('pageerror',lambda e:report['errors'].append(str(e)))
 p.on('request',lambda r:report['http_requests'].append(r.url) if r.url.startswith(('http:','https:')) else None)
 try:
  begin=time.monotonic();p.goto(URL,wait_until='domcontentloaded');p.wait_for_function('!!window.aquariumLearningSnapshot')
  p.locator('[data-learn-grade="8"]').click();action(p,'missions');p.locator('[data-learn-mission="8-ecosystem"]').click()
  p.wait_for_function('window.aquariumLearningSnapshot().prototype.render.sides.length===2&&window.aquariumLearningSnapshot().prototype.render.sides.every(s=>s.detailModels===19)')
  report['ready_seconds']=round(time.monotonic()-begin,2)
  # Already-loaded single document continues without a network. This does not
  # stand in for opening a file: on Safari/iPadOS or offline reloading an HTTP URL.
  c.set_offline(True)
  activities(p);choose(p,0);choose(p,1);action(p,'device-temperature');reveal(p.locator('[data-equipment-value]')).fill('27');p.locator('[data-equipment-save]').click()
  action(p,'compare');p.locator('[data-coherent-time]:visible').first.select_option('48');assert snap(p)['quest']['step']==3
  choose(p,1);choose(p,0);assert snap(p)['quest']['step']==5
  action(p,'more');action(p,'notebook')
  with p.expect_download() as d:action(p,'export')
  d.value.save_as(str(OUT/'single-html-result.json'));product=json.loads((OUT/'single-html-result.json').read_text())
  assert product['viewContext']==snap(p)['view'] and product['quest']['step']==5
  before=snap(p);begin=time.monotonic();p.wait_for_timeout(5000);after=snap(p)
  report['render']=after['prototype']['render'];report['observed_frames_per_second']=(after['prototype']['render']['frames']-before['prototype']['render']['frames'])/(time.monotonic()-begin)
  report['canvas']=p.evaluate('[...document.querySelectorAll("canvas")].map(c=>({width:c.width,height:c.height,cssWidth:c.clientWidth,cssHeight:c.clientHeight}))')
  assert before['viewSamples']==after['viewSamples'];report['biological_values_unchanged_during_animation']=True
  p.screenshot(path=str(OUT/'single-html-temperature.png'))
  report['checks']=['temperature: real paired scenes, actual endpoint and exported context']
  action(p,'home');p.locator('[data-learn-grade="9"]').click();action(p,'missions');p.locator('[data-learn-mission="9-mendel"]').click()
  action(p,'observe');action(p,'close');choose(p,0);choose(p,1);action(p,'genes')
  p.locator('[data-learning-mother]').select_option('1');p.locator('[data-learning-father]').select_option('6');action(p,'cross')
  first=snap(p)['population'];assert first['generation']==1 and all(i['loci']['A']==['A','a'] for i in first['individuals'])
  mother=next(i['uid'] for i in first['individuals'] if i['sex']=='♀');father=next(i['uid'] for i in first['individuals'] if i['sex']=='♂')
  p.locator('[data-learning-mother]').select_option(str(mother));p.locator('[data-learning-father]').select_option(str(father));action(p,'cross')
  assert snap(p)['quest']['step']==3 and snap(p)['population']['generation']==2
  r=snap(p)['quest']['result'];choose(p,0 if r['dark']==1 else 1 if r['light']==1 else 2)
  p.locator('[data-activity-id=mendel-probability][data-activity-choice="0"]').click();choose(p,0);assert snap(p)['quest']['step']==5
  p.screenshot(path=str(OUT/'single-html-mendel.png'));report['checks'].append('Mendel: true F1/F2, actual parents and full quest while offline')
  for key in ['returns','gear']:
   action(p,'home');p.locator('[data-learn-grade="10"]').click();action(p,'missions');p.locator('[data-learn-mission="10-wadden"]').click()
   if snap(p)['quest']['step']:action(p,'quest-restart');action(p,'new-attempt')
   for node in (['visitors','packaging','animals'] if key=='returns' else ['fishing','nets','animals']):p.locator(f'[data-harbour-object="{node}"]').click()
   choose(p,0);choose(p,1)
   for id,index in [('harbour-interest',0 if key=='returns' else 1),('harbour-benefit',0),('harbour-effort',0)]:p.locator(f'[data-activity-id="{id}"][data-activity-choice="{index}"]').click()
   choose(p,0);p.locator('[data-activity-id=harbour-followup][data-activity-choice="0"]').click();choose(p,0)
   assert snap(p)['quest']['step']==5 and snap(p)['quest']['result']['measureKey']==key
   report['checks'].append('harbour '+key+': full chosen-specific path while offline')
  extra=[u for u in report['http_requests'] if u!=URL and not u.endswith('/favicon.ico')];assert not extra,extra
  assert not report['errors'];p.screenshot(path=str(OUT/'single-html-result.png'));report['status']='passed'
  print('PASS',ENGINE,'single HTTP HTML: two actual scenes, full mission, export, no child HTTP resources, loaded document continues offline',flush=True)
 except Exception as e:
  report.update(status='failed',failure=repr(e));traceback.print_exc()
  try:p.screenshot(path=str(OUT/'failure.png'))
  except Exception:pass
  raise
 finally:(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('REPORT',OUT/'report.json',flush=True);b.close()
