import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fishStatus,fishStatusText,habitatProblems,populationExplanation,replacementWater} from '../biology-quality.mjs';
import {learningSample,createLearningTank,validateLearningProduct} from '../learning-model.mjs';
import {learningProvenance,validateProvenance} from '../learning-provenance.mjs';
import {createLearningPopulation,compareLearningPopulations,reproductiveWeight} from '../learning-population.mjs';
import {MISSIONS} from '../learning-content.mjs';
import {QUESTS,questConclusion} from '../learning-quests.mjs';
const types=JSON.parse(fs.readFileSync(new URL('./fixtures/ecology-species.json',import.meta.url)));
const host={create:()=>({params:{},entities:[],nextId:1,deaths:[]}),add:(s,id)=>{const e={uid:s.nextId++,species:id,health:100,age:30,biomass:.7,dead:false};s.entities.push(e);return e;}};
test('A01: neutral repetitions have equal phenotype weights and drift is never explained as selection',()=>{
 const p=createLearningPopulation(),c=compareLearningPopulations(p,'neutral',5,3);
 for(const i of p.individuals)assert.equal(reproductiveWeight(i,'neutral'),1);
 assert.deepEqual(c.runs[0].control,c.runs[0].test);
 assert.notDeepEqual(c.runs[0].control,c.runs[1].control);
 assert.match(c.assumption,/alle Phänotypen haben Gewicht 1/);
 assert.match(populationExplanation('neutral'),/Keine Farbe.*Zufall/);
 const q=questConclusion(QUESTS['9-population'],{configuration:{environment:'neutral'}});
 assert.match(q.feedback,/Keine Farbe/);assert.doesNotMatch(q.feedback,/Das heißt Selektion/);
 assert.match(questConclusion(QUESTS['9-population'],{configuration:{environment:'dark'}}).feedback,/häufiger Nachkommen/);
});
test('A02: every normal grade/mission tank satisfies unchanged catalog ranges and group requirements',()=>{
 for(const [grade,mission] of [[8,null],[9,null],[10,null],...MISSIONS.map(m=>[m.grade,m.id])]){
  const s=createLearningTank({version:1,grade,mode:mission?'missions':'free',mission},host);
  assert.equal(s.params.gh,12);
  const problems=habitatProblems(s,types),disturbed=['8-health','10-restore'].includes(mission);
  assert.deepEqual(problems.filter(x=>!disturbed||x.key!=='nitrite'),[],String(mission));
  if(disturbed)assert.ok(problems.some(x=>x.key==='nitrite'));
 }
});
test('A03: fish mortality cannot be hidden by healthy snails or survivor averaging',()=>{
 const s={entities:[{uid:1,species:'guppy',health:100},{uid:2,species:'guppy',health:20},{uid:3,species:'ramshorn',health:100}],deaths:[]};
 const before=fishStatus(s,types);assert.equal(before.health,60);assert.equal(before.otherAnimals,1);
 s.entities[1].dead=true;s.entities[1].health=0;s.deaths.push({species:'guppy'});
 const after=fishStatus(s,types);assert.equal(after.health,100);assert.equal(after.fishOutcome,50);assert.ok(after.fishOutcome<before.fishOutcome);assert.equal(after.fishDead,1);
 s.entities[0].dead=true;s.deaths.push({species:'guppy'});
 assert.equal(fishStatus(s,types).health,null);assert.equal(fishStatus(s,types).fishAlive,0);assert.equal(fishStatus(s,types).fishOutcome,0);assert.match(fishStatusText(s,types),/Keine lebenden Fische/);
});
test('A03/A04: old animal samples and undocumented text remain readable without changing meanings or claiming authorship',()=>{
 const old=JSON.parse(fs.readFileSync(new URL('./fixtures/learning-v1-grade-8.json',import.meta.url)));
 const read=validateLearningProduct(old);assert.deepEqual(read.measurements,old.measurements);
 assert.equal(read.provenance.legacy,true);
 for(const k of Object.keys(old.notes))assert.equal(read.provenance.notes[k],'unknown');
 const provenance=learningProvenance({notes:{hypothesis:'Meine Begründung'},noteOrigins:{hypothesis:'own-input'}});
 assert.equal(provenance.notes.hypothesis,'own-input');assert.equal(provenance.questAnswers,'selection');assert.equal(provenance.explanations,'game-explanation');
 assert.equal(validateProvenance(null,{explanation:'Automatischer Alttext'}).notes.explanation,'unknown');
 assert.throws(()=>validateProvenance({version:1,notes:{explanation:'game-explanation'}},{explanation:'x'}));
});

test('A02: prepared replacement water fits all learning fish and does not follow an extreme heater setting',()=>{
 for(const setTemp of [15,20,27,33]){
  const s=createLearningTank({version:1,grade:9,mode:'free',mission:null},host);s.setTemp=setTemp;
  const w=replacementWater(s);assert.equal(w.temp,25);assert.equal(w.gh,12);s.params={...s.params,...w};assert.deepEqual(habitatProblems(s,types),[]);
 }
});
