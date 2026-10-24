"""Bind curated evidence to its actual runtime; never turn old reports into new runs."""
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
OUT = ROOT / 'docs/coherent-learning/evidence/final'
HEAD = 'f12d5e8789cb70268469df8c6a60ecb15547cf91'


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


runtime = sorted([p for p in ROOT.iterdir() if p.suffix in ('.mjs', '.html', '.css')]
                 + [ROOT / 'vendor/lz-string.mjs'])
for path in runtime:
    committed = subprocess.check_output(['git', 'show', HEAD + ':' + str(path.relative_to(ROOT))], cwd=ROOT)
    assert committed == path.read_bytes(), f'Runtime changed after tested application head: {path}'

reports = []
for path in sorted(OUT.rglob('report.json')):
    data = json.loads(path.read_text())
    assert data['status'] == 'passed', path
    for key in ('errors', 'page_errors', 'console_errors', 'failed_requests', 'http_errors'):
        assert not data.get(key), (path, key, data.get(key))
    if data.get('commit') == HEAD:
        for name, digest in data.get('sources', {}).items():
            assert sha(ROOT / name) == digest, (path, name)
    reports.append({'file': str(path.relative_to(OUT)), 'commit': data.get('commit'),
                    'checks': len(data.get('checks', [])), 'status': data['status']})

public = json.loads((OUT / 'preview/public-hashes.json').read_text())
assert public['applicationHead'] == HEAD
assert len(public['checks']) == 56
for row in public['checks']:
    assert row['match'] and row['sha256'] == sha(ROOT / row['file']), row

manifest = {
    'applicationHead': HEAD,
    'scope': 'Runtime files match the tested application commit byte for byte. Reports retain their individual original commits; do not reinterpret older checks as runs at the final head.',
    'runtime': {str(p.relative_to(ROOT)): sha(p) for p in runtime},
    'testScripts': {str(p.relative_to(ROOT)): sha(p) for p in sorted((ROOT / 'tests').glob('*')) if p.suffix in ('.py', '.mjs')},
    'reports': reports,
    'evidence': {str(p.relative_to(OUT)): sha(p) for p in sorted(OUT.rglob('*')) if p.is_file() and p.name != 'manifest.json'},
}
(OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print('PASS', len(runtime), 'runtime hashes,', len(reports), 'passed reports, 56 delivered files; evidence manifest written')
