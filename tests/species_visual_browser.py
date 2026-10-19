"""Bounded final visual checks after shell and livebearer morphology corrections."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path('/tmp/aquarium-last-visual');OUT.mkdir(exist_ok=True)
IDS=['ramshorn','nerite','trumpet','bladder','assassin','trochus','cerith','nassarius','hermit']
report={'errors':[],'audits':[]}
def click(page,selector):page.locator(selector).filter(visible=True).first.click()
with sync_playwright()as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']);page=browser.new_page(viewport={'width':1250,'height':900});page.set_default_timeout(90000);page.on('pageerror',lambda e:report['errors'].append(str(e)))
 try:
  page.goto('http://127.0.0.1:8000/aquarium-simulation/');click(page,'button[data-graphics-profile="ipad"]');click(page,'[data-start="free"]');click(page,'[data-act="choose-tank"]');click(page,'[data-buy="tank-120"]');click(page,'[data-act="place-tank"]');click(page,'[data-panel="shop"]');click(page,'[data-department="tiere"]');click(page,'[data-species="swordtail"]')
  page.locator('[data-fish-sex]').select_option('♀');page.wait_for_function('window.aquariumShopAppearance()?.sex==="♀"');page.locator('#shop-specimen-stage').screenshot(path=str(OUT/'swordtail-female.png'),timeout=120000);page.evaluate('window.__testedPreviewCanvas=document.querySelector("#shop-specimen-stage canvas")')
  page.locator('[data-fish-sex]').select_option('♂');page.wait_for_function('window.aquariumShopAppearance()?.sex==="♂"');assert page.evaluate('window.__testedPreviewCanvas===document.querySelector("#shop-specimen-stage canvas")');page.locator('#shop-specimen-stage').screenshot(path=str(OUT/'swordtail-male.png'),timeout=120000);click(page,'[data-act="close-modal"]');click(page,'[data-act="close-panel"]')
  click(page,'#genetics-button')
  for species in IDS:
   audit=page.evaluate('(id)=>window.aquariumModelAudit(id)',species);assert audit['revision']=='species-1'and audit['triangles']>0 and all(x>0 for x in audit['size']),audit;report['audits'].append(audit)
  click(page,'[data-gen-close]');click(page,'[data-act="specimen-gallery"]')
  for species in ['nerite','trumpet','ramshorn']:
   if not page.locator(f'[data-preview="{species}"]').count():click(page,'[data-specimen-category="invert"]')
   click(page,f'[data-preview="{species}"]');page.wait_for_function('(id)=>document.querySelector("#specimen-stage")?.dataset.ready===id',arg=species);page.locator('#specimen-stage').screenshot(path=str(OUT/f'closed-shell-{species}.png'),timeout=120000);click(page,'#modal-root [data-act="specimen-gallery"]')
  assert not report['errors'],report['errors'];report.update(status='passed',reusedPreviewRenderer=True)
  print('PASS: Actual sex-specific live preview reuses the canvas; nine revised shell paths load, and closed-shell close-ups are captured.',flush=True)
 except Exception as error:report.update(status='failed',failure=str(error));raise
 finally:
  (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));browser.close()
