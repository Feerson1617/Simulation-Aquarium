"""Real learner actions for the corrected biological objectives; never writes quest state."""
from playwright.sync_api import expect

EXPECTED_ACTIONS={
 '8-ecosystem':{'living','water'},'8-oxygen':set(),'8-foodweb':{'food-fish','rest-decomposer','consumer','producer','matter-energy'},
 '8-health':{'fish-water','survival'},'8-forest':{'forest-same','forest-different'},'9-traits':{'visible-traits'},'9-mendel':{'mendel-probability'},
 '9-population':set(),'9-darwin':{'darwin-prediction','lamarck-prediction','fossil-evidence'},'10-enrichment':{'oxygen-too'},
 '10-carbon':{'carbon-uptake','carbon-return','fossil-carbon'},'10-restore':{'early','late'},'10-northsea':{'river-route','river-measure','river-reason'},
 '10-wadden':{'harbour-interest','harbour-benefit','harbour-effort','harbour-followup'}}
def snap(p):return p.evaluate('window.aquariumLearningSnapshot()')
def action(p,name,touch=False):
 loc=p.locator(f'[data-learn="{name}"]').filter(visible=True).first
 if not loc.count() and name=='home':action(p,'more',touch);loc=p.locator('[data-learn="home"]').filter(visible=True).first
 loc.tap() if touch else loc.click()
def reveal(field):
 for _ in range(6):
  if field.is_visible():return field
  changed=False
  for detail in field.locator('xpath=ancestor::details').all():
   summary=detail.locator('summary').first
   if detail.get_attribute('open') is None and summary.is_visible():summary.click();changed=True
  if not changed:break
 expect(field).to_be_visible();return field

def activities(p,touch=False):
 for _ in range(12):
  cards=p.locator('[data-activity-id]:visible')
  if cards.count():
   id=cards.first.get_attribute('data-activity-id');index=1 if id=='water' else 0
   # The temperature prototype requires observing the actual object first.
   if id=='living' and p.locator('[data-coherent-pick]').count():
    loc=p.locator('[data-coherent-pick="control"]');loc.tap() if touch else loc.click()
   if id=='water' and p.locator('[data-coherent-water]').count():
    loc=p.locator('[data-coherent-water="test"]');loc.tap() if touch else loc.click()
   target=p.locator(f'[data-activity-id="{id}"][data-activity-choice="{index}"]:visible').first
   target.tap() if touch else target.click();continue
  views=p.locator('[data-activity-view]:visible')
  if not views.count():return
  name=views.first.get_attribute('data-activity-view')
  views.first.tap() if touch else views.first.click()
  if name=='traits':
   for uid in [1,3]:
    fish=p.locator(f'[data-learning-individual="{uid}"]');fish.tap() if touch else fish.click()
   action(p,'close',touch)
  elif name=='observe':action(p,'close',touch)
 raise AssertionError('Learner activity did not converge')

def comparison_answer(id,r):
 if id=='10-wadden' or id=='9-traits':return 0
 if id=='9-mendel':return 0 if r['dark']==1 else 1 if r['light']==1 else 2
 if id in ['8-health','10-restore']:
  a,b=r['fish']['control'],r['fish']['test']
  if a['fishAlive']!=b['fishAlive']:return 0 if a['fishAlive']>b['fishAlive'] else 1
  delta=(a['health'] or 0)-(b['health'] or 0);return 2 if abs(delta)<=1 else 0 if delta>0 else 1
 tolerance={'8-ecosystem':.1,'8-oxygen':.05,'8-foodweb':.01,'8-forest':.01,'10-enrichment':.005,'10-carbon':.1,'10-northsea':.005}.get(id,.5/(r.get('sampleSize') or 24))
 return 2 if abs(r['control']-r['test'])<=tolerance else 0 if r['control']>r['test'] else 1

def biological_experiment(p,id,touch=False):
 if id=='10-wadden':
  activities(p,touch);assert snap(p)['comparison'] is None;assert snap(p)['quest']['result']['kind']=='case';return
 if id=='9-traits':
  action(p,'material',touch);action(p,'genes',touch);r=snap(p)['quest']['result'];assert r['AA']>0 and r['Aa']>0;return
 if id=='9-mendel':
  action(p,'material',touch);action(p,'genes',touch)
  p.locator('[data-learning-mother]').select_option('1');p.locator('[data-learning-father]').select_option('6');action(p,'cross',touch)
  first=snap(p);assert first['quest']['step']==2;assert first['population']['generation']==1
  assert all(i['loci']['A']==['A','a'] for i in first['population']['individuals'])
  mother=next(i['uid'] for i in first['population']['individuals'] if i['sex']=='♀');father=next(i['uid'] for i in first['population']['individuals'] if i['sex']=='♂')
  p.locator('[data-learning-mother]').select_option(str(mother));p.locator('[data-learning-father]').select_option(str(father));action(p,'cross',touch)
  result=snap(p);assert result['population']['generation']==2;assert result['quest']['result']['mendel']['complete'];assert result['population']['events'][-1]['parents']==[mother,father]
  assert len(result['population']['individuals'])==24;return
 action(p,'investigate',touch)
 if id in ['9-population','9-darwin']:
  p.locator('[data-learning-environment]').select_option('neutral');p.locator('[data-learning-generations]').fill('1');reveal(p.locator('[data-learning-repetitions]')).fill('2');action(p,'population-compare',touch);assert snap(p)['quest']['step']==2
  p.locator('[data-learning-generations]').fill('5');action(p,'population-compare',touch);neutral=snap(p)['comparison'];assert snap(p)['quest']['step']==2
  for run in neutral['runs']:assert run['control']==run['test'];assert all(v==1 for e in run['archives']['test']['events'] for v in e['weights'].values())
  assert neutral['runs'][0]['seed']!=neutral['runs'][1]['seed']
  p.locator('[data-learning-environment]').select_option('light' if id=='9-population' else 'dark');action(p,'population-compare',touch);directed=snap(p)['comparison'];assert snap(p)['quest']['step']==3
  assert directed['configuration']['baseline']==neutral['configuration']['baseline'];assert any(v==.5 for run in directed['runs'] for e in run['archives']['test']['events'] for v in e['weights'].values())
  series=p.locator('[data-learning-series]');reveal(series).select_option('1');expect(p.locator('.learn-results')).to_contain_text('Keine Farbe hat hier einen Vorteil')
  reveal(p.locator('[data-learning-run]')).select_option('1');assert 'Gruppe' in p.locator('.learn-chart').get_attribute('aria-label')
  reveal(p.locator('[data-learning-series]')).select_option('2');return
 if id=='8-oxygen':
  reveal(p.locator('[data-learning-value]')).fill('8');action(p,'compare',touch);assert snap(p)['quest']['step']==2;reveal(p.locator('[data-learning-value]')).fill('0')
 if id=='10-restore':reveal(p.locator('[data-learning-days]')).fill('14')
 if id=='8-ecosystem':
  action(p,'device-temperature',touch);reveal(p.locator('[data-equipment-value]')).fill('27');p.locator('[data-equipment-save]').click();assert p.evaluate('document.activeElement.dataset.learn')=='device-temperature'
 action(p,'compare',touch)
 if id=='8-ecosystem':
  action(p,'workspace-play',touch);p.wait_for_function('window.aquariumLearningSnapshot().quest.step===3')
 c=snap(p)['comparison'];run=c['runs'][0];assert run['initialControl']==run['initialTest'];assert run['control'] and run['test']
 if id=='8-ecosystem':assert 25<run['finalTest']['params']['temp']<27;assert run['finalControl']['params']['temp']==25
 if id=='8-oxygen':
  actual=p.evaluate('s=>window.aquariumSimulationProbe(s,3)',run['initialControl']);assert actual['params']==run['finalControl']['params']
  trial=run['initialTest'];trial['hours']=0;actual=p.evaluate('s=>window.aquariumSimulationProbe(s,3)',trial);assert actual['params']==run['finalTest']['params']
