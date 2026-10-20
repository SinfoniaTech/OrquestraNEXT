import {AlertTriangleIcon} from '../../views/supervisor/components/icons.jsx';
import {Dialog} from '../../platform/components/OperationalUI.jsx';
import {StatusBadge} from '../../platform/components/OperationalUI.jsx';
import {CRITICALITY,fieldValue,changeLabels} from './presentation.js';
import styles from './Supervisor.module.css';
import {alertPresentation} from './alertPresentation.js';
export function FeiraPriority({value}) {
 const info = CRITICALITY[value];
 return <span className={`${styles.priority} ${styles[info?.tone]??''}`}><span aria-hidden="true">●</span> {info?.label??'Criticidade não informada'}</span>;
}
export function SupervisorCall({row,change,reference,onOpen,disabled,busy,alertEntry=false}) {
 const labels=changeLabels(change),alert=alertPresentation(row,reference);
 return <button type="button" className={styles.call} data-call-id={row.ID_Chamado} data-tone={CRITICALITY[row.Criticidade_ORQUESTRA]?.tone} onClick={()=>onOpen(row)} disabled={disabled} aria-busy={busy}>
  <div className={styles.callInfo}>
   <div className={styles.cardTop}><FeiraPriority value={row.Criticidade_ORQUESTRA}/><span className={styles.id}>{row.ID_Chamado}</span></div>
   <p className={styles.equipment}>{fieldValue(row,'Cliente')} · {fieldValue(row,'Unidade')}</p>
   <h3>{fieldValue(row,'Problema')}</h3>
   <span className={styles.status}><StatusBadge value={row.Status}/></span>
   {row['Passageiro Preso']==='Sim'&&<span className={styles.time}> · Passageiro preso</span>}
  </div>
  <div className={styles.callSla}><span>{alert.slaRelated?alert.nature:'SLA consumido'}</span><strong>{alert.sla.valid?`${alert.sla.percent}%`:'Indisponível'}</strong></div>
  {labels.length>0&&<div className={styles.changes}>{labels.map(label=><span key={label}>{label}</span>)}</div>}
  <span className={styles.open}>{busy?'Confirmando pausa global…':alertEntry?'Ver alerta →':'Consultar ocorrência →'}</span>
 </button>;
}

// Compact notice adapted from the original alerts; the existing ACK/lock flow owns it.
export function SupervisorAlert({row,reference,onOpen,onClose,disabled}) {
 const alert=alertPresentation(row,reference);
 const factor=alert.factor.level==='Confirmado'?'Aguardando peça — motivo registrado.':alert.factor.level==='Possível fator'?'Possível impedimento: chegada do técnico após o prazo.':'Impedimento não identificado.';
 return <article className={styles.compactAlert} data-alert-summary="true" data-alert-id={row.ID_Chamado} data-tone={CRITICALITY[row.Criticidade_ORQUESTRA]?.tone}>
  <div className={styles.compactBody}>
   <p className={styles.compactProblem}>{fieldValue(row,'Problema')}</p>
   <p className={styles.compactActionLabel}>{row.Criticidade_ORQUESTRA==='Vermelho'?'Prioridade imediata':'Ação recomendada'}</p>
   <ul><li>{alert.recommendation}</li></ul>
   <p className={styles.compactFactor}>{factor}</p>
  </div>
  <footer className={styles.compactFooter}>
   <button type="button" className={styles.detailButton} onClick={()=>onOpen(row)} disabled={disabled}>Ver detalhes <span aria-hidden="true">⌄</span></button>
   <button type="button" className={styles.compactClose} onClick={onClose}>Fechar</button>
  </footer>
 </article>;
}

export function SupervisorAlertDialog({row,metadata,online,onFull,onClose}) {
 const alert=alertPresentation(row,metadata.reference),red=row.Criticidade_ORQUESTRA==='Vermelho';
 const title=red?'Alerta – Demanda Prioritária':alert.slaRelated?'Alerta – Risco de Estouro de SLA':'Alerta operacional';
 let message=alert.urgency;
 if(row['Passageiro Preso']==='Sim')message='Passageiro preso: demanda crítica com prioridade imediata.';
 else if(alert.slaRelated&&alert.sla.valid){
  message=alert.sla.exceeded?`SLA excedido: ${alert.sla.percent}% consumido. Prazo atingido/excedido.`:alert.sla.remaining!==null?`Risco de SLA: prazo em aproximadamente ${new Intl.NumberFormat('pt-BR',{maximumFractionDigits:1}).format(alert.sla.remaining)} minutos (${alert.sla.percent}% consumido).`:`Risco de SLA: ${alert.sla.percent}% consumido; prazo restante não calculável.`;
 }
 const secondary=!alert.slaRelated&&alert.sla.valid?` SLA consumido: ${alert.sla.percent}%.`:'';
 return <Dialog title={<><AlertTriangleIcon size={24}/><span className={styles.compactHeading}><span>{title}</span><span className={styles.compactIntro}>O chamado <strong>#{row.ID_Chamado}</strong>. {message}{secondary}</span></span></>} onClose={onClose}><SupervisorAlert row={row} reference={metadata.reference} onOpen={onFull} onClose={onClose} disabled={!online}/>{!online&&<p role="alert" className={styles.warning}>Sem sincronização. Último estado confirmado.</p>}</Dialog>;
}
