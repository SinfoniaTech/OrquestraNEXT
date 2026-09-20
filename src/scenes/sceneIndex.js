import { lazy } from 'react';

/**
 * Descoberta automática de cenas.
 *
 * Uma cena é qualquer pasta dentro de src/views/ que exponha um componente
 * React como export default no arquivo index.jsx. O import.meta.glob do
 * Vite varre a pasta views no momento do build — criar uma nova pasta com
 * index.jsx já a torna disponível ao controlador, sem editar nada aqui.
 *
 * O glob é lazy por padrão: cada cena vira um chunk separado, carregado
 * só quando a cena é exibida (o bundle inicial fica leve).
 *
 * Obs.: o caminho precisa ser um literal — import.meta.glob não aceita
 * variáveis. O controlador (SceneController) valida os nomes do
 * scenes.config.js contra este índice.
 */
const sceneModules = import.meta.glob('../views/*/index.jsx');

/** Extrai o nome da cena do caminho: "…/views/exemplo-a/index.jsx" → "exemplo-a". */
function sceneNameFromPath(path) {
  const match = path.match(/\/views\/([^/]+)\/index\.jsx$/);
  return match ? match[1] : null;
}

// Mapa: nome da pasta da cena → componente lazy.
const sceneComponents = new Map();
for (const [path, loader] of Object.entries(sceneModules)) {
  const name = sceneNameFromPath(path);
  if (name) {
    sceneComponents.set(name, lazy(loader));
  }
}

/** true se existir uma cena com esse nome de pasta. */
export function hasScene(name) {
  return sceneComponents.has(name);
}

/** Componente lazy da cena (ou undefined, se não existir). */
export function getSceneComponent(name) {
  return sceneComponents.get(name);
}
