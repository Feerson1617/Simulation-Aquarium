"""Adjacent expert tools: real six analysis tabs and device changes without advancing biology."""
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright,expect
import os,json,subprocess
ROOT=Path(__file__).resolve().parents[1];OUT=Path(os.environ.get('AQUARIUM_EXPERT_TOOLS_RESULTS','/tmp/r-expert-tools'));OUT.mkdir(parents=True,exist_ok=True);URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
r={'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'checks':[],'errors':[],'console_errors':[],'failed_requests':[]}
with sync_playwright() as pw:
 b=pw.webkit.launch(executable_path=os.environ['AQUARIUM_WEBKIT']);r['version']=b.version;c=b.new_context(viewport={'width':1366,'height':1024},has_touch=True);c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))");p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:r['errors'].append(str(e)));p.on('console',lambda m:r['console_errors'].append(m.text) if m.type=='error' else None);p.on('requestfailed',lambda q:r['failed_requests'].append(q.url))
 def state():return p.evaluate('JSON.parse(localStorage.getItem("aquarium-scenario-v1:foodweb"))')
 try:
  p.goto(URL+'?expert=1');p.locator('[data-scenarios]').tap();p.locator('[data-scenario-start=foodweb]').tap();p.wait_for_function('!!aquariumAnalysisSnapshot()');before=state();p.locator('#ecosystem-button').tap();initial=p.evaluate('aquariumAnalysisSnapshot()')
  for tab in ['web','microbes','nitrogen','carbon','energy','factors']:
   p.locator('[data-eco-tab='+tab+']').tap();assert p.locator('.study-content').inner_text().strip();assert p.evaluate('aquariumAnalysisSnapshot()')==initial
  p.screenshot(path=str(OUT/'analysis-tabs.png'));p.locator('[data-eco-close]').tap();assert state()==before;r['checks'].append('six real ecosystem tabs use the same actual state without advancing or rewriting it')
  for key,value,field in [('filter','40','flow'),('light','10','hours'),('temperature','26,5','setTemp')]:
   old=state();p.locator('[data-equipment='+key+']').tap();expect(p.locator('.equipment-sheet')).to_be_visible()
   for detail in p.locator('.device-numeric:not([open]) > summary').all():detail.tap()
   p.locator('[data-equipment-value]').fill(value);p.locator('[data-equipment-save]').press('Enter');assert state()[field]==float(value.replace(',','.'));assert state()['day']==old['day'];assert state()['params']==old['params'];assert state()['entities']==old['entities'];assert p.evaluate('document.activeElement!==document.body&&document.activeElement.isConnected');r['checks'].append(key+': actual device edit persisted, focus remains reachable, no invented biology or elapsed day')
  p.screenshot(path=str(OUT/'devices-persisted.png'));after=state();p.reload();p.locator('[data-scenarios]').tap();p.locator('[data-scenario-start=foodweb]').tap();assert all(state()[k]==after[k] for k in ['flow','hours','setTemp','day','entities','params']);r['checks'].append('expert device values and actual aquarium survive reload in their own scenario slot');assert not r['errors'] and not r['console_errors'] and not r['failed_requests'];r['status']='passed'
 except Exception as e:r.update(status='failed',failure=str(e));raise
 finally:(OUT/'report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2));b.close();print(r.get('status'),flush=True)
