# Nova apresentação padrão — US06

19/10/2026, America/Sao_Paulo. Implementação/testes/documentação autorizados; homologação visual, versionamento e publicação são gates distintos. **A nova apresentação é a entrada padrão pretendida. A apresentação antiga continua preservada e acessível pelo modo legado.** Nenhum commit/merge/push/deploy autorizado ou executado nesta entrega.

## Escopo e estado inicial

Raiz OrquestraNEXT, branch feature/modo-feira, HEAD240253d357560c5674e99bfccd7816632b388f29.12 rastreados já modificados, C9/C9.1/C9.2/Supervisor Feira/testes/documentos/evidências não rastreados, staging vazio. [Inventário inicial](evidencias/apresentacao-padrao-initial-git.txt). Trabalho anterior preservado; sem mudança de branch ou operações destrutivas.

Inspeção confirmou ausência de apresentação manual nova; App ainda montava SceneController por padrão. A Plataforma já fornecia as nove páginas funcionais, serviços, contexto e filtros necessários. Reutilizados via prop presentation, sem duplicar páginas/provedor/controladores, sem importar fixtures ou temporizadores do legado. US06 existente; não cria história, página ou ponte US19. [Contrato/roteiro](modos.md#entrada-padrão-atual--implementação-local-autorizada-em-19102026) e [arquitetura/decisão](../tecnica/arquitetura-atual.md#roteamento-atual--nova-apresentação-padrão-19102026) são as referências centrais, sem duplicação aqui.

## Resultado e arquivos desta entrega

- `src/App.jsx`: resolução explícita dos modos; raiz/apresentacao montam a nova experiência, legado lazy exclusivo; Feira/Plataforma/Supervisor mantêm fronteiras existentes.
- `src/modes.js`: whitelist, detecção de inválido/vazio/duplicado, URLs relativas e contrato de Feira conectada/independente.
- `src/presentation/itinerary.js`: nove etapas com IDs existentes e propósito demonstrativo; sem valores operacionais inventados.
- `src/presentation/PresentationBar.jsx`: Voltar/Avançar/Início, etapa e propósito, somente navegação manual por hash.
- `src/presentation/ModeMenu.jsx`, `Presentation.module.css`: seletor com limites/fontes, tratamento de modo inválido, layout responsivo isolado.
- `src/platform/BackofficePlatform.jsx`, `.module.css`: mesma infraestrutura de consulta/páginas; variante manual pública sem gravar sessão demo, menu de nove telas, guia; Plataforma livre mantém login/12 destinos. Cabeçalho mobile acomoda o seletor sem overflow.
- `src/feira/FeiraPanel.jsx`, `FeiraErrorBoundary.jsx`, `SyncedFeiraApp.jsx`: **somente links** denominados apresentação original passam a ?modo=legado#/1; sem alteração de motor/protocolo/pareamento/locks/DTO/política de pausas.
- `tests/apresentacao.test.mjs`, `apresentacao-browser.test.mjs`:22 novos casos. `tests/navegador-regressao.test.mjs`, `platform-shell.test.mjs`, `feira-browser.test.mjs`: somente entradas/assertions de URL do legado migradas; regressão original preservada.
- Documentação: modos/backlog/plano-incremental/arquitetura-atual/índice/continuidade/testsREADME e este relatório; evidências apresentacao-padrao-*.

O roteiro percorre as nove páginas homologadas até C8. Não inclui páginas pendentes ou décima tela fictícia. Não há integração pública de celular; o seletor explica a dependência do serviço autoritativo e a independência do legado. Feira estática mantém a experiência standalone já existente com aviso permanente; não se converte silenciosamente em cliente sincronizado. Nenhum novo mecanismo de sincronização, dado, relógio ou fórmula foi criado.

## Ambiente local de homologação

Preview estático próprio deixado em segundo plano na192.168.0.3:5182, PID98140, artefato `/tmp/orquestra-apresentacao/dist`. Comando equivalente: `npm run preview -- --host 192.168.0.3 --port 5182 --strictPort --outDir /tmp/orquestra-apresentacao/dist`, iniciado via nohup/setsid com Node do runtime; log temporário `/tmp/orquestra-apresentacao/preview.log`. Não há autostart permanente.

- Nova entrada: http://192.168.0.3:5182/OrquestraNEXT/
- Explícita: http://192.168.0.3:5182/OrquestraNEXT/?modo=apresentacao
- Legado: http://192.168.0.3:5182/OrquestraNEXT/?modo=legado#/1
- Plataforma: http://192.168.0.3:5182/OrquestraNEXT/?modo=plataforma

Serviço C9.2 na5180/PID85493 mantido com seu build validado anterior `/tmp/orquestra-supervisor-fixed/dist`; não reiniciado/substituído. O preview5182 permite avaliar o novo padrão sem interromper a homologação do Supervisor. IP/processos/artefatos temporários devem ser reconferidos em outra sessão. GitHub Pages não foi atualizado nesta etapa; a substituição pública depende de homologação e autorização posterior.

## Testes e evidências

- [22 novos testes](evidencias/apresentacao-padrao-focused.tap) aprovados:6 puros (modos/URLs/roteiro) +16 Chrome (raiz, explícito,9 etapas,limites,menu,consulta/detalhe,deep links,refresh,histórico do browser,inválidos,seletor,Plataforma,legado,Feira,Supervisor indisponível,tempo controlado sem avanço,responsividade,teclado/assets/zeroJS).
- Preparação dos testes corrigiu seletor de indicador e API do clock usados no próprio teste. Validação mobile revelou overflow do novo cabeçalho em390px; corrigido apenas no shell compartilhado, mantendo legado intacto.
- **Regressão completa aprovada:439 distintos =422 Node/browser +17 Python**, incluindo os417 anteriores e22 novos. [TAP completo](evidencias/apresentacao-padrao-regression.tap):422/422,zero falhas/skip/cancelamentos,290,51s. Inclui100 ciclos UI da Feira,20 sincronizados,T00–T11,reconexão/entrada tardia/pausa/refresh,ESM real,Plataforma livre e regressão integral do legado/teclado/temporizadores.
- [9 Python históricos](evidencias/apresentacao-padrao-python-original.txt) e [8 Python estendidos](evidencias/apresentacao-padrao-python-extended.txt) aprovados; [ambos](evidencias/apresentacao-padrao-import-original.txt) [importadores](evidencias/apresentacao-padrao-import-extended.txt) --check aprovados.
- [Build](evidencias/apresentacao-padrao-build.txt) aprovado; aviso conhecido chunk>500kB permanece. Sem instalação ou alterações em base/Vite/lockfile.
- [Preview LAN](evidencias/apresentacao-padrao-preview.txt): HTTP200 + Chrome + refresh da raiz/explicita, legado e zero errosJS, sem exigir5180 para entrada estática. [Preservação](evidencias/apresentacao-padrao-preservation.txt):122 hashes de arquivos rastreados protegidos +17 verificações adicionais da Feira/dados; nenhum alterado.

| Evidência | Arquivo |
| --- | --- |
| Entrada real do preview | [Raiz](evidencias/apresentacao-padrao-preview-root.png) |
| Etapa9/Peças | [Roteiro](evidencias/apresentacao-padrao-roteiro-pecas.png) |
| Seletor/fontes/limites | [Modos](evidencias/apresentacao-padrao-seletor-modos.png) |
|1366×768 /768×1024 /390×844 | [Desktop](evidencias/apresentacao-padrao-entrada-1366x768.png), [tablet](evidencias/apresentacao-padrao-entrada-768x1024.png), [celular](evidencias/apresentacao-padrao-entrada-390x844.png) |
| Legado no preview | [Supervisor original](evidencias/apresentacao-padrao-preview-legado.png) |

Revisão visual executada nas capturas desktop/mobile; conteúdo analítico mantém rolagem vertical. Não é auditoria integral de acessibilidade/cross-browser ou homologação do usuário.

### Comandos

```bash
ORQUESTRA_NODE=/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node
ORQUESTRA_PYTHON=/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3
npm run build -- --outDir /tmp/orquestra-apresentacao/dist
CHOKIDAR_USEPOLLING=true ORQUESTRA_TEST_DIST=/tmp/orquestra-apresentacao/dist "$ORQUESTRA_NODE" --test --test-concurrency=4 --test-reporter=tap tests/*.test.mjs
"$ORQUESTRA_PYTHON" -B tests/importacao-dados.test.py
"$ORQUESTRA_PYTHON" -B tests/importacao-feira.test.py
"$ORQUESTRA_PYTHON" -B scripts/import_orquestra.py --check
"$ORQUESTRA_PYTHON" -B scripts/import_feira_estendida.py --check
```

Polling apenas no ambiente dos testes evita o EMFILE conhecido; não modifica configuração permanente. Serviços de teste usam portas próprias;5180 não é utilizado pela suíte. Nenhuma simulação temporal nova participa da raiz da apresentação.

## Estado final e próxima ação

Implementação e validação local concluídas:439 testes/build/dois importadores aprovados. Homologação visual pendente; não versionado/publicado. Branch/HEAD finais confirmados:feature/modo-feira/240253d,staging vazio.17 rastreados modificados (12 já existentes +5 arquivos adicionais deste escopo), arquivos não rastreados anteriores preservados e novos inventariados. [Git final](evidencias/apresentacao-padrao-final-git.txt). Nenhum arquivo anterior descartado. Código/datasets/fixtures/estilos/controlador do legado preservados; URLs externas de Plataforma/Feira/Supervisor continuam opt-in. Histórico de testes C9.2 preservado, com adaptação explícita das entradas do legado nos testes afetados pela decisão aprovada.

Aguardar avaliação local do usuário. Não substituir o Pages, criar commit/merge/push/deploy ou iniciar outra página/ponte. Serviço5180 e preview5182 ficam ativos; após reboot precisam de procedimento manual. Prompt de retomada na continuidade oficial. Limites: `/tmp` é temporário; Supervisor conectado depende do serviço local/pareamento; novo roteiro não prova integração pública ou homologação física.
