#!/usr/bin/env python3
"""Run a Python WebKit command with verified, isolated local runtime libraries."""
import json,os,sys
from pathlib import Path
p=Path('/workspace/aquarium-devtools/webkit-portable')
r=json.loads((p/'runtime-paths.json').read_text())
assert (p/'receipt.json').exists(),'Prepare and verify the portable runtime first'
e=dict(os.environ)
e['LD_LIBRARY_PATH']=':'.join(r['library_paths']+[e.get('LD_LIBRARY_PATH','')])
e['GST_PLUGIN_PATH_1_0']=r['gstreamer_path']+(':'+e['GST_PLUGIN_PATH_1_0'] if e.get('GST_PLUGIN_PATH_1_0') else '')
e['FONTCONFIG_FILE']=r['fontconfig_file'];e['GSETTINGS_SCHEMA_DIR']=r['schema_dir']
e['PLAYWRIGHT_BROWSERS_PATH']=r['browser_path'];e['AQUARIUM_BROWSER']='webkit'
cache=p/'runtime-cache';cache.mkdir(exist_ok=True);e['XDG_CACHE_HOME']=str(cache);e['GST_REGISTRY_1_0']=str(cache/'gstreamer-registry.bin')
assert len(sys.argv)>1,'Supply a Python script or -m module'
os.execvpe(sys.executable,[sys.executable,*sys.argv[1:]],e)
