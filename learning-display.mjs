/** Presentation projection only. Original samples and archived states remain untouched. */
export function relativePlantComparison(comparison) {
 return {...comparison,displayProjection:'plant-initial-one',runs:comparison.runs.map(run=>{
  const beginning=run.control[0]?.plantBiomass;
  const rows=values=>values.map(sample=>({...sample,plantBiomass:beginning>0 && Number.isFinite(sample.plantBiomass) ? sample.plantBiomass/beginning : null}));
  return {...run,control:rows(run.control),test:rows(run.test)};
 })};
}
export function learnerPrecision(metric) {
 return ['n','AA','Aa','aa','fishAlive','fishDead','otherAnimals','individuals','loadLevel'].includes(metric) ? 0 : metric === 'temp' ? 1 : 2;
}
export function learnerCSVComparison(comparison) {
 const view=relativePlantComparison(comparison);
 if(comparison.kind==='population')return comparison;
 return {...view,runs:view.runs.map(run=>({...run,...Object.fromEntries(['control','test'].map(side=>[side,run[side].map(sample=>Object.fromEntries(Object.entries(sample).map(([key,value])=>[key,Number.isFinite(value) && key!=='day' ? Number(value.toFixed(learnerPrecision(key))) : value])))]))}))};
}
