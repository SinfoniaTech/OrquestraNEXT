import {instant} from '../../data/orquestra/time.js';
export const EVENT_FIELDS=Object.freeze(['Criado em','Contactado','Aceito','Chegou ao Edifício','Saída']);
// Projeção de leitura: não modifica a fonte nem cria encerramento técnico.
export function eventAt(row,field,reference){
 if(!EVENT_FIELDS.includes(field))throw new RangeError('Marco desconhecido');
 const cutoff=instant(reference),value=row[field];
 if(value==null)return {state:'absent',value:null};
 return instant(value)<=cutoff?{state:'recorded',value}:{state:'future',value:null};
}
export function projectSnapshot(dataset,clock){
 if(dataset.metadata.kind!=='snapshot')throw new TypeError('Snapshot obrigatório');
 const reference=dataset.metadata.reference;
 // Sem antecipar status, TA/TB ou quaisquer outros campos de um snapshot futuro.
 if(instant(clock)<instant(reference))return {available:false,reference,records:[]};
 return {available:true,reference,records:dataset.records.map(row=>{
  const events=Object.fromEntries(EVENT_FIELDS.map(field=>[field,eventAt(row,field,reference)]));
  return {record:{...row,...Object.fromEntries(EVENT_FIELDS.map(field=>[field,events[field].value]))},events};
 })};
}
