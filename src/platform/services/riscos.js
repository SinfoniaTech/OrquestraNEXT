import {summarize,CRITICALITY_ORDER} from './chamados.js';
import {groupRecords,slaDefinition} from './sla.js';
import {boundary} from '../../data/orquestra/time.js';
export const elevated=row=>typeof row.Recorrencia_30d==='number'&&Number.isFinite(row.Recorrencia_30d)&&row.Recorrencia_30d>=3;
const present=value=>value!==null&&value!==undefined&&value!=='';
export function distinct(rows,field){return new Set(rows.map(r=>r[field]).filter(present)).size;}
export function riskAnalysis(records){
 const summary=summarize(records),recurrent=records.filter(elevated),pressure=records.filter(r=>r.Impacto_Contrato==='Alto');
 return {total:records.length,red:records.filter(r=>r.Criticidade_ORQUESTRA==='Vermelho'),orange:records.filter(r=>r.Criticidade_ORQUESTRA==='Laranja'),
  recurrent,units:distinct(recurrent,'Unidade'),pressure,contracts:distinct(pressure,'Contrato'),active:summary.attention,nonConcluded:summary.active,
  colors:CRITICALITY_ORDER.map(label=>({label,rows:records.filter(r=>r.Criticidade_ORQUESTRA===label)})),
  areas:groupRecords(records,'Área').map(g=>({...g,colors:CRITICALITY_ORDER.map(label=>({label,rows:g.rows.filter(r=>r.Criticidade_ORQUESTRA===label)})),risk:g.rows.filter(r=>['Laranja','Vermelho'].includes(r.Criticidade_ORQUESTRA))})),
  contractsGroups:groupRecords(pressure,'Contrato'),reasons:groupRecords(records,'Motivo_Criticidade')};
}
export function dailyEvolution(records,period){
 boundary(period.from);boundary(period.to,true);
 const days=[],cursor=new Date(period.from+'T12:00:00Z');
 while(cursor.toISOString().slice(0,10)<=period.to){
  const date=cursor.toISOString().slice(0,10),rows=records.filter(r=>typeof r['Criado em']==='string'&&r['Criado em'].slice(0,10)===date);
  days.push({date,rows,total:rows.length,colors:CRITICALITY_ORDER.map(label=>({label,count:rows.filter(r=>r.Criticidade_ORQUESTRA===label).length}))});
  cursor.setUTCDate(cursor.getUTCDate()+1);
 }
 return days;
}
export function recurrenceGroups(records,field='Unidade'){
 if(!['Unidade','Componente Principal','Categoria do Chamado'].includes(field))throw new RangeError('Agrupamento inválido');
 return groupRecords(records.filter(elevated),field).map(g=>({...g,units:distinct(g.rows,'Unidade')}));
}
export function riskDefinition(config,state,view){
 return slaDefinition({unit:'chamados',missing:'Ausentes permanecem ausentes. Chaves ausentes são excluídas das contagens distintas; agrupamentos exibem Não informado. Recorrência ausente não satisfaz >= 3. Sem população, proporção não calculável.',...config},state,view);
}
export function suggestionGroups(analysis){
 return [
  {id:'active',title:'Revisar atendimento das prioridades ativas',rows:analysis.active,observation:'Não concluído em Laranja/Vermelho.',suggestion:'Revisar motivo, contexto humano e encaminhamento com o responsável operacional.'},
  {id:'orange',title:'Investigar a janela Laranja',rows:analysis.orange,observation:'Classificação Laranja registrada no histórico, inclusive concluídos.',suggestion:'Investigar situações similares e oportunidades de intervenção; não presumir que concluídos continuam abertos.'},
  {id:'recurrent',title:'Investigar repetição por equipamento e componente',rows:analysis.recurrent,observation:'Recorrencia_30d materializada >= 3.',suggestion:'Examinar componente, categoria e histórico da unidade. Repetição é associação, não comprovação de causa.'},
  {id:'pressure',title:'Revisar impacto operacional nos contratos',rows:analysis.pressure,observation:'Impacto_Contrato = Alto fornecido pela base.',suggestion:'Avaliar registros e motivos com a operação. Não inferir margem negativa ou prejuízo comprovado.'}
 ].filter(g=>g.rows.length);
}
