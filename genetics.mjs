import { variantsFor, variantFor, modelFor, lociFor, normalizePair, genotypeOptions, parseGenotype, phenotypeFor, genotypeText } from './fish-variants.mjs';

export const BREEDING_SPECIES = {
 molly:{mode:'live',cycle:7,maturity:7,brood:[3,5]},
 platy:{mode:'live',cycle:7,maturity:7,brood:[3,5]},
 guppy:{mode:'live',cycle:7,maturity:7,brood:[3,5]},
 swordtail:{mode:'live',cycle:7,maturity:7,brood:[3,5]},
 endler:{mode:'live',cycle:7,maturity:7,brood:[3,5]},
 zebra:{mode:'eggs',cycle:7,maturity:7,incubation:1,brood:[4,6]},
};
export const POPULATION_LIMITS={entities:240,pedigree:5000};
const allowedModels=['molly-mono','platy-independent','zebra-golden'];
const clone=x=>JSON.parse(JSON.stringify(x));
const validId=id=>Number.isSafeInteger(id)&&id>0;

export function inheritGenotype(a,b,random=Math.random) {
 if(a.model!==b.model||!a.model||!a.loci||!b.loci)throw new Error('Die Eltern benötigen dasselbe unterstützte Vererbungsmodell.');
 const result={};for(const locus of lociFor(a.model)){
  const aa=normalizePair(a.loci[locus],locus),bb=normalizePair(b.loci[locus],locus);
  if(!aa||!bb)throw new Error('Ungültige Elternallele.');
  result[locus]=normalizePair([aa[Math.floor(random()*2)],bb[Math.floor(random()*2)]],locus);
 }return result;
}
export function gametes(genetic) {
 if(!genetic?.model||!genetic.loci)return [];
 let result=[{alleles:{},probability:1}];
 for(const locus of lociFor(genetic.model)){
  const pair=normalizePair(genetic.loci[locus],locus);if(!pair)throw new Error('Ungültiger Genotyp.');
  result=result.flatMap(g=>pair.map(allele=>({alleles:{...g.alleles,[locus]:allele},probability:g.probability*.5})));
 }
 const unique=new Map();for(const g of result){const key=Object.values(g.alleles).join('');if(unique.has(key))unique.get(key).probability+=g.probability;else unique.set(key,g)}return [...unique.values()];
}
export function punnettSquare(a,b) {
 if(a?.model!==b?.model||!a?.model)return null;
 const rows=gametes(a),columns=gametes(b),genotypes={},phenotypes={};
 const cells=rows.map(row=>columns.map(column=>{
  const loci={};for(const locus of lociFor(a.model))loci[locus]=normalizePair([row.alleles[locus],column.alleles[locus]],locus);
  const genotype=genotypeText(loci),phenotype=phenotypeFor(a.model,loci),probability=row.probability*column.probability;
  genotypes[genotype]=(genotypes[genotype]||0)+probability;phenotypes[phenotype]=(phenotypes[phenotype]||0)+probability;return{loci,genotype,phenotype,probability};
 }));return{rows,columns,cells,genotypes,phenotypes};
}
export function ensureGenetics(state) {
 if(!state.genetics)state.genetics={version:1,enabled:true,pairs:{},pedigree:{},clutches:[],notes:'',lastProcessedDay:Math.floor(state.day)};
 return state.genetics;
}
export function individualGrowth(entity) {
 if(entity.genetics?.founder===false)return .30+.70*Math.min(1,Math.max(0,entity.age)/7);
 return entity.age<15?.5+Math.max(0,entity.age)/30:1;
}
function rootsFor(entity){return entity.genetics?.roots||[entity.uid]}
function filialFor(mother,father){
 const a=mother.genetics,b=father.genetics;
 if((a?.generation||0)===0&&(b?.generation||0)===0)return'F1';
 if(a?.filial==='F1'&&b?.filial==='F1'&&JSON.stringify([...rootsFor(mother)].sort((x,y)=>x-y))===JSON.stringify([...rootsFor(father)].sort((x,y)=>x-y)))return'F2';
 return'G'+(Math.max(a?.generation||0,b?.generation||0)+1);
}
function recordFor(entity,state,status=entity.dead?'verstorben':'lebend') {
 const g=entity.genetics;return{uid:entity.uid,species:entity.species,sex:entity.sex,variant:entity.variant,model:g?.model||null,loci:g?.loci?clone(g.loci):null,parents:[...(g?.parents||[])],generation:g?.generation||0,filial:g?.filial||'P',roots:[...rootsFor(entity)],founder:g?.founder!==false,bornDay:g?.bornDay??null,status,recordedDay:state.day};
}
export function initializeIndividual(state,entity,options={}) {
 if(!BREEDING_SPECIES[entity.species]&&!variantsFor(entity.species)[0].body)return entity;
 const geneticState=ensureGenetics(state),old=entity.genetics;
 if(old&&!options.replace){entity.variant=variantFor(entity.species,entity.variant).id;geneticState.pedigree[entity.uid]=recordFor(entity,state);return entity}
 let variant=options.variant||entity.variant;
 if(!variant&&entity.species==='molly'&&['AA','Aa','aa'].includes(entity.genotype))variant=entity.genotype==='aa'?'gold':'black';
 const form=variantFor(entity.species,variant),model=modelFor(entity.species,form.id);
 const text=options.genotype||((!options.variant&&entity.species==='molly')?entity.genotype:null)||genotypeOptions(entity.species,form.id)[0];
 const loci=model?parseGenotype(text,model):null;
 if(model&&(!loci||phenotypeFor(model,loci)!==form.id))throw new Error('Genotyp und gewählte Farbvariante passen im Lernmodell nicht zusammen.');
 entity.variant=form.id;if(options.sex==='♀'||options.sex==='♂')entity.sex=options.sex;
 entity.genetics={model,loci,parents:[],generation:0,filial:'P',roots:[entity.uid],founder:true,bornDay:null};
 entity.genotype=model&&lociFor(model).length===1?loci.A.join(''):null;
 geneticState.pedigree[entity.uid]=recordFor(entity,state);return entity;
}
export function normalizeGenetics(state,raw,catalog) {
 if(raw!==undefined&&raw!==null&&(!raw||raw.version!==1||typeof raw!=='object'||!Array.isArray(raw.clutches)||!raw.pedigree||typeof raw.pedigree!=='object'||Array.isArray(raw.pedigree)))throw new Error('Ungültiger Genetik-Spielstand.');
 if(!raw){if(state.entities.some(e=>e.genetics))throw new Error('Das Abstammungsarchiv fehlt; genetische Daten werden nicht als neue Gründer umgedeutet.');for(const e of state.entities)if(BREEDING_SPECIES[e.species]||variantsFor(e.species)[0].body)initializeIndividual(state,e);return state}
 if(Object.keys(raw.pedigree).length>POPULATION_LIMITS.pedigree||raw.clutches.length>POPULATION_LIMITS.entities)throw new Error('Genetik-Spielstand überschreitet die dokumentierte Kapazität. Es wurden keine Daten verworfen.');
 const clean={version:1,enabled:raw.enabled!==false,pairs:{},pedigree:{},clutches:[],notes:typeof raw.notes==='string'?raw.notes.slice(0,20000):'',lastProcessedDay:Number.isInteger(raw.lastProcessedDay)?Math.max(0,Math.min(Math.floor(state.day),raw.lastProcessedDay)):Math.floor(state.day)};
 for(const [id,record]of Object.entries(raw.pedigree)){
  if(!validId(record?.uid)||String(record.uid)!==id||!catalog[record.species]||!Array.isArray(record.parents)||record.parents.length>2||record.parents.some(p=>!validId(p))||new Set(record.parents).size!==record.parents.length||!Number.isInteger(record.generation)||record.generation<0||record.generation>10000)throw new Error('Ungültige Abstammungsdaten.');
  const form=variantFor(record.species,record.variant);if(form.id!==record.variant)throw new Error('Unbekannte gespeicherte Farbvariante.');
  const model=record.model||null;if(model!==modelFor(record.species,form.id)||model&&!allowedModels.includes(model))throw new Error('Unbekanntes genetisches Modell.');
  const loci=model?parseGenotype(genotypeText(record.loci),model):null;
  if(model&&(!loci||phenotypeFor(model,loci)!==form.id))throw new Error('Widersprüchlicher gespeicherter Genotyp.');
  if(!['lebend','verstorben','Ei','Ei abgestorben','abgegeben'].includes(record.status))throw new Error('Ungültiger Entwicklungsstatus.');
  clean.pedigree[id]={uid:record.uid,species:record.species,sex:record.sex==='♀'?'♀':'♂',variant:form.id,model,loci,parents:[...record.parents],generation:record.generation,filial:typeof record.filial==='string'?record.filial.slice(0,24):'G'+record.generation,roots:Array.isArray(record.roots)&&record.roots.every(validId)?[...new Set(record.roots)]:[record.uid],founder:record.founder!==false,bornDay:Number.isFinite(record.bornDay)?record.bornDay:null,status:record.status,recordedDay:Number.isFinite(record.recordedDay)?record.recordedDay:state.day};
 }
 for(const record of Object.values(clean.pedigree)){
  if(record.parents.some(id=>!clean.pedigree[id]||id===record.uid||clean.pedigree[id].species!==record.species||clean.pedigree[id].generation>=record.generation))throw new Error('Widersprüchliche oder fehlende Eltern im Abstammungsarchiv.');
 }
 for(const clutch of raw.clutches){
  if(!Array.isArray(clutch.ids)||clutch.ids.some(id=>!validId(id)||clean.pedigree[id]?.status!=='Ei')||!Number.isFinite(clutch.hatchDay)||!Number.isFinite(clutch.laidDay)||clutch.hatchDay<clutch.laidDay||!BREEDING_SPECIES[clutch.species]||BREEDING_SPECIES[clutch.species].mode!=='eggs')throw new Error('Ungültiges Gelege.');
  clean.clutches.push({ids:[...clutch.ids],species:clutch.species,laidDay:clutch.laidDay,hatchDay:clutch.hatchDay});
 }
 const clutchIds=clean.clutches.flatMap(c=>c.ids);if(new Set(clutchIds).size!==clutchIds.length||clutchIds.some(id=>state.entities.some(e=>e.uid===id)))throw new Error('Doppelte Ei-/Tierkennungen.');
 for(const [species,pair]of Object.entries(raw.pairs||{}))if(BREEDING_SPECIES[species]&&Array.isArray(pair)&&pair.length===2&&pair.every(validId))clean.pairs[species]=[...pair];
 state.genetics=clean;
 for(const e of state.entities){
  const record=clean.pedigree[e.uid];
  if(record){if(record.species!==e.species||record.sex!==e.sex||record.status!==(e.dead?'verstorben':'lebend'))throw new Error('Abstammung passt nicht zum Tier.');e.variant=record.variant;e.genetics={model:record.model,loci:record.loci?clone(record.loci):null,parents:[...record.parents],generation:record.generation,filial:record.filial,roots:[...record.roots],founder:record.founder,bornDay:record.bornDay};if(record.model&&lociFor(record.model).length===1)e.genotype=record.loci.A.join('')}
  else if(BREEDING_SPECIES[e.species]||variantsFor(e.species)[0].body){if(e.genetics)throw new Error('Das Individuum fehlt im Abstammungsarchiv.');initializeIndividual(state,e);}
 }
 state.nextId=Math.max(state.nextId,...Object.values(clean.pedigree).map(r=>r.uid+1));return state;
}
export function setBreedingPair(state,species,motherId,fatherId) {
 if(!BREEDING_SPECIES[species])throw new Error('Für diese Art gibt es kein Fortpflanzungsmodell.');
 const mother=state.entities.find(e=>e.uid===motherId),father=state.entities.find(e=>e.uid===fatherId);
 if(!mother||!father||mother===father||mother.species!==species||father.species!==species||mother.sex!=='♀'||father.sex!=='♂'||mother.dead||father.dead)throw new Error('Wähle ein lebendes Weibchen und Männchen derselben Art.');
 const genetics=ensureGenetics(state),previous=genetics.pairs[species];if(previous?.[0]!==motherId||previous?.[1]!==fatherId){genetics.pairs[species]=[motherId,fatherId];mother.pregnancy=0}return[motherId,fatherId];
}
function pendingCount(state){return(state.genetics?.clutches||[]).reduce((n,c)=>n+c.ids.length,0)}
export function breedingConditions(state,mother,father,catalog,foodScore=()=>1,broodSize=3) {
 const reasons=[],spec=BREEDING_SPECIES[mother?.species],species=catalog[mother?.species];
 if(!spec||!species)return['Fortpflanzung für diese Art nicht modelliert.'];
 if(!mother||!father||mother.uid===father.uid||mother.species!==father.species||mother.sex!=='♀'||father.sex!=='♂'||mother.dead||father.dead)return['Passendes lebendes Elternpaar fehlt.'];
 if(mother.age<spec.maturity||father.age<spec.maturity)reasons.push('Elterntiere sind noch nicht geschlechtsreif.');
 if(mother.health<85||father.health<85)reasons.push('Elterntiere benötigen mindestens 85 % Gesundheit.');
 const water=state.params;if(state.water!==species.water||water.salinity<(species.salinity?.[0]??0)-1||water.salinity>(species.salinity?.[1]??1)+1)reasons.push('Wasserart oder Salzgehalt passt nicht.');
 if(water.temp<species.temp[0]||water.temp>species.temp[1]||water.ph<species.ph[0]||water.ph>species.ph[1]||state.liters<species.minL)reasons.push('Temperatur, pH oder Beckengröße passt nicht zur Art.');
 if(water.no2>.1||water.nh4>.25||water.oxygen<5)reasons.push('Wasserqualität reicht für die Fortpflanzung nicht aus.');
 if(foodScore(state,mother)<.6||foodScore(state,father)<.6)reasons.push('Ausreichende passende Nahrung fehlt.');
 if(!state.entities.some(e=>!e.dead&&['plant','decor'].includes(catalog[e.species]?.category)))reasons.push(spec.mode==='eggs'?'Pflanzen oder Laichstruktur als Schutz fehlen.':'Rückzugsmöglichkeiten für Jungfische fehlen.');
 const animals=state.entities.filter(e=>!e.dead&&['fish','invert'].includes(catalog[e.species]?.category));const adultLoad=animals.reduce((n,e)=>n+(catalog[e.species]?.load||0),0);
 if(adultLoad+(pendingCount(state)+broodSize)*(species.load||1)>state.liters*.11)reasons.push('Auch ausgewachsene Nachkommen würden den verfügbaren Platz überlasten.');
 if(state.entities.length+pendingCount(state)+broodSize>POPULATION_LIMITS.entities)reasons.push('Becken-Objektgrenze erreicht; es werden keine Tiere heimlich entfernt.');
 if(Object.keys(state.genetics?.pedigree||{}).length+broodSize>POPULATION_LIMITS.pedigree)reasons.push('Abstammungsarchiv voll; zuerst den Versuch exportieren.');
 const a=mother.genetics,b=father.genetics;
 if(a?.model!==b?.model||(!a?.model&&mother.variant!==father.variant))reasons.push('Für diese Kombination komplexer Farbformen ist kein überprüfbares Farb-Erbmodell hinterlegt.');
 return reasons;
}
function childRecord(state,mother,father,random) {
 const model=mother.genetics?.model||null,loci=model?inheritGenotype(mother.genetics,father.genetics,random):null;
 const generation=Math.max(mother.genetics?.generation||0,father.genetics?.generation||0)+1;
 return{uid:state.nextId++,species:mother.species,sex:random()<.5?'♀':'♂',variant:model?phenotypeFor(model,loci):mother.variant,model,loci,parents:[mother.uid,father.uid],generation,filial:filialFor(mother,father),roots:[...new Set([...rootsFor(mother),...rootsFor(father)])].sort((a,b)=>a-b),founder:false,bornDay:state.day,status:'lebend',recordedDay:state.day};
}
function materialize(state,record,createEntity) {
 const entity=createEntity(state,record.species);if(!entity)return false;
 const transientId=entity.uid;if(state.genetics?.pedigree[transientId]?.founder)delete state.genetics.pedigree[transientId];
 Object.assign(entity,{uid:record.uid,sex:record.sex,variant:record.variant,age:0,health:95,scale:1,pregnancy:0});
 entity.genetics={model:record.model,loci:record.loci?clone(record.loci):null,parents:[...record.parents],generation:record.generation,filial:record.filial,roots:[...record.roots],founder:false,bornDay:state.day};
 entity.genotype=record.model&&lociFor(record.model).length===1?record.loci.A.join(''):null;record.status='lebend';record.bornDay=state.day;state.genetics.pedigree[record.uid]=record;
 if(record.species==='molly')state.offspring.push({uid:record.uid,day:Math.floor(state.day),genotype:entity.genotype,parents:record.parents.map(id=>genotypeText(state.genetics.pedigree[id]?.loci))});
 return true;
}
export function advanceReproduction(state,{catalog,random,createEntity,foodScore,notify=()=>{}}) {
 const g=ensureGenetics(state),day=Math.floor(state.day);if(day<=g.lastProcessedDay)return;
 // Called by the real daily ecology step; quarter-day chemistry and ageing run normally.
 g.lastProcessedDay=day;
 for(const entity of state.entities)if(entity.genetics){const record=g.pedigree[entity.uid];if(record)record.status=entity.dead?'verstorben':'lebend'}
 for(const clutch of [...g.clutches]){
  if(day<clutch.hatchDay)continue;
  const species=catalog[clutch.species],water=state.params;
  const suitable=state.water===species.water&&water.temp>=species.temp[0]&&water.temp<=species.temp[1]&&water.ph>=species.ph[0]&&water.ph<=species.ph[1]&&water.salinity>=(species.salinity?.[0]??0)-1&&water.salinity<=(species.salinity?.[1]??1)+1&&water.no2<=.1&&water.nh4<=.25&&water.oxygen>=5;
  if(!suitable&&day<clutch.hatchDay+2)continue;
  for(const id of clutch.ids){const record=g.pedigree[id];if(!suitable){record.status='Ei abgestorben';continue}if(!materialize(state,record,createEntity))throw new Error('Reservierter Jungfisch konnte nicht eingesetzt werden; Gelege bleibt erhalten.');}
  g.clutches.splice(g.clutches.indexOf(clutch),1);notify(clutch.species+(suitable?': Jungfische geschlüpft':': Gelege verloren'),suitable?'Eierlegende Fortpflanzung. Entwicklung ist im Unterrichtsmodell zeitlich stark verkürzt.':'Die Wasserqualität erlaubte keine weitere Embryonalentwicklung. Die Genotypen bleiben im Archiv erhalten.');
 }
 if(!g.enabled)return;
 const adults=state.entities.filter(e=>!e.dead&&BREEDING_SPECIES[e.species]&&e.sex==='♀');
 for(const mother of adults){
  initializeIndividual(state,mother);const pair=g.pairs[mother.species];if(pair&&pair[0]!==mother.uid)continue;
  const father=state.entities.find(e=>!e.dead&&e.sex==='♂'&&e.species===mother.species&&(pair?e.uid===pair[1]:e.age>=BREEDING_SPECIES[e.species].maturity));
  if(!father)continue;initializeIndividual(state,father);
  const spec=BREEDING_SPECIES[mother.species],brood=spec.brood[0]+Math.floor(random()*(spec.brood[1]-spec.brood[0]+1));
  if(breedingConditions(state,mother,father,catalog,foodScore,brood).length)continue;
  mother.pregnancy=(mother.pregnancy||0)+1;if(mother.pregnancy<spec.cycle)continue;mother.pregnancy=0;
  const records=[];for(let k=0;k<brood;k++){const record=childRecord(state,mother,father,random);g.pedigree[record.uid]=record;records.push(record)}
  if(spec.mode==='eggs'){
   for(const record of records)record.status='Ei';g.clutches.push({species:mother.species,ids:records.map(r=>r.uid),laidDay:state.day,hatchDay:day+spec.incubation});
   notify(catalog[mother.species].name+': Gelege',brood+' befruchtete Eier im vereinfachten Modell. Schlüpfen frühestens am nächsten Spieltag.');
  }else{
   for(const record of records)if(!materialize(state,record,createEntity))throw new Error('Jungfisch konnte trotz reserviertem Platz nicht eingesetzt werden.');
   notify(catalog[mother.species].name+': Nachwuchs',brood+' lebend geborene Jungfische. Wöchentlicher Zyklus und Reife nach sieben Tagen sind didaktisch verkürzt.');
  }
 }
}
export function offspringOf(state,mother,father){return Object.values(state.genetics?.pedigree||{}).filter(r=>!r.founder&&r.parents?.[0]===mother&&r.parents?.[1]===father)}
export function populationSummary(state,catalog) {
 const living=state.entities.filter(e=>!e.dead&&catalog[e.species]?.category==='fish'),juveniles=living.filter(e=>e.genetics?.founder===false&&e.age<7);
 return{living:living.length,juveniles:juveniles.length,eggs:pendingCount(state),records:Object.keys(state.genetics?.pedigree||{}).length,entityLimit:POPULATION_LIMITS.entities};
}

export function recordGeneticDeath(state,entity){const record=state.genetics?.pedigree?.[entity.uid];if(record)record.status="verstorben"}
export function recordGeneticRemoval(state,uid){const entity=state.entities.find(e=>e.uid===uid),record=state.genetics?.pedigree?.[uid];if(record)record.status=entity?.dead?'verstorben':'abgegeben'}
