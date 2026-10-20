import { SPECIES_DIMENSIONS } from './species-dimensions.mjs';
import { individualGrowth } from './genetics.mjs';

/** One world unit is 20 cm. Saved x/z remain normalized tank coordinates. */
export const WORLD_PER_CM = .05;
export const TANK_DIMENSIONS = {
  30:[40,25,30],60:[60,30,35],120:[80,40,40],180:[100,40,45],
  300:[120,50,50],450:[150,50,60],700:[200,60,60],
};
export const REFERENCE_TANK = {length:7.135,depth:3.275,height:3.7};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const animal=type=>['fish','invert'].includes(type?.category);
export function tankDimensions(state){
 const [lengthCm,depthCm,heightCm]=TANK_DIMENSIONS[state.liters]||TANK_DIMENSIONS[180];
 return {lengthCm,depthCm,heightCm,grossLiters:lengthCm*depthCm*heightCm/1000,
  x:lengthCm*WORLD_PER_CM/REFERENCE_TANK.length,y:heightCm*WORLD_PER_CM/REFERENCE_TANK.height,z:depthCm*WORLD_PER_CM/REFERENCE_TANK.depth};
}
export function naturalVariation(entity){
 let hash=(Number(entity.uid)||0)>>>0;for(const c of entity.species||'')hash=Math.imul(hash^c.charCodeAt(0),16777619)>>>0;
 return .94+(hash%10001)/10000*.12;
}
export function naturalRotation(entity){return (naturalVariation(entity)-.94)/.12*Math.PI*2}
export function organismDimensions(entity,type){
 const spec=SPECIES_DIMENSIONS[type.id]||{adultCm:type.size||3,axis:'length',heightCm:20,widthCm:15};
 const variation=naturalVariation(entity),isAnimal=animal(type);
 const growth=isAnimal?individualGrowth(entity):['plant','coral'].includes(type.category)?clamp(Math.cbrt(Math.max(.05,entity.biomass||.7)/2.2),.28,1):1;
 const factor=variation*growth,adultCm=entity.sex==='♀'?(spec.femaleCm||spec.adultCm):(spec.maleCm||spec.adultCm);
 const manual=type.category==='decor'?clamp(entity.scale||1,.2,2):1;
 return {axis:spec.axis,variation,growth,adultCm,lengthCm:(adultCm||spec.lengthCm||20)*(type.category==='decor'?manual:factor),
  heightCm:(spec.heightCm||adultCm*.4||10)*(type.category==='decor'?manual:factor),
  widthCm:(spec.widthCm||adultCm*.28||8)*(type.category==='decor'?manual:factor),
  assumption:spec.basis||'Aquaristische Orientierungsannahme.'};
}
export function physicalFootprint(state,entity,type){
 const size=organismDimensions(entity,type),tank=tankDimensions(state),rotation=type.category==='decor'?entity.rotation||0:naturalRotation(entity);
 const reserve=['plant','coral'].includes(type.category)?1/size.growth:1;
 let length=size.lengthCm*reserve,width=size.widthCm*reserve;
 if(type.category==='plant')length=width=size.widthCm*reserve*.40; // Roots/rhizomes; foliage may naturally overlap.
 if(type.category==='coral')length=width=size.widthCm*reserve;
 if(type.category==='invert')length=width=size.lengthCm;
 const c=Math.abs(Math.cos(rotation)),s=Math.abs(Math.sin(rotation));
 return {x:(length*c+width*s)*WORLD_PER_CM/2/tank.x,z:(length*s+width*c)*WORLD_PER_CM/2/tank.z};
}
export function physicalPlacement(state,entity,catalog,x,z){
 const type=catalog[entity.species];if(!type||entity.dead||!Number.isFinite(x)||!Number.isFinite(z))return {valid:false,reason:'Dieses Objekt lässt sich hier nicht platzieren.'};
 const half=physicalFootprint(state,entity,type),maxX=Math.min(3.2,3.49-half.x),maxZ=Math.min(1.3,1.57-half.z);
 if(maxX<0||maxZ<0)return {valid:false,reason:'Dieses Objekt ist in seiner tatsächlichen Größe zu groß für das Becken.'};
 x=clamp(x,-maxX,maxX);z=clamp(z,-maxZ,maxZ);
 const candidate={x,z};if(animal(type))return {...candidate,valid:true,reason:''};
 for(const other of state.entities){
  const ot=catalog[other.species];if(other.uid===entity.uid||other.dead||!ot||animal(ot)||state.spatial?.unplaced?.includes(other.uid)||(ot.shape==='floating')!==(type.shape==='floating'))continue;
  const oh=physicalFootprint(state,other,ot),padding=.2*WORLD_PER_CM;
  if(Math.abs(x-other.x)<half.x+oh.x+padding&&Math.abs(z-other.z)<half.z+oh.z+padding)return {...candidate,valid:false,reason:'Hier steht bereits eine Pflanze oder feste Einrichtung.'};
 }
 const tank=tankDimensions(state),fixed=[];
 if(state.filter?.startsWith('internal')||state.filter==='sponge')fixed.push([2.97,-1.34,5,5]);
 else if(state.filter&&state.filter!=='none')fixed.push([3.25,-1.3,1,1]);
 if(state.heater)fixed.push([-3.2,-1.4,2,2]);if(state.skimmer)fixed.push([-3.2,-1.25,5,5]);
 if(type.shape!=='floating'&&fixed.some(([fx,fz,hx,hz])=>Math.abs(x-fx)<half.x+hx*WORLD_PER_CM/tank.x&&Math.abs(z-fz)<half.z+hz*WORLD_PER_CM/tank.z))return {...candidate,valid:false,reason:'Halte Abstand zur festen Technik.'};
 return {...candidate,valid:true,reason:''};
}
export function findPhysicalPosition(state,entity,catalog){
 const first=physicalPlacement(state,entity,catalog,entity.x,entity.z);if(first.valid)return first;
 const candidates=[];for(let x=-3.2;x<=3.201;x+=.16)for(let z=-1.3;z<=1.301;z+=.13)candidates.push({x,z});
 candidates.sort((a,b)=>Math.hypot(a.x-entity.x,a.z-entity.z)-Math.hypot(b.x-entity.x,b.z-entity.z));
 for(const p of candidates){const result=physicalPlacement(state,entity,catalog,p.x,p.z);if(result.valid)return result}return null;
}
export function physicalSubstrateHeight(state,x,z){
 if(state.substrate==='bare')return .065;
 const tank=tankDimensions(state);
 return .065+(4+.25*Math.sin(x*tank.x/WORLD_PER_CM*.14)-z*tank.z/WORLD_PER_CM*.025)*WORLD_PER_CM/tank.y;
}
/** Idempotent migration: keep original overrides/relocations, never delete animals or genes. */
export function normalizeSpatialState(state,previous,catalog){
 if(previous){
  if(previous.version!==1||previous.unit!=='cm'||previous.positions!=='tank-normalized-v1')throw new Error('Unbekannte Version der räumlichen Kalibrierung.');
  const ids=new Set(state.entities.map(e=>e.uid));
  if(!previous.originalOverrides||typeof previous.originalOverrides!=='object'||Array.isArray(previous.originalOverrides)||Object.keys(previous.originalOverrides).length>240||!Array.isArray(previous.relocations)||previous.relocations.length>240||!Array.isArray(previous.unplaced)||previous.unplaced.length>240||previous.unplaced.some(uid=>!Number.isInteger(uid)))throw new Error('Ungültige räumliche Migrationsdaten.');
  for(const [uid,value]of Object.entries(previous.originalOverrides))if(!/^-?\d+$/.test(uid)||!value||!Number.isFinite(value.scale)||!Number.isFinite(value.rotation))throw new Error('Ungültige ursprüngliche Darstellungswerte.');
  for(const r of previous.relocations)if(!r||!Number.isInteger(r.uid)||![r.from?.x,r.from?.z,r.to?.x,r.to?.z].every(Number.isFinite))throw new Error('Ungültige Positionsmigration.');
 }
 if(state.spatial?.version===1)return state.spatial;
 const spatial={version:1,unit:'cm',positions:'tank-normalized-v1',originalOverrides:{},relocations:[],unplaced:[],...(previous?JSON.parse(JSON.stringify(previous)):null)};
 state.spatial=spatial;
 for(const entity of state.entities){
  const type=catalog[entity.species];if(!type)continue;
  if(type.category!=='decor'){
   if(entity.scale!==1||entity.rotation!==naturalRotation(entity))spatial.originalOverrides[entity.uid]??={scale:entity.scale,rotation:entity.rotation};
   entity.scale=1;entity.rotation=naturalRotation(entity);
  }
 }
 if(previous)return spatial;
 // Check each fixed object against already admitted neighbours; never against itself twice.
 const admitted={...state,entities:[]};
 for(const entity of state.entities){
  if(entity.dead){admitted.entities.push(entity);continue}
  const position=findPhysicalPosition(admitted,entity,catalog);
  if(position){
   if(Math.hypot(position.x-entity.x,position.z-entity.z)>.00001){spatial.relocations.push({uid:entity.uid,from:{x:entity.x,z:entity.z},to:{x:position.x,z:position.z}});entity.x=position.x;entity.z=position.z}
  }else spatial.unplaced.push(entity.uid);
  admitted.entities.push(entity);
 }
 return spatial;
}
export function physicalDescription(entity,type,state){
 const s=organismDimensions(entity,type),t=tankDimensions(state),dimension=['fish','invert'].includes(type.category)?`Länge ca. ${s.lengthCm.toFixed(1)} cm`:`Höhe ca. ${s.heightCm.toFixed(1)} cm · Breite ca. ${s.widthCm.toFixed(1)} cm`;
 const tooTall=!animal(type)&&type.category!=='decor'&&s.heightCm+4>t.heightCm*3.47/3.7;
 return `<p class="tiny physical-size">${dimension} · natürlicher Entwicklungsstand${tooTall?' · Wuchs über den Wasserspiegel: kürzen oder ein höheres Becken wählen.':''}</p>`;
}
