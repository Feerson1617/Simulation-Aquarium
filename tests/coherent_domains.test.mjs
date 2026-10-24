import test from 'node:test';
import assert from 'node:assert/strict';
import {createLearningPopulation,crossLearningPopulation,compareLearningPopulations,populationCohort,validateLearningPopulation} from '../learning-population.mjs';
import {populationWorkspaceView} from '../learning-population-workspace.mjs';
import {resolveComparisonView,bindComparison,selectComparisonView,stateId} from '../learning-context.mjs';
import {newQuest,questConclusion,QUESTS,questEvent} from '../learning-quests.mjs';
import {assignActivity,pendingActivity} from '../learning-activities.mjs';
import {snapshotLearningPlan} from '../learning-model.mjs';
import {harbourMeasure,HARBOUR_MEASURES} from '../learning-regional-workspace.mjs';

const f1=()=>crossLearningPopulation(createLearningPopulation(),1,6);
const f2=()=>{const p=f1();return crossLearningPopulation(p,p.individuals.find(i=>i.sex==='♀').uid,p.individuals.find(i=>i.sex==='♂').uid);};
test('P3: historical cohorts contain exactly their original UIDs and counts, without invented RNG state',()=>{
 const p=f2(),before=structuredClone(p);
 for(const generation of [0,1,2]){
  const c=populationCohort(p,generation);assert.equal(c.individuals.length,24);
  assert.deepEqual(c.individuals,p.archive.filter(i=>i.generation===generation));
  assert.deepEqual(c.counts,p.history[generation]);assert.equal(c.seed,undefined);
  c.individuals[0].loci.A[0]='changed';
 }
 assert.deepEqual(p,before);assert.equal(populationCohort(p,3),null);
});
test('P3: actual transmitted alleles retain parent order, even when child genotype is normalized',()=>{
 const p=f2(),archive=new Map(p.archive.map(i=>[i.uid,i]));
 for(const i of p.archive.filter(i=>i.parents.length)){
  assert.deepEqual([...i.inheritedAlleles].sort(),i.loci.A);
  i.inheritedAlleles.forEach((allele,k)=>assert.ok(archive.get(i.parents[k]).loci.A.includes(allele)));
 }
 const validated=validateLearningPopulation(p);assert.deepEqual(validated.archive,p.archive);assert.deepEqual(validated.individuals,p.individuals);assert.equal(validated.seed,p.seed);
 const bad=structuredClone(p);bad.archive.find(i=>i.generation===1).inheritedAlleles=['a','A'];
 assert.throws(()=>validateLearningPopulation(bad),/Allele/);
});
test('P3: old population archives keep missing allele provenance instead of retroactively guessing it',()=>{
 const p=f2();for(const i of [...p.archive,...p.individuals])delete i.inheritedAlleles;
 const old=validateLearningPopulation(p);assert.equal(old.individuals[0].inheritedAlleles,undefined);assert.equal(populationCohort(old,1).individuals.length,24);
});
test('P3: paired generation views use the selected repetition and exact actual cohort on each side',()=>{
 const c=bindComparison(compareLearningPopulations(createLearningPopulation(),'dark',5,2),'attempt');
 const session={comparison:c,study:{run:1}};selectComparisonView(session,{time:2});
 const v=resolveComparisonView(session);assert.equal(v.context.repetition,2);assert.equal(v.context.axis,'generation');
 for(const side of ['control','test']){
  assert.deepEqual(v.sides[side].cohort.individuals,c.runs[1].archives[side].archive.filter(i=>i.generation===2));
  assert.equal(v.context.cohortIds[side],stateId(v.sides[side].cohort));assert.deepEqual(v.sides[side].sample,v.sides[side].cohort.counts);
 }
 assert.notEqual(c.runs[0].seed,c.runs[1].seed);
});
test('P3: viewing old founders does not replace current F2, and a comparison starts with two visible actual groups',()=>{
 const session={population:f2(),attemptId:'attempt',planId:'plan',cohortGeneration:0,study:{}};
 const v=populationWorkspaceView(session,'revision');assert.equal(v.context.time,0);assert.equal(session.population.generation,2);
 session.populationMode='comparison';const plan=populationWorkspaceView(session,'revision');assert.equal(plan.mode,'comparison-plan');assert.equal(plan.context.time,0);
 assert.deepEqual(plan.sides.control.cohort,plan.sides.test.cohort);assert.equal(session.population.generation,2);
});
for(const key of ['returns','gear'])test('P3: harbour '+key+' keeps chosen-specific benefit, effort, conclusion and follow-up',()=>{
 const q=newQuest('10-wadden');q.step=2;q.observed=true;const index=key==='gear'?1:0;
 assert.ok(assignActivity(q,'harbour-interest',index));assert.equal(harbourMeasure(q),key);
 for(const [id,field] of [['harbour-benefit','benefit'],['harbour-effort','effort']]){
  assert.equal(pendingActivity(q).id,id);assert.equal(pendingActivity(q).targets[0],HARBOUR_MEASURES[key][field]);assert.ok(assignActivity(q,id,0));
 }
 const result={kind:'case',measure:HARBOUR_MEASURES[key].label,measureKey:key};
 assert.ok(questEvent(q,'case',{result}));q.step=4;
 assert.equal(pendingActivity(q).targets[0],HARBOUR_MEASURES[key].followup);
 const conclusion=questConclusion(QUESTS['10-wadden'],result);assert.equal(conclusion.choices[0],HARBOUR_MEASURES[key].conclusion);
 assert.ok(conclusion.feedback.includes(HARBOUR_MEASURES[key].effort));
 assert.ok(conclusion.feedback.includes(HARBOUR_MEASURES[key].objection));
});

test('P3: population comparison plan identifies the founders actually used, even after a separate F2 cross',()=>{
 const population=f2(),plan=snapshotLearningPlan({kind:'population',population,study:{environment:'dark',generations:3,repetitions:2},profile:{grade:9,mode:'free'},notes:{}});
 assert.equal(plan.baseline.time,0);assert.equal(plan.baseline.seed,population.initialSeed);
 const founders=snapshotLearningPlan({kind:'population',population:createLearningPopulation(),study:{environment:'dark',generations:3,repetitions:2},profile:{grade:9,mode:'free'},notes:{}});
 assert.deepEqual(plan.baseline,founders.baseline);
});
