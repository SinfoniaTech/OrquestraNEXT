import {STATUS_ORDER,CRITICALITY_ORDER} from './chamados.js';
import {groupRecords,average} from './sla.js';
import {contractMetrics,contractPage,contractDefinition,CONTRACT_TERMS} from './contratos.js';
import {estimatedCost} from './performance.js';
export const identified=value=>typeof value==='string'&&value.trim().length>0;
export function technicianMetrics(rows){
 const metrics=contractMetrics(rows);
 return {...metrics,completed:rows.filter(r=>r.Status==='Concluído'),active:rows.filter(r=>r.Status!=='Concluído'),
  elevated:rows.filter(r=>['Laranja','Vermelho'].includes(r.Criticidade_ORQUESTRA)),
  statuses:STATUS_ORDER.map(label=>({label,rows:rows.filter(r=>r.Status===label)})).map(g=>({...g,count:g.rows.length})),
  colors:CRITICALITY_ORDER.map(label=>({label,rows:rows.filter(r=>r.Criticidade_ORQUESTRA===label)})).map(g=>({...g,count:g.rows.length})),
  meanCost:average(rows,'Custo_Estimado_R$'),recurringCost:estimatedCost(metrics.recurrence.rows)};
}
export function technicianGroups(rows,field='Técnico'){
 return groupRecords(field==='Técnico'?rows.filter(r=>identified(r.Técnico)):rows,field).map(g=>({...g,...technicianMetrics(g.rows),ID_Chamado:g.label,
  clients:groupRecords(g.rows,'Cliente').map(x=>x.label),areas:groupRecords(g.rows,'Área').map(x=>x.label),
  supervisors:groupRecords(g.rows,'Supervisor').map(x=>x.label),routes:groupRecords(g.rows,'Rota').map(x=>x.label)}));
}
export function technicianAnalysis(rows){
 const assigned=rows.filter(r=>identified(r.Técnico));
 return {...technicianMetrics(assigned),total:rows.length,unassigned:rows.length-assigned.length,technicians:technicianGroups(assigned),
  areas:technicianGroups(assigned,'Área'),routes:technicianGroups(assigned,'Rota'),supervisors:technicianGroups(assigned,'Supervisor')};
}
export function technicianPage(groups,ui={}){
 return contractPage(groups,{...ui,valueFor:(g,key)=>({name:g.label,area:g.areas.join(' · '),supervisor:g.supervisors.join(' · '),route:g.routes.join(' · '),count:g.count,completed:g.completed.length,ta:g.ta.value,tb:g.tb.value,elevated:g.elevated.length,cost:g.cost.value})[key]});
}
export function technicianDefinition(config,state,view){
 return contractDefinition({missing:'Técnico nulo, vazio ou apenas espaços não conta como entidade nem atendimento vinculado; cobertura explícita. Área, Rota e Supervisor ausentes formam Não informado. TA/TB e custo: finitos não negativos, zero válido, N próprio; nulos/invalidos excluídos e sem válidos indisponível. SLA mantém elegibilidade C1. Vínculos múltiplos são preservados, sem cadastro permanente.',...config,calculation:config.calculation+' A análise de atendimentos, tempos e custos considera somente registros com Técnico identificado; cobertura dos vinculados no total filtrado explícita.'},state,view);
}
export const TECHNICIAN_TERMS={
 ...CONTRACT_TERMS,
 technicians:{title:'Técnicos com Atendimentos',fields:['Técnico'],definition:'Nomes distintos identificados nos chamados filtrados; não quadro ativo da OTIS.',calculation:'Contar Técnico distinto não ausente após período/filtros/busca.',unit:'técnicos distintos'},
 assigned:{title:'Chamados Vinculados',fields:['ID_Chamado','Técnico'],definition:'Atendimentos com técnico identificado, incluindo todos os status.',calculation:'Contar chamados com Técnico não nulo/vazio; cobertura = vinculados / total filtrado.',unit:'chamados'},
 completed:{title:'Atendimentos Concluídos',fields:['Técnico','Status'],definition:'Conclusões materializadas entre os chamados vinculados no recorte.',calculation:'Contar Técnico identificado e Status = Concluído.',unit:'chamados'},
 cost:{...CONTRACT_TERMS.cost,title:'Custo Operacional Estimado Associado',definition:'Custo dos atendimentos vinculados ao técnico. Não representa salário, remuneração, mão de obra real ou rentabilidade individual.'},
 status:{title:'Distribuição histórica por status',fields:['Técnico','Status'],definition:'Status dos chamados associados, sem inferir situação atual da força de trabalho.',calculation:'Contar chamados vinculados por Status materializado. Operação na referência = Status diferente de Concluído em 06/10/2026 às 22h; não tempo real.',unit:'chamados'},
 elevated:{title:'Criticidade elevada histórica',fields:['Criticidade_ORQUESTRA','Status'],definition:'Chamados Laranja ou Vermelho, incluindo concluídos; não classificação do profissional.',calculation:'Contar cores materializadas Laranja/Vermelho. Operação na referência: subconjunto não Concluído; sem recálculo.',unit:'chamados'},
 links:{title:'Vínculos e carteira de técnicos',fields:['Técnico','Área','Supervisor','Rota'],definition:'Uma linha por nome de técnico no recorte, mantendo todos os vínculos observados. Volume e tempos não constituem avaliação individual.',calculation:'Agrupar Técnico identificado. Área, Supervisor e Rota distintos por grupo, sem selecionar arbitrariamente vínculo permanente. Ordem antes da paginação; nulos no fim e desempate por nome.',unit:'técnicos e chamados'},
 patterns:{title:'Padrões e insights dos atendimentos',fields:['Categoria do Chamado','Componente Principal','Recorrencia_30d','Insight_ORQUESTRA'],definition:'Associações históricas para investigação operacional; recorrência não é atribuída como causa ao técnico.',calculation:'Agrupar campos BASE pelo texto completo e contar chamados CALC. Recorrência positiva finita >0; elevada >=3; não somar eventos nem inferir causa ou ML.',unit:'chamados'},
 meanCost:{title:'Custo médio estimado dos chamados',fields:['Custo_Estimado_R$'],definition:'Média de custos sintéticos dos atendimentos, sem remuneração individual.',calculation:'Média dos custos finitos não negativos, N independente e zero válido; sem válidos indisponível.',unit:'R$'},
 recurringCost:{title:'Custos de atendimentos recorrentes',fields:['Custo_Estimado_R$','Recorrencia_30d'],definition:'Custos dos chamados com recorrência positiva; não custo adicional nem responsabilidade do técnico.',calculation:'Somar custos válidos somente nos chamados com Recorrencia_30d finita >0; N válido explícito.',unit:'R$'}
};
export const TECHNICIAN_EXTERNAL=[
 {title:'Técnicos Disponíveis',fields:['Disponibilidade real','Capacidade disponível para novos atendimentos'],source:'Gestão de pessoas, escala e despacho',reason:'Não há fonte confiável de disponibilidade, jornada, férias, afastamentos ou localização atual. Ausência de chamados em andamento não comprova capacidade.'},
 {title:'Jornada, escala e agenda',fields:['Jornada','Escala','Agenda','Horas efetivamente trabalhadas'],source:'Gestão de pessoas e planejamento operacional',reason:'A base de chamados não contém jornada, agenda ou horas efetivamente trabalhadas.'},
 {title:'Skills e qualificações',fields:['Skills','Certificações','Treinamentos','Habilitações técnicas'],source:'Gestão de competências e certificações',reason:'Não há cadastro confiável de competências ou qualificações.'},
 {title:'Localização em tempo real',fields:['Localização atual'],source:'Telemetria e despacho autorizado',reason:'Área, Rota e endereço dos chamados não representam localização atual.'},
 {title:'Mão de obra e avaliações oficiais',fields:['Custo real de mão de obra','Avaliações individuais oficiais'],source:'RH, folha e metodologia validada',reason:'Custos estimados e tempos dos chamados não constituem custo real de mão de obra nem avaliação individual oficial.'}
];
