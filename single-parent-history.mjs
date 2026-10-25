import {escapeText as esc} from './single-classroom-content.mjs';

/** Resolve exclusively from the selected saved trial, never from today's fish. */
export function parentContributionView(s,trialIndex=s.trials.length-1,generation=3){
 const trial=s.trials[trialIndex];if(!trial)return '<p>Noch kein abgeschlossener Versuch.</p>';
 const events=trial.eventContexts||[],ev=events.find(e=>e.generation===generation)||events.at(-1);
 if(!ev)return '<p>Die Elternbeiträge dieses Versuchs sind nicht dokumentiert.</p>';
 const past=trial.history.find(h=>h.generation===ev.previousGeneration&&h.stateId===ev.parentStateId);
 const parents=new Map((past?.tank.entities||[]).map(e=>[String(e.uid),e]));
 const label=(t,i)=>`Versuch ${i+1} · ${t.condition==='light'?'Helle mit mehr Chancen':'Gleiche Chancen'}`;
 return `<label>Gespeicherter Versuch<select data-parent-trial>${s.trials.map((t,i)=>`<option value="${i}" ${i===trialIndex?'selected':''}>${label(t,i)}</option>`).join('')}</select></label><label>Nachkommen aus Generation<select data-parent-generation>${events.map(e=>`<option value="${e.generation}" ${e===ev?'selected':''}>${e.generation}</option>`).join('')}</select></label><p><strong>Archiv: ${label(trial,trialIndex)}</strong><br>Eltern aus Generation ${ev.previousGeneration} → Nachkommen in Generation ${ev.generation}.</p><p>Das Aquarium zeigt die aktuelle Gruppe in Generation ${s.generation}. Die Tabelle zeigt frühere Eltern aus diesem gespeicherten Versuch.</p><p>Chance 1 ist doppelt so groß wie 0,5. Das ist weder Körpergewicht noch eine feste Kinderzahl.</p><table class="single-results" data-parent-table><caption>Archivierte Eltern und tatsächliche Beiträge</caption><thead><tr><th>Fisch-ID</th><th>Farbe / Erbanlagen</th><th>Chance bei der Elternwahl</th><th>Nachkommen</th></tr></thead><tbody>${Object.entries(ev.offspring).map(([uid,n])=>{const p=parents.get(uid);return `<tr data-parent-uid="${esc(uid)}"><td>${esc(uid)}</td><td>${p?`${p.variant==='gold'?'hell':'dunkel'} · ${esc(p.genotype||'nicht dokumentiert')}`:'nicht dokumentiert'}</td><td>${Number.isFinite(ev.weights[uid])?ev.weights[uid].toLocaleString('de-DE'):'unbekannt'}</td><td>${n}</td></tr>`;}).join('')}</tbody></table><p>Jedes Kind hat zwei Eltern. Es zählt deshalb bei beiden Elternteilen mit.</p>`;
}
