# Product Backlog revisado — BackOffice NEXT

Prioridade principal: novo BackOffice. P0 fundamento/liberação, P1 MVP, P2 expansão. Estado de implementação funcional: planejado. Atualização de proteção técnica: US01/02/15/16 têm validação parcial; US19 tem fronteiras documentadas. Ver quadro de evidências abaixo. BackOffice legado não exige equivalência visual; Supervisor protegido. Dependências de aprovação e dados não são resolvidas por suposição.

IDs US01–18 mantidos com escopo revisado; US19 acrescentada para ponte explícita. US07 deixa de exigir consolidação das duas cópias; US06 expande entrada/login; US18 separa shell EXT obrigatório (A) de integração real (B).

## Épicos

E1 proteção/entrega US01/02/15/16; E2 dados/explicação US03/04/05; E3 novo shell/modos US06/07; E4 consultas US08/09; E5 inteligência US10/11/12; E6 executivo/EXT US13/18; E7 ponte/Feira US19/14; E8 exportação US17.

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
| US18-A Como usuário, quero Peças/Integrações com limites claros | P1 | US05/07; visual T13 | T10/T13, selo/estado EXT | Páginas navegáveis; dependências visíveis; não afirmar estoque ou conexão | EXT/vazio, menu/explicação, fonte |
| US18-B Como gestor, quero integrações reais futuras | P2 | US18-A e contratos/fontes | Adapters externos futuros | Só dados disponibilizados/autorizados; contrato e atualização verificáveis | Integração/erros/proveniência, sem mocks como reais |
| US19 Como operador, quero acessar Supervisor e voltar | P1 | US01/06/09 | Ponte/aviso/retorno, sem editar Supervisor | Aviso de demo independente/timers; retorno mantém filtros; pausa Feira; sem sincronização fictícia | Transição/cancelar/voltar, relógio, regressão Supervisor |

US18-A/B são tarefas de uma mesma história US18; total de histórias = 19. Responsáveis/estimativas permanecem pendentes.

## Critérios permanentes

Ready: aprovação de escopo/tela/fonte/regra/aceite e autorização de alteração. Done: testes e evidências, nenhuma regressão Supervisor, todos cards explicáveis, docs/backlog atualizados, limitações claras. Layout novo do BackOffice é comparado à referência UX aprovada e 1366×768, não exige igualdade com antigo.

A cada entrega relatar US, arquivos, funcionalidades, testes, riscos/EXT e próxima proposta. Não atualizar planejada para concluída por existir documento. [Sequência e gates](plano-incremental.md).

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
