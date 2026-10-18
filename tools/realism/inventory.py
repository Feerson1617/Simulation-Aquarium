"""Complete inventory; status is conservative until per-entry visual acceptance."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[2]
items=json.loads((ROOT/'assets/catalog/items.json').read_text())
rows=[]
for item in items:
 category=item.get('category',item.get('type'));source=item.get('provenance',{})
 rows.append({'id':item['id'],'name':item['name'],'category':category,'original':source.get('kind','procedural' if category=='decor' else 'schematic-product'),'references':source.get('references',[]) or [source.get('sourceUrl','')],
 'runtime':category not in ['food','additive'],'status':'Noch deutlich vereinfachtes Modell vorhanden' if category!='fish' or item['id']!='betta' else 'Originales realistisches 3D-Modell integriert; visuelle Prüfung offen',
 'change':'Bestand erfasst; Überarbeitung in Arbeit','desktop':'offen','ipad':'offen','photorealisticAccepted':False})
(ROOT/'docs/realism/catalog-inventory.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
print('Inventoried',len(rows),'entries')
