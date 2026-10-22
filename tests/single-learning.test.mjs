import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SINGLE_MISSIONS,LEGACY_MISSION_TARGETS} from '../single-learning-missions.mjs';
import {learningSlot,normalizeLearningTag} from '../learning-model.mjs';
import {createSingleM1,selectSinglePlant,predictSingle,beginSingleObservation,advanceSingleObservation,resetSingleForDark,darkenSingle,answerSingle,singleObservationChoices,singleContext,encodeSingle,decodeSingle,validateSingle} from '../single-learning-model.mjs';
import {stateId,archivedTank} from '../learning-context.mjs';
const types=JSON.parse(readFileSync(new URL('./fixtures/ecology-species.json',import.meta.url)));
const host={types,create:()=>({params:{},entities:[],nextId:1,deaths:[]}),normalize:structuredClone,
 add:(s,id)=>{const e={uid:s.nextId++,species:id,health:100,age:30,biomass:.7,dead:false};s.entities.push(e);return e;},
 advance(s,dt){s.day+=dt;s.seed++;s.params.oxygen+=s.hours?.1:.05;}};
function ready(){const s=createSingleM1(host);selectSinglePlant(s,s.tank.entities.find(e=>e.species==='waterweed').uid,types);predictSingle(s,0);return s;}
function finish(s,h=host){beginSingleObservation(s,types);for(let i=0;i<12;i++)advanceSingleObservation(s,h);}
test('six new identities cover fourteen old targets; the heater is not a new mission',()=>{
 assert.equal(SINGLE_MISSIONS.length,6);assert.equal(Object.keys(LEGACY_MISSION_TARGETS).length,14);
 assert.deepEqual(SINGLE_MISSIONS.filter(m=>m.ready).map(m=>m.id),['m1-light-oxygen']);
 assert.equal(normalizeLearningTag({version:2,grade:8,mode:'missions',mission:'m1-light-oxygen'}).version,2);
 assert.notEqual(learningSlot({version:2,grade:8,mode:'missions',mission:'m1-light-oxygen'}),learningSlot({version:1,grade:8,mode:'missions',mission:'8-oxygen'}));
 assert.throws(()=>normalizeLearningTag({version:2,grade:8,mode:'missions',mission:'8-ecosystem'}));
});
test('a real plant selection and a neutral prediction precede observation',()=>{
 const s=createSingleM1(host);assert.equal(beginSingleObservation(s,types),false);
 assert.equal(selectSinglePlant(s,s.tank.entities.find(e=>e.species==='guppy').uid,types),false);
 const seed=s.tank.seed;assert.ok(selectSinglePlant(s,s.tank.entities.find(e=>e.species==='waterweed').uid,types));
 assert.ok(predictSingle(s,0));assert.equal(s.prediction.origin,'selection');assert.equal(s.tank.seed,seed);
});
test('only one active reference advances; a visible full reset preserves the entire first run',()=>{
 const s=ready(),initial=structuredClone(s.tank),references=[];
 const h={...host,advance(tank,dt){references.push(tank);host.advance(tank,dt);}};
 finish(s,h);assert.equal(s.stage,'light-finished');assert.equal(references.length,12);assert.ok(references.every(t=>t===s.tank));
 const archived=JSON.stringify(s.runs[0]);assert.ok(resetSingleForDark(s));assert.deepEqual(s.tank,initial);
 assert.equal(s.events.at(-1).restoredId,s.baselineId);assert.ok(darkenSingle(s));
 const expected=structuredClone(initial);expected.hours=0;assert.deepEqual(s.tank,expected);
 finish(s,h);assert.equal(s.stage,'compare');assert.equal(references.length,24);assert.equal(JSON.stringify(s.runs[0]),archived);
 assert.equal(s.runs[0].samples.length,13);assert.equal(s.runs[1].samples.length,13);
 const context=singleContext(s);assert.equal(context.stateId,stateId(s.tank));assert.equal(context.time,s.tank.day);
});
test('rising oxygen without light remains a valid measured finding, not a required fall',()=>{
 const s=ready();finish(s);resetSingleForDark(s);darkenSingle(s);finish(s);
 assert.match(singleObservationChoices(s)[0].text,/Mit Licht: höher. Ohne Licht: höher/);
 assert.equal(answerSingle(s,'reversed-dark'),false);assert.equal(s.stage,'compare');
 assert.ok(answerSingle(s,'observed'));assert.equal(answerSingle(s,'net-proof'),false);
 assert.ok(answerSingle(s,'processes'));assert.equal(s.stage,'complete');assert.equal(s.ownText,'');
});
test('actual checkpoint identity, compression and reload retain new and historical evidence',()=>{
 const s=ready();finish(s);resetSingleForDark(s);darkenSingle(s);finish(s);
 answerSingle(s,'observed');answerSingle(s,'processes');
 const original=JSON.stringify(s.runs),encoded=encodeSingle(s),restored=validateSingle(decodeSingle(encoded),host);
 assert.equal(JSON.stringify(restored.runs),original);assert.equal(restored.attemptId,s.attemptId);
 const before=JSON.stringify(restored);const picture=archivedTank(restored.runs[0].archive,restored.baseline.day+.25);picture.params.oxygen=100;
 assert.equal(JSON.stringify(restored),before);
 const bad=structuredClone(restored);bad.runs[0].samples[1].oxygen+=1;assert.throws(()=>validateSingle(bad,host));
 const resetBad=structuredClone(restored);resetBad.runs[1].startSnapshot.feedRate=3;assert.throws(()=>validateSingle(resetBad,host));
});
test('a failed sole tank stops without padded measurements or values for absent animals',()=>{
 const s=ready();beginSingleObservation(s,types);
 advanceSingleObservation(s,{...host,advance(t,dt){host.advance(t,dt);t.failed=true;}});
 assert.equal(s.stage,'failed');const n=s.runs[0].samples.length;
 assert.equal(advanceSingleObservation(s,host),false);assert.equal(s.runs[0].samples.length,n);
 assert.equal(resetSingleForDark(s),false);
});
