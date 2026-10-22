import {assignActivity} from "../learning-activities.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import {controlNumber, validControlValue, requireControlValue, snapControlValue, EQUIPMENT_CONTROLS, EXPERT_ENVIRONMENT_CONTROLS, applyEquipmentSetting, advanceWaterTemperature} from "../control-values.mjs";
import {LEARNING_TOOLS, reconcileLearningStudy, applyLearningIntervention, runLearningComparison, snapshotLearningPlan, planMatchesComparison, validateLearningProduct} from "../learning-model.mjs";
import {MISSIONS} from "../learning-content.mjs";
import {QUESTS, newQuest, questEvent, answerQuest, comparisonReading, resultQuestion} from "../learning-quests.mjs";
import {dialControl} from "../control-dial.mjs";
const tank = () => ({day:45,seed:47291,liters:180,heater:true,setTemp:25,hours:8,intensity:80,filter:"external300",flow:75,autoFeed:true,feedRate:.65,co2Dose:0,bacteria:.85,bacteria2:.82,entities:[],params:{temp:25,ph:7.15,nh4:.015,no2:.015,no3:12,po4:.4,fe:.08,oxygen:7.5,co2:8},detritus:.2,algae:.07});
test("switching old installed aerators and skimmers preserves ownership, water, time and unrelated data",()=>{
  for (const key of ["air", "skimmer"]) {
    const before={...tank(),[key]:true,history:[{day:44,no2:.02}]};
    const off=applyEquipmentSetting(before,key,false);
    assert.equal(off[key],false);assert.ok(off.ownedEquipment.includes(key));
    assert.deepEqual({...off,[key]:true,ownedEquipment:undefined},{...before,ownedEquipment:undefined});
    assert.equal(applyEquipmentSetting(off,key,true)[key],true);
    assert.equal(before[key],true);assert.throws(()=>applyEquipmentSetting(before,key,"false"),/Ein oder Aus/);
  }
});
test("expert feeding retains 0.65 exactly; window-light controls share decimal validation without adding a lamp",()=>{
  const before=tank();assert.equal(requireControlValue("0,65",EXPERT_ENVIRONMENT_CONTROLS.feedRate),before.feedRate);
  assert.equal(requireControlValue("11",EXPERT_ENVIRONMENT_CONTROLS.hours),11);
  assert.equal(requireControlValue("95",EXPERT_ENVIRONMENT_CONTROLS.intensity),95);
  for (const def of Object.values(EXPERT_ENVIRONMENT_CONTROLS)) assert.throws(()=>requireControlValue("",def));
  assert.equal(before.feedRate,.65);
});
test("all defaults and all fourteen quest interventions obey the shared numeric contract",()=>{
  for(const def of Object.values(LEARNING_TOOLS)) assert.ok(validControlValue(def.value,def),def.label);
  for(const mission of MISSIONS) {
    const e=QUESTS[mission.id].experiment;
    if(e.kind!=="ecology")continue;
    assert.ok(mission.tools.includes(e.tool));assert.ok(validControlValue(e.value,LEARNING_TOOLS[e.tool]),mission.id);
  }
});
test("old feed defaults and now-unavailable tools reconcile without changing the original plan or erasing explicit drafts",()=>{
  const old={tool:"water",value:50,days:7},next=reconcileLearningStudy(old,["light","temperature"]);
  assert.equal(next.tool,"light");assert.equal(next.value,8);assert.equal(next.days,7);assert.equal(old.value,50);
  assert.equal(reconcileLearningStudy({tool:"feed",value:.65},["feed"]).value,.75);
  const draft={tool:"feed",value:null,drafts:{feed:""}};assert.deepEqual(reconcileLearningStudy(draft,["feed"]),draft);
});
test("German decimal input accepts 24,5; empty, nonfinite, out-of-range and off-step inputs explain the allowed range",()=>{
  const d=LEARNING_TOOLS.temperature;
  for(const value of [24.5,"24,5","24.5"," 24,5 "])assert.equal(requireControlValue(value,d),24.5);
  for(const value of ["", " ", "NaN", NaN, Infinity, "24,5,0", "1e2", "24.25",19,31])assert.throws(()=>requireControlValue(value,d),/20 bis 30 °C.*0.5/);
  assert.ok(Number.isNaN(controlNumber(null)));assert.equal(snapControlValue(99,d),30);assert.equal(snapControlValue(24.6,d),24.5);
});
test("heater, lamp and filter persist without changing the current water or time and do not reset filter bacteria",()=>{
  const old=tank();let s=applyEquipmentSetting(old,"temperature","24,5");
  s=applyEquipmentSetting(s,"light",10);s=applyEquipmentSetting(s,"filter",40);
  s=JSON.parse(JSON.stringify(s));
  assert.equal(s.setTemp,24.5);assert.equal(s.hours,10);assert.equal(s.flow,40);
  assert.equal(s.day,45);assert.deepEqual(s.params,old.params);assert.equal(s.bacteria,.85);assert.equal(s.bacteria2,.82);
  assert.deepEqual(old,tank());
  for(let i=0;i<40;i++)advanceWaterTemperature(s,.25);
  assert.ok(s.params.temp<25&&s.params.temp>24.5);assert.equal(s.setTemp,24.5);assert.equal(s.hours,10);assert.equal(s.flow,40);
});
test("temperature reacts gradually, never refrigerates below room temperature, and is independent of time step subdivision",()=>{
  const whole=tank(),quarters=tank();whole.setTemp=quarters.setTemp=20;
  advanceWaterTemperature(whole,3);for(let i=0;i<12;i++)advanceWaterTemperature(quarters,.25);
  assert.ok(whole.params.temp>22&&whole.params.temp<25);assert.ok(Math.abs(whole.params.temp-quarters.params.temp)<1e-10);
  const off=tank();off.heater=false;advanceWaterTemperature(off,30);assert.ok(off.params.temp>=22);
  const hot=applyEquipmentSetting(tank(),"temperature",30);advanceWaterTemperature(hot,.25);assert.ok(hot.params.temp>25&&hot.params.temp<30);
});
test("observation windows do not expire settings or repeat one-off water and nutrient actions",()=>{
  let waterCalls=0;
  const host={types:{},normalize:structuredClone,advance:(s,dt)=>{advanceWaterTemperature(s,dt);s.day+=dt;},waterChange:(s,p)=>{waterCalls++;s.params.no3*=1-p/100;}};
  const before=tank(),comp=runLearningComparison(before,{tool:"temperature",value:24.5,days:2,repetitions:1},host);
  assert.equal(before.params.temp,25);assert.equal(comp.runs[0].finalTest.setTemp,24.5);
  const final=comp.runs[0].finalTest;host.advance(final,3);assert.equal(final.setTemp,24.5);assert.ok(final.params.temp<comp.runs[0].test.at(-1).temp);
  runLearningComparison(before,{tool:"water",value:30,days:14,repetitions:2},host);assert.equal(waterCalls,2);
  const nutrients=runLearningComparison(before,{tool:"nutrients",value:20,days:14,repetitions:1},host);assert.equal(nutrients.runs[0].finalTest.params.no3,32);
});
test("Mission 1 only completes after a changed, computed temperature experiment and correct evidence-based answers",()=>{
  const q=newQuest("8-ecosystem"),d=QUESTS[q.id];
  assert.equal(answerQuest(q,0),false);questEvent(q,"observe");assignActivity(q,"living",0);assignActivity(q,"water",1);answerQuest(q,0);answerQuest(q,1);
  assert.equal(q.step,2);assert.equal(answerQuest(q,0),false);
  const host={types:{},normalize:structuredClone,advance:(s,dt)=>{advanceWaterTemperature(s,dt);s.day+=dt;}};
  const before=tank(),study={tool:"temperature",value:27,days:3,repetitions:1},profile={version:1,grade:8,mode:"missions",mission:q.id},notes={};
  const plan=()=>snapshotLearningPlan({kind:"ecology",baseline:before,study,profile,notes,metrics:["temp"]});
  const c=runLearningComparison(before,{...study,configuration:plan()},host),r=comparisonReading(c,d.experiment);
  assert.ok(r.control<r.test);assert.equal(questEvent(q,"ecology",{changed:false,result:r}),false);
  assert.equal(questEvent(q,"ecology",{changed:true,compatible:true,result:r}),true);
  study.value=28;assert.equal(planMatchesComparison(c,plan()),false);study.value=27;assert.equal(planMatchesComparison(c,plan()),true);
  assert.equal(answerQuest(q,0),false);assert.equal(q.step,3);
  assert.equal(answerQuest(q,resultQuestion(d,r).correct),true);assert.equal(answerQuest(q,1),false);assert.equal(answerQuest(q,0),true);assert.equal(q.step,5);
  assert.equal(q.entries.length,5);
  assert.equal(validateLearningProduct({type:"aquarium-learning-product",version:2,profile,notes,quest:q,comparison:c,measurements:[]}).quest.step,5);
});
test("an empty edited value stays an invalid draft instead of silently becoming zero or the default",()=>{
  const p=snapshotLearningPlan({kind:"ecology",baseline:tank(),study:{tool:"temperature",value:null,drafts:{temperature:""},days:3,repetitions:1},profile:{version:1,grade:8,mode:"free",mission:null},notes:{},metrics:["temp"]});
  assert.ok(Number.isNaN(p.value));
});
test("redrawing a numeric or comma draft keeps the visible dial and its accessible value in sync",()=>{
  for(const raw of [26,"26","26,5"]){
    const html=dialControl(LEARNING_TOOLS.temperature,raw);
    assert.ok(html.includes(`aria-valuenow="${controlNumber(raw)}"`));
    assert.ok(html.includes(`value="${raw}"`));
  }
});
test("a recomputed pending conclusion replaces the reading and requires a fresh result answer, while completed quests keep their history",()=>{
  const s=newQuest("8-ecosystem");questEvent(s,"observe");assignActivity(s,"living",0);assignActivity(s,"water",1);answerQuest(s,0);answerQuest(s,1);
  const first={kind:"ecology",control:25,test:24,time:48};
  questEvent(s,"ecology",{changed:true,result:first});answerQuest(s,0);assert.equal(s.step,4);
  const second={kind:"ecology",control:25,test:26,time:48};
  questEvent(s,"ecology",{changed:true,result:second});assert.equal(s.step,3);assert.equal(s.entries.length,3);assert.equal(s.result.test,26);
  assert.equal(answerQuest(s,0),false);answerQuest(s,1);answerQuest(s,0);assert.equal(s.step,5);
  const done=structuredClone(s);assert.equal(questEvent(s,"ecology",{changed:true,result:first}),false);assert.deepEqual(s,done);
});
