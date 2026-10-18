"""Original procedural hardscape, Blender 4.3; static GLB with explicit desktop/mobile LOD.
Run: blender -b --python tools/realism/build_hardscape.py
No downloaded content, accounts, add-ons or service calls.
"""
import bpy,math,random,json,os
from pathlib import Path
from mathutils import Vector,noise
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'assets/realism';OUT.mkdir(exist_ok=True)
IDS=['root','stone','reefrock','cave','shell','spiderwood','mopani','slate','dragonstone','basaltarch','reefcave']
SIZES={'root':(1.4,.8,.95),'stone':(1.02,.76,.56),'reefrock':(1.1,.8,.64),'cave':(1.08,.76,.65),'shell':(.46,.30,.24),'spiderwood':(1.4,.85,1.18),'mopani':(1.24,.82,.73),'slate':(1.18,.82,.45),'dragonstone':(.82,.65,1.0),'basaltarch':(1.28,.8,.89),'reefcave':(1.3,.9,.72)}
COLORS={'root':(.20,.12,.065,1),'spiderwood':(.26,.17,.09,1),'mopani':(.19,.105,.045,1),'stone':(.32,.34,.31,1),'reefrock':(.53,.51,.42,1),'cave':(.34,.35,.31,1),'slate':(.27,.29,.28,1),'dragonstone':(.42,.32,.18,1),'basaltarch':(.13,.15,.15,1),'reefcave':(.61,.59,.48,1),'shell':(.62,.51,.35,1)}
def tube(points,radii,name):
 vertices=[];faces=[];sides=12
 for j,pt in enumerate(points):
  p=Vector(pt);tangent=Vector(points[min(j+1,len(points)-1)])-Vector(points[max(0,j-1)]);tangent.normalize();u=tangent.cross(Vector((0,0,1)))
  if u.length<.1:u=tangent.cross(Vector((0,1,0)))
  u.normalize();v=tangent.cross(u).normalized()
  for k in range(sides):
   angle=k*2*math.pi/sides;r=radii[j]*(1+.055*math.sin(k*4.2+j*.6));vertices.append(p+r*(math.cos(angle)*u+math.sin(angle)*v))
  if j:
   for k in range(sides):a=(j-1)*sides+k;b=(j-1)*sides+(k+1)%sides;c=j*sides+k;d=j*sides+(k+1)%sides;faces.append((a,b,d,c))
 faces.append(tuple(range(sides-1,-1,-1)));faces.append(tuple((len(points)-1)*sides+k for k in range(sides)))
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(vertices,[],faces);obj=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(obj);return obj

def rock(loc,scale,seed,flat=False):
 bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=4,radius=1,location=loc);obj=bpy.context.object;obj.name='eroded-stone'
 for v in obj.data.vertices:
  p=v.co;r=noise.fractal(p*3.2+Vector((seed,seed*.3,0)),1.0,2,3);q=noise.noise_vector(p*7.1+Vector((0,seed,0))).x
  p*=1+r*.20+q*.035
  if flat:p.z=max(-.4,min(.4,p.z))
 obj.scale=scale;return obj

def build(id):
 rng=random.Random(73+IDS.index(id));objects=[]
 if id in ['root','spiderwood','mopani']:
  branches=15 if id=='spiderwood' else 12
  for k in range(branches):
   a=k*2.399;length=.43+rng.random()*.4;height=.2+rng.random()*.65
   if id=='mopani':height*=.6
   points=[];radii=[]
   for j in range(18):
    t=j/17;points.append((math.cos(a)*length*t+math.sin(t*4+a)*.07*t,math.sin(a)*length*.65*t+math.cos(t*3+a)*.07*t,.07+height*math.sin(t*1.5)*(.28 if k<5 else 1)))
    radii.append((.09 if id=='mopani' else .055)*(1-t)**.8+.006)
   objects.append(tube(points,radii,'bark-root'))
  objects.append(rock((0,0,.11),(.18,.13,.17),4))
 elif id in ['cave','basaltarch','reefcave']:
  points=[];radii=[]
  for j in range(45):
   a=j/44*math.pi;points.append((math.cos(a)*.45,math.sin(a*2)*.035,.06+math.sin(a)*.48));radii.append(.15+math.sin(a*3)*.018)
  objects.append(tube(points,radii,'porous-stone-arch'))
  for loc in [(-.45,0,.06),(.45,0,.06)]:objects.append(rock(loc,(.2,.24,.12),7))
 elif id=='shell':
  points=[];radii=[]
  for k in range(150):
   t=k/149;a=t*math.pi*8;r=.012+(.22-.012)*t**1.7;points.append((math.cos(a)*r,math.sin(a)*r,.20*(1-t)));radii.append(.004+.07*t**1.8)
  obj=tube(points,radii,'spiral-shell');obj.data.polygons[-1].select=True;objects.append(obj)
 elif False:
  for k in range(9):
   angle=k*2.4;verts=[];faces=[]
   for j in range(17):
    t=j/16;half=math.sin(t*math.pi)**.8*.065
    for side in [-1,0,1]:
     x=(t-.5)*.32;y=side*half;verts.append((math.cos(angle)*x-math.sin(angle)*y+.1*math.cos(k),math.sin(angle)*x+math.cos(angle)*y+.1*math.sin(k),.02+side*side*.016+math.sin(t*3)*.012+k*.003))
    if j:
     for s in range(2):a=(j-1)*3+s;faces.append((a,a+1,a+4,a+3))
   mesh=bpy.data.meshes.new('curled-leaf');mesh.from_pydata(verts,[],faces);o=bpy.data.objects.new('curled-leaf',mesh);bpy.context.collection.objects.link(o);objects.append(o)
 elif id=='slate':
  for k in range(5):objects.append(rock((rng.uniform(-.12,.12),rng.uniform(-.09,.09),.035+k*.08),(.45-k*.035,.30-k*.018,.11),k+1,True))
 else:
  for k in range(3 if id=='dragonstone' else 2):objects.append(rock((rng.uniform(-.15,.15),rng.uniform(-.09,.09),.18+k*.04),(.28 if id=='dragonstone' else .40,.30,.48 if id=='dragonstone' else .28),k+IDS.index(id)))
 bpy.ops.object.select_all(action='DESELECT')
 for obj in objects:obj.select_set(True)
 bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join();obj=objects[0];obj.name=id
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 if id!='shell':
  rem=obj.modifiers.new('Organic continuous volume','REMESH');rem.mode='VOXEL';rem.voxel_size=.018;rem.use_smooth_shade=True;bpy.ops.object.modifier_apply(modifier=rem.name)
  smooth=obj.modifiers.new('Water erosion','SMOOTH');smooth.factor=.7;smooth.iterations=3;bpy.ops.object.modifier_apply(modifier=smooth.name)
  for v in obj.data.vertices:
   p=v.co;grain=noise.noise(p*22)*.004+noise.noise(p*7)*.008;p+=v.normal*grain
 # Normalize actual geometry to the declared footprint. Blender z is world vertical.
 coords=[v.co for v in obj.data.vertices];mins=Vector(tuple(min(p[a] for p in coords)for a in range(3)));maxs=Vector(tuple(max(p[a]for p in coords)for a in range(3)));size=SIZES[id]
 for v in obj.data.vertices:
  for a in range(3):v.co[a]=(v.co[a]-mins[a])/max(.001,maxs[a]-mins[a])*size[a]-(size[a]/2 if a<2 else 0)
 obj.location=(0,0,0)
 for polygon in obj.data.polygons:polygon.use_smooth=True
 colors=obj.data.color_attributes.new(name='SurfaceColor',type='FLOAT_COLOR',domain='POINT')
 base=COLORS[id]
 for v,c in zip(obj.data.vertices,colors.data):
  p=v.co;grain=noise.fractal(p*9+Vector((3,5,2)),1,2,3);shade=.82+grain*.32+noise.noise(p*35)*.07
  if id in ['root','spiderwood','mopani']:shade+=math.sin(p.z*27+p.x*8)*.035
  c.color=tuple(max(.02,min(.9,x*shade))for x in base[:3])+(1,)
 material=bpy.data.materials.new('wood'if id in ['root','spiderwood','mopani']else'stone');material.use_nodes=True;bsdf=material.node_tree.nodes.get('Principled BSDF');attr=material.node_tree.nodes.new('ShaderNodeVertexColor');attr.layer_name='SurfaceColor';material.node_tree.links.new(attr.outputs['Color'],bsdf.inputs['Base Color']);bsdf.inputs['Roughness'].default_value=.76;obj.data.materials.clear();obj.data.materials.append(material)
 return obj

manifest=json.loads((OUT/'manifest.json').read_text()) if (OUT/'manifest.json').exists() else {}
manifest.pop('leaflitter',None)
for id in (os.environ.get('AQUARIUM_ASSET_IDS','').split(',') if os.environ.get('AQUARIUM_ASSET_IDS') else IDS):
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False);obj=build(id)
 bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
 for lod,ratio in [('desktop',.60),('mobile',.20)]:
  dec=obj.modifiers.new('LOD '+lod,'DECIMATE');dec.ratio=ratio
  target=OUT/f'{id}-{lod}.glb';bpy.ops.export_scene.gltf(filepath=str(target),export_format='GLB',use_selection=True,export_apply=True,export_materials='EXPORT',export_yup=True,export_animations=False)
  obj.modifiers.remove(dec);manifest.setdefault(id,{})[lod]='./assets/realism/'+target.name
  print('ASSET',id,lod,target.stat().st_size,flush=True)
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');(ROOT/'realism-assets.mjs').write_text('export const REALISM_ASSETS = '+json.dumps(manifest)+';\n')
