import {useMemo,useState,useEffect} from 'react';
import {useConsultation} from '../filters/ConsultationContext.jsx';
import {sortRecords,SORT_FIELDS,percentageLabel} from '../services/chamados.js';
import DataTable from './DataTable.jsx';
import {Pagination,StatusBadge,CriticalityBadge} from './ConsultationUI.jsx';
import styles from './Consultation.module.css';
export default function RecordExplorer({rows,onDetail,label='Registros de risco'}){
 const {state,dispatch}=useConsultation(),[page,setPage]=useState(1),[size,setSize]=useState(10);
 const ordered=useMemo(()=>sortRecords(rows,state.sortField,state.sortDirection),[rows,state.sortField,state.sortDirection]);
 useEffect(()=>setPage(1),[rows,state.sortField,state.sortDirection,size]);
 const pages=Math.max(1,Math.ceil(rows.length/size)),current=Math.min(page,pages);
 const columns=[
  {key:'ID_Chamado',label:'Chamado',sortKey:'ID_Chamado',render:r=><button className={styles.idButton} onClick={()=>onDetail(r)}>{r.ID_Chamado}</button>},
  {key:'Cliente',label:'Cliente',sortKey:'Cliente'},{key:'Unidade',label:'Equipamento',sortKey:'Unidade'},
  {key:'Status',label:'Status',sortKey:'Status',render:r=><StatusBadge value={r.Status}/>},
  {key:'Criticidade_ORQUESTRA',label:'Criticidade',sortKey:'Criticidade_ORQUESTRA',render:r=><CriticalityBadge value={r.Criticidade_ORQUESTRA}/>},
  {key:'Motivo_Criticidade',label:'Motivo informado'},{key:'Recorrencia_30d',label:'Recorrência 30d'},
  {key:'Percentual_SLA',label:'Consumo SLA',render:r=>percentageLabel(r.Percentual_SLA)},
  {key:'action',label:'Detalhe',render:r=><button className={styles.rowAction} onClick={()=>onDetail(r)} aria-label={'Ver detalhes de '+r.ID_Chamado}>Ver ↗</button>}
 ];
 return <div>
  <div className={styles.resultsHeading}><p><strong>{rows.length}</strong> chamados · ordem antes da paginação</p><div className={styles.sortControls}><label>Ordenar por <select aria-label="Ordenar registros de risco" value={state.sortField} onChange={e=>dispatch({type:'sort',field:e.target.value,direction:state.sortDirection})}>{SORT_FIELDS.map(f=><option key={f}>{f}</option>)}</select></label><button className={styles.outlineButton} aria-label="Inverter ordem dos riscos" onClick={()=>dispatch({type:'sort',field:state.sortField,direction:state.sortDirection==='asc'?'desc':'asc'})}>{state.sortDirection==='asc'?'↑':'↓'}</button></div></div>
  {rows.length?<DataTable label={label} columns={columns} rows={ordered.slice((current-1)*size,current*size)} sortField={state.sortField} sortDirection={state.sortDirection} onSort={field=>dispatch({type:'sort',field})}/>:<p>Nenhum registro neste recorte.</p>}
  <Pagination page={current} pages={pages} total={rows.length} pageSize={size} onPage={setPage} onPageSize={value=>setSize(Number(value))}/>
 </div>;
}
