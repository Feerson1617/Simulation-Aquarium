"""Strict WebKit offline flag: complete M1/M3, real exports and every internal route.
File-input roundtrips are tested separately with HTTP blocked: this WebKit build's
strict flag also blocks File/Blob reads, reproduced independently outside the game.
"""
from playwright.sync_api import sync_playwright,expect
import os,json,hashlib
import release_standalone_browser as suite
from final_missions_browser import snapshot,act,m,c,choice,parents,direct
R=suite.R;OUT=suite.OUT;ENGINE=suite.ENGINE
R['scenario']='strict browser-context offline; all routes, full M1/M3 with downloads; file inputs covered separately'
def export(p,v,id):
 prefix='single' if id=='m1' else 'class';s=snapshot(v)['session'];assert s['stage']=='complete'
 p.screenshot(path=str(OUT/(id+'-complete.png')))
 with p.expect_download() as d:act(v,f'[data-{prefix}=export]')
 path=OUT/(id+'-result.json');d.value.save_as(str(path));assert json.loads(path.read_text())==s
 R['downloads'].append({'file':path.name,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'matchesSession':True});suite.route_report(p,id+' completed strictly offline and downloaded')
with sync_playwright() as pw:
 opts={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']};b=getattr(pw,ENGINE).launch(**opts);ctx=b.new_context(viewport={'width':1366,'height':960},has_touch=True,accept_downloads=True);ctx.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))");p=ctx.new_page();p.set_default_timeout(180000);v=suite.GameView(p);R['version']=b.version
 p.on('pageerror',lambda e:R['errors'].append(str(e)));p.on('console',lambda x:R['console_errors'].append(x.text) if x.type=='error' else None);p.on('requestfailed',lambda q:R['requests_failed'].append({'url':q.url[:200],'failure':q.failure}));p.on('request',lambda q:R['requests'].append({'url':q.url,'offline':R['offline'],'type':q.resource_type}) if q.url.startswith('http') else None)
 try:
  p.goto(suite.URL,timeout=240000);v.ready('[data-single=start]');m(v,'start');v.ready('[data-single-stage]');v.wait_for_function('aquariumLearningSnapshot().renderer.stats.detailModels>=19');ctx.set_offline(True);R['offline']=True
  uid=next(e['uid'] for e in snapshot(v)['session']['tank']['entities'] if e['species']=='waterweed');direct(v,uid,False);act(v,'[data-single=prediction][data-choice="2"]');m(v,'play');v.locator('[data-single=pause]').press('Enter');assert not snapshot(v)['running'];m(v,'help');m(v,'close');m(v,'play');v.wait_for_selector('[data-single-stage=light-finished]');first=json.dumps(snapshot(v)['session']['runs'][0],sort_keys=True);baseline=snapshot(v)['session']['baseline'];m(v,'reset');assert snapshot(v)['session']['tank']==baseline;m(v,'darken');m(v,'play');v.wait_for_selector('[data-single-stage=compare]');assert json.dumps(snapshot(v)['session']['runs'][0],sort_keys=True)==first
  act(v,'[data-single-choice=reversed-dark]');expect(v.locator('.single-feedback')).to_have_attribute('data-kind','error');m(v,'help');m(v,'close');act(v,'[data-single-choice=observed]');act(v,'[data-single-choice=net-proof]');expect(v.locator('.single-feedback')).to_have_attribute('data-kind','error');act(v,'[data-single-choice=processes]');export(p,v,'m1');v.home()
  for id in ['m2','m3','m4','m5','m6']:
   v.open_route('?mission='+suite.mission.MISSIONS[id],'[data-class-stage]')
   if id=='m3':
    c(v,'generation');expect(v.locator('.single-feedback')).to_have_attribute('data-kind','error');c(v,'help');c(v,'close');parents(v);c(v,'generation');choice(v,'lost');expect(v.locator('.single-feedback')).to_have_attribute('data-kind','error');choice(v,'dark');parents(v);c(v,'generation');s=snapshot(v)['session'];fish=[e for e in s['tank']['entities'] if e['species']=='molly'];child=next((e for e in fish if e['variant']=='gold'),fish[0]);act(v,f'[data-class-uid="{child["uid"]}"]');choice(v,'need');expect(v.locator('.single-feedback')).to_have_attribute('data-kind','error');c(v,'help');c(v,'close');choice(v,'actual-alleles');choice(v,'fixed');expect(v.locator('.single-feedback')).to_have_attribute('data-kind','error');choice(v,'possible');export(p,v,'m3')
   else:choice(v,'unsure');c(v,'help');c(v,'close');p.screenshot(path=str(OUT/(id+'-reachable.png')))
   v.home();suite.route_report(p,id+' returned home offline')
  for grade in [8,9,10]:
   v.open_route('?research='+str(grade),'[data-class-stage=free]');day=snapshot(v)['session']['tank']['day'];c(v,'free-day');assert snapshot(v)['session']['tank']['day']==day+1;v.home();suite.route_report(p,'research '+str(grade)+' and home')
  for start in ['free','tutorial']:
   v.open_route('?expert=1','[data-start='+start+']');v.tap('[data-start='+start+']');v.ready();p.screenshot(path=str(OUT/(start+'-reachable.png')));suite.route_report(p,start+' started strictly offline');v.tap('.learn-expert-entry');v.ready('[data-single=start]')
  v.tap('[data-single=teacher]');v.open_route('?expert=1&archive-tools=1','[data-learning-import=product]');p.screenshot(path=str(OUT/'historical-tools-reachable.png'));p.go_back();v.ready('[data-single=start]');suite.route_report(p,'historical tools and browser Back');p.go_forward();v.ready('[data-learning-import=product]');suite.route_report(p,'browser Forward');p.go_back();v.ready('[data-single=start]')
  for i in range(3):v.open_route('?research=9','[data-class-stage=free]');v.home();suite.route_report(p,'repeated route '+str(i+1))
  assert not R['errors'] and not R['console_errors'] and not R['requests_failed'];assert not [q for q in R['requests'] if q['offline']];R['status']='passed'
 except Exception as e:
  R.update(status='failed',failure=str(e))
  try:p.screenshot(path=str(OUT/'failure.png'))
  except:pass
  raise
 finally:suite.save();b.close();print(R.get('status'),flush=True)
