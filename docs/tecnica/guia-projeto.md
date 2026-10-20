# Guia técnico do projeto

Referência de navegação no código em 20/10/2026. O [README](../../README.md) descreve execução, modos, dados e publicação; a [continuidade](../CONTINUIDADE_CODEX.md) mantém o estado atual de entregas.

## Entrada e navegação

`src/main.jsx` monta React e importa estilos. `App.jsx` chama `resolveMode` de `modes.js`, carrega os ramos com lazy/Suspense e usa uma fronteira de erro para Feira. Ausência de modo seleciona apresentação; modo inválido tem tela própria. `BackofficePlatform.jsx` monta apresentação ou plataforma, com `ConsultationProvider`. `navigation.js` define os 12 destinos; `presentation/itinerary.js` define as nove etapas guiadas. O legado continua com `SceneController`, descoberta em `scenes/sceneIndex.js` e ordem em `scenes.config.js`.

## BackOffice

`src/platform/pages/` contém as páginas e seus estilos específicos. `components/` fornece tabelas, gráficos, explicações, exploração de registros e primitivas de consulta. `filters/ConsultationContext.jsx` centraliza os filtros em memória. `services/` contém agregações por domínio (chamados, performance, SLA, riscos, contratos, custos, equipamentos, técnicos e peças), com regras temporais compartilhadas.

Ao alterar uma regra, localize primeiro o serviço e seu teste; ao alterar somente aparência, consulte o [guia de estilos](guia-estilos.md). Reutilize o contexto e os componentes existentes para manter consistência entre filtros, indicadores e detalhes.

## Dados

`src/data/orquestra/index.js` expõe consulta às fontes geradas e `time.js` concentra utilidades temporais. `schema.json` descreve o esquema. `scripts/import_orquestra.py` importa o XLSX histórico; `scripts/import_feira_estendida.py` importa as fotografias da Feira. Ambos possuem `--check` para verificar consistência sem editar os gerados. Requerem Python 3/openpyxl. Fontes, critérios e comandos específicos: [camada de dados](../dados/camada-dados.md).

Histórico, snapshots e fixtures legadas permanecem separados. No estendido, cada fotografia substitui integralmente a anterior; não somar estados nem interpolar valores. Consulte os contratos antes de modificar cálculos, nulos, população, datas ou unidades.

## Feira e Supervisor

`FeiraApp.jsx` usa simulação independente; `useFeiraClock.js`, `temporalState.js` e `selectors.js` organizam relógio, projeção e consulta. `SyncedFeiraApp.jsx` integra a sessão conectada; `sync/transport.js`, `protocol.js` e `useSyncedFeira.js` cuidam do transporte/contrato/estado. `server/feira-session.mjs` mantém a autoridade operacional; `feira-server.mjs` serve o build e a API.

`SupervisorFeira.jsx` usa componentes de `supervisor/` para listas, resumo, detalhe e movimentos. Alertas ativos usam as criticidades BASE Laranja/Vermelho. Abrir um alerta aguarda ACK do servidor, congela a fotografia e pausa globalmente. Resumo e ficha completa compartilham o lock; fechar libera o lock e mantém a pausa. Retomar é ação do notebook autorizado. Temas e animações não devem reiniciar POST/SSE nem o tempo operacional.

A implementação é uma demonstração local HTTP com pareamento. Integrações reais, homologação visual/física e demais limites estão nos [pontos de integração](pontos-integracao-supervisor.md) e no [relatório C9.2](../produto/entrega-c92-feira-estendida.md).

## Verificação e manutenção

Use [tests/README.md](../../tests/README.md) para selecionar testes proporcionais. Testes de serviços usam Node; importadores têm testes Python; testes de navegador usam ferramentas já instaladas e portas próprias. Não confunda build com validação do servidor ativo: confirme os assets efetivamente servidos quando investigar desenvolvimento ou sincronização.

Mudanças somente documentais pedem revisão do diff, links e coerência. Para alterações funcionais, preserve o legado conforme [matriz](../preservacao/matriz-cenas.md) e registre execução, resultados e limites no relatório pertinente. Não sobrescreva evidências de marcos anteriores.
