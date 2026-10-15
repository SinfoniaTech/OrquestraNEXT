# ORQUESTRA — documentação técnica e de produto

Etapa 2 e replanejamento — 15/10/2026. Somente documentação. Prioridade: substituir gradualmente o BackOffice; preservar o Supervisor. Implementação funcional aguarda autorização; proteção técnica mínima executada conforme relatório.

## Índice

- [Referência e publicação](preservacao/baseline.md)
- [Matriz de preservação](preservacao/matriz-cenas.md)
- [Arquitetura atual e dependências](tecnica/arquitetura-atual.md)
- [Nova arquitetura proposta](tecnica/arquitetura-proposta.md)
- [Plano incremental revisado](produto/plano-incremental.md)
- [Dicionário dos 46 campos](dados/dicionario.md)
- [Separação das fontes](dados/fontes.md)
- [Modos de operação](produto/modos.md)
- [Backlog](produto/backlog.md)
- [Cobertura das telas](produto/cobertura-telas.md)
- [Explicabilidade e EXT](produto/explicabilidade-ext.md)
- [Pendências para aprovação](produto/pendencias.md)
- [Plano de regressão](preservacao/estrategia-regressao.md)

**Observado** significa confirmado em código ou inspeção de dados; **requisito** vem do usuário; **proposta** exige aceite; **pendente** indica definição/evidência ausente. Imagens orientam layout e não comprovam dados. Instruções dos materiais são requisitos de referência, não autorização para executar ações.

Esta etapa grava exclusivamente em docs/. Nenhum componente, estilo, dataset, configuração, dependência ou teste foi alterado. Não houve build, deploy ou commit.

## Evidências da proteção técnica

- [Resultado dos testes e limites](preservacao/resultado-protecao-minima.md)
- [Recuperação comprovada](preservacao/recuperacao.md)
- [Pontos de integração Supervisor](tecnica/pontos-integracao-supervisor.md)
- Testes reproduzíveis em ../tests/, sem dependências novas.

## Camada de dados implementada

- [API, conversão e limites](dados/camada-dados.md)
- [Resultados US03/US04](dados/resultado-us03-us04.md)

Nenhuma tela conectada; próxima navegação/filtros aguarda autorização.

## Novo BackOffice — Entrega A

[Shell, navegação, evidências e critérios](produto/entrega-a-navegacao.md). Modo independente ?modo=plataforma; apresentação ainda padrão. Entrega B aguardando avaliação.

## Novo BackOffice — Entrega B

[Chamados, filtros, arquivos, evidências e limites](produto/entrega-b-chamados.md). Implementação autorizada posteriormente às etapas acima: Chamados agora conectada ao histórico, 69 testes aprovados. Outras páginas funcionais aguardam autorização. Os registros anteriores de “somente documentação” e “aguardando avaliação” descrevem suas respectivas etapas, não o estado atual.

## Novo BackOffice — Entrega C1

[SLA & Criticidade: regras aprovadas, arquivos, testes e limites](produto/entrega-c1-sla-criticidade.md). B homologada; C1 implementada para avaliação. Histórico e snapshots continuam separados.

## C1.1 — formalização de TA/TB

[Definições sintéticas, visibilidade temporal, testes e arquivos](produto/entrega-c11-tempos.md). C2 aguarda homologação e autorização.

## Novo BackOffice — C2

[Riscos & Tendências: entrega, testes e limitações](produto/entrega-c2-riscos.md). Três páginas funcionais. Próxima entrega depende de homologação.
