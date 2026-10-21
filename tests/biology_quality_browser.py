"""Actual-core biological probes and regular learner support/provenance, isolated saves only."""
import json,os,subprocess,math
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright,expect
from biology_browser_helpers import action
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('AQUARIUM_BIOLOGY_RESULTS','/tmp/aquarium-biology-quality'))/datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S');OUT.mkdir(parents=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
report={'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'checks':[],'errors':[],'failed_requests':[],'console_errors':[]}
def passed(s,**data):report['checks'].append({'name':s,**data});print('PASS',s,flush=True)
def snap(p):return p.evaluate('window.aquariumLearningSnapshot()')
def context(b):
 c=b.new_context(viewport={'width':1366,'height':1024},accept_downloads=True);c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
 p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:report['errors'].append(str(e)));p.on('requestfailed',lambda r:report['failed_requests'].append(r.url));p.on('console',lambda m:report['console_errors'].append(m.text) if m.type=='error' else None);p.goto(URL);p.wait_for_function('!!window.aquariumLearningSnapshot');return c,p
with sync_playwright() as w:
 engine=os.environ.get('AQUARIUM_BROWSER','chromium');kind=getattr(w,engine);launch={}
 if engine=='chromium':launch={'executable_path':os.environ.get('AQUARIUM_CHROMIUM','/usr/bin/chromium'),'args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}
 b=kind.launch(**launch)
 try:
  c,p=context(b);p.locator('[data-learn-grade="8"]').click();action(p,'free');assert not snap(p)['habitat'];base=p.evaluate('JSON.parse(localStorage.getItem("aquarium-learning-tank-v1:8:free"))')
  def probe(s,days):return p.evaluate('([s,days])=>window.aquariumSimulationProbe(s,days)',[s,days])
  bare=json.loads(json.dumps(base));bare.update(entities=[],deaths=[],hadLife=False,hours=0,detritus=0,algae=0,co2Dose=0,autoFeed=False,feedReserve=0,bacteria=.2,bacteria2=.2);bare['params'].update(nh4=0,no2=0,no3=0);result=probe(bare,14)
  assert result['bacteria']<.2 and result['bacteria2']<.2;assert result['params']['nh4']==0 and result['params']['no2']==0 and result['params']['no3']==0
  passed('A10 actual Qf: no substrate -> no nitrifier growth or invented nitrogen',bacteria=result['bacteria'],bacteria2=result['bacteria2'])
  fed=json.loads(json.dumps(bare));fed['params'].update(nh4=2,no2=1);result=probe(fed,.25);assert result['bacteria']>.2 and result['bacteria2']>.2
  nitrogen=lambda s:s['params']['nh4']*14/18+s['params']['no2']*14/46+s['params']['no3']*14/62
  assert abs(nitrogen(fed)-nitrogen(result))<1e-9;passed('A10 actual Qf: growth uses actual oxidation and conserves compound nitrogen')
  def ammonia_case(nh4,kh,co2):
   s=json.loads(json.dumps(base));s['entities']=[e for e in s['entities'] if e['species']=='guppy'];s.update(hours=0,flow=0,co2Dose=0,algae=0,detritus=0);s['params'].update(nh4=nh4,no2=0,kh=kh,co2=co2);return probe(s,.25)
  high=ammonia_case(.2,30,.5);low=ammonia_case(.001,30,.5)
  nh3=lambda s:s['params']['nh4']/(1+10**(.09018+2729.92/(s['params']['temp']+273.15)-s['params']['ph']))*17/18
  assert nh3(high)>.02;assert high['entities'][0]['health']<low['entities'][0]['health'];passed('A10 actual Qf: high pH free ammonia harms below old NH4-only threshold',nh3=nh3(high),high_health=high['entities'][0]['health'],control_health=low['entities'][0]['health'])
  acid=ammonia_case(1,.5,25);control=ammonia_case(.001,.5,25);assert nh3(acid)<.02;assert acid['entities'][0]['health']==control['entities'][0]['health'];passed('A10 actual Qf: acid ammonium does not trigger false ammonia damage',nh3=nh3(acid))
  # Actual Qf fish deaths, then a controlled compatibility fixture retaining healthy invertebrates.
  poison=json.loads(json.dumps(base));poison['params']['no2']=10;poison['bacteria2']=0;poison['flow']=0;dead=probe(poison,3)
  assert all(e.get('dead') for e in dead['entities'] if e['species']=='guppy')
  dead['entities']=[e for e in dead['entities'] if e['species']!='ramshorn']+[e for e in base['entities'] if e['species']=='ramshorn'];dead['failed']=False;dead['params']['no2']=0;fixture=OUT/'controlled-fish-deaths-live-snails.json';fixture.write_text(json.dumps(dead))
  p.locator('#import-file').set_input_files(str(fixture));p.wait_for_function('window.aquariumLearningSnapshot().sample.fishAlive===0');s=snap(p);assert s['sample']['health'] is None and s['sample']['otherAnimals']>0;action(p,'observe');expect(p.locator('.learn-panel')).to_contain_text('Keine lebenden Fische');assert 'Den Fischen geht es gut' not in p.locator('.learn-panel').inner_text();p.screenshot(path=str(OUT/'no-fish-live-snails.png'));passed('A03 actual import and student view: real fish deaths plus live snails cannot show positive fish health',sample=s['sample']);c.close()
  c,p=context(b);action(p,'expert');p.locator('[data-start="free"]').click()
  for label,state in [('alkaline',high),('acid',acid)]:
   payload=json.loads(json.dumps(state));payload.pop('learning',None);file=OUT/f'ammonia-lab-{label}.json';file.write_text(json.dumps(payload));p.locator('#import-file').set_input_files(str(file));p.locator('[data-panel="lab"]').click()
   value=nh3(payload);level=2 if value>=.1 else 1 if value>=.02 else 0;expect(p.locator('[data-ammonia-level]')).to_have_attribute('data-ammonia-level',str(level));shown=float(p.locator('[data-ammonia-value]').inner_text().replace(',','.'));assert abs(shown-value)<.0001
   p.locator('[data-act="quick-test"]').click();cell=p.locator('[data-test="nh4"]');expect(cell).to_contain_text('Ammonium');assert 'bad' not in (cell.get_attribute('class') or '').split();p.screenshot(path=str(OUT/f'ammonia-lab-{label}.png'));passed('A10 expert lab distinguishes measured NH4 from current free NH3 '+label,nh3=value,level=level)
   p.locator('[data-act="close-panel"]').click()
  c.close()
  samples=[]
  for support in ['guided','partial','independent']:
   c,p=context(b);action(p,'teacher');p.locator('[data-teacher="mission"]').select_option('8-oxygen');p.locator('[data-teacher="support"]').select_option(support);action(p,'student-launch');s=snap(p);samples.append(s['sample']);assert s['support']==support
   if support=='guided':expect(p.locator('.learn-step-hint')).to_contain_text('Öffne')
   else:
    assert not p.locator('.learn-step-hint').count();action(p,'quest-hint');text=p.locator('.learn-step-hint').inner_text();assert 'Schau genau' in text if support=='partial' else 'Welche Beobachtung' in text
   p.screenshot(path=str(OUT/f'support-{support}.png'));passed('A09 regular quest support '+support);c.close()
  assert samples[0]==samples[1]==samples[2];passed('A09 changing support leaves actual biological starting values unchanged')
  assert not report['errors'],report['errors'];assert not report['failed_requests'],report['failed_requests'];assert not report['console_errors'],report['console_errors'];report['status']='passed'
 except Exception as e:
  report.update(status='failed',failure=str(e))
  try:p.screenshot(path=str(OUT/'failure.png'))
  except Exception:pass
  raise
 finally:
  (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('RESULTS',OUT,flush=True);b.close()
