import styles from '../BackofficeView.module.css';

/** Mapas tom -> classe; tons sem variante caem no estilo padrão (muted). */
const VALUE_TONES = {
  critical: styles['kpiValue-critical'],
  warning: styles['kpiValue-warning'],
  success: styles['kpiValue-success'],
  orange: styles['kpiValue-orange'],
};

const SUB_TONES = {
  critical: styles['kpiSub-critical'],
  warning: styles['kpiSub-warning'],
  success: styles['kpiSub-success'],
  orange: styles['kpiSub-orange'],
};

/**
 * Card de KPI — label (xs muted), valor 24px semibold tabular-nums e
 * subtexto contextual com cor por tom (success/warning/critical/orange/muted).
 */
export default function KpiCard({ label, value, sub, subTone = 'muted' }) {
  return (
    <div className={styles.kpiCard}>
      <p className={styles.kpiLabel}>{label}</p>
      <p className={`${styles.kpiValue} ${VALUE_TONES[subTone] ?? ''}`}>{value}</p>
      <p className={`${styles.kpiSub} ${SUB_TONES[subTone] ?? ''}`}>{sub}</p>
    </div>
  );
}
