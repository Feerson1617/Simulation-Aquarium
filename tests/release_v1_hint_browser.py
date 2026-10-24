"""U01: actual plant selection, unscrolled hint hit target and three predictions.
The before run records clipping; the after run requires complete visibility.
No simulation state is injected. Read-only projection locates the rendered plant.
"""
import os,json,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium')
PHASE=os.environ.get('AQUARIUM_PHASE','before')
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
OUT=Path(os.environ.get('AQUARIUM_HINT_RESULTS','/workspace/aquarium-devtools/v1-hint'))/PHASE/ENGINE
OUT.mkdir(parents=True,exist_ok=True)
r={'engine':ENGINE,'phase':PHASE,'url':URL,'hardware':'Linux browser touchscreen emulation; no physical iPad','checks':[],'actions':[],'errors':[]}
with sync_playwright() as pw:
 opts={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
 b=getattr(pw,ENGINE).launch(**opts);r['version']=b.version
 try:
  for index,(w,h) in enumerate([(768,1024),(1366,960),(1366,1024)]):
   c=b.new_context(viewport={'width':w,'height':h},has_touch=True,accept_downloads=True,ignore_https_errors=True)
   c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
   p=c.new_page();p.on('pageerror',lambda e:r['errors'].append(str(e)))
   p.on('console',lambda m:r['errors'].append(m.text) if m.type=='error' else None)
   p.goto(URL);p.locator('[data-single=start]').tap();p.locator('[data-single-stage=plant]').wait_for();p.wait_for_load_state('networkidle')
   pt=p.evaluate('''()=>{const s=aquariumLearningSnapshot(),uid=s.session.tank.entities.find(e=>e.species==='waterweed').uid,o=s.presentation.objects.find(o=>o.uid===uid);return {uid,x:o.bounds.x,y:o.bounds.y}}''')
   p.touchscreen.tap(pt['x'],pt['y']);p.locator('[data-single-stage=prediction]').wait_for()
   r['actions'].append({'viewport':[w,h],'input':'touch plant on canvas','point':pt})
   p.screenshot(path=str(OUT/f'{w}x{h}-prediction.png'))
   geometry=p.evaluate('''()=>{const task=document.querySelector('[data-single-stage=prediction]'),rect=e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height,bottom:b.bottom,right:b.right}},t=rect(task);return {task:t,scrollTop:task.scrollTop,glass:aquariumLearningSnapshot().presentation.glass,controls:[...task.querySelectorAll('button')].map(e=>{const b=rect(e);return {text:e.textContent,rect:b,visible:b.y>=t.y&&b.bottom<=t.bottom&&b.bottom<=innerHeight,hit:document.elementFromPoint(b.x+b.width/2,b.y+b.height/2)===e}})}}''')
   assert geometry['scrollTop']==0
   assert [x['text'] for x in geometry['controls']]==['Ja','Nein','Ich bin unsicher','Tipp']
   assert all(x['rect']['height']>=44 and x['rect']['width']>=44 for x in geometry['controls'])
   if PHASE=='after':assert all(x['visible'] and x['hit'] for x in geometry['controls']),geometry
   if not geometry['controls'][-1]['visible']:
    # Record the known baseline honestly; scrolling here is only the workaround.
    p.locator('[data-single=help]').scroll_into_view_if_needed()
    r['actions'].append({'viewport':[w,h],'input':'baseline workaround: scroll hint into view'})
   tip=p.locator('[data-single=help]').bounding_box();p.touchscreen.tap(tip['x']+tip['width']/2,tip['y']+tip['height']/2)
   p.locator('.single-dialog').wait_for();p.screenshot(path=str(OUT/f'{w}x{h}-hint.png'))
   p.locator('[data-single=close]').tap();p.locator(f'[data-single=prediction][data-choice="{index}"]').tap();p.locator('[data-single-stage=light-ready]').wait_for()
   r['actions'].append({'viewport':[w,h],'input':'touch hint, close, prediction','prediction':index})
   r['checks'].append({'viewport':[w,h],**geometry,'hintOpens':True,'predictionAccepted':index});c.close()
  assert not r['errors'];r['status']='passed'
 except Exception as e:
  r.update(status='failed',failure=repr(e));raise
 finally:
  (OUT/'report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');b.close()
