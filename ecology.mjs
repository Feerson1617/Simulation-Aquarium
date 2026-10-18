/** Ecological interpretation of the real aquarium; relative pools are not cell counts. */
const ecoClamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
const ecoFinite=(v,fallback=0)=>Number.isFinite(v)?v:fallback;
export function normalizeEcology(value,state={}) {
 const source=value&&typeof value==='object'?value:{},mature=state.day>=30;
 return {version:1,heterotrophs:ecoClamp(ecoFinite(source.heterotrophs,mature?.35:.05)),microfauna:ecoClamp(ecoFinite(source.microfauna,mature?.12:0)),plankton:ecoClamp(ecoFinite(source.plankton,mature?.08:0)),nitrogenGas:ecoClamp(ecoFinite(source.nitrogenGas),0,1e6),
 lastFlux:source.lastFlux&&typeof source.lastFlux==='object'?Object.fromEntries(Object.entries(source.lastFlux).filter(([key,v])=>/^[a-zA-Z][a-zA-Z0-9]*$/.test(key)&&Number.isFinite(v)).slice(0,40)):null,
 trace:Array.isArray(source.trace)?source.trace.filter(row=>row&&Number.isFinite(row.day)).slice(-40).map(row=>({day:row.day,oxygen:ecoFinite(row.oxygen),no2:ecoFinite(row.no2),co2:ecoFinite(row.co2)})):[]};
}
export function feedingProfile(s){
 if(s.category==='plant')return {roles:['Produzent'],resources:[]};
 if(s.category==='decor')return {roles:['Struktur'],resources:[]};
 if(s.category==='coral')return {roles:['Konsument','Symbiose mit Produzenten'],resources:['plankton']};
 if(s.id==='assassin'||s.behavior==='snailpredator')return {roles:['Sekundärkonsument'],resources:['snailPrey']};
 if(s.behavior==='predator')return {roles:['Sekundär-/weitere Konsumenten'],resources:['animalPrey']};
 if(s.behavior==='specialist')return {roles:['Sekundärkonsument'],resources:['microfauna'],specialist:true};
 if(s.shape==='clam'||s.id==='bambooshrimp')return {roles:['Primär-/Sekundärkonsument'],resources:['plankton']};
 if(s.behavior==='grazer'||['nerite','trochus','cerith','urchin'].includes(s.id))return {roles:['Primärkonsument'],resources:['algae','biofilm']};
 if(['snail','shrimp','crab'].includes(s.shape))return {roles:['Primär-/Sekundärkonsument','Detrituskonsument'],resources:['biofilm','detritus','algae']};
 return {roles:['Primär-/Sekundärkonsument'],resources:['guppy','molly','platy','endler','goldfish'].includes(s.id)?['algae','microfauna']:['microfauna']};
}
export function modeledPrey(state,predator,types){const s=types[predator.species];return state.entities.filter(e=>!e.dead&&e.uid!==predator.uid&&['fish','invert'].includes(types[e.species]?.category)&&(s.id==='assassin'||s.behavior==='snailpredator'?types[e.species].shape==='snail'&&e.species!==predator.species:s.behavior==='predator'&&(types[e.species].size<s.size*.38||e.age<5)))}
export function externalFoodScore(s,type){
 if(!type||s.behavior==='specialist')return 0;
 if(s.id==='assassin'||s.behavior==='snailpredator')return ['protein','bottom'].includes(type)?.85:.15;
 if(s.category==='coral'||s.shape==='clam'||s.id==='bambooshrimp')return type==='plankton'?1:.15;
 if(s.behavior==='predator')return type==='protein'?1:type==='herbivore'?.15:.65;
 if(s.behavior==='grazer')return type==='herbivore'?1:type==='protein'?.2:.65;
 return ['flakes','granules','protein','bottom','herbivore'].includes(type)?1:.5;
}
export function foodSupply(state,entity,types){
 const s=types[entity.species],profile=feedingProfile(s),e=normalizeEcology(state.ecology,state),ration=state.autoFeed?state.feedRate:state.feedReserve;
 const external=ecoClamp(Math.max(0,ecoFinite(ration))/.5)*externalFoodScore(s,state.foodType);
 const available={algae:ecoClamp(state.algae/.12),biofilm:ecoClamp(e.heterotrophs/.35),detritus:ecoClamp(state.detritus/.35),microfauna:ecoClamp(state.day/40)*ecoClamp(e.microfauna/.25),plankton:ecoClamp(e.plankton/.2)*ecoClamp(state.flow/30),snailPrey:modeledPrey(state,entity,types).length?1:0,animalPrey:modeledPrey(state,entity,types).length?1:0};
 let natural=Math.max(0,...profile.resources.map(key=>available[key]||0));if(profile.specialist&&state.day<40)natural*=.5;
 return {score:Math.max(external,natural),external,natural,available,profile};
}
export function candidateSuitability(state,s,gap){
 if(!s||s.category==='decor')return {suitable:false,supplies:false,problems:['Wähle einen Organismus.']};
 const problems=[];if(s.water!=='both'&&s.water!==state.water)problems.push('Die Wasserart passt nicht.');if(s.minL>state.liters)problems.push('Die Mindestbeckengröße wird unterschritten.');
 for(const [key,range,label] of [['temp',s.temp,'Temperatur'],['ph',s.ph,'pH'],['gh',state.water==='fresh'?s.gh:null,'Gesamthärte'],['salinity',s.salinity,'Salzgehalt']])if(range&&(state.params[key]<range[0]||state.params[key]>range[1]))problems.push(label+' liegt außerhalb des Artbereichs.');
 const suitable=!problems.length;if(s.group>1)problems.push('Gruppenbedarf: mindestens '+s.group+' Exemplare beachten.');
 const supplies=gap?.resource==='snailPrey'?s.shape==='snail'&&s.id!==gap.consumer:gap?.resource==='animalPrey'?['fish','invert'].includes(s.category)&&s.size<gap.predatorSize*.38:false;
 return {suitable,supplies,problems};
}
const ecoResources={algae:['Algenaufwuchs',['Produzent']],biofilm:['Heterotropher Biofilm',['Destruenten','Nahrungsressource']],detritus:['Organische Reste',['Detritus']],microfauna:['Lebende Kleinsttiere',['Mikrokonsumenten']],plankton:['Schwebende Kleinstnahrung',['Nahrungsressource']],external:['Zugeführtes Futter',['Externer Eintrag']]};
export function buildFoodWeb(state,types){
 const nodes=[],edges=[],gaps=[],groups=new Map();
 for(const entity of state.entities)if(!entity.dead&&types[entity.species]?.category!=='decor'){const group=groups.get(entity.species)||[];group.push(entity);groups.set(entity.species,group)}
 const resource=key=>{if(!nodes.some(n=>n.id===key))nodes.push({id:key,name:ecoResources[key][0],roles:ecoResources[key][1],resource:true})};
 const edge=(from,to,label,kind='feeding')=>{if(!edges.some(e=>e.from===from&&e.to===to&&e.kind===kind))edges.push({from,to,label,kind})};
 for(const [id,entities] of groups)nodes.push({id,name:types[id].name,species:id,count:entities.length,roles:feedingProfile(types[id]).roles});
 for(const [id,entities] of groups){const s=types[id];if(s.category==='plant'){resource('detritus');edge(id,'detritus','Reste beim Absterben','detrital');continue}
 const supply=foodSupply(state,entities[0],types);if(supply.external>=.35){resource('external');edge('external',id,'Passendes Futter')}
 for(const key of supply.profile.resources)if(['snailPrey','animalPrey'].includes(key)){for(const prey of modeledPrey(state,entities[0],types))edge(prey.species,id,'Mögliche Beute im aktuellen Besatz')}else if(supply.available[key]>.08){resource(key);edge(key,id,'Nahrungsressource im Modell')}
 if(supply.score<.35&&['fish','invert'].includes(s.category)){const gap={id:'gap-'+id,consumer:id,name:s.name,resource:supply.profile.resources[0],predatorSize:s.size||0,hints:['Eine Ernährungsabhängigkeit ist schwach gedeckt. Welche Ressourcen kann dieser Organismus tatsächlich nutzen?','Vergleiche Ernährungsweisen, Körpergrößen und Wasseransprüche. Prüfe auch passende Fütterung, Reifung und Strömung.','Prüfe eine einzelne Maßnahme und beobachte Ressourcen, Gesundheit und Wasserwerte über mehrere Tage.']};gaps.push(gap);nodes.push({id:gap.id,name:'?',roles:['Abhängigkeit prüfen'],gap:true,consumer:id});edge(gap.id,id,'Versorgung untersuchen','gap')}
 }
 resource('detritus');resource('biofilm');edge('detritus','biofilm','Zersetzung organischer Substanz','microbial');
 const ecology=normalizeEcology(state.ecology,state);if(ecology.microfauna>.01){resource('microfauna');edge('biofilm','microfauna','Mikrobielle Nahrung')}
 for(const [id,name,value] of [['ammonium-oxidizers','Ammoniumoxidierer',state.bacteria],['nitrite-oxidizers','Nitritoxidierer',state.bacteria2]])if(value>0)nodes.push({id,name,roles:['Chemolithoautotrophe Mikroben'],resource:true});
 return {nodes,edges,gaps,convention:'Nahrungspfeile zeigen von der Nahrung zum Konsumenten. Gestrichelte Linien markieren Restwege oder eine zu untersuchende Abhängigkeit. Mögliche Beute ist kein Nachweis eines beobachteten Fraßvorgangs.'};
}
export function environmentFactors(state,types){return [['temp','Temperatur','°C'],['ph','pH',''],['oxygen','Sauerstoff','mg/L'],['co2','CO₂','mg/L'],['nh4','Ammonium','mg NH₄/L'],['no2','Nitrit','mg NO₂/L'],['no3','Nitrat','mg NO₃/L']].map(([key,label,unit])=>({key,label,unit,value:state.params[key],affected:state.entities.filter(e=>!e.dead&&types[e.species]?.[key]&&(state.params[key]<types[e.species][key][0]||state.params[key]>types[e.species][key][1])).length}))}
export function recordEcologyStep(state,dt,flux){const e=state.ecology=normalizeEcology(state.ecology,state);e.lastFlux={day:state.day,dt,...Object.fromEntries(Object.entries(flux).filter(([,v])=>Number.isFinite(v)))};e.trace.push({day:state.day,oxygen:state.params.oxygen,no2:state.params.no2,co2:state.params.co2});e.trace=e.trace.slice(-40)}
