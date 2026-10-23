import {useEffect,useId,useRef,useState} from 'react';
import styles from './Consultation.module.css';
export function Dialog({title,onClose,children,wide=false}){
 const ref=useRef(null),titleId=useId(),closeRef=useRef(onClose);
 closeRef.current=onClose;
 useEffect(()=>{
  const previous=document.activeElement,dialog=ref.current;dialog.showModal();dialog.querySelector('button')?.focus();
  return ()=>{if(dialog.open)dialog.close();if(previous?.isConnected)previous.focus();};
 },[]);
 return <dialog ref={ref} className={styles.dialog+' '+(wide?styles.detailDialog:'')} aria-labelledby={titleId} onCancel={event=>{event.preventDefault();closeRef.current();}} onClick={event=>{if(event.target===ref.current)onClose();}}>
  <header className={styles.dialogHeader}><div><span className={styles.eyebrow}>ORQUESTRA · DEMONSTRAÇÃO</span><h2 id={titleId}>{title}</h2></div><button className={styles.closeButton} aria-label="Fechar diálogo" onClick={onClose}>×</button></header>
  <div className={styles.dialogBody}>{children}</div>
 </dialog>;
}
export function IndicatorInfo({definition}){
 const [open,setOpen]=useState(false);
 const filters=Object.entries(definition.filters).filter(([,v])=>v.length).map(([k,v])=>k+': '+v.join(' ou ')).concat(definition.recurrence.length?['Recorrência: '+definition.recurrence.join(', ')]:[],definition.search?['Busca: '+definition.search]:[]).join('; ');
 return <><button type="button" className={styles.infoButton} aria-label={'Sobre '+definition.title} onClick={()=>setOpen(true)}>i</button>{open&&<Dialog title={definition.title} onClose={()=>setOpen(false)}>
  <span className={styles.classification}>{definition.classification}</span>
  <dl className={styles.explanation}>
   {[['Definição',definition.definition],['Campos de origem',definition.fields.join(' · ')],['Regra de cálculo',definition.calculation],['População considerada',definition.population+' chamados no recorte, antes da paginação'],['Período de criação',definition.period],['Unidade',definition.unit],['Valores ausentes',definition.missing],['Filtros e busca',filters||'Sem restrições adicionais'],['Fonte e referência',definition.source+' · '+definition.reference+' · '+definition.timezone+' · '+definition.sourceFile],['Versão da fonte (SHA-256)',definition.sourceHash]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
  </dl>
 </Dialog>}</>;
}
/*
 * KpiCard
 *  - tone: blue | green | orange | violet | teal | rose | amber
 *  - accent: barra superior colorida + fundo suave (opt-in; o Modo Feira não usa)
 *  - action: {label,onClick} — link "Ver x registros" DENTRO do card, à direita e fixado na base
 */
export function KpiCard({title,value,definition,tone='blue',subtitle,action,accent=false,className=''}){
 const classes=[styles.kpi,styles[tone],action&&styles.kpiWithAction,accent&&styles.kpiAccent,className].filter(Boolean).join(' ');
 return <article className={classes} data-testid={'kpi-'+title} data-tone={tone}>
  <div className={styles.kpiTitle}><h2>{title}</h2><IndicatorInfo definition={definition}/></div>
  <strong className={styles.kpiNumber}>{value.toLocaleString('pt-BR')}</strong><span className={styles.kpiSubtitle}>{subtitle}</span>
  {action&&<button type="button" className={styles.kpiAction} onClick={action.onClick}>{action.label}</button>}
 </article>;
}
export function StatusBadge({value}){return <span className={styles.statusBadge}>{value}</span>;}
export function CriticalityBadge({value}){return <span className={styles.criticality+' '+styles['critical'+value]}><span aria-hidden="true"/> {value}</span>;}
