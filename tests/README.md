# Proteção mínima sem dependências novas

## Validação integral atual — 23/10/2026

49 arquivos tests/*.test.mjs:507 casos aprovados, zero falhas/skip/cancelamentos. Executar CHOKIDAR_USEPOLLING=true ORQUESTRA_TEST_DIST=/tmp/orquestra-final-validation/dist com Node do runtime, --test --test-concurrency=4 --test-reporter=tap tests/*.test.mjs. Dois testes Python executados diretamente:9+8=17; total524 distintos.113 anterior foi seleção,498=481+17,512=495+17;12 novos explicam524. Ensaio nativo real aprovado separadamente, sem dupla contagem. Comandos completos/durações/evidências no relatório C9.2, seção Validação integral pré-versionamento.


## Regressão de evidências — 23/10/2026

Novos feira-evidence.test.mjs (7 casos) e feira-evidence-browser.test.mjs (5 casos): cálculo real, limites/ausência de base, orientação de inspeção, privacidade, resultado documentado, botão/teclado/ARIA, pertinência e entradas sem link. Regressão pertinente total113/113, incluindo continuidade/ADMIN/transporte/temas/original; build e dois importadores --check aprovados.512 da revisão anterior não foram reexecutados nesta etapa. Comando completo e TAP no relatório de entrega, seção Evidências técnicas e percentuais.


Não altera src/, CSS, package.json ou lockfile. Testes puros usam node:test. Browser usa Playwright já fornecido pelo ambiente e Chrome instalado; nenhum download automático.

Na raiz:
```sh
node --test tests/dados-roteiro.test.mjs
npm run build -- --outDir /tmp/orquestra-protecao-43dd028/dist
node --test tests/navegador-regressao.test.mjs
```

Variáveis opcionais: ORQUESTRA_PLAYWRIGHT (caminho do pacote já instalado), ORQUESTRA_CHROME (executável), ORQUESTRA_TEST_PORT (padrão 5187), ORQUESTRA_TEST_DIST e ORQUESTRA_TEST_EVIDENCE. Sem pacote/browser, falhar e solicitar aprovação antes de instalar. Suite inicia/encerra preview próprio. Porta ocupada não deve ser reutilizada silenciosamente. Execução requer permissão local para iniciar browser/servidor.

Capturas em /tmp são evidência inicial, não comparação visual homologada. Testes confirmam dados, DOM, navegação e uma Web Animation FLIP; não certificam aparência integral. Não altere expectativa para ocultar defeito. Publicação e integração da camada de dados não fazem parte desta suíte.

## Camada de dados

Testes adicionais e comandos: ../docs/dados/camada-dados.md. Requer somente ferramentas já disponíveis; não instalar sem aprovação. Fixtures inválidas são geradas em diretórios temporários, sem editar XLSX original.

## Entrega A — shell

Build temporário: npm run build -- --outDir /tmp/orquestra-shell-a/dist. Executar node --test tests/platform-shell.test.mjs. Usa preview próprio 5189 e ferramentas existentes; captura em /tmp/orquestra-shell-a/evidence. Para regressão antiga contra esse build: ORQUESTRA_TEST_DIST=/tmp/orquestra-shell-a/dist node --test tests/navegador-regressao.test.mjs. App.jsx recebe seletor opt-in autorizado, sem alterações no Supervisor.

## Entrega B

```sh
npm run build -- --outDir /tmp/orquestra-entrega-b/dist
node --test tests/chamados-service.test.mjs tests/chamados-browser.test.mjs
ORQUESTRA_TEST_DIST=/tmp/orquestra-entrega-b/dist node --test tests/dados-roteiro.test.mjs tests/camada-dados.test.mjs tests/camada-dados-vite.test.mjs tests/navegador-regressao.test.mjs tests/platform-shell.test.mjs
```

28 novos testes + 32 regressões Node/browser + 9 testes Python do importador (guia da camada de dados) = 69. Navegador novo inicia preview 5191 com ferramentas existentes; capturas em /tmp/orquestra-entrega-b/evidence. Shell aceita ORQUESTRA_TEST_DIST e ORQUESTRA_SHELL_EVIDENCE. [Resultados e limites](../docs/produto/entrega-b-chamados.md).

## Entrega C1

```sh
npm run build -- --outDir /tmp/orquestra-c1/dist
node --test tests/sla-service.test.mjs tests/sla-browser.test.mjs
ORQUESTRA_TEST_DIST=/tmp/orquestra-c1/dist node --test tests/dados-roteiro.test.mjs tests/camada-dados.test.mjs tests/camada-dados-vite.test.mjs tests/navegador-regressao.test.mjs tests/platform-shell.test.mjs tests/chamados-service.test.mjs tests/chamados-browser.test.mjs
```

Suíte C1: 11 testes de serviço + 7 de navegador, preview próprio 5193, evidências /tmp/orquestra-c1/evidence. Regressão anterior: 60 Node/browser + 9 Python (comando no guia da camada). Shell agora verifica duas páginas funcionais e dez destinos pendentes, preservando a verificação dos 12 menus. Ferramentas locais existentes, nenhuma instalação.

## C1.1 — consistência temporal

node --test tests/temporal-consistency.test.mjs executa 10 casos: TA por fonte, permanência adicional versus TB, sequência/nulos, duas saídas futuras, projeção imutável, gate de referência, igualdade de limite, relógio sem confirmação artificial e reconciliação C1. Build em /tmp/orquestra-c11/dist; executar todas as suítes Node anteriores com ORQUESTRA_TEST_DIST apontando para esse diretório e acrescentar esta suíte, mais 9 testes Python. Seletores de dois testes de navegador foram adaptados aos rótulos aprovados, mantendo as verificações de valores/nulos.

## C2 — Riscos & Tendências

```sh
npm run build -- --outDir /tmp/orquestra-c2/dist
node --test tests/riscos-service.test.mjs tests/riscos-browser.test.mjs
```

Novos: 13 testes de serviço + 7 de navegador. Browser inicia preview próprio 5195, usa Playwright/Chrome existentes e salva capturas em /tmp/orquestra-c2/evidence. Regressão: executar todas as suítes anteriores com ORQUESTRA_TEST_DIST=/tmp/orquestra-c2/dist, incluindo temporal-consistency e as 9 verificações Python. Teste do shell adaptado para três páginas funcionais e nove pendentes, mantendo a verificação dos 12 menus.

## C3 — Performance

```sh
npm run build -- --outDir /tmp/orquestra-c3/dist
ORQUESTRA_TEST_DIST=/tmp/orquestra-c3/dist node --test tests/*.test.mjs
```

Novos: 14 testes de serviço +8 de navegador, preview 5197, evidências /tmp/orquestra-c3/evidence. Suíte completa: 130 Node/browser +9 Python =139 distintos (inclui 117 anteriores). Pré-commit até C2: build e 108 Node/browser +9 Python aprovados; logs copiados para evidências C3. Teste do shell mantém 12 menus, agora quatro páginas funcionais/oito pendentes, e verifica título Performance na rota Visão Geral. Ferramentas existentes, nenhuma instalação. Não fazer commit adicional sem autorização.

## C4 — Contratos

Build final: `npm run build -- --outDir /tmp/orquestra-c4-final/dist`. Regressão: `ORQUESTRA_TEST_DIST=/tmp/orquestra-c4-final/dist node --test tests/*.test.mjs`; complementar com os 9 Python e `scripts/import_orquestra.py --check`, usando o runtime documentado. Preview C4 na porta 5199; capturas em /tmp/orquestra-c4/evidence. Servidores locais/Chrome precisam de permissão apropriada no sandbox.

16 testes de serviço +9 navegador novos; total 155 Node/browser +9 Python =164 distintos. Inclui os 139 anteriores. Após ajuste visual/contextual, os 25 C4 foram reexecutados no build final. Shell verifica cinco páginas funcionais/sete pendentes e todos os 12 menus. [Evidências e critérios C4](../docs/produto/entrega-c4-contratos.md). Nenhum pacote instalado.

## C5 — Custos / TCO

Build: `npm run build -- --outDir /tmp/orquestra-c5-final/dist`. Regressão: `ORQUESTRA_TEST_DIST=/tmp/orquestra-c5-final/dist node --test tests/*.test.mjs`; complementar com 9 Python e importador --check no runtime documentado. Preview C5 porta 5201, evidências /tmp/orquestra-c5/evidence. Servidores locais/Chrome precisam de permissão apropriada no sandbox.

20 testes de serviço +10 navegador C5; total 185 Node/browser +9 Python =194 distintos (164 anteriores incluídos). Após ação direta de custo→desvios, os 30 C5 passaram novamente no build final. Menus: seis páginas funcionais/seis pendentes, 12 destinos. [Cobertura e evidências](../docs/produto/entrega-c5-custos.md). Nenhuma dependência instalada.

## C6 — Equipamentos

Build: `npm run build -- --outDir /tmp/orquestra-c6/dist`. Regressão: `ORQUESTRA_TEST_DIST=/tmp/orquestra-c6/dist node --test tests/*.test.mjs`, mais os 9 Python e importador --check no runtime documentado. Preview C6 porta 5203, evidências /tmp/orquestra-c6/evidence; servidores locais/Chrome precisam de permissão apropriada no sandbox.

21 serviço +10 navegador novos; total 216 Node/browser +9 Python =225 distintos (194 anteriores incluídos). Sete páginas funcionais/cinco pendentes, 12 menus. Teste B agora verifica Equipamentos funcional/281 chamados filtrados e mantém comparação integral de ordem/página/retorno. Suíte completa reexecutada após adaptar a expectativa antiga de placeholder, sem falhas. [Cobertura e evidências C6](../docs/produto/entrega-c6-equipamentos.md). Nenhuma dependência instalada.


## C7 — Técnicos

Build: `npm run build -- --outDir /tmp/orquestra-c7/dist`. Regressão: `ORQUESTRA_TEST_DIST=/tmp/orquestra-c7/dist /home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.mjs`, mais 9 Python e importador --check. Usar Node do runtime documentado para contagem distinta dos testes aninhados; o Node24 do shell apresenta o arquivo como um único teste. Preview C7 porta 5205; evidências /tmp/orquestra-c7/evidence, copiadas para docs/produto/evidencias. Portas/Chrome precisam de permissão apropriada no sandbox.

21 serviço +9 navegador novos; total 246 Node/browser + 9 Python =255 distintos. C6 revalidada 225/build e commitada 05ec7d5. Shell verifica Técnicos como oitava página funcional, quatro placeholders e 12 menus; sem enfraquecer as verificações anteriores. [Cobertura e evidências](../docs/produto/entrega-c7-tecnicos.md). Sem dependências novas. C7 sem commit e aguardando homologação.


## Regressão de inicialização após C7

`platform-dev.test.mjs` acrescenta 7 testes de módulos ESM efetivamente servidos pelo Vite e das quatro rotas Visão Geral/Chamados/Técnicos/Peças, com URL direta/refresh e verificação de erros. Por padrão inicia/encerra Vite próprio 5209 com cacheDir temporário isolado; `ORQUESTRA_DEV_URL=http://127.0.0.1:5173/OrquestraNEXT/` valida servidor existente sem encerrá-lo. `ORQUESTRA_DEV_EVIDENCE` define destino de capturas/cache. Usar Node do runtime e permissão apropriada para previews/Chrome. Não instalar dependências.

Total atual 262 testes distintos =253 Node/browser + 9 Python (255 anteriores + 7 novos). Tela branca foi causada por módulo vazio no estado do Vite antigo 5173; export DEFAULT_STATE em disco/HEAD estava correto. Reinício do processo restaurou a plataforma, sem mudar produto. [Causa, evidências e limites](../docs/produto/correcao-inicializacao-c7.md).


## C8 — Peças e Componentes

Build: npm run build -- --outDir /tmp/orquestra-c8/dist. Regressão: ORQUESTRA_TEST_DIST=/tmp/orquestra-c8/dist node-do-runtime --test tests/*.test.mjs, mais 9 Python/importador --check. Comando completo/runtime na continuidade. Preview C8 porta 5211; evidências /tmp/orquestra-c8/evidence copiadas para docs/produto/evidencias. Portas/Chrome exigem permissão apropriada, sem novas dependências.

21 serviço +9 navegador novos, total 283 Node/browser +9 Python =292 distintos, incluindo 262 anteriores. Shell e dev agora verificam Peças funcional, conservando demais verificações ESM/rotas/erros/menus; expectativa de placeholder foi superada pela implementação autorizada. Testes dev também passaram na instância 5173 sem export ausente. [Cobertura e evidências](../docs/produto/entrega-c8-pecas.md). C7 revalidada 262/build e commitada a5aea32; C8 sem commit/aguarda homologação.

## C9 — Modo Feira

Build: `npm run build -- --outDir /tmp/orquestra-c9/dist`. Suite completa com `ORQUESTRA_TEST_DIST=/tmp/orquestra-c9/dist` e `ORQUESTRA_DEV_URL` apontando para servidor dev existente confirmado, conforme comandos no [relatório C9](../docs/produto/entrega-c9-feira.md). Usar runtime Node documentado na continuidade.

`feira-temporal.test.mjs`: 14 casos puros, incluindo 1000 ciclos/clock injetável/cleanup/projeção e deltas. `feira-browser.test.mjs`: 15 casos, preview próprio 5215, Chrome/Playwright existentes; 100 ciclos com clock controlado (leva cerca de 2 minutos), três snapshots, detalhes/pausa/rede/refresh/visibilidade e falha de chunk. `platform-dev.test.mjs` adiciona ESM/refresh Feira aos casos antigos. Nenhum flag de teste ou aceleração artificial é exposto no produto.

`feira-endurance.mjs`: ensaio separado com relógio real, preview 5217, um ciclo normal +um 2× (~217,5 s mais carga/capturas). Evidências em ORQUESTRA_FEIRA_EVIDENCE ou /tmp/orquestra-c9/evidence. Encerra somente o próprio preview/Chrome; não mexe no dev do usuário. Não equivale a ensaio de um dia de exposição.

## C9.1 — sincronização local

Construir com `npm run build -- --outDir /tmp/orquestra-c91/final` e usar ORQUESTRA_TEST_DIST nesse diretório; servidor rejeita build pré-C9.1. `feira-sync-service.test.mjs` testa autoridade/motor, revisões/roles/locks/leases/1000 ciclos; `feira-sync-http.test.mjs` usa HTTP/SSE reais, build/segurança/reconexão; `feira-sync-browser.test.mjs` usa dois contextos Chrome, backend Node com relógio injetável somente em teste e rede real de loopback, mais 20 loops sincronizados. Nenhum endpoint público acelera tempo nem expõe hooks de teste.

`feira-sync-endurance.mjs` é ensaio separado com serviço/motor/rede reais: 1 ciclo normal +1 acelerado (~217,5 s). Ferramentas já instaladas; nenhum download. Casos dev verificam módulos conectados e primitivas UI extraídas. Comandos, resultados e roteiro físico em [entrega C9.1](../docs/produto/entrega-c91-sincronizacao.md). Contextos no mesmo PC e emulação de Wi-Fi/visibilidade não comprovam celular físico nem WAN desligada.

## C9.2 — série estendida

`feira-extended.test.mjs`: 19 casos de dados/diffs, 12 estados/417/55/189, ausência de futuro, criticidade ativa, duração/espera/1×/2×/10 mil loops, scheduler/cleanup, sessão/pausa/revisões, atomicidade e configuração inválida. `feira-extended-browser.test.mjs`: oito casos com dois contextos Chrome, 12 estados, detalhes/ACK/pausa, refresh/reconexão, 20 loops 2× e dimensões 1366×768,390×844,768×1024. Testes C9.1 puros/browser mantêm explicitamente a sequência original para regressão; standalone/ESM seguem a nova série aprovada.

```bash
/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -B scripts/import_feira_estendida.py --check
/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -B tests/importacao-feira.test.py
npm run build -- --outDir /tmp/orquestra-c92/delivery
ORQUESTRA_DEV_URL=http://127.0.0.1:5175/OrquestraNEXT/ ORQUESTRA_TEST_DIST=/tmp/orquestra-c92/delivery /home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test --test-reporter=tap tests/*.test.mjs
ORQUESTRA_TEST_DIST=/tmp/orquestra-c92/delivery /home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/feira-sync-endurance.mjs
```

Importador novo tem oito casos Python (total17 com os nove históricos). Executar os arquivos Python diretamente: nomes com ponto não são descobertos por unittest discover. Ensaios reais sincronizados usam 336 s/168 s; `ORQUESTRA_ENDURANCE_SPEEDS=2` limita ao ciclo acelerado. Sandbox sem escalonamento pode apenas agrupar arquivos Node como testes e não comprova a contagem dos casos; testes reais de navegador/portas exigem permissão do ambiente. Resultados/evidências finais no relatório C9.2.

### Diagnóstico de fonte C9.2

`feira-source-browser.test.mjs` tem cinco casos: reproduz standalone T02 versus serviço/mobile T00 não iniciado, valida aviso/diagnóstico da origem e depois usa a mesma autoridade para T01/T02, revisão/sessão, pausa, refresh, visibilidade mobile, página realmente congelada durante transição e troca de acesso leitor→operador com código inválido/cancelamento. Preview próprio5223, service porta efêmera; não usar a mesma porta em outra execução simultânea. `feira-extended-browser.test.mjs` acrescenta entrada tardiaT05 e refreshT10. Resultados atuais no relatório C9.2; nenhuma evidência automatizada substitui homologação física. Fonte independente por design não pode ser apresentada como cliente conectado.

### Supervisor Feira — evolução visual (19/10/2026)

`feira-supervisor.test.mjs`: sete casos puros/contrato (cores BASE, zero/nulos/futuro, abertura sem relógio, mudanças, alertas/ordenação,12 estados, ausência de fixtures/motor/fontes externas). `feira-supervisor-browser.test.mjs`: dez casos com dois clientes Chrome e backend real em porta efêmera, clock injetado somente no teste, navegação/vazios,12 estados, FLIP/heartbeat/reduced-motion,alertas,POST retido/negado,pausa/foco/Escape,concluídos,3 resoluções/teclado,toques,refresh/reconexão e bloqueio de origens externas. `ORQUESTRA_SUPERVISOR_EVIDENCE` define capturas. Build final em `/tmp/orquestra-supervisor-fixed/dist`; suíte completa com `ORQUESTRA_TEST_DIST` e runtime da continuidade. Resultados e capturas no relatório C9.2. Nenhum hook/endpoint de teste acrescentado ao produto.

O caso tablet de `feira-extended-browser.test.mjs` também verifica limites de altura e animações após20 ciclos rápidos: regressão do acúmulo de FLIP corrigido no adaptador isolado. Regressão completa usa CHOKIDAR_USEPOLLING=true somente no processo de teste, evitando EMFILE sem mudar configuração permanente.

Resultado final desta evolução:400 Node/browser +17 Python =417 distintos aprovados, sem falhas/skip/cancelamentos. Build e ambos importadores --check aprovados; homologação visual/física pendente. TAP/capturas/limites no relatório C9.2.

## Nova apresentação padrão — US06 (19/10/2026)

`apresentacao.test.mjs`:6 casos puros de modos/URLs/autoridade/roteiro. `apresentacao-browser.test.mjs`:16 casos de navegação/estático/modos, preview próprio5227,22 novos no total. Build `/tmp/orquestra-apresentacao/dist`, evidências via ORQUESTRA_PRESENTATION_EVIDENCE. Testes de navegador do legado passam a `?modo=legado`; suas assertions das dez cenas/teclado/timers permanecem. platform-shell e fallback Feira verificam URLs explícitas, substituindo a premissa antiga de legado padrão. Protocolo/clock/dados C9.2 não mudam. Comandos/resultados no [relatório da apresentação](../docs/produto/entrega-apresentacao-padrao.md). Rodar suíte inteira com CHOKIDAR_USEPOLLING=true/ORQUESTRA_TEST_DIST e Node do runtime, além dos17 Python/dois --check; não usar5180/5182 para fixtures de testes.

Resultado da apresentação padrão:422 Node/browser +17 Python =439 distintos aprovados, incluindo417 anteriores +22 novos. Build e ambos importadores --check aprovados; homologação/publicação pendentes. O legado permanece integralmente validado no modo explícito.

## Adequação NEXT — 23/10/2026

`feira-next.test.mjs`, `feira-next-transport.test.mjs`, `feira-next-http.test.mjs` e `feira-next-browser.test.mjs` acrescentam18 casos: validade absoluta6 h/revogação,pareamento independente,40 consultas sem locks,seleção auditada,não repetição,watchdog/retry,HTTP/SSE/cookie,1/5/20/40 visitantes e cliente lento,duas leituras simultâneas/ciclo/evidências,desconexão/refresh/reduced-motion. Critérios antigos de pausa/lock por leitura conectada foram substituídos pelo contrato aprovado de fotografia local; standalone e pausa por foco ADMIN permanecem.

Comando integral e resultados atuais na [continuidade](../docs/CONTINUIDADE_CODEX.md) e [relatório C9.2](../docs/produto/entrega-c92-feira-estendida.md#adequação-final-para-o-next--23102026). Usar `ORQUESTRA_TEST_DIST=/tmp/orquestra-next-final/dist`; testes de carga gravam performance.json e UI grava capturas em /tmp/orquestra-next-final,posteriormente copiadas para evidências duráveis. Sem dependências novas; não apontar o harness para serviços do usuário. Relógio injetado somente em testes; ensaio real separado com feira-sync-endurance.mjs.

Execução final desta sessão:481 casos Node/navegador+17 Python=498 distintos,zero falhas/cancelamentos/skip;build/dois --check e ciclo real1× de336 s aprovados. Evidências finais no relatório,sem reutilizar resultados anteriores.

## Continuidade e linguagem operacional — 23/10/2026

`feira-continuity.test.mjs` (10 casos) e `feira-continuity-browser.test.mjs` (4 casos) acrescentam controle exclusivo/lease/release/reassunção sem pausa,interrupções monotônica/civil antes da transição,redação fiel com X/Y,ausência de suporte,casos reais/elegibilidade,evidências recolhidas Light/Dark e dois visitantes atéT11. Regra antiga de pausa por foco/lease conectado foi substituída;standalone preservado. Execução integral atual495 Node/navegador+17 Python=512 distintos,zero falhas/cancelamentos/skip,build/dois --check aprovados.

Ensaio nativo separado exige `ORQUESTRA_NATIVE_ENDURANCE=1`,DISPLAY e ferramentas já existentes Chrome/Edge,xmessage,xwininfo,Python/libX11. `ORQUESTRA_CONTINUITY_EVIDENCE=/tmp/orquestra-continuity-final/native-final ORQUESTRA_TEST_DIST=/tmp/orquestra-continuity-final/dist node-do-runtime tests/feira-continuity-endurance.mjs`. Opera apenas janelas próprias identificadas por título/ID,com perfis isolados e processos encerrados ao terminar. Foco emulado do Playwright é desativado;Map State X11 comprova minimização. Bloqueio de comunicação fica restrito ao contexto ADMIN,não altera rede/firewall. Não suspende Ubuntu nem substitui homologação física. `feira-browser-switch.mjs` permite ensaio suplementar de Edge contra journal de ciclo já ativo,com a mesma autorização explícita por variável.

Ensaio nativo final aprovado nesta sessão:335.997 s,T00–T11→T00,dois visitantes,aplicativo/Edge,minimização X11,aba ADMIN fechada/reaberta e lease vencido/reassumido,zero pausas inesperadas/errosJS. Capturas/logs em docs/produto/evidencias/continuity-2026-10-23.
