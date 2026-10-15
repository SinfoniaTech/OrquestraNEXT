# Proteção mínima sem dependências novas

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
