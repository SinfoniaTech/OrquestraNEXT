# C3 — Visão Geral Executiva / Performance Operacional & Financeira

15/10/2026. Implementação autorizada após o registro permanente das entregas até C2. Rota /OrquestraNEXT/?modo=plataforma#/visao-geral, primeira página após acesso demonstrativo. Menu permanece Visão Geral. Apresentação original continua entrada padrão sem modo=plataforma.

## Fase 1 — referência Git concluída

Branch feature/next-evolucao confirmada. Revisados App.jsx modificado da A e 115 arquivos novos: docs 73, scripts 1, src/data 7, src/platform 19 e tests 15. Staging restrito a esses 116 arquivos; nenhum tipo inesperado ou indício de segredo nos padrões examinados. Evidências de teste/imagens foram mantidas intencionalmente, não são arquivos temporários acidentais. Planilha, Supervisor, cenas e dependências sem alterações.

git diff --cached --stat e --check examinados. Quatro logs de build tinham espaços finais; removidos somente esses espaços para passar no check. Antes do commit: build aprovado e 117 testes (108 Node/browser +9 Python) aprovados novamente.

Commit local autorizado: **03d8cedb20cc0754cbe07c01c08e0e62c688a428**
Mensagem: feat: consolida novo BackOffice até C2 e testes de regressão.
Árvore limpa após commit. Nenhum push ou deploy. O commit contém somente as entregas até C2, não a C3. Logs dessa verificação preservados abaixo.

## Fase 2 — funcionalidades

Seis cards executivos imediatamente visíveis em 1366×768, filtros compartilhados, faixa financeira EXT compacta, cinco contratos em destaque/lista completa, três gráficos diários e observações explicáveis com aprofundamento até chamado.

Consulta exclusiva HIST_60_DIAS, período 08/08–06/10/2026, referência 06/10/2026 22h America/Sao_Paulo. Os oito filtros, AND/OR, chips, busca com acentos/caixa e limpeza são os existentes. Mesma população inicial filtrada; elegibilidade própria identificada em cada indicador. Navegação entre quatro páginas preserva filtros e ordenação; lista/detalhe preservam contexto e paginação do aprofundamento.

### Indicadores e fontes

| Indicador | Campos/regras | Resultado completo |
| --- | --- | --- |
| Contratos com chamados | Contrato distinto não ausente; não vigência | 12 |
| Aderência ao SLA simulada | adherence da C1, concluídos com SLA_min >0 e consumo válido; <=1 cumpre | 665/724 = 91,9% |
| Custo estimado no período | Soma válida Custo_Estimado_R$, todos os status | R$ 696.734,60; cobertura 736/736 |
| Contratos sob pressão | Regra C2, Contrato distinto entre registros Impacto_Contrato Alto | 12, com 351 eventos Alto |
| Críticos no histórico | Criticidade_ORQUESTRA Vermelho, inclui concluídos | 66 |
| Prioridades ativas | Não concluído e Laranja/Vermelho na referência | 1, entre 12 não concluídos |

Custo: finito não negativo; zero informado é válido, nulo/inválido não vira zero. Sem elegíveis, —, não custo zero. Não arredondar origem; somente apresentação em R$ com duas casas. Custos sintéticos não são despesas comprovadas, competência contábil ou TCO.

Receita, Margem e TCO contábil: EXT, integração pendente, sem valores, fonte necessária descrita, não conectada/sem sincronização. O recorte de chamados contextualiza a explicação, não é cobertura financeira.

### Contratos sob pressão

Selecionar contratos com algum evento Alto, usando a regra da C2. Ordenar por N Alto decrescente e identificador crescente. Até cinco inicialmente, lista completa disponível. Indicadores de total/custo/SLA/Vermelhos usam **todos os chamados filtrados daquele contrato**; N Alto e dois motivos completos mais frequentes usam somente eventos Alto.

Primeiros contratos do recorte: CT-2026-007, 011, 001, 005, 008. CT-2026-007 tem 61 eventos Alto em 90 chamados; custo com cobertura 90/90, SLA com denominador 88. Eventos Alto, custo, SLA, cor e contrato possuem listas de suporte próprias.

Motivo operacional e impacto são campos distintos: um evento Alto pode trazer motivo “operação dentro do esperado”. Preservamos essa combinação original e não inferimos peso, contradição corretiva ou causalidade. Sem receita/margem inferida.

### Gráficos e aprofundamento

Reutiliza dailyEvolution da C2 e adherence da C1:
- Custo por coorte de criação: soma válida diária, N válido/total, lacuna se não houver custo informado.
- SLA por coorte de criação: cumpridos/elegíveis de cada dia; sem elegíveis, lacuna; não média de percentuais diários nem resolução no dia.
- Criticidade por criação: quatro cores materializadas, incluindo concluídos; dias sem chamados têm contagem zero; não transição individual ou previsão.

Somente dias do recorte (máximo 60), sem extrapolação/comparação com períodos indisponíveis. Gráficos separados por unidade e com botões diários acessíveis para suporte/contagem exata. Escalas monetárias usam k = mil reais.

Observações: prioridades na referência, recorrência elevada e motivo completo mais frequente. Sem meta/plano ou comparação aprovada não se afirma desvio. Sugestões não são modelos ML nem causalidade. ChamadoDetail mantém definições TA/TB e proteção temporal da C1.1.

Catorze explicações: seis cards CALC, três itens EXT e cinco painéis (contratos, três gráficos, observações). Cada explicação identifica fonte/campos/regra/população/período/unidade/nulos e classificação. Detalhes materializados continuam BASE.

## Arquivos criados

- src/platform/services/performance.js — composição dos serviços aprovados e agregação de custo.
- src/platform/pages/PerformancePage.jsx — síntese executiva/contratos/aprofundamentos.
- src/platform/pages/PerformancePage.module.css — estilos isolados.
- src/platform/components/ExecutiveChart.jsx — gráfico reutilizável com lacunas e suporte diário.
- src/platform/components/ExternalMetric.jsx e ExternalMetric.module.css — apresentação compacta EXT.
- tests/performance-service.test.mjs e performance-browser.test.mjs.
- docs/produto/entrega-c3-performance.md e evidências C3.

## Arquivos modificados na C3

- src/platform/BackofficePlatform.jsx — conexão da página, título e quatro rotas funcionais.
- src/platform/navigation.js — título executivo mantendo nome/endereço do menu.
- tests/platform-shell.test.mjs — mantém verificação de doze menus; quatro funcionais/oito pendentes; novo título da Visão Geral.
- docs/produto/backlog.md, explicabilidade-ext.md e cobertura-telas.md.
- docs/dados/dicionario.md; docs/preservacao/recuperacao.md; docs/README.md; tests/README.md.

Nenhuma edição na C3 de App.jsx, serviços de regras existentes, filtros, Chamados/SLA/Riscos, Supervisor/cenas/CSS legado, importador ou dados. Reutilizados ConsultationContext/FilterBar/KpiCard/IndicatorInfo/RecordExplorer/ChamadoDetail/Dialog e serviços adherence/riskAnalysis/dailyEvolution/groupRecords/distinct/validNumber, sem camada de filtros paralela.

## Testes e verificação visual

**139 testes distintos aprovados**: 130 Node/browser e 9 Python. Inclui os 117 anteriores e 22 novos (14 serviço +8 navegador), sem dupla contagem das reexecuções.

Novos: reconciliação; custo/nulos/zeros/cobertura; elegibilidade SLA; seleção/top cinco/lista completa; desempate determinístico; Alto versus todos os registros; custos e SLA por dia; lacunas; limites São Paulo; filtros AND/OR/busca; quatro páginas; detalhamento e retorno à mesma página; vazio; 14 explicações; EXT; offline após carregamento; notebook/móvel e imutabilidade. Após ajuste visual de altura dos cards, os 22 testes C3 foram reexecutados no build final, todos aprovados.

Suíte anterior aprovada: dez cenas, entrada padrão, Supervisor, alertas, animações FLIP/movimento reduzido, temporizadores, teclado, detalhes, dados, snapshots, proteção temporal e páginas anteriores. Comparação com referência Git sem diferenças em App.jsx, src/views, src/components/styles/scenes legados, src/data, scripts, dataset/referências e configurações/dependências.

Build aprovado, /tmp/orquestra-c3/dist, base /OrquestraNEXT. Em 1366×768, seis cards acima da dobra; tabela/gráficos complementares por rolagem, texto legível. Móvel 390×844 sem overflow horizontal do documento; tabelas possuem rolagem interna. Capturas inspecionadas visualmente. Não equivale a auditoria de acessibilidade/cross-browser completa.

Planilha SHA256 preservado: 1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe.

### Evidências

- [Pré-commit: testes Node/browser](evidencias/c3-reference-tests.txt)
- [Pré-commit: Python](evidencias/c3-reference-import.txt)
- [Pré-commit: build](evidencias/c3-reference-build.txt)
- [Suíte C3 e regressão — 130 Node/browser](evidencias/entrega-c3-regression.txt)
- [22 novos, reexecução após revisão visual](evidencias/entrega-c3-tests.txt)
- [9 Python](evidencias/entrega-c3-import.txt)
- [Build C3](evidencias/entrega-c3-build.txt)
- [Notebook](evidencias/entrega-c3-performance-desktop.png)
- [Análises de 60 dias](evidencias/entrega-c3-performance-analises.png)
- [Móvel](evidencias/entrega-c3-performance-mobile.png)

## User Stories, limites e próximo gate

US10 parcialmente entregue: Visão Geral implementada, Padrões & Insights ainda pendente. US05/07 avançam; US08/09 reutilizadas; US01/15/16 revalidadas. US13 recebe suporte EXT/custo, não implementação de outras páginas. Quatro páginas funcionais, oito menus pendentes.

Sem pendência funcional conhecida no escopo aprovado, sujeito à homologação do usuário. Permanecem limites: massa sintética, conceitos oficiais OTIS/SLA restante pendentes; ausência financeira EXT; sem metas ou causalidade; nenhum service worker para primeiro acesso offline; filtros em memória restaurados no refresh. Aviso preexistente de chunk >500 kB continua (~1.208 kB minificado /100,5 kB gzip da plataforma opt-in), avaliar particionamento em etapa própria.

Referência até C2 permanentemente registrada no commit local autorizado, sem push. C3 e seus documentos/evidências permanecem sem commit por instrução do usuário. Nenhum novo commit, deploy ou outra página após implementação.

Recomendação: homologar a Visão Geral Executiva. Depois definir escopo de Contratos & Margem (consulta operacional e lacunas EXT) ou outra prioridade do backlog, com aprovação específica. Não iniciar antes da homologação.
