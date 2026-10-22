"""Phase 3 through real visible actions; probes only read actual archive identities."""
import os,json,hashlib,subprocess,time
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
from biology_browser_helpers import action,reveal,activities,biological_experiment,comparison_answer
ROOT=Path(__file__).resolve().parents[1];ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium')
OUT=Path(os.environ.get('AQUARIUM_PHASE3_RESULTS','/tmp/aquarium-phase3'))/ENGINE;OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
report={'engine':ENGINE,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'sources':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in ROOT.iterdir() if p.suffix in ['.mjs','.html','.css']},'checks':[],'errors':[],'requests':[],'screenshots':[],'hardware':'Linux automation; no physical iPad'}
def passed(name):report['checks'].append(name);print('PASS',name,flush=True)
def snap(p):return p.evaluate('window.aquariumLearningSnapshot()')
def choose(p,i):p.locator(f'[data-quest-answer="{i}"]:visible').first.click()
def shot(p,name):p.screenshot(path=str(OUT/name));report['screenshots'].append(name)
def start(p,g,m=None):
 p.locator(f'[data-learn-grade="{g}"]').click();action(p,'missions' if m else 'free')
 if m:p.locator(f'[data-learn-mission="{m}"]').click()
def setup(b,touch):
 c=b.new_context(viewport={'width':768 if touch else 1366,'height':1024 if touch else 960},has_touch=touch,is_mobile=touch,accept_downloads=True,device_scale_factor=1)
 c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
 p=c.new_page();p.set_default_timeout(60000);p.on('pageerror',lambda e:report['errors'].append(str(e)));p.on('requestfailed',lambda r:report['requests'].append(r.url));p.goto(URL);p.wait_for_function('!!window.aquariumLearningSnapshot');return c,p
def datafile(p,name):
 if not p.locator("[data-learn=export]:visible").count():action(p,"more");action(p,"notebook")
 with p.expect_download() as d:action(p,'export')
 target=OUT/name;d.value.save_as(str(target));product=json.loads(target.read_text());p.evaluate('async d=>(await import("./learning-model.mjs")).validateLearningProduct(d)',product);return product
def ecology(p,g,m,label):
 start(p,g,m);assert len(snap(p)['prototype']['render']['sides'])==2
 if m=='8-health':
  expect(p.locator('#learning-root')).to_contain_text('Schädliche Stoffe im Wasser');assert 'Nitrit' not in p.locator('#learning-root').inner_text()
 action(p,'observe');action(p,'close');activities(p);choose(p,0);choose(p,1)
 biological_experiment(p,m);s=snap(p);assert s['quest']['step']==3
 activities(p)
 v=snap(p)['view'];c=snap(p)['comparison'];run=c['runs'][v['run']]
 if not all(snap(p)['viewSamples'].values()):
  common=[a['day'] for a in run['control'] if any(b['day']==a['day'] for b in run['test'])];p.locator('[data-coherent-time]:visible').first.select_option(str(common[-1]))
 s=snap(p);v=s['view']
 for side in ['control','test']:
  card=p.locator(f'[data-view-side="{side}"]');expect(card).to_have_attribute('data-state-id',v['stateIds'][side]);expect(card).to_have_attribute('data-view-time',str(v['time']).removesuffix('.0'))
 assert not p.evaluate('document.documentElement.scrollWidth>innerWidth')
 if m in ['8-oxygen','8-health','10-restore']:shot(p,label+'-'+m+'.png')
 r=p.evaluate('async()=>{const s=window.aquariumLearningSnapshot(),{resolveComparisonView}=await import("./learning-context.mjs"),{comparisonReading,QUESTS}=await import("./learning-quests.mjs");const v=resolveComparisonView({comparison:s.comparison,comparisonHistory:s.comparisonHistory,study:s.study,view:s.view});return comparisonReading({...v.comparison,runs:[{...v.run,control:[v.row.control],test:[v.row.test]}]},QUESTS[s.profile.mission].experiment)}')
 choose(p,comparison_answer(m,r));activities(p);choose(p,0);assert snap(p)['quest']['step']==5
 if m=='8-health':assert not p.locator('#learning-root').get_by_text('Nitrit',exact=True).count()
 passed(label+': '+m+' complete with actual paired scenes, selected time and mission-specific readings');action(p,'home')
def mendel(p,label):
 start(p,9,'9-mendel');assert p.locator('[data-cohort-uid]').count()==24
 assert not p.locator('[data-tank-viewport]').count();expect(p.locator('#scene')).not_to_be_visible()
 p.locator('[data-cohort-uid="1"]').click();expect(p.locator('[data-individual-detail]')).to_contain_text('Fisch 1')
 assert not p.locator('[data-individual-detail]').get_by_text('AA',exact=True).count()
 choose(p,0);choose(p,1);biological_experiment(p,'9-mendel');s=snap(p);before=json.dumps(s['population'],sort_keys=True)
 p.locator('[data-cohort-generation]').select_option('1');assert snap(p)['domainView']['context']['time']==1
 assert p.locator('[data-cohort-uid]').count()==24
 for i in snap(p)['domainView']['sides']['test']['cohort']['individuals']:assert i['loci']['A']==['A','a']
 expect(p.locator('.coherent-notebook')).to_contain_text('aktuelle Nachkommengeneration')
 action(p,'cohort-latest');i=s['population']['individuals'][0];p.locator(f'[data-cohort-uid="{i["uid"]}"]').click()
 expect(p.locator('[data-individual-detail]')).to_contain_text('Elternteil Nr.')
 assert snap(p)['domainView']['context']['cohortIds']['test']==p.locator('[data-cohort-side]').get_attribute('data-cohort-id')
 assert json.dumps(snap(p)['population'],sort_keys=True)==before
 choose(p,comparison_answer('9-mendel',s['quest']['result']));activities(p);choose(p,0);assert snap(p)['quest']['step']==5
 shot(p,label+'-mendel.png');product=datafile(p,label+'-mendel.json');assert product['cohortView']['context']['time']==2
 assert product['quest']['entries'][3]['viewContext']['axis']=='generation'
 p.reload();p.wait_for_function('!!window.aquariumLearningSnapshot');start(p,9,'9-mendel')
 assert snap(p)['population']==s['population'];assert p.locator('[data-cohort-uid]').count()==24
 assert 'Erbanlagen ausblenden' in p.locator('#learning-root').inner_text()
 passed(label+': actual 24-fish F1/F2, selected UID, real allele provenance, historical view, export/import and reload')
 old_attempt=snap(p)['attemptId'];action(p,'population-new');fresh=snap(p)
 assert fresh['attemptId']!=old_attempt and fresh['quest']['step']==0 and fresh['population']['generation']==0 and not fresh['population']['events']
 archived=p.evaluate('key=>JSON.parse(localStorage.getItem("aquarium-learning-attempt-v1:"+key))',old_attempt)
 assert archived['product']['population']['generation']==2 and archived['product']['quest']['step']==5
 passed(label+': population repeat button archives actual F2 and starts a new attempt with no old quest credit');action(p,'home')
def harbour(p,key,label):
 start(p,10,'10-wadden')
 # A second route is a new attempt with new object evidence, never old answers.
 if snap(p)['quest']['step']:
  action(p,'quest-restart');action(p,'new-attempt')
 assert not p.locator('[data-coherent-time],[data-learning-days],[data-tank-viewport]').count()
 choose(p,0);assert snap(p)['quest']['step']==0
 source='fishing' if key=='gear' else 'visitors'
 p.locator(f'[data-harbour-object="{source}"]').tap() if label=='portrait' else p.locator(f'[data-harbour-object="{source}"]').click()
 for node in (['nets','animals'] if key=='gear' else ['packaging','animals']):p.locator(f'[data-harbour-object="{node}"]').click()
 choose(p,0);choose(p,2);assert snap(p)['quest']['step']==2
 index=1 if key=='gear' else 0
 p.locator(f'[data-activity-id="harbour-interest"][data-activity-choice="{index}"]').click();activities(p)
 assert snap(p)['quest']['step']==3;assert snap(p)['quest']['result']['measureKey']==key
 choose(p,0);activities(p);choose(p,0);assert snap(p)['quest']['step']==5
 shot(p,label+'-harbour-'+key+'.png');product=datafile(p,label+'-harbour-'+key+'.json')
 assert product['quest']['result']['objects'][source]['origin']=='game-action'
 if key=='gear':assert 'Netze' in product['gameExplanation'] and 'Mehrweg' not in product['gameExplanation']
 assert not p.evaluate('document.documentElement.scrollWidth>innerWidth')
 passed(label+': harbour '+key+' completed through real source selection and chosen-specific benefit, effort, follow-up and conclusion');action(p,'home')
def free(p,g,label):
 start(p,g);assert snap(p)['quest'] is None
 if g==9:
  assert p.locator('[data-cohort-uid]').count()==24;action(p,'population-groups')
  assert p.locator('[data-cohort-uid]').count()==48
  p.locator('[data-learning-environment]').select_option('light');plan=datafile(p,label+'-free9-plan.json');assert plan['cohortPlanView']['time']==0 and plan['viewContext'] is None;action(p,'close');p.locator('[data-learning-generations]').fill('3');action(p,'population-compare')
  v=snap(p)['domainView'];assert v['context']['axis']=='generation'
  reveal(p.locator('[data-learning-run]')).select_option('1');p.locator('[data-coherent-time]:visible').first.select_option('1')
  v=snap(p)['domainView'];assert v['context']['time']==1 and v['context']['repetition']==2
  for side in ['control','test']:
   assert len(v['sides'][side]['cohort']['individuals'])==24;expect(p.locator(f'[data-cohort-side="{side}"]')).to_have_attribute('data-cohort-id',v['context']['cohortIds'][side])
  shot(p,label+'-free9-groups.png');datafile(p,label+'-free9.json')
  for action_name,extension in [('csv','csv'),('chart','svg')]:
   with p.expect_download() as download:action(p,action_name)
   target=OUT/(label+'-free9.'+extension);download.value.save_as(str(target));text=target.read_text()
   assert all(value in text for value in v['context']['cohortIds'].values())
  assert 'Kohortenkennung' in (OUT/(label+'-free9.csv')).read_text()
  action(p,'population-cohort');assert snap(p)['population']['generation']==0
 else:
  before=p.evaluate('JSON.stringify(window.aquariumSnapshot())')
  action(p,'investigate');assert p.locator('[data-tank-viewport]').count()==2
  reveal(p.locator('[data-learning-value]')).fill('0');action(p,'compare');action(p,'workspace-play')
  p.wait_for_function('window.aquariumLearningSnapshot().view.time===window.aquariumLearningSnapshot().comparison.runs[0].test.at(-1).day')
  assert snap(p)['quest'] is None
  datafile(p,label+'-free'+str(g)+'.json');action(p,'research-own');assert not p.locator('[data-tank-viewport]').count()
  assert snap(p)['liveSample']['day']==45
 assert not any(snap(p)['notes'].values())
 passed(label+': free grade '+str(g)+' remains open, with visible controlled groups and no mandatory writing');action(p,'home')
with sync_playwright() as pw:
 launch={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
 b=getattr(pw,ENGINE).launch(**launch)
 try:
  sections=os.environ.get('AQUARIUM_PHASE3_SECTIONS','aquarium,population,harbour,free').split(',')
  profiles=os.environ.get('AQUARIUM_PHASE3_PROFILES','desktop,portrait').split(',')
  for label,touch in [('desktop',False),('portrait',True)]:
   if label not in profiles:continue
   c,p=setup(b,touch)
   missions=[(8,'8-ecosystem'),(8,'8-oxygen'),(8,'8-foodweb'),(8,'8-health'),(8,'8-forest'),(10,'10-enrichment'),(10,'10-carbon'),(10,'10-restore'),(10,'10-northsea')] if not touch else [(8,'8-oxygen'),(10,'10-restore')]
   if "aquarium" in sections:
    for g,m in missions:ecology(p,g,m,label)
   if "population" in sections:mendel(p,label)
   if 'harbour' in sections:
    for key in ['returns','gear']:harbour(p,key,label)
   if "free" in sections:
    for g in ([8,9,10] if not touch else [9]):free(p,g,label)
   c.close()
  assert not report['errors'],report['errors'];assert not report['requests'],report['requests'];report['status']='passed'
 except Exception as e:
  report['status']='failed';report['failure']=str(e)
  try:shot(p,'failure.png')
  except Exception:pass
  raise
 finally:
  (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));b.close();print('RESULTS',OUT,flush=True)
