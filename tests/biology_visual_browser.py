"""Focused final visual evidence, after the functional suites. Real UI, no quest-state writes."""
import json,os,subprocess
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright,expect
import sys
from biology_browser_helpers import action,activities,reveal
ROOT=Path(__file__).resolve().parents[1];OUT=Path(os.environ.get('AQUARIUM_VISUAL_RESULTS','/tmp/biology-quality-visual'))/datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S');OUT.mkdir(parents=True)
report={'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'checks':[],'screenshots':[],'errors':[]}
def passed(s):report['checks'].append(s);print('PASS',s,flush=True)
def capture(p,name,selector=None):
 if selector:
  p.locator(selector).first.scroll_into_view_if_needed()
  p.wait_for_function('(s)=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight+1}',arg=selector)
 frame=p.evaluate('window.aquariumSnapshot().graphics.renderFrame');p.wait_for_function('(f)=>window.aquariumSnapshot().graphics.renderFrame>f+2&&window.aquariumSnapshot().graphics.triangles>3000',arg=frame)
 p.screenshot(path=str(OUT/name),animations='disabled');report['screenshots'].append(name)
with sync_playwright() as w:
 engine=os.environ.get('AQUARIUM_BROWSER','chromium');report['engine']=engine
 launch={'executable_path':os.environ.get('AQUARIUM_CHROMIUM','/usr/bin/chromium'),'args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if engine=='chromium' else {}
 b=getattr(w,engine).launch(**launch)
 try:
  c=b.new_context(viewport={'width':1366,'height':1024});c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))");p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:report['errors'].append(str(e)));p.goto(os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/'));p.wait_for_function('!!window.aquariumLearningSnapshot');p.locator('[data-learn-grade="9"]').click();action(p,'missions');p.locator('[data-learn-mission="9-population"]').click();action(p,'observe');action(p,'close');p.locator('[data-quest-answer="0"]').click();p.locator('[data-quest-answer="1"]').click();action(p,'investigate');reveal(p.locator('[data-learning-repetitions]')).fill('2')
  p.locator('[data-learning-environment]').select_option('neutral');action(p,'population-compare');expect(p.locator('.learn-results')).to_contain_text('Keine Farbe hat hier einen Vorteil');capture(p,'population-neutral.png','.learn-chart');passed('Neutral population actual curve and correct drift explanation')
  p.locator('[data-learning-environment]').select_option('dark');action(p,'population-compare');expect(p.locator('.learn-results')).to_contain_text('häufiger Nachkommen');capture(p,'population-selected.png','.learn-chart');assert 'Gruppe 1' in p.locator('.learn-chart').text_content();passed('Directed population actual curve, group legend and conditional selection explanation')
  c.close();c=b.new_context(viewport={'width':768,'height':1024},is_mobile=True,has_touch=True);c.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))");p=c.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:report['errors'].append(str(e)));p.goto(os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/'));p.wait_for_function('!!window.aquariumLearningSnapshot');p.locator('[data-learn-grade="8"]').tap();action(p,'missions',True);p.locator('[data-learn-mission="8-ecosystem"]').tap();action(p,'observe',True);action(p,'close',True);activities(p,True);p.locator('[data-quest-answer="0"]').tap();p.locator('[data-quest-answer="1"]').tap();action(p,'investigate',True);assert not p.locator('.learn-panel .device-dial').count();assert p.locator('[data-learning-value]').is_hidden();capture(p,'warming-plan-final-portrait.png');action(p,'device-temperature',True);assert p.locator('[data-equipment-value]').is_hidden();capture(p,'warming-device-final-portrait.png','.equipment-sheet');passed('Final portrait primary device path with numeric alternative and visible actual scene')
  assert not report['errors'],report['errors'];report['status']='passed'
 except Exception as e:
  report.update(status='failed',failure=str(e))
  try:p.screenshot(path=str(OUT/'failure.png'),animations='disabled')
  except Exception:pass
  raise
 finally:(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('RESULTS',OUT,flush=True);b.close()
