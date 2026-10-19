"""Loss-bounded glTF mesh quantization, no decoder/download required in Three.js.

Positions within [-1,1] retain <1/32767 source-unit precision. Normals/tangents
use normalized 16-bit components, UVs 16-bit unsigned and vertex colours 8-bit.
Images and topology are preserved. Sparse/interleaved accessors are decoded.
"""
from pathlib import Path
import json,struct,sys
import numpy as np
DTYPES={5120:'i1',5121:'u1',5122:'<i2',5123:'<u2',5125:'<u4',5126:'<f4'}
COUNTS={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT2':4,'MAT3':9,'MAT4':16}

def quantize(path):
 path=Path(path);raw=path.read_bytes();size=struct.unpack_from('<I',raw,12)[0];doc=json.loads(raw[20:20+size]);binary=raw[28+size:]
 if doc.get('asset',{}).get('extras',{}).get('quantizationRevision')==2:return {'file':path.name,'unchanged':True}
 semantics={}
 for mesh in doc.get('meshes',[]):
  for primitive in mesh['primitives']:
   for name,index in primitive.get('attributes',{}).items():semantics[index]=name
   for target in primitive.get('targets',[]):
    for name,index in target.items():semantics[index]=name
 views=doc.get('bufferViews',[])
 def decode_view(index,offset,count,width,dtype):
  view=views[index];dt=np.dtype(dtype);stride=view.get('byteStride',dt.itemsize*width);start=view.get('byteOffset',0)+offset
  return np.ndarray((count,width),dtype=dt,buffer=binary,offset=start,strides=(stride,dt.itemsize)).copy()
 def decode(a):
  width=COUNTS[a['type']];dtype=DTYPES[a['componentType']]
  array=decode_view(a['bufferView'],a.get('byteOffset',0),a['count'],width,dtype)if'bufferView'in a else np.zeros((a['count'],width),dtype=dtype)
  if 'sparse'in a:
   sp=a['sparse'];indices=decode_view(sp['indices']['bufferView'],sp['indices'].get('byteOffset',0),sp['count'],1,DTYPES[sp['indices']['componentType']]).ravel();values=decode_view(sp['values']['bufferView'],sp['values'].get('byteOffset',0),sp['count'],width,dtype);array[indices]=values
  return array
 output=bytearray();outviews=[];saved=0
 def append(data,target=None):
  while len(output)%4:output.append(0)
  view={'buffer':0,'byteOffset':len(output),'byteLength':len(data)}
  if target:view['target']=target
  outviews.append(view);output.extend(data);return len(outviews)-1
 for index,a in enumerate(doc.get('accessors',[])):
  data=decode(a);semantic=semantics.get(index,'');component=a['componentType'];normalized=a.get('normalized',False);transformed=False
  if component==5126 and semantic in ['POSITION','NORMAL','TANGENT']and np.max(np.abs(data),initial=0)<=1.000001:
   data=np.rint(np.clip(data,-1,1)*32767).astype('<i2');component=5122;normalized=True;transformed=True
  elif component==5126 and semantic.startswith('TEXCOORD_')and np.min(data,initial=0)>=0 and np.max(data,initial=0)<=1.000001:
   data=np.rint(np.clip(data,0,1)*65535).astype('<u2');component=5123;normalized=True;transformed=True
  elif component==5126 and semantic.startswith('COLOR_'):
   data=np.rint(np.clip(data,0,1)*255).astype('u1');component=5121;normalized=True;transformed=True
  original_target=views[a['bufferView']].get('target')if'bufferView'in a else None
  stride=data.dtype.itemsize*data.shape[1];packed=data.tobytes()
  if semantic and stride%4:
   aligned=(stride+3)//4*4;padded=np.zeros((len(data),aligned),dtype=np.uint8);padded[:,:stride]=data.view(np.uint8).reshape(len(data),stride);packed=padded.tobytes()
  a['bufferView']=append(packed,original_target)
  if semantic and stride%4:outviews[-1]['byteStride']=aligned
  a.pop('byteOffset',None);a.pop('sparse',None);a['componentType']=component
  if normalized:a['normalized']=True
  else:a.pop('normalized',None)
  if transformed and ('min'in a or semantic=='POSITION'):
   a['min']=data.min(axis=0).tolist();a['max']=data.max(axis=0).tolist();saved+=1
 for image in doc.get('images',[]):
  if'bufferView'not in image:raise ValueError('Shipped model contains an external image')
  view=views[image['bufferView']];image['bufferView']=append(binary[view.get('byteOffset',0):view.get('byteOffset',0)+view['byteLength']]);image.pop('uri',None)
 doc['bufferViews']=outviews;doc['buffers']=[{'byteLength':len(output)}];doc['extensionsUsed']=list(dict.fromkeys(doc.get('extensionsUsed',[])+['KHR_mesh_quantization']));doc['extensionsRequired']=list(dict.fromkeys(doc.get('extensionsRequired',[])+['KHR_mesh_quantization']));doc.setdefault('asset',{}).setdefault('extras',{})['positionQuantizationMaxError']=1/32767;doc['asset']['extras']['quantizationRevision']=2
 text=json.dumps(doc,separators=(',',':')).encode();text+=b' '*((-len(text))%4);output+=b'\x00'*((-len(output))%4)
 result=struct.pack('<III',0x46546c67,2,12+8+len(text)+8+len(output))+struct.pack('<II',len(text),0x4e4f534a)+text+struct.pack('<II',len(output),0x004e4942)+output
 temp=path.with_suffix('.glb.tmp');temp.write_bytes(result);temp.replace(path)
 return {'file':path.name,'before':len(raw),'after':len(result),'positionsChanged':saved}
if __name__=='__main__':
 paths=[Path(p)for p in sys.argv[1:]]if len(sys.argv)>1 else sorted((Path(__file__).resolve().parents[2]/'assets/species').glob('*.glb'))
 results=[quantize(path)for path in paths];print(json.dumps(results,indent=2))
