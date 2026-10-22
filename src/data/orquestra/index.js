import history from './generated/HIST_60_DIAS.json' with {type:'json'};
import t0 from './generated/T0_Abertura.json' with {type:'json'};
import t1 from './generated/T1_Acompanhamento.json' with {type:'json'};
import t2 from './generated/T2_Desfecho.json' with {type:'json'};
import schema from './schema.json' with {type:'json'};
import { boundary, instant } from './time.js';
export * from './time.js';

function freeze(value) {
 if(value && typeof value==='object' && !Object.isFrozen(value)){
  Object.values(value).forEach(freeze);Object.freeze(value);
 }
 return value;
}
const datasets=freeze({HIST_60_DIAS:history,T0_Abertura:t0,T1_Acompanhamento:t1,T2_Desfecho:t2});
export const FIELDS=freeze([...schema.fields]);
export const SOURCES=Object.freeze(Object.keys(datasets));
export const METRIC_CLASSES=Object.freeze({BASE:'campo fornecido',CALC:'derivação com regra explícita',EXT:'integração indisponível'});
export function getDataset(source='HIST_60_DIAS') {
 if(!Object.hasOwn(datasets,source)) throw new RangeError('Fonte desconhecida: '+source);
 return datasets[source];
}
function assertField(field) {
 if(!FIELDS.includes(field)) throw new RangeError('Campo desconhecido: '+field);
}
export function getById(source,id) {
 return getDataset(source).records.find(r=>r.ID_Chamado===id)??null;
}
// AND entre campos; OR dentro da lista de valores. Sem combinação de fontes.
export function query({source='HIST_60_DIAS',filters={},from,to}={}) {
 const data=getDataset(source);
 for(const [field,values] of Object.entries(filters)){
  assertField(field);
  if(!Array.isArray(values)) throw new TypeError('Filtro deve ser lista: '+field);
 }
 const start=from==null?-Infinity:boundary(from);
 const end=to==null?Infinity:boundary(to,true);
 if(start>end) throw new RangeError('Período invertido');
 return data.records.filter(row=>{
  const created=instant(row['Criado em']);
  return created>=start && created<=end && Object.entries(filters).every(([key,values])=>!values.length || values.includes(row[key]));
 });
}
// Recebe conjunto já selecionado para evitar regras duplicadas nas futuras telas.
export function countBy(records,field) {
 assertField(field);
 const result=Object.create(null);
 for(const row of records){const key=row[field]===null?'(nulo)':String(row[field]);result[key]=(result[key]??0)+1;}
 return {...result};
}
export function describeField(field,source='HIST_60_DIAS') {
 assertField(field);
 const data=getDataset(source);
 return Object.freeze({field,classification:'BASE',sheet:source,reference:data.metadata.reference,
  timezone:data.metadata.timezone,synthetic:true,sourceSha256:data.metadata.sourceSha256,
  calculation:'valor materializado fornecido; não recalculado'});
}

export function distribution({field,source='HIST_60_DIAS',filters={},from,to}={}) {
 assertField(field);
 const records=query({source,filters,from,to});
 const base=getDataset(source).metadata;
 return freeze({values:countBy(records,field),metadata:{
  classification:'CALC',calculation:'contagem de registros por valor do campo no recorte',
  field,sheet:source,reference:base.reference,timezone:base.timezone,
  sourceSha256:base.sourceSha256,synthetic:true,population:records.length,
  nullCount:records.filter(r=>r[field]===null).length,
  filters:Object.fromEntries(Object.entries(filters).map(([k,v])=>[k,[...v]])),
  period:{from:from??null,to:to??null},dateField:'Criado em'
 }});
}
