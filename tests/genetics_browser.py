"""Actual shop → biology → offspring → analysis, under the Pages project path.

Run with the local static server on port 8000. Uses no remote resources.
The mature starting aquarium is a test fixture, not a change to game scenarios.
"""
import copy, json, os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('AQUARIUM_GENETICS_RESULTS','/tmp/aquarium-genetics-browser'))
OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('AQUARIUM_TEST_URL','http://127.0.0.1:8000/aquarium-simulation/')
report={'passed':[],'errors':[],'console_errors':[],'failed_requests':[]}
def passed(message):report['passed'].append(message);print('PASS',message,flush=True)
def click(page,selector):page.locator(selector).filter(visible=True).first.click()
def saved(page):return json.loads(page.evaluate('localStorage.getItem("aquarium-werkstatt-v1")'))
def snapshot(page):return page.evaluate('window.aquariumGeneticsSnapshot()')
def shot(page,name):page.screenshot(path=str(OUT/name),timeout=120000)
def mature():
 f=json.loads((ROOT/'tests/fixtures/legacy-v1.json').read_text())
 f.update(liters=700,filter='external600',light='plant',day=45.35,setTemp=25,flow=75,hours=8,foodType='granules',autoFeed=True,feedRate=1,seed=47291,co2Dose=0,heater=True)
 f['entities']=[e for e in f['entities']if e['species']=='anubias'];f['nextId']=10
 for species in ['hygro','waterweed','javamoss','nana']:
  e=copy.deepcopy(f['entities'][0]);e.update(uid=f['nextId'],species=species,x=(f['nextId']%4-1.5),z=-.7);f['entities'].append(e);f['nextId']+=1
 f['params'].update(temp=25,no2=.015,nh4=.015,oxygen=8,ph=7.2,gh=12,kh=2,no3=18,po4=.4,co2=3)
 return f
def restore(page,payload):
 if page.locator('[data-gen-close]:visible').count():click(page,'[data-gen-close]')
 page.locator('#import-file').set_input_files({'name':'genetics-fixture.json','mimeType':'application/json','buffer':json.dumps(payload).encode()})
 page.wait_for_function('(day)=>window.aquariumSnapshot().day===day',arg=payload['day'])
 if page.locator('[data-act="close-panel"]:visible').count():click(page,'[data-act="close-panel"]')
def buy(page,species,variant,sex,genotype=None,quantity=2):
 click(page,'[data-panel="shop"]');click(page,'[data-department="tiere"]');click(page,f'[data-species="{species}"]')
 page.locator('[data-fish-variant]').select_option(variant);page.locator('[data-fish-sex]').select_option(sex)
 if genotype:
  page.locator('.lesson-purchase summary').click()
  page.locator('[data-lesson-genotype]').select_option(genotype)
 page.wait_for_function('(v)=>window.aquariumShopAppearance()?.variant===v',arg=variant)
 page.locator('#shop-specimen-stage').screenshot(path=str(OUT/f'shop-{species}-{variant}.png'),timeout=120000)
 page.locator('#quantity').fill(str(quantity));click(page,'[data-act="add-species"]');click(page,'[data-act="close-panel"]');print('BOUGHT',species,variant,sex,flush=True)
def select_pair(page,mother,father):
 page.locator('[data-gen-parent="mother"]').select_option(str(mother));page.locator('[data-gen-parent="father"]').select_option(str(father));click(page,'[data-gen-action="pair"]')
def descendants(snap,parents):return[r for r in snap['genetics']['pedigree'].values()if r['parents']==parents]

with sync_playwright()as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 context=browser.new_context(viewport={'width':1360,'height':960});page=context.new_page();page.set_default_timeout(90000)
 page.on('pageerror',lambda e:report['errors'].append(str(e)))
 page.on('console',lambda m:report['console_errors'].append({'text':m.text,'url':m.location.get('url','')})if m.type=='error'else None)
 page.on('requestfailed',lambda r:report['failed_requests'].append({'url':r.url,'error':r.failure}))
 try:
  page.goto(URL);click(page,'button[data-graphics-profile="ipad"]');click(page,'[data-start="free"]');restore(page,mature())
  buy(page,'molly','black','♀');buy(page,'molly','gold','♂')
  founders=saved(page);fish=[e for e in founders['entities']if e['species']=='molly'];assert len(fish)==4
  assert {e['variant']for e in fish}=={'black','gold'}
  page.wait_for_function('window.aquariumRenderedIndividuals().filter(e=>e.fish).length===4')
  rendered=page.evaluate('window.aquariumRenderedIndividuals()');report['founder_render']=rendered
  assert {r['appearance']['variant']for r in rendered if r['fish']}=={'black','gold'}
  for r in rendered:
   if r['fish']:assert max(r['basisLengths'])-min(r['basisLengths'])<1e-5,r
  black=page.evaluate('(uid)=>window.aquariumRenderedAppearance(uid)',fish[0]['uid']);gold=page.evaluate('(uid)=>window.aquariumRenderedAppearance(uid)',fish[-1]['uid']);assert set(r['source']for r in black).isdisjoint(r['source']for r in gold),(black,gold);assert black[0]['fingerprint']!=gold[0]['fingerprint'];report['colour_sources']={'black':black,'gold':gold}
  passed('Real shop purchases retain independent pixel sources for both colours; tank width does not distort fish anatomy')
  click(page,'#genetics-button');snap=snapshot(page);assert not snap['revealed']and not snap['theoryShown'];click(page,'[data-gen-action="pair"]');parents=snapshot(page)['parents']
  click(page,'[data-gen-days="7"]');snap=snapshot(page);first=descendants(snap,parents)
  assert 3<=len(first)<=5 and all(r['loci']['A']==['A','a']and r['variant']=='black'and r['filial']=='F1'for r in first),snap
  first_save=saved(page);(OUT/'f1-save.json').write_text(json.dumps(first_save,ensure_ascii=False,indent=2));report['f1']=first;shot(page,'molly-f1.png')
  passed('AA × aa creates actual uniform F1 after seven days of the real ecology engine')
  mother=next(r['uid']for r in first if r['sex']=='♀');father=next(r['uid']for r in first if r['sex']=='♂');select_pair(page,mother,father)
  click(page,'[data-gen-days="14"]');second=descendants(snapshot(page),[mother,father])
  assert second and all(r['filial']=='F2'and r['generation']==2 for r in second),snapshot(page)
  assert all(e['age']>=7 for e in saved(page)['entities']if e['uid']in[mother,father])
  page.locator('[data-gen-reveal]').check();click(page,'[data-gen-action="theory"]');assert page.locator('.genetics-punnett tbody td').count()==4
  report['f2']=second;shot(page,'molly-f2-punnett.png');page.locator('.genetics-content').evaluate('(el)=>el.scrollTop=720');shot(page,'molly-f2-results.png');passed('Actual F1 parents mature and produce stochastic F2; analysis shows their 2×2 Punnett square')
  final=saved(page);(OUT/'f2-save.json').write_text(json.dumps(final,ensure_ascii=False,indent=2));click(page,'[data-gen-close]');page.wait_for_function('window.aquariumRenderedIndividuals().filter(e=>e.fish).length>9')
  view=page.evaluate('window.aquariumRenderedIndividuals()');report['offspring_render']=view
  newborn={r['uid']for r in second};adults=[r for r in view if r.get('fish')and r['uid']in[mother,father]];young=[r for r in view if r.get('fish')and r['uid']in newborn]
  assert young and max(young[0]['basisLengths'])<max(adults[0]['basisLengths']),view
  shot(page,'aquarium-with-f2.png');passed('Newborn fish use inherited appearance and are visibly smaller in the actual aquarium renderer')
  before=page.evaluate('localStorage.getItem("aquarium-werkstatt-v1")');click(page,'[data-panel="time"]');page.locator('[data-graphics-setting]').select_option('maximum');page.wait_for_function('window.aquariumSnapshot().graphics.graphicsProfile==="maximum"')
  assert page.evaluate('localStorage.getItem("aquarium-werkstatt-v1")')==before
  page.locator('[data-graphics-setting]').select_option('ipad');click(page,'[data-act="close-panel"]')
  restore(page,final);assert saved(page)['genetics']==final['genetics'];page.reload();click(page,'[data-start="resume"]');assert saved(page)['genetics']==final['genetics']
  passed('Profile changes, JSON import and reload preserve genes, colour forms, parents and all generations')
  restore(page,mature());buy(page,'platy','red-wagtail','♀','AaBb');buy(page,'platy','red-wagtail','♂','AaBb')
  click(page,'#genetics-button');page.locator('[data-gen-species]').select_option('platy');click(page,'[data-gen-action="pair"]');parents=snapshot(page)['parents'];click(page,'[data-gen-days="7"]');platy=descendants(snapshot(page),parents);assert platy
  page.locator('[data-gen-reveal]').check();click(page,'[data-gen-action="theory"]');assert page.locator('.genetics-punnett tbody td').count()==16;expect(page.locator('.genetics-content')).to_contain_text('56,3 %')
  assert all(set(r['loci'])=={'A','B'}for r in platy);report['platy']=platy;page.locator('.genetics-content').evaluate('(el)=>el.scrollTop=720');shot(page,'platy-dihybrid.png');passed('Purchased heterozygous Platy produce true two-locus offspring; 4×4 square and 9:3:3:1 expectation appear on request')
  restore(page,mature());buy(page,'zebra','natural','♀');buy(page,'zebra','golden','♂');click(page,'#genetics-button');page.locator('[data-gen-species]').select_option('zebra');click(page,'[data-gen-action="pair"]');parents=snapshot(page)['parents'];click(page,'[data-gen-days="7"]');eggs=descendants(snapshot(page),parents)
  assert eggs and all(r['status']=='Ei'for r in eggs);assert len([e for e in saved(page)['entities']if e['species']=='zebra'])==4
  eggsave=saved(page);restore(page,eggsave);assert saved(page)['genetics']['clutches']==eggsave['genetics']['clutches'];click(page,'#genetics-button');page.locator('[data-gen-species]').select_option('zebra');shot(page,'zebra-eggs.png');click(page,'[data-gen-days="1"]');hatch=descendants(snapshot(page),parents);assert all(r['status']=='lebend'for r in hatch);assert len([e for e in saved(page)['entities']if e['species']=='zebra'])==4+len(hatch)
  report['zebra']=hatch;shot(page,'zebra-hatched.png');passed('Actual egg laying, save/reload of unborn embryos, and hatching remain distinct from live birth')
  # Portrait and real touch input on the same persistent breeding aquarium.
  touch=browser.new_context(viewport={'width':820,'height':1180},has_touch=True,is_mobile=True);tp=touch.new_page();tp.set_default_timeout(90000);tp.goto(URL);tp.locator('button[data-graphics-profile="ipad"]').tap();tp.locator('[data-start="free"]').tap();restore(tp,saved(page));tp.locator('#genetics-button').tap();tp.locator('[data-gen-species]').select_option('zebra');tp.locator('[data-gen-reveal]').check();assert tp.evaluate('document.documentElement.scrollWidth<=innerWidth');shot(tp,'ipad-genetics-portrait.png');tp.locator('[data-gen-close]').tap();touch.close();passed('Touch controls and genetics analysis fit portrait iPad viewport')
  assert not report['errors'],report['errors'];assert not report['failed_requests'],report['failed_requests']
  unexpected=[e for e in report['console_errors']if not(e['url'].endswith('/favicon.ico')and'404'in e['text'])];assert not unexpected,unexpected
  report['status']='passed';passed('No JavaScript, shader or failed-resource errors')
 except Exception as error:
  report['status']='failed';report['failure']=str(error)
  try:shot(page,'failure.png')
  except Exception:pass
  raise
 finally:
  (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));browser.close();print('RESULTS',OUT,flush=True)
