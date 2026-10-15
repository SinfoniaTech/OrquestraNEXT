# Entrega B — Chamados e filtros funcionais

Entrega local de 15/10/2026, sem commit, deploy ou instalação. URL: /OrquestraNEXT/?modo=plataforma#/chamados.

## Funcionalidades e regras

Consulta exclusivamente HIST_60_DIAS pela camada existente. Seis cards (total e cinco status), distribuições, tabela e atenção usam a mesma população filtrada antes da paginação. Base completa: 736 registros, 724 concluídos e 12 ativos; apenas 1 ativo Laranja/Vermelho. Os 66 Vermelhos históricos não são ocorrências atualmente abertas.

Filtros: período, criticidade, status, cliente, área, tipo de equipamento, categoria e recorrência. OR no mesmo campo e AND entre campos. Recorrência agrupa valores materializados em 0, 1–2 e 3+, sem recalcular sua regra geradora; nulo não vira zero. Busca ignora caixa/acentos e combina palavras por AND. Chips removíveis e limpeza completa. Ordenação antes da paginação, empate por ID, nulos no fim; páginas de 10/25/50. Alterar filtro, busca ou ordem retorna à primeira página.

Referência fixa 06/10/2026 22h America/Sao_Paulo, filtro Criado em, dias inclusivos: Hoje 14 registros; 7 dias desde 30/09: 93; 15 desde 22/09: 202; 30 desde 07/09: 395; 60 desde 08/08: 736. Não usa o relógio do computador.

Detalhe reúne os 46 campos em contexto, operação, tempo e inteligência; preserva filtros, período, busca, ordem e página. Navegação entre menus preserva a consulta em memória. Refresh completo restaura padrão. Limpar retorna a 60 dias e criação descendente. Atenção = não concluído e Laranja/Vermelho, vermelho primeiro e criação mais antiga; mostra até três detalhes.

Todos os seis cards e três áreas analíticas oferecem explicação: definição, campos, cálculo, população, período, unidade, nulos, tipo CALC e fonte. Valores materializados do detalhe são BASE. Não há métricas externas inventadas; EXT permanece requisito para fontes futuras. ETA_min é chegada do técnico, nunca logística de peças; concluído/chegada registrada não recebe previsão futura; zero é identificado como valor da base.

## Arquivos criados e modificados

Novos de implementação:
- src/platform/services/chamados.js: seletores, filtros, resumo, ordenação e metadados.
- src/platform/filters/ConsultationContext.jsx: estado compartilhado.
- src/platform/components/ConsultationUI.jsx: FilterBar, FilterChips, SearchInput, Pagination, KpiCard, IndicatorInfo, badges, diálogo e EmptyState.
- src/platform/components/DataTable.jsx: tabela reutilizável.
- src/platform/components/Consultation.module.css: estilos isolados.
- src/platform/pages/ChamadosPage.jsx: página funcional.
- src/platform/pages/ChamadoDetail.jsx: detalhe e proveniência.

Alterado src/platform/BackofficePlatform.jsx para conectar contexto/página. src/App.jsx já estava alterado na A e não foi editado nesta entrega. Nenhum componente, dado ou CSS do Supervisor/cenas foi alterado.

Novos testes: tests/chamados-service.test.mjs e tests/chamados-browser.test.mjs. Adaptado tests/platform-shell.test.mjs: Chamados funcional, demais onze destinos pendentes e build configurável por ambiente. Documentação atualizada: este relatório, índice, backlog, pendências, cobertura de telas e tests/README.md; evidências copiadas abaixo.

## Testes e preservação

69 testes distintos aprovados, zero falhas: 17 novos de serviço + 11 novos de navegador + 32 regressões Node/browser + 9 testes Python. Os 41 anteriores são 32+9, sem dupla contagem.

Cobertura: oito filtros, períodos/limites, AND/OR, acentos, chips, limpeza, vazio, contagens/percentuais, ordenação/página, detalhe/retorno, nulos TA/TB, histórico versus ativos, explicações, consulta offline após carregamento, navegador em fuso Tokyo, 1366×768 e 390×844, ausência de erros JS/rede. Regressões verificam dez cenas, Supervisor, alertas, detalhes, eventos, saída/reentrada, temporizadores, FLIP e movimento reduzido. Não equivalem a auditoria visual integral ou todos os navegadores.

Build Vite aprovado em /tmp/orquestra-entrega-b/dist. Importador --check aprovado. SHA256 da planilha intacta: 1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe.

Git: branch feature/next-evolucao, HEAD 43dd0283728d8c78ae9017ae5acae8a1cf3101d5. Sem diferenças com HEAD em src/views, src/components, src/styles, src/scenes, scenes.config.js, main.jsx, package.json, lockfile, vite.config.js, datasets e referencias. Continuam não versionados docs/, scripts/, src/data/, src/platform/ e tests/; src/App.jsx é modificação anterior. É necessário commit autorizado para proteção permanente deste conjunto; /tmp não é backup permanente.

Evidências:
- [28 novos testes](evidencias/entrega-b-tests.txt)
- [32 regressões](evidencias/entrega-b-regression.txt)
- [9 testes do importador](evidencias/entrega-b-import.txt)
- [Build](evidencias/entrega-b-build.txt)
- [Reconciliação da fonte](evidencias/entrega-b-source-check.json)
- [Notebook](evidencias/entrega-b-chamados-desktop.png)
- [Filtros](evidencias/entrega-b-filtros-cumulativos.png)
- [Detalhe](evidencias/entrega-b-detalhe.png)
- [Explicação](evidencias/entrega-b-explicabilidade.png)
- [Análise](evidencias/entrega-b-analitica.png)
- [Móvel](evidencias/entrega-b-chamados-mobile.png)

## Divergências, critérios e riscos

SLA restante numérico depende de regra aprovada: SLA_min e Percentual_SLA não definem relógio, pausas ou prazo restante. A coluna informa “Regra em validação” nos ativos e “Encerrado” nos concluídos; percentual materializado disponível. Este é o limite conhecido do requisito “quando aplicável”. Q01/Q02 continuam pendentes antes de médias TA/TB, aderência ou SLA restante. TA/TB são apresentados como materializados, sem unidade arbitrária; ausentes permanecem ausentes.

Demais critérios cobertos pelos testes, sujeitos à homologação visual. Não há novas regras geradoras de criticidade/recorrência. Dados locais síncronos não exigem skeleton de requisição. Offline testado após carregamento; não há service worker nem garantia de primeiro acesso sem rede. Estado não persiste após refresh. Chunk opt-in da plataforma: aproximadamente 1.154 kB minificado / 87 kB gzip, aviso de tamanho sem falha de build; avaliar carregamento seletivo antes de expandir. Ferramentas Playwright/Chrome preexistentes, sem novas dependências.

## Backlog e próximo gate

US08/09 entregues para Chamados. US05 atendida nesta página e pendente nas demais. US07 com primeira página funcional e onze destinos pendentes. US15 parcialmente validada; US01/16 revalidadas; US03/04 preservadas. Outras páginas, ponte e Feira não iniciadas.

Recomendação: homologar esta tela, agrupamentos e explicações; resolver Q01/Q02 quando se exigirem novos cálculos; autorizar registro permanente das entregas. Depois selecionar explicitamente o próximo escopo. Não iniciar outra história nem publicação sem aprovação.
