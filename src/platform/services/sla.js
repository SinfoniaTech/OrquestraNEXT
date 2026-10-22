import {CRITICALITY_ORDER,metricDefinition,summarize} from './chamados.js';

// Regras contratuais continuam pendentes: nenhum prazo é inferido de TA/TB.
export const SLA_POLICY={approved:true,scope:'demonstração',threshold:1};
export const SLA_BANDS=[{id:'low',label:'0–50%',min:0,max:0.5},{id:'medium',label:'>50–80%',min:0.5,max:0.8},{id:'high',label:'>80–100%',min:0.8,max:1},{id:'over',label:'>100%',min:1,max:Infinity}];
export function consumptionBand(value){
 if(!validNumber(value))return null;
 return SLA_BANDS.find((band,i)=>(i===0?value>=band.min:value>band.min)&&value<=band.max)?.id??null;
}
export function adherence(records){
 const rows=records.filter(row=>row.Status==='Concluído'&&validNumber(row.SLA_min)&&row.SLA_min>0&&validNumber(row.Percentual_SLA));
 const within=rows.filter(row=>row.Percentual_SLA<=SLA_POLICY.threshold),over=rows.filter(row=>row.Percentual_SLA>SLA_POLICY.threshold);
 return {rows,within,over,count:rows.length,excluded:records.length-rows.length,value:rows.length?within.length/rows.length:null};
}
export const validNumber=value=>typeof value==='number'&&Number.isFinite(value)&&value>=0;
export function average(records,field){
 const rows=records.filter(row=>validNumber(row[field]));
 return {rows,count:rows.length,excluded:records.length-rows.length,value:rows.length?rows.reduce((sum,row)=>sum+row[field],0)/rows.length:null};
}
export function groupRecords(records,field){
 const groups=new Map();
 for(const row of records){const key=row[field]??'Não informado';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(row);}
 return [...groups].map(([label,rows])=>({label,rows,count:rows.length})).sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label,'pt-BR'));
}
export function slaAnalysis(records){
 const summary=summarize(records);
 return {total:records.length,adherence:adherence(records),bands:SLA_BANDS.map(band=>({...band,rows:records.filter(r=>consumptionBand(r.Percentual_SLA)===band.id)})),ta:average(records,'TA'),tb:average(records,'TB'),consumption:average(records,'Percentual_SLA'),
  passengers:records.filter(r=>r['Passageiro Preso']==='Sim'),stopped:records.filter(r=>r['Carro Parado']==='Sim'),
  criticalities:CRITICALITY_ORDER.map(label=>({label,rows:records.filter(r=>r.Criticidade_ORQUESTRA===label)})),
  reasons:groupRecords(records,'Motivo_Criticidade'),
  priority:summary.attention,active:summary.active};
}
export function timeGroups(records,field){
 return groupRecords(records,field).map(group=>({...group,ta:average(group.rows,'TA'),tb:average(group.rows,'TB')}));
}
export function slaDefinition({title,fields,calculation,definition,unit='chamados',eligible,missing},state,view){
 const base=metricDefinition({title},state,view);
 return {...base,definition,fields:[...new Set([...base.fields,...fields])],
  unit,missing:missing??'Nulos e números inválidos são excluídos da média; zero informado é válido. Sem elegíveis, resultado não calculável.',
  population:view.summary.total,
  calculation:calculation+(eligible===undefined?'':' Elegíveis: '+eligible+' de '+view.summary.total+' registros filtrados.')};
}
export const numberLabel=value=>value===null?'—':value.toLocaleString('pt-BR',{maximumFractionDigits:1});
export const percentLabel=value=>value===null?'—':numberLabel(value*100)+'%';
