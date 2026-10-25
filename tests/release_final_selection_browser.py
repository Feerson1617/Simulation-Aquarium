"""Current scene visibility and actual plant/small-fish hits, with empty-space controls."""
import os,json,subprocess
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium')
OUT=Path(os.environ.get('AQUARIUM_SELECTION_RESULTS','/tmp/aquarium-final-selection'))/ENGINE;OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
r={'engine':ENGINE,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'checks':[],'actions':[],'errors':[],'consoleErrors':[]}
with sync_playwright() as pw:
 opts={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
 b=getattr(pw,ENGINE).launch(**opts);r['version']=b.version;c=b.new_context(viewport={'width':1366,'height':960},has_touch=True,ignore_https_errors=True)
 c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
 p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:r['errors'].append(str(e)));p.on('console',lambda m:r['consoleErrors'].append(m.text) if m.type=='error' else None)
 def snap():return p.evaluate('aquariumLearningSnapshot()')
 def input(kind,x,y):
  p.touchscreen.tap(x,y) if kind=='touch' else p.mouse.click(x,y)
  r['actions'].append({'atUTC':datetime.now(timezone.utc).isoformat(),'input':kind,'point':{'x':x,'y':y}})
 try:
  p.goto(URL+'?research=8');p.wait_for_function('!!aquariumLearningSnapshot()?.presentation?.glass',polling=500)
  for w,h in [(1366,960),(768,1024),(1366,1024)]:
   p.set_viewport_size({'width':w,'height':h});p.wait_for_timeout(600)
   for kind in ['mouse','touch']:
    for species in ['waterweed','guppy']:
     success=False
     for uid in [e['uid'] for e in snap()['session']['tank']['entities'] if e['species']==species]:
      pt=next(x for x in snap()['presentation']['objects'] if x['uid']==uid)['bounds'];input(kind,pt['x'],pt['y'])
      actual=snap();selected=actual['session']['selection'];r['actions'][-1].update(intendedUid=uid,actualUid=selected)
      if p.locator('.single-dialog').count():
       text=p.locator('.single-dialog').inner_text();actualSpecies=next(e['species'] for e in actual['session']['tank']['entities'] if e['uid']==selected)
       assert p.locator('[data-selected-individual]').get_attribute('data-selected-individual')==str(selected)
       p.keyboard.press('Escape')
       if selected==uid and actualSpecies==species:
        p.wait_for_function('uid=>aquariumLearningSnapshot().presentation.markerVisible&&document.querySelector(".aquarium-selection:not([hidden])")?.dataset.selectedUid===String(uid)',arg=uid,polling=500)
        r['checks'].append({'viewport':[w,h],'input':kind,'species':species,'uid':uid,'bounds':pt,'card':text,'marker':True});success=True;break
     assert success,(w,h,kind,species)
    selected=snap()['session']['selection'];glass=snap()['presentation']['glass']
    for x in [w*.5,w*.75]:
     y=max(90,glass['top']-20);input(kind,x,y);assert p.locator('.single-dialog').count()==0 and snap()['session']['selection']==selected
     r['checks'].append({'viewport':[w,h],'input':kind,'emptySpaceNoFalseSelection':True,'point':[x,y]})
   p.screenshot(path=str(OUT/f'{w}x{h}-selected-fish.png'))
  assert not r['errors'] and not r['consoleErrors'];r['status']='passed'
 except Exception as e:
  r.update(status='failed',failure=str(e))
  try:p.screenshot(path=str(OUT/'failure.png'));r['last']=snap()
  except Exception:pass
  raise
 finally:(OUT/'report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');b.close();print(r.get('status'),OUT,flush=True)
