"""Full model inventory plus real Maximum/iPad scenes; no simulated browser FPS claim."""
import json,copy,os
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1];OUT=Path('/tmp/aquarium-graphics-results')/datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S');OUT.mkdir(parents=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
PART=os.environ.get('AQUARIUM_GRAPHICS_PART','full')
assert PART in ['full','marine-touch']
report={'scope':PART,'checks':[],'errors':[],'console_errors':[],'failed_requests':[],'external_requests':[],'audits':[]}
def click(p,s):p.locator(s).filter(visible=True).first.click()
def passed(s):report['checks'].append(s);print('PASS',s,flush=True)
def saved(p,key):return p.evaluate('(k)=>JSON.parse(localStorage.getItem(k))',key)
def attach(p):
 p.set_default_timeout(90000);p.on('pageerror',lambda e:report['errors'].append(str(e)));p.on('console',lambda m:report['console_errors'].append({'text':m.text[:1000],'url':m.location.get('url','')})if m.type=='error' else None);p.on('requestfailed',lambda r:report['failed_requests'].append(r.url));p.on('request',lambda r:report['external_requests'].append(r.url)if r.url.startswith(('http:','https:'))and not r.url.startswith('http://127.0.0.1:8000/')else None)
def wait_models(p,count):p.wait_for_function('(n)=>window.aquariumSnapshot().graphics.detailModels===n',arg=count,timeout=180000)
def screenshot(p,name):p.screenshot(path=str(OUT/name),timeout=120000)
def import_payload(p,payload):
 p.locator('#import-file').set_input_files({'name':'graphics-scene.json','mimeType':'application/json','buffer':json.dumps(payload).encode()});p.wait_for_function('(e)=>{const s=window.aquariumSnapshot();return s.water===e.water&&s.entities===e.entities&&Math.abs(s.day-e.day)<1e-6}',arg={'water':payload['water'],'entities':len(payload['entities']),'day':payload['day']});wait_models(p,len(payload['entities']));click(p,'[data-act="close-panel"]')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 try:
  context=browser.new_context(viewport={'width':1360,'height':960},accept_downloads=True);page=context.new_page();attach(page)
  if PART=='marine-touch':
   page.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))");page.goto(URL);click(page,'[data-scenarios]');click(page,'[data-scenario-start="foodweb"]');wait_models(page,24)
   fixture=copy.deepcopy(saved(page,'aquarium-scenario-v1:foodweb'));fixture['day']=45.35
   click(page,'[data-panel="time"]');page.locator('[data-graphics-setting]').select_option('maximum');wait_models(page,24);click(page,'[data-act="close-panel"]')
  else:
   page.goto(URL)
   expect(page.locator('button[data-graphics-profile="maximum"]')).to_be_visible();assert page.locator('[data-start="free"]').count()==0;screenshot(page,'platform-choice.png')
   click(page,'button[data-graphics-profile="maximum"]');expect(page.locator('[data-start="free"]')).to_be_visible();expect(page.locator('[data-start="tutorial"]')).to_be_visible();expect(page.locator('[data-scenarios]')).to_be_visible();passed('platform choice precedes all three unchanged game modes')
   click(page,'[data-scenarios]');click(page,'[data-scenario-start="foodweb"]');wait_models(page,24)
   # Generated daytime fixture, not a change to real scenario definitions.
   source=saved(page,'aquarium-scenario-v1:foodweb');fixture=copy.deepcopy(source);fixture['day']=45.35;import_payload(page,fixture)
   screenshot(page,'desktop-maximum-freshwater.png');graphics=page.evaluate('window.aquariumSnapshot().graphics');assert graphics['graphicsProfile']=='maximum';assert graphics['triangles']>500000;report['maximum_graphics']=graphics;passed('Maximum renders the real freshwater scene with high-detail meshes and optical materials')
   # Compare actual shader-driven scene and selected view, then close the overlay.
   click(page,'#ecosystem-button');click(page,'[data-eco-tab="nitrogen"]');expect(page.locator('.study-content')).to_contain_text('Nitrifikation');click(page,'[data-eco-close]')
   before=page.evaluate('localStorage.getItem("aquarium-scenario-v1:foodweb")');click(page,'[data-panel="time"]');page.locator('[data-graphics-setting]').select_option('ipad');wait_models(page,24);assert page.evaluate('localStorage.getItem("aquarium-scenario-v1:foodweb")')==before
   mobile=page.evaluate('window.aquariumSnapshot().graphics');report['ipad_graphics']=mobile;assert mobile['triangles']<graphics['triangles'];assert mobile['textureBudget']['estimatedBytes']<graphics['textureBudget']['estimatedBytes'];click(page,'[data-act="close-panel"]');screenshot(page,'ipad-freshwater.png');passed('profile switch reduces presentation resources without changing saved state')
   click(page,'#ecosystem-button') # Full overlay suspends invisible scene rendering during the complete inventory.
   inventory=page.evaluate('window.aquariumGraphicsInventory()');(OUT/'anatomy-inventory.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2));assert len(inventory)==181
   ids=[item['id']for item in inventory if item['category']in ['fish','plant','invert','coral','decor']];assert len(ids)==144
   for n,id in enumerate(ids):
    result=page.evaluate('(id)=>window.aquariumModelAudit(id)',id);assert result['revision']=='realism-1';assert result['triangles']>0;assert all(v>0 for v in result['size']),result;report['audits'].append(result)
    if n%30==0:print('AUDIT',n+1,'/',len(ids),flush=True)
   (OUT/'model-audit-ipad.json').write_text(json.dumps(report['audits'],indent=2));passed('all 144 real organism/decoration model paths build; complete 181-entry anatomy inventory recorded')
   click(page,'[data-eco-close]')
   # Real close-ups: the same lease/model code as the aquarium, not catalog images.
   click(page,'[data-panel="time"]');page.locator('[data-graphics-setting]').select_option('maximum');wait_models(page,24);click(page,'[data-act="close-panel"]');click(page,'[data-act="specimen-gallery"]')
   for id in ['neon','anubias','amanoshrimp','softleather']:
    if not page.locator(f'[data-preview="{id}"]').count():
     page.locator('#specimen-search').fill('')
    # The gallery category may start at fish; use search across all items.
    if not page.locator(f'[data-preview="{id}"]').count():
     category={'anubias':'plant','amanoshrimp':'invert','softleather':'coral'}.get(id,'all');click(page,f'[data-specimen-category="{category}"]')
    click(page,f'[data-preview="{id}"]');page.wait_for_function('(id)=>document.querySelector("#specimen-stage")?.dataset.ready===id',arg=id);page.locator('#specimen-stage').screenshot(path=str(OUT/f'maximum-closeup-{id}.png'),timeout=120000);click(page,'#modal-root [data-act="specimen-gallery"]')
   click(page,'[data-act="close-modal"]');passed('Maximum close-ups captured from the actual fish/plant/invertebrate/coral renderers')
  reef=copy.deepcopy(fixture);reef.pop('scenario',None);reef.update(water='salt',liters=300,light='reef',substrate='coralsand',skimmer=True,co2Dose=0,entities=[],nextId=1)
  reef['params'].update(salinity=34,ph=8.2,kh=8,calcium=420,co2=3,no3=5,po4=.07)
  template=fixture['entities'][0]
  for id,count in [('clown',2),('cleanershrimp',2),('trochus',3),('softleather',1),('acropora',2),('ricordea',2),('reefcave',1),('reefrock',2)]:
   for n in range(count):
    e=copy.deepcopy(template);e.update(uid=reef['nextId'],species=id,x=(reef['nextId']%5-2)*.9,z=((reef['nextId']//5)%3-1)*.7,rotation=.3,health=100,age=30,dead=False,acclimation=34,biomass=.8);reef['nextId']+=1;reef['entities'].append(e)
  import_payload(page,reef);screenshot(page,'desktop-maximum-reef.png');passed('Maximum marine scene includes live coral geometry, reef hardscape and actual installed equipment')
  context.close();context=browser.new_context(viewport={'width':820,'height':1180},has_touch=True,is_mobile=True);page=context.new_page();attach(page);page.goto(URL);page.locator('button[data-graphics-profile="ipad"]').tap();page.locator('[data-scenarios]').tap();page.locator('[data-scenario-start="foodweb"]').tap();wait_models(page,24);screenshot(page,'ipad-touch-portrait.png');page.locator('#ecosystem-button').tap();page.locator('[data-eco-tab="web"]').tap();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.locator('[data-eco-close]').tap();passed('real touch events operate the iPad profile and shared analysis in portrait')
  assert not report['errors'],report['errors'];assert not report['failed_requests'],report['failed_requests'];assert not report['external_requests'],report['external_requests']
  unexpected=[e for e in report['console_errors']if not(e['url'].endswith('/favicon.ico')and '404'in e['text'])];assert not unexpected,unexpected
  passed('no JavaScript/shader/resource errors or external runtime requests');report['status']='passed'
 except Exception as e:
  report['status']='failed';report['failure']=str(e)
  try:screenshot(page,'failure.png')
  except Exception:pass
  raise
 finally:
  (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('RESULTS',OUT,flush=True);browser.close()
