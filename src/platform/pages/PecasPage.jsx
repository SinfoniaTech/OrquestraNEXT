import {useMemo,useState} from 'react';
import {useConsultation} from '../filters/ConsultationContext.jsx';
import {componentAnalysis,componentPage,componentDefinition,COMPONENT_TERMS as TERMS,COMPONENT_EXTERNAL} from '../services/pecas.js';
import {equipmentAnalysis} from '../services/equipamentos.js';
import {SOURCE,civilLabel,dateLabel} from '../services/chamados.js';
import {groupRecords,numberLabel,percentLabel} from '../services/sla.js';
import {externalDefinition,currencyLabel} from '../services/performance.js';
import {FilterBar,KpiCard,IndicatorInfo,Dialog,Pagination,EmptyState,CriticalityBadge} from '../components/ConsultationUI.jsx';
import DataTable from '../components/DataTable.jsx';
import RecordExplorer from '../components/RecordExplorer.jsx';
import GroupChart from '../components/GroupChart.jsx';
import ExecutiveChart from '../components/ExecutiveChart.jsx';
import ExternalMetric from '../components/ExternalMetric.jsx';
import ChamadoDetail from './ChamadoDetail.jsx';
import shared from '../components/Consultation.module.css';
import styles from './PecasPage.module.css';
function Panel({title,definition,children,description}){return <section className={styles.panel} aria-label={title}><div className={styles.heading}><div><h2>{title}</h2>{description&&<p>{description}</p>}</div><IndicatorInfo definition={definition}/></div>{children}</section>;}
export default function PecasPage(){
 const {state,dispatch,view,componentUi,setComponentUi}=useConsultation();
 const data=useMemo(()=>componentAnalysis(view.records,view.period),[view.records,view.period]),table=componentPage(data.groups,componentUi);
 const [component,setComponent]=useState(null),[unit,setUnit]=useState(null),[selected,setSelected]=useState(null),[drill,setDrill]=useState(null),[insight,setInsight]=useState(null);
 const explain=(config,rows=view.records)=>{
  const scope={...state,filters:{...state.filters}};
  if(rows!==view.records)for(const field of ['Componente Principal','Unidade','Cliente','Contrato']){const values=[...new Set(rows.map(r=>r[field]).filter(v=>v!=null&&v!==''))];if(values.length===1)scope.filters[field]=values;}
  return componentDefinition(config,scope,{...view,records:rows,summary:{...view.summary,total:rows.length}});
 };
 const info=(key,rows)=>explain(TERMS[key],rows),open=(title,rows)=>setDrill({title,rows});
 const external=metric=>({...externalDefinition(metric,state,view),calculation:'Indisponível: nenhuma fórmula aplicada ou valor simulado. O histórico contextualiza ocorrências, sem comprovar cobertura logística.',sourceFile:'Fonte externa não conectada; nenhum catálogo ou inventário disponibilizado'});
 const sort=field=>setComponentUi(ui=>({...ui,sort:field,direction:ui.sort===field&&ui.direction==='asc'?'desc':'asc',page:1}));
 const equipment=useMemo(()=>component?equipmentAnalysis(component.rows,view.period).units:[],[component,view.period]);
 const openEquipment=row=>{const rows=(component?.rows??view.records).filter(r=>r.Unidade===row.Unidade&&r['Componente Principal']===row['Componente Principal']);const group=equipmentAnalysis(rows,view.period).units[0];if(group){setSelected(null);if(unit){setDrill(null);setInsight(null);}setUnit(group);}};
 const cards=[['components',data.componentCount,data.rows,'Distintos observados · não peças em estoque'],['occurrences',data.count,data.rows,data.count+'/'+data.total+' associados · '+data.unassigned+' sem componente'],['recurrentUnits',data.risk.units,data.risk.recurrent,'Algum registro ≥3 · não soma de eventos'],['critical',data.risk.red.length,data.risk.red,'Inclui concluídos · cor BASE'],['cost',currencyLabel(data.cost.value),data.cost.rows,'N '+data.cost.count+'/'+data.count+' válidos · '+data.cost.excluded+' ausentes/inválidos']];
 const insights=rows=><div className={styles.insightList}>{groupRecords(rows,'Insight_ORQUESTRA').map(g=><article key={g.label}><p><span className={styles.base}>BASE · sintético</span> {g.label}</p><button className={styles.link} onClick={()=>setInsight(g)}>Ver {g.count} ocorrências do insight</button></article>)}</div>;
 const technical=rows=><>{['Subcomponente','Categoria do Chamado','Defeito','Falha','Fechamento'].map(field=><details key={field}><summary>{field} · BASE / contagem CALC</summary><div className={styles.groupLinks}>{groupRecords(rows,field).map(g=><button className={styles.link} key={g.label} onClick={()=>open(field+' · '+g.label,g.rows)}>{g.label} ({g.count})</button>)}</div></details>)}</>;
 const chart=(title,groups,value,format,definition,onGroup)=> <Panel title={title} definition={definition}><GroupChart label={title} groups={groups} value={value} valueLabel={format} onGroup={onGroup}/></Panel>;
 const groupDefinition=(title,field)=>explain({title,fields:[field,'Componente Principal'],definition:'Concentração de chamados associados, sem comprovar consumo, causa ou demanda futura de material.',calculation:'Agrupar '+field+' pelo texto completo e contar ocorrências com componente identificado; contagem desc/texto asc. Ausentes em Não informado.',unit:'chamados'});
 const columns=[
  {key:'component',label:'Componente',sortKey:'component',render:g=><button className={styles.link} aria-label={'Abrir componente '+g.label} onClick={()=>setComponent(g)}>{g.label}</button>},
  {key:'subcomponents',label:'Subcomponentes observados',render:g=><details><summary>{g.subcomponents.length} valores BASE</summary>{g.subcomponents.map(s=><small key={s.label}>{s.label} ({s.count})</small>)}</details>},
  {key:'count',label:'Ocorrências',sortKey:'count',render:g=>g.count},
  {key:'units',label:'Equipamentos',sortKey:'units',render:g=>g.units},
  {key:'contracts',label:'Contratos',sortKey:'contracts',render:g=>g.contracts},
  {key:'recurrence',label:'Recorrência positiva',sortKey:'recurrence',render:g=><>{percentLabel(g.recurrence.value)}<small>{g.recurrence.count}/{g.count} chamados · cobertura {g.recurrence.valid}/{g.count}</small></>},
  {key:'critical',label:'Vermelhos históricos',sortKey:'critical',render:g=><>{g.risk.red.length}<small>{g.risk.red.filter(r=>r.Status!=='Concluído').length} não concluídos</small></>},
  {key:'cost',label:'Custo dos atendimentos',sortKey:'cost',render:g=><>{currencyLabel(g.cost.value)}<small>N {g.cost.count}/{g.count} · não preço de peça</small></>},
  {key:'action',label:'Ação',render:g=><button className={styles.link} aria-label={'Detalhar componente '+g.label} onClick={()=>setComponent(g)}>Ver ↗</button>}
 ];
 return <div className={shared.consultation}>
  <div className={shared.referenceLine}><span>HISTÓRICO · {SOURCE}</span><span>{civilLabel(view.period.from)}–{civilLabel(view.period.to)} · referência 06/10/2026, 22h (São Paulo)</span></div>
  <div className={styles.cards}>{cards.map(([key,value,rows,subtitle])=><div key={key}><KpiCard title={TERMS[key].title} value={value} subtitle={subtitle} definition={explain({...TERMS[key],eligible:rows.length})}/><button className={styles.cardLink} onClick={()=>open(TERMS[key].title,rows)}>Ver {rows.length} registros</button></div>)}</div>
  <FilterBar state={state} dispatch={dispatch} total={data.total}/>
  <p className={styles.note}><strong data-testid="components-total">{data.total}</strong> chamados filtrados · {data.count} associados · {data.unassigned} sem componente. <strong>Componente associado não comprova peça consumida ou recomendação de troca.</strong> Unidade, Componente Principal, Categoria e Recorrência em Mais filtros.</p>
  <Panel title="Carteira de componentes e ocorrências" definition={info('portfolio')} description="Carteira → Componente → Equipamento → Ocorrência → Histórico → Insight. Todos os valores representam o recorte filtrado.">
   {table.total?<div className={styles.tableViewport}><DataTable label="Tabela de componentes" columns={columns} rows={table.rows} sortField={componentUi.sort} sortDirection={componentUi.direction} onSort={sort}/></div>:<EmptyState onClear={()=>dispatch({type:'reset'})}/>}
   <Pagination {...table} pageSize={componentUi.size} onPage={page=>setComponentUi(ui=>({...ui,page}))} onPageSize={size=>setComponentUi(ui=>({...ui,size:Number(size),page:1}))}/>
  </Panel>
  <div className={styles.grid}>
   {chart('Ocorrências por componente',data.groups,g=>g.count,numberLabel,info('portfolio',data.rows),setComponent)}
   <Panel title="Disponibilidade por depósito" definition={external(COMPONENT_EXTERNAL[0])}><ExternalMetric definition={external(COMPONENT_EXTERNAL[0])}/><p className={styles.note}>ERP/WMS, saldos e reservas necessários. Não há depósitos ou percentuais de disponibilidade na fonte.</p></Panel>
   {chart('Categorias das ocorrências',data.categories,g=>g.count,numberLabel,groupDefinition('Categorias das ocorrências','Categoria do Chamado'),g=>open('Categoria · '+g.label,g.rows))}
   {chart('Falhas associadas',data.failures,g=>g.count,numberLabel,groupDefinition('Falhas associadas','Falha'),g=>open('Falha · '+g.label,g.rows))}
   {chart('Contratos com ocorrências associadas',data.contracts,g=>g.count,numberLabel,groupDefinition('Contratos com ocorrências associadas','Contrato'),g=>open('Contrato · '+g.label,g.rows))}
   {chart('Clientes com ocorrências associadas',data.clients,g=>g.count,numberLabel,groupDefinition('Clientes com ocorrências associadas','Cliente'),g=>open('Cliente · '+g.label,g.rows))}
   {chart('Custos associados por componente',[...data.groups].sort((a,b)=>(b.cost.value??-1)-(a.cost.value??-1)||a.label.localeCompare(b.label,'pt-BR')),g=>g.cost.value,currencyLabel,info('cost',data.rows),setComponent)}
   <Panel title="Evolução diária das ocorrências associadas" definition={info('days',data.rows)}><ExecutiveChart days={data.days} series={[{label:'Ocorrências',color:'#1973db',value:d=>d.total}]} valueLabel={numberLabel} label="Ocorrências de componentes" onDay={d=>open('Ocorrências em '+civilLabel(d.date),d.rows)}/></Panel>
   <Panel title="Criticidade dos chamados associados" definition={info('critical',data.rows)}><div className={styles.colorButtons}>{data.risk.colors.map(g=><button key={g.label} className={styles.link} onClick={()=>open(g.label+' · componentes',g.rows)}><CriticalityBadge value={g.label}/> {g.rows.length}</button>)}</div><p className={styles.note}>{data.risk.active.length} prioridades não concluídas Laranja/Vermelho na referência. Cores históricas não classificam estoque.</p></Panel>
   <Panel title="Investigação de recorrências e padrões" definition={info('patterns',data.rows)}><p>{data.risk.units} unidades em {data.risk.recurrent.length} chamados com recorrência ≥3. Examinar equipamento, componente, categoria e contexto técnico antes de recomendar intervenção.</p><button className={styles.link} onClick={()=>open('Recorrência elevada dos componentes',data.risk.recurrent)}>Examinar recorrências e insights</button><p className={styles.note}>Sugestão demonstrativa de investigação; sem diagnóstico causal, previsão ML ou compra automática.</p></Panel>
  </div>
  <Panel title="Informações necessárias para recomendações logísticas" definition={external(COMPONENT_EXTERNAL[2])}><div className={styles.grid}>{COMPONENT_EXTERNAL.slice(1).map(metric=><ExternalMetric key={metric.title} definition={external(metric)}/>)}</div><p className={styles.note}>Depósitos/saldos, catálogo/compatibilidade e diagnóstico, consumo/preços e transporte são fontes ainda não conectadas. A página não executa movimentação, compra, reserva ou despacho.</p></Panel>
  <p className={shared.sourceFooter}>Dados sintéticos acadêmicos · HIST_60_DIAS. Componentes e falhas são associações BASE, sem causalidade comprovada. Custos dos chamados não são preços de peças. Estoque/consumo/ETA logístico EXT; Supervisor e snapshots separados. <a href="#/equipamentos">Equipamentos</a> · <a href="#/chamados">Chamados</a> — filtros preservados.</p>
  {component&&<Dialog wide title={'Componente '+component.label} onClose={()=>setComponent(null)}>
   <p className={styles.breadcrumb}>Carteira → Componente → Equipamento → Ocorrência → Histórico → Insight</p><p>{component.count} chamados associados · {component.units} equipamentos · {component.contracts} contratos · {component.clients.length} clientes no recorte. Não comprova consumo de peça.</p>
   <IndicatorInfo definition={info('portfolio',component.rows)}/>
   <div className={styles.detailCards}>{[
    ['occurrences',component.count,component.rows],['cost',currencyLabel(component.cost.value),component.cost.rows],['recurrence',percentLabel(component.recurrence.value),component.recurrence.rows],['critical',component.risk.red.length,component.risk.red],['ta',numberLabel(component.ta.value),component.ta.rows],['tb',numberLabel(component.tb.value),component.tb.rows],['sla',percentLabel(component.adherence.value),component.adherence.rows]
   ].map(([key,value,rows])=><div key={key}><KpiCard title={TERMS[key].title} value={value} subtitle={key==='recurrence'?component.recurrence.count+'/'+component.count+' positivos · cobertura '+component.recurrence.valid+'/'+component.count:key==='sla'?component.adherence.within.length+'/'+component.adherence.count+' cumprem · '+component.adherence.count+'/'+component.count+' elegíveis':'N/suporte '+rows.length+'/'+component.count} definition={explain({...TERMS[key],eligible:key==='recurrence'?component.recurrence.valid:rows.length},component.rows)}/><button className={styles.cardLink} onClick={()=>open(component.label+' · '+TERMS[key].title,rows)}>Ver {rows.length} registros</button></div>)}</div>
   <Panel title="Contexto técnico do componente" definition={info('patterns',component.rows)}>{technical(component.rows)}</Panel>
   <Panel title="Concentração por cliente e contrato" definition={explain({...TERMS.portfolio,calculation:'Agrupar Cliente e Contrato nos chamados deste componente; contagens separadas, sem somar grupos de campos distintos.'},component.rows)}>{['Cliente','Contrato'].map(field=><div key={field}><h3>{field}</h3><div className={styles.groupLinks}>{groupRecords(component.rows,field).map(g=><button key={g.label} className={styles.link} onClick={()=>open(field+' · '+g.label,g.rows)}>{g.label} ({g.count})</button>)}</div></div>)}</Panel>
   <Panel title="Equipamentos do componente" definition={info('units',component.rows)}><div className={styles.unitList}>{equipment.map(g=><article key={g.label}><button className={styles.link} aria-label={'Abrir equipamento '+g.label} onClick={()=>setUnit(g)}>{g.label}</button><p>{g.count} chamados · recorrência máxima {numberLabel(g.maxRecurrence)} · último valor {numberLabel(g.latest.Recorrencia_30d)} · cobertura {g.recurrenceCoverage}/{g.count}</p></article>)}</div></Panel>
   <details><summary>Insights do componente · BASE</summary><IndicatorInfo definition={info('patterns',component.rows)}/>{insights(component.rows)}</details>
   <RecordExplorer label="Ocorrências do componente" rows={component.rows} onDetail={setSelected}/>
  </Dialog>}
  {unit&&<Dialog wide title={'Equipamento '+unit.label+' · ocorrências do componente'} onClose={()=>setUnit(null)}><p>Histórico dentro do componente selecionado e dos filtros atuais: {unit.count} chamados. Sem ampliar silenciosamente para outros componentes.</p><IndicatorInfo definition={info('units',unit.rows)}/><p>Máximo registrado: {numberLabel(unit.maxRecurrence)} · último valor: {numberLabel(unit.latest.Recorrencia_30d)} · cobertura {unit.recurrenceCoverage}/{unit.count}; não somar como eventos novos.</p><RecordExplorer label="Ocorrências do equipamento no componente" rows={unit.history} onDetail={setSelected}/><details open><summary>Histórico cronológico — criação descendente</summary><ol className={styles.history}>{unit.history.map(row=><li key={row.ID_Chamado}><time>{dateLabel(row['Criado em'])}</time> · <button className={styles.link} onClick={()=>setSelected(row)}>{row.ID_Chamado}</button> · <CriticalityBadge value={row.Criticidade_ORQUESTRA}/><p>{row['Categoria do Chamado']} · {row.Falha}</p><details><summary>Insight da ocorrência · BASE</summary><p>{row.Insight_ORQUESTRA}</p></details></li>)}</ol></details><button className={styles.link} onClick={()=>open('Histórico e insights · '+unit.label,unit.history)}>Examinar histórico e insights</button></Dialog>}
  {drill&&<Dialog wide title={drill.title} onClose={()=>setDrill(null)}><p>{drill.rows.length} registros de suporte do contexto filtrado.</p><IndicatorInfo definition={info('patterns',drill.rows)}/><RecordExplorer label="Suporte dos componentes" rows={drill.rows} onDetail={setSelected}/><details><summary>Insights dos registros · BASE</summary>{insights(drill.rows)}</details></Dialog>}
  {selected&&<ChamadoDetail row={selected} onClose={()=>setSelected(null)} onEquipment={openEquipment}/>}
  {insight&&<Dialog wide title="Insight do componente" onClose={()=>setInsight(null)}><p>BASE · sintético · {insight.label}</p><p>Associação não comprova causa nem necessidade de substituição de material.</p><RecordExplorer label="Ocorrências do insight de componentes" rows={insight.rows} onDetail={setSelected}/></Dialog>}
 </div>;
}
