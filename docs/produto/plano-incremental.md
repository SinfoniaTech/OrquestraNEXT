# Replanejamento incremental — prioridade BackOffice

Processo de referência. O quadro abaixo organiza etapas e critérios; não autoriza sua execução. Estado atual e próxima ação ficam na [continuidade oficial](../CONTINUIDADE_CODEX.md); orientações permanentes em [AGENTS.md](../../AGENTS.md). Relatórios e atualizações incrementais abaixo preservam decisões da época, sem reabrir gates já superados.

C7 e rotina documental homologadas pelo usuário; commit local C7 a5aea32 após revalidação 262 testes/build. Escopo atual C8 exclusivamente analítico, implementado com292 testes/build/importador aprovados, aguarda homologação visual e não possui commit. Modo Feira planejado em seguida, ainda não autorizado. Sem push/deploy.

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

## Rotina de encerramento e retomada

Ao encerrar trabalho relevante, dentro das autorizações da sessão:

1. Executar a validação autorizada proporcional; para alteração apenas documental, conferir diff, links e coerência sem testes/build desnecessários.
2. Atualizar o relatório específico com escopo/US, arquivos, regras, testes efetivamente executados, data/comandos, evidências e limites. Separar resultados anteriores dos atuais.
3. Atualizar os estados correntes do Product Backlog, sem duplicar histórias ou transformar testes em homologação.
4. Atualizar a continuidade A–I com Git verificado, alterações ainda locais, pendências e uma única próxima ação com estado de autorização.
5. Conferir que implementação, teste, aceite, commit e publicação estão diferenciados; substituir estados superados dos quadros atuais. Manter histórico e logs nos relatórios/evidências pertinentes.
6. Comunicar o resultado e aguardar a decisão necessária; nenhuma etapa implica autorização para a seguinte.

Na nova conversa: consultar AGENTS e continuidade; conferir Git e divergências; ler apenas especificações pertinentes; resumir estado/pendências e aguardar autorização antes de implementar. O prompt padrão fica somente na [seção H da continuidade](../CONTINUIDADE_CODEX.md#h-próxima-ação). Não criar um segundo documento concorrente de retomada.

## Relatório obrigatório após implementação futura

1. Histórias/tarefas atendidas e estado real.
2. Arquivos criados/modificados.
3. Funcionalidades entregues e fonte de dados.
4. Testes, ambiente, resultados e evidências.
5. Riscos, limitações, EXT e questões abertas.
6. Próxima entrega recomendada, aguardando aprovação.

Aceite técnico não autoriza deploy/commit. Alterações futuras precisam de escopo explícito; não implementar vários módulos de uma vez por terem dependências comuns.

## Atualização autorizada C4 — 15/10/2026

O usuário homologou C3 e autorizou seu commit local (ef53ecf), testes e implementação exclusiva de Contratos & Margem. C4 implementada com 164 testes/build aprovados; avança parcialmente R6/US13, sem executar outras páginas. [Resultado e limites](entrega-c4-contratos.md). Aguardar homologação C4 antes de propor/autorizar Custos / TCO ou outra prioridade. Nenhum commit C4/push/deploy autorizado. Registros de “somente docs” no início descrevem o planejamento original, superado apenas pelo escopo aprovado.

## Atualização autorizada C5 — 15/10/2026

Usuário aprovou C4 para continuidade e autorizou commit local (ebd0db9) e implementação exclusiva de Custos / TCO. C5 implementada e validada com 194 testes/build; avança parcialmente R6/US13, sem TCO real/composição contábil inventados. [Relatório C5](entrega-c5-custos.md). Aguardar homologação; próxima sugestão Equipamentos/US12 depende de novo escopo. Nenhum commit C5/push/deploy autorizado.

## Atualização autorizada C6 — 15/10/2026

C5 aprovada para continuidade e registrada em 485e6b4, após 194 testes/build e staging revisados. Equipamentos C6 implementada exclusivamente, avançando R5/US12 com sete páginas funcionais; 225 testes/build aprovados. [Relatório C6](entrega-c6-equipamentos.md). Próxima prioridade planejada pelo usuário é Modo Feira/R8/US14, com evolução de dados/pausa/retomada/reinício preservando apresentação manual e Supervisor. Não iniciar antes da homologação C6 e autorização de escopo; decisões temporais/fontes/merge/velocidade/loop permanecem próprias. Nenhum commit C6/push/deploy autorizado.


## Atualização autorizada C7 — 15/10/2026

C6 aprovada para continuidade, commit local autorizado 05ec7d5 após revalidação dos 225 testes/build e revisão dos 34 arquivos. C7 Técnicos implementada na US12, oito páginas funcionais/quatro pendentes, 255 testes/build aprovados. [Relatório](entrega-c7-tecnicos.md). C7 aguarda homologação visual e não possui commit. Próxima sequência planejada atual: C8 — Peças e Componentes/US18-A, depois Modo Feira/US14; substitui a prioridade imediata Feira registrada no encerramento C6. Não iniciar nenhuma sem autorização específica. Sem push/deploy. Gates históricos acima não autorizam trabalho novo.

## Atualização autorizada C8 — 15/10/2026

C7 homologada após correção de inicialização e rotina homologada; commit C7 a5aea32 autorizado e executado. C8 Peças analítica implementada na US18-A, nove páginas funcionais/três pendentes,30 testes novos/292 totais aprovados e build/importador. [Relatório](entrega-c8-pecas.md). Aguardar homologação visual C8; não iniciar Feira nem criar commit C8 sem autorização própria. Logística real EXT; sem operações de estoque/compra/reserva/despacho.
