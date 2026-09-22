import { useState } from 'react';
import KpiCard from '../components/KpiCard.jsx';
import SectionCard from '../components/SectionCard.jsx';
import DataTable from '../components/DataTable.jsx';
import BarChart from '../components/BarChart.jsx';
import Badge from '../components/Badge.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Icon from '../components/icons.jsx';
import styles from '../BackofficeView.module.css';
import {
  KPIS_TECNICA,
  HISTORICO_CHAMADAS,
  CHAMADAS_POR_PERIODO,
  CHAMADAS_POR_PRIORIDADE,
  CHAMADAS_POR_TIPO,
  PADROES_RECORRENCIA,
  PERFORMANCE_AREAS,
  COBERTURA_SKILLS,
  RECOMENDACOES,
} from '../data/backofficeData.js';

/**
 * TELA "GESTÃO TÉCNICA" — replica a rota "/" da referência:
 * 6 KPIs, card de filtros do histórico de chamadas, 3 gráficos, tabela de
 * padrões/recorrências, cards de performance por área, cobertura de skills
 * e recomendações da inteligência.
 */
export default function GestaoTecnicaScreen() {
  const [filtroAtivo, setFiltroAtivo] = useState('Prioridade');

  return (
    <>
      {/* KPIs — 2 colunas mobile, 3 em md, 6 em xl */}
      <div className={styles.kpiGrid}>
        {KPIS_TECNICA.map((kpi) => (
          <KpiCard key={kpi.id} {...kpi} />
        ))}
      </div>

      {/* Histórico de Chamadas — chips de filtro */}
      <SectionCard title={HISTORICO_CHAMADAS.title} subtitle={HISTORICO_CHAMADAS.subtitle}>
        <div className={styles.filterRow}>
          <span className={styles.filterLabel}>{HISTORICO_CHAMADAS.label}</span>
          {HISTORICO_CHAMADAS.filtros.map((filtro) => (
            <button
              key={filtro}
              type="button"
              className={`${styles.filterChip} ${filtro === filtroAtivo ? styles.filterChipActive : ''}`}
              onClick={() => setFiltroAtivo(filtro)}
            >
              {filtro}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Gráficos — empilham no mobile, 3 colunas em xl */}
      <div className={styles.chartGrid3}>
        <SectionCard title={CHAMADAS_POR_PERIODO.title} subtitle={CHAMADAS_POR_PERIODO.subtitle}>
          <BarChart labels={CHAMADAS_POR_PERIODO.labels} series={CHAMADAS_POR_PERIODO.series} />
        </SectionCard>
        <SectionCard title={CHAMADAS_POR_PRIORIDADE.title} subtitle={CHAMADAS_POR_PRIORIDADE.subtitle}>
          <BarChart
            labels={CHAMADAS_POR_PRIORIDADE.labels}
            series={CHAMADAS_POR_PRIORIDADE.series}
            barTones={CHAMADAS_POR_PRIORIDADE.barTones}
          />
        </SectionCard>
        <SectionCard title={CHAMADAS_POR_TIPO.title} subtitle={CHAMADAS_POR_TIPO.subtitle}>
          <BarChart labels={CHAMADAS_POR_TIPO.labels} series={CHAMADAS_POR_TIPO.series} />
        </SectionCard>
      </div>

      {/* Padrões e Recorrências */}
      <SectionCard title={PADROES_RECORRENCIA.title} subtitle={PADROES_RECORRENCIA.subtitle}>
        <DataTable columns={PADROES_RECORRENCIA.columns} rows={PADROES_RECORRENCIA.rows} />
      </SectionCard>

      {/* Performance por Área */}
      <SectionCard title={PERFORMANCE_AREAS.title} subtitle={PERFORMANCE_AREAS.subtitle}>
        <div className={styles.areaGrid}>
          {PERFORMANCE_AREAS.areas.map((area) => (
            <div key={area.nome} className={styles.areaCard}>
              <div className={styles.areaCardHeader}>
                <span className={styles.areaName}>{area.nome}</span>
                <Badge text={`SLA ${area.sla}`} tone="success" />
              </div>
              <div className={styles.areaStats}>
                <span>TA {area.ta}</span>
                <span>TB {area.tb}</span>
                <span>Técnicos {area.tecnicos}</span>
                <span>Reincid. {area.reincidencia}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Cobertura de Skills + Recomendações */}
      <div className={styles.chartGrid2}>
        <SectionCard title={COBERTURA_SKILLS.title} subtitle={COBERTURA_SKILLS.subtitle}>
          <ul className={styles.skillList}>
            {COBERTURA_SKILLS.skills.map((skill) => (
              <li key={skill.nome} className={styles.skillItem}>
                <div className={styles.skillHeader}>
                  <span className={styles.skillName}>{skill.nome}</span>
                  <Badge text={skill.nivel} tone={skill.tone} />
                </div>
                <p className={styles.skillMeta}>
                  {skill.regiao} · {skill.cobertura}%
                </p>
                <ProgressBar value={skill.cobertura} tone={skill.tone} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title={RECOMENDACOES.title} subtitle={RECOMENDACOES.subtitle}>
          <ul className={styles.recoList}>
            {RECOMENDACOES.items.map((rec) => (
              <li key={rec.titulo} className={styles.recoItem}>
                <span className={styles.recoIcon}>
                  <Icon name={rec.icon} size={16} />
                </span>
                <div className={styles.recoBody}>
                  <div className={styles.recoHeader}>
                    <span className={styles.recoTitle}>{rec.titulo}</span>
                    <Badge text={rec.tipo} tone={rec.tipoTone} />
                  </div>
                  <p className={styles.recoDesc}>{rec.descricao}</p>
                  <p className={styles.recoImpact}>{rec.impacto}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
