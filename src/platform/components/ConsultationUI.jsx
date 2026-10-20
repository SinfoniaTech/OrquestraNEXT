import {useEffect,useId,useRef,useState} from 'react';
import {FILTER_CONFIG,optionsFor,PERIODS,RECURRENCES} from '../services/chamados.js';
import styles from './Consultation.module.css';
export {Dialog,IndicatorInfo,KpiCard,StatusBadge,CriticalityBadge} from './OperationalUI.jsx';
export function MultiSelect({label,options,selected,onChange}){
 const [open,setOpen]=useState(false),root=useRef(null),trigger=useRef(null),id=useId();
 useEffect(()=>{
  if(!open)return;
  const outside=e=>{if(!root.current?.contains(e.target))setOpen(false);};
  const keyboard=e=>{if(e.key==='Escape'){e.stopPropagation();setOpen(false);trigger.current?.focus();}};
  document.addEventListener('pointerdown',outside);const node=root.current;node.addEventListener('keydown',keyboard);
  return ()=>{document.removeEventListener('pointerdown',outside);node.removeEventListener('keydown',keyboard);};
 },[open]);
 return <div className={styles.multiSelect} ref={root} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}}>
  <span className={styles.fieldLabel}>{label}</span>
  <button ref={trigger} className={styles.selectTrigger} aria-expanded={open} aria-controls={id} aria-label={label+': '+(selected.length?selected.length+' selecionados':'Todos')} onClick={()=>setOpen(v=>!v)}><span>{selected.length?selected.length+' selecionados':'Todos'}</span><span aria-hidden="true">⌄</span></button>
  {open&&<div id={id} className={styles.options} role="group" aria-label={'Opções de '+label}>
   {options.map(option=>{const value=typeof option==='string'?option:option.id,text=typeof option==='string'?option:option.label;return <label key={value}><input type="checkbox" checked={selected.includes(value)} onChange={()=>onChange(selected.includes(value)?selected.filter(v=>v!==value):[...selected,value])}/><span>{text}</span></label>;})}
   <button className={styles.clearSelection} onClick={()=>onChange([])}>Limpar seleção de {label}</button>
  </div>}
 </div>;
}
export function SearchInput({value,onChange}){
 return <label className={styles.search}><span aria-hidden="true">⌕</span><input type="search" aria-label="Buscar chamados" placeholder="Buscar ID, cliente, unidade, ocorrência…" value={value} onChange={e=>onChange(e.target.value)}/></label>;
}
export function FilterChips({state,dispatch}){
 const chips=[];
 if(state.days!==60)chips.push({key:'period',label:PERIODS.find(p=>p.days===state.days).label,remove:()=>dispatch({type:'period',value:60})});
 for(const [field,values] of Object.entries(state.filters))for(const value of values)chips.push({key:field+value,label:(FILTER_CONFIG.find(f=>f.field===field)?.label??field)+': '+value,remove:()=>dispatch({type:'remove',field,value})});
 for(const value of state.recurrence)chips.push({key:'rec'+value,label:'Recorrência: '+RECURRENCES.find(b=>b.id===value).label,remove:()=>dispatch({type:'recurrence',values:state.recurrence.filter(v=>v!==value)})});
 if(state.search)chips.push({key:'search',label:'Busca: '+state.search,remove:()=>dispatch({type:'search',value:''})});
 return <div className={styles.chips} aria-label="Filtros ativos"><span className={styles.baseChip}>Base: 60 dias</span>
  {chips.map(chip=><button key={chip.key} className={styles.chip} aria-label={'Remover '+chip.label} onClick={chip.remove}>{chip.label}<span aria-hidden="true">×</span></button>)}
  {!chips.length&&<span className={styles.noFilters}>Sem restrições adicionais</span>}
 </div>;
}
export function FilterBar({state,dispatch,total}){
 const [advanced,setAdvanced]=useState(false);
 const options=useRef(Object.fromEntries(FILTER_CONFIG.map(f=>[f.field,f.options??optionsFor(f.field)])));
 return <section className={styles.filterCard} aria-label="Filtros de chamados">
  <div className={styles.filterToolbar}><div><h2>Explorar o histórico</h2><p>Combine filtros para aprofundar sua consulta.</p></div><div className={styles.filterActions}><SearchInput value={state.search} onChange={value=>dispatch({type:'search',value})}/><button className={styles.outlineButton} aria-expanded={advanced} aria-controls="advanced-filters" onClick={()=>setAdvanced(v=>!v)}>Mais filtros {state.recurrence.length+FILTER_CONFIG.filter(f=>f.advanced).reduce((n,f)=>n+(state.filters[f.field]??[]).length,0)>0?'●':''}</button><button className={styles.clearButton} onClick={()=>dispatch({type:'reset'})}>Limpar filtros</button></div></div>
  <div className={styles.filterGrid}>
   <label className={styles.periodField}><span className={styles.fieldLabel}>Período</span><select aria-label="Período" value={state.days} onChange={e=>dispatch({type:'period',value:e.target.value})}>{PERIODS.map(p=><option value={p.days} key={p.days}>{p.label}</option>)}</select></label>
   {FILTER_CONFIG.filter(f=>!f.advanced).map(f=><MultiSelect key={f.field} label={f.label} options={options.current[f.field]} selected={state.filters[f.field]??[]} onChange={values=>dispatch({type:'field',field:f.field,values})}/>)}
  </div>
  {advanced&&<div id="advanced-filters" className={styles.advancedGrid}>
   {FILTER_CONFIG.filter(f=>f.advanced).map(f=><MultiSelect key={f.field} label={f.label} options={options.current[f.field]} selected={state.filters[f.field]??[]} onChange={values=>dispatch({type:'field',field:f.field,values})}/>)}
   <MultiSelect label="Recorrência" options={RECURRENCES} selected={state.recurrence} onChange={values=>dispatch({type:'recurrence',values})}/>
   <p className={styles.advancedNote}>Recorrência informada na base em 30 dias; não recalculada.</p>
  </div>}
  <FilterChips state={state} dispatch={dispatch}/>
  <span className={styles.srOnly} role="status" aria-live="polite">{total} registros encontrados</span>
 </section>;
}
export function EmptyState({onClear}){return <div className={styles.empty}><strong>Nenhum registro encontrado</strong><p>Experimente remover uma seleção ou limpar os filtros.</p><button className={styles.outlineButton} onClick={onClear}>Limpar consulta</button></div>;}
export function Pagination({page,pages,total,pageSize,onPage,onPageSize}){
 return <div className={styles.pagination}><span>{total?'Mostrando '+((page-1)*pageSize+1)+'–'+Math.min(page*pageSize,total)+' de '+total:'0 registros'}</span><div><label>Por página <select aria-label="Registros por página" value={pageSize} onChange={e=>onPageSize(e.target.value)}>{[10,25,50].map(n=><option key={n}>{n}</option>)}</select></label><button className={styles.pageButton} aria-label="Página anterior" disabled={page<=1} onClick={()=>onPage(page-1)}>‹</button><span>Página {page} de {pages}</span><button className={styles.pageButton} aria-label="Próxima página" disabled={page>=pages} onClick={()=>onPage(page+1)}>›</button></div></div>;
}
