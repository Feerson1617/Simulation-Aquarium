/** Read actual browser downloads; independently recompute observations/interventions.
 * Only the archive codec/state fingerprint are shared with the app. No browser
 * progress is created and neither learningSample nor classroomMeasure is called.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {archivedTank,stateId} from '../learning-context.mjs';
const types=JSON.parse(fs.readFileSync(new URL('../tests/fixtures/ecology-species.json',import.meta.url)));
const inputs=process.argv.slice(2);assert(inputs.length,'Pass actual *-result.json downloads');
const report={atUTC:new Date().toISOString(),method:'Independent arithmetic over actual downloaded records; shared archive decoder only; no simulation or browser progress injected',files:[]};
const close=(a,b,label)=>assert(Math.abs(a-b)<1e-10,`${label}: ${a} != ${b}`);
for(const file of inputs){
 const bytes=fs.readFileSync(file),s=JSON.parse(bytes);assert.equal(s.stage,'complete');assert.equal(stateId(s.baseline),s.baselineId);
 assert(/^m[56]-/.test(s.mission));const row={file:path.basename(file),path:file,mission:s.mission,attempt:s.attemptId,baselineId:s.baselineId,runs:[]};
 for(const run of s.runs){
  const initial=archivedTank(run.archive,run.samples[0].day);assert.deepEqual(initial,run.startSnapshot);
  const sums={};let fields=0;
  for(const [index,sample] of run.samples.entries()){
   const tank=archivedTank(run.archive,sample.day),living=tank.entities.filter(e=>!e.dead),fish=living.filter(e=>types[e.species]?.category==='fish');
   const expected={day:tank.day,temp:tank.params.temp,oxygen:tank.params.oxygen,no3:tank.params.no3,no2:tank.params.no2,co2:tank.params.co2,algae:tank.algae,organic:tank.detritus,
    plantBiomass:living.filter(e=>types[e.species]?.category==='plant').reduce((n,e)=>n+e.biomass,0),fishAlive:fish.length,health:fish.length?fish.reduce((n,e)=>n+e.health,0)/fish.length:null,
    otherAnimals:living.filter(e=>types[e.species]?.category==='invert').length,individuals:living.filter(e=>['fish','invert'].includes(types[e.species]?.category)).length,
    photosynthesis:tank.ecology?.lastFlux?.photosynthesis??null,respiration:tank.ecology?.lastFlux?.respiration??null,failed:!!tank.failed,selectedPlantBiomass:tank.entities.find(e=>e.uid===run.selection)?.biomass??null};
   for(const [key,value] of Object.entries(expected)){assert.deepEqual(sample[key],value,`${file} ${index} ${key}`);fields++;}
   if(index){close(sample.day-run.samples[index-1].day,.25,'recorded time step');for(const [k,v] of Object.entries(tank.ecology.lastFlux))if(Number.isFinite(v)&&!['day','dt'].includes(k))sums[k]=(sums[k]||0)+v;}
  }
  for(const [k,v] of Object.entries(sums))close(run.fluxTotals[k],v,'flux '+k);
  const first=run.samples[0],last=run.samples.at(-1);close(last.day-first.day,s.mission.startsWith('m5')?10:3,'elapsed observation');
  if(s.mission.startsWith('m5')){
   assert.deepEqual(run.intervention.before,s.baseline);assert.deepEqual(run.intervention.after,run.startSnapshot);assert.equal(run.startSnapshot.detritus,s.baseline.detritus);
   assert.equal(s.baseline.autoFeed,true);assert.equal(s.baseline.feedRate,3);
   if(run.condition==='water'){
    const replacement={nh4:0,no2:0,no3:5,po4:.1,co2:3,fe:.05,oxygen:8,temp:25,salinity:0,kh:2.5,gh:12,calcium:60};
    for(const [key,value] of Object.entries(replacement))close(run.startSnapshot.params[key],s.baseline.params[key]*.5+value*.5,'50% mixing '+key);
    for(const key of Object.keys(s.baseline))if(!['params','events'].includes(key))assert.deepEqual(run.startSnapshot[key],s.baseline[key],key);
   }else{
    assert.equal(run.condition,'feed');assert.equal(run.startSnapshot.feedRate,1);
    for(const key of Object.keys(s.baseline))if(!['autoFeed','feedRate'].includes(key))assert.deepEqual(run.startSnapshot[key],s.baseline[key],key);
   }
  }else{
   assert.equal(run.selection,s.selection);const plant=initial.entities.find(e=>e.uid===s.selection);assert.equal(types[plant.species].category,'plant');assert.equal(first.selectedPlantBiomass,plant.biomass);
   assert.equal(plant.biomass,s.baseline.entities.find(e=>e.uid===s.selection).biomass);assert.equal(s.answers['carbon-evidence'].choice,'explanation');row.individual={uid:plant.uid,species:plant.species,initial:plant.biomass,final:last.selectedPlantBiomass};
  }
  row.runs.push({condition:run.condition,fieldsIndependentlyChecked:fields,samples:run.samples.length,initialDay:first.day,finalDay:last.day,organic:[first.organic,last.organic],no3:[first.no3,last.no3],fluxSumsMatch:true});
 }
 if(s.mission.startsWith('m5'))assert.deepEqual(s.runs.map(r=>r.condition).sort(),['feed','water']);
 report.files.push(row);
}
report.status='passed';console.log(JSON.stringify(report,null,2));
