"""Project the documented generated lateral sheet onto authored 3D body/fin UVs.
The sheet is generated artwork, never claimed as real reference photography.
"""
import json,math
from pathlib import Path
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'assets/species/source';im=np.asarray(Image.open(OUT/'generated-fish-sheet.png').convert('RGBA'))
# Nose -> caudal peduncle landmarks, in original sheet pixels. Top/bottom describe
# the body alone; attached fins have their own UV projections below.
SPECS={
 'guppy':{'x':[811,730,610,430,280],'top':[284,264,242,230,266],'bottom':[317,355,359,332,315], 'caudal':{'root':[280,286,315],'edge':[90,80,503],'bow':-65},'dorsal':{'root':[550,370,238],'height':90}},
 'platy':{'x':[1522,1430,1300,1160,1090],'top':[307,252,206,245,293],'bottom':[337,402,447,409,368],'caudal':{'root':[1090,293,368],'edge':[857,253,429],'bow':-8},'dorsal':{'root':[1370,1120,228],'height':100}},
 'zebra':{'x':[812,726,610,380,212],'top':[754,732,718,721,743],'bottom':[782,819,824,805,790],'caudal':{'root':[212,743,790],'edge':[42,654,850],'bow':-7},'dorsal':{'root':[570,360,721],'height':98}},
 'cory':{'x':[1504,1430,1320,1170,1030],'top':[805,735,674,718,781],'bottom':[843,916,938,891,854],'caudal':{'root':[1030,781,854],'edge':[858,741,895],'bow':-12},'dorsal':{'root':[1340,1190,700],'height':150}},
}
def sample(x,y):
 x=np.clip(np.round(x).astype(int),0,im.shape[1]-1);y=np.clip(np.round(y).astype(int),0,im.shape[0]-1);return im[y,x]
for id,spec in SPECS.items():
 y,x=np.mgrid[0:512,0:1024];u=x/1023;v=y/511;xp=spec['x'][0]+(spec['x'][-1]-spec['x'][0])*u;top=np.interp(xp,spec['x'][::-1],spec['top'][::-1]);bottom=np.interp(xp,spec['x'][::-1],spec['bottom'][::-1]);yp=top+(bottom-top)*(.025+.95*v)
 out=sample(xp,yp);Image.fromarray(out[:,:,:3]).save(OUT/(id+'-skin.jpg'),quality=96)
 for fin in ['caudal','dorsal']:
  specfin=spec[fin];y,x=np.mgrid[0:256,0:512];u=x/511;v=y/255
  if fin=='caudal':
   rootx,top,bottom=specfin['root'];endx,edgeTop,edgeBottom=specfin['edge'];rx=np.full_like(u,rootx);ry=top+(bottom-top)*u;ex=endx+specfin['bow']*np.sin(u*math.pi);ey=edgeTop+(edgeBottom-edgeTop)*u
  else:
   start,end,base=specfin['root'];rx=start+(end-start)*u;ry=np.full_like(u,base);ex=rx-10*np.sin(u*math.pi);ey=ry-specfin['height']*np.sin(u*math.pi)**.8
  pixels=sample(rx*(1-v)+ex*v,ry*(1-v)+ey*v);pixels[:,:,3]=np.uint8(pixels[:,:,3].astype(float)*.82);Image.fromarray(pixels).save(OUT/(id+'-fin-'+fin+'.png'))
eyes={'guppy':(758,299,18),'platy':(1450,318,18),'zebra':(750,758,22),'cory':(1421,770,16)}
metadata={}
for id,spec in SPECS.items():
 ex,ey,er=eyes[id];top=float(np.interp(ex,spec['x'][::-1],spec['top'][::-1]));bottom=float(np.interp(ex,spec['x'][::-1],spec['bottom'][::-1]));metadata[id]={'eyeT':(spec['x'][0]-ex)/(spec['x'][0]-spec['x'][-1]),'eyeV':(ey-top)/(bottom-top),'eyeR':er/(spec['x'][0]-spec['x'][-1]),'source':'generated-fish-sheet.png','kind':'generated-artwork-not-photography'}
 Image.fromarray(im).crop((ex-er,ey-er,ex+er,ey+er)).resize((128,128),Image.Resampling.LANCZOS).save(OUT/(id+'-eye.png'))
(OUT/'generated-projection.json').write_text(json.dumps(metadata,indent=2)+'\n')
print('Projected four explicitly generated texture sources onto authored UVs')
