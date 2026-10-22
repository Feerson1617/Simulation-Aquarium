from biology_browser_helpers import activities,biological_experiment,comparison_answer,EXPECTED_ACTIONS,reveal,action as biological_action
"""Complete quests by real browser actions, not direct quest-state manipulation.
AQUARIUM_QUEST_SECTIONS=desktop,touch,free,teacher (default all).
"""
import json,os,re,subprocess
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ['AQUARIUM_QUEST_RESUME']) if os.environ.get('AQUARIUM_QUEST_RESUME') else Path(os.environ.get('AQUARIUM_QUEST_RESULTS','/tmp/aquarium-quest-results'))/datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S');OUT.mkdir(parents=True,exist_ok=bool(os.environ.get('AQUARIUM_QUEST_RESUME')))
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/').split('?')[0]
SECTIONS=os.environ.get('AQUARIUM_QUEST_SECTIONS','desktop,touch,free,teacher,help').split(',')
DPR=float(os.environ.get('AQUARIUM_TEST_DPR','1'))
if not 0.5<=DPR<=2:raise ValueError('AQUARIUM_TEST_DPR must be between 0.5 and 2')
report={'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'device_scale_factor':DPR,'checks':[],'errors':[],'failed_requests':[],'missions':[],'screenshots':[],'sections':SECTIONS}
# Resume only remaining sections after a test-harness fix. Preserve the original
# failed report and actual products; teacher imports still read all earlier exports.
if os.environ.get('AQUARIUM_QUEST_RESUME'):
 prior=json.loads((OUT/'report.json').read_text());assert prior['status']=='failed';assert not prior['errors'] and not prior['failed_requests']
 assert 'desktop' not in SECTIONS and 'touch' not in SECTIONS
 assert len(prior['missions'])==17 and len(prior['checks']) in [17,22,25],'Resume requires all14 desktop and three touch missions; any completed free/teacher sections are retained'
 if len(prior['checks'])==22:assert SECTIONS==['help'],'Only help and migration remain after all free/teacher checks passed'
 if len(prior['checks'])==25:assert SECTIONS==['migration'],'Only legacy migration remains after all help checks passed'
 history=prior.get('resumptions',([prior['resumed_from']] if prior.get('resumed_from') else []))
 (OUT/f'report-before-resume-{len(history)+1}.json').write_text(json.dumps(prior,ensure_ascii=False,indent=2))
 report.update(checks=prior['checks'],missions=prior['missions'],screenshots=prior['screenshots'],sections=list(dict.fromkeys(prior['sections']+SECTIONS)),resumed_sections=SECTIONS,resumptions=[*history,{'commit':prior['commit'],'failure':prior['failure'],'checks':len(prior['checks'])}])
IDS={8:['8-ecosystem','8-oxygen','8-foodweb','8-health','8-forest'],9:['9-traits','9-mendel','9-population','9-darwin'],10:['10-enrichment','10-carbon','10-restore','10-northsea','10-wadden']}
BAN=re.compile(r'\b(JSON|CSV|SVG|Seed|Seeds|Modellkonfiguration|Messmetadaten|Curriculum|Fachanforderungen|didaktisch\w*|Versorgungsindikator|Tierkondition)\b',re.I)
def passed(s): report['checks'].append(s);print('PASS',s,flush=True)
def snap(p):return p.evaluate('window.aquariumLearningSnapshot()')
def action(p,name):
 loc=p.locator(f'[data-learn="{name}"]').filter(visible=True).first
 if not loc.count() and name=='home':action(p,'more');loc=p.locator('[data-learn="home"]').filter(visible=True).first
 loc.click()
def start(p,g,id=None,legacy=False):
 p.locator(f'[data-learn-grade="{g}"]').click();action(p,'missions' if id else 'free')
 if id:p.locator(f'[data-learn-mission="{id}"]').click()
 state=snap(p);disturbed=id in ['8-health','10-restore']
 if not legacy:assert not [item for item in state['habitat'] if not disturbed or item['key']!='nitrite'],state['habitat']
def answer(p,i):p.locator(f'[data-quest-answer="{i}"]').filter(visible=True).click()
def short(p):
 text=p.locator('#learning-root').inner_text();assert not BAN.search(text),BAN.search(text).group() if BAN.search(text) else text
 assert not p.evaluate('document.documentElement.scrollWidth>innerWidth')
def shot(p,name):p.screenshot(path=str(OUT/name));report['screenshots'].append(name)
def context(b,touch=False):
 c=b.new_context(viewport={'width':768 if touch else 1360,'height':1024 if touch else 960},device_scale_factor=DPR,is_mobile=touch,has_touch=touch,accept_downloads=True)
 c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
 p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:report['errors'].append(str(e)));p.on('requestfailed',lambda r:report['failed_requests'].append(r.url));p.goto(URL);p.wait_for_function('!!window.aquariumLearningSnapshot');return c,p
def download(p,name):
 with p.expect_download() as d:action(p,'export')
 f=OUT/name;d.value.save_as(str(f));return f

def complete(p,g,id,touch=False):
 start(p,g,id);assert snap(p)['quest']['step']==0;expect(p.get_by_role('complementary',name='Questbuch')).to_be_visible();short(p)
 def act(a):biological_action(p,a,touch)
 def choose(i):
  target=p.locator(f'[data-quest-answer="{i}"]').filter(visible=True).first
  target.tap() if touch else target.click()
 assert p.locator('#scene canvas').count()==1 and p.evaluate('document.querySelector("#scene canvas").width>100')
 if p.locator('[data-quest-answer="0"]').count():choose(0);assert snap(p)['quest']['step']==0
 else:assert snap(p)['quest']['activities']==[]
 act('observe')
 if id!='10-wadden':
  p.locator('[data-learn-help="observe"]').click();expect(p.locator('.learn-help-pop')).to_contain_text('Schau genau hin. Was zeigt deine Population?' if g==9 else 'Schau genau hin. Was passiert im Aquarium?');p.keyboard.press('Escape');assert p.evaluate('document.activeElement.dataset.learnHelp')=='observe'
 else:
  expect(p.locator('#learning-root')).to_contain_text('Hafen')
  if p.locator('[data-harbour-object]').count():
   for node in ['visitors','packaging','animals']:p.locator(f'[data-harbour-object="{node}"]').click()
 assert p.evaluate('document.querySelector("#scene").inert');act('close');activities(p,touch)
 choose(1);assert snap(p)['quest']['step']==0;choose(0);assert snap(p)['quest']['step']==1;choose(1);assert snap(p)['quest']['step']==2
 biological_experiment(p,id,touch);assert snap(p)['quest']['step']==3,snap(p)['quest'];activities(p,touch)
 r=snap(p).get('questionResult') or snap(p)['quest']['result'];correct=comparison_answer(id,r);short(p)
 choose((correct+1)%(2 if id=='9-traits' else 3));assert snap(p)['quest']['step']==3;assert snap(p)['quest']['feedback']
 if id in ['8-oxygen','9-mendel','10-carbon']:shot(p,f'{"touch" if touch else "desktop"}-{id}-compare.png')
 choose(correct);assert snap(p)['quest']['step']==4;activities(p,touch);choose(1);assert snap(p)['quest']['step']==4;choose(0);assert snap(p)['quest']['step']==5;short(p)
 q=snap(p)['quest'];assert len(q['entries'])==5;assert {a['id'] for a in q['activities']}==EXPECTED_ACTIONS[id]
 assert not any(snap(p)['notes'].values()),'Generated answers/text must never become own notes'
 if p.locator('[data-learn="close"]:visible').count():act('close')
 current=snap(p)
 if current.get('prototype') and current['prototype']['render']['sides']:
  frame=current['prototype']['render']['frames'];p.wait_for_function('(f)=>window.aquariumLearningSnapshot().prototype.render.frames>f+2',arg=frame)
 elif current.get('domainView'):
  assert p.locator('[data-cohort-uid]').count()>0;expect(p.locator('#scene')).not_to_be_visible()
 elif current.get('regionalView') or (id=='10-northsea' and p.locator('[data-process-node]').count()):
  assert p.locator('[data-harbour-object],[data-process-node]').count()>0;expect(p.locator('#scene')).not_to_be_visible()
 else:
  frame=p.evaluate('window.aquariumSnapshot().graphics.renderFrame');p.wait_for_function('(f)=>window.aquariumSnapshot().graphics.renderFrame>f+2 && window.aquariumSnapshot().graphics.triangles>3000',arg=frame)
 shot(p,f'{"touch" if touch else "desktop"}-{id}-done.png');act('notebook');f=download(p,f'{"touch" if touch else "desktop"}-{id}.json');data=json.loads(f.read_text())
 assert data['quest']['step']==5 and data['gameExplanation'];assert not any(data['notes'].values());assert data['provenance']['questAnswers']=='selection' and data['provenance']['measurements']=='simulation'
 if id in ['8-oxygen','9-mendel','10-carbon']:
  own=reveal(p.locator('[data-learning-note="explanation"]'));own.fill('Ich habe beide Ergebnisse verglichen. Meine eigene kurze Begründung bleibt getrennt von den Spieltexten.')
  ownfile=download(p,f'{"touch" if touch else "desktop"}-{id}-own.json');ownproduct=json.loads(ownfile.read_text());assert ownproduct['provenance']['notes']['explanation']=='own-input';assert ownproduct['notes']['explanation']==own.input_value()
 short(p);act('close');before=snap(p)
 if True:  # Every mission must now survive reload in the same accumulated local profile.
  p.reload();p.wait_for_function('!!window.aquariumLearningSnapshot');start(p,g,id)
  after=snap(p)
  if after['quest']!=before['quest']:
   (OUT/f'{id}-before-reload.json').write_text(json.dumps(before,ensure_ascii=False))
   (OUT/f'{id}-after-reload.json').write_text(json.dumps(after,ensure_ascii=False))
  assert after['quest']==before['quest'];assert after['comparison']==before['comparison'];assert after['population']==before['population'];assert not after['storageError']
 report['missions'].append({'id':id,'touch':touch,'quest':snap(p)['quest'],'product':f.name});passed(f'{"touch" if touch else "desktop"}: {id} completed with required biological actions, actual evidence, retry, provenance and explanation')
 act('home')

with sync_playwright() as pw:
 engine=os.environ.get('AQUARIUM_BROWSER','chromium');report['engine']=engine
 launch={'executable_path':os.environ.get('AQUARIUM_CHROMIUM','/usr/bin/chromium'),'args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if engine=='chromium' else {}
 if engine=='webkit' and os.environ.get('AQUARIUM_WEBKIT'):launch['executable_path']=os.environ['AQUARIUM_WEBKIT']
 b=getattr(pw,engine).launch(**launch)
 try:
  if 'desktop' in SECTIONS:
   c,p=context(b)
   for g,ids in IDS.items():
    for id in ids:
     if id not in os.environ.get("AQUARIUM_QUEST_SKIP","").split(","):complete(p,g,id)
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
    else:reveal(p.locator('[data-learning-value]')).fill('0');action(p,'compare')
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
  if 'help' in SECTIONS:
   expected={'observe':('Beobachten','Schau genau hin.'),'oxygen':('Sauerstoff','Fische und Pflanzen brauchen Sauerstoff.'),'nutrients':('Nährstoffe','Pflanzen brauchen Nährstoffe'),'load':('Probleme im Wasser','Futterreste oder schädliche Stoffe'),'control':('Zwei Becken','Beide Becken starten gleich.'),'genotype':('Erbanlagen und Farbe','Genotyp heißt:'),'selection':('Über Generationen','Manche Tiere haben mehr Nachkommen'),'species':('Tiere und Pflanzen','Wähle eine Art.'),'results':('Meine Ergebnisse','Hier findest du deine Antworten')}
   c,p=context(b,True)
   for g in [8,9,10]:
    start(p,g);seen=set()
    for view in ['observe','investigate','material','notebook']:
     action(p,view)
     for key in p.locator('.learn-panel [data-learn-help]').evaluate_all('(bs)=>bs.map(b=>b.dataset.learnHelp)'):
      assert key in expected,key
      loc=p.locator(f'[data-learn-help="{key}"]');box=loc.bounding_box();assert box["width"]>=44 and box["height"]>=44;loc.focus();p.keyboard.press('Enter');title,fragment=expected[key];expect(p.locator('.learn-help-pop h2')).to_have_text(title);expect(p.locator('.learn-help-pop')).to_contain_text(fragment);assert p.evaluate('document.querySelector(".learn-panel").inert');p.keyboard.press('Tab');assert p.evaluate('document.querySelector(".learn-help-pop").contains(document.activeElement)');p.keyboard.press('Escape');assert p.evaluate('document.activeElement.dataset.learnHelp')==key;seen.add(key)
     short(p);action(p,'close')
    assert {'observe','results'}.issubset(seen)
    if g!=9:assert {'oxygen','control','species'}.issubset(seen),seen  # Only visible topics: unrelated water values are deliberately collapsed/absent.
    else:assert {'genotype','selection'}.issubset(seen)
    action(p,'more');action(p,'glossary');short(p);action(p,'close');action(p,'home');passed(f'grade {g}: every regular question-mark help has the correct topic, short text, keyboard focus and touch-size controls')
   c.close()
  if 'help' in SECTIONS or 'migration' in SECTIONS:
   c,p=context(b,True)
   # Genuine old tank+notes migrate without replacing the previous plan or explanation.
   tank=json.loads((ROOT/'tests/fixtures/legacy-v1.json').read_text());old=json.loads((ROOT/'tests/fixtures/learning-v1-grade-8.json').read_text());tank['learning']={'version':1,'grade':8,'mode':'missions','mission':'8-oxygen'}
   prior={'version':1,'notes':{'question':'Meine alte Frage','explanation':'Meine frühere Erklärung'},'measurements':[],'baseline':tank,'comparison':None,'study':{'tool':'light','value':12,'days':4,'repetitions':1,'metric':'oxygen','environment':'dark','generations':5}}
   p.evaluate('(v)=>{localStorage.setItem("aquarium-learning-tank-v1:8:8-oxygen",JSON.stringify(v.tank));localStorage.setItem("aquarium-learning-notes-v1:aquarium-learning-tank-v1:8:8-oxygen",JSON.stringify(v.prior))}',{'tank':tank,'prior':prior})
   start(p,8,'8-oxygen',legacy=True);assert snap(p)['habitat']==[{'uid':2,'species':'neon','key':'group'}], 'The genuine old single-neon fixture remains unchanged; it is not a healthy new start';assert p.evaluate('JSON.parse(localStorage.getItem("aquarium-learning-tank-v1:8:8-oxygen")).params')==tank['params'];assert snap(p)['study']['value']==12 and snap(p)['study']['days']==4;action(p,'notebook');p.get_by_text('Frühere Ergebnisse',exact=True).click();expect(p.locator('.learn-panel')).to_contain_text('Meine frühere Erklärung');f=download(p,'migrated-notes.json');assert json.loads(f.read_text())['earlierNotes']['explanation']=='Meine frühere Erklärung';passed('old learning session: previous settings and notes survive quest migration and file export');c.close()
  assert not report['errors'],report['errors'];assert not report['failed_requests'],report['failed_requests'];report['status']='passed'
 except Exception as e:
  report['status']='failed';report['failure']=str(e)
  try:shot(p,'failure.png')
  except Exception:pass
  raise
 finally:
  (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('RESULTS',OUT,flush=True);b.close()
