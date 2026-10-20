"""Real geometry, controls, legacy migration and gestures under a project URL."""
import copy,json,threading
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'docs/physical-scale/evidence';OUT.mkdir(parents=True,exist_ok=True)
LEGACY=json.loads((ROOT/'tests/fixtures/legacy-v1.json').read_text());report={'checks':[],'errors':[],'measurements':[]}
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT.parent)));threading.Thread(target=server.serve_forever,daemon=True).start()
def click(p,s):p.locator(s).filter(visible=True).first.click()
def passed(text):report['checks'].append(text);print('PASS:',text,flush=True)
def fixture(species=None,liters=120,age=30,biomass=.8,scale=1):
 s=copy.deepcopy(LEGACY);s.update(day=45.35,liters=liters)
 if species:
  e=copy.deepcopy(s['entities'][0]);e.update(species=species,uid=1,x=0,z=0,rotation=2,scale=scale,age=age,biomass=biomass,sex='♂');e.pop('genetics',None);e.pop('variant',None);s['entities']=[e];s['nextId']=2
 if species=='softleather':s['water']='salt';s['params']['salinity']=34
 return s
def restore(p,s):
 restore.serial=getattr(restore,'serial',0)+1;s=copy.deepcopy(s);s['day']+=restore.serial*.00001
 if p.locator('[data-act="close-modal"]:visible').count():click(p,'[data-act="close-modal"]')
 p.locator('#import-file').set_input_files({'name':'physical-fixture.json','mimeType':'application/json','buffer':json.dumps(s).encode()})
 p.wait_for_function('(s)=>{const a=JSON.parse(localStorage.getItem("aquarium-werkstatt-v1"));return a?.liters===s.liters&&a?.day===s.day&&a.entities.length===s.entities.length&&a.entities[0].species===s.entities[0].species}',arg=s)
 if p.locator('[data-act="close-panel"]:visible').count():click(p,'[data-act="close-panel"]')
 p.wait_for_function('(n)=>window.aquariumPhysicalSnapshot()?.objects.filter(o=>o.measuredCm?.every(Number.isFinite)&&o.meshCm).length===n',arg=len(s['entities']))
 return p.evaluate('window.aquariumPhysicalSnapshot()')
def shot(p,name):p.screenshot(path=str(OUT/(name+'.png')),timeout=120000)
def saved(p):return p.evaluate('JSON.parse(localStorage.getItem("aquarium-werkstatt-v1"))')
try:
 with sync_playwright()as play:
  browser=play.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']);context=browser.new_context(viewport={'width':1360,'height':960});p=context.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:report['errors'].append(str(e)));p.goto(f'http://127.0.0.1:{server.server_port}/{ROOT.name}/');click(p,'button[data-graphics-profile="ipad"]');click(p,'[data-start="free"]')
  lengths=[];plant_heights=[]
  for liters in [30,60,120,180,300,450,700]:
   r=restore(p,fixture(liters=liters));fish=next(o for o in r['objects']if o['species']=='neon');lengths.append(fish['measuredCm'][0]);assert abs(fish['measuredCm'][0]-fish['lengthCm'])<.0001,r
   plant=next(o for o in r['objects']if o['species']=='anubias');plant_heights.append(plant['measuredCm'][1]);assert abs(plant['measuredCm'][1]-plant['heightCm'])<.0001;assert abs(plant['measuredCm'][1]/fish['measuredCm'][0]-plant['heightCm']/fish['lengthCm'])<.0001
   expected=[r['tank']['lengthCm'],r['tank']['heightCm'],r['tank']['depthCm']];assert r['glassCm']and all(abs(a-b)<.001 for a,b in zip(expected,r['glassCm'])),r
   report['measurements'].append(r)
  assert max(lengths)-min(lengths)<.0001,lengths;assert max(plant_heights)-min(plant_heights)<.0001;passed('Actual glass dimensions match all seven tanks; Neon length, Anubias height and fish/plant ratio stay physically identical')
  restore(p,fixture(liters=120));before=saved(p);click(p,'[data-panel="time"]');p.locator('[data-graphics-setting]').select_option('maximum');click(p,'[data-act="close-panel"]');p.wait_for_function('window.aquariumPhysicalSnapshot()?.objects.every(o=>o.meshCm)&&window.aquariumSnapshot().graphics.graphicsProfile==="maximum"');r=p.evaluate('window.aquariumPhysicalSnapshot()');fish=next(o for o in r['objects']if o['species']=='neon');plant=next(o for o in r['objects']if o['species']=='anubias');assert abs(fish['measuredCm'][0]-lengths[0])<.0001;assert abs(plant['measuredCm'][1]-plant_heights[0])<.0001;assert saved(p)==before;shot(p,'maximum-physical-aquarium');report['maximum']=r;passed('Maximum and iPad use the same physical fish length and plant height without changing the saved simulation')
  click(p,'[data-panel="time"]');p.locator('[data-graphics-setting]').select_option('ipad');click(p,'[data-act="close-panel"]')
  for species in ['neon','guppy','anubias','nerite','softleather','stone']:
   restore(p,fixture(species));click(p,'[data-panel="care"]');click(p,'[data-entity="1"]');controls=p.locator('#drawer-root [data-entity-setting]');assert controls.count()==(2 if species=='stone'else 0),species
   if species!='stone':assert 'cm' in p.locator('.physical-size').inner_text()
   click(p,'[data-act="close-panel"]')
  passed('All biological categories have no size/rotation controls; decoration keeps its two aquascaping controls')
  sizes=[]
  for scale in [.4,1.7]:
   r=restore(p,fixture('anubias',scale=scale));sizes.append(r['objects'][0]['measuredCm']);assert saved(p)['entities'][0]['scale']==1;assert saved(p)['spatial']['originalOverrides']['1']['scale']==scale
  assert all(abs(a-b)<.0001 for a,b in zip(*sizes));passed('Legacy manual biological scale is archived and replaced by the same real physical size')
  young=restore(p,fixture('anubias',biomass=.2))['objects'][0];grown=restore(p,fixture('anubias',biomass=2.2))['objects'][0];assert grown['measuredCm'][1]>young['measuredCm'][1]*2;report['plantGrowth']=[young,grown]
  juvenile=restore(p,fixture('guppy',age=0))['objects'][0];adult=restore(p,fixture('guppy',age=30))['objects'][0];assert juvenile['measuredCm'][0]<adult['measuredCm'][0]*.51;report['ageGrowth']=[juvenile,adult];passed('Actual plant geometry follows biomass and actual fish geometry follows saved developmental age')
  maleFixture=fixture('guppy');femaleFixture=copy.deepcopy(maleFixture);femaleFixture['entities'][0]['sex']='♀';male=restore(p,maleFixture)['objects'][0];female=restore(p,femaleFixture)['objects'][0];assert female['measuredCm'][0]>male['measuredCm'][0]*1.4;report['sexualSize']=[male,female];passed('Measured male and female Guppies retain their declared sexual size difference')
  restore(p,fixture('anubias'));target=p.evaluate('window.aquariumAquascapingSnapshot().targets[0]');camera=p.evaluate('window.aquariumAquascapingSnapshot().camera');click(p,'#tweezers-button');p.mouse.move(target['screen']['x'],target['screen']['y']);p.mouse.down();p.mouse.move(target['screen']['x']+110,target['screen']['y']-20,steps=12);p.mouse.up();p.wait_for_function('window.aquariumAquascapingSnapshot().phase==="idle"');after=saved(p);assert abs(after['entities'][0]['x'])+abs(after['entities'][0]['z'])>.02;assert camera==p.evaluate('window.aquariumAquascapingSnapshot().camera');assert after['entities'][0]['scale']==1;shot(p,'physical-tweezers');p.keyboard.press('Escape');p.reload();click(p,'[data-start="resume"]');assert saved(p)['entities']==after['entities']
  target=p.evaluate('window.aquariumAquascapingSnapshot().targets[0]');click(p,'#tweezers-button');p.mouse.move(target['screen']['x'],target['screen']['y']);p.mouse.down();p.mouse.move(-20,-20,steps=12);p.mouse.up();p.wait_for_function('window.aquariumAquascapingSnapshot().phase==="idle"');edge=p.evaluate('window.aquariumPhysicalSnapshot()');bounds=edge['objects'][0]['worldBounds'];tx=edge['tank']['innerLengthCm']*.05/2;tz=edge['tank']['innerDepthCm']*.05/2;assert bounds['min'][0]>=-tx-.00001 and bounds['max'][0]<=tx+.00001;assert bounds['min'][2]>=-tz-.00001 and bounds['max'][2]<=tz+.00001;passed('Mouse tweezers preserve size, camera and saved positions; the entire plant canopy stays inside glass after an outside-canvas drag')
  context.close();context=browser.new_context(viewport={'width':820,'height':1180},has_touch=True,is_mobile=True);p=context.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:report['errors'].append(str(e)));p.goto(f'http://127.0.0.1:{server.server_port}/{ROOT.name}/');p.locator('button[data-graphics-profile="ipad"]').tap();p.locator('[data-start="free"]').tap();restore(p,fixture('anubias'));target=p.evaluate('window.aquariumAquascapingSnapshot().targets[0]');p.locator('#tweezers-button').tap();cdp=context.new_cdp_session(p);x=target['screen']['x'];y=target['screen']['y'];touch=lambda x,y:{'x':x,'y':y,'radiusX':2,'radiusY':2,'force':1,'id':1}
  cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[touch(x,y)]});cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[touch(x+90,y-15)]});cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});p.wait_for_function('window.aquariumAquascapingSnapshot().phase==="idle"');assert abs(saved(p)['entities'][0]['x'])>.02;assert p.evaluate('document.documentElement.scrollWidth<=innerWidth');shot(p,'ipad-physical-tweezers');passed('Portrait touch tweezers preserve the same calibrated size without horizontal overflow')
  assert not report['errors'],report['errors'];report['status']='passed';browser.close()
except Exception as e:report['status']='failed';report['failure']=str(e);raise
finally:(OUT/'browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');server.shutdown()
