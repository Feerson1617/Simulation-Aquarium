"""F10: actual mouse and Chromium native touch drags, collision, cancellation and save roundtrip."""
from playwright.sync_api import sync_playwright,expect
from pathlib import Path
from datetime import datetime,timezone
import os,json,subprocess,math
ROOT=Path(__file__).resolve().parents[1];OUT=Path(os.environ.get('AQUARIUM_TWEEZERS_RESULTS','/tmp/aquarium-final-tweezers'));OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/');BEFORE=os.environ.get('AQUARIUM_BEFORE')=='1';r={'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'baseline_runtime':'ffc061279f01f0030fe35503def0d1b329e5f73b' if BEFORE else None,'captures':[],'checks':[],'errors':[]}
def snap(p):return p.evaluate('window.aquariumLearningSnapshot()')
def info(p):return p.evaluate('window.aquariumAquascapingSnapshot()')
def save():(OUT/'report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2))
def shot(p,name):
 p.screenshot(path=str(OUT/(name+'.png')));r['captures'].append({'name':name,'url':p.url,'at':datetime.now(timezone.utc).isoformat(),'viewport':p.viewport_size,'tool':info(p),'message':p.locator('#aquascape-message').inner_text(),'text':p.locator('#learning-root').inner_text()});save()
def click(p,a):p.locator('[data-class='+a+']:visible').first.click()
def enable(p):
 click(p,'care');click(p,'tweezers');assert snap(p)['tweezers']
def position(p,uid):return {k:next(e for e in snap(p)['session']['tank']['entities'] if e['uid']==uid)[k] for k in ['x','z']}
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']);r['browser']=b.version
 try:
  for label,w,h in [('desktop',1366,960),('portrait',768,1024),('landscape',1366,1024)]:
   ctx=b.new_context(viewport={'width':w,'height':h},has_touch=True,accept_downloads=True);ctx.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))");p=ctx.new_page();p.on('pageerror',lambda e:r['errors'].append(str(e)));p.goto(URL+'?research=8');p.wait_for_function('window.aquariumLearningSnapshot()?.presentation?.glass');p.wait_for_timeout(1000)
   click(p,'measurements');expect(p.locator('.single-dialog')).to_contain_text('so viel wie' if not BEFORE else 'gleich viel als');p.screenshot(path=str(OUT/(label+'-equal.png')));p.keyboard.press('Escape');enable(p);shot(p,label+'-instructions')
   if not BEFORE:
    visibility=p.locator('#aquascape-instructions').evaluate('e=>{const r=e.getBoundingClientRect();return {inside:r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth,front:e.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))}}');assert visibility['inside'] and visibility['front'],visibility
   for kind in ['mouse','touch']:
    cd=ctx.new_cdp_session(p) if kind=='touch' else None
    def gesture(event,x=None,y=None):
     if kind=='touch':cd.send('Input.dispatchTouchEvent',{'type':{'down':'touchStart','move':'touchMove','up':'touchEnd','cancel':'touchCancel'}[event],'touchPoints':[] if event in ['up','cancel'] else [{'x':x,'y':y}]})
     elif event=='down':p.mouse.move(x,y);p.mouse.down()
     elif event=='move':p.mouse.move(x,y,steps=5)
     elif event=='up':p.mouse.up()
     else:p.keyboard.press('Escape');p.mouse.up()
    targets=[t for t in info(p)['targets'] if t['species'] in ['anubias','waterweed','javamoss'] and t['screen']]
    moved=None
    for target in targets:
     x,y=target['screen']['x'],target['screen']['y'];gesture('down',x,y)
     if info(p)['phase']!='dragging':gesture('up');continue
     uid=info(p)['selected'];old=position(p,uid);camera=info(p)['camera']
     for dx,dy in [(50,10),(-50,10),(100,-10),(-100,-10),(30,30),(-30,30)]:
      gesture('move',x+dx,y+dy);p.wait_for_timeout(100);status=info(p)
      if not status['blocked'] and status['preview'] and math.dist([status['preview']['x'],status['preview']['z']],[old['x'],old['z']])>.03:
       moved=(uid,old,status['preview']);shot(p,f'{label}-{kind}-free-preview');break
     gesture('up')
     if moved:break
    assert moved,f'No actual legal move in {label}/{kind}';uid,old,new=moved;assert position(p,uid)==new;assert info(p)['camera']==camera;shot(p,f'{label}-{kind}-free-saved');r['checks'].append({'name':label+' '+kind+' actual free drag','uid':uid,'before':old,'after':new})
    # Aim at real occupied objects; use their actual screen coordinates, never alter the state.
    current=next(t for t in info(p)['targets'] if t['uid']==uid);gesture('down',current['screen']['x'],current['screen']['y']);assert info(p)['phase']=='dragging';blocked=False
    others=[t for t in info(p)['targets'] if t['uid']!=uid and t['species'] in ['anubias','waterweed','javamoss','stone','spiderwood'] and t['screen']]
    for other in others:
     for dy in [0,20,40,60]:
      x,y=other['screen']['x'],other['screen']['y']+dy
      if not (5<x<w-5 and 100<y<h-120):continue
      gesture('move',x,y);p.wait_for_timeout(60)
      if info(p)['blocked']:blocked=True;break
     if blocked:break
    assert blocked,f'Actual collision not reached in {label}/{kind}';last=info(p)['preview'];shot(p,f'{label}-{kind}-collision-preview');gesture('up');assert position(p,uid)==last;shot(p,f'{label}-{kind}-collision-release');r['checks'].append({'name':label+' '+kind+' rejected collision','stored_last_valid':last,'message':p.locator('#aquascape-message').inner_text()})
    # Cancellation must restore the original of this new gesture, not the prior preview.
    current=next(t for t in info(p)['targets'] if t['uid']==uid);old=position(p,uid);gesture('down',current['screen']['x'],current['screen']['y']);assert info(p)['phase']=='dragging';gesture('move',current['screen']['x']+40,current['screen']['y']+5);gesture('cancel');assert position(p,uid)==old;shot(p,f'{label}-{kind}-cancel');
    if kind=='mouse':enable(p)
    if cd:cd.detach()
   p.keyboard.press('Escape');assert not snap(p)['tweezers'];before=snap(p)['session'];click(p,'menu')
   with p.expect_download() as d:click(p,'export')
   f=OUT/(label+'-own-save.json');d.value.save_as(str(f));p.reload();p.wait_for_selector('[data-class-stage=free]');assert snap(p)['session']==before;click(p,'menu');p.locator('[data-class-file]').set_input_files(str(f));p.wait_for_function('window.aquariumLearningSnapshot().dialog===null');assert snap(p)['session']['tank']==before['tank'];shot(p,label+'-restored');r['checks'].append({'name':label+' reload/export/import retains actual positions'});save();ctx.close()
  assert not r['errors'],r['errors'];r['status']='passed'
 except Exception as e:
  r.update(status='failed',failure=str(e))
  try:shot(p,'failure')
  except:pass
  raise
 finally:save();b.close()
