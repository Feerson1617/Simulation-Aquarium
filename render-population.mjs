/** Limit only the iPad view; all individuals stay in the biological save. */
export function displayedEntities(entities,catalog,profile,selected){
 if(profile.platform!=='ipad')return entities;
 const fish=entities.filter(e=>catalog[e.species]?.category==='fish');if(fish.length<=64)return entities;
 const picked=new Set();const add=e=>{if(e&&picked.size<64)picked.add(e.uid)};
 add(fish.find(e=>e.uid===selected));
 fish.filter(e=>!e.dead&&e.genetics?.founder===false&&e.age<7).slice(-12).forEach(add);
 fish.filter(e=>!e.dead&&!(e.genetics?.founder===false&&e.age<7)).slice(0,40).forEach(add);
 [...fish].reverse().forEach(add);
 return entities.filter(e=>catalog[e.species]?.category!=='fish'||picked.has(e.uid));
}
/** Cancel the legacy tank's horizontal stretch before rendering fish anatomy.
 * Positions still use the original save coordinates; biological state is read-only.
 * With parent S and fish rotation R, the child correction is R^-1 S^-1 R.
 */
export function correctFishProportions(view){
 const scaleX=view.life?.scale?.x||1;
 for(const object of view.objects.values()){
  const group=object.group,content=object.fishContent;if(!content)continue;
  const scratch=object.proportionMatrices||(object.proportionMatrices={rotation:group.matrix.clone(),inverse:group.matrix.clone(),scale:group.matrix.clone()});
  scratch.rotation.makeRotationFromQuaternion(group.quaternion);scratch.inverse.copy(scratch.rotation).invert();scratch.scale.makeScale(1/scaleX,1,1);
  content.matrix.copy(scratch.inverse).multiply(scratch.scale).multiply(scratch.rotation);content.matrixAutoUpdate=false;content.matrixWorldNeedsUpdate=true;
 }
}
