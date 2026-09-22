import styles from '../BackofficeView.module.css';

/**
 * Badge pill — variantes semânticas da referência:
 * fundo bg-{cor}/10, texto text-{cor}, raio total, texto 11px.
 */
export default function Badge({ text, tone = 'muted' }) {
  return <span className={`${styles.badge} ${styles[`badge-${tone}`]}`}>{text}</span>;
}
