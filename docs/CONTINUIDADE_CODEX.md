# ORQUESTRA — continuidade oficial

Único ponto de retomada. Leia [AGENTS.md](../AGENTS.md), A–I e somente as referências da tarefa. Relatórios guardam evidências/histórico; não reproduzir transcrições aqui.

## Atualização de retomada — 23/10/2026

Pedido atendido: alinhar a página Equipamentos à base visual de Contratos e Custos, sem alterar estrutura ou conteúdo. Alterado somente `src/platform/pages/EquipamentosPage.module.css`; JSX, dados, regras e comportamento não foram modificados. `npm run build` aprovado; aviso já conhecido de chunk acima de 500 kB. Equipamentos e Contratos foram comparadas visualmente no Vite local em 1366×768 na revisão anterior; para esta complementação não houve nova comparação em navegador. Homologação do usuário e testes funcionais não realizados.

Checkout observado: raiz `C:\\Users\\maria\\OrquestraNEXT`, HEAD `58802adcaf2ee520b56da2c3bb38d2d02a26e4a5`, sem branch ativa. Permanecem modificações locais em EquipamentosPage.module.css, PecasPage.module.css, SlaCriticidadePage.module.css e TecnicosPage.module.css; apenas a primeira foi alterada nesta tarefa, sem limpar ou substituir as demais. Sem autorização de commit, push ou deploy. Próxima ação: aguardar avaliação do usuário sobre o alinhamento visual.

## Atualização documental — 20/10/2026

Pedido atual: documentar todo o projeto, publicar a documentação no GitHub e indicar onde ajustar cards/espaçamentos. README revisado e guias [técnico](tecnica/guia-projeto.md) e [visual](tecnica/guia-estilos.md) adicionados; índice/backlog atualizados. Base verificada `0063467`, branch `feature/modo-feira`, árvore inicialmente limpa. Escopo autoriza commit/push destes documentos para a mesma branch, sem merge ou deploy do site. Verificação: links locais, diff e coerência; sem nova execução de testes/build por não haver alteração funcional. Próxima ação autorizada: publicar os documentos e confirmar o SHA remoto; demais homologações permanecem pendentes. O registro Git comprova o resultado da publicação.

## A. Identificação e Git

- Atualização: **20/10/2026**, America/Sao_Paulo. US14.13/US15:foco inicial em Alertas e pulsos por nova criticidade/status implementados localmente;480 testes distintos validados,build/dois --check aprovados;homologação pendente. Janela anterior avaliada positivamente pelo usuário;isso não homologa esta revisão de movimentos/ciclo completo.
- Raiz:`/home/p2dutra/Documents/ChatGPT/Projeto_Challenge_OTIS/OrquestraNEXT`.
- Branch **feature/modo-feira**. Base anterior ao registro de pulsos:**64703c6757b7eabece1f44b422aee4abb95940ce**,já enviada ao origin. Revisão atual registrada no commit `feat: destaca mudancas e prioriza alertas do supervisor`;SHA consultável com `git log -1 --format=%H`. Usuário autorizou commit e envio a origin/feature/modo-feira;main/next-evolucao intactas. Conferir sincronização com Git após o push.
- Revisão de pulsos:fonte/testes/documentação/evidências incluídos no registro autorizado;trabalho preservado. Sem reset/clean/stash/troca de branch.
- Pedido atual autoriza commit e push desta revisão na feature/modo-feira. Não autoriza merge/publicação do site,autenticação/QRCode/datasets ou outras funcionalidades. Testes não substituem homologação visual/física.

- Referência homologada C8: commit funcional8134059; documentação240253d enviada à feature/next-evolucao. Origin configurado HTTPS SinfoniaTech/OrquestraNEXT. Sem nova consulta remota nesta entrega; não inferir sincronização atual pelo cache local.
- Última publicação comprovada: Pages gh-pages547db4d8124160521ae9dd1aa00f5a1157929bac; maina350cd0. origin/gh-pages local429d377 é referência antiga. [Publicação C8](produto/publicacao-controlada-c8.md).

## B. Entrega atual e autorizações

Demonstrador acadêmico FIAP Challenge/NEXT; dados sintéticos e indicadores explicáveis. Nove páginas BackOffice funcionais até C8; três pendentes. **A nova apresentação é a entrada padrão pretendida. A apresentação antiga continua preservada em ?modo=legado.** Implementado localmente, sem publicação desta mudança.

**Escopo vigente:**Supervisor inicia em Alertas;mudança de criticidade tem2 pulsos suaves na nova cor BASE,status é destacado separadamente,novos entram suavemente e concluídos têm saída visual breve sem permanecer ativos. Sem replay por heartbeat/abas/entrada tardia/reconexão;movimento reduzido respeitado e mudanças também textuais. Sem popup automático ou redirecionamento após escolha manual de aba. [Relatório atual](produto/entrega-c92-feira-estendida.md#foco-em-alertas-e-pulsos-por-mudança--20102026). Histórico/avisos/pausa existentes preservados;autenticação/QRCode/resumo na aba Chamados seguem pendentes.

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

**Revisão de foco/pulsos atual:**480 distintos validados=463 Node/browser+17 Python. Execução integral462/463;um teste antigo pressupunha Chamados após refresh. Apenas navegação do teste ajustada e suíteC9.1 reexecutada13/13 aprovada;sem fonte funcional nova após build.8 novos casos específicos aprovados. Build/dois --check e124 arquivos protegidos aprovados;656 amostras de texto,mínimo≈4.63:1. Dois clientesLAN em5194:T03pausado1×,pulsos registrados,1open/1close,locks0,zero errosJS;entry asset conferido. [Resultados/provas atuais](produto/entrega-c92-feira-estendida.md#foco-em-alertas-e-pulsos-por-mudança--20102026). Para ver próximas mudanças,retomar pelo notebook. Homologação desta revisão pendente;marcos abaixo históricos.

**Marco anterior — apoio histórico:**472 distintos aprovados=455 Node/browser+17 Python,zero falhas/skip/cancelamentos;8 novos testes de histórico,build e dois --check aprovados.32 casos específicos também reexecutados,sem dupla contagem. Capturas Laranja/Vermelho/emergência Light/Dark390×844/tablet768×1024 e rastreabilidade no detalhe;656 amostras de texto,mínimo≈4.63:1.124 arquivos protegidos iguais ao HEAD. Serviço5194 com dois clientesLAN:T03pausado1×,locks0,1open/1close,zero errosJS;entry asset idêntico ao build validado. [Relatório/provas atuais](produto/entrega-c92-feira-estendida.md#histórico-como-apoio-ao-diagnóstico--19102026). Homologação pendente;marcos abaixo históricos.

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

A comparação visual da página Equipamentos com Contratos foi concluída em navegador, em 1366×768; a presente complementação incorporou também a tipografia e os cards de sugestões de Custos, sem nova comparação em navegador. Aguardar avaliação do usuário. A árvore segue com modificações locais nas folhas de estilo de Equipamentos, Peças, SLA/Criticidade e Técnicos. Sem commit/merge/push/deploy ou nova história sem orientação. A homologação visual/física da revisão Supervisor Feira descrita abaixo também continua pendente; veja o relatório C9.2 antes de retomá-la.

Prompt compacto:

> Retome ORQUESTRA em C:\Users\maria\OrquestraNEXT. Checkout observado em HEAD 58802adc, sem branch ativa; preserve alterações locais. EquipamentosPage.module.css recebeu alinhamento visual com Contratos e Custos, sem mudanças de JSX/conteúdo; build aprovado, complemento sem revisão de navegador. Não faça commit/push/deploy. Supervisor Feira C9.2 também aguarda homologação; consulte relatório correspondente antes de retomar esse escopo.

## I. Ambiente e comandos

Conferência20/10:Wi-Fi192.168.0.3. Porta5194 livre antes da inicialização;somente esta instância verificada ativa agora. Portas5180/5182/5184/5186/5188/5190/5192 sem listener;referências19/10 permanecem nos relatórios,não presumir processos ainda ativos. Conferir IP ao mudar para hotspot.

| Porta | Artefato/processo verificado | Situação |
| --- | --- | --- |
| 5194 | `/tmp/orquestra-pulsos/dist`,PID23514,sessão619f37be | **Revisão de foco/pulsos atual**,mesmo endereço,novo pareamento;T03pausado1× após ensaio de dois clientes |

**Endereços atuais:** http://192.168.0.3:5194/OrquestraNEXT/?modo=feira (ADMIN/notebook) e http://192.168.0.3:5194/OrquestraNEXT/?modo=supervisor-feira (SUPERVISOR/mobile). Novos códigos em arquivo efêmero privado(dir0700/arquivo0600),fora do Git/logs/HTTP;metadados locais `/tmp/orquestra-pulsos/service.json` indicam caminho/PID/sessão. Códigos permitem novo pareamento por30min desde início;abas pareadas continuam enquanto a instância existir. Não copiar seus valores ao chat público/URLs/documentos. Código expirado exige reinício deliberado da instância correta,após conferir uso/avisar,sem reduzir autenticação. Launcher temporário desacoplado no mesmo diretório;log sanitizado,sem códigos.

Notebook deve parear ADMIN,Assumir controle,Retomar. SUPERVISOR no notebook é somente leitura. Abrir detalhe exige ACK/pausa global;fechar não retoma. Desfocar/ocultar notebook pausa;retorno exige retomada explícita. Dev5173/5175 e Pages não substituem serviço autoritativo local. Standalone é independente. Público C8 previamente comprovado:https://sinfoniatech.github.io/OrquestraNEXT/;nenhum deploy destas revisões.

**Recuperação após reiniciar Ubuntu:** não há autostart;/tmp é efêmero. Conferir IP com `ip -4 -brief address` e listener com `ss -ltnp '( sport = :5194 )'`;não encerrar outro processo. Se porta livre e inicialização autorizada,executar no terminal privado do operador(ajustar IP):

```bash
cd /home/p2dutra/Documents/ChatGPT/Projeto_Challenge_OTIS/OrquestraNEXT
npm run build -- --outDir /tmp/orquestra-pulsos/dist
npm run feira:local -- --host 192.168.0.3 --port 5194 --dist /tmp/orquestra-pulsos/dist
```

CLI mostra novos códigos só no terminal privado;não redirecionar sua saída a logs públicos. Deixar terminal aberto;Ctrl+C encerra esse processo. Instância atualmente desacoplada com nohup/setsid;isso não configura inicialização automática.

**Runtime existente:** Node `/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`;Playwright no node_modules desse runtime;Chrome/usr/bin/google-chrome. Python `/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3`,openpyxl existente. Sem instalação.

**Validação reproduzível:** build no diretório acima;`CHOKIDAR_USEPOLLING=true ORQUESTRA_TEST_DIST=/tmp/orquestra-pulsos/dist node-do-runtime --test --test-concurrency=4 --test-reporter=tap tests/*.test.mjs`,com ORQUESTRA_*_EVIDENCE em diretórios temporários próprios,ORQUESTRA_THEME_EVIDENCE para os temas. Python -B nos dois tests/importacao-*.test.py e nos scripts/import_orquestra.py/import_feira_estendida.py com --check. [Comandos/resultados detalhados](produto/entrega-c92-feira-estendida.md#alertas-simplificados-e-temas-lightdark--19102026). Portas/Chrome podem exigir execução real fora do sandbox;não confundir agrupamento de arquivos com contagem de casos,nem executar suítes de portas fixas em paralelo. Evidências duráveis em docs/produto/evidencias;/tmp não é backup.


**Limites operacionais adicionais verificados:** legado depende de fonte externa bloqueada pela CSP do serviço conectado;mesmo erro reproduzido na instância anterior5186. Originais preservados e regressão no preview estático;não corrigido fora do escopo. Referências capturadas no preview com fallback tipográfico local. Cookies de pareamento têm mesmo nome/path no IP,portas não os isolam:para homologar5194 preservando outras sessões,use janela anônima/perfil separado. [Detalhes/provas](produto/entrega-c92-feira-estendida.md#alertas-das-cenas-3-7-e-10--19102026).

**Pareamento atual:**novo serviço20/10 na porta5194,códigos privados efêmeros indicados em `/tmp/orquestra-pulsos/service.json`;novos acessos mantêm janela de30min. Quem já pareou continua enquanto a instância existir. QRCode/acesso contínuo seguem pendentes.

**Pendência de navegação confirmada com o usuário:**Chamados ainda abre diretamente a ficha completa;Alertas abre o aviso resumido. Uniformizar Laranja/Vermelho nas duas abas foi discutido,mas não implementado neste commit. QRCode/acesso contínuo também permanecem pendentes.
