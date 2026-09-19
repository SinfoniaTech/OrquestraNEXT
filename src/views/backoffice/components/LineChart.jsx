import styles from '../BackofficeView.module.css';

/**
 * Gráfico composto barras + linha em SVG — recria o "Receita, Custo e SLA"
 * da referência (Recharts ComposedChart) sem adicionar dependências:
 * barras agrupadas com escala no eixo esquerdo e uma linha suavizada com
 * escala própria (eixo direito, ex.: SLA em %).
 */

const CHART_COLORS = ['var(--bk-chart-1)', 'var(--bk-chart-2)'];
const LINE_COLOR = 'var(--bk-chart-3)';

const W = 560;
const H = 200;
const PAD = { top: 12, right: 36, bottom: 24, left: 32 };
const GRID_LINES = 4;

export default function LineChart({ labels, series, line = null, formatValue = (v) => v }) {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxBar = Math.max(...series.flatMap((s) => s.values));
  const niceMax = niceCeil(maxBar);
  const groupW = innerW / labels.length;
  const nSeries = series.length;
  const barGap = 3;
  const barW = Math.min(22, (groupW * 0.55 - barGap * (nSeries - 1)) / nSeries);
  const groupContentW = barW * nSeries + barGap * (nSeries - 1);

  // pontos da linha (escala independente, eixo direito)
  let linePoints = '';
  if (line) {
    const range = line.max - line.min || 1;
    linePoints = line.values
      .map((v, i) => {
        const x = PAD.left + groupW * i + groupW / 2;
        const y = PAD.top + innerH - ((v - line.min) / range) * innerH;
        return `${x},${y}`;
      })
      .join(' ');
  }

  return (
    <div className={styles.chart}>
      <div className={styles.chartLegend}>
        {series.map((s, i) => (
          <span key={s.key} className={styles.chartLegendItem}>
            <span className={styles.chartLegendDot} style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
            {s.name}
          </span>
        ))}
        {line ? (
          <span className={styles.chartLegendItem}>
            <span className={styles.chartLegendDot} style={{ backgroundColor: LINE_COLOR }} />
            {line.name}
          </span>
        ) : null}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className={styles.chartSvg} role="img" aria-label="Gráfico de barras e linha">
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

        {labels.map((label, li) => {
          const groupX = PAD.left + groupW * li + (groupW - groupContentW) / 2;
          return (
            <g key={label}>
              {series.map((s, si) => {
                const value = s.values[li];
                const barH = (value / niceMax) * innerH;
                return (
                  <rect
                    key={s.key}
                    x={groupX + si * (barW + barGap)}
                    y={PAD.top + innerH - barH}
                    width={barW}
                    height={barH}
                    rx={2}
                    fill={CHART_COLORS[si % CHART_COLORS.length]}
                  />
                );
              })}
              <text x={PAD.left + groupW * li + groupW / 2} y={H - 8} textAnchor="middle" className={styles.chartTick}>
                {label}
              </text>
            </g>
          );
        })}

        {line ? (
          <g>
            <polyline points={linePoints} fill="none" stroke={LINE_COLOR} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {linePoints.split(' ').map((pt) => {
              const [cx, cy] = pt.split(',');
              return <circle key={pt} cx={cx} cy={cy} r="2.5" fill={LINE_COLOR} />;
            })}
          </g>
        ) : null}
      </svg>
    </div>
  );
}

function niceCeil(value) {
  if (value <= 0) return 1;
  const mag = 10 ** Math.floor(Math.log10(value));
  const norm = value / mag;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return nice * mag;
}
