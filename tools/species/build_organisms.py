"""Export the remaining native plants, invertebrates and corals as real GLBs."""
import sys,os,json,math
from pathlib import Path
import bpy
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(Path(__file__).resolve().parent))
import build_plants,build_invertebrates,build_corals
from organism_common import finish
OUT=ROOT/'assets/species';SRC=OUT/'source';items=json.loads((SRC/'inventory.json').read_text());manifest=json.loads((OUT/'manifest.json').read_text())
selected=set(os.environ.get('AQUARIUM_SPECIES_IDS','').split(','))if os.environ.get('AQUARIUM_SPECIES_IDS')else None
for item in items:
 id=item['id'];category=item['category']
 if category not in ['plant','invert','coral']or id in ['nana','vallis']or(selected and id not in selected):continue
 builder={'plant':build_plants,'invert':build_invertebrates,'coral':build_corals}[category]
 for lod in os.environ.get('AQUARIUM_LODS','desktop,mobile').split(','):
  target=OUT/(id+'-'+lod+'.glb')
  if target.exists()and not os.environ.get('AQUARIUM_REBUILD'):manifest.setdefault(id,{})[lod]='./assets/species/'+target.name;continue
  bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False);bpy.data.orphans_purge(do_local_ids=True,do_linked_ids=True,do_recursive=True);builder.build(item,lod);finish()
  for obj in bpy.context.scene.objects:
   if obj.type=='MESH':obj['species']=id;obj['authorship']='Original species-aware procedural anatomy; visual acceptance separate'
  bpy.ops.object.select_all(action='SELECT');bpy.ops.export_scene.gltf(filepath=str(target),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_animations=False,export_extras=True,export_image_format='AUTO',export_keep_originals=False)
  manifest.setdefault(id,{})[lod]='./assets/species/'+target.name
  temp=OUT/'manifest.json.tmp';temp.write_text(json.dumps(manifest,indent=2)+'\n');temp.replace(OUT/'manifest.json');temp=ROOT/'species-assets.mjs.tmp';temp.write_text('export const SPECIES_ASSETS = '+json.dumps(manifest)+';\n');temp.replace(ROOT/'species-assets.mjs');print('ORGANISM',id,lod,target.stat().st_size,flush=True)
print('Complete',len(manifest),'new species model entries')
