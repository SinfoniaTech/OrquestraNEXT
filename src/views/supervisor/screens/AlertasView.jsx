import styles from '../SupervisorView.module.css';
import {
  CHAMADOS,
  CHAMADOS_EM_RISCO,
  LEGENDA_STATUS,
} from '../data/chamados.js';
import ChamadoCard from '../components/ChamadoCard.jsx';

/**
 * Tela "Alertas" (/alertas): chamados em risco de estouro de SLA — o mesmo
 * card usado na lista de chamados — seguido da legenda de cores de status
 * da operação (verde, amarelo, vermelho).
 */
export default function AlertasView() {
  const emRisco = CHAMADOS.filter((chamado) =>
    CHAMADOS_EM_RISCO.includes(chamado.id),
  );

  return (
    <>
      <section className={styles.titleSection}>
        <h1 className={styles.title}>Alertas</h1>
        <p className={styles.subtitle}>
          {emRisco.length} chamados em risco de estouro de SLA
        </p>
      </section>

      <section className={styles.list} aria-label="Chamados em risco de SLA">
        {emRisco.map((chamado) => (
          <ChamadoCard key={chamado.id} chamado={chamado} />
        ))}

        <div className={`${styles.panel} ${styles.cardShadow}`}>
          <h2 className={styles.panelTitle}>Legenda de Status</h2>
          <ul className={styles.legendaList}>
            {LEGENDA_STATUS.map((item) => (
              <li key={item.id} className={styles.legendaItem}>
                <span
                  className={`${styles.statusDot} ${styles[item.id]}`}
                  aria-hidden="true"
                />
                <span>
                  <strong>{item.rotulo}:</strong> {item.descricao}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
