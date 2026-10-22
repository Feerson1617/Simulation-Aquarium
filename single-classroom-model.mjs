import {createLearningTank,learningSample} from './learning-model.mjs';
import {investigationId,stateId,tankArchive,appendTankFrame,archivedTank,validateTankArchive} from './learning-context.mjs';
import {initializeIndividual,inheritGenotype} from './genetics.mjs';
import {phenotypeFor} from './fish-variants.mjs';
import {populationRandom} from './learning-population.mjs';
import {decodeSingle as decodeOldSingle} from './single-learning-model.mjs';
import {compressArchiveText} from './vendor/lz-string.mjs';
export function decodeSingle(text){return decodeOldSingle(text);}
export function encodeSingle(s){const text=JSON.stringify(classroomProduct(s));return JSON.stringify({version:1,codec:'lz-string-utf16-v1',length:text.length,data:compressArchiveText(text)});}
export const CLASSROOM_REVISION='one-aquarium-lessons-v1';
export const CLASSROOM_IDS=['m2-food-transformation','m3-hidden-inheritance','m4-dominance-frequency','m5-recurring-input','m6-plant-carbon'];
export const classroomSlot=id=>'aquarium-single-investigation-v1:'+id;
const copy=x=>structuredClone(x);
export const isGenetic=s=>['m3-hidden-inheritance','m4-dominance-frequency'].includes(s.mission);
function legacyClassroomContext(s){return {version:1,investigationId:s.id,attemptId:s.attemptId,revision:s.revision,runId:s.currentRun?.id||null,time:isGenetic(s)?s.generation:s.tank.day,timeKind:isGenetic(s)?'generation':'day',stateId:stateId(s.tank)};}
export function classroomContext(s){
 if(s.mission.startsWith('research-'))return legacyClassroomContext(s);
 const genetic=isGenetic(s),prepared=['measure-ready','reset-measure-ready','measure-observe-ready'].includes(s.stage),run=s.currentRun||(!prepared?s.runs.at(-1):null);
 const historicalTrial=!s.geneticRunId?s.trials.findLast(t=>stateId(t.lastTank)===stateId(s.tank)):null;
 return {...legacyClassroomContext(s),version:2,runId:genetic?(s.geneticRunId||historicalTrial?.id||null):(run?.id||null),condition:genetic?(s.mission.startsWith('m3')?'mendel-cross':s.environment||'neutral'):(run?.condition||s.measure||'starting'),...(genetic?{randomSeed:s.trialSeed??s.initialSeed}:{} )};
}
export function classroomProduct(s){return copy({...s,currentContext:classroomContext(s),provenance:{prediction:'selection',answers:'selection',actions:'game-action',measurements:'simulation',ownText:s.ownText?(s.ownTextOrigin||'unknown'):'absent',explanation:'game-explanation'}});}
function event(s,type,detail={}){s.events.push({type,origin:'game-action',context:classroomContext(s),...copy(detail)});}
export function cohort(tank){return tank.entities.filter(e=>e.species==='molly'&&!e.dead);}
export function counts(tank){const p=cohort(tank);return {n:p.length,dark:p.filter(e=>e.variant==='black').length,light:p.filter(e=>e.variant==='gold').length};}
export function createClassroom(id,host,seed=cryptoSeed()){
 if(!CLASSROOM_IDS.includes(id)&&!/^research-(8|9|10)$/.test(id))throw Error('Unbekannte Frage.');
 const grade=id.startsWith('m3')||id.startsWith('m4')?9:id.startsWith('m5')||id.startsWith('m6')?10:id.startsWith('research-')?Number(id.slice(-2).replace('-','')):8;
 let tank=createLearningTank({version:1,grade,mode:'free',mission:null},host);
 tank.learning={version:2,grade,mode:id.startsWith('research')?'free':'missions',mission:id.startsWith('research')?null:id};tank.day=45.25;
 const s={version:1,type:'aquarium-classroom-investigation',mission:id,revision:CLASSROOM_REVISION,id:investigationId(),attemptId:investigationId(),stage:'prediction',tank,baseline:null,runs:[],currentRun:null,events:[],answers:{},prediction:null,selection:null,parents:[],generation:0,history:[],trials:[],ownText:'',ownTextOrigin:'absent',seed:seed>>>0};
 if(isGenetic(s)){
  s.geneticRunId=investigationId();
  tank.liters=700;tank.entities=tank.entities.filter(e=>host.types[e.species]?.category!=='fish');
  tank.genetics={version:1,enabled:false,pairs:{},pedigree:{},clutches:[],notes:'Lernversuch: Generationen nur durch ausdrückliche Handlung.',lastProcessedDay:45};
  const genotypes=id.startsWith('m3')?['AA','aa','aa','AA']:Array.from({length:12},(_,i)=>['AA','Aa','aa'][i%3]);
  genotypes.forEach((g,i)=>{const e=host.add(tank,'molly',false);if(!e)throw Error('Die Lerngruppe passt nicht ins Aquarium.');initializeIndividual(tank,e,{variant:g==='aa'?'gold':'black',genotype:g,sex:i%2?'♂':'♀',replace:true});e.age=30;});
  tank=host.normalize(tank);s.tank=tank;s.stage=id.startsWith('m3')?'founders':'prediction';
 }
 if(id==='m5-recurring-input'){
  tank.autoFeed=true;tank.feedRate=3;host.advance(tank,3);if(tank.failed)throw Error('Der vorbereitete Fall ist nicht stabil.');
 }
 if(id==='m2-food-transformation'){tank.autoFeed=false;tank.feedReserve=0;}
 if(id.startsWith('research'))s.stage='free';
 s.tank=host.normalize(tank);s.baseline=copy(s.tank);s.baselineId=stateId(s.baseline);s.initialSeed=s.seed;return s;
}
function cryptoSeed(){const value=new Uint32Array(1);if(globalThis.crypto?.getRandomValues){crypto.getRandomValues(value);return value[0];}return Date.now()>>>0;}
export function predictClassroom(s,choice){if(s.stage!=='prediction'||!['yes','no','unsure'].includes(choice))return false;s.prediction={choice,origin:'selection',context:classroomContext(s)};s.stage=s.mission==='m2-food-transformation'?'feed-ready':s.mission==='m4-dominance-frequency'?'neutral-ready':s.mission==='m6-plant-carbon'?'plant':'measure-ready';return true;}
export function selectClassroom(s,uid,host){
 const e=s.tank.entities.find(e=>e.uid===uid&&!e.dead);if(!e)return false;
 if(isGenetic(s)){
  if(!['founders','choose-f1','child','inheritance'].includes(s.stage))return false;
  if(e.species!=='molly')return false;s.selection=uid;
  if(['founders','choose-f1'].includes(s.stage)){
   const role=e.sex==='♀'?0:1;s.parents[role]=uid;
  }else if(s.stage==='child'){s.stage='inheritance';}
 }else {if(s.stage!=='plant'||host.types[e.species]?.category!=='plant')return false;s.selection=uid;s.stage='growth-ready';}
 event(s,'select-individual',{uid});return true;
}
function archiveGeneration(s){s.history.push({generation:s.generation,tank:copy(s.tank),counts:counts(s.tank),stateId:stateId(s.tank)});}
/** Current parents and offspring are actual tank entities. Only previous cohorts are archived. */
export function nextClassroomGeneration(s,host,environment='neutral'){
 const current=cohort(s.tank),cross=s.mission==='m3-hidden-inheritance';
 if(cross&&!['founders','choose-f1'].includes(s.stage))return false;
 if(!cross&&!['neutral-ready','neutral-again-ready','selection-ready','generations'].includes(s.stage))return false;
 let mothers=current.filter(e=>e.sex==='♀'),fathers=current.filter(e=>e.sex==='♂');
 if(cross){mothers=current.filter(e=>e.uid===s.parents[0]&&e.sex==='♀');fathers=current.filter(e=>e.uid===s.parents[1]&&e.sex==='♂');
  if(mothers.length!==1||fathers.length!==1)return false;
  if(s.stage==='founders'&&[mothers[0].genotype,fathers[0].genotype].sort().join(',')!=='AA,aa')return false;
  if(s.stage==='choose-f1'&&[mothers[0],fathers[0]].some(e=>e.genotype!=='Aa'))return false;
 }
 if(!mothers.length||!fathers.length)throw Error('Es fehlen passende Eltern in dieser Gruppe.');
 const weight=e=>environment==='light'?(e.variant==='gold'?1:.5):1;
 const pick=pool=>{let n=populationRandom(s)*pool.reduce((a,e)=>a+weight(e),0);for(const e of pool){n-=weight(e);if(n<0)return e;}return pool.at(-1);};
 const plans=Array.from({length:12},(_,i)=>{const m=cross?mothers[0]:pick(mothers),f=cross?fathers[0]:pick(fathers),draws=[];
  const loci=inheritGenotype(m.genetics,f.genetics,()=>{const r=populationRandom(s);draws.push(r);return r;});
  return {mother:m,father:f,loci,sex:i%2?'♂':'♀',inheritedAlleles:[m.genetics.loci.A[Math.floor(draws[0]*2)],f.genetics.loci.A[Math.floor(draws[1]*2)]]};});
 archiveGeneration(s);const previousGeneration=s.generation;s.generation++;
 for(const e of current)s.tank.genetics.pedigree[e.uid].status='abgegeben';
 s.tank.entities=s.tank.entities.filter(e=>e.species!=='molly');s.tank.genetics.pairs={};s.tank.genetics.clutches=[];
 const children=[];
 for(const p of plans){const e=host.add(s.tank,'molly',false);if(!e)throw Error('Die Nachkommen passen nicht ins Aquarium.');
  const g=p.loci.A.join('');initializeIndividual(s.tank,e,{variant:phenotypeFor('molly-mono',p.loci),genotype:g,sex:p.sex,replace:true});
  Object.assign(e.genetics,{parents:[p.mother.uid,p.father.uid],generation:s.generation,filial:'F'+s.generation,founder:false,roots:[...new Set([...p.mother.genetics.roots,...p.father.genetics.roots])],bornDay:s.tank.day});
  e.age=30;const r=s.tank.genetics.pedigree[e.uid];Object.assign(r,copy(e.genetics),{status:'lebend',uid:e.uid,species:e.species,sex:e.sex,variant:e.variant,recordedDay:s.tank.day});children.push({uid:e.uid,parents:[...e.genetics.parents],inheritedAlleles:p.inheritedAlleles});
 }
 s.tank.genetics.enabled=false;s.tank.seed=s.seed;
 const offspring=Object.fromEntries(current.map(e=>[e.uid,children.filter(c=>c.parents.includes(e.uid)).length]));
 event(s,'generation',{generation:s.generation,parentStateId:s.history.at(-1).stateId,previousGeneration,environment,weights:Object.fromEntries(current.map(e=>[e.uid,weight(e)])),offspring,children});
 s.parents=[];s.selection=null;
 if(cross)s.stage=s.generation===1?'f1-observation':'child';
 else {s.stage=s.generation<3?'generations':'trial-finished';s.environment=environment;
  if(s.generation===3)s.trials.push({id:s.geneticRunId||investigationId(),seed:s.trialSeed??s.initialSeed,condition:environment,founders:copy(s.baseline),history:copy(s.history.slice(-3)),lastTank:copy(s.tank),counts:counts(s.tank),eventContexts:copy(s.events.filter(e=>e.type==='generation').slice(-3))});
 }
 return true;
}
export function resetClassroomTrial(s){
 if(s.stage!=='trial-finished'||s.trials.length>=3)return false;
 s.tank=copy(s.baseline);s.generation=0;s.parents=[];s.selection=null;
 s.seed=(s.initialSeed+s.trials.length*104729)>>>0;s.trialSeed=s.seed;s.geneticRunId=investigationId();
 s.environment=s.trials.length===1?'neutral':'light';s.stage=s.trials.length===1?'neutral-again-ready':'selection-ready';
 event(s,'restore-for-independent-trial',{baselineId:s.baselineId,randomSeed:s.seed,independentRandomSequence:true});return true;
}
export function classroomFeed(s,host){if(s.stage!=='feed-ready')return false;const before=s.tank.detritus;host.care(s.tank,'feed');event(s,'one-food-portion',{before,after:s.tank.detritus});s.stage='food-observe-ready';return true;}
export function classroomMeasure(s,measure,host){
 if(!['measure-ready','reset-measure-ready'].includes(s.stage)||!['water','feed'].includes(measure))return false;
 if(s.runs.length&&measure===s.runs[0].condition)return false;
 const before=copy(s.tank);if(measure==='water')host.waterChange(s.tank,50);else {s.tank.autoFeed=true;s.tank.feedRate=1;}
 s.measure=measure;s.pendingIntervention={type:measure,before,after:copy(s.tank)};s.stage='measure-observe-ready';event(s,'measure',{measure});return true;
}
function sample(s,host){return {...learningSample(s.tank,host.types),selectedPlantBiomass:s.tank.entities.find(e=>e.uid===s.selection)?.biomass??null};}
export function beginClassroomObservation(s,host){
 if(!['food-observe-ready','growth-ready','measure-observe-ready'].includes(s.stage))return false;
 const duration=s.mission==='m5-recurring-input'?10:3;
 s.currentRun={id:investigationId(),condition:s.measure||s.mission,startSnapshot:copy(s.tank),baselineId:s.baselineId,intervention:s.pendingIntervention||null,selection:s.selection,duration,archive:tankArchive(s.tank),samples:[sample(s,host)],fluxTotals:{},status:'running'};
 s.stage='observing';event(s,'observation-start');return true;
}
export function advanceClassroom(s,host){
 if(s.stage!=='observing')return false;const r=s.currentRun,before=copy(s.tank);if(!s.tank.failed)host.advance(s.tank,.25);
 if(s.tank.day!==before.day){appendTankFrame(r.archive,before,s.tank);r.samples.push(sample(s,host));for(const [k,v]of Object.entries(s.tank.ecology?.lastFlux||{}))if(Number.isFinite(v)&&!['day','dt'].includes(k))r.fluxTotals[k]=(r.fluxTotals[k]||0)+v;}
 if(s.tank.failed){r.status='failed';s.stage='failed';s.runs.push(copy(r));s.currentRun=null;}
 else if(s.tank.day>=r.startSnapshot.day+r.duration){r.status='completed';s.runs.push(copy(r));s.currentRun=null;s.stage=s.mission==='m2-food-transformation'?'food-observation':s.mission==='m6-plant-carbon'?'growth-observation':s.runs.length===1?'first-measure-finished':'measure-comparison';}
 return true;
}
export function resetClassroomMeasure(s){if(s.stage!=='first-measure-finished')return false;s.tank=copy(s.baseline);s.currentRun=null;s.measure=null;s.pendingIntervention=null;s.stage='reset-measure-ready';event(s,'restore-full-start',{baselineId:s.baselineId});return true;}
export function classroomAnswer(s,choice){
 const solutions={
  'food-observation':'observed','food-process':'decomposer','food-plant':'nutrients','food-evidence':'separate',
  'growth-observation':'observed','carbon-source':'water-carbon','carbon-return':'respiration','carbon-evidence':'explanation',
  'f1-observation':'dark','inheritance':'actual-alleles','transfer':'possible',
  'neutral-comparison':'actual-counts','selection-explanation':'weighted-parents','dominance-explanation':'not-guaranteed',
  'measure-comparison':'actual-late','measure-explanation':'source',
 };
 if(choice!==solutions[s.stage])return false;
 s.answers[s.stage]={choice,origin:'selection',context:classroomContext(s),selection:s.selection,runIds:s.runs.map(r=>r.id),trialIds:s.trials.map(r=>r.id)};
 const next={'food-observation':'filter','food-process':'food-plant','food-plant':'food-evidence','food-evidence':'complete',
  'growth-observation':'carbon-source','carbon-source':'carbon-return','carbon-return':'carbon-evidence','carbon-evidence':'complete',
  'f1-observation':'choose-f1','inheritance':'transfer','transfer':'complete','neutral-comparison':'selection-explanation','selection-explanation':'dominance-explanation','dominance-explanation':'complete',
  'measure-comparison':'measure-explanation','measure-explanation':'complete'};
 s.stage=next[s.stage];return true;
}
export function openClassroomFilter(s){if(s.stage!=='filter')return false;s.stage='food-process';event(s,'filter-explanation',{kind:'enlarged-model-explanation',measuredDecomposition:s.runs[0]?.fluxTotals.decomposition??null});return true;}
export function compareClassroomTrials(s){if(s.stage!=='trial-finished'||s.trials.length!==3)return false;s.stage='neutral-comparison';return true;}
export function validateClassroom(raw,host){
 const s=copy(raw);
 if(s.type!=='aquarium-classroom-investigation'||s.version!==1||s.revision!==CLASSROOM_REVISION||!CLASSROOM_IDS.includes(s.mission)&&!/^research-(8|9|10)$/.test(s.mission))throw Error('Keine passende Sicherung.');
 if(typeof s.stage!=='string'||typeof s.id!=='string'||typeof s.attemptId!=='string'||!Number.isSafeInteger(s.seed)||s.seed<0||s.seed>4294967295||!Number.isInteger(s.generation)||s.generation<0||s.generation>3)throw Error('Ungültiger Untersuchungsstand.');
 const checkTank=t=>{const n=host.normalize(t);if(stateId({...n,events:[]})!==stateId({...t,events:[]}))throw Error('Die Beckendaten sind widersprüchlich.');};
 checkTank(s.tank);checkTank(s.baseline);if(stateId(s.baseline)!==s.baselineId)throw Error('Der Anfang wurde verändert.');
 for(const k of ['runs','events','history','trials'])if(!Array.isArray(s[k])||s[k].length>200)throw Error('Die Sicherung ist zu groß.');
 if(typeof s.ownText!=='string'||s.ownText.length>20000)throw Error('Ungültiger eigener Text.');
 const stages={m2:['prediction','feed-ready','food-observe-ready','observing','food-observation','filter','food-process','food-plant','food-evidence','complete','failed'],m3:['founders','f1-observation','choose-f1','child','inheritance','transfer','complete'],m4:['prediction','neutral-ready','neutral-again-ready','selection-ready','generations','trial-finished','neutral-comparison','selection-explanation','dominance-explanation','complete'],m5:['prediction','measure-ready','measure-observe-ready','observing','first-measure-finished','reset-measure-ready','measure-comparison','measure-explanation','complete','failed'],m6:['prediction','plant','growth-ready','observing','growth-observation','carbon-source','carbon-return','carbon-evidence','complete','failed']};
 if(!(stages[s.mission.slice(0,2)]||['free','failed']).includes(s.stage))throw Error('Die Aufgabe passt nicht zur Frage.');
 if(s.runs.length>2||s.currentRun&&s.stage!=='observing'&&!(s.stage==='failed'&&s.currentRun.status==='failed'&&s.runs.at(-1)?.id===s.currentRun.id)||s.stage==='observing'&&!s.currentRun)throw Error('Der aktive Durchgang passt nicht.');
 for(const r of [...s.runs,...(s.currentRun?[s.currentRun]:[])]){
  const duration=s.mission.startsWith('m5')?10:3,totals={};
  if(r.duration!==duration||r.baselineId!==s.baselineId||!['running','completed','failed'].includes(r.status)||r.samples.length>duration*4+1||!r.samples.length)throw Error('Messreihe fehlt.');validateTankArchive(r.archive,r.samples);
  for(const [i,row]of r.samples.entries()){
   if(row.day!==r.startSnapshot.day+i*.25)throw Error('Die Messzeiten passen nicht.');
   const t=archivedTank(r.archive,row.day),expected=learningSample(t,host.types),selected=r.selection??s.selection;
   if(Object.keys(expected).some(k=>JSON.stringify(row[k])!==JSON.stringify(expected[k]))||row.selectedPlantBiomass!==(t.entities.find(e=>e.uid===selected)?.biomass??null))throw Error('Messwert und Aquarium passen nicht zusammen.');
   if(i)for(const [k,v]of Object.entries(t.ecology?.lastFlux||{}))if(Number.isFinite(v)&&!['day','dt'].includes(k))totals[k]=(totals[k]||0)+v;
  }
  if(Object.keys({...totals,...r.fluxTotals}).some(k=>!Number.isFinite(r.fluxTotals[k])||Math.abs(r.fluxTotals[k]-(totals[k]||0))>1e-8))throw Error('Die Stoffflüsse passen nicht zur Aufzeichnung.');
  if(r.status==='completed'&&r.samples.length!==duration*4+1)throw Error('Der Durchgang ist unvollständig.');
  if(stateId(archivedTank(r.archive,r.samples[0].day))!==stateId(r.startSnapshot))throw Error('Der Startbeleg passt nicht.');
  if(s.mission.startsWith('m5')){
   if(!['water','feed'].includes(r.condition)||r.intervention?.type!==r.condition||stateId(r.intervention.before)!==s.baselineId)throw Error('Die Maßnahmen haben nicht denselben Anfang.');
   const expected=copy(s.baseline);if(r.condition==='water')host.waterChange(expected,50);else {expected.autoFeed=true;expected.feedRate=1;}
   if(stateId({...expected,events:[]})!==stateId({...r.startSnapshot,events:[]})||stateId(r.intervention.after)!==stateId(r.startSnapshot))throw Error('Es wurde mehr als die gewählte Maßnahme verändert.');
  }
 }
 if(s.currentRun&&stateId(s.tank)!==stateId(archivedTank(s.currentRun.archive,s.currentRun.samples.at(-1).day)))throw Error('Aquarium und laufender Zeitpunkt passen nicht.');
 if(s.stage==='reset-measure-ready'&&stateId(s.tank)!==s.baselineId)throw Error('Der ganze Anfang fehlt.');
 if(!isGenetic(s)&&!s.mission.startsWith('research-')){
  if(s.stage==='measure-observe-ready'){
   if(s.pendingIntervention?.type!==s.measure||stateId(s.pendingIntervention.before)!==s.baselineId||stateId(s.pendingIntervention.after)!==stateId(s.tank))throw Error('Die vorbereitete Maßnahme passt nicht zum Aquarium.');
  }else if(!s.currentRun&&s.runs.length&&s.stage!=='reset-measure-ready'){
   const run=s.runs.at(-1);if(stateId(s.tank)!==stateId(archivedTank(run.archive,run.samples.at(-1).day)))throw Error('Das Aquarium zeigt nicht den aufgezeichneten Endzustand.');
  }
 }
 if(s.runs.length===2&&s.runs[0].condition===s.runs[1].condition)throw Error('Die zweite Maßnahme fehlt.');
 if(s.stage==='complete'){
  const required={m2:['food-observation','food-process','food-plant','food-evidence'],m3:['f1-observation','inheritance','transfer'],m4:['neutral-comparison','selection-explanation','dominance-explanation'],m5:['measure-comparison','measure-explanation'],m6:['growth-observation','carbon-source','carbon-return','carbon-evidence']}[s.mission.slice(0,2)]||[];
  if(required.some(k=>s.answers?.[k]?.origin!=='selection'))throw Error('Die Ergebnissicherung fehlt.');
  const count=s.mission.startsWith('m5')?2:1;if(!isGenetic(s)&&(s.runs.length!==count||s.runs.some(r=>r.status!=='completed')))throw Error('Die Beobachtungen fehlen.');
  if(isGenetic(s)&&(s.mission.startsWith('m3')?s.generation!==2:s.trials.length!==3))throw Error('Die Generationen fehlen.');
 }
 if(s.currentContext){const expected=s.currentContext.version===1?legacyClassroomContext(s):classroomContext(s);if(stateId(s.currentContext)!==stateId(expected))throw Error('Zeitpunkt und Aquarium passen nicht.');}
 if(isGenetic(s)){
  if(s.tank.genetics.enabled!==false)throw Error('Zusätzliche Fortpflanzung ist im Lernversuch ausgeschaltet.');
  for(const h of s.history){checkTank(h.tank);if(stateId(h.tank)!==h.stateId||JSON.stringify(counts(h.tank))!==JSON.stringify(h.counts))throw Error('Eine frühere Gruppe passt nicht.');}
  const snapshots=[s.tank,...s.history.map(h=>h.tank),...s.trials.map(t=>t.lastTank)];
  for(const e of s.events.filter(e=>e.type==='generation')){
   const current=snapshots.find(t=>stateId(t)===e.context.stateId),previous=s.history.find(h=>h.stateId===e.parentStateId)?.tank;
   if(!current||!previous||cohort(current).length!==e.children.length)throw Error('Der Generationenbeleg fehlt.');
   for(const c of e.children){const r=current.genetics.pedigree[c.uid];if(!r||JSON.stringify(r.parents)!==JSON.stringify(c.parents)||[...c.inheritedAlleles].sort().join('')!==r.loci.A.join('')||c.parents.some((uid,i)=>!previous.genetics.pedigree[uid]?.loci.A.includes(c.inheritedAlleles[i])))throw Error('Eltern und Erbanlagen passen nicht.');}
   for(const parent of cohort(previous)){
    const expected=e.environment==='light'?(parent.variant==='gold'?1:.5):1;
    if(e.weights[parent.uid]!==expected||e.offspring[parent.uid]!==e.children.filter(c=>c.parents.includes(parent.uid)).length)throw Error('Die Elternbeiträge passen nicht zur Regel.');
   }
  }
  for(const t of s.trials){checkTank(t.lastTank);if(stateId(t.founders)!==s.baselineId||JSON.stringify(counts(t.lastTank))!==JSON.stringify(t.counts))throw Error('Die frühere Auswertung passt nicht.');}
 }
 return s;
}
