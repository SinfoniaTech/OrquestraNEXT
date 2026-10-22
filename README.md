# ORQUESTRA — OrquestraNEXT

Demonstrador acadêmico do FIAP Challenge/NEXT para consulta operacional de manutenção de elevadores, análise histórica e apresentação de uma operação simulada. Usa dados sintéticos; não representa uma integração corporativa em produção.

O projeto reúne BackOffice, apresentação guiada, simulação temporal Feira, Supervisor conectado e dez cenas originais preservadas.

## Executar

Requer Node.js compatível com o Vite instalado (consulte `node_modules/vite/package.json`, campo `engines`) e npm. O lockfile fixa as dependências. Python 3 e `openpyxl` são necessários somente para os importadores XLSX.

```sh
npm ci
npm run dev
```

Abra o endereço indicado pelo Vite com a base `/OrquestraNEXT/`. Para gerar e consultar a versão estática:

```sh
npm run build
npm run preview
```

Stack: React, Vite, JavaScript/JSX e CSS Modules. `gh-pages` é a ferramenta de publicação estática. Dependências e comandos estão em [package.json](package.json).

## Modos de acesso

Acrescente os caminhos abaixo à origem do servidor:

| Modo | Caminho | Uso |
| --- | --- | --- |
| Apresentação guiada (padrão) | `/OrquestraNEXT/` | Nove telas atuais; avanço manual; sem login ou API local |
| Plataforma livre | `/OrquestraNEXT/?modo=plataforma` | Acesso demonstrativo e navegação pelo BackOffice |
| Feira | `/OrquestraNEXT/?modo=feira` | Simulação independente no site estático; conectada quando servida pelo serviço local |
| Supervisor Feira | `/OrquestraNEXT/?modo=supervisor-feira` | Serviço local e pareamento obrigatórios |
| Legado | `/OrquestraNEXT/?modo=legado#/1` | Dez cenas originais com seu próprio roteiro |

Visão Geral, Contratos & Margem, Custos / TCO, Riscos & Tendências, Chamados, SLA & Criticidade, Técnicos, Equipamentos e Peças têm telas funcionais. Padrões & Insights, Contratos — BackOffice e Integrações permanecem pendentes. Consulte [modos e contratos](docs/produto/modos.md).

## Feira sincronizada

```sh
npm run build
npm run feira:local -- --host 127.0.0.1 --port 5180
```

Para notebook e celular, use `--host` com o IPv4 específico do notebook na rede compartilhada e uma porta disponível. O processo informa as URLs com a sessão e os códigos de pareamento; o código ADMIN é exclusivo do operador. A sessão inicia T00 pausada. O servidor Node serve `dist`, mantém o motor autoritativo e envia atualizações por SSE; comandos usam POST. O celular recebe o mesmo estado e os detalhes usam confirmação, fotografia e pausa global. Reiniciar o servidor cria uma nova sessão.

O GitHub Pages hospeda apenas arquivos estáticos: não executa esse servidor nem sincroniza o celular. Procedimentos, limites e homologações pendentes estão em [C9.1](docs/produto/entrega-c91-sincronizacao.md) e [C9.2](docs/produto/entrega-c92-feira-estendida.md).

## Estrutura e fluxo

| Local | Responsabilidade |
| --- | --- |
| `src/App.jsx`, `src/modes.js` | Seleção do modo e carregamento sob demanda |
| `src/presentation/` | Menu e roteiro manual da apresentação atual |
| `src/platform/` | Shell, páginas, filtros, componentes e serviços analíticos |
| `src/data/orquestra/` | Consulta imutável, esquema e dados históricos/snapshots |
| `src/feira/` | Motor visual, seletores, simulação e clientes sincronizados |
| `src/feira/supervisor/` | Interface do Supervisor Feira, temas e movimentos |
| `server/` | Sessão autoritativa, HTTP, SSE e comandos |
| `src/components/SceneController.jsx`, `src/scenes*`, `src/views/` | Controlador, configuração e cenas legadas |
| `src/styles/` | Estilos globais mínimos e variáveis do controlador |
| `datasets/`, `scripts/` | Fontes XLSX e importação controlada |
| `tests/` | Testes de dados, regras, protocolos e navegador |
| `docs/`, `referencias/` | Documentação, evidências e referências |

No BackOffice, páginas consomem serviços de domínio e o contexto de filtros compartilhado. Na Feira conectada, o servidor mantém o tempo operacional; o cliente não avança a operação por conta própria. Arquitetura detalhada: [guia técnico](docs/tecnica/guia-projeto.md).

## Dados e indicadores

- Histórico `HIST_60_DIAS`: 736 registros e 46 campos; snapshots T0/T1/T2 separados.
- Feira estendida: 12 fotografias T00–T11, 417 registros, 55 IDs e 189 eventos.
- BASE identifica dado fornecido; CALC identifica cálculo explicável; EXT identifica fonte indisponível, sem valor fictício.
- Criticidade, SLA, TA/TB, recorrência e custos têm contratos próprios; uma cor não implica automaticamente violação de SLA.

Não edite JSON gerado manualmente. Consulte [fontes](docs/dados/fontes.md), [dicionário](docs/dados/dicionario.md), [camada de dados](docs/dados/camada-dados.md) e [explicabilidade](docs/produto/explicabilidade-ext.md).

## Manutenção, testes e publicação

- **Tamanho dos cards e espaçamentos:** [guia visual com arquivos, seletores e exemplos](docs/tecnica/guia-estilos.md).
- **Testes:** [comandos e requisitos por suíte](tests/README.md). Os testes de navegador precisam do runtime Playwright/Chrome documentado; não existe script `npm test` neste projeto.
- **Cenas legadas:** ordem em `src/scenes.config.js`; cada cena fica em `src/views/<cena>/index.jsx`. Posições iguais dividem o palco. Setas, Espaço, PageUp/PageDown, Home/End e H controlam o roteiro legado. A apresentação atual usa `src/presentation/itinerary.js`.
- **GitHub:** `origin` aponta para `SinfoniaTech/OrquestraNEXT`. Publicar documentação na branch não atualiza o site. `npm run deploy` executa build e publica `dist` via `gh-pages`; execute somente em uma entrega autorizada para o site. A base está em `vite.config.js` e o endereço pretendido em `package.json`.

## Documentação completa

Comece pelo [índice de documentação](docs/README.md). O [backlog](docs/produto/backlog.md) registra escopo e critérios; a [continuidade oficial](docs/CONTINUIDADE_CODEX.md) registra o estado verificável e as próximas ações. Relatórios antigos preservam evidências da época e não comprovam o estado da publicação atual. Para contribuir, siga [AGENTS.md](AGENTS.md).
