# C7 — Técnicos — Capacidade e Performance Operacional

Atualização de aceite em 15/10/2026: C7 testada visualmente pelo usuário após recuperação da inicialização e homologada para continuidade; rotina de continuidade também homologada. Revalidação 262 testes/build e revisão dos48 arquivos aprovadas. Commit local autorizado a5aea32e828d0258a9700c6eef0c4682a05ffe12 — feat: implementa gestao analitica de tecnicos C7, incluindo correção e rotina homologadas. Sem push/deploy. C8 implementada depois desse marco, aguardando homologação; [estado atual](../CONTINUIDADE_CODEX.md). O restante do relatório preserva os critérios/evidências do encerramento técnico C7.

## Referência Git e homologação C6

Branch feature/next-evolucao. Antes da C7: revisão de todos os 34 arquivos C6 (15 modificados, 19 não rastreados), tipos, diffs, evidências e busca de padrões de segredos; nenhum arquivo temporário/credencial identificado. Supervisor, dez cenas, dados, importador, dependências e dataset sem diferenças; hash XLSX preservado. Nada previamente staged.

Revalidação: 216 Node/browser +9 Python =225 testes distintos aprovados e build de produção aprovado. A primeira tentativa sem permissão para portas falhou no ambiente (EPERM); execução no ambiente com previews locais/Chrome passou sem alteração do produto. Staging somente dos 34 arquivos revisados, stat e cached --check aprovados.

Commit local autorizado **05ec7d57697418c2d06970b26ca515aab73b8a63** — `feat: implementa inteligencia de equipamentos C6`. Árvore limpa após commit. Sem push/deploy. Documentação anterior contida no commit retrata o encerramento pré-homologação; este relatório e a continuidade atual registram a aprovação posterior.

## Funcionalidades e navegação

Página /OrquestraNEXT/?modo=plataforma#/tecnicos, shell original, identidade T08 (referencias/telas/8_Pagina_Tecnicos.png), com seis indicadores CALC e disponibilidade EXT. Sem copiar números, ranking de produtividade, disponibilidade, status de força de trabalho ou comparativos sem fonte da referência visual.

Carteira com técnico, todos os vínculos observados de Área/Supervisor/Rota (recolhíveis), chamados vinculados/concluídos, TA/TB com N/cobertura/ausências, criticidade elevada Laranja/Vermelho histórica, custo estimado associado e detalhe. Ordenação antes da paginação 10/25/50, desempate por nome, nulos no fim, estado em memória compartilhado. Busca normalizada da consulta existente. Voltar de página preserva ordem/página/tamanho; filtros/busca retornam à página 1; limpar/logout reinicia; refresh restaura padrões.

Gráficos: status histórico, chamados por técnico, TA e TB médios por técnico, áreas, rotas, supervisores, quatro criticidades e custos dos atendimentos vinculados por técnico. TA/TB mostram N/cobertura também na lista de apoio; comparações exigem contexto de complexidade, área, rota e categoria, sem classificar eficiência individual. Operação na referência e SLA excedido/recorrências têm suporte explícito.

Fluxos: Visão Geral → menu Técnicos → Área/Rota/Supervisor → Técnico → Atendimentos → Equipamento → Histórico → Chamado → Insight. Os diálogos anteriores permanecem montados; fechamento retorna ao contexto. Detalhe do chamado reutilizado com callback opcional de equipamento exclusivo da C7. Histórico da unidade usa serviço C6 e recorte global filtrado, podendo incluir outros técnicos; essa ampliação de população é identificada na tela, mantendo os filtros globais. Não há ligação fictícia com Supervisor.

Detalhe: identificação e vínculos BASE, clientes/contratos, totais/concluídos, TA/TB, SLA simulado, status e criticidade históricos e ainda não concluídos, custos total/médio/recorrentes, equipamentos atendidos, categorias/componentes/falhas, recorrências e insights completos BASE com chamados de suporte. Não atribui recorrência/causa ao trabalhador.

## Fonte, indicadores e regras

Fonte exclusiva HIST_60_DIAS, 736 registros sintéticos/46 campos; criação 08/08–06/10/2026, referência fixa 06/10/2026 às 22h São Paulo. Snapshots/fixtures não utilizados. Datasets imutáveis e nenhuma fórmula geradora reinventada.

| Indicador no recorte completo | Regra | Resultado |
| --- | --- | --- |
| Técnicos com Atendimentos | Técnico distinto identificado | 16 |
| Chamados Vinculados | Registros com Técnico não nulo/vazio/apenas espaços | 736/736; 0 sem técnico |
| Atendimentos Concluídos | Vinculados com Status Concluído | 724/736 |
| TA médio | average C1: finito não negativo, zero válido | 35,4 min; N728/736, 8 ausentes/inválidos |
| TB médio | average C1: finito não negativo, zero válido | 49,2 min; N724/736, 12 ausentes/inválidos |
| Custo Operacional Estimado Associado | estimatedCost C3 dos vinculados | R$ 696.734,60; N736/736 |
| Técnicos Disponíveis | Ausência de fonte confiável | EXT, sem número |

TA = chegada menos abertura; TB = encerramento técnico simulado menos chegada; saída inclui permanência adicional, encerramento não persistido. Não reconstruído. Tempos e custos são da operação sintética, não avaliação individual, salário, remuneração, custo real de mão de obra ou rentabilidade profissional.

SLA C1: concluídos com SLA_min finito >0 e Percentual_SLA finito >=0; cumpre <=1; 665/724=91,9%, 59 acima. Criticidade BASE independente do SLA: 253 Verde/345 Amarelo/72 Laranja/66 Vermelho; 138 Laranja/Vermelho históricos, 1 ainda não concluído na referência entre 12 não concluídos. Status BASE: 2 Aberto/2 Contactado/4 Técnico a caminho/4 Em atendimento/724 Concluído. Não tempo real.

7 áreas, 16 rotas e 7 supervisores observados; múltiplos vínculos preservados. Custo médio R$ 946,65/N736; custo dos 412 chamados com recorrência positiva R$ 401.718,00; não parcela adicional nem culpa individual. Recorrência >0/total e >=3 mantêm regras C4/C2, sem soma de eventos. Nulos/inválidos não viram zero; sem elegíveis média/custo/SLA indisponível.

## Filtros e explicabilidade

Infraestrutura B ampliada, sem novo mecanismo: Técnico/Supervisor preparados promovidos e Rota acrescentada em Mais filtros, total 13 filtros incluindo período. AND entre campos, OR interno; busca por palavras AND sem caixa/acentos inclui Rota. Mantidos Unidade/Componente/Categoria/Recorrência e os filtros anteriores. Chips/remover/limpar/vazio, sincronização de cards/gráficos/tabela antes da paginação e contexto entre todas as páginas.

Explicações acessíveis por botão/teclado, com definição, campos, regra, população, período, unidade, elegibilidade/N, ausências, filtros e proveniência/hash BASE/CALC/EXT. Aprofundamentos identificam vínculos únicos no contexto. Campos do histórico BASE; médias/contagens/agrupamentos CALC. Disponibilidade e demais fontes externas sem valor simulado e não conectadas.

EXT: disponibilidade/capacidade para novos chamados; jornada/escala/agenda/horas trabalhadas; localização real; skills/certificações/treinamentos/habilitações; custo real de mão de obra/avaliações oficiais. Fonte responsável indicada em cada explicação. Não inferir disponibilidade pela ausência de chamados em andamento. Não há despacho, gestão de pessoal, escala ou julgamento automatizado implementados.

## Arquivos

Criados: src/platform/services/tecnicos.js; src/platform/pages/TecnicosPage.jsx; TecnicosPage.module.css; tests/tecnicos-service.test.mjs; tecnicos-browser.test.mjs; este relatório e evidências C7.

Modificados: BackofficePlatform.jsx (rota/indicador funcional); navigation.js (descrição); ConsultationContext.jsx (carteira em memória/reset); chamados.js (três filtros/Rota na busca); ChamadoDetail.jsx (callback opcional de equipamento sem mudança para outros consumidores); platform-shell.test.mjs (oitava página funcional); documentação de continuidade/backlog/plano/cobertura/explicabilidade/dicionário/README de docs e testes.

Reutilizados: FilterBar/KpiCard/IndicatorInfo/Dialog/Pagination/EmptyState/CriticalityBadge, DataTable, GroupChart, RecordExplorer, ExternalMetric, ChamadoDetail; average/adherence/groupRecords C1, risco C2, custo C3, contractMetrics/contractPage/recorrência C4, equipmentAnalysis C6. CSS C7 isolado, reaproveitando estilos C6 por importação sem alterar C6.

## Validação e evidências

30 novos testes (21 serviço +9 navegador). Total final: 255 testes distintos aprovados =246 Node/browser +9 Python, incluindo os 225 anteriores. Build e importador --check aprovados. Logs e capturas permanentes em evidencias/entrega-c7-*. Testes Python e importador não alteram a fonte. Nenhuma dependência instalada.

Cobertura: contagem/distintos/cobertura, concluídos/status, TA/TB/N/nulos/zero/inválidos, custo total/médio/recorrente, SLA aprovado, áreas/rotas/supervisores, vínculos múltiplos, criticidade histórica/referência, filtros cumulativos AND/OR, busca normalizada/Rota, ordenação antes da página/nulos/desempate, tamanho/retorno, detalhe/navegação completa/chamados/equipamento/histórico/insight, todos campos EXT, explicações por teclado, vazio, offline após carregar, notebook/móvel/ausência de overflow/erros JS e imutabilidade.

Capturas inspecionadas: [notebook 1366×768](evidencias/entrega-c7-tecnicos-desktop.png), [carteira](evidencias/entrega-c7-tecnicos-carteira.png), [análises](evidencias/entrega-c7-tecnicos-analises.png), [detalhe](evidencias/entrega-c7-tecnicos-detalhe.png), [equipamento/histórico](evidencias/entrega-c7-tecnicos-equipamento.png), [móvel 390×844](evidencias/entrega-c7-tecnicos-mobile.png). Seis cards CALC +EXT em duas linhas no notebook; tabelas/gráficos/listas com rolagem interna; detalhes progressivos. Não auditoria completa de acessibilidade/cross-browser.

Regressão inclui oito páginas funcionais/12 menus, login/refresh/saída/filtros/contexto, dez hashes/cenas, Supervisor Smart Fit Normal→Média→Alta, hospital/contexto humano sem SLA inventado, alertas/modais/FLIP/teclado/movimento reduzido/temporizadores/saída/revisita. Comparação com 05ec7d5 sem diferenças em src/views, src/scenes, src/components, src/styles, src/data, scripts, datasets, referencias, App/main/configuração de cenas, package/lock/Vite.

Hash XLSX: 1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe. Aviso preexistente de bundle >500 kB mantido (~1.304 kB minificado/121,5 kB gzip na plataforma C7); particionamento exige escopo próprio. Primeiro acesso offline não garantido/sem service worker, login demo/filtros em memória. Nenhuma regra oficial OTIS/ML/causalidade ou cadastro real inferidos.

## Backlog e encerramento

US12 cobre Técnicos e Equipamentos; nenhuma história duplicada necessária. US12 implementada no escopo de consulta histórica (C6 aprovada para continuidade, C7 aguarda visual). US05/08/09 ampliadas/reutilizadas; US07 oito páginas funcionais/quatro pendentes; US01/15/16 revalidadas. Total continua 19 histórias; US18-A/B são partes de US18.

Próxima entrega recomendada e planejada pelo usuário: C8 — Peças e Componentes (US18-A), somente após homologação C7 e autorização específica; distinguir componente associado de consumo/estoque/logística EXT. Depois Modo Feira/US14 com evolução temporal de dados, pausa/retomada/reinício; sem autoplay de cenas, sem motor iniciado. US19 ponte Supervisor continua pendente. Nenhuma próxima página iniciada. Aguardar homologação C7; não criar commit C7 sem autorização.
