"""Compatibility, real touch input, bounded archives and storage-failure protection.

The only precompleted quest is an unchanged genuine PR8 export used as an old-save
fixture. New investigations are reached solely through visible learner actions.
"""
import hashlib,json,os,subprocess,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
from biology_browser_helpers import action,reveal,activities
ROOT=Path(__file__).resolve().parents[1];ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium')
OUT=Path(os.environ.get('AQUARIUM_COMPAT_RESULTS','/tmp/aquarium-coherent-compat'))/ENGINE;OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
report={'engine':ENGINE,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'checks':[],'errors':[],'screenshots':[]}
def snap(p):return p.evaluate('window.aquariumLearningSnapshot()')
def choose(p,i):p.locator(f'[data-quest-answer="{i}"]:visible').first.click()
def passed(name,**data):report['checks'].append({'name':name,**data});print('PASS',name,flush=True)
def start(p):p.locator('[data-learn-grade="8"]').click();action(p,'missions');p.locator('[data-learn-mission="8-ecosystem"]').click()
def heater(p,n):action(p,'device-temperature');reveal(p.locator('[data-equipment-value]')).fill(str(n));p.locator('[data-equipment-save]').click()
def setup(b,touch=False,fixture=None):
 c=b.new_context(viewport={'width':768 if touch else 1366,'height':1024},has_touch=touch,is_mobile=touch,accept_downloads=True)
 c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
 if fixture:c.add_init_script(f"localStorage.setItem({json.dumps(fixture[0])},{json.dumps(json.dumps(fixture[1],ensure_ascii=False))});localStorage.setItem({json.dumps(fixture[2])},{json.dumps(json.dumps(fixture[3],ensure_ascii=False))})")
 p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:report['errors'].append(str(e)));p.goto(URL);p.wait_for_function('!!window.aquariumLearningSnapshot');return c,p
with sync_playwright() as pw:
 launch={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {}
 if ENGINE=='webkit' and os.environ.get('AQUARIUM_WEBKIT'):launch['executable_path']=os.environ['AQUARIUM_WEBKIT']
 b=getattr(pw,ENGINE).launch(**launch)
 try:
  fixture=ROOT/'docs/biology-quality/evidence/quests/desktop-8-ecosystem.json';old=json.loads(fixture.read_text());assert old['quest']['step']==5
  slot='aquarium-learning-tank-v1:8:8-ecosystem';notes='aquarium-learning-notes-v1:'+slot
  tank=old['comparison']['runs'][0]['initialControl'];session={'version':1,'notes':old['notes'],'measurements':old['measurements'],
   'baseline':tank,'comparison':old['comparison'],'population':None,'quest':old['quest'],
   'study':{'tool':'temperature','value':27,'days':3,'repetitions':2,'metric':'temp','environment':'neutral','generations':5}}
  c,p=setup(b,fixture=(slot,tank,notes,session));start(p)
  expect(p.locator('.learn-quest h2')).to_have_text('Früherer Abschluss');assert snap(p)['quest']['visualEvidenceVersion']==0
  backup=p.evaluate('key=>JSON.parse(localStorage.getItem(key))',slot+':before-views-v1');assert backup['session']==session and backup['tank']==tank
  p.locator('[data-coherent-time]:visible').first.select_option('45.25')
  expect(p.locator('.coherent-unavailable').first).to_contain_text('nur Messwerte');assert snap(p)['prototype']['render']['sides']==[]
  p.screenshot(path=str(OUT/'legacy-measurements-only.png'));report['screenshots'].append('legacy-measurements-only.png')
  action(p,'quest-restart');action(p,'repeat-attempt');assert snap(p)['quest']['step']==0 and snap(p)['quest']['visualEvidenceVersion']==1
  passed('Genuine old completion stays historical; exact migration backup; missing early scene is not invented; new attempt needs new actions',fixture_sha256=hashlib.sha256(fixture.read_bytes()).hexdigest());c.close()
  c,p=setup(b,touch=True);action(p,'teacher');p.locator('[data-teacher="mission"]').select_option('8-ecosystem');p.locator('[data-teacher="help"]').uncheck();action(p,'student-launch')
  assert not p.locator('[data-learn-help]').count();assert not p.locator('[data-learn="quest-hint"]').count()
  before=snap(p)['sample'];action(p,'device-temperature');dial=p.locator('.device-dial');box=dial.bounding_box()
  if ENGINE=='chromium':
   cd=p.context.new_cdp_session(p);x=box['x']+box['width']/2;y=box['y']+box['height']/2
   for kind,points in [('touchStart',[{'x':x,'y':y}]),('touchMove',[{'x':x,'y':y-32}]),('touchEnd',[])]:cd.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':points})
   assert float(dial.get_attribute('aria-valuenow'))==27
   passed('Native Chromium touch drag changes only heater draft; camera and biological sample stay unchanged')
  else:
   for _ in range(4):dial.press('ArrowUp')
  p.locator('[data-equipment-save]').click();assert snap(p)['sample']==before;assert snap(p)['study']['value']==27
  p.set_viewport_size({'width':1366,'height':1024});assert len(snap(p)['prototype']['render']['sides'])==2
  assert p.locator('[data-view-side="control"]').is_visible() and p.locator('[data-view-side="test"]').is_visible()
  passed('Teacher help switch and portrait-to-landscape resize preserve both actual views and biological values');c.close()
  c,p=setup(b);start(p);action(p,'observe');action(p,'close');activities(p);choose(p,0);choose(p,1);heater(p,27)
  action(p,'compare');p.locator('[data-coherent-time]:visible').first.select_option('48');assert snap(p)['quest']['step']==3
  first=snap(p)['comparison']['id'];action(p,'workspace-plan');assert not p.locator('[data-quest-answer]').count()
  heater(p,26);before=p.evaluate('key=>localStorage.getItem(key)',notes)
  p.evaluate("""key=>{const original=Storage.prototype.setItem;window.__coherentQuotaFail=true;Storage.prototype.setItem=function(k,v){if(window.__coherentQuotaFail&&k===key)throw new DOMException('Test: full storage','QuotaExceededError');return original.call(this,k,v)}}""",notes)
  action(p,'compare');assert snap(p)['comparison']['id']==first;assert p.evaluate('key=>localStorage.getItem(key)',notes)==before
  expect(p.locator('.coherent-storage')).to_be_visible()
  p.evaluate('window.__coherentQuotaFail=false');action(p,'compare');assert snap(p)['quest']['step']==2
  p.locator('[data-coherent-time]:visible').first.select_option('48');assert snap(p)['quest']['step']==3
  passed('Full-storage fault leaves previous comparison and saved data intact; successful replan requires a new observation')
  for value in [25.5,26.5,27]:
   action(p,'workspace-plan');heater(p,value);action(p,'compare');p.locator('[data-coherent-time]:visible').first.select_option('48')
  s=snap(p);assert len(s['comparisonHistory'])==3
  keys=p.evaluate('Object.keys(localStorage).filter(k=>k.startsWith("aquarium-learning-attempt-v1:series-"))');assert len(keys)==1
  archived=p.evaluate('k=>JSON.parse(localStorage.getItem(k))',keys[0]);assert archived['product']['comparison']['id']==first
  assert archived['kind']=='series' and archived['product']['quest'] is None
  assert s['comparisonHistory'][-1]['questEvidence']['step']==3
  passed('Fifth series archives the oldest series instead of deleting it; earlier answer evidence stays attached to its run',storage_characters=p.evaluate('Object.keys(localStorage).reduce((n,k)=>n+k.length+localStorage.getItem(k).length,0)'))
  c.close();assert not report['errors'],report['errors'];report['status']='passed'
 except Exception as e:
  report.update(status='failed',failure=repr(e));traceback.print_exc()
  try:p.screenshot(path=str(OUT/'failure.png'))
  except Exception:pass
  raise
 finally:(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('REPORT',OUT/'report.json',flush=True);b.close()
