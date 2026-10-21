"""Check that the existing complete-HTML download remains playable offline."""
import json
import os
import tempfile
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import Error, sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT.parent)))
threading.Thread(target=server.serve_forever, daemon=True).start()
standalone_server = None
try:
    with tempfile.TemporaryDirectory(prefix='aquarium-offline-') as folder, sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('AQUARIUM_CHROMIUM') or ('/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else p.chromium.executable_path), headless=True,
                                   args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        page = browser.new_page(viewport={'width': 1180, 'height': 820})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(f'http://127.0.0.1:{server.server_port}/{ROOT.name}/?expert=1', wait_until='load')
        page.locator('button[data-graphics-profile="ipad"]').click()
        page.locator('[data-start="free"]').click()
        page.locator('[data-panel="time"]').click()
        with page.expect_download() as download:
            page.locator('[data-act="download-html"]').click()
        document = Path(folder) / 'Aquarium.html'
        download.value.save_as(str(document))
        assert document.stat().st_size > 20_000_000
        page.close()
        offline = browser.new_page(viewport={'width': 1180, 'height': 820})
        offline.on('pageerror', lambda error: errors.append(str(error)))
        http_requests = []
        offline.on('request', lambda request: http_requests.append(request.url[:160]) if request.url.startswith(('http:', 'https:')) else None)
        try:
            offline.goto(document.as_uri(), wait_until='load')
            file_url_tested = True
            document_url = document.as_uri()
        except Error as error:
            if 'ERR_BLOCKED_BY_ADMINISTRATOR' not in str(error):
                raise
            # Preserve the managed browser policy. Verify the same downloaded file
            # alone on an HTTP server with no module, stylesheet or asset files.
            print('LIMITATION: Managed Chromium blocks file: navigation. Checking the downloaded document alone over loopback HTTP.', flush=True)
            file_url_tested = False
            offline.close()
            offline = browser.new_page(viewport={'width': 1180, 'height': 820})
            offline.on('pageerror', lambda error: errors.append(str(error)))
            offline.on('request', lambda request: http_requests.append(request.url[:160]) if request.url.startswith(('http:', 'https:')) else None)
            standalone_server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=folder))
            threading.Thread(target=standalone_server.serve_forever, daemon=True).start()
            document_url = f'http://127.0.0.1:{standalone_server.server_port}/Aquarium.html'
            offline.goto(document_url, wait_until='load')
        offline.locator('[data-learn="expert"]').click()
        offline.locator('button[data-graphics-profile="ipad"]').click()
        expect(offline.locator('[data-start="free"]')).to_be_visible()
        offline.locator('[data-start="free"]').click()
        offline.locator('[data-act="choose-tank"]').click()
        offline.locator('[data-buy="tank-120"]').click()
        offline.locator('[data-act="place-tank"]').click()
        offline.locator('[data-panel="shop"]').click()
        offline.locator('[data-department="deko"]').click()
        offline.locator('[data-species="spiderwood"]').click()
        offline.locator('[data-act="add-species"]').click()
        assert offline.evaluate('JSON.parse(localStorage.getItem("aquarium-werkstatt-v1")).entities.some(e=>e.species==="spiderwood")'), offline.locator('#toast-root').inner_text()
        offline.locator('[data-act="close-panel"]').click()
        offline.locator('#tweezers-button').click()
        offline.wait_for_function('window.aquariumSnapshot().graphics.triangles>3000', polling=100)
        assert offline.evaluate('window.aquariumAquascapingSnapshot().enabled')
        assert offline.evaluate('window.aquariumSnapshot().catalogCount') == 144
        offline.locator('#tweezers-button').click()
        offline.locator('[data-panel="shop"]').click()
        offline.locator('[data-department="tiere"]').click()
        offline.locator('[data-species="guppy"]').click()
        offline.locator('[data-fish-variant]').select_option('red')
        offline.wait_for_function('window.aquariumShopAppearance()?.variant === "red"')
        offline.locator('[data-act="add-species"]').click()
        offline.locator('[data-act="close-panel"]').click()
        offline.wait_for_function('window.aquariumRenderedIndividuals().some(e=>e.appearance?.variant==="red")')
        offline.locator('#genetics-button').click()
        expect(offline.locator('.genetics-overlay')).to_be_visible()
        assert not errors, errors
        offline.locator('[data-gen-close]').click()
        # Student curriculum and the paired core must also work inside the sole file.
        offline.locator('.learn-expert-entry').click()
        offline.locator('[data-learn-grade="10"]').click()
        offline.locator('[data-learn="missions"]').click()
        offline.locator('[data-learn-mission="10-wadden"]').click()
        expect(offline.locator('.learn-quest')).to_be_visible()
        assert offline.evaluate('window.aquariumLearningSnapshot().quest.id')=='10-wadden'
        offline.locator('[data-learn="more"]').click()
        offline.locator('[data-learn="home"]').click()
        offline.locator('[data-learn-grade="8"]').click()
        offline.locator('[data-learn="free"]').click()
        offline.locator('[data-learn="investigate"]').click()
        offline.locator('[data-learning-note="question"]').fill('Was verändert Licht?')
        offline.locator('[data-learning-value]').fill('0')
        offline.locator('[data-learn="compare"]').click()
        comparison=offline.evaluate('window.aquariumLearningSnapshot().comparison')
        assert comparison['runs'][0]['control'][-1]['oxygen']>comparison['runs'][0]['test'][-1]['oxygen']
        print('PASS: sole-file quest module and actual paired biological engine', flush=True)
        dependencies = [url for url in http_requests if url != document_url and not url.endswith('/favicon.ico')]
        assert not dependencies, dependencies
        print('PASS: Downloaded HTML alone starts, renders decoration and quantized variant fish, opens genetics and enables tweezers without additional HTTP resources. bytes='+str(document.stat().st_size)+'. file: tested=' + str(file_url_tested), flush=True)
        browser.close()
finally:
    server.shutdown()
    if standalone_server:
        standalone_server.shutdown()
