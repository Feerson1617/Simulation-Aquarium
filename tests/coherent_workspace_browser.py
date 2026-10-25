"""Temperature sight-gate and shared-context checks, through visible learner controls.

No quest writes. Read-only probes confirm the identity behind the actual pictures.
Run with AQUARIUM_BROWSER=webkit and AQUARIUM_WEBKIT=<portable launcher> if needed.
"""
import hashlib,json,os,shutil,subprocess,time,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
from biology_browser_helpers import reveal,activities,biological_experiment,comparison_answer

ROOT=Path(__file__).resolve().parents[1]
ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium')
OUT=Path(os.environ.get('AQUARIUM_COHERENT_RESULTS','/tmp/aquarium-coherent'))/ENGINE
OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
sources={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in ROOT.iterdir() if p.suffix in ['.mjs','.css','.html']}
report={'engine':ENGINE,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),
 'sources':sources,'checks':[],'errors':[],'requests':[],'screenshots':[],'hardware':'Linux browser; no physical iPad'}
resume=os.environ.get('AQUARIUM_CONTEXT_RESUME')
if resume:
 prior_path=Path(resume);prior=json.loads(prior_path.read_text())
 assert prior['engine']==ENGINE and prior['status']=='failed' and not prior['errors'] and not prior['requests']
 assert prior['sources']==sources,'Resume is permitted only with byte-identical application sources'
 assert len(prior['checks']) in [7,13] and 'data-activity-view' in prior['failure'],'Only the known outdated end-observation test flow may resume'
 assert prior['checks'][-1]['name']=='AT05 actual UI/core: zero water cannot fulfil 10-restore'
 shutil.copyfile(prior_path,OUT/'report-before-resume.json')
 for name in [*prior['screenshots'],'selected.json','selected.csv']:
  shutil.copyfile(prior_path.parent/name,OUT/name)
 report.update(checks=prior['checks'],screenshots=prior['screenshots'],profiles=prior['profiles'],resumed_from={'file':str(prior_path),'sha256':hashlib.sha256(prior_path.read_bytes()).hexdigest(),'failure':prior['failure'],'commit':prior['commit'],'scope':'All view/profile and older-series checks retained. Remaining restoration/Mendel checks run in fresh contexts; no quest writes.'})
def snap(p):return p.evaluate('window.aquariumLearningSnapshot()')
def act(p,name):p.locator(f'[data-learn="{name}"]:visible').first.click()
def choose(p,i):p.locator(f'[data-quest-answer="{i}"]:visible').first.click()
def shot(p,name):
 p.wait_for_function('s=>window.aquariumLearningSnapshot().prototype.render.frames>s',arg=snap(p)['prototype']['render']['frames'])
 p.screenshot(path=str(OUT/name),animations='disabled');report['screenshots'].append(name)
def passed(name,**data):
 entry={'name':name,**data}
 if resume and any(c['name']==name for c in report['checks']):report.setdefault('rechecked',[]).append(entry)
 else:report['checks'].append(entry)
 print('PASS',name,flush=True)
def start(p,grade=8,mission='8-ecosystem'):
 p.locator(f'[data-learn-grade="{grade}"]').click();act(p,'missions');p.locator(f'[data-learn-mission="{mission}"]').click()
def time_field(p):return p.locator('[data-coherent-time]:visible').first
def read(p):return [p.locator(f'[data-water-reading="{s}"]').inner_text().replace('\n',' ') for s in ['control','test']]
def consistent(p):
 s=snap(p);v=s['view'];assert v
 for side in ['control','test']:
  tile=p.locator(f'[data-view-side="{side}"]');assert float(tile.get_attribute('data-view-time'))==v['time']
  assert tile.get_attribute('data-state-id')==v['stateIds'][side]
  rendered=next(r for r in s['prototype']['render']['sides'] if r['side']==side)
  assert rendered['stateId']==v['stateIds'][side];assert rendered['day']==v['time']
 for chart in p.locator('.learn-chart').all():assert float(chart.get_attribute('data-view-time'))==v['time']
 assert p.locator(f'tr[data-table-time="{v["time"]}"][aria-current="true"]').count()==1
 return s
def heater(p,value):
 act(p,'device-temperature');field=reveal(p.locator('[data-equipment-value]'));field.fill(str(value));p.locator('[data-equipment-save]').click()
def setup_context(b,viewport,touch=False):
 c=b.new_context(viewport=viewport,has_touch=touch,is_mobile=touch,accept_downloads=True)
 c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
 p=c.new_page();p.set_default_timeout(90000)
 p.on('pageerror',lambda e:report['errors'].append(str(e)));p.on('requestfailed',lambda r:report['requests'].append(r.url))
 p.goto(URL);p.wait_for_function('!!window.aquariumLearningSnapshot');return c,p

with sync_playwright() as pw:
 launch={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {}
 if ENGINE=='webkit' and os.environ.get('AQUARIUM_WEBKIT'):launch['executable_path']=os.environ['AQUARIUM_WEBKIT']
 b=getattr(pw,ENGINE).launch(**launch)
 try:
  profiles=[('desktop',{'width':1366,'height':960},False),('portrait',{'width':768,'height':1024},True),('landscape',{'width':1366,'height':1024},True)]
  selected_profiles=os.environ.get('AQUARIUM_CONTEXT_PROFILES','desktop,portrait,landscape').split(',')
  if resume:profiles=[]
  else:report['profiles']=selected_profiles
  for label,viewport,touch in profiles:
   if label not in selected_profiles:continue
   c,p=setup_context(b,viewport,touch);started=time.monotonic();start(p)
   p.wait_for_function('window.aquariumLearningSnapshot().prototype.render.sides.every(s=>s.detailModels===s.objects)&&window.aquariumLearningSnapshot().prototype.render.frames>2')
   assert read(p)==['25,0 °C','25,0 °C'];s=snap(p);assert s['prototype']['render']['contexts']==1
   assert len(s['prototype']['render']['sides'])==2
   assert all(len(r['ids'])==19 for r in s['prototype']['render']['sides'])
   assert not p.evaluate('document.documentElement.scrollWidth>innerWidth')
   if label!='landscape':shot(p,f'{label}-1-start.png')
   passed(label+': two actual initial tank scenes before prediction',ready_seconds=round(time.monotonic()-started,2),water=read(p),ids=s['prototype']['render']['sides'][0]['ids'])
   p.locator('[data-activity-choice="0"]:visible').click();assert snap(p)['quest']['step']==0
   assert not snap(p)['quest']['activities'];assert snap(p)['quest']['feedbackKind']=='neutral'
   pick=p.locator('[data-coherent-pick="control"]');pick.tap() if touch else pick.click()
   selected=snap(p)['prototype']['selection'];assert selected['uid'] in s['prototype']['render']['sides'][0]['ids']
   p.locator('[data-activity-id="living"][data-activity-choice="1"]').click();assert not snap(p)['quest']['activities']
   assert snap(p)['quest']['feedbackKind']=='error'
   p.locator('[data-activity-id="living"][data-activity-choice="0"]').click()
   p.locator('[data-coherent-water="test"]').click();p.locator('[data-activity-id="water"][data-activity-choice="1"]').click()
   choose(p,1);assert snap(p)['quest']['step']==0;choose(p,0);assert snap(p)['quest']['step']==1
   assert read(p)==['25,0 °C','25,0 °C']
   choose(p,1);assert snap(p)['quest']['step']==2;assert snap(p)['quest']['feedbackKind']=='neutral'
   act(p,'device-temperature');dial=p.locator('.device-dial');expect(dial).to_be_visible()
   for _ in range(4):dial.press('ArrowUp')
   field=reveal(p.locator('[data-equipment-value]'));assert float(field.input_value().replace(',','.'))==27
   field.fill('');p.locator('[data-equipment-save]').click();expect(p.locator('[data-control-error]:visible')).not_to_be_empty()
   assert read(p)==['25,0 °C','25,0 °C'];assert p.locator('.coherent-views').is_visible()
   field.fill('27,0')
   if label!='landscape':shot(p,f'{label}-2-device-focus.png')
   p.locator('[data-equipment-save]').click();assert snap(p)['study']['value']==27
   assert p.locator('[data-view-side="control"] header').inner_text().endswith('25,0 °C')
   assert p.locator('[data-view-side="test"] header').inner_text().endswith('27,0 °C')
   assert read(p)==['25,0 °C','25,0 °C'];assert p.evaluate('document.activeElement.dataset.learn')=='device-temperature'
   if label!='landscape':shot(p,f'{label}-2-heater.png')
   passed(label+': actual fish/water choices, wrong answers, neutral prediction, accessible heater with invalid/comma input')
   act(p,'compare');assert snap(p)['quest']['step']==2
   time_field(p).select_option('45.5');assert snap(p)['quest']['step']==2;s=consistent(p)
   assert s['view']['time']==45.5;assert s['prototype']['mode']=='result'
   if label!='landscape':shot(p,f'{label}-3-course.png')
   act(p,'workspace-play');p.wait_for_function('window.aquariumLearningSnapshot().quest.step===3')
   s=consistent(p);assert s['view']['time']==48;assert s['quest']['result']['control']==25
   assert 25<s['quest']['result']['test']<27;assert read(p)==['25,0 °C','25,9 °C']
   if label!='landscape':shot(p,f'{label}-4-result.png')
   old=s['comparison'];v=s['view'];p.reload();p.wait_for_function('!!window.aquariumLearningSnapshot');start(p)
   assert snap(p)['comparison']==old;assert snap(p)['view']==v;consistent(p)
   choose(p,0);assert snap(p)['quest']['step']==3;assert snap(p)['quest']['feedbackKind']=='error'
   choose(p,1);assert snap(p)['quest']['step']==4;choose(p,1);assert snap(p)['quest']['step']==4;choose(p,0);assert snap(p)['quest']['step']==5
   passed(label+': real time course, synchronized scene/cards/chart/table, persisted result and completed temperature mission',result=s['quest']['result'])
   if label=='desktop':
    baseline=p.evaluate('localStorage.getItem("aquarium-learning-tank-v1:8:8-ecosystem")')
    act(p,'workspace-plan');heater(p,26)
    # A second series with a different heater setting/duration, both with two repetitions.
    reveal(p.locator('[data-learning-days]')).fill('4');act(p,'compare');time_field(p).select_option('49')
    reveal(p.locator('[data-learning-series]')).select_option('0');reveal(p.locator('[data-learning-run]')).select_option('1')
    time_field(p).select_option('45.25');s=consistent(p);assert s['view']['repetition']==2
    assert s['view']['investigationId']==old['id'];assert s['comparison']['id']!=old['id']
    details=p.locator('.coherent-data');details.locator('summary').first.click() if details.get_attribute('open') is None else None
    act(p,'show-control');assert snap(p)['view']['side']=='control';act(p,'show-test');assert snap(p)['view']['side']=='test'
    assert p.evaluate('localStorage.getItem("aquarium-learning-tank-v1:8:8-ecosystem")')==baseline
    with p.expect_download() as d:act(p,'csv')
    d.value.save_as(str(OUT/'selected.csv'));csv=(OUT/'selected.csv').read_text();assert old['id'] in csv and '45.25' in csv
    with p.expect_download() as d:act(p,'export')
    d.value.save_as(str(OUT/'selected.json'));product=json.loads((OUT/'selected.json').read_text())
    assert product['viewContext']['series']==0 and product['viewContext']['repetition']==2 and product['viewContext']['time']==45.25
    imported=p.evaluate('async data=>(await import("./learning-model.mjs")).validateLearningProduct(data)',product)
    assert imported['viewContext']==product['viewContext']
    passed('AT03: older series / repetition 2 / early time / both side buttons / JSON+CSV match, no live mutation',view=product['viewContext'])
    # Explicit restart archives previous products, old series cannot fulfil a new investigation.
    act(p,'quest-restart');act(p,'repeat-attempt');fresh=snap(p)
    assert fresh['attemptId']!=s['attemptId'];assert fresh['quest']['step']==0 and fresh['comparison'] is None
    keys=p.evaluate('Object.keys(localStorage).filter(k=>k.startsWith("aquarium-learning-attempt-v1:"))');assert len(keys)==1
    act(p,'more');p.get_by_text('Frühere Durchgänge ansehen',exact=True).click();p.locator('[data-learning-archived-product]').click()
    expect(p.locator('.learn-imported-product')).to_contain_text('5 von 5')
    expect(p.locator('.learn-teacher-comparison')).to_have_attribute('data-series-id',old['id'])
    expect(p.locator('.learn-teacher-comparison')).to_have_attribute('data-view-time','45.25')
    passed('AT06: new attempt has fresh evidence; previous completed product remains readable')
   c.close()
  for mission,grade in [('8-health',8),('10-restore',10)]:
   if resume and mission=='8-health':continue
   c,p=setup_context(b,{'width':1366,'height':1024});start(p,grade,mission)
   act(p,'observe');act(p,'close');activities(p);choose(p,0);choose(p,1);assert snap(p)['quest']['step']==2
   act(p,'investigate');field=reveal(p.locator('[data-learning-value]'));field.fill('0');act(p,'compare')
   s=snap(p);assert s['quest']['step']==2;assert not s['comparison']['runs'][0]['intervention']['effective']
   assert s['comparison']['runs'][0]['control']==s['comparison']['runs'][0]['test']
   passed('AT05 actual UI/core: zero water cannot fulfil '+mission)
   if mission=='10-restore':
    act(p,'workspace-plan');field=reveal(p.locator('[data-learning-value]'));field.fill('50');reveal(p.locator('[data-learning-days]')).fill('14');act(p,'compare')
    time_field(p).select_option('59')  # Observe the actual end before interpretation actions become available.
    baseline=p.evaluate('localStorage.getItem("aquarium-learning-tank-v1:10:10-restore")')
    p.locator('[data-activity-view="early"]').click();s=snap(p);assert s['view']['time']==45.25
    expect(p.locator('.learn-results')).to_have_attribute('data-view-time','45.25')
    expect(p.locator('.learn-chart')).to_have_attribute('data-view-time','45.25')
    p.locator('[data-activity-view="late"]').click();s=snap(p);assert s['view']['time']==59
    expect(p.locator('.learn-results')).to_contain_text('Kein vollständiger Paarvergleich')
    assert s['view']['stateIds']['control'] is None
    reveal(p.locator('[data-learn="show-control"]')).click()
    assert snap(p)['view']['side']=='control' and snap(p)['view']['stateIds']['control'] is None
    expect(p.locator('[data-view-side="control"]')).to_contain_text('Keine weitere Szene')
    assert not p.locator('[data-learn="adopt-view"]').count()
    assert p.evaluate('localStorage.getItem("aquarium-learning-tank-v1:10:10-restore")')==baseline
    passed('AT04 actual core: early/late cards, cursor, missing control and read-only view agree',view=s['view'])
   c.close()
  c,p=setup_context(b,{'width':1366,'height':1024});start(p,9,'9-mendel')
  act(p,'observe');act(p,'close');activities(p);choose(p,0);choose(p,1)
  biological_experiment(p,'9-mendel');s=snap(p);choose(p,comparison_answer('9-mendel',s['quest']['result']));activities(p);choose(p,0)
  assert snap(p)['quest']['step']==5 and snap(p)['population']['generation']==2
  old_attempt=snap(p)['attemptId'];act(p,'quest-restart');act(p,'repeat-attempt');s=snap(p)
  assert s['attemptId']!=old_attempt and s['population']['generation']==0 and s['population']['events']==[] and s['quest']['step']==0
  archives=p.evaluate('Object.keys(localStorage).filter(k=>k.startsWith("aquarium-learning-attempt-v1:"))');assert len(archives)==1
  passed('AT06 actual F1/F2: repeat preserves the old product but requires new crosses');c.close()
  assert not report['errors'],report['errors'];assert not report['requests'],report['requests']
  report['status']='passed'
 except Exception as exc:
  report['status']='failed';report['failure']=repr(exc);traceback.print_exc()
  try:p.screenshot(path=str(OUT/'failure.png'));(OUT/'failure.txt').write_text(p.locator('#learning-root').inner_text())
  except Exception:pass
  raise
 finally:
  report['sources_unchanged']=all(hashlib.sha256((ROOT/k).read_bytes()).hexdigest()==v for k,v in sources.items())
  (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('REPORT',OUT/'report.json',flush=True);b.close()
