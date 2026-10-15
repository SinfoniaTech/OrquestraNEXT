# Arquitetura e dependências

React/React DOM, Vite, ES Modules, CSS Modules, SVG próprio e gh-pages. main.jsx monta StrictMode e estilos globais; App monta SceneController. Sem backend, autenticação, roteador ou leitura Excel implementados.

## Grafo funcional

- SceneController → scenes.config, sceneIndex, CSS do palco → views/**/index.jsx via lazy/Suspense.
- BackofficeView → Sidebar, TopHeader, telas e metadados; navegação por estado.
- ChamadosScreen → chamadosData → fila, fluxo, alertas, feed e detalhe.
- Cenas Supervisor → QuadroSupervisor → header/CSS Supervisor/barra tutorial.
- CenaTransicao → listas, CardTransicao, useRoteiro, useFlip.
- DetalheDoTutorial → ChamadoDetalheView por props, mantendo lookup legado como fallback.
- AvisoCritico → alerta, detalhe, modo risco/crítico e CSS.

## Reuso e manutenção

| Grupo | Dependências | Encaminhamento |
| --- | --- | --- |
| Sidebar/TopHeader/SectionCard | menu, metadados, CSS | Reusar; conectar busca/período na Plataforma |
| KpiCard/AnimatedKpi/AnimatedNumber | props, timeout/RAF | Reusar; explicação e fonte por composição |
| DataTable/BarChart/LineChart | props/SVG | Reusar; paginação, vazio e drill-down conforme necessidade |
| Badge/PrioridadeBadge/SlaBar/ProgressBar | enums e escala | Adapter validado; não recalcular criticidade arbitrariamente |
| FilaChamados/AlertasSla/FeedEventos/DetalheChamadoPanel | shape de mock/callbacks | Consulta controlada na Plataforma; preservar legado |
| QuadroSupervisor/ListaChamados/ItemLista | shell e IDs FLIP | Preservar estrutura e identidades |
| ChamadoCard/ChamadoDetalheView | dados Supervisor/props | Reaproveitar sem reescrever |
| useRoteiro/useFlip/CenaTransicao | montagem, DOM e tempos | Preservar; não são relógio de negócio da Feira |
| AvisoCritico | dados/modal/foco | Reusar; revisar foco e ID fixo se múltiplas instâncias |

As árvores BackOffice diferem somente em BackofficeView.jsx: default operacional vs chamados. Componentes/dados/CSS correspondentes são cópias. Consolidar posteriormente com adaptadores e testes, sem remover nomes de cenas.

sceneIndex usa a última pasta como chave: sete colisões chamados-aberto/alerta/concluido/em-atendimento/encaminhado/priorizado/repouso. As dez entradas principais são únicas. Não ampliar glob sem controlar colisões e descoberta acidental de páginas novas.

## Limitações existentes

Header mantém busca/período sem consultar dados; chips técnicos só selecionam visualmente. Fila filtra localmente, limita dez e usa total agregado. Sem paginação completa. Outros destinos são placeholders; Mapa Supervisor é distribuição regional, sem geografia. Sidebar some abaixo de 1024px; subnav só oferece dois painéis.

CSS global mínimo, tokens bk/sup/onx isolados. Sem suíte de testes/lint. Timers não pausam com detalhes. Sem error boundary por cena identificado.

## Proposta de evolução

Seleção de modo acima do controlador; Plataforma com shell reaproveitado e filtros persistentes; funções puras de seleção/agregação fora das telas. Context/reducer são proposta inicial. Apresentação mantém fixtures/remontagem. Feira recebe relógio e estado temporal próprios. Não substituir arquitetura sem evidência ou criar dependência por conveniência.

## Atualização de diretriz

Este é diagnóstico do código legado. A proposta anterior de consolidar cópias mantendo defaults não é mais objetivo obrigatório. Construir novo BackOffice por etapas e preservar Supervisor; ver [arquitetura proposta](arquitetura-proposta.md). BackOffice pode ser substituído com justificativa e referência recuperável.
