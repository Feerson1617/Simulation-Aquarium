"""Inspect real hardware world bounds, not just declared placement targets."""
import json,copy
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'docs/physical-scale/evidence';OUT.mkdir(exist_ok=True);base=json.loads((ROOT/'tests/fixtures/legacy-v1.json').read_text());report={'errors':[],'tanks':[],'external':[]}
with sync_playwright()as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']);page=b.new_page();page.set_default_timeout(90000);page.on('pageerror',lambda e:report['errors'].append(str(e)));page.goto('http://127.0.0.1:8000/aquarium-simulation/');page.locator('button[data-graphics-profile="ipad"]').click();page.locator('[data-start="free"]').click()
 try:
  for liters in [30,60,120,180,300,450,700]:
   s=copy.deepcopy(base);s.update(liters=liters,filter='sponge',heater=True,skimmer=True,air=True,day=40+liters/1000)
   page.locator('#import-file').set_input_files({'name':'hardware.json','mimeType':'application/json','buffer':json.dumps(s).encode()});page.wait_for_function('(n)=>JSON.parse(localStorage.getItem("aquarium-werkstatt-v1"))?.liters===n',arg=liters);page.wait_for_function('window.aquariumPhysicalSnapshot()?.equipment.length===4&&window.aquariumPhysicalSnapshot().objects.every(o=>o.meshCm)');r=page.evaluate('window.aquariumPhysicalSnapshot()');t=r['tank'];w=t['innerLengthCm']*.05/2;d=t['innerDepthCm']*.05/2
   for o in r['equipment']:assert o['min'][0]>=-w-.00001 and o['max'][0]<=w+.00001 and o['min'][2]>=-d-.00001 and o['max'][2]<=d+.00001,(liters,o,t)
   for i,a in enumerate(r['equipment']):
    for c in r['equipment'][i+1:]:assert a['max'][0]<=c['min'][0]+.00001 or c['max'][0]<=a['min'][0]+.00001 or a['max'][2]<=c['min'][2]+.00001 or c['max'][2]<=a['min'][2]+.00001,(liters,a,c)
   expected=[t['lengthCm'],t['heightCm'],t['depthCm']];assert all(abs(a-c)<.001 for a,c in zip(expected,r['glassCm']));report['tanks'].append({'liters':liters,'glassCm':r['glassCm'],'equipment':r['equipment']});print('PASS: Calibrated glass and four separate internal devices fit',liters,'litres',flush=True)
  s=copy.deepcopy(base);stone=copy.deepcopy(s['entities'][0]);stone.update(uid=101,species='stone',scale=1,rotation=0,x=0,z=0);other={**stone,'uid':102,'x':2};s.update(entities=[stone,other],nextId=103,liters=700,filter='none',heater=False,skimmer=False,air=False,day=61)
  for liters in [700,30,700]:
   s.update(liters=liters,day=s['day']+.01)
   page.locator('#import-file').set_input_files({'name':'resize.json','mimeType':'application/json','buffer':json.dumps(s).encode()});page.wait_for_function('(day)=>JSON.parse(localStorage.getItem("aquarium-werkstatt-v1"))?.day===day',arg=s['day']);page.wait_for_function('window.aquariumPhysicalSnapshot().objects.every(o=>o.meshCm)')
   s=page.evaluate('JSON.parse(localStorage.getItem("aquarium-werkstatt-v1"))');assert len(s['entities'])==2
   if liters==30:assert len(s['spatial']['unplaced'])>0;assert page.locator('.physical-notice').is_visible()
   else:assert s['spatial']['unplaced']==[]
  report['resize']='700 → 30 → 700 L retains both objects, warns of insufficient room, and recovers them when space becomes available'
  print('PASS: Later tank changes preserve all entities, recheck physical room and recover previously unplaceable objects',flush=True)
  for liters in [30,700]:
   for filter_type,expected_size in [('external',[20,32,20]),('sump',[40,25,25])]:
    s=copy.deepcopy(base);s.update(liters=liters,filter=filter_type,heater=False,skimmer=False,air=False,day=50+liters/1000+(filter_type=='sump'))
    page.locator('#import-file').set_input_files({'name':'external.json','mimeType':'application/json','buffer':json.dumps(s).encode()});page.wait_for_function('(s)=>{const a=JSON.parse(localStorage.getItem("aquarium-werkstatt-v1"));return a?.day===s.day&&a?.filter===s.filter}',arg=s);page.wait_for_function('(f)=>window.aquariumPhysicalSnapshot()?.equipment.some(o=>o.name==="equipment:filter:"+f)',arg=filter_type)
    r=page.evaluate('window.aquariumPhysicalSnapshot()');case=next(o for o in r['equipment'] if o['name']=='equipment:filter:'+filter_type)
    assert all(abs(a-c)<.001 for a,c in zip(case['sizeCm'],expected_size)),case
    assert abs(case['min'][0]-r['tank']['lengthCm']*.05/2-.15)<.00001,case
    assert abs(case['min'][1]+.36)<.00001,case
    report['external'].append({'liters':liters,'filter':filter_type,'case':case})
    if liters==30:page.screenshot(path=str(OUT/('physical-'+filter_type+'-30l.png')),timeout=120000)
    print('PASS: External case has declared centimetres, 3 cm glass clearance and floor contact',liters,filter_type,flush=True)
  assert not report['errors'];report['status']='passed'
 except Exception as error:report.update(status='failed',failure=str(error));raise
 finally:(OUT/'hardware-browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');b.close()
