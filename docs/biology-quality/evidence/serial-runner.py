import subprocess,os,json,hashlib,time,sys
from pathlib import Path
from datetime import datetime,timezone
root=Path('/workspace/Simulation-Aquarium');out=Path(os.environ.get('AQUARIUM_BIOLOGY_RUN','/tmp/biology-quality-validation'));out.mkdir(parents=True,exist_ok=True)
def fingerprint():return {p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(root.iterdir()) if p.suffix in ['.html','.mjs','.css']}
source=fingerprint();commit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip();report={'commit':commit,'started':datetime.now(timezone.utc).isoformat(),'fingerprints':source,'suites':[],'status':'running'}
def write():(out/'status.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
suites=[('modules',['node','--test',*[str(p.relative_to(root)) for p in sorted((root/'tests').glob('*.test.mjs'))]],{}),('biology',['python3','tests/biology_quality_browser.py'],{'AQUARIUM_BIOLOGY_RESULTS':str(out/'biology')}),('quests',['python3','tests/quest_browser.py'],{'AQUARIUM_QUEST_RESULTS':str(out/'quests')}),('devices',['python3','tests/device_controls_browser.py'],{'AQUARIUM_DEVICE_RESULTS':str(out/'devices')}),('review',['python3','tests/learning_review_browser.py'],{'AQUARIUM_REVIEW_RESULTS':str(out/'review')}),('readiness',['python3','tests/readiness_browser.py'],{'AQUARIUM_READINESS_RESULTS':str(out/'readiness')}),('placement',['python3','tests/aquascaping_browser.py'],{'AQUARIUM_TEST_RESULTS':str(out/'placement')}),('standalone',['python3','tests/standalone_browser.py'],{})]
if os.environ.get('AQUARIUM_BIOLOGY_SUITES'):suites=[s for s in suites if s[0] in os.environ['AQUARIUM_BIOLOGY_SUITES'].split(',')]
for name,command,extra in suites:
 assert fingerprint()==source,'Runtime changed during validation';start=time.monotonic();record={'name':name,'command':command,'commit':commit,'status':'running','started':datetime.now(timezone.utc).isoformat()};report['suites'].append(record);write();print('START',name,flush=True)
 with (out/f'{name}.log').open('w') as log:result=subprocess.run(command,cwd=root,env={**os.environ,'AQUARIUM_CHROMIUM':'/usr/bin/chromium',**extra},stdout=log,stderr=subprocess.STDOUT)
 record.update(status='passed' if result.returncode==0 else 'failed',exit_code=result.returncode,seconds=round(time.monotonic()-start,2));write();print(record,flush=True)
 if result.returncode:report['status']='failed';write();print((out/f'{name}.log').read_text()[-5000:],flush=True);sys.exit(result.returncode)
assert fingerprint()==source;report.update(status='passed',finished=datetime.now(timezone.utc).isoformat());write();print('ALL SELECTED SUITES PASSED',out,flush=True)
