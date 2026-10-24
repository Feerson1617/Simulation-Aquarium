"""Read and re-export the twelve actual previous browser-generated mission products."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from datetime import datetime,timezone
import os,json,gzip,hashlib,subprocess
ROOT=Path(__file__).resolve().parents[1];ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium');OUT=Path(os.environ.get('AQUARIUM_PREVIOUS_PRODUCTS_RESULTS','/tmp/aquarium-previous-products'))/ENGINE;OUT.mkdir(parents=True,exist_ok=True);URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
r={'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'engine':ENGINE,'checks':[],'errors':[],'failed_requests':[]}
with sync_playwright() as pw:
 opts={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']};b=getattr(pw,ENGINE).launch(**opts);r['version']=b.version
 try:
  for id in range(1,7):
   c=b.new_context(viewport={'width':1366,'height':960},has_touch=True,accept_downloads=True);c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))");p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:r['errors'].append(str(e)));p.on('requestfailed',lambda q:r['failed_requests'].append(q.url))
   sources=[]
   for origin in ['chromium','webkit']:
    prefix='missions-webkit-rest' if origin=='webkit' and id>=4 else 'missions-'+origin
    source=ROOT/f'docs/single-aquarium/final-corrections/exports/{prefix}-m{id}-result.json.gz';sources.append((source,gzip.decompress(source.read_bytes())))
   raw=json.loads(sources[0][1]);p.goto(URL+('' if id==1 else '?mission='+raw['mission']));prefix='single' if id==1 else 'class'
   if id==1:p.locator('[data-single=start]').tap()
   p.locator(f'[data-{prefix}-stage]').wait_for()
   for source,original in sources:
    before=hashlib.sha256(source.read_bytes()).hexdigest();expected=json.loads(original);p.locator(f'[data-{prefix}=menu]').tap();p.locator(f'[data-{prefix}-file]').set_input_files({'name':source.stem,'mimeType':'application/json','buffer':original});p.locator(f'[data-{prefix}-stage=complete]').wait_for();actual=p.evaluate('aquariumLearningSnapshot().session');assert actual==expected,(source.name,[k for k in actual.keys()|expected.keys() if actual.get(k)!=expected.get(k)])
    with p.expect_download() as d:p.locator(f'[data-{prefix}=export]').tap()
    out=OUT/source.stem;d.value.save_as(str(out));assert json.loads(out.read_text())==expected;assert hashlib.sha256(source.read_bytes()).hexdigest()==before
    r['checks'].append({'source':str(source.relative_to(ROOT)),'sourceGzipSHA256':before,'download':out.name,'downloadSHA256':hashlib.sha256(out.read_bytes()).hexdigest(),'actualDataEqual':True,'at':datetime.now(timezone.utc).isoformat(),'url':p.url});print('PASS',source.name,flush=True)
   p.screenshot(path=str(OUT/f'm{id}-previous-result.png'));c.close()
  assert len(r['checks'])==12 and not r['errors'] and not r['failed_requests'];r['status']='passed'
 except Exception as e:r.update(status='failed',failure=str(e));raise
 finally:(OUT/'report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2));b.close()
