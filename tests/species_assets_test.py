"""Check shipped GLBs, including images and the alignment required by WebGL."""
import io,json,struct,unittest
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
COMPONENT={5120:1,5121:1,5122:2,5123:2,5125:4,5126:4}
WIDTH={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}
def read(path):
 data=path.read_bytes();magic,version,size=struct.unpack_from('<III',data);assert(magic,version,size)==(0x46546c67,2,len(data))
 length,kind=struct.unpack_from('<II',data,12);assert kind==0x4e4f534a
 doc=json.loads(data[20:20+length]);blen,bkind=struct.unpack_from('<II',data,20+length);assert bkind==0x004e4942
 return doc,data[28+length:28+length+blen]
class SpeciesAssets(unittest.TestCase):
 def test_all_declared_lods_are_self_contained_valid_glb(self):
  manifest=json.loads((ROOT/'assets/species/manifest.json').read_text());self.assertEqual(len(manifest),127)
  self.assertTrue({'neon','molly','clown','betta','nana','vallis'}.isdisjoint(manifest))
  total=0
  for species,lods in manifest.items():
   self.assertEqual(set(lods),{'desktop','mobile'})
   for lod,url in lods.items():
    with self.subTest(species=species,lod=lod):
     path=ROOT/url;doc,binary=read(path);total+=path.stat().st_size
     self.assertLess(path.stat().st_size,4_000_000)
     self.assertEqual(doc['asset']['extras']['quantizationRevision'],2)
     self.assertIn('KHR_mesh_quantization',doc['extensionsRequired'])
     self.assertEqual(len(doc['buffers']),1);self.assertNotIn('uri',doc['buffers'][0]);self.assertLessEqual(doc['buffers'][0]['byteLength'],len(binary))
     self.assertTrue(doc['meshes'])
     for view in doc['bufferViews']:self.assertLessEqual(view.get('byteOffset',0)+view['byteLength'],len(binary))
     for mesh in doc['meshes']:
      for primitive in mesh['primitives']:
       for semantic,index in primitive['attributes'].items():
        accessor=doc['accessors'][index];view=doc['bufferViews'][accessor['bufferView']]
        self.assertEqual((view.get('byteOffset',0)+accessor.get('byteOffset',0))%4,0)
        stride=view.get('byteStride',COMPONENT[accessor['componentType']]*WIDTH[accessor['type']]);self.assertEqual(stride%4,0)
        if semantic=='POSITION':self.assertGreater(accessor['count'],0)
     for image in doc.get('images',[]):
      self.assertNotIn('uri',image);view=doc['bufferViews'][image['bufferView']];start=view.get('byteOffset',0)
      im=Image.open(io.BytesIO(binary[start:start+view['byteLength']]))
      self.assertGreater(im.width,1);self.assertGreater(im.height,1)
  self.assertLess(total,120_000_000)
 def test_mobile_really_has_less_geometry(self):
  manifest=json.loads((ROOT/'assets/species/manifest.json').read_text())
  for species,lods in manifest.items():
   counts=[]
   for lod in ['desktop','mobile']:
    doc,_=read(ROOT/lods[lod]);counts.append(sum(doc['accessors'][p['attributes']['POSITION']]['count']for m in doc['meshes']for p in m['primitives']))
   with self.subTest(species=species):self.assertLess(counts[1],counts[0])
if __name__=='__main__':unittest.main()
