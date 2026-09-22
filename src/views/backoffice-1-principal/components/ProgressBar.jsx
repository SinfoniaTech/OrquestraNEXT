import styles from '../BackofficeView.module.css';

/**
 * Barra de progresso — trilha h-1.5 (6px) arredondada em bg-muted,
 * preenchimento colorido conforme o tom (primary/warning/critical/success).
 */
export default function ProgressBar({ value, tone = 'primary' }) {
  const width = `${Math.min(100, Math.max(0, value))}%`;
  return (
    <div className={styles.progressTrack} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={`${styles.progressFill} ${styles[`progress-${tone}`]}`} style={{ width }} />
    </div>
  );
}
