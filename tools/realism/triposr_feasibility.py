"""Bounded, anonymous, CPU-only TripoSR feasibility trial; never changes game assets."""
import hashlib
import json
import os
import platform
import shutil
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs/ui-model-review/feasibility'
OUT.mkdir(parents=True, exist_ok=True)
WORK = Path(os.environ.get('RUNNER_TEMP', '/tmp')) / 'aquarium-triposr'
WORK.mkdir(parents=True, exist_ok=True)
report = {'status': 'running', 'accepted_models': 0, 'runtime_assets_changed': False,
    'platform': platform.platform(), 'cpu_count': os.cpu_count(),
    'tools': {name: shutil.which(name) for name in ['blender', 'nvidia-smi', 'game-dev']},
    'source_commit': '107cefdc244c39106fa830359024f6a2f1c78871',
    'method': 'official TripoSR, CPU, full default mesh resolution, 2048px baked texture',
    'sources': [
        {'id': 'guppy', 'author': 'Benoît Prieur; color adjustment Togabi', 'license': 'CC0-1.0',
         'page': 'https://commons.wikimedia.org/wiki/File:Poecilia_reticulata_(male).JPG',
         'url': 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Poecilia_reticulata_%28male%29.JPG'},
        {'id': 'cory', 'author': 'NiKo; color adjustment Togabi', 'license': 'public domain by author',
         'page': 'https://commons.wikimedia.org/wiki/File:Corydoras_paleatus_by_NiKo.jpg',
         'url': 'https://upload.wikimedia.org/wikipedia/commons/6/69/Corydoras_paleatus_by_NiKo.jpg'},
        {'id': 'anubias', 'author': 'Daderot', 'license': 'CC0-1.0',
         'page': 'https://commons.wikimedia.org/wiki/File:Anubias_barteri_var._nana_-_Botanischer_Garten_-_Heidelberg,_Germany_-_DSC01278.jpg',
         'url': 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Anubias_barteri_var._nana_-_Botanischer_Garten_-_Heidelberg%2C_Germany_-_DSC01278.jpg'}
    ], 'steps': []}
log = (OUT / 'trial.log').open('w')

def run(args, cwd=None, timeout=600):
    started = time.monotonic()
    print('STEP:', args[0:4], flush=True)
    result = subprocess.run(args, cwd=cwd, stdout=log, stderr=subprocess.STDOUT, timeout=timeout)
    report['steps'].append({'command': args, 'returncode': result.returncode, 'seconds': round(time.monotonic()-started, 2)})
    log.flush()
    if result.returncode:
        raise RuntimeError(f'Command failed ({result.returncode}): {args[0:4]}')

def download(url, path):
    request = urllib.request.Request(url, headers={'User-Agent': 'Simulation-Aquarium/1.0 (public research; no account)'})
    with urllib.request.urlopen(request, timeout=60) as response:
        data = response.read(25_000_001)
    if len(data) > 25_000_000:
        raise RuntimeError('Source exceeds 25 MB trial limit')
    path.write_bytes(data)
    return hashlib.sha256(data).hexdigest()

try:
    run(['git', 'clone', '--quiet', 'https://github.com/VAST-AI-Research/TripoSR.git', str(WORK / 'TripoSR')], timeout=120)
    repo = WORK / 'TripoSR'
    run(['git', 'checkout', '--quiet', report['source_commit']], cwd=repo, timeout=30)
    # Probe public model access before any large dependency/model downloads.
    report['anonymous_model_config_sha256'] = download('https://huggingface.co/stabilityai/TripoSR/resolve/main/config.yaml', WORK / 'config.yaml')
    for source in report['sources']:
        try:
            source['sha256'] = download(source['url'], WORK / (source['id'] + '.jpg'))
        except Exception as error:
            source['download_error'] = str(error)
    if not any('sha256' in source for source in report['sources']):
        raise RuntimeError('No photographic input could be downloaded')
    run([sys.executable, '-m', 'pip', 'install', 'torch==2.5.1', 'torchvision==0.20.1', '--index-url', 'https://download.pytorch.org/whl/cpu'], timeout=600)
    run([sys.executable, '-m', 'pip', 'install', 'numpy==1.26.4', 'omegaconf==2.3.0',
         'Pillow==10.4.0', 'einops==0.7.0', 'transformers==4.35.0', 'trimesh==4.0.5',
         'rembg==2.0.57', 'onnxruntime==1.19.2', 'imageio[ffmpeg]', 'xatlas==0.0.9', 'moderngl==5.10.0'], timeout=600)
    run([sys.executable, '-m', 'pip', 'install', 'scikit-build-core>=1.0', 'pybind11>=2.10'], timeout=180)
    run([sys.executable, '-m', 'pip', 'install', '--no-build-isolation', 'git+https://github.com/tatsy/torchmcubes.git@a9ac95aa329957ba646e7bb057f825f5dfa77f38'], timeout=600)
    run([sys.executable, '-c', 'import torch; print("CUDA available:",torch.cuda.is_available()); print("CPU threads:",torch.get_num_threads())'], timeout=30)
    for source in report['sources']:
        if 'sha256' not in source:
            continue
        run(['xvfb-run', '-a', sys.executable, 'run.py', str(WORK / (source['id'] + '.jpg')),
             '--device', 'cpu', '--chunk-size', '1024', '--mc-resolution', '256',
             '--bake-texture', '--texture-resolution', '2048', '--model-save-format', 'obj',
             '--output-dir', str(OUT / source['id'])], cwd=repo, timeout=480)
        source['reconstructed'] = True
    report['status'] = 'generated-awaiting-anatomy-and-browser-review'
except Exception as error:
    report.update(status='blocked', blocker=str(error))
finally:
    log.close()
    report['log_tail'] = (OUT / 'trial.log').read_text(errors='replace')[-12000:]
    (OUT / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False, indent=2), flush=True)
