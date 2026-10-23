"""F13 real historical reader: unchanged files, alternating reads, unknown data and failure."""
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
from datetime import datetime,timezone
import os,json,subprocess,hashlib
ROOT=Path(__file__).resolve().parents[1];ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium');OUT=Path(os.environ.get('AQUARIUM_FINAL_RESULTS','/tmp/aquarium-final-legacy'))/ENGINE;OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/');r={'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'sources':{f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in ROOT.glob('*.mjs')},'engine':ENGINE,'captures':[],'errors':[],'failed_requests':[]}
def capture(p,name):
 p.screenshot(path=str(OUT/(name+'.png')));r['captures'].append({'name':name,'url':p.url,'at':datetime.now(timezone.utc).isoformat(),'viewport':p.viewport_size,'text':p.locator('body').inner_text()})
with sync_playwright() as pw:
 opts={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
 b=getattr(pw,ENGINE).launch(**opts);r['browser']=b.version;p=b.new_page(viewport={'width':1366,'height':960},has_touch=True);p.on('pageerror',lambda e:r['errors'].append(str(e)));p.on('requestfailed',lambda x:r['failed_requests'].append({'url':x.url,'failure':x.failure}))
 try:
  p.goto(URL+'?expert=1&archive-tools=1');p.wait_for_selector('[data-learning-import=product]')
  for i,grade in enumerate([8,9,8,9]):
   f=ROOT/f'tests/fixtures/learning-v1-grade-{grade}.json';p.locator('[data-learning-import=product]').set_input_files(str(f));expect(p.locator('.learn-imported-product h3').first).to_have_text(f'Lernprodukt Klasse {grade}');expect(p.locator('[data-import-source]')).to_contain_text(f.name)
   p.locator('[data-import-source]').scroll_into_view_if_needed();capture(p,f'grade-{grade}-{i}')
   if grade==8:
    select=p.locator('[data-learning-manual-metric=imported]');select.select_option('fishAlive');expect(p.locator('.learn-measurements')).to_contain_text('unbekannt');assert p.locator('.learn-measurements tbody tr').count()>0
    assert all(x=='—' for x in p.locator('.learn-measurements tbody tr td:last-child').all_text_contents());p.locator('.learn-measurements').scroll_into_view_if_needed();capture(p,f'grade-8-unknown-{i}')
  bad=OUT/'invalid.json';bad.write_text('{ broken');p.locator('[data-learning-import=product]').set_input_files(str(bad));expect(p.locator('.learn-import-error')).to_contain_text('invalid.json');assert p.locator('.learn-imported-product').count()==0;p.locator('.learn-import-error').scroll_into_view_if_needed();capture(p,'invalid-cleared')
  p.locator('[data-learning-import=product]').set_input_files(str(ROOT/'tests/fixtures/legacy-v1.json'));expect(p.locator('.learn-import-error')).to_contain_text('Aquarium-Spielstand');assert p.locator('.learn-imported-product').count()==0;capture(p,'wrong-file-type')
  assert not r['errors'],r['errors'];r['status']='passed'
 except Exception as e:
  r['status']='failed';r['failure']=str(e);capture(p,'failure');raise
 finally:
  (OUT/'report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2));print(r['status'],OUT,flush=True);b.close()
