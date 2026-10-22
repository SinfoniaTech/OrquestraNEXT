import {contractAnalysis,contractMetrics,contractPage,contractDefinition,CONTRACT_TERMS} from './contratos.js';
import {average,groupRecords,validNumber} from './sla.js';
import {estimatedCost} from './performance.js';
export const COST_FIELD='Custo_Estimado_R$';
export const COST_DIMENSIONS=['Contrato','Área','Técnico','Unidade','Categoria do Chamado','Componente Principal','Supervisor','Rota','Tipo de Unidade'];
const present=v=>v!==null&&v!==undefined&&v!=='';
export function costMetrics(rows){return {...contractMetrics(rows),mean:average(rows,COST_FIELD)};}
export function costGroups(rows,field){
 if(!COST_DIMENSIONS.includes(field))throw new RangeError('Agrupamento de custo inválido');
 return groupRecords(rows,field).map(g=>({...g,...costMetrics(g.rows)})).sort((a,b)=>{
  if(a.cost.value===null||b.cost.value===null)return a.cost.value===b.cost.value?a.label.localeCompare(b.label,'pt-BR'):a.cost.value===null?1:-1;
  return b.cost.value-a.cost.value||a.label.localeCompare(b.label,'pt-BR');
 });
}
export function costAnalysis(rows,period){
 const base=contractAnalysis(rows,period),positive=new Set(base.recurrence.rows),zeros=rows.filter(r=>r.Recorrencia_30d===0),zeroSet=new Set(zeros);
 const assigned=rows.filter(r=>present(r['Técnico']));
 const recurrentCost=estimatedCost(base.recurrence.rows);
 const eligible=new Set(base.adherence.rows);
 const recurrence=[['Recorrentes (>0)',base.recurrence.rows],['Não recorrentes (=0)',zeros],['Recorrência ausente ou inválida',rows.filter(r=>!positive.has(r)&&!zeroSet.has(r))]].map(([label,bucket])=>({label,...costMetrics(bucket)}));
 const performance=[['Dentro do SLA simulado',base.adherence.within],['Fora do SLA simulado',base.adherence.over],['Sem elegibilidade SLA',rows.filter(r=>!eligible.has(r))]].map(([label,bucket])=>({label,...costMetrics(bucket)}));
 const pairs=['TA','TB'].map(field=>{
  const pairRows=rows.filter(r=>validNumber(r[COST_FIELD])&&validNumber(r[field]));
  return {field,rows:pairRows,meanCost:average(pairRows,COST_FIELD),meanTime:average(pairRows,field)};
 });
 return {...base,mean:average(rows,COST_FIELD),groups:base.groups.map(g=>({...g,mean:average(g.rows,COST_FIELD)})),
  technicianCost:estimatedCost(assigned),technicianRows:assigned,technicianCount:new Set(assigned.map(r=>r['Técnico'])).size,
  recurrentCost,recurrenceBuckets:recurrence,performance,pairs,
  recurrentShare:base.cost.value!==null&&base.cost.value>0&&recurrentCost.value!==null?recurrentCost.value/base.cost.value:null};
}
export function costCalls(rows){return rows.map(row=>({...costMetrics([row]),label:row.ID_Chamado,ID_Chamado:row.ID_Chamado,clients:[row.Cliente??'Não informado'],record:row}));}
export const costTablePage=(groups,ui)=>contractPage(groups,ui);
export function costDefinition(config,state,view){
 return contractDefinition({missing:'Custo válido: finito não negativo; zero informado participa, nulos/negativos/inválidos são excluídos e têm N próprio. Soma e média sem elegíveis: indisponíveis. Recorrência ausente/negativa/inválida fica em grupo separado de zero. Sem custo total positivo, participação monetária indisponível. TA/TB e SLA seguem suas elegibilidades aprovadas.',...config,calculation:config.calculation+' Cobertura de custo no contexto: '+estimatedCost(view.records).count+'/'+view.records.length+' registros.'},state,view);
}
export const COST_TERMS={
 ...CONTRACT_TERMS,
 mean:{title:'Custo médio estimado por chamado',fields:[COST_FIELD],definition:'Média dos custos sintéticos válidos dos chamados do contexto, sem transformar ausentes em zero.',calculation:'Reutilizar average C1 sobre Custo_Estimado_R$ finito não negativo: soma dos custos válidos ÷ N de custos válidos. Zero informado incluído; sem elegíveis indisponível.',unit:'R$/chamado válido'},
 technician:{title:'Custo estimado associado a técnicos',fields:[COST_FIELD,'Técnico'],definition:'Custo agregado dos chamados com técnico informado. Não é remuneração, custo de mão de obra nem custo real individual do profissional.',calculation:'Selecionar Técnico não ausente e somar os custos válidos com estimatedCost. N com custo/N com técnico; quantidade distinta de nomes não implica disponibilidade.',unit:'R$'},
 recurrent:{title:'Custo estimado associado a recorrências',fields:[COST_FIELD,'Recorrencia_30d'],definition:'Custos dos chamados com recorrência materializada positiva; não custo financeiro de retrabalho comprovado.',calculation:'Reutilizar recurrenceRatio C4: Recorrencia_30d finita >0; somar custos válidos desses chamados. Não somar o campo de recorrência como eventos. Participação = custo recorrente válido ÷ custo total válido ×100, apenas com custo total >0.',unit:'R$ e % do custo válido'},
 pressureCount:{title:'Contratos sob pressão operacional',fields:['Contrato','Impacto_Contrato'],definition:'Contratos com ao menos um registro Alto, conforme C2; não prejuízo financeiro.',calculation:'Reutilizar riskAnalysis: contar Contrato distinto não ausente em Impacto_Contrato = Alto.',unit:'contratos distintos'}
};
export const COST_EXTERNAL=[
 {title:'TCO contábil completo',fields:['Custos diretos e indiretos','Ativos','Depreciação','Competência'],source:'Financeiro, contabilidade e ativos',reason:'Integração financeira necessária. Somente custo estimado agregado por chamado está disponível.'},
 {title:'Composição financeira de custos',fields:['Mão de obra','Peças','Deslocamento','Logística','Terceiros','Apropriação de recorrências'],source:'Financeiro, folha, compras, estoque, logística e ordens de serviço',reason:'Não existe abertura financeira do custo agregado. Recorrência operacional é um recorte de chamados, não uma parcela contábil adicional.'}
];
