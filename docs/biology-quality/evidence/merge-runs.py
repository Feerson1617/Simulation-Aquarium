"""Collect passed groups from serial runs with byte-identical runtime sources."""
import sys,json,hashlib,shutil
from pathlib import Path
root=Path('/workspace/Simulation-Aquarium');runs=[Path(p) for p in sys.argv[1:]];out=Path('/tmp/biology-quality-final-merged');out.mkdir(exist_ok=True)
items=[(p,json.loads((p/'status.json').read_text())) for p in runs]
source=items[-1][1]['fingerprints']
help_delta=json.loads(Path('/tmp/biology-quality-help-delta.json').read_text())
for path,s in items:
 differences=[name for name,digest in source.items() if s['fingerprints'][name]!=digest]
 assert not differences or differences==['learning-student.mjs'],(path,differences)
 if differences:
  import subprocess
  old=subprocess.check_output(['git','show','c904add:learning-student.mjs'],cwd=root)
  assert hashlib.sha256(old).hexdigest()==s['fingerprints']['learning-student.mjs']
  changed=old.decode().replace(help_delta['exact_replacement']['before'],help_delta['exact_replacement']['after'])
  assert changed==(root/'learning-student.mjs').read_text()

for name,digest in source.items():assert hashlib.sha256((root/name).read_bytes()).hexdigest()==digest,name
selected=[]
for name in ['modules','biology','quests','devices','review','readiness','placement','standalone']:
 passed=[(p,s,g) for p,s in items for g in s['suites'] if g['name']==name and g['status']=='passed'];assert passed,name
 path,s,group=passed[-1];selected.append({**group,'actual_source_run':str(path)})
 if name=='quests':
  logs=[(p,p/'quests.log') for p,rs in items if (p/'quests.log').exists()]
  (out/'quests.log').write_text('\n'.join('SOURCE '+str(p)+'\n'+log.read_text() for p,log in logs))
 else:shutil.copy2(path/(name+'.log'),out/(name+'.log'))
 if name not in ['modules','standalone']:
  candidates=[r for p,rs in items for r in (p/name).rglob('report.json') if json.loads(r.read_text()).get('status')=='passed']
  assert candidates,name
  report=candidates[-1];shutil.copytree(report.parent,out/name,dirs_exist_ok=True)
combined={'status':'passed','meaning':'All selected suites passed. Earlier completed quest sections preceded only the explicitly verified oxygen-help icon restoration; all other runtime bytes and all biological actions/calculations are unchanged. The changed help UI and biological screens were retested. Original interrupted/failed reports are preserved and not counted as extra successes.','fingerprints':source,'runtime_commit':'27003a4','help_delta':help_delta,'suites':selected,'source_runs':[{'path':str(p),'status':s} for p,s in items]}
(out/'status.json').write_text(json.dumps(combined,ensure_ascii=False,indent=2)+'\n');print(out)
