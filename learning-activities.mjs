/** Small biological actions inside the five phases. No synthetic measurements or compulsory essays. */
const link = (id,phase,from,prompt,targets,correct,hint) => ({id,phase,from,prompt,targets,correct,hint,kind:"assignment"});
const view = (id,phase,prompt,action) => ({id,phase,prompt,action,kind:"view"});
export const ACTIVITIES = {
  "8-ecosystem":[
    link("living",0,"Fisch","Ordne den Fisch zu.",["Lebewesen","Unbelebter Bestandteil"],0,"Ein Fisch nimmt Nahrung auf und wächst."),
    link("water",0,"Wasser","Ordne das Wasser zu.",["Lebewesen","Unbelebter Bestandteil"],1,"Wasser lebt nicht. Lebewesen brauchen es trotzdem."),
  ],
  "8-oxygen":[],
  "8-foodweb":[
    link("food-fish",0,"Futter","Wohin zeigt der Nahrungspfeil?",["Fisch","Licht"],0,"Der Pfeil zeigt von der Nahrung zu dem, der sie frisst."),
    link("rest-decomposer",0,"Tote Reste","Wer baut die Reste ab?",["Zersetzende Pilze und Bakterien","Der Heizstab"],0,"Zersetzende Lebewesen nutzen organische Reste."),
    link("consumer",4,"Fisch","Welche Rolle hat der Fisch?",["Nimmt organische Nahrung auf","Erzeugt Nahrung aus Licht und Kohlenstoffdioxid"],0,"Tiere nutzen Nahrung, die schon organische Stoffe enthält."),
    link("producer",4,"Wasserpest","Welche Rolle hat die Pflanze?",["Erzeugt mit Licht neue organische Stoffe","Frisst andere Tiere"],0,"Pflanzen nutzen Licht und Kohlenstoffdioxid."),
    link("matter-energy",4,"Stoffe und Energie","Ordne den Rückweg zu.",["Stoffe können erneut genutzt werden; Energie geht auch als Wärme hinaus","Stoffe und Energie kreisen beide vollständig zurück"],0,"Licht liefert ständig neue Energie. Stoffe können erneut aufgenommen werden."),
  ],
  "8-health":[view("fish-water",0,"Schau auf Fische und Wasser.","observe"),view("survival",3,"Vergleiche auch die Zahl lebender Fische.","fishAlive")],
  "8-forest":[
    link("forest-same",4,"Wasserpest 🌿 ↔ Baum 🌳","Ordne eine Gemeinsamkeit zu.",["Beide nutzen Licht für Fotosynthese","Beide wachsen nur im Wasser"],0,"Beide sind Pflanzen und brauchen Licht."),
    link("forest-different",4,"Wasserpest 🌿 ↔ Baum 🌳","Ordne einen Unterschied zu.",["Beim Baum liegen die Wurzeln im Boden; Wasserpest wächst unter Wasser","Nur der Baum braucht Kohlenstoff"],0,"Vergleiche, wo die Pflanzen wachsen."),
  ],
  "9-traits":[view("visible-traits",0,"Sieh dir einen hellen und einen dunklen Fisch an.","traits")],
  "9-mendel":[link("mendel-probability",4,"Aa × Aa","Was sagt 3:1 über einen Wurf?",["Eine Wahrscheinlichkeit; die gezählte Anzahl kann abweichen","Jeder Wurf hat genau drei dunkle und einen hellen Fisch"],0,"Jede Keimzelle wird zufällig gezogen. Zähle deinen tatsächlichen Wurf.")],
  "9-population":[],
  "9-darwin":[
    link("darwin-prediction",0,"Schon vorhandene Farbvarianten","Welche Vorhersage gehört dazu?",["Varianten können verschieden oft weitergegeben werden","Jeder Fisch wird durch seinen Wunsch dunkel"],0,"Hier unterscheiden sich schon die Eltern. Ein Bedarf erzeugt kein neues Allel."),
    link("lamarck-prediction",0,"Lamarck: im Leben erworbene Veränderungen","Was müsste nach dieser Erklärung weitergegeben werden?",["Die im Leben erworbene Veränderung der Eltern","Nur schon vorher vererbte Unterschiede"],0,"Lamarck nahm an, durch Gebrauch erworbene Veränderungen würden vererbt. Das ist eine andere Vorhersage als die Auswahl vorhandener Varianten."),
    link("fossil-evidence",4,"Zeitlich geordnete Fossilien","Was können Fossilien zusätzlich zeigen?",["Frühere Lebensformen und Veränderungen über lange Zeit","Dass ein Fisch seine Erbanlagen nach Wunsch ändert"],0,"Fossilien sind Funde aus der Natur. Ein Farbversuch ist kein Fossilbeleg."),
  ],
  "10-enrichment":[view("oxygen-too",3,"Prüfe neben Algen auch den Sauerstoff.","oxygen")],
  "10-carbon":[
    link("carbon-uptake",0,"Kohlenstoffdioxid im Wasser","Wohin gelangt Kohlenstoff bei Fotosynthese?",["In organische Stoffe der Pflanze","Er verschwindet"],0,"Pflanzen bauen aus Kohlenstoffdioxid neue Stoffe auf."),
    link("carbon-return",4,"Atmung und Abbau","Welcher Weg passt?",["Organische Stoffe → Kohlenstoffdioxid","Kohlenstoffdioxid → Erdöl in einem Tag"],0,"Bei Atmung und Abbau wird Kohlenstoffdioxid frei."),
    link("fossil-carbon",4,"Kohle, Erdöl und Erdgas","Was bewirkt ihre Verbrennung?",["Lange gespeicherter Kohlenstoff gelangt zusätzlich als CO₂ in die Luft","Nur der schon laufende kurze Pflanzenkreislauf wird unverändert wiederholt"],0,"Fossile Vorräte entstanden über sehr lange Zeit. Verbrennung setzt diesen Vorrat frei."),
  ],
  "10-restore":[view("early",3,"Prüfe den ersten Zeitpunkt nach der Maßnahme.","early"),view("late",3,"Prüfe den späten Verlauf und die überlebenden Fische.","late")],
  "10-northsea":[
    link("river-route",4,"Nährstoffe vom Land","Ergänze den Weg in die Nordsee.",["Bach → Fluss, zum Beispiel Elbe → Nordsee","Heizstab → Luft → Nordsee"],0,"Regen und Gewässer können Nährstoffe vom Land ins Meer transportieren."),
    link("river-measure",4,"Weniger Eintrag vom Land","Wähle eine Maßnahme am Anfang des Weges.",["Düngung an den Pflanzenbedarf anpassen und Gewässerrandstreifen erhalten","Nur einen kleinen Teil des Nordseewassers austauschen"],0,"Einträge lassen sich an der Quelle verringern. Ein Aquariumwasserwechsel schützt nicht die ganze Nordsee."),
    link("river-reason",4,"Landwirtschaft und Meer","Welche Folge muss mitbedacht werden?",["Weniger Eintrag schützt das Meer; Betriebe brauchen passende Düngeplanung","Weniger Eintrag verursacht keinerlei Aufwand"],0,"Schutzmaßnahmen haben Nutzen und können Arbeit oder Kosten verursachen."),
  ],
  "10-wadden":[
    link("harbour-interest",2,"Ein Hafen am Wattenmeer","Wähle eine Schutzmaßnahme.",["Mehrweg und Rückgabe für Besucher","Sammelstellen für ausgediente Netze und Leinen"],null,"Beide Maßnahmen vermeiden Müll. Wähle eine und prüfe ihre Folgen."),
    link("harbour-benefit",2,"Tiere im Wattenmeer","Welche Folge deiner Maßnahme hilft Tieren?",["Weniger weggeworfenes Material kann Verschlucken und Verheddern vermeiden","Müll wird zu Fischfutter"],0,"Müll kann Tiere verletzen. Müllvermeidung ist kein Nährstoffversuch."),
    link("harbour-effort",2,"Menschen am Hafen","Welche weitere Folge gehört zu deiner Entscheidung?",["Rückgabe oder Sammlung braucht Platz, Arbeit und Organisation","Schutz braucht nie Aufwand"],0,"Besucher, Hafenbetriebe und Fischerei müssen eine Maßnahme umsetzen können."),
    link("harbour-followup",4,"Deine Entscheidung überprüfen","Was prüfst du später?",["Wird das Angebot genutzt, und fällt weniger Müll an?","Hat sich die Aquariumtemperatur verändert?"],0,"Prüfe die Maßnahme am Hafen. Ein Wasserwert misst keinen Meeresmüll."),
  ],
};
export const REGIONAL_CASES = {
  "10-northsea":{text:"Über Flüsse wie die Elbe gelangen Nährstoffe in die Nordsee. Sie können Algenwachstum fördern. Auch Einträge vom Land spielen eine Rolle.",source:"UBA / OSPAR · Nährstoffeinträge und Eutrophierung",url:"https://www.ospar.org/work-areas/hasec/eutrophication"},
  "10-wadden":{text:"An einem Hafen am Wattenmeer nutzen Besucher und Fischerei die Küste. Verpackungen, Leinen und Netze können zu Meeresmüll werden. Tiere können Müll verschlucken oder sich darin verheddern.",source:"Nationalpark Wattenmeer / OSPAR · Meeresmüll",url:"https://www.ospar.org/work-areas/eiha/marine-litter"},
};
export function pendingActivity(state, phase = state.step) {
  if (!state || state.version === 1) return null;
  return (ACTIVITIES[state.id] || []).find(d => d.phase <= phase && !(state.activities || []).some(a => a.id === d.id));
}
export function assignActivity(state,id,index) {
  const d = pendingActivity(state);
  if (!d || d.id !== id || d.kind !== "assignment" || !Number.isInteger(index) || index < 0 || index >= d.targets.length) return false;
  if (d.phase === 0 && !state.observed) {state.feedback="Schau zuerst ins Aquarium oder in den Küstenfall.";return false;}
  if (d.correct !== null && d.correct !== index) {state.feedback=d.hint;return false;}
  (state.activities ??= []).push({id,kind:"assignment",origin:"selection",from:d.from,to:d.targets[index],at:new Date().toISOString()});
  state.feedback="Zuordnung gespeichert.";return true;
}
export function recordActivityView(state,id,evidence) {
  const d = pendingActivity(state);
  if (!d || d.id !== id || d.kind !== "view" || !evidence || typeof evidence !== "object") return false;
  if (id === "visible-traits" && (!Array.isArray(evidence.phenotypes) || !["black","gold"].every(c => evidence.phenotypes.includes(c)))) return false;
  if (id === "fish-water" && (!Number.isInteger(evidence.fishAlive) || !Number.isFinite(evidence.oxygen))) return false;
  if (["survival","oxygen-too","early","late"].includes(id) && (!evidence.configuration || !Number.isFinite(evidence.time))) return false;
  (state.activities ??= []).push({id,kind:"view",origin:"game-action",evidence:structuredClone(evidence),at:new Date().toISOString()});
  state.feedback="Beobachtung gespeichert.";return true;
}
export function mendelEvidence(p) {
  const crosses=p.events.filter(e=>e.kind==="cross"),founder=id=>p.archive.find(i=>i.uid===id),text=i=>i?.loci.A.join("");
  const first=crosses.find(e=>e.parents.map(id=>text(founder(id))).sort().join("/")==="AA/aa");
  const second=first && crosses.find(e=>e.generation===first.generation+1 && e.parents.every(id=>{const i=founder(id);return text(i)==="Aa" && i.generation===first.generation;}));
  return {complete:!!second,f1:first?{generation:first.generation,parents:first.parents,counts:p.history.find(h=>h.generation===first.generation)}:null,
    f2:second?{generation:second.generation,parents:second.parents,counts:p.history.find(h=>h.generation===second.generation)}:null};
}
export function populationPairEvidence(history,current) {
  const all=[...(history||[]),current].filter(c=>c?.kind==="population" && c.generations>=2 && c.repetitions>=2);
  const directed=all.findLast(c=>c.environment!=="neutral"),neutral=directed && all.findLast(c=>c.environment==="neutral" && c.configuration?.baseline.fingerprint===directed.configuration?.baseline.fingerprint);
  return {complete:!!(neutral&&directed),neutral:neutral?{environment:neutral.environment,seeds:neutral.runs.map(r=>r.seed),baseline:neutral.configuration.baseline}:null,
    directed:directed?{environment:directed.environment,seeds:directed.runs.map(r=>r.seed),baseline:directed.configuration.baseline}:null};
}
