"""Actual single HTML: HTTP then offline, or native file boot via AQUARIUM_SINGLE_HTML."""
import os,json,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium')
OUT=Path(os.environ.get('AQUARIUM_SINGLE_OFFLINE_RESULTS','/tmp/single-m1-offline'))/ENGINE;OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('AQUARIUM_SINGLE_HTML','http://127.0.0.1:8000/standalone-m1/')
r={'engine':ENGINE,'applicationHead':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'url':URL,'errors':[],'httpRequests':[],'nativeFile':'tested by actual file URL' if URL.startswith('file:') else 'not tested','checks':[]}
def click(p,key):p.locator('[data-single="'+key+'"]:visible').first.click()
def snap(p):return p.evaluate('window.aquariumLearningSnapshot()')
with sync_playwright() as pw:
 launch={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
 b=getattr(pw,ENGINE).launch(**launch);c=b.new_context(viewport={'width':1366,'height':960},accept_downloads=True)
 c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
 p=c.new_page();p.set_default_timeout(120000);p.on('pageerror',lambda e:r['errors'].append(e.stack));p.on('request',lambda q:r['httpRequests'].append(q.url) if q.url.startswith(('http:','https:')) else None)
 try:
  p.goto(URL);p.wait_for_selector('[data-single=start]');c.set_offline(True)
  click(p,'start');p.wait_for_function('window.aquariumLearningSnapshot().renderer.stats.detailModels>=19');assert snap(p)['renderer']['sameState']
  click(p,'plant');p.locator('[data-single=prediction][data-choice="0"]').click();click(p,'play')
  p.wait_for_function('window.aquariumLearningSnapshot().session.stage==="light-finished"')
  initial=snap(p)['session']['baseline'];click(p,'reset');assert snap(p)['session']['tank']==initial
  click(p,'darken');click(p,'play');p.wait_for_function('window.aquariumLearningSnapshot().session.stage==="compare"')
  p.locator('[data-single-choice=observed]').click();p.locator('[data-single-choice=processes]').click();assert snap(p)['session']['stage']=='complete'
  with p.expect_download() as d:click(p,'export')
  d.value.save_as(str(OUT/'result.json'));data=json.loads((OUT/'result.json').read_text());assert data['currentContext']==snap(p)['context']
  assert len(data['runs'])==2 and data['runs'][1]['samples'][-1]['oxygen']>data['runs'][1]['samples'][0]['oxygen']
  assert p.locator('canvas').count()==1;assert not r['errors'];assert r['httpRequests']==([] if URL.startswith('file:') else [URL])
  p.screenshot(path=str(OUT/'completed.png'));r.update(status='passed',checks=['one actual main aquarium and embedded assets','full serial M1 with exact reset','rising oxygen in the dark and process interpretation','exported identity matches the visible aquarium','no child HTTP resource, already-loaded document works offline'])
  print('PASS',ENGINE,'native file start' if URL.startswith('file:') else 'HTTP then offline','complete M1 and exported result')
 except Exception as error:
  r.update(status='blocked' if 'ERR_BLOCKED_BY_ADMINISTRATOR' in str(error) else 'failed',failure=str(error))
  raise
 finally:(OUT/'report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');b.close()
