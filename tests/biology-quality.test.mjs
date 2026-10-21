import {advanceNitrifiers,oxidizeNitrogen} from '../bioprocesses.mjs';
import {ACTIVITIES,pendingActivity,assignActivity,mendelEvidence,populationPairEvidence,recordActivityView,choiceOrder,questHint} from '../learning-activities.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fishStatus,fishStatusText,habitatProblems,populationExplanation,replacementWater,ammoniaRisk,ammoniaConcentration} from '../biology-quality.mjs';
import {learningSample,createLearningTank,validateLearningProduct,waterIndicators} from '../learning-model.mjs';
import {learningProvenance,validateProvenance} from '../learning-provenance.mjs';
import {createLearningPopulation,compareLearningPopulations,crossLearningPopulation,reproductiveWeight} from '../learning-population.mjs';
import {MISSIONS} from '../learning-content.mjs';
import {QUESTS,questConclusion,newQuest,questEvent,answerQuest,resultQuestion,resultTolerance} from '../learning-quests.mjs';
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

test('A05: biological assignments cannot be bypassed, reordered or answered without observing',()=>{
 const s=newQuest('8-foodweb');assert.equal(assignActivity(s,'food-fish',0),false);
 questEvent(s,'observe');assert.equal(assignActivity(s,'rest-decomposer',0),false);assert.equal(assignActivity(s,'food-fish',1),false);assert.equal(answerQuest(s,0),false);
 assert.equal(assignActivity(s,'food-fish',0),true);assert.equal(assignActivity(s,'rest-decomposer',0),true);
 assert.equal(answerQuest(s,0),true);assert.deepEqual(s.activities.map(a=>[a.from,a.to]),[['Futter','Fisch'],['Tote Reste','Zersetzende Pilze und Bakterien']]);
 assert.equal(s.activities[0].origin,'selection');
 assert.deepEqual(Object.keys(ACTIVITIES),Object.keys(QUESTS));
});
test('A05: a real F1 alone cannot complete Mendel; F2 must come from actual F1 Aa parents',()=>{
 let p=createLearningPopulation();p=crossLearningPopulation(p,1,6);const f1=mendelEvidence(p);assert.equal(f1.complete,false);assert.equal(f1.f1.counts.Aa,24);
 const q=newQuest('9-mendel');q.step=2;assert.equal(questEvent(q,'cross',{generation:1,result:{kind:'cross'},mendel:f1}),false);
 const mother=p.individuals.find(i=>i.sex==='♀'),father=p.individuals.find(i=>i.sex==='♂');p=crossLearningPopulation(p,mother.uid,father.uid);const both=mendelEvidence(p);assert.equal(both.complete,true);assert.equal(both.f2.generation,2);assert.equal(both.f2.counts.n,24);assert.equal(questEvent(q,'cross',{generation:2,result:{kind:'cross'},mendel:both}),true);
});
test('A05/A08: selection needs repeated neutral and directed runs from the same actual founders',()=>{
 const p=createLearningPopulation(),config={baseline:{fingerprint:'12345678'}};
 const neutral=compareLearningPopulations(p,'neutral',4,2,config),directed=compareLearningPopulations(p,'light',4,2,config);
 assert.equal(populationPairEvidence([],neutral).complete,false);assert.equal(populationPairEvidence([neutral],directed).complete,true);
 assert.equal(populationPairEvidence([{...neutral,configuration:{baseline:{fingerprint:'abcdef00'}}}],directed).complete,false);
 assert.equal(populationPairEvidence([{...neutral,repetitions:1}],directed).complete,false);
});
test('A05: Wattenmeer uses an actionable regional case with two consequences, never an invented water or plastic experiment',()=>{
 const q=newQuest('10-wadden');assert.equal(QUESTS[q.id].experiment.kind,'case');questEvent(q,'observe');answerQuest(q,0);answerQuest(q,0);
 assert.equal(questEvent(q,'ecology',{changed:true,result:{control:0,test:0}}),false);assert.equal(questEvent(q,'case',{result:{measure:'Mehrweg'}}),false);
 for(const id of ['harbour-interest','harbour-benefit','harbour-effort'])assert.equal(assignActivity(q,id,0),true);
 assert.equal(questEvent(q,'case',{result:{kind:'case',measure:q.activities[0].to}}),true);assert.equal(q.step,3);assert.equal(q.activities.length,3);
});
test('A05: a changed ecological run invalidates the earlier secondary observation',()=>{
 const q=newQuest('10-enrichment');q.step=3;q.activities=[{id:'oxygen-too',kind:'view',evidence:{configuration:{tool:'nutrients',value:40},time:48}}];
 assert.equal(questEvent(q,'ecology',{changed:true,result:{kind:'ecology',control:1,test:2}}),true);assert.equal(pendingActivity(q).id,'oxygen-too');
});

test('A06/A07: the species-compatible heater objective warms 25°C water; comparison tolerance is metric-specific',()=>{
 assert.equal(QUESTS['8-ecosystem'].experiment.value,27);
 const oxygen=QUESTS['8-oxygen'];assert.equal(resultQuestion(oxygen,{control:8,test:8.049}).correct,2);assert.equal(resultQuestion(oxygen,{control:8,test:8.06}).correct,1);
 assert.equal(resultQuestion(QUESTS['8-ecosystem'],{control:25,test:25.09}).correct,2);assert.equal(resultQuestion(QUESTS['8-ecosystem'],{control:25,test:25.11}).correct,1);
 assert.equal(resultQuestion(QUESTS['9-population'],{control:12/24,test:13/24,sampleSize:24}).correct,1);assert.equal(resultTolerance('fishAlive'),0);
});
test('A09: saved answer order survives reload and correct answers do not occupy a constant position',()=>{
 const positions=new Set();for(let seed=0;seed<30;seed++){const q=newQuest('8-oxygen',seed),before=choiceOrder(q,'phase-0',3);assert.deepEqual(choiceOrder(JSON.parse(JSON.stringify(q)),'phase-0',3),before);assert.deepEqual([...before].sort(),[0,1,2]);positions.add(before.indexOf(0));}
 assert.equal(positions.size,3);const q=newQuest('8-oxygen',1);assert.notEqual(questHint(QUESTS[q.id],q,'guided'),questHint(QUESTS[q.id],q,'independent'));assert.match(questHint(QUESTS[q.id],q,'guided'),/Öffne/);
});
test('A10: nitrifiers cannot grow on time or oxygen alone, and growth follows actual substrate oxidation',()=>{
 const bare={bacteria:.2,bacteria2:.2,params:{oxygen:8,nh4:0,no2:0,no3:0}};
 for(let i=0;i<56;i++)advanceNitrifiers(bare,.25,oxidizeNitrogen(bare.params,{ammoniaCapacity:.1,nitriteCapacity:.1}));assert.ok(bare.bacteria<.2&&bare.bacteria2<.2);assert.equal(bare.params.no3,0);
 const fed={bacteria:.2,bacteria2:.2,params:{oxygen:8,nh4:1,no2:.5,no3:0}},flux=oxidizeNitrogen(fed.params,{ammoniaCapacity:.2,nitriteCapacity:.3});advanceNitrifiers(fed,.25,flux);assert.ok(fed.bacteria>.2&&fed.bacteria2>.2);
 const anoxic={bacteria:.2,bacteria2:.2,params:{oxygen:0,nh4:1,no2:1,no3:0}};advanceNitrifiers(anoxic,.25,oxidizeNitrogen(anoxic.params,{ammoniaCapacity:1,nitriteCapacity:1}));assert.ok(anoxic.bacteria<.2&&anoxic.bacteria2<.2);
});
test('A10: warning and health penalty use the same free ammonia and respond consistently to pH and temperature',()=>{
 const low={temp:25,ph:6.5,nh4:1},high={temp:25,ph:9,nh4:.2};assert.equal(ammoniaRisk(low).level,0);assert.equal(ammoniaRisk(low).penalty,0);assert.ok(ammoniaRisk(high).level>0);assert.ok(ammoniaRisk(high).penalty>0);
 assert.ok(ammoniaConcentration({...high,temp:30})>ammoniaConcentration(high));
 const s={params:{...high,no2:0,no3:12,po4:.4,fe:.08,oxygen:8},detritus:0};assert.equal(waterIndicators(s).paths.find(p=>p.key==='ammonia').level,ammoniaRisk(s.params).level);assert.equal(waterIndicators(s).nh3,ammoniaRisk(s.params).nh3);
});

test('A03: rescue comparison cannot prefer a healthy survivor average over more surviving fish',()=>{
 const d=QUESTS['10-restore'];assert.equal(resultQuestion(d,{fish:{control:{fishAlive:2,health:100},test:{fishAlive:3,health:60}}}).correct,1);
 assert.equal(resultQuestion(d,{fish:{control:{fishAlive:0,health:null},test:{fishAlive:0,health:null}}}).correct,2);
 assert.equal(resultQuestion(d,{fish:{control:{fishAlive:3,health:20},test:{fishAlive:3,health:60}}}).correct,1);
});
