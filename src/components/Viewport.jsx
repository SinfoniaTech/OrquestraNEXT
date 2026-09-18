import styles from './Viewport.module.css';

/**
 * Área principal da apresentação.
 *
 * Responsabilidades:
 * - renderizar TODAS as visualizações do registro, mantendo-as montadas;
 * - exibir apenas a aba ativa (as demais ficam ocultas via CSS).
 *
 * Por que manter todas montadas?
 * Trocar de aba NÃO desmonta a visualização anterior: estado interno,
 * posição de scroll, filtros e formulários são preservados. Ocultar via
 * `display: none` é a forma mais simples e robusta de conseguir isso —
 * os componentes continuam vivos no React e o navegador preserva a
 * posição de rolagem de cada painel.
 */
export default function Viewport({ registry, activeViewId }) {
  return (
    <div className={styles.viewport}>
      {registry.map((view) => {
        const View = view.component;
        const isActive = view.id === activeViewId;

        return (
          <section
            key={view.id}
            id={`view-pane-${view.id}`}
            role="tabpanel"
            aria-labelledby={`view-tab-${view.id}`}
            aria-hidden={!isActive}
            className={isActive ? styles.pane : styles.paneHidden}
          >
            <View />
          </section>
        );
      })}
    </div>
  );
}
