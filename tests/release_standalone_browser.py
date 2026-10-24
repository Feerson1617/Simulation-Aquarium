"""R03: actual offline routes, fresh view lifecycles, real M1/M3 and file downloads.
Uses unchanged learner assertions from final_missions_browser. Its reload action is
explicitly replaced with visible internal leave/return, never an offline HTTP reload.
No stored investigation state or completion flags are invented.
"""
import os,json,hashlib,subprocess
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright,expect
import final_missions_browser as mission
ROOT=Path(__file__).resolve().parents[1]
ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium')
OUT=Path(os.environ.get('AQUARIUM_OFFLINE_RESULTS','/tmp/aquarium-release-offline'))/ENGINE;OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('AQUARIUM_OFFLINE_URL','http://127.0.0.1:8000/standalone-m1/')
HTML=Path(os.environ.get('AQUARIUM_OFFLINE_HTML','/tmp/final-html-download/Aquarium.html'))
R=mission.R;mission.OUT=OUT
R.update(artifact={'path':str(HTML),'bytes':HTML.stat().st_size,'sha256':hashlib.sha256(HTML.read_bytes()).hexdigest()},url=URL,requests=[],console_errors=[],routes=[],downloads=[],offline=False,reloadImplementation='visible internal leave/return with fresh document, not HTTP reload')
origins={}
def save():mission.save()
def route_report(p,label):
 data=p.evaluate('aquariumStandaloneSnapshot()');assert data['frames']==1 and len(p.frames)==2
 for row in data['retired']:
  assert row['disposed'] and all(row[k]==0 for k in ['intervals','timeouts','animationCallbacks','registeredListeners','webglContexts']),row
 assert data['resources']['webglContexts']<=1,data
 R['routes'].append({'label':label,'at':datetime.now(timezone.utc).isoformat(),'url':p.url,'viewport':p.viewport_size,'lifecycle':data});save();print('ROUTE',label,flush=True)
class GameView:
 def __init__(self,p):self.page=p
 @property
 def frame(self):return next(f for f in self.page.frames if f.parent_frame==self.page.main_frame)
 def __getattr__(self,name):
  if name in ['mouse','touchscreen','keyboard','url','viewport_size','screenshot','set_viewport_size','expect_download','expect_file_chooser','wait_for_timeout']:return getattr(self.page,name)
  return getattr(self.frame,name)
 def ready(self,selector=None):
  self.page.locator('#aquarium-view').wait_for();self.frame.wait_for_function('typeof window.aquariumLearningSnapshot==="function"',timeout=180000)
  if selector:self.frame.locator(selector).wait_for(timeout=180000)
  self.frame.wait_for_load_state('networkidle',timeout=180000)
  self.frame.wait_for_function('window.aquariumStandaloneLifecycle.snapshot().webglContexts===1',timeout=180000)
  s=self.frame.evaluate('aquariumLearningSnapshot()')
  assert not s.get('assetErrors'),s.get('assetErrors')
 def tap(self,sel):
  x=self.locator(sel).filter(visible=True).first;label=x.inner_text();x.tap();R['actions'].append({'input':'touchscreen tap','selector':sel,'label':label,'at':datetime.now(timezone.utc).isoformat()})
 def home(self):
  if self.locator('.single-home').count():return
  prefix='single' if self.locator('[data-single-stage]').count() else 'class'
  self.tap(f'[data-{prefix}=menu]')
  if prefix=='single':self.tap('[data-single=home]')
  else:self.get_by_role('link',name='Zur Missionsauswahl').tap()
  self.ready('[data-single=start]')
 def open_route(self,query,selector):
  self.locator(f'a[href="{query}"]').tap();self.ready(selector);route_report(self.page,query)
 def reload(self):
  s=self.evaluate('aquariumLearningSnapshot()');is_m1=self.locator('[data-single-stage]').count()>0
  self.home()
  if is_m1:
   # Exercise a new document realm; the caller then presses Fortsetzen.
   self.open_route('?research=8','[data-class-stage=free]');self.home()
  else:self.open_route('?mission='+s['session']['mission'],'[data-class-stage]')
  R['actions'].append({'input':'internal leave and return','reason':'offline restore check','mission':'m1' if is_m1 else s['session']['mission']})

def run():
 with sync_playwright() as pw:
  launch={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
  b=getattr(pw,ENGINE).launch(**launch);R['version']=b.version
  ctx=b.new_context(viewport={'width':768,'height':1024},has_touch=True,is_mobile=True,device_scale_factor=1,accept_downloads=True)
  ctx.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}));localStorage.setItem('aquarium-learning-sentinel','unchanged');")
  p=ctx.new_page();p.set_default_timeout(180000);v=GameView(p)
  def request(q):
   scheme=q.url.split(':')[0];entry={'scheme':scheme,'type':q.resource_type,'url':q.url if scheme not in ['data'] else q.url[:q.url.index(',')+1],'offline':R['offline'],'at':datetime.now(timezone.utc).isoformat()};origins[q]=entry
   R['requests'].append(entry)
  def failed(q):R['requests_failed'].append({**origins.get(q,{}),'failure':q.failure})
  p.on('request',request);p.on('requestfailed',failed);p.on('pageerror',lambda e:R['errors'].append(str(e)));p.on('console',lambda m:R['console_errors'].append(m.text) if m.type=='error' else None)
  try:
   p.goto(URL,timeout=240000);v.ready('[data-single=start]');route_report(p,'fully loaded online');ctx.set_offline(True);R['offline']=True
   v.tap('[data-single=start]');v.ready('[data-single-stage]');mission.run(v,'m1');v.home();route_report(p,'M1 completed offline and home')
   for id in ['m2','m3','m4','m5','m6']:
    v.open_route('?mission='+mission.MISSIONS[id],'[data-class-stage]');assert v.locator('canvas').count()==1
    if id=='m3':mission.run(v,id)
    else:
     mission.choice(v,'unsure');mission.c(v,'help');mission.shot(v,id+'-offline-help');mission.c(v,'close')
    v.home();route_report(p,id+' returned home')
   for grade in [8,9,10]:
    v.open_route('?research='+str(grade),'[data-class-stage=free]');before=v.evaluate('aquariumLearningSnapshot().session.tank.day');v.tap('[data-class=free-day]');assert v.evaluate('aquariumLearningSnapshot().session.tank.day')==before+1
    v.tap('[data-class=menu]')
    with p.expect_download() as d:v.tap('[data-class=export]')
    f=OUT/f'offline-research-{grade}.json';d.value.save_as(str(f));raw=json.loads(f.read_text());assert raw['tank']['day']==before+1;R['downloads'].append({'file':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()});v.tap('[data-class=close]');v.home()
   v.open_route('?expert=1','[data-start=free]');v.tap('[data-start=free]');v.ready();p.screenshot(path=str(OUT/'offline-expert.png'));route_report(p,'offline expert free')
   v.locator('[data-panel=time]').filter(visible=True).first.click()
   with p.expect_download(timeout=240000) as d:v.tap('[data-act=download-html]')
   f=OUT/'Aquarium-redownload.html';d.value.save_as(str(f));assert hashlib.sha256(f.read_bytes()).hexdigest()==R['artifact']['sha256'];R['downloads'].append({'file':f.name,'sha256':R['artifact']['sha256'],'bytes':f.stat().st_size});f.unlink()
   v.page.keyboard.press('Escape');v.tap('.learn-expert-entry');v.ready('[data-single=start]')
   v.open_route('?expert=1','[data-start=tutorial]');v.tap('[data-start=tutorial]');v.ready();p.screenshot(path=str(OUT/'offline-tutorial.png'));route_report(p,'offline tutorial started');v.tap('.learn-expert-entry');v.ready('[data-single=start]')
   v.tap('[data-single=teacher]');v.open_route('?expert=1&archive-tools=1','[data-learning-import=product]')
   for grade in [8,9]:
    v.locator('[data-learning-import=product]').set_input_files(str(ROOT/f'tests/fixtures/learning-v1-grade-{grade}.json'))
    with p.expect_download() as d:v.tap('[data-learn=imported-manual-csv]')
    f=OUT/f'offline-v1-grade-{grade}.csv';d.value.save_as(str(f));assert 'Messschluessel' in f.read_text();R['downloads'].append({'file':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
   p.screenshot(path=str(OUT/'offline-historical.png'));route_report(p,'offline historical CSV downloads')
   p.go_back();v.ready('[data-single=start]');route_report(p,'browser back from archive');p.go_forward();v.ready('[data-learning-import=product]');route_report(p,'browser forward to archive');p.go_back();v.ready('[data-single=start]')
   # Repeated identical routes must recreate bounded resource inventories.
   repeated=[]
   for i in range(3):
    v.open_route('?research=9','[data-class-stage=free]');repeated.append(p.evaluate('aquariumStandaloneSnapshot().resources'));v.home();route_report(p,'repeat '+str(i+1))
   assert all(r['intervals']==repeated[0]['intervals'] and r['animationCallbacks']==repeated[0]['animationCallbacks'] and r['registeredListeners']==repeated[0]['registeredListeners'] for r in repeated),repeated
   # Storage failure must keep the current view and data available for export.
   v.open_route('?research=10','[data-class-stage=free]');saved=v.evaluate('JSON.stringify(localStorage)');route=p.url
   v.evaluate("window.releaseOriginalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('test quota','QuotaExceededError')}")
   v.tap('[data-class=menu]');v.get_by_role('link',name='Zur Missionsauswahl').tap();assert p.url==route;expect(v.locator('.single-storage')).to_be_visible();assert v.evaluate('JSON.stringify(localStorage)')==saved
   with p.expect_download() as d:v.tap('[data-class=export]')
   f=OUT/'offline-storage-emergency.json';d.value.save_as(str(f));assert json.loads(f.read_text())['tank'];v.evaluate('Storage.prototype.setItem=window.releaseOriginalSet');v.tap('[data-class=close]');v.home();route_report(p,'storage failure stayed in view; file saved; retry worked')
   assert not [q for q in R['requests'] if q['offline'] and q['scheme'] in ['http','https']],R['requests'];assert not R['errors'];assert not R['requests_failed'],R['requests_failed'];assert not R['console_errors'],R['console_errors']
   R['status']='passed'
  except Exception as e:
   R.update(status='failed',failure=str(e))
   try:p.screenshot(path=str(OUT/'failure.png'))
   except Exception:pass
   raise
  finally:save();b.close();print(R.get('status'),OUT,flush=True)
if __name__=='__main__':run()
