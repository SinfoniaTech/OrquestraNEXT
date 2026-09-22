import KpiCard from '../components/KpiCard.jsx';
import SectionCard from '../components/SectionCard.jsx';
import DataTable from '../components/DataTable.jsx';
import BarChart from '../components/BarChart.jsx';
import LineChart from '../components/LineChart.jsx';
import Badge from '../components/Badge.jsx';
import Icon from '../components/icons.jsx';
import styles from '../BackofficeView.module.css';
import {
  KPIS_EXECUTIVA,
  RECEITA_CUSTO_SLA,
  MARGEM_SEGMENTO,
  CARTEIRA_PRESSAO,
  SINAIS_PREDITIVOS,
  SAUDE_CARTEIRA,
} from '../data/backofficeData.js';

/**
 * TELA "GESTÃO EXECUTIVA" — replica a rota "/gestao-executiva" da
 * referência: 6 KPIs executivos, gráfico composto Receita/Custo/SLA,
 * margem por segmento, tabela da carteira sob pressão, sinais preditivos
 * e saúde da carteira por segmento.
 */
export default function GestaoExecutivaScreen() {
  return (
    <>
      <div className={styles.kpiGrid}>
        {KPIS_EXECUTIVA.map((kpi) => (
          <KpiCard key={kpi.id} {...kpi} />
        ))}
      </div>

      <div className={styles.chartGrid2}>
        <SectionCard title={RECEITA_CUSTO_SLA.title} subtitle={RECEITA_CUSTO_SLA.subtitle}>
          <LineChart
            labels={RECEITA_CUSTO_SLA.labels}
            series={RECEITA_CUSTO_SLA.series}
            line={RECEITA_CUSTO_SLA.line}
            formatValue={(v) => `${v}`}
          />
        </SectionCard>
        <SectionCard title={MARGEM_SEGMENTO.title} subtitle={MARGEM_SEGMENTO.subtitle}>
          <BarChart
            labels={MARGEM_SEGMENTO.labels}
            series={MARGEM_SEGMENTO.series}
            formatValue={(v) => `${v}%`}
          />
        </SectionCard>
      </div>

      <SectionCard title={CARTEIRA_PRESSAO.title} subtitle={CARTEIRA_PRESSAO.subtitle}>
        <DataTable columns={CARTEIRA_PRESSAO.columns} rows={CARTEIRA_PRESSAO.rows} />
      </SectionCard>

      <div className={styles.chartGrid2}>
        <SectionCard title={SINAIS_PREDITIVOS.title} subtitle={SINAIS_PREDITIVOS.subtitle}>
          <ul className={styles.recoList}>
            {SINAIS_PREDITIVOS.items.map((sinal) => (
              <li key={sinal.titulo} className={styles.recoItem}>
                <span className={styles.recoIcon}>
                  <Icon name="trending-up" size={16} />
                </span>
                <div className={styles.recoBody}>
                  <div className={styles.recoHeader}>
                    <span className={styles.recoTitle}>{sinal.titulo}</span>
                    <Badge text={sinal.horizonte} tone="info" />
                  </div>
                  <p className={styles.recoDesc}>Base: {sinal.base}</p>
                  <p className={styles.recoImpact}>Recomendação: {sinal.recomendacao}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title={SAUDE_CARTEIRA.title} subtitle={SAUDE_CARTEIRA.subtitle}>
          <div className={styles.segmentGrid}>
            {SAUDE_CARTEIRA.segmentos.map((seg) => (
              <div key={seg.nome} className={styles.segmentCard}>
                <span className={styles.segmentName}>{seg.nome}</span>
                <span className={styles.segmentContracts}>{seg.contratos} contratos</span>
                <div className={styles.segmentStats}>
                  <span>SLA {seg.sla}</span>
                  <span>Margem {seg.margem}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
