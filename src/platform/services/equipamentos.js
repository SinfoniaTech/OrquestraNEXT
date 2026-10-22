import {sortRecords,CRITICALITY_ORDER} from './chamados.js';
import {instant} from '../../data/orquestra/index.js';
import {groupRecords,validNumber} from './sla.js';
import {riskAnalysis,dailyEvolution,distinct} from './riscos.js';
import {contractMetrics,contractPage,contractDefinition,recurrenceRatio,CONTRACT_TERMS} from './contratos.js';
const present=v=>v!==null&&v!==undefined&&v!=='';
export function equipmentGroup(group){
 const rows=group.rows,history=sortRecords(rows,'Criado em','desc'),latest=history[0];
 const recurrenceRows=rows.filter(r=>validNumber(r.Recorrencia_30d));
 return {...group,...contractMetrics(rows),ID_Chamado:group.label,history,latest,
  maxRecurrence:recurrenceRows.length?Math.max(...recurrenceRows.map(r=>r.Recorrencia_30d)):null,recurrenceCoverage:recurrenceRows.length,
  clients:groupRecords(rows,'Cliente').map(g=>g.label),types:groupRecords(rows,'Tipo de Unidade').map(g=>g.label),
  components:groupRecords(rows,'Componente Principal'),insights:groupRecords(rows,'Insight_ORQUESTRA')};
}
export function equipmentAnalysis(rows,period){
 const risk=riskAnalysis(rows),assigned=rows.filter(r=>present(r.Unidade));
 const units=groupRecords(assigned,'Unidade').map(equipmentGroup);
 const types=groupRecords(rows,'Tipo de Unidade').map(group=>{
  const positiveRows=recurrenceRatio(group.rows).rows,denominator=distinct(group.rows,'Unidade'),numerator=distinct(positiveRows,'Unidade');
  const knownUnits=distinct(group.rows.filter(r=>validNumber(r.Recorrencia_30d)),'Unidade');
  return {...group,units:denominator,positiveUnits:numerator,positiveRows,knownUnits,value:denominator&&knownUnits?numerator/denominator:null,
   colors:CRITICALITY_ORDER.map(label=>({label,rows:group.rows.filter(r=>r.Criticidade_ORQUESTRA===label)}))};
 });
 return {rows,total:rows.length,units,unitCount:units.length,withoutUnit:rows.length-assigned.length,risk,
  typeCount:distinct(rows,'Tipo de Unidade'),types,components:groupRecords(rows,'Componente Principal'),days:dailyEvolution(rows,period)};
}
export function equipmentPage(groups,ui={}){
 return contractPage(groups,{sort:'registered',direction:'desc',...ui,valueFor:(g,key)=>({
  unit:g.label,client:g.clients.join(' '),type:g.types.join(' '),count:g.count,registered:g.maxRecurrence,
  last:g.latest?.['Criado em']==null?null:instant(g.latest['Criado em']),
  criticality:CRITICALITY_ORDER.includes(g.latest?.Criticidade_ORQUESTRA)?CRITICALITY_ORDER.indexOf(g.latest.Criticidade_ORQUESTRA):null
 })[key]});
}
export function equipmentDefinition(config,state,view){
 return contractDefinition({missing:'Unidade e tipo ausentes não contam nas entidades distintas; grupos técnicos exibem Não informado. Recorrência válida é finita não negativa; nulos/inválidos não viram zero. Máximo sem valores válidos é indisponível. Proporção por tipo usa todas as unidades do tipo no denominador, com cobertura de unidades com algum valor válido explícita; sem unidades ou qualquer cobertura, indisponível. TA/TB/SLA/custo mantêm N próprio e regras anteriores.',...config},state,view);
}
export const EQUIPMENT_TERMS={
 ...CONTRACT_TERMS,
 units:{title:'Unidades com chamados no período',fields:['Unidade'],definition:'Unidades distintas presentes no recorte; não total de equipamentos instalados ou ativos da OTIS.',calculation:'Contar Unidade distinta não ausente após filtros/busca e período.',unit:'unidades distintas'},
 elevated:{title:'Unidades com recorrência elevada',fields:['Unidade','Recorrencia_30d'],definition:'Unidades com pelo menos um registro filtrado de recorrência materializada >=3.',calculation:'Reutilizar riskAnalysis C2: filtrar Recorrencia_30d finita >=3, contar Unidade distinta não ausente; não somar o campo como chamados extras.',unit:'unidades distintas'},
 occurrences:{title:'Ocorrências no período',fields:['ID_Chamado'],definition:'Chamados encontrados no recorte, incluindo todos os status. Não filtra pela presença do campo Falha.',calculation:'Contar registros da população filtrada; ID_Chamado é único na fonte histórica.',unit:'chamados'},
 types:{title:'Tipos de equipamento',fields:['Tipo de Unidade'],definition:'Tipos distintos registrados nos chamados, sem adicionar categorias externas à massa.',calculation:'Contar Tipo de Unidade distinto não ausente no recorte.',unit:'tipos distintos'},
 registered:{title:'Recorrência registrada por unidade',fields:['Unidade','Recorrencia_30d','Criado em','ID_Chamado'],definition:'Quantidade de chamados e recorrência materializada são conceitos distintos. Máximo é o maior valor observado no contexto; último é o valor BASE do chamado mais recente, sem inferir eventos adicionais.',calculation:'Agrupar por Unidade; contar chamados; máximo de Recorrencia_30d válida, não soma. Último registro por Criado em desc, ID asc no empate. Cobertura =N de valores válidos/total da unidade. Máximo sem elegíveis é indisponível.',unit:'valor materializado e chamados'},
 typeRecurrence:{title:'Unidades com recorrência positiva (>0) por tipo',fields:['Unidade','Tipo de Unidade','Recorrencia_30d'],definition:'Proporção de unidades com algum registro positivo dentro de cada tipo, não proporção de chamados nem recorrência elevada.',calculation:'Numerador: Unidade distinta com Recorrencia_30d finita >0 no tipo. Denominador: todas as Unidades distintas do mesmo tipo no recorte. Cobertura: unidades do tipo com algum valor válido. Não somar percentuais de tipos; uma unidade com tipos divergentes pode pertencer a mais de um grupo.',unit:'% de unidades dentro do tipo'},
 last:{title:'Última ocorrência e criticidade',fields:['Criado em','ID_Chamado','Criticidade_ORQUESTRA','Insight_ORQUESTRA'],definition:'Último chamado por criação dentro do recorte; cor e insight são os campos fornecidos desse mesmo registro. Não é estado atual ou criticidade recalculada da unidade.',calculation:'Ordenar Criado em desc, ID asc no empate, selecionar primeiro. Exibir criticidade e insight BASE sem alteração. Ordenar cor da última ocorrência usa ordem Verde/Amarelo/Laranja/Vermelho, sem nova classificação.',unit:'data de criação e campos BASE'}
};
export const EQUIPMENT_AVAILABILITY={title:'Disponibilidade operacional',fields:['Tempo em operação','Intervalos de indisponibilidade','Calendário de operação','Cadastro de equipamentos'],source:'Telemetria, monitoramento e cadastro operacional',reason:'Não há intervalos completos de operação e parada nem denominador de exposição. Uptime e disponibilidade reais não são calculáveis por chamados, TA/TB ou Carro Parado.'};
