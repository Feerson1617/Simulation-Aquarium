/** TAN is NH4+ + NH3, stored as mg NH4 equivalents/L (18 mg per mmol N).
 * It is neither mg N/L nor the concentration of ionic NH4+ alone.
 * Old payloads retain an explicitly undocumented basis; values are never rescaled.
 */
export const AMMONIA_POOL_BASIS='tan-nh4-equivalent-v1';
export function ammoniaPoolContract(raw) {
 return raw?.version===1 && raw.ammoniaPool===AMMONIA_POOL_BASIS ? {version:1,ammoniaPool:AMMONIA_POOL_BASIS} : {version:0,ammoniaPool:'legacy-undocumented'};
}
export const newAmmoniaPoolContract=()=>({version:1,ammoniaPool:AMMONIA_POOL_BASIS});
export function ammoniaPartition(params) {
 const pKa=.09018+2729.92/(params.temp+273.15);
 const fraction=1/(1+10**(pKa-params.ph));
 const total=Math.max(0,params.nh4);
 return {pKa,fraction,totalEquivalent:total,ammonium:total*(1-fraction),ammonia:total*fraction*17/18,nitrogen:total*14/18};
}
export function ammoniaPoolLabel(chemistry) {
 return chemistry?.ammoniaPool===AMMONIA_POOL_BASIS ? {name:'Gesamtammonium / Ammoniak',symbol:'TAN',unit:'mg NH₄-Äquivalent/L',help:'Gesamtpool aus Ammonium und Ammoniak (TAN), ausgedrückt als NH₄-Äquivalent. Keine Messung nur des ionischen NH₄⁺. Höherer pH und höhere Temperatur erhöhen den freien NH₃-Anteil.'} : {name:'Früherer Ammonium-Modellwert',symbol:'NH₄ (alt)',unit:'alte, nicht dokumentierte Basis',help:'Die ursprüngliche Einheit dieses alten Modellwerts wurde nicht gespeichert. Die Zahl bleibt erhalten; die laufende Simulation verwendet ihre bisherige Modellannahme.'};
}
