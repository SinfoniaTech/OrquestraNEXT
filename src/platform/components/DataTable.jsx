import styles from './Consultation.module.css';
export default function DataTable({columns,rows,sortField,sortDirection,onSort,label}){
 return <div className={styles.tableScroll}><table className={styles.table} aria-label={label}>
  <caption className={styles.srOnly}>Ocorrências do histórico filtrado; ordenação aplicada antes da paginação.</caption>
  <thead><tr>{columns.map(col=><th key={col.key} scope="col" aria-sort={col.sortKey?(sortField===col.sortKey?(sortDirection==='asc'?'ascending':'descending'):'none'):undefined}>
   {col.sortKey?<button aria-label={'Ordenar por '+col.label} onClick={()=>onSort(col.sortKey)}>{col.label}<span aria-hidden="true">{sortField===col.sortKey?(sortDirection==='asc'?' ↑':' ↓'):' ↕'}</span></button>:col.label}
  </th>)}</tr></thead>
  <tbody>{rows.map(row=><tr key={row.ID_Chamado}>{columns.map(col=><td key={col.key}>{col.render?col.render(row):row[col.key]??'Não informado'}</td>)}</tr>)}</tbody>
 </table></div>;
}
