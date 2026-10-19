"""Record existing species metadata and authored pigment maps, without external assets."""
import json,base64
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'assets/species/source';OUT.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']);page=browser.new_page();page.goto('http://127.0.0.1:8000/aquarium-simulation/');page.wait_for_function('typeof window.aquariumAuthorSkin === "function"')
 metadata=page.evaluate('window.aquariumGraphicsInventory()');catalog=page.evaluate('window.aquariumCatalogItems()');species={item['id']:item for item in catalog}
 for item in metadata:
  item['species']=species[item['id']]
  if item['category']=='fish' and item['id']not in ['neon','molly','clown','betta']:
   path=OUT/(item['id']+'-pigment.png')
   if not path.exists():path.write_bytes(base64.b64decode(page.evaluate('(id)=>window.aquariumAuthorSkin(id)',item['id']).split(',')[1]))
 (OUT/'inventory.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n');browser.close();print('Exported',len(metadata),'species/product records and native pigment maps')
