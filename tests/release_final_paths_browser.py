"""Release closeout: actual M5/M6, real files, and a live action after M6.

Uses existing complete-path helpers; HTTP reload and offline leave/return are
explicitly different. No state, clock, mission completion or rates are injected.
"""
import os,json,hashlib
from datetime import datetime,timezone
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
import final_missions_browser as f
R=f.R;OUT=f.OUT;ENGINE=f.ENGINE
OFFLINE=os.environ.get('AQUARIUM_BACKUP')=='1'
URL=os.environ.get('AQUARIUM_URL',f.URL)
R.update(backup=OFFLINE,consoleErrors=[],networkAfterIsolation=[],downloads=[],restorations=[],scenario='full current M5/M6 plus actual M2 continuation; real controls and file chooser')
class View:
 def __init__(self,p):self.page=p
 @property
 def frame(self):return next(x for x in self.page.frames if x.parent_frame==self.page.main_frame) if OFFLINE else self.page
 def __getattr__(self,name):
  return getattr(self.page if name in ['mouse','touchscreen','keyboard','url','viewport_size','screenshot','set_viewport_size','expect_download','expect_file_chooser','wait_for_timeout'] else self.frame,name)
 def ready(self,selector='[data-class-stage]'):
  (self.page.frame_locator('#aquarium-view') if OFFLINE else self.page).locator(selector).wait_for(timeout=180000)
  self.frame.wait_for_function('!!aquariumLearningSnapshot()?.presentation?.glass',timeout=180000,polling=500)
  self.frame.wait_for_load_state('networkidle');assert self.frame.locator('canvas').count()==1
  if OFFLINE:
   data=self.page.evaluate('aquariumStandaloneSnapshot()');assert len(self.page.frames)==2 and data['frames']==1
   assert data['resources']['webglContexts']==1
   assert all(x['disposed'] and all(x[k]==0 for k in ['intervals','timeouts','animationCallbacks','registeredListeners','webglContexts']) for x in data['retired'])
 def home(self):
  f.c(self,'menu');self.get_by_role('link',name='Zur Missionsauswahl',exact=True).click()
  (self.page.frame_locator('#aquarium-view') if OFFLINE else self.page).locator('[data-single=start]').wait_for(timeout=180000)
 def open_mission(self,id):f.act(self,f'a[href="?mission={f.MISSIONS[id]}"]');self.ready()
 def reload(self):
  if OFFLINE:
   id=f.snapshot(self)['session']['mission'];self.home();f.act(self,f'a[href="?mission={id}"]');self.ready()
  else:self.page.reload();self.ready()

def record(v,name,image=True):
 s=f.snapshot(v);meter=v.locator('.single-meter').first
 row={'name':name,'atUTC':datetime.now(timezone.utc).isoformat(),'url':v.url,'viewport':v.viewport_size,'stage':s['session']['stage'],'attempt':s['session']['attemptId'],'task':v.locator('.single-task').inner_text(),'meter':meter.inner_text() if meter.count() else None,'selection':s['session']['selection'],'markerVisible':s['presentation']['markerVisible'],'amounts':v.locator('[data-amount-reference]').evaluate_all('(es)=>es.map(e=>({uid:e.dataset.amountUid,reference:Number(e.dataset.amountReference),values:[...e.querySelectorAll("[data-amount-value]")].map(x=>({value:Number(x.dataset.amountValue),index:Number(x.dataset.amountIndex)}))}))')}
 if v.locator('.single-dialog').count():row['dialog']=v.locator('.single-dialog').inner_text()
 if image:v.screenshot(path=str(OUT/(name+'.png')));row['image']=name+'.png'
 R['captures'].append(row);f.save();print('STATE',name,flush=True)
f.shot=lambda v,name:record(v,name,image=any(x in name for x in ['wrong','comparison','observation','selected','fossil','complete','continued','immediate','restored-start']))
def export(v,name):
 s=f.snapshot(v)['session'];f.c(v,'menu')
 with v.expect_download() as d:f.act(v,'.single-dialog [data-class=export]')
 path=OUT/(name+'.json');d.value.save_as(str(path));assert json.loads(path.read_text())==s;f.c(v,'close')
 R['downloads'].append({'file':path.name,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'identicalToSession':True});return path,s
def import_file(v,path,expected):
 f.c(v,'menu')
 with v.expect_file_chooser() as fc:f.c(v,'load')
 fc.value.set_files(str(path));R['actions'].append({'input':'actual file chooser','file':path.name})
 v.wait_for_function('aquariumLearningSnapshot().dialog===null',polling=500)
 assert f.snapshot(v)['session']==expected and not f.snapshot(v)['running']
def reload_exact(v,is_m1=False):
 before=f.snapshot(v)['session'];v.reload();after=f.snapshot(v)
 assert after['session']==before and not after['running']
 R['restorations'].append({'mission':before['mission'],'attempt':before['attemptId'],'stage':before['stage'],'method':'visible offline leave/return' if OFFLINE else 'actual HTTP reload','identical':True})
f.reload_exact=reload_exact
def observe(v,label):
 start=f.snapshot(v)['session']['tank']['day'];f.c(v,'play')
 v.locator('[data-class=toggle]').press('Enter');R['actions'].append({'input':'keyboard Enter','selector':'[data-class=toggle]','purpose':'pause without waiting for touch hit-test stability during the short observation'})
 assert not f.snapshot(v)['running'];path,paused=export(v,label+'-pause')
 f.c(v,'help');v.wait_for_timeout(700);assert f.snapshot(v)['session']==paused;f.c(v,'close')
 reload_exact(v);import_file(v,path,paused)
 if paused['mission'].startswith('m6'):
  assert int(v.locator('[data-amount-uid]').get_attribute('data-amount-uid'))==paused['selection'];record(v,label+'-restored-pause')
 f.c(v,'toggle');v.wait_for_function('aquariumLearningSnapshot().session.stage!=="observing"',timeout=180000,polling=500)
 assert f.snapshot(v)['session']['stage']!='failed';f.check(v,label);record(v,label)
f.observe=observe
def roundtrip(v,name):
 assert f.snapshot(v)['session']['stage']=='complete';record(v,name+'-complete')
 path,completed=export(v,name+'-result');reload_exact(v);f.c(v,'repeat');assert f.snapshot(v)['session']['attemptId']!=completed['attemptId']
 import_file(v,path,completed);second,_=export(v,name+'-reimported');assert json.loads(second.read_text())==completed
 R['checks'].append(name+': actual completion, HTTP reload or labelled offline return, new attempt, actual chooser import, identical re-export')
 return completed
def m5(v,order):
 f.choice(v,'unsure');baseline=f.snapshot(v)['session']['baseline'];record(v,'m5-'+order[0]+'-start',image=False)
 first=None
 for index,condition in enumerate(order):
  assert f.snapshot(v)['session']['tank']==baseline
  if index:record(v,'m5-'+order[0]+'-restored-start')
  f.choice(v,condition);s=f.snapshot(v)['session'];intervention=s['pendingIntervention'];assert intervention['before']==baseline
  assert s['tank']['detritus']==baseline['detritus']
  if condition=='feed':assert s['tank']['feedRate']==1 and baseline['feedRate']==3 and s['tank']['params']==baseline['params']
  else:assert s['tank']['params']['no3']<baseline['params']['no3']
  record(v,'m5-'+order[0]+'-'+condition+'-immediate')
  observe(v,'m5-'+order[0]+'-'+condition+'-late')
  s=f.snapshot(v)['session'];assert s['runs'][-1]['intervention']['before']==baseline
  if index==0:first=s['runs'][0];f.c(v,'reset-measure')
  else:assert s['runs'][0]==first
 record(v,'m5-'+order[0]+'-comparison')
 f.wrong_help(v,'swap','actual-late','m5-'+order[0]+'-late-answer')
 f.wrong_help(v,'never','source','m5-'+order[0]+'-dissolved-vs-residue')
 result=roundtrip(v,'m5-'+order[0]);R['checks'].append('M5 '+','.join(order)+': identical full starts; dissolved nutrients change immediately after 50% exchange; bottom residues unchanged immediately; lower ongoing input, later comparison, specific wrong-answer feedback')
 return result
def m6(v):
 f.choice(v,'unsure');s=f.snapshot(v)['session'];species='anubias' if ENGINE=='webkit' else 'waterweed'
 plant=next(e for e in s['tank']['entities'] if e['species']==species);f.direct(v,plant['uid'],touch=True)
 initial=plant['biomass'];assert int(v.locator('[data-amount-uid]').get_attribute('data-amount-uid'))==plant['uid']
 assert float(v.locator('[data-amount-reference]').get_attribute('data-amount-reference'))==initial
 R['individual']={'species':species,'uid':plant['uid'],'initialBiomass':initial,'selectionMethod':'actual direct aquarium touchscreen tap','freshCurrentAttempt':s['attemptId']}
 record(v,'m6-selected');observe(v,'m6-observation')
 after=f.snapshot(v)['session'];assert after['selection']==plant['uid'];assert float(v.locator('[data-amount-reference]').get_attribute('data-amount-reference'))==initial
 assert after['runs'][0]['selection']==plant['uid'];f.no_leak(v,'m6')
 for wrong,right,name in [('opposite','observed','growth'),('ground','water-carbon','source'),('gone','respiration','return'),('proof','explanation','evidence')]:
  f.wrong_help(v,wrong,right,'m6-'+name)
  if name=='growth':
   f.c(v,'process');expect(v.locator('.single-dialog')).to_contain_text('Eine Größenänderung allein beweist nicht');record(v,'m6-source-limit',False);f.c(v,'close')
 f.c(v,'fossil');expect(v.locator('.single-dialog')).to_contain_text('Beim Verbrennen');record(v,'m6-fossil');f.c(v,'close')
 completed=roundtrip(v,'m6');assert completed['selection']==plant['uid'];assert float(v.locator('[data-amount-reference]').get_attribute('data-amount-reference'))==initial
 R['checks'].append('Fresh actual '+species+' individual, UID and marker; fixed individual baseline through pause/reload/import; real growth, four wrong answers corrected, biological explanation distinguished from atom-source proof, fossil transfer opened')
def continuation(v):
 v.home();v.open_mission('m2');f.choice(v,'unsure');f.c(v,'feed');day=f.snapshot(v)['session']['tank']['day'];f.c(v,'play')
 v.locator('[data-class=toggle]').press('Enter');R['actions'].append({'input':'keyboard Enter','selector':'[data-class=toggle]'})
 if f.snapshot(v)['session']['tank']['day']==day:
  v.locator('[data-class=toggle]').press('Enter');v.wait_for_timeout(800);v.locator('[data-class=toggle]').press('Enter')
 assert f.snapshot(v)['session']['tank']['day']>day and not f.snapshot(v)['running']
 record(v,'after-m6-continued');path,state=export(v,'after-m6-continuation');v.home();v.open_mission('m2');assert f.snapshot(v)['session']==state and not f.snapshot(v)['running']
 import_file(v,path,state);second,_=export(v,'after-m6-continuation-reimported');assert json.loads(second.read_text())==state
 f.c(v,'help');expect(v.locator('.single-dialog')).to_be_visible();record(v,'after-m6-restored-responsive');f.c(v,'close')
 R['checks'].append('After complete M6: new M2, real feed and time step, paused leave/reopen, actual export/import/re-export identical, help still responds')
with sync_playwright() as pw:
 opts={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
 b=getattr(pw,ENGINE).launch(**opts);R['version']=b.version
 ctx=b.new_context(viewport={'width':1366,'height':960},has_touch=True,accept_downloads=True,ignore_https_errors=True)
 ctx.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
 p=ctx.new_page();p.set_default_timeout(120000);v=View(p);isolated=False
 p.on('pageerror',lambda e:R['errors'].append(str(e)));p.on('console',lambda m:R['consoleErrors'].append(m.text) if m.type=='error' else None);p.on('requestfailed',lambda q:R['requests_failed'].append({'url':q.url[:200],'error':q.failure}));p.on('request',lambda q:R['networkAfterIsolation'].append(q.url) if isolated and q.url.startswith('http') else None)
 try:
  p.goto(URL,timeout=240000);(p.frame_locator('#aquarium-view') if OFFLINE else p).locator('[data-single=start]').wait_for(timeout=180000)
  if OFFLINE:
   ctx.route('http://**',lambda route:route.abort('internetdisconnected'));ctx.route('https://**',lambda route:route.abort('internetdisconnected'));isolated=True
   R['offlineMethod']='All HTTP(S) blocked after initial load; local File APIs retained. Prior strict-offline 24-round evidence accepted separately.'
  if os.environ.get('AQUARIUM_ONLY_M6')=='1':
   earlier=OUT/'m5-phase-report.json';evidence=json.loads(earlier.read_text());assert evidence['status']=='passed'
   R['earlierM5Phase']={'report':earlier.name,'sha256':hashlib.sha256(earlier.read_bytes()).hexdigest(),'method':'already completed actual M5 retained; fresh browser/context for M6, no M5 replay'}
  else:
   first=os.environ.get('AQUARIUM_M5_FIRST','water');assert first in ['water','feed']
   v.open_mission('m5');m5(v,[first,'feed' if first=='water' else 'water']);v.home()
  v.open_mission('m6');m6(v);continuation(v)
  if OFFLINE:R['finalLifecycle']=p.evaluate('aquariumStandaloneSnapshot()');assert len(p.frames)==2
  assert not R['errors'] and not R['consoleErrors'] and not R['requests_failed'] and not R['networkAfterIsolation'];R['status']='passed'
 except Exception as e:
  R.update(status='failed',failure=str(e))
  try:record(v,'failure')
  except Exception:pass
  raise
 finally:f.save();b.close();print(R.get('status'),OUT,flush=True)
