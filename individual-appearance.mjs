import { variantFor } from './fish-variants.mjs';
const textures=new Map();
const noise=(x,y)=>{const n=Math.sin(x*12.9898+y*78.233)*43758.5453;return n-Math.floor(n)};
const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
function variantTexture(T,source,form,role,species,sex,material){
 const female=['guppy','endler','swordtail'].includes(species)&&sex==='♀';
 const key=[species,form.id,role,female,source?.uuid||material.name].join(':');if(textures.has(key))return textures.get(key);
 const width=Math.min(1024,source?.image?.width||512),height=Math.min(512,source?.image?.height||256),canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');
 if(source?.image)ctx.drawImage(source.image,0,0,width,height);else{ctx.fillStyle='#'+material.color.getHexString();ctx.fillRect(0,0,width,height)}
 const image=ctx.getImageData(0,0,width,height),data=image.data,target=rgb(female?'#9eaa8b':role==='fin'?form.fins||form.body:form.body||'#a5ab98');
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const k=(y*width+x)*4,u=x/width,v=y/height,old=[data[k]/255,data[k+1]/255,data[k+2]/255],light=.2126*old[0]+.7152*old[1]+.0722*old[2],saturation=Math.max(...old)-Math.min(...old);
  if(data[k+3]<8)continue;
  // Dark pupil/line detail remains dark. Fin transparency stays in the source alpha.
  const preserve=(form.pattern!=='albino'&&role!=='fin'&&light<.075&&saturation<.10)||(form.pattern==='clown-black'&&saturation<.22&&light>.60);let pigment=[...target],shade=.46+light*.70+(noise(x,y)-.5)*.035;
  if(form.pattern==='albino')shade=.78+light*.18;
  if(form.pattern==='dalmatian'){
   const cells=role==='fin'?12:22,cx=Math.floor(u*cells),cy=Math.floor(v*cells*.55),dx=(u*cells)%1-(.25+noise(cx+5,cy)*.5),dy=(v*cells*.55)%1-(.25+noise(cy+9,cx)*.5);
   if(dx*dx+dy*dy<.014+noise(cx,cy)*.025)pigment=rgb('#2c302b');
  }
  if(form.pattern==='koi'&&role!=='fin'){
   const patch=Math.sin(u*15+Math.sin(v*8)*2)+Math.cos(v*17+u*2);if(patch>.65)pigment=rgb('#b9573c');else if(patch<-.9&&species==='angelfish')pigment=rgb('#343b32');
  }
  if(form.pattern==='tuxedo'&&role!=='fin'&&u>.48&&u<.92)pigment=rgb('#283d36');
  if(form.pattern==='leopard'&&role!=='fin'&&Math.sin(u*110+Math.sin(v*32))*Math.sin(v*52)>.62)pigment=rgb('#4f5947');
  if(['maze','reticulate'].includes(form.pattern)&&role!=='fin'&&Math.abs(Math.sin(u*50+Math.sin(v*41)*2)+Math.cos(v*62))<.3)pigment=rgb(form.pattern==='maze'?'#a2c5b3':'#b85e44');
  if(form.pattern==='mosaic'&&role==='fin'&&noise(Math.floor(u*30),Math.floor(v*16))>.72)pigment=rgb('#324e52');
  if(form.pattern==='golden'&&species==='zebra'&&role!=='fin'){
   // Golden reduces dark stripe pigment; retain the longitudinal stripe layout.
   shade=.65+light*.38;
  }
  if(female&&role!=='fin'&&u>.57&&u<.78&&v>.52&&v<.83)pigment=rgb('#565e43');
  for(let channel=0;channel<3;channel++)data[k+channel]=Math.round(Math.max(0,Math.min(1,preserve?old[channel]:pigment[channel]*shade))*255);
 }
 ctx.putImageData(image,0,0);const map=new T.CanvasTexture(canvas);
 // Texture.clone() shares THREE.Source: assigning image on that clone would
 // recolour every other individual using the original source. Keep a new Source.
 if(source){for(const property of ['wrapS','wrapT','magFilter','minFilter','anisotropy','channel','rotation','matrixAutoUpdate','generateMipmaps','premultiplyAlpha','unpackAlignment'])map[property]=source[property];for(const property of ['offset','repeat','center','matrix'])map[property].copy(source[property])}
 map.flipY=source?.flipY??false;map.colorSpace=T.SRGBColorSpace;map.userData.visualShared=true;map.needsUpdate=true;textures.set(key,map);return map;
}
export function applyIndividualAppearance(group,individual,T){
 const species=individual.species,form=variantFor(species,individual.variant),female=['guppy','endler','swordtail'].includes(species)&&individual.sex==='♀',femaleMorph=['guppy','endler','swordtail','platy'].includes(species)&&individual.sex==='♀';
 group.userData.individualAppearance={species,variant:form.id,sex:individual.sex||null};
 group.traverse(mesh=>{
  if(!mesh.isMesh)return;
  if(mesh.morphTargetDictionary?.female!==undefined)mesh.morphTargetInfluences[mesh.morphTargetDictionary.female]=femaleMorph?1:0;
  if((femaleMorph&&/ray/i.test(mesh.name))||(female&&/sword-extension/i.test(mesh.name)))mesh.visible=false;
  const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];
  for(const material of materials){
   const name=(mesh.name+' '+material.name).toLowerCase(),eye=/eye|iris|pupil|cornea/.test(name),lip=/operculum|mouth|lip|barbel/.test(name);
   if(eye){if(form.redEyes&&/pupil/.test(name))material.color.set('#7c3031');continue}
   if(lip||!form.body)continue;
   const role=/fin|tail|pectoral|pelvic|dorsal|anal|ray/.test(name)?'fin':'skin';
   if(form.pattern==='original'&&!female)continue;
   material.map=variantTexture(T,material.map,form,role,species,individual.sex,material);material.vertexColors=false;material.color.set('#ffffff');material.needsUpdate=true;
  }
 });return group;
}
export function clearIndividualTextures(){for(const texture of textures.values())texture.dispose();textures.clear()}

/** Read-only browser diagnostic: check actual rendered Sources, not variant labels. */
export function appearanceMaterialAudit(group){
 const result=[];group.traverse(mesh=>{if(!mesh.isMesh)return;for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material]){
  const map=material.map;if(!map?.image)continue;
  const canvas=document.createElement('canvas');canvas.width=canvas.height=16;const ctx=canvas.getContext('2d');ctx.drawImage(map.image,0,0,16,16);const data=ctx.getImageData(0,0,16,16).data;let hash=2166136261,weight=0,sum=[0,0,0];
  for(let i=0;i<data.length;i+=4){const alpha=data[i+3]/255;weight+=alpha;for(let c=0;c<4;c++)hash=Math.imul(hash^data[i+c],16777619);for(let c=0;c<3;c++)sum[c]+=data[i+c]*alpha}
  result.push({mesh:mesh.name,material:material.name,source:map.source.uuid,width:map.image.width,height:map.image.height,fingerprint:hash>>>0,mean:sum.map(n=>n/Math.max(1,weight))});
 }});return result;
}
