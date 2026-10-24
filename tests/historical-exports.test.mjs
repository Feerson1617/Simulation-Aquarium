import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateLearningProduct,measurementCSV,comparisonCSV} from '../learning-model.mjs';
import {manualEvidence} from '../learning-product-display.mjs';
function records(csv){const rows=csv.split('\r\n').map(line=>[...line.matchAll(/"((?:[^"]|"")*)"(?:;|$)/g)].map(m=>m[1].replaceAll('""','"')));return rows.slice(1).map(row=>Object.fromEntries(rows[0].map((name,i)=>[name,row[i]])));}
test('unchanged V1 products export every recorded manual value and historical origin',()=>{
 for(const grade of [8,9]){
  const raw=JSON.parse(readFileSync(new URL(`./fixtures/learning-v1-grade-${grade}.json`,import.meta.url))),before=structuredClone(raw),p=validateLearningProduct(raw);
  const rows=records(measurementCSV(p.measurements,{profile:p.profile,metrics:p.measurementMetrics,modelVersion:p.modelVersion}));
  assert.equal(rows.length,p.measurements.length*p.measurementMetrics.length);
  for(const row of rows){
   const key=row.Messschluessel,source=p.measurements.find(s=>String(s.day)===row.Messzeit);
   assert.equal(row.Klasse,String(grade));assert.equal(row.Modellstand,'Altbestand – nicht dokumentiert');assert.equal(row.Dauereinheit,'Modelltage');assert.equal(row.Seite,'Eigenes Becken');
   if(key==='fishAlive'){assert.equal(row.Wert,'');assert.equal(row.Wertstatus,'historisch unbekannt');assert.equal(row.Einheit,'historisch unbekannt');assert.equal(manualEvidence(p,key).rows[0][key],null);}
   else{assert.equal(Number(row.Wert),source[key]);assert.equal(row.Wertstatus,'berechnet');}
   if(key==='oxygen')assert.equal(row.Einheit,'mg/L');
   if(key==='health')assert.match(row.Messgroesse,/historischer Wert: Fische und Wirbellose/);
  }
  assert.deepEqual(raw,before);assert(rows.every(row=>row.Wert!=='undefined'));
  const comparison=records(comparisonCSV(p.comparison));assert(comparison.length>0);assert(comparison.every(row=>row.Einheit&&row.Messzeit!==undefined));
 }
});
test('CSV keeps actual zero, unavailable data, and ambiguous old values distinct, including mixed series',()=>{
 const samples=[{day:1,oxygen:0,fishAlive:0,metrics:['oxygen','fishAlive']},{day:2,oxygen:0,fishAlive:0,metricsVersion:2,metrics:['oxygen','fishAlive']},{day:3,oxygen:7,fishAlive:3,metricsVersion:2,metrics:['fishAlive']}];
 const copy=structuredClone(samples),keys=['oxygen','fishAlive','missing-definition'];
 const rows=records(measurementCSV(samples,{profile:{grade:8,mode:'free'},metrics:keys,modelVersion:'recorded-model'}));
 const row=(time,key)=>rows.find(r=>r.Messzeit===String(time)&&r.Messschluessel===key);
 assert.equal(row(1,'oxygen').Wert,'0');assert.equal(row(2,'fishAlive').Wert,'0');assert.equal(row(2,'fishAlive').Wertstatus,'berechnet');
 assert.equal(row(1,'fishAlive').Wert,'');assert.equal(row(1,'fishAlive').Wertstatus,'historisch unbekannt');
 assert.equal(row(3,'oxygen').Wert,'');assert.equal(row(3,'oxygen').Wertstatus,'nicht freigegeben');
 assert(rows.filter(r=>r.Messschluessel==='missing-definition').every(r=>r.Wert===''&&r.Wertstatus==='historisch unbekannt'));
 const view=manualEvidence({measurements:samples,measurementMetrics:keys},'fishAlive');assert.deepEqual(view.rows.map(r=>r.fishAlive),[null,0,3]);assert.deepEqual(samples,copy);
});
