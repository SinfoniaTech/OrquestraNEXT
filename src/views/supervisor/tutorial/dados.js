import { ALERTA_SLA, CHAMADOS } from '../data/chamados.js';

/**
 * DADOS DAS CENAS DO TUTORIAL — SUPERVISOR
 *
 * A lista de "fundo" (4 chamados NORMAIS) vem dos dados mock que o app do
 * Supervisor já usa (data/chamados.js). Já a demanda que atravessa todas as
 * criticidades é NOVA e existe só aqui — nada é alterado em data/chamados.js.
 */

/* ---------------------------------------------------------------------------
 * A DEMANDA DO TUTORIAL — um elevador de leitos num hospital de São Paulo.
 *
 * O problema relatado EVOLUI junto com a criticidade (cada etapa descreve um
 * agravamento do anterior), e o tempo restante de SLA encolhe a cada etapa:
 *
 *   NORMAL   um ruído leve na porta, sem impacto na operação;
 *   MÉDIA    o ruído virou recorrente e a porta já demora a fechar;
 *   ALTA     a cabine para desnivelada no andar da UTI, o que atrapalha o
 *            transporte de leitos e macas;
 *   CRÍTICA  a cabine parou entre andares com um paciente dentro.
 * ------------------------------------------------------------------------- */

/** Id da demanda do tutorial (não existe em data/chamados.js). */
export const ID_ALVO = 'CH-0008181';

const BASE_ALVO = {
  id: ID_ALVO,
  local: 'Hospital Central Paulista',
  equipamento: 'Elevador de Leitos - E02',
};

/** A demanda em cada etapa de criticidade. */
export const ETAPAS_ALVO = {
  normal: {
    ...BASE_ALVO,
    prioridade: 'normal',
    defeito: 'Ruído leve na porta do 3º andar',
    tag: null,
    slaTexto: 'Faltam 6h40 para SLA',
    slaTempo: '06:40',
  },
  media: {
    ...BASE_ALVO,
    prioridade: 'media',
    defeito: 'Porta lenta e ruído recorrente',
    tag: null,
    slaTexto: 'Faltam 3h10 para SLA',
    slaTempo: '03:10',
  },
  alta: {
    ...BASE_ALVO,
    prioridade: 'alta',
    defeito: 'Desnível na parada da UTI',
    tag: null,
    slaTexto: 'Faltam 50 min para SLA',
    slaTempo: '00:50',
  },
  critica: {
    ...BASE_ALVO,
    prioridade: 'critica',
    defeito: 'Cabine parada entre andares',
    tag: 'Paciente preso',
    slaTexto: 'Faltam 12 min para SLA',
    slaTempo: '00:12',
  },
};

/* ---------------------------------------------------------------------------
 * LISTA DA TELA "CHAMADOS"
 * ------------------------------------------------------------------------- */

/** Os demais chamados da tela: todos NORMAIS (situação amena da operação). */
const IDS_NORMAIS_DE_FUNDO = ['CH-0008163', 'CH-0008166', 'CH-0008168', 'CH-0008170'];

const NORMAIS_DE_FUNDO = CHAMADOS.filter(
  (c) => IDS_NORMAIS_DE_FUNDO.includes(c.id) && c.prioridade === 'normal',
);

if (NORMAIS_DE_FUNDO.length !== IDS_NORMAIS_DE_FUNDO.length) {
  throw new Error('[tutorial] Algum chamado NORMAL de fundo não existe em data/chamados.js.');
}

/** "hh:mm" → minutos (para ordenar pelo tempo restante de SLA). */
function emMinutos(slaTempo) {
  const [horas, minutos] = slaTempo.split(':').map(Number);
  return horas * 60 + minutos;
}

/** Mesma ordenação do app: menor tempo restante para estourar o SLA primeiro. */
export function ordenarPorSla(chamados) {
  return [...chamados].sort((a, b) => emMinutos(a.slaTempo) - emMinutos(b.slaTempo));
}

/**
 * A tela com a demanda do tutorial na etapa pedida ('normal' | 'media' |
 * 'alta' | 'critica'), já ordenada por SLA. Sempre 5 chamados.
 */
export function listaComAlvoEm(etapa) {
  return ordenarPorSla([...NORMAIS_DE_FUNDO, ETAPAS_ALVO[etapa]]);
}

/* ---------------------------------------------------------------------------
 * DETALHES DA DEMANDA (tela que abre ao clicar no card + pop-up da Cena 5)
 *
 * Mesmo formato de DETALHES_CHAMADOS do app (data/chamados.js), um por etapa
 * de criticidade. Os números são coerentes entre si: a demanda foi aberta às
 * 10:40 e a cada etapa o SLA é recalculado para a nova criticidade, então
 * "solução prevista" = agora + tempo restante (TB) e o TA só cresce:
 *
 *   etapa     agora   TA     TB     solução prevista
 *   NORMAL    10:45   00:05  06:40  17:25
 *   MÉDIA     10:54   00:14  03:10  14:04
 *   ALTA      11:06   00:26  00:50  11:56
 *   CRÍTICA   11:18   00:38  00:12  11:30
 *
 * O TB é sempre igual ao tempo do card (slaTempo da etapa). Técnico, peça e
 * ações acompanham o agravamento: de "só agendar" até "acionar a emergência
 * do hospital".
 * ------------------------------------------------------------------------- */

const ENDERECO_ALVO = 'R. Vergueiro, 1800';
const REGIAO_ALVO = 'SP - Sul';

/** Ações da etapa crítica: as mesmas do aviso (Cena 5) e do detalhe. */
const ACOES_CRITICA = [
  'Verificar status do técnico',
  'Confirmar disponibilidade de peça',
  'Acionar a equipe de emergência do hospital',
];

/** Detalhes da demanda em cada etapa de criticidade. */
export const DETALHES_ALVO = {
  normal: {
    endereco: ENDERECO_ALVO,
    regiao: REGIAO_ALVO,
    impacto: { slaPrevista: '17:25', ta: '00:05', tb: '06:40' },
    tecnico: { nome: 'Paulo Menezes', status: 'Disponível', distancia: '12 km', eta: '30 min' },
    peca: {
      local: 'Almoxarifado Centro – SP',
      endereco: 'R. das Indústrias, 120',
      eta: '20 min',
      itens: ['Kit de lubrificação de porta ×1'],
    },
    acoes: [
      'Agendar visita na próxima janela',
      'Registrar o ruído para acompanhamento',
      'Manter prioridade padrão',
    ],
  },
  media: {
    endereco: ENDERECO_ALVO,
    regiao: REGIAO_ALVO,
    impacto: { slaPrevista: '14:04', ta: '00:14', tb: '03:10' },
    tecnico: { nome: 'Paulo Menezes', status: 'Disponível', distancia: '12 km', eta: '30 min' },
    peca: {
      local: 'CD Regional – SP',
      endereco: 'Av. Martistrias, 3000',
      eta: '55 min',
      itens: ['Rolamento de guia da porta ×2'],
    },
    acoes: [
      'Antecipar a visita do técnico',
      'Confirmar disponibilidade de peça',
      'Acompanhar tendência de SLA',
    ],
  },
  alta: {
    endereco: ENDERECO_ALVO,
    regiao: REGIAO_ALVO,
    impacto: { slaPrevista: '11:56', ta: '00:26', tb: '00:50' },
    tecnico: { nome: 'Paulo Menezes', status: 'A caminho', distancia: '11 km', eta: '20 min' },
    peca: {
      local: 'CD Regional – SP',
      endereco: 'Av. Martistrias, 3000',
      eta: '45 min',
      itens: ['Sensor de nivelamento ×1'],
    },
    acoes: [
      'Despachar técnico para o hospital',
      'Avisar a coordenação da UTI sobre o desnível',
      'Avaliar parada preventiva do equipamento',
    ],
  },
  critica: {
    endereco: ENDERECO_ALVO,
    regiao: REGIAO_ALVO,
    impacto: { slaPrevista: '11:30', ta: '00:38', tb: '00:12' },
    tecnico: { nome: 'Paulo Menezes', status: 'A caminho', distancia: '8 km', eta: '14 min' },
    peca: {
      local: 'CD Regional – SP',
      endereco: 'Av. Martistrias, 3000',
      eta: '35 min',
      itens: ['Placa de comando de porta ×1', 'Sensor de nivelamento ×1'],
    },
    acoes: ACOES_CRITICA,
  },
};

/* ---------------------------------------------------------------------------
 * CENA 5 — o aviso da demanda crítica
 * ------------------------------------------------------------------------- */

/** Conteúdo do pop-up: mesmo formato do alerta do app, apontando para o chamado crítico. */
export const ALERTA_CRITICO = {
  ...ALERTA_SLA,
  chamadoId: ID_ALVO,
  minutos: 12,
  acoes: ACOES_CRITICA,
};

/** Detalhes exibidos quando o pop-up "cresce" (botão "Ver detalhes"): a etapa crítica. */
export const DETALHE_ALVO = DETALHES_ALVO.critica;
