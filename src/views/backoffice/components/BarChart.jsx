import styles from '../BackofficeView.module.css';

/**
 * Gráfico de barras em SVG — recria os gráficos Recharts da referência
 * sem adicionar dependências. Suporta:
 * - múltiplas séries agrupadas por rótulo (labels do eixo X);
 * - `barTones` opcional: cor por barra (ex.: prioridade crítica/alta/...);
 * - legenda das séries no topo, no padrão da referência.
 *
 * As cores vêm dos tokens --bk-chart-* definidos no CSS Module da view
 * (via CSS variables consumidas com fill="var(--bk-chart-N)").
 */

const CHART_COLORS = [
  'var(--bk-chart-1)',
  'var(--bk-chart-2)',
  'var(--bk-chart-3)',
  'var(--bk-chart-4)',
  'var(--bk-chart-5)',
];

const TONE_COLORS = {
  primary: 'var(--bk-chart-1)',
  info: 'var(--bk-chart-2)',
  warning: 'var(--bk-chart-3)',
  critical: 'var(--bk-chart-4)',
  muted: 'var(--bk-muted)',
};

// ViewBox interno; o SVG escala para 100% da largura do card.
const W = 560;
const H = 200;
const PAD = { top: 12, right: 8, bottom: 24, left: 32 };
const GRID_LINES = 4;

export default function BarChart({ labels, series, barTones = null, formatValue = (v) => v }) {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxValue = Math.max(...series.flatMap((s) => s.values));
  const niceMax = niceCeil(maxValue);
  const groupW = innerW / labels.length;
  const nSeries = series.length;
  const barGap = 3;
  const barW = Math.min(28, (groupW * 0.62 - barGap * (nSeries - 1)) / nSeries);
  const groupContentW = barW * nSeries + barGap * (nSeries - 1);

  return (
    <div className={styles.chart}>
      {nSeries > 1 || !barTones ? <Legend series={series} /> : null}
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.chartSvg} role="img" aria-label="Gráfico de barras">
        {/* grade horizontal + rótulos do eixo Y */}
        {Array.from({ length: GRID_LINES + 1 }, (_, i) => {
          const y = PAD.top + innerH - (innerH * i) / GRID_LINES;
          const value = (niceMax * i) / GRID_LINES;
          return (
            <g key={i}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} className={styles.chartGrid} />
              <text x={PAD.left - 6} y={y + 3} textAnchor="end" className={styles.chartTick}>
                {formatValue(value)}
              </text>
            </g>
          );
        })}

        {/* barras */}
        {labels.map((label, li) => {
          const groupX = PAD.left + groupW * li + (groupW - groupContentW) / 2;
          return (
            <g key={label}>
              {series.map((s, si) => {
                const value = s.values[li];
                const barH = (value / niceMax) * innerH;
                const x = groupX + si * (barW + barGap);
                const y = PAD.top + innerH - barH;
                const fill = barTones ? TONE_COLORS[barTones[li]] ?? CHART_COLORS[0] : CHART_COLORS[si % CHART_COLORS.length];
                return <rect key={s.key} x={x} y={y} width={barW} height={barH} rx={2} fill={fill} />;
              })}
              <text x={PAD.left + groupW * li + groupW / 2} y={H - 8} textAnchor="middle" className={styles.chartTick}>
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Legend({ series }) {
  return (
    <div className={styles.chartLegend}>
      {series.map((s, i) => (
        <span key={s.key} className={styles.chartLegendItem}>
          <span className={styles.chartLegendDot} style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
          {s.name}
        </span>
      ))}
    </div>
  );
}

/** Arredonda o máximo para um teto "redondo" (ex.: 587 -> 600, 46 -> 50). */
function niceCeil(value) {
  if (value <= 0) return 1;
  const mag = 10 ** Math.floor(Math.log10(value));
  const norm = value / mag;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return nice * mag;
}
