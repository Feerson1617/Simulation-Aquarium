"""K01: real M4 keyboard navigation, archived selections, and focus-only edge cases.

The extra controls are a labelled DOM fixture inside an existing dialog; no game
or archive state is injected. Baseline mode records the original escape to BODY.
"""
import os,json,subprocess,hashlib
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium')
BEFORE=os.environ.get('AQUARIUM_BEFORE')=='1'
OFFLINE=os.environ.get('AQUARIUM_BACKUP')=='1'
OUT=Path(os.environ.get('AQUARIUM_FOCUS_RESULTS','/tmp/aquarium-final-focus'))/('before' if BEFORE else 'after')/ENGINE
OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
r={'engine':ENGINE,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'sourceSHA256':hashlib.sha256(subprocess.check_output(['git','show','00b9f787:single-classroom-ui.mjs'],cwd=ROOT) if BEFORE else (ROOT/'single-classroom-ui.mjs').read_bytes()).hexdigest(),'before':BEFORE,'actions':[],'checks':[],'errors':[],'consoleErrors':[],'failedRequests':[]}
def active(p):return p.evaluate("()=>{const e=document.activeElement;return {tag:e.tagName,key:e.dataset.parentTrial!==undefined?'trial':e.dataset.parentGeneration!==undefined?'generation':e.dataset.focusFixture||e.dataset.class||null,inDialog:!!e.closest('.single-dialog')}}")
def press(p,key):
 p.keyboard.press(key);a=active(p);r['actions'].append({'key':key,'active':a,'at':datetime.now(timezone.utc).isoformat()});return a
def shot(p,name):
 p.screenshot(path=str(OUT/(name+'.png')));r.setdefault('captures',[]).append({'name':name,'url':p.url,'viewport':p.viewport_size,'at':datetime.now(timezone.utc).isoformat(),'active':active(p)})
def tap(p,selector):p.locator(selector).filter(visible=True).first.click();r['actions'].append({'click':selector});print('CLICK',selector,flush=True)
with sync_playwright() as pw:
 opts={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
 b=getattr(pw,ENGINE).launch(**opts);r['version']=b.version
 ctx=b.new_context(viewport={'width':1366,'height':960},has_touch=True,accept_downloads=True,ignore_https_errors=True)
 ctx.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
 page=ctx.new_page();page.set_default_timeout(60000)
 page.on('pageerror',lambda e:r['errors'].append(str(e)));page.on('console',lambda m:r['consoleErrors'].append(m.text) if m.type=='error' else None);page.on('requestfailed',lambda q:r['failedRequests'].append(q.url))
 class Scene:
  def __getattr__(self,name):
   frame=next(x for x in page.frames if x.parent_frame==page.main_frame)
   return getattr(page if name in ['keyboard','screenshot','url','viewport_size'] else frame,name)
 p=page
 try:
  page.goto(URL+'?mission=m4-dominance-frequency',timeout=240000)
  if OFFLINE:
   page.frame_locator('#aquarium-view').locator('[data-class-choice=unsure]').wait_for(timeout=180000);p=Scene()
   ctx.route('http://**',lambda route:route.abort('internetdisconnected'));ctx.route('https://**',lambda route:route.abort('internetdisconnected'))
   r['offline']='All HTTP(S) blocked after initial load';assert len(page.frames)==2
  tap(p,'[data-class-choice=unsure]')
  for trial in range(3):
   for generation in range(3):tap(p,'[data-class=generation]')
   if trial<2:tap(p,'[data-class=reset-trial]')
  original=p.evaluate('aquariumLearningSnapshot().session')
  p.locator('[data-class=parents]').press('Enter');r['actions'].append({'key':'Enter','on':'parents opener'})
  assert active(p)['tag']=='H2';shot(p,'archive-open')
  actual=[press(p,'Tab') for _ in range(4)]
  r['initialCycle']=actual;shot(p,'tab-cycle')
  if BEFORE:
   assert [a['key'] for a in actual]!=['close','trial','generation','close'];r['checks'].append('Original Tab cycle does not include both selects')
   p.locator('[data-parent-generation]').focus();escaped=press(p,'Tab');assert not escaped['inDialog'];shot(p,'select-tab-escaped')
   r['status']='confirmed original K01';r['checks'].append('Tab from actual generation select escaped the parent dialog')
  else:
   assert [a['key'] for a in actual]==['close','trial','generation','close'],actual
   assert press(p,'Shift+Tab')['key']=='generation'
   assert press(p,'Shift+Tab')['key']=='trial'
   # Real keyboard selections; rerender must keep focus on the changed select.
   for selector,key in [('[data-parent-trial]','trial'),('[data-parent-generation]','generation')]:
    p.locator(selector).focus();old=p.locator(selector).input_value();press(p,'ArrowUp')
    assert p.locator(selector).input_value()!=old,(selector,old)
    assert active(p)['key']==key,active(p)
   assert p.locator('[data-parent-trial]').input_value()=='1'
   assert p.locator('[data-parent-generation]').input_value()=='2'
   # Table is from the selected historical parents, never today's aquarium.
   event=original['trials'][1]['eventContexts'][1]
   assert sum(int(x) for x in p.locator('[data-parent-uid] td:last-child').all_text_contents())==sum(event['offspring'].values())
   shot(p,'keyboard-selected-archive');assert press(p,'Escape')['key']=='parents'
   assert p.locator('.single-dialog').count()==0
   assert p.evaluate('aquariumLearningSnapshot().session')==original
   r['checks'].append('Tab/Shift+Tab cycle; keyboard trial/generation changes retain focus; Escape restores actual opener; all session/archive data unchanged')
   tap(p,'[data-class=parents]')
   # Synthetic DOM-only regression for hidden, disabled, inert and tab-index
   # controls. These are not reported as ordinary pupil actions.
   p.locator('.single-dialog').evaluate('''e=>e.insertAdjacentHTML('beforeend',`<div data-focus-fixture-root>
    <input data-focus-fixture="input" aria-label="Test input">
    <textarea data-focus-fixture="text" aria-label="Test text"></textarea>
    <input hidden type="file" data-focus-fixture="hidden-file">
    <input disabled data-focus-fixture="disabled">
    <fieldset disabled><input data-focus-fixture="fieldset-disabled"></fieldset>
    <div inert><button data-focus-fixture="inert">inert</button></div>
    <button tabindex="-1" data-focus-fixture="negative">negative</button>
    <button style="visibility:hidden" data-focus-fixture="invisible">hidden</button>
    <a data-focus-fixture="no-href">not a link</a>
    <button tabindex="2" data-focus-fixture="positive2">two</button>
    <button tabindex="1" data-focus-fixture="positive1">one</button>
    <div tabindex="0" data-focus-fixture="custom">custom</div>
   </div>`)''')
   p.locator('[data-focus-fixture=custom]').focus()
   expected=['positive1','positive2','close','trial','generation','input','text','custom','positive1']
   observed=[press(p,'Tab')['key'] for _ in expected];assert observed==expected,observed
   reverse=[press(p,'Shift+Tab')['key'] for _ in range(8)]
   assert reverse==['custom','text','input','generation','trial','close','positive2','positive1'],reverse
   p.locator('[data-focus-fixture-root]').evaluate('e=>e.remove()');press(p,'Escape')
   r['checks'].append('DOM-only fixture: input/textarea/custom and positive tab order; hidden file/disabled fieldset/inert/negative tabindex/invisible/non-link excluded in both directions')
   for dialog in ['help','menu']:
    tap(p,f'[data-class={dialog}]');p.locator('[data-class=close]').press('Shift+Tab');assert active(p)['inDialog']
    assert press(p,'Tab')['key']=='close';assert press(p,'Escape')['key']==dialog
   r['checks'].append('Existing help and menu dialogs retain wrapping and opener restoration')
   assert not r['errors'] and not r['consoleErrors'] and not r['failedRequests'];r['status']='passed'
 except Exception as e:
  r.update(status='failed',failure=str(e))
  try:shot(p,'failure')
  except Exception:pass
  raise
 finally:
  (OUT/'report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');b.close();print(r.get('status'),OUT,flush=True)
