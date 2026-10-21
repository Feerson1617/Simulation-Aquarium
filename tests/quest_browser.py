"""Complete quests by real browser actions, not direct quest-state manipulation.
AQUARIUM_QUEST_SECTIONS=desktop,touch,free,teacher (default all).
"""
import json,os,re
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('AQUARIUM_QUEST_RESULTS','/tmp/aquarium-quest-results'))/datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S');OUT.mkdir(parents=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/').split('?')[0]
SECTIONS=os.environ.get('AQUARIUM_QUEST_SECTIONS','desktop,touch,free,teacher').split(',')
report={'checks':[],'errors':[],'failed_requests':[],'missions':[],'screenshots':[],'sections':SECTIONS}
IDS={8:['8-ecosystem','8-oxygen','8-foodweb','8-health','8-forest'],9:['9-traits','9-mendel','9-population','9-darwin'],10:['10-enrichment','10-carbon','10-restore','10-northsea','10-wadden']}
BAN=re.compile(r'\b(JSON|CSV|SVG|Seed|Seeds|Modellkonfiguration|Messmetadaten|Curriculum|Fachanforderungen|didaktisch\w*|Versorgungsindikator|Tierkondition)\b',re.I)
def passed(s): report['checks'].append(s);print('PASS',s,flush=True)
def snap(p):return p.evaluate('window.aquariumLearningSnapshot()')
def action(p,name):
 loc=p.locator(f'[data-learn="{name}"]').filter(visible=True).first
 if not loc.count() and name=='home':action(p,'more');loc=p.locator('[data-learn="home"]').filter(visible=True).first
 loc.click()
def start(p,g,id=None):
 p.locator(f'[data-learn-grade="{g}"]').click();action(p,'missions' if id else 'free')
 if id:p.locator(f'[data-learn-mission="{id}"]').click()
def answer(p,i):p.locator(f'[data-quest-answer="{i}"]').filter(visible=True).click()
def short(p):
 text=p.locator('#learning-root').inner_text();assert not BAN.search(text),BAN.search(text).group() if BAN.search(text) else text
 assert not p.evaluate('document.documentElement.scrollWidth>innerWidth')
def shot(p,name):p.screenshot(path=str(OUT/name));report['screenshots'].append(name)
def context(b,touch=False):
 c=b.new_context(viewport={'width':768 if touch else 1360,'height':1024 if touch else 960},is_mobile=touch,has_touch=touch,accept_downloads=True)
 c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
 p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:report['errors'].append(str(e)));p.on('requestfailed',lambda r:report['failed_requests'].append(r.url));p.goto(URL);p.wait_for_function('!!window.aquariumLearningSnapshot');return c,p
def download(p,name):
 with p.expect_download() as d:action(p,'export')
 f=OUT/name;d.value.save_as(str(f));return f

def complete(p,g,id,touch=False):
 start(p,g,id);assert snap(p)['quest']['step']==0;expect(p.get_by_role('complementary',name='Questbuch')).to_be_visible();short(p)
 assert p.locator('#scene canvas').count()==1 and p.evaluate('document.querySelector("#scene canvas").width>100')
 if id in ['8-oxygen','9-mendel','10-carbon']:shot(p,f'{"touch" if touch else "desktop"}-{id}-start.png')
 answer(p,0);assert snap(p)['quest']['step']==0;expect(p.locator('.learn-quest-feedback')).to_contain_text('zuerst')
 action(p,'observe');p.locator('[data-learn-help="observe"]').click();expect(p.locator('.learn-help-pop')).to_contain_text('Schau genau hin. Was passiert im Aquarium?');p.keyboard.press('Escape');assert p.evaluate('document.activeElement.dataset.learnHelp')=='observe';assert p.evaluate('document.querySelector("#scene").inert')
 answer(p,1);assert snap(p)['quest']['step']==0;answer(p,0);assert snap(p)['quest']['step']==1;answer(p,1);assert snap(p)['quest']['step']==2
 if g==9:
  if id=='9-traits':
   action(p,'material');action(p,'genes');assert snap(p)['quest']['result']['AA']>0 and snap(p)['quest']['result']['Aa']>0
  elif id=='9-mendel':
   action(p,'material');p.locator('[data-learning-mother]').select_option('1');p.locator('[data-learning-father]').select_option('6');action(p,'cross');pop=snap(p)['population'];assert pop['generation']==1 and all(i['loci']['A']==['A','a'] for i in pop['individuals'])
  else:
   action(p,'investigate');p.locator('[data-learning-generations]').fill('1');action(p,'population-compare');assert snap(p)['quest']['step']==2;p.locator('[data-learning-generations]').fill('5');action(p,'population-compare');comp=snap(p)['comparison'];assert comp['runs'][0]['archives']['test']['events']
 else:
  action(p,'investigate')
  if id=='8-oxygen':
   # A real computed no-op cannot count as changing the light.
   p.locator('[data-learning-value]').fill('8');action(p,'compare');assert snap(p)['quest']['step']==2;p.locator('[data-learning-value]').fill('0')
  action(p,'compare');comp=snap(p)['comparison'];run=comp['runs'][0];assert run['initialControl']==run['initialTest'];assert run['control'] and run['test']
  if id=='8-oxygen':
   core=p.evaluate('s=>window.aquariumSimulationProbe(s,3)',run['initialControl']);assert core['params']==run['finalControl']['params'];trial=json.loads(json.dumps(run['initialTest']));trial['hours']=0;core=p.evaluate('s=>window.aquariumSimulationProbe(s,3)',trial);assert core['params']==run['finalTest']['params']
 assert snap(p)['quest']['step']==3,snap(p)['quest'];r=snap(p)['quest']['result'];short(p)
 if id=='9-traits':correct=0
 elif id=='9-mendel':correct=0 if r['dark']==1 else 1 if r['light']==1 else 2
 else:correct=2 if abs(r['control']-r['test'])<=1e-9 else 0 if r['control']>r['test'] else 1
 answer(p,(correct+1)% (2 if id=='9-traits' else 3));assert snap(p)['quest']['step']==3;expect(p.locator('.learn-quest-feedback')).to_contain_text('erneut')
 if id in ['8-oxygen','9-mendel','10-carbon']:shot(p,f'{"touch" if touch else "desktop"}-{id}-compare.png')
 answer(p,correct);assert snap(p)['quest']['step']==4;answer(p,1);assert snap(p)['quest']['step']==4;answer(p,0);assert snap(p)['quest']['step']==5;short(p)
 assert len(snap(p)['quest']['entries'])==5
 # Close drawer: the actual completion and tank remain readable together.
 action(p,'close');shot(p,f'{"touch" if touch else "desktop"}-{id}-done.png')
 if id in ['8-oxygen','9-mendel','10-carbon']:
  action(p,'notebook');f=download(p,f'{"touch" if touch else "desktop"}-{id}.json');data=json.loads(f.read_text());assert data['quest']['step']==5 and data['notes']['explanation'];short(p);action(p,'close')
  before=snap(p);p.reload();p.wait_for_function('!!window.aquariumLearningSnapshot');start(p,g,id);assert snap(p)['quest']==before['quest'];assert snap(p)['comparison']==before['comparison'];assert snap(p)['population']==before['population']
 report['missions'].append({'id':id,'touch':touch,'quest':snap(p)['quest']});passed(f'{"touch" if touch else "desktop"}: {id} completed through actual observation, prediction, experiment, retry, comparison and explanation')
 action(p,'home')

with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=os.environ.get('AQUARIUM_CHROMIUM','/usr/bin/chromium'),args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 try:
  if 'desktop' in SECTIONS:
   c,p=context(b)
   for g,ids in IDS.items():
    for id in ids:complete(p,g,id)
   c.close()
  if 'touch' in SECTIONS:
   c,p=context(b,True)
   for g,id in [(8,'8-oxygen'),(9,'9-mendel'),(10,'10-carbon')]:complete(p,g,id,True)
   c.close()
  if 'free' in SECTIONS:
   c,p=context(b);legacy=(ROOT/'tests/fixtures/legacy-v1.json').read_text();p.evaluate('(s)=>localStorage.setItem("aquarium-werkstatt-v1",s)',legacy)
   for g in [8,9,10]:
    start(p,g);assert not snap(p)['quest'];assert not p.locator('.learn-quest').count();action(p,'investigate')
    if g==9:action(p,'population-compare')
    else:p.locator('[data-learning-value]').fill('0');action(p,'compare')
    assert snap(p)['comparison']['runs'];short(p);action(p,'close');action(p,'observe');action(p,'measure');action(p,'advance');action(p,'measure');assert len(snap(p)['measurements'])==2;short(p)
    if g!=9:assert p.locator('.learn-measurements table tbody tr').count()==2;assert p.locator('.learn-measurements svg').is_visible()
    action(p,'close');action(p,'notebook');download(p,f'free-{g}.json');short(p);action(p,'close');action(p,'home');assert p.evaluate('localStorage.getItem("aquarium-werkstatt-v1")')==legacy
    passed(f'free grade {g}: no mandatory quest or writing; actual experiment, measurements, export and legacy save preserved')
   c.close()
  if 'teacher' in SECTIONS:
   c,p=context(b);action(p,'teacher');p.locator('[data-teacher="grade"]').select_option('10');p.locator('[data-teacher="mission"]').select_option('10-carbon');p.get_by_text('Alle Missionshintergründe und Modellgrenzen',exact=True).click();expect(p.locator('.learn-teacher')).to_contain_text('Fossile Verbrennung');expect(p.locator('.learn-teacher')).to_contain_text('Landnutzung');expect(p.locator('.learn-teacher')).to_contain_text('keine globale Emissionssimulation')
   # Actual products from completed browser quests, and genuine older products.
   products=list(OUT.glob('desktop-*.json'))+list(OUT.glob('free-*.json'))+[ROOT/'tests/fixtures/learning-v1-grade-8.json',ROOT/'tests/fixtures/learning-v1-grade-9.json']
   for f in products:
    p.locator('[data-learning-import="product"]').set_input_files(str(f));expect(p.locator('.learn-imported-product')).to_be_visible()
    if f.name.startswith('desktop-'):expect(p.locator('.learn-imported-product')).to_contain_text('5 von 5 Aufgaben')
   passed('teacher: real quest exports and v1 products remain readable; carbon source material and limits available')
   p.get_by_text('Alle Missionshintergründe und Modellgrenzen',exact=True).click();action(p,'teacher-launch');assert snap(p)['detailed'];assert p.locator('[data-learning-note="hypothesis"]').count();passed('teacher: full technical investigation remains accessible without exposing it in regular student views');c.close()
  assert not report['errors'],report['errors'];assert not report['failed_requests'],report['failed_requests'];report['status']='passed'
 except Exception as e:
  report['status']='failed';report['failure']=str(e)
  try:shot(p,'failure.png')
  except Exception:pass
  raise
 finally:
  (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('RESULTS',OUT,flush=True);b.close()
