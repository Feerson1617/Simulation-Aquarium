"""Generate exact-entry WebP model previews locally. No provider, API or remote asset."""
import json,base64
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
def revision(item):return 'photo-volume-4' if item['id'] in ['neon','molly','clown','nana','vallis','betta'] else 'species-glb-1' if item.get('provenance',{}).get('kind')=='authored-glb' else 'organic-3' if item.get('category') in ['fish','plant'] else 'realism-2'
previous=json.loads((ROOT/'assets/catalog/manifest.json').read_text())
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page();page.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'high'}))");page.goto('http://127.0.0.1:8000/aquarium-simulation/');page.wait_for_function('typeof window.aquariumCatalogItems === "function"')
 items=page.evaluate('window.aquariumCatalogItems()');(ROOT/'assets/catalog/items.json').write_text(json.dumps(items,ensure_ascii=False,indent=2))
 manifest={}
 for n,item in enumerate(items):
  target=ROOT/'assets/catalog'/f'{item["id"]}.webp'
  if not target.exists() or previous.get(item['id'],{}).get('renderRevision')!=revision(item):
   data=page.evaluate('(id)=>window.aquariumCatalogRender(id)',item['id']);target.write_bytes(base64.b64decode(data.split(',')[1]))
  asset=item.get('provenance') or {};external=asset.get('source') or asset.get('sourceUrl') or ''
  manifest[item['id']]={'src':'./assets/catalog/'+target.name,'kind':'Modellvorschau' if item.get('category') else 'Produktmodell (schematisch)','credit':asset.get('author','Eigene Spielmodelle / lokale Three.js-Darstellung'),'license':asset.get('license','Repository-Projektcode; Three.js MIT'),'source':external,'provenance':asset,'bytes':target.stat().st_size,'renderRevision':revision(item),'renderProfile':'high'}
  if n%10==0:
   previous.update(manifest);(ROOT/'assets/catalog/manifest.json').write_text(json.dumps(previous,ensure_ascii=False,indent=2));print(n+1,'/',len(items),flush=True)
 (ROOT/'assets/catalog/manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
 (ROOT/'catalog-assets.mjs').write_text('export const PRODUCT_IMAGES = '+json.dumps(manifest,ensure_ascii=False)+';\n')
 b.close();print('Generated',len(manifest),'previews',sum(v['bytes'] for v in manifest.values()),'bytes',flush=True)
