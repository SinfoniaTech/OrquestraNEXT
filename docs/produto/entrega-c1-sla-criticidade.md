# Entrega C1 — SLA & Criticidade

15/10/2026. Entrega B homologada pelo usuário. C1 implementada localmente, aguardando homologação. Acesso: /OrquestraNEXT/?modo=plataforma#/sla-criticidade. Nenhum commit, deploy ou instalação.

## Escopo e arquitetura

Página nova conectada exclusivamente ao HIST_60_DIAS, pelo ConsultationContext/seletores existentes. Sem segunda importação ou camada de filtros. FilterBar, cards, explicações, badges, DataTable, Pagination e ChamadoDetail reutilizados. Estado compartilhado mantém filtros, período e busca entre C1 e Chamados. Detalhe retorna ao aprofundamento e preserva o contexto; refresh completo continua restaurando padrão, como na B.

Cinco cards superiores, distribuição pelas quatro cores, faixas de consumo, médias por Área/Categoria/Cliente/Tipo de Unidade, motivos completos e tabela de prioritários. Cada card/painel tem explicação CALC (dez ao todo), população, elegibilidade, nulos e fonte; registros detalhados mantêm valores BASE. Aprofundamento por card, cor, faixa, grupo, motivo e por Dentro/Ultrapassado, em lista paginada e detalhe. Prioritários abrem detalhe diretamente.

Os oito filtros da B afetam a mesma população inicial; cada indicador aplica somente sua elegibilidade documentada. Faixas e aprofundamentos são subconjuntos dessa população, não um segundo estado global de filtros.

## Decisões expressamente aprovadas pelo usuário

A confirmação nesta conversa aprovou estas regras **para demonstração**:

- Aderência: Status = Concluído; SLA_min finito > 0; Percentual_SLA finito e não negativo. Cumpre quando Percentual_SLA <= 1, inclusive. Acima de 1 = ultrapassado. Numerador / elegíveis × 100.
- Faixas contínuas do consumo: [0;0,5], ]0,5;0,8], ]0,8;1] e >1; apresentação em %. Sem lacunas para decimais. Não representam criticidade.
- TA/TB: médias aritméticas dos valores materializados, unidade ainda em validação. Finito não negativo participa; zero informado permanece válido; ausente não vira zero. N independente por campo.
- Consumo médio: média simples de Percentual_SLA válido em todos os status ×100, sem ponderação por contrato ou SLA_min.
- Sem elegíveis: — / não calculável, nunca zero fabricado.

Não recalcula dados geradores, datas de atendimento, ETA, SLA restante ou criticidade. Aderência demonstrativa não certifica contrato real. Q01/Q02 permanecem para definições operacionais, unidade, pausas e prazo restante.

## Demais regras de população

Criticidade histórica: todos os registros filtrados, classificação original Verde/Amarelo/Laranja/Vermelho. Prioritários: apenas Status diferente de Concluído e Laranja/Vermelho, ordenados por Vermelho primeiro e criação mais antiga. Laranja é janela de intervenção; Vermelho condição crítica que exige apoio à decisão. Não inferir cor pelo consumo.

Passageiro Preso conta ocorrências marcadas Sim, incluindo concluídos; não conta pessoas nem pessoas atualmente presas. Carro Parado e Recorrencia_30d permanecem materializados no detalhe, sem duração ou recomputação inferida.

Motivos são agrupados pelo texto completo, inclusive justificativas compostas, sem separar em eventos ou alegar causalidade. Ranking por frequência, empates por texto; barra = contagem / total filtrado. Todos os motivos acessíveis por rolagem. Grupo de tempos apresenta N e média de cada campo; sua lista inclui todos os registros daquele grupo, inclusive os sem TA/TB, enquanto o card de média abre só os elegíveis.

Relógio/período: preservados da B, 06/10/2026 às 22h, America/Sao_Paulo, Criado em, dias inclusivos. Histórico/snapshots/mocks continuam separados.

## Resultados reconciliados — recorte completo

| Indicador | Resultado |
| --- | --- |
| Histórico | 736 |
| Concluídos elegíveis para aderência | 724 |
| Dentro / ultrapassado | 665 / 59 |
| Aderência | 91,9% (arredondada só na apresentação) |
| TA médio / N | 35,4 / 728, unidade em validação |
| TB médio / N | 49,2 / 724, unidade em validação |
| Consumo médio informado | 63,3% / N=736 |
| Passageiro preso (ocorrências históricas) | 74 |
| Verde / Amarelo / Laranja / Vermelho | 253 / 345 / 72 / 66 |
| Faixas 0–50 / >50–80 / >80–100 / >100 | 257 / 325 / 95 / 59 |
| Não concluídos / prioritários ativos | 12 / 1 |

Não há valores da ilustração copiados para métricas. Não usa EXT como substituto de regra pendente; nenhuma métrica externa foi adicionada.

## Arquivos desta entrega

Criados:
- src/platform/services/sla.js — agregações e explicações C1.
- src/platform/pages/SlaCriticidadePage.jsx — composição, aprofundamento e detalhes.
- src/platform/pages/SlaCriticidadePage.module.css — estilos isolados.
- tests/sla-service.test.mjs — 11 testes de domínio.
- tests/sla-browser.test.mjs — 7 testes de navegador.
- docs/produto/entrega-c1-sla-criticidade.md e evidências C1.

Alterados:
- src/platform/BackofficePlatform.jsx — conexão da página e identificação de duas páginas funcionais.
- tests/platform-shell.test.mjs — expectativa atualizada para C1 funcional, dez destinos pendentes, mantendo todos os 12 menus.
- docs/README.md, docs/produto/backlog.md, pendencias.md, explicabilidade-ext.md, cobertura-telas.md; docs/dados/dicionario.md; tests/README.md.

src/App.jsx já estava alterado na A; não editado na C1. Nenhum arquivo funcional da B foi reescrito; filtros, detalhe e camada de importação preservados.

## Testes, evidências e preservação

**87 testes distintos aprovados:** 18 novos C1 (11 serviço + 7 navegador), mais os 69 anteriores (60 Node/browser + 9 Python). Zero falhas.

Novos: aderência/denominador/limite exato 100%, nulos/zero/inválidos, médias/N independentes, limites decimais de faixas, reconciliação, cores independentes do consumo, histórico versus ativo, passageiros, motivos, agrupamentos, recorte vazio, metadados, aprofundamento e detalhe/retorno, filtros entre páginas, dez explicações, teclado Escape, navegador Tokyo, offline após carregamento e layouts 1366×768/390×844. Testes usam pequenos casos artificiais somente como fixtures de limites/inválidos; não são dados apresentados na aplicação.

Regressão anterior: cenas 1–10, Supervisor, alertas, detalhes, teclado, eventos, temporizadores, saída/reentrada, FLIP/movimento reduzido; toda suíte de Chamados/filtros e navegação da A. Build aprovado no subdiretório /OrquestraNEXT, artefato temporário /tmp/orquestra-c1/dist. Importador --check aprovado.

Git: branch feature/next-evolucao, referência 43dd0283728d8c78ae9017ae5acae8a1cf3101d5. git diff --check aprovado. Comparação com HEAD sem alterações em src/views, src/components, src/styles, src/scenes, scenes.config.js, main.jsx, package.json/lockfile, vite.config.js, datasets e referencias. Nada staged. Planilha SHA256 intacto: 1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe.

Evidências copiadas para docs (também ainda não versionadas):
- [18 testes C1](evidencias/entrega-c1-tests.txt)
- [60 regressões Node/browser](evidencias/entrega-c1-regression.txt)
- [9 testes Python](evidencias/entrega-c1-import.txt)
- [Build](evidencias/entrega-c1-build.txt)
- [Notebook](evidencias/entrega-c1-sla-desktop.png)
- [Análise](evidencias/entrega-c1-sla-analise.png)
- [Móvel](evidencias/entrega-c1-sla-mobile.png)

## Limites e próximo passo

Nenhum requisito funcional do escopo recebido ficou sem implementação após aprovação das agregações. Não implementado por definição: SLA restante; unidade operacional TA/TB não inventada; regras geradoras da base; previsões/animações da ilustração sem fonte. Homologação visual da C1 ainda depende do usuário.

Preservação comprovada por testes e comparação de código, sem certificação visual integral/cross-browser. Bundle opt-in continua com aviso de tamanho (~1,167 MB minificado, ~90 kB gzip); avaliar carregamento seletivo antes de ampliar a plataforma. Offline após carregamento; nenhum service worker/primeiro acesso offline. Consulta não persiste em refresh, conforme B.

Persistem docs/, scripts/, src/data/, src/platform/ e tests/ não versionados, além de src/App.jsx modificado anteriormente. Proteção permanente exige revisão e commit autorizado; /tmp não substitui versionamento.

Backlog: US11 atendida para a página SLA & Criticidade, pendente para Riscos & Tendências e definições contratuais; US05/07/15 avançam no escopo desta página; US08 reutilizada; US01/16 revalidadas. Dez menus continuam pendentes. Nenhuma outra página funcional, Feira ou ponte iniciada.

Recomendação: homologar a C1, confirmar futuras definições TA/TB/SLA restante quando necessárias e autorizar o registro permanente das entregas. Próxima página/escopo depende de autorização específica.
