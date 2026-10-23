import styles from './Consultation.module.css';
import ShowMore from './ShowMore.jsx';
// `limit` (opcional): mostra só os primeiros N itens com "Ver mais itens…". Sem `limit`, comportamento original.
export default function DataTable({columns,rows,sortField,sortDirection,onSort,label,limit,caption="Ocorrências do histórico filtrado; ordenação aplicada antes da paginação."}){
 const table=list=><div className={styles.tableScroll}><table className={styles.table} aria-label={label}>
  <caption className={styles.srOnly}>{caption}</caption>
  <thead><tr>{columns.map(col=><th key={col.key} scope="col" aria-sort={col.sortKey?(sortField===col.sortKey?(sortDirection==='asc'?'ascending':'descending'):'none'):undefined}>
   {col.sortKey?<button aria-label={'Ordenar por '+col.label} onClick={()=>onSort(col.sortKey)}>{col.label}<span aria-hidden="true">{sortField===col.sortKey?(sortDirection==='asc'?' ↑':' ↓'):' ↕'}</span></button>:col.label}
  </th>)}</tr></thead>
  <tbody>{list.map(row=><tr key={row.ID_Chamado??row.label}>{columns.map(col=><td key={col.key}>{col.render?col.render(row):row[col.key]??'Não informado'}</td>)}</tr>)}</tbody>
 </table></div>;
 if(!limit)return table(rows);
 return <ShowMore total={rows.length} limit={limit}>{count=>table(rows.slice(0,count))}</ShowMore>;
}
