import { useRef } from 'react';
import ViewTab from './ViewTab.jsx';
import styles from './TabBar.module.css';

/**
 * Barra inferior de abas (aparência de abas de documento/planilha).
 *
 * Responsabilidades:
 * - listar uma aba por visualização do registro, na ordem declarada;
 * - comportar-se como um "tablist" acessível (padrão WAI-ARIA Authoring
 *   Practices — Tabs):
 *     · `←` e `→` navegam entre as abas, com volta ao início/fim (wrap);
 *     · `Home` seleciona a primeira aba e `End` seleciona a última;
 *     · roving tabindex: apenas a aba ativa entra na ordem de tabulação
 *       (tabindex 0), as demais recebem tabindex -1;
 *     · ativação automática: navegar até uma aba já a seleciona.
 *
 * As setas só têm efeito quando o foco está dentro da barra — as
 * interações de teclado das visualizações internas nunca são interceptadas.
 */
export default function TabBar({ registry, activeViewId, onSelectView }) {
  const tabRefs = useRef({});

  const handleKeyDown = (event) => {
    if (registry.length === 0) return;

    const ids = registry.map((view) => view.id);
    // Se o id ativo não estiver no registro, trata como a primeira aba.
    const currentIndex = Math.max(ids.indexOf(activeViewId), 0);

    let nextIndex;
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % ids.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + ids.length) % ids.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = ids.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();

    const nextViewId = ids[nextIndex];
    onSelectView(nextViewId);
    tabRefs.current[nextViewId]?.focus();
  };

  return (
    <div
      className={styles.tabBar}
      role="tablist"
      aria-label="Visualizações da apresentação"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
    >
      {registry.map((view) => (
        <ViewTab
          key={view.id}
          ref={(node) => {
            if (node) {
              tabRefs.current[view.id] = node;
            } else {
              delete tabRefs.current[view.id];
            }
          }}
          id={`view-tab-${view.id}`}
          panelId={`view-pane-${view.id}`}
          label={view.label}
          isActive={view.id === activeViewId}
          onSelect={() => onSelectView(view.id)}
        />
      ))}
    </div>
  );
}
