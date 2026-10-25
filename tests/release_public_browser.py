"""Public PR preview: normal links/direct entries, one real tank, genuine legacy CSV download."""
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright
import os,json,csv,hashlib,subprocess
ROOT=Path(__file__).resolve().parents[1];OUT=Path(os.environ.get('AQUARIUM_PUBLIC_RESULTS','/tmp/r-public-browser'));OUT.mkdir(parents=True,exist_ok=True);URL=os.environ.get('AQUARIUM_PUBLIC_URL','https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/')
r={'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'url':URL,'at':datetime.now(timezone.utc).isoformat(),'checks':[],'errors':[],'failed_requests':[],'console_errors':[]}
with sync_playwright() as pw:
 b=pw.webkit.launch(executable_path=os.environ['AQUARIUM_WEBKIT']);r['browser']=b.version;c=b.new_context(viewport={'width':1366,'height':960},has_touch=True,accept_downloads=True);c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))");p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:r['errors'].append(str(e)));p.on('requestfailed',lambda q:r['failed_requests'].append(q.url));p.on('console',lambda m:r['console_errors'].append(m.text) if m.type=='error' else None)
 def ready():
  p.wait_for_function('aquariumLearningSnapshot()?.presentation?.glass');assert p.locator('canvas').count()==1;assert p.locator('iframe').count()==0;s=p.evaluate('aquariumLearningSnapshot()');assert s['renderer']['sameState'];return s
 try:
  p.goto(URL);p.locator('[data-single=start]').tap();ready();p.locator('[data-single=menu]').tap();p.locator('[data-single=home]').tap()
  for id in ['m2-food-transformation','m6-plant-carbon']:
   p.locator('a[href="?mission='+id+'"]').tap();p.wait_for_selector('[data-class-stage]');ready();assert p.url==URL+'?mission='+id;p.screenshot(path=str(OUT/(id+'.png')));p.locator('[data-class=menu]').tap();p.get_by_role('link',name='Zur Missionsauswahl').tap();p.wait_for_selector('[data-single=start]');assert p.url==URL;r['checks'].append(id+': normal public anchor and return, one main canvas, no standalone frame')
  for id in ['m3-hidden-inheritance','m4-dominance-frequency','m5-recurring-input']:
   p.goto(URL+'?mission='+id);p.wait_for_selector('[data-class-stage]');ready();r['checks'].append(id+': direct public mission URL')
  p.goto(URL+'?expert=1&archive-tools=1');fixture=ROOT/'tests/fixtures/learning-v1-grade-8.json';source=json.loads(fixture.read_text());p.locator('[data-learning-import=product]').set_input_files(str(fixture))
  field=p.locator('[data-learning-manual-metric=imported]');field.evaluate('e=>e.scrollIntoView({block:"center"})');before=field.bounding_box();field.select_option('fishAlive');assert abs(field.bounding_box()['y']-before['y'])<3
  with p.expect_download() as d:p.locator('[data-learn=imported-manual-csv]').click()
  f=OUT/'public-v1-grade8.csv';d.value.save_as(str(f));rows=list(csv.DictReader(f.read_text().splitlines(),delimiter=';'));assert rows
  for row in rows:
   if row['Messschluessel']=='fishAlive':assert row['Wert']=='' and row['Wertstatus']=='historisch unbekannt'
   else:
    sample=next(x for x in source['measurements'] if str(x['day'])==row['Messzeit']);assert float(row['Wert'])==sample[row['Messschluessel']]
  p.screenshot(path=str(OUT/'public-reader.png'));r['checks'].append('public V1 grade 8: stable metric switch, actual CSV, unknown fish and all known values checked');r['downloadSHA256']=hashlib.sha256(f.read_bytes()).hexdigest();assert not r['errors'] and not r['failed_requests'] and not r['console_errors'];r['status']='passed'
 except Exception as e:r.update(status='failed',failure=str(e));raise
 finally:(OUT/'report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2));b.close();print(r.get('status'),flush=True)
