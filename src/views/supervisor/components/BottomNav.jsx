import styles from '../SupervisorView.module.css';
import {
  AlertTriangleIcon,
  EllipsisIcon,
  MapIcon,
  RadioIcon,
} from './icons.jsx';

const ITENS = [
  { id: 'chamados', label: 'Chamados', Icone: RadioIcon, badge: 0 },
  { id: 'mapa', label: 'Mapa', Icone: MapIcon, badge: 0 },
  { id: 'alertas', label: 'Alertas', Icone: AlertTriangleIcon, badge: 1 },
  { id: 'mais', label: 'Mais', Icone: EllipsisIcon, badge: 0 },
];

/**
 * Barra de navegação inferior do app, contida no shell mobile.
 *
 * Cada item leva a uma rota da referência: chamados, /mapa, /alertas e
 * /mais. As quatro telas vivem em src/views/supervisor/screens/ e a troca
 * é controlada pelo SupervisorView via activeItem/onSelectItem.
 */
export default function BottomNav({ activeItem, onSelectItem }) {
  return (
    <nav className={styles.bottomNav} aria-label="Navegação do aplicativo">
      {ITENS.map(({ id, label, Icone, badge }) => {
        const isActive = id === activeItem;

        return (
          <button
            key={id}
            type="button"
            className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onSelectItem(id)}
          >
            <Icone size={20} />
            {label}
            {badge > 0 ? (
              <span className={styles.navBadge}>{badge}</span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
