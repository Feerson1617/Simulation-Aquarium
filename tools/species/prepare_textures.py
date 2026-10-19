"""Deterministic authored skin maps with fine scale relief; no photos invented."""
import json,math
from pathlib import Path
import numpy as np
from PIL import Image,ImageFilter
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'assets/species/source'
for item in json.loads((OUT/'inventory.json').read_text()):
 if item['category']!='fish' or item['id']in ['neon','molly','clown','betta']:continue
 id=item['id'];a=item['anatomy'];base=Image.open(OUT/(id+'-pigment.png')).convert('RGB').resize((1024,512),Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(1.4));arr=np.asarray(base,dtype=float)/255
 y,x=np.mgrid[0:512,0:1024];rng=np.random.default_rng(sum(map(ord,id))+1931);rows=28 if a.get('scaleStyle')!='smooth' else 55;columns=84 if a.get('bodyShape')!='eel' else 130
 u=(x/1024*columns+(np.floor(y/512*rows)%2)*.5)%1-.5;v=(y/512*rows)%1-.45;r=np.sqrt(u*u+v*v);ridge=np.exp(-((r-.46)/.035)**2);micro=rng.normal(0,.006,arr.shape[:2]);variance=1+micro+np.sin(x*.11+y*.09)*.012+ridge*.045
 arr=np.clip(arr*variance[:,:,None],0,1);Image.fromarray((arr*255).astype('uint8')).save(OUT/(id+'-skin.jpg'),quality=94)
 strength=.16 if a.get('scaleStyle')!='smooth' else .025
 nx=u*ridge*strength;ny=v*ridge*strength;normal=np.stack([.5+nx,.5+ny,np.sqrt(np.maximum(.1,1-4*nx*nx-4*ny*ny))],axis=2)
 Image.fromarray(np.uint8(np.clip(normal,0,1)*255)).save(OUT/(id+'-normal.png'))
 rough=np.uint8(np.clip(.38+ridge*.11+micro,0,1)*255);Image.fromarray(rough).save(OUT/(id+'-roughness.png'))
print('Prepared 54 authored pigment, scale-normal and roughness sets')
