# C9.2 — Simulação estendida integrada

15/10/2026. Implementação autorizada; homologação visual e física pendentes. Sem commit, merge, push ou deploy. Continuidade oficial registra o estado consolidado.

## Base e preservação

Inspeção inicial: feature/modo-feira, HEAD 240253d357560c5674e99bfccd7816632b388f29, sem staging. C9 e C9.1 já implementadas localmente, preservadas. Origin HTTPS SinfoniaTech/OrquestraNEXT; nenhuma operação remota nesta entrega. Novo XLSX aprovado encontrado não rastreado. AGENTS, continuidade, modos, contrato técnico, backlog/plano e FEIRA_REGRAS consultados antes das alterações.

Os 123 arquivos protegidos (legado, dados originais e ambos XLSX) foram conferidos por SHA256, sem divergências. Importador histórico preservado; nenhuma alteração das planilhas, dos quatro JSONs históricos, Supervisor original, cenas, estilos ou fixtures do legado.

## Dados e importação

`scripts/import_feira_estendida.py` lê somente FEIRA_ROTEIRO/ESTENDIDA/EVENTOS/REGRAS. Reutiliza normalize e ENUMS do importador histórico. Gera exclusivamente `src/feira/data/generated.json`, consumido pelo módulo imutável `src/feira/data/index.js`. JSON não é editado manualmente.

Datas Excel locais são convertidas para ISO com -03:00, segundos e referência America/Sao_Paulo. Horario_Operacional é datetime completo no arquivo aprovado. Vazios tornam-se null; números devem ser finitos, campos inteiros rejeitam frações e booleanos; strings são NFC/trim. Fórmulas nos registros operacionais são rejeitadas. As fórmulas do resumo executivo abaixo do roteiro não são dados de snapshots e não são importadas. --check reconverte e compara bytes, sem gravar. Nenhum artefato parcial é gravado antes de todas as validações.

Validações: schema 46+2 campos, T00–T11 na ordem, 27 s por estado, referências crescentes no dia 08/09/2026 entre 08h e 17h, IDs únicos por snapshot, nenhuma remoção/alteração da identidade, progressão de status, marcos sem futuro, TA somente após chegada, TB/Fechamento somente em concluídos, indicadores do roteiro e diff auditado por multiconjunto de eventos.

| Estado | Total | Ativos | Concluídos | Laranja ativo | Vermelho ativo |
| --- | ---: | ---: | ---: | ---: | ---: |
| T00 | 10 | 10 | 0 | 0 | 0 |
| T01 | 16 | 14 | 2 | 0 | 1 |
| T02 | 24 | 12 | 12 | 2 | 2 |
| T03 | 27 | 13 | 14 | 5 | 4 |
| T04 | 30 | 11 | 19 | 4 | 3 |
| T05 | 34 | 9 | 25 | 3 | 2 |
| T06 | 37 | 10 | 27 | 0 | 5 |
| T07 | 41 | 10 | 31 | 1 | 4 |
| T08 | 44 | 12 | 32 | 1 | 6 |
| T09 | 48 | 11 | 37 | 1 | 6 |
| T10 | 51 | 9 | 42 | 1 | 4 |
| T11 | 55 | 10 | 45 | 1 | 4 |

417 registros de estados, 55 IDs finais, 189 eventos: 55 NOVO, 83 STATUS e 51 CRITICIDADE. Cada carteira substitui a anterior; custos/linhas repetidos nunca são somados entre estados. T00–T02 pertencem à nova série independente, com futuros já ocultos conforme FEIRA_REGRAS; T0/T1/T2 originais continuam intactos.

## Motor, sincronização e interfaces

Motor existente recebe sequência configurável com fontes/durações; preserva a sequência original como configuração de compatibilidade dos testes C9/C9.1. Standalone e serviço usam a série estendida por padrão. 12 × 27 s +12 s finais =336 s em 1×, 168 s em 2×. Intervalo final mantém T11; reinício retorna a T00. Pausa preserva resíduo; velocidade altera exposição, sem interpolar fatos ou relógio operacional.

C9.1 reutilizada: único engine no notebook, DTO completo via SSE, comandos POST, sessão/revisão, autorização, controle exclusivo, lease/locks, ACK antes do detalhe, idempotência, reconexão, refresh, entrada tardia e detecção de estado desatualizado. Clientes conectados não importam o motor nem a massa completa. Nova sessão começa T00 pausado; standalone inicia automaticamente. Fechar detalhe não retoma. Notebook desfocado/oculto ou perda do controle pausa globalmente.

BackOffice mostra ID/fase, horário, progresso entre 12 estados, ciclo explicado, população, ativos/concluídos, distribuição exclusivamente ativa, lista priorizada, mudanças auditáveis e destaque do roteiro. Supervisor Feira apresenta a mesma carteira, técnico/supervisor, prioridades, contexto e insights; permanece uma interface específica, independente do Supervisor original. Cor histórica de concluídos não gera alerta ativo. Laranja comunica oportunidade de intervenção. Regras sintéticas da nova série não são adotadas como regra da Plataforma ou validação real OTIS.

## Arquivos desta adaptação

- Novos: `scripts/import_feira_estendida.py`, `src/feira/data/index.js`, `src/feira/data/generated.json`, `tests/feira-extended.test.mjs`, `tests/feira-extended-browser.test.mjs`, `tests/importacao-feira.test.py`, este relatório e evidências c92-*.
- Adaptados no motor/dados: `src/feira/temporalState.js`, `selectors.js`, `useFeiraClock.js`; protocolo `src/feira/sync/protocol.js`.
- Adaptados na apresentação: `src/feira/FeiraPanel.jsx`, `FeiraApp.module.css`, `SupervisorFeira.jsx`, `SyncedFeiraApp.jsx`.
- Serviço existente: `server/feira-session.mjs` e `server/feira-server.mjs`.
- Regressões/ensaios: `tests/feira-browser.test.mjs`, `platform-dev.test.mjs`, `feira-sync-service.test.mjs`, `feira-sync-browser.test.mjs`, `feira-endurance.mjs`, `feira-sync-endurance.mjs` e README de testes.
- Documentação: continuidade, índice, backlog, plano incremental, modos, contrato técnico e ponteiros nos relatórios C9/C9.1.

O XLSX estendido foi fornecido/aprovado pelo usuário e permanece não rastreado, sem edição. App, componentes compartilhados e demais arquivos C9/C9.1 já modificados antes da C9.2 continuam preservados; o inventário completo do Git contém trabalho acumulado, não somente esta adaptação.

## Validação e evidências

A primeira execução detectou falha de detalhe mobile em T11: o DTO completo (~237 KB, incluindo perspectivas derivadas) ultrapassava a fila anterior ao publicar várias revisões do mesmo comando. Serviço passou a publicar comandos atomicamente e coalescer backpressure SSE em um único estado pendente. O cliente mostra falhas de interação em vez de ocultá-las. Teste cobre abertura/fechamento em T11 e a atomicidade do comando, sem reduzir dados ou alterar a política de pausas.

**394 distintos aprovados: 377 Node/navegador +17 Python** (nove históricos +oito novos), sem falha/skip/cancelamento na suíte final. Inclui toda a regressão anterior; 26 casos Node/browser e oito Python acrescentados à referência de 360. Suíte completa repetida após a correção SSE. Verificação adicional dos mesmos IDs/status/cor/técnico/supervisor nas duas interfaces em todos os estados: sete testes reexecutados, sem duplicar a contagem.

Build de produção aprovado em /tmp/orquestra-c92/delivery, base /OrquestraNEXT, 198 módulos. Aviso de chunk>500 KB permanece; não impede build. Importador histórico e estendido --check aprovados; normalização/UTF-8/determinismo e rejeição de dados inválidos testados. 123 arquivos protegidos conferidos, zero divergências.

Motor: 10 mil ciclos puros estendidos, regressão dos mil ciclos originais, 100 ciclos estendidos na UI e 20 sincronizados com relógio controlado. Dois ciclos reais estendidos 336s/168s executados antes da correção de fila SSE; depois dela, ciclo real adicional de 168s aprovado no serviço final, além da regressão integral. Isso comprova software em dois contextos, sem substituir o ensaio prolongado físico.

Chrome: 1366×768,390×844,768×1024, sem overflow horizontal, com rolagem vertical para conteúdo analítico. T00–T11, populações/criticidade ativa, detalhe/pausa/fechar/retomar, entrada tardia/refresh, desconexão/reconexão, loops, revisão/versão/sessão, limpeza, ESM e regressão da apresentação/Supervisor/dez cenas aprovados. Smoke do serviço efetivo no IP Wi-Fi 192.168.0.3:5180 passou com dois contextos. Celular físico e WAN desligada não testados.

Evidências: [377 Node/browser](evidencias/c92-regression.tap), [Python histórico](evidencias/c92-python-original.txt), [Python estendido](evidencias/c92-python-extended.txt), [build](evidencias/c92-build.txt), [importador original](evidencias/c92-import-original.txt), [importador estendido](evidencias/c92-import-extended.txt), [ciclo real final](evidencias/c92-endurance.txt), [dois ciclos antes da correção SSE](evidencias/c92-endurance-before-sse-fix.txt), [consistência das duas vistas](evidencias/c92-two-views.tap), [LAN](evidencias/c92-lan-smoke.txt), [preservação](evidencias/c92-preservation.txt).

Capturas conferidas: [BackOffice T11](evidencias/c92-notebook-t11.png), [mobile T11](evidencias/c92-mobile-t11.png), [detalhe pausado](evidencias/c92-mobile-detail.png), [tablet](evidencias/c92-tablet.png), [serviço LAN notebook](evidencias/c92-lan-notebook.png), [serviço LAN mobile](evidencias/c92-lan-mobile.png). Homologação visual do usuário e física permanecem pendentes.

## Execução e homologação física

Na raiz, usando dependências já instaladas:

```bash
npm run build
npm run feira:local -- --list-addresses
npm run feira:local -- --host IP_WIFI_DO_NOTEBOOK --port 5180 --dist dist
```

Conferir porta/processo antes de iniciar. O launcher exige IP específico; não alterar firewall/rede permanentemente. Códigos temporários aparecem somente no terminal, não nos arquivos/URLs. Usar código administrativo no notebook e código Supervisor no celular.

- Notebook: `http://IP_WIFI_DO_NOTEBOOK:5180/OrquestraNEXT/?modo=feira`.
- Celular: `http://IP_WIFI_DO_NOTEBOOK:5180/OrquestraNEXT/?modo=supervisor-feira`.
- Dev standalone: `http://127.0.0.1:5175/OrquestraNEXT/?modo=feira` (ou 5173). Não sincroniza dois dispositivos.

Roteiro físico: conectar ambos à mesma rede; iniciar/parear; assumir controle no notebook; conferir T00; desabilitar WAN preservando Wi-Fi; iniciar e percorrer T00–T11 comparando mesmos IDs/status/cor/SLA/técnico; abrir detalhe no celular e conferir pausa global; fechar sem retomada; retomar no notebook; testar 1×/2×/reinício/espera final; desconectar/reconectar celular; refresh/entrada tardia; ocultar notebook e conferir pausa; reiniciar serviço e confirmar nova sessão/códigos/T00 pausado. Ensaiar pelo menos 30 minutos e registrar hardware/navegadores/rede/latência e aceite. Dois contextos no mesmo computador não substituem esse teste.

## Limites e próxima ação

HTTP local sem cifragem requer rede controlada; sem internet pública funciona após servir build/arquivos locais, mas isso ainda exige homologação física com WAN desligada. Bundle standalone mantém aviso de chunk grande. DTO T11 de aproximadamente 237 KB por atualização/cliente exige avaliar a rede física; coalescência limita filas, sem prometer latência não medida. Sem garantia de latência física ou operação corporativa real. /tmp é temporário; preservar evidências aprovadas em docs. Aguardar homologação integrada; nenhuma próxima entrega ou operação Git/publicação está autorizada.

## Estado ao concluir a implementação, antes do diagnóstico físico

Branch feature/modo-feira e HEAD 240253d357560c5674e99bfccd7816632b388f29 mantidos, nada staged. Todas as alterações C9/C9.1/C9.2 preservadas localmente, sem commit/merge/push/deploy. main local a350cd0 e next-evolucao local 240253d preservadas; nenhuma operação no remoto/Pages nesta entrega. Última publicação comprovada continua sendo C8/547db4d; a referência local origin/gh-pages 429d377 está desatualizada e não foi usada como prova do remoto.

A instância anterior C9.1 da porta 5180 foi identificada (PID45515), anunciada e encerrada. Serviço C9.2 iniciado no mesmo IP Wi-Fi/porta com /tmp/orquestra-c92/delivery, nova sessão T00 pausada e novos códigos temporários; smoke efetivo aprovado. Dev 5173/5175 preservados. Nenhuma configuração permanente de rede/firewall ou dependência instalada. Confirmar IP/porta/processo na próxima sessão.

Backlog, plano incremental, modos, contrato técnico, relatórios C9/C9.1, índice, testes e continuidade atualizados. Próxima ação: homologação visual/física integrada do usuário, seguindo o roteiro; nenhuma autorização de versionamento ou publicação vigente para esta entrega.

## Diagnóstico da divergência na homologação física — 15/10/2026

**C9.2 não homologada.** O usuário relatou Supervisor na sessão 1e450867/revisão1355 sem acompanhar o notebook. Informou depois que o notebook estava em `http://127.0.0.1:5175/OrquestraNEXT/?modo=feira`.

### Causa confirmada e alcance da evidência

Notebook em 5175 monta FeiraApp/useFeiraClock independente, sem a flag local-config do serviço. Celular estava na sessão do Node 192.168.0.3:5180. Na leitura autenticada inicial, o Node estava T00/revisão1381, paused, started=false, 27000ms, velocidade1, sem controlador e sem locks. Nunca havia recebido Iniciar. SSE respondeu HTTP200/text-event-stream e enviou1381/1382 em T00/paused. Revisões de conectividade continuam crescendo durante a pausa; não representam avanço de snapshot.

**Duas causas operacionais foram confirmadas:** notebook inicialmente no modo independente5175 e, depois, notebook pareado como Supervisor/somente leitura, sem permissão de iniciar o serviço. Ao comparar simultaneamente as duas telas, o usuário confirmou mesma sessão1e450867/revisão2158 e ambos T00/08:00; a observação anterior T01/T00 não se confirmou nessa comparação. Após novo pareamento administrativo, confirmou avanço conjunto na sessãoe562d2a8; a leitura autenticada posterior do serviço registrou T01/08:30. Esse aceite é parcial e não homologa a entrega inteira. Não foi demonstrada falha de emissão/aplicação SSE nesse caso. A correção anterior de backpressure T11 permanece válida e não explica este relato. [Registro sem credenciais](evidencias/c92-diagnostico-source.txt).

IP Wi-Fi e bind 192.168.0.3:5180 confirmados, dev5173/5175 somente loopback. Conexões TCP com um peer LAN192.168.0.9 tinham dados reconhecidos e filas zero; isso não identifica automaticamente o dispositivo nem comprova renderização no celular. Firewall/isolamento/AP/alternância para dados móveis não foram alterados, nem comprovados como causa. Chrome Android/Safari iOS físicos não foram instrumentados. Homologação física permanece pendente.

### Menor correção implementada

- Feira independente apresenta aviso permanente: sem sincronização com celular, relógio próprio, usar o endereço do serviço local em ambos os dispositivos.
- Feira conectada oferece diagnóstico recolhível com origem/IP/porta, sessão completa, revisão aplicada, snapshot, horário operacional, reprodução, velocidade, resíduo e motivo de pausa. Aguardando início não é confundido com operação em reprodução.
- Notebook pareado como Supervisor explica explicitamente o acesso somente de leitura e oferece Entrar como operador do notebook. O formulário reutiliza pair(code) existente; código administrativo válido é obrigatório. Código errado não amplia permissões, cancelar mantém leitura, e o operador ainda precisa assumir controle e iniciar.
- Nenhuma mudança no motor, protocolo SSE/POST, fila, validações de sessão/revisão, políticas de autenticação/autorização, reconexão, dados ou regras. Não introduz polling, transporte alternativo, dependência ou relógio paralelo.

Arquivos funcionais: `src/feira/FeiraApp.jsx`, `FeiraPanel.jsx`, `FeiraApp.module.css`, `SyncedFeiraApp.jsx`, `SyncFeira.module.css`. Testes: novo `tests/feira-source-browser.test.mjs` e caso adicional em `feira-extended-browser.test.mjs`. Documentação: este relatório, continuidade/backlog/contrato técnico/modos e tests/README. Trabalho local anterior preservado.

### Regressão e evidências da correção

**400 distintos aprovados: 383 Node/navegador na suíte completa final +17 Python** (9 históricos e8 estendidos). Nenhuma falha, skip ou cancelamento na suíte final. Build e ambos importadores --check aprovados. Comparação por SHA256:125 arquivos protegidos, zero divergências. Testes focados finais de pareamento/compatibilidade C9.1:18 aprovados. Testes novos reproduzem notebook independente em T02 com serviço/mobile T00 não iniciado; em seguida usam uma só origem e comprovam sessão/revisão e avanço conjunto T01/T02, pausa, refresh e retorno da visibilidade mobile sem outro engine. Acrescentada entrada tardia em T05 e refresh em T10, recuperação de página Chrome realmente congelada durante avanço do servidor e pareamento leitor→operador com rejeição de código inválido/cancelamento. Casos anteriores cobrem todas as transições, loop, detalhes T11, revisões/duplicatas/sessões, reconexão, carga SSE, cleanup e preservação.

### Serviço e novo teste físico

A instância PID96374/sessão1e450867 foi preservada durante a coleta inicial, sem comandos de reprodução do diagnóstico. Após confirmar notebook leitor e validar a UI, foi encerrada com aviso para atualização/novo pareamento. O usuário inicialmente tentou abrir a URL sem iniciar o launcher e recebeu ERR_CONNECTION_REFUSED, coerente com porta sem processo. O serviço atualizado foi então iniciado pelo agente em192.168.0.3:5180, build /tmp/orquestra-c92-diagnostico/operador, PID133024, sessãoe562d2a8-1656-44c1-9904-1556dd94b05d. HTTP200 confirmado.

Por solicitação de não compartilhar códigos no chat, o launcher temporário externo ao repositório entregou os códigos em arquivo efêmero privado (diretório0700, arquivo0600), não servido pelo HTTP, removido após30min ou no encerramento. Não contém credenciais no Git/documentos/logs do produto. Código de Supervisor não concede controle. O usuário confirmou acesso ADMIN/controles e depois avanço conjunto nos dois aparelhos; ciclo físico completo, pausa/retomada/reconexão/WAN desligada ainda não homologados.

O aviso independente fica disponível no dev5175 por HMR. O serviço5180 agora serve as mensagens de fonte e a troca autenticada de acesso do build /tmp/orquestra-c92-diagnostico/operador. Dev5173/5175 preservados; não são o serviço sincronizado. Arquivos de assets de build em uso não foram sobrescritos silenciosamente.

1. Notebook: abrir `http://192.168.0.3:5180/OrquestraNEXT/?modo=feira`, sem5173/5175. Usar o pareamento administrativo pelo terminal, sem compartilhar códigos.
2. Celular: mesma Wi-Fi, abrir `http://192.168.0.3:5180/OrquestraNEXT/?modo=supervisor-feira`. Usar código Supervisor do terminal; confirmar a mesma sessão.
3. Notebook: Assumir controle → Iniciar. Conferir T00→T01 após27s e T02 após mais27s; em2× são13,5s. Manter foco/visibilidade no notebook: trocar para outro app/aba pausa globalmente, e voltar não retoma.
4. Comparar IDs/status/cor/técnico/SLA nas duas telas atéT11; aguardar27s deT11 e12s finais em1× para retornoT00. Abrir detalhe mobile confirma pausa global; fechar não retoma; notebook usa Retomar.
5. Testar perda/reconexão, refresh e entrada tardia; celular deve indicar desconexão/congelar e recuperar a carteira completa. Testar WAN desligada mantendo Wi-Fi local, sem confundir falha da rede local com falta de internet.
6. Registrar pelo menos um ciclo físico completo com pausa/retomada. Só depois solicitar/registrar homologação explícita. Se novos sintomas persistirem com a mesma origem/sessão, coletar snapshot/revisões/conectividade e horário, sem credenciais.

Para reiniciar futuramente, conferir/encerrar a instância correta e executar no terminal do operador:

```bash
npm run feira:local -- --host 192.168.0.3 --port 5180 --dist /tmp/orquestra-c92-diagnostico/operador
```

Isso inicia outra sessão T00 pausada e exibe novos códigos somente no terminal. Para uso durável, gerar build em dist com npm run build e usar --dist dist. /tmp não é backup permanente. Sem commit/merge/push/deploy; branch feature/modo-feira/HEAD240253d mantidos. Aguardar nova homologação física do usuário.

Evidências da correção: [suíte final](evidencias/c92-diagnostico-regression.tap), [18 focados de acesso](evidencias/c92-diagnostico-roles.tap), [Python histórico](evidencias/c92-diagnostico-python-original.txt), [Python estendido](evidencias/c92-diagnostico-python-extended.txt), [build](evidencias/c92-diagnostico-build.txt), [importador histórico](evidencias/c92-diagnostico-import-original.txt), [estendido](evidencias/c92-diagnostico-import-extended.txt), [preservação](evidencias/c92-diagnostico-preservation.txt), [reprodução da mistura de fontes](evidencias/c92-diagnostico-independent-notebook.png), [notebook conectado](evidencias/c92-diagnostico-connected-notebook.png), [mobile conectado](evidencias/c92-diagnostico-connected-mobile.png). [Ciclo real 2× do build final](evidencias/c92-diagnostico-endurance.txt) aprovado: T00–T11 e retornoT00, sem erroJS nem pausa inesperada. [Estado do serviço após o teste do usuário](evidencias/c92-diagnostico-servico-final.json): nova sessão, T01/08:30, started=true, controlador ativo, pausas manual/interruption,16 registros. Essa consulta não enviou comando de reprodução. Não declarar homologação completa pelo aceite parcial de avanço conjunto.

## Evolução visual do Supervisor Feira — 19/10/2026

### Escopo, estado e revisão

Autorização do usuário: adaptar os templates originais ao Supervisor Feira e consolidar documentação, sem alterar legado/datasets/protocolo e sem commit/merge/push/deploy. US14.13, com US01/05/15/16 transversais; nenhuma nova história ou ponte US19. Auditoria confirmou raiz OrquestraNEXT, branch feature/modo-feira e HEAD240253d357560c5674e99bfccd7816632b388f29. Árvore inicial:12 rastreados modificados e os arquivos C9/C91/C92 não rastreados já existentes, nada staged. [Inventário inicial](evidencias/supervisor-visual-initial-git.txt). Todos preservados.

A inspeção comparou os oito adaptadores supervisor-cena com a interface conectada. A [matriz, decisão de isolamento, arquitetura e contrato de campos](../tecnica/pontos-integracao-supervisor.md#supervisor-feira--adaptação-visual-autorizada-19102026) é a fonte técnica oficial; não duplicada aqui. Nenhuma alteração em AGENTS.md: já contém instruções permanentes curtas e responsabilidades documentais adequadas.

### Implementação e arquivos desta evolução

- `src/feira/SupervisorFeira.jsx`: composição mobile, cabeçalho, indicadores, navegação Chamados/Alertas/Mais, filtro Ativos/Concluídos, pending/erro e retorno de foco ao card.
- `src/feira/supervisor/SupervisorParts.jsx`: card com faixa de cor, identificador, cliente/equipamento/problema, status, abertura, vínculos, motivo e mudanças; badge de cores BASE.
- `src/feira/supervisor/SupervisorDetail.jsx`: detalhe específico agrupado, histórico disponível na fotografia, valores materializados/definições temporais, motivo/insight/EXT e proveniência.
- `src/feira/supervisor/presentation.js`: funções puras de exibição/filtros/rótulos; nunca ordena ou recalcula SLA/criticidade.
- `src/feira/supervisor/useSnapshotMotion.js`: técnica FLIP adaptada; depende de fotografia/ciclo e IDs, sem animação repetida em heartbeat ou troca de aba/filtro; respeita reduced-motion.
- `src/feira/supervisor/Supervisor.module.css`: navy/marca, hierarquia de cards, quatro cores, modal agrupado, grid responsivo, navegação sticky no fluxo e fontes de sistema.
- `tests/feira-supervisor.test.mjs`, `tests/feira-supervisor-browser.test.mjs`:17 casos novos descritos no tests/README. `tests/feira-extended-browser.test.mjs`: fortalece o caso existente de tablet após20 ciclos, verificando altura e limite de animações antes da captura.
- Documentação atualizada: continuidade, índice, backlog, plano-incremental, modos, pontos-integracao-supervisor, este relatório e tests/README; evidências supervisor-visual-*.

**Reutilização efetiva:** logo local, Dialog nativo (modal/foco/Escape) e StatusBadge puros da infraestrutura existente. **Adaptação visual isolada:** SupervisorHeader/ChamadoCard/PriorityBadge/ListaChamados/AvisoCritico/ChamadoDetalheView/BarraInferior. **Técnica adaptada:** FLIP de tutorial/hooks; não importado, pois o arquivo também contém roteiro/timers e fluxo de tutorial. Nenhum componente original foi modificado para acomodar a Feira.

Alertas permanecem disponíveis na aba/destaque voluntário, sem modais automáticos a cada estado. Só Laranja/Vermelho ativos, com motivo da fonte. Concluídos ficam no histórico e preservam somente sua cor histórica. Não há mapa, telefone, despacho, reserva, estoque ou recomendação logística fictícia. O detalhe exige pausa global confirmada; fechar não retoma. Serviço, transporte, DTO, controle administrativo e BackOffice permanecem inalterados por esta evolução.

### Evidências visuais

Mesmo build de origem e T00 foram usados para o antes; build novo para depois. Sessões nos screenshots são técnicas/temporárias, não códigos de acesso.

| Vista | Evidência |
| --- | --- |
| Antes, Supervisor Feira T00/390px | [Antes](evidencias/supervisor-visual-before.png) |
| Depois, viewport390×844 | [Mobile](evidencias/supervisor-visual-after-mobile-viewport.png) |
| Depois, lista completa T00 / T03 | [T00](evidencias/supervisor-visual-after-mobile-t00.png), [T03](evidencias/supervisor-visual-after-mobile-t03.png) |
| Alertas ativos | [Alertas](evidencias/supervisor-visual-after-alerts.png) |
| Detalhe/pausa global | [Detalhe](evidencias/supervisor-visual-after-detail.png) |
| Responsividade390×844,768×1024,1366×768 | [390](evidencias/supervisor-visual-after-390x844.png), [768](evidencias/supervisor-visual-after-768x1024.png), [1366](evidencias/supervisor-visual-after-1366x768.png) |

Revisão visual executada nas capturas mobile,tablet e detalhe: hierarquia, agrupamentos, rolagem e navegação legíveis. Assertions nas três dimensões verificam ausência de overflow horizontal e botões inferiores>=44px. Não equivalem a auditoria integral WCAG/cross-browser ou homologação física.

### Validação atual

-17 novos casos específicos aprovados: [TAP](evidencias/supervisor-visual-focused.tap). A preparação dos testes corrigiu a URL de interceptação e a espera do foco pós-navegação. O teste revelou retorno de foco ausente ao fechar modal após o card ter sido temporariamente desabilitado; corrigido no adaptador Feira, sem modificar Dialog compartilhado.
- **Resultado final:417 testes distintos aprovados =400 Node/browser +17 Python**, incluindo todos os400 do marco anterior e17 novos. [Regressão completa final](evidencias/supervisor-visual-regression.tap):400/400, zero falhas/skip/cancelamentos,289,99s. Inclui100 ciclos UI,20 sincronizados,12 estados,entradas tardias,suspensão/reconexão,ESM real,plataforma e dez cenas. Execução com concorrência limitada4 e polling somente no ambiente do processo.
- A [primeira execução](evidencias/supervisor-visual-first-regression.tap) registrou três falhas: captura de tablet, teste de teclado ainda carregado antes da correção definitiva e Vite EMFILE. O [teste dev com polling temporário](evidencias/supervisor-visual-dev.tap) passou9/9, sem mudar configuração permanente. A repetição sequencial confirmou que a captura era um defeito FLIP, corrigido conforme abaixo; não uma falha de sincronização.
- A repetição sequencial isolou a falha de captura como defeito da adaptação FLIP:626 animações simultâneas realimentavam coordenadas e elevavam scrollHeight a33.554.432px. [Diagnóstico](evidencias/supervisor-visual-capture-diagnostic.tap). Cleanup agora cancela os efeitos anteriores antes da próxima medição e ao desmontar. O caso tablet existente exige altura<20mil px e no máximo2 animações por card. [25 casos após correção](evidencias/supervisor-visual-motion-fixed.tap) aprovados, incluindo captura; não mascarado com remoção da evidência ou desativação de animações no teste. Protocolo/dados intactos. [Tablet após20 ciclos, build final](evidencias/supervisor-visual-tablet-after-20-loops.png). A captura foi refinada para aguardar o fim natural das animações, após verificar seus limites, e confirmar ausência de sobreposição ao cabeçalho; [8 casos estendidos reexecutados](evidencias/supervisor-visual-stable-capture.tap) aprovados no mesmo build final. Não há desativação de animações no ensaio.
-17 Python aprovados: [9 históricos](evidencias/supervisor-visual-python-original.txt), [8 estendidos](evidencias/supervisor-visual-python-extended.txt).
- [Build](evidencias/supervisor-visual-build.txt) aprovado; aviso conhecido de chunk>500kB. [Importador histórico](evidencias/supervisor-visual-import-original.txt) e [estendido](evidencias/supervisor-visual-import-extended.txt) --check aprovados; sem conversão/escrita de dados.
- [119 hashes rastreados protegidos](evidencias/supervisor-visual-preservation.txt) idênticos ao início. Incluem Supervisor/cenas, configuração de cenas, dados/planilha histórica e importador original. Série estendida também verificada por --check; serviço/transporte/dados não alterados nesta evolução.
- Links relativos dos oito documentos e git diff --check revisados; nenhuma nova fonte concorrente de continuidade/arquitetura/requisitos.

Comandos executados (runtimes já existentes, sem instalação):

```bash
ORQUESTRA_NODE=/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node
ORQUESTRA_PYTHON=/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3
npm run build -- --outDir /tmp/orquestra-supervisor-fixed/dist
CHOKIDAR_USEPOLLING=true ORQUESTRA_TEST_DIST=/tmp/orquestra-supervisor-fixed/dist "$ORQUESTRA_NODE" --test --test-concurrency=4 --test-reporter=tap tests/*.test.mjs
"$ORQUESTRA_NODE" --test --test-reporter=tap tests/feira-supervisor.test.mjs tests/feira-supervisor-browser.test.mjs
"$ORQUESTRA_PYTHON" -B tests/importacao-dados.test.py
"$ORQUESTRA_PYTHON" -B tests/importacao-feira.test.py
"$ORQUESTRA_PYTHON" -B scripts/import_orquestra.py --check
"$ORQUESTRA_PYTHON" -B scripts/import_feira_estendida.py --check
```

### Limites e próxima ação

Dois clientes Chrome/loopback, estados controlados e rede emulada demonstram o software, não a bancada física notebook/celular. Novo ciclo de relógio real prolongado não executado nesta adaptação; evidências anteriores não são apresentadas como atuais. Aguardar homologação visual e ciclo físico completo com pausa/retomada/reconexão/LAN sem WAN, conforme roteiro C9.2. Nenhum serviço de demonstração do usuário foi reiniciado; testes criam/encerram somente seus serviços temporários.

Git final confirmado: feature/modo-feira/HEAD240253d e staging vazio;12 rastreados modificados anteriores mantidos e arquivos não rastreados preservados/acrescidos somente no escopo. [Inventário final](evidencias/supervisor-visual-final-git.txt). Implementado/testado não é homologado/versionado/publicado. Sem commit/merge/push/deploy, instalação, alteração permanente de rede, legado ou datasets. Próxima ação autorizada ao encerrar: aguardar avaliação do usuário; não iniciar outro escopo. Prompt compacto na continuidade oficial.

## Restauração do ambiente de homologação — 19/10/2026

Pedido do usuário: restaurar o serviço local e deixá-lo ativo para homologação visual, sem alteração funcional. AGENTS/continuidade/Git conferidos: feature/modo-feira, HEAD240253d,12 rastreados já modificados e arquivos locais anteriores preservados; staging vazio. Nenhum commit/merge/push/deploy, instalação, alteração de datasets/Supervisor original ou de outros serviços.

**Diagnóstico:** IP Wi-Fi continuava192.168.0.3/24, mas não havia listener/processo na5180. Isso explica ERR_CONNECTION_REFUSED; não foi identificada outra aplicação ocupando a porta. A ausência do serviço foi comprovada; o motivo histórico de seu encerramento não foi estabelecido.

**Restauração:** serviço existente createFeiraServer iniciado em segundo plano (nohup/setsid), PID85493, sessãoe116893e-6bba-4dd8-a651-2a15849fab04, bind192.168.0.3:5180, build já validado `/tmp/orquestra-supervisor-fixed/dist`. Launcher operacional temporário `/tmp/orquestra-homologacao-20261019/launch-private.mjs`, metadados locais service.json e log sem códigos nesse diretório privado. O comando oficial de referência permanece `npm run feira:local -- --host IP --port 5180 --dist CAMINHO_DO_BUILD`; a camada temporária apenas evita gravar os códigos de sua saída em logs. Não modifica código/protocolo do projeto. Não configurado autostart ou mudança permanente de rede.

**Acessos:** BackOffice http://192.168.0.3:5180/OrquestraNEXT/?modo=feira e Supervisor http://192.168.0.3:5180/OrquestraNEXT/?modo=supervisor-feira, ambos no mesmo serviço. O notebook também deve usar esse IP; não substituir porlocalhost/5173/5175/Pages. Confirmados HTTP200 para ambas as páginas e401 na API sem pareamento.

**Pareamento:** novos códigos somente em arquivo local privado, fora do Git/HTTP/logs, diretório0700/arquivo0600. O caminho é localizado pelos metadados privados do serviço; não registrar os valores em documentação. ADMIN somente no notebook; SUPERVISOR no celular. Novo pareamento permitido por30min após início; clientes já pareados continuam autenticados enquanto o processo existir. Arquivo privado é removido após30min ou encerramento. Não enfraquecida autenticação.

**Validação atual executada:** dois contextos Chrome reais (notebook1366×768 e mobile emulado390×844) no IP LAN, motor/rede/POST/SSE reais, T00–T11 em2×:10/16/24/27/30/34/37/41/44/48/51/55 registros. Mesma sessão e revisões iguais observadas nas duas interfaces em todos os12 estados; zero erros JavaScript. [Evidência sanitizada](evidencias/c92-restauracao-conectividade-20261019.txt). Após o ensaio, velocidade restaurada a1×, reinício paraT00 e pausa explícita. Navegadores de teste fechados; controle disponível para usuário. [Estado final sanitizado](evidencias/c92-restauracao-estado-20261019.json):T00/08:00,10 registros,pausado,12 snapshots. Listener e HTTP200 conferidos novamente após fechar os clientes; processo deixado ativo.

Não reexecutada a suíte417, build ou importadores nesta restauração: código/dados não mudaram e o artefato validado já existia. Hashes dos arquivos funcionais/planilhas conferidos contra o início desta ação; legado também permanece sem alteração. Somente documentação/evidências operacionais atualizadas.

**Após reiniciar Ubuntu:** processos são encerrados e /tmp pode ser limpo. Procedimento manual oficial, checagem de IP/porta, build se necessário e tratamento privado dos códigos na [continuidade, seção I](../CONTINUIDADE_CODEX.md#i-ambiente-e-comandos). Não há inicialização automática instalada. A restauração atual foi desacoplada do terminal, mas não sobrevive ao desligamento/reboot.

**Pendências:** homologação visual pelo usuário em celular físico na mesma rede e ensaio físico completo de pausa/detalhe/retomada/reconexão/WAN desligada. Acesso via IP no próprio notebook e emulação mobile não comprovam conectividade de outro aparelho. Aguardar avaliação; não alterar código funcional sem defeito identificado e nova autorização.


## Redesenho dos alertas operacionais — 19/10/2026

Autorização específica do usuário; US14.13. Branch feature/modo-feira, HEAD240253d357560c5674e99bfccd7816632b388f29; staging vazio e trabalho anterior preservado. Novo resumo somente na aba Alertas: natureza, SLA materializado, janela sintética validada no snapshot, evidência de impedimento e uma recomendação. Chamados e detalhe completo mantidos; abertura permanece dependente de ACK/pausa global, fechar não retoma. [Contrato completo de SLA/evidências/recomendações](../tecnica/pontos-integracao-supervisor.md#alertas-operacionais--revisão-autorizada-em-19102026).

Arquivos desta revisão: src/feira/SupervisorFeira.jsx; src/feira/supervisor/SupervisorParts.jsx, Supervisor.module.css e novo alertPresentation.js; tests/feira-alertas.test.mjs e feira-supervisor-browser.test.mjs; os quatro documentos pertinentes (este relatório, contrato técnico, backlog e continuidade), além das evidências. Sem dependências novas, alterações de datasets, motor, serviço, SSE/POST, original/dez cenas ou apresentação padrão. Nenhum commit/merge/push/deploy.

Auditoria da massa:60 aparições de alertas ativos ao longo dos12 snapshots (não60 IDs únicos);58 sem impedimento comprovado e2 possíveis fatores por ETA; nenhum impedimento de peça confirmado. Quatro aparições envolvem passageiro preso. Todos os60 permitem janela sintética consistente neste conjunto, mas entradas nulas/inconsistentes são cobertas por fixtures isoladas. O campo restante não promete prazo real nem modela pausas; classificação de causa confirmada é conservadora e depende de texto explícito. Estoque/logística reais continuam EXT. Fixtures de causa confirmada e SLA inválido não entram na simulação ou screenshots.

Evidências reais em390×844: T03/CH-018 Laranja por SLA,81,7% consumido e≈22min; T03/CH-013 Vermelho por consumo205%, impedimento desconhecido; T06/CH-029 Vermelho por passageiro preso,95,8% consumido e≈5min (não SLA excedido); detalhe explícito. Comparação antes/depois usa o mesmo estado T03 com builds isolados; sessões/revisões diferem porque são instâncias de teste. Capturas não utilizam fixtures artificiais.

**Validação final executada em19/10/2026:450 testes distintos aprovados=433 Node/browser+17 Python(9+8),zero falhas/skip/cancelamentos.**11 casos novos (9 puros+2 browser) sobre os439 anteriores revalidados. A primeira execução também passou; após ajustes de compactação mobile e classificação textual conservadora, a suíte completa foi repetida no build final, com433/433 em≈291s. Inclui100 ciclos UI,20 loops sincronizados,12 estados,pausa/ACK,fechar sem retomar,reconexão/refresh/entrada tardia,ESM,nova apresentação/Plataforma/legado/dez cenas. O teste mobile verifica a recomendação acima da navegação em390×844,além de ausência de overflow/toques>=44px nas três resoluções.

[Suíte final](evidencias/supervisor-alertas-regression.tap), [Python histórico](evidencias/supervisor-alertas-python-original.txt), [Python estendido](evidencias/supervisor-alertas-python-extended.txt). [Build de produção aprovado](evidencias/supervisor-alertas-build.txt),209 módulos/base /OrquestraNEXT; aviso já conhecido de chunks>500kB permanece. [Importador histórico --check](evidencias/supervisor-alertas-import-original.txt) e [estendido --check](evidencias/supervisor-alertas-import-extended.txt) aprovados,sem regenerar datasets. [133 hashes desta revisão](evidencias/supervisor-alertas-preservation.txt) e [122 verificações de legado/configuração](evidencias/supervisor-alertas-legacy-preservation.txt),conjuntos parcialmente sobrepostos,zero divergências.

Comandos: `npm run build -- --outDir /tmp/orquestra-alertas/final-dist`; Node do runtime v24.19.0,`--test --test-concurrency=4 --test-reporter=tap tests/*.test.mjs`,com CHOKIDAR_USEPOLLING=true,ORQUESTRA_TEST_DIST apontando ao build final e diretórios ORQUESTRA_*_EVIDENCE isolados em/tmp/orquestra-alertas. Python do runtime existente com `-B tests/importacao-dados.test.py`, `-B tests/importacao-feira.test.py`, `-B scripts/import_orquestra.py --check`, `-B scripts/import_feira_estendida.py --check`. Sem instalação. Provas e Git sanitizados preservados neste diretório de evidências; arquivo privado de códigos não incluído.

**Pendente:** homologação visual do usuário/critério de decisão em poucos segundos e ensaio físico conjunto completo, inclusive sem WAN. Nenhum resultado automatizado equivale a esse aceite.


| Evidência real | Captura |
| --- | --- |
| Antes T03/390×844 | [Antes](evidencias/supervisor-alertas-before-390x844.png) |
| Depois T03/390×844, recomendação visível | [Depois](evidencias/supervisor-alertas-alerts-after-390x844.png) |
| Laranja por SLA / janela de intervenção | [CH-018](evidencias/supervisor-alertas-alert-orange-sla.png) |
| Vermelho por SLA / impedimento não informado | [CH-013](evidencias/supervisor-alertas-alert-red-unknown.png) |
| Vermelho por impacto, sem SLA excedido | [CH-029](evidencias/supervisor-alertas-alert-red-impact.png) |
| Detalhe completo após ação explícita | [Detalhe](evidencias/supervisor-alertas-alert-detail.png) |

**Disponibilização controlada:** serviços5180/5182 conferidos e preservados. Porta5184 livre; após comunicação, iniciado serviço autoritativo existente com o build `/tmp/orquestra-alertas/final-dist`, PID112023/sessão243ece66. BO http://192.168.0.3:5184/OrquestraNEXT/?modo=feira e Supervisor http://192.168.0.3:5184/OrquestraNEXT/?modo=supervisor-feira; parear ADMIN/SUPERVISOR em arquivo privado temporário indicado pelos metadados `/tmp/orquestra-alertas/service.json`, sem valores de códigos neste relatório. Dois contextos percorreram o tempo real atéT03/10:15;27 registros/9 alertas,mesma autoridade; abrir/fechar detalhe confirmou pausa global. Serviço deixado pausado em1×,zero erros JS. [Estado sanitizado](evidencias/supervisor-alertas-live-state.json). `/tmp` é efêmero, sem autostart; recuperação usa os comandos existentes com IP/porta/build conferidos e códigos novos no terminal privado. Homologação física e legibilidade em poucos segundos aguardam o usuário.

**Verificação adicional do resumo nos12 estados:** dois clientes no build final, autoridade de teste com avanço controlado e massa real intacta. Em cada T00–T11: ordem/IDs idênticos ao DTO, natureza/fator/recomendação/tempo correspondentes à fotografia, nenhum concluído como alerta, nenhum modal ou pausa ao listar; zero erros JS. [Resultados por snapshot](evidencias/supervisor-alertas-t00-t11.txt). É complementar à suíte automatizada, sem adicionar casos à contagem oficial.

Conferência final: páginas BO/Supervisor HTTP200; API sem pareamento401; códigos em arquivo privado0600; listeners5184/5180/5182 ativos com seus processos próprios. [HTTP](evidencias/supervisor-alertas-http.txt), [Git final](evidencias/supervisor-alertas-final-git.txt). Staging vazio,branch/HEAD preservados.


## Alertas simplificados e temas Light/Dark — 19/10/2026

Implementação aprovada pelo usuário: simplificar de fato o alerta e acompanhar automaticamente prefers-color-scheme. US14.13/US15,sem nova história. Branch feature/modo-feira,HEAD240253d357560c5674e99bfccd7816632b388f29,staging vazio;17 rastreados já modificados e todo trabalho local anterior preservados. Histórico417 citado no pedido foi confrontado com o estado efetivo450 da revisão anterior.

**Mudança:** problema/local resumidos,natureza,prazo pertinente,uma frase de impedimento e uma ação,sem antecipar histórico/status repetido/motivo extenso/técnico/mudanças no alerta. Lista Chamados também compactada,mantendo identidade/ordem/cores/status e mudanças. SupervisorAlert/Call reutilizam CompactSla; detalhe preserva os campos completos. SLA principal somente quando fundamenta o alerta; passageiro preso é emergência com SLA secundário. Interpretação de fração/consumo/restante no snapshot,validação de consistência,TA/TB,ETA e fontes desconhecidas iguais ao contrato aprovado. [Regras e tokens](../tecnica/pontos-integracao-supervisor.md#simplificação-operacional-e-temas-automáticos--19102026).

**Tema:** tokens semânticos locais e media query CSS,Light fallback,Dark automático/dinâmico. Escopo alcança pareamento,diagnóstico/conexão,erro/offline,cabeçalho,indicadores,quatro criticidades,cards,abas/select,foco,navegação,vazio e Dialog. Não muda tema do BackOffice/legado nem remonta a sessão. Estoque/peças/logística continuam EXT,sem acontecimentos ou temporizadores criados. Mesmo alerta realT03/CH-018 passou de442para371px em390×844(≈16% menor); texto repetido foi removido,sem reduzir toda a fonte para comprimir conteúdo.

**Arquivos desta revisão:** src/feira/SupervisorFeira.jsx e SyncedFeiraApp.jsx(apenas markup visual); src/feira/supervisor/SupervisorParts.jsx,SupervisorDetail.jsx,Supervisor.module.css,alertPresentation.js(flag de prioridade visual do SLA); tests/feira-alertas.test.mjs,feira-supervisor-browser.test.mjs,feira-extended-browser.test.mjs(expectativas dos campos transferidos ao detalhe) e novo feira-supervisor-theme-browser.test.mjs. Quatro documentos pertinentes e evidências. OperationalUI/Dialog/StatusBadge compartilhados,motor,servidor,transporte,dados e legado preservados. Sem dependências/commit/merge/push/deploy. modos.md não alterado nesta revisão,pois não há mudança de rota ou modo.

**Resultado efetivamente verificado:461 testes distintos aprovados=444 Node/browser+17 Python(9+8),zero falhas/skip/cancelamentos.**11 casos novos sobre450:2 puros para a prioridade visual do SLA e9 browser para acesso/fallback,Light/Dark/troca dinâmica,contraste,cards/alertas/detalhes,emergência sem barra principal,isolamento do BackOffice/legado,offline/reconexão/entrada tardia e resoluções/foco/vazio. Inclui a regressão dos100 ciclos UI,20 loops sincronizados,12 estados,ESM e dez cenas originais. [Suíte completa](evidencias/supervisor-temas-regression.tap),[Python histórico](evidencias/supervisor-temas-python-original.txt),[Python estendido](evidencias/supervisor-temas-python-extended.txt). A execução completa terminou durante a interrupção administrativa; na retomada19/10,foi conferida sua integridade e a correspondência do build com os seis arquivos de código,sem reimplementar ou repetir a suíte desnecessariamente.

[Build de produção aprovado](evidencias/supervisor-temas-build.txt),base /OrquestraNEXT; aviso conhecido de chunks>500kB permanece. [Importador histórico --check](evidencias/supervisor-temas-import-original.txt) e [estendido --check](evidencias/supervisor-temas-import-extended.txt) aprovados,sem regenerar dados. [193 arquivos fonte/servidor/datasets preservados](evidencias/supervisor-temas-preservation.txt) por SHA-256,excluídos somente os6 arquivos visuais autorizados; inclui Supervisor original/dez cenas,BackOffice/Plataforma,apresentação,motor,transporte e planilhas. Contraste de texto em648 amostras(com repetições) nos estados/temas medidos: mínimo≈5,69:1,acima do critério4,5:1 dos testes. [Medições](evidencias/supervisor-temas-contrast.json). Não equivale a auditoria integral WCAG ou homologação física.

Comandos: `npm run build -- --outDir /tmp/orquestra-temas/dist`; Node runtime24.19.0,`--test --test-concurrency=4 --test-reporter=tap tests/*.test.mjs`,CHOKIDAR_USEPOLLING=true,ORQUESTRA_TEST_DIST=/tmp/orquestra-temas/dist e diretórios ORQUESTRA_*_EVIDENCE isolados em/tmp/orquestra-temas(incluindo ORQUESTRA_THEME_EVIDENCE). Python do runtime com `-B tests/importacao-dados.test.py`, `-B tests/importacao-feira.test.py`, `-B scripts/import_orquestra.py --check`, `-B scripts/import_feira_estendida.py --check`. Sem instalação.

**Retomada após interrupção:**

| Atividade no ponto recuperado | Situação encontrada / conclusão |
| --- | --- |
| Resumo dos alertas e lista compacta | Concluída e verificada; preservada sem novas alterações |
| Temas automáticos e detalhes | Concluída e verificada; DOM/sessão/SSE/POST mantidos na troca |
| Regressão/build/importadores | Concluídos; resultados reais conferidos na retomada |
| Capturas Light/Dark | Produzidas em/tmp; consolidação durável estava pendente e foi concluída |
| Contrato técnico/relatório | Redação parcial com marcadores pendentes; finalizados nesta retomada |
| Backlog/continuidade | Ainda no marco450; atualização final concluída nesta retomada |
| Código implementado sem teste / implementação parcial | Nenhum caso remanescente identificado |
| Bloqueio técnico | Nenhum identificado |
| Homologação visual física/versionamento/publicação | Homologação depende do usuário; versionamento/publicação não iniciados,nem autorizados |

Não foi necessário alterar código funcional após a retomada. Estado completo do Git conferido antes de editar documentos;17 rastreados modificados e trabalho C9/novas telas/Feira não rastreado preservados. Staging vazio,branch/HEAD mantidos.

**Evidências:** fotografias reaisT03/CH-018 Laranja/SLA81,7% e≈22min;CH-013 Vermelho/SLA205%;T06/CH-029 passageiro preso95,8%,com SLA secundário,sem barra principal. Capturas390×844 com movimento reduzido para evitar fotografar frames transitórios; regressão FLIP executada separadamente. Sem fixtures artificiais nos screenshots.

| Caso | Dark | Light |
| --- | --- | --- |
| Lista de chamados | [A](evidencias/supervisor-temas-calls-dark-390x844.png) | [B](evidencias/supervisor-temas-calls-light-390x844.png) |
| Alerta Laranja | [C](evidencias/supervisor-temas-alert-orange-dark-390x844.png) | [D](evidencias/supervisor-temas-alert-orange-light-390x844.png) |
| Alerta Vermelho por SLA | [E](evidencias/supervisor-temas-alert-red-dark-390x844.png) | [F](evidencias/supervisor-temas-alert-red-light-390x844.png) |
| Detalhe completo | [G](evidencias/supervisor-temas-detail-dark-390x844.png) | [H](evidencias/supervisor-temas-detail-light-390x844.png) |
| Emergência com SLA secundário | [Impacto Dark](evidencias/supervisor-temas-impact-dark.png) | [Impacto Light](evidencias/supervisor-temas-impact-light.png) |
| Tablet768×1024 | [Dark](evidencias/supervisor-temas-alerts-dark-768x1024.png) | [Light](evidencias/supervisor-temas-alerts-light-768x1024.png) |

Comparação do mesmo caso/mesmo estado: [antes442px](evidencias/supervisor-alertas-alert-orange-sla.png) → [depois Light371px](evidencias/supervisor-temas-alert-orange-light-390x844.png). Sessões/revisões diferem entre builds isolados; fatos do snapshot são os mesmos.

**Ambiente:** serviço5184 conferido emT08/paused/com controlador ativo,portanto preservado,assim como5180/5182. Após comunicação,serviço existente iniciado na porta livre5186,IP192.168.0.3,build `/tmp/orquestra-temas/dist`. BO http://192.168.0.3:5186/OrquestraNEXT/?modo=feira e Supervisor http://192.168.0.3:5186/OrquestraNEXT/?modo=supervisor-feira. Códigos novos em arquivo privado temporário,referenciado por `/tmp/orquestra-temas/service.json`,fora de Git/logs públicos; não misturar portas/sessões. Sem autostart,/tmp efêmero. PID133261,sessão93df6322. Ensaio do serviço real com dois contextos Chrome:avanço temporal conjunto atéT03,27 registros/9 alertas,troca Light/Dark sem perda de fotografia,abrir detalhe confirmou pausa e fechar a manteve;zero erros JS. Deixado T03/10:15 pausado1×. [Estado sanitizado](evidencias/supervisor-temas-live-state.json). Na retomada:listener5186 ativo,páginas BO/Supervisor HTTP200,API sem pareamento401,mesma sessão/T03/paused1×,sem controlador ou locks;arquivo de códigos privado0600. [Conferência de retomada](evidencias/supervisor-temas-retomada-http.json). Serviços5180/5182/5184 continuaram ativos,sem reinícios.

Pendente homologação visual em celular/tablet físicos e critério de decisão em poucos segundos,ciclo físico completo com pausa/retomada/reconexão e LAN sem WAN. Encerrar esta implementação e aguardar o usuário;sem outra funcionalidade/versionamento/publicação.

Conferência final da retomada:links e oito capturas obrigatórias Light/Dark presentes;tablet recapturado no topo emT03/768×1024 para referência legível.193 hashes protegidos sem divergências;staging vazio e branch/HEAD preservados. [Inventário Git final](evidencias/supervisor-temas-final-git.txt).


## Alertas das cenas 3, 7 e 10 — 19/10/2026

**Escopo:** correção visual/funcional expressamente autorizada,US14.13/US15;substitui orientações visuais anteriores conflitantes. AGENTS/continuidade/Git conferidos:feature/modo-feira,HEAD240253d357560c5674e99bfccd7816632b388f29,staging vazio,17 rastreados modificados e todo trabalho anterior não rastreado preservados. Não houve branch nova,descarte,instalação,commit,merge,push ou deploy.

**Problema corrigido:** a lista anterior mostrava os resumos inline e o clique já abria a ficha extensa. Agora há lista compacta → resumo do alerta → chamado completo → retorno ao resumo → fechamento para lista. Seleção espera ACK de pausa global;um único lock durante o aprofundamento/retorno;fechamento final envia um close-detail e nunca retoma automaticamente. Falhas e reinício invalidam a seleção sem abrir conteúdo automaticamente. Chamados mantém sua abertura direta de ficha. [Contrato vigente/diagrama](../tecnica/pontos-integracao-supervisor.md#alertas-das-cenas-3-7-e-10--contrato-vigente).

**Identidade:** adaptação das cenas3/7/10,sem novos mockups:header navy/logo/ícones,cards12px com barra BASE,modal16px/max448px,cabeçalho suave,ícone circular e CTA navy. A paleta renderizada foi medida no original(navy#090b29,Laranja#f9700e,Vermelho#db0003);texto/fundo/ritmo e pilha tipográfica correspondentes,com fallback local. Os SVGs puros originais foram reutilizados sem modificar o módulo;CSS com Google Font,fixtures,roteiros e timers não foram importados. Dark mantém padrões estruturais e tons adequados à preferência do dispositivo. As telas completas e temas existentes foram preservados.

**Dados:** exemplos reais da massa aprovada:T03/CH-018 Laranja,81,7%/≈22min na fotografia;T03/CH-013 Vermelho por SLA205%;T06/CH-029 Vermelho por passageiro preso,95,8% com SLA secundário. Nenhum tempo ou ação das cenas foi transposto. Helper/fórmula de SLA,TA/TB,ETA,fatores/recomendações inalterados;unknown exibido “Impedimento não identificado”. Nenhum estoque,falta de peça ou disponibilidade inferida. Datasets/motor/transporte/servidor permanecem imutáveis nesta revisão.

**Arquivos:** src/feira/SupervisorFeira.jsx(navegação/ACK/retorno/ícones);src/feira/supervisor/SupervisorParts.jsx(lista e resumo/Dialog),SupervisorDetail.jsx(retorno explícito),Supervisor.module.css(padrões oficiais/temas). Testes adaptados:feira-supervisor.test.mjs(exceção exclusiva para SVG puro),feira-supervisor-browser.test.mjs(fluxo/ACK/falha/reinício),feira-supervisor-theme-browser.test.mjs(resumo/dialog e temas). Quatro documentos pertinentes e evidências. SyncedFeiraApp,OperationalUI,alertPresentation,motor,serviço e dados não alterados. Não criada história/continuidade concorrente.

**Resultado final:464 testes distintos aprovados=447 Node/browser+17 Python(9+8),zero falhas/skip/cancelamentos.**3 novos casos além dos461 anteriores:ACK antes do resumo/lock único e liberação final,falha de ACK sem exibição,reinício invalidando resumo sem reabertura automática. Casos anteriores adaptados para o fluxo correto e temas. A primeira suíte completa também passou;depois do ajuste de fidelidade à cor renderizada e contraste,a suíte completa foi repetida no build final,447/447 em≈291s. [Regressão final](evidencias/supervisor-cenas-regression.tap),[Python histórico](evidencias/supervisor-cenas-python-original.txt),[Python estendido](evidencias/supervisor-cenas-python-extended.txt).

Cobertura preservada:100 ciclos UI/20 loops sincronizados,T00–T11,ACK/pausa/fechar sem retomar,reconexão/entrada tardia,FLIP sem acúmulo/reduced-motion,ESM,BackOffice/nova apresentação/legado/dez cenas.31 testes focados aprovados antes da rodada completa. Teste de reinício usa o comportamento já existente do motor(reiniciar explicitamente remove pausas de detalhe/manual),sem alterar a política de fechamento/não retomar.

[Build final aprovado](evidencias/supervisor-cenas-build.txt),base /OrquestraNEXT;aviso conhecido de chunks>500kB permanece. [Importador histórico --check](evidencias/supervisor-cenas-import-original.txt) e [estendido --check](evidencias/supervisor-cenas-import-extended.txt) aprovados. [195 hashes protegidos](evidencias/supervisor-cenas-preservation.txt) sem divergências;somente4 arquivos UI autorizados alterados. [510 amostras de contraste de texto](evidencias/supervisor-cenas-contrast.json),com repetições:mínimo≈4,63:1,acima do critério4,5:1. Não constitui auditoria WCAG integral ou homologação física. [Paleta medida no original](evidencias/supervisor-cenas-reference-palette.json).

Comandos: `npm run build -- --outDir /tmp/orquestra-alertas-cenas/final-dist`;Node runtime24.19.0,`--test --test-concurrency=4 --test-reporter=tap tests/*.test.mjs`,CHOKIDAR_USEPOLLING=true,ORQUESTRA_TEST_DIST apontando ao build final e ORQUESTRA_*_EVIDENCE em subdiretórios de/tmp/orquestra-alertas-cenas. Python do runtime com `-B tests/importacao-dados.test.py`, `-B tests/importacao-feira.test.py`, `-B scripts/import_orquestra.py --check`, `-B scripts/import_feira_estendida.py --check`. Nenhuma dependência instalada.

### Comparação visual e navegação

As referências são capturas reais do legado roteirizado,em preview estático e fallback tipográfico local;os alertas novos usam exclusivamente snapshots operacionais reais. IDs/valores/ações diferem intencionalmente entre as fontes. Referência orienta identidade,não prova regras ou recursos disponíveis.

| Referência | Light operacional | Dark operacional |
| --- | --- | --- |
| [Cena3:header/cards/navegação](evidencias/supervisor-cenas-ref-cena-3.png) | [Lista Light](evidencias/supervisor-cenas-lista-light-390x844.png) | [Lista Dark](evidencias/supervisor-cenas-lista-dark-390x844.png) |
| [Cena7:Laranja](evidencias/supervisor-cenas-ref-cena-7.png) | [Alerta Laranja](evidencias/supervisor-cenas-alerta-laranja-light-390x844.png) | [Alerta Laranja Dark](evidencias/supervisor-cenas-alerta-laranja-dark-390x844.png) |
| [Cena10:Vermelho](evidencias/supervisor-cenas-ref-cena-10.png) | [Alerta Vermelho](evidencias/supervisor-cenas-alerta-vermelho-light-390x844.png) | [Alerta Vermelho Dark](evidencias/supervisor-cenas-alerta-vermelho-dark-390x844.png) |
| Emergência sem SLA excedido | [Passageiro preso](evidencias/supervisor-cenas-impacto-light.png) | [Passageiro preso Dark](evidencias/supervisor-cenas-impacto-dark.png) |
| Tablet768×1024 | [Light](evidencias/supervisor-cenas-alerta-vermelho-light-768x1024.png) | [Dark](evidencias/supervisor-cenas-alerta-vermelho-dark-768x1024.png) |

Fluxo demonstrado: [1 Lista](evidencias/supervisor-cenas-fluxo-1-lista.png) → [2 Resumo](evidencias/supervisor-cenas-fluxo-2-resumo.png) → [3 Completo](evidencias/supervisor-cenas-fluxo-3-completo.png) → [4 Volta ao resumo](evidencias/supervisor-cenas-fluxo-4-retorno-resumo.png) → [5 Lista pausada](evidencias/supervisor-cenas-fluxo-5-retorno-lista.png). [Contagem de comandos/locks por estágio](evidencias/supervisor-cenas-fluxo.json):profundidade/retorno não criam outro open-detail;lock1 permanece até fechar resumo,então0. Repetições anteriores no registro são ensaios dos dois temas,sem duplicação por uma mesma intenção.

**Ambiente:** verificada conexão ativa5186;preservados5180/5182/5184/5186. Após comunicação,porta5188 livre recebeu o serviço existente com build `/tmp/orquestra-alertas-cenas/final-dist`,PID173047,sessãoe6a673d5. BO http://192.168.0.3:5188/OrquestraNEXT/?modo=feira e Supervisor http://192.168.0.3:5188/OrquestraNEXT/?modo=supervisor-feira. Códigos novos temporários em arquivo privado indicado por `/tmp/orquestra-alertas-cenas/service.json`,fora de logs/Git/HTTP. Sem autostart,/tmp efêmero;ambos os dispositivos devem usar5188. Ensaio real com dois clientes Chrome:mesma autoridade,T00→T03,seguido de seleção do alerta,ACK de pausa,resumo→completo→resumo→lista;um open-detail e um close-detail,zero erros JS. Troca Light/Dark testada na consulta. Deixado T03/10:15,27 registros/9 alertas,pausado1×,locks0. [Estado sanitizado](evidencias/supervisor-cenas-live-state.json).

**Limites:** critério de leitura em poucos segundos e celular/tablet físicos aguardam homologação. Nenhuma previsão/estoque real é fornecida. Preservação do legado validada no preview estático;política CSP do serviço conectado bloqueia fonte externa do legado,limitação investigada separadamente sem alterar servidor ou cenas. Não converter teste automatizado em aceite do usuário. Aguardar homologação antes de versionar/publicar.


**Nota da captura do legado:** a CSP do serviço conectado bloqueia a fonte externa já usada pelo legado,causando erro no preload do CSS. Reproduzido também no serviço anterior5186,sem pareamento/comando;[prova sanitizada](evidencias/supervisor-cenas-legacy-csp-check.txt). A captura das referências e a regressão das dez cenas usam o preview estático,onde o legado tem seu comportamento original. Na captura comparativa,Google Fonts foi substituído somente no navegador de ensaio por resposta CSS vazia para usar o mesmo fallback local;nenhum arquivo/regra de CSP foi alterado. Corrigir essa limitação preexistente seria outro escopo,pois o usuário proibiu mudanças no serviço/legado.

**Pareamento:** instâncias no mesmo IP usam o mesmo nome/path de cookie;parear portas diferentes no mesmo perfil pode substituir a autenticação anterior. Para preservar os pareamentos antigos,use janela anônima ou perfil separado ao homologar5188. Ambos os dispositivos devem usar a mesma nova porta e os códigos correspondentes;nenhuma mudança no protocolo foi introduzida.

Conferência final:BO/Supervisor HTTP200;API sem pareamento401;mesma sessão/T03/paused1×/locks0;arquivo privado0700/0600. [HTTP/estado](evidencias/supervisor-cenas-final-http.json),[Git final](evidencias/supervisor-cenas-final-git.txt). Instâncias5180/5182/5184/5186/5188 com seus processos próprios,não reiniciadas. Staging vazio,branch/HEAD preservados.


## Implementação visual oficial — 19/10/2026

Revisão adicional solicitada após a correção anterior. A comparação efetiva das capturas identificou que a lista ainda tinha cards altos e outra hierarquia. Foram ajustados `SupervisorParts.jsx` e `Supervisor.module.css`, preservando o fluxo e os contratos já implementados. O teste de temas passou a verificar altura compacta (<160px), identificação junto do badge e SLA à direita.

Referências oficiais aprovadas: [Cena 3](https://sinfoniatech.github.io/OrquestraNEXT/?utm_source=chatgpt.com#/3), [Cena 7](https://sinfoniatech.github.io/OrquestraNEXT/?utm_source=chatgpt.com#/7), [Cena 10](https://sinfoniatech.github.io/OrquestraNEXT/?utm_source=chatgpt.com#/10). Renderizações locais em `?modo=legado#/3`, `/7` e `/10`, com os componentes originais intactos, examinadas em 390×844 nos dois esquemas. A referência original permanece clara mesmo quando o dispositivo solicita Dark; a adaptação Dark pertence apenas ao Supervisor Feira. Fontes externas bloqueadas no ensaio de referência usam fallback local; não há nova dependência de rede no celular operacional.

| Referência | Implementação | Adaptação necessária |
| --- | --- | --- |
| Cena 3: cabeçalho navy/logo, faixa lateral, badge+ID, local/problema, SLA à direita, lista vertical/nav inferior | Mesma composição compacta; lista única inclusive no tablet; nav fixa com área segura | BASE mantém quatro cores; percentual recebido substitui contador fixo; status/eventos reais; filtros ativos/concluídos e estado sincronizado preservados |
| Cena 7: aviso arredondado, cabeçalho suave Laranja, triângulo circular, texto/ação e botão navy | Resumo operacional com um CTA e fechamento acessível | Identificação/problema, SLA válido, impedimento e uma recomendação; sem histórico/EXT; fonte menor que o destaque anterior para recuperar hierarquia |
| Cena 10: aviso crítico Vermelho com a mesma composição | Cabeçalho/borda/ícone Vermelhos, mesma estrutura resumida | Impacto e SLA continuam independentes; passageiro preso mantém destaque sem fingir estouro; texto fixo original não copiado |

Capturas reais lado a lado, examinadas: [Light](evidencias/supervisor-oficial-comparacao-light.png) e [Dark](evidencias/supervisor-oficial-comparacao-dark.png). Cada prancha contém os três pares em 390×844. As diferenças restantes são dados reais dos snapshots, requisitos de acessibilidade (alvos de 44px), sincronização/filtros, adaptação Dark e conteúdo resumido aprovado; não se declara reprodução pixel a pixel. O CTA do tutorial com dois botões foi adaptado para uma ação principal e fechar nativo, preservando retorno/foco.

Fluxo preservado: lista de alertas → resumo após ACK → completo → resumo com mesmo lock → lista. Só abrir/fechar resumo envia comandos; fechar mantém pausa. SLA usa fração aprovada (2,05→205%); tempo restante só quando o helper existente comprova consistência; TA/TB não usados. Não há relógio no celular, recálculo BASE, fixture ou temporizador do tutorial.

Validação desta revisão: resultados finais e serviço registrados abaixo após conclusão da suíte. Evidências prefixadas `supervisor-oficial-`; marcos anteriores não substituem esta execução. Primeira tentativa de regressão interrompida por ter começado antes do build disponível; repetição completa realizada com build pronto. Nenhum serviço anterior de homologação encerrado.


**Resultado final desta execução:** 464 testes distintos aprovados (447 Node/browser + 9 importador original + 8 importador estendido), zero falhas/skip/cancelamentos. [Regressão completa](evidencias/supervisor-oficial-regression-final.tap), [build](evidencias/supervisor-oficial-build.txt), [check original](evidencias/supervisor-oficial-import-original.txt), [check estendido](evidencias/supervisor-oficial-import-extended.txt). Mantém aviso de bundle >500kB. Foram executados 100 ciclos de UI, 20 sincronizados, T00–T11, reconexão/entrada tardia, pausa global e regressão das dez cenas. Geometria mobile compacta e tablet aprovadas; temas dinâmicos sem remontar sessão/diálogo. [Contraste](evidencias/supervisor-oficial-contrast.json): 624 amostras de texto, mínimo≈4,63:1; medição não constitui auditoria integral de acessibilidade.

Comando: `CHOKIDAR_USEPOLLING=true ORQUESTRA_TEST_DIST=/tmp/orquestra-visual-oficial/dist node-do-runtime --test --test-concurrency=4 --test-reporter=tap tests/*.test.mjs`, com diretórios de evidências próprios via ORQUESTRA_*_EVIDENCE. Build com `node-do-runtime node_modules/vite/bin/vite.js build --outDir /tmp/orquestra-visual-oficial/dist`. Python existente com `-B` executou os dois testes de importação e os dois scripts `--check`; nenhum dataset regenerado. A tentativa anterior iniciada antes do build foi interrompida e não integra os resultados finais.

Serviço atual de homologação: **http://192.168.0.3:5190/OrquestraNEXT/?modo=supervisor-feira**; notebook **http://192.168.0.3:5190/OrquestraNEXT/?modo=feira**. PID189940, sessãoe1584137; build desta revisão. Serviços5180/5182/5184/5186/5188 preservados. Ensaio real na LAN com dois clientes: T00→T03,27 registros/9 alertas; abrir resumo pausou ambos; completo/retorno manteve lock; fechar deixou T03pausado1×/locks0. Exatamente1 POST de abertura e1 fechamento;zero erros JS. [Estado sanitizado](evidencias/supervisor-oficial-live-state.json). HTTP200 nos dois modos e401 na API sem pareamento. Códigos em arquivo privado efêmero apontado por `/tmp/orquestra-visual-oficial/service.json`, não registrados aqui. Usar janela anônima/perfil separado para não substituir cookies de outra instância.

Preservação SHA-256:195 arquivos fonte/serviço/dados idênticos ao baseline da correção anterior; apenas os quatro arquivos visuais já autorizados diferem daquele baseline. Nesta retomada alterados somente2 arquivos de UI (`SupervisorParts.jsx`/CSS),1 teste de temas e4 documentos existentes, além das novas evidências. Originais/datasets/servidor/motor/BackOffice não alterados. Branchfeature/modo-feira,HEAD240253d357560c5674e99bfccd7816632b388f29,17 rastreados modificados e trabalho anterior não rastreado preservado;staging vazio;sem commit/merge/push/deploy/dependências. Homologação visual/física do usuário continua pendente.


## Avisos compactos conforme imagens do usuário — 19/10/2026

O usuário solicitou nova simplificação com duas imagens oficiais: cabeçalho colorido contendo chamado/urgência, corpo curto e rodapé `Ver detalhes`/`Fechar`. Esta orientação substitui a composição anterior do resumo; não altera lista, dados, regras ou sincronização. Alterados somente `src/feira/supervisor/SupervisorParts.jsx` e `Supervisor.module.css`, dois testes de navegador e os quatro documentos existentes. Nenhuma nova história, dependência, commit ou publicação.

- Cabeçalho suave Laranja/Vermelho com triângulo circular, título e frase operacional com ID real. Percentual recebido na escala aprovada e prazo só quando consistente; emergência de passageiro preso não vira SLA excedido.
- Corpo com problema, uma recomendação fundamentada e impedimento confirmado/possível/não identificado. Sem barra de progresso, badge adicional, cadastro, histórico ou EXT. Removida a hierarquia de painel analítico do primeiro aviso.
- Rodapé com `Ver detalhes` (abre o chamado completo) e `Fechar`, lado a lado, mínimo44px. X/Escape/backdrop preservados. Detalhe→resumo mantém lock;fechar resumo retorna à lista e mantém pausa.
- Light/Dark automático mantido; nenhum relógio/temporizador/fixture importado. Lista e cabeçalho da página não alterados nesta revisão.

Capturas reais390×844: [Laranja Light](evidencias/supervisor-compacto-alerta-laranja-light-390x844.png), [Vermelho Light](evidencias/supervisor-compacto-alerta-vermelho-light-390x844.png), [Laranja Dark](evidencias/supervisor-compacto-alerta-laranja-dark-390x844.png), [Vermelho Dark](evidencias/supervisor-compacto-alerta-vermelho-dark-390x844.png). [Emergência por impacto](evidencias/supervisor-compacto-impacto-light.png). Capturas também768×1024 e cinco passos do fluxo no mesmo prefixo. Avisos Light medidos nas imagens: Laranja≈367px,Vermelho≈325px de altura; textos dependem dos dados reais. Comparações anteriores permanecem históricas; estas são as telas vigentes.

Validações específicas:15 casos do Supervisor aprovados após adaptar o CTA e verificar explicitamente os dois botões/alinhamento/alvos44px/fechamento com pausa. A primeira tentativa encontrou um falso positivo:regex `/TA|TB/` confundia IMEDIATA com campo técnico;corrigida para palavras completas e repetida. Arquivo de resultados final `supervisor-compacto-footer-check-final.tap`.

Serviço de homologação5192 iniciado sem interromper instâncias anteriores. PID202318,sessãob9b0f9c4. Dois clientes reais na LAN percorreramT00→T03:resumo pausou globalmente,detalhe/retorno manteve lock,fechar deixouT03/10:15pausado1×,27registros/9alertas,locks0. Um POSTabrir/um fechar,zero erros JS. Supervisor:http://192.168.0.3:5192/OrquestraNEXT/?modo=supervisor-feira;notebook:http://192.168.0.3:5192/OrquestraNEXT/?modo=feira. Códigos efêmeros privados indicados somente por `/tmp/orquestra-alerta-compacto/service.json`;nenhum valor em evidências/docs/logs. Usar perfil/janela anônima para preservar outros pareamentos.

Preservação por hash:197/199 arquivos fonte/serviço/datasets iguais ao início desta revisão;somente Parts/CSS alterados. Supervisor original/dez cenas,BackOffice,motor,SSE/POST e dados intactos. Branchfeature/modo-feira,HEAD240253d,staging vazio e todo trabalho local anterior preservado. Homologação do usuário pendente.


**Resultado final dos avisos compactos:**464 testes distintos reexecutados e aprovados (447 Node/browser+17 Python),zero falhas/skip/cancelamentos. Os15 testes específicos foram também repetidos após verificar explicitamente os botões;não contados em dobro. A tentativa com a regex antiga foi interrompida,seguida pela execução completa final. [Regressão](evidencias/supervisor-compacto-regression-final.tap),[botões/fluxo](evidencias/supervisor-compacto-footer-check-final.tap),[build](evidencias/supervisor-compacto-build.txt),[check original](evidencias/supervisor-compacto-import-original.txt),[check estendido](evidencias/supervisor-compacto-import-extended.txt). Build e dois importadores --check aprovados,sem alteração de datasets;aviso conhecido de bundle>500kB mantido. Cobertura inclui100 ciclos UI,20 sincronizados,T00–T11,reconexão/entrada tardia,tablet,BackOffice e dez cenas originais. [Contraste](evidencias/supervisor-compacto-contrast.json):638 amostras de texto,mínimo≈4,63:1,não auditoria integral de acessibilidade. [Ensaio LAN](evidencias/supervisor-compacto-live-state.json),[preservação](evidencias/supervisor-compacto-preservation.txt).

Comandos: build com `node-do-runtime node_modules/vite/bin/vite.js build --outDir /tmp/orquestra-alerta-compacto/dist`;regressão `CHOKIDAR_USEPOLLING=true ORQUESTRA_TEST_DIST=/tmp/orquestra-alerta-compacto/dist node-do-runtime --test --test-concurrency=4 --test-reporter=tap tests/*.test.mjs`,com ORQUESTRA_*_EVIDENCE em diretórios temporários próprios. Python existente com `-B` nos dois tests/importacao-*.test.py e dois scripts/import_orquestra.py/import_feira_estendida.py --check. Sem instalação. Homologação visual do usuário continua pendente;nenhum commit,push,merge ou deploy.


## Registro local autorizado — 19/10/2026

Após solicitação explícita do usuário,registro do trabalho existente na branch `feature/modo-feira`,base240253d,com a mensagem `feat: implementa modo feira sincronizado e supervisor C9.2`. Inclui C9/C9.1/C9.2,Supervisor,apresentação já implementada,testes,planilha estendida original do escopo,documentação e evidências. Revisados inventário,diff e sinais de segredos;credenciais efêmeras fora do Git. Testes/build/importadores aprovados no marco imediatamente anterior,sem nova alteração funcional nesta etapa. Commit local não autoriza merge/push/deploy nem presume homologação visual. O SHA do próprio registro é obtido por `git log -1 --format=%H`,evitando referência circular no conteúdo do commit.


## Histórico como apoio ao diagnóstico — 19/10/2026

Escopo autorizado pelo usuário: simplificar alertas Laranja/Vermelho com uma ação ou insight e aproveitar fechamentos históricos para evidenciar uma possível solução;estender o mesmo apoio aos cartões do Modo Feira. Implementado localmente na feature/modo-feira,base53c6554,sem novo commit/push/deploy. Não inclui QRCode ou alteração da autenticação.

### Modelo e limites

`src/feira/historyAdvice.js` é uma consulta CALC retrospectiva sobre HIST_60_DIAS existente,sem alterar BASE,dataset,snapshots,motor ou prioridade. Usa somente registros Concluídos,com ID diferente do atual/sem duplicação,criação e Saída válidas,Saída>=criação e Saída<=referência do snapshot. Não consulta snapshots futuros. Saída é critério de elegibilidade do registro concluído,não data inferida do campo textual Fechamento. A referência global da base histórica é posterior ao cenário Feira:trata-se de uma análise retrospectiva filtrada pelas datas registradas,não de prova de disponibilidade da informação em tempo real naquele dia.

Correspondência exata (texto com trim) de Problema,Componente Principal e Tipo de Unidade. Prioriza os compatíveis do mesmo Cliente/Unidade;se inexistentes,usa equipamentos semelhantes e declara esse escopo. **Os identificadores de unidade da Feira não coincidem com os do histórico atual**;as evidências reais são de equipamentos semelhantes,nunca apresentadas como recorrência comprovada do equipamento atual. Sem agrupamento por palavras vagas,causalidade ou pareamento inventado.

N=concluídos compatíveis antes do corte;conhecidos=Fechamento preenchido;nulos=N−conhecidos;n=ocorrências da solução selecionada. Uma hipótese só aparece se o mesmo texto de Fechamento tem ao menos2 registros e lidera sem empate. É uma regra conservadora de apresentação,sem alterar criticidade/política operacional. Caso único,empate,campos de correspondência ausentes ou falta de solução mantêm uma ação operacional fundamentada. Nulos permanecem no denominador. Contagem histórica não é probabilidade de sucesso. Solução textual é citada literalmente,como hipótese para validar no diagnóstico.

Exemplo real emT03:CH-20260908-018/Cabine desnivelada→14 de14 casos compatíveis anteriores em equipamentos semelhantes:“Sensor ajustado/substituído”. CH-20260908-013/Movimento irregular→11 de11:“Parâmetros do inversor corrigidos”. Não são valores criados para o layout. Origem/IDs/datas/fechamentos podem ser consultados no detalhe.

### Experiência

Supervisor:aviso mantém ID/problema/urgência curta,possível solução histórica ou uma ação,Ver detalhes/Fechar. Laranja mostra prazo somente se comprovável;Vermelho por SLA mostra percentual excedido;passageiro preso destaca atendimento prioritário e ação imediata,com histórico apenas no detalhe. Retirados percentuais secundários e “impedimento não identificado” do primeiro aviso para reduzir ruído. Não se prometem resgate,despacho,peças ou técnico disponível.

Novo `HistoryEvidence.jsx` é compartilhado pelos detalhes do Supervisor e Feira:resumo,limite de inferência e seção recolhida com população/nulos/período/corte/critério,casos e fonte/hash. Modo Feira reutiliza a mesma hipótese nos cartões “Alertas e apoio à decisão”;emergências mantêm a ação prioritária. Não altera a navegação da tabela ou cria outro fluxo de comandos.

Fluxo original preservado:ACK antes do aviso,pausa global,Ver detalhes→completo→retorno ao resumo com mesmo lock,Fechar mantém pausa. Tema automático390×844/768×1024,mesmo motorSSE/POST/T00–T11.

### Homologação e evidências

Capturas reais:[Laranja](evidencias/supervisor-historico-alerta-laranja-light-390x844.png),[Vermelho por SLA](evidencias/supervisor-historico-alerta-vermelho-light-390x844.png),[emergência](evidencias/supervisor-historico-impacto-light.png),[Dark](evidencias/supervisor-historico-alerta-laranja-dark-390x844.png),[notebook](evidencias/supervisor-historico-notebook-historico.png),[fundamentação](evidencias/supervisor-historico-historico-fundamentacao.png). Prefixo supervisor-historico inclui cinco passos do fluxo e tablet.32 testes específicos aprovados=8 novos de histórico+15Supervisor+9temas,sem dupla contagem no total final. Primeiro ensaio ajustou asserção para texto convertido em maiúsculas pelo CSS;nenhuma regra de produto alterada por esse ajuste.

Instância5192 preservada:PID202318,sessãob9b0f9c4. Tentativa de atualização sem reinício foi conferida por HTTP:servidor conserva index em memória na inicialização,portanto não entregou a nova UI. Índice anterior restaurado com backup;assets antigos preservados. Evidência da tentativa mantida e marcada como não ativada. Nenhum serviço anterior reiniciado nem sessão/cookie invalidado.

**Homologação atual:5194**,PID261174,sessão2b5fa4f8,build `/tmp/orquestra-historico/dist`. Supervisor:http://192.168.0.3:5194/OrquestraNEXT/?modo=supervisor-feira;notebook:http://192.168.0.3:5194/OrquestraNEXT/?modo=feira. Novo pareamento em perfil anônimo/separado para não substituir cookies de outras portas. Códigos efêmeros em arquivo privado indicado por `/tmp/orquestra-historico/service.json`,não registrados em docs/logs/URLs. Ensaios/capturas usam fotografias reais com serviço de teste e tempo controlado;ensaio real da nova instância registrado nos resultados finais. Homologação física do usuário pendente. Expiração de30min para novos pareamentos e QRCode ainda não alterados nesta entrega.


### Resultado final da revisão histórica

**472 testes distintos aprovados nesta execução:455 Node/browser+17 Python (9+8),zero falhas/skip/cancelamentos.**8 novos testes de histórico cobrem N/nulos,imutabilidade,futuros/ativos/datas/duplicações/ID próprio,mesmo equipamento vs semelhantes,compatibilidade,caso único/empates/sem fechamento,referência inválida e12 estados reais.32 casos específicos também repetidos,sem dupla contagem. [Regressão](evidencias/supervisor-historico-regression.tap),[foco](evidencias/supervisor-historico-focused-final.tap),[build](evidencias/supervisor-historico-build.txt),[check original](evidencias/supervisor-historico-import-original.txt),[check estendido](evidencias/supervisor-historico-import-extended.txt). Build e dois --check aprovados;aviso de bundle>500kB mantido.100 ciclos UI,20 sincronizados,T00–T11,reconexão,pausa/ACK/retorno,tablet,legado/dez cenas preservados. [Contraste](evidencias/supervisor-historico-contrast.json):656 amostras de texto,mínimo≈4.63:1,não auditoria integral.

Serviço5194 confirmado porHTTP200 e entry asset idêntico ao build validado. Dois clientes reais na LAN avançaramT00→T03/10:15,27registros/9alertas;resumo com hipótese,completo com evidência,retorno e fechamento mantiveram pausa. Um open-detail/um close-detail,locks0,zero errosJS. [Estado](evidencias/supervisor-historico-live-state.json),[artefato servido](evidencias/supervisor-historico-served-build.json). Deixado T03pausado1×;homologação física do usuário pendente. Instâncias anteriores preservadas.

[Preservação](evidencias/supervisor-historico-preservation.txt):124 arquivos versionados de originais/dados/importadores/serviço/snapshots idênticos ao HEAD53c6554. Modificados7 arquivos de fonte (2 novos),3 testes (1 novo),4 documentos existentes e novas evidências. Sem alteração de datasets/arquitetura de sincronização/criticidade/EXT/relógio. Staging vazio;sem novo commit,push,merge ou deploy.

Reprodução: `node-do-runtime node_modules/vite/bin/vite.js build --outDir /tmp/orquestra-historico/dist`; `CHOKIDAR_USEPOLLING=true ORQUESTRA_TEST_DIST=/tmp/orquestra-historico/dist node-do-runtime --test --test-concurrency=4 --test-reporter=tap tests/*.test.mjs`,com ORQUESTRA_*_EVIDENCE em diretórios próprios. Python existente com -B nos dois tests/importacao-*.test.py e scripts/import_orquestra.py/import_feira_estendida.py --check. Sem dependências novas.


Registro local autorizado pelo usuário para a revisão histórica: `feat: adiciona apoio historico aos alertas da feira`,base53c6554. Inclui implementação,testes,documentação e evidências existentes;sem push/merge/deploy. Última validação:472 testes aprovados,build/dois --check,sem alteração funcional posterior. Pendência confirmada:aba Chamados mantém ficha direta;resumo acessível pela aba Alertas. Uniformização da entrada e QRCode/acesso contínuo não implementados neste registro. SHA do próprio commit consultável com `git log -1 --format=%H`.
