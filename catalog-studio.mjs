/** Local authoring tool; allocated only by the explicit catalog render hook. */
export async function renderCatalogItem(item,{T,load,release,decoration,dispose}) {
  const renderer=new T.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});renderer.setSize(384,256);renderer.setPixelRatio(1);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  const scene=new T.Scene();scene.background=new T.Color('#e4e9df');scene.add(new T.HemisphereLight('#ffffff','#778878',2));const key=new T.DirectionalLight('#fff8e8',3);key.position.set(-3,5,6);scene.add(key);
  let lease=null,group;
  const material=color=>new T.MeshStandardMaterial({color,roughness:.5,metalness:.08});
  const box=(w,h,d,color)=>new T.Mesh(new T.BoxGeometry(w,h,d),material(color));
  try {
    if(item.category==='decor') group=decoration({uid:17,species:item.id,scale:1},item);
    else if(item.category) {lease=await load(item.id);group=lease.group}
    else {
      group=new T.Group();let model;
      if(item.type==='tank'){model=box(2,1.15,1,'#96bcb5');model.material.transparent=true;model.material.opacity=.48;const base=box(2.08,.09,1.08,'#35534e');base.position.y=-.6;group.add(base)}
      else if(item.type==='light'){model=box(2,.13,.4,'#3d5350');const strip=box(1.8,.025,.32,'#f9efb0');strip.position.y=-.08;group.add(strip)}
      else if(item.type==='substrate'){model=box(1.2,1.5,.45,item.color||'#b6aa81');const seam=box(1.25,.07,.48,'#738578');seam.position.y=.65;group.add(seam)}
      else{model=new T.Mesh(new T.CylinderGeometry(.4,.43,item.type==='filter'?1.6:1.1,32),material(item.color||'#789d8f'));const lid=new T.Mesh(new T.CylinderGeometry(.44,.44,.1,32),material('#354b48'));lid.position.y=item.type==='filter'?.85:.6;group.add(lid)}
      group.add(model);group.rotation.y=-.35;
    }
    scene.add(group);scene.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(group),center=bounds.getCenter(new T.Vector3()),size=bounds.getSize(new T.Vector3());
    const camera=new T.PerspectiveCamera(33,1.5,.001,100);const distance=Math.max(size.y,size.x/1.5)/Math.tan(33*Math.PI/360)*.69+size.z*.6;
    camera.position.copy(center).add(new T.Vector3(size.x*.1,item.category==='plant'?size.y*.08:size.y*.23,distance));camera.lookAt(center);renderer.render(scene,camera);return renderer.domElement.toDataURL('image/webp',.83);
  }finally{if(lease)release(lease);else if(group)dispose(group);renderer.dispose();renderer.forceContextLoss()}
}
