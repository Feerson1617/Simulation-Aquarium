import {parse} from '/workspace/aquarium-devtools/source-analysis/node_modules/acorn/dist/acorn.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const base='8e41962132fe3778fe73f8e14c650f42e18d848d';
const hash=x=>createHash('sha256').update(x).digest('hex');
function source(html){return html.split('<script type="module">')[1].split('</script>')[0]}
function functions(html){let text=source(html),ast=parse(text,{ecmaVersion:'latest',sourceType:'module'});let out=new Map();for(const n of ast.body)if(n.type==='FunctionDeclaration')out.set(n.id.name,text.slice(n.start,n.end));return out}
const before=functions(execFileSync('git',['show',base+':index.html'],{maxBuffer:40e6,encoding:'utf8'}));
const after=functions(readFileSync('index.html','utf8'));const changed=[...new Set([...before.keys(),...after.keys()])].filter(k=>before.get(k)!==after.get(k));
const protectedNames=['hd','Qf','qs','tp','z1','ud','cd'];
const report={baseline:base,head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),changedTopLevelFunctions:changed,
 protectedCore:Object.fromEntries(protectedNames.map(k=>[k,{unchanged:before.get(k)===after.get(k),sha256:hash(after.get(k)||'')}]))};
writeFileSync('docs/coherent-learning/evidence/source-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));if(changed.length||protectedNames.some(k=>!report.protectedCore[k].unchanged))process.exit(1);
