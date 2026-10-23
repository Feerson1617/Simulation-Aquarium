/** Read-only displays: values come from the actual aquarium or its recorded runs. */
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=n=>n.toLocaleString('de-DE',{maximumFractionDigits:1});
export function relativeRows(rows,reference){
 if(!Number.isFinite(reference)||reference<=0)return null;
 return rows.map(row=>({...row,index:row.value/reference*100}));
}
export function amountFigure({title,rows,reference,referenceLabel='Anfang',note='',uid=null}){
 const values=relativeRows(rows,reference);
 if(!values||values.some(r=>!Number.isFinite(r.index)||r.index<0))return '<p>Für diese Menge ist kein Vergleich verfügbar.</p>';
 // One linear zero-based scale for ALL rows, never normalize each bar separately.
 const maximum=Math.max(150,...values.map(r=>r.index))*1.04;
 return `<figure class="observation-amount" data-amount-reference="${reference}" ${uid!=null?`data-amount-uid="${uid}"`:''}><figcaption>${esc(title)}</figcaption><div class="amount-rows">${values.map(r=>`<div class="amount-row" data-amount-value="${r.value}" data-amount-index="${r.index}"><span>${esc(r.label)}</span><span class="amount-track" aria-hidden="true"><i style="width:${r.index/maximum*100}%"></i><em style="left:${100/maximum*100}%"></em></span><b>${number(r.index)}</b></div>`).join('')}</div><small>Vergleichszahl: ${esc(referenceLabel)} = 100.${note?' '+esc(note):''}</small></figure>`;
}
export function residueObservation(s,{comparison=false}={}){
 const isFood=s.mission.startsWith('m2'),start=s.baseline.detritus;
 const rows=[{label:isFood?'Vor dem Füttern':'Gleicher Anfang',value:start}];
 if(isFood){const feeding=s.events.find(e=>e.type==='one-food-portion');if(feeding)rows.push({label:'Nach dem Füttern',value:feeding.after});if(s.currentRun||s.runs.length)rows.push({label:s.currentRun?'Jetzt':'Nach 3 Tagen',value:s.tank.detritus});}
 else if(comparison){for(const condition of ['water','feed']){const r=s.runs.find(r=>r.condition===condition);if(r)rows.push({label:condition==='water'?'Wasserwechsel':'Weniger Futter',value:r.samples.at(-1).organic});}}
 else rows.push({label:s.measure==='water'?'Wasserwechsel · jetzt':s.measure==='feed'?'Weniger Futter · jetzt':'Jetzt',value:s.tank.detritus});
 return amountFigure({title:comparison?'Reste im Aquarium · Tag 10':'Reste in diesem Aquarium',rows,reference:start,referenceLabel:isFood?'vor dem Füttern':'gleicher Anfang',note:'Vergleich im Modell, keine Krümelzahl.'});
}
export function plantObservation(s,types){
 const e=s.tank.entities.find(e=>e.uid===s.selection),r=s.currentRun||s.runs.at(-1),start=(r?.startSnapshot||s.baseline).entities.find(e=>e.uid===s.selection);
 if(!e||!start)return '';
 return amountFigure({title:`${types?.[e.species]?.name||'Pflanze'} · ${e.uid}`,uid:e.uid,rows:[{label:'Anfang',value:start.biomass},{label:r?.status==='completed'?'Nach 3 Tagen':'Jetzt',value:e.biomass}],reference:start.biomass,note:'Pflanzenmenge im Modell, keine Wägung.'});
}
export function nutrientObservation(s){
 const rows=[{label:'Gleicher Anfang',value:s.baseline.params.no3}];
 for(const r of s.runs)rows.push({label:r.condition==='water'?'Direkt nach Wasserwechsel':'Direkt nach weniger Futter',value:r.samples[0].no3});
 if(s.pendingIntervention&&!s.runs.some(r=>r.condition===s.measure))rows.push({label:'Direkt danach',value:s.pendingIntervention.after.params.no3});
 return amountFigure({title:'Gelöste Nährstoffe im Wasser',rows,reference:s.baseline.params.no3,note:'Nitrat als Beispiel.'});
}
export function foodFlowObservation(s,{explain=true}={}){
 const r=s.runs[0];if(!r)return '';
 return amountFigure({title:'Abbau und Reste im Modell',reference:s.baseline.detritus,rows:[{label:'Reste nach Füttern',value:r.samples[0].organic},{label:'Insgesamt abgebaut',value:r.fluxTotals.decomposition||0},{label:'Reste nach 3 Tagen',value:r.samples.at(-1).organic}],referenceLabel:'vor dem Füttern',note:'Abbau über drei Tage; Reste jeweils zu einem Zeitpunkt.'})+(explain?'<p>Gleichzeitig können neue Reste entstehen. Darum ist „abgebaut“ nicht einfach der Unterschied zwischen Anfang und Ende. Das sind Modellwerte, keine Beobachtung einzelner Krümel oder winziger Lebewesen.</p>':'');
}
