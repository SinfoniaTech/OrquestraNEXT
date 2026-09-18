import styles from '../SupervisorView.module.css';
import {
  CICLO_VALOR,
  DISTRIBUICAO_OS,
  KPIS,
  PADROES_IDENTIFICADOS,
} from '../data/chamados.js';

/**
 * Tela "Mais" (/mais): Gestão e indicadores — visão consolidada da operação
 * do dia. Distribuição de ordens de serviço (barra empilhada), KPIs,
 * padrões identificados pela análise e o ciclo de valor Orquestra.
 */
export default function MaisView() {
  const resumoDistribuicao = DISTRIBUICAO_OS.map(
    (item) => `${item.percentual}% ${item.label.toLowerCase()}`,
  ).join(', ');

  return (
    <>
      <section className={styles.titleSection}>
        <h1 className={styles.title}>Gestão e indicadores</h1>
        <p className={styles.subtitle}>Visão consolidada da operação de hoje</p>
      </section>

      <div className={styles.list}>
        <section
          className={`${styles.panel} ${styles.cardShadow}`}
          aria-label="Status de ordens de serviço"
        >
          <h2 className={styles.panelTitle}>STATUS DE ORDENS DE SERVIÇO</h2>
          <p className={styles.panelSubtitle}>Distribuição de hoje (%)</p>

          <div
            className={styles.distBar}
            role="img"
            aria-label={`Distribuição de hoje: ${resumoDistribuicao}`}
          >
            {DISTRIBUICAO_OS.map((item) => (
              <span
                key={item.id}
                className={`${styles.distSeg} ${styles[item.cor]}`}
                style={{ width: `${item.percentual}%` }}
              />
            ))}
          </div>

          <ul className={styles.distLegend}>
            {DISTRIBUICAO_OS.map((item) => (
              <li key={item.id} className={styles.distLegendItem}>
                <span
                  className={`${styles.statusDot} ${styles[item.cor]}`}
                  aria-hidden="true"
                />
                {item.label} · {item.percentual}%
              </li>
            ))}
          </ul>
        </section>

        <div className={styles.kpiGrid}>
          {KPIS.map((kpi) => (
            <div
              key={kpi.id}
              className={`${styles.kpiCard} ${styles.cardShadow}`}
            >
              <span className={styles.kpiLabel}>{kpi.rotulo}</span>
              <span className={styles.kpiValue}>{kpi.valor}</span>
            </div>
          ))}
        </div>

        <section
          className={`${styles.panel} ${styles.cardShadow}`}
          aria-label="Padrões identificados"
        >
          <h2 className={styles.panelTitle}>PADRÕES IDENTIFICADOS</h2>
          <ul className={styles.padroesList}>
            {PADROES_IDENTIFICADOS.map((padrao) => (
              <li key={padrao}>• {padrao}</li>
            ))}
          </ul>
        </section>

        <section
          className={`${styles.panel} ${styles.cardShadow}`}
          aria-label="Ciclo de valor Orquestra"
        >
          <h2 className={styles.panelTitle}>Ciclo de valor Orquestra</h2>
          <div className={styles.cicloFlow}>
            {CICLO_VALOR.map((etapa, indice) => (
              <span key={etapa} className={styles.cicloFlowItem}>
                <span className={styles.cicloChip}>{etapa}</span>
                {indice < CICLO_VALOR.length - 1 ? (
                  <span className={styles.cicloSeta} aria-hidden="true">
                    →
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
