import test from 'node:test';
import assert from 'node:assert/strict';
import {connectProcess} from '../learning-process-workspace.mjs';
import {newQuest,questEvent} from '../learning-quests.mjs';
import {pendingActivity,ACTIVITIES} from '../learning-activities.mjs';
import {ammoniaPartition,ammoniaPoolContract,ammoniaPoolLabel,newAmmoniaPoolContract} from '../ammonia-pool.mjs';
import {ammoniaConcentration,ammoniaRisk} from '../biology-quality.mjs';
import {oxidizeNitrogen} from '../bioprocesses.mjs';
const context=id=>({investigationId:id,attemptId:'attempt',time:45.25,side:'both',axis:'day',revision:'test',seriesId:id,repetition:1});
test('P4: actual food and decomposition connections earn their own object actions; invalid links earn nothing',()=>{
 const s={quest:newQuest('8-foodweb')};let r=connectProcess(s,'8-foodweb','food','light',context('one'));
 assert.equal(r.accepted,false);assert.deepEqual(s.quest.activities,[]);
 r=connectProcess(s,'8-foodweb','food','fish',context('one'));assert.ok(r.completed);
 assert.equal(s.quest.activities[0].kind,'connection');assert.equal(s.quest.activities[0].origin,'game-action');
 assert.equal(pendingActivity(s.quest).id,'rest-decomposer');
 connectProcess(s,'8-foodweb','remains','decomposer',context('one'));assert.equal(s.quest.activities.length,2);
});
test('P4: matter returns and energy exit remain distinct; old investigation arrows cannot fulfil a new result task',()=>{
 const s={quest:newQuest('8-foodweb')};s.quest.step=4;s.quest.observed=true;s.quest.activities=ACTIVITIES['8-foodweb'].filter(a=>a.id!=='matter-energy').map(a=>({id:a.id}));
 for(const edge of [['decomposer','minerals'],['minerals','plant']])connectProcess(s,'8-foodweb',...edge,context('old'));
 assert.equal(connectProcess(s,'8-foodweb','fish','heat',context('new')).completed,undefined);
 for(const edge of [['decomposer','minerals'],['minerals','plant']])connectProcess(s,'8-foodweb',...edge,context('new'));
 assert.equal(pendingActivity(s.quest),undefined);assert.equal(s.quest.activities.at(-1).connections.length,3);assert.ok(s.quest.activities.at(-1).connections.every(a=>a.context.investigationId==='new'));
 const links=s.processes['8-foodweb'].links;assert.equal(links.find(e=>e.to==='heat').kind,'energy');assert.equal(links.find(e=>e.to==='minerals').kind,'matter');
});
test('P4: fossil carbon is an additional external material path, not a warming calculation',()=>{
 const s={quest:newQuest('10-carbon')};s.quest.step=4;s.quest.observed=true;s.quest.activities=[{id:'carbon-uptake'},{id:'carbon-return'}];
 assert.ok(connectProcess(s,'10-carbon','fossil','air',context('c')).completed);
 assert.equal(s.quest.activities.at(-1).connections[0].kind,'matter');assert.equal(s.climatePrediction,undefined);
});
test('P4: changed experiments require new interpretation activities, preserving prior observation evidence',()=>{
 const q=newQuest('8-health');q.step=4;q.activities=[{id:'fish-water'},{id:'survival'}];
 questEvent(q,'ecology',{changed:true,compatible:true,result:{kind:'ecology'}});
 assert.deepEqual(q.activities,[{id:'fish-water'}]);assert.equal(q.step,3);
});
test('K: total pool distinguishes TAN equivalent, ionic ammonium and free ammonia quantitatively',()=>{
 for(const temp of [15,25,30]){
  const pKa=.09018+2729.92/(temp+273.15);
  for(const [offset,fraction] of [[-1,1/11],[0,.5],[1,10/11]]){
   const p={temp,ph:pKa+offset,nh4:18},r=ammoniaPartition(p);
   assert.ok(Math.abs(r.ammonia-17*fraction)<1e-12);assert.ok(Math.abs(r.ammonium-18*(1-fraction))<1e-12);
   assert.ok(Math.abs(r.nitrogen-14)<1e-12);assert.equal(ammoniaConcentration(p),r.ammonia);
  }
 }
});
test('K: warning and damage use the same absolute NH3 thresholds across pH and temperature',()=>{
 for(const temp of [15,25,30])for(const ph of [6.5,7.5,9])for(const value of [.019,.021,.101]){
  const fraction=ammoniaPartition({nh4:1,ph,temp}).ammonia;
  const risk=ammoniaRisk({nh4:value/fraction,ph,temp});assert.ok(Math.abs(risk.nh3-value)<1e-12);
  assert.equal(risk.level,value<.02?0:value<.1?1:2);assert.ok(Math.abs(risk.penalty-(value<.02?0:(value-.02)*50+.25))<1e-12);
 }
});
test('K: TAN equivalent oxidation conserves nitrogen and respects oxygen for both stages',()=>{
 const nitrogen=p=>p.nh4*14/18+p.no2*14/46+p.no3*14/62;
 for(const oxygen of [0,.1,2,8]){
  const p={nh4:2,no2:.6,no3:12,oxygen},start=nitrogen(p),flux=oxidizeNitrogen(p,{ammoniaCapacity:1.3,nitriteCapacity:.8});
  assert.ok(Math.abs(nitrogen(p)-start)<1e-12);assert.ok(Math.abs(oxygen-p.oxygen-flux.nitrificationOxygen)<1e-12);assert.ok(p.oxygen>=0);
 }
});
test('K: legacy numbers retain an undocumented basis; new contracts explicitly declare TAN equivalents',()=>{
 const raw={nh4:2};const before=structuredClone(raw),old=ammoniaPoolContract();
 assert.equal(old.version,0);assert.match(ammoniaPoolLabel(old).unit,/nicht dokumentierte/);assert.deepEqual(raw,before);
 assert.deepEqual(ammoniaPoolContract(newAmmoniaPoolContract()),newAmmoniaPoolContract());
});

test('P4: plant display ratios preserve original values and use one beginning across both sides',async()=>{
 const {relativePlantComparison,learnerPrecision}=await import('../learning-display.mjs');
 const comp={kind:'ecology',runs:[{control:[{day:45,plantBiomass:4},{day:46,plantBiomass:6}],test:[{day:45,plantBiomass:4},{day:46,plantBiomass:8}]}]};
 const before=structuredClone(comp),view=relativePlantComparison(comp);
 assert.deepEqual(view.runs[0].control.map(s=>s.plantBiomass),[1,1.5]);assert.deepEqual(view.runs[0].test.map(s=>s.plantBiomass),[1,2]);assert.deepEqual(comp,before);
 assert.equal(learnerPrecision('fishDead'),0);assert.equal(learnerPrecision('temp'),1);
 comp.runs[0].control[0].plantBiomass=0;assert.equal(relativePlantComparison(comp).runs[0].test[1].plantBiomass,null);
});

test('P4: nominal generation settings cannot replace actual generations after reproduction stops',async()=>{
 const {createLearningPopulation,compareLearningPopulations}=await import('../learning-population.mjs');
 const {populationPairEvidence}=await import('../learning-activities.mjs');
 const p=createLearningPopulation(47,4);for(const i of [...p.archive,...p.individuals])i.sex='♀';
 const neutral=compareLearningPopulations(p,'neutral',5,2),directed=compareLearningPopulations(p,'dark',5,2);
 assert.equal(neutral.generations,5);assert.ok(neutral.runs.every(r=>r.status.control.state==='stopped' && r.control.at(-1).generation===0));
 assert.equal(populationPairEvidence([neutral],directed).complete,false);
});
