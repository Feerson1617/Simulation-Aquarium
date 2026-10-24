import json,time,os
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT=Path('/workspace/Simulation-Aquarium/docs/coherent-learning/evidence/preview-webkit');OUT.mkdir(exist_ok=True)
URL='https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/'
r={'url':URL,'browser':'WebKit 26.5; Linux software rendering; configured trusted CA','errors':[],'failed_requests':[],'http_errors':[]}
with sync_playwright() as pw:
 b=pw.webkit.launch(executable_path=os.environ['AQUARIUM_WEBKIT'])
 c=b.new_context(viewport={'width':768,'height':1024},has_touch=True,is_mobile=True)
 c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
 p=c.new_page();p.set_default_timeout(120000)
 p.on('pageerror',lambda e:r['errors'].append(str(e)))
 p.on('requestfailed',lambda q:r['failed_requests'].append(q.url))
 p.on('response',lambda s:r['http_errors'].append({'url':s.url,'status':s.status}) if s.status>=400 and not s.url.endswith('/favicon.ico') else None)
 try:
  start=time.monotonic();p.goto(URL);p.wait_for_function('!!window.aquariumLearningSnapshot')
  p.locator('[data-learn-grade="8"]').click();p.locator('[data-learn="missions"]').click();p.locator('[data-learn-mission="8-ecosystem"]').click()
  p.wait_for_function('window.aquariumLearningSnapshot().prototype.render.sides.length===2&&window.aquariumLearningSnapshot().prototype.render.sides.every(s=>s.detailModels===19)')
  r['ready_seconds']=time.monotonic()-start;r['initial']=p.evaluate('window.aquariumLearningSnapshot()')
  assert all(s['temp']==25 for s in r['initial']['viewSamples'].values())
  assert r['initial']['prototype']['render']['contexts']==1
  p.screenshot(path=str(OUT/'portrait-start.png'))
  # Exercise a real device on the deployed project subpath, with no module imports or test-state injection.
  p.locator('[data-learn="device-temperature"]').click()
  p.locator('.device-dial').press('ArrowUp');p.locator('[data-equipment-save]').click()
  r['changed']=p.evaluate('window.aquariumLearningSnapshot()');assert r['changed']['study']['value']==25.5
  assert all(s['temp']==25 for s in r['changed']['viewSamples'].values())
  p.reload();p.wait_for_function('!!window.aquariumLearningSnapshot')
  p.locator('[data-learn-grade="8"]').click();p.locator('[data-learn="missions"]').click();p.locator('[data-learn-mission="8-ecosystem"]').click()
  assert p.evaluate('window.aquariumLearningSnapshot().study.value')==25.5
  assert not r['errors'] and not r['failed_requests'] and not r['http_errors'];r['status']='passed'
  print('PASS remote PR preview: both real views/assets, heater action and persisted plan reload')
 finally:
  (OUT/'report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2));b.close()
