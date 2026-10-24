/** Camera framing and selection aid for the ONE real main aquarium. No state writes. */
export function mountAquariumView(host,root,onSelect){
 let active=false,selection=null,allowed=null,key='',lastView=null,frame=0,lastPick=null;
 const overlay=document.createElement('div');overlay.className='aquarium-selection';overlay.hidden=true;overlay.setAttribute('aria-hidden','true');
 const label=document.createElement('span');overlay.append(label);host.root.append(overlay);
 const view=()=>host.comparisonRenderer?.();
 const T=()=>view()?.aquascaping?.T;
 function glassBox(v){const box=new (T().Box3)();v.tank.updateWorldMatrix(true,true);for(const o of v.tank.children)if(o.isMesh&&o.geometry.type==='BoxGeometry'&&o.material?.isMeshPhysicalMaterial&&o.material.opacity<.1)box.union(new (T().Box3)().setFromObject(o));return box;}
 function project(box,v){
  if(box.isEmpty())return null;
  const rect=v.renderer.domElement.getBoundingClientRect(),points=[];
  for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){const p=v.camera.position.clone().set(x,y,z).project(v.camera);points.push({x:rect.left+(p.x+1)*rect.width/2,y:rect.top+(1-p.y)*rect.height/2});}
  const left=Math.min(...points.map(p=>p.x)),right=Math.max(...points.map(p=>p.x)),top=Math.min(...points.map(p=>p.y)),bottom=Math.max(...points.map(p=>p.y));return {left,right,top,bottom,width:right-left,height:bottom-top,x:(left+right)/2,y:(top+bottom)/2};
 }
 function region(rect){
  const portrait=rect.width<=820;
  return portrait?{left:rect.left+20,right:rect.right-20,top:rect.top+255,bottom:rect.top+rect.height*.62}:{left:rect.left+448,right:rect.right-30,top:rect.top+135,bottom:rect.bottom-95};
 }
 function fit(force=false){
  const v=view();if(!active||!v||!T())return;
  const rect=v.renderer.domElement.getBoundingClientRect(),next=[rect.width,rect.height,v.state.liters].join(':');
  if(!force&&key===next&&lastView===v)return;key=next;lastView=v;
  const box=glassBox(v);if(box.isEmpty())return;
  const area=region(rect),target=box.getCenter(v.camera.position.clone()),direction=target.clone().set(.12,.13,1).normalize();
  const damping=v.controls.enableDamping;v.controls.enableDamping=false;v.controls.update();
  v.camera.clearViewOffset();v.camera.zoom=1;v.controls.target.copy(target);
  // Fit the projected glass corners, rather than estimating unused canvas space.
  let lo=.1,hi=100;
  for(let n=0;n<30;n++){const distance=(lo+hi)/2;v.camera.position.copy(target).addScaledVector(direction,distance);v.camera.lookAt(target);v.camera.updateMatrixWorld(true);const b=project(box,v);if(b.width>area.right-area.left||b.height>area.bottom-area.top)lo=distance;else hi=distance;}
  v.controls.minDistance=Math.min(v.controls.minDistance,hi*.4);v.controls.maxDistance=Math.max(v.controls.maxDistance,hi*3);v.controls.update();v.camera.updateMatrixWorld(true);
  const b=project(box,v);v.camera.setViewOffset(rect.width,rect.height,b.x-(area.left+area.right)/2,b.y-(area.top+area.bottom)/2,rect.width,rect.height);v.camera.updateMatrixWorld(true);v.controls.enableDamping=damping;
 }
 function contrast(v){
  for(const o of v.tank.children)if(o.isMesh&&o.geometry.type==='PlaneGeometry'&&o.position.z< -1.5&&o.material?.color){o.material.color.set('#78948e');}
 }
 function objectBounds(v,o){o.group.updateWorldMatrix(true,true);return project(new (T().Box3)().setFromObject(o.group),v);}
 function update(){
  const v=view();overlay.hidden=true;
  if(active&&v&&T()){
   contrast(v);
   const o=v.objects.get(selection),e=v.state.entities.find(e=>e.uid===selection);
   if(o?.group.visible&&e&&!root.querySelector('.single-shade')){
    const b=objectBounds(v,o),canvas=v.renderer.domElement.getBoundingClientRect();
    if(b&&b.x>=canvas.left&&b.x<=canvas.right&&b.y>=canvas.top&&b.y<=canvas.bottom){const w=Math.max(44,b.width+12),h=Math.max(44,b.height+12);overlay.hidden=false;overlay.style.cssText=`left:${b.x-w/2}px;top:${b.y-h/2}px;width:${w}px;height:${h}px`;label.textContent=`${host.types[e.species]?.name||'Lebewesen'} · ${e.uid}`;overlay.dataset.selectedUid=e.uid;}
   }
  }
  frame=requestAnimationFrame(update);
 }
 let installed=null,down=null;
 function install(v){
  if(installed===v)return;installed=v;
  const resize=v.resize.bind(v);
  v.resize=(...args)=>{const aspect=v.camera.aspect;resize(...args);if(active&&Math.abs(aspect-v.camera.aspect)>1e-6)queueMicrotask(()=>fit(true));};
  const canvas=v.renderer.domElement;
  canvas.addEventListener('pointerdown',e=>{if(active&&!host.tweezersActive())down={x:e.clientX,y:e.clientY};},true);
  canvas.addEventListener('pointerup',e=>{
   if(!active||!allowed||!down||root.querySelector('.single-shade')||host.tweezersActive())return;
   const origin=down;down=null;if(Math.hypot(e.clientX-origin.x,e.clientY-origin.y)>(e.pointerType==='touch'?12:6))return;
   const candidates=[...v.objects].filter(([uid,o])=>o.group.visible&&allowed(v.state.entities.find(e=>e.uid===uid)));
   const rect=canvas.getBoundingClientRect();v.pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);v.scene.updateMatrixWorld(true);v.camera.updateMatrixWorld(true);v.raycaster.setFromCamera(v.pointer,v.camera);
   const hits=v.raycaster.intersectObjects(candidates.map(([,o])=>o.group),true);let uid=null;
   if(hits.length){const owners=new Map(candidates.map(([id,o])=>[o.group,id]));let o=hits[0].object;while(o&&!owners.has(o))o=o.parent;uid=owners.get(o);}
   if(uid==null){let closest=Infinity;for(const [id,o]of candidates){const b=objectBounds(v,o);if(!b)continue;const dx=Math.max(b.left-e.clientX,0,e.clientX-b.right),dy=Math.max(b.top-e.clientY,0,e.clientY-b.bottom),padding=e.pointerType==='touch'?22:8,distance=Math.hypot(b.x-e.clientX,b.y-e.clientY);if(dx<=padding&&dy<=padding&&distance<closest){closest=distance;uid=id;}}}
   // Prevent the legacy picker, but let OrbitControls receive pointerup and release its gesture.
   if(uid!=null){lastPick={uid,input:e.pointerType,x:e.clientX,y:e.clientY,method:hits.length?'mesh':'near-object'};e.preventDefault();onSelect(uid);}
  },true);
  canvas.addEventListener('pointercancel',()=>{down=null;},true);
 }
 function configure({enabled=true,selected=null,selectable=null}={}){active=enabled;selection=selected;allowed=selectable;const v=view();if(v){install(v);if(enabled){fit();if(v.selected!==selected)v.select(selected);}else v.camera.clearViewOffset();}}
 function snapshot(){const v=view();if(!active||!v||!T())return null;const rect=v.renderer.domElement.getBoundingClientRect();return {glass:project(glassBox(v),v),viewport:{width:rect.width,height:rect.height},camera:v.camera.position.toArray(),selection,lastPick,markerVisible:!overlay.hidden,objects:[...v.objects].map(([uid,o])=>({uid,bounds:o.group.visible?objectBounds(v,o):null}))};}
 frame=requestAnimationFrame(update);
 return {configure,fit:()=>fit(true),snapshot,destroy:()=>{cancelAnimationFrame(frame);overlay.remove();}};
}
