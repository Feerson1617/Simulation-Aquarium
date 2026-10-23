"""Real pointer release: a completed selection must not leave the camera dragging."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,subprocess,os,math
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('POINTER_RESULT','/tmp/aquarium-pointer-release'));OUT.mkdir(exist_ok=True,parents=True)
ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium')
r={'engine':ENGINE,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'checks':[],'errors':[]}
with sync_playwright() as pw:
 launch={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
 b=getattr(pw,ENGINE).launch(**launch);r['version']=b.version;c=b.new_context(viewport={'width':768,'height':1024},has_touch=True,is_mobile=True)
 c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}));")
 p=c.new_page();p.on('pageerror',lambda e:r['errors'].append(str(e)));p.goto('http://127.0.0.1:8000/aquarium-simulation/');p.locator('[data-single=start]').tap();p.wait_for_function('window.aquariumLearningSnapshot()?.presentation?.glass');p.wait_for_timeout(800)
 for kind in ['mouse','touch']:
  p.locator('[data-single=frame]').tap();p.wait_for_timeout(500)
  pt=p.evaluate('window.aquariumLearningSnapshot().presentation.objects.find(x=>x.uid===1).bounds')
  if kind=='mouse':p.mouse.click(pt['x'],pt['y'])
  else:p.touchscreen.tap(pt['x'],pt['y'])
  before=p.evaluate('window.aquariumLearningSnapshot().presentation.camera');p.mouse.move(pt['x']+80,pt['y']+30,steps=5);p.wait_for_timeout(800);after=p.evaluate('window.aquariumLearningSnapshot().presentation.camera');uid=p.evaluate('window.aquariumLearningSnapshot().session.selection')
  r['checks'].append({'input':kind,'before':before,'after':after,'selected':uid,'stable':math.dist(before,after)<1e-6});p.screenshot(path=str(OUT/(kind+'.png')))
 r['status']='passed' if all(x['stable'] and x['selected']==1 for x in r['checks']) and not r['errors'] else 'failed';(OUT/'report.json').write_text(json.dumps(r,indent=2));print(json.dumps(r),flush=True);b.close();assert r['status']=='passed',r
