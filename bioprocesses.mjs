import { normalizeEcology, feedingProfile } from './ecology.mjs';
const bioClamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
/** Growth needs actual energy-yielding oxidation, never elapsed time alone. Flux already includes dt. */
export function advanceNitrifiers(state,dt,flux){
 const decay=state.params.oxygen<2?.09:.003;
 state.bacteria=bioClamp(state.bacteria+.3*Math.max(0,flux.ammoniaOxidation)*(1-state.bacteria)-decay*state.bacteria*dt);
 state.bacteria2=bioClamp(state.bacteria2+.2*Math.max(0,flux.nitriteOxidation)*(1-state.bacteria2)-decay*state.bacteria2*dt);
}
/** TAN production is mg NH4 equivalents/L. Organic source pools and yields are game calibration. */
export function decomposeOrganic(state,dt){const e=state.ecology=normalizeEcology(state.ecology,state),p=state.params,oxygen=bioClamp(p.oxygen/4),temperature=bioClamp(2**((p.temp-25)/10),.25,2);
 const potential=state.detritus*(1-Math.exp(-(.06+.26*e.heterotrophs)*temperature*oxygen*dt)),amount=Math.max(0,Math.min(potential,p.oxygen*state.liters/18));state.detritus=Math.max(0,state.detritus-amount);
 const mineralization=amount*20/state.liters,oxygenDemand=amount*18/state.liters;p.nh4+=mineralization;p.po4+=amount*.88/state.liters;p.oxygen=Math.max(0,p.oxygen-oxygenDemand);e.heterotrophs=bioClamp(e.heterotrophs+(.18*bioClamp(state.detritus/.5)*oxygen*(1-e.heterotrophs)-.025*e.heterotrophs)*dt);
 return {decomposition:amount,mineralization,decomposerOxygen:oxygenDemand,decomposerCO2:oxygenDemand*44/32};}
/** TAN: mg NH4 equivalents/L; nitrite/nitrate: mg NO2/NO3 per L; oxygen: mg O2/L. Conserves N. */
export function oxidizeNitrogen(p,{ammoniaCapacity,nitriteCapacity}){const nh4=Math.max(0,Math.min(p.nh4,ammoniaCapacity,p.oxygen/(48/18)));p.nh4=Math.max(0,p.nh4-nh4);p.no2+=nh4*46/18;p.oxygen=Math.max(0,p.oxygen-nh4*48/18);const no2=Math.max(0,Math.min(p.no2,nitriteCapacity,p.oxygen/(16/46)));p.no2=Math.max(0,p.no2-no2);p.no3+=no2*62/46;p.oxygen=Math.max(0,p.oxygen-no2*16/46);return {ammoniaOxidation:nh4,nitriteOxidation:no2,nitrificationOxygen:nh4*48/18+no2*16/46}}
export function advanceMicrofood(state,dt,types){const e=state.ecology=normalizeEcology(state.ecology,state),p=state.params,animals=state.entities.filter(a=>!a.dead&&['fish','invert'].includes(types[a.species]?.category)),demand=key=>animals.filter(a=>feedingProfile(types[a.species]).resources.includes(key)).length/Math.max(30,state.liters),oxygen=bioClamp(p.oxygen/5),resources=bioClamp(e.heterotrophs+state.algae);
 e.microfauna=bioClamp(e.microfauna+(.045*resources*oxygen*(1-e.microfauna)-(.012+demand('microfauna')*.6)*e.microfauna)*dt);e.plankton=bioClamp(e.plankton+(.035*(state.algae+state.detritus*.2)*oxygen*(1-e.plankton)-(.025+demand('plankton')*.8)*e.plankton)*dt);e.heterotrophs=bioClamp(e.heterotrophs-demand('biofilm')*.08*e.heterotrophs*dt);
 const nitrate=Math.max(0,Math.min(p.no3,.12*bioClamp((1.5-p.oxygen)/1.5)*bioClamp(state.detritus/.5)*dt));p.no3=Math.max(0,p.no3-nitrate);state.detritus=Math.max(0,state.detritus-nitrate*state.liters/100);const nitrogen=nitrate*14/62;e.nitrogenGas+=nitrogen;return {denitrification:nitrogen};}
/** Relative algal biomass: bounded uptake, grazing and organic turnover. Rates are model calibration. */
export function advanceAlgae(state,{potentialGrowth,grazers,plantBiomass,dt}){
 const p=state.params,old=bioClamp(state.algae),growth=Math.max(0,Math.min(potentialGrowth*(1-old),p.no3/1.8,p.po4/.08,p.co2/2));
 const available=old+growth,grazed=Math.min(available,Math.max(0,grazers*.0015*dt+plantBiomass*.0007*dt)),decayed=Math.min(available-grazed,old*(1-Math.exp(-.035*(1+bioClamp((3-p.oxygen)/3))*dt)));
 state.algae=bioClamp(available-grazed-decayed);p.no3=Math.max(0,p.no3-growth*1.8);p.po4=Math.max(0,p.po4-growth*.08);p.co2=Math.max(0,p.co2-growth*2);
 state.detritus+=decayed*state.liters/20;
 return{algaeGrowth:growth,algaeGrazing:grazed,algaeDecay:decayed,algaePhotosynthesis:growth*.6,algaeCO2Uptake:growth*2};
}
/** Existing relative growth costs, bounded by actual dissolved resources. No physical biomass claim. */
export function limitPlantGrowth(potential,p){return Math.max(0,Math.min(potential,p.no3/1.45,p.po4/.025,p.fe/.008,p.co2/4))}
