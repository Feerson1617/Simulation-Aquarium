"""Replot the complete W01 matrix from committed OS-memory evidence.
Requires the free matplotlib package for SVG/PNG output, no application dependency.
Incomplete or failed matrix runs are refused rather than plotted as acceptance.
"""
import json,os
from pathlib import Path
os.environ['MPLCONFIGDIR']='/tmp/aquarium-matplotlib'
os.environ['XDG_CACHE_HOME']='/tmp/aquarium-cache'
Path('/tmp/aquarium-cache').mkdir(exist_ok=True)
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
root=Path(__file__).resolve().parents[1]
base=Path(os.environ.get('AQUARIUM_MEMORY_INPUT',str(root/'docs/release-v1/evidence')))
out=Path(os.environ.get('AQUARIUM_MEMORY_OUTPUT',str(base)));out.mkdir(parents=True,exist_ok=True)
rows=[]
for phase in ['before','after']:
 for p in sorted((base/phase).glob('*/report.json')):
  d=json.loads(p.read_text());assert d.get('status') in ['passed','blocked-policy'] and 'finished' in d, str(p)
  if d['status']=='passed':assert len(d['rounds'])==d['roundsPlanned']>=12 and d['finalAction']['restoredExactly'] and d['finalAction']['helpStillResponds']
  else:assert d['engine']=='chromium' and d['case']=='D'
  s=d['resources'];homes=[x for x in s if x['phase'].endswith('-home')]
  metric=lambda sample,role,key:sum(x[key] or 0 for x in sample['processes'] if x['role']==role)/1024**2
  row={'phase':phase,'engine':d['engine'],'version':d.get('version'),'case':d['case'],'status':d.get('status','running'),'rounds':len(d['rounds']),'browserPeakPssGiB':max(x['browserPssKiB'] for x in s)/1024**2,'contentPeakPssGiB':max(metric(x,'content','pssKiB') for x in s),'contentPeakPrivateGiB':max(metric(x,'content','privateKiB') for x in s),'driverPeakPssGiB':max(x['driverPssKiB'] for x in s)/1024**2,'minimumAvailableGiB':min(x['availableKiB'] for x in s)/1024**2,'maximumSystemSwapGiB':max(x['swapUsedKiB'] for x in s)/1024**2,'minimumDiskFreeGiB':min(x['diskFreeBytes'] for x in s)/1024**3,'homeSeries':[{'round':int(x['phase'].split('-')[1]),'browserPssGiB':x['browserPssKiB']/1024**2,'contentPssGiB':metric(x,'content','pssKiB')} for x in homes],'finalAction':d.get('finalAction'),'failure':d.get('failure')}
  rows.append(row)
assert {(r['phase'],r['engine'],r['case']) for r in rows}=={(p,e,c) for p in ['before','after'] for e in ['webkit','chromium'] for c in 'ABCD'}
(out/'memory-summary.json').write_text(json.dumps(rows,indent=2)+'\n')
fig,axes=plt.subplots(1,2,figsize=(12,5),sharey=True)
colors={'A':'#1c6b63','B':'#a25e08','C':'#ab364b','D':'#4c57a6'}
for ax,engine in zip(axes,['webkit','chromium']):
 for row in rows:
  if row['engine']!=engine or not row['homeSeries']:continue
  ax.plot([x['round'] for x in row['homeSeries']],[x['browserPssGiB'] for x in row['homeSeries']],label=row['case']+(' vorher' if row['phase']=='before' else ' nachher'),color=colors[row['case']],linestyle='--' if row['phase']=='before' else '-',marker='o',markersize=3)
 ax.set_title('WebKit 26.5' if engine=='webkit' else 'Chromium 154');ax.set_ylim(bottom=0);ax.set_xlabel('Abgeschlossene Runde (Mission → Auswahl)');ax.grid(alpha=.2);ax.legend(fontsize=8,ncol=2)
axes[0].set_ylabel('Browserprozesse zusammen: PSS [GiB]')
fig.suptitle('W01 · Jeweils ein Browser · 768 × 1024 · Grafikprofil iPad')
fig.text(.5,.01,'A öffentliche Website · B HTML/HTTP online · C HTML/HTTP danach offline · D file: (Chromium durch Richtlinie gesperrt)',ha='center',fontsize=8)
fig.tight_layout(rect=(0,.05,1,.94));fig.savefig(out/'memory-comparison.svg');fig.savefig(out/'memory-comparison.png',dpi=140);plt.close(fig)
print(json.dumps([{k:v for k,v in r.items() if k not in ['homeSeries','finalAction']} for r in rows],indent=2))
