import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { inheritGenotype,punnettSquare,gametes,initializeIndividual,normalizeGenetics,advanceReproduction,setBreedingPair,breedingConditions,individualGrowth,offspringOf,POPULATION_LIMITS } from '../genetics.mjs';
import { modelFor,parseGenotype,genotypeText,genotypeOptions,phenotypeFor,variantsFor } from '../fish-variants.mjs';
const catalog=Object.fromEntries(JSON.parse(fs.readFileSync(new URL('../assets/catalog/items.json',import.meta.url))).map(s=>[s.id,s]));
const legacy=JSON.parse(fs.readFileSync(new URL('./fixtures/legacy-v1.json',import.meta.url)));
function rng(seed){return()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296}}
const genetic=(model,text)=>({model,loci:parseGenotype(text,model)});
function setup(species='molly',variants=['black','gold']){
 const state=structuredClone(legacy);Object.assign(state,{day:0,entities:state.entities.filter(e=>catalog[e.species].category==='plant'),offspring:[],nextId:10,liters:700,water:'fresh',autoFeed:true});Object.assign(state.params,{temp:24,ph:7.2,salinity:0,no2:0,nh4:0,oxygen:8});
 const createEntity=(s,id)=>{const e={uid:s.nextId++,species:id,sex:'♀',age:30,health:100,x:0,z:0,rotation:0,scale:1,biomass:.8,dead:false,pregnancy:0,genotype:null};s.entities.push(e);initializeIndividual(s,e);return e};
 const mother=createEntity(state,species),father=createEntity(state,species);initializeIndividual(state,mother,{replace:true,variant:variants[0],sex:'♀'});initializeIndividual(state,father,{replace:true,variant:variants[1],sex:'♂'});setBreedingPair(state,species,mother.uid,father.uid);
 const context={catalog,random:rng(315),createEntity,foodScore:()=>1};return{state,mother,father,context};
}
function days(fixture,n){for(let d=0;d<n;d++){fixture.state.day++;for(const e of fixture.state.entities)e.age++;advanceReproduction(fixture.state,fixture.context)}}

test('real forms are species-bound; monohybrid variant/genotype choices stay consistent',()=>{
 assert.equal(variantsFor('neon').length,1);assert.equal(variantsFor('clown')[1].id,'black-darwin');assert.equal(modelFor('clown','black-darwin'),null);
 assert.deepEqual(genotypeOptions('molly','black'),['AA','Aa']);assert.deepEqual(genotypeOptions('molly','gold'),['aa']);assert.equal(modelFor('molly','dalmatian'),null);
 for(const v of variantsFor('platy'))for(const text of genotypeOptions('platy',v.id))assert.equal(phenotypeFor('platy-independent',parseGenotype(text,'platy-independent')),v.id);
});
test('AA × aa gives only Aa in actual random allele inheritance (uniformity)',()=>{
 const random=rng(55);for(let i=0;i<200;i++)assert.equal(genotypeText(inheritGenotype(genetic('molly-mono','AA'),genetic('molly-mono','aa'),random)),'Aa');
});
test('Aa × Aa segregates stochastically near 1:2:1; small broods are not forced to 3:1',()=>{
 const random=rng(37),counts={AA:0,Aa:0,aa:0},broods=[];
 for(let i=0;i<20000;i++){const child=genotypeText(inheritGenotype(genetic('molly-mono','Aa'),genetic('molly-mono','Aa'),random));counts[child]++;if(i<40)broods.push(child)}
 assert.ok(Math.abs(counts.AA/20000-.25)<.02);assert.ok(Math.abs(counts.Aa/20000-.5)<.02);assert.ok(Math.abs(counts.aa/20000-.25)<.02);
 assert.ok(Array.from({length:10},(_,k)=>broods.slice(k*4,k*4+4).filter(g=>g==='aa').length).some(n=>n!==1));
});
test('two explicitly unlinked loci produce four gametes and the expected 9:3:3:1',()=>{
 const a=genetic('platy-independent','AaBb');assert.equal(gametes(a).length,4);assert.ok(gametes(a).every(g=>g.probability===.25));
 const square=punnettSquare(a,a);assert.equal(square.cells.flat().length,16);assert.deepEqual(square.phenotypes,{'red-wagtail':9/16,red:3/16,'gold-wagtail':3/16,gold:1/16});assert.equal(square.genotypes.AaBb,4/16);
 const random=rng(919),counts={};for(let i=0;i<16000;i++){const p=phenotypeFor(a.model,inheritGenotype(a,a,random));counts[p]=(counts[p]||0)+1}for(const [p,expected]of Object.entries(square.phenotypes))assert.ok(Math.abs(counts[p]/16000-expected)<.02);
});
test('live birth occurs after seven suitable days, with true parentage and juvenile growth',()=>{
 const f=setup();days(f,6);assert.equal(offspringOf(f.state,f.mother.uid,f.father.uid).length,0);days(f,1);
 const children=offspringOf(f.state,f.mother.uid,f.father.uid);assert.ok(children.length>=3&&children.length<=5);for(const c of children){assert.equal(genotypeText(c.loci),'Aa');assert.equal(c.variant,'black');assert.equal(c.generation,1);assert.equal(c.filial,'F1');assert.equal(c.status,'lebend');const e=f.state.entities.find(e=>e.uid===c.uid);assert.equal(e.age,0);assert.equal(individualGrowth(e),.3)}
 days(f,7);assert.ok(f.state.entities.filter(e=>children.some(c=>c.uid===e.uid)).every(e=>individualGrowth(e)===1));
});
test('an F1 cross uses actual offspring parents and retains the F2 ancestry',()=>{
 const f=setup();days(f,7);const children=f.state.entities.filter(e=>e.genetics?.filial==='F1');const female=children.find(e=>e.sex==='♀'),male=children.find(e=>e.sex==='♂');assert.ok(female&&male,'fixed fixture must include both sexes');setBreedingPair(f.state,'molly',female.uid,male.uid);days(f,14);
 const second=offspringOf(f.state,female.uid,male.uid);assert.ok(second.length>0);for(const record of second){assert.equal(record.generation,2);assert.equal(record.filial,'F2');assert.deepEqual(record.parents,[female.uid,male.uid]);assert.ok(['AA','Aa','aa'].includes(genotypeText(record.loci)))}
});
test('egg layers create an archived clutch before actual hatching; no generic live birth',()=>{
 const f=setup('zebra',['natural','golden']);days(f,7);const eggs=Object.values(f.state.genetics.pedigree).filter(e=>e.status==='Ei');assert.ok(eggs.length>=4);assert.equal(f.state.entities.filter(e=>e.species==='zebra').length,2);assert.equal(f.state.genetics.clutches.length,1);days(f,1);assert.equal(f.state.genetics.clutches.length,0);assert.equal(f.state.entities.filter(e=>e.species==='zebra').length,eggs.length+2);assert.ok(eggs.every(e=>f.state.genetics.pedigree[e.uid].status==='lebend'));
});
test('poor water, food, immaturity, unsupported crosses and crowding prevent reproduction',()=>{
 for(const change of [f=>f.state.params.no2=1,f=>f.context.foodScore=()=>0,f=>f.mother.age=0,f=>f.state.liters=30,f=>f.state.entities=f.state.entities.filter(e=>e.species==='molly')]){const f=setup();change(f);assert.ok(breedingConditions(f.state,f.mother,f.father,catalog,f.context.foodScore).length);if(f.mother.age===0)f.mother.age=-30;days(f,8);assert.equal(offspringOf(f.state,f.mother.uid,f.father.uid).length,0)}
 const f=setup('molly',['black','dalmatian']);assert.ok(breedingConditions(f.state,f.mother,f.father,catalog,f.context.foodScore).some(r=>r.includes('Farbformen')));
});
test('genotypes, phenotype, parents and unborn clutches survive serialization; invalid records reject',()=>{
 const f=setup('zebra',['natural','golden']);days(f,7);const saved=JSON.parse(JSON.stringify(f.state)),restored=JSON.parse(JSON.stringify(saved));normalizeGenetics(restored,saved.genetics,catalog);assert.deepEqual(restored.genetics,saved.genetics);assert.equal(restored.genetics.clutches.length,1);
 const bad=structuredClone(saved.genetics);Object.values(bad.pedigree)[0].variant='unrealistic-ultraviolet';assert.throws(()=>normalizeGenetics(structuredClone(saved),bad,catalog));
});
test('legacy Molly allele data migrate without invented ancestry; other legacy species remain intact',()=>{
 const state=structuredClone(legacy),old=structuredClone(state.entities);normalizeGenetics(state,undefined,catalog);assert.deepEqual(state.entities,old);
 const f=setup();delete f.state.genetics;for(const e of f.state.entities)delete e.genetics;f.mother.genotype='aa';delete f.mother.variant;normalizeGenetics(f.state,undefined,catalog);assert.equal(f.mother.variant,'gold');assert.deepEqual(f.mother.genetics.parents,[]);assert.equal(f.mother.genetics.filial,'P');
});
test('population limits block births instead of silently deleting genetic individuals',()=>{
 const f=setup();while(f.state.entities.length<POPULATION_LIMITS.entities)f.state.entities.push({...f.mother,uid:f.state.nextId++,sex:'♂'});const before=f.state.entities.length;days(f,8);assert.equal(f.state.entities.length,before);assert.equal(offspringOf(f.state,f.mother.uid,f.father.uid).length,0);
});

test('iPad displays a stable subset including selected/newborn fish; Desktop keeps all individuals',async()=>{
 const {displayedEntities}=await import('../render-population.mjs');const list=Array.from({length:100},(_,i)=>({uid:i+1,species:'molly',age:i>80?0:30,dead:false,genetics:{founder:i<=80}}));list.push({uid:101,species:'anubias'});const saved=JSON.stringify(list),mobile=displayedEntities(list,catalog,{platform:'ipad'},77);
 assert.equal(mobile.filter(e=>e.species==='molly').length,64);assert.ok(mobile.some(e=>e.uid===77));assert.ok(mobile.some(e=>e.uid===100));assert.ok(mobile.some(e=>e.uid===101));assert.equal(displayedEntities(list,catalog,{platform:'desktop'},77),list);assert.equal(JSON.stringify(list),saved);
});
