# C5 — Custos / TCO — Inteligência de Custos Operacionais

15/10/2026, America/Sao_Paulo. C4 avaliada e aprovada pelo usuário para continuidade. C5 autorizada e implementada exclusivamente em `/OrquestraNEXT/?modo=plataforma#/custos-tco`. Aguardar homologação C5; nenhuma outra página iniciada.

## Controle de versão da C4

Branch confirmada `feature/next-evolucao`, HEAD inicial ef53ecf497a0968480880fddd496faa677da50aa. Revisados 11 arquivos modificados e 19 não rastreados, todos da C4 e documentação/evidências correspondentes. Conferidos diffs, conteúdo, tipos e padrões de credenciais; nenhum indício nos arquivos examinados, nem temporário indevido. Supervisor, cenas, dados e dependências sem diferenças. Build aprovado; 155 Node/browser +9 Python =164 testes aprovados novamente antes do commit. Staging dos 30 arquivos conferido com stat/status e `git diff --cached --check` aprovado.

Commit local autorizado: **ebd0db93a06ec78f11c7dfbe55298a6c043b17a4** — `feat: implementa contratos e margem C4`. Árvore limpa após commit. Sem push/deploy. C5 permanece sem commit e nada staged ao encerrar.

## Resumo funcional e UX

Página para análise gerencial dos custos operacionais estimados. Cinco cards: custo total, média por chamado válido, custo dos chamados atribuídos a técnicos, custo de recorrentes e contratos sob pressão operacional. TCO contábil completo permanece EXT, com integração financeira necessária. Síntese legível em 1366×768 com os cinco cards acima da dobra; não há doze meses, trimestre comparativo ou metas inventadas.

Evolução diária por criação, comparação de custos por recorrência e distribuição selecionável por Contrato, Área, Técnico, Unidade, Categoria do Chamado, Componente Principal, Supervisor, Rota e Tipo de Unidade. Todos os grupos disponíveis por rolagem interna, barras com valor textual e ações por teclado. Técnico representa atribuição do chamado, nunca remuneração ou disponibilidade.

Tabela alterna carteira de contratos e chamados individuais. Ordenação inicial por maior custo; permite ordenar identificador, cliente, volume, soma, média, recorrência, SLA e pressão. Ordem antes da paginação 10/25/50, empate por ID, indisponíveis por último. Visão individual identifica as ocorrências mais caras; a primeira no histórico completo é CH-20261001-0661. Tabela de contratos usa todos os registros filtrados de cada contrato e não só eventos Alto. N/cobertura, elegíveis e suporte próprios.

Fluxo verificável: card de custo → desvios do SLA no contexto → contrato → equipamento → chamado → Insight_ORQUESTRA. “Desvio” usa apenas os concluídos elegíveis fora do SLA simulado aprovado, sem significar desvio financeiro ou orçamento ultrapassado. Diálogos em pilha mantêm o contexto anterior; fechar retorna à lista e ao foco. O detalhe do chamado existente expõe os campos e insight BASE. Os grupos também permitem examinar insights sintéticos fornecidos, sem reescrever os textos.

Filtros cumulativos, busca (inclui cliente/contrato/ocorrência), chips, limpar, vazio e seletores da B são reutilizados integralmente. Filtros e busca mantidos entre páginas. Tipo de tabela/ordem/página/tamanho da C5 ficam no ConsultationProvider em memória; trocar filtro/busca volta à primeira página; limpar/logout reseta os estados de C4/C5; refresh restaura padrão. O seletor de agrupamento e aprofundamentos são locais à página, encerram ao navegar para outra página.

Composição financeira aparece como EXT e lista as fontes necessárias: folha/apontamentos para mão de obra; consumo/compras/estoque para peças; viagens/fretes para deslocamento/logística; documentos fiscais/contratos para terceiros; ordens e regras financeiras para apropriação das recorrências. Nenhum rateio artificial, gráfico de pizza ou valor por parcela. Recorrência é recorte de chamados, não parcela contábil adicional.

## Fonte, fórmulas e resultados

Exclusivamente HIST_60_DIAS pela camada de dados local existente; 736 chamados sintéticos, 46 campos. Referência fixa 06/10/2026 22h, São Paulo. Período completo 08/08–06/10 inclusivos por Criado em; sem snapshots nem fixtures do Supervisor.

| Indicador no recorte completo | Regra reutilizada / cálculo | Resultado |
| --- | --- | --- |
| Custo operacional estimado | estimatedCost C3: soma finita não negativa, todos os status | R$ 696.734,60; 736/736 válidos |
| Custo médio por chamado | average C1 no custo: soma/N válido; zero incluído, nulo excluído | R$ 946,65; N=736 |
| Custo associado a técnicos | Somar custos válidos dos chamados com Técnico informado | R$ 696.734,60; 736/736 custos, 16 nomes distintos |
| Custo associado a recorrências | recurrenceRatio C4: chamados com Recorrencia_30d finita >0; somar custo válido desses chamados | R$ 401.718,00; 412/412 custos |
| Participação monetária dos recorrentes | custo recorrente válido / custo total válido, somente total >0 | 57,7% |
| Não recorrentes | Recorrencia_30d =0; somar custo válido | R$ 295.016,60; 324/324 custos |
| Recorrência ausente/inválida | Nulo, negativo, não finito ou não numérico, separado de zero | 0 registros; custo indisponível, não zero fabricado |
| Contratos sob pressão | riskAnalysis C2: Contrato distinto entre registros Alto | 12; 351 registros Alto |
| Concluídos fora do SLA simulado | adherence C1: concluídos elegíveis com consumo >1 | 59 registros; R$ 66.321,10 de custo estimado associado |
| TCO contábil completo / composição | Sem dados financeiros ou composição fornecida | EXT, sem valores |

Custos e médias têm N próprio, cobertura e exclusões; zero informado válido participa. Sem custo válido ou sem registros, indisponível. Participação monetária com custo total zero/ausente é indisponível. Não arredondar a origem; somente apresentação. Registros sem técnico ficam fora do card de atribuição, mas permanecem no custo global e no agrupamento “Não informado”. Contratos ausentes não criam entidade contratual; demais agrupamentos preservam um grupo de ausência.

Recorrentes >0, não recorrentes =0 e ausentes/inválidos formam partição disjunta; soma dos custos válidos concilia com o global. Não multiplicar custo pelo valor de Recorrencia_30d, nem somar recorrência como chamados extras. Não recalcular janela materializada ou sua regra geradora.

## Relação com TA, TB e SLA

Painel descritivo com divulgação progressiva, recolhível. Pares TA×custo e TB×custo exigem ambos os campos válidos (finitos não negativos), com média de custo e tempo sobre o mesmo N: TA N=728; TB N=724. Zero válido incluído. Listas de suporte mostram os pares e permitem detalhe.

Tabela de desempenho usa três grupos disjuntos: dentro do SLA (665), fora do SLA (59) e sem elegibilidade SLA (12). Elegibilidade/cumprimento são os da C1; não média de consumos nem recálculo por TA/TB. Exibe custo total, média de custo e médias TA/TB, cada uma com seu N independente. Sem elegíveis, indisponível.

TA — Tempo até a chegada (min) e TB — Tempo de resolução simulado (min), conforme C1.1; encerramento técnico não foi persistido/reconstruído. Não inferir causalidade entre tempo/custo/recorrência, não exibir coeficiente estatístico não calculado e não afirmar economia ou meta atingida. Pressão Alto não significa prejuízo financeiro.

## Explicabilidade e reuso

19 explicações acessíveis na página principal: 5 cards, TCO EXT, evolução diária, recorrência, tabela principal, 5 definições de colunas, distribuição agrupada, composição financeira, sua dependência EXT, desempenho temporal e oportunidades. Cada uma identifica BASE/CALC/EXT, definição, origem/campos, fórmula, população, período, unidade, nulos e fonte/hash. Indicadores locais CALC mostram cobertura de custo do contexto. Detalhes acrescentam filtros contextuais de agrupamento, N/cobertura e explicações próprias. Insight_ORQUESTRA é BASE sintética, sem ML validado.

Serviços reutilizados: estimatedCost (C3), average/adherence/groupRecords (C1), contractAnalysis/contractMetrics/recurrenceRatio/contractPage (C4), dailyEvolution (C2, via contractAnalysis), fontes e filtros da B. contractPage recebeu apenas chave opcional de ordenação por média para reutilizar desempate/nulos/paginação; sem alterar os critérios da C4.

Componentes reutilizados: FilterBar/KpiCard/IndicatorInfo/Dialog/Pagination/EmptyState, DataTable, RecordExplorer, GroupChart, ExecutiveChart, ExternalMetric e ChamadoDetail. Não foi criada camada paralela de filtros nem outra página.

## Arquivos criados e modificados

Novos:
- src/platform/services/custos.js: análise, agrupamentos, custo de recorrência, pares, grupos SLA e metadados.
- src/platform/pages/CustosPage.jsx e CustosPage.module.css: página/detalhe e estilos isolados.
- tests/custos-service.test.mjs e custos-browser.test.mjs.
- Este relatório e evidências permanentes C5.

Modificados:
- src/platform/BackofficePlatform.jsx: conexão exclusiva da rota custos-tco e estado de página funcional.
- src/platform/filters/ConsultationContext.jsx: estado de apresentação da C5 em memória e reset/página em conjunto com C4; seleção de dados/filtros preservada.
- src/platform/services/contratos.js: chave opcional mean para ordenação reutilizada.
- tests/platform-shell.test.mjs: reconhecer seis páginas funcionais/seis destinos pendentes e continuar verificando todos os 12 menus.
- docs/CONTINUIDADE_CODEX.md, docs/README.md, docs/dados/dicionario.md, docs/produto/backlog.md, plano-incremental.md, cobertura-telas.md, explicabilidade-ext.md e tests/README.md: decisões, estado, regras e evidências.

## Testes e verificação visual

**194 testes distintos aprovados =185 Node/browser +9 Python**, incluindo os 164 anteriores e 30 C5 novos (20 serviço +10 navegador). Regressão completa sem falhas. Após acrescentar a ação direta do detalhe de custo para desvios do contexto, build final e os 30 testes C5 aprovados novamente; reexecuções não são somadas ao total.

Cobertura nova: soma/média/zeros/nulos/negativos/strings/não finitos, atribuição de técnico e ausência de nome, reconciliação por contrato/área/técnico/unidade/categoria/componente, recorrência sem multiplicação e três populações disjuntas, N pareado TA/TB, grupos SLA, filtros AND/OR/busca/chips, gráficos/tabela/cards sincronizados, dias/lacunas, ordenação por custo/média/ID e paginação, carteira/chamados mais caros, retorno entre páginas e diálogos, percurso completo até insight, teclado/19 explicações, EXT, vazio, SLA sem elegíveis, offline após carregamento, notebook/móvel e imutabilidade.

Uma expectativa inicial de teste contava 20 botões de explicação; o inventário real tem 19, todos necessários presentes. Corrigida a contagem, preservando a abertura individual e as verificações de todos os campos. Nenhuma expectativa de cálculo foi relaxada.

Build final aprovado em /tmp/orquestra-c5-final/dist com base /OrquestraNEXT. Capturas finais inspecionadas: 1366×768 com cinco cards acima da dobra; 390×844 sem overflow do documento ou diálogo; tabela tem rolagem interna. Análises detalhadas mantêm dimensões legíveis e permitem rolagem/divulgação progressiva. Não equivale a auditoria integral de acessibilidade/cross-browser.

Regressão anterior aprovada: seis páginas/12 menus, login/saída/refresh, filtros, detalhe, dez hashes/cenas originais, teclado/extremos, Smart Fit Normal→Média→Alta, hospital crítico por contexto humano, alertas, FLIP/movimento reduzido, temporizadores, saída antes dos timers e revisita. Não há mudanças em Supervisor, cenas, fixtures ou CSS legado.

Comparação com ebd0db9 sem diferenças em src/views, src/components, src/styles, src/scenes, src/data, scripts, datasets, referencias, App/main e package/lock/configuração Vite. Importador --check aprovado, sem gravar. SHA256 XLSX permanece 1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe. Nenhuma dependência instalada.

Evidências:
- [Antes do commit C4: 155 Node/browser](evidencias/c5-reference-tests.txt), [9 Python](evidencias/c5-reference-python.txt), [build](evidencias/c5-reference-build.txt).
- [Regressão completa 185 Node/browser](evidencias/entrega-c5-regression.txt), [30 C5 no build final](evidencias/entrega-c5-tests.txt).
- [9 Python](evidencias/entrega-c5-python.txt), [importador --check](evidencias/entrega-c5-import.txt), [build final](evidencias/entrega-c5-build.txt).
- [Notebook](evidencias/entrega-c5-custos-desktop.png), [análises](evidencias/entrega-c5-custos-analises.png), [detalhe de desvios](evidencias/entrega-c5-custos-desvios.png), [móvel](evidencias/entrega-c5-custos-mobile.png).

## Backlog, pendências e próximo gate

US13 avança com Custos / TCO; Contratos — BackOffice continua pendente e não há CRUD autorizado. US05 atendida nos indicadores desta página; US07 agora seis páginas funcionais/seis pendentes. US08/09 reutilizadas; US01/15/16 revalidadas no escopo descrito. Agrupamentos por técnicos/equipamentos não implementam as páginas US12. TCO real e composição continuam dependentes de fontes externas.

Limites/riscos: massa sintética; custo estimado não realizado OTIS; composição contábil/folha/peças/logística indisponíveis; sem orçamento/meta ou comprovação de economia; sem causalidade/predição validada. Regras oficiais OTIS, pausas e SLA restante permanecem pendentes. Campo recorrência e criticidade são materializados preservados. Filtros em memória, login demo, offline somente após carregamento, sem service worker. Aviso preexistente do bundle >500 kB permanece (~1.255 kB minificado/111 kB gzip), sem silenciar; particionamento requer escopo próprio.

C5 encerrada tecnicamente, aguardando homologação do usuário. Próxima recomendação: definir escopo de Equipamentos (US12), reaproveitando agrupamentos/histórico/recorrência com disponibilidade e cadastro externo EXT. Não iniciar sem nova autorização. Nenhum commit C5, push ou deploy.
