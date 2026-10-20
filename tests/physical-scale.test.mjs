import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SPECIES_DIMENSIONS } from '../species-dimensions.mjs';
import { TANK_DIMENSIONS, WORLD_PER_CM, tankDimensions, naturalVariation, organismDimensions, physicalFootprint, physicalPlacement, normalizeSpatialState, physicalSubstrateHeight, hardwareFootprints } from '../physical-scale.mjs';
const catalog=JSON.parse(await readFile(new URL('./fixtures/ecology-species.json',import.meta.url)));
const entity=(species,uid=1,extra={})=>({uid,species,x:0,z:0,age:30,biomass:.8,rotation:1,scale:1,sex:'♂',health:100,...extra});
const state=(entities=[],extra={})=>({entities,liters:180,substrate:'sand',filter:'none',...extra});

test('all seven tanks use actual length, depth and height in the same centimetre scale',()=>{
 assert.equal(Object.keys(TANK_DIMENSIONS).length,7);assert.equal(WORLD_PER_CM,.05);
 assert.deepEqual(TANK_DIMENSIONS[60],[60,30,35]);assert.deepEqual(TANK_DIMENSIONS[700],[200,60,60]);
 for(const liters of Object.keys(TANK_DIMENSIONS)){const t=tankDimensions({liters});assert.equal(t.grossLiters,t.lengthCm*t.depthCm*t.heightCm/1000);assert.ok(t.x>0&&t.y>0&&t.z>0)}
 assert.equal(tankDimensions({liters:120}).grossLiters,128,'nominal water volume is not silently rewritten to gross glass volume');
});
test('every organism and decoration has declared dimensions and explicit evidence limits',()=>{
 assert.equal(Object.keys(SPECIES_DIMENSIONS).length,144);
 for(const [id,s]of Object.entries(SPECIES_DIMENSIONS)){assert.ok(s.basis.length>30,id);assert.ok(s.referenceVerification.includes('keine vollständige'));assert.ok((s.adultCm||s.heightCm)>0,id)}
});
test('adult size and stable individual variation do not depend on tank, profile or animation time',()=>{
 const fish=entity('neon',2),before=structuredClone(fish),results=[];
 for(const liters of Object.keys(TANK_DIMENSIONS))results.push(organismDimensions(fish,catalog.neon).lengthCm);
 assert.ok(results.every(n=>n===results[0]&&n>3.7&&n<4.3));assert.deepEqual(fish,before);
 for(let uid=1;uid<150;uid++)assert.ok(naturalVariation(entity('neon',uid))>=.94&&naturalVariation(entity('neon',uid))<=1.06);
 assert.notEqual(naturalVariation(entity('neon',1)),naturalVariation(entity('neon',2)));
});
test('known sexual dimorphism and actual developmental age affect size',()=>{
 const male=entity('guppy',10),female={...male,sex:'♀'};assert.ok(organismDimensions(female,catalog.guppy).lengthCm>organismDimensions(male,catalog.guppy).lengthCm*1.4);
 const lengths=[];for(let age=0;age<=7;age++)lengths.push(organismDimensions({...male,age,genetics:{founder:false}},catalog.guppy).lengthCm);
 assert.ok(lengths[0]<lengths[7]*.31);assert.ok(lengths.every((v,i)=>!i||v>lengths[i-1]));
});
test('plant height follows saved biomass; tweezers and old manual scale cannot resize biology',()=>{
 const plant=entity('anubias'),young=organismDimensions({...plant,biomass:.2},catalog.anubias),grown=organismDimensions({...plant,biomass:2.2},catalog.anubias);
 assert.ok(grown.heightCm>young.heightCm*2);
 assert.deepEqual(organismDimensions({...plant,scale:.2},catalog.anubias),organismDimensions({...plant,scale:2},catalog.anubias));
 assert.deepEqual(physicalFootprint(state(),{...plant,biomass:.2},catalog.anubias),physicalFootprint(state(),{...plant,biomass:2.2},catalog.anubias),'placement reserves the mature root footprint');
});
test('physical placement reserves larger relative footprints in small aquariums',()=>{
 const plant=entity('anubias'),small=physicalFootprint(state([],{liters:30}),plant,catalog.anubias),large=physicalFootprint(state([],{liters:700}),plant,catalog.anubias);
 assert.ok(small.x>large.x*4);const other=entity('anubias',2,{x:1});
 assert.equal(physicalPlacement(state([other],{liters:30}),plant,catalog,1,0).valid,false);
 const huge=entity('goldfish',10,{species:'goldfish'});assert.equal(physicalPlacement(state([],{liters:30}),huge,catalog,100,100).valid,true,'a body which fits is clamped without shrinking');
});
test('old positions and personalization are migrated once without losing biological data',()=>{
 const entities=[entity('neon',1,{scale:1.7,rotation:2}),entity('anubias',2,{scale:.4,rotation:.8})],s=state(entities);s.genetics={pedigree:{proof:'retained'}};const before=structuredClone(s);
 normalizeSpatialState(s,null,catalog);assert.equal(s.entities.length,before.entities.length);assert.deepEqual(s.genetics,before.genetics);assert.equal(s.entities[0].scale,1);assert.equal(s.spatial.originalOverrides[1].scale,1.7);assert.equal(s.spatial.originalOverrides[2].rotation,.8);assert.equal(s.entities[0].x,before.entities[0].x);
 const snapshot=JSON.stringify(s);normalizeSpatialState(s,s.spatial,catalog);assert.equal(JSON.stringify(s),snapshot);
});
test('migration separates overlapping fixed objects and records every changed position',()=>{
 const s=state([entity('anubias',1),entity('anubias',2)]);normalizeSpatialState(s,null,catalog);
 assert.equal(s.spatial.unplaced.length,0);assert.equal(s.spatial.relocations.length,1);assert.notEqual(s.entities[1].x,s.entities[0].x);
 assert.equal(physicalPlacement(s,s.entities[1],catalog,s.entities[1].x,s.entities[1].z).valid,true);
});
test('unplaceable originals remain in the save, never deleted or silently shrunk',()=>{
 const huge={id:'giant',category:'decor',size:400},s=state([entity('giant',1,{scale:100})],{liters:30});
 normalizeSpatialState(s,null,{giant:huge});assert.equal(s.entities.length,1);assert.equal(s.entities[0].scale,100);assert.deepEqual(s.spatial.unplaced,[1]);
});
test('four centimetres of substrate stay four centimetres across tank heights',()=>{
 for(const liters of Object.keys(TANK_DIMENSIONS)){const s=state([],{liters}),d=tankDimensions(s);assert.ok(Math.abs((physicalSubstrateHeight(s,0,0)-.065)*d.y/WORLD_PER_CM-4)<1e-12)}
});
test('malformed or future spatial records are rejected rather than reset',()=>{
 assert.throws(()=>normalizeSpatialState(state(),{version:2},catalog));
 assert.throws(()=>normalizeSpatialState(state(),{version:1,unit:'cm',positions:'tank-normalized-v1',originalOverrides:{},unplaced:'bad',relocations:[]},catalog));
});

test('internal hardware fits and its occupied footprints do not overlap in any tank',()=>{
 for(const liters of Object.keys(TANK_DIMENSIONS)){const s=state([],{liters,filter:'sponge',heater:true,skimmer:true,air:true}),t=tankDimensions(s),hardware=hardwareFootprints(s);
  for(const [x,z,w,d]of hardware){assert.ok(Math.abs(x)*t.x/WORLD_PER_CM+w<=t.innerLengthCm/2+.00001);assert.ok(Math.abs(z)*t.z/WORLD_PER_CM+d<=t.innerDepthCm/2+.00001)}
  for(let i=0;i<hardware.length;i++)for(let j=i+1;j<hardware.length;j++){const a=hardware[i],b=hardware[j];assert.ok(Math.abs(a[0]-b[0])*t.x/WORLD_PER_CM>=a[2]+b[2]||Math.abs(a[1]-b[1])*t.z/WORLD_PER_CM>=a[3]+b[3])}
 }
});

test('later tank changes recheck placement and recover saved objects when room becomes available',()=>{
 const s=state([entity('stone',1),entity('stone',2,{x:2})],{liters:700});normalizeSpatialState(s,null,catalog);
 assert.equal(s.spatial.unplaced.length,0);const count=s.entities.length;
 s.liters=30;normalizeSpatialState(s,s.spatial,catalog);assert.equal(s.entities.length,count);
 for(const e of s.entities)if(!s.spatial.unplaced.includes(e.uid))assert.equal(physicalPlacement(s,e,catalog,e.x,e.z).valid,true);
 assert.ok(s.spatial.unplaced.length>0,'a smaller tank cannot fit two large fixed stones');
 s.liters=700;normalizeSpatialState(s,s.spatial,catalog);assert.equal(s.spatial.unplaced.length,0);
 assert.ok(s.spatial.relocations.length<=s.entities.length);const save=JSON.stringify(s);normalizeSpatialState(s,s.spatial,catalog);assert.equal(JSON.stringify(s),save);
});
