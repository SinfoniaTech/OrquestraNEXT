import {getDataset,query,countBy,HISTORY_REFERENCE,HISTORY_RANGE,instant,formatLocal} from '../../data/orquestra/index.js';
export const SOURCE='HIST_60_DIAS';
export const HISTORY=getDataset(SOURCE);
export const STATUS_ORDER=['Aberto','Contactado','Técnico a caminho','Em atendimento','Concluído'];
export const CRITICALITY_ORDER=['Verde','Amarelo','Laranja','Vermelho'];
export const PERIODS=[{days:1,label:'Hoje'},{days:7,label:'Últimos 7 dias'},{days:15,label:'Últimos 15 dias'},{days:30,label:'Últimos 30 dias'},{days:60,label:'Últimos 60 dias'}];
export const FILTER_CONFIG=[
 {field:'Criticidade_ORQUESTRA',label:'Criticidade',options:CRITICALITY_ORDER},
 {field:'Status',label:'Status',options:STATUS_ORDER},
 {field:'Cliente',label:'Cliente'},
 {field:'Área',label:'Área'},
 {field:'Tipo de Unidade',label:'Tipo de Equipamento'},
 {field:'Categoria do Chamado',label:'Categoria',advanced:true}
];
export const FUTURE_FILTER_FIELDS=['Contrato','Supervisor','Técnico','Unidade','Componente Principal','Origem','Impacto_Contrato'];
export const RECURRENCES=[{id:'zero',label:'Sem recorrência (0)'},{id:'one-two',label:'1–2 ocorrências'},{id:'three-plus',label:'3 ou mais ocorrências'}];
export const SEARCH_FIELDS=['ID_Chamado','Cliente','Contrato','Unidade','Categoria do Chamado','Problema','Descrição do Problema','Área','Técnico','Supervisor','Componente Principal','Origem'];
export const SORT_FIELDS=['Criado em','ID_Chamado','Cliente','Unidade','Categoria do Chamado','Status','Criticidade_ORQUESTRA','Técnico'];
export const DEFAULT_STATE={days:60,filters:{},recurrence:[],search:'',sortField:'Criado em',sortDirection:'desc',page:1,pageSize:10};
export const fold=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
const collator=new Intl.Collator('pt-BR',{numeric:true,sensitivity:'base'});
export function periodRange(days=60){
 if(!PERIODS.some(p=>p.days===Number(days)))throw new RangeError('Período inválido');
 const referenceDate=HISTORY_REFERENCE.slice(0,10);
 const start=new Date(referenceDate+'T12:00:00Z');
 start.setUTCDate(start.getUTCDate()-(Number(days)-1));
 const from=start.toISOString().slice(0,10);
 return {from:from<HISTORY_RANGE.from?HISTORY_RANGE.from:from,to:referenceDate,reference:HISTORY_REFERENCE};
}
export function optionsFor(field){
 return [...new Set(HISTORY.records.map(r=>r[field]).filter(v=>v!==null))].sort(collator.compare);
}
export function recurrenceMatches(value,bins){
 if(!bins.length)return true;
 if(value===null)return false;
 return bins.some(bin=>bin==='zero'?value===0:bin==='one-two'?value>=1&&value<=2:bin==='three-plus'?value>=3:false);
}
export function consultationReducer(state,action){
 switch(action.type){
  case 'period': periodRange(action.value);return {...state,days:Number(action.value),page:1};
  case 'field': return {...state,filters:{...state.filters,[action.field]:[...action.values]},page:1};
  case 'remove': return {...state,filters:{...state.filters,[action.field]:(state.filters[action.field]??[]).filter(v=>v!==action.value)},page:1};
  case 'recurrence': return {...state,recurrence:[...action.values],page:1};
  case 'search': return {...state,search:action.value,page:1};
  case 'sort': if(!SORT_FIELDS.includes(action.field))throw new RangeError('Ordenação inválida');return {...state,sortField:action.field,sortDirection:action.direction??(state.sortField===action.field&&state.sortDirection==='asc'?'desc':'asc'),page:1};
  case 'page': return {...state,page:Math.max(1,Math.trunc(action.value)||1)};
  case 'pageSize': if(![10,25,50].includes(Number(action.value)))throw new RangeError('Tamanho inválido');return {...state,pageSize:Number(action.value),page:1};
  case 'reset': return {...DEFAULT_STATE,filters:{},recurrence:[]};
  default: return state;
 }
}
export function selectHistorical(state){
 const {from,to}=periodRange(state.days);
 const words=fold(state.search).trim().split(/\s+/).filter(Boolean);
 return query({source:SOURCE,from,to,filters:state.filters}).filter(row=>
  recurrenceMatches(row.Recorrencia_30d,state.recurrence)&&
  (!words.length||words.every(word=>fold(SEARCH_FIELDS.map(f=>row[f]??'').join(' ')).includes(word)))
 );
}
export function summarize(records){
 const byStatus=countBy(records,'Status'),byCriticality=countBy(records,'Criticidade_ORQUESTRA');
 const statuses=Object.fromEntries(STATUS_ORDER.map(s=>[s,byStatus[s]??0]));
 const criticalities=Object.fromEntries(CRITICALITY_ORDER.map(s=>[s,byCriticality[s]??0]));
 const active=records.filter(r=>r.Status!=='Concluído');
 const attention=active.filter(r=>['Laranja','Vermelho'].includes(r.Criticidade_ORQUESTRA)).sort((a,b)=>
  CRITICALITY_ORDER.indexOf(b.Criticidade_ORQUESTRA)-CRITICALITY_ORDER.indexOf(a.Criticidade_ORQUESTRA)||instant(a['Criado em'])-instant(b['Criado em'])||collator.compare(a.ID_Chamado,b.ID_Chamado));
 return {total:records.length,statuses,criticalities,active:active.length,attention};
}
export function sortRecords(records,field='Criado em',direction='desc'){
 if(!SORT_FIELDS.includes(field)||!['asc','desc'].includes(direction))throw new RangeError('Ordenação inválida');
 return [...records].sort((a,b)=>{
  const x=a[field],y=b[field];
  if(x===null||y===null)return x===y?collator.compare(a.ID_Chamado,b.ID_Chamado):x===null?1:-1;
  const order=field==='Criticidade_ORQUESTRA'?CRITICALITY_ORDER.indexOf(x)-CRITICALITY_ORDER.indexOf(y):
   field==='Criado em'?instant(x)-instant(y):collator.compare(String(x),String(y));
  return order*(direction==='desc'?-1:1)||collator.compare(a.ID_Chamado,b.ID_Chamado);
 });
}
export function selectView(state){
 const records=selectHistorical(state),summary=summarize(records);
 const ordered=sortRecords(records,state.sortField,state.sortDirection);
 const pages=Math.max(1,Math.ceil(records.length/state.pageSize)),page=Math.min(Math.max(1,state.page),pages);
 return {records,summary,ordered,page,pages,rows:ordered.slice((page-1)*state.pageSize,page*state.pageSize),period:periodRange(state.days)};
}
export function dateLabel(value){
 if(value==null)return 'Não informado';
 const local=formatLocal(value),[year,month,day]=local.slice(0,10).split('-');
 return day+'/'+month+'/'+year+' '+local.slice(11,16);
}
export function civilLabel(value){const [y,m,d]=value.split('-');return d+'/'+m+'/'+y;}
export function etaLabel(row){
 if(row.Status==='Concluído'||row['Chegou ao Edifício']!==null)return 'Não se aplica';
 return row.ETA_min===null?'Não informado':row.ETA_min+' min'+(row.ETA_min===0?' (base)':'');
}
export function slaRemainingLabel(row){return row.Status==='Concluído'?'Encerrado':'Regra em validação';}
export function percentageLabel(value){return value===null?'Não informado':(value*100).toLocaleString('pt-BR',{maximumFractionDigits:1})+'%';}
export function metricDefinition({title,status,criticality,attention=false,groupBy},state,view){
 const fields=['ID_Chamado','Criado em',...Object.keys(state.filters).filter(k=>state.filters[k].length)];
 if(groupBy)fields.push(groupBy);
 if(status)fields.push('Status');
 if(criticality)fields.push('Criticidade_ORQUESTRA');
 if(attention)fields.push('Status','Criticidade_ORQUESTRA');
 if(state.recurrence.length)fields.push('Recorrencia_30d');
 if(state.search.trim())fields.push(...SEARCH_FIELDS);
 const predicate=groupBy?'agrupar IDs únicos por '+groupBy:attention?'Status diferente de Concluído e Criticidade_ORQUESTRA em {Laranja, Vermelho}':status?'Status = '+status:criticality?'Criticidade_ORQUESTRA = '+criticality:'todos os IDs do recorte';
 return {title,classification:'CALC',definition:attention?'Chamados ainda não concluídos que exigem atenção na referência histórica. Não é monitoramento em tempo real.':'Contagem histórica de chamados no recorte selecionado.',
  fields:[...new Set(fields)],calculation:'Contar ID_Chamado único: '+predicate+', após período, filtros e busca.'+(groupBy?' Participação = contagem do grupo ÷ total do recorte × 100. Com total zero, proporção não calculável.':''),
  population:view.summary.total,period:civilLabel(view.period.from)+' a '+civilLabel(view.period.to),
  unit:'chamados',missing:'Nulos permanecem ausentes; não são convertidos em zero. ID, status e criticidade não possuem nulos nesta base.',
  source:SOURCE,sourceFile:HISTORY.metadata.sourceFile,sourceHash:HISTORY.metadata.sourceSha256,
  reference:dateLabel(HISTORY_REFERENCE),timezone:'America/Sao_Paulo',filters:state.filters,recurrence:state.recurrence,search:state.search};
}
