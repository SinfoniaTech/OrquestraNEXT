# Entrega A — estrutura e navegação do novo BackOffice

Estado: implementada e testada localmente; aguardando avaliação do usuário antes da Entrega B.

## Controle de versão

Branch feature/next-evolucao, referência 43dd028. Antes da implementação: nenhum arquivo rastreado modificado; docs/, testes, scripts/import_orquestra.py e src/data/orquestra/ ainda não versionados. Esses resultados anteriores precisam de registro permanente após autorização. Proposta: commit dedicado de proteção/documentação/testes, commit de camada de dados e commit separado da Entrega A, cada um revisado; referência legada recuperável e publicada somente se autorizada. Não houve git add, commit, tag, push ou deploy. Backup /tmp não é permanente.

Único arquivo rastreado alterado nesta entrega: src/App.jsx, para escolher modo opt-in. Arquivos novos: src/platform/BackofficePlatform.jsx, BackofficePlatform.module.css, navigation.js e tests/platform-shell.test.mjs. Atualizados docs/README.md, produto/backlog.md e tests/README.md; este relatório e evidências adicionados. Demais arquivos não versionados pertencem também às entregas anteriores; status completo em evidencias/entrega-a-git-status.txt.

## Acesso e arquitetura

Apresentação original permanece padrão em /OrquestraNEXT/#/1; dez hashes e controlador existentes. Novo BackOffice em /OrquestraNEXT/?modo=plataforma#/login, carregado lazy somente nesse modo, fora do glob views/**/index.jsx.

Login oferece acesso demonstrativo explícito sem solicitar credenciais ou simular autenticação corporativa. Marcador local em sessionStorage só mantém a sessão de demonstração; não é autorização, identidade ou barreira de segurança. Sem storage, acesso funciona na sessão React, mas refresh pode voltar ao login.

Novo shell: logo existente, sidebar compacta, grupos de navegação, header, breadcrumbs, título, ambiente DEMO e retorno à apresentação. 12 menus por hash com histórico, refresh, aria-current, página desconhecida e saída. Layout principal 1366×768; drawer em telas menores, Escape, foco delimitado e link de salto ao conteúdo. Somente o modo novo altera o título; reload de retorno restaura entrada legada.

Todas as páginas são placeholders de desenvolvimento, inclusive Chamados. Não foi importada a camada de dados para criar indicadores, filtros, pesquisa ou métricas nesta entrega. Não há números financeiros/estoque/operacionais inventados ou integração ativa alegada. Layout novo usa CSS Module próprio; CSS global/legado intacto. Feira e ponte Supervisor não implementadas.

## Resultados

- Build Vite aprovado em /tmp/orquestra-shell-a/dist, sem alterar dist local.
- 7 testes novos aprovados: demo sem credenciais; 12 menus/logo/placeholders; refresh/back/endereço inválido; skip/foco sem trocar rota; drawer móvel/Escape/sem overflow; apresentação padrão/retorno; saída e acesso direto sem sessão.
- 34 testes anteriores novamente aprovados: 25 Node/browser (dados, offline e apresentação) + 9 Python de importação.
- Total: 41 casos aprovados, zero falhas. Sem instalação.
- Chrome headless em 1366×768 e teste adicional 390×844. As 12 entradas ficam visíveis no desktop.
- Git diff dos componentes/cenas/dados/CSS do Supervisor, BackOffice legado, controlador, configuração, XLSX e referências: vazio.
- App.jsx mudou intencionalmente; não atualizar o manifesto legado para esconder essa alteração.
- Prints revisados do login, Visão Geral e mobile. São evidências iniciais, não baseline pixel a pixel homologada.

## Critérios de aceite por etapa

| Critério do pedido | Estado nesta Entrega A |
| --- | --- |
| 1 Navegação funcional | Atendido no shell |
| 2 Doze menus acessíveis | Atendido |
| 3 Chamados usa histórico | Entrega B, não implementado |
| 4 Filtros cumulativos | Entrega B, não implementado |
| 5 Indicadores reagem | Entrega B, não implementado |
| 6 Detalhes acessíveis | Entrega B, não implementado |
| 7 Filtros preservados | Entrega B, não implementado |
| 8 Rastreabilidade de indicadores | Camada pronta da etapa anterior; UI na Entrega B |
| 9 Resolução 1366×768 | Atendido no shell |
| 10 Trinta e quatro testes anteriores | Aprovados |
| 11 Apresentação/Supervisor operacionais | Regressão anterior aprovada; arquivos preservados |

## User Stories

US06: login/demo e modo independente entregues; demais modos/fluxos ainda planejados. US07: estrutura de shell e 12 destinos entregues; páginas funcionais pendentes. US15: foco/teclado/drawer/resolução validados parcialmente, sem auditoria total. US01/US16: regressão/build revalidados. US08/09: não iniciadas na interface, aguardando avaliação A e autorização B.

## Limitações e próxima entrega

Três páginas sem PNG continuam pendentes de visual funcional, embora destinos existam. Sem autenticação real, persistência remota, indicadores, consultas ou integração. Logo é o ativo legado, não um redesenho. Sem validação cross-browser completa. Modo Feira automático explicitamente fora do escopo.

Próximo passo: avaliar Entrega A. Somente após aprovação iniciar Chamados com filtros compartilhados, busca, ordenação, paginação, detalhe e explicações a partir do mesmo recorte HIST_60_DIAS. Não misturar snapshots ou fixtures Supervisor. Nenhuma Entrega B iniciada.
