# Camada de dados — US03 e US04

Implementada sob autorização; sem integração nas telas. 15/10/2026. Histórico, snapshots e fixtures das cenas continuam separados.

## Arquivos e contrato

- scripts/import_orquestra.py: conversor controlado, usa openpyxl existente no runtime e zoneinfo; nenhuma dependência instalada.
- src/data/orquestra/schema.json: contrato explícito dos 46 cabeçalhos.
- src/data/orquestra/generated/: quatro JSONs, um por aba obrigatória.
- src/data/orquestra/time.js: datas civis e instantes explícitos São Paulo.
- src/data/orquestra/index.js: acesso imutável, consultas e proveniência.
- tests/importacao-dados.test.py, camada-dados.test.mjs, camada-dados-vite.test.mjs e data-offline-entry.mjs: validação.

Cada JSON contém metadata + records. Cada registro preserva as 46 chaves originais, incluindo ID_Chamado. Metadados: aba, natureza histórico/snapshot, hash/nome XLSX, referência, fuso, DEMO sintético, versão do schema, contagens de status/criticidade/nulos e transformações textuais. Não há concatenação de snapshots.

## Conversão

Valida quatro abas, exatamente 46 cabeçalhos, quantidades 736/10/16/24, ID obrigatório e único em cada fonte, tipos, enums de status/criticidade/impacto/Sim-Não e referência própria. Erro identifica aba/linha/campo; todas fontes são validadas antes de gravar. Falha de I/O não é transação multi-arquivo; regenerar/check após falha.

Texto: trim e NFC; ID que mudaria é rejeitado. Não remove acentos nem muda nomes de categorias arbitrariamente. Números finitos continuam numéricos; inteiros são validados. Nulos permanecem null, nunca zero. Fórmulas Excel não materializadas são rejeitadas. Nenhum recálculo de negócio.

Datas Excel naive são interpretadas pelo contrato America/Sao_Paulo. ISO inclui offset -03:00 nas datas de 2026; nenhuma adição automática de Z. Valores numéricos TA/TB/SLA/ETA/criticidade prontos são preservados. Percentual_SLA fica fração; UI futura poderá apresentar ×100.

Histórico: referência 2026-10-06T22:00:00-03:00; Criado em entre 08/08 e 06/10 inclusive e não posterior à referência. Snapshots: 08/09, 08h/08h30/09h30. Não implementar merge/substituição/interpolação temporal: contrato de snapshot ainda pendente.

## Uso no React/Vite

Importar funções de src/data/orquestra/index.js, fora dos componentes de apresentação. JSONs são imports locais ESM, sem fetch/API/CDN/caminho absoluto de asset. Vite empacota sob /OrquestraNEXT. Não muda package.json/configuração e não é descoberto como cena.

Exemplo de API (não conectado a telas):
```js
import {getDataset, getById, query, distribution, describeField}
 from './data/orquestra/index.js';
const history = getDataset('HIST_60_DIAS');
const t0 = getDataset('T0_Abertura');
const records = query({
 source: 'HIST_60_DIAS', from: '2026-08-08', to: '2026-10-06',
 filters: {Área: ['SP-Sul'], Criticidade_ORQUESTRA: ['Laranja','Vermelho']}
});
const statuses = distribution({field: 'Status', source: 'T0_Abertura'});
const field = describeField('TA'); // BASE, materializado, sem recálculo
```

query: AND entre campos, OR em listas, lista vazia não restringe, período sobre Criado em. Não busca em fontes combinadas. Retorna novo array com linhas imutáveis. getById exige fonte e preserva identidade; ausente retorna null. countBy agrupa recorte recebido; distribution retorna CALC, regra simples de contagem, população/nulos/filtros/período e fonte. METRIC_CLASSES prepara BASE/CALC/EXT; não simula integração.

Datas civis são 2026-MM-DD; início 00h e fim 23:59:59.999 locais inclusivos. Helpers estão deliberadamente restritos a 2026/offset -03:00 do demonstrador aprovado; datas de outros anos exigem extensão de contrato e testes de fuso. Não utilizar como biblioteca geral de fusos.

## Offline e reprodutibilidade

A camada funciona offline depois de empacotada; isso não instala service worker nem torna o site inteiro disponível no primeiro acesso sem rede. Python/openpyxl só são necessários para reconversão, não no navegador.

Runtime já disponível nesta máquina:
```sh
/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -B scripts/import_orquestra.py
/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -B scripts/import_orquestra.py --check
node --test tests/camada-dados.test.mjs
/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -B tests/importacao-dados.test.py
node --test tests/camada-dados-vite.test.mjs
```

Python do sistema não tem openpyxl; não instalar silenciosamente. Usar runtime acima ou ambiente com pacote previamente aprovado. --check compara com XLSX sem gravar; saída determinística, sem timestamp real. Fonte de outra versão/contagens exige revisão do contrato, não relaxar validação para passar.
