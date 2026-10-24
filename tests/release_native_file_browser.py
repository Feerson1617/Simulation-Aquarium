"""Actual file: opening, using normal installed browser policy; never HTTP fallback."""
import os,json,hashlib,subprocess
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium');OUT=Path(os.environ.get('AQUARIUM_NATIVE_RESULTS','/tmp/aquarium-release-native'))/ENGINE;OUT.mkdir(parents=True,exist_ok=True);HTML=Path(os.environ.get('AQUARIUM_OFFLINE_HTML','/tmp/final-html-download/Aquarium.html'))
r={'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'engine':ENGINE,'artifactSHA256':hashlib.sha256(HTML.read_bytes()).hexdigest(),'url':HTML.as_uri(),'at':datetime.now(timezone.utc).isoformat(),'errors':[],'failed_requests':[],'http_requests':[],'checks':[]}
with sync_playwright() as pw:
 opts={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']};b=getattr(pw,ENGINE).launch(**opts);r['version']=b.version;c=b.new_context(viewport={'width':1366,'height':960},has_touch=True,accept_downloads=True);c.add_init_script("try{localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))}catch{}");p=c.new_page();p.set_default_timeout(180000)
 p.on('pageerror',lambda e:r['errors'].append(str(e)));p.on('requestfailed',lambda q:r['failed_requests'].append({'url':q.url[:300],'error':q.failure}));p.on('request',lambda q:r['http_requests'].append(q.url) if q.url.startswith('http') else None)
 try:
  p.goto(HTML.as_uri(),timeout=240000);v=p.frame_locator('#aquarium-view');v.locator('[data-single=start]').tap();v.locator('[data-single-stage]').wait_for();p.frames[1].wait_for_load_state('networkidle');p.screenshot(path=str(OUT/'file-m1.png'));r['checks'].append('Actual local file opened M1 and rendered its scene')
  v.locator('[data-single=menu]').tap();v.locator('[data-single=home]').tap();v.locator('a[href="?mission=m6-plant-carbon"]').tap();v.locator('[data-class-stage=prediction]').wait_for();p.frames[1].wait_for_load_state('networkidle');p.screenshot(path=str(OUT/'file-m6.png'));r['checks'].append('Actual local internal switch to M6; no network')
  v.locator('[data-class-choice=unsure]').tap();v.locator('[data-class=plant]').tap();s=p.frames[1].evaluate('aquariumLearningSnapshot().session');v.locator('[data-class=menu]').tap()
  with p.expect_download() as d:v.locator('[data-class=export]').tap()
  f=OUT/'file-m6.json';d.value.save_as(str(f));assert json.loads(f.read_text())==s
  v.get_by_role('link',name='Zur Missionsauswahl').tap();v.locator('[data-single=start]').wait_for();p.go_back();v.locator('[data-class-stage]').wait_for();assert p.frames[1].evaluate('aquariumLearningSnapshot().session')==s;r['checks'].append('Save, actual JSON download and browser Back restore the same local mission');r['lifecycle']=p.evaluate('aquariumStandaloneSnapshot()')
  assert not r['errors'] and not r['failed_requests'] and not r['http_requests'];r['status']='passed'
 except Exception as e:
  r['failure']=str(e);r['status']='blocked by managed browser policy' if 'ERR_BLOCKED_BY_ADMINISTRATOR' in str(e) else 'failed'
  if r['status']=='failed':raise
 finally:
  (OUT/'report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2));b.close();print(r['status'],flush=True)
