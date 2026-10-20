# C9 — Modo Feira: entrega local para homologação

Evolução posterior: a [C9.2](entrega-c92-feira-estendida.md) integra T00–T11 à sincronização. Este relatório preserva as evidências e a configuração de sua entrega original; estado vigente na continuidade.


15/10/2026, America/Sao_Paulo. US14; implementação explicitamente autorizada pelo usuário, na branch existente feature/modo-feira, base/HEAD 240253d igual à integração homologada até C8. Planejamento documental local anterior preservado. Sem commit, merge, push, deploy ou instalação. Aceite visual do usuário pendente.

## Resultado funcional

URL local: http://127.0.0.1:5175/OrquestraNEXT/?modo=feira. Instância dedicada criada e comunicada nesta sessão, porta estrita e polling de arquivos (contorna limite de observadores sem mudar vite.config). Não presumir sua disponibilidade numa próxima sessão. Apresentação original segue padrão; Plataforma segue ?modo=plataforma. Publicação permanece C8/gh-pages 547db4d; C9 não publicada.

Servidor usado nesta sessão (reexecutar somente após conferir porta/processo; não iniciar uma segunda instância):

```bash
node --input-type=module -e 'import {createServer} from "vite"; const server=await createServer({cacheDir:"/tmp/orquestra-c9/vite-cache",server:{host:"127.0.0.1",port:5175,strictPort:true,watch:{usePolling:true,interval:1500}}});await server.listen();server.printUrls();'
```

C9.1: controlador puro com scheduler injetável único; fontes imutáveis liberadas pela projeção C1.1; substituição integral de snapshots. C9.2: painel independente com logo, referências, quatro cards explicáveis, tabela paginada por prioridade, quatro cores e detalhe projetado. C9.3: comparação por ID, novos/status/cor/conclusão, deltas dos indicadores, destaque temporário e alertas/insights fornecidos. C9.4: testes puros, navegador, ESM servido, regressão, build/importador e ciclos reais.

Entrada e reinício **automáticos em T0 executando**, conforme ajuste expresso que substitui o plano inicial pronto/Iniciar. T0/T1/T2 por 45 segundos cada; intervalo T2 de 10 segundos; ciclo 145 segundos. Velocidade 2× preserva progresso e reduz duração proporcionalmente (72,5 segundos/ciclo); horários 08:00/08:30/09:30 são discretos. Nenhuma interpolação de TA/TB/ETA/SLA/status/cor. Durações centralizadas em DURATIONS, sem interface para edição neste corte.

Pausar preserva tempo restante. Abrir detalhe/explicação, selecionar grupo/página ou mudar hash pausa; fechar detalhe não retoma. Retomar é explícito e bloqueado se detalhe aberto/aba oculta. Ocultação/desfoco pausa; retorno visível continua pausado. Motivos de pausa independentes. Reiniciar limpa detalhe/página/recorte e volta T0 mantendo velocidade; aba oculta mantém bloqueio. Reentrada/refresh inicia novo T0 sem persistência. Desmontagem cancela o timer/listeners e callbacks antigos são invalidados por geração; StrictMode não agenda em construtor/render.

## Fontes, reconciliação e explicabilidade

| Fonte | Total | Ativos | Concluídos | Alertas ativos Laranja/Vermelho |
| --- | --- | --- | --- | --- |
| T0 08:00 | 10 | 10 | 0 | 0 |
| T1 08:30 | 16 | 14 | 2 | 1 |
| T2 09:30 | 24 | 12 | 12 | 4 |

IDs cumulativos sem remoções; 6/8 novos por transição, 9/13 alterações de status e 2/8 de cor. Nove IDs já conhecidos passam a Concluído em T1→T2; o aumento total de concluídos é dez, pois um dos novos já chega concluído. Não atribuir transição anterior inexistente a esse novo ID. Mudanças são observadas entre referências, sem horário inventado. O reinício não significa desaparecimento ou melhora operacional.

As cores de todos os registros são 3/7/0/0 em T0, 3/12/0/1 em T1 e 7/9/3/5 em T2 (Verde/Amarelo/Laranja/Vermelho). Em T2 apenas 2 Vermelhos +2 Laranjas são ativos. Concluídos mantêm cor histórica, sem alerta operacional. Laranja é intervenção necessária; Vermelho também recebe contexto. Nada exige passagem por todas as cores.

Motivo_Criticidade, Insight_ORQUESTRA, Recorrencia_30d, categoria e componente são preservados; detalhes apresentam todos esses campos. BASE separado de contagens/comparações CALC. Informações fornecidas pela massa sintética não são previsão comprovada de ML, ação executada ou regra oficial OTIS. Nulos não viram zero. SLA é percentual informado na referência, não consumo ao vivo.

Saída CH-006 às 08:34 é ocultada em T1 08:30; Saída CH-017 às 09:35 é ocultada em T2 09:30, inclusive no detalhe. Conclusão técnica/TB fornecidos são preservados, sem reconstruir horário de encerramento ou antecipar evento. Histórico/fixtures não compõem as consultas Feira, embora a camada de importação compartilhada também empacote histórico no bundle.

## Arquivos e reutilização

| Arquivos | Alteração |
| --- | --- |
| src/feira/temporalState.js | Estado, transições, controles e scheduler injetável |
| src/feira/useFeiraClock.js | Integração React/useSyncExternalStore, visibilidade/desfoco/hash e cleanup |
| src/feira/selectors.js | Projeção por fonte, contagens, prioridade, deltas/alertas e definição de métricas |
| src/feira/FeiraApp.jsx e FeiraApp.module.css | Painel autônomo, controles, lista, gráficos, mudanças e links |
| src/feira/FeiraDetail.jsx | Detalhe seguro sobre o registro projetado |
| src/feira/FeiraErrorBoundary.jsx | Falha de lazy/render com retry explícito e retorno ao legado |
| src/App.jsx | Seleção opt-in lazy modo=feira, sem substituir padrão |
| src/platform/components/DataTable.jsx | Caption opcional; default histórico preservado |
| tests/feira-temporal.test.mjs, feira-browser.test.mjs, feira-endurance.mjs | Casos C9 e ensaio real separado |
| tests/platform-dev.test.mjs | Caso ESM/refresh Feira adicional; verificações anteriores mantidas |
| docs/produto/modos.md, plano-incremental.md, backlog.md; docs/CONTINUIDADE_CODEX.md | Planejamento anterior preservado e atualizado conforme autorização/resultados |
| docs/README.md, tests/README.md, este relatório e evidências c9-* | Referências, comandos e resultados |

Reutilizados getDataset/countBy/instant, projectSnapshot/eventAt, definições TA/TB, KpiCard/IndicatorInfo, badges, Dialog, DataTable, GroupChart e identidade visual/logo. Seletores e ConsultationProvider históricos permanecem independentes; ChamadoDetail histórico não foi adaptado à força, pois fixa fonte/período de histórico. Detalhe Feira compõe os recursos compartilhados e a projeção vigente. Nenhuma dependência instalada nem mudança em package/lock/Vite.

## Validação e evidências

**322 testes aprovados =313 Node/browser +9 Python**, preservando os 292 anteriores e acrescentando 30 (14 puros, 15 navegador e 1 ESM). Nenhuma falha, skip ou cancelamento. Build e importador --check aprovados. Scheduler/cleanup, 1000 ciclos puros e 100 ciclos acelerados de UI com clock controlado passaram. Ensaio com relógio real completou um ciclo 1× (145 s) e um 2× (72,5 s), sem pausas inesperadas/erros JS. Native ESM carrega, avança e refresh retorna T0. Testes cobrem rede após carga, teclado, 390×844, 1366×768 e falha de chunk com fallback.

A revisão final restringiu seletores CSS de foco/disabled ao container Feira e garantiu limpeza da consulta visual em todo novo ciclo automático (Ativos/página 1), com asserção no teste de loop. Regressão completa repetida contra o build final /tmp/orquestra-c9/delivery; smoke visual/rotas em c9-final-smoke.txt. O ensaio real anterior usa o mesmo controlador temporal; a revisão afeta somente apresentação/limpeza da consulta visual.

Evidências: [regressão 313](evidencias/c9-regression.tap), [9 Python](evidencias/c9-python.txt), [importador](evidencias/c9-import.txt), [build final](evidencias/c9-build.txt), [ESM servido](evidencias/c9-dev.txt), [ciclos reais](evidencias/c9-endurance.txt).

Capturas 1366×768, página completa quando necessário: [T0](evidencias/c9-t0.png), [T1](evidencias/c9-t1.png), [T2](evidencias/c9-t2.png), [detalhe pausado](evidencias/c9-detail-paused.png), [após 100 ciclos](evidencias/c9-after-100-cycles.png). Evidências técnicas não representam homologação visual do usuário.

Comandos reprodutíveis na raiz, com runtimes existentes:

```bash
npm run build -- --outDir /tmp/orquestra-c9/delivery
ORQUESTRA_DEV_URL=http://127.0.0.1:5175/OrquestraNEXT/ ORQUESTRA_TEST_DIST=/tmp/orquestra-c9/delivery ORQUESTRA_TEST_EVIDENCE=/tmp/orquestra-c9/legacy ORQUESTRA_SHELL_EVIDENCE=/tmp/orquestra-c9/shell ORQUESTRA_DEV_EVIDENCE=/tmp/orquestra-c9/dev /home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test --test-reporter=tap tests/*.test.mjs
/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -B tests/importacao-dados.test.py
/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -B scripts/import_orquestra.py --check
ORQUESTRA_TEST_DIST=/tmp/orquestra-c9/delivery /home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/feira-endurance.mjs
```

## Limites e próxima ação

Offline aprovado apenas após carga dos chunks/dados. Primeiro acesso/refresh sem rede não é garantido; sem service worker novo. Erro de chunk/render mostra fallback, mas sintaxe inválida no módulo de entrada pode impedir React inteiro; validação ESM do servidor real é necessária. Gatilho da tela branca anterior segue indeterminado; não houve export artificial ou limpeza destrutiva de caches.

Layout 1366×768 sem overflow horizontal, quatro colunas visíveis e controles no topo; há rolagem vertical para a seção inferior de alertas/insights, especialmente T2. Também verificado 390×844/teclado; não é auditoria integral de acessibilidade/cross-browser. Fonte empacotada compartilhada mantém aviso de chunk maior que 500 kB; otimização precisa de escopo próprio. Os ciclos fake-clock não representam exposição contínua em máquina real; ensaio real curto não comprova operação de um dia inteiro. Ensaio prolongado de bancada permanece recomendado antes do NEXT.

Supervisor, dez cenas, estilos/fixtures/timers/dados originais e XLSX sem diferenças Git. SHA256 da planilha permanece 1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe. Regressões verificam comportamento, sem substituir homologação visual do usuário.

Próxima ação única: homologação visual C9. Corrigir somente o que for orientado. Não iniciar outras páginas/US19, integrar à next-evolucao, criar commit ou publicar sem autorização específica.
