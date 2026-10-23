import {SINGLE_MISSIONS} from './single-learning-missions.mjs';
import {MISSIONS} from './learning-content.mjs';
import {decodeSingle} from './single-learning-model.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function archiveDescription(key,raw){
 let data;try{data=decodeSingle(raw);}catch{return {title:'Nicht lesbarer lokaler Stand',type:'Dateityp unbekannt',grade:null,date:null,attempt:'Zuordnung nicht dokumentiert',key};}
 const p=data.product||data,profile=p.profile||p.tank?.learning||p.learning||data.tank?.learning||{},known=[...SINGLE_MISSIONS,...MISSIONS];
 const id=p.mission||profile.mission||known.find(m=>key.split(':').includes(m.id))?.id;
 const mission=known.find(m=>m.id===id),grade=profile.grade||mission?.grade||null;
 const type=p.type==='aquarium-learning-product'?'Lernprodukt':p.entities||p.tank||key.startsWith('aquarium-learning-tank-')?'Aquarium-Spielstand':'Eigene Notiz';
 const stamp=p.created||data.created||(/:(\d{13})$/.exec(key)?.[1]);
 const date=stamp&&Number.isFinite(new Date(/^\d{13}$/.test(String(stamp))?Number(stamp):stamp).getTime())?new Date(/^\d{13}$/.test(String(stamp))?Number(stamp):stamp).toISOString():null;
 return {title:mission?.title||(id?.startsWith('research-')?'Freies Forschen':'Früherer lokaler Stand'),type,grade,date,attempt:key.includes(':archive:')||key.includes('attempt-v1:')?'Früherer Durchgang':p.attemptId?'Aktueller gespeicherter Durchgang':'Durchgang nicht dokumentiert',key,attemptId:p.attemptId||null,mission:id};
}
export function archiveEntry(description,button){
 const d=description;return `<article class="single-archive-entry"><h3>${esc(d.title)}</h3><p>${d.grade?'Klasse '+d.grade+' · ':''}${esc(d.type)} · ${esc(d.attempt)}<br>${d.date?esc(new Date(d.date).toLocaleString('de-DE')):'Speicherzeit nicht dokumentiert'}</p>${button}<details><summary>Technische Kennung</summary><p>${esc(d.key)}${d.attemptId?'<br>Durchgang: '+esc(d.attemptId):''}</p></details></article>`;
}
export const archiveGuidance='<p>Aquarium-Spielstand: in der zugehörigen Mission über Menü → Sicherung öffnen. Ältere Aquarium-Spielstände: Im Expertenmodus erst Freies Spiel oder Fortsetzen öffnen, dann Zeit &amp; Runde → Datei laden. Lernprodukt: im historischen Lernproduktleser. Eigene Notizen bleiben unveränderte Archivdateien.</p><a href="?expert=1&amp;archive-tools=1">Historischen Lernproduktleser öffnen</a><a href="?expert=1">Expertenmodus für ältere Aquarium-Spielstände</a>';
