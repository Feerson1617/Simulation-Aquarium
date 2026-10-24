import test from "node:test";
import assert from "node:assert/strict";
import {tankArchive,appendTankFrame,archivedTank,stateId,interventionEvent,bindComparison,
  resolveComparisonView,selectComparisonView,validateTankArchive,packTankArchive,unpackTankArchive} from "../learning-context.mjs";
import {runLearningComparison,applyLearningIntervention,comparisonCSV,validateLearningComparison,validateLearningProduct,snapshotLearningPlan,LEARNING_MODEL_REVISION} from "../learning-model.mjs";
import {temperatureView,temperatureRunLabel} from "../learning-workspace.mjs";
import {readFileSync} from "node:fs";
import {answerQuest,newQuest,resultQuestion,QUESTS} from "../learning-quests.mjs";

const tank = () => ({day:45,seed:7,liters:180,setTemp:25,hours:8,flow:70,
  params:{temp:25,oxygen:8,no2:0,no3:12,co2:8,po4:.3,fe:.08,nh4:0,ph:7},
  detritus:0,algae:0,events:[],entities:[{uid:1,species:"guppy",health:100,age:30,x:0,z:0}]});
const host = {types:{guppy:{category:"fish"}},normalize:structuredClone,
  waterChange(s,pct){s.events.push({text:"Wasserwechsel"});s.params.no3 *= 1-pct/100;},
  advance(s,dt){s.day+=dt;s.params.temp+=(s.setTemp-s.params.temp)*.03;s.entities[0].age+=dt;
    if (!s.protected && s.day>=48.25) {s.failed=true;s.failureCause="nitrite";s.entities[0].dead=true;}}};
const run=(value=27,days=3,repetitions=2)=>bindComparison(runLearningComparison(tank(),
  {tool:"temperature",value,days,repetitions},host),"attempt-one");

test("AT03: the selected older series and repetition resolve together, including a copied actual state",()=>{
  const old=run(27),recent=run(26),session={comparison:recent,comparisonHistory:[old],study:{series:0,run:1}};
  const before=JSON.stringify(session);const v=resolveComparisonView(session);
  assert.equal(v.comparison.id,old.id);assert.equal(v.context.repetition,2);assert.equal(v.sides.test.state.setTemp,27);
  assert.equal(v.sides.test.state.seed,old.runs[1].seed);assert.equal(v.context.stateIds.test,stateId(v.sides.test.state));
  v.sides.test.state.params.temp=99;assert.equal(JSON.stringify(session),before);
  assert.notEqual(resolveComparisonView(session).sides.test.state.params.temp,99);
});
test("AT04: early, failed and later independent states are actual checkpoints; no padding",()=>{
  const base=tank();const c=bindComparison(runLearningComparison(base,{tool:"water",value:50,days:14,repetitions:1},
    {...host,waterChange(s){s.protected=true;}}),"a");
  const session={comparison:c,study:{}};
  let v=selectComparisonView(session,{time:45.25});assert.equal(v.sides.control.state.day,45.25);assert.equal(v.sides.control.state.entities[0].dead,undefined);
  v=selectComparisonView(session,{time:48.25});assert.equal(v.sides.control.state.entities[0].dead,true);assert.equal(v.context.time,48.25);
  v=selectComparisonView(session,{time:59});assert.equal(v.sides.control.state,null);assert.equal(v.sides.control.sample,null);
  assert.equal(v.sides.test.state.day,59);assert.equal(v.sides.test.state.entities[0].dead,undefined);
});
test("AT05: zero water exchange leaves no journal evidence; a true exchange remains meaningful even with equal end values",()=>{
  let calls=0;const s=tank(), h={...host,waterChange(s){calls++;s.events.push({text:"journal only"});}};
  const zero=applyLearningIntervention(s,"water",0,h);assert.equal(calls,0);assert.deepEqual(zero,s);
  assert.equal(interventionEvent(s,zero,"water",0).effective,false);
  const trueChange=applyLearningIntervention(s,"water",30,h);assert.equal(calls,1);
  const event=interventionEvent(s,trueChange,"water",30);assert.equal(event.effective,true);assert.equal(event.exchangedLiters,54);
  assert.deepEqual(trueChange.params,s.params);
  const journalOnly=structuredClone(s);journalOnly.events.push({text:"unrelated"});
  assert.equal(interventionEvent(s,journalOnly,"light",8).effective,false);
});
test("AT05: same equipment setting and zero nutrients are no manipulation, actual setting change is",()=>{
  const s=tank();
  for(const [tool,value] of [["light",8],["temperature",25],["nutrients",0]]) {
    const next=applyLearningIntervention(s,tool,value,host);assert.equal(interventionEvent(s,next,tool,value).effective,false);
  }
  const next=applyLearningIntervention(s,"temperature",27,host);assert.equal(next.params.temp,25);
  assert.equal(interventionEvent(s,next,"temperature",27).effective,true);
});
test("AT02: before and after intervention are separate; actual checkpoints reproduce every recorded temperature",()=>{
  const c=run(),r=c.runs[0];assert.equal(r.initialTest.setTemp,25);assert.equal(r.preparedTest.setTemp,27);
  assert.equal(r.preparedTest.params.temp,25);assert.equal(r.intervention.effective,true);
  for(const sample of r.test) assert.equal(archivedTank(r.tanks.test,sample.day).params.temp,sample.temp);
  assert.ok(r.finalTest.params.temp>25&&r.finalTest.params.temp<27);
});
test("AT04: archives include birth/removal/death and immutable initial values, not a final-state picture at the wrong time",()=>{
  let s=tank();const a=tankArchive(s);const first=structuredClone(s);s.day=45.25;s.entities.push({uid:2,species:"guppy",health:100});appendTankFrame(a,first,s);
  const second=structuredClone(s);s.day=45.5;s.entities[0].dead=true;s.entities[1].health=80;s.events.push({text:"actual event"});appendTankFrame(a,second,s);
  assert.equal(archivedTank(a,45).entities.length,1);assert.equal(archivedTank(a,45.25).entities.length,2);
  assert.equal(archivedTank(a,45.25).entities[0].dead,undefined);assert.equal(archivedTank(a,45.5).entities[0].dead,true);
  assert.equal(archivedTank(a,45.3),null);
});
test("AT14: historical rows without states explicitly remain measurements-only",()=>{
  const c=run();delete c.runs[0].tanks;const session={comparison:c,study:{}};
  const v=resolveComparisonView(session,{time:45.25});assert.ok(v.sides.test.sample);assert.equal(v.sides.test.state,null);
  assert.equal(v.sides.test.availability,"measurements-only");
  assert.equal(resolveComparisonView(session,{time:48}).sides.test.state.day,48);
});
test("AT03: CSV contains only the selected historical repetition, side and time with matching identity",()=>{
  const c=run(),v=resolveComparisonView({comparison:c,study:{run:1}},{side:"test",time:45.25});
  const csv=comparisonCSV({...c,runs:[v.run],viewContext:v.context});
  assert.match(csv,/Versuch-ID/);assert.match(csv,new RegExp(c.id));assert.match(csv,/attempt-one/);
  const lines=csv.split('\r\n').slice(1);assert.ok(lines.length>1);
  assert.ok(lines.every(line=>line.includes('"45.25"')&&line.includes('"Versuch"')&&!line.includes('"Kontrolle"')));
  assert.match(csv,new RegExp(v.context.stateIds.test));
});
test("AT14: import validates every saved checkpoint and rejects altered histories and unsafe patch paths",()=>{
  const c=run();const clean=validateLearningComparison(c);assert.equal(clean.id,c.id);assert.equal(clean.attemptId,c.attemptId);
  assert.deepEqual(archivedTank(clean.runs[0].tanks.test,45.25),archivedTank(c.runs[0].tanks.test,45.25));
  const tampered=unpackTankArchive(c.runs[0].tanks.test);tampered.frames[1].patch.push({path:["params","temp"],value:99});
  assert.throws(()=>validateTankArchive(tampered,c.runs[0].test));
  const unsafe=unpackTankArchive(c.runs[0].tanks.test);unsafe.frames[1].patch.push({path:["__proto__","x"],value:1});
  assert.throws(()=>validateTankArchive(unsafe,c.runs[0].test));assert.equal({}.x,undefined);
});
test("AT14: compact archives round-trip every state and Unicode text exactly; old uncompressed archives still work",()=>{
  const s=tank();s.events=[{text:"Wasserwechsel, Größe 🌿 – unverändert"}];const a=tankArchive(s);
  for(let i=0;i<56;i++){const before=structuredClone(s);s.day+=.25;s.params.temp+=.012345;s.events.push({text:"Tatsächliche Beobachtung "+i});appendTankFrame(a,before,s);}
  const packed=JSON.parse(JSON.stringify(packTankArchive(a)));
  assert.ok(JSON.stringify(packed).length < JSON.stringify(a).length*.6);
  for(const frame of a.frames)assert.deepEqual(archivedTank(packed,frame.time),archivedTank(a,frame.time));
  assert.deepEqual(archivedTank(packed,59),s);assert.deepEqual(unpackTankArchive(packed),a);
  const broken={...packed,length:packed.length-1};assert.throws(()=>archivedTank(broken,59));
});
test("AT12: the prototype's displayed tenth-degree resolution is also used to answer the visible comparison",()=>{
  const q=QUESTS['8-ecosystem'];assert.equal(resultQuestion(q,{control:25.04,test:25.049,displayPrecision:1}).correct,2);
  assert.equal(resultQuestion(q,{control:25.04,test:25.06,displayPrecision:1}).correct,1);
  const state=newQuest('8-ecosystem');state.step=3;state.result={control:25,test:25.9};state.entries=[];state.activities=[{id:"living"},{id:"water"}];
  assert.equal(answerQuest(state,2,{control:25,test:25,displayPrecision:1}),true);
  assert.deepEqual(state.result,{control:25,test:25.9});assert.equal(state.entries[0].choiceIndex,2);
});
test("AT14: a real older completion can be exported with a selected view and imported without changing known final states or inventing original IDs",()=>{
  const p=JSON.parse(readFileSync(new URL('../docs/biology-quality/evidence/quests/desktop-8-ecosystem.json',import.meta.url)));
  const v=resolveComparisonView({...p,study:{}});p.viewContext=v.context;
  const clean=validateLearningProduct(p);assert.deepEqual(clean.viewContext,v.context);
  assert.equal(clean.viewContext.investigationId,null);assert.equal(clean.viewContext.attemptId,null);
  const restored=resolveComparisonView({...clean,study:{},view:clean.viewContext});
  assert.deepEqual(restored.sides.control.state,v.sides.control.state);assert.deepEqual(restored.sides.test.state,v.sides.test.state);
  assert.equal(resolveComparisonView({...clean,study:{}},{time:45.25}).sides.test.state,null);
});
test("AT03/AT14: unrelated old answers are retained as unassigned evidence, rather than assigned to another run",()=>{
  const p=JSON.parse(readFileSync(new URL('../docs/biology-quality/evidence/quests/desktop-8-ecosystem.json',import.meta.url)));
  const c=run();c.questEvidence=structuredClone(p.quest);c.questEvidence.result.viewContext={investigationId:'another-run'};
  let clean=validateLearningComparison(c);assert.equal(clean.questEvidence,undefined);assert.deepEqual(clean.unassignedQuestEvidence,c.questEvidence);
  assert.deepEqual(validateLearningComparison(clean).unassignedQuestEvidence,c.questEvidence);
  c.questEvidence.result.viewContext.investigationId=c.id;clean=validateLearningComparison(c);assert.deepEqual(clean.questEvidence,c.questEvidence);
});
test("AT14: an unexecuted plan exports its actual prepared states separately from previous measurements",()=>{
  const profile={version:1,grade:8,mode:"missions",mission:"8-ecosystem"};
  const session={baseline:tank(),study:{tool:"temperature",value:26,days:4,repetitions:2},attemptId:"attempt-one",planId:"plan-two",comparison:run(),view:{mode:"plan"}};
  const v=temperatureView(session,host,LEARNING_MODEL_REVISION);
  const currentPlan=snapshotLearningPlan({kind:"ecology",baseline:session.baseline,study:session.study,profile,notes:{},metrics:["temp"]});
  const p={version:2,type:"aquarium-learning-product",profile,notes:{},attemptId:session.attemptId,currentPlan,comparison:session.comparison,
    viewContext:null,visiblePlan:{version:1,context:v.context,control:v.sides.control.state,test:v.sides.test.state}};
  const clean=validateLearningProduct(p);assert.deepEqual(clean.visiblePlan,p.visiblePlan);assert.equal(clean.viewContext,undefined);
  assert.equal(clean.visiblePlan.test.params.temp,25);assert.equal(clean.visiblePlan.test.setTemp,26);
  assert.equal(archivedTank(clean.comparison.runs[0].tanks.test,45).setTemp,27);
  const altered=structuredClone(p);altered.visiblePlan.test.params.temp=99;assert.throws(()=>validateLearningProduct(altered));
  const conflicting=structuredClone(p);conflicting.viewContext=resolveComparisonView({...session,view:null}).context;assert.throws(()=>validateLearningProduct(conflicting));
});
test("AT02: the action names the chosen observation duration, including a one-day plan",()=>{
  assert.equal(temperatureRunLabel(1),"1 Spieltag gemeinsam beobachten");
  for(const d of [3,4,14])assert.equal(temperatureRunLabel(d),`${d} Spieltage gemeinsam beobachten`);
  assert.equal(temperatureRunLabel(0),"Beobachtung starten");assert.equal(temperatureRunLabel(NaN),"Beobachtung starten");
});
