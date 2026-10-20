# Modos de acesso e experiências

| Experiência | Comportamento | Fonte |
| --- | --- | --- |
| Plataforma | Navegação livre no novo BackOffice, filtros, indicadores e detalhes | HIST_60_DIAS normalizado e referência explícita |
| Apresentação | Apresentador conduz novo BackOffice; nenhum avanço temporal automático inesperado | Histórico ou snapshot escolhido explicitamente; estado estável |
| Feira | Dados operacionais evoluem automaticamente, não só páginas | Série estendida T00–T11 aprovada na C9.2; originais preservados |

## Entrada padrão atual — implementação local autorizada em 19/10/2026

**A nova apresentação é a entrada padrão pretendida. A apresentação antiga continua preservada e acessível pelo modo legado.** Implementado localmente; homologação, versionamento e publicação são estados distintos. Nenhum deploy desta alteração foi realizado. As seções históricas abaixo registram contratos das entregas anteriores, sem restabelecer o legado como entrada padrão.

| URL sob /OrquestraNEXT/ | Experiência e contrato |
| --- | --- |
| Raiz, sem modo | Nova apresentação manual, Visão Geral inicial, HIST_60_DIAS homologado, sem login ou API local obrigatória |
| ?modo=apresentacao | Mesma apresentação; hashes nomeados permitem deep link e refresh |
| ?modo=plataforma | BackOffice livre; acesso demo/sessionStorage e12 destinos preservados, incluindo páginas pendentes identificadas |
| ?modo=feira | Serviço presente/configuração de sessão: conectado autoritativo. Site estático: standalone existente, com aviso permanente de independência/ausência de sincronização. Nenhum novo motor ou fallback silencioso |
| ?modo=supervisor-feira | Interface sincronizada existente; serviço indisponível exige orientação/reconexão, sem relógio operacional local ou integração fictícia |
| ?modo=legado#/1 até #/10 | Dez cenas originais, teclado/timers/animações/controlador e fixtures preservados |
| Modo inválido, vazio explícito ou duplicado | Tela Modo não reconhecido com escolha explícita; nunca abre legado silenciosamente |

### Roteiro manual

1. Visão Geral.
2. Riscos & Tendências.
3. SLA & Criticidade.
4. Chamados.
5. Contratos & Margem.
6. Custos / TCO.
7. Equipamentos.
8. Técnicos.
9. Peças e Componentes.

Somente páginas existentes implementadas entram no roteiro/menu da apresentação. Não há décima página fictícia. Supervisor permanece experiência operacional separada, descrita no seletor de modos: o site estático não sincroniza um celular; operação conjunta depende do serviço autoritativo no notebook e pareamento. Nenhuma nova ponte/autoridade foi criada nesta entrega. US19 continua pendente.

Controles Voltar/Avançar/Início, indicador da etapa e propósito; navegação exclusivamente manual. Sem atalhos globais herdados de cenas, relógio ou avanço inesperado. Menus e links internos das nove páginas continuam disponíveis; filtros, indicadores, explicabilidade, aprofundamentos e paginação usam os serviços/provedor atuais. Hashes nomeados identificam a tela; refresh repõe os filtros padrão existentes. Hash desconhecido/numericamente antigo ou página fora do roteiro recebe indicação segura e retorno explícito à Visão Geral, sem montar SceneController.

O seletor de modos explica fontes/limitações e navega por URL explícita. Troca entre modos carrega experiência independente; não transfere ocorrências/filtros ao legado ou ao Supervisor. Navegação dentro da apresentação mantém ConsultationProvider e seu contexto. A apresentação não grava sessão demo para autenticar Plataforma; o acesso direto manual é público com dados sintéticos, não autenticação corporativa.

[Arquitetura/roteamento](../tecnica/arquitetura-atual.md#roteamento-atual--nova-apresentação-padrão-19102026), [resultado e evidências](entrega-apresentacao-padrao.md).

## Estado e filtros

AND entre campos, OR em multisseleção, conjunto único antes de paginação; cards/gráficos/listas conciliados. Chips, limpar, vazio e contexto preservado. Histórico usa período/fuso/faixas aprovados até C8; referências temporais próprias da Feira dependem do contrato C9 abaixo. Modo manual não executa chegadas JavaScript do BackOffice antigo. Troca de fonte reinicia ou compatibiliza filtros com aviso e política aprovada, sem misturar populações.

## Feira

Pausa, retomada e reinício são requisitos confirmados. Um relógio controla todos os derivados; pause congela dados/indicadores, não apenas animação. T0/T1/T2 são estados conhecidos separados. Não inventar atualização contínua de SLA, eventos intermediários, critérios de desaparecimento ou classificações. Velocidade, loop e snapshots completos foram aprovados na C9, conforme contrato abaixo. Mudança de tela não muda o tempo. Dados futuros não aparecem antes da etapa correspondente.

## Supervisor e legado

O novo Modo Apresentação não se confunde com a apresentação antiga por cenas. A experiência Supervisor mantém timers próprios sem alteração: sua abertura explícita deve informar essa diferença. UI nova não deve sugerir que as mesmas ocorrências ou filtros foram sincronizados.

Na ida ao Supervisor, pausar Feira e preservar contexto; no retorno, restaurar sem avançar ou retomar silenciosamente. URLs atuais aprovadas em19/10: legado explícito ?modo=legado conserva hashes numéricos; apresentação nova usa hashes nomeados. A ponte contextual US19 continua independente desta escolha de modo. Não montar dois controladores de teclado/hash ao mesmo tempo.

Fluxo e arquitetura detalhados: [arquitetura proposta](../tecnica/arquitetura-proposta.md).

## Visibilidade temporal — contrato C1.1

Na futura demonstração, cada snapshot é um estado conhecido no seu próprio Momento_Dataset. Só liberar snapshot quando relógio simulado >= referência da fonte. Nunca antecipar status, TA/TB, motivos ou resultados de snapshot posterior. projectSnapshot retorna indisponível/sem registros antes da referência; não busca nem combina fontes.

Para um snapshot liberado, marcos explícitos até sua referência (limite inclusivo) podem ser mostrados como registrados. Marco nulo = ausente; marco posterior = futuro, com valor oculto na projeção, nunca evento realizado. O clock avançar não confirma evento que era futuro no estado congelado; exigir novo estado/evidência. Saída futura não invalida conclusão técnica já informada no snapshot: são conceitos distintos; não reconstruir seu horário.

Serviço de leitura em src/platform/services/temporal.js, integrado ao tratamento de marcos no detalhe histórico. Nenhum modo automático ou motor Feira foi implementado na entrega C1.1; C9 utiliza a projeção abaixo sem interpolação. Futuro consumidor temporal deve usar esta projeção; testes cobrem as duas saídas posteriores e os limites. [Entrega C1.1](entrega-c11-tempos.md).

## C9 — planejamento técnico do Modo Feira — 15/10/2026

Contrato C9/US14 aprovado e implementado localmente sob autorização explícita de 15/10/2026, com os ajustes abaixo. Sequência e gates ficam no plano incremental, tarefas no backlog e resultados no relatório C9. Commit, push, merge e deploy não autorizados. A autorização posterior substituiu a hipótese de iniciar parado: entrada e reinício agora executam automaticamente.

### Estado Git e isolamento

Inspeção do planejamento inicial: branch atual **feature/modo-feira já existente**, HEAD `240253d357560c5674e99bfccd7816632b388f29`, igual a feature/next-evolucao e ao SHA remoto desta última, confirmado por ls-remote. Árvore limpa antes das edições documentais; nada staged/não rastreado. Reflog registra checkout de next-evolucao para modo-feira anterior a este planejamento. Nenhuma criação/troca de branch realizada nesta etapa. A branch Feira não aparece no remoto e não tem upstream configurado. main remota a350cd0; gh-pages remota 547db4d. C8 funcional 8134059, seguido somente pelo commit documental 240253d.

Divergência com o pedido: a branch já foi criada fora desta execução. **Reutilização da branch existente explicitamente autorizada pelo usuário**, sem apagá-la/recriá-la. Base recomendada 240253d, que contém C8 homologada e seu registro de publicação; confirmar igualdade/ancestralidade novamente na Fase A. Se surgirem commits ou alterações inesperados, informar antes de continuar. Se não existisse, a futura criação partiria explicitamente do SHA aprovado de next-evolucao, após aprovação, nunca da main.

As edições anteriores de planejamento foram preservadas na branch atual. Implementação C9 também fica local; não exigir limpeza via descarte/stash/reset. main permanece original, next-evolucao integração/C8, modo-feira desenvolvimento exclusivo C9. Integração depende de homologação e autorização específica; nenhum merge, push ou Pages automático. Rollback operacional do futuro modo será sair dele/abrir a apresentação preservada, não reescrever Git.

### Evidência dos snapshots e política de substituição proposta

Leitura direta dos JSONs gerados, sem alteração de dados ou execução de testes. Todos têm 46 campos e IDs únicos por fonte. Referências em 08/09/2026, America/Sao_Paulo:

| Estado | Referência | Registros | Não concluídos | Concluídos | Verde / Amarelo / Laranja / Vermelho (todos) |
| --- | --- | --- | --- | --- | --- |
| T0_Abertura | 08:00 | 10 | 10 | 0 | 3 / 7 / 0 / 0 |
| T1_Acompanhamento | 08:30 | 16 | 14 | 2 | 3 / 12 / 0 / 1 |
| T2_Desfecho | 09:30 | 24 | 12 | 12 | 7 / 9 / 3 / 5 |

T0 IDs 001–010; T1 mantém os dez e adiciona 011–016; T2 mantém os dezesseis e adiciona 017–024 (prefixo CH-20260908-). Sem remoções, duplicidades internas ou mudança de Unidade, Cliente, Contrato, Criado em e Problema para IDs compartilhados. Nas transições há 9/13 mudanças de status e 2/8 de criticidade, respectivamente. Os novos chamados foram criados entre 08:03–08:27 e 08:32–09:15, mas só passam a ser conhecidos quando a fonte seguinte é liberada.

**Conclusão limitada:** estados cumulativos completos da operação simulada, confirmados pelo usuário, com versões completas dos registros presentes; não são apenas deltas. Os IDs não provam completude da operação real nem contrato universal de extração. Contrato aprovado: substituição integral da fonte selecionada em T0/T1/T2; comparação por ID serve somente a destaques CALC, sem concatenação/upsert. Se uma fonte futura omitir ID, não inferir encerramento ou exclusão: indicar ausência da fonte. Histórico 736 e fixtures Supervisor nunca entram nessa população.

Casos obrigatórios: Saída de CH-20260908-006 às 08:34 é futura em T1 08:30; Saída de CH-20260908-017 às 09:35 é futura em T2 09:30. projectSnapshot/eventAt já ocultam esses valores. T2 não confirma a saída de 017 em nenhum instante adicional do loop. Status Concluído e TB fornecidos não devem ser apagados por essa saída futura; encerramento técnico e saída são marcos diferentes, sem reconstruir horário de encerramento.

### Fluxo, relógio e controles propostos

Máquina de estados pura e determinística: executando(T0) → executando(T1) → executando(T2) → intervalo de reinício(T2) → executando(T0). Entrada inicia automaticamente. Pausado guarda fase, tempo de exposição restante e motivos. Erro impede avanço; nunca pula silenciosamente fonte inválida. Reiniciar volta **T0 executando**, elimina seleção/destaques/pausas de análise e mantém velocidade; se a aba estiver oculta, preserva o bloqueio de visibilidade. O loop automático também volta T0 executando.

Política aprovada: **relógio operacional discreto** 08:00 / 08:30 / 09:30, fixo durante cada exposição. Contagem regressiva visual mede tempo de exposição, não é horário de ocorrência. Assim não se promete SLA ao vivo nem se interpola status. 45 s por estado + 10 s de intervalo após T2 = 145 s/ciclo em normal. Aceleração 2× reduz tempos de exposição pela metade (inclusive intervalo); durações centralizadas em constantes do motor; configuração por UI de durações não faz parte deste corte. Durações iguais representam saltos operacionais diferentes (30 e 60 minutos), explicitados na UI. Velocidade muda preservando progresso fracionário e sem reiniciar fase. Valores aprovados na autorização de implementação C9.

Um scheduler por instância, com prazo relativo a relógio monotônico injetável (performance.now), sem Date.now para domínio. Reducer recebe ações/tempo decorrido; seletores derivam tudo do mesmo estado. Pausa captura tempo restante; retomar usa novo prazo com esse restante. Cleanup cancela timeout/listeners ao pausar, desmontar ou reiniciar; token de geração invalida callback antigo. StrictMode mount/cleanup/mount não duplica avanço. Nenhum timer por chamado/card. Aba oculta ou janela sem foco pausa automaticamente; retorno visível não compensa tempo em segundo plano nem retoma sozinho. Vários motivos de pausa coexistem; fechar um detalhe não remove pausa manual ou de visibilidade.

Abrir detalhe, explicação, interação com gráfico/tabela/filtro ou navegação interna pausa **antes** de mudar a seleção. Conteúdo permanece estável, inclusive na fronteira de transição. Fechar detalhe mantém pausa, botão Retomar explícito; bloquear retomada enquanto diálogo aberto. Navegação dentro de Feira mantém contexto pausado; sair desmonta e cancela efeitos. Reentrada/refresh inicia T0 executando, sem persistir relógio em localStorage ou compartilhar estado entre abas. Link externo ao BackOffice/apresentação abre experiência independente; não implementar a ponte contextual US19 nem sincronizar fontes/filtros do Supervisor nesta C9. Entrada autônoma demo implementada, sem exigir a sessão de login do BackOffice; indicar simulação permanentemente.

### Arquitetura e reutilização

Entrada proposta `/OrquestraNEXT/?modo=feira`, sem rota nova no servidor. App seleciona exatamente um modo, com import lazy de Feira, preservando plataforma e SceneController padrão. Hash interno Feira opcional para lista/detalhe; preferir detalhe local no primeiro corte, sem controlador concorrente. Query desconhecida mantém comportamento legado atual.

Camadas propostas: dados imutáveis → projectSnapshot → seletores Feira sobre o snapshot liberado → estado/controlador temporal → painel/detalhes. Referência da projeção é a metadata da fonte, não o relógio civil do notebook. Fonte anterior e atual são comparadas por ID após ambas estarem liberadas; T0 não expõe descrições/deltas de T1/T2. Chave de destaque inclui ciclo/transição/ID; render/retomada não gera eventos duplicados. Reinício apaga delta de T2, sem comunicar melhora ou remoção de 14 ocorrências como fato operacional. Deltas são “observado entre referências”, sem atribuir hora exata à mudança de status/cor.

Reutilizar getDataset, countBy, instant/formatLocal, projectSnapshot/eventAt e TEMPORAL_DEFINITIONS; preservar TA/TB/SLA/ETA e criticidade materializados. Serviços históricos chamados/sla/riscos/performance e ConsultationProvider têm fonte/período fixos HIST: **não reutilizar seus seletores históricos para calcular Feira**, nem trocar defaults globais. Só extrair helper puro se houver necessidade comprovada, com regressão do consumidor atual.

UI: reaproveitar CriticalityBadge, StatusBadge, Dialog, KpiCard/IndicatorInfo (definições com fonte/referência/população Feira completas), GroupChart e estilos. DataTable tem caption fixo “histórico filtrado”: propor prop opcional caption com default atual. ChamadoDetail fixa HISTORY/SOURCE, logo não pode ser usado diretamente; criar detalhe Feira projetado compondo Dialog/badges/definições compartilhados, sem copiar a tela histórica inteira. Não alterar ConsultationProvider nem usar opções históricas de FilterBar/FilterChips. Qualquer filtro local deverá obter opções do snapshot corrente e pausar durante análise.

Estrutura adotada (arquivos efetivos e evidências no relatório C9):

| Arquivo | Responsabilidade |
| --- | --- |
| src/App.jsx | Seleção isolada lazy modo=feira; fallback/limite de erro do novo modo |
| src/feira/FeiraApp.jsx e FeiraApp.module.css | Painel e composição responsiva |
| src/feira/temporalState.js | Configuração, reducer puro, transições e invariantes |
| src/feira/useFeiraClock.js | Um scheduler e limpeza de efeitos/visibilidade |
| src/feira/selectors.js | Validação mínima de fonte, projeção, contagens, deltas, alertas e metadados |
| src/feira/FeiraApp.jsx (controles integrados) e FeiraDetail.jsx | Controles e detalhe seguro do snapshot; sem componente extra desnecessário |
| src/feira/FeiraErrorBoundary.jsx | Falha de import/render, orientação e retorno à apresentação |
| src/platform/components/DataTable.jsx | Somente caption opcional, se reutilizado |
| tests/feira-temporal.test.mjs | Estado puro, fontes, projeção e seletores no mesmo arquivo |
| tests/feira-browser.test.mjs, feira-endurance.mjs e platform-dev.test.mjs | UI/rotas/ESM e ciclos reais, preservando casos existentes |
| docs/produto/modos.md, plano-incremental.md, backlog.md e docs/CONTINUIDADE_CODEX.md | Contrato, fases, tarefas e estado |

Sem mudanças previstas em package/lock/Vite/datasets/generated/Supervisor/cenas/fixtures. Dependências atuais são suficientes. A proteção de import lazy depende de boundary já montado; erro de sintaxe no módulo de entrada pode impedir qualquer React de renderizar e exige validação ESM real, não promessa de recuperação absoluta.

### Painel e inteligência explicável

1366×768 prioritário: cabeçalho “Modo Feira — Simulação”, momento/hora da fonte e execução/pausa; cards total/ativos/concluídos/atenção; distribuição por cor com população explícita; tabela paginada de ativos e área de mudanças/insights; acesso aos concluídos. Controles iniciar/pausar/retomar/reiniciar/velocidade visíveis por teclado. Animações breves só de transição, sem piscar, respeitando prefers-reduced-motion, foco estável e aria-live moderado; cor sempre acompanhada por texto.

Atenção operacional proposta = não Concluído e Laranja/Vermelho; contagem CALC com predicado explícito, sem gerar cores. T2: ativos por cor 2 Verde/6 Amarelo/2 Laranja/2 Vermelho; os demais Laranja/Vermelho pertencem a concluídos. Não mostrar estes últimos como atendimento ainda crítico: separar aprendizado histórico da intervenção ativa. T1 CH-005 Amarelo→Vermelho prova que Laranja não é passagem obrigatória; não fabricar episódio Laranja em T1.

Alertas unem Status, Criticidade_ORQUESTRA e Motivo_Criticidade/Insight_ORQUESTRA do estado liberado. Laranja: destacar necessidade de intervenção; Vermelho: apoio à priorização da condição crítica, sem afirmar mitigação executada, despacho, causa ou recomendação oficial OTIS. Não criar score/limiar arbitrário, ranking de trabalhador, ETA futuro ou causalidade. Concluídos trazem resultado informado e comparação observada, sem concluir que a cor representa risco atual. SLA exibido como Percentual_SLA materializado na referência, com cobertura/N; não contador crescente ou SLA restante. Novas ocorrências, mudanças e conclusões recebem ID, fonte e referência; insights BASE separados das sínteses CALC. Nulo = não informado/não disponível, nunca zero por conveniência.

### Segurança, testes propostos e critérios de aceite

Fontes locais empacotadas, sem fetch externo ou service worker novo. Após carga dos chunks necessários e fontes, Feira deve continuar sem rede; **primeiro acesso/refresh offline não é garantido** em Pages sem cache instalado. Se requisito for abrir do zero sem internet, aprovar distribuição local do build como contingência, sem alterar a configuração pública. Falha de carregamento mostra erro legível, tenta novamente por ação explícita e oferece apresentação; falha de dados é distinta de coleção vazia. Sem recarga automática em loop. Pré-checagem de bancada deve carregar o modo e testar desconexão antes do evento.

| Grupo | Casos obrigatórios e evidência esperada |
| --- | --- |
| Entrada e fontes | modo=feira isolado, direto/refresh sob base, T0 executando automaticamente; IDs únicos, 10/16/24, subconjuntos/identidade, status/cores acima, snapshot inválido/vazio/nulos e sem mistura HIST/fixtures |
| Transições | T0→T1→T2, deltas por ID (6/8 novos; 9/13 status; 2/8 cores), explicação de alertas; nenhum dado posterior, saída futura oculta inclusive detalhe/insight; referências inclusivas |
| Controle | clock fake: antes/no limite, pausa residual, retoma, ações repetidas, reinício, velocidade/progresso, duração no ciclo seguinte, intervalo e loop; sem duplicar callback/evento |
| Interação e cleanup | detalhe/explicação/filtros pausam antes da leitura, fechar não retoma, motivos acumulados, aba oculta/desfoco, navegação/unmount/StrictMode, callback obsoleto e retorno/refresh em T0 |
| Interface | 1366×768 sem overflow horizontal, controles legíveis, tabela/paginação/detalhe utilizáveis, teclado/foco, movimento reduzido, ativos versus concluídos e justificativas acessíveis |
| Rede e falhas | rede cortada depois de carregar fontes/chunks, falha de lazy import/render e fonte ausente, retry explícito, retorno legado; distinguir primeiro acesso offline |
| Preservação | suíte existente de 292 como marco mínimo, mais casos C9; BackOffice 9 páginas e filtros, default e dez hashes/Supervisor/timers; nenhuma diferença nos arquivos protegidos/dados/planilha |
| Entrega | build/base/assets/rotas em preview, native ESM do servidor efetivo (incluindo C9) sem pageerror/HTTP falho; importer --check; antes de qualquer Pages, nova autorização e validação do destino |

Fase D proposta: 30 ciclos normais (~72min30) e 100 acelerados (~120min50), incluindo pausas, detalhes e visibilidade; instrumentar número de timers/avanços/listeners e estabilidade de memória após coleta, sem exigir heap monotonicamente constante. Testes fake-clock cobrem milhares de ciclos sem custo real. Na estabilização C9: testes com 1000 ciclos puros, 100 ciclos de UI com clock controlado e ensaio real normal/acelerado; resultados e duração efetiva no relatório. A hipótese de ensaio longo 30/100 reais não foi executada e não deve ser confundida com os ciclos fake-clock. Gatilho do Vite antigo segue indeterminado: verificar processo/porta e resposta dos módulos, não inventar export nem limpar cache indiscriminadamente. Build aprovado não substitui teste do servidor servido nem do site após eventual publicação.

Aceite C9 exige: determinismo e reconciliação dos snapshots; quatro cores preservadas; nenhuma antecipação ou cálculo arbitrário; controles/pausas/loop corretos; alertas rastreáveis; leitura estável com interação; cleanup demonstrado; dados e 292 casos anteriores preservados; build/ESM/Pages base aprovados; ensaio contínuo e homologação visual do usuário. Nenhum teste por si autoriza integração ou publicação.

### Complexidade e sequência de referência

Complexidade **média-alta**, concentrada em contrato temporal/visibilidade e testes de efeitos. Estimativa inicial 5–8 dias de trabalho técnico, sem compromisso de calendário, mais homologação: contrato/base 0,5–1; motor 1–2; painel 1,5–2; testes/regressão/ensaio/documentação 2–3. Ajustar após decisões; não estimar quantidade final de testes antes de implementá-los.

A → confirmar/reutilizar branch e base; B → seletores/projeção/reducer, depois scheduler com testes puros; C → painel/controles/detalhe e fallback; D → testes UI/ESM/regressão/ensaio, build/importador e revisão de preservação; E → homologação e correções. Entregar blocos verificáveis, sem antecipar outras páginas ou US19. Plano incremental detalha os gates.

Decisões aprovadas na autorização posterior: reutilização da branch 240253d, snapshots completos por substituição, relógio discreto, 45/45/45/10 s e 1×/2×, modo independente e interação pausada. Ajuste expresso: **início automático e reinício em T0 executando**, em vez de pronto/Iniciar. Sem commit/push/merge/deploy. Homologação visual C9 ainda necessária; evidências, limitações e próxima ação no relatório e continuidade.


## C9.1 — sincronização local implementada; homologação física pendente

Requisito obrigatório para homologação da experiência completa: notebook hospeda autoridade única e mobile recebe o mesmo estado por LAN. Diagnóstico/arquitetura/protocolo/segurança/alternativas no [contrato técnico central](../tecnica/pontos-integracao-supervisor.md#c91--planejamento-da-sincronização-notebook--supervisor-feira). C9.1 implementada com 360 testes, build/importador e ensaio real; C9/322 anteriores preservados. [Resultado e roteiro físico](entrega-c91-sincronizacao.md).

Implementado conforme autorização: serviço Node com build compilado e SSE+POST same-origin; motor atual reutilizado no servidor, sem relógio operacional concorrente nos clientes. Detalhe mobile pausa globalmente (A), retomada só pelo controlador notebook. Pausa em background preservada por comandos/lease, não por novo motor no navegador. Boot de serviço em nova sessão T0 pausada, diferente do autostart standalone; ajuste expressamente aprovado. A foi aprovada; B/C permanecem alternativas não implementadas. Sessão do serviço inicia T0 pausada; controles ADMIN exclusivos e mobile leitor com pedidos de detalhe. Teste físico/WAN desligada e homologação ainda pendentes.

Esta solicitação C9.1 não é o antigo subincremento C9.1 motor. Supervisor Feira é interface nova isolada; legado/dez cenas/fixtures preservados. US19 ponte ao legado permanece pendente; nenhum anúncio de sincronização real antes dos testes/homologação conjuntos.

## C9.2 — sequência estendida vigente

15/10/2026. Adaptação e integração autorizadas. O uso normal standalone/conectado passa a T00–T11, extraído de FEIRA_ROTEIRO/ESTENDIDA/EVENTOS/REGRAS, sem alterar as fontes históricas. 12 fotografias completas de 27 s e espera final de 12 s:336 s em 1×/168 s em 2×; horários discretos 08h–17h. A configuração original de três estados permanece coberta por regressão explícita. Substituição integral, nunca concatenação/interpolação.

Mesmo DTO/sessão/revisão nas interfaces conectadas, único motor no notebook. Nova sessão T00 pausado, iniciar/retomar/reiniciar/velocidade exclusivos do notebook; standalone autostart preservado. Mobile abre detalhe após ACK de pausa global; fechar não retoma. Distribuição de criticidade considera ativos, concluídos conservam somente a cor histórica. FEIRA_EVENTOS audita os destaques por ID; momento de observação não inventa horário de transição. Regras sintéticas FEIRA_REGRAS não alteram as regras da Plataforma.

[Relatório e homologação C9.2](entrega-c92-feira-estendida.md). Implementação local não equivale a homologação física, versionamento ou publicação; todos pendentes no escopo desta entrega. Sem commit/merge/push/deploy.

### Identificação da Feira independente e conectada

O modo independente exibe aviso permanente de relógio local e ausência de sincronização com celular. Para operação conjunta, notebook e celular usam o mesmo IP/porta do serviço, não os endereços dev5173/5175. O conectado identifica origem, sessão, revisão, snapshot e reprodução; aguardando Iniciar/pausa global não é avanço operacional. [Diagnóstico C9.2](entrega-c92-feira-estendida.md#diagnóstico-da-divergência-na-homologação-física--15102026). Mistura inicial de fontes e pareamento do notebook como leitor foram confirmados. Notebook leitor oferece troca autenticada para operador; só ADMIN assume/inicia. Usuário confirmou mesmo estado/sessão/revisão e depois controles/avanço conjunto; serviço posteriormente lido emT01. Homologação física do ciclo completo permanece pendente.

### Interface mobile do Supervisor Feira — 19/10/2026

A adaptação visual usa marca/cabeçalho navy, cards com faixas de cor e navegação Chamados/Alertas/Mais inspirados na apresentação. Os componentes novos são isolados: nenhuma fixture/temporizador ou prioridade do tutorial é fonte operacional. Alertas são consulta voluntária de Laranja/Vermelho ativos; detalhe depende de ACK de pausa global, fechar não retoma. Fontes de sistema para operação LAN sem recursos externos obrigatórios. [Contrato de interface e matriz](../tecnica/pontos-integracao-supervisor.md#supervisor-feira--adaptação-visual-autorizada-19102026); homologação ainda pendente no relatório C9.2. Protocolo, 12 snapshots e fronteiras dos demais modos preservados.
