"""Read-only replay of the original UI, for an actual before/after control inventory.
Prepare the 4e59de3 root files/vendor under the isolated baseline URL first.
Unchanged assets may be shared; no working tree checkout or saved user data is used.
"""
import json,os
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT=Path(os.environ.get('AQUARIUM_CONTROL_RESULTS','/tmp/single-m1-controls'));OUT.mkdir(exist_ok=True,parents=True)
URL=os.environ.get('AQUARIUM_BASELINE_URL','http://127.0.0.1:8000/baseline-4e59de3/')
r={'displayedCommit':'4e59de3beb4d4af8017472301c9d28cc8ade653c','url':URL,'engine':'chromium','checks':[],'inventories':[],'errors':[]}
def inventory(p,label):
 r['inventories'].append({'step':label,'controls':p.evaluate('''()=>[...document.querySelectorAll('button,input,select,textarea,summary,a[href]')].filter(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&e.getClientRects().length}).map(e=>({label:(e.innerText||e.getAttribute('aria-label')||e.type).trim(),tag:e.tagName,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))''')})
 r['inventories'][-1]['sceneGeometry']=p.evaluate('''()=>{const views=[...document.querySelectorAll('[data-tank-viewport]')].map(e=>{const r=e.getBoundingClientRect();return {side:e.dataset.tankViewport,left:r.left,top:r.top,width:r.width,height:r.height,visibleArea:Math.max(0,Math.min(innerWidth,r.right)-Math.max(0,r.left))*Math.max(0,Math.min(innerHeight,r.bottom)-Math.max(0,r.top))}});return {width:innerWidth,height:innerHeight,views,sceneWindowFraction:views.reduce((n,r)=>n+r.visibleArea,0)/(innerWidth*innerHeight),note:'Two actual non-overlapping viewport rectangles; not the new HUD-union metric'}}''')

with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 c=b.new_context(viewport={'width':1366,'height':960},device_scale_factor=.5);c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
 p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:r['errors'].append(e.stack))
 try:
  p.goto(URL);p.locator('[data-learn-grade="8"]').click();p.locator('[data-learn=missions]').click();p.locator('[data-learn-mission="8-oxygen"]').click()
  p.wait_for_function('window.aquariumLearningSnapshot().prototype.render.sides.length===2&&window.aquariumLearningSnapshot().prototype.render.sides.every(s=>s.detailModels===s.objects)')
  inventory(p,'old oxygen initial');p.screenshot(path=str(OUT/'before-initial.png'))
  p.locator('[data-learn=observe]:visible').first.click();inventory(p,'old generic observation panel');p.locator('[data-learn=close]:visible').first.click()
  p.locator('[data-learn=device-light]:visible').first.click();inventory(p,'old lamp setting for comparison side');p.screenshot(path=str(OUT/'before-device.png'))
  assert not r['errors'];r['status']='passed';print('PASS isolated old UI: three actual control inventories, original models and two historical tank views')
 finally:(OUT/'report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');b.close()
