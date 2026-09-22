import { slaTone } from '../data/chamadosData.js';
import styles from '../chamados.module.css';

/**
 * Card "Alertas de SLA" — chamados com consumo >= 70% (laranja/vermelho),
 * ordenados do mais consumido para o menos. O ponto colorido pulsa enquanto
 * estiver laranja/vermelho. Cada item é clicável e abre o painel de detalhes.
 */
export default function AlertasSla({ alerts, onSelect }) {
  return (
    <ul className={styles.alertList}>
      {alerts.map((c) => {
        const tone = slaTone(c.slaPct);
        const pulsing = tone === 'orange' || tone === 'critical';
        return (
          <li key={c.id}>
            <button type="button" className={styles.alertItem} onClick={() => onSelect(c.id)}>
              <span className={`${styles.alertDot} ${styles[`alertDot-${tone}`]} ${pulsing ? styles.slaPulse : ''}`} />
              <span className={styles.alertCodigo}>{c.codigo}</span>
              <span className={styles.alertLocal}>{c.localEquipamento}</span>
              <span className={`${styles.alertPct} ${styles[`alertPct-${tone}`]}`}>{c.slaPct}%</span>
            </button>
          </li>
        );
      })}
      {alerts.length === 0 ? <li className={styles.alertEmpty}>Nenhum chamado em risco de SLA</li> : null}
    </ul>
  );
}
