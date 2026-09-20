/**
 * DADOS MOCKADOS DA VIEW "BACKOFFICE"
 *
 * Reproduzem fielmente o conteúdo visível da referência
 * (exec-tech-nexus.lovable.app — páginas "/" e "/gestao-executiva").
 *
 * Estrutura pensada para substituição futura por API: cada seção exporta
 * um array/objeto com o shape que o respectivo componente consome, sem
 * nenhuma lógica de apresentação embutida.
 *
 * Valores textuais/numéricos dos KPIs, tabelas e cards foram transcritos
 * da referência. As séries temporais dos gráficos (não expostas no HTML
 * pré-renderizado) são mocks plausíveis coerentes com os totais exibidos
 * (ex.: os 6 meses de "Chamadas por Período" somam exatamente 1.248).
 */

/* ---------------------------------------------------------------------------
 * NAVEGAÇÃO LATERAL
 * A referência possui apenas duas rotas reais (gestao-tecnica e
 * gestao-executiva); os demais itens são placeholders de navegação.
 * `route: true` marca os itens com tela implementada.
 * ------------------------------------------------------------------------- */
export const MENU_SECTIONS = [
  {
    id: 'inteligencia',
    label: null, // os dois primeiros itens ficam soltos no topo da navegação
    items: [
      { id: 'gestao-tecnica', label: 'Gestão Técnica', icon: 'layout-dashboard', route: true },
      { id: 'gestao-executiva', label: 'Gestão Executiva', icon: 'chart-line', route: true },
    ],
  },
  {
    id: 'backoffice',
    label: 'Backoffice',
    items: [
      { id: 'chamadas', label: 'Chamados', icon: 'phone-call' },
      { id: 'contratos', label: 'Contratos', icon: 'file-text' },
      { id: 'equipamentos', label: 'Equipamentos', icon: 'building-2' },
      { id: 'clientes', label: 'Clientes', icon: 'users' },
      { id: 'pecas', label: 'Peças', icon: 'package' },
      { id: 'tecnicos', label: 'Técnicos', icon: 'hard-hat' },
      { id: 'treinamentos', label: 'Treinamentos', icon: 'graduation-cap' },
      { id: 'relatorios', label: 'Relatórios', icon: 'chart-column' },
    ],
  },
  {
    id: 'sistema',
    label: 'Sistema',
    items: [
      { id: 'configuracoes', label: 'Configurações', icon: 'settings' },
      { id: 'integracoes', label: 'Integrações', icon: 'plug' },
      { id: 'logs', label: 'Logs de Carga', icon: 'database-zap' },
    ],
  },
];

/* ---------------------------------------------------------------------------
 * METADADOS DAS TELAS (cabeçalho: título, subtítulo e período padrão)
 * ------------------------------------------------------------------------- */
export const TELAS = {
  'gestao-tecnica': {
    title: 'Gestão Técnica',
    subtitle: 'Padrões, recorrências, TA/TB e oportunidades de melhoria contínua da operação',
    periodo: 'Últimos 6 meses',
  },
  'gestao-executiva': {
    title: 'Gestão Executiva',
    subtitle: 'Tendências operacionais e impactos sobre qualidade, eficiência e rentabilidade',
    periodo: 'Trimestre atual',
  },
};

export const PERIODOS = ['Últimos 6 meses', 'Trimestre atual', 'Últimos 12 meses'];


/* ---------------------------------------------------------------------------
 * GESTÃO TÉCNICA
 * ------------------------------------------------------------------------- */
export const KPIS_TECNICA = [
  { id: 'total', label: 'Total de Chamadas', value: '1.248', sub: '+6% vs. mês anterior', subTone: 'success' },
  { id: 'abertas', label: 'Abertas', value: '58', sub: '12 acima do previsto', subTone: 'warning' },
  { id: 'atendimento', label: 'Em Atendimento', value: '22', sub: '8 críticas', subTone: 'critical' },
  { id: 'concluidas', label: 'Concluídas', value: '1.168', sub: '93,6% do total', subTone: 'muted' },
  { id: 'ta', label: 'TA Médio', value: '27 min', sub: 'meta 30 min', subTone: 'success' },
  { id: 'tb', label: 'TB Médio', value: '2h 15min', sub: 'meta 2h', subTone: 'warning' },
];

export const HISTORICO_CHAMADAS = {
  title: 'Histórico de Chamadas',
  subtitle: 'Contrato CT-2025-00124 — Hospital São Paulo',
  label: 'Filtro por:',
  filtros: [
    'Item/Equipamento',
    'Tipo de Chamada',
    'Período',
    'Ocorrência',
    'Código de Fechamento',
    'Tempo de Chegada',
    'Tempo de Solução',
    'Feedback do Técnico',
    'Tipo de Peça',
    'Treinamento',
    'Prioridade',
  ],
};

export const CHAMADAS_POR_PERIODO = {
  title: 'Chamadas por Período',
  subtitle: 'Volume total e reincidências',
  labels: ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
  series: [
    { key: 'total', name: 'Chamadas', values: [186, 204, 198, 215, 209, 236] },
    { key: 'reincidencias', name: 'Reincidências', values: [22, 26, 24, 31, 28, 35] },
  ],
};

export const CHAMADAS_POR_PRIORIDADE = {
  title: 'Chamadas por Prioridade',
  subtitle: 'Distribuição da criticidade',
  labels: ['Crítica', 'Alta', 'Média', 'Baixa'],
  series: [
    { key: 'chamadas', name: 'Chamadas', values: [46, 212, 587, 403] },
  ],
  // cor por barra (sobrescreve a cor da série)
  barTones: ['critical', 'warning', 'info', 'muted'],
};

export const CHAMADAS_POR_TIPO = {
  title: 'Chamadas por Tipo de Ocorrência',
  subtitle: 'Concentração de falhas',
  labels: ['Nivelamento', 'Porta', 'Painel/comando', 'Segurança', 'Comunicação', 'Outros'],
  series: [
    { key: 'chamadas', name: 'Chamadas', values: [168, 142, 118, 96, 74, 80] },
  ],
};

export const PADROES_RECORRENCIA = {
  title: 'Padrões e Recorrências Identificadas',
  subtitle: 'Correlação entre equipamento, ocorrência e histórico técnico',
  columns: [
    { key: 'equipamento', label: 'Equipamento' },
    { key: 'local', label: 'Local' },
    { key: 'ocorrencia', label: 'Ocorrência' },
    { key: 'eventos', label: 'Eventos', numeric: true },
    { key: 'janela', label: 'Janela' },
    { key: 'padrao', label: 'Padrão', badge: true },
    { key: 'acao', label: 'Ação recomendada' },
  ],
  rows: [
    {
      equipamento: 'ELV-4471',
      local: 'Hospital São Paulo — SP',
      ocorrencia: 'Falha de nivelamento',
      eventos: 7,
      janela: '60 dias',
      padrao: { text: 'Recorrência confirmada', tone: 'critical' },
      acao: 'Revisar sensor de zona + treinamento nivelamento',
    },
    {
      equipamento: 'ELV-2210',
      local: 'Shopping Center Norte — SP',
      ocorrencia: 'Porta não fecha',
      eventos: 5,
      janela: '45 dias',
      padrao: { text: 'Recorrência confirmada', tone: 'critical' },
      acao: 'Substituir operador de porta (peça pré-posicionada)',
    },
    {
      equipamento: 'ESC-0912',
      local: 'Hospital Life — RJ',
      ocorrencia: 'Parada por segurança',
      eventos: 3,
      janela: '30 dias',
      padrao: { text: 'Em observação', tone: 'warning' },
      acao: 'Monitorar telemetria IoT por 15 dias',
    },
    {
      equipamento: 'ELV-7788',
      local: 'Edifício Corporate — BH',
      ocorrencia: 'Painel / comando',
      eventos: 4,
      janela: '50 dias',
      padrao: { text: 'Recorrência confirmada', tone: 'critical' },
      acao: 'Norma técnica de inspeção trimestral',
    },
  ],
};

export const PERFORMANCE_AREAS = {
  title: 'Performance por Área',
  subtitle: 'TA, TB, SLA e reincidência por região',
  areas: [
    { nome: 'SP Capital', sla: '96%', ta: '24 min', tb: '118 min', tecnicos: 42, reincidencia: '8%' },
    { nome: 'SP Interior', sla: '89%', ta: '38 min', tb: '156 min', tecnicos: 26, reincidencia: '14%' },
    { nome: 'Rio de Janeiro', sla: '92%', ta: '31 min', tb: '142 min', tecnicos: 24, reincidencia: '11%' },
    { nome: 'Minas Gerais', sla: '90%', ta: '35 min', tb: '149 min', tecnicos: 18, reincidencia: '12%' },
    { nome: 'Sul', sla: '94%', ta: '29 min', tb: '131 min', tecnicos: 21, reincidencia: '9%' },
  ],
};

export const COBERTURA_SKILLS = {
  title: 'Cobertura de Skills',
  subtitle: 'Capacidade técnica vs. demanda por região',
  skills: [
    { nome: 'Nivelamento e sensores de zona', regiao: 'SP Interior', cobertura: 62, nivel: 'Alta', tone: 'warning' },
    { nome: 'Operador de porta eletrônico', regiao: 'RJ', cobertura: 74, nivel: 'Alta', tone: 'warning' },
    { nome: 'Painel de comando série X', regiao: 'MG', cobertura: 48, nivel: 'Crítica', tone: 'critical' },
    { nome: 'Escadas rolantes — corrente', regiao: 'SP Capital', cobertura: 81, nivel: 'Média', tone: 'primary' },
  ],
};

export const RECOMENDACOES = {
  title: 'Recomendações da Inteligência ORQUESTRA',
  subtitle: 'Sugestões geradas a partir dos padrões — execução permanece nos sistemas responsáveis',
  items: [
    {
      titulo: 'Treinamento de nivelamento — SP Interior',
      tipo: 'Treinamento',
      tipoTone: 'info',
      icon: 'graduation-cap',
      descricao: '12 recorrências em 60 dias, TA 38 min acima da meta',
      impacto: 'Redução estimada de 18% em reincidência',
    },
    {
      titulo: 'Pré-posicionar operadores de porta em MG',
      tipo: 'Peças',
      tipoTone: 'warning',
      icon: 'package',
      descricao: '4 equipamentos com padrão confirmado de falha de porta',
      impacto: 'TB estimado -22 min por atendimento',
    },
    {
      titulo: 'Norma de inspeção trimestral — painel série X',
      tipo: 'Norma',
      tipoTone: 'muted',
      icon: 'clipboard-check',
      descricao: 'Correlação entre alertas IoT e paradas não programadas',
      impacto: 'Prevenção de ~30 chamadas/trimestre',
    },
  ],
};

/* ---------------------------------------------------------------------------
 * GESTÃO EXECUTIVA
 * ------------------------------------------------------------------------- */
export const KPIS_EXECUTIVA = [
  { id: 'contratos', label: 'Contratos Ativos', value: '312', sub: '+4 no trimestre', subTone: 'success' },
  { id: 'sla', label: 'Aderência ao SLA', value: '92,4%', sub: '+1,8 p.p. no trimestre', subTone: 'success' },
  { id: 'tco', label: 'TCO Operacional', value: 'R$ 8,9M', sub: '+3,1% vs. plano', subTone: 'warning' },
  { id: 'margem', label: 'Margem de Contrato', value: '18,6%', sub: '-0,9 p.p.', subTone: 'critical' },
  { id: 'risco', label: 'Contratos em Risco', value: '17', sub: '5,4% da carteira', subTone: 'critical' },
  { id: 'nps', label: 'NPS Operacional', value: '61', sub: '+3 pontos', subTone: 'success' },
];

export const RECEITA_CUSTO_SLA = {
  title: 'Receita, Custo e SLA',
  subtitle: 'Evolução mensal em R$ milhões e aderência ao SLA',
  labels: ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
  series: [
    { key: 'receita', name: 'Receita (R$ mi)', values: [2.9, 3.0, 3.1, 3.1, 3.2, 3.3] },
    { key: 'custo', name: 'Custo (R$ mi)', values: [2.3, 2.35, 2.4, 2.45, 2.5, 2.55] },
  ],
  // linha sobreposta com escala própria (eixo direito)
  line: { key: 'sla', name: 'SLA (%)', values: [91.2, 91.8, 92.1, 92.6, 92.2, 92.4], min: 88, max: 96 },
};

export const MARGEM_SEGMENTO = {
  title: 'Margem por Segmento',
  subtitle: 'Rentabilidade média dos contratos',
  labels: ['Saúde', 'Varejo', 'Corporativo', 'Residencial'],
  series: [
    { key: 'margem', name: 'Margem (%)', values: [11.4, 17.2, 22.1, 19.5] },
  ],
};

export const CARTEIRA_PRESSAO = {
  title: 'Carteira sob Pressão',
  subtitle: 'Contratos com maior impacto de TCO e risco de rentabilidade',
  columns: [
    { key: 'contrato', label: 'Contrato' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'segmento', label: 'Segmento' },
    { key: 'tco', label: 'TCO (12m)', numeric: true },
    { key: 'margem', label: 'Margem', numeric: true },
    { key: 'risco', label: 'Risco', badge: true },
    { key: 'driver', label: 'Driver operacional' },
  ],
  rows: [
    {
      contrato: 'CT-2025-00124',
      cliente: 'Hospital São Paulo',
      segmento: 'Saúde',
      tco: 'R$ 412k',
      margem: '9,2%',
      risco: { text: 'Alto', tone: 'critical' },
      driver: 'Recorrência de nivelamento + SLA 30min/4h',
    },
    {
      contrato: 'CT-2025-00125',
      cliente: 'Shopping Center Norte',
      segmento: 'Varejo',
      tco: 'R$ 286k',
      margem: '14,8%',
      risco: { text: 'Médio', tone: 'warning' },
      driver: 'Aumento de chamadas de porta em horário de pico',
    },
    {
      contrato: 'CT-2025-00126',
      cliente: 'Hospital Life',
      segmento: 'Saúde',
      tco: 'R$ 351k',
      margem: '11,1%',
      risco: { text: 'Alto', tone: 'critical' },
      driver: 'Prioridade crítica recorrente e reincidência de 14%',
    },
    {
      contrato: 'CT-2025-00127',
      cliente: 'Edifício Corporate',
      segmento: 'Corporativo',
      tco: 'R$ 198k',
      margem: '21,4%',
      risco: { text: 'Baixo', tone: 'success' },
      driver: 'Operação estável, TA abaixo da meta',
    },
  ],
};

export const SINAIS_PREDITIVOS = {
  title: 'Sinais Preditivos',
  subtitle: 'Antecipação de necessidades a partir do histórico e da telemetria',
  items: [
    {
      titulo: 'Demanda prevista +14% em SP Interior',
      horizonte: 'Próximos 60 dias',
      base: 'Sazonalidade, telemetria IoT e histórico de recorrência',
      recomendacao: 'Reforço de 3 técnicos com skill de nivelamento',
    },
    {
      titulo: 'Pressão de TCO em contratos de saúde',
      horizonte: 'Próximo trimestre',
      base: 'Custo por chamada 21% acima da média da carteira',
      recomendacao: 'Revisar precificação e plano de manutenção preventiva',
    },
    {
      titulo: 'Janela de melhoria de margem no varejo',
      horizonte: 'Próximos 90 dias',
      base: 'Queda de reincidência após substituição de operadores de porta',
      recomendacao: 'Replicar padrão técnico para os demais 26 contratos',
    },
  ],
};

export const SAUDE_CARTEIRA = {
  title: 'Saúde da Carteira por Segmento',
  subtitle: 'Contratos, SLA e margem consolidados',
  segmentos: [
    { nome: 'Saúde', contratos: 68, sla: '88%', margem: '11.4%' },
    { nome: 'Varejo', contratos: 94, sla: '93%', margem: '17.2%' },
    { nome: 'Corporativo', contratos: 108, sla: '95%', margem: '22.1%' },
    { nome: 'Residencial', contratos: 42, sla: '91%', margem: '19.5%' },
  ],
};



