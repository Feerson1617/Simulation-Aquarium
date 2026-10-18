import { productModel } from './realism-renderer.mjs';
/** Local authoring tool; allocated only by the explicit catalog render hook. */
export async function renderCatalogItem(item,{T,load,release,decoration,dispose}) {
  const renderer=new T.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});renderer.setSize(384,256);renderer.setPixelRatio(1);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  const scene=new T.Scene();scene.background=new T.Color('#e4e9df');scene.add(new T.HemisphereLight('#ffffff','#778878',2));const key=new T.DirectionalLight('#fff8e8',3);key.position.set(-3,5,6);scene.add(key);
  let lease=null,group;
  const material=color=>new T.MeshStandardMaterial({color,roughness:.5,metalness:.08});
  const box=(w,h,d,color)=>new T.Mesh(new T.BoxGeometry(w,h,d),material(color));
  try {
    if(item.category) {lease=await load(item.id);group=lease.group}
    else group=productModel(T,item);
    scene.add(group);scene.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(group),center=bounds.getCenter(new T.Vector3()),size=bounds.getSize(new T.Vector3());
    const camera=new T.PerspectiveCamera(33,1.5,.001,100);const distance=Math.max(size.y,size.x/1.5)/Math.tan(33*Math.PI/360)*.69+size.z*.6;
    camera.position.copy(center).add(new T.Vector3(size.x*.1,item.category==='plant'?size.y*.08:size.y*.23,distance));camera.lookAt(center);renderer.render(scene,camera);return renderer.domElement.toDataURL('image/webp',.83);
  }finally{if(lease)release(lease);else if(group)dispose(group);renderer.dispose();renderer.forceContextLoss()}
}
