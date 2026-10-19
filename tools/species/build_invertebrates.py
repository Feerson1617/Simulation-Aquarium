"""Original segmented crustaceans, continuous coiled shells and ribbed bivalves."""
import math,random
from organism_common import *
from build_fish import ellipsoid

def shrimp(item,lod):
 id=item['id'];color=item['species']['color'];desktop=lod=='desktop';cuticle=vertex_material('cuticle',color,.38,.82 if id=='amanoshrimp'else 1);legmat=material('walking-legs',color,.5,.8);eye=material('compound-eye','#111a17',.18);whisker=material('antenna','#c6bda4'if id not in ['cleanershrimp','fireshrimp']else'#e3ddc7',.55,.85)
 for segment in range(7):
  start=0 if segment==0 else .32+(segment-1)/6*.68;end=.32 if segment==0 else .32+segment/6*.68;points=[];radii=[]
  for j in range(13 if desktop else 7):
   t=start+(end-start)*j/(12 if desktop else 6);x=.28-.62*t;y=.16+.095*math.sin(t*math.pi)-.05*t*t;points.append((x,y,0));r=.065*(1-.58*t);radii.append((r*(1+.18*math.sin(j*math.pi/(12 if desktop else 6))),r*.8))
  body=loft('carapace'if segment==0 else'abdominal-somite',points,radii,cuticle,18 if desktop else 10,'body')
  def colors(x,y,z,segment=segment):
   if id=='crystal'and segment in [1,3,5]:return tuple(linear(v)for v in(.85,.84,.75))
   if id=='cleanershrimp'and y>.20 and abs(z)<.017:return tuple(linear(v)for v in(.9,.89,.8))
   if id=='peppermint':return tuple(linear(v)for v in((.62,.24,.19)if math.sin(z*230+x*17)>.45 else(.76,.64,.50)))
   if id=='amanoshrimp':
    t=max(0,min(1,(.28-x)/.62));cy=.16+.095*math.sin(t*math.pi)-.05*t*t;ry=.065*(1-.58*t)
    if abs(z)>.025 and abs(math.sin(x*95))>.84 and any(abs(y-(cy+ry*(row*.45-.65)))<.003 for row in range(4)):return tuple(linear(v)for v in(.35,.30,.22))
   return tuple(linear(int(color.lstrip('#')[j:j+2],16)/255)for j in(0,2,4))
  paint(body,color,.14,colors)
 # Five pairs of articulated walking legs; five abdominal pleopod pairs.
 for side in [-1,1]:
  for k in range(5):
   x=.24-k*.035;points=[(x,.18,side*.04),(x+.025,.10,side*.09),(x-.025,.025,side*.15),(x-.09,.008,side*.17)];tube('pereiopod',points,[.005,.0035,.0025,.001],legmat,7 if desktop else 5)
   tube('pleopod',[(.04-k*.065,.17,side*.03),(.01-k*.065,.10,side*.065),(-.03-k*.065,.11,side*.08)],[.004,.003,.001],legmat,6)
  ellipsoid('eye-stalk',(.27,.23,side*.046),(.013,.016,.013),cuticle,16,8);ellipsoid('eye',(.28,.25,side*.055),(.014,.014,.014),eye,16,10)
  for antenna in range(3):
   length=.31+antenna*.065;points=[(.28+t*length,.22+math.sin(t*3)*.05,side*(.025+t*t*.18+antenna*.015))for t in[j/(28 if desktop else 14)for j in range((28 if desktop else 14)+1)]];tube('antenna',points,[.0022*(1-j/len(points))+.0003 for j in range(len(points))],whisker,5)
 points=[(.26+t*.13,.25+t*.035,0)for t in[j/14 for j in range(15)]];tube('serrated-rostrum',points,[.009*(1-j/15)+.0008 for j in range(15)],cuticle,7)
 for k in range(6):tube('rostral-tooth',[(.29+k*.013,.26+k*.003,0),(.29+k*.013,.28+k*.003,0)],[.0025,.0002],cuticle,5)
 for side in [-1,0,1]:
  verts=[(-.30,.11,0),(-.44,.09,side*.10-.035),(-.46,.10,side*.10+.035),(-.31,.14,.025)];mesh('tail-fan-uropod',verts,[(0,1,2),(0,2,3)],cuticle,role='body')
 if id=='bambooshrimp':
  for side in [-1,1]:
   for n in range(2):
    origin=(.36,.16+n*.045,side*.12)
    for k in range(28 if desktop else 14):
     a=k/(27 if desktop else 13)*math.pi;end=(origin[0]+math.cos(a)*.065,origin[1]+math.sin(a)*.065,origin[2]);tube('filter-feeding-fan',[origin,end],[.0012,.00025],whisker,4)

def snail(item,lod,hermit=False):
 id=item['id'];desktop=lod=='desktop';flat=id=='ramshorn';low=id=='nerite';slender=id in ['trumpet','cerith'];turns=7 if slender else 3.5 if low else 5
 height=.28 if flat else .22 if low else .62 if slender else .43
 shellColor='#9c9277'if hermit else item['species']['color'];shellmat=vertex_material('calcareous-shell',shellColor,.56);footmat=material('soft-foot','#b6b59b',.57);dark=material('aperture-interior','#383c2c',.82);eye=material('eye','#121a15',.2)
 if flat:
  points=[];radii=[];count=220 if desktop else 100
  for j in range(count+1):
   t=j/count;angle=t*3*2*math.pi;r=.008*math.exp(3.3*t);points.append((r*math.cos(angle),.25+r*math.sin(angle),0));radii.append(.003+r*.65)
  shell=tube('continuous-planispiral-shell',points,radii,shellmat,20 if desktop else 10);paint(shell,shellColor,.12);p=Vector(points[-1]);direction=(p-Vector(points[-2])).normalized();u=direction.cross(Vector((0,1,0)))
  if u.length<.01:u=direction.cross(Vector((1,0,0)))
  u.normalize();v=direction.cross(u);rim=[tuple(p+(math.cos(j/48*math.pi*2)*u+math.sin(j/48*math.pi*2)*v)*radii[-1])for j in range(49)];center=p-direction*.025
 else:
  # Connected gastropod exterior. A helical suture modulates one continuous
  # surface; separate torus turns would leave biologically impossible gaps.
  baseR=.115 if slender else .22 if low else .19;aspect=.82
  def radial(t,a):
   t=max(0,min(1,t));phase=2*math.pi*turns*t+(-a if id=='bladder'else a)
   if low:envelope=math.sqrt(max(0,1-t*t));relief=.035
   elif id in ['bladder','nassarius']or hermit:
    envelope=math.sqrt(max(0,1-((t-.28)/.78)**2))if t<.65 else .69*((1-t)/.35)**.85;relief=.10
   else:envelope=(1-t)**(.80 if slender else .95);relief=.10
   whorl=1-relief*(.5+.5*math.cos(phase))**8
   axial=.005*math.sin(a*36+t*12)if id in ['trumpet','cerith','trochus']else .002*math.sin(a*22+t*21)
   return max(.0007,baseR*envelope*(whorl+axial))
  rows,cols=(112,80)if desktop else(56,40);verts=[];faces=[];uv=[]
  for j in range(rows+1):
   t=j/rows
   for k in range(cols+1):
    a=k/cols*2*math.pi;r=radial(t,a);verts.append((math.cos(a)*r,.06+height*t,math.sin(a)*r*aspect));uv.append((k/cols,t))
   if j:
    for k in range(cols):
     tmid=(j-.5)/rows;a=(k+.5)/cols*math.pi*2
     if math.cos(a)>0 and ((tmid-.17)/.20)**2+(math.sin(a)/.57)**2<1:continue
     q=(j-1)*(cols+1)+k;faces.append((q,q+cols+1,q+cols+2,q+1))
  shell=mesh('connected-whorled-shell',verts,faces,shellmat,uv,'shell')
  def colors(x,y,z):
   theta=math.atan2(z/aspect,x);t=(y-.06)/height;factor=1
   if id=='nerite':factor=.45 if math.sin(theta*11+math.sin(t*13)*1.2)>.15 else 1.18
   elif id=='assassin':factor=.40 if math.sin(t*turns*2*math.pi+theta*.3)>.2 else 1.25
   elif id in ['trumpet','cerith']and math.sin(theta*19+t*140)>.85:factor=.65
   return tuple(linear(int(shellColor.lstrip('#')[j:j+2],16)/255)*factor for j in(0,2,4))
  paint(shell,shellColor,.12,colors);rim=[]
  for j in range(65):
   a=j/64*2*math.pi;t=.17+.20*math.sin(a);theta=math.asin(.57*math.cos(a));r=radial(t,theta);rim.append((math.cos(theta)*r,.06+height*t,math.sin(theta)*r*aspect))
  center=Vector((baseR*.32,.06+height*.17,0))
 tube('aperture-lip',rim,[.003]*len(rim),shellmat,8 if desktop else 6)
 mesh('recessed-aperture',[tuple(center)]+rim[:-1],[(0,j+1,(j+1)%(len(rim)-1)+1)for j in range(len(rim)-1)],dark,role='shell')
 if hermit:return
 centers=[(-.22+j/20*.53,.025+.025*math.sin(j/20*math.pi),0)for j in range(21)];radii=[(.018*math.sin(j/20*math.pi)+.004,.085*math.sin(j/20*math.pi)+.007)for j in range(21)];loft('muscular-foot',centers,radii,footmat,18 if desktop else 10,'body')
 for side in [-1,1]:
  points=[(.21,.06,side*.025),(.30,.10,side*.07),(.37,.14,side*.09)];tube('cephalic-tentacle',points,[.008,.004,.001],footmat,7);ellipsoid('eye',(.35,.13,side*.086),(.004,.004,.004),eye,12,8)

def clam(item,lod):
 id=item['id'];desktop=lod=='desktop';shellmat=vertex_material('ribbed-shell','#a79c7d',.65);mantle=vertex_material('mantle',item['species']['color'],.36);dark=material('siphon-opening','#344a3c',.5);rows,cols=(42,72)if desktop else(24,40)
 for side in [-1,1]:
  verts=[];faces=[];uv=[]
  for j in range(rows+1):
   r=j/rows
   for k in range(cols+1):
    a=k/cols*math.pi;rib=(.016 if id=='giantclam'else.006)*math.cos(a*(11 if id=='giantclam'else 42))*math.sin(r*math.pi/2);growth=.002*math.sin(r*math.pi*54);x=math.cos(a)*.35*r;y=.08+math.sin(a)*.32*r;z=side*(.055+.12*math.sin(r*math.pi)*math.sin(a)+rib+growth);verts.append((x,y,z));uv.append((k/cols,r))
   if j:
    for k in range(cols):p=(j-1)*(cols+1)+k;faces.append((p,p+1,p+cols+2,p+cols+1))
  obj=mesh('bivalve-valve',verts,faces,shellmat,uv,'shell');paint(obj,'#a79c7d',.16)
 if id=='giantclam':
  for k in range(22):
   x=-.30+k/21*.6;points=[(x,.14,-.08),(x,.23+.025*math.sin(k*2),0),(x,.14,.08)];obj=tube('folded-mantle',points,[.022,.027,.022],mantle,10);paint(obj,item['species']['color'],.17)
  for x in [-.11,.14]:ellipsoid('siphon',(x,.25,0),(.026,.008,.015),dark,20,10)

def build(item,lod):
 id=item['id'];shape=item['species']['shape']
 if shape=='shrimp':shrimp(item,lod)
 elif shape=='snail':snail(item,lod)
 elif shape=='clam':clam(item,lod)
 elif shape=='crab':
  snail(item,lod,True);carapace=material('hermit-carapace','#597a89',.46);eyes=material('eye','#111916',.2);loft('hermit-thorax',[(.16,.09,0),(.26,.12,0),(.31,.10,0)],[(.04,.06),(.05,.075),(.025,.04)],carapace,16,'body')
  for side in [-1,1]:
   for k in range(4):tube('hermit-walking-leg',[(.23-k*.02,.10,side*.045),(.29-k*.025,.05,side*.13),(.34-k*.035,.008,side*.17)],[.009,.006,.0015],carapace,7)
   tube('cheliped',[(.28,.10,side*.055),(.36,.08,side*.11),(.40,.12,side*.12)],[.014,.018,.023],carapace,10);ellipsoid('hermit-eye',(.33,.16,side*.036),(.007,.012,.007),eyes,12,8)
 else:
  bodymat=vertex_material('echinoid-test','#405968',.52);spinemat=material('tapered-spines','#516c7c',.55);obj=ellipsoid('porous-test',(0,.17,0),(.22,.17,.22),bodymat,40 if lod=='desktop'else 24,24 if lod=='desktop'else 14);obj['surfaceRole']='body';paint(obj,'#405968',.2);count=250 if lod=='desktop'else 100
  for k in range(count):
   y=(k+.5)/count;phi=k*2.399;theta=math.acos(y*1.8-.8);direction=Vector((math.sin(theta)*math.cos(phi),math.cos(theta),math.sin(theta)*math.sin(phi)));start=Vector((0,.17,0))+Vector((direction.x*.21,direction.y*.16,direction.z*.21));end=start+direction*(.07+.025*math.sin(k*5)**2);tube('spine',[tuple(start),tuple(start.lerp(end,.75)),tuple(end)],[.005,.0025,.0003],spinemat,6 if lod=='desktop'else 4)
