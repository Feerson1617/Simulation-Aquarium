"""Exercise the new inheritance modules inside the actual single HTML, then offline.

Only visible learner actions advance the lesson. This does not test native file: boot.
"""
import os, json, hashlib, subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ENGINE = os.environ.get('AQUARIUM_BROWSER', 'chromium')
OUT = Path(os.environ.get('AQUARIUM_CLASSROOM_OFFLINE_RESULTS', '/tmp/classroom-offline')) / ENGINE
OUT.mkdir(parents=True, exist_ok=True)
URL = os.environ.get('AQUARIUM_SINGLE_HTML', 'http://127.0.0.1:8000/standalone-m1/') + '?mission=m3-hidden-inheritance'
artifact = Path('/workspace/aquarium-devtools/www/standalone-m1/index.html')
report = {'engine': ENGINE, 'testHead': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
          'artifactSHA256': hashlib.sha256(artifact.read_bytes()).hexdigest(), 'url': URL,
          'errors': [], 'requests': [], 'checks': [], 'nativeFile': 'not tested', 'physicalIPad': False}

def snap(page):
    return page.evaluate('window.aquariumLearningSnapshot()')

def click(page, action):
    page.locator(f'[data-class="{action}"]:visible').first.click()

def choose(page, choice):
    page.locator(f'[data-class-choice="{choice}"]:visible').click()

def parents(page, founders=False):
    fish = [e for e in snap(page)['session']['tank']['entities'] if e['species'] == 'molly']
    for sex, genotype in [('♀', 'AA'), ('♂', 'aa')]:
        e = next(e for e in fish if e['sex'] == sex and (not founders or e['genotype'] == genotype))
        page.locator(f'[data-class=select][data-class-uid="{e["uid"]}"]').click()

with sync_playwright() as pw:
    launch = {'executable_path': '/usr/bin/chromium', 'args': ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']} if ENGINE == 'chromium' else {'executable_path': os.environ['AQUARIUM_WEBKIT']}
    browser = getattr(pw, ENGINE).launch(**launch)
    context = browser.new_context(viewport={'width': 1366, 'height': 960}, accept_downloads=True)
    context.add_init_script("localStorage.setItem('aquarium-graphics-v1',JSON.stringify({version:1,profile:'ipad'}))")
    page = context.new_page()
    page.set_default_timeout(120000)
    page.on('pageerror', lambda e: report['errors'].append(e.stack))
    page.on('request', lambda q: report['requests'].append(q.url) if q.url.startswith(('http:', 'https:')) else None)
    try:
        page.goto(URL)
        page.wait_for_selector('[data-class-stage=founders]')
        page.wait_for_function('window.aquariumLearningSnapshot().renderer?.stats.objects>0')
        context.set_offline(True)
        parents(page, True)
        click(page, 'generation')
        assert all(e['genotype'] == 'Aa' for e in snap(page)['session']['tank']['entities'] if e['species'] == 'molly')
        choose(page, 'dark')
        parents(page)
        click(page, 'generation')
        page.wait_for_function("(()=>{const s=window.aquariumLearningSnapshot();return s.session.tank.entities.filter(e=>e.species==='molly').every(e=>s.renderer.appearances.some(a=>a.uid===e.uid&&a.variant===e.variant))})()")
        state = snap(page)
        assert state['renderer']['sameState'] and state['session']['generation'] == 2
        fish = next(e for e in state['session']['tank']['entities'] if e['species'] == 'molly')
        page.locator(f'[data-class=select][data-class-uid="{fish["uid"]}"]').click()
        choose(page, 'actual-alleles')
        choose(page, 'possible')
        assert snap(page)['session']['stage'] == 'complete'
        with page.expect_download() as download:
            click(page, 'export')
        download.value.save_as(str(OUT / 'm3-result.json'))
        product = json.loads((OUT / 'm3-result.json').read_text())
        assert product['currentContext'] == snap(page)['context']
        assert product['currentContext']['version'] == 2
        assert page.locator('canvas').count() == 1
        assert report['requests'] == [URL] and not report['errors']
        page.screenshot(path=str(OUT / 'm3-completed.png'))
        report.update(status='passed', checks=['embedded new lesson and inheritance modules', 'actual F1 and F2 from visible parent choices', 'rendered UID and colour match actual F2 entities', 'offline completion and export with current context v2', 'single HTTP document without child HTTP resources'])
        print('PASS', ENGINE, 'new M3 in loaded single HTML, offline F1/F2 and current export', flush=True)
    except Exception as e:
        report.update(status='failed', failure=str(e))
        raise
    finally:
        (OUT / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
        browser.close()
