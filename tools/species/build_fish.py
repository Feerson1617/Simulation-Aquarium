"""Authored anatomical fish GLBs. Run Blender -b --python tools/species/build_fish.py.

Uses existing species-specific anatomy records, not substituted species scans.
The geometry adds separate curved fin membranes/rays, jaw, lips, opercula,
orbital rims, eye/cornea layers, barbels and species-specific appendages.
No photorealism acceptance is inferred from export success.
"""
import bpy,math,json,os,random
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'assets/species';SRC=OUT/'source'
ITEMS=json.loads((SRC/'inventory.json').read_text());MANIFEST=OUT/'manifest.json'
manifest=json.loads(MANIFEST.read_text())if MANIFEST.exists()else{}

def coords(p):return(p[0],-p[2],p[1])
def linear(c):return c/12.92 if c<=.04045 else((c+.055)/1.055)**2.4

def material(name,color,rough=.4,alpha=1):
 m=bpy.data.materials.new(name);m.use_nodes=True;bs=m.node_tree.nodes.get('Principled BSDF');rgb=tuple(int(color.lstrip('#')[k:k+2],16)/255 for k in(0,2,4));bs.inputs['Base Color'].default_value=tuple(linear(v)for v in rgb)+(1,);bs.inputs['Roughness'].default_value=rough;bs.inputs['Alpha'].default_value=alpha;bs.inputs['Coat Weight'].default_value=.18;bs.inputs['Coat Roughness'].default_value=.24;m.diffuse_color=rgb+(alpha,);m.use_backface_culling=False
 if alpha<1:m.surface_render_method='DITHERED'
 return m

def skin(id):
 m=material('skin','#ffffff');nodes=m.node_tree.nodes;links=m.node_tree.links;bs=nodes.get('Principled BSDF')
 for suffix,kind,inputname in [('skin.jpg','sRGB','Base Color'),('normal.png','Non-Color','Normal'),('roughness.png','Non-Color','Roughness')]:
  node=nodes.new('ShaderNodeTexImage');node.image=bpy.data.images.load(str(SRC/(id+'-'+suffix)),check_existing=True);node.image.colorspace_settings.name=kind;node.image.pack()
  if inputname=='Normal':
   normal=nodes.new('ShaderNodeNormalMap');normal.inputs['Strength'].default_value=.55;links.new(node.outputs['Color'],normal.inputs['Color']);links.new(normal.outputs['Normal'],bs.inputs['Normal'])
  else:links.new(node.outputs['Color'],bs.inputs[inputname])
 return m

def mesh(name,verts,faces,mat,uv=None,role=None):
 data=bpy.data.meshes.new(name);data.from_pydata([coords(p)for p in verts],[],faces);data.update();obj=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(obj);data.materials.append(mat)
 for polygon in data.polygons:polygon.use_smooth=True
 if uv:
  layer=data.uv_layers.new(name='UVMap')
  for poly in data.polygons:
   for loopindex in poly.loop_indices:layer.data[loopindex].uv=uv[data.loops[loopindex].vertex_index]
 obj['surfaceRole']=role or name;return obj

def tube(name,points,radii,mat,sides=8):
 verts=[];faces=[]
 for j,p in enumerate(points):
  tangent=Vector(points[min(j+1,len(points)-1)])-Vector(points[max(0,j-1)]);tangent.normalize();u=tangent.cross(Vector((0,1,0)))
  if u.length<.01:u=tangent.cross(Vector((0,0,1)))
  u.normalize();v=tangent.cross(u).normalized()
  for k in range(sides):
   angle=k*2*math.pi/sides;verts.append(tuple(Vector(p)+radii[j]*(math.cos(angle)*u+math.sin(angle)*v)))
  if j:
   for k in range(sides):a=(j-1)*sides+k;b=(j-1)*sides+(k+1)%sides;c=j*sides+k;d=j*sides+(k+1)%sides;faces.append((a,b,d,c))
 faces.extend([tuple(range(sides-1,-1,-1)),tuple((len(points)-1)*sides+k for k in range(sides))]);return mesh(name,verts,faces,mat,role=name)

def ellipsoid(name,center,radii,mat,segments=24,rings=14):
 verts=[];faces=[];uv=[]
 for j in range(rings+1):
  a=math.pi*j/rings
  for k in range(segments+1):
   b=k*2*math.pi/segments;verts.append((center[0]+radii[0]*math.sin(a)*math.cos(b),center[1]+radii[1]*math.cos(a),center[2]+radii[2]*math.sin(a)*math.sin(b)));uv.append((k/segments,j/rings))
  if j:
   for k in range(segments):p=(j-1)*(segments+1)+k;faces.append((p,p+1,p+segments+2,p+segments+1))
 return mesh(name,verts,faces,mat,uv,name)

def radius(a,t):
 blunt=a.get('headBluntness',.4);kind=a['bodyShape'];controls=[(0,.09+blunt*.1),(.025,.22+blunt*.18),(.10,.62+blunt*.12),(.26,.96),(.43,1),(.65,.78),(.84,.39),(.96,.19),(1,.17)]
 if kind=='eel':controls=[(0,.22),(.04,.65),(.16,.96),(.45,1),(.7,.83),(.9,.51),(1,.26)]
 if kind in ['catfish','sucker','goby','blenny']:controls=[(0,.27),(.035,.62),(.16,1),(.3,.97),(.55,.73),(.78,.43),(.94,.23),(1,.19)]
 for (x,y),(xx,yy) in zip(controls,controls[1:]):
  if x<=t<=xx:u=(t-x)/(xx-x);u=u*u*(3-2*u);return y+(yy-y)*u
 return controls[-1][1]

def build(item,lod):
 id=item['id'];a=item['anatomy'];rng=random.Random(id);desktop=lod=='desktop';s=a.get('length',.6);length=s*a.get('bodyLength',.76);height=s*a.get('bodyHeight',.29);depth=s*a.get('bodyDepth',.15);front=s*.43;tail=front-length
 bodymat=skin(id);finmats={k:material('fin:'+k,a.get('finColors',{}).get(k,a.get('bodyColor','#aa9988')),.4,a.get('finOpacity',.75))for k in ['dorsal','anal','caudal','pectoral','pelvic']};raymat=material('fin-rays',a.get('bodyColor','#aaa58d'),.72,.42);iris=material('iris',a.get('eyeRingColor','#b89a4c'),.28);pupil=material('pupil','#070b0a',.12);cornea=material('cornea','#d0e5e6',.08,.12);lipmat=material('lip',a.get('bellyColor','#c8bfad'),.45)
 rings,sides=(112,48)if desktop else(48,24);verts=[];faces=[];uv=[]
 for j in range(rings+1):
  t=j/rings;r=radius(a,t);x=front-length*t
  for k in range(sides+1):
   angle=k*2*math.pi/sides;cos=math.cos(angle);sin=math.sin(angle);flat=a['bodyShape']in ['catfish','sucker','goby','blenny'];y=cos*height*.5*r*(.65 if flat and cos<0 else 1);z=sin*depth*.5*r
   # Eye sockets and paired opercular volume belong to the continuous head mesh.
   if t<.29:
    socket=math.exp(-((t-.105)/.042)**2)*math.exp(-((cos-.35)/.35)**2);z*=1-.08*socket
    z*=1+.045*math.exp(-((t-.245)/.045)**2)
   if a['bodyShape']=='eel':z+=math.sin(t*5)*s*.008
   verts.append((x,y,z));uv.append((t,(cos+1)/2))
  if j:
   for k in range(sides):p=(j-1)*(sides+1)+k;faces.append((p,p+1,p+sides+2,p+sides+1))
 faces.extend([tuple(range(sides,-1,-1)),tuple(rings*(sides+1)+k for k in range(sides+1))]);body=mesh('skin',verts,faces,bodymat,uv,'skin')
 if id in ['guppy','endler','swordtail']:
  body.shape_key_add(name='Basis');female=body.shape_key_add(name='female')
  for p in female.data:p.co.z*=1.10;p.co.y*=1.14

 def membrane(name,root,edge,mat,count=40):
  strips=10 if desktop else 5;verts=[];faces=[];uv=[]
  for j in range(count+1):
   u=j/count;start=Vector(root(u));end=Vector(edge(u));delta=end-start
   for k in range(strips+1):
    v=k/strips;p=start+delta*v;p.z+=math.sin(u*math.pi*18)*s*.0018*math.sin(v*math.pi);verts.append(tuple(p));uv.append((u,v))
   if j:
    for k in range(strips):p=(j-1)*(strips+1)+k;faces.append((p,p+1,p+strips+2,p+strips+1))
  fin=mesh(name,verts,faces,mat,uv,'fin')
  # Individual fin rays follow the same curved membrane, with tapered tips.
  for j in range(1,15 if desktop else 9):
   u=j/(15 if desktop else 9);start=Vector(root(u));end=Vector(edge(u));pts=[]
   for k in range(9):
    t=k/8;p=start.lerp(end,t);p.z+=math.sin(u*math.pi*18)*s*.0018*math.sin(t*math.pi);pts.append(tuple(p))
   tube(name+'-ray',pts,[s*.0006*(1-k/9)+s*.0001 for k in range(9)],raymat,5)
  if id in ['guppy','endler','swordtail']:
   fin.shape_key_add(name='Basis');female=fin.shape_key_add(name='female')
   for j,p in enumerate(female.data):
    u=(j//(strips+1))/count;rootp=Vector(coords(root(u)));p.co=rootp+(p.co-rootp)*.57
  return fin

 for name,spec,sign in [('dorsal',a['dorsal'],1),('anal',a['anal'],-1)]+([('second-dorsal',a['secondDorsal'],1)]if a.get('secondDorsal')else[]):
  start,end=spec['start'],spec['end'];kind=spec.get('shape','rounded');mat=finmats['anal'if sign<0 else'dorsal']
  def root(u,start=start,end=end,sign=sign):
   t=start+(end-start)*u;return(front-length*t,sign*height*.46*radius(a,t),0)
  def edge(u,start=start,end=end,sign=sign,spec=spec,kind=kind):
   x,y,z=root(u);wave=math.sin(math.pi*u)**(.45 if kind=='sail'else.8);spines=1-.10*abs(math.sin(u*math.pi*12))if kind=='spiny'else 1;return(x-length*.035*math.sin(u*math.pi),y+sign*s*spec['height']*wave*spines,z)
  membrane(name,root,edge,mat,40 if desktop else 24)
 tailSpec=a['caudal'];tailLength=s*tailSpec.get('length',.2);tailHeight=s*tailSpec.get('height',.25)
 def tailroot(u):return(tail,height*.065*(2*u-1),0)
 def tailedge(u):
  v=2*u-1;kind=tailSpec['shape'];reach=(.42+.58*abs(v)**.8)if kind in ['forked','lunate']else math.sqrt(max(.1,1-v*v*.35))if kind in ['rounded','fan']else 1-.12*abs(v)
  return(tail-tailLength*reach,tailHeight*.5*v,s*.005*math.sin(u*math.pi))
 membrane('tail',tailroot,tailedge,finmats['caudal'],52 if desktop else 28)
 for side in [-1,1]:
  for kind,t,startheight in [('pectoral',.24,.0),('pelvic',.43,-.22)]:
   base=(front-length*t,height*startheight,side*depth*.43*radius(a,t));reach=s*a.get(kind+'Length',.10);width=s*a.get(kind+'Width',.07)
   membrane(kind+('-left'if side<0 else'-right'),lambda u,base=base:(base[0]-u*width*.16,base[1],base[2]),lambda u,base=base,reach=reach,width=width,side=side:(base[0]-reach*math.sin(u*math.pi)**.7,base[1]-(u-.25)*width,base[2]+side*reach*.65*math.sin(u*math.pi)),finmats[kind],24 if desktop else 14)
  eyeX=front-length*.105;eyeY=height*.18;eyeZ=side*depth*.43*radius(a,.105);eyeR=s*a.get('eyeRadius',.025)
  ellipsoid('eye-iris-'+str(side),(eyeX,eyeY,eyeZ),(eyeR,eyeR,eyeR*.42),iris,24 if desktop else 16,12)
  ellipsoid('eye-pupil-'+str(side),(eyeX+s*.001,eyeY,eyeZ+side*eyeR*.34),(eyeR*.57,eyeR*.64,eyeR*.21),pupil,24 if desktop else 16,12)
  ellipsoid('eye-cornea-'+str(side),(eyeX,eyeY,eyeZ+side*eyeR*.33),(eyeR*.9,eyeR*.95,eyeR*.23),cornea,24 if desktop else 16,12)
  points=[]
  for j in range(30):
   t=-1.18+j/29*2.45;points.append((front-length*.23+math.cos(t)*s*.018,math.sin(t)*height*.37,side*depth*.48*radius(a,.23)))
  tube('operculum',points,[s*.0011]*30,lipmat,6)
  if a.get('pelvicThread'):
   amount=s*a['pelvicThread'];pts=[(front-length*.42-t*amount*.2,-height*.35-t*amount,side*depth*.2+math.sin(t*3)*s*.01)for t in [j/24 for j in range(25)]];tube('pelvic-filament',pts,[s*.001*(1-j/25)+s*.0003 for j in range(25)],finmats['pelvic'],6)
 mouthY=(-height*.14 if a.get('snout')=='inferior'else height*.08 if a.get('snout')=='superior'else 0);mouthSize=s*a.get('mouthSize',.025);points=[]
 for j in range(33):
  angle=j/32*math.pi*2;points.append((front+s*.002+math.cos(angle)*s*.002,mouthY+math.sin(angle)*mouthSize*.28,math.cos(angle)*mouthSize*.7))
 tube('mouth-lips',points,[s*.0013]*33,lipmat,6)
 for k in range(a.get('barbelCount',0)):
  side=-1 if k%2 else 1;amount=s*a.get('barbel',.025);pts=[(front-t*amount*.4,mouthY-t*amount*.3,side*(mouthSize*.4+t*amount))for t in [j/18 for j in range(19)]];tube('barbel',pts,[s*.0013*(1-j/20)for j in range(19)],lipmat,6)
 if a.get('sword'):
  amount=s*a['sword'];tube('sword-extension',[(tail-tailLength*.7-t*amount,-tailHeight*.4-t*amount*.18,0)for t in[j/24 for j in range(25)]],[s*.004*(1-j/25)+s*.0003 for j in range(25)],finmats['caudal'],8)
 if a.get('adipose'):
  spec={'start':.73,'end':.81,'height':.035};root=lambda u:(front-length*(.73+u*.08),height*.4*radius(a,.73+u*.08),0);edge=lambda u:(root(u)[0],root(u)[1]+s*.035*math.sin(u*math.pi),0);membrane('adipose',root,edge,finmats['dorsal'],12)
 for obj in bpy.context.scene.objects:
  if obj.type=='MESH':obj['species']=id;obj['authorship']='Original anatomy reconstruction; not a specimen scan'

ids=set(os.environ.get('AQUARIUM_SPECIES_IDS','').split(','))if os.environ.get('AQUARIUM_SPECIES_IDS')else None
for item in ITEMS:
 id=item['id']
 if item['category']!='fish' or id in ['neon','molly','clown','betta']or(ids and id not in ids):continue
 for lod in ['desktop','mobile']:
  target=OUT/(id+'-'+lod+'.glb')
  if target.exists()and not os.environ.get('AQUARIUM_REBUILD'):manifest.setdefault(id,{})[lod]='./assets/species/'+target.name;continue
  bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
  build(item,lod)
  groups={}
  for obj in list(bpy.context.scene.objects):
   if obj.type=='MESH' and not obj.data.shape_keys:groups.setdefault(obj.data.materials[0],[]).append(obj)
  for mat,objects in groups.items():
   if len(objects)<2:continue
   bpy.ops.object.select_all(action='DESELECT')
   for obj in objects:obj.select_set(True)
   bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join()
  bpy.ops.object.select_all(action='SELECT')
  bpy.ops.export_scene.gltf(filepath=str(target),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_animations=False,export_extras=True,export_image_format='AUTO',export_keep_originals=False)
  manifest.setdefault(id,{})[lod]='./assets/species/'+target.name
  MANIFEST.write_text(json.dumps(manifest,indent=2)+'\n');(ROOT/'species-assets.mjs').write_text('export const SPECIES_ASSETS = '+json.dumps(manifest)+';\n');print('FISH',id,lod,target.stat().st_size,flush=True)
print('Fish GLB build complete',len(manifest))
