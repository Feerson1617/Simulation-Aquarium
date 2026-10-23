"""Approved six-question architecture: actual new learner routes, never writes progress.
Every completed mission includes a plausible error, help, correction, reload, repeat,
export and import. RNG/UI snapshots only read actual source data to check evidence.
"""
import os,json,hashlib,subprocess,re
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1]
ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium')
BASE=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
OUT=Path(os.environ.get('AQUARIUM_CLASSROOM_RESULTS','/tmp/aquarium-classroom'))/ENGINE;OUT.mkdir(parents=True,exist_ok=True)
PROFILES=os.environ.get('AQUARIUM_CLASSROOM_PROFILES','desktop,portrait,landscape').split(',')
IDS=os.environ.get('AQUARIUM_CLASSROOM_IDS','m2-food-transformation,m3-hidden-inheritance,m4-dominance-frequency,m5-recurring-input,m6-plant-carbon').split(',')
r={'engine':ENGINE,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'sources':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in ROOT.iterdir() if p.suffix in ['.mjs','.css','.html']},'checks':[],'errors':[],'failed_requests':[],'inventories':[],'results':[],'hardware':'Linux software graphics; no physical iPad'}
def snap(p):return p.evaluate('window.aquariumLearningSnapshot()')
def click(p,key,touch=False):
 x=p.locator(f'[data-class="{key}"]:visible').first;x.tap() if touch else x.click()
def choice(p,key,touch=False):
 x=p.locator(f'[data-class-choice="{key}"]:visible').first;x.tap() if touch else x.click()
def identity(p):
 s=snap(p);assert s['renderer']['sameState'];assert s['context']['stateId']==s['renderer']['mainStateId'];assert p.locator('canvas').count()==1
 assert not p.locator('[data-tank-viewport]').count();assert set(s['renderer']['objects'])=={e['uid'] for e in s['session']['tank']['entities']}
 return s
def geometry(p,label):
 data=p.evaluate('''()=>{const visible=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&e.getClientRects().length};const controls=[...document.querySelectorAll('#learning-root button,#learning-root a,#learning-root input,#learning-root select,#learning-root textarea')].filter(visible).map(e=>({label:(e.innerText||e.getAttribute('aria-label')||e.type).trim(),width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,tag:e.tagName}));const rects=[...document.querySelectorAll('[data-persistent-hud],#equipment-controls button')].filter(visible).map(e=>{const r=e.getBoundingClientRect();return {left:Math.max(0,r.left),right:Math.min(innerWidth,r.right),top:Math.max(0,r.top),bottom:Math.min(innerHeight,r.bottom)}});const xs=[...new Set(rects.flatMap(r=>[r.left,r.right]))].sort((a,b)=>a-b);let area=0;for(let i=1;i<xs.length;i++){let end=-Infinity,height=0;const ys=rects.filter(r=>r.left<xs[i]&&r.right>xs[i-1]).map(r=>[r.top,r.bottom]).sort((a,b)=>a[0]-b[0]);for(const [a,b]of ys){height+=Math.max(0,b-Math.max(a,end));end=Math.max(end,b)}area+=(xs[i]-xs[i-1])*height}return {width:innerWidth,height:innerHeight,freeAquariumFraction:1-area/(innerWidth*innerHeight),controls,rects,overflow:document.documentElement.scrollWidth>innerWidth};}''')
 r['inventories'].append({'step':label,**data});assert data['freeAquariumFraction']>=.7,(label,data);assert not data['overflow']
 assert all(c['width']>=43.5 and c['height']>=43.5 for c in data['controls'] if c['tag']=='BUTTON')
 assert not p.locator('#learning-root input:visible,#learning-root select:visible,#learning-root textarea:visible').count()
 assert not re.search(r'mg\s*/\s*[lL]|[ONC][₂₃₄]|milligramm',p.locator('#learning-root').inner_text(),re.I)
def setup(b,id,profile):
 size={'desktop':(1366,960),'portrait':(768,1024),'landscape':(1366,1024)}[profile];touch=profile!='desktop'
 c=b.new_context(viewport={'width':size[0],'height':size[1]},device_scale_factor=1,has_touch=touch,is_mobile=touch,accept_downloads=True)
 c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}));localStorage.setItem('aquarium-learning-old-sentinel','preserve-me');")
 p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:r['errors'].append(e.stack));p.on('requestfailed',lambda q:r['failed_requests'].append(q.url))
 p.goto(BASE+'?mission='+id);p.wait_for_function('window.aquariumLearningSnapshot()?.session?.stage');p.wait_for_function('window.aquariumLearningSnapshot().renderer?.stats.objects>0');identity(p)
 return c,p,touch
def reload_exact(p):
 before=snap(p)['session'];p.reload();p.wait_for_selector('[data-class-stage]');assert snap(p)['session']==before,(snap(p).get('storageError'),snap(p)['session']);assert not snap(p)['running'];identity(p)
def help_error(p,wrong,right,touch,label):
 choice(p,wrong,touch);expect(p.locator('.single-feedback')).to_have_attribute('data-kind','error');geometry(p,label+'-wrong')
 click(p,'help',touch);held=snap(p)['session']['tank'];p.wait_for_timeout(700);assert snap(p)['session']['tank']==held and not snap(p)['running']
 click(p,'more-help',touch);p.keyboard.press('Escape');assert p.evaluate('document.activeElement.dataset.class')=='help';choice(p,right,touch)
def observe(p,touch,label):
 click(p,'play',touch);p.locator('[data-class=toggle]').press('Enter');assert not snap(p)['running'];assert snap(p)['session']['stage']=='observing'
 geometry(p,label+'-paused');click(p,'help',touch);held=snap(p)['session'];p.wait_for_timeout(700);assert snap(p)['session']==held;p.keyboard.press('Escape');reload_exact(p)
 click(p,'toggle',touch);p.wait_for_function('document.querySelector("[data-class-stage]")?.dataset.classStage!=="observing"',timeout=120000,polling=200)
 assert snap(p)['session']['stage']!='failed';identity(p);geometry(p,label+'-finished')
def actual_genetics(p):
 s=identity(p);fish=[e for e in s['session']['tank']['entities'] if e['species']=='molly'];assert fish
 p.wait_for_function('''()=>{const s=window.aquariumLearningSnapshot();return s.session.tank.entities.filter(e=>e.species==='molly').every(e=>s.renderer.appearances.some(a=>a.uid===e.uid&&a.variant===e.variant))}''',polling=500)
 s=snap(p);assert all(e['genotype']==''.join(e['genetics']['loci']['A']) for e in fish);assert not s['session']['tank']['genetics']['enabled']
 return s
def pick_parents(p,touch):
 s=snap(p)['session'];fish=[e for e in s['tank']['entities'] if e['species']=='molly'];female=next(e for e in fish if e['sex']=='♀' and (s['stage']!='founders' or e['genotype']=='AA'));male=next(e for e in fish if e['sex']=='♂' and (s['stage']!='founders' or e['genotype']=='aa'))
 for e in [female,male]:
  x=p.locator(f'[data-class=select][data-class-uid="{e["uid"]}"]');x.tap() if touch else x.click()
 assert snap(p)['session']['parents']==[female['uid'],male['uid']]
def finish(p,touch,id,label):
 geometry(p,label+'-start');p.screenshot(path=str(OUT/(label+'-start.png')))
 if not id.startswith('m3'):choice(p,'unsure',touch);assert snap(p)['session']['prediction']['origin']=='selection'
 if id.startswith('m2'):
  initial=snap(p)['session']['tank']['detritus'];click(p,'feed',touch);assert snap(p)['session']['tank']['detritus']==initial+.12
  observe(p,touch,label);assert snap(p)['session']['runs'][0]['fluxTotals']['decomposition']>0
  help_error(p,'opposite','observed',touch,label);click(p,'filter',touch);assert not p.locator('.single-dialog').count();click(p,'process',touch);expect(p.locator('.single-dialog')).to_contain_text('stark vergrößert');p.keyboard.press('Escape')
  geometry(p,label+'-process');choice(p,'decomposer',touch);choice(p,'nutrients',touch);choice(p,'separate',touch)
 elif id.startswith('m3'):
  actual_genetics(p);pick_parents(p,touch);geometry(p,label+'-parents');click(p,'generation',touch);s=actual_genetics(p);assert all(e['genotype']=='Aa' for e in s['session']['tank']['entities'] if e['species']=='molly')
  help_error(p,'lost','dark',touch,label);reload_exact(p);pick_parents(p,touch);geometry(p,label+'-f1-parents');click(p,'generation',touch);s=actual_genetics(p);assert s['session']['generation']==2
  p.screenshot(path=str(OUT/(label+'-f2.png')));fish=[e for e in s['session']['tank']['entities'] if e['species']=='molly'];child=next((e for e in fish if e['variant']=='gold'),fish[0]);p.locator(f'[data-class=select][data-class-uid="{child["uid"]}"]').click();geometry(p,label+'-actual-alleles');choice(p,'actual-alleles',touch);choice(p,'possible',touch)
 elif id.startswith('m4'):
  baseline=snap(p)['session']['baseline']
  previous_context=None
  for trial in range(3):
   current_context=snap(p)['context'];assert current_context['runId'];assert current_context['runId']!=previous_context;previous_context=current_context['runId']
   for g in range(3):click(p,'generation',touch);actual_genetics(p)
   geometry(p,label+'-trial-'+str(trial));old=json.dumps(snap(p)['session']['trials'],sort_keys=True)
   if trial<2:click(p,'reset-trial',touch);assert snap(p)['session']['tank']==baseline;assert snap(p)['context']['runId']!=previous_context;assert json.dumps(snap(p)['session']['trials'],sort_keys=True)==old
  reload_exact(p);click(p,'compare-trials',touch);help_error(p,'guarantee','actual-counts',touch,label)
  click(p,'parents',touch);expect(p.locator('.single-dialog')).to_contain_text('doppelte Gewicht');p.keyboard.press('Escape');choice(p,'weighted-parents',touch);choice(p,'not-guaranteed',touch)
 elif id.startswith('m5'):
  baseline=snap(p)['session']['baseline'];choice(p,'water',touch);observe(p,touch,label+'-water');old=json.dumps(snap(p)['session']['runs'][0],sort_keys=True)
  click(p,'reset-measure',touch);assert snap(p)['session']['tank']==baseline;geometry(p,label+'-restored');choice(p,'feed',touch);observe(p,touch,label+'-feed');assert json.dumps(snap(p)['session']['runs'][0],sort_keys=True)==old
  assert all(len(x['samples'])==41 for x in snap(p)['session']['runs']);p.screenshot(path=str(OUT/(label+'-compare.png')));help_error(p,'swap','actual-late',touch,label);choice(p,'source',touch)
 elif id.startswith('m6'):
  click(p,'plant',touch);uid=snap(p)['session']['selection'];observe(p,touch,label);assert snap(p)['session']['selection']==uid
  help_error(p,'opposite','observed',touch,label);click(p,'process',touch);expect(p.locator('.single-dialog')).to_contain_text('Kohlenstoffdioxid');p.keyboard.press('Escape');choice(p,'water-carbon',touch);choice(p,'respiration',touch);choice(p,'explanation',touch)
 assert snap(p)['session']['stage']=='complete';geometry(p,label+'-complete');p.screenshot(path=str(OUT/(label+'-complete.png')))
 with p.expect_download() as d:click(p,'export',touch)
 path=OUT/(label+'-result.json');d.value.save_as(str(path));product=json.loads(path.read_text());assert product['currentContext']==snap(p)['context'];assert product['provenance']['ownText']=='absent'
 r['results'].append({'id':id,'profile':label,'counts':product.get('trials',[])[-1]['counts'] if product.get('trials') else None,'endpoints':[{k:run['samples'][-1][k] for k in ['oxygen','organic','plantBiomass']} for run in product.get('runs',[])]})
 reload_exact(p);attempt=snap(p)['session']['attemptId'];click(p,'repeat',touch);assert snap(p)['session']['attemptId']!=attempt;click(p,'menu',touch);p.locator('[data-class-file]').set_input_files(str(path));p.wait_for_function('document.querySelector("[data-class-stage]")?.dataset.classStage==="complete"',polling=200);assert snap(p)['session']['attemptId']==attempt
 assert p.evaluate('localStorage.getItem("aquarium-learning-old-sentinel")')=='preserve-me';r['checks'].append(label+': full actual mission, error/help/correction, reload/repeat/export/import');print('PASS',label,flush=True)
with sync_playwright() as pw:
 launch={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
 b=getattr(pw,ENGINE).launch(**launch)
 try:
  for profile in PROFILES:
   for id in IDS:
    c,p,touch=setup(b,id,profile);finish(p,touch,id,profile+'-'+id[:2]);c.close()
  assert not r['errors'],r['errors'];assert not r['failed_requests'],r['failed_requests'];r['status']='passed'
 except Exception as e:
  r.update(status='failed',failure=str(e))
  try:p.screenshot(path=str(OUT/'failure.png'));r['lastSnapshot']=snap(p);r['body']=p.locator('#learning-root').inner_text()
  except Exception:pass
  raise
 finally:(OUT/'report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');b.close();print('REPORT',OUT/'report.json',flush=True)
