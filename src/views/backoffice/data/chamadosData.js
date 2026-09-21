/**
 * ============================================================================
 *  DADOS MOCKADOS DA TELA "CHAMADOS" (backoffice)
 * ============================================================================
 *
 * O backoffice é camada de CONSOLIDAÇÃO: a execução dos chamados acontece nos
 * sistemas da OTIS e os chamados entram por integração (não há formulário de
 * abertura). Todos os números da tela (KPIs, fluxo, rodapé da fila, alertas,
 * gráfico por região) são DERIVADOS destas estruturas — nunca digitados soltos
 * na tela. Relações garantidas por construção (computeCounts):
 *   Abertas = Aguardando priorização + Encaminhados ao supervisor
 *   Total   = Abertas + Em Atendimento + Concluídos
 */

/* ---------------------------------------------------------------------------
 * ESTÁGIOS DA DEMO — em ordem de apresentação
 * ------------------------------------------------------------------------- */
export const STAGES = [
  'repouso',
  'aberto',
  'priorizado',
  'encaminhado',
  'alerta',
  'em-atendimento',
  'concluido',
];

/* Horário simulado de cada estágio. */
export const STAGE_HORAS = {
  repouso: '14:00',
  aberto: '14:02',
  priorizado: '14:04',
  encaminhado: '14:05',
  alerta: '14:24',
  'em-atendimento': '14:26',
  concluido: '15:12',
};

/* Etapa do fluxo em que o protagonista está, por estágio (repouso: nenhuma). */
export const STAGE_FLUXO = {
  repouso: null,
  aberto: 'aguardando',
  priorizado: 'aguardando',
  encaminhado: 'encaminhados',
  alerta: 'encaminhados',
  'em-atendimento': 'atendimento',
  concluido: 'concluidos',
};

/* Ritmo da sequência de chegadas (fácil de ajustar para o ensaio). */
export const ARRIVAL_INITIAL_DELAY_MS = 1500;
export const ARRIVAL_INTERVAL_MS = 2600;
export const ARRIVAL_TOTAL = 3; // 2 chamados de fundo (8161, 8162) + protagonista (8163)

/* Ritmo da sequência de chegadas da PÁGINA (Chamados aberto/fica ativo). */
export const PAGE_ARRIVAL_INITIAL_DELAY_MS = 2500;
export const PAGE_ARRIVAL_INTERVAL_MS = 4000;

/* ---------------------------------------------------------------------------
 * LINHA DE BASE — precisa bater com a Gestão Técnica
 * ------------------------------------------------------------------------- */
export const BASE_COUNTS = {
  aguardando: 4,    // Aguardando priorização
  encaminhados: 54, // Encaminhados ao supervisor
  atendimento: 22,  // Em atendimento
  concluidos: 1168, // Concluídos
};

export const TA_MEDIO_MIN = 27;
export const META_TA_MIN = 30;
export const TA_MEDIO_LABEL = `${TA_MEDIO_MIN} min`;
export const META_TA_LABEL = `meta ${META_TA_MIN} min`;

/* ---------------------------------------------------------------------------
 * DOMÍNIO — status, prioridades, origens, regiões, fluxo
 * ------------------------------------------------------------------------- */
export const STATUS_LABEL = {
  aberto: 'Aberto',
  encaminhado: 'Encaminhado ao supervisor',
  atendimento: 'Em atendimento',
  concluido: 'Concluído',
};

export const STATUS_TONE = {
  aberto: 'info',       // chamado novo/neutro: azul
  encaminhado: 'primary',
  atendimento: 'warning',
  concluido: 'success', // concluído: verde
};

/* status do chamado -> etapa do fluxo que ele conta */
export const STATUS_ETAPA = {
  aberto: 'aguardando',
  encaminhado: 'encaminhados',
  atendimento: 'atendimento',
  concluido: 'concluidos',
};

export const PRIORIDADES = {
  critica: { label: 'Crítica', tone: 'critical' }, // vermelho
  alta: { label: 'Alta', tone: 'warning' },        // laranja
  media: { label: 'Média', tone: 'info' },         // azul
  baixa: { label: 'Baixa', tone: 'muted' },        // cinza
  analise: { label: 'Em análise', tone: 'info' },   // protagonista ao entrar
};

/* Selo de origem dos eventos (os dois sistemas conversando). */
export const ORIGENS = {
  otis: 'Sistema OTIS',
  backoffice: 'Orquestra Backoffice',
  supervisor: 'Visão do Supervisor',
};

export const ORIGEM_TONE = {
  otis: 'info',
  backoffice: 'primary',
  supervisor: 'success',
};

export const REGIOES = ['Centro', 'Zona Sul', 'Zona Norte', 'Zona Leste', 'Zona Oeste'];

export const FLUXO_ETAPAS = [
  { id: 'aguardando', label: 'Aguardando priorização' },
  { id: 'encaminhados', label: 'Encaminhados ao supervisor' },
  { id: 'atendimento', label: 'Em atendimento' },
  { id: 'concluidos', label: 'Concluídos' },
];

/* ---------------------------------------------------------------------------
 * HELPERS
 * ------------------------------------------------------------------------- */

/** Código do chamado no formato "#CH-0008163" (7 dígitos, zeros à esquerda). */
export const fmtId = (n) => `#CH-${String(n).padStart(7, '0')}`;

/** Célula de local no formato "Local · Tipo de equipamento - Código". */
export const fmtLocal = (local, equipamento) => `${local} · ${equipamento}`;

const toMin = (h) => {
  const [H, M] = h.split(':').map(Number);
  return H * 60 + M;
};

/** true se a hora "a" é anterior ou igual à hora "b" (compara HH:MM). */
export const horaLte = (a, b) => toMin(a) <= toMin(b);

/** Soma minutos a "HH:MM" devolvendo "HH:MM". */
const addMin = (h, m) => {
  const t = toMin(h) + m;
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
};

/**
 * Tom do SLA conforme o consumo do prazo:
 * verde até 50%, amarelo 50–70%, laranja 70–100%, vermelho acima de 100%.
 */
export function slaTone(pct) {
  if (pct > 100) return 'critical';
  if (pct >= 70) return 'orange';
  if (pct >= 50) return 'warning';
  return 'success';
}

/** Formata número no padrão pt-BR (1.254). */
export const fmtNum = (n) => n.toLocaleString('pt-BR');

/**
 * Contagens SEMPRE derivadas: linha de base + chegadas de fundo (cada uma
 * conta na etapa do SEU próprio status) + status do protagonista. Garante as
 * relações Abertas/Total por construção.
 */
export function computeCounts(backgroundStatuses = [], protStatus = null) {
  const c = { ...BASE_COUNTS };
  backgroundStatuses.forEach((s) => {
    c[STATUS_ETAPA[s]] += 1;
  });
  if (protStatus) c[STATUS_ETAPA[protStatus]] += 1;
  c.abertas = c.aguardando + c.encaminhados;
  c.total = c.abertas + c.atendimento + c.concluidos;
  return c;
}

/* ---------------------------------------------------------------------------
 * FILA INICIAL — 12 chamados já na fila no início da demo (do mais recente
 * para o mais antigo). Locais plausíveis de São Paulo, reusando os que já
 * aparecem na Gestão Técnica (Hospital São Paulo, Shopping Center Norte...).
 * ------------------------------------------------------------------------- */
function chamado({ id, local, equipamento, ocorrencia, prioridade, regiao, status, slaPct, slaRestante, responsavel, chegada, contrato }) {
  return {
    id,
    codigo: fmtId(id),
    local,
    equipamento,
    localEquipamento: fmtLocal(local, equipamento),
    ocorrencia,
    prioridade,
    regiao,
    status,
    slaPct,
    slaRestante,
    responsavel,
    chegada,
    contrato,
    protagonista: false,
    timeline: null,
  };
}

/**
 * Timeline simples (3 a 5 eventos) para os chamados de fundo: aberto no
 * Sistema OTIS, priorizado no Backoffice, encaminhado ao supervisor.
 */
function gerarTimelineSimples(c) {
  const t = [{ hora: c.chegada, desc: 'Chamado aberto no Sistema OTIS', origem: 'otis' }];
  if (c.status === 'aberto') {
    t.push({ hora: addMin(c.chegada, 1), desc: 'Recebido pela integração com o Sistema OTIS', origem: 'backoffice' });
    t.push({ hora: addMin(c.chegada, 2), desc: 'Aguardando priorização no Backoffice', origem: 'backoffice' });
  } else {
    t.push({ hora: addMin(c.chegada, 1), desc: 'Contexto consolidado e triagem automática concluída', origem: 'backoffice' });
    t.push({ hora: addMin(c.chegada, 2), desc: `Prioridade ${PRIORIDADES[c.prioridade].label} definida`, origem: 'backoffice' });
    t.push({ hora: addMin(c.chegada, 3), desc: `Encaminhado ao supervisor da ${c.regiao}`, origem: 'backoffice' });
  }
  if (c.status === 'atendimento') {
    t.push({ hora: addMin(c.chegada, 8), desc: `Técnico no local: ${c.responsavel ?? 'em deslocamento'}`, origem: 'otis' });
  }
  return t.slice(0, 5);
}

const comTimeline = (list) => list.map((c) => ({ ...c, timeline: gerarTimelineSimples(c) }));

/* 5 chamados em alerta de SLA (laranja/vermelho) na linha de base. */
export const INITIAL_QUEUE = comTimeline([
  chamado({
    id: 8157, local: 'Hospital São Paulo', equipamento: 'Elevador Social - E01',
    ocorrencia: 'Falha de nivelamento', prioridade: 'critica', regiao: 'Zona Sul',
    status: 'atendimento', slaPct: 88, slaRestante: '4 min', responsavel: 'Téc. Marcos Ribeiro',
    chegada: '13:58', contrato: 'CT-2025-00124',
  }),
  chamado({
    id: 8156, local: 'Shopping Center Norte', equipamento: 'Escada Rolante - R12',
    ocorrencia: 'Corrimão desalinhado', prioridade: 'media', regiao: 'Zona Norte',
    status: 'encaminhado', slaPct: 42, slaRestante: '1h 10min', responsavel: 'Superv. Carlos Andrade',
    chegada: '13:52', contrato: 'CT-2025-00125',
  }),
  chamado({
    id: 8155, local: 'Edifício Corporate', equipamento: 'Elevador Social - E02',
    ocorrencia: 'Porta não fecha', prioridade: 'alta', regiao: 'Centro',
    status: 'atendimento', slaPct: 76, slaRestante: '14 min', responsavel: 'Téc. Jonas Prado',
    chegada: '13:49', contrato: 'CT-2025-00127',
  }),
  chamado({
    id: 8154, local: 'Hospital Life', equipamento: 'Elevador Maca - E05',
    ocorrencia: 'Parada por segurança', prioridade: 'critica', regiao: 'Zona Sul',
    status: 'atendimento', slaPct: 102, slaRestante: 'estourado', responsavel: 'Téc. Paula Souza',
    chegada: '13:47', contrato: 'CT-2025-00126',
  }),
  chamado({
    id: 8153, local: 'Shopping Ibirapuera', equipamento: 'Elevador Panorâmico - E01',
    ocorrencia: 'Cabine com ruído excessivo', prioridade: 'media', regiao: 'Zona Sul',
    status: 'encaminhado', slaPct: 73, slaRestante: '32 min', responsavel: 'Superv. Renata Alves',
    chegada: '13:44', contrato: 'CT-2025-00129',
  }),
  chamado({
    id: 8152, local: 'Metrô Santana', equipamento: 'Escada Rolante - M03',
    ocorrencia: 'Sensor de porta com falha', prioridade: 'alta', regiao: 'Zona Norte',
    status: 'atendimento', slaPct: 71, slaRestante: '17 min', responsavel: 'Téc. Bruno Alves',
    chegada: '13:40', contrato: 'CT-2025-00130',
  }),
  chamado({
    id: 8151, local: 'Residencial Aurora', equipamento: 'Elevador Social - E02',
    ocorrencia: 'Botão de chamada intermitente', prioridade: 'baixa', regiao: 'Zona Leste',
    status: 'encaminhado', slaPct: 24, slaRestante: '3h', responsavel: 'Superv. Douglas Lima',
    chegada: '13:36', contrato: 'CT-2025-00131',
  }),
  chamado({
    id: 8150, local: 'Edifício Paulista 900', equipamento: 'Elevador de Carga - C01',
    ocorrencia: 'Painel / comando intermitente', prioridade: 'media', regiao: 'Centro',
    status: 'aberto', slaPct: 12, slaRestante: '1h 45min', responsavel: null,
    chegada: '13:31', contrato: 'CT-2025-00132',
  }),
  chamado({
    id: 8149, local: 'Hospital São Paulo', equipamento: 'Elevador de Serviço - E07',
    ocorrencia: 'Luz queimada na casa de máquinas', prioridade: 'baixa', regiao: 'Zona Sul',
    status: 'encaminhado', slaPct: 30, slaRestante: '2h 50min', responsavel: 'Superv. Renata Alves',
    chegada: '13:25', contrato: 'CT-2025-00124',
  }),
  chamado({
    id: 8148, local: 'Shopping Center Norte', equipamento: 'Elevador Social - E03',
    ocorrencia: 'Velocidade irregular', prioridade: 'alta', regiao: 'Zona Norte',
    status: 'aberto', slaPct: 8, slaRestante: '55 min', responsavel: null,
    chegada: '13:21', contrato: 'CT-2025-00125',
  }),
  chamado({
    id: 8147, local: 'Faculdade Ipiranga', equipamento: 'Elevador de Acessibilidade - A01',
    ocorrencia: 'Botão de emergência sem sinal', prioridade: 'media', regiao: 'Zona Leste',
    status: 'encaminhado', slaPct: 38, slaRestante: '1h 15min', responsavel: 'Superv. Douglas Lima',
    chegada: '13:16', contrato: 'CT-2025-00133',
  }),
  chamado({
    id: 8146, local: 'Residencial Perdizes', equipamento: 'Elevador Social - E12',
    ocorrencia: 'Exaustor com ruído alto', prioridade: 'baixa', regiao: 'Zona Oeste',
    status: 'aberto', slaPct: 5, slaRestante: '3h 40min', responsavel: null,
    chegada: '13:15', contrato: 'CT-2025-00134',
  }),
]);

/* ---------------------------------------------------------------------------
 * ABERTURA DA PÁGINA "CHAMADOS" (modo normal, sem stage): a fila abre com
 * #CH-0008154..#CH-0008148 e os 3 mais recentes chegam um a um pelo topo.
 * ------------------------------------------------------------------------- */

/* Chegadas da abertura, em ordem: 8155, 8156, 8157. */
export const PAGE_ARRIVALS = INITIAL_QUEUE.slice(0, 3).reverse();

/* Fila visível no instante em que a página é aberta: 8154 .. 8148. */
export const PAGE_BASE_ROWS = INITIAL_QUEUE.slice(3, 10);

/**
 * Contagens da página na abertura: linha de base MENOS os chamados que
 * ainda não chegaram (recalculando Abertas e Total). Com todos presentes,
 * devolve exatamente a linha de base (58/22/1.168/1.248, risco 5).
 */
export function pageCounts(arrivedCount = 0) {
  const c = computeCounts([], null);
  PAGE_ARRIVALS.slice(arrivedCount).forEach((p) => {
    c[STATUS_ETAPA[p.status]] -= 1;
  });
  c.abertas = c.aguardando + c.encaminhados;
  c.total = c.abertas + c.atendimento + c.concluidos;
  return c;
}

/* Evento de feed gerado pela chegada de um chamado. */
export const feedChegada = (c) => ({
  hora: c.chegada,
  texto: `Chamado ${c.codigo} recebido do Sistema OTIS`,
  origem: 'otis',
});

/* ---------------------------------------------------------------------------
 * CHEGADAS DURANTE A DEMO — 2 de fundo (em ordem de chegada) + protagonista.
 * Os de fundo chegam já "Em atendimento": a execução segue no sistema OTIS
 * e o backoffice consolida o estado.
 * ------------------------------------------------------------------------- */
export const BACKGROUND_ARRIVALS = comTimeline([
  chamado({
    id: 8161, local: 'Hotel Estação Central', equipamento: 'Elevador Social - E05',
    ocorrencia: 'Painel / comando intermitente', prioridade: 'alta', regiao: 'Centro',
    status: 'atendimento', slaPct: 8, slaRestante: '55 min', responsavel: 'Téc. Rafael Costa',
    chegada: '14:01', contrato: 'CT-2025-00138',
  }),
  chamado({
    id: 8162, local: 'Residencial Perdizes', equipamento: 'Elevador Social - E14',
    ocorrencia: 'Luz queimada na cabine', prioridade: 'baixa', regiao: 'Zona Oeste',
    status: 'atendimento', slaPct: 2, slaRestante: '3h 50min', responsavel: 'Téc. Juliana Paiva',
    chegada: '14:02', contrato: 'CT-2025-00134',
  }),
]);

/* ---------------------------------------------------------------------------
 * PROTAGONISTA — #CH-0008163 (Hospital São Paulo · Elevador Social - E03)
 * ------------------------------------------------------------------------- */
export const PROTAGONISTA = {
  id: 8163,
  codigo: fmtId(8163),
  local: 'Hospital São Paulo',
  equipamento: 'Elevador Social - E03',
  localEquipamento: fmtLocal('Hospital São Paulo', 'Elevador Social - E03'),
  ocorrencia: 'Botão de emergência com desgaste',
  contrato: 'CT-2025-00124',
  regiaoFinal: 'Zona Sul',
  protagonista: true,
  chegada: '14:02',
};

/** Linha do tempo completa do protagonista (exibida conforme o estágio). */
export const TIMELINE_PROTAGONISTA = [
  { hora: '14:02', desc: 'Chamado aberto', origem: 'otis' },
  {
    hora: '14:03',
    desc: 'Contexto consolidado: local hospitalar, item de segurança, contrato CT-2025-00124 e SLA de chegada de 30 min',
    origem: 'backoffice',
  },
  { hora: '14:04', desc: 'Prioridade Alta definida e região Zona Sul identificada', origem: 'backoffice' },
  { hora: '14:05', desc: 'Encaminhado ao supervisor da Zona Sul', origem: 'backoffice' },
  { hora: '14:05', desc: 'Recebido pelo supervisor', origem: 'supervisor' },
  { hora: '14:24', desc: 'Alerta: 73% do SLA de chegada consumido', origem: 'backoffice' },
  { hora: '14:25', desc: 'Supervisor contatou o cliente', origem: 'supervisor' },
  { hora: '14:26', desc: 'Disponibilidade verificada e técnico designado, ETA 4 min', origem: 'supervisor' },
  { hora: '14:30', desc: 'Técnico no local: TA real 28 min, dentro da meta', origem: 'otis' },
  {
    hora: '15:12',
    desc: 'Chamado concluído, TB 1h10 — fechamento: Substituição do botão de emergência',
    origem: 'otis',
  },
];

/** Estado do protagonista por estágio (chaves não listadas = ainda não chegou). */
export const PROTAGONISTA_ESTAGIOS = {
  aberto: {
    status: 'aberto', prioridade: 'analise', regiao: null,
    slaPct: 0, slaRestante: '30 min', responsavel: null,
  },
  priorizado: {
    status: 'aberto', prioridade: 'alta', regiao: 'Zona Sul',
    slaPct: 7, slaRestante: '28 min', responsavel: null,
  },
  encaminhado: {
    status: 'encaminhado', prioridade: 'alta', regiao: 'Zona Sul',
    slaPct: 10, slaRestante: '27 min', responsavel: 'Superv. Renata Alves',
  },
  alerta: {
    status: 'encaminhado', prioridade: 'alta', regiao: 'Zona Sul',
    slaPct: 73, slaRestante: '8 min', responsavel: 'Superv. Renata Alves',
  },
  'em-atendimento': {
    status: 'atendimento', prioridade: 'alta', regiao: 'Zona Sul',
    slaPct: 80, slaRestante: '6 min', responsavel: 'Téc. Bruno Alves · ETA 4 min',
  },
  concluido: {
    status: 'concluido', prioridade: 'alta', regiao: 'Zona Sul',
    slaPct: 93, slaRestante: 'TA 28 min', responsavel: 'Téc. Bruno Alves',
  },
};

/* ---------------------------------------------------------------------------
 * FEED "EVENTOS DA INTEGRAÇÃO" — a tela monta a lista, mais recente no topo
 * ------------------------------------------------------------------------- */
/* Sem itens dos chamados que chegam na abertura (8155–8157): o feed ganha
 * o evento de cada um somente quando ele entra na fila. */
export const FEED_BASE = [
  { hora: '13:47', texto: 'Chamado #CH-0008154 priorizado como Crítica (Zona Sul)', origem: 'backoffice' },
  { hora: '13:40', texto: 'Chamado #CH-0008152 encaminhado ao supervisor da Zona Norte', origem: 'backoffice' },
  { hora: '13:36', texto: 'Chamado #CH-0008151 recebido do Sistema OTIS', origem: 'otis' },
  { hora: '13:31', texto: 'Chamado #CH-0008150 recebido do Sistema OTIS', origem: 'otis' },
];

/* Evento de chegada de cada novo chamado (índice = ordem de chegada). */
export const FEED_CHEGADAS = [
  { hora: '14:01', texto: 'Chamado #CH-0008161 recebido do Sistema OTIS', origem: 'otis' },
  { hora: '14:02', texto: 'Chamado #CH-0008162 recebido do Sistema OTIS', origem: 'otis' },
  {
    hora: '14:02',
    texto: 'Chamado #CH-0008163 recebido do Sistema OTIS — consolidação de contexto iniciada',
    origem: 'otis',
  },
];

/* Evento novo de cada estágio (além de "aberto", que usa as chegadas). */
export const FEED_ESTAGIO = {
  priorizado: {
    hora: '14:04', texto: 'Chamado #CH-0008163 priorizado como Alta — região Zona Sul', origem: 'backoffice',
  },
  encaminhado: {
    hora: '14:05', texto: 'Chamado #CH-0008163 encaminhado ao supervisor da Zona Sul', origem: 'backoffice',
  },
  alerta: {
    hora: '14:24', texto: 'Alerta de SLA: #CH-0008163 com 73% do prazo consumido', origem: 'backoffice',
  },
  'em-atendimento': {
    hora: '14:26', texto: 'Chamado #CH-0008163 em atendimento — técnico designado, ETA 4 min', origem: 'supervisor',
  },
  concluido: {
    hora: '15:12', texto: 'Chamado #CH-0008163 concluído — TA 28 min, TB 1h10', origem: 'otis',
  },
};




