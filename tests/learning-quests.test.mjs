import test from 'node:test';
import assert from 'node:assert/strict';
import {MISSIONS} from '../learning-content.mjs';
import {QUESTS,newQuest,questEvent,answerQuest,resultQuestion,comparisonReading,validateQuest} from '../learning-quests.mjs';
import {validateLearningProduct} from '../learning-model.mjs';
import fs from 'node:fs';
test('all 14 missions have one short objective, five steps and concrete experiment routes',()=>{
 assert.deepEqual(Object.keys(QUESTS),MISSIONS.map(m=>m.id));
 for(const d of Object.values(QUESTS)){assert.ok(d.goal.length<100);assert.equal(d.conclusion.choices.length,3);assert.ok(['ecology','traits','cross','population'].includes(d.experiment.kind));assert.equal(newQuest(d.id).step,0);}
 assert.equal(newQuest(null),null);
});
test('clicking answers cannot bypass observation, experiment or prerequisites; wrong answers are retryable',()=>{
 const s=newQuest('8-oxygen');assert.equal(answerQuest(s,0),false);assert.match(s.feedback,/zuerst/);
 questEvent(s,'observe');assert.equal(answerQuest(s,2),false);assert.equal(s.step,0);assert.equal(answerQuest(s,0),true);
 assert.equal(answerQuest(s,1),true);assert.equal(s.step,2);assert.equal(answerQuest(s,0),false);
 assert.equal(questEvent(s,'cross',{generation:1}),false);
 assert.equal(questEvent(s,'ecology',{changed:false,result:{control:8,test:4}}),false);
 assert.equal(questEvent(s,'ecology',{changed:true,result:{control:8,test:4}}),true);
 assert.equal(answerQuest(s,1),false);assert.equal(s.step,3);assert.equal(answerQuest(s,0),true);
 assert.equal(answerQuest(s,2),false);assert.equal(answerQuest(s,0),true);assert.equal(s.step,5);assert.equal(s.entries.length,5);
});
test('comparison question follows real values, including reversed, equal, and unequal stopping times',()=>{
 const d=QUESTS['8-oxygen'];
 assert.equal(resultQuestion(d,{control:4,test:8}).correct,1);
 assert.equal(resultQuestion(d,{control:8,test:4}).correct,0);
 assert.equal(resultQuestion(d,{control:8,test:8}).correct,2);
 const c={kind:'ecology',runs:[{control:[{day:1,oxygen:8},{day:2,oxygen:5}],test:[{day:1,oxygen:8},{day:2,oxygen:6},{day:3,oxygen:4}],status:{control:{state:'failed',end:2},test:{state:'completed',end:3}}}]};
 const r=comparisonReading(c,d.experiment);assert.equal(r.time,2);assert.equal(r.control,5);assert.equal(r.test,6);assert.equal(r.statuses.control.end,2);
});
test('Mendel questions use actual offspring, traits require both genotypes, selection requires generations',()=>{
 const d=QUESTS['9-mendel'];assert.equal(resultQuestion(d,{dark:1,light:0}).correct,0);assert.equal(resultQuestion(d,{dark:0,light:1}).correct,1);assert.equal(resultQuestion(d,{dark:.5,light:.5}).correct,2);
 const s=newQuest('9-traits');s.step=2;assert.equal(questEvent(s,'traits',{hasAA:true,hasAa:false}),false);assert.equal(questEvent(s,'traits',{hasAA:true,hasAa:true}),true);
 const p=newQuest('9-population');p.step=2;assert.equal(questEvent(p,'population',{result:{},generations:1}),false);assert.equal(questEvent(p,'population',{result:{},generations:2}),true);
});
test('quest records survive version-2 teacher validation; old products without a quest remain readable',()=>{
 const old=JSON.parse(fs.readFileSync(new URL('./fixtures/learning-v1-grade-8.json',import.meta.url)));assert.equal(validateLearningProduct(old).quest,null);
 const s=newQuest(old.profile.mission||'8-oxygen');old.profile={version:1,grade:8,mode:'missions',mission:'8-oxygen'};s.id='8-oxygen';old.quest=s;
 assert.deepEqual(validateLearningProduct(old).quest,s);assert.throws(()=>validateQuest({...s,id:'9-mendel'},'8-oxygen'));assert.throws(()=>validateQuest({...s,step:8},'8-oxygen'));
});
