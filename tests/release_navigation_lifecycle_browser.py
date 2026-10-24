"""R03: leave a genuinely running observation with browser Back; no stale clock/save."""
from playwright.sync_api import sync_playwright
from pathlib import Path
from datetime import datetime,timezone
import os,json,hashlib
import release_standalone_browser as suite
R=suite.R;OUT=suite.OUT;ENGINE=suite.ENGINE
with sync_playwright() as pw:
 opts={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
 b=getattr(pw,ENGINE).launch(**opts);c=b.new_context(viewport={'width':1366,'height':1024},has_touch=True,accept_downloads=True);c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))");p=c.new_page();p.set_default_timeout(180000);v=suite.GameView(p);R['version']=b.version;R['scenario']='live simulation interrupted by actual browser Back, restored paused by Forward'
 p.on('pageerror',lambda e:R['errors'].append(str(e)));p.on('console',lambda m:R['console_errors'].append(m.text) if m.type=='error' else None);p.on('requestfailed',lambda q:R['requests_failed'].append({'url':q.url[:250],'failure':q.failure}));p.on('request',lambda q:R['requests'].append({'url':q.url,'offline':R['offline']}) if q.url.startswith('http') else None)
 try:
  p.goto(suite.URL,timeout=240000);v.ready('[data-single=start]');v.open_route('?mission=m2-food-transformation','[data-class-stage]');v.wait_for_function('aquariumLearningSnapshot().renderer.stats.detailModels>=19');c.set_offline(True);R['offline']=True
  v.tap('[data-class-choice=unsure]');v.tap('[data-class=feed]');v.tap('[data-class=play]');v.wait_for_function('aquariumLearningSnapshot().session.tank.day>aquariumLearningSnapshot().session.baseline.day');before=v.evaluate('aquariumLearningSnapshot()');assert before['running'];active=p.evaluate('aquariumStandaloneSnapshot()');assert active['resources']['intervals']==4,active
  p.go_back();v.ready('[data-single=start]');suite.route_report(p,'Back while M2 clock was running');slot='aquarium-single-investigation-v1:m2-food-transformation';stored=v.evaluate('k=>localStorage.getItem(k)',slot);assert stored
  p.wait_for_timeout(1400);assert v.evaluate('k=>localStorage.getItem(k)',slot)==stored
  p.go_forward();v.ready('[data-class-stage=observing]');after=v.evaluate('aquariumLearningSnapshot()');assert not after['running'];assert after['session']['attemptId']==before['session']['attemptId'];assert after['session']['tank']['day']>=before['session']['tank']['day'];assert v.evaluate('k=>localStorage.getItem(k)',slot)==stored
  p.wait_for_timeout(1400);assert v.evaluate('aquariumLearningSnapshot().session')==after['session'];p.screenshot(path=str(OUT/'restored-paused.png'));suite.route_report(p,'Forward restores exact saved observation, paused')
  with p.expect_download() as d:
   v.tap('[data-class=menu]');v.tap('[data-class=export]')
  f=OUT/'interrupted-observation.json';d.value.save_as(str(f));assert json.loads(f.read_text())==after['session'];v.tap('[data-class=close]');v.tap('[data-class=toggle]');assert p.evaluate('aquariumStandaloneSnapshot().resources.intervals')==4;p.go_back();v.ready('[data-single=start]');suite.route_report(p,'one resumed timer, then disposed again')
  R['checks'].append({'name':'live view saved, old storage did not change, return paused, actual export identical, single resumed clock','beforeDay':before['session']['tank']['day'],'savedDay':after['session']['tank']['day'],'savedSHA256':hashlib.sha256(stored.encode()).hexdigest(),'downloadSHA256':hashlib.sha256(f.read_bytes()).hexdigest()});assert not R['errors'] and not R['console_errors'] and not R['requests_failed'];assert not [x for x in R['requests'] if x['offline']];R['status']='passed'
 except Exception as e:
  R.update(status='failed',failure=str(e))
  try:p.screenshot(path=str(OUT/'failure.png'))
  except:pass
  raise
 finally:suite.save();b.close();print(R.get('status'),flush=True)
