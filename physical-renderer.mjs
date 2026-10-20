import { WORLD_PER_CM, tankDimensions, organismDimensions, naturalRotation, normalizeSpatialState, physicalSubstrateHeight, equipmentDimensions, externalFilterPlacement } from './physical-scale.mjs';

/** Measure real, currently morphed vertices in root-local coordinates once per lease. */
export function preparePhysicalSpecimen(group,content,type,T){
 group.updateMatrixWorld(true);const inverse=group.matrixWorld.clone().invert(),full=new T.Box3(),body=new T.Box3(),point=new T.Vector3(),horizontal=[];let found=false;
 group.traverse(mesh=>{if(!mesh.isMesh||!mesh.visible)return;
  const matrix=inverse.clone().multiply(mesh.matrixWorld),name=mesh.name+' '+(mesh.userData.surfaceRole||''),isBody=type.category==='invert'&&(/shell|valve|carapace|somite|body|test/i.test(name));
  for(let k=0;k<mesh.geometry.attributes.position.count;k++){mesh.getVertexPosition(k,point);point.applyMatrix4(matrix);full.expandByPoint(point);if(['plant','coral'].includes(type.category))horizontal.push(point.x,point.z);if(isBody){body.expandByPoint(point);found=true}}
 });
 if(full.isEmpty())return;
 const measure=found?body:full,size=full.getSize(new T.Vector3()),bodySize=measure.getSize(new T.Vector3()),floating=type.shape==='floating',animal=['fish','invert'].includes(type.category);
 const cx=(full.min.x+full.max.x)/2,cz=(full.min.z+full.max.z)/2;let diameterXZ=0;for(let k=0;k<horizontal.length;k+=2)diameterXZ=Math.max(diameterXZ,2*Math.hypot(horizontal[k]-cx,horizontal[k+1]-cz));
 group.userData.physicalBasis={size:size.toArray(),measure:bodySize.toArray(),diameterXZ,origin:[cx,animal?(full.min.y+full.max.y)/2:floating?full.max.y:full.min.y,cz]};
 group.physicalContent=content;
}
export function fitPhysicalCamera(view,front=false){
 const d=tankDimensions(view.state),external=view.state.filter!=='none'&&!view.state.filter?.startsWith('internal')&&view.state.filter!=='sponge',extra=external?equipmentDimensions(view.state,'filter',view.state.filter)[0]*2+6:0,width=(d.lengthCm+extra)*WORLD_PER_CM,depth=d.depthCm*WORLD_PER_CM,height=d.heightCm*WORLD_PER_CM;
 const distance=Math.max(width/Math.max(.55,view.camera.aspect),height*1.4)/Math.tan(view.camera.fov*Math.PI/360)*.66+depth;
 view.controls.target.set(0,height*.48,0);view.controls.minDistance=Math.max(.6,Math.min(width,height)*.55);view.controls.maxDistance=Math.max(10,distance*4);
 const direction=view.camera.position.clone().set(front?0:.45,front?.06:.28,1).normalize();view.camera.position.copy(view.controls.target).addScaledVector(direction,distance);view.camera.far=Math.max(100,distance*8);view.camera.updateProjectionMatrix();view.controls.update();
}
export function configurePhysicalTank(view,T,catalog){
 normalizeSpatialState(view.state,view.state.spatial,catalog);const d=tankDimensions(view.state);view.physicalScaleActive=true;
 view.tank.scale.set(d.x,d.y,d.z);view.life.scale.copy(view.tank.scale);view.dim={w:d.lengthCm*WORLD_PER_CM,h:d.heightCm*WORLD_PER_CM,d:d.depthCm*WORLD_PER_CM};
 for(const pane of view.tank.children){
  if(!pane.isMesh||pane.geometry.type!=='BoxGeometry'||!pane.material?.isMeshPhysicalMaterial||pane.material.opacity>=.1)continue;
  const dimensions=pane.geometry.parameters,thickness=d.glassThicknessCm*WORLD_PER_CM;
  if(dimensions.width<.1){pane.scale.x=thickness/d.x/dimensions.width;pane.position.x=Math.sign(pane.position.x)*(view.dim.w/2-thickness/2)/d.x;pane.scale.z=(view.dim.d-2*thickness)/d.z/dimensions.depth}
  else if(dimensions.depth<.1){pane.scale.z=thickness/d.z/dimensions.depth;pane.position.z=Math.sign(pane.position.z)*(view.dim.d/2-thickness/2)/d.z;pane.scale.x=view.dim.w/d.x/dimensions.width}
 }
 if(view.stand)view.stand.scale.set((view.dim.w+.35)/8,1,(view.dim.d+.3)/3.9);
 if(view.substrateBox){const depth=4*WORLD_PER_CM/d.y;view.substrateBox.scale.y=depth/.22;view.substrateBox.position.y=.065+depth/2}
 if(view.substrateSurface){const surface=view.substrateSurface;surface.position.y=.065+4*WORLD_PER_CM/d.y;const vertices=surface.geometry.attributes.position;for(let i=0;i<vertices.count;i++)vertices.setZ(i,physicalSubstrateHeight(view.state,vertices.getX(i),-vertices.getY(i))-surface.position.y);vertices.needsUpdate=true;surface.geometry.computeVertexNormals()}
 if(view.caustic)view.caustic.position.y=.065+4.2*WORLD_PER_CM/d.y;if(view.algaePlane)view.algaePlane.position.y=.065+4.3*WORLD_PER_CM/d.y;
 view.tank.updateMatrixWorld(true);
 for(const object of view.tank.children){
  if(!object.name.startsWith('equipment:'))continue;object.scale.set(1,1,1);object.updateMatrixWorld(true);
  const inverse=view.tank.matrixWorld.clone().invert(),box=new T.Box3().setFromObject(object).applyMatrix4(inverse),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3()).sub(object.position),parts=object.name.split(':'),kind=parts[1],value=parts[2];
  const target=equipmentDimensions(view.state,kind,value);
  if(kind==='skimmer')object.position.x=-2.1;if(kind==='air')object.position.z=1;
  object.scale.set(target[0]*WORLD_PER_CM/Math.max(.001,size.x)/d.x,target[1]*WORLD_PER_CM/Math.max(.001,size.y)/d.y,target[2]*WORLD_PER_CM/Math.max(.001,size.z)/d.z);
  if(kind!=='light'&&(kind==='heater'||kind==='air'||kind==='skimmer'||value==='sponge'||value?.startsWith('internal'))){
   const half=target[1]*WORLD_PER_CM/2/d.y,offset=center.clone().multiply(object.scale),maxX=(d.innerLengthCm-target[0])*WORLD_PER_CM/2/d.x,maxZ=(d.innerDepthCm-target[2])*WORLD_PER_CM/2/d.z;
   object.position.x=Math.max(-maxX,Math.min(maxX,object.position.x))-offset.x;object.position.z=Math.max(-maxZ,Math.min(maxZ,object.position.z))-offset.z;
   object.position.y=Math.max(physicalSubstrateHeight(view.state,object.position.x,object.position.z)+half,Math.min(3.47-half,object.position.y+offset.y))-offset.y;
  }
  else if(kind==='filter'){
   const placement=externalFilterPlacement(view.state),offset=center.clone().multiply(object.scale);object.position.x=placement.x-offset.x;object.position.z=placement.z-offset.z;object.position.y=(placement.bottomWorld+target[1]*WORLD_PER_CM/2)/d.y-offset.y;
  }
 }
 view.tank.updateMatrixWorld(true);view.life.updateMatrixWorld(true);
 const cameraKey=view.state.liters+':'+(view.state.filter||'none');if(view.physicalTankKey!==cameraKey){view.physicalTankKey=cameraKey;fitPhysicalCamera(view)}
}
function transformModel(view,object,entity,type,T){
 const group=object.group,basis=group.userData.physicalBasis,content=group.physicalContent;if(!basis||!content)return null;
 const target=organismDimensions(entity,type),d=tankDimensions(view.state),size=basis.size,measure=basis.measure;
 let sx,sy,sz;
 if(['fish','invert'].includes(type.category)){const axis=type.category==='fish'?measure[0]:Math.max(...measure);sx=sy=sz=target.lengthCm*WORLD_PER_CM/Math.max(.00001,axis)}
 else if(type.category==='decor'){sx=target.lengthCm*WORLD_PER_CM/size[0];sy=target.heightCm*WORLD_PER_CM/size[1];sz=target.widthCm*WORLD_PER_CM/size[2]}
 else {sx=sz=target.widthCm*WORLD_PER_CM/(basis.diameterXZ||Math.hypot(size[0],size[2]));sy=target.heightCm*WORLD_PER_CM/size[1]}
 group.scale.set(1,1,1);
 const scratch=object.physicalMatrices||(object.physicalMatrices={r:group.matrix.clone(),c:group.matrix.clone(),s:group.matrix.clone(),o:group.matrix.clone()});
 scratch.r.makeRotationFromQuaternion(group.quaternion);scratch.c.copy(scratch.r).invert();scratch.s.makeScale(1/d.x,1/d.y,1/d.z);scratch.c.multiply(scratch.s).multiply(scratch.r);scratch.s.makeScale(sx,sy,sz);scratch.o.makeTranslation(-basis.origin[0],-basis.origin[1],-basis.origin[2]);content.matrix.copy(scratch.c).multiply(scratch.s).multiply(scratch.o);content.matrixAutoUpdate=false;content.matrixWorldNeedsUpdate=true;
 const raw=[size[0]*sx/2,size[1]*sy/2,size[2]*sz/2],r=scratch.r.elements,half=[Math.abs(r[0])*raw[0]+Math.abs(r[4])*raw[1]+Math.abs(r[8])*raw[2],Math.abs(r[1])*raw[0]+Math.abs(r[5])*raw[1]+Math.abs(r[9])*raw[2],Math.abs(r[2])*raw[0]+Math.abs(r[6])*raw[1]+Math.abs(r[10])*raw[2]];
 object.physicalSize={...target,meshCm:[size[0]*sx/WORLD_PER_CM,size[1]*sy/WORLD_PER_CM,size[2]*sz/WORLD_PER_CM],worldHalf:half};return half;
}
/** World speed and heading are measured in physical axes, never normalized tank axes. */
export function steerPhysicalAnimals(view,types,dt){
 const d=tankDimensions(view.state);
 for(const entity of view.state.entities){const object=view.objects.get(entity.uid),type=types[entity.species];if(!object||type?.category!=='fish'||entity.dead)continue;
  const group=object.group,target=group.position,previous=object.physicalPose||{x:target.x,y:target.y,z:target.z,yaw:group.rotation.y};
  const dx=(target.x-previous.x)*d.x,dy=(target.y-previous.y)*d.y,dz=(target.z-previous.z)*d.z,length=Math.hypot(dx,dy,dz),maxStep=organismDimensions(entity,type).lengthCm*WORLD_PER_CM*1.6*dt;
  const f=length>0?Math.min(1,maxStep/length):0,x=previous.x+dx*f/d.x,y=previous.y+dy*f/d.y,z=previous.z+dz*f/d.z;
  const desired=Math.hypot(dx,dz)>.00001?Math.atan2(-dz,dx):previous.yaw,turn=Math.atan2(Math.sin(desired-previous.yaw),Math.cos(desired-previous.yaw)),yaw=previous.yaw+turn*Math.min(1,dt*4);
  group.position.set(x,y,z);group.rotation.set(0,yaw,Math.max(-.09,Math.min(.09,-turn*.06)));object.physicalPose={x,y,z,yaw};
 }
}
export function updatePhysicalModels(view,types,T){
 const d=tankDimensions(view.state),unplaced=(view.state.spatial?.unplaced||[]).filter(uid=>view.state.entities.some(e=>e.uid===uid));
 for(const entity of view.state.entities){
  const object=view.objects.get(entity.uid),type=types[entity.species];if(!object||!type)continue;const group=object.group;
  if(type.category!=='fish'&&type.category!=='decor')group.rotation.y=naturalRotation(entity);
  // Keep rooted crowns upright; local leaf shaders still provide current motion.
  if(['plant','coral'].includes(type.category))group.rotation.x=group.rotation.z=0;
  const half=transformModel(view,object,entity,type,T);if(!half)continue;
  group.visible=!unplaced.includes(entity.uid);const animal=['fish','invert'].includes(type.category);
  if(animal){
   const maxX=3.49-half[0]/d.x,maxZ=1.57-half[2]/d.z,low=physicalSubstrateHeight(view.state,group.position.x,group.position.z)+half[1]/d.y,high=3.47-half[1]/d.y;
   if(maxX<0||maxZ<0||low>high){group.visible=false;object.physicalTooLarge=true;continue}
   object.physicalTooLarge=false;group.position.x=Math.max(-maxX,Math.min(maxX,group.position.x));group.position.z=Math.max(-maxZ,Math.min(maxZ,group.position.z));group.position.y=Math.max(low,Math.min(high,group.position.y));
   if(object.physicalPose)Object.assign(object.physicalPose,{x:group.position.x,y:group.position.y,z:group.position.z});
  }else group.position.y=type.shape==='floating'?3.43:physicalSubstrateHeight(view.state,group.position.x,group.position.z);
 }
 if(view.selection?.visible){const object=view.objects.get(view.selected);if(object){view.selection.position.copy(object.group.position);view.selection.position.y+=.015}}
 const warnings=unplaced.length+[...view.objects.values()].filter(o=>o.physicalTooLarge).length;
 if(warnings){
  if(!view.physicalNotice){const notice=document.createElement('p');notice.className='physical-notice';notice.setAttribute('role','status');notice.style.cssText='position:absolute;left:12px;bottom:90px;max-width:320px;padding:10px;background:#f2e4bd;color:#263c36;border-radius:8px;z-index:5;font-size:12px';view.container.append(notice);view.physicalNotice=notice}
  view.physicalNotice.hidden=false;view.physicalNotice.textContent=`Maßstabsprüfung: ${warnings} gespeicherte Objekte benötigen mehr Platz und sind vorübergehend nicht dargestellt. Sie bleiben gespeichert. Details und Pinzette öffnen oder einen passenden Spielstand verwenden.`;
 }else if(view.physicalNotice)view.physicalNotice.hidden=true;
 view.life.updateMatrixWorld(true);
}
export function physicalSnapshot(view,types,T){
 const tank=tankDimensions(view.state),glass=new T.Box3();view.tank.updateMatrixWorld(true);for(const mesh of view.tank.children)if(mesh.isMesh&&mesh.geometry.type==='BoxGeometry'&&mesh.material?.isMeshPhysicalMaterial&&mesh.material.opacity<.1)glass.union(new T.Box3().setFromObject(mesh));return {unit:'cm',worldPerCm:WORLD_PER_CM,glassCm:glass.isEmpty()?null:glass.getSize(new T.Vector3()).divideScalar(WORLD_PER_CM).toArray(),equipment:view.tank.children.filter(o=>o.name.startsWith('equipment:')).map(o=>{const b=new T.Box3().setFromObject(o);return {name:o.name,sizeCm:b.getSize(new T.Vector3()).divideScalar(WORLD_PER_CM).toArray(),min:b.min.toArray(),max:b.max.toArray()}}),tank,migration:view.state.spatial,objects:[...view.objects].map(([uid,o])=>{
  const group=o.group;group.updateWorldMatrix(true,true);const minimum=[Infinity,Infinity,Infinity],maximum=[-Infinity,-Infinity,-Infinity],box=new T.Box3(),p=new T.Vector3(),axes=[new T.Vector3(1,0,0),new T.Vector3(0,1,0),new T.Vector3(0,0,1)].map(v=>v.applyQuaternion(group.quaternion));
  group.traverse(mesh=>{if(!mesh.isMesh||!mesh.visible)return;for(let i=0;i<mesh.geometry.attributes.position.count;i++){mesh.getVertexPosition(i,p);p.applyMatrix4(mesh.matrixWorld);box.expandByPoint(p);axes.forEach((axis,k)=>{const value=p.dot(axis);minimum[k]=Math.min(minimum[k],value);maximum[k]=Math.max(maximum[k],value)})}});
  return {uid,species:view.state.entities.find(e=>e.uid===uid)?.species,visible:group.visible,...o.physicalSize,measuredCm:maximum.map((v,k)=>(v-minimum[k])/WORLD_PER_CM),worldBounds:box.isEmpty()?null:{min:box.min.toArray(),max:box.max.toArray()},worldPosition:group.getWorldPosition(p).toArray()};
 })};
}
