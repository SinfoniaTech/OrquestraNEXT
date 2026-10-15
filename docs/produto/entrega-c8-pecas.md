# C8 — Peças — Inteligência de Componentes e Ocorrências

15/10/2026, America/Sao_Paulo. **C8 testada visualmente pelo usuário e homologada para continuidade.** Versionamento e envio de feature/next-evolucao ao origin autorizados após revalidação. Nova execução 292 testes/build/importador aprovada; nenhuma mudança funcional nesta sessão. Preparação do Pages documentada em [publicação controlada](publicacao-controlada-c8.md); substituir a versão pública exige confirmação do destino. Nenhuma Feira iniciada. O restante do relatório preserva implementação e critérios da entrega.

## Controle de versão C7

Branch feature/next-evolucao; HEAD inicial 05ec7d5. Revisados 48 arquivos locais pertencentes à C7, à correção de inicialização e à rotina documental (14 modificados/34 não rastreados), sem staging prévio. Conferidos tipos/conteúdos/diffs e padrões de credenciais; nenhum arquivo inesperado, temporário indevido ou padrão de segredo identificado. Supervisor/dez cenas/dados/importador/dataset/dependências/configurações intactos.

Antes de implementar C8: **262 testes distintos novamente aprovados (253 Node/browser + 9 Python)**, incluindo teste ESM/rotas Vite da inicialização e regressão do Supervisor; build aprovado. Staging restrito aos 48 arquivos revisados; cached stat/check aprovados. Commit local autorizado **a5aea32e828d0258a9700c6eef0c4682a05ffe12** — `feat: implementa gestao analitica de tecnicos C7`. Árvore limpa após commit; sem push/deploy.

Evidências desta revalidação: c8-reference-tests.txt, c8-reference-python.txt, c8-reference-build.txt em evidencias/. O commit preserva documentos com o retrato anterior à homologação; o estado atual é registrado nesta entrega e na continuidade.

## Escopo e fonte

Rota /OrquestraNEXT/?modo=plataforma#/pecas. Usuário principal: Gerente Geral de Operações. Referência UX 10_Pecas.png consultada para identidade, hierarquia de cards/painéis/carteira. Não foram copiados números, depósitos, percentuais de disponibilidade, códigos SKU, preços, comparações semestrais ou ações logísticas sem fonte.

Fonte exclusiva HIST_60_DIAS pela camada aprovada: 736 chamados sintéticos/46 campos, criação 08/08–06/10/2026 e referência fixa 06/10/2026 às 22h São Paulo. Snapshots T0/T1/T2 e fixtures do Supervisor separados. Dataset original e JSONs gerados não alterados.

C8 analisa componentes associados às ocorrências; não comprova peça consumida, reserva, compra, substituição necessária ou demanda logística. Nenhuma movimentação de estoque, compra, reserva ou despacho implementados.

## Indicadores, carteira e regras

| Indicador completo | Regra sustentável | Resultado |
| --- | --- | --- |
| Componentes identificados | Distinto Componente Principal não nulo/vazio/apenas espaços | 10; 11 subcomponentes observados |
| Ocorrências com componente | Contar chamados com componente identificado, todos status; cobertura no total explícita | 736/736, 0 sem componente |
| Unidades com recorrência elevada | C2: Unidade distinta com algum Recorrencia_30d finito>=3 nos associados | 19 em 106 registros |
| Chamados Vermelhos históricos | Cor Vermelho BASE, incluindo concluídos | 66; não item de estoque crítico |
| Custo estimado dos atendimentos associados | C3: soma de custos finitos não negativos dos associados, zero válido, N próprio | R$ 696.734,60/N736 |

Carteira por componente com subcomponentes completos recolhíveis, quantidade de ocorrências, unidades/contratos distintos, proporção de recorrência positiva com numerador/denominador/cobertura, Vermelhos históricos e não concluídos, custo dos atendimentos com N e detalhe. Ordem inicial: volume desc/texto asc; alternativas por componente/unidades/contratos/recorrência/críticos/custo; nulos no fim, ordenação antes de paginação 10/25/50. Dez componentes cabem na primeira página atual; serviço de paginação testado também com 24 grupos para limites/retorno.

Recorrência positiva C4: valores finitos>0 / todos os chamados do contexto, cobertura de valores válidos explícita; sem cobertura/população, indisponível. Recorrência elevada>=3 mantém regra C2. Volume, máximo e último valor materializado da unidade são distintos; não somar o campo como eventos. Uma unidade pode aparecer em componentes diferentes; não somar distintos de grupos como parque total.

Criticidade fornecida, sem derivar de SLA: 253 Verde/345 Amarelo/72 Laranja/66 Vermelho ; 138 Laranja/Vermelho históricos, 1 prioridade não concluída na referência entre 12 não concluídos. Associações com componente não comprovam causa da falha. Custos são dos chamados e não preço unitário/custo de material; nenhuma composição financeira inferida.

Detalhe reutiliza TA/TB C1.1 e SLA C1: média de materializados finitos não negativos, zero válido/nulos excluídos/N independente; TA 728/TB 724 no completo. SLA: 665/724=91,9%, 59 acima, sem alterar regras ou reconstruir encerramento técnico. População e elegibilidade explicitadas em cada card, inclusive cobertura da recorrência e numerador/denominador SLA.

## Gráficos, contexto e aprofundamento

Painéis: frequência por componente, categorias, falhas, concentração por contratos e clientes, custos por componente, evolução diária por criação, quatro criticidades e investigação de recorrências. Disponibilidade por depósito mantém o conceito da referência com EXT. Barras/dias/cores/cards abrem seus chamados de suporte, sem alterar filtros globais silenciosamente.

Fluxo validado: **Carteira → Componente → Equipamento → Ocorrência → Histórico → Insight**. Detalhe de componente apresenta subcomponente/categoria/defeito/falha/fechamento BASE agrupados por texto completo, clientes/contratos, equipamentos com volume/máximo/último/cobertura, TA/TB/SLA/custos/recorrência e insights BASE completos. Ocorrências reutilizam RecordExplorer e ChamadoDetail; este já tinha callback de equipamento desde C7, sem alteração nesta entrega.

Histórico de equipamento fica restrito ao componente e aos filtros atuais, inclusive quando aberto pelo chamado. Ordenação cronológica por criação desc/ID asc e insight do próprio registro; sem ampliar silenciosamente para outros componentes. Fechar diálogos restaura carteira/detalhes anteriores, filtros, ordem/página e contexto. Insight tem suporte de ocorrências; sugestões de investigação não são previsão ML ou recomendação de compra/substituição.

## Filtros e explicabilidade

13 filtros compartilhados existentes, sem nova camada: período, criticidade, status, cliente, área, tipo, categoria, recorrência, unidade, componente principal, técnico, supervisor e rota. AND entre campos/OR interno, busca normalizada por palavras AND, chips, limpar/vazio. Cards/gráficos/tabela partem da mesma população antes da paginação; cada indicador aplica sua elegibilidade documentada. Estado de apresentação da carteira em ConsultationProvider preservado na navegação; mudanças de consulta voltam à primeira página; limpar/logout reinicia; refresh padrões.

Explicações por botão e teclado, sem depender de hover: definição, origem, regra/fórmula, população, período/unidade, N/elegibilidade/nulos, filtros e fonte/hash. BASE campos fornecidos; CALC contagens/médias/agregações; EXT fontes indisponíveis. Não confundir suporte positivo com cobertura de recorrência: ambos explicitados. Campos técnicos/categorias/insights não têm texto gerado ou causa atribuída.

## Dependências EXT

- Disponibilidade por depósito: ERP/WMS, depósitos/saldos/reservas; sem gráfico/percentual/saldo fictícios.
- ETA logístico/distância: origem/destino/transporte/lead time/fornecedor/geolocalização; ETA_min existente é chegada do técnico, não entrega de peça.
- Peças sugeridas/compatibilidade: catálogo SKU e engenharia/diagnóstico validado; componente/subcomponente não identifica automaticamente peça a trocar.
- Preço/consumo: ERP/compras/ordens de manutenção e quantidade efetivamente consumida; custo do chamado não equivale a material.

Todas fontes são identificadas como não conectadas, sem última sincronização. Não há movimentação, compra, reserva, despacho ou integração real simulada.

## Arquivos e reuso

Criados: src/platform/services/pecas.js; src/platform/pages/PecasPage.jsx e PecasPage.module.css; tests/pecas-service.test.mjs e pecas-browser.test.mjs; relatório/evidências C8.

Modificados: BackofficePlatform.jsx (conectar exclusivamente Peças); navigation.js (descrição); ConsultationContext.jsx (carteira/reset); platform-shell.test.mjs (nona página funcional); platform-dev.test.mjs (Peças funcional em URL direta/refresh, mantendo ESM/erros/outras rotas); documentação de continuidade, índice, backlog, plano, dicionário, explicabilidade, cobertura, relatório C7 e tests/README.

Reutilizados FilterBar/KpiCard/IndicatorInfo/Dialog/Pagination/EmptyState/CriticalityBadge, DataTable, RecordExplorer, GroupChart/ExecutiveChart, ExternalMetric/ChamadoDetail; contractMetrics/contractPage, médias/SLA, risco/série temporal, custo e equipmentAnalysis C6. Estilos C8 isolados, importando base C6 sem modificá-la. Nenhum mecanismo paralelo, biblioteca, regra temporal ou dataset novo.

## Testes, visual e preservação

**292 testes distintos aprovados =283 Node/browser + 9 Python**, incluindo 262 anteriores e 30 novos C8 (21 serviço +9 navegador). Build e importador --check aprovados. Nenhuma dependência instalada. Logs entrega-c8-regression.txt, entrega-c8-python.txt, entrega-c8-build.txt e entrega-c8-import.txt em evidencias/.

Cobertura nova: componentes/subcomponentes e cobertura/distintos, associação versus consumo, unidades/recorrência, críticos históricos versus ativos, soma de custo e N/nulos/zero/inválidos, categorias/falhas/defeitos, concentração por contrato/cliente, dias/zero, TA/TB/SLA reutilizados, filtros cumulativos/AND/OR/chips/busca, ordenação/paginação/desempates, detalhe/percurso completo/equipamento/histórico/insight/retorno, EXT/ausência de ações logísticas, explicações por teclado, vazio, notebook/móvel/offline após carregar e imutabilidade.

Capturas inspecionadas: [1366×768](evidencias/entrega-c8-pecas-desktop.png), [carteira](evidencias/entrega-c8-pecas-carteira.png), [análises](evidencias/entrega-c8-pecas-analises.png), [componente](evidencias/entrega-c8-pecas-componente.png), [histórico](evidencias/entrega-c8-pecas-historico.png), [390×844](evidencias/entrega-c8-pecas-mobile.png). Cinco cards acima da dobra no notebook; tabelas/listas com rolagem interna, detalhes progressivos, sem overflow de documento/diálogo. Não auditoria integral de acessibilidade/cross-browser.

Regressão: nove páginas funcionais/três destinos pendentes/12 menus, login/saída/refresh/filtros/contexto, desenvolvimento ESM/quatro rotas, dez cenas/hash/teclado, Smart Fit Normal→Média→Alta, hospital/contexto humano sem SLA inventado, alertas/FLIP/modais/timers/saída/revisita/movimento reduzido preservados. Comparação com a5aea32 sem diferenças em Supervisor/cenas/legado, src/data, scripts, datasets, referencias, App/main/scenes.config, package/lock/Vite.

Planilha SHA256 1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe intacto. Aviso preexistente de chunk>500kB mantido (~1.326kB minificado/126,1kB gzip na plataforma). Login demo/filtros em memória; primeiro acesso offline não garantido/sem service worker. Gatilho original da transformação vazia no Vite antigo permanece indeterminado; não afirmar solução universal desse gatilho pelo build.

## Backlog e encerramento

C8 amplia US18-A existente com análise técnica sustentada e mantém logística EXT; Integrações e US18-B reais continuam pendentes. US05/07/08/09/15/16 atendidas/ampliadas/revalidadas no escopo; US01 preservação contínua. Nove páginas funcionais e três pendentes; total 19 histórias, sem duplicação. C7 e rotina homologadas e commitadas em a5aea32.

C8 homologada para continuidade; versionamento autorizado após nova validação. Próxima decisão: confirmar destino antes de substituir a versão pública do Pages. Feira/US14 é a próxima prioridade planejada, mas exige escopo temporal/fontes/merge/velocidade/loop/pausa/retorno aprovado antes de implementação; ponte Supervisor US19 continua pendente. Nenhum próximo modo/página iniciado, nenhum push/deploy.
