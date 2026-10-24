import {parse} from '/workspace/aquarium-devtools/source-analysis/node_modules/acorn/dist/acorn.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const basis='a7ee966a3116faf4a231050718dc899fc1eea3fb',allowed=['results','runTables'];
const old=execFileSync('git',['show',basis+':learning-ui.mjs'],{encoding:'utf8'}),current=readFileSync('learning-ui.mjs','utf8');
const sha=x=>createHash('sha256').update(x).digest('hex');
function snippets(source){const found={};function visit(n){if(!n||typeof n!=='object')return;if(n.type==='FunctionDeclaration'&&allowed.includes(n.id?.name))found[n.id.name]={start:n.start,end:n.end,text:source.slice(n.start,n.end)};for(const v of Object.values(n))if(v&&typeof v==='object')Array.isArray(v)?v.forEach(visit):visit(v)}visit(parse(source,{sourceType:'module',ecmaVersion:'latest'}));if(Object.keys(found).length!==2)throw Error('Unexpected function count');return found}
function masked(source,found){for(const f of Object.values(found).sort((a,b)=>b.start-a.start))source=source.slice(0,f.start)+'/* scoped technical view function */'+source.slice(f.end);return source}
const before=snippets(old),after=snippets(current);
const report={basis,head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),file:'learning-ui.mjs',sourceSha256:sha(current),changedFunctions:allowed,allOtherSourceBytesUnchanged:masked(old,before)===masked(current,after),functions:Object.fromEntries(allowed.map(k=>[k,{before:sha(before[k].text),after:sha(after[k].text)}]))};
writeFileSync('docs/coherent-learning/evidence/expert-source-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));if(!report.allOtherSourceBytesUnchanged)process.exit(1);
