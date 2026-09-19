import Badge from './Badge.jsx';
import styles from '../BackofficeView.module.css';

/**
 * Tabela genérica — cabeçalho xs uppercase com borda inferior, células
 * px-3 py-3, números tabular-nums e rolagem horizontal (min-width 860px),
 * exatamente como nas tabelas da referência.
 *
 * `columns`: [{ key, label, numeric?, badge? }]
 * `rows`:    [{ [key]: valor | { text, tone } quando badge }]
 */
export default function DataTable({ columns, rows }) {
  return (
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeadRow}>
            {columns.map((col) => (
              <th key={col.key} className={styles.tableHeadCell} scope="col">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.contrato ?? row.equipamento ?? i} className={styles.tableRow}>
              {columns.map((col) => {
                const value = row[col.key];
                const cellClass = [
                  styles.tableCell,
                  col.numeric ? styles.tableCellNumeric : '',
                  col.key === columns[0].key ? styles.tableCellStrong : '',
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <td key={col.key} className={cellClass}>
                    {col.badge && value ? <Badge text={value.text} tone={value.tone} /> : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
