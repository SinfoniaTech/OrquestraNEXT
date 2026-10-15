# ORQUESTRA — continuidade oficial

Ponto único de retomada. Regras permanentes: [AGENTS.md](../AGENTS.md). Leia as seções A–I e consulte apenas as referências necessárias à tarefa. Relatórios específicos guardam o histórico; este documento registra o estado atual.

## A. Identificação

- **Atualização:** 15/10/2026, 13h15, America/Sao_Paulo (UTC−03:00); horário de atualização; revalidação para versionamento/publicação controlada.
- **Raiz efetiva:** `/home/p2dutra/Documents/ChatGPT/Projeto_Challenge_OTIS/OrquestraNEXT`. O diretório pai tem outro contexto Git; não usar a pasta antiga com espaços por suposição.
- **Branch verificada:** `feature/next-evolucao`.
- **Commit funcional de referência (C8):** `81340597740f461dbb401c81314397b802354e0d` — `feat: implementa inteligencia de pecas e componentes C8`.
- **Commit C8 criado:** `81340597740f461dbb401c81314397b802354e0d`, 44 arquivos C8/documentação/evidências revisados; cached stat/check aprovados. Árvore limpa imediatamente depois do commit e do push.
- **Remoto confirmado após envio da implementação, antes do commit documental:** origin=https://github.com/SinfoniaTech/OrquestraNEXT.git; local e origin/feature/next-evolucao no mesmo SHA acima, divergência 0/0; upstream configurado. URL do origin permaneceu HTTPS. Push HTTPS inicialmente não encontrou credenciais; SSH preexistente autenticou e foi usado por reescrita temporária apenas no comando, sem alterar o remoto persistente.
- **Publicação autorizada e concluída:** https://sinfoniatech.github.io/OrquestraNEXT/; gh-pages `547db4d8124160521ae9dd1aa00f5a1157929bac`, pai `429d377d13e9bdf29a7e44c5ade937a4d5fdd83a`, sem force. Workflow [38767107398](https://github.com/SinfoniaTech/OrquestraNEXT/actions/runs/38767107398) completed/success. main permanece `a350cd0a494fac9dc092233d79cfc3f0fa8db42d`.
- **Registro documental complementar:** usuário autorizou commit e push somente deste documento e de `docs/produto/backlog.md`. O commit complementar sucede 8134059 sem alterar o produto; seu SHA deve ser obtido com `git log -1` e confrontado com `git ls-remote origin refs/heads/feature/next-evolucao` na retomada, evitando autorreferência de hash neste arquivo.
- [Relatório C8](produto/entrega-c8-pecas.md); [preparação Pages e evidências](produto/publicacao-controlada-c8.md). Esses relatórios preservam o estado da preparação; a publicação confirmada está registrada aqui.

Reconfirme o inventário com `git status --short --branch --untracked-files=all` em cada retomada. Não limpar/stashar/resetar/trocar branch/descartar para obter árvore limpa. [Recuperação](preservacao/recuperacao.md).

## B. Objetivo atual

ORQUESTRA é um demonstrador acadêmico FIAP Challenge/NEXT: BackOffice funcional, indicadores explicáveis e dados rastreáveis, preservando apresentação original e Supervisor.

**Entrega atual:** C8 — Peças / Inteligência de Componentes e Ocorrências homologada visualmente para continuidade. Nove páginas funcionais/três pendentes. C7 e rotina homologadas e em a5aea32; C8 homologada, versionada e enviada em 8134059.

**Escopo desta sessão:** C8 revalidada, commit/push concluídos; publicação Pages e commit/push documental complementar expressamente autorizados pelo usuário após apresentação do destino. Publicação concluída e validada. Não modificar produto/dataset/Supervisor/cenas ou iniciar Feira.

**Próxima etapa de desenvolvimento:** Modo Feira/US14, ainda não autorizado. Evolução temporal de dados operacionais com pausa/retomada/reinício; não autoplay de cenas.

## C. Estado das entregas

Totais de testes são marcos cumulativos, não devem ser somados entre linhas. Homologação e aprovação para continuidade são registradas com os limites do aceite disponível.

| Entrega | Implementação | Testes registrados | Aceite do usuário | Commit local | Publicação comprovada desta entrega |
| --- | --- | --- | --- | --- | --- |
| Dados / A / B | Camada de dados, shell e Chamados | 34 / 41 / 69 | Dados/A aprovados; B homologada | `03d8ced` | Não verificada |
| C1 / C1.1 | SLA e formalização temporal TA/TB | 87 / 97 | C1 aceita para continuidade; C1.1 regras aprovadas; sem registro separado de homologação visual final C1 | `03d8ced` | Não verificada |
| C2 | Riscos & Tendências | 117 | Homologação preliminar | `03d8ced` | Não verificada |
| C3 | Visão Geral / Performance | 139 | Homologada expressamente | `ef53ecf` | Não verificada |
| C4 | Contratos & Margem | 164 | Avaliada e aprovada para continuidade | `ebd0db9` | Não verificada |
| C5 | Custos / TCO | 194 | Avaliada e aprovada para continuidade | `485e6b4` | Não verificada |
| C6 | Equipamentos | 225 | Avaliada visualmente e aprovada para continuidade | `05ec7d5` | Não verificada |
| C7 | Técnicos | 255 no marco C7; 262 após correção e revalidação antes do commit | Homologada visualmente para continuidade após inicialização | `a5aea32` | Não verificada |
| Correção pós-C7 | Reinício do Vite antigo; teste de desenvolvimento | 262; revalidados antes do commit C7 | C7 homologada depois da recuperação; gatilho original indeterminado | Relatório/teste/evidências em `a5aea32` | Não se aplica à intervenção local |
| Rotina de continuidade | AGENTS e continuidade A–I | Revisão documental e incluída na revisão/versionamento C7 | Homologada pelo usuário | `a5aea32` | Não se aplica |
| C8 | Peças / análise de componentes | 292 novamente aprovados nesta sessão | Homologada visualmente para continuidade | `8134059` (implementação) | gh-pages `547db4d`, workflow success; rotas públicas verificadas |
| Feira | Não iniciada | Sem validação de implementação | Escopo ainda não autorizado | Não | Não |

Relatórios atuais: [C8](produto/entrega-c8-pecas.md), [C6](produto/entrega-c6-equipamentos.md), [C7](produto/entrega-c7-tecnicos.md), [inicialização pós-C7](produto/correcao-inicializacao-c7.md). Os anteriores estão no [índice](README.md). Publicação C8 comprovada pelo workflow success, HTML público idêntico ao artefato validado e navegação pública. main preservada.

## D. Arquitetura

- `package.json` declara React 19.3 / Vite 8.3, ES Modules, JSX e CSS Modules. `src/main.jsx` monta App; sem `?modo=plataforma`, carrega a apresentação original. Plataforma entra por lazy/Suspense, com login demo e rotas por hash. Não montar dois controladores de hash/teclado simultaneamente.
- `src/platform/` reúne shell, páginas, serviços e componentes compartilhados. `navigation.js` define 12 menus; nove páginas funcionais até C8. Padrões & Insights, Contratos — BackOffice e Integrações continuam pendentes.
- `src/data/orquestra/index.js` oferece acesso imutável aos dados locais; componentes não leem XLSX. Serviços de Chamados, SLA, riscos, performance, contratos, custos e equipamentos são reutilizados por Técnicos e Peças. `pecas.js` agrupa componentes/ocorrências; não existe estoque/compra/reserva/despacho.
- `ConsultationProvider` mantém consulta e carteiras em memória. São 13 filtros, AND entre campos/OR interno, busca normalizada com palavras AND, chips, limpeza e vazio. Ordenação antes da paginação; N próprio por indicador. Navegação preserva contexto; refresh restaura padrões. Técnico/Supervisor/Rota foram acrescentados à UI compartilhada na C7.
- Supervisor e dez cenas originais mantêm fixtures, animações, alertas, timers, detalhes, teclado, hashes `#/1`–`#/10` e remount. Smart Fit Normal→Média→Alta e hospital crítico por contexto humano preservados. Não uniformizar suas siglas/regras com as do histórico.
- Modos: plataforma histórica implementada; apresentação original/manual preservada e padrão. Modo próprio de apresentação do novo BackOffice e Feira temporal ainda não implementados. Feira significa evolução automática dos dados com pausa/retomada/reinício, não autoplay de cenas. Ponte contextual Supervisor/US19 também pendente.

Detalhes: [arquitetura inicial](tecnica/arquitetura-atual.md), [proposta](tecnica/arquitetura-proposta.md), [fronteiras Supervisor](tecnica/pontos-integracao-supervisor.md), [matriz de cenas](preservacao/matriz-cenas.md), [modos](produto/modos.md). Documentos iniciais podem anteceder as páginas implementadas; conferir relatórios recentes e código da tarefa.

## E. Dados e regras vigentes

| Tema | Decisão / limite |
| --- | --- |
| Histórico | HIST_60_DIAS: 736 chamados sintéticos / 46 campos, criação 08/08–06/10/2026; referência fixa 06/10/2026 às 22h São Paulo. Períodos civis inclusivos por criação, sem usar relógio atual como referência dos indicadores. |
| Snapshots | T0/T1/T2: 10/16/24 registros, 08/09/2026 às 08h/08h30/09h30. Separados entre si e do histórico. Ausência de ID não prova conclusão/exclusão; completude/merge/interpolação ainda sem contrato aprovado. |
| Supervisor | Fixtures JavaScript roteirizadas independentes; não substituir pelo histórico ou snapshots. |
| TA/TB | Minutos sintéticos: TA=chegada−abertura; TB=encerramento técnico simulado−chegada. Saída inclui permanência adicional. Encerramento técnico não persistido; não reconstruir como evento BASE. Média dos finitos não negativos; zero válido, nulos excluídos, N independente. Sem elegíveis, indisponível. Não conceitos oficiais OTIS. |
| SLA/ETA | Percentual_SLA é fração (1=100%). Aderência C1: Concluído, SLA_min>0 finito, consumo finito não negativo; cumpre<=1. Histórico: 665/724=91,9%; 59 excedidos. Sem elegíveis, indisponível. Não ajustar para RESUMO_60_DIAS (outra população), inferir SLA restante/pausas ou prever ETA após chegada/conclusão. ETA refere-se ao técnico. |
| Criticidade | Verde/Amarelo/Laranja/Vermelho BASE, independente de SLA. Histórico inclui concluídos; prioridade na referência=não Concluído e Laranja/Vermelho (1 entre 12 não concluídos). Laranja é janela de intervenção; não impor sequência de cores. |
| Recorrência | Materializada, sem soma como eventos únicos. Elevada C2/C6: unidade distinta com algum valor>=3 (19). Proporção C4: chamados com valor finito>0 / total, com cobertura explícita. C6 distingue volume, máximo registrado e último valor; cor/insight do último chamado não são estado atual da unidade. |
| Custos/contratos | Soma de custo finito não negativo, zero válido, N próprio; sem válidos, indisponível. Total R$ 696.734,60/N736. Custos associados ao técnico são dos chamados, não salário/remuneração/mão de obra real. Alto por contrato é pressão operacional C2, não margem negativa. Sem rateio financeiro artificial. |
| Técnicos C7 | 16 nomes nos 736 vinculados; 724 concluídos. Vínculos múltiplos de área/supervisor/rota preservados, sem cadastro permanente. Volume/TA/TB/recorrência não constituem avaliação individual nem atribuição causal ao trabalhador. Histórico de equipamento pode ampliar o contexto para outros técnicos, explicitamente identificado. |
| Componentes C8 | 10 componentes/11 subcomponentes, 736 ocorrências associadas, 19 unidades com recorrência elevada, 66 Vermelhos históricos. Componente associado não comprova peça consumida/substituição/causa. Custo é do chamado, não preço de material; catálogo/estoque/logística EXT. Histórico por equipamento restrito ao componente/filtros. |
| BASE/CALC/EXT | BASE=campo fornecido; CALC=agregação com fórmula/população/N/nulos/período/unidade/fonte; EXT=fonte indisponível, sem zero/valor fictício/conexão simulada. Indicadores têm explicação acessível por botão, não apenas hover. DEMO não substitui classificação. |
| Proteção temporal | `projectSnapshot` só libera estado a partir de sua referência; `eventAt` oculta marcos futuros. Avançar clock não confirma evento de fonte congelada. Duas saídas futuras T1/T2 foram preservadas; conclusão técnica e saída são marcos distintos. |

Fonte original: `datasets/ORQUESTRA_MVP_Base_60_Dias_Filtros_FINAL.xlsx`; SHA256 registrado `1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe`. JSONs gerados não são editados manualmente. [Dicionário e decisões completas](dados/dicionario.md), [camada de dados](dados/camada-dados.md), [fontes](dados/fontes.md), [explicabilidade](produto/explicabilidade-ext.md), [TA/TB e temporal](produto/entrega-c11-tempos.md).

## F. Testes e evidências

**Revalidação de versionamento, 15/10/2026:** 292 distintos aprovados =283 Node/browser +9 Python, build e importador --check aprovados. A primeira tentativa de iniciar Vite novo encontrou EMFILE de observadores do ambiente; repetição integral usando ORQUESTRA_DEV_URL na instância 5173 existente passou sem alterar código/testes/configuração. Produção em 1366×768: Visão Geral/Chamados/Técnicos/Peças diretos e refresh, apresentação/Supervisor e assets sob /OrquestraNEXT aprovados. Aviso de chunk>500kB mantido.

Invocações desta sessão, como referência para execução futura autorizada; preparar build antes da regressão de navegador:

```bash
npm run build -- --outDir /tmp/orquestra-publicacao-c8/dist
ORQUESTRA_DEV_URL=http://127.0.0.1:5173/OrquestraNEXT/ ORQUESTRA_TEST_DIST=/tmp/orquestra-publicacao-c8/dist ORQUESTRA_TEST_EVIDENCE=/tmp/orquestra-publicacao-c8/legacy ORQUESTRA_SHELL_EVIDENCE=/tmp/orquestra-publicacao-c8/shell ORQUESTRA_DEV_EVIDENCE=/tmp/orquestra-publicacao-c8/dev /home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.mjs
/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -B tests/importacao-dados.test.py
/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -B scripts/import_orquestra.py --check
```

Evidências atuais: [283 Node/browser](produto/evidencias/versionamento-c8-regression.txt), [9 Python](produto/evidencias/versionamento-c8-python.txt), [build](produto/evidencias/versionamento-c8-build.txt), [importador](produto/evidencias/versionamento-c8-import.txt), [rotas/produção](produto/evidencias/versionamento-c8-smoke.txt). [Relatório e destino Pages](produto/publicacao-controlada-c8.md); marcos de implementação anteriores permanecem no relatório C8.

**Validação após publicação:** workflow Pages completed/success; HTML público idêntico ao build C8. Em 1366×768, Visão Geral, Chamados, Técnicos e Peças passaram acesso direto/refresh sem overflow; todas as dez cenas, incluindo Supervisor, passaram acesso direto/refresh. Nenhum erro JavaScript ou HTTP de assets. A primeira tentativa durante propagação ainda recebeu a versão antiga; repetição após conclusão passou. Evidência adicional local em `/tmp/orquestra-publicacao-c8/public-smoke.txt` (temporária, não é backup).

Limites: notebook 1366×768/móvel 390×844 e regressões aprovados não são auditoria integral de acessibilidade/cross-browser. Build/preview não comprova estado de um Vite antigo; o teste dev cobre ESM e quatro rotas diretas/refresh. Testes não comprovam homologação do usuário ou publicação. Não presumir servidor ativo numa próxima sessão.

## G. Pendências e riscos relevantes

- C8 homologada, commit 8134059 enviado; publicação concluída em gh-pages 547db4d. Commit/push complementar destes dois documentos autorizado; confirmar HEAD documental e sincronização pelo Git na retomada.
- Tela branca: o Vite antigo servia `chamados.js` vazio embora DEFAULT_STATE estivesse exportado em disco/HEAD. Reinício restaurou as quatro rotas e refresh, sem alterar produto. **Mecanismo observado, mas gatilho original indeterminado; causa-raiz completa não estabelecida.** Nova regressão cobre desenvolvimento/ESM. Se reaparecer, comparar resposta servida/arquivo/processo antes de inventar exportações ou limpar caches. [Relatório](produto/correcao-inicializacao-c7.md).
- Três páginas pendentes; Feira não iniciada. Antes de Feira, definir fontes, completude/merge, clock/velocidade/loop, pausa/retorno, filtros e fronteira Supervisor; não antecipar futuro nem inferir evolução contínua.
- Regras oficiais OTIS, SLA restante/pausas/metas e regras geradoras de cor/recorrência não fornecidas. Não reabrir conceitos sintéticos já aprovados sem necessidade.
- Receita/margem/TCO completo/composição contábil, estoque/consumo/logística, cadastro mestre/vigência/parque instalado, uptime, pessoal/skills/escala/localização/capacidade reais são dependências externas. Componente associado não é peça consumida.
- Demo sem autenticação corporativa; filtros em memória; offline apenas após carga, sem service worker. Bundle grande continua com aviso; otimização depende de escopo próprio. Versão pública C8 confirmada em gh-pages 547db4d, com apresentação original como entrada padrão e plataforma via ?modo=plataforma.

## H. Próxima ação

**Próxima ação:** aguardar orientação e autorização do escopo Modo Feira/US14. C8 homologada, versionada, enviada e publicada. Não iniciar novas funcionalidades automaticamente.

Prompt padrão para uma nova conversa:

> Retome o ORQUESTRA em `/home/p2dutra/Documents/ChatGPT/Projeto_Challenge_OTIS/OrquestraNEXT`. Leia AGENTS.md e docs/CONTINUIDADE_CODEX.md; confira feature/next-evolucao, HEAD documental e sincronização com origin, preservando alterações locais. C8 homologada em 8134059 e publicada em gh-pages 547db4d; 292 testes, build, importador e validação pública aprovados. Supervisor, dez cenas e datasets preservados. Próxima prioridade: Modo Feira com evolução temporal dos dados, pausa, retomada e reinício; aguarde minha autorização de escopo antes de implementar. Não presuma servidor ativo nem descarte alterações.

## I. Ambiente e comandos de referência

Não presumir servidor ativo entre sessões. Antes de iniciar, confirmar raiz/porta/processo; não encerrar instância do usuário silenciosamente. A instância 5173 foi verificada com os sete testes dev nesta sessão, mas sua permanência não é garantida.

```bash
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

URL de referência: `http://127.0.0.1:5173/OrquestraNEXT/?modo=plataforma#/visao-geral`. Rotas verificadas na correção anterior: `#/visao-geral`, `#/chamados`, `#/tecnicos`, `#/pecas`; Peças agora é funcional C8. Sem query de plataforma, apresentação original `#/1`–`#/10`.

- Runtime Node/Playwright existente: `/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/`; Node em `bin/node`, Playwright em `node_modules/playwright`. Chrome `/usr/bin/google-chrome`. O Node24 padrão do shell agrupa testes aninhados por arquivo; usar o runtime documentado para a contagem distinta.
- Python existente: `/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3`, com openpyxl; não instalar dependências silenciosamente. Importador de leitura, quando autorizado: esse executável com `-B scripts/import_orquestra.py --check`; conversão que grava dados exige autorização específica.
- Build/testes: comandos e resultados na seção F; detalhes em [tests/README.md](../tests/README.md). `/tmp` não é backup permanente; preservar evidências em docs.
- Suítes usam portas próprias 5187–5205, 5209 (dev) e 5211 (C8); não executar duas instâncias da mesma suíte/porta. Teste dev usa cacheDir temporário separado e pode receber `ORQUESTRA_DEV_URL` para testar servidor existente. Portas/Chrome podem exigir permissão do ambiente; EPERM de sandbox não prova falha funcional.
- Vite/GitHub Pages usa base `/OrquestraNEXT`. Validar assets/rotas/refresh sob esse subdiretório em mudança pertinente. `npm run deploy` também executa predeploy/build e requer autorização explícita de publicação. Não inferir SHA/estado remoto pelo Git local.

### Publicação concluída — autorização explícita recebida

Destino https://sinfoniatech.github.io/OrquestraNEXT/, branch gh-pages na raiz, commit 547db4d. Substituiu 429d377 com histórico preservado e sem alteração de configuração. Artefato publicado diretamente do build C8 validado, sem novo build ou mudanças de produto. Apresentação original permanece padrão; BackOffice em https://sinfoniatech.github.io/OrquestraNEXT/?modo=plataforma#/visao-geral. Workflow e validação pública aprovados. Feature é enviada separadamente; main não foi alterada. A autorização desta publicação não autoriza novos deploys ou desenvolvimento Feira.
