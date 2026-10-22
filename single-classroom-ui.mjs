import {applyEquipmentSetting} from './control-values.mjs';
import {readSingleTeacher,writeSingleTeacher} from './single-teacher-settings.mjs';
import {createClassroom,CLASSROOM_IDS,classroomSlot,classroomContext,classroomProduct,encodeSingle,decodeSingle,validateClassroom,isGenetic,cohort,counts,predictClassroom,selectClassroom,nextClassroomGeneration,resetClassroomTrial,classroomFeed,classroomMeasure,beginClassroomObservation,advanceClassroom,resetClassroomMeasure,classroomAnswer,openClassroomFilter,compareClassroomTrials} from './single-classroom-model.mjs';
import {escapeText as esc,control as b,lessonTitle,lessonTask,lessonConclusion,changeWord,processExplanation,resultTable} from './single-classroom-content.mjs';
import {stateId} from './learning-context.mjs';
export function mountClassroomUI(host,id){
 const root=document.createElement('div');root.id='learning-root';host.root.append(root);
 let s=null,timer=null,dialog=null,feedback='',kind='neutral',storageError='',opener='menu',assetErrors=[],showEquipment=false,lastTweezers=false;
 let teacher=readSingleTeacher();
 const slot=classroomSlot(id),number=n=>Number(n).toLocaleString('de-DE',{maximumFractionDigits:3});
 function pause(){clearInterval(timer);timer=null;host.pause();}
 function save(){if(!s)return false;try{localStorage.setItem(slot,encodeSingle(classroomProduct(s)));storageError='';return true;}catch{pause();storageError='Dein Browser konnte nicht speichern. Sichere deinen Stand als Datei.';return false;}}
 function archive(){try{localStorage.setItem(slot+':archive:'+s.attemptId+':'+Date.now(),encodeSingle(classroomProduct(s)));return true;}catch{pause();storageError='Dein bisheriger Stand konnte nicht gesichert werden. Speichere ihn als Datei.';return false;}}
 function bind(){host.open(s.tank,true);s.tank=host.getState();}
 function download(data=classroomProduct(s)){const url=URL.createObjectURL(new Blob([typeof data==='string'?data:JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='Aquarium-Ergebnis.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 function start(){pause();try{const raw=localStorage.getItem(slot);s=raw?validateClassroom(decodeSingle(raw),host):createClassroom(id,host);bind();save();}catch(e){storageError='Die vorhandene Sicherung bleibt erhalten. Öffnen fehlgeschlagen: '+e.message;dialog='recovery';}render();}
 function tick(){if(dialog||document.hidden){pause();render();return;}if(s.tank!==host.getState())throw Error('Das Aquarium ist nicht mehr richtig zugeordnet.');advanceClassroom(s,{...host,advance:(t,d)=>{if(t!==host.getState())throw Error('Nur das aktuelle Aquarium darf laufen.');host.advanceCurrent(d);}});if(s.stage!=='observing')pause();const ok=save();if(timer&&ok){const m=root.querySelector('.single-meter');if(m)m.outerHTML=meter();}else render();}
 function play(){if(s.stage!=='observing'&&!beginClassroomObservation(s,host))return;pause();timer=setInterval(tick,650);save();render();}
 function select(uid){if(dialog||!s||host.tweezersActive())return;if(s.stage==='free'&&s.tank.entities.some(e=>e.uid===uid)){s.selection=uid;host.comparisonRenderer()?.select(uid);save();open('organism');return;}if(selectClassroom(s,uid,host)){host.comparisonRenderer()?.select(uid);feedback='';kind='neutral';save();render();}}

 function meter(){
  const c=classroomContext(s);let content='';
  if(isGenetic(s))return '';
  if(s.stage==='observing'||['food-observation','measure-observe-ready'].includes(s.stage)){
   const start=s.currentRun?.startSnapshot||s.runs.at(-1)?.startSnapshot||s.baseline;
   content=s.mission.startsWith('m6')?`<small>Deine Pflanze</small><strong>${changeWord(s.tank.entities.find(e=>e.uid===s.selection)?.biomass??0,start.entities.find(e=>e.uid===s.selection)?.biomass??0)} als am Anfang</strong>`:`<small>Reste im Aquarium</small><strong>${changeWord(s.tank.detritus,start.detritus)} als am Anfang</strong><span>${s.mission.startsWith('m2')?'Sauerstoff: '+changeWord(s.tank.params.oxygen,start.params.oxygen)+' als am Anfang':'Gelöste Nährstoffe: '+changeWord(s.tank.params.no3,s.baseline.params.no3)+' als am Anfang'}</span>`;
   if(s.currentRun)content+=`<span>${number(s.tank.day-s.currentRun.startSnapshot.day)} von ${s.currentRun.duration} Tagen · ${timer?'läuft':'angehalten'}</span>`;
  }
  return content?`<aside class="single-meter" data-persistent-hud data-class-state="${c.stateId}" data-time="${c.time}">${content}</aside>`:'';
 }
 function options(rows){if(!rows)return '';const n=parseInt(stateId(s.attemptId+s.stage),16)%rows.length;return `<div class="single-options">${[...rows.slice(n),...rows.slice(0,n)].map(([key,text])=>b('answer',esc(text),`data-class-choice="${key}"`)).join('')}</div>`;}
 function modal(){
  let title='Menü',body='';
  if(dialog==='menu')body=`<a href="${location.pathname}">Zur Missionsauswahl</a>`+b('export','Stand als Datei speichern')+b('load','Sicherung öffnen')+b('display','Darstellung')+b('teacher','Lehrkraft und frühere Ergebnisse')+'<a href="?expert=1">Weitere Expertenwerkzeuge und Tutorial</a>'+(['complete','free'].includes(s?.stage)&&teacher.ownExplanation?`<label>Deine eigene Erklärung (freiwillig)<textarea data-class-note maxlength="20000">${esc(s.ownText)}</textarea></label>`:'');
  if(dialog==='help'){
   title='Tipp zu deiner Aufgabe';const level=Math.max(0,Math.min(2,s.hints?.[s.stage]||0));
   const dataHint=s.stage==='free'?'Tiere und Pflanzen, Pflege und Messen öffnen die passenden Werkzeuge. Du kannst deinen Stand im Menü sichern.':isGenetic(s)?'Vergleiche die Farben und die Zahlen der tatsächlichen Fische. Wähle ein Weibchen und ein Männchen, wenn du Eltern brauchst.':'Vergleiche die Beobachtung am Anfang und am Ende. Hilfe hält die Entwicklung an.';
   const linkHint=s.stage==='free'?'Ändere eine Sache. Beobachte danach das Aquarium. Sichere deinen Stand, wenn du später vergleichen möchtest.':s.mission.startsWith('m2')?'Reste werden umgewandelt. Der Filter macht Stoffe nicht zu nichts.':s.mission.startsWith('m5')?'Unterscheide die Wirkung direkt danach von der Ursache, die weiterwirken kann.':s.mission.startsWith('m6')?'Pflanzen bauen Kohlenstoff aus Kohlenstoffdioxid ein. Wachstum allein zeigt nicht die Herkunft jedes Bausteins.':s.mission.startsWith('m3')?'Von jedem Elternteil kommt eine Erbanlage. Eine dunkle Farbe kann a verdecken.':'Dominant beschreibt die sichtbare Farbe. Häufigkeit hängt auch von Zufall und Fortpflanzung ab.';
   body=`<p>${esc(level===0?lessonTask(s,host).title:level===1?dataHint:linkHint)}</p>`+(level<2?b('more-help','Weiterer Tipp'):'');
  }
  if(dialog==='process'){title='Am Aquarium erklärt';body=processExplanation(s);}
  if(dialog==='results'){title='Deine gespeicherten Beobachtungen';body=s.trials.length||s.runs.length?resultTable(s):'<p>Hier liegen noch keine abgeschlossenen Beobachtungen.</p>';}
  if(dialog==='count'){title='Deine Fische zählen';const n=counts(s.tank);body=`<p>In Generation ${s.generation}: ${n.n} Fische, davon ${n.dark} dunkel und ${n.light} hell.</p><p>Die Zählhilfe gehört genau zur sichtbaren Gruppe.</p>`;}
  if(dialog==='organism'){const e=s.tank.entities.find(e=>e.uid===s.selection),t=host.types[e?.species];title=t?.name||'Ausgewähltes Lebewesen';body=e&&t?`<p data-selected-individual="${e.uid}">Ausgewählt im Aquarium: ${esc(t.name)} · ${e.uid}</p><p>${t.category==='plant'?'Diese Pflanze braucht Licht und Stoffe aus dem Wasser zum Wachsen.':t.category==='decor'?'Diese Einrichtung bietet Platz und Verstecke.':'Dieses Tier braucht passende Nahrung und Wasserbedingungen.'}</p>${t.temp?`<p>Temperaturbereich im Katalog: ${t.temp[0]} bis ${t.temp[1]} Grad.</p>`:''}<p>${e.dead?'Dieses Lebewesen lebt nicht mehr.':'Dieses Lebewesen gehört zu deinem aktuellen Aquarium.'}</p>${!e.dead?b('move-selected','Mit Pinzette bewegen'):''}`:'';}
  if(dialog==='parents'){title='Tatsächliche Elternbeiträge';const e=s.events.findLast(e=>e.type==='generation');body=e?`<p>Gesetzte Regel: ${e.environment==='light'?'Helle Tiere haben bei der Elternwahl das doppelte Gewicht.':'Alle Tiere haben bei der Elternwahl gleiches Gewicht.'}</p><table class="single-results"><thead><tr><th>Fisch</th><th>Gewicht</th><th>Nachkommen</th></tr></thead><tbody>${Object.entries(e.offspring).map(([uid,n])=>`<tr><td>${uid}</td><td>${number(e.weights[uid])}</td><td>${n}</td></tr>`).join('')}</tbody></table>`:'<p>Noch keine Nachkommen.</p>';}
  if(dialog==='display'){title='Darstellung';body=host.profiles.map(p=>b('profile',esc(p.label||p.name||p.id),`data-class-profile="${p.id}"`)).join('');}
  if(dialog==='teacher'){
   title='Lehrkraft und Archiv';body=b('teacher-hints',teacher.hints?'Gestufte Hilfen: an':'Gestufte Hilfen: aus',`aria-pressed="${teacher.hints}"`)+b('teacher-notes',teacher.ownExplanation?'Eigene Erklärung: freiwillig möglich':'Eigene Erklärung: ausgeblendet',`aria-pressed="${teacher.ownExplanation}"`)+`<p>Eine aktuelle Aquariumwelt, gespeicherte frühere Durchgänge. Keine automatische Anerkennung früherer Klicks als neue Lernleistung.</p><p>M3/M4: vereinfachtes Ein-Merkmals-Modell; zwölf Nachkommen, vorbereitete Geschlechterverteilung. Aufwachsen und Generationen sind ausdrücklich Zeitraffer. Frühere Tiere sind archiviert, nicht gestorben. Freie Fortpflanzung ist während dieses Lernversuchs ausgeschaltet.</p><details><summary>Genaue Modellwerte</summary><p>Sauerstoff ${number(s.tank.params.oxygen)} mg/L · Nitrat ${number(s.tank.params.no3)} mg NO₃/L · relative Reste ${number(s.tank.detritus)}</p>${s.runs.map(r=>`<p>${esc(r.condition)}: tatsächliche Umwandlungsflüsse ${esc(JSON.stringify(r.fluxTotals))}</p>`).join('')}</details><a href="./docs/single-aquarium/TEACHER.md" target="_blank" rel="noopener">Unterrichtsergänzungen und Quellenprüfung</a><a href="./docs/single-aquarium/MISSIONS.md" target="_blank" rel="noopener">Missionszuordnung</a><a href="?expert=1&amp;archive-tools=1">Historische Lehrkraftwerkzeuge</a>${b('archives','Frühere lokale Dateien')}`;
  }
  if(dialog==='archives'){title='Frühere lokale Ergebnisse';body=Object.keys(localStorage).filter(k=>k.startsWith('aquarium-learning-')||k.includes(':archive:')).map((k,i)=>b('archive-file',esc(k),`data-class-key="${esc(k)}"`)).join('')||'<p>Keine früheren lokalen Dateien vorhanden.</p>';}
  if(dialog==='recovery'){title='Deinen bisherigen Stand erhalten';body=b('raw-export','Vorhandene Sicherung als Datei speichern')+b('load','Andere Sicherung öffnen');}
  if(dialog==='fossil'){title='Kohlenstoff außerhalb des Aquariums';body='<p>In Kohle, Erdöl und Erdgas steckt lange gespeicherter Kohlenstoff. Beim Verbrennen kommt er zusätzlich als Kohlenstoffdioxid in die Luft. Das Aquarium berechnet daraus weder Weltklima noch globale Mengen.</p><a href="./docs/coherent-learning/CURRICULUM.md" target="_blank" rel="noopener">Quellen und weiterführendes Unterrichtsmaterial</a>';}
  if(dialog==='catalog'){title='Tiere und Pflanzen';body='<h3>Schon im Aquarium</h3>'+s.tank.entities.map(e=>b('inspect',esc(host.types[e.species].name)+' · '+e.uid,`data-class-uid="${e.uid}"`)).join('')+'<h3>Neu einsetzen</h3>'+Object.values(host.types).filter(t=>['fish','plant','invert'].includes(t.category)&&t.water!=='salt').map(t=>b('add',esc(t.name),`data-class-species="${t.id}"`)).join('');}
  if(dialog==='care'){title='Pflege';body=b('free-feed','Einmal füttern')+b('free-water','Etwas Wasser wechseln')+b('free-light','Licht an oder aus')+b('tweezers',host.tweezersActive()?'Pinzette beenden':'Mit Pinzette gestalten')+b('equipment',showEquipment?'Geräte ausblenden':'Geräte auswählen');}
  if(dialog==='measurements'){title='Am Aquarium messen';body=`<p>Sauerstoff: ${changeWord(s.tank.params.oxygen,s.baseline.params.oxygen)} als am Anfang.</p><p>Reste: ${changeWord(s.tank.detritus,s.baseline.detritus)} als am Anfang.</p>`+b('teacher','Genaue Werte für Lehrkräfte');}
  return `<div class="single-shade" ${dialog==='process'?'data-single-explanation':''}><section class="single-dialog" role="dialog" aria-modal="true" aria-label="${esc(title)}"><header><h2 tabindex="-1">${title}</h2>${b('close','Schließen')}</header>${body}</section></div>`;
 }

 function render(){
  const focused=root.contains(document.activeElement),action=document.activeElement?.dataset.class,previous=root.querySelector('[data-class-stage]')?.dataset.classStage;
  document.documentElement.classList.add('learning-mode','single-aquarium');document.documentElement.classList.remove('learning-home');
  const task=s?lessonTask(s,host):{title:'Deinen Stand öffnen',body:'',actions:'',choices:null};
  root.innerHTML=`<div class="single-surface" ${dialog?'inert':''}><header class="single-brand" data-persistent-hud><small>Klasse ${s?.tank.learning?.grade||''}${s&&isGenetic(s)?` · Generation ${s.generation} · Zeitraffer`:""}</small><span>${lessonTitle(id)}</span></header><div class="single-menu" data-persistent-hud>${b('menu','Menü')}</div><section class="single-task" data-persistent-hud data-class-stage="${s?.stage||'recovery'}"><small>${s?.stage==='free'?'Deine Werkzeuge':'Dein Auftrag'}</small><h2 tabindex="-1">${esc(task.title)}</h2>${task.body?`<div class="classroom-body">${task.body}</div>`:''}${task.actions}${options(task.choices)}<footer>${s&&teacher.hints?b('help','Tipp'):''}${s&&isGenetic(s)&&s.stage!=='complete'?b('count','Zählen'):''}${s&&['food-process','food-plant','food-evidence','carbon-source','carbon-return','carbon-evidence','inheritance'].includes(s.stage)?b('process','Am Aquarium erklären'):''}${s?.mission.startsWith('m4')&&s.trials.length?b('parents','Elternbeiträge'):''}${s?.mission.startsWith('m6')&&s.stage==='complete'?b('fossil','Kohle, Erdöl und Erdgas'):''}</footer>${feedback?`<p class="single-feedback" role="status" data-kind="${kind}">${kind==='error'?'✕':kind==='success'?'✓':'•'} ${esc(feedback)}</p>`:''}</section>${s?meter():''}</div>${dialog?modal():''}${storageError?`<aside class="single-storage" role="alert">${esc(storageError)}${b(s?'export':'raw-export','Stand als Datei speichern')}${s?b('retry','Erneut speichern'):''}</aside>`:''}<input type="file" accept="application/json,.json" data-class-file hidden>`;
  host.sceneInert(!!dialog||!s);host.interactive(!dialog&&!!s);host.layout(false);const view=host.comparisonRenderer();if(view){if(innerWidth<=820)view.camera.setViewOffset(innerWidth,innerHeight,0,innerHeight*.12,innerWidth,innerHeight);else view.camera.clearViewOffset();}
  if(focused||previous!==s?.stage){const target=action&&previous===s?.stage?root.querySelector(`[data-class="${CSS.escape(action)}"]`):null;(target||root.querySelector(dialog?'.single-dialog h2':'.single-task h2'))?.focus({preventScroll:true});}
 }
 function open(name,button){pause();dialog=name;opener=button?.dataset.class||'menu';render();root.querySelector('.single-dialog h2')?.focus();}
 root.addEventListener('click',e=>{
  const button=e.target.closest('[data-class]');if(!button)return;e.stopPropagation();const a=button.dataset.class;
  try{
   if(['menu','help','process','results','teacher','parents','display','fossil','catalog','care','measurements','archives','count'].includes(a)){open(a,button);return;}
   if(a==='close'){dialog=null;render();root.querySelector(`[data-class="${opener}"]`)?.focus();return;}
   if(a==='export'){download();return;}if(a==='raw-export'){download(localStorage.getItem(slot));return;}if(a==='load'){pause();root.querySelector('[data-class-file]').click();return;}
   if(a==='archive-file'){download(localStorage.getItem(button.dataset.classKey));return;}
   feedback='';kind='neutral';
   if(a==='teacher-hints'||a==='teacher-notes'){const next={...teacher};next[a==='teacher-hints'?'hints':'ownExplanation']=!next[a==='teacher-hints'?'hints':'ownExplanation'];teacher=writeSingleTeacher(next);render();return;}
   if(a==='predict'){predictClassroom(s,button.dataset.classChoice);feedback='Deine Vermutung ist gespeichert.';}
   if(a==='select'){select(Number(button.dataset.classUid));return;}
   if(a==='inspect'){dialog=null;select(Number(button.dataset.classUid));return;}
   if(a==='plant'){const plant=s.tank.entities.find(e=>e.species==='waterweed'&&!e.dead);if(plant)select(plant.uid);return;}
   if(a==='feed')classroomFeed(s,host);
   if(a==='measure')classroomMeasure(s,button.dataset.classChoice,host);
   if(a==='play'){play();return;}if(a==='toggle'){timer?pause():play();save();render();return;}
   if(a==='filter'){if(openClassroomFilter(s)){save();open('process',button);return;}}
   if(a==='generation'){if(nextClassroomGeneration(s,host,s.environment||'neutral')){bind();feedback='Nachkommen im Zeitraffer. Frühere Fische liegen im Archiv.';}else {kind='error';feedback='Wähle ein passendes Weibchen und Männchen aus dieser Gruppe.';}}
   if(a==='reset-trial'){resetClassroomTrial(s);bind();feedback='Der vollständige Anfang ist wieder da. Die frühere Gruppe bleibt gespeichert.';}
   if(a==='compare-trials')compareClassroomTrials(s);
   if(a==='reset-measure'){resetClassroomMeasure(s);bind();feedback='Der vollständige gleiche Anfang ist wieder da.';}
   if(a==='answer'){const stage=s.stage,text=lessonTask(s,host).choices?.find(([id])=>id===button.dataset.classChoice)?.[1];const ok=classroomAnswer(s,button.dataset.classChoice);if(ok){s.answers[stage].text=text;if(s.stage==='complete')s.conclusion={text:lessonConclusion(s),origin:'game-explanation',context:classroomContext(s),runIds:s.runs.map(r=>r.id),trialIds:s.trials.map(r=>r.id)};}kind=ok?'success':'error';feedback=ok?'Dein Beleg ist gespeichert.':'Schau noch einmal auf deine Beobachtung. Nutze bei Bedarf den Tipp.';}
   if(a==='more-help'){s.hints??={};s.hints[s.stage]=Math.min(2,(s.hints[s.stage]||0)+1);}
   if(a==='profile')host.setGraphics(button.dataset.classProfile);
   if(a==='repeat'){pause();if(archive()){s=createClassroom(id,host);bind();dialog=null;feedback='Ein neuer Versuch beginnt. Dein vorheriger Stand bleibt im Archiv.';}}
   if(a==='add'){const entity=host.addCurrent(button.dataset.classSpecies);s.tank=host.getState();feedback=entity?'Eingesetzt.':'Dieses Tier oder diese Pflanze kann hier nicht eingesetzt werden.';}
   if(a==='free-feed')host.care(s.tank,'feed');
   if(a==='free-water')host.waterChange(s.tank,30);
   if(a==='free-light')s.tank.hours=s.tank.hours===0?8:0;
   if(a==='free-day'){host.advanceCurrent(1);s.tank=host.getState();if(s.tank.failed)s.stage='failed';}
   if(['free-feed','free-water','free-light'].includes(a))bind();
   if((a==='tweezers'||a==='move-selected')&&s.stage==='free'){const enable=a==='move-selected'||!host.tweezersActive();dialog=null;render();host.tweezers(enable,a==='move-selected'?s.selection:null);save();render();return;}
   if(a==='equipment'){showEquipment=!showEquipment;dialog=null;}
   save();render();
  }catch(error){pause();feedback=error.message;kind='error';render();}
 });
 root.addEventListener('input',e=>{if(e.target.matches('[data-class-note]')){s.ownText=e.target.value;s.ownTextOrigin=s.ownText?'own-input':'absent';save();}});
 root.addEventListener('change',async e=>{
  if(!e.target.matches('[data-class-file]')||!e.target.files[0])return;
  try{pause();const file=e.target.files[0];if(file.size>5000000)throw Error('Die Datei ist zu groß.');const next=validateClassroom(decodeSingle(await file.text()),host);if(next.mission!==id)throw Error('Diese Datei gehört zu einer anderen Frage.');if(s&&!archive()){render();return;}s=next;dialog=null;bind();save();feedback='Dein Stand ist geladen. Die Entwicklung bleibt angehalten.';kind='neutral';render();}catch(error){storageError='Öffnen fehlgeschlagen: '+error.message;render();}
 });
 document.addEventListener('keydown',e=>{if(!dialog)return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();dialog=null;render();root.querySelector(`[data-class="${opener}"]`)?.focus();}if(e.key==='Tab'){const list=[...root.querySelectorAll('.single-dialog button,.single-dialog a,.single-dialog textarea,.single-dialog summary')].filter(x=>x.getClientRects().length),first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first||!e.shiftKey&&document.activeElement===last){e.preventDefault();(e.shiftKey?last:first)?.focus();}}},true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();save();render();}});window.addEventListener('beforeunload',()=>{pause();save();});window.addEventListener('resize',()=>requestAnimationFrame(render));
 document.querySelector('#scene')?.addEventListener('assetfailed',e=>{assetErrors.push(e.detail);});
 queueMicrotask(start);return {active:()=>!!s,blocksScene:()=>!!dialog||!s,select,deviceContext:()=>({visible:!!s&&!dialog&&(s.stage==='filter'||s.stage==='free'&&showEquipment),tools:s?.stage==='free'?['temperature','light','filter','air','skimmer']:['filter'],focus:s?.stage==='filter'?'filter':null}),openDevice:key=>{if(s?.stage==='free'){pause();host.deviceOpen(key,{onCommit:(value,intensity)=>{s.tank=applyEquipmentSetting(s.tank,key,value);if(intensity!=null)s.tank=applyEquipmentSetting(s.tank,'intensity',intensity);bind();save();render();}});return;}if(key==='filter'&&openClassroomFilter(s)){save();open('process');}},deviceView:()=>null,deviceState:()=>null,tweezersChanged:()=>{const active=host.tweezersActive();if(active!==lastTweezers){lastTweezers=active;save();if(s?.stage==='free')queueMicrotask(render);}},spatialChanged:()=>{if(s?.stage==='free'){s.tank=host.getState();return save();}return true;},refresh:()=>{},snapshot:()=>({screen:'classroom',session:s?classroomProduct(s):null,context:s?classroomContext(s):null,running:!!timer,dialog,tweezers:host.tweezersActive(),storageError,assetErrors,renderer:s&&host.comparisonRenderer()?{sameState:host.comparisonRenderer().state===host.getState(),mainStateId:stateId(host.comparisonRenderer().state),objects:[...host.comparisonRenderer().objects.keys()],appearances:[...host.comparisonRenderer().objects].flatMap(([uid,o])=>{const rows=[];o.group.traverse(g=>{if(g.userData.individualAppearance)rows.push({uid,...g.userData.individualAppearance});});return rows;}),stats:host.comparisonRenderer().getStats()}:null})};
}
