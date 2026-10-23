import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {changePhrase,lessonTask} from '../single-classroom-content.mjs';
import {parentSelectionIssue} from '../single-lesson-support.mjs';
import {parentContributionView} from '../single-parent-history.mjs';
import {archiveDescription} from '../single-archive-display.mjs';
import {arrangePreparedScenario} from '../scenario-layout.mjs';
import {createScenario,SCENARIOS} from '../scenarios.mjs';
import {normalizeSpatialState,physicalPlacement} from '../physical-scale.mjs';
const types=JSON.parse(readFileSync(new URL('./fixtures/ecology-species.json',import.meta.url)));
test('M3 guidance distinguishes missing roles and inappropriate crosses without changing fish',()=>{
 const tank={entities:[{uid:1,species:'molly',sex:'♀',genotype:'AA'},{uid:2,species:'molly',sex:'♂',genotype:'AA'},{uid:3,species:'molly',sex:'♀',genotype:'aa'},{uid:4,species:'molly',sex:'♂',genotype:'aa'}]};
 const initial=structuredClone(tank),s={tank,stage:'founders',parents:[]};assert.match(parentSelectionIssue(s),/Noch kein Elternpaar/);
 s.parents=[1];assert.match(parentSelectionIssue(s),/Vater fehlt/);s.parents=[null,4];assert.match(parentSelectionIssue(s),/Mutter fehlt/);s.parents=[1,3];assert.match(parentSelectionIssue(s),/Weibchen und ein Männchen/);
 s.parents=[1,2];assert.match(parentSelectionIssue(s),/dunkel × hell/);s.parents=[1,4];assert.equal(parentSelectionIssue(s),'');s.parents=[3,2];assert.equal(parentSelectionIssue(s),'');
 s.stage='choose-f1';assert.match(parentSelectionIssue(s),/zwei Aa/);assert.deepEqual(tank,initial);
});
test('parent table resolves the selected archived generation, never current individuals',()=>{
 const trial={condition:'light',history:[{generation:2,stateId:'past',tank:{entities:[{uid:53,variant:'gold',genotype:'aa'}]}}],eventContexts:[{generation:3,previousGeneration:2,parentStateId:'past',weights:{53:1},offspring:{53:0}}]};
 const s={generation:3,tank:{entities:[{uid:53,variant:'black',genotype:'AA'}]},trials:[trial]},before=structuredClone(s),html=parentContributionView(s,0,3);
 assert.match(html,/Generation 2 → Nachkommen in Generation 3/);assert.match(html,/hell · aa/);assert.doesNotMatch(html,/dunkel · AA/);assert.match(html,/Chance bei der Elternwahl/);assert.deepEqual(s,before);
 trial.history=[];assert.match(parentContributionView(s,0,3),/nicht dokumentiert/);
});
test('archive titles use available metadata, preserve keys and never invent timestamps',()=>{
 const key='aquarium-single-investigation-v1:m4-dominance-frequency:archive:opaque:1792758000000';
 const d=archiveDescription(key,JSON.stringify({type:'aquarium-classroom-investigation',mission:'m4-dominance-frequency',attemptId:'opaque',tank:{learning:{grade:9}}}));
 assert.equal(d.key,key);assert.match(d.title,/dominante Farbe/);assert.equal(d.grade,9);assert.equal(d.type,'Aquarium-Spielstand');assert(d.date);assert.equal(d.attempt,'Früherer Durchgang');
 const old=archiveDescription('aquarium-learning-notes-v1:8:8-oxygen',JSON.stringify({notes:{prior:'original'}}));assert.equal(old.date,null);assert.equal(old.type,'Eigene Notiz');
});
test('equality, decrease and growth language follows the measured plant, not a desired result',()=>{
 assert.equal(changePhrase(1,1),'so viel wie am Anfang');assert.equal(changePhrase(2,1),'mehr als am Anfang');assert.equal(changePhrase(0,1),'weniger als am Anfang');
 for(const [end,phrase] of [[1,'gleich geblieben'],[2,'gewachsen'],[.5,'abgenommen']]){
  const s={mission:'m6-plant-carbon',stage:'growth-observation',runs:[{samples:[{selectedPlantBiomass:1},{selectedPlantBiomass:end}]}]};assert.match(lessonTask(s,{}).choices[0][1],new RegExp(phrase));
 }
});
test('all five new expert layouts fit every original object, retain sizes/biology and survive reload',()=>{
 const host={create:()=>({params:{},entities:[],nextId:1}),add:(s,id)=>s.entities.push({uid:s.nextId++,species:id,health:100,age:30,biomass:.7,x:0,z:0,rotation:1,scale:1})};
 const biological=e=>Object.fromEntries(Object.entries(e).filter(([k])=>!['x','z','rotation'].includes(k)));
 for(const def of SCENARIOS){const s=createScenario(def.id,host),before=structuredClone(s);arrangePreparedScenario(s,types);assert.deepEqual(s.params,before.params);assert.deepEqual(s.entities.map(biological),before.entities.map(biological));assert.deepEqual(s.spatial.unplaced,[]);for(const e of s.entities)assert(physicalPlacement(s,e,types,e.x,e.z).valid,`${def.id}: ${e.uid}`);const reloaded=structuredClone(s);normalizeSpatialState(reloaded,reloaded.spatial,types);assert.deepEqual(reloaded,s);}
});
