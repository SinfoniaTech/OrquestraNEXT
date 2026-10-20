export const PROTOCOL_VERSION=1;
export function uuid(){
 if(globalThis.crypto.randomUUID)return globalThis.crypto.randomUUID();
 const bytes=crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
 const s=[...bytes].map(n=>n.toString(16).padStart(2,'0')).join('');return [s.slice(0,8),s.slice(8,12),s.slice(12,16),s.slice(16,20),s.slice(20)].join('-');
}
export function validateState(value){
 if(value?.protocolVersion!==PROTOCOL_VERSION||typeof value.sessionId!=='string'||!Number.isSafeInteger(value.revision)||value.revision<1||!Array.isArray(value.view?.rows)||!Array.isArray(value.locks)||!value.state||(!Number.isInteger(value.state.phase)||value.state.phase<0||value.state.phase>(value.view?.snapshotCount??3))||![1,2].includes(value.state.speed)||!Number.isFinite(value.state.remaining)||value.state.remaining<0)throw Error('Estado de sincronização incompatível');
 if(value.view.rows.length!==value.view.summary?.total||value.view.index!==Math.min(value.state.phase,(value.view.snapshotCount??3)-1))throw Error('Snapshot inconsistente');
 if(value.state.sequence&&(value.state.sequence.sources?.length!==value.view.snapshotCount||value.view.snapshotId!==value.state.sequence.sources[value.view.index]||value.state.sequence.durations?.length!==value.view.snapshotCount+1))throw Error('Sequência de snapshots inconsistente');
 return value;
}
export function acceptState(previous,incoming){
 validateState(incoming);
 if(previous&&incoming.sessionId!==previous.sessionId)throw Error('A sessão mudou. Conecte novamente.');
 if(previous&&(previous.appVersion!==incoming.appVersion||previous.datasetVersion!==incoming.datasetVersion))throw Error('Versão da aplicação ou dos dados mudou. Recarregue.');
 return !previous||incoming.revision>previous.revision?incoming:previous;
}
