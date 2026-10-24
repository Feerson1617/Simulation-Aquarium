import {comparisonMetricDefinitions, measurementEvidence} from './learning-model.mjs';

/** Read-only display projection. Never infer old fish measurements from totals. */
export function manualEvidence(item, selected) {
  const rows=item.measurements||[], keys=item.measurementMetrics||[];
  const defs=comparisonMetricDefinitions({kind:'manual',runs:[{control:rows,test:[]}]});
  const labels=Object.fromEntries(keys.map(k=>[k,measurementEvidence(defs,k).definition]));
  const key=keys.includes(selected)?selected:keys[0];
  const filtered=rows.map(row=>({...row,[key]:measurementEvidence(defs,key,row).value}));
  return {keys,key,labels,rows:filtered,unknown:!defs[key]};
}
