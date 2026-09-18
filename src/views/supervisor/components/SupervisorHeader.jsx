import styles from '../SupervisorView.module.css';
import logoOrquestra from '../../../assets/orquestra-logo13.png';
import { BellIcon, MenuIcon } from './icons.jsx';

/**
 * Cabeçalho sticky do app (fundo navy):
 * menu hambúrguer (decorativo), logotipo da Orquestra (imagem de
 * src/assets/orquestra-logo13.png) e sino de notificações com badge de
 * pendências.
 *
 * O sino reabre o alerta de SLA (comportamento mock da notificação).
 */
export default function SupervisorHeader({
  notificacoes,
  onOpenNotifications,
}) {
  const label =
    notificacoes > 0
      ? `Notificações (${notificacoes})`
      : 'Notificações (nenhuma pendente)';

  return (
    <header className={styles.header}>
      <button type="button" aria-label="Menu" className={styles.iconButton}>
        <MenuIcon size={24} />
      </button>
      <img src={logoOrquestra} alt="ORQUESTRA" className={styles.brandLogo} />
      <button
        type="button"
        aria-label={label}
        className={styles.iconButton}
        onClick={onOpenNotifications}
      >
        <BellIcon size={24} />
        {notificacoes > 0 ? (
          <span className={styles.badgeCount}>{notificacoes}</span>
        ) : null}
      </button>
    </header>
  );
}
