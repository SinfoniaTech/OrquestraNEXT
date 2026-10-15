export const MENU_GROUPS = [
 {label:'VISÃO EXECUTIVA',items:[
  {id:'visao-geral',label:'Visão Geral',title:'Performance Operacional & Financeira',icon:'home',description:'Uma visão integrada da operação, dos riscos e dos principais sinais da carteira.'},
  {id:'contratos-margem',label:'Contratos & Margem',icon:'file',description:'Análise por contrato, com origem e limites de cada indicador.'},
  {id:'custos-tco',label:'Custos / TCO',icon:'database',description:'Custos operacionais estimados e dependências da visão financeira.'},
  {id:'riscos-tendencias',label:'Riscos & Tendências',icon:'alert',description:'Contexto operacional, recorrências e oportunidades de intervenção.'}
 ]},
 {label:'OPERAÇÃO',items:[
  {id:'chamados',label:'Chamados',icon:'phone',description:'Consulta do histórico de ocorrências e detalhamento dos atendimentos.'},
  {id:'sla-criticidade',label:'SLA & Criticidade',icon:'chart',description:'Pressão temporal e contexto humano para apoiar a priorização.'},
  {id:'tecnicos',label:'Técnicos',icon:'users',description:'Capacidade e Performance Operacional · atendimentos, vínculos e contexto histórico.'},
  {id:'equipamentos',label:'Equipamentos',icon:'equipment',description:'Histórico dos ativos, componentes e ocorrências relacionadas.'},
  {id:'pecas',label:'Peças',icon:'box',description:'Inteligência de Componentes e Ocorrências · contexto técnico e operacional.'}
 ]},
 {label:'INTELIGÊNCIA',items:[
  {id:'padroes-insights',label:'Padrões & Insights',icon:'spark',description:'Padrões observados e recomendações com evidência rastreável.'}
 ]},
 {label:'CONFIGURAÇÃO',items:[
  {id:'contratos-backoffice',label:'Contratos — BackOffice',icon:'file',description:'Organização da consulta contratual do BackOffice.'},
  {id:'integracoes',label:'Integrações',icon:'link',description:'Fontes externas e os requisitos para conexão futura.'}
 ]}
];
export const PAGES = MENU_GROUPS.flatMap(group=>group.items);
export function pageFromHash(hash) {
 const id=hash.replace(/^#\//,'');
 if(!id)return 'visao-geral';
 return id;
}
