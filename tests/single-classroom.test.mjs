import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createClassroom,cohort,counts,classroomContext,classroomProduct,selectClassroom,nextClassroomGeneration,resetClassroomTrial,validateClassroom,encodeSingle,decodeSingle,classroomFeed,predictClassroom,beginClassroomObservation,advanceClassroom,resetClassroomMeasure,classroomMeasure} from '../single-classroom-model.mjs';
import {stateId} from '../learning-context.mjs';
import {normalizeLearningTag,learningSlot} from '../learning-model.mjs';
const types=JSON.parse(readFileSync(new URL('./fixtures/ecology-species.json',import.meta.url)));
const host={types,create:()=>({params:{},entities:[],nextId:1,deaths:[]}),normalize:structuredClone,
 add:(s,id)=>{const e={uid:s.nextId++,species:id,health:100,age:30,biomass:.7,dead:false};s.entities.push(e);return e;},
 care:(t,key)=>{if(key==='feed'){t.detritus+=.12;t.feedReserve=(t.feedReserve||0)+1;}},
 waterChange:t=>{t.params.no3/=2;},advance:(t,dt)=>{t.day+=dt;t.detritus+=t.feedRate*dt;t.params.oxygen+=.1*dt;t.ecology.lastFlux={day:t.day,dt,decomposition:.02*dt,mineralization:.01*dt};}};
test('new free profiles preserve their own namespace and do not become old mission progress',()=>{
 const tag={version:2,grade:8,mode:'free',mission:null};assert.deepEqual(normalizeLearningTag(tag),tag);assert.notEqual(learningSlot(tag),learningSlot({...tag,version:1}));
});
test('M3 uses actual aquarium parents and offspring, accepts either valid reciprocal cross and preserves old cohorts',()=>{
 for(const reverse of [false,true]){
  const s=createClassroom('m3-hidden-inheritance',host,123);
  const p=cohort(s.tank),m=p.find(e=>e.sex==='♀'&&e.genotype===(reverse?'aa':'AA')),f=p.find(e=>e.sex==='♂'&&e.genotype===(reverse?'AA':'aa'));
  selectClassroom(s,m.uid,host);selectClassroom(s,f.uid,host);const founders=structuredClone(s.tank);
  assert.ok(nextClassroomGeneration(s,host));assert.deepEqual(s.history[0].tank,founders);assert.equal(counts(s.tank).dark,12);
  assert.ok(cohort(s.tank).every(e=>e.genotype==='Aa'&&e.genetics.parents[0]===m.uid&&e.genetics.parents[1]===f.uid));
  s.stage='choose-f1';const current=cohort(s.tank);selectClassroom(s,current.find(e=>e.sex==='♀').uid,host);selectClassroom(s,current.find(e=>e.sex==='♂').uid,host);
  assert.ok(nextClassroomGeneration(s,host));assert.equal(s.stage,'child');assert.equal(counts(s.tank).n,12);assert.equal(s.tank.genetics.enabled,false);
  const event=s.events.at(-1);for(const e of cohort(s.tank)){const c=event.children.find(c=>c.uid===e.uid);assert.equal([...c.inheritedAlleles].sort().join(''),e.genotype);}
  const reloaded=validateClassroom(decodeSingle(encodeSingle(s)),host);assert.deepEqual(classroomContext(reloaded),classroomContext(s));
  const corrupted=classroomProduct(s);corrupted.events.at(-1).children[0].inheritedAlleles=['z','z'];assert.throws(()=>validateClassroom(corrupted,host));
 }
});
test('M3 alleles are sampled, with different actual F2 counts across random starts rather than a fixed ratio',()=>{
 const outcomes=new Set();
 for(let seed=1;seed<=20;seed++){const s=createClassroom('m3-hidden-inheritance',host,seed),p=cohort(s.tank);s.parents=[p.find(e=>e.sex==='♀'&&e.genotype==='AA').uid,p.find(e=>e.sex==='♂'&&e.genotype==='aa').uid];nextClassroomGeneration(s,host);s.stage='choose-f1';s.parents=[cohort(s.tank)[0].uid,cohort(s.tank)[1].uid];nextClassroomGeneration(s,host);outcomes.add(counts(s.tank).light);}
 assert.ok(outcomes.size>2);
});
test('M4 serial trials restore actual founders, use new RNG starts, retain all actual parental contributions and reload',()=>{
 const s=createClassroom('m4-dominance-frequency',host,475);predictClassroom(s,'yes');
 for(let trial=0;trial<3;trial++){
  const initial=structuredClone(s.tank);
  for(let g=0;g<3;g++)assert.ok(nextClassroomGeneration(s,host,s.environment||'neutral'));
  assert.equal(s.trials.length,trial+1);const latest=s.events.at(-1);assert.equal(Object.values(latest.offspring).reduce((a,n)=>a+n,0),24);
  const old=JSON.stringify(s.trials);
  if(trial<2){assert.ok(resetClassroomTrial(s));assert.deepEqual(s.tank,s.baseline);assert.equal(JSON.stringify(s.trials),old);assert.notEqual(s.seed,s.initialSeed);}
 }
 assert.equal(new Set(s.trials.map(r=>r.seed)).size,3);assert.equal(s.trials[2].condition,'light');
 assert.ok(s.trials[2].eventContexts.every(e=>Object.values(e.weights).every(w=>[.5,1].includes(w))));
 assert.deepEqual(validateClassroom(decodeSingle(encodeSingle(s)),host).trials,s.trials);
});
test('ecological runs advance only the bound live state, save actual fluxes and completely restore an M5 start',()=>{
 const s=createClassroom('m5-recurring-input',host,1);predictClassroom(s,'yes');assert.ok(classroomMeasure(s,'water',host));assert.ok(beginClassroomObservation(s,host));
 const calls=[];for(let n=0;n<40;n++)advanceClassroom(s,{...host,advance:(t,dt)=>{calls.push(t);host.advance(t,dt);}});
 assert.ok(calls.every(t=>t===s.tank));assert.equal(s.runs[0].samples.length,41);assert.ok(s.runs[0].fluxTotals.decomposition>0);
 const old=JSON.stringify(s.runs[0]);assert.ok(resetClassroomMeasure(s));assert.equal(stateId(s.tank),s.baselineId);assert.equal(classroomContext(s).runId,null);
 assert.equal(classroomMeasure(s,'water',host),false);assert.ok(classroomMeasure(s,'feed',host));assert.equal(s.tank.feedRate,1);assert.equal(JSON.stringify(s.runs[0]),old);
 assert.deepEqual(validateClassroom(decodeSingle(encodeSingle(s)),host).tank,s.tank);
});
test('M2 feeds once rather than running a hidden continuing input; selection after completion cannot change its evidence',()=>{
 const s=createClassroom('m2-food-transformation',host,1);assert.equal(s.tank.autoFeed,false);assert.equal(s.tank.feedReserve,0);
 predictClassroom(s,'no');const before=s.tank.detritus;assert.ok(classroomFeed(s,host));assert.equal(s.tank.detritus,before+.12);assert.equal(classroomFeed(s,host),false);
 assert.equal(selectClassroom(s,s.tank.entities.find(e=>e.species==='waterweed').uid,host),false);
});
test('import rejects invented completed stages, unmatched fluxes and mismatched selected plant growth',()=>{
 const s=createClassroom('m6-plant-carbon',host,1);predictClassroom(s,'unsure');selectClassroom(s,s.tank.entities.find(e=>e.species==='waterweed').uid,host);beginClassroomObservation(s,host);
 for(let i=0;i<12;i++)advanceClassroom(s,host);
 const badFlux=classroomProduct(s);badFlux.runs[0].fluxTotals.decomposition+=2;assert.throws(()=>validateClassroom(badFlux,host));
 const badPlant=classroomProduct(s);badPlant.runs[0].samples[3].selectedPlantBiomass+=1;assert.throws(()=>validateClassroom(badPlant,host));
 const badCompletion=classroomProduct(s);badCompletion.stage='complete';assert.throws(()=>validateClassroom(badCompletion,host));
 const unknown=classroomProduct(s);unknown.stage='magic';assert.throws(()=>validateClassroom(unknown,host));
});
test('teacher preferences are bounded, local, and do not turn selected text into a mandatory own explanation',async()=>{
 const {readSingleTeacher,writeSingleTeacher}=await import('../single-teacher-settings.mjs');const values=new Map(),storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
 assert.deepEqual(readSingleTeacher(storage),{version:1,hints:true,ownExplanation:true});writeSingleTeacher({hints:false,ownExplanation:false},storage);assert.deepEqual(readSingleTeacher(storage),{version:1,hints:false,ownExplanation:false});
});
