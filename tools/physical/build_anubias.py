"""Single-species hand-authored botanical study with licensed photographic UVs.
Run Blender -b --python tools/physical/build_anubias.py. Writes review files only.
The unchanged source photograph is mapped through explicit leaf-outline landmarks.
No AI inference, billboard, plant-generator bulk export or photographic acceptance.
"""
import sys,math,json,hashlib
from pathlib import Path
import bpy
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'tools/species'))
from build_fish import mesh,tube,material
OUT=Path('/tmp/aquarium-botanical-review');OUT.mkdir(exist_ok=True)
PHOTO=ROOT/'docs/ui-model-review/comparison/reference-anubias-isolated.jpg'
# Pixel bounds on one broad, visibly veined leaf, from petiole to apical tip.
OUTLINE=[(0,(548,272),(548,272)),(.15,(549,245),(570,293)),(.35,(565,211),(601,301)),(.60,(606,192),(638,283)),(.85,(651,198),(667,239)),(1,(679,204),(679,204))]
PIXEL_CACHE={}
def pixel(t,q):
 key=round(t,6)
 if key not in PIXEL_CACHE:
  cx,cy=548+131*t,272-68*t;nx,ny=.4607,.8876
  def green(x,y):
   x=max(0,min(799,round(x)));y=max(0,min(512,round(y)));k=((512-y)*800+x)*4;r,g,b=PHOTO_PIXELS[k:k+3];return g>r*1.30 and g>b*1.40 and g<.38 and r<.24
  if not green(cx,cy):
   for offset in sorted(range(-35,36),key=abs):
    if green(cx+nx*offset,cy+ny*offset):cx+=nx*offset;cy+=ny*offset;break
  if not green(cx,cy):cx,cy=600,230
  lo=hi=0
  for step in range(1,50):
   if not green(cx-nx*step,cy-ny*step):break
   lo=-step*.80
  for step in range(1,50):
   if not green(cx+nx*step,cy+ny*step):break
   hi=step*.80
  PIXEL_CACHE[key]=(cx,cy,nx,ny,lo,hi)
 cx,cy,nx,ny,lo,hi=PIXEL_CACHE[key];offset=lo*(1-q)+hi*q;return [cx+nx*offset,cy+ny*offset]
def blade(name,base,length,width,angle,rise,roll,mat,lod):
 rows,cols=(36,14)if lod=='desktop'else(18,6);verts=[];faces=[];uv=[]
 for j in range(rows+1):
  t=j/rows;envelope=max(.001,math.sin(math.pi*t)**.66*(1+.25*math.sin(2*math.pi*t)))
  for k in range(cols+1):
   q=k/cols*2-1;u=t*length;cross=q*width*.5*envelope;v=cross*math.cos(roll)
   # Trough midrib, raised lateral lamina, slightly down-curled margins.
   veins=.0006*math.cos(t*math.pi*16-abs(q)*4)*envelope
   y=base[1]+rise*t+cross*math.sin(roll)+length*.13*math.sin(math.pi*t)+width*.09*(1-q*q)*envelope+veins
   verts.append((base[0]+math.cos(angle)*u-math.sin(angle)*v,y,base[2]+math.sin(angle)*u+math.cos(angle)*v));px,py=pixel(t,(q+1)/2);uv.append((px/800,1-py/513))
  if j:
   for k in range(cols):a=(j-1)*(cols+1)+k;faces.append((a,a+1,a+cols+2,a+cols+1))
 obj=mesh(name,verts,faces,mat,uv,'leaf');solid=obj.modifiers.new('Actual lamina thickness','SOLIDIFY');solid.thickness=.0008;solid.offset=0;return obj
for lod in ['desktop','mobile']:
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False);bpy.data.orphans_purge(do_recursive=True)
 leaf=material('Anubias photographed lamina','#ffffff',.74);bs=leaf.node_tree.nodes.get('Principled BSDF');bs.inputs['Coat Weight'].default_value=.025;bs.inputs['Specular IOR Level'].default_value=.25;leaf['photographicLeaf']=True
 image=bpy.data.images.load(str(PHOTO),check_existing=True);image.pack();PHOTO_PIXELS=list(image.pixels);PIXEL_CACHE.clear();node=leaf.node_tree.nodes.new('ShaderNodeTexImage');node.image=image;leaf.node_tree.links.new(node.outputs['Color'],bs.inputs['Base Color'])
 stem=material('Living green petiole','#55783c',.76);root=material('Adventitious root','#b7b59b',.9);stem.node_tree.nodes.get('Principled BSDF').inputs['Coat Weight'].default_value=0
 rhizome=[(-.12,.015,-.025),(-.06,.025,.018),(0,.035,.025),(.07,.023,.015),(.13,.018,-.015)];tube('creeping-rhizome',rhizome,[.009,.014,.016,.013,.007],stem,12 if lod=='desktop'else 8)
 for k in range(11):
  angle=k*2.399+.4;base=(-.075+k*.014,.025,.022*math.sin(k));height=.23+.22*((k*.618)%1);length=.23+(k%3)*.025;width=length*(.56+(k%2)*.07);reach=.07+(k%3)*.025
  tip=(base[0]+math.cos(angle)*reach,height,base[2]+math.sin(angle)*reach);points=[]
  for j in range(13 if lod=='desktop'else 7):
   t=j/(12 if lod=='desktop'else 6);points.append((base[0]+(tip[0]-base[0])*t*t,base[1]+(tip[1]-base[1])*t,base[2]+(tip[2]-base[2])*t*t))
  tube('curved-petiole',points,[.0031*(1-j/(len(points)*2))for j in range(len(points))],stem,9 if lod=='desktop'else 6)
  blade('photographic-broad-leaf',tip,length,width,angle,.09 if k%4==0 else -.04,[.85,-.65,.35,-.9,.5,.75,-.25,.9,-.6,.4,-.75][k],leaf,lod)
 for k in range(32 if lod=='desktop'else 20):
  x=.06*math.sin(k*2.399)-.015;angle=k*2.399;points=[]
  for j in range(9 if lod=='desktop'else 5):
   t=j/(8 if lod=='desktop'else 4);points.append((x+math.cos(angle)*.045*t+.009*math.sin(t*6+k)*t,.016-.11*t*(.4+.6*(k%7)/6),.015*math.cos(angle)+math.sin(angle)*.045*t+.007*math.sin(t*5+k)))
  tube('adventitious-root',points,[.0014*(1-j/(len(points)+.5))for j in range(len(points))],root,5 if lod=='desktop'else 4)
 bpy.ops.object.select_all(action='SELECT');path=OUT/f'anubias-{lod}.glb';bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_animations=False,export_extras=True,export_image_format='AUTO',export_keep_originals=False)
 print('PHOTO BOTANY',lod,path.stat().st_size,flush=True)
(OUT/'provenance.json').write_text(json.dumps({'species':'Anubias barteri','photographicReferenceVariety':'var. nana','method':'Explicitly authored rhizome, curved petioles, thick curved broad blades and adventitious roots; photographic UV coordinates from a documented leaf outline. No AI inference.','photo':str(PHOTO.relative_to(ROOT)),'sha256':hashlib.sha256(PHOTO.read_bytes()).hexdigest(),'author':'Abhik.Mazumdar.73','license':'CC-BY-4.0','source':'https://commons.wikimedia.org/wiki/File:Anubias_barteri_var._nana.jpg','photoOutlinePixels':OUTLINE,'uvRefinement':'Read-only photographic green-lamina sampling along the selected midrib; discard background pixels with a conservative inner margin.','visualAcceptance':'pending actual browser comparison'},ensure_ascii=False,indent=2)+'\n')
