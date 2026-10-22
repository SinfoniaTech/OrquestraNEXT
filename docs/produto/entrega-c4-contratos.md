# C4 — Contratos & Margem

15/10/2026, America/Sao_Paulo. C3 homologada expressamente pelo usuário; C4 autorizada no mesmo pedido. Página disponível em `/OrquestraNEXT/?modo=plataforma#/contratos-margem`. C4 implementada localmente e aguardando homologação; nenhuma outra página iniciada.

## Referência permanente da C3

Confirmados branch `feature/next-evolucao`, HEAD anterior `03d8cedb20cc0754cbe07c01c08e0e62c688a428`, 10 arquivos modificados e 20 não rastreados da C3/passagem. Revisados diff, inventário, tipos e padrões de credenciais: nenhum indício nos arquivos examinados e nenhum temporário indevido. Staging restrito aos 30 arquivos esperados, revisado com stat, status e diff/check. Nada fora do escopo.

Build aprovado, 130 testes Node/browser e 9 Python aprovados, importador --check aprovado. A primeira tentativa de navegador parou por bloqueio de servidor local no sandbox (EPERM), antes dos testes de UI; reexecução com permissão apropriada passou. Nenhum ajuste de produto para contornar esse bloqueio.

Commit local autorizado: **ef53ecf497a0968480880fddd496faa677da50aa**
Mensagem: `feat: implementa visao geral executiva C3`. Árvore limpa após commit. Sem push/deploy. C4 e atualizações desta entrega permanecem sem commit.

## Funcionalidades e navegação

Quatro cards executivos, quatro conceitos financeiros EXT, filtros compartilhados, tabela de carteira com nove colunas, busca por cliente/contrato pela busca existente (também busca outros campos), ordenação antes da paginação, tamanhos 10/25/50 e empate determinístico por ID. Todos os contratos com chamados entram, inclusive aqueles sem Alto. Estado vazio e indisponíveis explícitos.

Colunas: contrato, cliente, chamados, custo estimado, SLA simulado, impacto Alto, proporção recorrente, pressão operacional e ação. Custo e recorrência exibem cobertura; SLA exibe cumpridos/elegíveis. Valores clicáveis levam a suas próprias listas de suporte; contrato/Analisar abre identificação e análise.

Aprofundamento: carteira → contrato → indicadores → equipamento → chamados → detalhe com contexto e Insight_ORQUESTRA. Fechar diálogos restaura contexto e foco. Detalhe de contrato inclui cliente, áreas e dados BASE disponíveis de tipo de unidade, unidade de negócio, supervisor e rota; vigência/valor/cobertura contratual são EXT. Sete indicadores, quatro cores, categorias, componentes, equipamentos, fatores completos e insights fornecidos. Não foi criada página de Equipamentos nem CRUD contratual.

Ordenação/tamanho/página da carteira ficam em memória no ConsultationProvider, ao lado do estado de consulta existente. Filtros/busca são os mesmos das entregas anteriores; nenhuma seleção paralela do histórico. Alterar filtros/busca volta à primeira página de contratos; limpar/logout reseta também a carteira; refresh restaura padrões. Navegar entre Visão Geral, Contratos & Margem e Chamados mantém filtros e busca. A seleção de detalhe é local à página; mudar de página fecha o detalhe.

## Indicadores e regras

Fonte exclusiva HIST_60_DIAS, 736 registros, 46 campos. Referência fixa 06/10/2026 22h, São Paulo. Período completo 08/08–06/10 inclusivos, por Criado em. Snapshots e fixtures do Supervisor não entram.

| Indicador completo | Regra | Resultado |
| --- | --- | --- |
| Contratos com chamados | Contrato distinto não ausente, sem afirmar vigência | 12 |
| Custo operacional estimado | estimatedCost da C3; soma finita não negativa, todos os status | R$ 696.734,60; 736/736 válidos |
| Contratos sob pressão | riskAnalysis C2; Contrato distinto entre registros Alto | 12; 351 registros Alto |
| Recorrência operacional | Registros com Recorrencia_30d finita >0 / todos do recorte | 412/736 = 56,0%; cobertura 736/736 |
| SLA por contrato | adherence C1; concluídos, SLA_min >0, consumo válido; <=1 cumpre | Total conciliado 665/724; não média de percentuais |
| TA/TB por contrato | average C1/C1.1, materializados não negativos, zero válido, N independente | Minutos; nulos excluídos |

Recorrência usa um único helper novo, compartilhado entre carteira, contratos, categorias, componentes e equipamentos. Não soma o campo como eventos únicos nem recalcula a janela materializada de 30 dias. Denominador = todos os chamados filtrados; ausentes e inválidos não satisfazem >0 e têm cobertura/exclusões explícitas. Sem população ou sem qualquer valor válido: indisponível; todos os valores válidos zero: 0%.

Pressão usa a presença de Alto aprovada, sem novas faixas de risco ou pesos: algum Alto → “Sob pressão”; nenhum Alto com cobertura completa → “Sem impacto Alto no recorte”. Cobertura parcial/ausente é explicitada; não certifica ausência de risco. Todos os 12 contratos têm Alto nos 60 dias; não é ranking de margem. Contratos sem identificador ficam fora da contagem de entidades, mas seus registros permanecem no total/custo geral, com quantidade sem contrato explícita.

Custos não são despesas comprovadas ou TCO. Ausentes não viram zero; sem custos válidos, indisponível. Somente apresentação arredonda. TA/TB/SLA/criticidade e regras geradoras preservadas. Laranja continua janela de intervenção; cores fornecidas não são derivadas de SLA.

## Gráficos, análise técnica e explicabilidade

Seis painéis: custo por contrato, volume por contrato, SLA por contrato, proporção recorrente por categoria/componente, volume diário e custo diário. Barras com valor textual e ação acessível por teclado, listas internas roláveis, todos os grupos disponíveis. Séries diárias reutilizam ExecutiveChart e dailyEvolution; volume e reais ficam em gráficos separados, dias sem custo têm lacuna. Máximo 60 dias, sem série mensal ou base comparativa inventada. Todas as séries usam a população antes de paginar.

Cada painel/coluna numérica possui explicação por botão, com fórmula, campos, população, período, unidade, nulos, fonte/hash e BASE/CALC/EXT. São 22 explicações na página principal: 4 cards, 4 EXT, carteira, 6 definições de coluna, 6 gráficos e insights. Detalhe acrescenta explicações com N do contrato ou equipamento e filtro contextual explícito. Textos BASE e campos de identificação são identificados como fornecidos.

Insight ORQUESTRA apresenta contagens observadas e sugestões de revisão de pressão, repetição e motivo predominante com seus registros de suporte. No contrato, textos sintéticos originais são agrupados e abrem suas evidências. Associações históricas não comprovam causa; não há ML validado ou desvio de meta declarado.

Receita contratada, margem operacional, rentabilidade e TCO completo permanecem **EXT — integração externa pendente**, sem número, variação, conexão ou sincronização simulados. Explicações identificam fontes financeiras/contábeis necessárias. Vigência, valor e cobertura contratual também são EXT.

## Arquivos

Criados:
- src/platform/services/contratos.js: composição, proporção de recorrência, carteira e metadados.
- src/platform/pages/ContratosPage.jsx e ContratosPage.module.css: página/detalhes e estilos isolados.
- src/platform/components/GroupChart.jsx: barras acessíveis reutilizáveis para agrupamentos; ExecutiveChart existente reutilizado nas séries temporais.
- tests/contratos-service.test.mjs e contratos-browser.test.mjs.
- Este relatório e evidências C4.

Modificados:
- src/platform/BackofficePlatform.jsx: conectar uma única nova página à rota existente.
- src/platform/filters/ConsultationContext.jsx: estado de apresentação da carteira em memória; filtros/seletores existentes preservados.
- tests/platform-shell.test.mjs: reconhecer cinco páginas funcionais/sete destinos pendentes, ainda verificando os 12 menus.
- docs/CONTINUIDADE_CODEX.md, docs/README.md, docs/produto/backlog.md, plano-incremental.md, cobertura-telas.md, explicabilidade-ext.md, docs/dados/dicionario.md e tests/README.md: estado, regras, validação e aceite.

## Testes e validação visual

**164 testes distintos aprovados = 155 Node/browser +9 Python**, incluindo os 139 anteriores e 25 novos C4 (16 serviço +9 navegador). Suíte completa sem falhas. Após ajuste visual da faixa EXT do detalhe e explicações contextuais, novo build e os 25 C4 passaram novamente; reexecuções não são somadas ao total.

Cobertura nova: distintos, soma/cobertura, Alto/sem Alto/informação ausente, recorrência e denominador/nulos, SLA por contrato, zeros/ausentes/TA/TB, carteira vazia, ID ausente, ordenação numérica/desempate/paginação, busca cliente/contrato, AND/OR e filtros compartilhados, conciliação de gráficos/tempo, agrupamentos, contrato/equipamento/chamado/retorno, finanças EXT, 22 explicações com teclado, notebook/móvel, consulta offline após carregamento e imutabilidade.

Uma falha inicial do teste de navegação lia a tabela antes de a rota renderizar. Corrigida a espera pela tabela, mantendo a comparação integral das linhas e do estado da paginação. Um recorte de teste serviço com busca “porta” não tinha registros; substituído por termo da área para garantir caso combinado não vazio. Nenhuma expectativa de cálculo foi relaxada.

Build final aprovado em /tmp/orquestra-c4-final/dist, base /OrquestraNEXT. Capturas finais inspecionadas: 1366×768 com os quatro cards e contexto financeiro acima da dobra; 390×844 sem overflow do documento ou diálogo; tabelas com rolagem interna. Detalhe usa progressão/rolagem. Não é auditoria integral cross-browser/acessibilidade.

Regressão preservada: dez hashes diretos/refresh, teclado/extremos, Smart Fit Normal→Média→Alta, hospital crítico por contexto humano, alertas, subida/temporizadores, saída antes dos timers/revisita, detalhes, FLIP/movimento reduzido, acesso padrão à apresentação, login/saída e páginas B/C1/C2/C3.

Comparação com ef53ecf: nenhuma diferença em App/main, src/views/components/styles/scenes legados, src/data, scripts, datasets, referencias, package/lock ou configuração Vite. SHA256 XLSX: 1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe. Importador --check aprovado sem gravar dados. Nenhuma dependência instalada.

Evidências:
- [Referência C3: testes](evidencias/c4-reference-tests.txt), [Python](evidencias/c4-reference-python.txt), [build](evidencias/c4-reference-build.txt).
- [Regressão completa 155 Node/browser](evidencias/entrega-c4-regression.txt).
- [25 C4 no build final](evidencias/entrega-c4-tests.txt).
- [9 Python](evidencias/entrega-c4-python.txt), [importação --check](evidencias/entrega-c4-import.txt), [build final](evidencias/entrega-c4-build.txt).
- [Notebook](evidencias/entrega-c4-contratos-desktop.png), [análises](evidencias/entrega-c4-contratos-analises.png), [detalhe](evidencias/entrega-c4-contratos-detalhe.png), [móvel](evidencias/entrega-c4-contratos-mobile.png).

## Backlog, limites e próxima entrega

US13 parcialmente entregue: Contratos & Margem consultável; Custos/TCO e Contratos — BackOffice continuam pendentes. US05 atendida nos indicadores desta entrega; US07 agora cinco páginas funcionais/sete destinos pendentes. US08/09 reutilizadas; US01/15/16 revalidadas no escopo dos testes. US12 recebe agrupamentos dentro do detalhe, não implementação de Técnicos/Equipamentos como páginas.

Limites: massa sintética e custos estimados; sem vigência, receita, margem, rentabilidade ou cobertura contratual real; proxy Alto não mede saúde financeira. Definições oficiais OTIS/pausas/SLA restante continuam pendentes. Campo de recorrência preservado, sem regra geradora reconstituída. Filtros/ordenação em memória; sem autenticação corporativa nem primeiro acesso offline garantido. Aviso preexistente de chunk >500 kB permanece no build, sem silenciar ou instalar dependências; avaliar particionamento como escopo próprio.

C4 aguarda homologação final do usuário. Próxima sugestão, somente após novo escopo autorizado: Custos / TCO, reaproveitando custo estimado e mantendo TCO contábil EXT. Sem commit C4, push ou deploy. Nenhuma próxima página autorizada por este relatório.
