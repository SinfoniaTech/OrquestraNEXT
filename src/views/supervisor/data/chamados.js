/**
 * DADOS MOCKADOS da visualização Supervisor.
 *
 * Reproduzem o conteúdo exibido na referência (painel mobile de chamadas
 * abertas do supervisor de manutenção de elevadores). Quando houver
 * backend, este arquivo será substituído por uma camada de dados real —
 * os componentes consomem apenas estas estruturas.
 */

export const PRIORIDADES = {
  critica: { label: 'CRÍTICA', icone: 'shield-alert' },
  alta: { label: 'ALTA', icone: 'triangle-alert' },
  media: { label: 'MÉDIA', icone: 'triangle-alert' },
  normal: { label: 'NORMAL', icone: 'triangle-alert' },
};

/**
 * @typedef {Object} Chamado
 * @property {string} id            Identificador exibido (ex.: CH-0008123)
 * @property {'critica'|'alta'|'media'|'normal'} prioridade
 * @property {string} local         Cliente / edificação
 * @property {string} equipamento   Elevador afetado
 * @property {string} defeito       Resumo da falha
 * @property {string|null} tag      Chip extra (ex.: "Passageiro preso")
 * @property {string} slaTexto      Texto humano do tempo restante
 * @property {string} slaTempo      Tempo restante formatado (00h00)
 */

/** @type {Chamado[]} */
export const CHAMADOS = [
  {
    id: 'CH-0008123',
    prioridade: 'critica',
    local: 'Hospital São Paulo',
    equipamento: 'Elevador Social - E01',
    defeito: 'Falha de Nivelamento',
    tag: 'Passageiro preso',
    slaTexto: 'Faltam 12 min para SLA',
    slaTempo: '00h12',
  },
  {
    id: 'CH-0008127',
    prioridade: 'alta',
    local: 'Hospital São Paulo',
    equipamento: 'Elevador Maca - E02',
    defeito: 'Porta não fecha',
    tag: null,
    slaTexto: 'Faltam 25 min para SLA',
    slaTempo: '00h25',
  },
  {
    id: 'CH-0008133',
    prioridade: 'alta',
    local: 'Shopping Ibirapuera',
    equipamento: 'Elevador Panorâmico - E01',
    defeito: 'Cabine com ruído excessivo',
    tag: null,
    slaTexto: 'Faltam 65 min para SLA',
    slaTempo: '01h05',
  },
  {
    id: 'CH-0008131',
    prioridade: 'alta',
    local: 'Shopping Ibirapuera',
    equipamento: 'Elevador Carga - E04',
    defeito: 'Velocidade irregular',
    tag: null,
    slaTexto: 'Faltam 75 min para SLA',
    slaTempo: '01h15',
  },
  {
    id: 'CH-0008125',
    prioridade: 'media',
    local: 'Building Complex',
    equipamento: 'Elevador de Serviço',
    defeito: 'Luz queimada',
    tag: null,
    slaTexto: 'Faltam 3h15 para SLA',
    slaTempo: '03h15',
  },
  {
    id: 'CH-0008151',
    prioridade: 'media',
    local: 'Edifício Corporate',
    equipamento: 'Elevador - EDF',
    defeito: 'Falha no painel',
    tag: null,
    slaTexto: 'Faltam 3h45 para SLA',
    slaTempo: '03h45',
  },
  {
    id: 'CH-0008155',
    prioridade: 'media',
    local: 'Condomínio Residencial Aurora',
    equipamento: 'Elevador Social - E02',
    defeito: 'Botão de chamada intermitente',
    tag: null,
    slaTexto: 'Faltam 4h10 para SLA',
    slaTempo: '04h10',
  },
  {
    id: 'CH-0008160',
    prioridade: 'media',
    local: 'Escola Vista Alegre',
    equipamento: 'Elevador de Acessibilidade',
    defeito: 'Sensor de porta com falha esporádica',
    tag: null,
    slaTexto: 'Faltam 4h40 para SLA',
    slaTempo: '04h40',
  },
  {
    id: 'CH-0008159',
    prioridade: 'normal',
    local: 'Centro de Convenções Rebouças',
    equipamento: 'Elevador Panorâmico - E01',
    defeito: 'Iluminação da cabine oscilando',
    tag: null,
    slaTexto: 'Faltam 5h05 para SLA',
    slaTempo: '05h05',
  },
  {
    id: 'CH-0008166',
    prioridade: 'normal',
    local: 'Hotel Bourbon Convention Ibirapuera',
    equipamento: 'Elevador Social - E05',
    defeito: 'Alarme de cabine acionando sem parar',
    tag: null,
    slaTexto: 'Faltam 5h30 para SLA',
    slaTempo: '05h30',
  },
  {
    id: 'CH-0008168',
    prioridade: 'normal',
    local: 'Galeria Paulista Offices',
    equipamento: 'Elevador de Carga - E02',
    defeito: 'Freio com ruído intermitente',
    tag: null,
    slaTexto: 'Faltam 5h55 para SLA',
    slaTempo: '05h55',
  },
  {
    id: 'CH-0008170',
    prioridade: 'normal',
    local: 'Residencial Jardim das Acácias',
    equipamento: 'Elevador Social - E01',
    defeito: 'Display do indicador de piso apagado',
    tag: null,
    slaTexto: 'Faltam 6h20 para SLA',
    slaTempo: '06h20',
  },
  {
    id: 'CH-0008172',
    prioridade: 'normal',
    local: 'Edifício Horizonte Itaim',
    equipamento: 'Elevador Panorâmico - E02',
    defeito: 'Teclado de comando sem resposta parcial',
    tag: null,
    slaTexto: 'Faltam 6h45 para SLA',
    slaTempo: '06h45',
  },
  {
    id: 'CH-0008175',
    prioridade: 'normal',
    local: 'Condomínio Portões do Carmo',
    equipamento: 'Elevador de Serviço - E04',
    defeito: 'Ventilação da casa de máquinas ruidosa',
    tag: null,
    slaTexto: 'Faltam 7h10 para SLA',
    slaTempo: '07h10',
  },
];

/** Alerta de risco de estouro de SLA exibido no modal de abertura. */
export const ALERTA_SLA = {
  titulo: 'Alerta – Risco de Estouro de SLA',
  chamadoId: 'CH-0008123',
  minutos: 12,
  acoes: [
    'Verificar status do técnico',
    'Confirmar disponibilidade de peça',
    'Reforçar prioridade do atendimento',
  ],
};

/* ---------------------------------------------------------------------------
 * TELAS /mapa, /alertas e /mais (mesma fonte de dados mock da referência)
 * ------------------------------------------------------------------------- */

/**
 * @typedef {Object} RegiaoChamado
 * @property {string} id       Identificador do chamado (chave em CHAMADOS)
 * @property {string} defeito  Resumo da falha exibido na linha
 * @property {string} tempo    Contador de SLA exibido à direita (00h00)
 */

/**
 * @typedef {Object} Regiao
 * @property {string} nome       Nome da região (ex.: SP - Centro)
 * @property {number} ativos     Chamados ativos na região
 * @property {number} criticos   Chamados críticos na região
 * @property {number} tecnicos   Técnicos alocados na região
 * @property {string} tbMedio    Tempo médio de solução na região (00h00)
 * @property {RegiaoChamado[]} chamados Chamados abertos na região
 */

/** @type {Regiao[]} */
export const REGIOES = [
  {
    nome: 'SP - Centro',
    ativos: 2,
    criticos: 1,
    tecnicos: 4,
    tbMedio: '01h52',
    chamados: [
      { id: 'CH-0008123', defeito: 'Falha de Nivelamento', tempo: '00h12' },
      { id: 'CH-0008127', defeito: 'Porta não fecha', tempo: '00h25' },
    ],
  },
  {
    nome: 'SP - Sul',
    ativos: 2,
    criticos: 0,
    tecnicos: 3,
    tbMedio: '02h10',
    chamados: [
      {
        id: 'CH-0008133',
        defeito: 'Cabine com ruído excessivo',
        tempo: '01h05',
      },
      { id: 'CH-0008131', defeito: 'Velocidade irregular', tempo: '01h15' },
      {
        id: 'CH-0008160',
        defeito: 'Sensor de porta com falha esporádica',
        tempo: '04h40',
      },
    ],
  },
  {
    nome: 'SP - Oeste',
    ativos: 2,
    criticos: 0,
    tecnicos: 5,
    tbMedio: '01h35',
    chamados: [
      { id: 'CH-0008151', defeito: 'Falha no painel', tempo: '03h45' },
    ],
  },
  {
    nome: 'SP - Norte',
    ativos: 1,
    criticos: 0,
    tecnicos: 2,
    tbMedio: '02h40',
    chamados: [
      { id: 'CH-0008125', defeito: 'Luz queimada', tempo: '03h15' },
    ],
  },
];

/** Ids dos chamados em risco de estouro de SLA (tela Alertas). */
export const CHAMADOS_EM_RISCO = ['CH-0008123'];

/**
 * Legenda de cores de status de SLA exibida na tela Alertas.
 * `id` resolve a classe da bolinha (.statusDot.verde etc.).
 */
export const LEGENDA_STATUS = [
  { id: 'verde', rotulo: 'Verde', descricao: 'dentro do SLA' },
  { id: 'amarelo', rotulo: 'Amarelo', descricao: 'atenção (tendência de estourar)' },
  { id: 'vermelho', rotulo: 'Vermelho', descricao: 'risco / estourado' },
];

/**
 * Distribuição de ordens de serviço do dia (tela Mais).
 * `cor` resolve as classes dos segmentos da barra e dos pontos da legenda.
 */
export const DISTRIBUICAO_OS = [
  { id: 'critico', label: 'Crítico', percentual: 13, cor: 'critica' },
  { id: 'urgente', label: 'Urgente', percentual: 38, cor: 'alta' },
  { id: 'padrao', label: 'Padrão', percentual: 50, cor: 'media' },
];

/** Indicadores consolidados do dia (tela Mais). */
export const KPIS = [
  { id: 'ta', rotulo: 'TA médio (chegada)', valor: '00h38' },
  { id: 'tb', rotulo: 'TB médio (solução)', valor: '01h59' },
  { id: 'sla', rotulo: 'SLA cumprido (30d)', valor: '92%' },
  { id: 'recorrencias', rotulo: 'Recorrências (30d)', valor: '7' },
];

/** Padrões identificados pela análise da operação (tela Mais). */
export const PADROES_IDENTIFICADOS = [
  'Falhas de nivelamento concentradas no Hospital São Paulo (3 em 30 dias).',
  'Ruído de cabine recorrente em elevadores panorâmicos da zona sul.',
  '40% dos deslocamentos acima de 12 km — avaliar pré-posicionamento de peças.',
];

/** Etapas do ciclo de valor Orquestra (tela Mais). */
export const CICLO_VALOR = [
  'Evento',
  'Contexto',
  'Decisão',
  'Histórico',
  'Padrão',
  'Predição',
  'Recomendação',
  'Melhoria',
];

/* ---------------------------------------------------------------------------
 * DETALHE DO CHAMADO (/chamados/:id) — dados complementares de cada chamado
 * ------------------------------------------------------------------------- */

/**
 * @typedef {Object} DetalheChamado
 * @property {string} endereco  Endereço do cliente
 * @property {string} regiao    Região operacional (ex.: SP - Centro)
 * @property {{slaPrevista: string, ta: string, tb: string}} impacto
 *   slaPrevista: horário de solução prevista; ta: tempo decorrido desde a
 *   abertura; tb: tempo restante de SLA (00h00)
 * @property {{nome: string, status: string, distancia: string, eta: string}} tecnico
 *   distancia em km e eta em minutos até o cliente
 * @property {{local: string, endereco: string, eta: string, itens: string[]}} peca
 *   Origem da peça mais rápida, com os itens já com as quantidades (ex.:
 *   "Sensor de Nível (SNS-2000) ×1")
 * @property {string[]} acoes  Ações sugeridas pelo Orquestra
 */

/** @type {Record<string, DetalheChamado>} */
export const DETALHES_CHAMADOS = {
  'CH-0008123': {
    endereco: 'R. das Indústrias, 120',
    regiao: 'SP - Centro',
    impacto: { slaPrevista: '09h00', ta: '00h44', tb: '00h12' },
    tecnico: {
      nome: 'João da Silva',
      status: 'A caminho',
      distancia: '12 km',
      eta: '18 min',
    },
    peca: {
      local: 'CD Regional – SP',
      endereco: 'Av. Martistrias, 3000',
      eta: '40 min',
      itens: ['Sensor de Nível (SNS-2000) ×1', 'Placa Interface'],
    },
    acoes: [
      'Verificar status do técnico',
      'Confirmar disponibilidade de peça',
      'Reforçar prioridade do atendimento',
    ],
  },
  'CH-0008127': {
    endereco: 'R. das Indústrias, 120',
    regiao: 'SP - Centro',
    impacto: { slaPrevista: '09h45', ta: '00h35', tb: '00h25' },
    tecnico: {
      nome: 'Ana Prado',
      status: 'A caminho',
      distancia: '9 km',
      eta: '16 min',
    },
    peca: {
      local: 'CD Regional – SP',
      endereco: 'Av. Martistrias, 3000',
      eta: '35 min',
      itens: ['Operador de porta ×1'],
    },
    acoes: [
      'Verificar status do técnico',
      'Priorizar por criticidade hospitalar',
      'Confirmar acesso ao pavimento',
    ],
  },
  'CH-0008133': {
    endereco: 'Av. Ibirapuera, 3103',
    regiao: 'SP - Sul',
    impacto: { slaPrevista: '10h30', ta: '00h22', tb: '01h05' },
    tecnico: {
      nome: 'Marcos Reis',
      status: 'Em atendimento',
      distancia: '6 km',
      eta: '25 min',
    },
    peca: {
      local: 'CD Regional – SP',
      endereco: 'Av. Martistrias, 3000',
      eta: '55 min',
      itens: ['Kit rolamento guia ×2'],
    },
    acoes: [
      'Confirmar diagnóstico em campo',
      'Avaliar necessidade de parada preventiva',
      'Comunicar responsável do cliente',
    ],
  },
  'CH-0008131': {
    endereco: 'Av. Ibirapuera, 3103',
    regiao: 'SP - Sul',
    impacto: { slaPrevista: '11h00', ta: '00h18', tb: '01h15' },
    tecnico: {
      nome: 'Carlos Lima',
      status: 'Disponível',
      distancia: '14 km',
      eta: '28 min',
    },
    peca: {
      local: 'CD Regional – SP',
      endereco: 'Av. Martistrias, 3000',
      eta: '50 min',
      itens: ['Inversor de frequência ×1'],
    },
    acoes: [
      'Despachar técnico disponível',
      'Confirmar leitura de IoT do inversor',
      'Registrar impacto operacional',
    ],
  },
  'CH-0008125': {
    endereco: 'R. Voluntários da Pátria, 900',
    regiao: 'SP - Norte',
    impacto: { slaPrevista: '13h30', ta: '00h08', tb: '03h15' },
    tecnico: {
      nome: 'Bruno Alves',
      status: 'Disponível',
      distancia: '7 km',
      eta: '20 min',
    },
    peca: {
      local: 'Almoxarifado Centro – SP',
      endereco: 'R. das Indústrias, 120',
      eta: '15 min',
      itens: ['Luminária de cabine ×1'],
    },
    acoes: [
      'Agrupar com atendimento da região',
      'Confirmar item em almoxarifado local',
      'Manter prioridade padrão',
    ],
  },
  'CH-0008151': {
    endereco: 'Av. Faria Lima, 2200',
    regiao: 'SP - Oeste',
    impacto: { slaPrevista: '13h00', ta: '00h10', tb: '03h45' },
    tecnico: {
      nome: 'Rafael Souza',
      status: 'Disponível',
      distancia: '18 km',
      eta: '35 min',
    },
    peca: {
      local: 'CD Regional – SP',
      endereco: 'Av. Martistrias, 3000',
      eta: '60 min',
      itens: ['Placa de comando ×1'],
    },
    acoes: [
      'Agendar janela com o cliente',
      'Validar disponibilidade de placa',
      'Acompanhar tendência de SLA',
    ],
  },
  'CH-0008155': {
    endereco: 'R. Augusta, 1500',
    regiao: 'SP - Leste',
    impacto: { slaPrevista: '14h00', ta: '00h05', tb: '04h10' },
    tecnico: {
      nome: 'Diego Mendes',
      status: 'Disponível',
      distancia: '11 km',
      eta: '22 min',
    },
    peca: {
      local: 'Almoxarifado Leste – SP',
      endereco: 'Av. Radial Leste, 450',
      eta: '20 min',
      itens: ['Botoeira de hall ×1'],
    },
    acoes: [
      'Agrupar com rota da região leste',
      'Confirmar botoeira em estoque local',
      'Informar síndico sobre janela de atendimento',
    ],
  },
  'CH-0008160': {
    endereco: 'R. Domingos de Morais, 800',
    regiao: 'SP - Sul',
    impacto: { slaPrevista: '14h30', ta: '00h03', tb: '04h40' },
    tecnico: {
      nome: 'Fernanda Costa',
      status: 'Disponível',
      distancia: '15 km',
      eta: '30 min',
    },
    peca: {
      local: 'CD Regional – SP',
      endereco: 'Av. Martistrias, 3000',
      eta: '50 min',
      itens: ['Sensor de porta (SPD-1000) ×1'],
    },
    acoes: [
      'Agendar atendimento fora do horário de pico escolar',
      'Verificar histórico de falhas no sensor',
      'Reservar sensor de reposição',
    ],
  },
  'CH-0008159': {
    endereco: 'Av. Rebouças, 600',
    regiao: 'SP - Oeste',
    impacto: { slaPrevista: '17h05', ta: '00h15', tb: '05h05' },
    tecnico: {
      nome: 'Marcos Ribeiro',
      status: 'Em rota',
      distancia: '9 km',
      eta: '25 min',
    },
    peca: {
      local: 'Almoxarifado Oeste – SP',
      endereco: 'R. Turiaçu, 240',
      eta: '35 min',
      itens: ['Módulo de iluminação LED ×1'],
    },
    acoes: [
      'Agendar visita fora do horário de pico',
      'Levar módulo de iluminação reserva',
      'Registrar histórico do quadro',
    ],
  },
  'CH-0008166': {
    endereco: 'Av. Ibirapuera, 2307',
    regiao: 'SP - Sul',
    impacto: { slaPrevista: '17h30', ta: '00h20', tb: '05h30' },
    tecnico: {
      nome: 'Patrícia Nunes',
      status: 'Disponível',
      distancia: '12 km',
      eta: '30 min',
    },
    peca: {
      local: 'CD Regional – SP',
      endereco: 'Av. Martistrias, 3000',
      eta: '55 min',
      itens: ['Central de alarme ×1'],
    },
    acoes: [
      'Silenciar alarme na central',
      'Inspecionar sensores da cabine',
      'Comunicar gerência do hotel',
    ],
  },
  'CH-0008168': {
    endereco: 'Av. Paulista, 1578',
    regiao: 'SP - Centro',
    impacto: { slaPrevista: '17h55', ta: '00h35', tb: '05h55' },
    tecnico: {
      nome: 'Alan Ferreira',
      status: 'Disponível',
      distancia: '6 km',
      eta: '18 min',
    },
    peca: {
      local: 'Almoxarifado Centro – SP',
      endereco: 'R. das Indústrias, 120',
      eta: '25 min',
      itens: ['Kit pastilha de freio ×1'],
    },
    acoes: [
      'Testar frenagem em movimento vazio',
      'Avaliar desgaste do conjunto de freio',
      'Programar manutenção preventiva',
    ],
  },
  'CH-0008170': {
    endereco: 'Av. das Nações Unidas, 12901',
    regiao: 'SP - Sul',
    impacto: { slaPrevista: '18h20', ta: '00h40', tb: '06h20' },
    tecnico: {
      nome: 'Camila Torres',
      status: 'Disponível',
      distancia: '16 km',
      eta: '35 min',
    },
    peca: {
      local: 'CD Regional – SP',
      endereco: 'Av. Martistrias, 3000',
      eta: '50 min',
      itens: ['Display LED de piso ×1'],
    },
    acoes: [
      'Confirmar modelo do display com o fabricante',
      'Agrupar com a rota da região sul',
      'Avisar síndico sobre a janela de visita',
    ],
  },
  'CH-0008172': {
    endereco: 'R. Joaquim Floriano, 820',
    regiao: 'SP - Oeste',
    impacto: { slaPrevista: '18h45', ta: '00h50', tb: '06h45' },
    tecnico: {
      nome: 'Rodrigo Pinto',
      status: 'Disponível',
      distancia: '13 km',
      eta: '28 min',
    },
    peca: {
      local: 'Almoxarifado Oeste – SP',
      endereco: 'R. Turiaçu, 240',
      eta: '30 min',
      itens: ['Teclado de comando ×1'],
    },
    acoes: [
      'Diagnosticar teclado do carro',
      'Verificar firmware do comando',
      'Agendar janela de manutenção com o cliente',
    ],
  },
  'CH-0008175': {
    endereco: 'R. do Carmo, 480',
    regiao: 'SP - Centro',
    impacto: { slaPrevista: '19h10', ta: '01h05', tb: '07h10' },
    tecnico: {
      nome: 'Sandra Melo',
      status: 'Em rota',
      distancia: '8 km',
      eta: '22 min',
    },
    peca: {
      local: 'Almoxarifado Centro – SP',
      endereco: 'R. das Indústrias, 120',
      eta: '20 min',
      itens: ['Exaustor 220V ×1'],
    },
    acoes: [
      'Inspecionar exaustão da casa de máquinas',
      'Medir nível de ruído do exaustor',
      'Programar troca do equipamento',
    ],
  },
};

