# ORQUESTRA — continuidade oficial


Único ponto de retomada. Leia [AGENTS.md](../AGENTS.md) e confira Git antes de trabalhar.

## Estado vigente — entrega publicada na feature, 23/10/2026

Usuário autorizou explicitamente commit e push exclusivamente em `feature/modo-feira`. Commit funcional/documental **`b8aa92eb96bb34ca33b711e8391254eac6ba9d32`** (`feat(feira): consolida continuidade, visitantes e evidências técnicas`) publicado com sucesso: remoto avançou de13d315a para b8aa92e. Esta atualização de continuidade integra o commit documental subsequente `docs(feira): registra publicação autorizada da entrega`, destinado à mesma feature. Conferir `git log -2` e `git status --short --branch` para seus hashes/estado final; a verificação final de igualdade HEAD/remoto é feita após o push documental.

Homologação visual/funcional dos seis critérios aprovada pelo usuário. Validação técnica preservada: **524 testes distintos =507 Node/navegador+17 Python**, zero falhas/skip/cancelamentos; build e dois --check aprovados. Ensaio nativo integrado335,996s aprovado, incluindo minimização/fechamento ADMIN e recuperação de controle, sem errosJS/pausas inesperadas.170 arquivos protegidos iguais ao HEAD-base13d315a. Fontes e testes iguais ao estado validado; bateria não repetida sem mudança funcional. Somente espaços finais dos logs de build normalizados para diff --check.

[Relatório de validação e publicação](produto/entrega-c92-feira-estendida.md#publicação-autorizada-na-feature--23102026). Evidências versionadas nas quatro pastas de23/10/2026; logs explicitamente selecionados e conferidos sem códigos de pareamento/credenciais. Antes da atualização documental final, árvore limpa após o commit e push funcional. Nenhum arquivo fora do escopo incluído; sem merge/rebase/force-push/deploy e sem modificação de main, feature/next-evolucao ou gh-pages.

**Arena não homologada.** Pendências: rede/client isolation/DHCP/porta, aparelhos físicos e operação prolongada. Chunk>500kB continua aviso não bloqueante. Futuro PR/integração exige autorização própria, atualização da análise de conflitos/CSS Feira e regressão do resultado integrado. Próxima ação: aguardar orientação do usuário; nenhum merge/deploy ou novo trabalho autorizado automaticamente.

Serviços anteriores5196/5198/5200 não foram reiniciados nesta publicação; verificar PID/porta antes de reutilizar. Códigos privados nunca devem ir para URL/chat/Git. Seções seguintes preservam o histórico anterior à publicação, incluindo gates já superados por esta autorização.

## Marco anterior — continuidade, 23/10/2026, America/Sao_Paulo

Revisão vigente:continuidade independente de foco/lease e linguagem operacional histórica,nas US14.6–14.14/US15/US16. Implementadas sobre as quatro frentes anteriores: sessão Supervisor de seis horas; aviso/reconexão; consulta sem pausa global com fotografia fixada; destaques determinísticos de até dois fatos auditados por transição. [Relatório vigente e evidências](produto/entrega-c92-feira-estendida.md#continuidade-independente-de-foco-e-linguagem-operacional--23102026). [Contrato técnico/Supervisor vigente](tecnica/pontos-integracao-supervisor.md#continuidade-e-linguagem-operacional-vigentes--23102026). Marcos anteriores nesse relatório são históricos e não comprovam a execução atual.

## Git e autorizações — histórico anterior à publicação

- Raiz real: `/home/p2dutra/Documents/ChatGPT/Projeto_Challenge_OTIS/OrquestraNEXT`. O pai é outro repositório, em main, com diretórios não rastreados; não trabalhar nele.
- Branch `feature/modo-feira`, HEAD `13d315aa7539637b22a782bb2744e67c3ae54451`. Nesta retomada,árvore inicialmente já continha as alterações e evidências locais da adequação NEXT,sem staged;preservadas. Estado atual: fonte/servidor/testes/docs/evidências locais não commitados; conferir `git status --short --branch --untracked-files=all` e preservar tudo.
- `git ls-remote` conferido em etapa anterior (não repetido nesta validação): feature remota no mesmo13d315a. Fetch somente de main atualizou origin/main para `3518e37bdc3f05c2b605a83ef78ad394dc4eb98c`, descendente de13d315a. Main local permanece intacta. Não houve merge/rebase/troca de branch/reset/clean/stash/force-push/deploy.
- Usuário exige eventual commit/push exclusivamente na feature/modo-feira. O anexo condiciona registro/publicação à homologação: **aguardar homologação antes de commit/push/PR**. Nenhuma autorização antiga deve ser reaproveitada. Preparação do PR e análise estática no relatório; dois CSS Feira sobrepostos com main exigem revisão futura da cascata.

## Decisões e fronteiras

Somente server/feira-* e src/feira/*, testes específicos e documentação oficial foram alterados. FeiraPanel/FeiraDetail/CSS também atendem ao standalone, cuja pausa ao analisar permanece. Componentes globais, plataforma, estilos compartilhados globais, Supervisor original/dez cenas, datasets e importadores não foram alterados.170 arquivos protegidos conferidos iguais ao HEAD. Dados preservados:12 snapshots T00–T11,417 registros,55 IDs finais,189 eventos,336 s1×/168 s2×.

- Supervisor autentica por seis horas absolutas desde pareamento; heartbeat/refresh/reconexão não renovam. Cookie HttpOnly/SameSite=Strict/Max-Age21600; servidor e SSE verificam validade. ADMIN conserva sessão ligada ao processo/cookie de navegador. Código inicial continua30 min desde início do serviço. `revoke-session {clientId}` exige ADMIN dono do controle/CSRF/origem/revisão/idempotência, testado via API, sem novo painel de visitantes.
- Abrir resumo/completo copia último DTO confirmado com sessão/ciclo/snapshot/revisão, sem POST de leitura, lock ou pausa. Indica leitura histórica quando operação avança e permite atualização explícita. Processo novo encerra seleção; ciclo novo mantém leitura identificada. Endpoints antigos de detalhe conservam autorização/idempotência sem efeito temporal; locks vazio mantido no DTOv1.
- Notebook ADMIN continua único para controles. Blur/visibilidade/hashchange/minimização não enviam pausa;pagehide libera a posse sem pausar. Lease6 s vence sem parar motor;validade também é verificada nos comandos. Outro ADMIN reassume sem reset ou retomada automática de pausa manual. Interrupção real>5 s monotônica OU civil pausa sem consumir o intervalo;ADMIN retoma explicitamente. Mobile não tem motor temporal. Standalone preserva sua política anterior de foco.
- Erro SSE/ausência prolongada de heartbeat: banner SEM CONEXÃO COM O ORQUESTRA e espera/desatualização, estado congelado, retry/backoff e bootstrap completo. Reconexão com aviso breve; revisões antigas/duplicadas ignoradas. Credenciais ausentes de URLs/logs públicos/Git.
- Seleção visual: até2 classes prioritárias distintas; correspondência nos eventos auditados, nova condição Vermelha/elevação Laranja/status importante/novo prioritário/conclusão relevante. Empate determinístico por novo Vermelho e ID. Texto5 s; elevação700 ms×2; conclusão1,4 s; FLIP cancelável; reduced-motion preservado. Sem replay por heartbeat/refresh/reconexão/entrada tardia/aba/salto/ciclo novo. Um indicador realmente alterado destacado por transição.21 chamados destacados em11 transições; tabela/evidências no relatório.

## Validação da etapa anterior

**512 testes distintos aprovados nesta sessão=495 Node/navegador+17 Python,zero falhas/cancelamentos/skip.** Suíte integral final295,55 s;14 casos novos sobre os498 da etapa anterior,sem dupla contagem. Build e os dois importadores --check novamente aprovados;aviso conhecido de chunks>500kB. Testes incluem controle exclusivo/reassunção sem pausa,foco/visibilidade/reabertura ADMIN,pausas explícitas,interrupção monotônica/civil,X/Y/sem predominância/elegibilidade e Light/Dark. Ensaio nativo final aprovado em335.997 s,T00–T11→T00,dois visitantes;troca para xmessage/Edge,minimização X11 confirmada,fechamento/reabertura ADMIN e perda/reassunção real do lease,zero pausas inesperadas/errosJS. [Journal](produto/evidencias/continuity-2026-10-23/journal.json),[TAP](produto/evidencias/continuity-2026-10-23/final.tap).170 arquivos protegidos iguais ao HEAD e nenhum arquivo local prévio removido. Logs de trabalho em /tmp/orquestra-continuity-final;novas evidências duráveis em produto/evidencias/continuity-2026-10-23. Resultados da adequação anterior permanecem históricos em next-2026-10-23.

Ensaios HTTP/SSE até40 visitantes mais leitor lento,11 transições,heartbeat em rajada,backpressure e reconexão. Fila<=1 estado pendente/stream; sem erros de autorização na carga. A regressão atual reexecutou os mesmos ensaios de carga;resultados atuais em continuity-2026-10-23/performance.json,sem reutilizar valores antigos como nova medição; loopback e RSS do processo com clientes simulados não garantem rede física,40 navegadores renderizados ou seis horas de estabilidade.

Evidências anteriores preservadas em `docs/produto/evidencias/next-2026-10-23`;nova revisão em `docs/produto/evidencias/continuity-2026-10-23`,build/logs de trabalho em `/tmp/orquestra-continuity-final`. Capturas Light/Dark390×844,tablet768×1024,BackOffice1366×768; dois visitantes lendo T03 durante operaçãoT04,novo/criticidade/status/conclusão/desconexão/recuperação. Inspeção visual realizada. Homologação e ensaio físico permanecem pendentes.

## Homologação local e segurança operacional

Nova instância anunciada e iniciada nesta sessão,porta5198 inicialmente livre,IP Wi-Fi192.168.0.3. PID85718,sessão1345a7f0-7410-4bf1-b943-3825b8e071fc; serviço conferido T00pausado e entry asset igual ao build validado. Não presumir ativo em retomada; conferir PID/porta antes de intervir. Não há autostart e /tmp é efêmero.

- [BackOffice ADMIN](http://192.168.0.3:5198/OrquestraNEXT/?modo=feira)
- [Supervisor visitante](http://192.168.0.3:5198/OrquestraNEXT/?modo=supervisor-feira)

Metadados sanitizados `/tmp/orquestra-continuity-final/service.json`; códigos somente `/tmp/orquestra-continuity-final/private/pairing.json`,dir0700/arquivo0600. Não copiar valores ao chat/documentação/URL/Git. Operador consulta o arquivo privadamente,pareia ADMIN,assume controle,inicia. Mesmos cookies/IP não são isolados por porta; usar perfis separados se houver outra bancada. Janela inicial30 min; validade de sessão pareada6 h. Após expirar o código,novo pareamento exige reinício deliberado da instância correta; conferir uso e avisar operador,pois reiniciar invalida sessões existentes. Instância anterior5196 preservada;nenhum processo do usuário foi encerrado. Somente janelas/perfis/processos próprios dos ensaios foram operados/encerrados.

Rede Arena: confirmar client isolation,captive portal,portaTCP5198,DHCP/IP e comunicação entre dispositivos. Alternativa com roteador dedicado/SSID restrito/IP reservado,sem mudar automaticamente rede/firewall/roteador. HTTP não cifra tráfego/cookies; rede confiável dedicada e dados sintéticos. Não expor serviço à internet pública.

Roteiro físico no relatório: notebook+dois celulares,Light/Dark,12 estados/1×/2×,consultas simultâneas em fotografias diferentes,atualização explícita,Wi-Fi perdido/reconectado,refresh,revogação e expiração controlada. Contextos no PC não substituem aparelhos reais.

## Próxima ação

Commit/push autorizado e executado somente na feature/modo-feira conforme estado vigente acima. PR futuro para main depende de autorização; antes da integração,revisar CSS sobrepostos e repetir regressão sobre o resultado integrado em trabalho autorizado. Sem merge/rebase/force-push/deploy ou nova funcionalidade.

## Comandos e runtime

Node `/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`; Python `/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3`. Playwright já fornecido no node_modules desse runtime e `/usr/bin/google-chrome`; openpyxl existente. Nenhuma instalação.

Build `npm run build -- --outDir /tmp/orquestra-continuity-final/dist`. Regressão `CHOKIDAR_USEPOLLING=true ORQUESTRA_TEST_DIST=/tmp/orquestra-continuity-final/dist node-do-runtime --test --test-concurrency=4 --test-reporter=tap tests/*.test.mjs`. Python `-B tests/importacao-dados.test.py`, `-B tests/importacao-feira.test.py`, scripts/import_orquestra.py e scripts/import_feira_estendida.py `--check`. O ensaio básico anterior feira-sync-endurance.mjs permanece disponível;para esta revisão usar o ensaio nativo descrito abaixo. Portas/Chrome requerem execução apropriada fora do sandbox; não contar arquivos agrupados como casos.

Linguagem vigente: “O que o histórico sugere”, orientação condicional, percentual histórico e botão “Ver evidências técnicas” inicialmente recolhido com casos/N/período/fonte. Elegibilidade,denominador,predominância e Fechamento original preservados. Exemplos reais:CH-003/T00,“Verificar o sensor de porta”,16 dos16 semelhantes;CH-002/T00,sensor,14 dos14;CH-005/T00,parâmetros do inversor,11 dos11. Sem suporte:indicação histórica consistente não identificada;emergências preservam ação prioritária.

Energia Ubuntu lida nesta sessão:AC e bateria suspendem após1200 s;apagamento de tela300 s. Recomendar ajuste manual de suspensão durante a feira,alimentação externa,tampa aberta e Node ativo. Nenhuma configuração permanente foi alterada e nenhum suspend real foi provocado.

Ensaio nativo: `ORQUESTRA_NATIVE_ENDURANCE=1 ORQUESTRA_CONTINUITY_EVIDENCE=/tmp/orquestra-continuity-final/native-final ORQUESTRA_TEST_DIST=/tmp/orquestra-continuity-final/dist node-do-runtime tests/feira-continuity-endurance.mjs`. Chrome/Edge/xmessage em janelas/perfis próprios;helperX11 somente com ID de janela identificada pelo ensaio. Não opera janelas do usuário. Firefox falhou no perfil isolado;Edge instalado usado como alternativa.
