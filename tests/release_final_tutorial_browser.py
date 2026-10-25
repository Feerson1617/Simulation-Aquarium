"""All eight tutorial stages through actual touch controls; no tutorial flags injected."""
import os,json,subprocess
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1];ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium')
OUT=Path(os.environ.get('AQUARIUM_TUTORIAL_RESULTS','/tmp/aquarium-final-tutorial'))/ENGINE;OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
r={'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'engine':ENGINE,'actions':[],'stages':[],'errors':[],'consoleErrors':[],'failedRequests':[]}
with sync_playwright() as pw:
 opts={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
 b=getattr(pw,ENGINE).launch(**opts);r['version']=b.version;c=b.new_context(viewport={'width':1366,'height':960},has_touch=True,accept_downloads=True,ignore_https_errors=True)
 c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
 p=c.new_page();p.set_default_timeout(90000)
 p.on('pageerror',lambda e:r['errors'].append(str(e)));p.on('console',lambda m:r['consoleErrors'].append(m.text) if m.type=='error' else None);p.on('requestfailed',lambda q:r['failedRequests'].append(q.url))
 def tap(sel):
  q=p.locator(sel).filter(visible=True).first;r['actions'].append({'atUTC':datetime.now(timezone.utc).isoformat(),'selector':sel,'label':q.inner_text(),'input':'touchscreen tap'});q.tap()
 def stored():return p.evaluate('JSON.parse(localStorage.getItem("aquarium-werkstatt-v1"))')
 def close():
  if p.locator('[data-act=close-panel]:visible').count():tap('[data-act=close-panel]')
 def step(n):
  s=stored();assert s['tutorialStep']==n,(n,s['tutorialStep']);r['stages'].append({'step':n,'day':s['day'],'entities':len(s['entities'])});print('TUTORIAL',n,flush=True)
 try:
  p.goto(URL+'?expert=1');tap('[data-start=tutorial]');step(0)
  tap('[data-act=tutorial-action]');tap('[data-buy=tank-120]');tap('[data-act=place-tank]');step(1)
  for n,product,field,value in [(2,'substrate-sand','substrate','sand'),(3,'filter-internal120','filter','internal120'),(4,'light-basic','light','basic')]:
   tap('[data-act=tutorial-action]');tap(f'[data-buy={product}]');assert stored()[field]==value;close();tap('[data-act=tutorial-next]');step(n)
  tap('[data-act=tutorial-action]');tap('[data-species]');tap('[data-act=add-species]');assert p.evaluate('aquariumSnapshot().plants')==1;close();tap('[data-act=tutorial-next]');step(5)
  tap('[data-act=tutorial-action]');tap('[data-act=quick-test]');assert 'no2' in stored()['measurements'];close();tap('[data-act=tutorial-next]');step(6)
  tap('[data-act=tutorial-action]');tap('[data-advance="7"]');assert stored()['day']>=7 and not stored()['failed'];close();tap('[data-act=tutorial-next]');step(7)
  tap('[data-act=tutorial-action]');tap('[data-species]');assert stored()['tutorialReadSpecies'];tap('[data-act=close-modal]');close();tap('[data-act=tutorial-next]');step(8)
  assert stored()['tutorialCompleted'] and stored()['mode']=='free';expect(p.locator('#modal-root')).to_contain_text('Tutorial abgeschlossen')
  p.screenshot(path=str(OUT/'eight-stages-complete.png'));tap('[data-act=close-modal]');before=stored();tap('[data-panel=time]')
  with p.expect_download() as d:tap('[data-act=export]')
  path=OUT/'tutorial-complete.json';d.value.save_as(str(path));assert json.loads(path.read_text())==before
  p.reload();tap('[data-start=resume]');after=stored()
  for key in ['tutorialCompleted','tutorialStep','tutorialReadSpecies','mode','tankPlaced','liters','day','params','entities','measurements']:assert after[key]==before[key],key
  with p.expect_file_chooser() as fc:
   tap('[data-panel=time]');tap('[data-act=import]')
  fc.value.set_files(str(path));p.wait_for_function('JSON.parse(localStorage.getItem("aquarium-werkstatt-v1")).tutorialCompleted===true')
  for key in ['params','entities','day','tutorialStep','tutorialCompleted']:assert stored()[key]==before[key]
  r['checks']=['All eight stages completed with real purchases, placement, plant insertion, water test, seven-day advance and species reading','Actual JSON download, HTTP reload/resume and actual chooser import preserve tutorial and aquarium']
  assert not r['errors'] and not r['consoleErrors'] and not r['failedRequests'];r['status']='passed'
 except Exception as e:
  r.update(status='failed',failure=str(e))
  try:p.screenshot(path=str(OUT/'failure.png'));r['body']=p.locator('body').inner_text()
  except Exception:pass
  raise
 finally:(OUT/'report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');b.close();print(r.get('status'),OUT,flush=True)
