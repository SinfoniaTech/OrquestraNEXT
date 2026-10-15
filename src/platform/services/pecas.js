import {contractMetrics,contractPage,contractDefinition,CONTRACT_TERMS} from './contratos.js';
import {groupRecords} from './sla.js';
import {distinct,dailyEvolution} from './riscos.js';
export const hasComponent=value=>typeof value==='string'&&value.trim().length>0;
export function componentGroup(group){
 const metrics=contractMetrics(group.rows);
 return {...group,...metrics,ID_Chamado:group.label,clients:groupRecords(group.rows,'Cliente').map(g=>g.label),
  units:distinct(group.rows,'Unidade'),contracts:distinct(group.rows,'Contrato'),
  subcomponents:groupRecords(group.rows,'Subcomponente'),categories:groupRecords(group.rows,'Categoria do Chamado'),
  failures:groupRecords(group.rows,'Falha'),defects:groupRecords(group.rows,'Defeito'),insights:groupRecords(group.rows,'Insight_ORQUESTRA')};
}
export function componentAnalysis(rows,period){
 const associated=rows.filter(r=>hasComponent(r['Componente Principal']));
 const metrics=contractMetrics(associated);
 const groups=groupRecords(associated,'Componente Principal').map(componentGroup);
 return {...metrics,total:rows.length,unassigned:rows.length-associated.length,groups,componentCount:groups.length,
  subcomponentCount:distinct(associated,'Subcomponente'),unitCount:distinct(associated,'Unidade'),contractCount:distinct(associated,'Contrato'),
  categories:groupRecords(associated,'Categoria do Chamado'),failures:groupRecords(associated,'Falha'),
  clients:groupRecords(associated,'Cliente'),contracts:groupRecords(associated,'Contrato'),days:dailyEvolution(associated,period)};
}
export function componentPage(groups,ui={}){
 return contractPage(groups,{...ui,valueFor:(g,key)=>({component:g.label,count:g.count,units:g.units,contracts:g.contracts,
  recurrence:g.recurrence.value,critical:g.risk.red.length,elevated:g.risk.red.length+g.risk.orange.length,cost:g.cost.value})[key]});
}
export function componentDefinition(config,state,view){
 return contractDefinition({missing:'Componente nulo/vazio/apenas espaços não conta como componente identificado nem ocorrência associada; cobertura no total explícita. Unidade/Contrato ausentes não contam como entidades distintas. Agrupamentos técnicos ausentes mostram Não informado. Recorrência/TA/TB/SLA/custo seguem regras anteriores com N próprio; zero válido, nulos/inválidos não viram zero e sem elegíveis indisponível.',...config},state,view);
}
export const COMPONENT_TERMS={
 ...CONTRACT_TERMS,
 components:{title:'Componentes identificados',fields:['Componente Principal'],definition:'Componentes distintos observados nas ocorrências filtradas. Não quantidade de peças sugeridas, consumidas ou disponíveis.',calculation:'Contar Componente Principal distinto não nulo/vazio após filtros e busca.',unit:'componentes distintos'},
 occurrences:{title:'Ocorrências com componente',fields:['ID_Chamado','Componente Principal'],definition:'Chamados com componente identificado; um registro é uma ocorrência associada, sem comprovar consumo ou troca de peça.',calculation:'Contar chamados com Componente Principal identificado. Cobertura = associados / total filtrado; todos os status.',unit:'chamados'},
 recurrentUnits:{title:'Unidades com recorrência elevada',fields:['Unidade','Recorrencia_30d','Componente Principal'],definition:'Unidades distintas com algum chamado associado com recorrência >=3. Não demonstra causalidade do componente.',calculation:'Reutilizar riskAnalysis C2 nas ocorrências com componente identificado: contar Unidade distinta com Recorrencia_30d finita >=3; não somar eventos.',unit:'unidades distintas'},
 critical:{title:'Chamados Vermelhos históricos',fields:['Componente Principal','Criticidade_ORQUESTRA','Status'],definition:'Chamados associados com cor Vermelho materializada, incluindo concluídos. Não item de estoque crítico nem diagnóstico atual do equipamento.',calculation:'Contar Criticidade_ORQUESTRA = Vermelho nos associados. Ainda não concluídos = subconjunto com Status diferente de Concluído na referência.',unit:'chamados'},
 cost:{...CONTRACT_TERMS.cost,title:'Custo estimado dos atendimentos associados',definition:'Custos sintéticos dos chamados com componente identificado, não preço unitário/consumo de peça nem orçamento de compra.'},
 portfolio:{title:'Carteira de componentes e ocorrências',fields:['Componente Principal','Subcomponente','Unidade','Contrato','Recorrencia_30d','Criticidade_ORQUESTRA','Custo_Estimado_R$'],definition:'Agrupamentos técnicos observados nos chamados; associação não comprova peça consumida, causa ou recomendação de substituição.',calculation:'Agrupar Componente Principal identificado. Contar chamados, unidades/contratos distintos, recorrência >0/total com cobertura, Vermelhos BASE e soma de custos C3. Ordem antes da paginação, nulos no fim, desempate por texto.',unit:'componentes, chamados e R$'},
 patterns:{title:'Padrões técnicos e investigação',fields:['Componente Principal','Subcomponente','Categoria do Chamado','Defeito','Falha','Fechamento','Insight_ORQUESTRA'],definition:'Textos BASE e associações históricas para investigação técnica; não diagnóstico causal ou previsão ML.',calculation:'Agrupar texto completo de cada campo e contar chamados. Grupos de campos diferentes se sobrepõem; não somar como ocorrências adicionais. Insight é BASE sintético, sem nova recomendação de compra.',unit:'chamados'},
 units:{title:'Equipamentos associados ao componente',fields:['Componente Principal','Unidade','Recorrencia_30d','Criado em'],definition:'Unidades presentes nos chamados do componente selecionado dentro do recorte, não parque ativo ou instalado.',calculation:'Agrupar Unidade identificada no contexto do componente. Histórico por criação desc/ID asc, máximo/último valor de recorrência distintos do volume; reutilizar C6.',unit:'unidades e chamados'},
 days:{title:'Evolução diária das ocorrências associadas',fields:['Criado em','Componente Principal'],definition:'Chamados pela data de criação, sem estimar demanda logística ou consumo de peças.',calculation:'Reutilizar dailyEvolution C2 no recorte: contagem por dia civil inclusivo; dias sem chamados zero, sem extrapolar os 60 dias.',unit:'chamados/dia'}
};
export const COMPONENT_EXTERNAL=[
 {title:'Disponibilidade por depósito',fields:['Depósito','Estoque disponível','Reservas','Saldo por item'],source:'ERP/WMS e inventário de peças',reason:'O histórico não fornece depósitos nem saldos. Frequência de componente não permite calcular disponibilidade média ou quantidade disponível.'},
 {title:'ETA logístico e distância',fields:['Depósito de origem','Destino','Distância','Lead time','Transporte'],source:'Logística, fornecedores e geolocalização autorizada',reason:'ETA_min da base é chegada do técnico, não prazo de entrega de peça. Área/Rota não permitem distância ou ETA logístico.'},
 {title:'Peças sugeridas e compatibilidade',fields:['Código/SKU','Catálogo de peças','Compatibilidade técnica','Diagnóstico validado'],source:'Catálogo técnico e engenharia de manutenção',reason:'Componente/Subcomponente/Falha não comprovam qual peça substituir. Faltam catálogo e validação técnica para recomendar material.'},
 {title:'Preço e consumo de peças',fields:['Preço unitário','Quantidade consumida','Movimentação de estoque','Custo de material'],source:'ERP, compras e ordens de manutenção',reason:'Custo_Estimado_R$ é do chamado; não há decomposição de materiais ou prova de consumo, compra ou reserva.'}
];
