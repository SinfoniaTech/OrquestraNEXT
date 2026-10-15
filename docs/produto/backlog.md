# Product Backlog — estado efetivo após C8

Atualizado em 15/10/2026, America/Sao_Paulo. Nove páginas funcionais/três destinos pendentes. C7 e rotina homologadas e registradas em a5aea32, após nova revalidação 262 testes/build. C8 — Peças / Inteligência de Componentes e Ocorrências homologada visualmente para continuidade; 292 testes novamente aprovados, build/importador --check aprovados. Commit 8134059 criado e enviado; feature local/remota sincronizadas 0/0. Publicação C8 autorizada e concluída em gh-pages 547db4d; workflow success e navegação pública aprovados. Próxima prioridade planejada: Modo Feira/US14, ainda não autorizado. P0 fundamento/liberação, P1 MVP, P2 expansão. Supervisor protegido; testes não substituem homologação e documentos não autorizam novas ações.

IDs US01–18 mantidos com escopo revisado; US19 acrescentada para ponte explícita. US07 deixa de exigir consolidação das duas cópias; US06 expande entrada/login; US18 separa shell EXT obrigatório (A) de integração real (B).

## Épicos

E1 proteção/entrega US01/02/15/16; E2 dados/explicação US03/04/05; E3 novo shell/modos US06/07; E4 consultas US08/09; E5 inteligência US10/11/12; E6 executivo/EXT US13/18; E7 ponte/Feira US19/14; E8 exportação US17.

## Estado efetivo das 19 User Stories — referência atual

Este quadro prevalece sobre os estados históricos das entregas abaixo. US18-A/B são partes de US18, não histórias extras. Critérios/dependências da seção seguinte continuam aplicáveis ao escopo restante.

| US | Estado efetivo | Implementação e evidências atuais | Aceite / pendência efetiva |
| --- | --- | --- | --- |
| US01 | Implementada no escopo de proteção; contínua | Supervisor/dez cenas preservados, comparações Git e regressões até C8; referências locais até C8 | Obrigação em toda entrega; não auditoria visual integral. C8 em 8134059 local/remoto; documentação final com commit/push complementar autorizado |
| US02 | Mapeada e validada; preservada | Dez entradas/hash/refresh válidos; colisões de nomes auxiliares documentadas, sem refatoração | Mudança de índice exige análise; não corrigir legado incidentalmente |
| US03 | Concluída tecnicamente e aprovada | Histórico rastreável 736 registros/46 campos, importador, origem/hash, JSON imutável | Manter integridade; sem fórmula geradora inferida |
| US04 | Implementada para separação/consulta/projeção | HIST e T0/T1/T2 (10/16/24) separados das fixtures; proteção temporal C1.1 | Merge/completude/fontes e motor Feira pendentes; não somar snapshots |
| US05 | Implementada nas nove páginas; transversal | BASE/CALC/EXT, explicações por botão, fórmula/N/nulos/período/fonte e suporte | Aplicar também às páginas/modos futuros; C8 homologada para continuidade |
| US06 | Parcial | Login demo e plataforma opt-in; apresentação original padrão sem conflito de hash/teclado | Modos próprios Apresentação/Feira pendentes; demo não é autenticação corporativa |
| US07 | Parcial | Shell/12 destinos; Visão Geral, Contratos & Margem, Custos / TCO, Riscos, Chamados, SLA, Equipamentos, Técnicos e Peças funcionais | Padrões & Insights, Contratos — BackOffice e Integrações pendentes |
| US08 | Implementada e ampliada até C7 | 13 filtros compartilhados, AND/OR/busca/chips/limpar/vazio, populações antes da paginação e contexto em memória | B homologada; C6 Unidade/Componente aprovadas para continuidade; C7 Técnico/Supervisor/Rota homologadas; C8 reutiliza consulta e foi homologada para continuidade; refresh reseta |
| US09 | Implementada e homologada | Chamados B: busca/ordem/página/detalhe e retorno; suporte reutilizado até C8 | Preservar contexto e integridade nas próximas entregas |
| US10 | Parcial | Visão Geral C3 implementada e expressamente homologada | Página Padrões & Insights pendente; textos em outras páginas não a concluem |
| US11 | Entregue no escopo sintético aprovado | SLA C1/C1.1 e Riscos C2, regras explicadas e suporte | C1 aceito para continuidade, C1.1 regras aprovadas, C2 homologação preliminar. Regras oficiais/recálculos/pausas/SLA restante pendentes |
| US12 | Implementada e C7 homologada no escopo histórico | Equipamentos C6 e Técnicos C7: carteiras, vínculos múltiplos, histórico/tempos/SLA/custos/recorrência/insights; fontes reais EXT | C6 aprovada para continuidade; C7 homologada para continuidade. Disponibilidade real e fontes de pessoal EXT |
| US13 | Parcial | Contratos & Margem C4 e Custos / TCO C5 funcionais, custos estimados e lacunas financeiras explícitas | C4/C5 aprovadas para continuidade e commitadas; Contratos — BackOffice e finanças reais pendentes; sem CRUD presumido |
| US14 | Planejada; após C8 | Contrato e projeção temporal C1.1 preparados/testados; nenhum motor/controlador Feira implementado | C8 homologada; aguardar autorização de escopo próprio; clock/fontes/merge/completude/loop/velocidade/pausa/retorno precisam de definição |
| US15 | Parcial e contínua | Notebook 1366×768, móvel 390×844, teclado/foco/explicações, movimento reduzido e regressões | Não auditoria integral de acessibilidade/cross-browser; C8 homologada para continuidade pelo usuário |
| US16 | Validação/versionamento local parciais | Testes/build/docs/recuperação e commits até C8; rotina homologada; 292 testes revalidados | C8 versionada/enviada em 8134059, sincronização 0/0; dois documentos finais com commit/push complementar autorizado. Pages publicada em 547db4d. Sem commit/push/deploy implícitos |
| US17 | Pendente | Exportação não implementada | Escopo futuro: todo recorte com origem/regras/EXT; não só página |
| US18 | Parcial em A; B pendente | A: C8 Peças com análise de componentes/ocorrências e logística EXT; Integrações ainda placeholder. B: nenhuma integração real | C8 homologada para continuidade; catálogo/estoque/consumo/logística reais indisponíveis; B depende de fontes/contratos autorizados |
| US19 | Planejada, não implementada | Fronteiras Supervisor documentadas; link à apresentação original disponível | Link não é ponte contextual. Aviso, preservação de filtros/pausa Feira/retorno explícito e ponto de entrada dependem de escopo |

Implementação/homologação/versionamento por entrega:

| Entrega | Marco técnico | Aceite registrado | Referência Git atual |
| --- | --- | --- | --- |
| A | Shell/demo/12 menus, 41 testes | Validada antes da B | 03d8ced |
| B | Chamados/filtros, 69 | Homologada explicitamente | 03d8ced |
| C1 | SLA & Criticidade, 87 | Aceita para continuidade; sem registro separado de homologação visual final | 03d8ced |
| C1.1 | TA/TB/contrato temporal, 97 | Definições/regras aprovadas, etapa concluída | 03d8ced |
| C2 | Riscos & Tendências, 117 | Homologação preliminar | 03d8ced |
| C3 | Visão Geral, 139 | Homologada expressamente antes da C4 | ef53ecf |
| C4 | Contratos & Margem, 164 | Avaliada e aprovada para continuidade antes da C5 | ebd0db9 |
| C5 | Custos / TCO, 194 | Avaliada e aprovada para continuidade antes da C6 | 485e6b4 |
| C6 | Equipamentos, 225 | Avaliada e aprovada para continuidade | 05ec7d5 |
| C7 | Técnicos, 255; correção/revalidação 262 | Homologada visualmente para continuidade; rotina também homologada | a5aea32 |
| C8 | Peças / Componentes, 292 revalidados | Homologada visualmente para continuidade | 8134059 (implementação C8) |

Os marcos de testes são cumulativos. Revalidação desta sessão de versionamento: 292 distintos (283 Node/browser +9 Python), build/importador --check aprovados. Um início de Vite novo encontrou EMFILE; suíte integral repetida usando instância 5173 existente passou sem mudar código. Rotas diretas/refresh sob a base de produção e 1366×768 aprovados. [Evidências e preparação de publicação](publicacao-controlada-c8.md).

C8 funcional em `81340597740f461dbb401c81314397b802354e0d`, enviada ao origin/feature/next-evolucao com divergência 0/0 antes do registro documental complementar. Usuário autorizou commit/push complementar somente de continuidade e backlog; HEAD documental sucede C8, sem alteração funcional, e deve ser confirmado no Git. main a350cd0 preservada.

Publicação explicitamente confirmada pelo usuário e concluída: https://sinfoniatech.github.io/OrquestraNEXT/, gh-pages `547db4d8124160521ae9dd1aa00f5a1157929bac`, pai 429d377, sem force. [Workflow Pages](https://github.com/SinfoniaTech/OrquestraNEXT/actions/runs/38767107398) completed/success. HTML público igual ao build validado; quatro rotas de plataforma e dez cenas passaram acesso direto/refresh em 1366×768, sem erros JavaScript/HTTP. Apresentação original padrão; BackOffice por ?modo=plataforma. Não houve modificação de datasets, Supervisor ou cenas.

Próxima etapa de desenvolvimento: Modo Feira/US14, ainda não iniciado e sem escopo autorizado. Aguardar orientação do usuário. Publicação não autoriza implementar novas funcionalidades.

Rotina documental US16 homologada pelo usuário e registrada com C7; orientação permanente em [AGENTS](../../AGENTS.md). US16 segue transversal; não concluída integralmente por existir documentação.

## Critérios e dependências por história

| História e objetivo do usuário | Pri. | Dependências | Componentes afetados (proposta) | Critérios de aceite | Testes necessários |
| --- | --- | --- | --- | --- | --- |
| US01 Como responsável, quero Supervisor preservado e legado recuperável | P0 | — | Supervisor/cenas/tutorial e imports transitivos; referência Git | SHA recuperável; posições 3–10, navegação, timers, modais e detalhes equivalentes; BackOffice antigo documentado, sem congelar layout novo | Diferença arquivos/imports, regressão visual/funcional Supervisor, recuperação |
| US02 Como mantenedor, quero cenas/entradas sem ambiguidade | P0 | US01 | sceneIndex, controlador, adaptação entrada | Dez entradas antigas rastreadas; colisões auxiliares documentadas/tratadas ao tocar índice; nenhuma cena Supervisor trocada | Resolução IDs, hashes, ida/volta |
| US03 Como analista, quero base histórica rastreável | P0 | contrato dados | Importador/validador propostos, dados novos | 736 IDs/46 campos, tipos/nulos/escala/origem; XLSX intacto | Reconciliação, inválidos, hash |
| US04 Como demonstrador, quero histórico/snapshots/fixtures separados | P0 | US03 | Repositórios fonte e metadados | T0/T1/T2 10/16/24 separados; sem somas ou futuro antecipado | Fonte/momento/ID, atualização aprovada |
| US05 Como gestor, quero explicar cada indicador | P0 | US03/04 | Catálogo domínio, cards/explicação | BASE/CALC/EXT; fórmula aprovada, N/nulos/período/drill-down; EXT sem número inventado | Metadados, denom. zero, proveniência, teclado |
| US06 Como usuário, quero login e escolha da experiência | P0 | US01/02; Q08 | Entrada/login/modos/rotas propostos | Fluxo login→Visão Geral; demo explícita; três modos; links legados sem disputa | Login/demo/erros, hash/refresh/teclado |
| US07 Como usuário, quero novo BackOffice conforme UX | P0 | US06 | Novo shell, menu/header e adapters de componentes existentes | Login+12 menus; 1366×768; páginas substituídas por etapas com recuperação; justificativa de reuso/substituição | Layout/rolagem/menu, retorno, não alteração Supervisor |
| US08 Como analista, quero filtros cumulativos | P0 | US03/05/07; Q04/05 | Estado filtros/seletores/controles | AND campos/OR interno; cards/tabela/gráficos conciliam; chips/limpar/vazio | Combinações, limites, persistência |
| US09 Como operador, quero consulta e detalhe de chamados | P1 | US08 | Página Chamados/tabela/detalhe | Busca/ordem/paginação/total corretos; volta mantém filtros; fonte visível | IDs, filtros, paginação, detalhe |
| US10 Como gestor, quero Visão Geral e Padrões & Insights | P1 | US05/08/09 | Páginas T02/T11, cards/gráficos | Síntese e suporte rastreáveis; visual T11 aprovado; comparações válidas | Agregações/drill-down/explicação/UX |
| US11 Como gestor, quero Riscos e SLA explicáveis | P1 | US05/08/09; Q01–03 para recálculo | T05/T07, alertas/gráficos | Criticidade fonte separada de SLA; nenhuma regra arbitrária; abertos/histórico distintos | Limiares aprovados, fonte, urgência humana |
| US12 Como analista, quero Técnicos e Equipamentos consultáveis | P1 | US08/09 | T08/T09 e históricos | Agrupamentos por técnico/unidade; disponibilidade/skills EXT; recorrência definida | Distintos, histórico, nulos, EXT |
| US13 Como gestor, quero Contratos e custos sustentados | P1 | US05/08; Q09 | T03/T04/T12 | Custo estimado não TCO; receita/margem EXT; análise vs BackOffice distintos; sem CRUD presumido | Soma/média, filtros, EXT; testes de escrita só se aprovada |
| US14 Como expositor, quero Feira com evolução de dados | P1 | US04/05/06; Q07 | Motor temporal/controles/seletores novos | T0→T1→T2 ou mecanismo aprovado; pausa/retoma/reinicia; sem autoplay como único efeito; sem futuro antecipado | Relógio determinístico, reconciliação, pausa, retorno Supervisor |
| US15 Como usuário, quero UX acessível em notebook | P0 transversal | US07, acompanha demais | Todos novos componentes e fronteiras | 1366×768 principal; teclado/foco; ações visíveis; explicação e EXT acessíveis; Supervisor intacto | Viewports/zoom/teclado/movimento reduzido |
| US16 Como responsável, quero entregas reversíveis e verificadas | P0 transversal | US01 e histórias liberadas | Build/rotas/assets/testes/doc futura | Pipeline de aprovação; Git escopo correto; Pages/recuperação; sem deploy/commit implícito | Build autorizado, subdiretório/refresh, regressão, diff |
| US17 Como analista, quero exportar o recorte | P2 | US08/09 | Exportador proposto | Todo resultado, fonte/período/unidade/nulos e EXT; não só página | Conteúdo, quantidade e filtros |
| US18-A Como usuário, quero análise de componentes/ocorrências em Peças e integrações com limites claros | P1 | US05/07; visual T13 | T10/T13, selo/estado EXT | Peças analítica: componentes/falhas/recorrência/criticidade/clientes/contratos/custos e suporte até equipamento/histórico/insight; filtros compartilhados. Integrações navegáveis com limites; não afirmar consumo/estoque/preço/logística ou conexão sem fonte | EXT/vazio, menu/explicação, fonte |
| US18-B Como gestor, quero integrações reais futuras | P2 | US18-A e contratos/fontes | Adapters externos futuros | Só dados disponibilizados/autorizados; contrato e atualização verificáveis | Integração/erros/proveniência, sem mocks como reais |
| US19 Como operador, quero acessar Supervisor e voltar | P1 | US01/06/09 | Ponte/aviso/retorno, sem editar Supervisor | Aviso de demo independente/timers; retorno mantém filtros; pausa Feira; sem sincronização fictícia | Transição/cancelar/voltar, relógio, regressão Supervisor |

US18-A/B são tarefas de uma mesma história US18; total de histórias = 19. Responsáveis/estimativas permanecem pendentes.

## Critérios permanentes

Ready: aprovação de escopo/tela/fonte/regra/aceite e autorização de alteração. Done: testes e evidências, nenhuma regressão Supervisor, todos cards explicáveis, docs/backlog atualizados, limitações claras. Layout novo do BackOffice é comparado à referência UX aprovada e 1366×768, não exige igualdade com antigo.

A cada entrega relatar US, arquivos, funcionalidades, testes, riscos/EXT e próxima proposta. Não atualizar planejada para concluída por existir documento. [Sequência e gates](plano-incremental.md).

## Histórico incremental — não usar como estado atual

Os registros seguintes preservam evidências/decisões na época de cada entrega. Expressões como “planejado”, “sem telas”, “aguardar homologação C3” ou “sem commit” foram superadas onde indicado no quadro atual e nos registros seguintes. Não executar gates antigos como instruções novas nem apagar seu histórico. Para estado efetivo, usar o quadro das 19 histórias acima e a continuidade consolidada.

## Estado após proteção técnica mínima — 15/10/2026

| História | Estado real | Evidência / restante |
| --- | --- | --- |
| US01 | Proteção mínima validada | 15 testes totais aprovados; oito cenas Supervisor; recuperação clonada; cobertura visual/cross-browser e Supervisor completo pendentes |
| US02 | Inspecionada, sem correção funcional | Dez entradas válidas; colisões auxiliares conhecidas preservadas |
| US15 | Parcialmente validada | Teclado/movimento reduzido/1366×768; não auditoria de acessibilidade completa |
| US16 | Validação local parcial concluída | Build/preview e recuperação aprovados; publicação não executada |
| US19 | Planejada, fronteiras documentadas | Nenhuma ponte implementada |
| US03/04 | Implementadas e validadas na infraestrutura | 736/46, snapshots separados, 34 casos distintos aprovados; nenhuma tela ou reprodução temporal implementada |

[Resultados](../preservacao/resultado-protecao-minima.md). Demais histórias permanecem planejadas. Testes não equivalem à implementação dos modos nem autorizam próxima etapa.

## Resultado da camada de dados

US03 concluída tecnicamente na entrega autorizada; US04 concluída para separação e consulta das fontes. Integração visual, merge temporal e motor Feira permanecem em histórias futuras. US05 recebe suporte BASE/CALC/EXT na API, não está concluída para todos os cards. US08 tem consulta básica reutilizável, não filtros visuais. US01/16: 15 regressões e build novamente aprovados. [Evidências US03/04](../dados/resultado-us03-us04.md). Próxima navegação/filtros depende de nova autorização.

## Entrega A — shell e navegação

| História | Estado incremental | Evidência / pendência |
| --- | --- | --- |
| US06 | Acesso demo e modo independente implementados | Login/saída/refresh; modos Apresentação novo/Feira não implementados |
| US07 | Shell e 12 destinos implementados | Layout 1366×768; todas páginas ainda sem funcionalidade |
| US15 | Validação parcial ampliada | Teclado, skip, foco, drawer e 390×844; auditoria completa pendente |
| US01/16 | Revalidadas | Build e 34 testes anteriores aprovados; sem deploy |
| US08/09 | UI aguardando aprovação da Entrega A | Consulta de dados prévia preservada; filtros/Chamados não implementados na tela |

[Resultado Entrega A](entrega-a-navegacao.md). 7 testes novos, total 41 aprovados. Aprovação de US03/US04 pelo usuário registrada. Não avançar Entrega B antes de avaliação.

## Entrega B — Chamados e filtros

US08/US09 implementadas: oito filtros cumulativos, busca, chips, limpeza, ordenação, paginação e detalhe preservando contexto. US05 atendida nos indicadores desta página; demais pendentes. US07: primeira página funcional, onze destinos pendentes. US15 parcialmente validada. US01/16 revalidadas; US03/04 preservadas. 69 testes aprovados (41 anteriores + 28 novos), build aprovado. SLA restante numérico depende de Q01/Q02. [Relatório, arquivos, critérios e limites](entrega-b-chamados.md). Nenhuma nova página/história iniciada.

## Entrega C1 — SLA & Criticidade

Entrega B homologada pelo usuário. US11 implementada para análise histórica de SLA/criticidade: aderência dos concluídos elegíveis, médias materializadas TA/TB com N independente, consumo médio/faixas, passageiros, quatro cores, motivos completos, agrupamentos e prioridades ativas. US05: dez explicações com fontes/populações e aprofundamento. US08 reutilizada sem nova camada. US07: duas páginas funcionais, dez destinos pendentes. US01/16 revalidadas; US15 validada parcialmente em notebook/móvel. US11 não implica Riscos & Tendências implementada nem recálculo gerador de criticidade. [Regras aprovadas, resultados e limites](entrega-c1-sla-criticidade.md).

## C1.1 — formalização TA/TB

US05/11: rótulos e explicações padronizados em minutos, com definições sintéticas confirmadas pelo responsável; nenhuma mudança de fórmula de aderência. US03/04: integridade/materializados preservados. US14 recebe contrato de visibilidade e projeção pura testada (sem motor Feira nem navegação temporal implementados). US01/09/16: regressão revalidada. Encerramento técnico não persistido, não reconstruído como evento. C2 não iniciada; depende de homologação C1.1. [Arquivos, evidências e aceite](entrega-c11-tempos.md).

## Entrega C2 — Riscos & Tendências

US11 entregue também para Riscos & Tendências: Vermelhos/Laranjas históricos, unidades distintas com Recorrencia_30d >=3, contratos distintos com Impacto_Contrato Alto e ativos não concluídos Laranja/Vermelho. US05: doze explicações CALC e evidências BASE. US08/09 reutilizadas: filtros, busca, ordenação, paginação e detalhe. US07: três páginas funcionais, nove destinos pendentes. US01/15/16: regressão e notebook/móvel revalidados no escopo dos testes. US10/12 e demais páginas não iniciadas. Q09 resolvida apenas para este proxy de pressão operacional; não margem nem cálculo financeiro. Regras geradoras de criticidade/recorrência e contrato real continuam pendentes. [Resultado, testes e limites](entrega-c2-riscos.md). Aguardar homologação; não avançar outra funcionalidade.

## C3 — Visão Geral Executiva

Commit de referência até C2 autorizado e criado: 03d8cedb20cc0754cbe07c01c08e0e62c688a428. Antes do commit: revisão de 116 arquivos, staged/check, 117 testes e build aprovados. Sem push. C3 autorizada em seguida e mantida sem novo commit.

US10 parcialmente entregue: Visão Geral/Performance funcional; Padrões & Insights continua pendente. US05: seis cards CALC, três fontes financeiras EXT e cinco explicações de painéis (14 ao todo). US07: quatro páginas funcionais, oito destinos pendentes. US08/09 reutilizadas; US01/15/16 revalidadas. US13 recebe componente EXT e agregação de custo como infraestrutura, não página Contratos & Margem ou TCO implementada. 139 testes distintos aprovados (117 anteriores +22 novos). [Entrega, arquivos e critérios](entrega-c3-performance.md). Aguardar homologação; nenhuma próxima página autorizada por este registro.

## C4 — Contratos & Margem — 15/10/2026

C3 homologada expressamente; commit local autorizado ef53ecf497a0968480880fddd496faa677da50aa, após 139 testes/build/staging revisados; sem push/deploy.

US13 parcialmente entregue: carteira completa por contrato, custo estimado, SLA, pressão por Alto e proporção recorrente; identificação e análise técnica, equipamentos/chamados/insights; finanças e vigência EXT. US05: cards, colunas, gráficos e detalhe com fonte/fórmula/população/N/nulos/período/unidade e suporte. US07: cinco páginas funcionais/sete pendentes. US08/09 reutilizadas com contexto da carteira em memória; US01/15/16 revalidadas. US12 não concluída: agrupamentos no contrato não equivalem às páginas Técnicos/Equipamentos.

Critérios verificados: quatro cards conciliados, busca cliente/contrato, ordem antes da página, filtros AND/OR compartilhados, suporte por métrica, equipamento→chamado/retorno, seis gráficos sincronizados, explicações acessíveis/EXT, vazio, 1366×768 e móvel sem overflow. 164 testes distintos aprovados (139 anteriores +25 novos), build/importação aprovados. Componentes: ContratosPage, contratos.js e GroupChart novos; shell, ConsultationContext e teste de menus adaptados. Custo/SLA/pressão reutilizam C3/C1/C2. Recorrência >0 / total tem cobertura explícita; não soma eventos.

[Relatório completo, arquivos, evidências e limitações](entrega-c4-contratos.md). Pendências: receita/margem/rentabilidade/TCO/vigência/cobertura reais; páginas financeiras restantes; regras geradoras e contrato oficial. C4 sem commit, aguardando homologação. Próxima recomendação: Custos / TCO após aprovação específica. Nenhuma nova entrega iniciada.

## C5 — Custos / TCO — 15/10/2026

C4 avaliada e aprovada pelo usuário para continuidade. Commit local autorizado e executado: ebd0db93a06ec78f11c7dfbe55298a6c043b17a4, após revisão de 30 arquivos, staging/check, 164 testes e build; sem push/deploy.

US13 avança: Custos / TCO funcional com custo total/médio, atribuição a técnicos, recorrentes, pressão C2, grupos por nove dimensões, série diária, carteira/chamados caros, pares custo×TA/TB e desempenho por SLA. TCO/composição financeira EXT, sem rateio. Contratos — BackOffice segue pendente. US05: 19 explicações na página e metadados/contexto no aprofundamento. US07: seis páginas funcionais/seis destinos pendentes. US08/09 reutilizadas; US01/15/16 revalidadas. US12 não concluída por existirem agrupamentos locais.

Critérios verificados: custos e médias conciliados, recorrentes/zero/desconhecidos disjuntos, N/cobertura/ausências, pares válidos TA/TB, SLA aprovado sem recálculo, tabela contratos/chamados com busca/ordem/paginação, filtros e retorno preservados, custo→desvio SLA→contrato→equipamento→chamado→insight, EXT sem valor fictício e notebook/móvel sem overflow. 194 testes distintos aprovados (164 anteriores +30 novos), build e importação --check aprovados. Arquivos: custos.js, CustosPage/estilos e testes novos; shell, ConsultationContext, chave mean em contratos.js e teste de menus adaptados. [Relatório completo e evidências](entrega-c5-custos.md).

Pendências: dados financeiros realizados, composição/TCO, metas/orçamento, regras oficiais e páginas restantes. C5 sem commit, aguardando homologação. Próxima recomendação: Equipamentos (US12), somente após escopo autorizado; nenhuma nova página iniciada.

## C6 — Equipamentos — 15/10/2026

C5 avaliada e aprovada para continuidade pelo usuário. Commit local autorizado: 485e6b49f6b0f1342a69e0a126adcecbab9d06f6 após 194 testes/build e revisão de staging dos 30 arquivos; sem push/deploy.

US12 parcialmente entregue: Equipamentos funcional, Técnicos pendente. Carteira/histórico técnico por unidade, métricas TA/TB/SLA/custo reutilizadas, recorrência elevada C2, gráficos por tipo/componente/dia/cor, insights e chamados. US05: 13 explicações principais mais detalhe contextual. US07: sete páginas funcionais/cinco destinos pendentes. US08: dois filtros preparados promovidos à UI compartilhada (Unidade/Componente Principal), total dez incluindo período/recorrência. US09 reutilizada; US01/15/16 revalidadas.

Critérios verificados: 54 unidades/19 elevadas/736 ocorrências/4 tipos; disponibilidade EXT sem uptime; tipo >0 usa numerador/denominador de unidades do próprio tipo; volume, máximo e último valor registrados distintos; cronologia/cor/insight do mesmo último chamado; filtros AND/OR/chips, ordem/página/retorno e suporte; fluxo carteira→tipo→unidade→histórico→recorrência→insight→chamado; vazio/nulos/EXT/teclado e notebook/móvel. 225 testes distintos aprovados (194 anteriores +31 novos), build/importação --check aprovados. Arquivos: equipamentos.js, EquipamentosPage/estilos/testes; shell, ConsultationUI, ConsultationContext, filtros de chamados, callback de ordenação reutilizado e testes B/shell adaptados. [Relatório e evidências](entrega-c6-equipamentos.md).

Limitações: massa sintética, sem cadastro mestre/uptime/parque ativo; recorrência materializada não soma eventos, último campo não indica estado atual; sem causalidade/ML validado. C6 sem commit, aguardando homologação. Próxima prioridade planejada pelo usuário: Modo Feira/US14, somente após homologação e autorização de escopo. Nenhum motor Feira ou outra página iniciado.

## C7 — Técnicos — registro anterior à homologação

C6 aprovada para continuidade e registrada em 05ec7d5 após nova validação 225 testes/build e staging dos 34 arquivos. C7 implementada na US12 existente, sem história duplicada: carteira por técnico, todos vínculos Área/Supervisor/Rota observados, atendimentos/concluídos, TA/TB/SLA/custos estimados, recorrência/criticidade, suporte e equipamentos/histórico/insight. Disponibilidade/skills/escala/localização/custo real/avaliações EXT. Análise da operação sem avaliação automatizada individual.

US05 explicações/N/BASE/CALC/EXT; US08 13 filtros compartilhados e busca de Rota; US09 detalhes reutilizados; US07 oito páginas funcionais/quatro pendentes; US01/15/16 regressão e evidências. 21 serviço +9 navegador novos; total 246 Node/browser +9 Python =255 testes distintos aprovados, build/importador --check aprovados. [Arquivos, critérios, evidências e limites](entrega-c7-tecnicos.md).

C7 sem commit e aguardando homologação visual. Próxima entrega planejada: C8 — Peças e Componentes (US18-A), seguida por Modo Feira (US14). Nenhuma implementação futura ou commit C7 autorizado; sem push/deploy. Registros incrementais anteriores preservam o estado da época; este quadro e a continuidade refletem o estado atual.

## C8 — Peças e Componentes — 15/10/2026

C7 e rotina homologadas e registradas em a5aea32 após nova validação 262/build e staging de 48 arquivos. US18-A ampliada na história existente, sem duplicação: análise técnica por componente/ocorrência, carteira/detalhe/unidade/histórico/insight, categorias/falhas/clientes/contratos/custos, logística EXT. Sem estoque/compra/reserva/despacho. US05/07/08/09/15/16 e preservação US01 revalidadas. Total 19 histórias; nove páginas funcionais/três pendentes. 30 testes novos (21 serviço +9 navegador), total 292=283 Node/browser +9 Python, build/importador aprovados. [Critérios, arquivos, regras, evidências e limites](entrega-c8-pecas.md). Registro histórico do encerramento técnico: depois homologada para continuidade pelo usuário; ver quadro atual/continuidade para versionamento e preparação Pages. Nenhuma Feira iniciada.
