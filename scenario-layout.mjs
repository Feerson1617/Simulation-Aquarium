import {normalizeSpatialState,physicalPlacement} from './physical-scale.mjs';

/** Only the five freshly prepared expert starts. Existing saves are never rearranged. */
export function arrangePreparedScenario(state,catalog){
  // 100 × 40 cm tank: root at left, stones staggered, plants in remaining gaps.
  // Coordinates use the existing normalized tank system; sizes and biology stay intact.
  const positions=[[-.96,-.6459551475],[.64,.52],[1.44,.78],[-.16,-.52],[2.08,0],[2.08,-.78],[2.24,.808171465],[2.8563109684,-.26],[-2.4,.13],[-.64,.65],[.96,-.65]];
  for(let i=0;i<positions.length;i++){
    const e=state.entities[i];if(!e)throw Error('Die vorbereitete Einrichtung ist unvollständig.');
    [e.x,e.z]=positions[i];
    if(e.species==='spiderwood')e.rotation=Math.PI/2;
    if(e.species==='stone')e.rotation=0;
  }
  // Revalidate the new layout using the unchanged physical collision rules.
  state.spatial=null;normalizeSpatialState(state,null,catalog);
  const invalid=state.entities.filter(e=>!e.dead&&!physicalPlacement(state,e,catalog,e.x,e.z).valid);
  if(state.spatial.unplaced.length||invalid.length)throw Error('Die vorbereitete Einrichtung passt nicht vollständig. Der Start wurde nicht übernommen.');
  return state;
}
