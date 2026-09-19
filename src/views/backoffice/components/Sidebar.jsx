import logo from '../../../assets/orquestra-logo13.png';
import { MENU_SECTIONS } from '../data/backofficeData.js';
import Icon from './icons.jsx';
import styles from '../BackofficeView.module.css';

/**
 * Sidebar da referência — 256px (w-64), fundo roxo escuro (--bk-sidebar),
 * sticky em tela cheia. Contém:
 * - header com o logo oficial do projeto (src/assets/orquestra-logo13.png):
 *   wordmark branco "Orquestra" direto sobre o fundo roxo escuro, sem frame
 *   e sem blocos de texto adicionais;
 * - seções de menu (Gestão, Backoffice, Sistema) com itens iconados;
 * - item ativo em pill --bk-sidebar-primary; hover em --bk-sidebar-accent.
 */
export default function Sidebar({ telaAtiva, onSelect }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBrand}>
        <img src={logo} alt="Orquestra" className={styles.sidebarLogo} />
      </div>

      <nav className={styles.sidebarNav} aria-label="Navegação do backoffice">
        {MENU_SECTIONS.map((section) => (
          <div key={section.id}>
            {section.label ? <p className={styles.sidebarSectionLabel}>{section.label}</p> : null}
            <ul className={styles.sidebarList}>
              {section.items.map((item) => {
                const isActive = item.id === telaAtiva;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`${styles.sidebarItem} ${isActive ? styles.sidebarItemActive : ''}`}
                      onClick={() => onSelect(item)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon name={item.icon} size={16} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
