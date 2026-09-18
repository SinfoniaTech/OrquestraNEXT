import styles from '../SupervisorView.module.css';
import { PRIORIDADES } from '../data/chamados.js';
import { AlertTriangleIcon, ShieldAlertIcon } from './icons.jsx';

const ICONES = {
  'shield-alert': ShieldAlertIcon,
  'triangle-alert': AlertTriangleIcon,
};

/**
 * Pill de criticidade do chamado (CRÍTICA / ALTA / MÉDIA / NORMAL).
 * A cor é resolvida pela classe da prioridade (badge.critica etc.).
 */
export default function PriorityBadge({ prioridade }) {
  const config = PRIORIDADES[prioridade];
  const Icone = ICONES[config.icone];

  return (
    <span className={`${styles.badge} ${styles[prioridade]}`}>
      <Icone size={12} />
      {config.label}
    </span>
  );
}
