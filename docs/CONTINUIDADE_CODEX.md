# ORQUESTRA — continuidade oficial

Único ponto de retomada. Leia [AGENTS.md](../AGENTS.md), A–I e somente as referências da tarefa. Relatórios guardam evidências/histórico; não reproduzir transcrições aqui.

## A. Identificação e Git

- Atualização: **19/10/2026**, America/Sao_Paulo. US14.13/US15:novo apoio histórico implementado localmente nos alertas Supervisor e cartões/detalhes Feira;472 testes/build/dois --check aprovados. Homologação visual/física pendente;nova instância5194;anteriores preservadas.
- Raiz: `/home/p2dutra/Documents/ChatGPT/Projeto_Challenge_OTIS/OrquestraNEXT`.
- Branch **feature/modo-feira**. Base anterior ao registro histórico: **53c65547ca519f68a07a01d69ce7f2e388697c0d**,já enviada a origin/feature/modo-feira. Esta revisão integra o commit local `feat: adiciona apoio historico aos alertas da feira`;obtenha seu SHA com `git log -1 --format=%H`. Sem push deste registro;main/next-evolucao intactas.
- Revisão histórica registrada localmente por autorização explícita do usuário: UI/modelo/testes/documentação/evidências revisados e preservados. Sem reset/clean/stash/troca de branch.
- Pedido atual autoriza somente o commit desta revisão existente. Sem merge/push/deploy ou alteração de autenticação/datasets. Homologação pendente não é presumida pelo registro.

- Referência homologada C8: commit funcional8134059; documentação240253d enviada à feature/next-evolucao. Origin configurado HTTPS SinfoniaTech/OrquestraNEXT. Sem nova consulta remota nesta entrega; não inferir sincronização atual pelo cache local.
- Última publicação comprovada: Pages gh-pages547db4d8124160521ae9dd1aa00f5a1157929bac; maina350cd0. origin/gh-pages local429d377 é referência antiga. [Publicação C8](produto/publicacao-controlada-c8.md).

## B. Entrega atual e autorizações

Demonstrador acadêmico FIAP Challenge/NEXT; dados sintéticos e indicadores explicáveis. Nove páginas BackOffice funcionais até C8; três pendentes. **A nova apresentação é a entrada padrão pretendida. A apresentação antiga continua preservada em ?modo=legado.** Implementado localmente, sem publicação desta mudança.

**Escopo vigente:**apoio histórico nos alertas Supervisor e cartões do Modo Feira. Possível solução citada com n/N de concluídos compatíveis anteriores à referência;fallback fundamentado quando insuficiente. Emergências mantêm ação prioritária no aviso,histórico só no detalhe. Mesmo equipamento só com vínculo cliente/unidade;dados atuais só permitem similares,declarados. Sem alegar diagnóstico/causa/probabilidade. [Relatório atual](produto/entrega-c92-feira-estendida.md#histórico-como-apoio-ao-diagnóstico--19102026). Autenticação/QRCode/acesso contínuo ainda não implementados.

**Resultado funcional:** aba Alertas espera ACK para abrir aviso compacto;`Ver detalhes` abre a ficha completa em transição local. Voltar/Escape retorna ao resumo com mesmo lock;`Fechar`/X/Escape libera lock e mantém pausa. Chamados mantém abertura direta da ficha. Texto do cabeçalho distingue prazo de emergência por impacto,sem inventar SLA/impedimento. Temas automáticos e fontes locais preservados. [Contrato atual](tecnica/pontos-integracao-supervisor.md#aviso-compacto--orientação-vigente-de-19102026).

**Entrega anterior preservada — US06:** raiz e ?modo=apresentacao abrem Visão Geral sem login/API local; guia manual de nove etapas com Voltar/Avançar/Início; telas/serviços/filtros/detalhes atuais reutilizados. Plataforma mantém login demo/12 destinos; menu de apresentação só contém9 telas funcionais. SceneController lazy exclusivo em ?modo=legado; temporizadores originais não montam no novo modo. Seletor informa fontes e dependência local do Supervisor; sem sincronização pública fictícia. Modos inválidos não retornam ao legado. [Contrato/roteiro](produto/modos.md), [arquitetura](tecnica/arquitetura-atual.md), [relatório atual](produto/entrega-apresentacao-padrao.md). UI Supervisor anterior continua íntegra; seu relatório permanece como evidência própria.

## C. Situação das entregas

| Escopo | Implementado/testado | Homologado | Versionado/publicado |
| --- | --- | --- | --- |
| Dados/A/B e C1–C7 | Funcionais; marcos nos relatórios | Aceites e limites no backlog | Commits atéa5aea32 |
| C8 Peças | 292 testes no marco; build/importador | Sim, continuidade |8134059 + docs240253d; Pages547db4d |
| C9 temporal | Standalone e motor configurável | Visual pendente | Commit local desta revisão; sem publicação |
| C9.1 sincronização | Autoridade Node/SSE/POST, dois clientes | Física completa pendente | Commit local desta revisão; sem publicação |
| C9.2 estendida | T00–T11; marco400 testes/build/dois importadores | Dados e avanço físico conjunto aceitos parcialmente; ciclo/pausa/reconexão/WAN pendentes | Commit local desta revisão; sem publicação |
| UI Supervisor Feira / alertas | Fluxo lista/resumo/completo conforme cenas3/7/10;464 testes/build/dois importadores aprovados | **Pendente** | Commit local desta revisão; sem publicação |
| Nova apresentação padrão / US06 | Implementada;439 testes/build/dois importadores aprovados | **Pendente** | Commit local desta revisão; sem publicação |

Testes não homologam nem publicam. [Backlog oficial](produto/backlog.md), [sequência](produto/plano-incremental.md), [índice](README.md).

## D. Arquitetura e fronteiras

- React19.3/Vite8.3, JSX/CSS Modules. App/resolveMode escolhe nova apresentação padrão/explicita,Plataforma,legado lazy,Feira ou Supervisor. BackofficePlatform recebe presentation=true e mantém ConsultationProvider existente; guia só altera hashes nomeados por ação manual. Sem controlador de cenas no novo modo.
- Original: Supervisor/dez cenas/controlador/fixtures/styles/timers/teclado/hashes#/1–#/10 preservados em ?modo=legado. Links antigos do shell/Feira passam ao namespace explícito; testes adaptam somente o ponto de entrada. US19 ponte contextual continua pendente.
- Plataforma: serviços em src/platform; dados imutáveis src/data/orquestra. ConsultationProvider,13 filtros compartilhados, contexto em memória. Padrões & Insights, Contratos—BackOffice e Integrações pendentes.
- Conectado: server/feira-session.mjs contém único motor; feira-server.mjs serve build/API same-origin. SSE completo + POST autenticado/CSRF/revisões/idempotência/roles/lease. Cliente src/feira/sync só mede conectividade, nunca avanço operacional.
- SyncedFeiraApp mantém pareamento/comandos/locks. SupervisorFeira recebe DTO; componentes visuais isolados em src/feira/supervisor; Dialog/StatusBadge puros e logo reutilizados. Somente SVGs puros de views/supervisor/components/icons.jsx reutilizados;sem componentes/fixtures/hooks/timers do tutorial.
- Selecionar alerta → POST open-detail → ACK/fotografia/pausa global → resumo. Completo e retorno ao resumo são transições locais com o mesmo lock;fechar resumo envia close-detail e mantém pausa. Chamados mantém ficha direta. Falha não abre conteúdo;reinício invalida a seleção. Só notebook autorizado retoma.
- CSS .theme somente no ramo mobile do SyncedFeiraApp;primitivos compartilhados preservados por estilos descendentes,sem tema global. Mudança de preferência só recalcula CSS,não reinicia componentes de sincronização.
- UI não altera ordenação/cores BASE, contrato de dados ou motor. Alertas somente ativos Laranja/Vermelho. Animações respeitam reduced-motion e não usam roteiro temporal. Sem ações reais de estoque/despacho/telefone.

## E. Dados e regras

- HIST_60_DIAS:736 registros/46 campos, referência06/10/2026 22h São Paulo; períodos civis inclusivos por criação. T0/T1/T2:10/16/24, separados do histórico e fixtures.
- C9.2: XLSX estendido aprovado,12 fotografias T00–T11/417 registros/55 IDs/189 eventos. Substituição integral, sem soma/interpolação. Horário discreto08h–17h;12×27s +12s finais=336s1×/168s2×. Série original também coberta em regressão.
- Nova sessão conectada iniciaT00 pausada. Standalone autostart próprio, sem sincronização. Celular/notebook conectado usam mesmo IP/porta.
- Verde/Amarelo/Laranja/Vermelho são BASE independentes de SLA. Não equivalem automaticamente às prioridades do tutorial. Concluído conserva cor histórica e sai dos alertas ativos.
- TA=chegada−abertura; TB=resolução técnica simulada−chegada. Valores sintéticos materializados; encerramento técnico não persistido e não reconstruído. Saída inclui permanência adicional. Zero válido; nulos excluídos das médias, N próprio.
- Percentual_SLA é fração; aderência: Concluído, SLA_min>0, consumo finito>=0, cumpre<=1. Não inferir pausas ou prazo real. Exceção desta revisão: restante sintético CALC apenas quando fração, duração e abertura são consistentes na referência, conforme contrato dos alertas; nunca TA/TB ou relógio do cliente. ETA do técnico não é previsão atualizada após chegada/conclusão. Eventos futuros ocultos pela projeção existente.
- Recorrência materializada não soma eventos únicos; elevada C2/C6=unidade com algum valor>=3. Custos associados são estimados dos chamados, sem salário/peças consumidas/margem real.
- BASE/CALC/EXT, população/N/nulos/fonte explícitos. Estoque/logística/pessoal/localização/capacidade/finanças reais são EXT sem valores inventados. [Dicionário](dados/dicionario.md), [explicabilidade](produto/explicabilidade-ext.md), [contrato C9.2](produto/modos.md).

## F. Validação e evidências

**Revisão histórica atual:**472 distintos aprovados=455 Node/browser+17 Python,zero falhas/skip/cancelamentos;8 novos testes de histórico,build e dois --check aprovados.32 casos específicos também reexecutados,sem dupla contagem. Capturas Laranja/Vermelho/emergência Light/Dark390×844/tablet768×1024 e rastreabilidade no detalhe;656 amostras de texto,mínimo≈4.63:1.124 arquivos protegidos iguais ao HEAD. Serviço5194 com dois clientesLAN:T03pausado1×,locks0,1open/1close,zero errosJS;entry asset idêntico ao build validado. [Relatório/provas atuais](produto/entrega-c92-feira-estendida.md#histórico-como-apoio-ao-diagnóstico--19102026). Homologação pendente;marcos abaixo históricos.

**Marco anterior — avisos compactos:**464 distintos aprovados nesta execução=447 Node/browser+17 Python,zero falhas/skip/cancelamentos;build/dois --check aprovados.15 casos específicos também repetidos,sem dupla contagem. Botões `Ver detalhes`/`Fechar`,um resumo sem barra/badges,capturas Light/Dark390×844 e768×1024;638 amostras de texto,mínimo≈4,63:1.197/199 fontes/serviço/dados preservados;apenas Parts/CSS alterados nesta revisão. Serviço5192 com dois clientesT03pausado1×,locks0,1open/1close,zero erros JS. [Resultados/telas atuais](produto/entrega-c92-feira-estendida.md#avisos-compactos-conforme-imagens-do-usuário--19102026). Abaixo,marcos anteriores históricos.

**Marco anterior — revisão visual oficial:**464 testes reexecutados=447 Node/browser+17 Python,zero falhas/skip/cancelamentos;build e dois --check aprovados. Cards compactos conforme Cena3,comparações reais cenas3/7/10 em390×844 Light/Dark;624 amostras de texto,mínimo≈4,63:1. URLs públicas também renderizadas. Serviços anteriores preservados;5190 testado com dois clientes atéT03pausado1×,locks0,um open/um close,zero erros JS. [Relatório/provas atuais](produto/entrega-c92-feira-estendida.md#implementação-visual-oficial--19102026). Marco anterior abaixo permanece histórico.

**Revisão atual conforme cenas3/7/10:464 distintos aprovados=447 Node/browser+17 Python,zero falhas/skip/cancelamentos.**3 novos casos de fluxo além dos461 anteriores,mais adaptações dos testes do resumo/temas. Suíte completa repetida no build final após ajustes de paleta/contraste;build e dois importadores --check aprovados.100 ciclos UI/20 sincronizados/12 estados/ACK/pausa/reconexão/entrada tardia/ESM/BackOffice/legado preservados.195 arquivos fonte/serviço/dados protegidos por SHA-256;apenas4 arquivos UI autorizados modificados,SVGs originais intactos.510 amostras de texto,mínimo≈4,63:1. Capturas reais390×844 Light/Dark,Laranja/Vermelho/impacto e cinco passos do fluxo;tablet768×1024 e referências originais3/7/10 no preview estático. [Resultados/comandos/capturas](produto/entrega-c92-feira-estendida.md#alertas-das-cenas-3-7-e-10--19102026). Serviço5188 ensaiado com dois clientes:T03/10:15,27 registros/9 alertas,pausado1×,locks0,um comando de abertura e um de fechamento,zero erros JS. Homologação física/visual pendente,não presumida pelos testes.

**Marco anterior Light/Dark:461 distintos aprovados=444 Node/browser+17 Python,zero falhas/skip/cancelamentos.**11 novos sobre450 anteriores,que incluem a nova apresentação e legado. Suíte completa terminou durante a interrupção administrativa;na retomada foram conferidos resultados,integridade do trabalho e correspondência código/build. Nenhuma alteração funcional posterior exigiu nova execução. Build209 módulos e dois importadores --check aprovados;aviso conhecido de chunk>500kB mantido.

Cobertura:100 ciclos UI/20 sincronizados/12 estados/ACK/pausa/reconexão/entrada tardia,cores BASE/EXT,temas dinâmicos sem remontar DOM/Dialog ou reiniciar POST/SSE,BackOffice/Plataforma/Supervisor original/dez cenas.193 arquivos fonte/servidor/dados protegidos por SHA-256;apenas6 arquivos visuais autorizados modificados. Capturas reais390×844 Light/Dark para lista,Laranja,Vermelho,detalhe e emergência;tablet768×1024.648 amostras de texto(com repetições),mínimo≈5,69:1;critério do teste4,5:1,não auditoria integral de acessibilidade. [Comandos/logs/capturas/estado recuperado](produto/entrega-c92-feira-estendida.md#alertas-simplificados-e-temas-lightdark--19102026).

Marcos anteriores450/439/417/400 e diagnósticos permanecem nos relatórios C9.2/nova apresentação. Testes não homologam nem publicam. Nesta retomada,HTTP e listener5186 reconferidos;mesma sessão/T03/paused1×,sem controlador/locks,pareamento privado0600. Não repetir ensaio físico como concluído.

## G. Pendências e limites

- Homologação visual dos alertas/Light-Dark conforme cenas3/7/10 em5192 e da nova apresentação em5182;publicação pública depende de autorização posterior. Ensaio físico completo: ciclo, detalhe/pausa, retomada notebook, reconexão/refresh/entrada tardia e LAN sem WAN.
- Usuário já confirmou controles e avanço conjunto em etapa anterior; isso não homologa esta UI ou o ciclo completo.
- Serviço HTTP local usa rede dedicada; autenticação demo, sem uso corporativo presumido. Sem regras permanentes de rede modificadas.
- Offline somente após carga, sem service worker. Fontes/assets do Supervisor Feira locais; apresentação original conserva suas dependências históricas. Aviso de bundle grande persiste.
- Problema antigo de inicialização: Vite servia chamados.js vazio embora export em disco correto; reinício resolveu, gatilho indeterminado. [Diagnóstico](produto/correcao-inicializacao-c7.md). Não inventar exportações/correções sem comparar resposta efetivamente servida.

## H. Próxima ação

Homologar os novos avisos e o apoio histórico no Supervisor/Feira,Light/Dark,mobile/tablet. Abrir porta5194 e parear em perfil separado;instâncias e pareamentos anteriores preservados. Conferir hipótese/ocorrências/fonte no detalhe,urgência por SLA e emergência,pausa/retorno. Commit desta revisão autorizado;sem merge/push/deploy ou outra história sem orientação. QRCode e remoção da expiração para novos acessos seguem discutidos,não implementados.

Prompt compacto:

> Retome ORQUESTRA na raiz habitual. Leia AGENTS.md/continuidade e confira branchfeature/modo-feira,HEAD53c6554/Git. Apoio histórico nos alertas Supervisor e Feira registrado no último commit local;consulte relatório C9.2/contrato. Preservar fontes,datasets,motor,SSE/POST e originais. Homologação na nova instância5194;parear em perfil separado. Histórico de similares é hipótese rastreável,não diagnóstico. Aguarde homologação;sem novo commit/push/deploy ou autenticação/QRCode fora do escopo.

## I. Ambiente e comandos

Conferência19/10:Wi-Fi192.168.0.3. Não presumir IP/processos ativos na próxima sessão. Instâncias independentes;não misturar portas entre notebook e celular.

| Porta | Artefato/processo verificado | Situação |
| --- | --- | --- |
| 5194 | `/tmp/orquestra-historico/dist`,PID261174,sessão2b5fa4f8 | **Nova revisão com apoio histórico**;ensaios/capturas no relatório atual |
| 5192 | `/tmp/orquestra-alerta-compacto/dist`,PID202318,sessãob9b0f9c4 | Revisão compacta anterior,preservada;index em memória impede atualização sem reinício. Tentativa sem efeito documentada;novo build em5194 |
| 5190 | `/tmp/orquestra-visual-oficial/dist`,PID189940,sessãoe1584137 | Revisão visual anterior,preservada. Dois clientesT00→T03/10:15,27 registros/9 alertas;1 open-detail/1 close-detail,pausado1×,locks0,zero erros JS |
| 5188 | `/tmp/orquestra-alertas-cenas/final-dist`,PID173047,sessãoe6a673d5 | Revisão anterior conforme cenas3/7/10,preservada. Dois clientesT00→T03/10:15,27 registros/9 alertas;fluxo completo com1 open-detail/1 close-detail,pausado1×,locks0,zero erros JS |
| 5186 | `/tmp/orquestra-temas/dist`,PID133261,sessão93df6322 | **Revisão anterior Light/Dark,preservada;conexão ativa observada**. Dois clientes percorreram tempo real atéT03/10:15,27 registros/9 alertas;troca de tema/detalhe/pausa/fechar sem retomar,zero erros JS. Na retomada:mesma sessão,T03 pausado1×,sem controlador/locks;HTTP200 nas páginas/API sem pareamento401 |
| 5184 | `/tmp/orquestra-alertas/final-dist`,PID112023 | Revisão anterior dos alertas,preservada. Conferida antes da criação5186 emT08/paused/com controlador ativo;não reiniciada |
| 5182 | `/tmp/orquestra-apresentacao/dist`,PID98140 | Preview da nova apresentação,ativo/preservado |
| 5180 | `/tmp/orquestra-supervisor-fixed/dist`,PID85493 | Homologação Supervisor anterior,ativa/preservada |

**Endereços atuais:** http://192.168.0.3:5194/OrquestraNEXT/?modo=feira (ADMIN/notebook) e http://192.168.0.3:5194/OrquestraNEXT/?modo=supervisor-feira (SUPERVISOR/mobile). Novos códigos em arquivo efêmero privado(dir0700/arquivo0600),fora do Git/logs/HTTP;metadados locais `/tmp/orquestra-historico/service.json` indicam caminho/PID/sessão. Códigos permitem novo pareamento por30min desde início;abas pareadas continuam enquanto a instância existir. Não copiar seus valores ao chat público/URLs/documentos. Código expirado exige reinício deliberado da instância correta,após conferir uso/avisar,sem reduzir autenticação. Launcher temporário desacoplado no mesmo diretório;log sanitizado,sem códigos.

Notebook deve parear ADMIN,Assumir controle,Retomar. SUPERVISOR no notebook é somente leitura. Abrir detalhe exige ACK/pausa global;fechar não retoma. Desfocar/ocultar notebook pausa;retorno exige retomada explícita. Dev5173/5175 e Pages não substituem serviço autoritativo local. Standalone é independente. Público C8 previamente comprovado:https://sinfoniatech.github.io/OrquestraNEXT/;nenhum deploy destas revisões.

**Recuperação após reiniciar Ubuntu:** não há autostart;/tmp é efêmero. Conferir IP com `ip -4 -brief address` e listener com `ss -ltnp '( sport = :5194 )'`;não encerrar outro processo. Se porta livre e inicialização autorizada,executar no terminal privado do operador(ajustar IP):

```bash
cd /home/p2dutra/Documents/ChatGPT/Projeto_Challenge_OTIS/OrquestraNEXT
npm run build -- --outDir /tmp/orquestra-historico/dist
npm run feira:local -- --host 192.168.0.3 --port 5194 --dist /tmp/orquestra-historico/dist
```

CLI mostra novos códigos só no terminal privado;não redirecionar sua saída a logs públicos. Deixar terminal aberto;Ctrl+C encerra esse processo. Instância atualmente desacoplada com nohup/setsid;isso não configura inicialização automática.

**Runtime existente:** Node `/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`;Playwright no node_modules desse runtime;Chrome/usr/bin/google-chrome. Python `/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3`,openpyxl existente. Sem instalação.

**Validação reproduzível:** build no diretório acima;`CHOKIDAR_USEPOLLING=true ORQUESTRA_TEST_DIST=/tmp/orquestra-historico/dist node-do-runtime --test --test-concurrency=4 --test-reporter=tap tests/*.test.mjs`,com ORQUESTRA_*_EVIDENCE em diretórios temporários próprios,ORQUESTRA_THEME_EVIDENCE para os temas. Python -B nos dois tests/importacao-*.test.py e nos scripts/import_orquestra.py/import_feira_estendida.py com --check. [Comandos/resultados detalhados](produto/entrega-c92-feira-estendida.md#alertas-simplificados-e-temas-lightdark--19102026). Portas/Chrome podem exigir execução real fora do sandbox;não confundir agrupamento de arquivos com contagem de casos,nem executar suítes de portas fixas em paralelo. Evidências duráveis em docs/produto/evidencias;/tmp não é backup.


**Limites operacionais adicionais verificados:** legado depende de fonte externa bloqueada pela CSP do serviço conectado;mesmo erro reproduzido na instância anterior5186. Originais preservados e regressão no preview estático;não corrigido fora do escopo. Referências capturadas no preview com fallback tipográfico local. Cookies de pareamento têm mesmo nome/path no IP,portas não os isolam:para homologar5194 preservando outras sessões,use janela anônima/perfil separado. [Detalhes/provas](produto/entrega-c92-feira-estendida.md#alertas-das-cenas-3-7-e-10--19102026).

**Pareamento nesta revisão:**5194 dispõe de novos códigos efêmeros privados. Na instância anterior5192 o arquivo já expirou,sem invalidar cookies existentes. Tentativa de atualização sem reinício não mudou a UI antiga;índice restaurado e evidência marcada. Novos acessos continuam sujeitos a30min;QRCode/acesso contínuo seguem pendentes.

**Pendência de navegação confirmada com o usuário:**Chamados ainda abre diretamente a ficha completa;Alertas abre o aviso resumido. Uniformizar Laranja/Vermelho nas duas abas foi discutido,mas não implementado neste commit. QRCode/acesso contínuo também permanecem pendentes.
