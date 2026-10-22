# C6 — Equipamentos — Histórico, Recorrência e Inteligência Operacional

15/10/2026, America/Sao_Paulo. C5 avaliada pelo usuário e aprovada para continuidade. Implementação autorizada exclusivamente de Equipamentos, em `/OrquestraNEXT/?modo=plataforma#/equipamentos`. C6 encerrada tecnicamente, aguardando homologação; nenhuma outra página ou Modo Feira iniciado.

## Referência permanente da C5

Branch `feature/next-evolucao`, HEAD inicial ebd0db93a06ec78f11c7dfbe55298a6c043b17a4. Revisados 12 arquivos modificados e 18 não rastreados: todos relacionados à C5, sua documentação e evidências. Diffs, conteúdo, tipos e padrões de credenciais examinados; nenhum indício de segredo nos arquivos revisados nem temporário indevido. Supervisor/cenas/dados/dependências sem diferenças.

Antes de alterar arquivos, build e 194 testes aprovados novamente (185 Node/browser +9 Python). Staging restrito aos 30 arquivos esperados, revisado por stat/status e `git diff --cached --check` aprovado.

Commit local autorizado: **485e6b49f6b0f1342a69e0a126adcecbab9d06f6** — `feat: implementa analise de custos C5`. Árvore limpa após commit. Sem push/deploy. C6 permanece sem commit e nada staged ao encerrar.

## Página e fonte

Fonte exclusiva HIST_60_DIAS pela camada local aprovada, 736 chamados sintéticos/46 campos. Período completo 08/08–06/10/2026 inclusivos por Criado em; referência fixa 06/10/2026 22h, São Paulo. Snapshots e fixtures do Supervisor não participam. Nenhum cadastro de ativo instalado/vigente inferido.

Quatro cards numéricos sustentados e disponibilidade operacional EXT, carteira por unidade, quatro painéis analíticos e investigação com registros de suporte. Referência gráfica T09 seguida na hierarquia, cores e progressão; não foram copiados números, disponibilidade percentual, “Elevador Panorâmico” ou categorias ausentes da base.

| Indicador completo | Regra | Resultado |
| --- | --- | --- |
| Unidades com chamados no período | Unidade distinta não ausente após filtros e busca | 54 |
| Unidades com recorrência elevada | riskAnalysis C2: Unidade distinta com algum Recorrencia_30d finito >=3 | 19, em 106 registros >=3 |
| Ocorrências no período | Registros filtrados, ID único; todos os status, sem elegibilidade por Falha | 736 |
| Tipos de equipamento | Tipo de Unidade distinto não ausente | 4 |
| Disponibilidade operacional | Sem tempo de exposição/operação/paradas completo | EXT, sem uptime ou percentual |

Unidade ausente fica fora da contagem de entidades/tabela, mas seus registros continuam no total e nos demais agrupamentos; quantidade sem unidade explícita (0 na fonte completa). Tipos/identificação são valores observados nos chamados, sem criar cadastro mestre.

## Carteira, ordenação e recorrência

Tabela com unidade, clientes, tipos observados, até dois componentes predominantes por contagem, chamados no período, recorrência registrada, última ocorrência, sua criticidade, insight e detalhe. Componentes completos e campos técnicos ficam disponíveis no detalhe. Insight da tabela é BASE do mesmo último chamado, recolhível para manter a leitura.

- Quantidade de chamados = registros encontrados para a unidade no recorte.
- Máximo de recorrência = maior Recorrencia_30d válido (finito não negativo) observado na unidade, não soma.
- Último valor = Recorrencia_30d BASE do chamado mais recente por criação; pode diferir do máximo.
- Cobertura de recorrência = registros válidos/total da unidade. Sem qualquer valor válido, máximo indisponível; nulo/inválido não vira zero.
- Última ocorrência = Criado em desc, ID_Chamado asc no empate, dentro do recorte. Cor e insight são desse registro, não estado atual nem criticidade recalculada do equipamento.

Exemplo reconciliado: ESC-0145 tem 34 chamados, máximo registrado 8 e último valor 2; último chamado CH-20261004-0699, cor Amarelo. Esses números não significam 34 ou 8 falhas novas além do histórico.

Ordem inicial: máximo registrado decrescente, Unidade crescente no empate; ausentes por último. Alternativas por chamados, cor da última ocorrência (ordem fornecida Verde/Amarelo/Laranja/Vermelho), data, cliente, tipo e unidade. Ordenação antes da paginação 10/25/50. A maior cor de uma unidade não é inferida por SLA, e a opção de ordenar cor não modifica dados.

## Gráficos e populações

1. Ocorrências por Componente Principal: groupRecords C1 conta chamados e ordena frequência desc/texto asc; não conta peças consumidas nem comprova causa.
2. Unidades com recorrência positiva **>0** por tipo: numerador = Unidade distinta com algum registro positivo no tipo; denominador = todas as Unidades distintas do mesmo tipo no recorte. Cobertura = unidades do tipo com algum valor válido de recorrência. Não é proporção de chamados nem o card de elevada >=3.
3. Evolução diária: dailyEvolution C2 + ExecutiveChart C3, contagem por criação, dias sem chamados zero, somente dias do período (máximo 60), sem extrapolação ou transições de estado inferidas.
4. Criticidade histórica por tipo: quatro cores BASE, incluindo concluídos; barras proporcionais ao total de chamados do tipo e botões com contagem/lista de suporte. Não disponibilidade ou criticidade atual da unidade.

| Tipo existente | Chamados | Unidades positivas / unidades do tipo | Percentual >0 |
| --- | ---: | ---: | ---: |
| Escada Rolante | 225 | 17/18 | 94,4% |
| Elevador Social | 201 | 14/15 | 93,3% |
| Elevador Hospitalar | 198 | 12/13 | 92,3% |
| Elevador de Serviço | 112 | 7/8 | 87,5% |

Total: 50 unidades distintas com recorrência positiva. Não somar percentuais dos tipos; caso uma unidade tenha tipos divergentes, ela pode aparecer em mais de um grupo (não observado na fonte atual). Recorrência desconhecida não entra no numerador, mas unidade permanece no denominador e tem cobertura explícita. Sem unidades ou sem qualquer cobertura de recorrência, proporção indisponível; zeros válidos produzem 0%. Chaves de tipo ausentes são agrupadas como Não informado sem contar como tipo distinto conhecido.

Cada gráfico permite aprofundamento. O de recorrência por tipo abre as unidades do tipo e permite consultar somente os registros positivos; os denominadores e a população integral do tipo continuam visíveis.

## Identificação, histórico e inteligência da unidade

Fluxo validado: carteira → tipo → unidade → histórico → recorrência → insight → chamado. Aberturas independentes de tipo/unidade/suporte/insight e detalhe mantêm as telas anteriores montadas e o contexto ao fechar. Não há ligação fictícia com dados do Supervisor.

Identificação BASE: unidade, tipos, clientes, contratos, áreas, fabricante, controle e máquina observados. Múltiplos valores são mostrados; não é cadastro de ativo instalado/ativo/vigente.

Desempenho: total, TA/TB médios, SLA simulado, custo estimado e máximo de recorrência, com explicações e N próprio; criticidade histórica com quatro cores e suporte. Reutilizados contractMetrics/average/adherence/estimatedCost, sem fórmulas novas. TA/TB em minutos sintéticos aprovados, zero informado válido, nulos excluídos; SLA C1 entre concluídos elegíveis; custo sintético não é despesa realizada OTIS. N totais conciliados: TA728, TB724, SLA665/724, custo R$ 696.734,60/N736.

Histórico cronológico por criação descendente/ID asc, somente recorte filtrado; cada ocorrência abre o detalhe existente. Lista interna rolável, com categoria, componente, recorrência BASE e cor. Contexto técnico recolhível contém subcomponente, defeito, falha, fechamento e status. Seção técnica agrupa categorias/componentes/subcomponentes/defeitos/falhas/fechamentos pelo texto completo com contagens CALC, nulos Não informado e suporte por grupo.

Recorrência da unidade mantém chamados >0 e >=3 separados, máximo/último/cobertura explícitos. Componentes por frequência permitem investigar padrões; associação não comprova causa. Insights fornecidos mantêm texto completo BASE sintético, agrupado com lista de chamados associados. Sugestão demonstrativa: examinar histórico, componente e contexto de manutenção; sem diagnóstico probabilístico, ML treinado, causa, predição ou intervenção automática afirmados.

Disponibilidade permanece EXT: faltam calendário/exposição e intervalos completos de operação/parada. TA/TB, Carro Parado e chamados não permitem reconstruir uptime. Explicação identifica telemetria, monitoramento e cadastro operacional necessários, sem conexão/sincronização simuladas.

## Filtros, contexto e explicabilidade

Infraestrutura da B reutilizada, com dois campos preparados promovidos à UI compartilhada: Unidade e Componente Principal em “Mais filtros”, junto de Categoria e Recorrência. Agora dez filtros de consulta incluindo período, criticidade, status, cliente, área e tipo. AND entre campos, OR interno, busca normalizada e chips existentes; nenhum seletor paralelo. Indicador de filtros avançados inclui todas as seleções avançadas.

Cards/tabela/gráficos partem da mesma população antes da paginação, com elegibilidade explícita. Novos filtros permanecem ao navegar para Chamados, Visão Geral, Custos e outras páginas; explicações registram os campos/filtros ativos. Limpar/logout reseta também a carteira de equipamentos. Ordem/página/tamanho ficam no ConsultationProvider em memória; mudar filtro/busca volta à primeira página. Refresh restaura padrões. Tipo/unidade abertos e aprofundamentos são locais à página, encerram ao mudar de página.

13 explicações acessíveis na página principal: quatro cards, EXT, carteira, duas definições de colunas, quatro gráficos e investigação. Detalhe acrescenta indicadores, criticidade, recorrência/componentes, agrupamentos técnicos e insights com N e filtros contextuais. Todas informam definição, campos, fórmula, população, período, unidade, nulos e fonte/hash, BASE/CALC/EXT. Campos técnicos e textos são BASE; contagens/agrupamentos são CALC.

## Arquivos

Criados:
- src/platform/services/equipamentos.js: carteira, último/máximo, grupos por tipo, métricas e metadados.
- src/platform/pages/EquipamentosPage.jsx e EquipamentosPage.module.css: página/detalhe e estilos isolados.
- tests/equipamentos-service.test.mjs e equipamentos-browser.test.mjs.
- Este relatório e evidências C6.

Modificados:
- src/platform/BackofficePlatform.jsx: conexão exclusiva da rota equipamentos e página funcional.
- src/platform/services/chamados.js: expor filtros Unidade/Componente preparados, removendo-os da lista futura. Nenhuma regra de seleção alterada.
- src/platform/components/ConsultationUI.jsx: indicador de seleções avançadas generalizado para incluir os novos campos.
- src/platform/filters/ConsultationContext.jsx: estado de apresentação da carteira de equipamentos, reset e retorno à primeira página em mudanças de consulta.
- src/platform/services/contratos.js: callback opcional valueFor para reutilizar ordenação/nulos/desempate/paginação com campos da unidade; comportamento C4/C5 preservado.
- tests/platform-shell.test.mjs: sete páginas funcionais/cinco destinos pendentes, ainda verificando os 12 menus.
- tests/chamados-browser.test.mjs: atualizar a expectativa de Equipamentos pendente para página funcional com os mesmos 281 chamados filtrados, mantendo verificações de ordem/página/retorno de Chamados.
- docs/CONTINUIDADE_CODEX.md, docs/README.md, docs/dados/dicionario.md, docs/produto/backlog.md, plano-incremental.md, cobertura-telas.md, explicabilidade-ext.md e tests/README.md.

## Testes, visual e preservação

**225 testes distintos aprovados =216 Node/browser +9 Python**, incluindo os 194 anteriores e 31 novos C6 (21 serviço +10 navegador). Build e importador --check aprovados. Nenhuma dependência instalada.

Novos: unidades/elevadas/tipos/componentes, denominador por tipo (quatro casos), distinção volume/máximo/último, cronologia e empate, ordenação/paginação/nulos, filtros cumulativos Unidade/Componente/Categoria/Recorrência e retorno entre páginas, sincronização, TA/TB/SLA/custos, ausência/vazio/cobertura, disponibilidade EXT, 13 explicações com teclado, percurso completo até insight/chamado, offline após carregamento, notebook/móvel e imutabilidade.

Na primeira regressão, um teste da B ainda esperava “Desenvolvimento pendente” ao visitar Equipamentos. Atualizado para aguardar o indicador funcional e confirmar os mesmos 281 chamados no recorte. Preservadas integralmente as comparações de linhas, ordenação, segunda página e retorno. Suíte completa reexecutada após ajuste, sem falhas. Não houve alteração do produto para satisfazer essa expectativa antiga.

Capturas inspecionadas: 1366×768 com os quatro cards numéricos e EXT acima da dobra; móvel390×844 sem overflow do documento/diálogo. Tabelas/listas têm rolagem interna, conteúdo técnico/insights recolhíveis, fontes/gráficos mantidos legíveis. Histórico cronológico e detalhe verificados visualmente. Build em /tmp/orquestra-c6/dist, base /OrquestraNEXT. Não equivale a auditoria integral cross-browser/acessibilidade.

Regressão anterior aprovada: sete páginas/12 menus, login/saída/refresh, filtros, consultas/detalhes, dez hashes diretos e refresh, teclado/extremos, Smart Fit Normal→Média→Alta, hospital crítico por contexto humano, alertas/FLIP/movimento reduzido, temporizadores, saída antes dos timers e revisita. Comparação com 485e6b4 sem diferenças no Supervisor/cenas/componentes/styles legados, src/data, scripts, datasets, referencias, App/main ou package/lock/configuração Vite.

SHA256 XLSX intacto: 1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe. TA/TB/SLA/criticidade/recorrência materializados preservados; nenhuma fórmula geradora foi reinventada. Snapshots separados e projeção temporal anterior intacta.

Evidências:
- [Antes do commit C5: 185 Node/browser](evidencias/c6-reference-tests.txt), [9 Python](evidencias/c6-reference-python.txt), [build](evidencias/c6-reference-build.txt).
- [Regressão completa 216 Node/browser](evidencias/entrega-c6-regression.txt), [31 C6 iniciais](evidencias/entrega-c6-tests.txt).
- [9 Python](evidencias/entrega-c6-python.txt), [importador --check](evidencias/entrega-c6-import.txt), [build](evidencias/entrega-c6-build.txt).
- [Notebook](evidencias/entrega-c6-equipamentos-desktop.png), [análises](evidencias/entrega-c6-equipamentos-analises.png), [identificação/desempenho](evidencias/entrega-c6-equipamentos-detalhe.png), [histórico](evidencias/entrega-c6-equipamentos-historico.png), [móvel](evidencias/entrega-c6-equipamentos-mobile.png).

## Backlog, limites e próxima prioridade

US12 parcialmente entregue com Equipamentos; Técnicos continua pendente. US05 atendida nos indicadores desta entrega; US07 agora sete páginas funcionais/cinco destinos pendentes. US08 ampliada com dois filtros compartilhados; US09 reutilizada. US01/15/16 revalidadas no escopo dos testes. US14 permanece pendente: não foi criado motor Feira.

Limites: massa sintética, presença no histórico não prova parque ativo/instalado; ausência de calendário/telemetria impede disponibilidade real; valores observados não são cadastro mestre. Recorrência/criticidade materializadas, sem regras geradoras conhecidas; máximo registrado não é total de eventos nem estado atual. Relações com componentes/falhas não comprovam causa. Custos são estimativas; SLA/TA/TB não são conceitos oficiais OTIS. Login demo, filtros em memória, offline após carregamento sem service worker. Aviso preexistente de chunk >500kB continua (~1.280kB minificado/116,5kB gzip), sem silenciar ou instalar pacotes.

Próxima prioridade planejada pelo usuário: **Modo Feira (US14)**, com evolução temporal automática, pausa, retomada e reinício, preservando apresentação manual e Supervisor. Início depende de homologação C6 e autorização de escopo próprio: relógio/fontes/merge/completude/velocidade/loop e fronteiras ainda precisam de definição. Infraestrutura temporal anterior não equivale a modo implementado.

C6 encerrada e aguardando homologação. Sem commit C6, push ou deploy; nenhuma próxima implementação iniciada.
