import styles from './ViewTab.module.css';

/**
 * Uma aba individual da barra.
 *
 * Componente puramente apresentacional: recebe tudo via props e não conhece
 * o container. Estados visuais: normal (styles.tab), hover (:hover) e
 * ativa (styles.tabActive).
 *
 * Semântica de acessibilidade: <button> com role="tab", aria-selected e
 * aria-controls apontando para o painel correspondente no Viewport. O
 * tabindex (roving tabindex) é controlado pela TabBar via prop isActive.
 */
function ViewTab({ ref, id, panelId, label, isActive, onSelect }) {
  return (
    <button
      ref={ref}
      type="button"
      id={id}
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      className={isActive ? styles.tabActive : styles.tab}
      onClick={onSelect}
    >
      {label}
    </button>
  );
}

export default ViewTab;
