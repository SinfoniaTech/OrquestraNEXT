# OrquestraNEXT — Apresentador de Visualizações

Aplicação React que funciona como **container/apresentador de visualizações**
para apresentações acadêmicas: uma área principal grande exibe a visualização
da aba ativa e uma **barra de abas fixa** (estilo abas de planilha/documento)
na parte inferior permite navegar entre as visualizações **sem recarregar a
página**.

Stack: **React + Vite + JavaScript + CSS Modules** — nenhuma dependência além
de `react` e `react-dom`.

## Como executar

```bash
npm install
npm run dev      # ambiente de desenvolvimento (http://localhost:5173)
npm run build    # build de produção (gera /dist)
npm run preview  # serve o build de produção localmente
```

## Arquitetura

```
App
└── PresentationContainer          (dono do estado: aba ativa; layout geral)
    ├── Viewport                  (área principal: renderiza as views)
    │   └── <Visualização ativa>  (painel role="tabpanel" por view)
    └── TabBar                    (barra inferior: role="tablist", rolagem horizontal)
        └── ViewTab               (aba individual: normal / hover / ativa)

src/views/registry.js             (registro das visualizações — fonte única de verdade)
```

| Peça | Responsabilidade |
|---|---|
| `PresentationContainer` | Único dono do estado `activeViewId`; layout flex column (viewport flexível + barra fixa); passa registry e callbacks para baixo. |
| `Viewport` | Renderiza **todas** as views do registro, mantendo-as montadas; exibe apenas a ativa (as demais ficam `display: none`). |
| `TabBar` | Lista as abas na ordem do registro; navegação por teclado (WAI-ARIA Tabs); rolagem horizontal quando excedem a largura. |
| `ViewTab` | Aba puramente apresentacional: `label`, estados visual e semântica `role="tab"`. |
| `registry.js` | Array ordenado de `{ id, label, component }` — a ordem do array é a ordem das abas. |

## Como adicionar uma nova visualização

1. Crie o componente da página — ex.: `src/views/Comex.jsx` (pode ser uma
   página completa, com componentes, estilos e estados próprios);
2. Registre-o em `src/views/registry.js`:

   ```js
   import { Comex } from './Comex.jsx';

   export const viewRegistry = [
     // ...
     { id: 'comex', label: 'Comex', component: Comex },
   ];
   ```

3. Pronto — a nova aba surge automaticamente na barra inferior, na posição
   em que foi declarada. **Nenhum componente do container precisa ser
   alterado.**

## Navegação

- **Mouse:** clique na aba desejada — a troca é instantânea, sem reload.
- **Teclado** (com o foco em uma aba da barra):
  - `←` / `→`: aba anterior / próxima (com volta ao início/fim);
  - `Home` / `End`: primeira / última aba;
  - `Tab`: entra na visualização ativa e volta à aba ativa (roving tabindex).

  As setas **só** têm efeito quando o foco está na barra de abas —
  interações de teclado das páginas internas nunca são interceptadas.

## Preservação de estado

Todas as visualizações permanecem **montadas**; as inativas são apenas
ocultadas via CSS (`display: none`). Por isso, ao trocar de aba e voltar:

- estado interno dos componentes (React) é mantido;
- posição de rolagem de cada visualização é mantida (cada view rola dentro
  do próprio painel);
- filtros, formulários e demais interações sobrevivem à navegação.

Os mocks atuais incluem um contador, um campo de texto e conteúdo longo
exatamente para facilitar a verificação desse comportamento.

## Isolamento de estilos (importante para as futuras páginas)

O container foi construído para **não interferir** nas páginas internas:

- `src/styles/global.css` — mínimo absoluto: apenas o necessário para o app
  ocupar a janela inteira (`height` em `html/body/#root` e `margin: 0` no
  `body`). Nenhuma tag genérica é estilizada globalmente.
- `src/styles/theme.css` — **apenas variáveis CSS** (`--onx-*`), sem regras
  de estilo; servem de paleta da barra de abas.
- Todos os componentes do container usam **CSS Modules** (`*.module.css`),
  com classes com escopo local.
- Fonte e cor base do container são definidas no próprio container (não no
  CSS global); páginas internas podem sobrescrevê-las normalmente.

**Recomendações para as páginas internas** (futuras):

- use CSS Modules, ou CSS comum com um seletor raiz único por página;
- cada view recebe um painel com `height: 100%` e rolagem própria:
  - página longa → o painel já rola naturalmente;
  - layout fixo (ex.: dashboard sem scroll) → defina `height: 100%` e
    `overflow` no elemento raiz da sua página e gerencie a rolagem interna;
- prefira cores/estilos próprios; evite depender das variáveis `--onx-*`.

## Abas sem conteúdo

`Visão Geral` e `Dashboard` — abas mantidas na barra inferior, mas renderizando
apenas um container vazio (`src/views/mocks/VisaoGeral.jsx` e
`src/views/mocks/Dashboard.jsx`). **Serão substituídas** pelas aplicações reais
(basta trocar o `component` de cada entrada no registry e apagar a pasta
`mocks/` quando não for mais usada).

## Pontos de expansão futuros (ainda não implementados)

- deep-linking via hash (`#dashboard`) para abrir direto em uma aba;
- atalhos globais de apresentação (ex.: alternar abas de qualquer lugar);
- renomear/reordenar abas em runtime;
- suporte otimizado a telas pequenas (media queries).
