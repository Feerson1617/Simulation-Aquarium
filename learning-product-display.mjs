import {comparisonMetricDefinitions, LEARNING_METRICS} from './learning-model.mjs';

/** Read-only display projection. Never infer old fish measurements from totals. */
export function manualEvidence(item, selected) {
  const rows=item.measurements||[], keys=item.measurementMetrics||[];
  const defs=comparisonMetricDefinitions({kind:'manual',runs:[{control:rows,test:[]}]});
  const labels=Object.fromEntries(keys.map(k=>[k,defs[k]||[LEARNING_METRICS[k]?.[0]||k,'historisch unbekannt']]));
  const key=keys.includes(selected)?selected:keys[0];
  const filtered=rows.map(row=>({...row,[key]:!defs[key] || (row.metrics&&!row.metrics.includes(key)) || !Number.isFinite(row[key]) ? null : row[key]}));
  return {keys,key,labels,rows:filtered,unknown:!defs[key]};
}
