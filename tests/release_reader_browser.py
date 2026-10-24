"""R01/R02: real V1 imports, downloads, independent CSV checks and reader focus."""
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright,expect
import os,json,csv,hashlib,subprocess,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1];ENGINE=os.environ.get('AQUARIUM_BROWSER','chromium');OUT=Path(os.environ.get('AQUARIUM_RELEASE_READER_RESULTS','/tmp/aquarium-release-reader'))/ENGINE;OUT.mkdir(parents=True,exist_ok=True);URL=os.environ.get('AQUARIUM_URL','http://127.0.0.1:8000/aquarium-simulation/')
r={'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'engine':ENGINE,'captures':[],'downloads':[],'checks':[],'errors':[],'failed_requests':[]}
def record(): (OUT/'report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
def shot(p,name):
 p.screenshot(path=str(OUT/(name+'.png')));r['captures'].append({'name':name,'url':p.url,'at':datetime.now(timezone.utc).isoformat(),'viewport':p.viewport_size,'field':p.locator('[data-learning-manual-metric=imported]').bounding_box() if p.locator('[data-learning-manual-metric=imported]').count() else None});record()
def download(p,selector,name):
 with p.expect_download() as d:p.locator(selector).click()
 f=OUT/name;d.value.save_as(str(f));r['downloads'].append({'file':name,'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()});return f

def manual_check(f,source):
 rows=list(csv.DictReader(f.read_text().splitlines(),delimiter=';'));assert len(rows)==len(source['measurements'])*len(source.get('measurementMetrics', {8:['oxygen','health','algae','plantBiomass','organic','fishAlive'],9:['individuals','health']}[source['profile']['grade']]))
 for row in rows:
  key=row['Messschluessel'];sample=next(s for s in source['measurements'] if str(s['day'])==row['Messzeit']);assert row['Dauereinheit']=='Modelltage';assert row['Seite']=='Eigenes Becken';assert row['Klasse']==str(source['profile']['grade']);assert row['Modellstand']=='Altbestand – nicht dokumentiert'
  if key=='fishAlive':assert row['Wert']=='' and row['Wertstatus']=='historisch unbekannt' and row['Einheit']=='historisch unbekannt'
  else:assert float(row['Wert'])==sample[key] and row['Wertstatus']=='berechnet'
  if key=='oxygen':assert row['Einheit']=='mg/L'
 return len(rows)
with sync_playwright() as pw:
 options={'executable_path':'/usr/bin/chromium','args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']} if ENGINE=='chromium' else {'executable_path':os.environ['AQUARIUM_WEBKIT']}
 b=getattr(pw,ENGINE).launch(**options);r['version']=b.version
 try:
  for viewport,w,h in [('desktop',1366,960),('portrait',768,1024)]:
   ctx=b.new_context(viewport={'width':w,'height':h},has_touch=True,accept_downloads=True);p=ctx.new_page();p.set_default_timeout(90000);p.on('pageerror',lambda e:r['errors'].append(str(e)));p.on('requestfailed',lambda q:r['failed_requests'].append(q.url));p.goto(URL+'?expert=1&archive-tools=1')
   for grade in [8,9]:
    fixture=ROOT/f'tests/fixtures/learning-v1-grade-{grade}.json';original=fixture.read_bytes();source=json.loads(original);p.locator('[data-learning-import=product]').set_input_files(str(fixture));expect(p.locator('[data-import-source]')).to_contain_text(fixture.name)
    field=p.locator('[data-learning-manual-metric=imported]');field.evaluate('e=>e.scrollIntoView({block:"center"})');field.focus();shot(p,f'{viewport}-grade{grade}-before')
    f=download(p,'[data-learn=imported-manual-csv]',f'{viewport}-grade{grade}-initial.csv');count=manual_check(f,source)
    svg=download(p,'[data-learn=manual-chart]',f'{viewport}-grade{grade}.svg');doc=ET.fromstring(svg.read_text());assert doc.tag.endswith('svg');assert 'NaN' not in svg.read_text();assert doc.find('{http://www.w3.org/2000/svg}metadata') is not None
    field.evaluate('e=>e.scrollIntoView({block:"center"})');field.focus();before=field.bounding_box();field.press('End');expected='fishAlive' if grade==8 else 'health';expect(field).to_have_value(expected);expect(field).to_be_focused();after=field.bounding_box();assert abs(after['y']-before['y'])<3,(before,after);assert 0<=after['y'] and after['y']+after['height']<=h;shot(p,f'{viewport}-grade{grade}-after-keyboard')
    if grade==8:expect(p.locator('.learn-measurements')).to_contain_text('historisch');assert p.locator('[data-learn=manual-chart]').count()==0
    f=download(p,'[data-learn=imported-manual-csv]',f'{viewport}-grade{grade}-changed.csv');assert manual_check(f,source)==count
    field.evaluate('e=>e.scrollIntoView({block:"center"})');before=field.bounding_box();field.tap() if viewport=='portrait' else field.click();field.select_option('oxygen' if grade==8 else 'individuals');expect(field).to_be_focused();assert abs(field.bounding_box()['y']-before['y'])<3;shot(p,f'{viewport}-grade{grade}-after-pointer')
    comparison=download(p,'[data-learn=imported-csv]',f'{viewport}-grade{grade}-comparison.csv');rows=list(csv.DictReader(comparison.read_text().splitlines(),delimiter=';'));assert rows
    for row in rows:
     run=source['comparison']['runs'][int(row['Wiederholung'])-1];side='control' if row['Seite']=='Kontrolle' else 'test';time=float(row['Messzeit']);sample=next((s for s in run[side] if float(s.get('generation',s.get('day')))==time),None)
     if row['Wert']!='':assert sample is not None and float(row['Wert'])==sample[row['Messschluessel']]
    assert fixture.read_bytes()==original;r['checks'].append(f'{viewport} grade {grade}: original unchanged; manual CSV all {count} rows and comparison CSV independently checked; SVG parsed; keyboard focus and field position preserved');record();shot(p,f'{viewport}-grade{grade}-downloads')
   p.locator('[data-learning-import=product]').set_input_files({'name':'invalid.json','mimeType':'application/json','buffer':b'{broken'});expect(p.locator('.learn-import-error')).to_contain_text('invalid.json');assert p.locator('.learn-imported-product').count()==0;shot(p,viewport+'-invalid-clears');ctx.close()
  assert not r['errors'] and not r['failed_requests'];r['status']='passed'
 except Exception as e:
  r.update(status='failed',failure=str(e));shot(p,'failure');raise
 finally:record();b.close();print(r.get('status'),OUT,flush=True)
