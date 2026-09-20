/**
 * ============================================================================
 *  ORDEM DAS CENAS DA APRESENTAÇÃO — EDITAR APENAS ESTE ARQUIVO
 * ============================================================================
 *
 *  Formato: array de entradas { scene, position }, na ordem em que aparecem.
 *
 *    - scene:    nome da pasta da cena dentro de src/views/ (a pasta precisa
 *                expor o componente como export default no index.jsx,
 *                ex.: src/views/abertura-chamado/index.jsx);
 *    - position: número da posição de apresentação.
 *
 *  Regras:
 *  1. As cenas são apresentadas em ordem CRESCENTE de position.
 *  2. Duas cenas com o MESMO position dividem a tela: a que aparece primeiro
 *     neste array fica na metade ESQUERDA, a segunda na metade DIREITA.
 *  3. Cada posição aceita no máximo 2 cenas. Se houver mais, as duas
 *     primeiras do array vencem e o controlador emite console.warn.
 *  4. As posições NÃO precisam ser contíguas: 1, 2, 5, 10 é válido. A
 *     apresentação percorre a lista ordenada das posições existentes.
 *  5. scene que não corresponder a nenhuma pasta em src/views/ gera
 *     console.error e a entrada é ignorada (nada quebra).
 *  6. Configuração vazia ou sem cenas válidas exibe uma mensagem na tela.
 *
 *  A posição atual é refletida na URL como hash (#/1, #/2, ...), onde o
 *  número é a ordem da posição na lista ordenada (não o valor bruto de
 *  position) — assim F5 mantém a cena atual e é possível abrir direto em
 *  uma cena durante os ensaios.
 * ============================================================================
 */
export const scenesConfig = [
  { scene: 'exemplo-a', position: 1 },
  { scene: 'exemplo-b', position: 2 },
  { scene: 'exemplo-c', position: 3 },
  { scene: 'exemplo-b', position: 4 },
  { scene: 'exemplo-c', position: 4 }, // mesma position => tela dividida com exemplo-b
  { scene: 'backoffice', position: 5 },
  { scene: 'supervisor', position: 6 },
  { scene: 'backoffice', position: 7 },
  { scene: 'supervisor', position: 7 },
];
