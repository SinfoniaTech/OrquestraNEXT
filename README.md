# OrquestraNEXT — Controlador de Cenas

Apresentação ao vivo feita de **cenas**: cada cena é uma página React
independente dentro de `src/views/`, e um controlador avança/retrocede entre
elas na ordem definida em um único arquivo, `src/scenes.config.js`.

Stack: **React + Vite + JavaScript + CSS Modules** — nenhuma dependência além
de `react` e `react-dom`.

## Como executar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de produção (gera /dist)
npm run preview  # serve o build de produção
```

## Arquitetura

```
App
└── SceneController                      (posição atual · teclado · URL · palco)
    ├── src/scenes.config.js             (ORDEM da apresentação — editar AQUI)
    ├── src/scenes/sceneIndex.js         (descoberta automática das cenas)
    └── src/views/<cena>/index.jsx       (cada cena, carregada com React.lazy)
```

| Peça | Responsabilidade |
|---|---|
| `src/components/SceneController.jsx` | Dono da posição atual. Monta a linha do tempo a partir da configuração, lida com o teclado, sincroniza o hash da URL, renderiza as cenas (lazy + Suspense) remontadas do zero a cada posição e exibe controles discretos ocultáveis com `H`. |
| `src/scenes.config.js` | Array `{ scene, position }` com a ordem. **Fonte única de verdade** — reordenar a apresentação é editar só este arquivo. O comentário no topo explica todas as regras. |
| `src/scenes/sceneIndex.js` | `import.meta.glob('../views/*/index.jsx')`: toda pasta em `src/views/` com `index.jsx` vira uma cena disponível automaticamente. |
| `src/views/<cena>/` | A cena em si (componentes, dados e estilos próprios). O `index.jsx` deve ter `export default` de um componente React; ele recebe as props `isActive` e `side`. |

## Como adicionar uma nova cena

1. Crie a pasta da cena: `src/views/minha-cena/index.jsx`;
2. O `index.jsx` exporta um componente React por `export default` (ele recebe
   `isActive` — true quando visível — e `side` — `"full" | "left" | "right"`);
3. Registre a ordem em `src/scenes.config.js`:

   ```js
   export const scenesConfig = [
     // ...
     { scene: 'minha-cena', position: 3 },
   ];
   ```

Nenhuma outra alteração é necessária. A raiz da cena deve ocupar 100% da área
(`height: 100%`): o painel do palco isola e recorta o conteúdo da cena
(`overflow: hidden`).

## Ordem, posições e tela dividida

- Apresentação em **ordem crescente** de `position`; posições não precisam ser
  contíguas (1, 2, 5, 10 é válido).
- **Duas cenas com o mesmo `position`** dividem a tela em duas metades iguais,
  separadas por um divisor sutil de 1px (a primeira do array fica à esquerda).
  Exemplo: `exemplo-b` e `exemplo-c` compartilham a position 2.
- Mais de 2 cenas na mesma posição: as duas primeiras vencem e o controlador
  emite `console.warn`.
- Nome de cena inexistente: `console.error` e a entrada é ignorada — nada
  quebra.
- Configuração vazia ou sem cenas válidas: mensagem legível na tela.

## Navegação

| Tecla | Ação |
|---|---|
| `→` · `Espaço` · `PageDown` | próxima posição |
| `←` · `PageUp` | posição anterior |
| `Home` / `End` | primeira / última posição |
| `H` | oculta/exibe os controles (útil na projeção) |

Sem loop: não avança além do fim nem retrocede antes do início. Os atalhos
são ignorados quando o foco está em campos editáveis. Os botões ◀/▶ e o
indicador `3 / 8` ficam discretos no canto inferior direito.

## URL e ensaios

A posição atual vira hash: `#/3` é a 3ª posição da lista ordenada (não o valor
bruto de `position`). Abrir direto em `#/3` ou apertar F5 mantém a cena atual.

## Remontagem a cada entrada

Trocar de posição **remonta** as cenas (o palco usa a posição como `key`):
animações CSS de entrada e estados internos reiniciam a cada visita — o
comportamento desejado para uma apresentação ao vivo. Em troca, o estado
interno de uma cena **não** sobrevive à navegação entre posições.

## As aplicações `backoffice` e `supervisor`

As pastas `src/views/backoffice/` e `src/views/supervisor/` são aplicações
completas e **não são cenas**: o controlador só descobre pastas com
`index.jsx`, então elas ficam intactas e fora da apresentação. Para promover
uma delas a cena:

1. Crie `src/views/backoffice/index.jsx` contendo apenas:

   ```js
   export { default } from './BackofficeView.jsx';
   ```

2. Adicione a entrada correspondente em `src/scenes.config.js`.

## Isolamento de estilos

- `src/styles/global.css` — mínimo absoluto; nenhuma tag genérica é estilizada
  globalmente.
- `src/styles/theme.css` — apenas variáveis CSS (`--onx-*`); o controlador usa
  `--onx-accent` no anel de foco dos botões.
- Todos os componentes do controlador usam **CSS Modules**.
- Transição entre posições: fade de 250ms (apenas `opacity`), desativado com
  `prefers-reduced-motion: reduce`.
