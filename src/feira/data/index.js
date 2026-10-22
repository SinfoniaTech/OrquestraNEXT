import data from './generated.json' with {type:'json'};
function freeze(value){if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.freeze(value);Object.values(value).forEach(freeze);}return value;}
export const extendedData=freeze(data);
export const EXTENDED_SEQUENCE=Object.freeze({id:'feira-estendida-v1',sources:Object.freeze(data.snapshots.map(s=>s.id)),durations:Object.freeze([...data.snapshots.map(s=>s.durationMs),data.finalWaitMs])});
export function getExtendedSnapshot(id){return extendedData.snapshots.find(s=>s.id===id);}
