import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const {parse} = await import(process.env.AQUARIUM_ACORN_MODULE || '/workspace/aquarium-devtools/source-analysis/node_modules/acorn/dist/acorn.mjs');
const baseline='8e41962132fe3778fe73f8e14c650f42e18d848d',approved='d0c4b17096289c18efa63a8b93aa49205c4cb1bd';
const hash=s=>createHash('sha256').update(s).digest('hex');
function declarations(html,type){const s=html.split('<script type="module">')[1].split('</script>')[0];return new Map(parse(s,{ecmaVersion:'latest',sourceType:'module'}).body.filter(n=>n.type===type).map(n=>[n.id.name,s.slice(n.start,n.end)]));}
const current=readFileSync('index.html','utf8'),old=execFileSync('git',['show',baseline+':index.html'],{encoding:'utf8',maxBuffer:40e6}),prototype=execFileSync('git',['show',approved+':index.html'],{encoding:'utf8',maxBuffer:40e6});
const before=declarations(old,'FunctionDeclaration'),after=declarations(current,'FunctionDeclaration');
const changed=[...new Set([...before.keys(),...after.keys()])].filter(k=>before.get(k)!==after.get(k));
const protectedCore=Object.fromEntries(['hd','Qf','qs','tp'].map(k=>[k,{unchanged:before.get(k)===after.get(k),sha256:hash(after.get(k))}]));
const files=['AGENTS.md','genetics.mjs'];
const unchangedFiles=Object.fromEntries(files.map(p=>[p,{unchanged:execFileSync('git',['show',baseline+':'+p],{encoding:'utf8'})===readFileSync(p,'utf8'),sha256:hash(readFileSync(p))}]));
const report={baseline,approvedPrototype:approved,applicationHead:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),changedTopLevelFunctions:changed,protectedCore,unchangedFiles,
 rendererUnchangedSinceApproval:declarations(current,'ClassDeclaration').get('y1')===declarations(prototype,'ClassDeclaration').get('y1'),
 protectedPathDiff:execFileSync('git',['diff','--name-only',baseline,'--','AGENTS.md','assets','.github'],{encoding:'utf8'}).trim().split('\n').filter(Boolean),
 explanation:'Factory/loader only tag declared versus undocumented TAN basis; laboratory functions name the current basis. Biological stepping, warning selection, water exchange, original genetics, catalog assets and workflow rules are retained. Shared NH3 arithmetic is quantitatively checked in coherent_phase4.test.mjs.'};
writeFileSync('docs/coherent-learning/evidence/final/source-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
if(changed.some(name=>!["cd","ud","z1","Ec","sd"].includes(name))||Object.values(protectedCore).some(v=>!v.unchanged)||Object.values(unchangedFiles).some(v=>!v.unchanged)||!report.rendererUnchangedSinceApproval||report.protectedPathDiff.length)process.exit(1);
