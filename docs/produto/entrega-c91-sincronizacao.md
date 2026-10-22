# C9.1 — sincronização BackOffice Feira ↔ Supervisor Feira

Evolução posterior: a [C9.2](entrega-c92-feira-estendida.md) integra T00–T11 à sincronização. Este relatório preserva as evidências e a configuração de sua entrega original; estado vigente na continuidade.


15/10/2026, America/Sao_Paulo. US14.6–14.10. Implementação local autorizada em feature/modo-feira, HEAD/base 240253d. C9, documentos e evidências anteriores preservados; sem commit, merge, push, deploy ou instalação. **Homologação física pendente**: nenhum celular/tablet físico foi controlado pelo agente. A experiência completa não é considerada homologada pelos testes de navegador.

## Arquitetura implementada e resultados

Um processo Node serve o build compilado e a API na mesma origem. Só esse processo instancia o motor temporal conectado. BackOffice e Supervisor Feira recebem o mesmo DTO completo via SSE e enviam comandos por POST. O mobile não monta motor, não avança fases e não calcula eventos pelo relógio local. Não usa Vite dev, CDN, GitHub Pages ou API externa para operar.

O caminho standalone C9 permanece explícito em dev/Pages sem sessão. No serviço compilado local, uma configuração pública sem segredos seleciona o modo conectado até em ?modo=feira sem sessao. O modo supervisor-feira é sempre conectado. Ausência do backend mostra indisponibilidade; nunca aciona outro motor silenciosamente. O serviço rejeita builds antigos sem a entrada C9.1.

Motor aprovado reutilizado: 45/45/45/10 segundos, 1×/2×, horários discretos 08:00/08:30/09:30, substituição integral 10/16/24, sem interpolação de TA/TB/ETA/SLA/status/cor. Novo serviço cria sessão UUID nova em T0 **pausado**. O operador autentica, assume controle e seleciona Iniciar. Reinício manual do ciclo preserva a velocidade e volta T0 executando, como C9; reinício do processo exige novo pareamento e novo Iniciar. Mudança de foco/visibilidade do painel controlador pausa globalmente; retorno não retoma. Lease perdido também pausa. Salto monotônico maior que 5 s pausa por interrupção, sem atravessar snapshots após suspensão do notebook.

Detalhe mobile: POST open-detail valida ID/revisão e pausa globalmente com lock; só após ACK o detalhe projetado abre. Fechar libera apenas o lock da aba, sem retomar; só o notebook retoma. Pedidos repetidos não criam locks duplicados do mesmo detalhe. Lock sem heartbeat expira após 15 s, mantendo pausa. Reiniciar revoga detalhes e limpa a consulta do novo ciclo. Desconexão congela o último estado e informa ausência de sincronização inclusive no detalhe; reconectar substitui por estado completo, sem replay de comandos. Tela desbloqueada pede estado fresco. Sem conexão mobile não pode abrir novos detalhes como se a pausa tivesse sido confirmada.

Ativos e concluídos continuam distintos; T2 tem 24 registros, 12 ativos, 12 concluídos e 4 alertas ativos. Mesmos IDs/status/cores/TA/TB/SLA/ETA/técnico/supervisor/recorrência nas duas telas. Saída futura CH-006 em T1 e CH-017 em T2 segue oculta; conclusão técnica informada não é apagada nem transformada em horário fictício. Motivos/insights são fornecidos pela massa sintética, sem alegação de ML comprovado ou execução real de despacho/estoque.

## Arquivos criados ou alterados nesta evolução

| Arquivo/grupo | Responsabilidade |
| --- | --- |
| server/feira-server.mjs | HTTP estático/API/SSE, proteção de origem, limites, launcher e encerramento |
| server/feira-session.mjs | Única autoridade, sessão/revisões, papéis/lease/locks e idempotência |
| src/feira/sync/protocol.js | Versão, validação/aplicação de estados e UUID com fallback para HTTP LAN |
| src/feira/sync/transport.js, useSyncedFeira.js | Fetch/EventSource, heartbeat/reconexão/estado externo; sem motor cliente |
| src/feira/SyncedFeiraApp.jsx | Acesso local, controles administrativos e painel conectado |
| src/feira/SupervisorFeira.jsx, SyncFeira.module.css | Interface mobile/tablet específica e conexão |
| src/feira/FeiraPanel.jsx | Apresentação C9 extraída para reuso sem engine; comportamento visual preservado |
| src/feira/FeiraApp.jsx | Wrapper standalone continua com o motor C9 explícito |
| src/feira/FeiraDetail.jsx | Detalhe compartilhado com aviso de desconexão opcional |
| src/feira/metricDefinitions.js, selectors.js | Definições puras separadas de leitura de dataset; reexport mantém API |
| src/feira/temporalState.js | maxElapsed opcional para suspensão do serviço; default standalone preservado |
| src/platform/components/OperationalUI.jsx, ConsultationUI.jsx | Primitivos visuais extraídos sem dependência histórica, com reexports dos nomes anteriores |
| src/App.jsx | Seleção conectada/standalone/mobile, sem mudar apresentação padrão |
| package.json | Script feira:local; nenhuma dependência ou lock alterado |
| tests/feira-sync-service.test.mjs, feira-sync-http.test.mjs, feira-sync-browser.test.mjs | Motor/protocolo, HTTP real e dois navegadores |
| tests/feira-sync-endurance.mjs, platform-dev.test.mjs | Ensaio real separado e ESM conectado adicional |
| Documentação/índices/evidências c91-* | Contrato, roteiro, backlog e continuidade |

Supervisor original/dez cenas/fixtures/estilos/datasets/XLSX intactos. A extração de componentes novos da Plataforma mantém defaults/exports; não refatora o Supervisor. A captura prévia C9 está preservada fora da árvore em /tmp para comparação, além do histórico Git e evidências; /tmp não é backup permanente.

## Inicializar e encerrar no notebook

Na raiz OrquestraNEXT, com Node existente (validado v24.16.0), sem instalação:

```bash
npm run build
npm run feira:local -- --list-addresses
npm run feira:local -- --host <IP-WIFI-DO-NOTEBOOK> --port 5180
```

O comando build prepara ./dist (ignorado pelo Git). Não é deploy. O serviço padrão aceita --dist <pasta-do-build> e usa 127.0.0.1 se --host for omitido; esse default só atende o notebook. Não usar 0.0.0.0 indiscriminadamente; escolher o IP IPv4 específico da interface da demonstração. Porta ocupada falha explicitamente. Não encerrar outro processo para liberar a porta sem conferir sua origem.

Artefato final de validação desta sessão: /tmp/orquestra-c91/final. Para usá-lo sem novo build, enquanto existir:

```bash
npm run feira:local -- --host <IP-WIFI-DO-NOTEBOOK> --port 5180 --dist /tmp/orquestra-c91/final
```

O terminal mostra as URLs completas e códigos temporários separados. Digitar **código ADMIN apenas no notebook** e código SUPERVISOR no celular. Códigos não são argumentos de URL, não estão no build/SSE e não são gravados em arquivo pelo serviço. Formulário limpa o campo após conectar. Código de pareamento expira em 30 minutos; sessões já pareadas continuam válidas até encerrar o processo. Para novo pareamento após expiração, reiniciar conscientemente e usar nova sessão/códigos.

No notebook: Conectar → Assumir controle → Iniciar. Um segundo painel não assume automaticamente enquanto houver outro controller lease válido. Fechar/perder o painel por mais de 6 s pausa globalmente e libera controle para nova assunção explícita. Heartbeats clientes a cada 2 s, checkpoints SSE aproximadamente 1 s; são monitoramento de conexão e não outros motores temporais.

Encerrar: Ctrl+C no terminal do serviço. O serviço cancela o motor e housekeeping, fecha SSE/conexões e invalida credenciais em memória. Parar o serviço não encerra os servidores dev 5173/5175. Se a instância tiver sido iniciada pelo Codex, solicitar seu encerramento para iniciar uma execução própria; não usar kill genérico nem encerrar portas sem identificar o processo. Reiniciar gera UUID e códigos novos; clientes antigos precisam de pareamento e T0 fica pausado.

### URLs e IP observado

IP Wi-Fi observado nesta sessão: **192.168.0.3**, interface wlp129s0f0. Pode mudar por DHCP; não está fixado no código. Usar o IP real mostrado pelo launcher no dia do NEXT.

- Notebook: `http://192.168.0.3:5180/OrquestraNEXT/?modo=feira`.
- Celular/tablet: `http://192.168.0.3:5180/OrquestraNEXT/?modo=supervisor-feira`.
- As URLs impressas pelo launcher também levam `sessao=<UUID>`, identificador público que explicita o modo conectado e não é credencial.

Não usar 127.0.0.1/localhost no celular. Nenhuma mudança permanente de rede/firewall foi executada. GitHub Pages permanece a versão C8; não tentar conectar página HTTPS pública à API HTTP local.

## Contrato SSE e comandos implementado

Prefixo /OrquestraNEXT/api/, mesma origem. GET bootstrap autenticado devolve identidade/papel/CSRF e estado completo; GET state devolve estado; GET events abre text/event-stream, evento state e id=sessionId:revision, sempre estado completo na conexão/reconexão. Last-Event-ID não exige replay; estado mais recente basta.

STATE contém protocolVersion=1, sessionId/serverInstanceId, revision monotônica, appVersion, datasetVersion, state (phase/cycle/remaining/speed/pauses), playback (status/started/restante nominal/restante real), view (fonte/referência/registros projetados/summary/distribuição/deltas/mudanças), controller e locks públicos, sentAt diagnóstico. END mantém fonte T2. Hora do celular não governa fatos ou avanço. ACK/POST e SSE usam a mesma revisão; respostas antigas/duplicadas são descartadas. Sessão ou versão incompatível não é mesclada; mudança de build/dados pede reload. Novo serviço invalida cookies/CSRF/IDs antigos.

POST pair recebe código temporário e concede cookie HttpOnly/SameSite=Strict, limitado ao prefixo da API. Papel depende do código verificado no servidor, nunca de campo arbitrário do cliente. POST commands recebe sessionId, csrf, tabId, commandId UUID, baseRevision, action e args. Operações administrativas: acquire/start/resume/pause/restart/speed/release. Mobile: heartbeat/open-detail/close-detail. Heartbeat do controller renova lease; heartbeat do dono renova locks. Reinício e controles de reprodução são rejeitados para leitores.

ACK inclui accepted, commandId, appliedRevision e STATE. Erros são JSON com status explícito e estado atual só para cliente autenticado. ID repetido retorna resultado original sem reexecutar; reutilizar ID para outra intenção falha. Cache limitado a 1000 comandos/10 min. Revisões recentes (janela 120) aceitam diferença apenas de restante/checkpoint; mudança de fase/ciclo/pausa/velocidade/locks/controller gera conflito, devolve estado e exige nova ação. Comandos não são reenviados automaticamente após queda da rede.

## Segurança, disponibilidade e limites

HTTP local não cifra códigos/cookies. Usar Wi-Fi dedicado confiável, massa sintética, sem port forwarding/UPnP/túnel público. Não abrir a porta na internet. Caso TLS/confidencialidade seja necessário, aprovar escopo de certificados ou serviço seguro; não desligar proteções do navegador.

Host/Origin validados, POST exige origem e CSRF; sem CORS *. Body máximo 8 KiB, 200 POST/min por IP, 5 tentativas inválidas de código/min, 32 sessões de navegador, 16 SSE totais/4 por sessão, 16 locks. Cliente lento com fila SSE acima de 256 KiB é desconectado para recuperar estado atual. Arquivos estáticos ficam restritos ao realpath do build; sem exposição de repo/.git/dataset/XLSX/servidor, escrita, upload, shell ou endpoints de estoque/despacho. Erros não registram segredos. Cookies são de sessão; credenciais só vivem em memória/terminal privado.

O cliente congela em perda de SSE ou heartbeat (~3,5 s), mostra offline e tenta reconectar com backoff 1/2/4/8 s, teto 10 s +jitter. Heartbeat HTTP não mascara a perda do stream. Não há persistência de sessão no servidor nem failover para outra autoridade; reboot/suspensão exige recuperação explícita. Não há promessa de zero latência ou recuperação de sessão entre processos. Um notebook que dorme para de servir ambos os dispositivos; reconectar não cria segundo motor.

## Validações desta sessão

**360 distintos aprovados =351 Node/browser +9 Python**, incluindo os 322 anteriores +38 novos (15 serviço, 9 HTTP real, 13 navegador e 1 ESM adicional). Suíte final sem falhas, skip ou cancelamentos. Build final /tmp/orquestra-c91/final e importador --check aprovados. Nenhuma dependência instalada.

1000 ciclos de serviço com relógio injetável e 20 loops sincronizados entre navegadores passaram. Ensaio separado com motor/heartbeat/lease/SSE reais completou um ciclo normal de 145 s e um 2× de 72,5 s com dois clientes e zero erro JS; esse ensaio antecedeu somente a guarda de build antigo e um guard de renderização do formulário, que não alteram o motor. Regressão completa final valida o código final.

Smoke HTTP no IP Wi-Fi 192.168.0.3 confirmou funcionamento fora de secure context (fallback UUID via getRandomValues), cookie/CSRF, dois contextos e pausa de detalhe. Backend indisponível não monta fallback autônomo. Isso continua sendo teste no mesmo notebook: celular/tablet físico, roteador dedicado, firewall e WAN realmente desligada **não foram homologados**.

Evidências: [351 Node/browser](evidencias/c91-regression.tap), [9 Python](evidencias/c91-python.txt), [build](evidencias/c91-build.txt), [importador](evidencias/c91-import.txt), [ESM](evidencias/c91-dev.txt), [ciclos reais](evidencias/c91-endurance.txt), [HTTP LAN simulado](evidencias/c91-lan-smoke.txt).

Capturas: [notebook T2](evidencias/c91-notebook-t2.png), [mobile T2](evidencias/c91-mobile-t2.png), [detalhe mobile pausado](evidencias/c91-mobile-detail-paused.png), [tablet](evidencias/c91-tablet.png), [detalhe em origem HTTP LAN](evidencias/c91-lan-mobile-detail.png). Responsividade 1366×768, 390×844 e 768×1024 sem overflow horizontal; rolagem vertical é intencional. Aviso de chunk>500kB permanece. Testes não substituem homologação visual/física.

Comandos usados (runtimes existentes e build temporário, para não publicar):

```bash
npm run build -- --outDir /tmp/orquestra-c91/final
ORQUESTRA_DEV_URL=http://127.0.0.1:5175/OrquestraNEXT/ ORQUESTRA_TEST_DIST=/tmp/orquestra-c91/final ORQUESTRA_TEST_EVIDENCE=/tmp/orquestra-c91/legacy ORQUESTRA_SHELL_EVIDENCE=/tmp/orquestra-c91/shell ORQUESTRA_DEV_EVIDENCE=/tmp/orquestra-c91/dev ORQUESTRA_SYNC_EVIDENCE=/tmp/orquestra-c91/evidence /home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test --test-reporter=tap tests/*.test.mjs
/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -B tests/importacao-dados.test.py
/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -B scripts/import_orquestra.py --check
ORQUESTRA_TEST_DIST=/tmp/orquestra-c91/final /home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/feira-sync-endurance.mjs
```

## Roteiro obrigatório de homologação física no NEXT

**Pendente — executar pelo usuário com notebook e celular/tablet físicos.**

1. Preparar runtime/build/assets antes do evento. Usar roteador portátil dedicado ou hotspot previamente testado, sem isolamento entre clientes. Confirmar bateria/alimentação e impedir suspensão automática durante o ensaio, mediante configuração do operador.
2. Conectar os dois dispositivos à mesma LAN. Desligar WAN do roteador e dados móveis do celular, mantendo Wi-Fi ativo. Não apenas bloquear internet em um navegador. Não usar Wi-Fi visitante com client isolation/captive portal.
3. Conferir IP e porta. Se bloqueado, pedir regra de firewall restrita à interface/sub-rede e TCP 5180; **não desativar firewall inteiro**. Exemplo a adaptar/aprovar pelo responsável: permitir somente origem da sub-rede dedicada para IP/porta locais; remover a regra temporária após a feira. Nenhuma regra foi aplicada pelo agente.
4. Iniciar o serviço com o IP real, parear notebook como ADMIN e celular como SUPERVISOR. No notebook assumir controle e iniciar; manter a aba em foco. O celular deve entrar diretamente pelo URL/IP e servir todos os assets localmente sem internet.
5. Conferir T0/08:00/10, T1/08:30/16 e T2/09:30/24 nas duas telas. Abrir os mesmos IDs e comparar status/cor/SLA/ETA/TA/TB/técnico/supervisor/recorrência; T2 tem 4 alertas ativos, distinto dos concluídos.
6. Abrir detalhe no celular. Confirmar pausa em ambas as telas antes do detalhe; fechar deve manter pausa. Retomar somente no notebook. Repetir com dois detalhes/abas se necessário e avaliar mensagens/locks.
7. Testar 1×/2× e reinício manual; esperar END e loop. Não inferir mudança operacional durante os tempos de exposição. Confirmar que saídas futuras de CH-006/T1 e CH-017/T2 não aparecem como realizadas.
8. Desconectar o Wi-Fi do celular: deve indicar sem sincronização, congelar estado e bloquear novo detalhe. Reconectar: deve obter o estado atual, não reiniciar. Bloquear/desbloquear a tela e confirmar recuperação. Pausa confirmada não desaparece por desconectar/fechar.
9. Alternar o notebook para outro aplicativo/aba: deve pausar globalmente; retorno não retoma. Fechar painel controlador, aguardar lease e reabrir/assumir; não pode haver dois controladores. Suspender/acordar notebook de modo controlado e conferir pausa por interrupção.
10. Parar/reiniciar o serviço: sessão/códigos novos, T0 pausado, pareamento/início explícitos. Clientes antigos não podem retomar com comando/cookie antigo. Atualizar link se IP mudou.
11. Executar pelo menos 30 minutos reais, preferencialmente ensaio prolongado próximo à exposição. Registrar queda/latência perceptível, sessão/revisões, estados, pausas, hardware/OS/navegadores/rede. Avaliar metas propostas de convergência ~1 s normal/~3 s após rede restabelecida como metas a medir, não garantias já homologadas.
12. Conferir retorno à Plataforma e apresentação/Supervisor original; registrar aceite visual e físico ou ajustes. Sem sincronização física funcional, usar contingência C9 standalone em um dispositivo com identificação explícita; isso não satisfaz o aceite completo. Não publicar nem integrar antes da autorização.

## Serviço deixado para homologação

Serviço compilado iniciado em 192.168.0.3:5180 com o artefato /tmp/orquestra-c91/final, T0 pausado e códigos temporários em memória/terminal. Confirmar disponibilidade e IP a cada retomada; não presumir persistência do processo. Não foi alterado firewall nem encerrado dev 5173/5175. O usuário pode iniciar sua própria execução com os comandos acima após encerrar a instância atual.

## Situação final e próxima ação

Branch feature/modo-feira em 240253d; fontes/testes/documentos/evidências locais sem staging/commit. Package-lock não alterado; nenhuma instalação/configuração permanente de rede. main/next-evolucao/publicação não alteradas. Próxima ação: homologação visual e **homologação física pendente**, seguindo roteiro acima. Sem commit/merge/push/deploy ou outras páginas antes de orientação.
