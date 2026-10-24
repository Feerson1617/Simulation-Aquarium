/** Qualitative harbour case. No invented water readings, damage rates or simulated days. */
export const HARBOUR_MEASURES = {
  returns:{label:'Mehrweg und Rückgabe für Besucher',object:'visitors',
    benefit:'Weniger Einwegverpackungen können von Tieren verschluckt werden',
    effort:'Rückgabestellen, Reinigung und Transport müssen organisiert werden',
    objection:'Besucher müssen Gefäße zurückbringen; Rückgabewege dürfen nicht zu lang sein',
    followup:'Rückgaben und liegen gelassene Verpackungen am Hafen erfassen',
    conclusion:'Mehrweg mit erreichbarer Rückgabe vermeidet Einwegverpackungen'},
  gear:{label:'Sammelstellen für ausgediente Netze und Leinen',object:'fishing',
    benefit:'Weniger ausgediente Netze und Leinen können Tiere verheddern',
    effort:'Fischerei und Hafen brauchen Sammelplatz, Sortierung und Abtransport',
    objection:'Eine Sammelstelle verhindert noch nicht den Verlust benutzter Netze auf See',
    followup:'Abgegebene Netze und Leinen sowie angespültes Fanggerät erfassen',
    conclusion:'Die Sammlung ausgedienter Netze und Leinen verringert eine Müllquelle'},
};
export function harbourMeasure(state) {
  const choice=state?.activities?.find(a=>a.id==='harbour-interest');
  return state?.measureKey || (choice ? choice.choiceIndex===1 || choice.to===HARBOUR_MEASURES.gear.label ? 'gear' : 'returns' : null);
}
export const HARBOUR_OBJECTS = {
  visitors:{label:'Besucher am Kai',text:'Besucher nehmen Getränke und Essen mit. Weggeworfene Verpackungen können vom Kai ins Wasser gelangen.'},
  fishing:{label:'Fischerei am Anleger',text:'Ausgediente Netze und Leinen brauchen eine geregelte Sammlung an Land. Verlorenes Fanggerät auf See ist ein zusätzliches Problem.'},
  packaging:{label:'Verpackungen im Wasser',text:'Verpackungen können treiben, an Land gespült oder von Tieren aufgenommen werden.'},
  nets:{label:'Netz und Leine im Wasser',text:'Tiere können sich in Netzen und Leinen verheddern. Der Fall zeigt mögliche Wege, keine gemessene Schadenszahl.'},
  animals:{label:'Tiere am Watt',text:'Vögel und Meeressäuger sind unter anderem durch Verschlucken und Verheddern gefährdet. Welche Arten und Folgen betroffen sind, muss vor Ort untersucht werden.'},
};
export function harbourWorkspace({session,quest,drawer,esc,button,source}) {
  const object=session.harbourSelection,info=HARBOUR_OBJECTS[object],key=harbourMeasure(session.quest),measure=HARBOUR_MEASURES[key];
  const icons={
    visitors:'<circle cx="24" cy="8" r="6"/><path d="M19 17h10l4 18h-7v12h-5V35h-7z"/><circle cx="48" cy="11" r="5"/><path d="M43 19h10l3 16h-6v12h-5V35h-6z"/>',
    fishing:'<path d="M5 31h66L60 44H19zM28 15h26v16H28zM39 4h4v11h-4z"/><path d="M43 4 63 17H43" fill="#efddaf"/>',
    packaging:'<path d="M16 4h9v9l5 9v22H11V22l5-9zM45 11h20l5 34H39z"/><path d="M45 18q10-21 20 0" fill="none" stroke="currentColor" stroke-width="3"/>',
    nets:'<path d="M6 8h52v32H6z" fill="none" stroke="currentColor" stroke-width="3"/><path d="m7 9 37 31M20 8l38 32M6 24l20 16M7 40 45 8M22 40 58 10M40 40l18-16M58 8q30 3 13 19t-9 18" fill="none" stroke="currentColor" stroke-width="2"/>',
    animals:'<path d="M4 20q5-14 14-10l12 9-13-2q-3 13-11 8zM19 12 35 15 21 17M12 24l-2 16m5-16 3 16M41 34q7-13 24-8l8 11 5-2-3 8H39l-7-7z"/><circle cx="66" cy="31" r="2" fill="#fff"/>',
  };
  const node=(id,x,y,label,icon)=>`<button data-harbour-object="${id}" class="harbour-object ${object===id?'selected':''}" style="--x:${x}%;--y:${y}%" aria-pressed="${object===id}"><svg viewBox="0 0 80 50" aria-hidden="true" fill="currentColor">${icons[id]}</svg>${label}</button>`;
  return `<header class="coherent-header"><div><small>Klasse 10 · Regionaler Fall</small><h1>Ein Hafen am Wattenmeer</h1></div>${button('more','Mehr')}</header><main class="coherent-workspace" data-workspace-domain="harbour"><section class="coherent-views"><p class="cohort-boundary">Qualitativer Modellfall: Wähle am Hafen eine Müllquelle und verfolge ihren Weg zu den Tieren.</p><section class="harbour-scene" aria-label="Interaktiver Hafenfall"><svg viewBox="0 0 900 500" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="sea-lines" width="70" height="28" patternUnits="userSpaceOnUse"><path d="M0 14q18 -8 35 0t35 0" fill="none" stroke="#bad8d0" opacity=".4"/></pattern></defs><path d="M0 0H900V500H0Z" fill="#93b8b2"/><path d="M0 0H900V500H0Z" fill="url(#sea-lines)"/><path d="M0 0H900V120H640V210H570V120H300V215H240V120H0Z" fill="#d8c4a1"/><path d="M0 400Q300 330 540 420T900 370V500H0Z" fill="#b7ba93"/><path d="M150 130Q170 250 270 280M680 150Q690 230 630 290M290 310Q360 390 450 410M610 320Q550 390 490 410" fill="none" stroke="#31575b" stroke-width="4" stroke-dasharray="9 8"/><path d="M266 260 270 280 250 275M648 282 630 290 632 269M432 408 450 410 443 391M500 390 490 410 510 405" fill="none" stroke="#31575b" stroke-width="4"/></svg>
    ${node('visitors',18,12,'Besucher','♙')}${node('fishing',76,12,'Fischerei','⚓')}${node('packaging',28,50,'Verpackungen','▱')}${node('nets',70,51,'Netze / Leinen','⌗')}${node('animals',50,79,'Vogel / Seehund','♧')}</section>
    <section class="cohort-detail" data-harbour-detail role="status"><h2>${info?esc(info.label):'Was fällt dir auf?'}</h2><p>${info?esc(info.text):'Wähle Besucher, Fischerei, Müll oder Tiere direkt in der Ansicht.'}</p>${session.quest.caseRoute?.length ? `<p data-harbour-route>Dein Weg: ${session.quest.caseRoute.map(id=>esc(HARBOUR_OBJECTS[id].label)).join(' → ')}${session.quest.caseRoute.length<3 ? ' → …' : ' ✓'}</p>` : ''}${info?`<p>Möglicher Weg: ${object==='visitors'||object==='packaging'?'Besucher → Verpackungen → Verschlucken':object==='fishing'||object==='nets'?'Fischerei → Netze/Leinen → Verheddern':'Müllquelle → Müll im Wasser → Tier'}.</p>`:''}</section>
    ${measure?`<section class="cohort-detail" data-harbour-measure="${key}"><h2>Deine Maßnahme</h2><p>${esc(measure.label)}</p><details><summary>Ein Gegenargument prüfen</summary><p>${esc(measure.objection)}</p></details><p>Die Maßnahme verringert eine bestimmte Müllquelle. Ihre tatsächliche Wirkung muss vor Ort überprüft werden.</p></section>`:''}
    <details class="coherent-data"><summary>Woher stammen die Hintergrundinformationen?</summary><p>OSPAR beschreibt Müllquellen an Land und auf See sowie mögliche Gefahren durch Verschlucken und Verheddern. Die Zeichnung ist ein vereinfachter Hafenfall, keine Kartierung eines bestimmten Hafens.</p><a href="${esc(source.url)}" target="_blank" rel="noopener">OSPAR: Marine litter</a><p>Keine Aquariumtemperatur und kein Wasserwechsel messen Plastikschäden. Es gibt hier keine Aquariumtage.</p></details>
    </section><aside class="coherent-notebook">${drawer || quest}</aside></main>`;
}
