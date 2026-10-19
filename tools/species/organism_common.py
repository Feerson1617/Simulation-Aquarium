"""Local Blender geometry/material helpers for original organism assets."""
import bpy,math,random
from mathutils import Vector
from build_fish import mesh,tube,material,coords,linear

def vertex_material(name,color,rough=.5,alpha=1):
 mat=material(name,color,rough,alpha);mat['authoredColor']=color;node=mat.node_tree.nodes.new('ShaderNodeVertexColor');node.layer_name='NaturalColor';mat.node_tree.links.new(node.outputs['Color'],mat.node_tree.nodes.get('Principled BSDF').inputs['Base Color']);return mat

def paint(obj,color,variation=.1,custom=None):
 base=[linear(int(color.lstrip('#')[j:j+2],16)/255)for j in(0,2,4)];attribute=obj.data.color_attributes.new(name='NaturalColor',type='FLOAT_COLOR',domain='POINT')
 for vertex,c in zip(obj.data.vertices,attribute.data):
  x,z,y=vertex.co.x,-vertex.co.y,vertex.co.z;grain=math.sin(x*61+y*29+z*43)*math.sin(x*19-z*37);shade=1+variation*grain
  rgb=custom(x,y,z)if custom else base;c.color=tuple(max(0,min(1,v*shade))for v in rgb)+(1,)
 return obj

def loft(name,centers,radii,mat,sides=12,role='body'):
 # Elliptical continuous section, used for cuticle, soft foot and fleshy stems.
 verts=[];faces=[];uv=[]
 for j,(center,radius)in enumerate(zip(centers,radii)):
  for k in range(sides+1):
   angle=k*2*math.pi/sides;verts.append((center[0],center[1]+math.cos(angle)*radius[0],center[2]+math.sin(angle)*radius[1]));uv.append((j/max(1,len(centers)-1),k/sides))
  if j:
   for k in range(sides):q=(j-1)*(sides+1)+k;faces.append((q,q+1,q+sides+2,q+sides+1))
 faces.extend([tuple(range(sides,-1,-1)),tuple((len(centers)-1)*(sides+1)+k for k in range(sides+1))]);return mesh(name,verts,faces,mat,uv,role)

def leaf(name,base,length,width,angle,rise,mat,color,lod,kind='lance',ruffle=0,role='leaf'):
 rows,cols=((6,4)if lod=='desktop'else(4,2))if name=='moss-leaf'else((30,12)if lod=='desktop'else(16,6));verts=[];faces=[];uv=[]
 for j in range(rows+1):
  t=j/rows;envelope=math.sin(math.pi*t)**(.65 if kind in ['oval','heart']else.95);envelope*=1+ruffle*math.sin(t*math.pi*16)
  if kind=='heart':envelope*=1+.35*math.sin(t*math.pi*2)
  for k in range(cols+1):
   q=k/cols*2-1;dx=t*length;dz=q*width*.5*envelope;vein=.0015*math.exp(-(q/.06)**2)+.0006*math.cos(t*64+abs(q)*10)*envelope
   y=base[1]+rise*t+.045*math.sin(t*math.pi)*length+q*q*length*.04*envelope+vein
   verts.append((base[0]+math.cos(angle)*dx-math.sin(angle)*dz,y,base[2]+math.sin(angle)*dx+math.cos(angle)*dz));uv.append((k/cols,t))
  if j:
   for k in range(cols):
    if kind=='lace'and 2<j<rows-2 and k not in [0,cols//2,cols-1]and j%3!=0:continue
    q=(j-1)*(cols+1)+k;faces.append((q,q+1,q+cols+2,q+cols+1))
 obj=mesh(name,verts,faces,mat,uv,role);paint(obj,color,.12);return obj

def finish():
 groups={}
 for obj in list(bpy.context.scene.objects):
  if obj.type=='MESH' and obj.data.materials[0].get('authoredColor') and 'NaturalColor'not in obj.data.color_attributes:paint(obj,obj.data.materials[0]['authoredColor'])
  if obj.type=='MESH':groups.setdefault((obj.data.materials[0],obj.get('surfaceRole','body')),[]).append(obj)
 for(_,role),objects in groups.items():
  if len(objects)>1:
   bpy.ops.object.select_all(action='DESELECT')
   for obj in objects:obj.select_set(True)
   bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join();objects[0]['surfaceRole']=role
