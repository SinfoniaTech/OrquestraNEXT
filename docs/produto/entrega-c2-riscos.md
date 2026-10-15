# Entrega C2 — Riscos & Tendências

15/10/2026. C2 autorizada após C1.1. Implementação local para homologação, sem commit, deploy, instalação ou alteração de dados. URL: /OrquestraNEXT/?modo=plataforma#/riscos-tendencias.

## Resultado funcional e regras

Fonte exclusiva HIST_60_DIAS, referência 06/10/2026 às 22h America/Sao_Paulo. Oito filtros/AND/OR, chips, limpeza, busca sem caixa/acentos e relógio simulado reutilizados de ConsultationContext/serviços existentes. Nenhuma nova importação ou camada de filtros. Filtros/busca/ordem preservados entre Riscos, Chamados e SLA; detalhe retorna ao aprofundamento com sua página preservada.

| Card | Regra | Resultado em 60 dias |
| --- | --- | --- |
| Ocorrências Críticas — Histórico | Criticidade_ORQUESTRA = Vermelho, todos os status | 66 |
| Ocorrências em Laranja — Histórico | Criticidade_ORQUESTRA = Laranja, todos os status | 72 |
| Equipamentos com Recorrência Elevada | Unidade distinta não ausente em registros com Recorrencia_30d >=3 | 19 unidades / 106 registros de suporte |
| Contratos sob Pressão Operacional | Contrato distinto não ausente em registros com Impacto_Contrato = Alto | 12 contratos / 351 registros de suporte |
| Ocorrências Ativas Prioritárias | Status diferente de Concluído e Laranja/Vermelho | 1, entre 12 não concluídos |

Card ativo possui identificação visual “NA REFERÊNCIA”; históricos incluem concluídos. Pressão operacional não significa margem negativa. Recorrências não são somadas como chamados adicionais. Nulos não viram zero/entidade; chave ausente fica fora de distintos.

## Análises, aprofundamento e explicabilidade

- Distribuição Verde/Amarelo/Laranja/Vermelho: 253/345/72/66, participação no total filtrado.
- Evolução diária: até 60 dias civis inclusivos, contagem por Criado em e cor registrada, incluindo dias sem chamados com zero. Total e quatro séries; botões diários oferecem contagem/lista acessível. Não é série de seis meses, previsão nem histórico de transições de um mesmo chamado.
- Áreas: contagem por cor e proporção Laranja+Vermelho sobre o total da própria área. Células e áreas abrem registros de suporte.
- Recorrência: agrupamento selecionável por Unidade, Componente Principal ou Categoria do Chamado, somente registros com campo >=3, quantidade de chamados e unidades distintas.
- Contratos: registros com impacto Alto, agrupados por Contrato.
- Motivos: texto completo de Motivo_Criticidade; motivos compostos não são divididos em causas; ranking por frequência, empate por texto.
- Sugestões demonstrativas: revisar prioridades ativas; investigar janela Laranja histórica; examinar repetição; revisar impacto operacional dos contratos. Cada regra identifica observação, sugestão e registros de suporte. Grupos se sobrepõem, não somar. Exemplo BASE identifica o primeiro registro e não alega representatividade; motivo/insight são os textos originais, com detalhe para categoria/componente/consumo/impacto/contexto.
- Tabela geral e listas de aprofundamento reutilizam DataTable, sortRecords e Pagination: ordenação antes da página, tamanhos 10/25/50, detalhe compartilhado.

Cinco cards e sete painéis têm explicações CALC, totalizando doze: definição, campos, regra, população, período, unidade, nulos, referência/hash da fonte e filtros. Dados de suporte são BASE. Não foram criadas métricas externas que exigissem número EXT; receita/margem/estoque continuam indisponíveis nas páginas ainda pendentes.

Laranja é janela de intervenção, mantendo apoio em todas as cores, inclusive Vermelho. Nenhum algoritmo novo de criticidade, transição obrigatória de cores, causalidade ou modelo de ML é afirmado.

## Arquivos

Criados:
- src/platform/services/riscos.js — agregações, evolução e sugestões demonstrativas.
- src/platform/components/RecordExplorer.jsx — composição reutilizável de tabela, ordem e paginação.
- src/platform/pages/RiscosPage.jsx — página e aprofundamentos.
- src/platform/pages/RiscosPage.module.css — estilos isolados.
- tests/riscos-service.test.mjs — 13 testes.
- tests/riscos-browser.test.mjs — 7 testes.
- docs/produto/entrega-c2-riscos.md e evidências C2.

Modificados:
- src/platform/BackofficePlatform.jsx — terceira página funcional.
- tests/platform-shell.test.mjs — terceira página funcional na verificação dos 12 menus; nove destinos continuam pendentes.
- docs/produto/backlog.md, explicabilidade-ext.md, cobertura-telas.md, pendencias.md.
- docs/README.md e tests/README.md.

Nenhuma outra página foi implementada/refatorada; não foram editados serviços de filtros, sla.js, TA/TB ou dados. App.jsx é alteração anterior da A, sem edição nesta entrega.

## Testes e preservação

**117 testes distintos aprovados, zero falhas finais:** 20 novos C2 (13 serviço + 7 navegador) e os 97 anteriores (88 Node/browser + 9 Python).

Novos cobrem contagem Vermelho/Laranja; histórico versus ativo; distintos de unidades/contratos; áreas; evolução diária/limites locais; recorrência por três dimensões; motivos compostos; filtros cumulativos; coerência; vazio/nulos; metadados; regras demonstrativas; ordenação/paginação; detalhe/retorno; filtros entre três páginas; 12 explicações com Escape; notebook 1366×768, móvel 390×844, offline após carregamento e ausência de erros JS. Navegador de testes usa fuso Tokyo para verificar independência do relógio local. Na primeira execução, um caso novo herdava contrato não nulo da fixture-base; o caso de teste foi corrigido para representar chaves ausentes. Não se alteraram expectativas para ocultar defeito funcional.

Regressão anterior aprovada: Chamados, SLA, TA/TB, projeção temporal, menus, dez hashes/cenas, Supervisor, alertas, detalhes, teclado, animações FLIP/movimento reduzido, temporizadores e saída/reentrada. Build Vite aprovado em /tmp/orquestra-c2/dist com subdiretório /OrquestraNEXT. Importação Python validada sem editar a planilha.

Comparação Git com HEAD sem diferenças nos diretórios legados src/views, src/components, src/styles, src/scenes, scenes.config.js, main.jsx, package.json, lockfile, vite.config.js, datasets e referencias. git diff --check passou; nada staged. Planilha SHA256 intacta: 1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe.

Branch feature/next-evolucao, HEAD 43dd0283728d8c78ae9017ae5acae8a1cf3101d5. Continuam docs/, scripts/, src/data/, src/platform/ e tests/ não versionados e App.jsx modificado anteriormente. Os testes/evidências no diretório do projeto ainda precisam de commit autorizado para proteção permanente; /tmp não é backup permanente.

Evidências:
- [20 testes C2](evidencias/entrega-c2-tests.txt)
- [88 regressões Node/browser](evidencias/entrega-c2-regression.txt)
- [9 verificações Python](evidencias/entrega-c2-import.txt)
- [Build](evidencias/entrega-c2-build.txt)
- [Notebook](evidencias/entrega-c2-riscos-desktop.png)
- [Análises](evidencias/entrega-c2-riscos-analises.png)
- [Móvel](evidencias/entrega-c2-riscos-mobile.png)

## Limites e aceite

Escopo C2 implementado e testes aprovados; homologação visual do usuário pendente. Dados sintéticos não suportam conclusão estatística, predição validada ou prova de causalidade. Série diária descreve criação/classificação registrada, não evolução do estado individual. Todos os 12 contratos possuem ao menos um registro de impacto Alto neste recorte: o proxy não os discrimina por margem ou saúde financeira. Campo de recorrência é preservado, sua fórmula geradora não foi reinventada.

Snapshots e Supervisor não participam das análises. Sem SLA restante calculado. Aviso preexistente de tamanho do bundle permanece; considerar carregamento seletivo em escopo futuro. Offline somente após carregamento; refresh restaura filtros padrão, como nas entregas anteriores. Sem auditoria completa cross-browser/acessibilidade nem certificação visual integral do Supervisor.

Backlog atualizado: US11 cobre agora SLA e Riscos no escopo demonstrativo; US05/07 avançam para três páginas, US08/09 reutilizadas, US01/15/16 revalidadas. Nove destinos continuam em desenvolvimento.

Recomendação: homologar C2 e revisar/autorizar versionamento permanente. Depois, propor Visão Geral/Performance (US10) com indicadores já rastreáveis e escopo aprovado. Nenhuma outra funcionalidade iniciada; aguardar autorização.
