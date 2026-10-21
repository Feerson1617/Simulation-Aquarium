#!/usr/bin/env python3
"""Verified Debian13 libraries for Playwright1.62, entirely in a private prefix."""
import hashlib,json,os,re,ssl,subprocess,sys
from pathlib import Path
from datetime import datetime,timezone
from importlib.metadata import version
P=Path('/workspace/aquarium-devtools/webkit-portable')
PACKAGES=['gstreamer1.0-libav','libgles2','libgtk-4-1','libharfbuzz-icu0','libhyphen0','libmanette-0.2-0','libwoff1','xvfb','fonts-unifont','xfonts-scalable','fonts-ipafont-gothic','fonts-wqy-zenhei','fonts-tlwg-loma-otf','fonts-freefont-ttf']
LIBS=['libGLESv2.so.2','libgtk-4.so.1','libharfbuzz-icu.so.0','libhyphen.so.0','libmanette-0.2.so.0','libwoff2dec.so.1.0.2']
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def tree():
 return {str(p.relative_to(P/'root')):({'link':os.readlink(p)} if p.is_symlink() else {'sha256':digest(p)}) for p in sorted((P/'root').rglob('*')) if p.is_symlink() or p.is_file()}
def write_same(path,text):
 if path.exists() and path.read_text()!=text:raise RuntimeError('Preserve differing local configuration: '+str(path))
 path.write_text(text)
def environment():
 e=dict(os.environ);assert not e.get('APT_CONFIG') or e['APT_CONFIG']==str(P/'apt.conf'),'Preserve existing APT_CONFIG';e['APT_CONFIG']=str(P/'apt.conf')
 for upper,lower in [('HTTP_PROXY','http_proxy'),('HTTPS_PROXY','https_proxy')]:
  if e.get(upper):e[lower]=e[upper]
 return e
def runtime():
 libs=[str(P/'root/usr/lib/x86_64-linux-gnu'),str(P/'root/lib/x86_64-linux-gnu'),str(P/'root/usr/lib')]
 return {'library_paths':libs,'gstreamer_path':str(P/'root/usr/lib/x86_64-linux-gnu/gstreamer-1.0'),'fontconfig_file':str(P/'fonts.conf'),'schema_dir':str(P/'root/usr/share/glib-2.0/schemas'),'browser_path':'/workspace/aquarium-devtools/playwright'}
def check_libraries():
 e=dict(os.environ);e['LD_LIBRARY_PATH']=':'.join(runtime()['library_paths']+[e.get('LD_LIBRARY_PATH','')])
 code='import ctypes,json;names='+repr(LIBS)+';[ctypes.CDLL(name) for name in names];print(json.dumps(names))'
 result=subprocess.run([sys.executable,'-c',code],env=e,text=True,capture_output=True)
 if result.returncode:raise RuntimeError('Portable library loading failed: '+result.stderr)
 print('Loaded all six required shared-library roots:',result.stdout.strip(),flush=True)
 checked=[]
 for path in sorted((P/'root').rglob('*')):
  if not path.is_file() or path.is_symlink():continue
  with path.open('rb') as f:elf=f.read(4)==b'\x7fELF'
  if not elf:continue
  found=subprocess.run(['ldd',str(path)],env=e,capture_output=True,text=True)
  assert found.returncode==0 and 'not found' not in found.stdout+found.stderr,'Unresolved ELF dependency: '+str(path)+' '+found.stdout+found.stderr
  checked.append(str(path.relative_to(P/'root')))
 print('All extracted ELF objects resolve:',len(checked),flush=True)
 return checked
assert version('playwright')=='1.62.0','Review official host dependencies before changing the pinned Playwright version'
assert 'VERSION_CODENAME=trixie' in Path('/etc/os-release').read_text(),'This verified prefix targets Debian13 only'
P.mkdir(exist_ok=True)
receipt=P/'receipt.json'
if receipt.exists():
 r=json.loads(receipt.read_text());assert tree()==r['files'],'A retained library file changed; preserve and review it'
 for p in r['archives']:assert digest(Path(p['path']))==p['sha256'],'A retained package archive changed'
 check_libraries();print('Verified retained portable libraries; no package or system changes.');sys.exit(0)
for rel in ['apt/etc/parts','apt/lists/partial','apt/archives/partial','apt/cache','root','font-cache']:(P/rel).mkdir(parents=True,exist_ok=True)
owner=P/'owner.json'
if any((P/'root').iterdir()) and not owner.exists():raise RuntimeError('Preserve existing unowned prefix files')
write_same(owner,json.dumps({'owner':'aquarium-webkit-portable-20261021'},indent=2)+'\n')
source='Types: deb\nURIs: https://deb.debian.org/debian\nSuites: trixie trixie-updates\nComponents: main\nSigned-By: /usr/share/keyrings/debian-archive-keyring.gpg\n\nTypes: deb\nURIs: https://deb.debian.org/debian-security\nSuites: trixie-security\nComponents: main\nSigned-By: /usr/share/keyrings/debian-archive-keyring.gpg\n'
write_same(P/'apt/etc/debian.sources',source);write_same(P/'apt/etc/empty.conf','')
config=f'''Dir::Etc::parts "{P}/apt/etc/parts";
Dir::Etc::main "{P}/apt/etc/empty.conf";
Dir::Etc::sourcelist "{P}/apt/etc/debian.sources";
Dir::Etc::sourceparts "-";
Dir::State::lists "{P}/apt/lists";
Dir::State::status "/var/lib/dpkg/status";
Dir::Cache::archives "{P}/apt/archives";
Dir::Cache::pkgcache "{P}/apt/cache/pkgcache.bin";
Dir::Cache::srcpkgcache "{P}/apt/cache/srcpkgcache.bin";
Debug::NoLocking "true";
APT::Get::List-Cleanup "false";
'''
ca=next((os.environ[k] for k in ['SSL_CERT_FILE','REQUESTS_CA_BUNDLE','CURL_CA_BUNDLE'] if os.environ.get(k) and Path(os.environ[k]).is_file()),None)
if ca:config+='Acquire::https::CaInfo '+json.dumps(ca)+';\n'
write_same(P/'apt.conf',config);env=environment()
with (P/'setup.log').open('a') as log:
 for args in [['/usr/bin/apt-get','update'],['/usr/bin/apt-get','--download-only','--yes','--no-install-recommends','install',*PACKAGES]]:
  subprocess.run(args,env=env,stdout=log,stderr=subprocess.STDOUT,check=True)
 archives=[]
 for p in sorted((P/'apt/archives').glob('*.deb')):
  fields=subprocess.check_output(['dpkg-deb','-f',str(p),'Package','Version','Architecture'],text=True)
  meta=dict(line.split(': ',1) for line in fields.splitlines());pkg=meta['Package'];ver=meta['Version']
  index=subprocess.check_output(['/usr/bin/apt-cache','show',pkg+'='+ver],env=env,text=True)
  actual=digest(p);expected=set(re.findall(r'^SHA256: ([a-f0-9]{64})$',index,re.M));assert actual in expected,'Package checksum differs from authenticated index: '+pkg
  subprocess.run(['dpkg-deb','--extract',str(p),str(P/'root')],stdout=log,stderr=subprocess.STDOUT,check=True)
  archives.append({'package':pkg,'version':ver,'architecture':meta['Architecture'],'path':str(p),'sha256':actual,'authenticated_index_match':True})
 assert len(archives)==19,'Review a changed dependency resolution rather than silently replacing the tested prefix'
 schemas=P/'root/usr/share/glib-2.0/schemas'
 if schemas.exists():subprocess.run(['glib-compile-schemas',str(schemas)],stdout=log,stderr=subprocess.STDOUT,check=True)
write_same(P/'fonts.conf',f'<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><include ignore_missing="no">/etc/fonts/fonts.conf</include><dir>{P}/root/usr/share/fonts</dir><cachedir>{P}/font-cache</cachedir></fontconfig>\n')
write_same(P/'runtime-paths.json',json.dumps(runtime(),indent=2)+'\n');elf_checks=check_libraries()
r={'status':'portable_shared_libraries_loaded','recorded':datetime.now(timezone.utc).isoformat(),'playwright':'1.62.0','platform':'Debian13-x64','system_packages_installed':False,'system_packages_upgraded':False,'package_count':len(archives),'elf_checks':elf_checks,'source_signature_verification':'APT default verification of Debian InRelease with the distribution archive keyring; never disabled','tls_verification':'Enabled; inherited proxy and CA trust preserved','archives':archives,'runtime':runtime(),'files':tree(),'webkit_binary_installed':False,'webkit_game_tests_executed':False}
receipt.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print('Verified and extracted',len(archives),'official packages into private prefix; OS and game files unchanged.')
