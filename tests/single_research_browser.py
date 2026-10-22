"""Real free-research, teacher preferences, storage failure and legacy-preservation checks."""
import os,json,math,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1];ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium')
OUT=Path(os.environ.get('AQUARIUM_RESEARCH_RESULTS','/tmp/aquarium-research'))/ENGINE;OUT.mkdir(exist_ok=True,parents=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
r={'engine':ENGINE,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'checks':[],'errors':[],'failed_requests':[],'physicalIPad':False}
def snap(p):return p.evaluate('window.aquariumLearningSnapshot()')
def click(p,key):p.locator(f'[data-class="{key}"]:visible').first.click()
def ready(p):p.wait_for_function('document.querySelector("[data-class-stage]")?.dataset.classStage==="free"',polling=200)
def passed(name):r['checks'].append(name);print('PASS',name,flush=True)
with sync_playwright() as pw:
 launch={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
 b=getattr(pw,ENGINE).launch(**launch)
 try:
  for grade in [int(v) for v in os.environ.get('AQUARIUM_RESEARCH_GRADES','8,9,10').split(',')]:
   c=b.new_context(viewport={'width':1366,'height':1024},device_scale_factor=1,has_touch=True,accept_downloads=True)
   c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}));localStorage.setItem('aquarium-learning-old-sentinel','unchanged');")
   p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:r['errors'].append(e.stack));p.on('requestfailed',lambda q:r['failed_requests'].append(q.url))
   p.goto(URL+'?research='+str(grade));ready(p);assert snap(p)['session']['tank']['learning']=={'version':2,'grade':grade,'mode':'free','mission':None};assert p.locator('canvas').count()==1
   click(p,'catalog');before=len(snap(p)['session']['tank']['entities']);p.locator('[data-class=add][data-class-species=anubias]').click();assert len(snap(p)['session']['tank']['entities'])==before+1;p.keyboard.press('Escape')
   click(p,'care');before=snap(p)['session']['tank']['detritus'];click(p,'free-feed');assert snap(p)['session']['tank']['detritus']==before+.12
   before=snap(p)['session']['tank']['params']['no3'];click(p,'free-water');assert snap(p)['session']['tank']['params']['no3']!=before;click(p,'free-light');assert snap(p)['session']['tank']['hours']==0;click(p,'free-light');assert snap(p)['session']['tank']['hours']==8;p.keyboard.press('Escape')
   day=snap(p)['session']['tank']['day'];click(p,'free-day');assert snap(p)['session']['tank']['day']==day+1;assert snap(p)['renderer']['sameState']
   click(p,'measurements');expect(p.locator('.single-dialog')).to_contain_text('Sauerstoff');p.keyboard.press('Escape')
   click(p,'menu')
   with p.expect_download() as d:click(p,'export')
   product=OUT/f'free-{grade}.json';d.value.save_as(str(product));p.keyboard.press('Escape');before=snap(p)['session'];p.reload();ready(p);assert snap(p)['session']==before
   click(p,'free-day');assert snap(p)['session']['tank']['day']>before['tank']['day'];click(p,'menu');p.locator('[data-class-file]').set_input_files(str(product));p.wait_for_function('window.aquariumLearningSnapshot().dialog===null',polling=200);expect(p.locator('.single-feedback')).to_contain_text('Dein Stand ist geladen.');assert snap(p)['session']['tank']==before['tank'];assert snap(p)['session']['attemptId']==before['attemptId'];assert p.evaluate('localStorage.getItem("aquarium-learning-old-sentinel")')=='unchanged'
   passed(f'free grade {grade}: one actual aquarium, catalog insertion, care, water/light/time, measurement, export/reload/import, old data unchanged')
   if grade==8:
    p.wait_for_function('window.aquariumAquascapingSnapshot().targets.some(t=>t.species==="anubias")',polling=200)
    inspected=next(t for t in p.evaluate('window.aquariumAquascapingSnapshot().targets') if t['species']=='anubias');p.mouse.click(inspected['screen']['x'],inspected['screen']['y']);expect(p.locator('[data-selected-individual]')).to_be_visible();selected=int(p.locator('[data-selected-individual]').get_attribute('data-selected-individual'));assert snap(p)['session']['selection']==selected;assert any(e['uid']==selected for e in snap(p)['session']['tank']['entities']);p.keyboard.press('Escape');passed('free direct selection: object card matches the actual clicked foreground individual')
    types=json.loads((ROOT/'tests/fixtures/ecology-species.json').read_text())
    plan=p.evaluate("""async({tank,types})=>{const {placementCandidate}=await import('./aquascaping.mjs');for(const e of tank.entities.filter(e=>types[e.species]?.category==='plant'))for(const [key,dx,dz]of [['ArrowLeft',-.1,0],['ArrowRight',.1,0],['ArrowUp',0,-.1],['ArrowDown',0,.1]]){const candidate=placementCandidate(tank,e,types,e.x+dx,e.z+dz);if(candidate.valid&&(Math.abs(candidate.x-e.x)+Math.abs(candidate.z-e.z)>.02))return {uid:e.uid,key,x:candidate.x,z:candidate.z}}return null;}""",{'tank':snap(p)['session']['tank'],'types':types})
    assert plan,'At least one current plant has a legal nearby position; the read-only probe does not change the aquarium'
    click(p,'catalog');p.locator(f'[data-class=inspect][data-class-uid="{plan["uid"]}"]').press('Enter');expect(p.locator('[data-selected-individual]')).to_have_attribute('data-selected-individual',str(plan['uid']));click(p,'move-selected');assert snap(p)['tweezers'];camera=p.evaluate('window.aquariumAquascapingSnapshot().camera');p.keyboard.press(plan['key']);p.wait_for_function('window.aquariumAquascapingSnapshot().phase==="idle"',polling=200)
    moved=next(e for e in snap(p)['session']['tank']['entities'] if e['uid']==plan['uid']);assert abs(moved['x']-plan['x'])<1e-8 and abs(moved['z']-plan['z'])<1e-8
    stored=p.evaluate("""async()=>{const {decodeSingle}=await import('./single-classroom-model.mjs');return decodeSingle(localStorage.getItem('aquarium-single-investigation-v1:research-8'));}""")
    assert stored['tank']['entities']==snap(p)['session']['tank']['entities'];assert p.evaluate('window.aquariumAquascapingSnapshot().camera')==camera
    passed('accessible stock selection and actual arrow-key plant movement: legal position, same camera, immediate authoritative save')
    points=p.evaluate('window.aquariumAquascapingSnapshot()');target=next(t for t in points['targets'] if t['uid']==plan['uid']);before_drag=snap(p)['session']['tank']['entities'];p.mouse.move(target['screen']['x'],target['screen']['y']);p.mouse.down();assert p.evaluate('window.aquariumAquascapingSnapshot().phase')=='dragging';p.mouse.move(target['screen']['x']+35,target['screen']['y']-5,steps=4);p.keyboard.press('Escape');p.mouse.up();assert p.evaluate('window.aquariumAquascapingSnapshot().phase')=='idle';assert snap(p)['session']['tank']['entities']==before_drag;assert p.evaluate('window.aquariumAquascapingSnapshot().camera')==camera
    passed('actual pointer grasp and cancellation keep the camera and saved placement unchanged')
    click(p,'tweezers');assert not snap(p)['tweezers'];click(p,'menu');click(p,'teacher');click(p,'teacher-hints');click(p,'teacher-notes');p.keyboard.press('Escape');assert not p.locator('[data-class=help]:visible').count()
    p.reload();ready(p);assert not p.locator('[data-class=help]:visible').count();click(p,'menu');assert not p.locator('[data-class-note]').count();p.keyboard.press('Escape');passed('local teacher options persist: hints off and optional own text hidden, no mandatory writing')
    slot='aquarium-single-investigation-v1:research-8';saved=p.evaluate('(k)=>localStorage.getItem(k)',slot)
    p.evaluate('''slot=>{window.researchOriginalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===slot)throw new DOMException('injected quota','QuotaExceededError');return window.researchOriginalSet.call(this,k,v)}}''',slot)
    click(p,'free-day');expect(p.locator('.single-storage')).to_be_visible();assert p.evaluate('(k)=>localStorage.getItem(k)',slot)==saved;assert not snap(p)['running']
    with p.expect_download() as d:p.locator('.single-storage [data-class=export]').click()
    d.value.save_as(str(OUT/'quota-rescue.json'));p.reload();ready(p);assert p.evaluate('(k)=>localStorage.getItem(k)',slot)==saved;passed('new controller storage quota: saved bytes preserved, clock stopped, direct file rescue')
   p.screenshot(path=str(OUT/f'free-{grade}.png'));c.close()
  assert not r['errors'],r['errors'];assert not r['failed_requests'],r['failed_requests'];r['status']='passed'
 except Exception as e:
  r.update(status='failed',failure=str(e))
  try:p.screenshot(path=str(OUT/'failure.png'));r['snapshot']=snap(p);r['aquascaping']=p.evaluate('window.aquariumAquascapingSnapshot()');r['body']=p.locator('#learning-root').inner_text()
  except Exception:pass
  raise
 finally:(OUT/'report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');b.close();print('REPORT',OUT/'report.json',flush=True)
