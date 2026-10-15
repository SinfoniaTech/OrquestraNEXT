# ORQUESTRA — continuidade oficial

Ponto único de retomada. Regras permanentes: [AGENTS.md](../AGENTS.md). Leia as seções A–I e consulte apenas as referências necessárias à tarefa. Relatórios específicos guardam o histórico; este documento registra o estado atual.

## A. Identificação

- **Atualização:** 15/10/2026, 12h23, America/Sao_Paulo (UTC−03:00); horário da revisão documental, não de execução dos testes.
- **Raiz efetiva:** `/home/p2dutra/Documents/ChatGPT/Projeto_Challenge_OTIS/OrquestraNEXT`. O diretório pai tem outro contexto Git; não usar a pasta antiga com espaços por suposição.
- **Branch verificada:** `feature/next-evolucao`.
- **HEAD verificado:** `05ec7d57697418c2d06970b26ca515aab73b8a63` — `feat: implementa inteligencia de equipamentos C6`.
- **Git após esta organização:** 14 arquivos modificados e 34 não rastreados (48 no total), nada staged. C7, correção de inicialização e esta documentação ainda não estão em commit. Checkout limpo de HEAD não contém esses trabalhos.

Alterações locais relevantes, preservadas:

| Grupo | Arquivos / localização |
| --- | --- |
| Produto C7, modificados | `src/platform/BackofficePlatform.jsx`, `filters/ConsultationContext.jsx`, `navigation.js`, `pages/ChamadoDetail.jsx`, `services/chamados.js` (todos sob `src/platform/`) |
| Produto C7, não rastreados | `src/platform/pages/TecnicosPage.jsx`, `TecnicosPage.module.css` na mesma pasta; `src/platform/services/tecnicos.js` |
| Testes, modificados | `tests/platform-shell.test.mjs`; `tests/README.md` documental |
| Testes, não rastreados | `tests/tecnicos-service.test.mjs`, `tecnicos-browser.test.mjs`, `platform-dev.test.mjs` na mesma pasta |
| Documentos, modificados | Esta continuidade; `docs/README.md`; `docs/dados/dicionario.md`; `docs/produto/backlog.md`, `plano-incremental.md`, `cobertura-telas.md`, `explicabilidade-ext.md` na mesma pasta |
| Documentos, não rastreados | `AGENTS.md`; `docs/produto/entrega-c7-tecnicos.md`; `docs/produto/correcao-inicializacao-c7.md` |
| Evidências, não rastreadas | 25 arquivos em `docs/produto/evidencias/`: `c7-reference-*`, `entrega-c7-*` e `inicializacao-*` (logs, diagnóstico e capturas) |

Reconfirme o inventário com `git status --short --branch --untracked-files=all` em cada retomada. Não limpar/stashar/resetar/trocar branch/descartar para obter árvore limpa. [Recuperação](preservacao/recuperacao.md).

## B. Objetivo atual

ORQUESTRA é um demonstrador acadêmico FIAP Challenge/NEXT: BackOffice funcional, indicadores explicáveis e dados rastreáveis, preservando apresentação original e Supervisor.

**Entrega atual:** C7 — Técnicos implementada; aguarda homologação visual final. Correção operacional da tela branca registrada, com gatilho original indeterminado. Oito páginas funcionais e quatro destinos pendentes.

**Escopo desta sessão:** exclusivamente organizar instruções e documentação de continuidade. Não autoriza mudanças funcionais, testes/build, dependências, commits, push, deploy, C8 ou Feira. A implantação desta rotina também aguarda homologação do usuário.

**Marco seguinte de desenvolvimento, ainda sem autorização:** após homologação C7, analisar/aprovar escopo C8 — Peças e Componentes (US18-A). Modo Feira/US14 vem depois. Sequência planejada não autoriza execução automática.

## C. Estado das entregas

Totais de testes são marcos cumulativos, não devem ser somados entre linhas. Homologação e aprovação para continuidade são registradas com os limites do aceite disponível.

| Entrega | Implementação | Testes registrados | Aceite do usuário | Commit local | Publicação comprovada desta entrega |
| --- | --- | --- | --- | --- | --- |
| Dados / A / B | Camada de dados, shell e Chamados | 34 / 41 / 69 | Dados/A aprovados; B homologada | `03d8ced` | Não verificada |
| C1 / C1.1 | SLA e formalização temporal TA/TB | 87 / 97 | C1 aceita para continuidade; C1.1 regras aprovadas; sem registro separado de homologação visual final C1 | `03d8ced` | Não verificada |
| C2 | Riscos & Tendências | 117 | Homologação preliminar | `03d8ced` | Não verificada |
| C3 | Visão Geral / Performance | 139 | Homologada expressamente | `ef53ecf` | Não verificada |
| C4 | Contratos & Margem | 164 | Avaliada e aprovada para continuidade | `ebd0db9` | Não verificada |
| C5 | Custos / TCO | 194 | Avaliada e aprovada para continuidade | `485e6b4` | Não verificada |
| C6 | Equipamentos | 225 | Avaliada visualmente e aprovada para continuidade | `05ec7d5` (HEAD) | Não verificada |
| C7 | Técnicos | 255 no encerramento C7 | Homologação visual final pendente | Não; arquivos locais | Não verificada |
| Correção pós-C7 | Reinício do Vite antigo; teste de desenvolvimento | 262 na última validação registrada | Não implica homologação C7 | Não; relatório/teste/evidências locais | Não se aplica à intervenção local |
| Rotina de continuidade | AGENTS e organização documental | Revisão documental nesta sessão; sem testes/build | Aguarda homologação | Não | Não se aplica |
| C8 / Feira | Não iniciadas | Sem validação de implementação | Escopos ainda não autorizados | Não | Não |

Relatórios atuais: [C6](produto/entrega-c6-equipamentos.md), [C7](produto/entrega-c7-tecnicos.md), [inicialização pós-C7](produto/correcao-inicializacao-c7.md). Os anteriores estão no [índice](README.md). HEAD local e existência de gh-pages não comprovam artefato publicado; não houve push/deploy nestas entregas.

## D. Arquitetura

- `package.json` declara React 19.3 / Vite 8.3, ES Modules, JSX e CSS Modules. `src/main.jsx` monta App; sem `?modo=plataforma`, carrega a apresentação original. Plataforma entra por lazy/Suspense, com login demo e rotas por hash. Não montar dois controladores de hash/teclado simultaneamente.
- `src/platform/` reúne shell, páginas, serviços e componentes compartilhados. `navigation.js` define 12 menus; sete páginas até C6 e Técnicos C7 funcionais. Peças, Padrões & Insights, Contratos — BackOffice e Integrações continuam pendentes.
- `src/data/orquestra/index.js` oferece acesso imutável aos dados locais; componentes não leem XLSX. Serviços de Chamados, SLA, riscos, performance, contratos, custos e equipamentos são reutilizados por Técnicos.
- `ConsultationProvider` mantém consulta e carteiras em memória. São 13 filtros, AND entre campos/OR interno, busca normalizada com palavras AND, chips, limpeza e vazio. Ordenação antes da paginação; N próprio por indicador. Navegação preserva contexto; refresh restaura padrões. Técnico/Supervisor/Rota foram acrescentados à UI compartilhada na C7.
- Supervisor e dez cenas originais mantêm fixtures, animações, alertas, timers, detalhes, teclado, hashes `#/1`–`#/10` e remount. Smart Fit Normal→Média→Alta e hospital crítico por contexto humano preservados. Não uniformizar suas siglas/regras com as do histórico.
- Modos: plataforma histórica implementada; apresentação original/manual preservada e padrão. Modo próprio de apresentação do novo BackOffice e Feira temporal ainda não implementados. Feira significa evolução automática dos dados com pausa/retomada/reinício, não autoplay de cenas. Ponte contextual Supervisor/US19 também pendente.

Detalhes: [arquitetura inicial](tecnica/arquitetura-atual.md), [proposta](tecnica/arquitetura-proposta.md), [fronteiras Supervisor](tecnica/pontos-integracao-supervisor.md), [matriz de cenas](preservacao/matriz-cenas.md), [modos](produto/modos.md). Documentos iniciais podem anteceder as páginas implementadas; conferir relatórios recentes e código da tarefa.

## E. Dados e regras vigentes

| Tema | Decisão / limite |
| --- | --- |
| Histórico | HIST_60_DIAS: 736 chamados sintéticos / 46 campos, criação 08/08–06/10/2026; referência fixa 06/10/2026 às 22h São Paulo. Períodos civis inclusivos por criação, sem usar relógio atual como referência dos indicadores. |
| Snapshots | T0/T1/T2: 10/16/24 registros, 08/09/2026 às 08h/08h30/09h30. Separados entre si e do histórico. Ausência de ID não prova conclusão/exclusão; completude/merge/interpolação ainda sem contrato aprovado. |
| Supervisor | Fixtures JavaScript roteirizadas independentes; não substituir pelo histórico ou snapshots. |
| TA/TB | Minutos sintéticos: TA=chegada−abertura; TB=encerramento técnico simulado−chegada. Saída inclui permanência adicional. Encerramento técnico não persistido; não reconstruir como evento BASE. Média dos finitos não negativos; zero válido, nulos excluídos, N independente. Sem elegíveis, indisponível. Não conceitos oficiais OTIS. |
| SLA/ETA | Percentual_SLA é fração (1=100%). Aderência C1: Concluído, SLA_min>0 finito, consumo finito não negativo; cumpre<=1. Histórico: 665/724=91,9%; 59 excedidos. Sem elegíveis, indisponível. Não ajustar para RESUMO_60_DIAS (outra população), inferir SLA restante/pausas ou prever ETA após chegada/conclusão. ETA refere-se ao técnico. |
| Criticidade | Verde/Amarelo/Laranja/Vermelho BASE, independente de SLA. Histórico inclui concluídos; prioridade na referência=não Concluído e Laranja/Vermelho (1 entre 12 não concluídos). Laranja é janela de intervenção; não impor sequência de cores. |
| Recorrência | Materializada, sem soma como eventos únicos. Elevada C2/C6: unidade distinta com algum valor>=3 (19). Proporção C4: chamados com valor finito>0 / total, com cobertura explícita. C6 distingue volume, máximo registrado e último valor; cor/insight do último chamado não são estado atual da unidade. |
| Custos/contratos | Soma de custo finito não negativo, zero válido, N próprio; sem válidos, indisponível. Total R$696.734,60/N736. Custos associados ao técnico são dos chamados, não salário/remuneração/mão de obra real. Alto por contrato é pressão operacional C2, não margem negativa. Sem rateio financeiro artificial. |
| Técnicos C7 | 16 nomes nos 736 vinculados; 724 concluídos. Vínculos múltiplos de área/supervisor/rota preservados, sem cadastro permanente. Volume/TA/TB/recorrência não constituem avaliação individual nem atribuição causal ao trabalhador. Histórico de equipamento pode ampliar o contexto para outros técnicos, explicitamente identificado. |
| BASE/CALC/EXT | BASE=campo fornecido; CALC=agregação com fórmula/população/N/nulos/período/unidade/fonte; EXT=fonte indisponível, sem zero/valor fictício/conexão simulada. Indicadores têm explicação acessível por botão, não apenas hover. DEMO não substitui classificação. |
| Proteção temporal | `projectSnapshot` só libera estado a partir de sua referência; `eventAt` oculta marcos futuros. Avançar clock não confirma evento de fonte congelada. Duas saídas futuras T1/T2 foram preservadas; conclusão técnica e saída são marcos distintos. |

Fonte original: `datasets/ORQUESTRA_MVP_Base_60_Dias_Filtros_FINAL.xlsx`; SHA256 registrado `1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe`. JSONs gerados não são editados manualmente. [Dicionário e decisões completas](dados/dicionario.md), [camada de dados](dados/camada-dados.md), [fontes](dados/fontes.md), [explicabilidade](produto/explicabilidade-ext.md), [TA/TB e temporal](produto/entrega-c11-tempos.md).

## F. Testes e evidências

**Nesta sessão documental:** nenhum teste, build ou importador executado. Foram conferidos Git, documentos, logs existentes, referências locais e integridade dos arquivos não documentais por comparação de hashes antes/depois; revisão documental não é nova validação funcional ou homologação.

**Última execução registrada:** 15/10/2026, na correção de inicialização; hora de execução não registrada nos logs. **262 distintos aprovados =253 Node/browser +9 Python**, incluindo 255 anteriores e 7 novos. Nenhuma falha. Os 7 testes de desenvolvimento também passaram na instância restaurada 5173 (não somar novamente). Build aprovado, com aviso preexistente de chunk>500kB. Importador `--check` aprovado no encerramento C7, sem nova execução na correção de inicialização.

Comando de regressão registrado (referência histórica; executar somente com autorização):

```bash
ORQUESTRA_TEST_DIST=/tmp/orquestra-inicializacao/dist ORQUESTRA_TEST_EVIDENCE=/tmp/orquestra-inicializacao/legacy ORQUESTRA_SHELL_EVIDENCE=/tmp/orquestra-inicializacao/shell ORQUESTRA_DEV_EVIDENCE=/tmp/orquestra-inicializacao/dev /home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.mjs
/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -B tests/importacao-dados.test.py
npm run build -- --outDir /tmp/orquestra-inicializacao/dist
```

Para futura execução, preparar o build antes dos testes de navegador; os comandos acima registram invocações, não autorização ou pipeline automático. Confirmar separadamente o resultado de cada comando.

Evidências: [253 Node/browser](produto/evidencias/inicializacao-regression.txt), [9 Python](produto/evidencias/inicializacao-python.txt), [7 testes na instância restaurada](produto/evidencias/inicializacao-dev.txt), [build](produto/evidencias/inicializacao-build.txt), [capturas e diagnóstico](produto/correcao-inicializacao-c7.md). [C7 e seu marco de 255](produto/entrega-c7-tecnicos.md).

Limites: notebook 1366×768/móvel 390×844 e regressões aprovados não equivalem a auditoria integral de acessibilidade/cross-browser. Build/preview não comprova estado de um processo Vite antigo. Testes não comprovam disponibilidade de servidor hoje, homologação do usuário ou publicação.

## G. Pendências e riscos relevantes

- Homologação desta rotina documental e homologação visual final C7 pendentes. C7/correção/rotina locais sem commit; preservar os arquivos.
- Tela branca: o Vite antigo servia `chamados.js` vazio embora DEFAULT_STATE estivesse exportado em disco/HEAD. Reinício restaurou as quatro rotas e refresh, sem alterar produto. **Mecanismo observado, mas gatilho original indeterminado; causa-raiz completa não estabelecida.** Nova regressão cobre desenvolvimento/ESM. Se reaparecer, comparar resposta servida/arquivo/processo antes de inventar exportações ou limpar caches. [Relatório](produto/correcao-inicializacao-c7.md).
- Quatro páginas pendentes; C8 e Feira não iniciadas. Antes de Feira, definir fontes, completude/merge, clock/velocidade/loop, pausa/retorno, filtros e fronteira Supervisor; não antecipar futuro nem inferir evolução contínua.
- Regras oficiais OTIS, SLA restante/pausas/metas e regras geradoras de cor/recorrência não fornecidas. Não reabrir conceitos sintéticos já aprovados sem necessidade.
- Receita/margem/TCO completo/composição contábil, estoque/consumo/logística, cadastro mestre/vigência/parque instalado, uptime, pessoal/skills/escala/localização/capacidade reais são dependências externas. Componente associado não é peça consumida.
- Demo sem autenticação corporativa; filtros em memória; offline apenas após carga, sem service worker. Bundle grande continua com aviso; otimização depende de escopo próprio. SHA publicado no GitHub Pages não certificado.

## H. Próxima ação

**Única ação imediata:** aguardar homologação do usuário desta rotina documental. A espera está determinada; nenhuma implementação seguinte está autorizada. C7 continua aguardando seu aceite visual; C8 e Feira dependem de decisões e autorizações posteriores. Não transformar planejamento em autorização.

Prompt padrão para uma nova conversa:

> Retome o ORQUESTRA em `/home/p2dutra/Documents/ChatGPT/Projeto_Challenge_OTIS/OrquestraNEXT`. Consulte os AGENTS.md aplicáveis e `docs/CONTINUIDADE_CODEX.md`; confira branch, HEAD e Git completo, preservando alterações locais. Identifique divergências e consulte apenas as especificações pertinentes à próxima tarefa. Apresente um resumo do estado e das pendências; aguarde minha autorização antes de implementar. Se faltar evidência, amplie a investigação sem alterar arquivos funcionais. Não presuma servidor ativo, homologação, autorização de commit ou publicação.

## I. Ambiente e comandos de referência

Não presumir servidor ativo entre sessões. Antes de iniciar, confirmar raiz/porta/processo; não encerrar instância do usuário silenciosamente. Não foi verificado servidor em execução nesta revisão documental.

```bash
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

URL de referência: `http://127.0.0.1:5173/OrquestraNEXT/?modo=plataforma#/visao-geral`. Rotas verificadas na correção anterior: `#/visao-geral`, `#/chamados`, `#/tecnicos`, `#/pecas`; Peças continua pendente. Sem query de plataforma, apresentação original `#/1`–`#/10`.

- Runtime Node/Playwright existente: `/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/`; Node em `bin/node`, Playwright em `node_modules/playwright`. Chrome `/usr/bin/google-chrome`. O Node24 padrão do shell agrupa testes aninhados por arquivo; usar o runtime documentado para a contagem distinta.
- Python existente: `/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3`, com openpyxl; não instalar dependências silenciosamente. Importador de leitura, quando autorizado: esse executável com `-B scripts/import_orquestra.py --check`; conversão que grava dados exige autorização específica.
- Build/testes: comandos e resultados na seção F; detalhes em [tests/README.md](../tests/README.md). `/tmp` não é backup permanente; preservar evidências em docs.
- Suítes usam portas próprias 5187–5205 e 5209; não executar duas instâncias da mesma suíte/porta. Teste dev usa cacheDir temporário separado e pode receber `ORQUESTRA_DEV_URL` para testar servidor existente. Portas/Chrome podem exigir permissão do ambiente; EPERM de sandbox não prova falha funcional.
- Vite/GitHub Pages usa base `/OrquestraNEXT`. Validar assets/rotas/refresh sob esse subdiretório em mudança pertinente. `npm run deploy` também executa predeploy/build e requer autorização explícita de publicação. Não inferir SHA/estado remoto pelo Git local.
