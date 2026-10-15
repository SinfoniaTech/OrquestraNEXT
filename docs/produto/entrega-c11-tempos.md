# C1.1 — formalização TA/TB e consistência temporal

15/10/2026. Implementação autorizada após diagnóstico aprovado e confirmação fornecida pelo usuário em nome do responsável pela geração. Definições exclusivas da massa sintética, sem confirmação oficial OTIS.

## Definições e rastreabilidade

TA — Tempo até a chegada (min): chegada ao edifício menos abertura.
TB — Tempo de resolução simulado (min): encerramento técnico simulado menos chegada.
Saída: encerramento técnico mais permanência adicional (3–10 min histórico, 5 min snapshots).
Encerramento técnico não foi persistido: nenhum campo, timestamp ou evento BASE foi criado para ele.

A confirmação de negócio vem do responsável via usuário; a evidência numérica vem de inspeção independente, não de acesso ao script gerador, que não foi localizado. TA coincide em 728/728 históricos, 2/2 T0, 9/9 T1 e 20/20 T2 comparáveis. Chegada→saída menos TB respeita 3–10 min nos 724 históricos e 5 min nos 2 T1/12 T2; T0 não possui TB informado. Essa comparação diagnostica consistência, não substitui os materializados.

Dicionário atualizado nas entradas TA/TB/Saída e com seção de evidências/proveniência. Registros antigos sobre unidade pendente descrevem etapas anteriores e são superados para a massa por esta confirmação; Q01/Q02 continuam para conceitos e contratos oficiais.

## Interface e indicadores

Rótulos padronizados nos cards da página SLA e no detalhe compartilhado de Chamados. Tooltips informam definições sintéticas, minutos e N válido por campo. Agrupamentos mostram médias em minutos. Aviso de SLA da simulação sem validade contratual oficial; prazo restante continua não calculado.

Mesmas funções de média, aderência e criticidade, sem alteração do serviço sla.js. TA médio 35,4 min / N=728; TB médio 49,2 min / N=724. Nulos excluídos das médias, não convertidos em zero; zero materializado válido continua elegível. Sem N válido, —.

Aderência preservada: 665 dentro e 59 acima entre 724 concluídos elegíveis, 91,9%. Faixas mantidas: 257/325/95/59. Criticidade histórica: 253/345/72/66; prioritários ativos: 1. Não se adotou a população da aba RESUMO_60_DIAS (677/736), que difere da regra já aprovada dos concluídos.

## Visibilidade temporal

Serviço puro projectSnapshot, sem motor Feira, reprodução ou mistura de fontes:
1. Antes da referência do snapshot, nenhuma linha/status/TA/TB é liberada.
2. Na referência ou depois, o snapshot conserva o conhecimento de sua própria referência.
3. Marco explícito <= referência: registrado; null: ausente; posterior: futuro, sem valor apresentado como realizado.
4. Avançar o relógio não confirma sozinho evento futuro do snapshot congelado. Uma nova evidência/estado é necessária.
5. Nenhum horário de encerramento técnico é reconstruído.
6. A fonte permanece imutável; somente a projeção de leitura oculta marcos futuros.

Detalhe histórico utiliza a mesma proteção eventAt para seus marcos, contra a referência histórica. Não há futuros nesse histórico atual. O detalhe continua sendo uma consulta de HIST_60_DIAS, não foi transformado em tela de snapshots. Futuro consumidor temporal deve utilizar projectSnapshot; a navegação/seleção temporal não foi implementada nesta etapa.

Casos verificados:
- T1, CH-20260908-006: saída 08:34, referência 08:30.
- T2, CH-20260908-017: saída 09:35, referência 09:30.

Essas saídas não aparecem como realizadas na projeção; os valores originais continuam intactos. Status Concluído pode coexistir com saída futura pois resolução e saída são marcos distintos; não se altera o status nem se inventa a hora de resolução.

## Arquivos criados

- src/platform/services/temporalDefinitions.js — catálogo compartilhado de rótulos/definições/aviso.
- src/platform/services/temporal.js — classificação de marcos e projeção de snapshots.
- tests/temporal-consistency.test.mjs — 10 testes novos.
- docs/produto/entrega-c11-tempos.md e evidências C1.1.

## Arquivos modificados

- src/platform/pages/SlaCriticidadePage.jsx — rótulos, tooltips, unidades e aviso sintético.
- src/platform/pages/ChamadoDetail.jsx — rótulos/unidades, aviso e proteção de marcos futuros.
- tests/sla-browser.test.mjs e tests/chamados-browser.test.mjs — seletores adaptados aos rótulos autorizados, sem remover verificações.
- docs/dados/dicionario.md.
- docs/produto/pendencias.md, backlog.md, modos.md, explicabilidade-ext.md.
- docs/README.md e tests/README.md.

Supervisor, cenas, CSS antigo, planilha, snapshots, JSONs de dados, importador e fórmulas da C1 não foram alterados. src/App.jsx permanece modificação da A, sem edição nesta etapa.

## Testes e evidências

**97 testes distintos aprovados, zero falhas:** 88 Node/browser (78 anteriores + 10 novos) e 9 Python existentes. Assim, os 87 anteriores continuam aprovados.

Novos testes: correspondência TA por fonte; permanência adicional versus TB; ordem dos marcos e nulos; ausência versus futuro; identificação das duas saídas; projeção sem mutação ou campo técnico inventado; gate temporal; limite inclusivo; relógio sem confirmação artificial; reconciliação dos indicadores.

Regressões: Chamados/filtros/detalhes, SLA/explicações/drill-down, menus, offline após carregamento, limites/fuso Tokyo, notebook/móvel, dez cenas, Supervisor, alertas, temporizadores, animações e navegação. Build aprovado em /tmp/orquestra-c11/dist para /OrquestraNEXT. Inspeção visual notebook aprovada tecnicamente; homologação do usuário pendente.

- [88 testes Node/browser](evidencias/entrega-c11-tests.txt)
- [9 testes Python](evidencias/entrega-c11-import.txt)
- [Build](evidencias/entrega-c11-build.txt)
- [Rótulos e médias no notebook](evidencias/entrega-c11-sla-desktop.png)
- [Móvel](evidencias/entrega-c11-sla-mobile.png)

git diff --check aprovado; nenhum diff com HEAD em Supervisor/views, componentes/styles/cenas legados, configuração e datasets/referencias. Planilha SHA256 preservado: 1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe. Branch feature/next-evolucao; arquivos de entregas anteriores ainda não versionados, App.jsx alterado anteriormente. Nenhum commit/staging/deploy/instalação executado.

## Critérios, divergências e próximo gate

Definições sintéticas documentadas e rastreáveis; resolução distinta de saída; tooltips atualizados; projeção temporal testada; nulos preservados; indicadores reconciliados; testes anteriores aprovados; backlog atualizado.

As duas saídas posteriores persistem como característica original da massa, tratadas pela visibilidade, sem correção. A distinção entre resumo geral e aderência dos concluídos permanece documentada. Não há divergência nova bloqueando o escopo C1.1.

Limites mantidos: conceitos oficiais OTIS e SLA restante pendentes; modo temporal completo não implementado; aviso preexistente de bundle >500 kB; offline somente após carregamento; docs/código novos ainda dependem de commit autorizado para proteção permanente.

Recomendação: homologar C1.1, depois autorizar C2 com escopo de risco histórico versus ativo, motivos e recorrências materializados, aproveitando filtros/explicações e conceitos agora formalizados. Não inferir previsão, causalidade ou recalcular criticidade. US05/11 atualizadas; US14 recebe contrato/testes preparatórios, não motor Feira concluído. C2 não iniciada.
