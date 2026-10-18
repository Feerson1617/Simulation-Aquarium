/** Preserve the licensed photographic volume assets; densify only for smooth live deformation. */
export function refinePhotoVolume(group,T,profile){const levels=profile.platform==='ipad'?0:profile.id==='maximum'?3:profile.id==='ultra'?2:1;if(!levels)return;const cache=new Map();
 group.traverse(mesh=>{if(!mesh.isMesh||mesh.isSkinnedMesh)return;const originalGeometry=mesh.geometry;if(cache.has(originalGeometry)){mesh.geometry=cache.get(originalGeometry);return}let geometry=originalGeometry;
 for(let level=0;level<levels;level++){const source=geometry.index?geometry.toNonIndexed():geometry,attributes=Object.entries(source.attributes).filter(([name])=>['position','uv','color'].includes(name)),count=source.attributes.position.count,out=new T.BufferGeometry();
 for(const [name,attr]of attributes){const data=new Float32Array(count*4*attr.itemSize);let offset=0;for(let triangle=0;triangle<count;triangle+=3){const values=[0,1,2].map(j=>Array.from({length:attr.itemSize},(_,k)=>attr.array[(triangle+j)*attr.itemSize+k]));const midpoint=(a,b)=>a.map((v,k)=>(v+b[k])/2),[a,b,c]=values,ab=midpoint(a,b),bc=midpoint(b,c),ca=midpoint(c,a);for(const p of [a,ab,ca,ab,b,bc,ca,bc,c,ab,bc,ca])for(const v of p)data[offset++]=v}out.setAttribute(name,new T.Float32BufferAttribute(data,attr.itemSize))}
 out.computeVertexNormals();if(source!==geometry)source.dispose();geometry.dispose();geometry=out}
 mesh.geometry=geometry;cache.set(originalGeometry,geometry);
 });
}
