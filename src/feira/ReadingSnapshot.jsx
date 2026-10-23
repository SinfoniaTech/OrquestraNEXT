import styles from './SyncFeira.module.css';
// Local reading state; no command, lock or operational clock.
export default function ReadingSnapshot({selected,data,onLatest,online}){
 const advanced=selected.snapshotId!==data.view.snapshotId||selected.cycle!==data.state.cycle;
 return <div className={styles.reading} role="status" data-testid="reading-snapshot"><p>Consultando {selected.snapshotId} · revisão {selected.revision}{advanced?` — operação atual ${data.view.snapshotId} · ciclo ${data.state.cycle+1}`:''}. Fotografia fixada para leitura; a consulta não pausa a operação.</p>{advanced&&<button type="button" disabled={!online||!data.view.rows.some(r=>r.ID_Chamado===selected.row.ID_Chamado)} onClick={onLatest}>Consultar versão mais recente</button>}</div>;
}
