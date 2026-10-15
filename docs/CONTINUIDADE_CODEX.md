# Estado atual — C4 — 15/10/2026

Esta atualização prevalece sobre os estados históricos da passagem C3 abaixo.

- C3 homologada expressamente pelo usuário nesta sessão. Commit local autorizado e executado após revisão de 30 arquivos, staging/check, 139 testes e build: `ef53ecf497a0968480880fddd496faa677da50aa`, `feat: implementa visao geral executiva C3`. Sem push/deploy.
- Branch `feature/next-evolucao`; HEAD ef53ecf. C4 autorizada e implementada localmente, sem commit, aguardando homologação. Não iniciar próxima página.
- C4: `/OrquestraNEXT/?modo=plataforma#/contratos-margem`, carteira/detalhe operacional e econômico; quatro cards, quatro fontes financeiras EXT, tabela com busca/ordem/página, seis gráficos, identificação/técnica/equipamentos/chamados/insights. Cinco páginas funcionais, sete destinos pendentes.
- 164 testes distintos aprovados (155 Node/browser +9 Python), build/importação --check aprovados. Após ajuste visual/contextual, os 25 C4 passaram novamente no build final. [Relatório e evidências](produto/entrega-c4-contratos.md).
- Custo/SLA/pressão reutilizam C3/C1/C2. Recorrência aprovada >0 / todos os chamados do recorte; N positivo/total, cobertura válida explícita; sem qualquer valor válido, indisponível. Sem soma como eventos. Pressão binária: algum Alto, sem novas faixas/pesos.
- ConsultationProvider mantém também ordem/página/tamanho da carteira em memória. Filtros/busca permanecem compartilhados; limpar/logout reseta a carteira. Detalhe local à página, fecha ao navegar.
- Supervisor/dez cenas/fixtures/tempos/dados/dependências preservados; apresentação original continua padrão. Mesmo SHA256 da planilha. Não instalar pacotes nem fazer commit C4/push/deploy sem autorização.
- Próxima sugestão: Custos / TCO, exclusivamente depois de homologação C4 e autorização de escopo. Fontes financeiras reais permanecem EXT.

## Passagem anterior preservada como registro histórico (C3)

# ORQUESTRA — Continuidade para uma nova sessão do Codex

Atualizado em 15/10/2026, America/Sao_Paulo. Documento de passagem; não autoriza nova funcionalidade, commit ou publicação. Deve permitir continuidade sem acesso à conversa anterior.

## 1. Onde estamos e o que fazer primeiro

**C3 — Visão Geral Executiva implementada, 139 testes aprovados, aguardando homologação final do usuário.** Não iniciar a próxima página antes dessa homologação e de autorização de escopo.

Raiz efetiva:
`/home/p2dutra/Documents/ChatGPT/Projeto_Challenge_OTIS/OrquestraNEXT`

A pasta efetiva contém underscores. Um contexto antigo aponta para “Projeto Challenge OTIS” com espaços: não usar esse caminho como raiz presumida. Validar cwd antes de qualquer comando. Todos os caminhos relativos deste documento partem da raiz efetiva, exceto links Markdown, relativos a docs/.

Ordem de retomada:
1. Ler AGENTS.md aplicáveis, se existirem, da hierarquia da pasta e dos diretórios envolvidos.
2. Ler este documento e [Product Backlog](produto/backlog.md), incluindo os registros incrementais no final.
3. Ler [relatório C3](produto/entrega-c3-performance.md) e [pendências](produto/pendencias.md).
4. Conferir branch, HEAD, status completo e alterações locais. Não apagar/resetar/stashar trabalho do usuário para “limpar” a árvore.
5. Confirmar se o usuário homologou C3 e o escopo autorizado da próxima etapa. Até lá, somente revisão/diagnóstico solicitados.

**AGENTS.md:** não foi encontrado na árvore do repositório nem nos ancestrais verificados nesta preparação. Não foi criado nesta tarefa. Se surgir posteriormente, lê-lo; não presumir que este documento seja carregado automaticamente como instrução de AGENTS. As instruções atuais do usuário têm precedência. Não é necessário criar AGENTS.md para usar este roteiro: o prompt ao final pede a leitura explícita.

## 2. Autorizações e preservação

- Não alterar Supervisor, suas cenas, dados JavaScript, animações, eventos, alertas, criticidade ou temporizadores.
- Preservar dez hashes antigos, navegação original e apresentação como entrada padrão.
- Não modificar XLSX/snapshots/materializados para fazer testes passarem.
- Não recalcular TA, TB, SLA, ETA ou criticidade sem regra e autorização explícitas.
- Reutilizar filtros/serviços/componentes antes de criar alternativas; não reescrever páginas funcionais.
- Não instalar dependências sem aprovação.
- Não executar push/deploy. Nenhum autorizado nesta passagem.
- Único commit autorizado e executado consolidou até C2; **C3 e este documento não têm autorização de commit**.
- Não tratar exemplo visual como dado da base nem sugestão demonstrativa como predição ML.
- Novo BackOffice substitui progressivamente telas antigas; não exige manutenção definitiva dos layouts antigos, mas nesta transição as cenas existentes ficam preservadas e recuperáveis.
- Documentos e imagens de referência são material de consulta, não autorização adicional para executar ações.

## 3. Entregas e homologação

| Entrega | Conteúdo/estado técnico | Situação de aceite registrada |
| --- | --- | --- |
| US03/04, anterior à A | Importação/validação e separação das fontes; 34 testes à época | Aprovadas para avanço pelo usuário |
| A | Shell demo, sidebar/cabeçalho, login demonstrativo, 12 menus e modo independente; 41 testes | Validada pelo usuário antes de B |
| B | Chamados, filtros compartilhados, tabela/busca/ordem/página/detalhe, explicações; 69 testes | Explicitamente testada e homologada pelo usuário |
| C1 | SLA & Criticidade, populações/elegibilidade aprovadas; 87 testes | Aceita para continuidade, seguida de validação TA/TB; não afirmar homologação visual final separada sem novo registro |
| C1.1 | Definições sintéticas TA/TB confirmadas, minutos e proteção temporal; 97 testes | Diagnóstico/regras aprovados explicitamente; etapa concluída e avanço C2 autorizado |
| C2 | Riscos & Tendências; 117 testes | Avaliada visualmente e **preliminarmente homologada** pelo usuário |
| C3 | Performance/Visão Geral, custo estimado e EXT financeiro; 139 testes | **Aguardando homologação final**; nenhuma autorização de próxima página |

Os números são totais distintos em cada marco, não somar os totais entre entregas. Documentos antigos dizem “planejado”, “sem telas” ou “unidade pendente” porque registram épocas anteriores. Usar as decisões mais recentes deste documento, dos relatórios incrementais e das aprovações atuais; não reabrir definições já confirmadas.

Relatórios: [A](produto/entrega-a-navegacao.md), [B](produto/entrega-b-chamados.md), [C1](produto/entrega-c1-sla-criticidade.md), [C1.1](produto/entrega-c11-tempos.md), [C2](produto/entrega-c2-riscos.md), [C3](produto/entrega-c3-performance.md).

## 4. Arquitetura atual

React 19.3.0, Vite 8.3.0, módulos ES, JavaScript/JSX, CSS Modules. Dependências/configuração originais preservadas; gh-pages disponível para publicação, mas não executar deploy. Base Vite/GitHub Pages: /OrquestraNEXT.

Fluxo:
- src/main.jsx monta App.
- src/App.jsx escolhe por query modo=plataforma. Sem essa query, monta SceneController. Plataforma carregada lazy/Suspense; nunca montar dois controladores de hash/teclado simultaneamente.
- Legado: SceneController + scenes.config.js + scenes/sceneIndex.js descobrem/carregam src/views/**/index.jsx. Remontagem da posição reinicia cenas.
- Plataforma: src/platform/BackofficePlatform.jsx contém login demo, shell e seleção de página por hash. navigation.js concentra 12 menus e título executivo.
- ConsultationProvider em filters/ConsultationContext.jsx mantém reducer/seleção em memória acima das páginas. Trocar página preserva filtros/busca/ordem; refresh restaura padrão. Logout reseta consulta. Acesso demo usa sessionStorage, não autenticação corporativa.
- src/platform/services/chamados.js contém filtro/seletores, busca, ordem, paginação, resumo e explicações básicas.
- sla.js: médias, aderência/faixas e agrupamentos.
- riscos.js: análise de criticidade/pressão/recorrência, série diária e sugestões demonstrativas.
- performance.js: composição executiva, custo estimado, contratos e metadados EXT.
- temporalDefinitions.js: definições sintéticas TA/TB.
- temporal.js: classificação de marcos e projeção segura de snapshots; não motor Feira.
- src/data/orquestra fornece dados imutáveis e consultas; componentes não leem XLSX.
- Componentes compartilhados: ConsultationUI (FilterBar/Chips/Search/Kpi/Info/Dialog/Pagination/Badges/EmptyState), DataTable, RecordExplorer, ChamadoDetail; ExecutiveChart/ExternalMetric acrescentados na C3.
- Estilos novos isolados em src/platform; CSS/Supervisor legados não foram refatorados.

[Arquitetura legada](tecnica/arquitetura-atual.md), [proposta e evolução](tecnica/arquitetura-proposta.md), [integração Supervisor](tecnica/pontos-integracao-supervisor.md). Conferir código para estado atual: os documentos arquiteturais iniciais são anteriores às entregas funcionais.

## 5. Três experiências: não confundir

| Experiência | Disponível hoje / requisito futuro |
| --- | --- |
| Plataforma | Implementada: navegação livre, histórico, filtros e quatro páginas. /OrquestraNEXT/?modo=plataforma#/visao-geral |
| Apresentação | Apresentação original controlada pelo apresentador disponível em /OrquestraNEXT/#/1 até #/10. Novo Modo Apresentação do BackOffice, com seleção explícita de fonte/estado estável, ainda não implementado como modo próprio |
| Feira | Futuro: demonstrar evolução operacional dos dados, não somente autoplay de telas. Deve ter relógio determinístico, pausa/retoma/reinício; motor/velocidade/loop/transições ainda dependem de aprovação |

O Supervisor possui roteiro/timers próprios e dados independentes. Não insinuar sincronização dos seus chamados/filtros com HIST_60_DIAS. Ponte contextual de ida/volta (US19) não está implementada; link “Apresentação original” não equivale a essa ponte. [Contrato dos modos](produto/modos.md).

## 6. Páginas e menus

Menu inicial Visão Geral; H1 Performance Operacional & Financeira. URLs abaixo exigem ?modo=plataforma.

| Menu/hash | Estado |
| --- | --- |
| /visao-geral | Funcional C3, homologação final pendente |
| /contratos-margem | Placeholder |
| /custos-tco | Placeholder |
| /riscos-tendencias | Funcional C2, homologação preliminar |
| /chamados | Funcional B, homologada |
| /sla-criticidade | Funcional C1/C1.1 |
| /tecnicos | Placeholder |
| /equipamentos | Placeholder |
| /pecas | Placeholder |
| /padroes-insights | Placeholder |
| /contratos-backoffice | Placeholder |
| /integracoes | Placeholder |

Login /login é demonstrativo, sem senha/SSO real; entrada encaminha para Visão Geral. Placeholders não exibem métricas inventadas. Não implementar cadastro/CRUD por existir menu Contratos — BackOffice.

## 7. Fontes e contrato de dados

Original: datasets/ORQUESTRA_MVP_Base_60_Dias_Filtros_FINAL.xlsx.
SHA256: 1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe.

| Fonte | Registros | Finalidade |
| --- | ---: | --- |
| HIST_60_DIAS | 736, 46 campos, IDs únicos | Todas as quatro páginas do novo BackOffice |
| T0_Abertura | 10 | Estado em 08/09/2026 08h |
| T1_Acompanhamento | 16 | Estado em 08/09/2026 08h30 |
| T2_Desfecho | 24 | Estado em 08/09/2026 09h30 |
| Fixtures JavaScript legadas | Independentes | Apresentação original/Supervisor; preservar |

Não concatenar fontes, somar snapshots entre si ou substituir fixtures antigas por XLSX. Mesmo ID entre snapshots representa versões, não duplicidade do histórico.

Importador scripts/import_orquestra.py, usando openpyxl preexistente: valida quatro abas, 46 nomes/ordem/tipos, IDs/contagens/referências/enums; normaliza texto NFC/trim, preserva nulos/números e datas locais ISO -03:00. Não contém o gerador da massa, não recalcula regras. --check não grava. JSONs gerados locais em src/data/orquestra/generated, metadata + records; incluem origem/hash/aba/momento/contagens. Não editar JSON à mão.

API em src/data/orquestra/index.js: getDataset, query, getById, countBy, distribution, describeField. Sem fetch/CDN/API externa; Vite empacota para uso offline após carregamento. Não há service worker nem primeiro acesso offline garantido.

Histórico: 08/08/2026 a 06/10/2026 inclusive; referência fixa 06/10/2026 22h America/Sao_Paulo. Helpers limitados a 2026/-03:00 neste demonstrador; não usar como biblioteca universal de fusos. [Camada](dados/camada-dados.md), [dicionário completo](dados/dicionario.md), [fontes](dados/fontes.md).

## 8. Regras consolidadas

### Filtros e consulta
- Campos: Criado em (período), Criticidade_ORQUESTRA, Status, Cliente, Área, Tipo de Unidade, Categoria do Chamado, Recorrencia_30d.
- AND entre campos, OR entre valores do mesmo campo. Recorrência materializada agrupada 0, 1–2, >=3.
- Hoje/7/15/30/60 dias civis inclusivos, ancorados na referência simulada, nunca no relógio do computador.
- Hoje=06/10 (14 registros); 7 dias=30/09–06/10 (93); 15=22/09–06/10 (202); 30=07/09–06/10 (395); 60=08/08–06/10 (736).
- Busca ignora caixa/acentos; palavras combinadas por AND. Chips removíveis, limpar, vazio. Limpar retorna a 60 dias, sem restrições, criação descendente e primeira página.
- Cards/gráficos/tabelas partem da mesma população antes da paginação; elegibilidade específica explicitada. Ordenação antes da página, ID para desempate; tamanhos 10/25/50.
- Detalhe/navegação preservam contexto. Filtros não persistem após refresh. Futuros filtros preparados não equivalem a UI implementada.

### TA/TB — somente massa sintética
Responsável pela geração confirmou via usuário:
- TA = chegada ao edifício menos abertura, em minutos.
- TB = encerramento técnico simulado menos chegada, em minutos.
- Saída = encerramento técnico mais permanência adicional: histórico 3–10 min, snapshots 5 min.
- Horário de encerramento técnico **não persistido**. Não criar um timestamp como evento originalmente registrado.
- Rótulos: TA — Tempo até a chegada (min); TB — Tempo de resolução simulado (min).
- Confirmado numericamente: TA 728/728 históricos, 2/2 T0, 9/9 T1, 20/20 T2. Diferenças chegada→saída menos TB respeitam os acréscimos confirmados.
- Médias usam materializados finitos não negativos, N independente, zero informado válido; nulos excluídos, sem convertê-los em zero. Sem elegíveis, não calculável.
- Não são definições oficiais OTIS. No Supervisor as mesmas siglas possuem usos distintos; não uniformizá-lo nesta fase.

### SLA
- SLA_min/Percentual_SLA/ETA_min preservados. Percentual_SLA é fração: 1=100%, UI multiplica por 100.
- Aderência aprovada para demonstração: apenas Concluído, SLA_min finito >0, Percentual_SLA finito >=0. Cumpre <=1. Numerador/elegíveis ×100. Sem elegíveis, —.
- Faixas contínuas: [0;0,5], ]0,5;0,8], ]0,8;1], >1. Independentes de cor.
- Consumo médio = média simples dos consumos válidos em todos os status; não consumo agregado contratual.
- SLA restante, pausas, metas e contrato oficial continuam pendentes. Nenhuma fórmula inferida.
- ETA é chegada do técnico, não logística de peças; depois da chegada/conclusão não se apresenta previsão futura; zero fornecido é identificado como base.
- RESUMO_60_DIAS tem aderência que coincide com 677/736, enquanto regra aprovada entre concluídos usa 665/724. Não “corrigir” C1/C3 para coincidir com população diferente.

### Criticidade, recorrência e pressão
- Usar cores fornecidas Verde/Amarelo/Laranja/Vermelho, sem recalcular por percentual de SLA.
- Laranja é janela de intervenção; apoio em todas as cores, inclusive Vermelho. Não assumir sequência obrigatória Verde→...→Vermelho.
- Histórico inclui concluídos. Ativo prioritário = não Concluído e Laranja/Vermelho, na referência; não tempo real.
- Recorrência elevada = Unidade distinta entre registros com Recorrencia_30d >=3. Não somar recorrências como chamados.
- Contratos sob pressão = Contrato distinto nos registros com Impacto_Contrato Alto. Não margem negativa.
- Motivos compostos agrupados pelo texto completo. Associação/recorrência não comprova causa. Insight fornecido é sintético, não ML validado.

### Custos, contratos e gráficos C3
- Soma Custo_Estimado_R$ finito não negativo, cobertura N válido/total; sem válidos, indisponível. Não arredondar origem, somente apresentação.
- Contratos com chamados no período não são necessariamente ativos/vigentes.
- Selecionar contratos com algum Alto; ordenar N Alto desc, ID asc; top 5/lista completa.
- Na tabela: total/custo/SLA/Vermelhos usam todos os chamados filtrados do contrato; N Alto e seus motivos usam apenas Alto. Drill-down coerente com cada coluna.
- Série diária por criação, não competência financeira nem resolução no dia. Custo sem informado e SLA sem elegíveis: lacuna; criticidade sem chamados: zero. Não tirar média dos percentuais diários para aderência geral.
- Não afirmar desvio de meta ou variação comparativa sem meta/base aprovada.

### BASE/CALC/EXT
BASE: campos materializados com proveniência.
CALC: agregações explícitas, fórmula, população/elegíveis, período, unidade, nulos, fonte/hash e suporte.
EXT: fonte externa indisponível, selo textual, integração pendente/não conectada; sem número, zero ou comparação inventados.
Receita, margem, TCO contábil, estoque/logística/skills/disponibilidade real não são sustentados pela massa. C3 mostra Receita/Margem/TCO contábil como EXT. DEMO não substitui BASE/CALC/EXT. Toda instância de indicador tem explicação acessível por botão, não somente hover.

## 9. Consistência temporal para futura Feira

temporal.js oferece eventAt e projectSnapshot, já testados:
- Snapshot só disponível se clock >= referência própria; não antecipar qualquer status/TA/TB.
- Marco <= referência do snapshot pode ser mostrado registrado; nulo é ausente; posterior é futuro, oculto na projeção.
- Avançar clock não confirma evento futuro de fonte congelada; exigir nova evidência/estado.
- Fonte imutável e encerramento técnico não reconstruído.
- Saída futura não invalida conclusão técnica informada: são marcos distintos.

Casos originais preservados: T1 CH-20260908-006 saída 08:34/ref 08:30; T2 CH-20260908-017 saída 09:35/ref 09:30. Projeção oculta essas saídas como eventos realizados. Isso é infraestrutura/contrato, **não implementação do modo Feira**. Política de completude/merge/loop/velocidade/retorno Supervisor ainda precisa de aprovação.

## 10. Preservação das dez cenas

| Hash | Cena |
| --- | --- |
| #/1 | backoffice-1-principal |
| #/2 | backoffice-2-chamados |
| #/3 | supervisor-cena-1-tela |
| #/4 | supervisor-cena-2-normal-para-media |
| #/5 | supervisor-cena-2-media-sobe |
| #/6 | supervisor-cena-3-media-para-alta |
| #/7 | supervisor-cena-4-aviso-alta |
| #/8 | supervisor-cena-5-demanda-critica |
| #/9 | supervisor-cena-6-demanda-critica-sobe |
| #/10 | supervisor-cena-7-aviso-estourado |

Sem ?modo=plataforma. Atalhos setas/Espaço/PageUp/PageDown/Home/End/H, hash/refresh, remontagem, listeners/timers e FLIP devem ser preservados. Smart Fit muda Normal→Média→Alta; hospital já crítico por contexto humano, não por SLA. Nome da cena “aviso-estourado” não autoriza acrescentar SLA a demanda que não o possui.

Há colisões auxiliares de nomes no sceneIndex que não foram refatoradas; não tocar índice global sem análise. Detalhe do Supervisor não pausa roteiro; fechar modal não necessariamente zera badge: comportamento legado registrado, não correção autorizada. [Matriz e tempos](preservacao/matriz-cenas.md), [regressão](preservacao/estrategia-regressao.md).

## 11. Product Backlog — estado real

Há 19 histórias (US01–18 originais +US19); US18-A/B são partes da US18.

| US | Estado/pendência |
| --- | --- |
| 01 | Proteção local implementada/testada; referência Git até C2 recuperável. Obrigação contínua; não auditoria visual completa |
| 02 | Dez entradas preservadas/validadas; ambiguidade de nomes auxiliares documentada, sem refatoração |
| 03 | Concluída tecnicamente/aprovada: histórico rastreável |
| 04 | Concluída para separação/consulta; projeção temporal preparada; motor Feira pendente |
| 05 | Implementada nos indicadores atuais; transversal, não concluída para páginas futuras |
| 06 | Parcial: demo/login/entrada independente; modos próprios Apresentação/Feira pendentes |
| 07 | Parcial: shell +12 destinos, quatro páginas funcionais; oito faltantes |
| 08 | Implementada/aprovada em Chamados e reutilizada nas demais: filtros cumulativos |
| 09 | Implementada/homologada: consulta/detalhe de chamados |
| 10 | Parcial: Visão Geral C3 aguarda homologação; Padrões & Insights pendente |
| 11 | Implementada tecnicamente em SLA/Riscos, conforme decisões sintéticas; C2 homologação preliminar, contrato real/recálculos não implementados |
| 12 | Técnicos/Equipamentos pendentes |
| 13 | Infraestrutura custo/EXT disponível; páginas financeiras/contratos ainda pendentes |
| 14 | Feira pendente; contratos e testes preparatórios não equivalem a modo implementado |
| 15 | Validação parcial notebook/móvel/teclado; segue transversal; não auditoria completa |
| 16 | Build/testes/referência local realizados; publicação não executada/certificada |
| 17 | Exportação pendente |
| 18 | Placeholders Peças/Integrações; páginas EXT específicas e integrações reais pendentes |
| 19 | Ponte contextual Supervisor/retorno pendente |

Consulte [backlog](produto/backlog.md) para prioridade/dependências/aceites e atualize-o após cada entrega. Não marcar história inteira concluída por uma subentrega ou apenas existência de documento.

## 12. Testes, compilação e validação

Última execução da C3: **139 testes distintos aprovados =130 Node/browser +9 Python**, incluindo os 117 anteriores e22 novos. Build aprovado. Nesta tarefa de passagem não se reexecutou a suíte: resultados conferidos nas evidências existentes; nenhuma alteração funcional foi feita.

Na raiz:
```sh
git status --short --untracked-files=all
git branch --show-current
git log -1 --oneline
npm run build -- --outDir /tmp/orquestra-c3/dist
ORQUESTRA_TEST_DIST=/tmp/orquestra-c3/dist ORQUESTRA_TEST_EVIDENCE=/tmp/orquestra-c3/legacy-evidence ORQUESTRA_SHELL_EVIDENCE=/tmp/orquestra-c3/shell-evidence node --test tests/*.test.mjs
/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -B tests/importacao-dados.test.py
/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -B scripts/import_orquestra.py --check
git diff --check
sha256sum datasets/ORQUESTRA_MVP_Base_60_Dias_Filtros_FINAL.xlsx
```

Aguardar sucesso de cada etapa; não tratar execução do último comando como prova de sucesso de todos. --check não grava. Não rodar conversão normal para “atualizar” dados sem necessidade/autorização.

Desenvolvimento local, se necessário e autorizado:
```sh
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```
Verificar primeiro se servidor existente ocupa porta; não encerrá-lo/reutilizar outro silenciosamente. URL local não comprova qual versão está publicada. Não executar npm run deploy (tem predeploy/build e gh-pages).

Ferramentas: node:test nativo, Playwright e Chrome preexistentes, nenhum pacote instalado nas entregas. Runtime conhecido:
- Node/pacotes: /home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/
- Playwright via ORQUESTRA_PLAYWRIGHT (padrão node/node_modules/playwright desse runtime).
- Chrome via ORQUESTRA_CHROME (padrão /usr/bin/google-chrome).
- Python acima tem openpyxl; Python do sistema pode não ter.
- Portas previews por suíte: legado 5187, shell 5189, B5191, C1 5193, C2 5195, C3 5197; offline-layer tem artefato próprio. Não rodar duas instâncias da mesma suíte simultaneamente.

Os testes iniciam/encerram seus previews. Evidências temporárias de navegador podem reutilizar caminhos das entregas antigas; preservar capturas/logs já copiados em docs/produto/evidencias. /tmp não é backup permanente. Se o novo ambiente não contiver runtime/browser, localizar ferramentas disponíveis e pedir autorização antes de instalar.

Evidências permanentes na árvore local: [C3:130 Node/browser](produto/evidencias/entrega-c3-regression.txt), [9 Python](produto/evidencias/entrega-c3-import.txt), [build](produto/evidencias/entrega-c3-build.txt), [22 novos após revisão visual](produto/evidencias/entrega-c3-tests.txt), capturas no [relatório](produto/entrega-c3-performance.md). Ainda não commitadas.

Verificado 1366×768 (seis cards essenciais acima da dobra), móvel390×844, sem overflow do documento; tabelas têm rolagem interna. Regressão cobre dez cenas, timers/alertas/FLIP/teclado, não certificação visual/cross-browser integral.

## 13. Git: referência e inventário completo da passagem

Branch: feature/next-evolucao.
Último commit: 03d8cedb20cc0754cbe07c01c08e0e62c688a428.
Mensagem: feat: consolida novo BackOffice até C2 e testes de regressão.
Contém 116 arquivos das entregas até C2; 117 testes e build aprovados antes do commit. **Nenhum push ou deploy foi feito.**
Referência anterior:43dd0283728d8c78ae9017ae5acae8a1cf3101d5 (dataset/referências e apresentação antiga).

**C3 não está no commit.** Este documento também ficará não versionado. Não iniciar nova sessão num checkout limpo desse SHA esperando encontrar a C3: usar esta mesma pasta com alterações locais, ou cópia integral controlada. Commit adicional exige nova autorização. Não resetar, limpar untracked ou arquivar a pasta sem preservar esse trabalho.

Status capturado antes da criação deste documento; M=modificado, ??=não versionado:
```text
M docs/README.md
 M docs/dados/dicionario.md
 M docs/preservacao/recuperacao.md
 M docs/produto/backlog.md
 M docs/produto/cobertura-telas.md
 M docs/produto/explicabilidade-ext.md
 M src/platform/BackofficePlatform.jsx
 M src/platform/navigation.js
 M tests/README.md
 M tests/platform-shell.test.mjs
?? docs/produto/entrega-c3-performance.md
?? docs/produto/evidencias/c3-reference-build.txt
?? docs/produto/evidencias/c3-reference-import.txt
?? docs/produto/evidencias/c3-reference-tests.txt
?? docs/produto/evidencias/entrega-c3-build.txt
?? docs/produto/evidencias/entrega-c3-import.txt
?? docs/produto/evidencias/entrega-c3-performance-analises.png
?? docs/produto/evidencias/entrega-c3-performance-desktop.png
?? docs/produto/evidencias/entrega-c3-performance-mobile.png
?? docs/produto/evidencias/entrega-c3-regression.txt
?? docs/produto/evidencias/entrega-c3-tests.txt
?? src/platform/components/ExecutiveChart.jsx
?? src/platform/components/ExternalMetric.jsx
?? src/platform/components/ExternalMetric.module.css
?? src/platform/pages/PerformancePage.jsx
?? src/platform/pages/PerformancePage.module.css
?? src/platform/services/performance.js
?? tests/performance-browser.test.mjs
?? tests/performance-service.test.mjs
?? docs/CONTINUIDADE_CODEX.md
```

A última linha registra a criação nesta tarefa. Nenhum outro arquivo foi alterado nesta passagem. Nada staged. Comparar novamente antes de mexer: estado pode mudar após este registro. [Procedimento de recuperação](preservacao/recuperacao.md); preferir checkout isolado, não reset destrutivo. Não inferir SHA do GitHub Pages a partir do HEAD local.

## 14. Limitações e decisões ainda abertas

- C3 aguardando homologação final; C2 homologação preliminar.
- Definições oficiais OTIS de TA/TB/SLA/pausas/metas e SLA restante não confirmadas; a definição sintética não as substitui.
- Fórmulas geradoras de recorrência e criticidade não fornecidas; preservar classificações.
- Receita/margem/TCO completo/estoque/skills/geolocalização/disponibilidade reais são fontes externas.
- Todos os 12 contratos têm algum evento Alto nos 60 dias: proxy não discrimina saúde financeira.
- Histórico de 60 dias não sustenta seis meses, extrapolação, ML ou causalidade.
- Snapshots separados, detalhes de merge/completude/loop/velocidade Feira pendentes; duas saídas futuras preservadas.
- Filtros em memória, sem persistência no refresh; demo sem autenticação real.
- Offline apenas após carregamento, sem service worker.
- Aviso de bundle opt-in da plataforma >500kB (~1.208 kB minificado/100,5kB gzip na C3). Não silenciar aviso sem avaliar; eventual particionamento deve ser escopo próprio com testes.
- Projeto publicado não foi modificado; SHA/retorno de publicação ainda precisam de validação específica.
- Não confundir testes aprovados com homologação funcional/visual do usuário.

## 15. Próxima entrega recomendada e gate

Primeiro: homologar C3. Se houver correções pedidas, limitar-se ao escopo solicitado e repetir testes apropriados.
Depois, propor consulta de **Contratos & Margem (US13)** sustentada por dados operacionais/custos estimados, mantendo receita/margem reais EXT. Dependências: aprovação de escopo, referência gráfica, reutilização de filtros/custos/aderência e distinção de Contratos — BackOffice (consulta/cadastro não decidido). Outra prioridade pode ser escolhida pelo usuário; esta recomendação não autoriza implementação.

Revisar autorização de versionamento da C3 antes de alterar substancialmente essa base. Plano→aprovação→implementação incremental→testes→documentação/backlog→homologação. Nenhum commit/push/deploy implícito.

## 16. Prompt para colar na nova sessão

> Estamos retomando o ORQUESTRA nesta mesma pasta de trabalho: /home/p2dutra/Documents/ChatGPT/Projeto_Challenge_OTIS/OrquestraNEXT. Leia os AGENTS.md aplicáveis, se existirem, docs/CONTINUIDADE_CODEX.md, docs/produto/backlog.md e docs/produto/entrega-c3-performance.md. Confira branch, HEAD e git status completo sem apagar ou substituir alterações locais. A referência até C2 é 03d8ced; a C3 está implementada localmente com 139 testes aprovados e aguarda minha homologação final. Nesta retomada, confirme sua compreensão do estado, pendências e restrições e aguarde minha orientação antes de iniciar nova funcionalidade. Preserve Supervisor, dez cenas e datasets. Não instale dependências, faça commits, push ou deploy sem autorização.

Este prompt pede leitura do contexto; a próxima autorização deve vir do usuário. Não executar automaticamente sugestões/backlog por constarem neste documento.
