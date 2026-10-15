# Replanejamento incremental — prioridade BackOffice

Estado: proposta para aprovação; somente docs autorizados. Testes de regressão antigos não devem ser executados automaticamente como próxima ação.

Fluxo obrigatório por entrega: ANÁLISE → PLANEJAMENTO → APROVAÇÃO → IMPLEMENTAÇÃO → TESTES → VALIDAÇÃO → ATUALIZAÇÃO DO BACKLOG. Nenhuma etapa implica aprovação da seguinte.

| Etapa proposta | Escopo / histórias | Critério de aceite para validação |
| --- | --- | --- |
| R0 — Aprovar escopo | Arquitetura, 13 telas, modos, limites e backlog | Confirmar plano, questões bloqueantes e fontes; documentos coerentes |
| R1 — Referência e proteção focalizada | US01/02/16 | SHA recuperável; mapa de dependências Supervisor; regressão das posições 3–10 e fluxos Supervisor completo planejada/executada após autorização; BackOffice antigo apenas caracterizado |
| R2 — Contrato e importação | US03/04/05 | 736 IDs/46 campos e snapshots separados; validação de nulos, datas/escala; BASE/CALC/EXT e indicadores permitidos; regras pendentes não calculadas |
| R3 — Shell, login/demo e modos | US06/07/15 | Login e 12 menus identificados; 1366×768 utilizável; três destinos sem PNG explicitados; hashes legados/acesso Supervisor preservados; sem autenticação fictícia |
| R4 — Consulta central | US08/09 | Filtros cumulativos, paginação, detalhe e retorno; tabela/cards/gráficos conciliados; sem timers no BackOffice manual |
| R5 — Visão e inteligência | US10/11/12 | Visão Geral, Riscos, SLA, Equipamentos, Técnicos e Padrões com fonte, explicação e limitações; nenhum dado inventado |
| R6 — Executivo e dependências externas | US13 e US18-A | Contratos & Margem, Custos/TCO, Contratos BackOffice, Peças e Integrações navegáveis; valores só sustentados; demais EXT; visual pendente aprovado antes de finalizar |
| R7 — Ponte Supervisor | US19 | Entrada informada, sem mudar Supervisor; retorno conserva filtros e pausa; nenhum anúncio de sincronização real |
| R8 — Feira temporal | US14 | T0/T1/T2 determinísticos, dados/indicadores coerentes; pausa/retomada/reinício; sem antecipar futuro; loop/velocidade aprovados |
| R9 — Homologação / corte de entrada | US15/16 | Fluxo completo validado em 1366×768; Supervisor preservado; build/base/assets e recuperação demonstrados; atualização backlog |
| R10 — Expansão | US17 e US18-B | Exportação e integrações reais somente com novos contratos/fontes e autorização |

US15/16 são transversais, não correção tardia. Ponte pode ocorrer antes de R6 após R4 se aprovada. R7/R8 são entregas separadas para não acumular funcionalidades. US07 permite substituir o BackOffice; não exige cópia fiel ou consolidação prévia.

## Relatório obrigatório após implementação futura

1. Histórias/tarefas atendidas e estado real.
2. Arquivos criados/modificados.
3. Funcionalidades entregues e fonte de dados.
4. Testes, ambiente, resultados e evidências.
5. Riscos, limitações, EXT e questões abertas.
6. Próxima entrega recomendada, aguardando aprovação.

Aceite técnico não autoriza deploy/commit. Alterações futuras precisam de escopo explícito; não implementar vários módulos de uma vez por terem dependências comuns.
