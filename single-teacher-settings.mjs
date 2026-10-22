export const SINGLE_TEACHER_KEY='aquarium-single-teacher-v1';
export function readSingleTeacher(storage=localStorage){
 try{const value=JSON.parse(storage.getItem(SINGLE_TEACHER_KEY)||'null');return {version:1,hints:value?.version===1?value.hints!==false:true,ownExplanation:value?.version===1?value.ownExplanation!==false:true};}
 catch{return {version:1,hints:true,ownExplanation:true};}
}
export function writeSingleTeacher(value,storage=localStorage){const clean={version:1,hints:value.hints!==false,ownExplanation:value.ownExplanation!==false};storage.setItem(SINGLE_TEACHER_KEY,JSON.stringify(clean));return clean;}
