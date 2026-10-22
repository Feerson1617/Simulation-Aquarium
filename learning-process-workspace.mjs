import {pendingActivity,assignActivity} from './learning-activities.mjs';
/** Qualitative, manipulable relations; none of these arrows is a measured flux. */
export const PROCESS_TASKS={
 'food-fish':['food:fish'],'rest-decomposer':['remains:decomposer'],'consumer':['food:fish'],
 'producer':['light:plant'],'matter-energy':['decomposer:minerals','minerals:plant','fish:heat'],
 'carbon-uptake':['water:plant'],'carbon-return':['animal:water'],'fossil-carbon':['fossil:air'],
 'river-route':['land:river','river:sea'],
};
const node=(id,label,x,y,description,kind='matter')=>({id,label,x,y,description,kind});
export const PROCESS_SCENES={
 '8-foodweb':{title:'Wer nutzt welche Stoffe?',intro:'Tippe erst auf den Ausgang, dann auf das Ziel. Durchgezogene Pfeile zeigen Stoffwege, gestrichelte Energie.',
  nodes:[node('food','Futter',9,16,'Futter enthält organische Stoffe und chemische Energie.'),node('fish','Fisch',38,16,'Dieser Fisch nimmt Nahrung auf und atmet.'),node('remains','Reste',71,16,'Ausscheidungen und tote organische Reste können abgebaut werden.'),node('decomposer','Bakterien / Pilze',85,56,'Die Zersetzer nutzen organische Stoffe; dabei werden mineralische Nährstoffe frei.'),node('minerals','Mineralstoffe',60,83,'Pflanzen können gelöste mineralische Nährstoffe aufnehmen.'),node('plant','Wasserpflanze',24,68,'Pflanzen bauen mit Licht aus Kohlenstoffdioxid organische Stoffe auf.'),node('light','Licht',8,43,'Licht liefert neue Energie von außen.','energy'),node('heat','Wärme nach außen',44,43,'Bei Stoffwechselprozessen wird Energie als Wärme abgegeben.','energy')],
  edges:['food:fish','fish:remains','remains:decomposer','decomposer:minerals','minerals:plant','light:plant','fish:heat','plant:heat','decomposer:heat']},
 '10-carbon':{title:'Kohlenstoffwege – lokal und zusätzlich',intro:'Verbinde Speicher. Die Pfeile beschreiben mögliche Wege, keine Mengen und keine Klimaprognose.',
  nodes:[node('air','CO₂ in der Luft',28,15,'Zwischen Wasser und Luft findet Gasaustausch statt.'),node('water','CO₂ im Wasser',28,48,'Gelöstes Kohlenstoffdioxid steht Pflanzen zur Verfügung.'),node('plant','Wasserpflanzen',10,80,'Fotosynthese bindet Kohlenstoff in organischen Stoffen. Pflanzen atmen auch.'),node('animal','Tiere',54,80,'Nahrung enthält Kohlenstoff. Atmung setzt CO₂ frei.'),node('remains','Organische Reste',80,55,'Beim Abbau gelangt Kohlenstoff wieder als CO₂ ins Wasser.'),node('fossil','Fossile Vorräte',78,15,'Kohle, Erdöl und Erdgas sind langfristige Vorräte außerhalb des Aquariumversuchs. Verbrennung bringt zusätzlichen Kohlenstoff in die Luft.','external')],
  edges:['water:plant','plant:water','animal:water','remains:water','air:water','water:air','plant:remains','animal:remains','fossil:air']},
 '10-northsea':{title:'Vom Land über den Fluss in die Nordsee',intro:'Regionaler Fall: Verbinde die Eintragswege. Das Beckenexperiment bildet keine regionalen Mengen ab.',
  nodes:[node('land','Land / Landwirtschaft',18,28,'Nährstoffüberschüsse können mit abfließendem Wasser in Gewässer gelangen.'),node('river','Bach / Fluss (Elbe)',49,52,'Flüsse transportieren Stoffe aus ihrem Einzugsgebiet.'),node('sea','Nordsee',81,76,'Nährstoffeinträge können Algenwachstum und spätere Sauerstoffprobleme fördern. Strömungen und weitere Quellen sind hier nicht dargestellt.')],edges:['land:river','river:sea']},
};
export function connectProcess(session,mission,from,to,context) {
 const scene=PROCESS_SCENES[mission],key=from+':'+to;
 const state=(session.processes ??= {})[mission] ??= {links:[],actions:[]};
 const activity=session.quest && pendingActivity(session.quest);
 if(!scene?.edges.includes(key)) return {accepted:false,feedback:'Dieser Pfeil beschreibt hier keinen passenden Weg. Prüfe Ausgang und Ziel.'};
 const event={from,to,kind:scene.nodes.find(n=>n.id===from).kind==='energy'||to==='heat'?'energy':'matter',origin:'game-action',context:structuredClone(context),activity:activity?.id || null};
 if(!state.links.some(e=>e.from===from&&e.to===to))state.links.push(event);
 state.actions.push(event);state.actions=state.actions.slice(-60);
 const required=PROCESS_TASKS[activity?.id];
 if(required?.every(edge=>state.actions.some(a=>a.activity===activity.id && a.context.investigationId===context.investigationId && a.from+':'+a.to===edge))){
  session.quest.observed=true;
  if(assignActivity(session.quest,activity.id,activity.correct ?? 0)){
   Object.assign(session.quest.activities.at(-1),{kind:'connection',origin:'game-action',connections:structuredClone(state.actions.filter(a=>a.activity===activity.id))});
   return {accepted:true,completed:true,feedback:'Verbindung gespeichert. Prüfe die nächste Aufgabe.'};
  }
 }
 return {accepted:true,feedback:'Möglicher Weg verbunden. Ergänze die Verbindungen für deine Aufgabe.'};
}
export function processWorkspace({session,mission,context,esc,button}){
 const scene=PROCESS_SCENES[mission];if(!scene)return '';
 const state=session.processes?.[mission],selected=state?.selected,info=scene.nodes.find(n=>n.id===selected);
 const contextId=context.investigationId || context.seriesId || 'qualitative';
 return `<section class="process-workspace" data-process-mission="${mission}" data-process-context="${esc(contextId)}"><h2>${scene.title}</h2><p>${scene.intro}</p><div class="process-scene"><svg viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="process-arrow" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path d="M0 0 9 3.5 0 7" fill="none" stroke="#855c28" stroke-width="1.5"/></marker></defs>${(state?.links || []).map(e=>{const a=scene.nodes.find(n=>n.id===e.from),b=scene.nodes.find(n=>n.id===e.to);return `<polyline points="${a.x*10},${a.y*5} ${(a.x+b.x)*5},${(a.y+b.y)*2.5} ${b.x*10},${b.y*5}" fill="none" stroke="#855c28" stroke-width="4" ${e.kind==='energy'?'stroke-dasharray="10 7"':''} marker-mid="url(#process-arrow)"/>`;}).join('')}</svg>${scene.nodes.map(n=>`<button data-process-node="${n.id}" class="process-node ${n.kind}" style="--x:${n.x}%;--y:${n.y}%" aria-pressed="${n.id===selected}">${n.label}</button>`).join('')}</div><p data-process-feedback role="status">${esc(state?.feedback || 'Wähle einen Ausgangspunkt.')}</p>${info?`<details class="process-info"><summary>${info.label} genauer ansehen</summary><p>${esc(info.description)}</p></details>`:''}<small>Qualitative Erklärung. Durchgezogene Pfeile: Stoffe. Gestrichelte Pfeile: Energie. Kein gemessener Stoffstrom.</small></section>`;
}

export function forestWorkspace({session,esc}) {
 const selected=session.forestSelection || [];
 return `<section class="process-workspace"><h2>Blätter im Vergleich</h2><p>Wähle bei beiden Pflanzen ein Blatt. Vergleiche jeweils seine Umgebung.</p><div class="forest-pair"><button data-forest-leaf="tree" aria-pressed="${selected.includes('tree')}"><svg viewBox="0 0 250 160" aria-hidden="true"><path d="M0 145h250v15H0z" fill="#ad9a6c"/><path d="M119 145 123 55h10l3 90" fill="#70533c"/><path d="M125 87 80 46M131 78l43-34" stroke="#70533c" stroke-width="5"/><path d="M45 38Q90 2 126 32Q174-3 209 39Q226 89 178 105Q130 121 100 98Q34 106 45 38" fill="#537c48"/><ellipse cx="179" cy="62" rx="25" ry="11" fill="#b2c87d" stroke="#e8e4ac" stroke-width="3"/></svg><strong>Baumblatt · Luft</strong></button><button data-forest-leaf="waterweed" aria-pressed="${selected.includes('waterweed')}"><svg viewBox="0 0 250 160" aria-hidden="true"><path d="M0 10h250v135H0z" fill="#a4cecb"/><path d="M0 145h250v15H0z" fill="#ad9a6c"/><path d="M124 145V30M122 145l-14 11m17-11 14 11" stroke="#63864b" stroke-width="4"/>${[48,75,102,128].map(y=>`<ellipse cx="105" cy="${y}" rx="22" ry="7" fill="#789c57"/><ellipse cx="143" cy="${y}" rx="22" ry="7" fill="#91af65"/>`).join('')}<ellipse cx="144" cy="75" rx="24" ry="9" fill="none" stroke="#f0e9a9" stroke-width="3"/></svg><strong>Wasserpestblatt · unter Wasser</strong></button></div><p role="status">${selected.length===2?'Beide Blätter ausgewählt. Auch Wasserpest kann im Boden wurzeln. Verglichen werden hier die Blätter und ihre Umgebung.':'Wähle die hell markierten Blätter.'}</p><small>Vereinfachte Zeichnung der Blattumgebung. Keine gemessene Waldentwicklung.</small></section>`;
}
