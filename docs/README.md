# ORQUESTRA — índice da documentação

Para retomar o trabalho, leia primeiro as [instruções permanentes do repositório](../AGENTS.md) e a [continuidade oficial](CONTINUIDADE_CODEX.md). A continuidade concentra o estado atual, Git, evidências, pendências, próxima ação e prompt de retomada. Este índice apenas localiza os documentos.

## Produto e processo

- [Product Backlog — 19 histórias, critérios e estados](produto/backlog.md)
- [Plano incremental e rotina de encerramento](produto/plano-incremental.md)
- [Cobertura das telas](produto/cobertura-telas.md)
- [Explicabilidade BASE/CALC/EXT](produto/explicabilidade-ext.md)
- [Modos de utilização](produto/modos.md)
- [Questões de negócio pendentes](produto/pendencias.md)

## Arquitetura, dados e preservação

- [Arquitetura inicial e dependências](tecnica/arquitetura-atual.md)
- [Arquitetura proposta](tecnica/arquitetura-proposta.md)
- [Fronteiras de integração com Supervisor](tecnica/pontos-integracao-supervisor.md) — inclui matriz, arquitetura e contrato de UI do Supervisor Feira.
- [Dicionário dos 46 campos e decisões aprovadas](dados/dicionario.md)
- [Camada de dados e importador](dados/camada-dados.md)
- [Separação das fontes](dados/fontes.md)
- [Referência e publicação](preservacao/baseline.md)
- [Matriz de preservação das cenas](preservacao/matriz-cenas.md)
- [Estratégia de regressão](preservacao/estrategia-regressao.md)
- [Recuperação](preservacao/recuperacao.md)
- [Comandos e cobertura dos testes](../tests/README.md)

- [Nova apresentação padrão — roteiro manual, modos e evidências](produto/entrega-apresentacao-padrao.md)

## Relatórios de entrega e evidências

Relatórios preservam o estado e as autorizações da época; gates antigos não autorizam novas ações. Para implementação, homologação, commit e publicação atuais, consulte a continuidade e o quadro atual do backlog.

| Marco | Relatório |
| --- | --- |
| Proteção inicial | [Resultados e limites](preservacao/resultado-protecao-minima.md) |
| Dados US03/04 | [Importação e separação](dados/resultado-us03-us04.md) |
| A | [Shell e navegação](produto/entrega-a-navegacao.md) |
| B | [Chamados e filtros](produto/entrega-b-chamados.md) |
| C1 | [SLA & Criticidade](produto/entrega-c1-sla-criticidade.md) |
| C1.1 | [TA/TB e proteção temporal](produto/entrega-c11-tempos.md) |
| C2 | [Riscos & Tendências](produto/entrega-c2-riscos.md) |
| C3 | [Visão Geral / Performance](produto/entrega-c3-performance.md) |
| C4 | [Contratos & Margem](produto/entrega-c4-contratos.md) |
| C5 | [Custos / TCO](produto/entrega-c5-custos.md) |
| C6 | [Equipamentos](produto/entrega-c6-equipamentos.md) |
| C7 | [Técnicos](produto/entrega-c7-tecnicos.md) |
| C8 | [Peças / Inteligência de Componentes e Ocorrências](produto/entrega-c8-pecas.md) |
| Controle C8 | [Homologação, versionamento e destino proposto do Pages](produto/publicacao-controlada-c8.md) |
| Pós-C7 | [Tela branca: mecanismo observado, recuperação e limite do diagnóstico](produto/correcao-inicializacao-c7.md) |

**Observado** exige evidência; **requisito** vem do usuário; **proposta** depende de aprovação; **pendente** indica definição/evidência ausente. Imagens orientam UX e não comprovam dados. Documentos não são autorizações implícitas para implementar, testar, versionar ou publicar.

- [C9 — Modo Feira: entrega local e validação](produto/entrega-c9-feira.md).
- [C9.1 — sincronização local e roteiro de homologação física](produto/entrega-c91-sincronizacao.md).

- [C9.2 — Feira estendida e sincronização](produto/entrega-c92-feira-estendida.md).
