import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateLearningProduct} from '../learning-model.mjs';
import {manualEvidence} from '../learning-product-display.mjs';

test('both untouched V1 products remain readable without inventing historical fish data',()=>{
 for(const grade of [8,9,8,9]) {
  const raw=JSON.parse(readFileSync(new URL(`./fixtures/learning-v1-grade-${grade}.json`,import.meta.url)));
  const original=structuredClone(raw),product=validateLearningProduct(raw);
  for(const key of product.measurementMetrics){
   const view=manualEvidence(product,key);
   assert.equal(view.key,key);assert.equal(typeof view.labels[key].join(' · '),'string');
   if(key==='fishAlive')assert(view.rows.every(r=>r.fishAlive===null));
  }
  assert.deepEqual(raw,original);
 }
});
test('missing definitions, real zero and unavailable measurements remain distinct',()=>{
 const item={measurementMetrics:['fishAlive','unrecorded','oxygen'],measurements:[{day:0,metricsVersion:2,fishAlive:0,oxygen:7,metrics:['fishAlive']},{day:1,metricsVersion:2,fishAlive:2,oxygen:8,metrics:['fishAlive','oxygen']}]};
 const original=structuredClone(item);
 assert.equal(manualEvidence(item,'fishAlive').rows[0].fishAlive,0);
 assert.deepEqual(manualEvidence(item,'oxygen').rows.map(r=>r.oxygen),[null,8]);
 assert(manualEvidence(item,'unrecorded').rows.every(r=>r.unrecorded===null));
 assert.deepEqual(item,original);
});
