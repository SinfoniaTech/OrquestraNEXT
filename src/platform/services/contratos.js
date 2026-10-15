import {fold} from './chamados.js';
import {adherence,average,groupRecords,validNumber} from './sla.js';
import {riskAnalysis,dailyEvolution} from './riscos.js';
import {estimatedCost,performanceDefinition,FINANCIAL_EXTERNAL} from './performance.js';
const present=v=>v!==null&&v!==undefined&&v!=='';
export function recurrenceRatio(rows){
 const eligible=rows.filter(r=>validNumber(r.Recorrencia_30d));
 const recurrent=eligible.filter(r=>r.Recorrencia_30d>0);
 return {rows:recurrent,count:recurrent.length,total:rows.length,valid:eligible.length,excluded:rows.length-eligible.length,value:rows.length&&eligible.length?recurrent.length/rows.length:null};
}
export function contractMetrics(rows){
 const risk=riskAnalysis(rows),known=rows.filter(r=>['Baixo','Médio','Alto'].includes(r.Impacto_Contrato));
 return {rows,count:rows.length,cost:estimatedCost(rows),adherence:adherence(rows),recurrence:recurrenceRatio(rows),ta:average(rows,'TA'),tb:average(rows,'TB'),risk,
  pressure:risk.pressure.length?'Sob pressão':!known.length?'Sem informação de impacto':known.length<rows.length?'Sem Alto informado · cobertura parcial':'Sem impacto Alto no recorte',impactCoverage:known.length};
}
export function contractAnalysis(rows,period){
 const metrics=contractMetrics(rows),assigned=rows.filter(r=>present(r.Contrato));
 const groups=groupRecords(assigned,'Contrato').map(g=>({...g,...contractMetrics(g.rows),ID_Chamado:g.label,clients:groupRecords(g.rows,'Cliente').map(c=>c.label),areas:groupRecords(g.rows,'Área').map(c=>c.label)}));
 return {...metrics,groups,contractCount:groups.length,unassigned:rows.length-assigned.length,
  categories:technicalGroups(rows,'Categoria do Chamado'),components:technicalGroups(rows,'Componente Principal'),equipment:technicalGroups(rows,'Unidade'),
  days:dailyEvolution(rows,period).map(d=>({...d,cost:estimatedCost(d.rows)}))};
}
export function technicalGroups(rows,field){return groupRecords(rows,field).map(g=>({...g,recurrence:recurrenceRatio(g.rows),high:g.rows.filter(r=>r.Impacto_Contrato==='Alto')}));}
export function contractPage(groups,{search='',sort='count',direction='desc',page=1,size=10}={}){
 const words=fold(search).trim().split(/\s+/).filter(Boolean);
 const selected=groups.filter(g=>words.every(w=>fold(g.label+' '+g.clients.join(' ')).includes(w)));
 const get=(g)=>({contract:g.label,client:g.clients.join(' '),count:g.count,cost:g.cost.value,sla:g.adherence.value,high:g.risk.pressure.length,recurrence:g.recurrence.value,pressure:g.risk.pressure.length>0?1:0})[sort];
 const ordered=[...selected].sort((a,b)=>{
  const x=get(a),y=get(b);if(x==null||y==null)return x===y?a.label.localeCompare(b.label):x==null?1:-1;
  const n=typeof x==='number'?x-y:x.localeCompare(y,'pt-BR');return n*(direction==='asc'?1:-1)||a.label.localeCompare(b.label,'pt-BR');
 });
 const pages=Math.max(1,Math.ceil(ordered.length/size)),current=Math.max(1,Math.min(page,pages));
 return {ordered,total:ordered.length,page:current,pages,rows:ordered.slice((current-1)*size,current*size)};
}
export function contractDefinition(config,state,view){
 return performanceDefinition({missing:'Custos, TA/TB e SLA seguem elegibilidade e N próprios. Recorrência: ausentes/negativos/inválidos não entram no numerador, permanecem no denominador total e têm cobertura explícita; sem valor válido ou sem população, indisponível. Chave de contrato ausente não conta como contrato. Agrupamentos técnicos mostram Não informado.',...config},state,view);
}
export const CONTRACT_EXTERNAL=[
 {...FINANCIAL_EXTERNAL[0],title:'Receita contratada'},
 {...FINANCIAL_EXTERNAL[1],title:'Margem operacional'},
 {title:'Rentabilidade',fields:['Receita','Resultado','Capital empregado'],source:'Financeiro e controladoria',reason:'Resultado e capital empregado não estão disponíveis na massa.'},
 {...FINANCIAL_EXTERNAL[2],title:'TCO completo'}
];
export const CONTRACT_TERMS={
 count:{title:'Chamados no período',fields:['Contrato','ID_Chamado'],definition:'Volume histórico do contrato no recorte, incluindo todos os status.',calculation:'Contar ID_Chamado por Contrato após filtros e busca.',unit:'chamados'},
 cost:{title:'Custo operacional estimado',fields:['Custo_Estimado_R$'],definition:'Estimativa sintética dos atendimentos; não TCO contábil nem despesa comprovada.',calculation:'Reutilizar estimatedCost da C3: soma finita não negativa, zero válido, N válido/total; sem elegíveis indisponível.',unit:'R$'},
 sla:{title:'Aderência ao SLA simulado',fields:['Status','SLA_min','Percentual_SLA'],definition:'Aderência demonstrativa dos concluídos elegíveis, sem validade contratual oficial OTIS.',calculation:'Reutilizar C1: Concluído, SLA_min finito >0 e Percentual_SLA finito >=0; cumpridos <=1 ÷ elegíveis ×100. Sem elegíveis, indisponível.',unit:'%'},
 recurrence:{title:'Recorrência operacional',fields:['Recorrencia_30d'],definition:'Proporção de chamados com recorrência materializada positiva. Não mede eventos únicos nem recalcula janela de 30 dias.',calculation:'Contar chamados com Recorrencia_30d finita >0 ÷ todos os chamados do recorte ×100. Ausentes e inválidos não satisfazem >0 e são informados na cobertura. Sem válidos, indisponível.',unit:'%'},
 high:{title:'Registros com impacto Alto',fields:['Impacto_Contrato'],definition:'Impacto Alto fornecido pela base, não prejuízo ou margem negativa.',calculation:'Reutilizar C2: contar registros cujo Impacto_Contrato = Alto.',unit:'chamados'},
 pressure:{title:'Pressão operacional',fields:['Contrato','Impacto_Contrato'],definition:'Classificação binária operacional aprovada, sem faixas ou pesos inferidos.',calculation:'Algum registro Alto: Sob pressão. Sem Alto e cobertura completa: Sem impacto Alto no recorte. Cobertura parcial ou ausente é explicitada. Não classificar margem.',unit:'presença de impacto Alto'},
 ta:{title:'TA médio — Tempo até a chegada (min)',fields:['TA'],definition:'TA sintético = chegada menos abertura, em minutos.',calculation:'Média aritmética dos TA materializados finitos não negativos; N independente, zero válido e nulos excluídos.',unit:'min'},
 tb:{title:'TB médio — Tempo de resolução simulado (min)',fields:['TB'],definition:'TB sintético = encerramento técnico simulado menos chegada. Encerramento não persistido.',calculation:'Média aritmética dos TB materializados finitos não negativos; N independente, zero válido e nulos excluídos.',unit:'min'},
 colors:{title:'Distribuição de criticidade',fields:['Criticidade_ORQUESTRA'],definition:'Cores materializadas, incluindo concluídos; não derivadas do SLA.',calculation:'Contar registros por cor fornecida, sem recalcular criticidade.',unit:'chamados'}
};
