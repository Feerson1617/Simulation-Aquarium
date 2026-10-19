import { variantsFor,variantFor,genotypeOptions,GENETICS_DISCLAIMER } from './fish-variants.mjs';
import { BREEDING_SPECIES } from './genetics.mjs';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function shopFishVisual(species,selection){
 const form=variantFor(species.id,selection.variant);
 return `<div class="shop-variant-heading"><strong data-variant-name>${esc(form.name)}</strong><span>Live-3D-Vorschau</span></div><div id="shop-specimen-stage" class="specimen-stage shop-specimen-stage" aria-label="3D-Vorschau ${esc(species.name)} ${esc(form.name)}"><div class="specimen-loading" role="status">Modell wird geladen …</div></div><p class="tiny">Ziehen: drehen · Scrollen / zwei Finger: vergrößern. ${selection.sex==='♀'?'Weibchen':'Männchen'} als adulte Vorschau. Jungtiere und Weibchen können weniger stark gefärbt sein.</p>`;
}
export function shopFishFields(species,selection){
 const forms=variantsFor(species.id),form=variantFor(species.id,selection.variant),options=genotypeOptions(species.id,form.id),chosen=options.includes(selection.lessonGenotype)?selection.lessonGenotype:options[0];
 return `<section class="fish-selection">${forms.length>1?`<div class="field"><label for="fish-variant">Farbvariante</label><select id="fish-variant" data-fish-variant>${forms.map(v=>`<option value="${v.id}" ${v.id===form.id?'selected':''}>${esc(v.name)}</option>`).join('')}</select></div>`:''}${BREEDING_SPECIES[species.id]?`<div class="field"><label for="fish-sex">Geschlecht</label><select id="fish-sex" data-fish-sex><option value="random">Zufällig</option><option value="♀" ${selection.sex==='♀'?'selected':''}>Weibchen</option><option value="♂" ${selection.sex==='♂'?'selected':''}>Männchen</option></select></div>`:''}<details class="lesson-purchase"><summary>Eltern für einen Vererbungsversuch auswählen</summary><p class="tiny">${esc(GENETICS_DISCLAIMER)}</p>${options.length?`<label for="lesson-genotype">Unterrichtsgenotyp</label><select id="lesson-genotype" data-lesson-genotype>${options.map(value=>`<option ${value===chosen?'selected':''}>${value}</option>`).join('')}</select><p class="tiny">Nur Genotypen mit der ausgewählten sichtbaren Farbform im Modell stehen zur Wahl. Ohne Auswahl beginnt das Tier reinerbig.</p>`:'<p class="tiny">Für diese Farbform ist keine einfache Mendelsche Farbvererbung hinterlegt. Es werden keine wissenschaftlich gesicherten Farbgene vorgetäuscht.</p>'}</details></section>`;
}
export function individualCard(entity){
 const genetic=BREEDING_SPECIES[entity.species]?entity.genetics:null,form=variantFor(entity.species,entity.variant);
 return `<div class="banner"><strong>${esc(form.name)}</strong>${genetic?`<br>${esc(genetic.filial||'P')} · ${genetic.parents.length?'Eltern '+genetic.parents.map(id=>'#'+id).join(' × '):'Gründer ohne bekannte Eltern'}<br><button class="secondary" data-open-genetics>Genetik und Vererbung untersuchen</button>`:''}</div>`;
}
