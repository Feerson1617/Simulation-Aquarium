import {learningSample,createLearningTank} from "./learning-model.mjs";
import {investigationId,stateId,tankArchive,appendTankFrame,archivedTank,validateTankArchive} from "./learning-context.mjs";
import {compressArchiveText,decompressArchiveText} from "./vendor/lz-string.mjs";
export const SINGLE_REVISION="single-aquarium-m1-v1";
export const SINGLE_STORAGE="aquarium-single-investigation-v1:m1-light-oxygen";
export const SINGLE_STAGES=["plant","prediction","light-ready","light-observing","light-finished","reset-ready","dark-ready","dark-observing","compare","explain","complete","failed"];
const copy=x=>structuredClone(x);
export function currentSingleRun(s) {return s.runs.at(-1) || null;}
export function singleContext(s) {
  const r=["reset-ready","dark-ready"].includes(s.stage)?null:currentSingleRun(s);
  return {version:1,investigationId:s.id,attemptId:s.attemptId,revision:s.revision,
    runId:r?.id || null,condition:r?.condition || (s.stage==="reset-ready"?"restored-start":s.stage==="dark-ready"?"without-light-prepared":"starting"),time:s.tank.day,stateId:stateId(s.tank)};
}
export function createSingleM1(host) {
  const tank=createLearningTank({version:1,grade:8,mode:"free",mission:null},host);
  tank.learning={version:2,grade:8,mode:"missions",mission:"m1-light-oxygen"};
  tank.day=45.25; // Same 06:00 start for both runs: the daily light phase is visible immediately.
  const start=host.normalize(tank);
  return {version:1,type:"aquarium-single-investigation",mission:"m1-light-oxygen",revision:SINGLE_REVISION,
    id:investigationId(),attemptId:investigationId(),stage:"plant",baseline:copy(start),baselineId:stateId(start),
    tank:start,runs:[],events:[],selection:null,prediction:null,answers:{},ownText:"",ownTextOrigin:"absent"};
}
function evidence(s,type,detail={}) {s.events.push({type,origin:"game-action",context:singleContext(s),...detail});}
export function selectSinglePlant(s,uid,types) {
  const plant=s.tank.entities.find(e=>e.uid===uid&&!e.dead&&types[e.species]?.category==="plant");
  if (!plant) return false;
  s.selection=uid;evidence(s,"select-plant",{uid,species:plant.species});
  if(s.stage==="plant")s.stage="prediction";
  return true;
}
export function predictSingle(s,index) {
  if(s.stage!=="prediction" || ![0,1,2].includes(index))return false;
  s.prediction={choice:index,origin:"selection",context:singleContext(s)};
  s.stage="light-ready";return true;
}
function prepareRun(s,condition) {
  const r={id:investigationId(),condition,duration:3,startSnapshot:copy(s.tank),startId:stateId(s.tank),
    baselineId:s.baselineId,intervention:{type:"light",before:s.baseline.hours,after:s.tank.hours,effective:s.tank.hours!==s.baseline.hours},
    status:"prepared",samples:[],archive:tankArchive(s.tank)};
  s.runs.push(r);return r;
}
export function beginSingleObservation(s,types) {
  if(!["light-ready","dark-ready"].includes(s.stage))return false;
  const dark=s.stage==="dark-ready",r=prepareRun(s,dark?"without-light":"daily-light");
  r.samples.push(learningSample(s.tank,types));r.status="running";
  s.stage=dark?"dark-observing":"light-observing";evidence(s,"begin-observation");return true;
}
/** Advances exactly the sole live tank. Historical runs are never passed to advance(). */
export function advanceSingleObservation(s,host) {
  if(!["light-observing","dark-observing"].includes(s.stage))return false;
  const r=currentSingleRun(s),before=copy(s.tank);
  if(!s.tank.failed)host.advance(s.tank,.25);
  if(s.tank.day!==before.day){appendTankFrame(r.archive,before,s.tank);r.samples.push(learningSample(s.tank,host.types));}
  if(s.tank.failed){r.status="failed";s.stage="failed";evidence(s,"biological-stop");}
  else if(s.tank.day>=r.startSnapshot.day+r.duration){r.status="completed";s.stage=r.condition==="daily-light"?"light-finished":"compare";evidence(s,"observation-completed");}
  return true;
}
export function resetSingleForDark(s) {
  if(s.stage!=="light-finished" || s.runs[0]?.status!=="completed")return false;
  s.tank=copy(s.baseline);s.stage="reset-ready";
  evidence(s,"restore-complete-start",{restoredId:stateId(s.tank),baselineId:s.baselineId});return true;
}
export function darkenSingle(s) {
  if(s.stage!=="reset-ready" || stateId(s.tank)!==s.baselineId)return false;
  s.tank.hours=0;s.stage="dark-ready";evidence(s,"change-light",{before:8,after:0,effective:true});return true;
}
export function roundedOxygen(value) {return Math.round(value*100)/100;}
const trend=r=>{const a=roundedOxygen(r.samples[0].oxygen),b=roundedOxygen(r.samples.at(-1).oxygen);return b>a?"höher":b<a?"niedriger":"gleich";};
export function singleObservationChoices(s) {
  if(s.runs.length!==2 || s.runs.some(r=>r.status!=="completed"))return [];
  const [a,b]=s.runs.map(trend),other=x=>x==="höher"?"niedriger":"höher";
  const line=(x,y)=>`Mit Licht: ${x}. Ohne Licht: ${y}.`;
  return [{id:"observed",text:line(a,b)},{id:"reversed-dark",text:line(a,other(b))},{id:"reversed-light",text:line(other(a),b)}];
}
export function answerSingle(s,choice) {
  if(s.stage==="compare") {
    if(choice!=="observed")return false;
    s.answers.observation={choice,origin:"selection",contexts:s.runs.map(r=>({runId:r.id,time:r.samples.at(-1).day,stateId:r.archive.frames.at(-1).stateId})),text:singleObservationChoices(s)[0].text};
    s.stage="explain";return true;
  }
  if(s.stage==="explain") {
    if(choice!=="processes")return false;
    s.answers.explanation={choice,origin:"selection",context:singleContext(s)};s.stage="complete";return true;
  }
  return false;
}
export function serializeSingle(s) {return copy({...s,currentContext:singleContext(s),provenance:{measurements:"simulation",prediction:"selection",answers:"selection",actions:"game-action",ownText:s.ownText?(s.ownTextOrigin || "unknown"):"absent",explanation:"game-explanation"}});}
export function encodeSingle(s) {
  const text=JSON.stringify(serializeSingle(s));
  return JSON.stringify({version:1,codec:"lz-string-utf16-v1",length:text.length,data:compressArchiveText(text)});
}
export function decodeSingle(text) {
  if(text.length>5000000)throw new Error("Die Datei ist zu groß.");
  let raw=JSON.parse(text);
  if(raw.codec==="lz-string-utf16-v1") {
    if(!Number.isInteger(raw.length)||raw.length<1||raw.length>5000000||typeof raw.data!=="string")throw new Error("Die Sicherung ist ungültig.");
    const decoded=decompressArchiveText(raw.data);if(typeof decoded!=="string"||decoded.length!==raw.length)throw new Error("Die Sicherung ist beschädigt.");
    raw=JSON.parse(decoded);
  }
  return raw;
}
export function validateSingle(raw,host) {
  const s=copy(raw);
  if(s.version!==1||s.type!=="aquarium-single-investigation"||s.mission!=="m1-light-oxygen"||s.revision!==SINGLE_REVISION||!SINGLE_STAGES.includes(s.stage)||typeof s.id!=="string"||typeof s.attemptId!=="string")throw new Error("Keine passende M1-Sicherung.");
  for(const tank of [s.baseline,s.tank]) {
    const normalized=host.normalize(tank);
    const fields=x=>JSON.stringify(Object.fromEntries(Object.entries(x).filter(([k])=>k!=="events").sort(([a],[b])=>a.localeCompare(b))));
    if(fields(normalized)!==fields(tank)||tank.learning?.version!==2||tank.learning.mission!==s.mission)throw new Error("Die Beckendaten sind nicht vollständig gültig.");
  }
  if(stateId(s.baseline)!==s.baselineId||s.baseline.hours!==8||!Array.isArray(s.runs)||s.runs.length>2||!Array.isArray(s.events)||s.events.length>100||typeof s.ownText!=="string"||s.ownText.length>20000)throw new Error("Ungültiger Untersuchungsstand.");
  for(const [index,r] of s.runs.entries()) {
    const expected=copy(s.baseline);if(index===1)expected.hours=0;
    if(typeof r.id!=="string"||!r.id||!["prepared","running","completed","failed"].includes(r.status)||r.condition!==(index===0?"daily-light":"without-light")||r.duration!==3||r.baselineId!==s.baselineId||stateId(r.startSnapshot)!==stateId(expected)||r.startId!==stateId(expected)||!Array.isArray(r.samples)||r.samples.length>13||!r.samples.length)throw new Error("Durchgang und Ausgangslage passen nicht zusammen.");
    r.archive=validateTankArchive(r.archive,r.samples);
    for(const [i,row] of r.samples.entries()) {
      if(row.day!==s.baseline.day+i*.25)throw new Error("Die Messzeiten passen nicht zur Beobachtung.");
      const actual=archivedTank(r.archive,row.day);
      if(JSON.stringify(learningSample(actual,host.types))!==JSON.stringify(row))throw new Error("Messung und gespeicherter Zustand passen nicht zusammen.");
    }
    if(r.status==="completed"&&(r.samples.length!==13||r.samples.at(-1).day!==s.baseline.day+3))throw new Error("Der Durchgang ist nicht abgeschlossen.");
  }
  let expected=copy(s.baseline);
  if(s.stage==="dark-ready")expected.hours=0;
  else if(s.runs.length && s.stage!=="reset-ready") {const r=currentSingleRun(s);expected=archivedTank(r.archive,r.samples.at(-1).day);}
  if(stateId(s.tank)!==stateId(expected))throw new Error("Das aktive Aquarium passt nicht zum gespeicherten Zeitpunkt.");
  if(s.currentContext && JSON.stringify(s.currentContext)!==JSON.stringify(singleContext(s)))throw new Error("Ansicht und Aquarium sind nicht gleich zugeordnet.");
  if(["compare","explain","complete"].includes(s.stage)&&(s.runs.length!==2||s.runs.some(r=>r.status!=="completed")))throw new Error("Die beiden seriellen Durchgänge fehlen.");
  if(s.stage==="complete"&&(!s.answers?.observation||s.answers.explanation?.choice!=="processes"))throw new Error("Die Ergebnissicherung fehlt.");
  return s;
}
