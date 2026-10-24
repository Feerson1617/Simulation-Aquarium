"""W01: one browser only, real navigation, OS PSS/USS/RSS, bounded DOM reads.
No per-frame simulation snapshots, DOM serialization or stored Request objects.
A=public web online, B=standalone HTTP online, C=HTTP then offline, D=file.
"""
import os,sys,json,time,threading,hashlib,subprocess,shutil
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium');CASE=os.environ.get('AQUARIUM_CASE','A');ROUNDS=int(os.environ.get('AQUARIUM_ROUNDS','12'))
OUT=Path(os.environ.get('AQUARIUM_STABILITY_RESULTS','/workspace/aquarium-devtools/v1-before'))/f'{ENGINE}-{CASE}';OUT.mkdir(parents=True,exist_ok=True)
HTML=Path(os.environ.get('AQUARIUM_OFFLINE_HTML','/workspace/exports/Aquarium-R01-R03.html'))
URL=os.environ.get('AQUARIUM_PUBLIC_URL','https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/') if CASE=='A' else HTML.as_uri() if CASE=='D' else os.environ.get('AQUARIUM_OFFLINE_URL','http://127.0.0.1:8000/standalone-m1/')
def at():return datetime.now(timezone.utc).isoformat()
r={'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'engine':ENGINE,'case':CASE,'url':URL,'roundsPlanned':ROUNDS,'viewport':{'width':768,'height':1024},'graphics':'ipad','hardware':'Linux software GPU; no physical iPad','started':at(),'actions':[],'rounds':[],'resources':[],'errors':[],'httpRequests':[],'requestSchemes':{},'consoleErrors':[],'failedRequests':[],'offline':False,'method':'one browser at a time; OS smaps_rollup sampled every 2s; no per-frame snapshots or DOM serialization'}
if CASE!='A':
 with HTML.open('rb') as f:r['artifactSHA256']=hashlib.file_digest(f,'sha256').hexdigest()
stop=threading.Event();phase='before-browser';lock=threading.Lock()
def proc_fields(path):
 d={}
 try:
  for line in path.read_text().splitlines():
   key,_,val=line.partition(':');d[key]=val.strip()
 except (FileNotFoundError,ProcessLookupError,PermissionError):pass
 return d
def memory_sample(label=None):
 rows=[];statuses={}
 for folder in Path('/proc').iterdir():
  if folder.name.isdigit():
   d=proc_fields(folder/'status')
   if d:statuses[int(folder.name)]=d
 descendants={os.getpid()};changed=True
 while changed:
  found={pid for pid,d in statuses.items() if int(d.get('PPid','0')) in descendants};changed=not found.issubset(descendants);descendants.update(found)
 for pid in sorted(descendants-{os.getpid()}):
  d=statuses[pid];name=d.get('Name','');maps=proc_fields(Path(f'/proc/{pid}/smaps_rollup'));kb=lambda key,source: int(source.get(key,'0').split()[0]);role='driver' if name in ['node','nodejs','MainThread'] else 'content' if 'WebProcess' in name else 'browser'
  try:
   command=Path(f'/proc/{pid}/cmdline').read_bytes()
   if Path(os.fsdecode(command.split(b'\0',1)[0])).name in ['node','nodejs']:role='driver'
   if b'--type=renderer' in command:role='content'
   elif b'--type=gpu-process' in command:role='gpu'
  except (OSError,PermissionError):pass
  rows.append({'pid':pid,'name':name,'role':role,'rssKiB':kb('VmRSS',d),'pssKiB':kb('Pss',maps) if maps else None,'privateKiB':kb('Private_Clean',maps)+kb('Private_Dirty',maps) if maps else None,'swapKiB':kb('VmSwap',d)})
 mem=proc_fields(Path('/proc/meminfo'));row={'at':at(),'phase':label or phase,'processes':rows,'browserPssKiB':sum(x['pssKiB'] or 0 for x in rows if x['role']!='driver'),'driverPssKiB':sum(x['pssKiB'] or 0 for x in rows if x['role']=='driver'),'availableKiB':int(mem['MemAvailable'].split()[0]),'swapUsedKiB':int(mem['SwapTotal'].split()[0])-int(mem['SwapFree'].split()[0]),'diskFreeBytes':shutil.disk_usage(OUT).free}
 with lock:r['resources'].append(row)
 return row
def save():
 with lock:data=json.dumps(r,ensure_ascii=False,indent=2)
 temp=OUT/'report.tmp';temp.write_text(data+'\n');temp.replace(OUT/'report.json')
def sample_loop():
 while not stop.wait(2):
  memory_sample()
  save()
def guard():
 s=memory_sample()
 if s['availableKiB']<4*1024**2 or s['browserPssKiB']>16*1024**2 or s['diskFreeBytes']<2*1024**3:raise RuntimeError('RESOURCE_GUARD: stop before exhausting the test machine')
def action(view,selector):
 q=view.locator(selector).filter(visible=True).first;label=q.inner_text();q.tap();r['actions'].append({'at':at(),'selector':selector,'label':label,'input':'browser touchscreen'})
memory_sample();thread=threading.Thread(target=sample_loop,daemon=True);thread.start();save()
try:
 with sync_playwright() as pw:
  options={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
  browser=getattr(pw,ENGINE).launch(**options);r['version']=browser.version;ctx=browser.new_context(viewport=r['viewport'],device_scale_factor=1,has_touch=True,accept_downloads=True)
  ctx.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
  page=ctx.new_page();page.set_default_timeout(30000)
  def view():return page if CASE=='A' else next(f for f in page.frames if f.parent_frame==page.main_frame)
  def request(q):
   scheme=q.url.split(':',1)[0];r['requestSchemes'][scheme]=r['requestSchemes'].get(scheme,0)+1
   if scheme in ['http','https']:r['httpRequests'].append({'at':at(),'url':q.url,'type':q.resource_type,'offline':r['offline']})
  page.on('request',request);page.on('pageerror',lambda e:r['errors'].append(str(e)));page.on('console',lambda m:r['consoleErrors'].append(m.text[:1500]) if m.type=='error' else None);page.on('requestfailed',lambda q:r['failedRequests'].append({'url':q.url[:200],'failure':q.failure}));page.on('crash',lambda:r['errors'].append('page crash'))
  try:
   phase='initial-load';page.goto(URL,wait_until='domcontentloaded',timeout=120000);view().locator('[data-single=start]').wait_for();view().wait_for_load_state('networkidle',timeout=120000);memory_sample('loaded');page.screenshot(path=str(OUT/'initial.png'),timeout=15000)
   if CASE=='C':ctx.set_offline(True);r['offline']=True
   for i in range(1,ROUNDS+1):
    phase=f'round-{i}';guard();mission='m2-food-transformation' if i%2 else 'm6-plant-carbon';start=time.monotonic();action(view(),f'a[href="?mission={mission}"]');view().locator('[data-class-stage]').wait_for();view().wait_for_load_state('networkidle');assert view().locator('canvas').count()==1
    if i in [1,ROUNDS]:page.screenshot(path=str(OUT/f'round-{i}.png'),timeout=15000)
    action(view(),'[data-class=menu]');view().get_by_role('link',name='Zur Missionsauswahl',exact=True).tap();view().locator('[data-single=start]').wait_for();view().wait_for_load_state('networkidle');r['rounds'].append({'i':i,'mission':mission,'at':at(),'seconds':round(time.monotonic()-start,3),'url':page.url,'frames':len(page.frames),'canvas':view().locator('canvas').count()});memory_sample(f'round-{i}-home');save();print(ENGINE,CASE,'round',i,flush=True)
   phase='after-rounds-action';action(view(),'a[href="?mission=m2-food-transformation"]');view().locator('[data-class-stage]').wait_for();action(view(),'[data-class-choice=unsure]');action(view(),'[data-class=feed]');action(view(),'[data-class=menu]')
   with page.expect_download() as d:action(view(),'[data-class=export]')
   path=OUT/'after-rounds.json';d.value.save_as(str(path));data=json.loads(path.read_text());assert data['mission']=='m2-food-transformation';assert abs(data['tank']['detritus']-data['baseline']['detritus']-.12)<1e-9
   action(view(),'[data-class=close]');action(view(),'[data-class=menu]');view().get_by_role('link',name='Zur Missionsauswahl',exact=True).tap();view().locator('[data-single=start]').wait_for();action(view(),'a[href="?mission=m2-food-transformation"]');view().locator('[data-class-stage=food-observe-ready]').wait_for();action(view(),'[data-class=menu]')
   with page.expect_download() as d:action(view(),'[data-class=export]')
   path2=OUT/'restored.json';d.value.save_as(str(path2));assert json.loads(path2.read_text())==data;action(view(),'[data-class=close]');action(view(),'[data-class=help]');view().locator('.single-dialog').wait_for();page.screenshot(path=str(OUT/'after-rounds-responsive.png'),timeout=15000);action(view(),'[data-class=close]');memory_sample('after-final-action');page.wait_for_timeout(3000);memory_sample('settled')
   assert not r['errors'] and not r['consoleErrors'] and not r['failedRequests'];assert not [x for x in r['httpRequests'] if x['offline']];r.update(status='passed',finalAction={'exportSHA256':hashlib.sha256(path.read_bytes()).hexdigest(),'restoredExactly':True,'helpStillResponds':True})
  except Exception as e:
   text=str(e);r.update(status='blocked-policy' if 'ERR_BLOCKED_BY_ADMINISTRATOR' in text else 'resource-guard' if 'RESOURCE_GUARD' in text else 'failed',failure=text);memory_sample('failure');save()
   if r['status']=='failed':
    try:
     control=ctx.new_page();control.goto('about:blank',timeout=5000);r['blankControlResponded']=control.title()=='';control.close()
    except Exception as probe:r['blankControlFailure']=str(probe)
  finally:
   phase='closing';save();browser.close();phase='after-browser';time.sleep(2);memory_sample('after-browser')
finally:
 memory_sample('after-driver');stop.set();thread.join(timeout=4);r['finished']=at();save();print('STATUS',r.get('status'),OUT,flush=True)
 if r.get('status') not in ['passed','blocked-policy']:sys.exit(1)
