"""Release freeze regression: actual routes, saves/imports, old lifecycle and backup.
Existing full mission acceptance remains the reference. This checks changed packaging
and navigation without injecting states or repeating every completed learning path.
"""
import os,json,hashlib,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium');OFFLINE=os.environ.get('AQUARIUM_BACKUP')=='1'
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
HTML=Path(os.environ.get('AQUARIUM_OFFLINE_HTML','/workspace/aquarium-devtools/www/standalone-v1/index.html'))
OUT=Path(os.environ.get('AQUARIUM_REGRESSION_RESULTS','/workspace/aquarium-devtools/v1-regression'))/f'{ENGINE}-{"backup" if OFFLINE else "online"}'
OUT.mkdir(parents=True,exist_ok=True)
r={'engine':ENGINE,'url':URL,'backup':OFFLINE,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'checks':[],'actions':[],'errors':[],'requestsFailed':[],'networkAfterIsolation':[],'lifecycle':[]}
MISSIONS=['m1-light-oxygen','m2-food-transformation','m3-hidden-inheritance','m4-dominance-frequency','m5-recurring-input','m6-plant-carbon']
with sync_playwright() as pw:
 opts={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
 b=getattr(pw,ENGINE).launch(**opts);r['version']=b.version;c=b.new_context(viewport={'width':1366,'height':960},has_touch=True,accept_downloads=True,ignore_https_errors=True)
 c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
 p=c.new_page();p.set_default_timeout(120000);isolated=False
 p.on('pageerror',lambda e:r['errors'].append(str(e)));p.on('console',lambda m:r['errors'].append(m.text) if m.type=='error' else None)
 p.on('requestfailed',lambda q:r['requestsFailed'].append({'url':q.url[:200],'error':q.failure}))
 p.on('request',lambda q:r['networkAfterIsolation'].append(q.url) if isolated and q.url.startswith('http') else None)
 def view():return next(f for f in p.frames if f.parent_frame==p.main_frame) if OFFLINE else p
 def ready(sel):
  scope=p.frame_locator('#aquarium-view') if OFFLINE else p
  scope.locator(sel).wait_for();scope.locator('canvas').wait_for();view().wait_for_load_state('networkidle')
  assert view().locator('canvas').count()==1
  assert not view().locator('.single-asset-error').count()
  if OFFLINE:
   s=p.evaluate('aquariumStandaloneSnapshot()');assert s['frames']==1 and s['resources']['webglContexts']==1
   assert all(row['disposed'] and all(row[k]==0 for k in ['intervals','timeouts','animationCallbacks','registeredListeners','webglContexts']) for row in s['retired'])
   r['lifecycle'].append(s)
 def tap(sel):
  q=view().locator(sel).filter(visible=True).first;r['actions'].append({'selector':sel,'label':q.inner_text(),'input':'touchscreen tap'});q.tap()
 def home(prefix):
  tap(f'[data-{prefix}=menu]')
  if prefix=='single':tap('[data-single=home]')
  else:view().get_by_role('link',name='Zur Missionsauswahl',exact=True).tap()
  ready('[data-single=start]')
 def open_mission(id):
  if id.startswith('m1'):tap('[data-single=start]');ready('[data-single-stage]')
  else:tap(f'a[href="?mission={id}"]');ready('[data-class-stage]')
 def export(prefix,name):
  tap(f'[data-{prefix}=menu]')
  with p.expect_download() as d:tap(f'[data-{prefix}=export]')
  path=OUT/(name+'.json');d.value.save_as(str(path));tap(f'[data-{prefix}=close]');return path,json.loads(path.read_text())
 try:
  p.goto(URL,timeout=180000);ready('[data-single=start]')
  if OFFLINE:
   # HTTP requests are blocked, but local File APIs remain available. WebKit's
   # context.set_offline also rejects File.text on this runner (separate W01 C).
   c.route('http://**',lambda route:route.abort('internetdisconnected'));c.route('https://**',lambda route:route.abort('internetdisconnected'));isolated=True
  for index,id in enumerate(MISSIONS):
   prefix='single' if index==0 else 'class';open_mission(id)
   if index==0:
    pt=view().evaluate("()=>{const s=aquariumLearningSnapshot(),e=s.session.tank.entities.find(e=>e.species==='waterweed');return s.presentation.objects.find(o=>o.uid===e.uid).bounds}")
    p.touchscreen.tap(pt['x'],pt['y']);tap('[data-single=prediction][data-choice="2"]')
   elif index==2:tap('[data-class=select]')
   else:
    tap('[data-class-choice=unsure]')
    if index==1:tap('[data-class=feed]')
    if index==5:tap('[data-class=plant]')
   tap(f'[data-{prefix}=help]');view().locator('.single-dialog').wait_for();tap(f'[data-{prefix}=close]')
   p.screenshot(path=str(OUT/f'{id}.png'))
   path,data=export(prefix,id);home(prefix);open_mission(id);_,restored=export(prefix,id+'-restored');assert restored==data
   tap(f'[data-{prefix}=menu]')
   with p.expect_file_chooser() as fc:tap(f'[data-{prefix}=load]')
   fc.value.set_files(str(path));r['actions'].append({'input':'actual file chooser','file':path.name});view().locator('.single-dialog').wait_for(state='hidden')
   _,loaded=export(prefix,id+'-imported');assert loaded==data
   r['checks'].append(id+': scene, actual choice, hint, export, exact local restoration and actual JSON import');home(prefix)
  tap('a[href="?research=8"]');ready('[data-class-stage=free]');before=view().evaluate('aquariumLearningSnapshot().session.tank.day');tap('[data-class=free-day]');_,data=export('class','research');assert data['tank']['day']==before+1;home('class');r['checks'].append('free research: actual one-day advance and saved result')
  for mode in ['free','tutorial','scenario']:
   tap('a[href="?expert=1"]');ready('[data-start=free]')
   if mode=='scenario':tap('[data-scenarios]');tap('[data-scenario-start=foodweb]')
   else:tap(f'[data-start={mode}]')
   ready('.learn-expert-entry')
   if mode=='free':
    tap('[data-act=choose-tank]');tap('[data-buy=tank-120]');tap('[data-act=place-tank]')
    view().wait_for_function('JSON.parse(localStorage.getItem("aquarium-werkstatt-v1")).tankPlaced===true')
    assert view().evaluate('JSON.parse(localStorage.getItem("aquarium-werkstatt-v1")).liters')==120
    r['checks'].append('free game: actual choice, purchase and placement of the 120 litre tank')
   p.screenshot(path=str(OUT/f'expert-{mode}.png'));r['checks'].append('expert '+mode+': real start, one visible canvas, no missing assets')
   if mode=='free':
    tap('[data-panel=time]')
    with p.expect_download(timeout=240000) as d:tap('[data-act=download-html]')
    path=OUT/'Aquarium.html';d.value.save_as(str(path))
    with path.open('rb') as f:actual=hashlib.file_digest(f,'sha256').hexdigest()
    with HTML.open('rb') as f:expected=hashlib.file_digest(f,'sha256').hexdigest()
    assert actual==expected,(actual,expected)
    r['backupDownload']={'bytes':path.stat().st_size,'sha256':actual,'actualUI':True}
    if OFFLINE:path.unlink()
    p.keyboard.press('Escape')
   tap('.learn-expert-entry');ready('[data-single=start]')
  assert not r['errors'] and not r['requestsFailed'] and not r['networkAfterIsolation'];r['status']='passed'
 except Exception as e:
  r.update(status='failed',failure=repr(e));raise
 finally:
  (OUT/'report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');b.close();print(r.get('status'),flush=True)
