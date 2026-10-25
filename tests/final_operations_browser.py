"""Final expert starts and unchanged historical aquarium files through visible controls."""
from playwright.sync_api import sync_playwright,expect
from pathlib import Path
from datetime import datetime,timezone
import os,json,subprocess,hashlib
ROOT=Path(__file__).resolve().parents[1];ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium');OUT=Path(os.environ.get('AQUARIUM_OPERATIONS_RESULTS','/tmp/aquarium-final-operations'))/ENGINE;OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/');r={'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'engine':ENGINE,'checks':[],'captures':[],'errors':[],'requests_failed':[],'console':[]}
SECTIONS=os.environ.get('AQUARIUM_OPERATIONS','scenarios,legacy').split(',')
def shot(p,name):
 p.screenshot(path=str(OUT/(name+'.png')));r['captures'].append({'name':name,'at':datetime.now(timezone.utc).isoformat(),'url':p.url,'viewport':p.viewport_size,'text':p.locator('body').inner_text()});save()
def save():(OUT/'report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2))
def check(name,**data):r['checks'].append({'name':name,**data});save();print('PASS',name,flush=True)
def boot(b):
 c=b.new_context(viewport={'width':1366,'height':960},has_touch=True,accept_downloads=True);c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))");p=c.new_page();p.set_default_timeout(60000);p.on('pageerror',lambda e:r['errors'].append(str(e)));p.on('requestfailed',lambda q:r['requests_failed'].append(q.url));p.on('console',lambda m:r['console'].append(m.text) if m.type=='error' else None);p.goto(URL+'?expert=1');return c,p
def stored(p,key):return p.evaluate('key=>JSON.parse(localStorage.getItem(key))',key)
with sync_playwright() as pw:
 opts={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']};b=getattr(pw,ENGINE).launch(**opts);r['version']=b.version
 try:
  if 'scenarios' in SECTIONS:
   for id in ['foodweb','supply','water','leaves','microbes']:
    c,p=boot(b);p.locator('[data-scenarios]').click();p.locator('[data-scenario-start='+id+']').click();key='aquarium-scenario-v1:'+id;p.wait_for_function('key=>JSON.parse(localStorage.getItem(key))?.scenario?.id',arg=key);s=stored(p,key);assert s['spatial']['unplaced']==[],s['spatial'];p.wait_for_function('window.aquariumAquascapingSnapshot()?.targets?.every(t=>t.screen)',timeout=60000)
    p.wait_for_function('n=>{const s=window.aquariumPhysicalSnapshot();return s?.objects.length===n&&s.objects.every(o=>o.visible&&o.worldBounds)}',arg=len(s['entities']),polling=1000,timeout=60000);geometry=p.evaluate('window.aquariumPhysicalSnapshot()');assert all(o['visible'] and o['worldBounds'] for o in geometry['objects']);assert set(o['uid'] for o in geometry['objects'])==set(e['uid'] for e in s['entities']);assert {9,10}.issubset({o['uid'] for o in geometry['objects'] if o['visible']});shot(p,id+'-start')
    (OUT/(id+'-state.json')).write_text(json.dumps(s));p.reload();p.locator('[data-scenarios]').click();p.locator('[data-scenario-start='+id+']').click();after=stored(p,key);excluded={'events','tutorialCompleted','tutorialReadSpecies','tutorialStep','failureCause'};assert {k:v for k,v in after.items() if k not in excluded}=={k:v for k,v in s.items() if k not in excluded};assert after['events'][:-1]==s['events'] and after['events'][-1]['title']=='Spielstand geladen';shot(p,id+'-reload');check(id+': all real objects visible; original size, no unplaced; biological state, identities and positions survive reload',objects=len(geometry['objects']),geometry=geometry);c.close()
  if 'legacy' in SECTIONS:
   c,p=boot(b);p.locator('[data-start=free]').click();fixtures=Path(os.environ.get('AQUARIUM_LEGACY_FIXTURES',str(ROOT/'tests/fixtures/historical-aquaria')));entries=json.loads((fixtures/'index.json').read_text());assert len(entries)==14
   for entry in entries:
    f=fixtures/entry['file'];raw=f.read_bytes();assert hashlib.sha256(raw).hexdigest()==entry['sha256'];expected=json.loads(raw)
    if not p.locator('[data-act=import]:visible').count():p.locator('[data-panel=time]').filter(visible=True).first.click()
    with p.expect_file_chooser() as fc:p.locator('[data-act=import]').filter(visible=True).first.click()
    fc.value.set_files(str(f));p.wait_for_function('key=>JSON.parse(localStorage.getItem(key))?.learning?.mission',arg='aquarium-learning-tank-v1:'+str(entry['grade'])+':'+entry['mission'])
    s=stored(p,'aquarium-learning-tank-v1:'+str(entry['grade'])+':'+entry['mission']);assert s['params']==expected['params'];assert s['learning']==expected['learning'];assert s['day']==expected['day'];assert s['entities']==expected['entities'];assert not p.evaluate('Object.keys(localStorage).some(k=>k.startsWith("aquarium-single-"))');shot(p,'legacy-'+entry['mission']);check(entry['file']+': unchanged biology, individual records and learning tag; no new completion',sha256=entry['sha256']);p.keyboard.press('Escape')
   c.close()
  assert not r['errors'],r['errors'];assert not r['requests_failed'],r['requests_failed'];r['status']='passed'
 except Exception as e:
  r.update(status='failed',failure=str(e))
  try:shot(p,'failure')
  except:pass
  raise
 finally:save();b.close()
