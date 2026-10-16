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
        page.goto(f'http://127.0.0.1:{server.server_port}/{ROOT.name}/', wait_until='load')
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
        expect(offline.locator('[data-start="free"]')).to_be_visible()
        offline.locator('[data-start="free"]').click()
        offline.locator('[data-act="choose-tank"]').click()
        offline.locator('[data-buy="tank-120"]').click()
        offline.locator('[data-act="place-tank"]').click()
        offline.locator('[data-panel="shop"]').click()
        offline.locator('[data-department="deko"]').click()
        offline.locator('[data-species="spiderwood"]').click()
        offline.locator('[data-act="add-species"]').click()
        offline.locator('[data-act="close-panel"]').click()
        offline.locator('#tweezers-button').click()
        offline.wait_for_function('window.aquariumSnapshot().graphics.triangles>3000', polling=100)
        assert offline.evaluate('window.aquariumAquascapingSnapshot().enabled')
        assert offline.evaluate('window.aquariumSnapshot().catalogCount') == 144
        assert not errors, errors
        dependencies = [url for url in http_requests if url != document_url and not url.endswith('/favicon.ico')]
        assert not dependencies, dependencies
        print('PASS: Downloaded HTML alone starts, renders new decoration and enables tweezers without additional HTTP resources. file: tested=' + str(file_url_tested), flush=True)
        browser.close()
finally:
    server.shutdown()
    if standalone_server:
        standalone_server.shutdown()
