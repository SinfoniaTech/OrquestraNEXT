# ORQUESTRA — Continuidade consolidada até C6

Atualizado em 15/10/2026, America/Sao_Paulo, no encerramento da sessão. Este é o retrato atual; relatórios incrementais registram o estado de cada época e podem conter gates já superados. Não confundir implementação, testes, homologação e versionamento.

## 1. Estado atual e primeira ação na nova sessão

**C6 — Equipamentos implementada, 225 testes distintos aprovados, aguardando homologação visual final do usuário. C6 não possui commit próprio.** Sete páginas funcionais e cinco destinos ainda pendentes. Próxima prioridade planejada: Modo Feira com evolução automática de dados operacionais; não implementado e não autorizado para início por este documento.

Raiz efetiva:
`/home/p2dutra/Documents/ChatGPT/Projeto_Challenge_OTIS/OrquestraNEXT`

Usar esta mesma pasta, com suas alterações locais. O diretório pai tem outro contexto Git; não confundir seu main sem commits com o repositório efetivo. Não presumir a pasta antiga “Projeto Challenge OTIS” com espaços. Confirmar cwd antes dos comandos.

Retomada:
1. Ler AGENTS.md aplicáveis se existirem (nenhum encontrado na árvore/ancestrais verificados nesta sessão; não foi criado).
2. Ler este documento, [backlog atual com as 19 histórias](produto/backlog.md), [plano incremental](produto/plano-incremental.md) e [relatório C6](produto/entrega-c6-equipamentos.md).
3. Conferir branch, HEAD, status completo e alterações locais, sem apagar, substituir, resetar ou stashar trabalho para “limpar” a árvore.
4. Confirmar a compreensão do estado e aguardar orientação. Homologação visual C6 e autorização do próximo escopo precisam vir do usuário.
5. Antes de eventual desenvolvimento da Feira, ler [modos](produto/modos.md), [pendências](produto/pendencias.md), [C1.1 temporal](produto/entrega-c11-tempos.md) e o serviço temporal atual. Não reabrir regras já confirmadas nem inferir políticas ainda abertas.

Neste encerramento foram autorizadas somente continuidade/backlog/documentação. Não modificar código funcional, Supervisor, dados ou dependências; não implementar Feira; não criar commits, push ou deploy. Autorizações anteriores de implementação e commits já foram consumidas pelas entregas correspondentes; não são autorização permanente.

## 2. Entregas: implementação, aceite e Git

Totais abaixo são marcos cumulativos distintos; não somar as linhas.

| Entrega | Implementação / total de testes no marco | Aceite registrado | Versionamento atual |
| --- | --- | --- | --- |
| Dados US03/04, antes da A | Importação/validação, histórico e snapshots separados; 34 | Aprovadas pelo usuário para avanço | Consolidadas em 03d8ced |
| A | Shell, login demo, sidebar/header, 12 menus, entrada independente; 41 | Validada antes da B | 03d8ced |
| B | Chamados, filtros cumulativos, busca/ordem/página/detalhe; 69 | Explicitamente testada e homologada | 03d8ced |
| C1 | SLA & Criticidade, populações/elegibilidade aprovadas; 87 | Aceita para continuidade e seguida da validação TA/TB; não há registro separado de homologação visual final | 03d8ced |
| C1.1 | TA/TB sintéticos em minutos e proteção temporal; 97 | Diagnóstico/regras aprovados; concluída e avanço C2 autorizado | 03d8ced |
| C2 | Riscos & Tendências; 117 | Avaliada visualmente e preliminarmente homologada | 03d8ced |
| C3 | Visão Geral Executiva/Performance, custos e EXT financeiro; 139 | Expressamente homologada antes da C4 | ef53ecf |
| C4 | Contratos & Margem, carteira/detalhe e análises; 164 | Avaliada e aprovada para continuidade antes da C5; não transformar isso em homologação visual final separada | ebd0db9 |
| C5 | Custos / TCO, grupos, pares temporais e aprofundamento; 194 | Avaliada e aprovada para continuidade antes da C6 | 485e6b4 |
| C6 | Equipamentos, tipos, histórico, recorrência, desempenho e insights; 225 | Aguardando homologação visual final | Alterações locais, sem commit próprio |

Referências locais:
- `03d8cedb20cc0754cbe07c01c08e0e62c688a428` — `feat: consolida novo BackOffice até C2 e testes de regressão` (116 arquivos, 117 testes/build antes do commit).
- `ef53ecf497a0968480880fddd496faa677da50aa` — `feat: implementa visao geral executiva C3` (30 arquivos, 139 testes/build antes do commit).
- `ebd0db93a06ec78f11c7dfbe55298a6c043b17a4` — `feat: implementa contratos e margem C4` (30 arquivos, 164 testes/build antes do commit).
- **HEAD `485e6b49f6b0f1342a69e0a126adcecbab9d06f6`** — `feat: implementa analise de custos C5` (30 arquivos, 194 testes/build antes do commit).
- Referência anterior `43dd0283728d8c78ae9017ae5acae8a1cf3101d5`: dataset/referências e apresentação antiga.

Nenhum push/deploy foi executado nestas entregas. HEAD local não comprova qual SHA/artefato está no GitHub Pages.

Relatórios com arquivos, critérios, imagens e logs: [A](produto/entrega-a-navegacao.md), [B](produto/entrega-b-chamados.md), [C1](produto/entrega-c1-sla-criticidade.md), [C1.1](produto/entrega-c11-tempos.md), [C2](produto/entrega-c2-riscos.md), [C3](produto/entrega-c3-performance.md), [C4](produto/entrega-c4-contratos.md), [C5](produto/entrega-c5-custos.md), [C6](produto/entrega-c6-equipamentos.md).

## 3. Arquitetura atual e reuso

React 19.3.0, Vite 8.3.0, ES Modules, JavaScript/JSX, CSS Modules. Base Vite/GitHub Pages `/OrquestraNEXT`. Dependências originais preservadas; nenhuma instalada nas entregas. gh-pages existe, mas deploy não está autorizado.

Fluxo de entrada:
- `src/main.jsx` monta `src/App.jsx`.
- Sem `?modo=plataforma`, App monta `src/components/SceneController.jsx`: apresentação original continua padrão.
- Com a query, plataforma lazy/Suspense; `src/platform/BackofficePlatform.jsx` monta login demo/shell/página por hash. Não montar simultaneamente dois controladores de hash/teclado.
- `src/scenes.config.js` e `src/scenes/sceneIndex.js` resolvem dez entradas legadas de `src/views/**/index.jsx`; remontagem reinicia a cena.
- `src/platform/navigation.js` concentra os 12 menus; Visão Geral é o destino inicial do login e seu H1 é Performance Operacional & Financeira.
- `src/platform/filters/ConsultationContext.jsx` mantém reducer/seleção em memória acima das páginas. Acesso demo usa sessionStorage, sem senha/SSO/autenticação corporativa.
- Filtros/busca/ordem de registros atravessam páginas. C4/C5/C6 têm estados de apresentação da carteira (ordem/página/tamanho; C5 também tipo contratos/chamados). Mudanças de consulta voltam à primeira página; limpar/logout reseta carteiras. Refresh restaura padrões. Detalhes/tipo selecionado são locais à página e fecham ao navegar.

Serviços em `src/platform/services/`:

| Arquivo | Responsabilidade |
| --- | --- |
| chamados.js | Fonte histórica, períodos, seletores/filtros/busca, ordenação/paginação e explicações básicas |
| sla.js | average/adherence/groupRecords, faixas de consumo, médias e metadados |
| riscos.js | Criticidade/pressão/recorrência, distintos, dailyEvolution e sugestões demonstrativas |
| performance.js | estimatedCost, composição executiva e metadados EXT |
| contratos.js | contractMetrics/Analysis/Page, recurrenceRatio, carteira; valueFor opcional reutiliza ordenação/paginação da C6 sem alterar comportamento C4/C5 |
| custos.js | Grupos/carteira/chamados de custo, média/recorrentes, pares custo×TA/TB e populações SLA; compõe regras anteriores |
| equipamentos.js | Unidades/tipos, histórico cronológico, máximo/último valor, métricas e metadados |
| temporalDefinitions.js | Definições aprovadas de TA/TB sintéticos |
| temporal.js | eventAt/projectSnapshot: projeção de leitura segura; não motor Feira |

Dados imutáveis via `src/data/orquestra/index.js`; componentes não leem XLSX. Reutilizar antes de criar alternativas:
- ConsultationUI: FilterBar/FilterChips/MultiSelect/SearchInput/KpiCard/IndicatorInfo/Dialog/Pagination/StatusBadge/CriticalityBadge/EmptyState.
- DataTable e RecordExplorer: tabelas/listas de suporte e detalhe mantendo contexto.
- ChamadoDetail: contexto/operação/tempos/inteligência, campos BASE e proteção temporal.
- ExecutiveChart: séries diárias, lacunas e suporte; GroupChart: barras de agrupamento com texto/ação acessível; ExternalMetric: fonte indisponível sem número inventado.
- Estilos novos isolados em `src/platform`; CSS/Supervisor legado não refatorado.

[Arquitetura inicial](tecnica/arquitetura-atual.md), [evolução proposta](tecnica/arquitetura-proposta.md), [fronteiras Supervisor](tecnica/pontos-integracao-supervisor.md). Esses documentos iniciais antecedem as páginas funcionais; conferir código e relatórios mais recentes.

## 4. Rotas e funcionalidades disponíveis

Prefixo da plataforma: `/OrquestraNEXT/?modo=plataforma#`. Login `/login` é demo; após entrada vai a `/visao-geral`.

| Menu/hash | Estado e escopo |
| --- | --- |
| /visao-geral | C3 funcional e homologada: seis cards, contratos em destaque/lista completa, custo/SLA/cores diários, EXT e observações |
| /contratos-margem | C4 funcional, aprovada para continuidade: quatro cards, carteira completa, detalhes técnicos/equipamento/chamado, seis gráficos e finanças EXT |
| /custos-tco | C5 funcional, aprovada para continuidade: cinco cards, custos por nove dimensões, recorrentes/zero/desconhecidos, carteira/chamados caros, TA/TB/SLA e composição EXT |
| /riscos-tendencias | C2 funcional: cores, áreas, recorrência/pressão, prioridades ativas, motivos e sugestões demonstrativas; homologação preliminar |
| /chamados | B funcional e homologada: consulta central, filtros/busca/ordem/página, distribuições e detalhe |
| /sla-criticidade | C1/C1.1 funcionais: aderência/faixas, TA/TB, cores/motivos/populações e suporte |
| /equipamentos | C6 funcional, aguarda homologação visual: carteira por unidade/tipo, histórico técnico/cronológico, recorrência, TA/TB/SLA/custo e insights |
| /tecnicos | Placeholder; agrupamentos em C5 não equivalem à página |
| /pecas | Placeholder; componentes associados não são estoque/peças consumidas |
| /padroes-insights | Placeholder; insights em outras páginas não concluem esta página |
| /contratos-backoffice | Placeholder; consulta/cadastro/permissões ainda dependem de escopo, nenhum CRUD presumido |
| /integracoes | Placeholder; EXT não significa integração real conectada |

Sete páginas funcionais/cinco pendentes. Novo BackOffice substitui progressivamente telas antigas; não exige manutenção definitiva dos layouts antigos, mas durante a transição as cenas existentes permanecem recuperáveis. Placeholders não exibem números fictícios.

## 5. Fontes, importação e camada de dados

Original: `datasets/ORQUESTRA_MVP_Base_60_Dias_Filtros_FINAL.xlsx`.
SHA256 preservado: `1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe`.

| Fonte | Registros | Referência e uso |
| --- | ---: | --- |
| HIST_60_DIAS | 736, 46 campos, IDs únicos | Todas as sete páginas novas. Criado em: 08/08–06/10/2026 inclusivos; referência 06/10/2026 22h São Paulo |
| T0_Abertura | 10 | Snapshot em 08/09/2026 08h |
| T1_Acompanhamento | 16 | Snapshot em 08/09/2026 08h30 |
| T2_Desfecho | 24 | Snapshot em 08/09/2026 09h30 |
| Fixtures JavaScript legadas | Independentes | Roteiro da apresentação/Supervisor; preservar sem substituir pelo histórico |

Não concatenar fontes, somar snapshots entre si ou presumir que ausência de ID represente exclusão/conclusão. Mesmo ID em snapshots representa versões em momentos distintos, não duplicidade histórica. Política de completude/merge ainda não aprovada.

`scripts/import_orquestra.py` usa openpyxl preexistente; valida quatro abas, nomes/ordem/tipos de 46 campos, IDs/contagens/referências/enums. Normaliza NFC/trim, preserva nulos/números e datas locais ISO -03:00. Não contém o gerador da massa nem recalcula regras. `--check` não grava; não executar conversão normal para atualizar dados sem autorização.

JSONs em `src/data/orquestra/generated`: metadata + records com origem/hash/aba/momento/contagens; não editar à mão. API: getDataset, query, getById, countBy, distribution, describeField. Sem API externa/fetch/CDN: Vite empacota dados locais. Offline após carregamento foi testado; não há service worker nem primeiro acesso offline garantido. Helpers de fuso limitados ao demonstrador 2026/-03:00, sem generalização universal.

[Dicionário dos 46 campos](dados/dicionario.md), [camada de dados](dados/camada-dados.md), [fontes](dados/fontes.md), [resultado da importação](dados/resultado-us03-us04.md).

## 6. Filtros e regras de consulta

Dez filtros: período por Criado em; Criticidade_ORQUESTRA; Status; Cliente; Área; Tipo de Unidade; Categoria do Chamado; Recorrencia_30d; Unidade; Componente Principal. Unidade/Componente passaram de preparados para UI compartilhada na C6; ficam em Mais filtros com Categoria/Recorrência. Contrato/Supervisor/Técnico/Origem/Impacto_Contrato têm suporte preparado, mas não UI de filtro dedicada.

- AND entre campos; OR entre valores do mesmo campo. Recorrência agrupa 0, 1–2 e >=3 materializados, sem recalcular janela.
- Hoje/7/15/30/60 dias civis inclusivos, referência simulada fixa, não relógio do computador.
- Hoje=06/10 (14); 7=30/09–06/10 (93); 15=22/09–06/10 (202); 30=07/09–06/10 (395); 60=08/08–06/10 (736).
- Busca ignora caixa/acentos e combina palavras por AND, incluindo ID/cliente/contrato/unidade/ocorrência/componentes e demais campos definidos no serviço.
- Chips removíveis, limpar e vazio. Limpar retorna a 60 dias/sem restrições/criação desc/página 1 e padrões próprios das carteiras.
- Cards/gráficos/tabelas partem da mesma população antes da paginação, com N/elegibilidade específicos. Ordem antes da página, desempate determinístico por ID, nulos no fim; tamanhos 10/25/50.
- Retorno dos detalhes preserva contexto; filtros não persistem após refresh. Não criar camada paralela para novas páginas/modos.

## 7. Regras consolidadas de negócio e explicabilidade

### TA/TB e marcos temporais

Confirmação do responsável pela geração transmitida pelo usuário, válida somente para a massa sintética:
- TA = chegada ao edifício menos abertura, em minutos; rótulo TA — Tempo até a chegada (min).
- TB = encerramento técnico simulado menos chegada, em minutos; rótulo TB — Tempo de resolução simulado (min).
- Saída = encerramento técnico mais permanência adicional, 3–10 min no histórico e 5 min nos snapshots.
- Encerramento técnico não foi persistido. Não reconstruir timestamp e apresentá-lo como evento BASE.
- TA confirmado numericamente: 728/728 histórico, 2/2 T0, 9/9 T1, 20/20 T2; diferenças chegada→saída menos TB respeitam acréscimos confirmados.
- Médias: finitos não negativos materializados, N independente; zero informado válido; nulos excluídos. Sem elegíveis, indisponível. Histórico: TA N 728/média 35,385989 min; TB N 724/média 49,172652 min.
- Não são conceitos oficiais OTIS. Supervisor usa as mesmas siglas com sentidos próprios; não uniformizá-lo.

### SLA e ETA

- Preservar SLA_min/Percentual_SLA/ETA_min. Percentual_SLA é fração: 1=100%, apresentação ×100.
- Aderência demonstrativa: Status Concluído, SLA_min finito >0 e Percentual_SLA finito >=0. Cumpre <=1; cumpridos/elegíveis ×100. Total 665/724=91,9%; 59 ultrapassados. Sem elegíveis, —.
- Faixas contínuas [0;0,5], ]0,5;0,8], ]0,8;1], >1. Cor é outro campo.
- Consumo médio: média simples dos consumos válidos em todos os status; não consumo agregado contratual, nem média de percentuais diários para aderência geral.
- RESUMO_60_DIAS coincide com 677/736, população diferente. Não alterar C1/C3 para coincidir com ela.
- SLA restante, pausas, metas e contrato oficial continuam pendentes; não inferir fórmulas por correlação.
- ETA refere-se à chegada do técnico, não logística de peças; após chegada/conclusão não apresentar previsão futura. Zero fornecido identificado como base.

### Criticidade, pressão e recorrência

- Cores BASE Verde/Amarelo/Laranja/Vermelho preservadas, sem derivar do SLA. Laranja é janela de intervenção; apoio em todas as cores, inclusive Vermelho. Não presumir sequência obrigatória.
- Histórico inclui concluídos. Prioridade ativa = não Concluído e Laranja/Vermelho na referência, não tempo real. Total 12 não concluídos, 1 prioridade; Vermelhos históricos 66.
- Pressão operacional C2: Contrato distinto com algum Impacto_Contrato Alto; não margem negativa. Nos 60 dias: 12 contratos, 351 registros Alto. C4 indica algum Alto, sem Alto com cobertura completa ou cobertura parcial/ausente; sem pesos/faixas novas.
- Elevada C2/C6: Unidade distinta com algum Recorrencia_30d finito >=3. Total 19 unidades em 106 registros. Não somar o campo como eventos únicos.
- Proporção de chamados positivos C4: registros com recorrência finita >0 / todos os chamados do contexto; cobertura de valores válidos separada. Total 412/736=56,0%; ausentes não contam no numerador e permanecem no denominador. Sem população/qualquer valor válido, indisponível.
- Motivos/insights compostos agrupados pelo texto completo; associação não comprova causa e sugestão sintética não é predição ML validada.

### Custos e contratos C3/C4/C5

- estimatedCost: soma de custo finito não negativo, N válido/total; zero informado incluído; sem válidos indisponível. Não arredondar origem, somente apresentação. Total R$ 696.734,60/N736; média R$ 946,65 por chamado válido.
- Custo associado a técnicos é custo de seus chamados com técnico informado, não remuneração/custo individual de mão de obra. Ausência de nome fica fora do card de atribuição, mas permanece no global/grupo Não informado.
- Custo recorrente: somar custo válido dos chamados >0 da C4; R$ 401.718,00/N412. Participação monetária exige total válido >0: 57,7%. Recorrentes, zero e desconhecidos são grupos disjuntos, não parcelas contábeis adicionais.
- Pares custo×TA/TB exigem ambos válidos: N 728/N 724. Grupos SLA dentro/fora/sem elegibilidade: 665/59/12, médias com N próprio. “Desvio” é de SLA simulado, não orçamento ou prejuízo.
- C3 destaca contratos com algum Alto, ordenados N Alto desc/ID asc, top 5/lista completa. C4/C5 incluem todos os contratos presentes no recorte, não necessariamente vigentes.
- Total/custo/SLA/cor do contrato usam todos os seus registros filtrados; N Alto e motivos associados a Alto usam somente esses eventos.
- Séries por data de criação, não competência contábil ou resolução no dia. Sem custo/SLA elegível, lacuna; contagens sem chamados, zero. Não afirmar variação/meta/economia sem base aprovada.

### Equipamentos C6

- 54 unidades, 4 tipos na base: Escada Rolante, Elevador Social, Elevador Hospitalar, Elevador de Serviço. Não adicionar tipo ilustrativo nem afirmar total instalado/ativo.
- Quantidade de chamados, máximo registrado e último valor de recorrência são distintos. Máximo finito não negativo no recorte; sem válidos indisponível; cobertura explícita.
- Último registro por Criado em desc/ID asc no empate; sua cor/insight são BASE daquele chamado, não estado atual da unidade. Ordem padrão da carteira: máximo registrado desc/Unidade asc; alternativas por volume/cor da última ocorrência/data etc.
- Exemplo ESC-0145: 34 chamados, máximo 8, último 2, último chamado CH-20261004-0699, cor Amarelo.
- Recorrência positiva por tipo: Unidade distinta com algum >0 / Unidade distinta do próprio tipo. Escada 17/18=94,4%; Social 14/15=93,3%; Hospitalar 12/13=92,3%; Serviço 7/8=87,5%. Cobertura de unidades com algum valor válido explícita; sem cobertura/denominador, indisponível. Não somar percentuais; grupos podem sobrepor se tipos de uma unidade divergirem.
- Identificação, histórico cronológico e campos técnicos são observados nos chamados, não cadastro mestre. Defeitos/falhas/fechamentos não definem automaticamente causa. Disponibilidade real EXT.

### BASE / CALC / EXT

BASE: campos materializados com proveniência. CALC: agregações explícitas com fórmula/população/N/nulos/período/unidade/fonte/hash e suporte. EXT: fonte indisponível/integração pendente, sem número, zero ou comparação inventados; não conectada/sem sincronização quando aplicável. DEMO não substitui essas classificações.

Toda instância de indicador tem explicação acessível por botão, não só hover. Valores financeiros sintéticos não são valores oficiais OTIS. Receita/margem/rentabilidade/TCO completo/composição contábil, estoque/logística/skills/geolocalização/disponibilidade reais permanecem externos. Não dividir artificialmente custo agregado em mão de obra, peças, deslocamento, terceiros ou recorrência. Uptime requer exposição/calendário e intervalos completos de operação/parada; TA/TB/Carro Parado não bastam.

## 8. Preservação obrigatória da apresentação e do Supervisor

Preservar dados JavaScript roteirizados, cenas, CSS, alertas/criticidade, eventos/listeners, animações FLIP, temporizadores, detalhes/modais, remount, teclado/hash/refresh. Não corrigir incidentalmente comportamento legado.

| Hash sem query plataforma | Cena |
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

Atalhos setas/Espaço/PageUp/PageDown/Home/End/H preservados. Smart Fit Normal→Média→Alta; hospital crítico por contexto humano, não SLA. Nome “aviso-estourado” não autoriza acrescentar SLA a demanda sem SLA. Há colisões auxiliares de nomes no sceneIndex documentadas sem refatoração; não tocar índice global sem análise. Detalhe não pausa roteiro; fechar modal não necessariamente zera badge: comportamento preservado, não correção autorizada.

Comparação C6 com HEAD confirmou ausência de mudanças em legado, dados, importador e dependências; regressão anterior aprovada. Isso não certifica auditoria visual/cross-browser integral. [Matriz de cenas/tempos](preservacao/matriz-cenas.md), [estratégia de regressão](preservacao/estrategia-regressao.md), [recuperação](preservacao/recuperacao.md).

## 9. Próxima prioridade: Modo Feira de dados operacionais

Três experiências distintas:
- Plataforma: navegação livre e consulta histórica; implementada.
- Apresentação original/manual: dez cenas com controle do apresentador; preservada e padrão. Novo modo próprio de apresentação do BackOffice com seleção explícita de fonte/estado estável ainda não implementado.
- Feira: dados operacionais evoluem automaticamente com relógio determinístico, pausa/retomada/reinício. Não é autoplay de páginas/cenas. **Não implementada.**

Próximo passo recomendado: homologar visualmente C6; depois planejar/analisar e aprovar escopo da Feira. Não iniciar motor, controles ou integração nesta passagem. T0/T1/T2 são candidatos conhecidos, não autorização automática para merge/interpolação.

Antes da implementação, decidir: snapshots completos ou incrementais, significado de ausência de ID, fonte e estado inicial, política de substituição/merge, relógio e marcos, velocidade/loop/transições, pausa ao abrir detalhes/sair do modo, compatibilidade/reset de filtros, retorno a histórico/manual e fronteira com Supervisor. Pausa deve congelar dados/indicadores, não apenas animação; navegar de tela não deve implicitamente mudar o tempo. Não inferir evolução contínua de SLA, eventos intermediários ou cores sem regra aprovada.

Infraestrutura preparada em `src/platform/services/temporal.js`:
- projectSnapshot só libera snapshot se clock >= referência própria; nunca antecipar status/TA/TB/insights de estado posterior.
- eventAt: marco <= referência do snapshot é registrado (limite inclusivo); nulo ausente; posterior futuro, oculto na projeção.
- Avançar clock não confirma marco futuro de fonte congelada; exigir novo estado/evidência. Fonte imutável e encerramento técnico não reconstruído.
- Saída futura não invalida conclusão técnica informada; marcos distintos. T1 CH-20260908-006: saída 08:34/ref 08:30; T2 CH-20260908-017: saída 09:35/ref 09:30. Valores originais preservados, projeção oculta o futuro.

Ponte contextual Supervisor/retorno (US19) também não implementada. Link “Apresentação original” não é essa ponte. Supervisor tem roteiro/timers/dados próprios, independentes de filtros/HIST. Futura abertura deve informar a independência, pausar Feira e restaurar contexto sem avançar/retomar silenciosamente, conforme política a aprovar. Não montar dois controladores simultâneos nem insinuar sincronização real.

## 10. Backlog: 19 histórias e situação efetiva

Quadro detalhado atualizado em [Product Backlog](produto/backlog.md). US18-A/B são partes de US18, não histórias adicionais.

| US | Estado efetivo / restante |
| --- | --- |
| 01 | Proteção/regressão implementadas até C6, obrigação contínua; código legado preservado, referências até C5 commitadas, C6 local; auditoria visual integral pendente |
| 02 | Dez entradas mapeadas/validadas; ambiguidade auxiliar documentada, não refatorada |
| 03 | Histórico/importação concluídos tecnicamente e aprovados; 736/46, origem/hash e imutabilidade |
| 04 | Separação/consulta/projeção preparadas; histórico/snapshots/fixtures independentes; merge/motor Feira pendentes |
| 05 | Implementada nos indicadores das sete páginas; transversal, permanece para futuras páginas/modos |
| 06 | Parcial: login demo/plataforma independente e legado padrão; modos próprios Apresentação/Feira pendentes |
| 07 | Parcial: shell/12 menus e sete páginas funcionais; cinco páginas pendentes |
| 08 | Implementada e ampliada: dez filtros compartilhados, AND/OR/busca/chips/vazio/contexto; C6 ainda aguarda aceite visual |
| 09 | Chamados/detalhe implementados e homologados; reutilizados nas demais páginas |
| 10 | Parcial: Visão Geral C3 homologada; página Padrões & Insights pendente |
| 11 | SLA/Riscos implementados no escopo sintético aprovado; C2 homologação preliminar; regras oficiais/recálculos ainda não fornecidos |
| 12 | Parcial: Equipamentos C6 implementada, aguarda homologação visual; Técnicos pendente |
| 13 | Parcial: Contratos & Margem/Custos implementadas e aprovadas para continuidade; Contratos — BackOffice pendente, finanças reais EXT |
| 14 | Planejada, próxima prioridade; projeção temporal preparada não equivale à Feira implementada |
| 15 | Validação parcial notebook/móvel/teclado/foco/movimento reduzido; obrigação transversal, sem auditoria completa |
| 16 | Build/testes/docs/recuperação locais realizados; commits até C5; C6 sem commit; publicação/certificação Pages pendentes |
| 17 | Exportação pendente |
| 18 | A: placeholders Peças/Integrações, páginas EXT específicas pendentes; B: integrações reais pendentes de fontes/contratos |
| 19 | Ponte explícita Supervisor/retorno planejada; link legado não a implementa |

## 11. Testes, build e evidências

Última validação funcional C6: **225 testes distintos aprovados =216 Node/browser +9 Python**, sem falhas. Inclui 194 anteriores +31 C6 (21 serviço +10 navegador). Build/importação --check aprovados. A primeira regressão revelou expectativa antiga da B de Equipamentos pendente; adaptada para página funcional com os mesmos 281 chamados, mantendo ordem/página/retorno, e a suíte completa passou depois.

Neste encerramento documental os testes/build não foram reexecutados. Números confirmados nas evidências existentes; revisão documental não é nova homologação.

Evidências permanentes na árvore local (ainda sem commit C6): [216 Node/browser](produto/evidencias/entrega-c6-regression.txt), [31 C6 iniciais](produto/evidencias/entrega-c6-tests.txt), [9 Python](produto/evidencias/entrega-c6-python.txt), [build](produto/evidencias/entrega-c6-build.txt), [importação --check](produto/evidencias/entrega-c6-import.txt), [capturas e relatório](produto/entrega-c6-equipamentos.md). Capturas 1366×768, móvel 390×844, identificação/desempenho e histórico inspecionados. Quatro cards numéricos e EXT acima da dobra em notebook; tabelas/listas têm rolagem interna. Não auditoria integral de acessibilidade/cross-browser.

Comandos para futura execução quando solicitada/autorizada, na raiz efetiva; executar e conferir o sucesso de cada etapa separadamente:

```sh
pwd
git branch --show-current
git log -1 --format=fuller
git status --short --branch --untracked-files=all
npm run build -- --outDir /tmp/orquestra-c6/dist
ORQUESTRA_TEST_DIST=/tmp/orquestra-c6/dist ORQUESTRA_TEST_EVIDENCE=/tmp/orquestra-c6/legacy ORQUESTRA_SHELL_EVIDENCE=/tmp/orquestra-c6/shell node --test tests/*.test.mjs
/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -B tests/importacao-dados.test.py
/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -B scripts/import_orquestra.py --check
git diff --check
sha256sum datasets/ORQUESTRA_MVP_Base_60_Dias_Filtros_FINAL.xlsx
```

Ferramentas preexistentes: node:test nativo, Playwright, Chrome; Node/pacotes em `/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/`. ORQUESTRA_PLAYWRIGHT pode apontar ao pacote (padrão node/node_modules/playwright desse runtime); ORQUESTRA_CHROME ao browser (padrão `/usr/bin/google-chrome`). Python acima contém openpyxl; o do sistema pode não ter. Se ambiente mudou, localizar ferramentas, não instalar sem autorização.

Previews das suítes: legado 5187, shell 5189, B 5191, C1 5193, C2 5195, C3 5197, C4 5199, C5 5201, C6 5203; offline-layer tem artefato próprio. Testes abrem/encerram previews. Servidores locais/Chrome exigiram permissão apropriada no sandbox (EPERM ao abrir porta não era falha funcional). Não rodar duas instâncias da mesma suíte/porta; não encerrar servidor do usuário silenciosamente.

Testes de navegador podem reutilizar caminhos /tmp de entregas anteriores. Preservar evidências já copiadas para docs; /tmp não é backup permanente. Build atual registrado em `/tmp/orquestra-c6/dist`, base `/OrquestraNEXT`. Dev, somente se necessário e autorizado: `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort`, verificando ocupação da porta antes. Não executar `npm run deploy` (dispara predeploy/build e gh-pages).

## 12. Limitações e decisões abertas

- C6 aguarda homologação visual; C4/C5 foram aprovadas para continuidade, C2 preliminarmente homologada. Não usar testes para inventar aceite do usuário.
- Massa sintética; histórico de 60 dias não sustenta seis meses/12 meses, extrapolação, causalidade ou ML validado.
- Definições oficiais OTIS, pausas/metas/SLA restante e regras geradoras de criticidade/recorrência pendentes. Conceitos sintéticos TA/TB e agregações aprovadas não devem ser reabertos sem necessidade.
- Todos os 12 contratos têm algum Alto no período completo; proxy não distingue saúde financeira. Receita/margem/rentabilidade/TCO, composição financeira, estoque/logística/skills/disponibilidade reais externos.
- Cadastros mestres, vigência e parque instalado não fornecidos. Uptime não calculável com chamados/TA/TB.
- Feira ainda exige decisões de fonte/merge/completude/clock/loop/velocidade/pausa/retorno. Ponte Supervisor pendente. Duas saídas futuras dos snapshots preservadas.
- Demo sem autenticação corporativa, filtros em memória, offline só após carregar. Sem service worker.
- Bundle opt-in da plataforma mantém aviso >500kB (~1.280kB minificado/116,5kB gzip na C6); não silenciar. Eventual particionamento deve ter escopo próprio e regressão.
- Publicação não executada nesta evolução; SHA publicado/recuperação de deploy precisam de validação específica. Não inferir ambiente publicado a partir do Git local.

## 13. Git e inventário completo para preservação

Branch `feature/next-evolucao`; HEAD `485e6b49f6b0f1342a69e0a126adcecbab9d06f6`, commit de C5. **C6 não está no HEAD**. Há 15 arquivos modificados e 19 não rastreados, 34 no total; nada staged. Esta atualização documental apenas modifica continuidade/backlog que já estavam nessa lista.

Um checkout limpo de HEAD não contém C6. Usar a mesma pasta ou cópia integral controlada; não resetar/limpar untracked/arquivar sem preservar o trabalho local. Não criar commit nesta passagem. Versionamento C6 exige nova autorização; depois da homologação, pode ser proposto como etapa própria antes da Feira. [Recuperação](preservacao/recuperacao.md).

Inventário M=modificado, ??=não rastreado, conferido no encerramento:

```text
 M docs/CONTINUIDADE_CODEX.md
 M docs/README.md
 M docs/dados/dicionario.md
 M docs/produto/backlog.md
 M docs/produto/cobertura-telas.md
 M docs/produto/explicabilidade-ext.md
 M docs/produto/plano-incremental.md
 M src/platform/BackofficePlatform.jsx
 M src/platform/components/ConsultationUI.jsx
 M src/platform/filters/ConsultationContext.jsx
 M src/platform/services/chamados.js
 M src/platform/services/contratos.js
 M tests/README.md
 M tests/chamados-browser.test.mjs
 M tests/platform-shell.test.mjs
?? docs/produto/entrega-c6-equipamentos.md
?? docs/produto/evidencias/c6-reference-build.txt
?? docs/produto/evidencias/c6-reference-python.txt
?? docs/produto/evidencias/c6-reference-tests.txt
?? docs/produto/evidencias/entrega-c6-build.txt
?? docs/produto/evidencias/entrega-c6-equipamentos-analises.png
?? docs/produto/evidencias/entrega-c6-equipamentos-desktop.png
?? docs/produto/evidencias/entrega-c6-equipamentos-detalhe.png
?? docs/produto/evidencias/entrega-c6-equipamentos-historico.png
?? docs/produto/evidencias/entrega-c6-equipamentos-mobile.png
?? docs/produto/evidencias/entrega-c6-import.txt
?? docs/produto/evidencias/entrega-c6-python.txt
?? docs/produto/evidencias/entrega-c6-regression.txt
?? docs/produto/evidencias/entrega-c6-tests.txt
?? src/platform/pages/EquipamentosPage.jsx
?? src/platform/pages/EquipamentosPage.module.css
?? src/platform/services/equipamentos.js
?? tests/equipamentos-browser.test.mjs
?? tests/equipamentos-service.test.mjs
```

## 14. Prompt de retomada para nova conversa

> Estamos retomando o ORQUESTRA na raiz efetiva `/home/p2dutra/Documents/ChatGPT/Projeto_Challenge_OTIS/OrquestraNEXT`. Antes de qualquer alteração, leia AGENTS.md aplicáveis se existirem, `docs/CONTINUIDADE_CODEX.md`, `docs/produto/backlog.md`, `docs/produto/plano-incremental.md` e `docs/produto/entrega-c6-equipamentos.md`. Confira branch, HEAD e status completo, preservando todos os arquivos locais. A branch esperada é `feature/next-evolucao`; HEAD `485e6b49f6b0f1342a69e0a126adcecbab9d06f6` registra até C5. C6 — Equipamentos está implementada localmente, com 225 testes aprovados, sem commit próprio, aguardando minha homologação visual. Existem sete páginas funcionais/cinco pendentes e 19 User Stories com estados registrados no backlog. Confirme a compreensão da arquitetura, dados, regras, restrições e Git. A próxima prioridade planejada é Modo Feira com evolução temporal automática dos dados, pausa/retomada/reinício, não autoplay de cenas; ainda não implemente. Preserve Supervisor, dez cenas, dados, animações, temporizadores e apresentação manual. Não modificar código/datasets, instalar dependências, rodar testes/build, criar commits, push ou deploy nesta retomada sem nova orientação. Aguarde minha homologação C6 e autorização de escopo antes de iniciar qualquer implementação.
