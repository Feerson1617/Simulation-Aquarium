"""F01–F03: actual visible learner inputs, raw evidence and projected glass bounds.
Read-only diagnostics locate real rendered objects; no mission state is written.
Touch means Playwright touchscreen input on Linux, never physical iPad hardware.
"""
import os,json,hashlib,subprocess
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1]
ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium')
OUT=Path(os.environ.get('AQUARIUM_CORRECTION_RESULTS','/tmp/aquarium-correction-gate'))/ENGINE;OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
IDS=os.environ.get('AQUARIUM_CORRECTION_IDS','m1,m2,m3,m4,m5,m6').split(',')
MISSIONS={'m1':'m1-light-oxygen','m2':'m2-food-transformation','m3':'m3-hidden-inheritance','m4':'m4-dominance-frequency','m5':'m5-recurring-input','m6':'m6-plant-carbon'}
R={'engine':ENGINE,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'sources':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in ROOT.iterdir() if p.suffix in ['.html','.mjs','.css']},'hardware':'Linux software GPU; Playwright touchscreen and mouse, not physical iPad','actions':[],'captures':[],'checks':[],'errors':[],'requests_failed':[]}
def save(): (OUT/'report.json').write_text(json.dumps(R,ensure_ascii=False,indent=2)+'\n')
def snapshot(p):return p.evaluate('window.aquariumLearningSnapshot()')
def act(p,sel,touch=True):
 x=p.locator(sel).filter(visible=True).first
 label=x.inner_text();x.tap() if touch else x.click()
 R['actions'].append({'at':datetime.now(timezone.utc).isoformat(),'selector':sel,'label':label,'input':'touchscreen tap' if touch else 'mouse click'})
def c(p,a):act(p,'[data-class='+a+']')
def m(p,a):act(p,'[data-single='+a+']')
def choice(p,a):act(p,'[data-class-choice='+a+']')
def shot(p,name):
 p.screenshot(path=str(OUT/(name+'.png')));s=snapshot(p)
 R['captures'].append({'name':name,'at':datetime.now(timezone.utc).isoformat(),'url':p.url,'viewport':p.viewport_size,'text':p.locator('#learning-root').inner_text(),'stage':s['session']['stage'],'presentation':s['presentation'],'values':p.locator('[data-amount-value]').evaluate_all('(els)=>els.map(e=>({value:Number(e.dataset.amountValue),index:Number(e.dataset.amountIndex),text:e.innerText}))')});save();print('CAPTURE',name,flush=True)
def check(p,name):
 s=snapshot(p);assert s['renderer']['sameState'];assert s['context']['stateId']==s['renderer']['mainStateId'];assert p.locator('canvas').count()==1
 assert not p.locator('[data-tank-viewport]').count();assert not p.evaluate('document.documentElement.scrollWidth>innerWidth')
 assert not p.locator('.single-shade').count()
 for figure in p.locator('[data-amount-reference]').all():
  reference=float(figure.get_attribute('data-amount-reference'))
  for row in figure.locator('[data-amount-value]').all():assert abs(float(row.get_attribute('data-amount-index'))-float(row.get_attribute('data-amount-value'))/reference*100)<1e-8
 R['checks'].append(name);save()
def no_leak(p,mission):
 body=p.locator('.single-task').inner_text();raw=p.locator('.single-meter').inner_text() if p.locator('.single-meter').count() else ''
 if mission in ['m2','m6']:assert 'Nach drei Tagen:' not in body and 'als am Anfang' not in raw
 if mission=='m1':assert p.locator('.single-chart polyline').count()==2 and not p.locator('.single-results').count()
 if mission=='m3':assert 'Zweimal a ergibt hell' not in body and 'A bewirkt hier dunkel' not in body
 R['checks'].append(mission+': raw evidence separated from offered interpretation')
def reload_exact(p,is_m1=False):
 before=snapshot(p)['session'];p.reload()
 if is_m1:m(p,'start')
 p.wait_for_selector('[data-single-stage]' if is_m1 else '[data-class-stage]')
 assert snapshot(p)['session']==before and not snapshot(p)['running']
def direct(p,uid,touch=True):
 pt=p.evaluate('uid=>{const x=window.aquariumLearningSnapshot().presentation.objects.find(o=>o.uid===uid);return {x:x.bounds.x,y:x.bounds.y}}',uid)
 p.touchscreen.tap(pt['x'],pt['y']) if touch else p.mouse.click(pt['x'],pt['y'])
 R['actions'].append({'input':'direct canvas touchscreen tap' if touch else 'direct canvas mouse click','uid':uid,'point':pt,'at':datetime.now(timezone.utc).isoformat()})
 assert snapshot(p)['session']['selection']==uid,(uid,snapshot(p)['session']['selection'])
 p.wait_for_function('uid=>document.querySelector(".aquarium-selection:not([hidden])")?.dataset.selectedUid===String(uid)',arg=uid)
 assert snapshot(p)['presentation']['markerVisible']
def resize(p,w,h):
 p.set_viewport_size({'width':w,'height':h})
 p.wait_for_function('''()=>{const v=window.aquariumLearningSnapshot()?.presentation,g=v?.glass;return g&&Math.abs(g.left-(innerWidth<=820?20:448))<2&&g.right<=innerWidth+1}''',polling=300)
def frame_cases(p,id):
 for profile,w,h in [('portrait',768,1024),('desktop',1366,960),('landscape',1366,1024)]:
  resize(p,w,h)
  shot(p,id+'-'+profile+'-start');v=snapshot(p)['presentation'];g=v['glass'];assert g['left']>=-1 and g['right']<=w+1
  assert g['width']>=(w*.90 if profile=='portrait' else 850),g
  assert g['width']*g['height']/w/h>(.18 if id=='m3' else .25)
 resize(p,768,1024)
def observe(p,label):
 c(p,'play');p.locator('[data-class=toggle]').press('Enter');R['actions'].append({'input':'keyboard Enter','selector':'[data-class=toggle]'})
 assert not snapshot(p)['running'];c(p,'help');held=snapshot(p)['session'];p.wait_for_timeout(750);assert snapshot(p)['session']==held;c(p,'close');reload_exact(p)
 c(p,'toggle');p.wait_for_function('document.querySelector("[data-class-stage]").dataset.classStage!=="observing"',timeout=150000,polling=500);assert snapshot(p)['session']['stage']!='failed';check(p,label);shot(p,label)
def wrong_help(p,wrong,right,label):
 choice(p,wrong);expect(p.locator('.single-feedback')).to_have_attribute('data-kind','error');shot(p,label+'-wrong');c(p,'help');c(p,'more-help');shot(p,label+'-help');c(p,'close');choice(p,right)
def parents(p):
 s=snapshot(p)['session'];fish=[e for e in s['tank']['entities'] if e['species']=='molly'];f=next(e for e in fish if e['sex']=='♀' and (s['stage']!='founders' or e['genotype']=='AA'));m=next(e for e in fish if e['sex']=='♂' and (s['stage']!='founders' or e['genotype']=='aa'))
 for e in [f,m]:act(p,f'[data-class=select][data-class-uid="{e["uid"]}"]')
def roundtrip(p,id):
 is_m1=id=='m1';prefix='single' if is_m1 else 'class'
 assert snapshot(p)['session']['stage']=='complete';shot(p,id+'-complete')
 with p.expect_download() as d:act(p,f'[data-{prefix}=export]')
 path=OUT/(id+'-result.json');d.value.save_as(str(path));raw=json.loads(path.read_text());assert raw['currentContext']==snapshot(p)['context']
 reload_exact(p,is_m1);attempt=snapshot(p)['session']['attemptId'];act(p,f'[data-{prefix}=repeat]');assert snapshot(p)['session']['attemptId']!=attempt
 act(p,f'[data-{prefix}=menu]');p.locator(f'[data-{prefix}-file]').set_input_files(str(path));R['actions'].append({'input':'file chooser','file':path.name});p.wait_for_selector(f'[data-{prefix}-stage=complete]');assert snapshot(p)['session']['attemptId']==attempt
 assert p.evaluate('localStorage.getItem("aquarium-learning-sentinel")')=='unchanged';R['checks'].append(id+': completion, pause, help, correction, reload, new attempt, own file roundtrip, legacy preservation');save()
def run_m1(p):
 frame_cases(p,'m1');s=snapshot(p)['session'];plants=[e['uid'] for e in s['tank']['entities'] if e['species'] in ['anubias','waterweed']]
 for uid in plants[:2]:direct(p,uid)
 shot(p,'m1-direct-selection');p.mouse.move(550,420);p.mouse.down();p.mouse.move(590,450,steps=8);p.mouse.up();R['actions'].append({'input':'mouse camera drag','from':[550,420],'to':[590,450]});m(p,'frame');direct(p,plants[0],False)
 act(p,'[data-single=prediction][data-choice="2"]');m(p,'play');p.locator('[data-single=pause]').press('Enter');assert not snapshot(p)['running'];m(p,'help');held=snapshot(p)['session'];p.wait_for_timeout(750);assert snapshot(p)['session']==held;m(p,'close');reload_exact(p,True);m(p,'play');p.wait_for_selector('[data-single-stage=light-finished]',timeout=150000)
 s=snapshot(p)['session'];first=json.dumps(s['runs'][0],sort_keys=True);baseline=s['baseline'];m(p,'reset');assert snapshot(p)['session']['tank']==baseline;m(p,'darken');m(p,'play');p.wait_for_selector('[data-single-stage=compare]',timeout=150000)
 assert json.dumps(snapshot(p)['session']['runs'][0],sort_keys=True)==first;check(p,'m1 reset and immutable first run');no_leak(p,'m1');shot(p,'m1-compare')
 act(p,'[data-single-choice=reversed-dark]');expect(p.locator('.single-feedback')).to_have_attribute('data-kind','error');m(p,'help');shot(p,'m1-help');m(p,'close');act(p,'[data-single-choice=observed]');shot(p,'m1-explain');act(p,'[data-single-choice=processes]');roundtrip(p,'m1')
def run(p,id):
 if id=='m1':run_m1(p);return
 if id=='m3':frame_cases(p,id)
 else:choice(p,'unsure')
 if id=='m2':
  shot(p,'m2-before-feeding');initial=snapshot(p)['session']['tank']['detritus'];c(p,'feed');assert abs(snapshot(p)['session']['tank']['detritus']-initial-.12)<1e-10;shot(p,'m2-after-feeding');observe(p,'m2-observation');no_leak(p,id);wrong_help(p,'opposite','observed','m2')
  c(p,'filter');assert not p.locator('.single-dialog').count();shot(p,'m2-process-question');choice(p,'decomposer');shot(p,'m2-plant-question');choice(p,'nutrients');shot(p,'m2-net-vs-flow');c(p,'process');shot(p,'m2-requested-explanation');c(p,'close');choice(p,'separate')
 elif id=='m3':
  dark=next(e['uid'] for e in snapshot(p)['session']['tank']['entities'] if e['species']=='molly' and e['variant']=='black');direct(p,dark);shot(p,'m3-dark-selected');parents(p);c(p,'generation');shot(p,'m3-f1-observation');wrong_help(p,'lost','dark','m3');parents(p);c(p,'generation');shot(p,'m3-f2');s=snapshot(p)['session'];fish=[e for e in s['tank']['entities'] if e['species']=='molly'];child=next((e for e in fish if e['variant']=='gold'),fish[0]);act(p,f'[data-class-uid="{child["uid"]}"]');no_leak(p,id);shot(p,'m3-inheritance');choice(p,'actual-alleles');shot(p,'m3-transfer');choice(p,'possible')
 elif id=='m4':
  baseline=snapshot(p)['session']['baseline']
  for trial in range(3):
   for g in range(3):c(p,'generation')
   if trial<2:c(p,'reset-trial');assert snapshot(p)['session']['tank']==baseline
  c(p,'compare-trials');shot(p,'m4-comparison');wrong_help(p,'guarantee','actual-counts','m4');shot(p,'m4-selection-question');choice(p,'weighted-parents');shot(p,'m4-dominance-question');choice(p,'not-guaranteed')
 elif id=='m5':
  baseline=snapshot(p)['session']['baseline'];choice(p,'water');shot(p,'m5-water-immediate');observe(p,'m5-water-end');first=json.dumps(snapshot(p)['session']['runs'][0],sort_keys=True);c(p,'reset-measure');assert snapshot(p)['session']['tank']==baseline;choice(p,'feed');observe(p,'m5-comparison');assert json.dumps(snapshot(p)['session']['runs'][0],sort_keys=True)==first;wrong_help(p,'swap','actual-late','m5');shot(p,'m5-explanation-question');choice(p,'source')
 else:
  c(p,'plant');uid=snapshot(p)['session']['selection'];shot(p,'m6-selected');observe(p,'m6-observation');assert snapshot(p)['session']['selection']==uid;no_leak(p,id);wrong_help(p,'opposite','observed','m6');shot(p,'m6-carbon-source-question');c(p,'process');shot(p,'m6-requested-explanation');c(p,'close');choice(p,'water-carbon');shot(p,'m6-carbon-return-question');choice(p,'respiration');shot(p,'m6-evidence-question');choice(p,'explanation')
 roundtrip(p,id)
with sync_playwright() as pw:
 launch={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
 b=getattr(pw,ENGINE).launch(**launch);R['version']=b.version
 try:
  for id in IDS:
   ctx=b.new_context(viewport={'width':768,'height':1024},has_touch=True,is_mobile=True,device_scale_factor=1,accept_downloads=True)
   ctx.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}));localStorage.setItem('aquarium-learning-sentinel','unchanged');")
   p=ctx.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:R['errors'].append(str(e)));p.on('requestfailed',lambda q:R['requests_failed'].append(q.url));p.goto(URL+('' if id=='m1' else '?mission='+MISSIONS[id]))
   if id=='m1':m(p,'start')
   p.wait_for_function('window.aquariumLearningSnapshot()?.presentation?.glass');p.wait_for_timeout(700);run(p,id);ctx.close();print('PASS',id,flush=True)
  assert not R['errors'],R['errors'];assert not R['requests_failed'],R['requests_failed'];R['status']='passed'
 except Exception as e:
  R.update(status='failed',failure=str(e))
  try:shot(p,'failure')
  except Exception:pass
  raise
 finally:save();b.close()
