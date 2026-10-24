import {useState} from 'react';
import {useConsultation} from '../filters/ConsultationContext.jsx';
import {STATUS_ORDER,CRITICALITY_ORDER,SORT_FIELDS,SOURCE,dateLabel,civilLabel,etaLabel,slaRemainingLabel,percentageLabel,metricDefinition} from '../services/chamados.js';
import {FilterBar,KpiCard,IndicatorInfo,StatusBadge,CriticalityBadge,EmptyState,Pagination,Dialog} from '../components/ConsultationUI.jsx';
import DataTable from '../components/DataTable.jsx';
import RecordExplorer from '../components/RecordExplorer.jsx';
import ChamadoDetail from './ChamadoDetail.jsx';
import shared from '../components/Consultation.module.css';
import styles from './ChamadosPage.module.css';
function Distribution({title,field,values,order,kind,state,view}){
 const definition=metricDefinition({title,groupBy:field},state,view);
 return <section className={shared.analysisCard} aria-label={title}>
  <div className={shared.sectionTitle}><div><h2>{title}</h2><p>Histórico filtrado · {view.summary.total} chamados</p></div><IndicatorInfo definition={definition}/></div>
  <ul className={shared.distribution}>{order.map(label=>{
   const count=values[label],pct=view.summary.total?count/view.summary.total*100:null;
   return <li key={label}><div className={shared.distributionRow}>{kind==='criticidade'?<CriticalityBadge value={label}/>:<span>{label}</span>}<span><strong data-testid={kind+'-'+label}>{count}</strong><small>{pct===null?'—':pct.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%'}</small></span></div>
    <div className={shared.barTrack} aria-hidden="true"><span className={kind==='criticidade'?shared['bar'+label]:shared.barStatus} style={{width:(pct??0)+'%'}}/></div>
   </li>;
  })}</ul>
 </section>;
}
export default function ChamadosPage(){
 const {state,dispatch,view}=useConsultation();
 const [selected,setSelected]=useState(null),[drill,setDrill]=useState(null);
 const openDrill=(title,rows)=>setDrill({title,rows});
 const definition=config=>metricDefinition(config,state,view);
 const statusTitles=['Abertos no recorte','Contactados no recorte','Técnicos a caminho','Em atendimento','Concluídos no recorte'];
 const cards=[
  {title:'Total no período',value:view.summary.total,subtitle:'Todos os chamados do recorte',definition:definition({title:'Total no período'}),rows:view.rows},
  ...STATUS_ORDER.map((status,i)=>({title:statusTitles[i],value:view.summary.statuses[status],subtitle:'Status: '+status,tone:status==='Concluído'?'green':status==='Em atendimento'?'orange':'blue',definition:definition({title:statusTitles[i],status}),rows:view.rows.filter(r=>r.Status===status)}))
 ];
 const columns=[
  {key:'ID_Chamado',label:'ID / Criação',sortKey:'ID_Chamado',render:r=><><button className={shared.idButton} onClick={()=>setSelected(r)} aria-label={'Abrir chamado '+r.ID_Chamado}>{r.ID_Chamado}</button><small className={shared.cellSub}>{dateLabel(r['Criado em'])}</small></>},
  {key:'Cliente',label:'Cliente',sortKey:'Cliente'},
  {key:'Unidade',label:'Unidade',sortKey:'Unidade'},
  {key:'Categoria do Chamado',label:'Categoria',sortKey:'Categoria do Chamado'},
  {key:'Status',label:'Status',sortKey:'Status',render:r=><StatusBadge value={r.Status}/>},
  {key:'Criticidade_ORQUESTRA',label:'Criticidade',sortKey:'Criticidade_ORQUESTRA',render:r=><CriticalityBadge value={r.Criticidade_ORQUESTRA}/>},
  {key:'Técnico',label:'Técnico',sortKey:'Técnico'},
  {key:'sla',label:'SLA restante¹',render:r=><><span className={shared.slaPending}>{slaRemainingLabel(r)}</span><small className={shared.cellSub}>{percentageLabel(r.Percentual_SLA)} consumido</small></>},
  {key:'eta',label:'ETA técnico',render:r=>etaLabel(r)},
  {key:'action',label:'Detalhe',render:r=><button className={shared.rowAction} aria-label={'Ver detalhes de '+r.ID_Chamado} onClick={()=>setSelected(r)}>Ver <span aria-hidden="true">↗</span></button>}
 ];
 return <div className={shared.consultation}>
  <div className={shared.referenceLine}><span><span className={shared.referenceDot}/>HISTÓRICO · {SOURCE}</span><span>{civilLabel(view.period.from)}–{civilLabel(view.period.to)} · referência: 06/10/2026, 22h (São Paulo)</span></div>
  <div className={styles.cards}>{cards.map(card=><KpiCard key={card.title} {...card} accent action={{label:'Ver '+card.rows.length+' registros',onClick:()=>openDrill(card.title,card.rows)}}/>)}</div>
  <FilterBar state={state} dispatch={dispatch} total={view.summary.total}/>
  <section className={shared.resultsCard} aria-label="Resultados da consulta">
   <div className={shared.resultsHeading}><div><h2>Ocorrências históricas <span className={shared.resultCount} data-testid="result-count">{view.summary.total}</span></h2><p>Mesma população dos indicadores e gráficos. Ordenação antes da paginação.</p></div>
    <div className={shared.sortControls}><label>Ordenar por <select aria-label="Ordenar por" value={state.sortField} onChange={e=>dispatch({type:'sort',field:e.target.value,direction:state.sortDirection})}>{SORT_FIELDS.map(field=><option key={field}>{field}</option>)}</select></label><button className={shared.outlineButton} aria-label={state.sortDirection==='desc'?'Ordem decrescente':'Ordem crescente'} onClick={()=>dispatch({type:'sort',field:state.sortField,direction:state.sortDirection==='desc'?'asc':'desc'})}>{state.sortDirection==='desc'?'↓':'↑'}</button></div>
   </div>
   {view.summary.total?<DataTable label="Tabela de chamados" columns={columns} rows={view.rows} sortField={state.sortField} sortDirection={state.sortDirection} onSort={field=>dispatch({type:'sort',field})}/>:<EmptyState onClear={()=>dispatch({type:'reset'})}/>}
   <Pagination page={view.page} pages={view.pages} total={view.summary.total} pageSize={state.pageSize} onPage={value=>dispatch({type:'page',value})} onPageSize={value=>dispatch({type:'pageSize',value})}/>
   <p className={shared.tableNote}>¹ SLA restante: regra contratual em validação; não calculado por inferência. Consumo de SLA é o valor fornecido. ETA é de chegada do técnico; após chegada ou conclusão, não se aplica.</p>
  </section>
  <div className={shared.analysisGrid}>
   <Distribution title="Chamados por status" field="Status" values={view.summary.statuses} order={STATUS_ORDER} kind="status" state={state} view={view}/>
   <Distribution title="Criticidade histórica" field="Criticidade_ORQUESTRA" values={view.summary.criticalities} order={CRITICALITY_ORDER} kind="criticidade" state={state} view={view}/>
   <section className={shared.analysisCard+' '+shared.attentionCard} aria-label="Atenção na referência">
    <div className={shared.sectionTitle}><div><h2>Atenção na referência</h2><p>Não concluídos em Laranja ou Vermelho</p></div><IndicatorInfo definition={definition({title:'Atenção na referência',attention:true})}/></div>
    <strong className={shared.attentionNumber} data-testid="attention-count">{view.summary.attention.length}</strong><span className={shared.attentionCaption}>de {view.summary.active} não concluídos neste recorte</span>
    {view.summary.attention.length?<ul className={shared.attentionList}>{view.summary.attention.slice(0,3).map(r=><li key={r.ID_Chamado}><button aria-label={'Detalhar atenção '+r.ID_Chamado} onClick={()=>setSelected(r)}><span>{r.ID_Chamado}</span><CriticalityBadge value={r.Criticidade_ORQUESTRA}/><small>{r.Cliente} · {r.Unidade}</small></button></li>)}</ul>:<p className={shared.attentionEmpty}>Nenhum chamado não concluído em Laranja ou Vermelho neste recorte.</p>}
    <p className={shared.analysisNote}>Até 3 destaques: Vermelho antes de Laranja, depois criação mais antiga. Concluídos não são alertas ativos.</p>
   </section>
  </div>
  <p className={shared.sourceFooter}>Fonte: {SOURCE} · dados sintéticos acadêmicos · sem atualização em tempo real. Histórico e snapshots mantidos separados.</p>
  {selected&&<ChamadoDetail row={selected} onClose={()=>setSelected(null)}/>}
  {drill&&!selected&&<Dialog wide title={drill.title} onClose={()=>setDrill(null)}><p>{drill.rows.length} registros do indicador · filtros preservados.</p><RecordExplorer rows={drill.rows} label="Chamados do indicador" onDetail={setSelected}/></Dialog>}
 </div>;
}
