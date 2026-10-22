import {getDataset,countBy,instant} from '../data/orquestra/index.js';
import {extendedData,getExtendedSnapshot} from './data/index.js';
import {projectSnapshot} from '../platform/services/temporal.js';
import {SOURCES,snapshotIndex,DURATIONS} from './temporalState.js';
export const COLORS=Object.freeze(['Verde','Amarelo','Laranja','Vermelho']);
const PRIORITY={Vermelho:0,Laranja:1,Amarelo:2,Verde:3};
export function readSnapshot(index,load=getDataset,sequence){
 const dataset=sequence?getExtendedSnapshot(sequence.sources[index]):load(SOURCES[index]);
 if(!dataset||dataset.metadata?.kind!=='snapshot'||!Array.isArray(dataset.records))throw Error('Snapshot indisponível ou inválido');
 instant(dataset.metadata.reference);
 const ids=new Set();
 for(const row of dataset.records){
  if(!row.ID_Chamado||ids.has(row.ID_Chamado)||!COLORS.includes(row.Criticidade_ORQUESTRA)||!['Aberto','Contactado','Técnico a caminho','Em atendimento','Concluído'].includes(row.Status))throw Error('Identidade, status ou criticidade inválidos no snapshot');
  ids.add(row.ID_Chamado);
 }
 const projected=projectSnapshot(dataset,dataset.metadata.reference);
 return {metadata:dataset.metadata,rows:projected.records.map(({record,events})=>({...record,events}))};
}
export function compareRows(previous,current){
 const before=new Map(previous.map(r=>[r.ID_Chamado,r]));
 return current.map(row=>{
  const old=before.get(row.ID_Chamado);
  return {id:row.ID_Chamado,isNew:!old,status:old&&old.Status!==row.Status?{from:old.Status,to:row.Status}:null,
   criticality:old&&old.Criticidade_ORQUESTRA!==row.Criticidade_ORQUESTRA?{from:old.Criticidade_ORQUESTRA,to:row.Criticidade_ORQUESTRA}:null,
   concluded:!!old&&old.Status!=='Concluído'&&row.Status==='Concluído'};
 }).filter(d=>d.isNew||d.status||d.criticality);
}
export function selectFeira(state,load=getDataset){
 const index=snapshotIndex(state),{metadata,rows}=readSnapshot(index,load,state.sequence);
 const previous=index?readSnapshot(index-1,load,state.sequence).rows:[];
 const changes=index||state.sequence?compareRows(previous,rows):[];
 const active=rows.filter(r=>r.Status!=='Concluído'),concluded=rows.filter(r=>r.Status==='Concluído');
 const alerts=active.filter(r=>['Laranja','Vermelho'].includes(r.Criticidade_ORQUESTRA));
 const ordered=[...rows].sort((a,b)=>Number(a.Status==='Concluído')-Number(b.Status==='Concluído')||PRIORITY[a.Criticidade_ORQUESTRA]-PRIORITY[b.Criticidade_ORQUESTRA]||a.ID_Chamado.localeCompare(b.ID_Chamado));
 const summary={total:rows.length,active:active.length,concluded:concluded.length,attention:alerts.length};
 const previousSummary=index?{total:previous.length,active:previous.filter(r=>r.Status!=='Concluído').length,concluded:previous.filter(r=>r.Status==='Concluído').length,attention:previous.filter(r=>r.Status!=='Concluído'&&['Laranja','Vermelho'].includes(r.Criticidade_ORQUESTRA)).length}:summary;
 const snapshotCount=state.sequence?.sources.length??3, snapshotId=state.sequence?.sources[index]??'T'+index;
 const duration=(state.sequence?.durations??DURATIONS)[state.phase];
 return {index,snapshotCount,snapshotId,finalWait:state.phase===snapshotCount,phaseLabel:state.sequence?getExtendedSnapshot(snapshotId).label:'Estado observado',cycleDurationMs:(state.sequence?.durations??DURATIONS).reduce((a,b)=>a+b,0),observedHighlight:state.sequence?getExtendedSnapshot(snapshotId).highlight:null,auditEvents:state.sequence?extendedData.events.filter(e=>e.ID_Snapshot===snapshotId):[],metadata,rows,ordered,alerts,summary,changes,activeDistribution:countBy(active,'Criticidade_ORQUESTRA'),distribution:countBy(rows,'Criticidade_ORQUESTRA'),
  delta:Object.fromEntries(Object.keys(summary).map(k=>[k,summary[k]-previousSummary[k]])),
  highlighted:state.phase<snapshotCount&&duration-state.remaining<8000};
}
export {metricDefinition} from './metricDefinitions.js';
