# Três experiências — escopo revisado

| Experiência | Comportamento | Fonte |
| --- | --- | --- |
| Plataforma | Navegação livre no novo BackOffice, filtros, indicadores e detalhes | HIST_60_DIAS normalizado e referência explícita |
| Apresentação | Apresentador conduz novo BackOffice; nenhum avanço temporal automático inesperado | Histórico ou snapshot escolhido explicitamente; estado estável |
| Feira | Dados operacionais evoluem automaticamente, não só páginas | T0/T1/T2 ou mecanismo determinístico previamente aprovado |

## Estado e filtros

AND entre campos, OR em multisseleção, conjunto único antes de paginação; cards/gráficos/listas conciliados. Chips, limpar, vazio e contexto preservado. Datas/fuso/faixas aguardam Q01–05. Modo manual não executa chegadas JavaScript do BackOffice antigo. Troca de fonte reinicia ou compatibiliza filtros com aviso e política aprovada, sem misturar populações.

## Feira

Pausa, retomada e reinício são requisitos confirmados. Um relógio controla todos os derivados; pause congela dados/indicadores, não apenas animação. T0/T1/T2 são estados conhecidos separados. Não inventar atualização contínua de SLA, eventos intermediários, critérios de desaparecimento ou classificações. Velocidade, loop e completude dos snapshots aguardam Q07. Mudança de tela não muda o tempo. Dados futuros não aparecem antes da etapa correspondente.

## Supervisor e legado

O novo Modo Apresentação não se confunde com a apresentação antiga por cenas. A experiência Supervisor mantém timers próprios sem alteração: sua abertura explícita deve informar essa diferença. UI nova não deve sugerir que as mesmas ocorrências ou filtros foram sincronizados.

Na ida ao Supervisor, pausar Feira e preservar contexto; no retorno, restaurar sem avançar ou retomar silenciosamente. URLs e pontos de entrada finais Q08/Q13. Manter proposta de compatibilidade com hashes antigos até aprovação de migração. Não montar dois controladores de teclado/hash ao mesmo tempo.

Fluxo e arquitetura detalhados: [arquitetura proposta](../tecnica/arquitetura-proposta.md).

## Visibilidade temporal — contrato C1.1

Na futura demonstração, cada snapshot é um estado conhecido no seu próprio Momento_Dataset. Só liberar snapshot quando relógio simulado >= referência da fonte. Nunca antecipar status, TA/TB, motivos ou resultados de snapshot posterior. projectSnapshot retorna indisponível/sem registros antes da referência; não busca nem combina fontes.

Para um snapshot liberado, marcos explícitos até sua referência (limite inclusivo) podem ser mostrados como registrados. Marco nulo = ausente; marco posterior = futuro, com valor oculto na projeção, nunca evento realizado. O clock avançar não confirma evento que era futuro no estado congelado; exigir novo estado/evidência. Saída futura não invalida conclusão técnica já informada no snapshot: são conceitos distintos; não reconstruir seu horário.

Serviço de leitura em src/platform/services/temporal.js, integrado ao tratamento de marcos no detalhe histórico. Nenhum modo automático, interpolação ou motor Feira foi implementado nesta entrega. Futuro consumidor temporal deve usar esta projeção; testes cobrem as duas saídas posteriores e os limites. [Entrega C1.1](entrega-c11-tempos.md).
