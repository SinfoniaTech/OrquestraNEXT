import {adherence,groupRecords,validNumber,slaDefinition} from './sla.js';
import {riskAnalysis,dailyEvolution,distinct} from './riscos.js';
export function estimatedCost(records){
 const rows=records.filter(row=>validNumber(row['Custo_Estimado_R$']));
 return {rows,count:rows.length,excluded:records.length-rows.length,total:records.length,value:rows.length?rows.reduce((sum,row)=>sum+row['Custo_Estimado_R$'],0):null};
}
export const currencyLabel=value=>value===null?'—':value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export function executiveAnalysis(records,period){
 const risk=riskAnalysis(records),highIds=new Set(risk.pressure.map(r=>r.ID_Chamado)),redIds=new Set(risk.red.map(r=>r.ID_Chamado));
 const contracts=groupRecords(records.filter(r=>r.Contrato!==null&&r.Contrato!==undefined&&r.Contrato!==''),'Contrato')
  .map(group=>{
   const high=group.rows.filter(r=>highIds.has(r.ID_Chamado));
   return {...group,high,cost:estimatedCost(group.rows),adherence:adherence(group.rows),reds:group.rows.filter(r=>redIds.has(r.ID_Chamado)),
    clients:[...new Set(group.rows.map(r=>r.Cliente).filter(v=>v!=null))],reasons:groupRecords(high,'Motivo_Criticidade')};
  }).filter(group=>group.high.length)
  .sort((a,b)=>b.high.length-a.high.length||a.label.localeCompare(b.label,'pt-BR'));
 return {total:records.length,contractCount:distinct(records,'Contrato'),contractRows:records.filter(r=>r.Contrato!=null&&r.Contrato!==''),cost:estimatedCost(records),adherence:adherence(records),risk,contracts,
  days:dailyEvolution(records,period).map(day=>({...day,cost:estimatedCost(day.rows),adherence:adherence(day.rows)}))};
}
export function performanceDefinition(config,state,view){
 return slaDefinition({missing:'Ausentes permanecem ausentes; custo válido é finito e não negativo. Custo zero informado participa. Sem custo válido, valor indisponível; SLA sem elegíveis não calculável. Contrato ausente não conta como entidade.',...config},state,view);
}
export const FINANCIAL_EXTERNAL=Object.freeze([
 {title:'Receita',fields:['Receita contratual','Vigência','Competência'],source:'Sistema contratual e financeiro',reason:'Receita e vigência não existem no histórico de chamados.'},
 {title:'Margem',fields:['Receita reconhecida','Custos financeiros completos','Competência'],source:'Sistema financeiro e contabilidade',reason:'Custos estimados de atendimentos não permitem calcular margem real.'},
 {title:'TCO contábil',fields:['Custos diretos e indiretos','Ativos','Depreciação','Período contábil'],source:'Contabilidade e gestão de ativos',reason:'Não há composição completa do custo total de propriedade.'}
]);
export function externalDefinition(metric,state,view){
 return {...performanceDefinition({title:metric.title,fields:metric.fields,definition:metric.reason+' Integração necessária: '+metric.source+'. Não conectada; sem última sincronização.',calculation:'Indisponível: nenhuma fórmula aplicada ou valor simulado. População exibida apenas contextualiza o recorte histórico, não é cobertura financeira.',unit:'indisponível',missing:'Fonte externa ainda não disponibilizada. Ausência não é zero.'},state,view),
  classification:'EXT',source:metric.source+' · integração pendente',sourceFile:'Fonte externa não conectada; nenhum arquivo financeiro fornecido',sourceHash:'Não disponível'};
}
