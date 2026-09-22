import { ALERTA_SLA, CHAMADOS } from '../data/chamados.js';

/**
 * DADOS DAS CENAS DO TUTORIAL — SUPERVISOR
 *
 * O tutorial agora conta DUAS histórias independentes:
 * 1) CH-0008181 — Smart Fit: a demanda permanece no mesmo contexto e só
 *    muda de criticidade conforme o tempo restante de SLA diminui.
 * 2) CH-0008182 — Hospital: "Usuário preso no elevador" já chega CRÍTICA,
 *    já chega CRÍTICA, classificada como demanda prioritária antes de chegar ao Supervisor.
 */

/* ---------------------------------------------------------------------------
 * HISTÓRIA 1 — SMART FIT
 * ------------------------------------------------------------------------- */

export const ID_ALVO = 'CH-0008181';

const BASE_ALVO = {
  id: ID_ALVO,
  local: 'Academia Smart Fit Vila Olímpia',
  equipamento: 'Elevador Social - E03',
};

/**
 * O contexto NÃO muda entre as cenas. O que muda é somente a criticidade e o
 * tempo restante para o SLA. Isso deixa claro que o agravamento é temporal,
 * não uma mudança artificial no defeito.
 */
export const ETAPAS_ALVO = {
  normal: {
    ...BASE_ALVO,
    prioridade: 'normal',
    defeito: 'Botão de emergência com desgaste',
    tag: null,
    slaTexto: 'Faltam 6h40 para SLA',
    slaTempo: '06h40',
  },
  media: {
    ...BASE_ALVO,
    prioridade: 'media',
    defeito: 'Botão de emergência com desgaste',
    tag: null,
    slaTexto: 'Faltam 3h10 para SLA',
    slaTempo: '03h10',
  },
  alta: {
    ...BASE_ALVO,
    prioridade: 'alta',
    defeito: 'Botão de emergência com desgaste',
    tag: null,
    slaTexto: 'Faltam 50 min para SLA',
    slaTempo: '00h50',
  },
};

/* ---------------------------------------------------------------------------
 * HISTÓRIA 2 — HOSPITAL / SLA ESTOURADO
 * ------------------------------------------------------------------------- */

export const ID_CRITICO_HOSPITAL = 'CH-0008182';

export const DEMANDA_CRITICA_HOSPITAL = {
  id: ID_CRITICO_HOSPITAL,
  local: 'Hospital Central Paulista',
  equipamento: 'Elevador de Leitos - E02',
  prioridade: 'critica',
  defeito: 'Usuário preso no elevador',
  prioridadeLabel: 'Demanda prioritária',
  tempoDecorrido: '00h35',
  slaTexto: 'Tempo decorrido',
  // A demanda nasceu CRÍTICA por classificação do BackOffice; não há SLA associado a esta história.
  slaTempo: '00h35',
  semSla: true,
};

/* ---------------------------------------------------------------------------
 * LISTA DA TELA "CHAMADOS"
 * ------------------------------------------------------------------------- */

const IDS_NORMAIS_DE_FUNDO = ['CH-0008159', 'CH-0008166', 'CH-0008168', 'CH-0008170'];

const NORMAIS_DE_FUNDO = CHAMADOS.filter(
  (c) => IDS_NORMAIS_DE_FUNDO.includes(c.id) && c.prioridade === 'normal',
);

if (NORMAIS_DE_FUNDO.length !== IDS_NORMAIS_DE_FUNDO.length) {
  throw new Error('[tutorial] Algum chamado NORMAL de fundo não existe em data/chamados.js.');
}

function emMinutos(slaTempo) {
  const negativo = slaTempo.startsWith('-');
  // O contador usa o padrão "00h35" (h entre horas e minutos): normaliza para
  // "00:35" antes de quebrar em horas e minutos.
  const [horas, minutos] = slaTempo.replace('-', '').replace('h', ':').split(':').map(Number);
  const valor = horas * 60 + minutos;
  return negativo ? -valor : valor;
}

/** Menor tempo para estourar o SLA aparece primeiro. */
export function ordenarPorSla(chamados) {
  return [...chamados].sort((a, b) => emMinutos(a.slaTempo) - emMinutos(b.slaTempo));
}

export function listaComAlvoEm(etapa) {
  return ordenarPorSla([...NORMAIS_DE_FUNDO, ETAPAS_ALVO[etapa]]);
}

/** Lista com a criticidade da etapa informada, mas mantendo a posição física
 * da demanda onde ela estava antes da reordenação. Usada para separar em
 * cenas distintas a mudança de criticidade e a subida ao topo. */
export function listaComAlvoNaPosicaoBase(etapa) {
  return [...NORMAIS_DE_FUNDO, ETAPAS_ALVO[etapa]];
}

/** Lista usada quando a segunda história começa: o chamado crítico ainda
 * aparece no fim antes da animação de subida. */
export function listaHospitalCriticoAntesDaSubida() {
  return [ETAPAS_ALVO.alta, ...NORMAIS_DE_FUNDO, DEMANDA_CRITICA_HOSPITAL];
}

export function listaHospitalCriticoFinal() {
  // A demanda CRÍTICA não participa de ordenação por SLA: ela é prioritária
  // por classificação do BackOffice e deve assumir o topo ao avançar a cena.
  return [DEMANDA_CRITICA_HOSPITAL, ETAPAS_ALVO.alta, ...NORMAIS_DE_FUNDO];
}

/* ---------------------------------------------------------------------------
 * DETALHES DA HISTÓRIA 1 — SMART FIT
 * ------------------------------------------------------------------------- */

const ENDERECO_SMARTFIT = 'Av. dos Bandeirantes, 3900';
const REGIAO_SMARTFIT = 'SP - Sul';

export const DETALHES_ALVO = {
  normal: {
    endereco: ENDERECO_SMARTFIT,
    regiao: REGIAO_SMARTFIT,
    impacto: { slaPrevista: '17h25', ta: '00h05', tb: '06h40' },
    tecnico: { nome: 'Paulo Menezes', status: 'Disponível', distancia: '6 km', eta: '18 min' },
    peca: {
      local: 'Almoxarifado Centro – SP',
      endereco: 'R. das Indústrias, 120',
      eta: '20 min',
      itens: ['Botão de emergência ×1'],
    },
    acoes: ['Agendar visita na próxima janela', 'Confirmar disponibilidade de peça', 'Manter prioridade padrão'],
  },
  media: {
    endereco: ENDERECO_SMARTFIT,
    regiao: REGIAO_SMARTFIT,
    impacto: { slaPrevista: '14h04', ta: '00h14', tb: '03h10' },
    tecnico: { nome: 'Paulo Menezes', status: 'Disponível', distancia: '6 km', eta: '18 min' },
    peca: {
      local: 'CD Regional – SP',
      endereco: 'Av. Martistrias, 3000',
      eta: '35 min',
      itens: ['Botão de emergência ×1'],
    },
    acoes: ['Antecipar a visita do técnico', 'Confirmar disponibilidade de peça', 'Acompanhar tendência de SLA'],
  },
  alta: {
    endereco: ENDERECO_SMARTFIT,
    regiao: REGIAO_SMARTFIT,
    impacto: { slaPrevista: '11h56', ta: '00h26', tb: '00h50' },
    tecnico: { nome: 'Paulo Menezes', status: 'A caminho', distancia: '6 km', eta: '18 min' },
    peca: {
      local: 'CD Regional – SP',
      endereco: 'Av. Martistrias, 3000',
      eta: '30 min',
      itens: ['Botão de emergência ×1'],
    },
    acoes: ['Despachar técnico para a unidade', 'Confirmar chegada do técnico', 'Priorizar atendimento antes do estouro do SLA'],
  },
};

/* ---------------------------------------------------------------------------
 * DETALHES DA HISTÓRIA 2 — HOSPITAL
 * ------------------------------------------------------------------------- */

export const DETALHE_CRITICO_HOSPITAL = {
  endereco: 'R. Vergueiro, 1800',
  regiao: 'SP - Centro',
  semSla: true,
  tempoDecorrido: '00h35',
  impacto: { ta: '00h35' },
  tecnico: { nome: 'João da Silva', status: 'A caminho', distancia: '8 km', eta: '14 min' },
  peca: {
    local: 'CD Regional – SP',
    endereco: 'Av. Martistrias, 3000',
    eta: '25 min',
    itens: ['Sensor de nível ×1', 'Placa de comando ×1'],
  },
  acoes: [
    'Acionar imediatamente o técnico',
    'Confirmar suporte de emergência',
    'Priorizar imediatamente a resolução da demanda crítica',
  ],
};

/* ---------------------------------------------------------------------------
 * ALERTAS
 * ------------------------------------------------------------------------- */

export const ALERTA_ALTA = {
  ...ALERTA_SLA,
  titulo: 'Alerta – Risco de Estouro de SLA',
  chamadoId: ID_ALVO,
  minutos: 50,
  acoes: DETALHES_ALVO.alta.acoes,
};

export const ALERTA_CRITICO = {
  titulo: 'Alerta – Demanda Prioritária',
  chamadoId: ID_CRITICO_HOSPITAL,
  minutos: 35,
  acoes: DETALHE_CRITICO_HOSPITAL.acoes,
};

export const DETALHE_ALVO = DETALHES_ALVO.alta;
