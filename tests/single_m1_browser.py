"""New M1: genuine single-aquarium UI actions, not old 14-mission completion counts.

Read-only snapshots supplement screenshots; all progress is earned by visible actions.
Storage fault injection is a separate resilience check, not a quest shortcut.
"""
import os,json,hashlib,subprocess,re
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1]
ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium')
OUT=Path(os.environ.get('AQUARIUM_SINGLE_RESULTS','/tmp/aquarium-single-m1'))/ENGINE;OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
PROFILES=os.environ.get('AQUARIUM_SINGLE_PROFILES','desktop,portrait,landscape').split(',')
SLOT='aquarium-single-investigation-v1:m1-light-oxygen'
legacy=json.loads((ROOT/'tests/fixtures/learning-v1-grade-8.json').read_text())
legacy_raw=json.dumps(legacy,ensure_ascii=False)
old_key='aquarium-learning-notes-v1:aquarium-learning-tank-v1:8:8-ecosystem'
report={'engine':ENGINE,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),
 'sources':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in ROOT.iterdir() if p.suffix in ['.mjs','.css','.html']},
 'checks':[],'errors':[],'failed_requests':[],'inventories':[],'profiles':PROFILES,'hardware':'Linux browser, software graphics; not physical iPad/Safari'}
def snap(p):return p.evaluate('window.aquariumLearningSnapshot()')
def click(p,id,touch=False):
 target=p.locator('[data-single="'+id+'"]:visible').first
 target.tap() if touch else target.click()
def passed(name,**data):report['checks'].append({'name':name,**data});print('PASS',name,flush=True)
def shot(p,name):p.screenshot(path=str(OUT/name))
def identity(p):
 s=snap(p);assert s['renderer']['sameState'];assert s['context']['stateId']==s['renderer']['mainStateId']
 assert p.locator('canvas').count()==1;assert not p.locator('[data-tank-viewport]').count()
 assert set(s['renderer']['objects'])=={e['uid'] for e in s['session']['tank']['entities']}
 meter=p.locator('.single-meter:visible')
 if meter.count():assert meter.get_attribute('data-state-id')==s['context']['stateId'] and float(meter.get_attribute('data-time'))==s['context']['time']
 if p.locator('[data-live-curve]:visible').count():assert p.locator('[data-live-curve]').get_attribute('data-state-id')==s['context']['stateId']
 return s
def geometry(p,label):
 d=p.evaluate('''()=>{
 const visible=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'&&e.getClientRects().length>0};
 const controls=[...document.querySelectorAll('button,input,select,textarea,a[href]')].filter(visible).map(e=>({label:(e.innerText||e.getAttribute('aria-label')||e.type).trim(),width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,tag:e.tagName}));
 const rects=[...document.querySelectorAll('[data-persistent-hud],#equipment-controls button')].filter(visible).map(e=>{const r=e.getBoundingClientRect();return {left:Math.max(0,r.left),right:Math.min(innerWidth,r.right),top:Math.max(0,r.top),bottom:Math.min(innerHeight,r.bottom)}});
 const xs=[...new Set(rects.flatMap(r=>[r.left,r.right]))].sort((a,b)=>a-b);let area=0;
 for(let i=1;i<xs.length;i++){let end=-Infinity,height=0;const ys=rects.filter(r=>r.left<xs[i]&&r.right>xs[i-1]).map(r=>[r.top,r.bottom]).sort((a,b)=>a[0]-b[0]);for(const [a,b] of ys){height+=Math.max(0,b-Math.max(a,end));end=Math.max(end,b)}area+=(xs[i]-xs[i-1])*height}
 return {width:innerWidth,height:innerHeight,freeAquariumFraction:1-area/(innerWidth*innerHeight),rects,controls,horizontalOverflow:document.documentElement.scrollWidth>innerWidth};}''')
 report['inventories'].append({'step':label,**d});assert d['freeAquariumFraction']>=.7,(label,d)
 assert not d['horizontalOverflow'];assert all(c['width']>=43.5 and c['height']>=43.5 for c in d['controls'] if c['tag']=='BUTTON'),(label,d['controls'])
 assert not p.locator('input:visible,select:visible,textarea:visible').count()
def setup(b,profile):
 touch=profile!='desktop';view={'desktop':(1366,960),'portrait':(768,1024),'landscape':(1366,1024)}[profile]
 c=b.new_context(viewport={'width':view[0],'height':view[1]},device_scale_factor=1,is_mobile=touch,has_touch=touch,accept_downloads=True)
 c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}));"+f'localStorage.setItem({json.dumps(old_key)},{json.dumps(legacy_raw)});')
 p=c.new_page();p.set_default_timeout(60000);p.on('pageerror',lambda e:report['errors'].append(e.stack));p.on('requestfailed',lambda r:report['failed_requests'].append(r.url))
 p.goto(URL);p.wait_for_selector('[data-single=start]');return c,p,touch
def start(p,touch):
 assert p.locator('.single-missions article').count()==6
 assert p.locator('[data-single-mission]').count()==1
 assert not p.locator('[data-learn-mission]').count()
 click(p,'start',touch);p.wait_for_function('window.aquariumLearningSnapshot().renderer?.stats.detailModels>=19')
 assert snap(p)['session']['stage']=='plant';identity(p)
def select_predict(p,touch,profile):
 direct=False
 if profile=='desktop':
  # Real main-canvas hit at the plant seen in the actual desktop screenshot.
  p.mouse.click(715,512);direct=snap(p)['session']['stage']=='prediction'
 if not direct:click(p,'plant',touch)
 s=snap(p);assert s['session']['stage']=='prediction'
 chosen=next(e for e in s['session']['tank']['entities'] if e['uid']==s['session']['selection']);assert chosen['species'] in ['waterweed','anubias','javamoss']
 p.locator('[data-single=prediction][data-choice="0"]').tap() if touch else p.locator('[data-single=prediction][data-choice="0"]').click()
 expect(p.locator('.single-feedback')).to_have_attribute('data-kind','neutral');assert snap(p)['session']['prediction']['origin']=='selection'
 report.setdefault('selection',[]).append({'profile':profile,'directCanvasPick':direct,'actualPlantUid':chosen['uid']})
def complete(p,touch,profile):
 start(p,touch);geometry(p,profile+'-plant');shot(p,profile+'-start.png');select_predict(p,touch,profile)
 click(p,'play',touch);p.wait_for_function('window.aquariumLearningSnapshot().session.tank.day>45.25')
 click(p,'help',touch);held=snap(p);assert not held['running'];assert p.evaluate('document.querySelector("#scene").inert')
 p.wait_for_timeout(1300);assert snap(p)['session']['tank']==held['session']['tank']
 p.keyboard.press('Escape');assert p.evaluate('document.activeElement.dataset.single')=='help'
 click(p,'pause',touch) if snap(p)['running'] else None
 before=snap(p)['session'];p.reload();p.wait_for_selector('[data-single=start]');click(p,'start',touch)
 assert snap(p)['session']==before and not snap(p)['running'];identity(p);geometry(p,profile+'-paused')
 click(p,'play',touch);p.wait_for_function('window.aquariumLearningSnapshot().session.stage==="light-finished"',timeout=120000)
 s=identity(p);old=json.dumps(s['session']['runs'][0],sort_keys=True);baseline=s['session']['baseline'];geometry(p,profile+'-first-finished')
 # The actual real core provides an independent endpoint countercheck; it receives a copy, not another active tank.
 probe=p.evaluate('s=>window.aquariumSimulationProbe(s,3)',s['session']['runs'][0]['startSnapshot'])
 assert probe['params']==s['session']['tank']['params'] and probe['seed']==s['session']['tank']['seed']
 click(p,'reset',touch);s=identity(p);assert s['session']['tank']==baseline and s['context']['runId'] is None
 geometry(p,profile+'-restored');shot(p,profile+'-restored.png')
 # Touch the actual large lamp anchor; keyboard/mouse equivalent uses the named action.
 if touch:
  p.locator('[data-equipment=light]:visible').tap()
 else:p.locator('[data-single=darken]').press('Enter')
 s=snap(p);expected=json.loads(json.dumps(baseline));expected['hours']=0;assert s['session']['tank']==expected
 assert not p.locator('[data-equipment-value]').count();click(p,'play',touch)
 p.wait_for_function('window.aquariumLearningSnapshot().session.stage==="compare"',timeout=120000)
 s=identity(p);assert json.dumps(s['session']['runs'][0],sort_keys=True)==old
 assert s['session']['runs'][0]['samples'][-1]['oxygen']>7.8 and s['session']['runs'][1]['samples'][-1]['oxygen']>7.8
 assert len(s['session']['runs'])==2 and all(len(r['samples'])==13 for r in s['session']['runs'])
 geometry(p,profile+'-compare');shot(p,profile+'-compare.png')
 p.locator('[data-single-choice=reversed-dark]').tap() if touch else p.locator('[data-single-choice=reversed-dark]').click()
 assert snap(p)['session']['stage']=='compare';expect(p.locator('.single-feedback')).to_have_attribute('data-kind','error');geometry(p,profile+'-wrong-observation')
 click(p,'help',touch);click(p,'more-help',touch);p.keyboard.press('Escape')
 p.locator('[data-single-choice=observed]').tap() if touch else p.locator('[data-single-choice=observed]').click();geometry(p,profile+'-explain')
 p.locator('[data-single-choice=net-proof]').tap() if touch else p.locator('[data-single-choice=net-proof]').click()
 assert snap(p)['session']['stage']=='explain';expect(p.locator('.single-feedback')).to_have_attribute('data-kind','error');geometry(p,profile+'-wrong-explanation')
 p.locator('[data-single-choice=processes]').tap() if touch else p.locator('[data-single-choice=processes]').click();assert snap(p)['session']['stage']=='complete';geometry(p,profile+'-complete')
 with p.expect_download() as d:click(p,'export',touch)
 product=OUT/(profile+'-result.json');d.value.save_as(str(product));data=json.loads(product.read_text());assert data['currentContext']==snap(p)['context']
 assert data['provenance']['ownText']=='absent' and not data['ownText'];assert data['answers']['explanation']['origin']=='selection'
 click(p,'process',touch);expect(p.locator('[data-selected-plant]')).to_have_attribute('data-selected-plant',str(data['selection']));assert not snap(p)['running'];shot(p,profile+'-plant-explanation.png');p.keyboard.press('Escape')
 finished=snap(p)['session'];p.reload();p.wait_for_selector('[data-single=start]');click(p,'start',touch);assert snap(p)['session']==finished
 old_attempt=finished['attemptId'];click(p,'repeat',touch);fresh=snap(p)['session'];assert fresh['attemptId']!=old_attempt and fresh['stage']=='plant' and fresh['runs']==[]
 archives=p.evaluate('(slot)=>Object.keys(localStorage).filter(k=>k.startsWith(slot+":archive:"))',SLOT);assert len(archives)==1
 click(p,'menu',touch)
 with p.expect_file_chooser() as fc:click(p,'load',touch)
 fc.value.set_files(str(product));p.wait_for_function('window.aquariumLearningSnapshot().session.stage==="complete"');assert snap(p)['session']['attemptId']==old_attempt
 assert p.evaluate('(key)=>localStorage.getItem(key)',old_key)==legacy_raw
 passed(profile+': full M1, actual single scene/identity, complete serial reset, real light/net counterexample, wrong answers, hints, import/export, archived repeat and reload',endpoints=[r['samples'][-1]['oxygen'] for r in data['runs']])
def storage_fault(b):
 c,p,touch=setup(b,'desktop');start(p,False);select_predict(p,False,'fault')
 previous=p.evaluate('(key)=>localStorage.getItem(key)',SLOT)
 p.evaluate('''slot=>{window.originalSingleSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===slot)throw new DOMException('Quota injected','QuotaExceededError');return window.originalSingleSet.call(this,k,v)}}''',SLOT)
 click(p,'play');assert not snap(p)['running'];expect(p.locator('.single-storage')).to_be_visible()
 assert p.evaluate('(key)=>localStorage.getItem(key)',SLOT)==previous
 with p.expect_download() as d:p.locator('.single-storage [data-single=export]').click()
 d.value.save_as(str(OUT/'storage-rescue.json'));assert json.loads((OUT/'storage-rescue.json').read_text())['mission']=='m1-light-oxygen'
 p.reload();p.wait_for_selector('[data-single=start]');click(p,'start');assert snap(p)['session']['stage']=='light-ready'
 passed('quota failure: previous saved investigation unchanged, clock stopped, direct file rescue, reload retains last successful stage');c.close()
with sync_playwright() as pw:
 launch={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
 b=getattr(pw,ENGINE).launch(**launch)
 try:
  for profile in PROFILES:
   c,p,touch=setup(b,profile);complete(p,touch,profile);c.close()
  storage_fault(b)
  assert not report['errors'],report['errors'];assert not report['failed_requests'],report['failed_requests']
  assert all(hashlib.sha256((ROOT/name).read_bytes()).hexdigest()==h for name,h in report['sources'].items())
  report['status']='passed'
 except Exception as e:
  report.update(status='failed',failure=str(e))
  try:shot(p,'failure.png')
  except Exception:pass
  raise
 finally:
  (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');b.close();print('REPORT',OUT/'report.json',flush=True)
