# Questões pendentes de validação

Nenhuma fórmula abaixo é definida por suposição. Proprietário de negócio ainda deve ser indicado. Registrar resposta, data, responsável e impacto no backlog antes da implementação dependente.

| ID | Questão | Bloqueia |
| --- | --- | --- |
| Q01 | O que TA e TB medem, unidade, início/fim, pausas, elegibilidade e metas? Supervisor usa TA decorrido/TB restante, histórico tem valores materializados distintos. | Médias e explicações temporais |
| Q02 | SLA_min é chegada, resposta ou solução? Qual relógio/pausas? Como Percentual_SLA e ETA_min são produzidos? Como medir aderência e tratar concluídos/zero ETA? | Aderência e recálculo de SLA |
| Q03 | Qual chave e janela de recorrência? Inclui ocorrência atual? Regra de criticidade e pesos multifatoriais? Não reduzir a cor à faixa SLA. | Recálculo de criticidade/recorrência |
| Q04 | Resolvida pelo usuário para demonstração: America/Sao_Paulo, ISO com offset, histórico 06/10/2026 22h. Implementada para 2026, sem Z automático. | Extensões fora do demonstrador exigem validação |
| Q05 | 60 dias resolvido: 08/08–06/10 inclusive, Criado em. API inclui dias inteiros. Janelas menores, faixas SLA, limpar/padrão ainda pendentes. | Filtros visuais e comparações futuras |
| Q06 | Identidades resolvidas pelo usuário: Padrões & Insights, Contratos — BackOffice, Integrações. Seus três layouts continuam sem imagem confirmada. | Homologação visual dessas páginas |
| Q07 | Snapshots são completos ou incrementais? Ausência significa o quê? Política de pausa em detalhe, velocidade, loop e eventos intermediários? | Motor temporal da Feira |
| Q08 | Login e 12 menus confirmados. Definir URLs, entrada padrão, acesso demonstrativo/saída e se haverá autenticação real. | Implementação da entrada |
| Q09 | Como agregar Impacto_Contrato e definir contrato sob pressão? Quais fontes de receita/estoque/skills? | Visão executiva/EXT |
| Q10 | Fechar modal não zera badgeAlertas no legado. Supervisor está congelado: correção futura exige etapa específica, não bloqueia novo BackOffice. | Alteração futura do Supervisor |
| Q11 | Prioridade 1366×768 confirmada. Ainda autorizar testes/configuração/servidor/build e eventual instalação após inventário; definir navegador/tolerância e viewports complementares. | Testes e evidências |
| Q12 | Qual SHA/artefato está publicado e qual procedimento de retorno será homologado? | Certificação GitHub Pages |

Prioridade: Q01–Q05 antes de cálculos; Q07 antes da Feira; Q06 (visual)/Q08 antes das entregas dependentes; Q11 antes dos testes. O contrato EXT é requisito; texto/posicionamento visual serão validados na implementação.

| Novas decisões | Estado |
| --- | --- |
| Q13: entrada no Supervisor, cena inicial e retorno | Aviso de demo independente obrigatório; confirmar fluxo e ponto inicial. Pausa Feira proposta ao sair, retomada explícita. |
| Q14: substituição e recuperação BackOffice | Aprovar acesso legado durante migração, corte da entrada principal e teste de recuperação; não presumir que SHA local é site publicado. |
| Q15: Contratos — BackOffice | Confirmar consulta/cadastro e permissões; não implementar gravação por existir menu. |

Decisões já confirmadas: prioridade BackOffice, Supervisor preservado, login+12 menus, BASE/CALC/EXT, explicação em todos os cards, Feira com pausa/retomada/reinício, processo incremental e somente docs nesta tarefa. Regra geradora de negócio continua pendente.

## Decisões da Entrega B

Q05: Hoje/7/15/30/60 dias inclusivos autorizados, referência fixa e Criado em; limpar retorna a 60 dias. Faixas de SLA/comparações futuras seguem pendentes. Q08: demo opt-in implementada na A, autenticação real fora do escopo. Q11: testes locais autorizados/executados sem instalação; homologação cross-browser pendente. Q01/Q02 continuam abertas; SLA restante não inferido. Recorrência 0/1–2/3+ agrupa valores materializados e não resolve sua geração em Q03. [Relatório B](entrega-b-chamados.md).

## Decisões expressas da C1 — 15/10/2026

Usuário aprovou para demonstração: aderência entre Concluído, SLA_min finito > 0 e Percentual_SLA finito não negativo; cumprimento se Percentual_SLA <= 1. Faixas contínuas 0–50%, >50–80%, >80–100%, >100%. Médias TA/TB dos valores materializados, com unidade em validação. Q01/Q02 parcialmente resolvidas apenas para essas agregações demonstrativas: continuam pendentes definições operacionais, unidade TA/TB, fórmulas geradoras, pausas e SLA restante. Não inferir criticidade pelas faixas. Q03 permanece. B homologada; C1 aguarda homologação visual. [Relatório C1](entrega-c1-sla-criticidade.md).

## Resolução parcial Q01/Q02 — C1.1

Responsável pela geração, conforme informação transmitida pelo usuário, confirmou TA criação→chegada e TB chegada→encerramento técnico simulado, ambos em minutos. Saída inclui permanência adicional (3–10 min histórico; 5 min snapshots). Encerramento não foi persistido. Conceito/unidade resolvidos apenas para massa sintética; definições oficiais OTIS, pausas e SLA restante continuam pendentes. Registros futuros são ocultados na projeção de leitura, sem alterar snapshot. [Entrega C1.1](entrega-c11-tempos.md).

## Decisão da autorização C2

Proxy de Contratos sob Pressão Operacional aprovado pelo usuário: contar Contrato distinto entre registros filtrados com Impacto_Contrato Alto. Não comprova margem negativa. Recorrência elevada: Unidade distinta em registros com Recorrencia_30d >=3; não soma do campo. Q03/Q09 permanecem para regras geradoras e agregações/finanças adicionais. Evolução diária de criação não é evolução de um mesmo chamado pelas cores. [Relatório C2](entrega-c2-riscos.md).
