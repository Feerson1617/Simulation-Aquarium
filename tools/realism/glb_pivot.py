"""Normalize evaluated GLB meshes after decimation; preserve topology and material data."""
import json,struct
from pathlib import Path

def floor_pivot(path):
 path=Path(path);raw=path.read_bytes();assert raw[:4]==b'glTF' and struct.unpack_from('<I',raw,4)[0]==2
 length=struct.unpack_from('<I',raw,12)[0];doc=json.loads(raw[20:20+length]);offset=20+length;bin_length,kind=struct.unpack_from('<II',raw,offset);assert kind==0x004e4942
 binary=bytearray(raw[offset+8:offset+8+bin_length]);used=set()
 for mesh in doc['meshes']:
  for primitive in mesh['primitives']:
   index=primitive['attributes']['POSITION']
   if index in used:continue
   used.add(index);accessor=doc['accessors'][index];assert accessor['componentType']==5126 and accessor['type']=='VEC3'
   view=doc['bufferViews'][accessor['bufferView']];start=view.get('byteOffset',0)+accessor.get('byteOffset',0);stride=view.get('byteStride',12)
   lowest=min(struct.unpack_from('<f',binary,start+i*stride+4)[0]for i in range(accessor['count']))
   for i in range(accessor['count']):
    pos=start+i*stride+4;y=struct.unpack_from('<f',binary,pos)[0];struct.pack_into('<f',binary,pos,y-lowest)
   accessor['min'][1]=0;accessor['max'][1]-=lowest
 encoded=json.dumps(doc,separators=(',',':')).encode();encoded+=b' '*((-len(encoded))%4)
 out=struct.pack('<III',0x46546c67,2,12+8+len(encoded)+8+len(binary))+struct.pack('<II',len(encoded),0x4e4f534a)+encoded+struct.pack('<II',len(binary),kind)+binary
 temporary=path.with_suffix('.tmp');temporary.write_bytes(out);temporary.replace(path)
if __name__=='__main__':
 for target in (Path(__file__).resolve().parents[2]/'assets/realism').glob('*.glb'):floor_pivot(target);print(target.name)
