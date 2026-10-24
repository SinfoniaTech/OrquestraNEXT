import {useMemo,useState} from 'react';
import {useConsultation} from '../filters/ConsultationContext.jsx';
import {costAnalysis,costGroups,costCalls,costTablePage,costDefinition,COST_TERMS as TERMS,COST_DIMENSIONS,COST_EXTERNAL,COST_FIELD} from '../services/custos.js';
import {currencyLabel,externalDefinition} from '../services/performance.js';
import {groupRecords,percentLabel,numberLabel} from '../services/sla.js';
import {SOURCE,civilLabel} from '../services/chamados.js';
import {FilterBar,KpiCard,IndicatorInfo,Dialog,Pagination,EmptyState} from '../components/ConsultationUI.jsx';
import DataTable from '../components/DataTable.jsx';
import RecordExplorer from '../components/RecordExplorer.jsx';
import GroupChart from '../components/GroupChart.jsx';
import ExecutiveChart from '../components/ExecutiveChart.jsx';
import ExternalMetric from '../components/ExternalMetric.jsx';
import ChamadoDetail from './ChamadoDetail.jsx';
import shared from '../components/Consultation.module.css';
import styles from './CustosPage.module.css';
function Panel({title,definition,children,description}){return <section className={styles.panel} aria-label={title}><div className={styles.heading}><div><h2>{title}</h2>{description&&<p>{description}</p>}</div><IndicatorInfo definition={definition}/></div>{children}</section>;}
const CARD_TONES=['blue','blue','blue','blue','blue'];
const DRILL_TONES={cost:'blue',mean:'blue',sla:'blue',recurrent:'blue'};
const coverage=cost=>cost.count+'/'+cost.total+' custos válidos';
export default function CustosPage(){
 const {state,dispatch,view,costUi,setCostUi}=useConsultation();
 const data=useMemo(()=>costAnalysis(view.records,view.period),[view.records,view.period]);
 const [dimension,setDimension]=useState('Contrato'),[path,setPath]=useState([]),[selected,setSelected]=useState(null);
 const groups=useMemo(()=>costGroups(view.records,dimension),[view.records,dimension]);
 const calls=useMemo(()=>costUi.mode==='calls'?costCalls(view.records):[],[view.records,costUi.mode]);
 const table=costTablePage(costUi.mode==='calls'?calls:data.groups,costUi);
 const explain=(config,rows=view.records)=>{
  const scope={...state,filters:{...state.filters}};
  if(rows!==view.records)for(const field of COST_DIMENSIONS){const values=[...new Set(rows.map(r=>r[field]).filter(v=>v!=null&&v!==''))];if(values.length===1)scope.filters[field]=values;}
  return costDefinition(config,scope,{...view,records:rows,summary:{...view.summary,total:rows.length}});
 };
 const info=(key,rows)=>explain(TERMS[key],rows);
 const open=(title,rows)=>setPath([{title,rows}]),deepen=(title,rows)=>setPath(old=>[...old,{title,rows}]);
 const sort=field=>setCostUi(ui=>({...ui,sort:field,direction:ui.sort===field&&ui.direction==='asc'?'desc':'asc',page:1}));
 const groupDefinition=(title,field,rows)=>explain({title,fields:[field,COST_FIELD],definition:'Custos estimados dos chamados agrupados por '+field+'. Associação não comprova causa. Técnico não representa remuneração.',calculation:'groupRecords + estimatedCost C3: somar custos válidos por grupo, zero informado incluído; sem custo válido indisponível. Ordenar soma decrescente, ausentes por último e texto crescente no empate. Agrupamentos incluem Não informado; cada ação mostra N válido/total e todos os registros do grupo.',unit:'R$'},rows);
 const cards=[
  {...TERMS.cost,value:currencyLabel(data.cost.value),subtitle:coverage(data.cost),rows:data.cost.rows},
  {...TERMS.mean,value:currencyLabel(data.mean.value),subtitle:data.mean.count+'/'+data.count+' chamados com custo',rows:data.mean.rows},
  {...TERMS.technician,value:currencyLabel(data.technicianCost.value),subtitle:data.technicianCount+' nomes · '+coverage(data.technicianCost),rows:data.technicianRows},
  {...TERMS.recurrent,value:currencyLabel(data.recurrentCost.value),subtitle:coverage(data.recurrentCost)+' · '+percentLabel(data.recurrentShare)+' do custo válido',rows:data.recurrence.rows},
  {...TERMS.pressureCount,value:data.risk.contracts,subtitle:data.risk.pressure.length+' registros Alto · não é prejuízo',rows:data.risk.pressure}
 ];
 const recurrenceDefinition=explain({...TERMS.recurrent,title:'Custos por recorrência informada',definition:'Partição operacional dos registros: positivos, zero e recorrência ausente/inválida. Não é composição contábil de custos.',calculation:TERMS.recurrent.calculation+' Não recorrentes: Recorrencia_30d =0; ausentes/negativos/inválidos: grupo separado. Somar custos válidos em cada grupo, mostrar custo/N no suporte. Não somar grupos como custos adicionais.'});
 const temporalDefinition=explain({title:'Custos e desempenho temporal',fields:[COST_FIELD,'TA','TB','Status','SLA_min','Percentual_SLA'],definition:'Comparação descritiva entre custos, tempos sintéticos e situação do SLA. Sem correlação estatística ou causalidade inferida.',calculation:'TA/TB: interseção de custo válido e tempo válido; médias de custo e tempo com o mesmo N pareado. SLA: grupos disjuntos dentro/fora dos concluídos elegíveis C1 e sem elegibilidade; média/custo/TA/TB com N independentes nos grupos. Fora do SLA não significa desvio financeiro ou de orçamento.',unit:'R$, min e %'});
 const columns=[
  {key:'id',label:costUi.mode==='calls'?'Chamado':'Contrato',sortKey:'contract',render:g=><button className={styles.link} aria-label={costUi.mode==='calls'?'Abrir chamado de custo '+g.label:'Abrir análise de custo '+g.label} onClick={()=>g.record?setSelected(g.record):open('Contrato '+g.label,g.rows)}>{g.label}</button>},
  ...(costUi.mode==='calls'?[{key:'contract',label:'Contrato',render:g=><button className={styles.link} onClick={()=>open('Contrato '+(g.record.Contrato??'Não informado'),view.records.filter(r=>r.Contrato===g.record.Contrato))}>{g.record.Contrato??'Não informado'}</button>}]:[]),
  {key:'client',label:'Cliente',sortKey:'client',render:g=>g.clients.join(' · ')},
  {key:'count',label:'Chamados',sortKey:'count',render:g=>g.count},
  {key:'cost',label:'Custo estimado',sortKey:'cost',render:g=><><button className={styles.link} onClick={()=>open('Custo · '+g.label,g.cost.rows)}>{currencyLabel(g.cost.value)}</button><small>{coverage(g.cost)}</small></>},
  {key:'mean',label:'Custo médio',sortKey:'mean',render:g=><><button className={styles.link} onClick={()=>open('Média · '+g.label,g.mean.rows)}>{currencyLabel(g.mean.value)}</button><small>N={g.mean.count}</small></>},
  {key:'recurrence',label:'Recorrentes',sortKey:'recurrence',render:g=><><button className={styles.link} onClick={()=>open('Recorrentes · '+g.label,g.recurrence.rows)}>{percentLabel(g.recurrence.value)}</button><small>{g.recurrence.count}/{g.count} · cobertura {g.recurrence.valid}/{g.count}</small></>},
  {key:'sla',label:'SLA simulado',sortKey:'sla',render:g=><><button className={styles.link} onClick={()=>open('SLA · '+g.label,g.adherence.rows)}>{percentLabel(g.adherence.value)}</button><small>{g.adherence.within.length}/{g.adherence.count} elegíveis</small></>},
  {key:'pressure',label:'Pressão operacional',sortKey:'pressure',render:g=>g.pressure},
  {key:'action',label:'Ação',render:g=><button className={styles.link} onClick={()=>open('Contexto de custo · '+g.label,g.rows)}>Analisar ↗</button>}
 ];
 const tableDefinition=explain({title:'Análise de custos por contrato ou chamado',fields:['Contrato','Cliente','ID_Chamado',COST_FIELD,'Recorrencia_30d','Status','SLA_min','Percentual_SLA','Impacto_Contrato'],definition:'Carteira completa ou chamados individuais; custos mais altos no início por padrão. Alto é pressão operacional, sem juízo financeiro.',calculation:'Reutilizar contractPage C4: ordenação antes de paginação 10/25/50, nulos por último e identificador crescente no desempate. Custo=soma válida, média=soma/N válido, recorrência=>0/total, SLA=C1 e pressão=C2/C4. Busca e filtros são os mesmos da consulta compartilhada.',unit:'R$, R$/chamado, % e chamados'});
 return <div className={shared.consultation}>
  <div className={shared.referenceLine}><span>HISTÓRICO · {SOURCE}</span><span>{civilLabel(view.period.from)}–{civilLabel(view.period.to)} · referência: 06/10/2026, 22h (São Paulo)</span></div>
  <div className={styles.cards}>{cards.map((card,i)=><KpiCard key={card.title} {...card} tone={CARD_TONES[i]} accent definition={explain(card)} action={{label:'Explorar '+card.rows.length+' chamados',onClick:()=>open(card.title,card.rows)}}/>)}</div>
  <div className={styles.external}><ExternalMetric definition={externalDefinition(COST_EXTERNAL[0],state,view)}/><p>EXT — Integração financeira necessária. Custos sintéticos de atendimentos não são valores realizados pela OTIS.</p></div>
  <FilterBar state={state} dispatch={dispatch} total={data.count}/>
  <p className={styles.note}><strong data-testid="costs-total">{data.count}</strong> chamados no recorte · {coverage(data.cost)} · {data.count-data.technicianRows.length} sem técnico informado. Sem metas ou orçamento aprovados, não se afirma desvio financeiro.</p>
  <div className={styles.grid}>
   <Panel title="Evolução diária dos custos estimados" definition={explain({...TERMS.cost,title:'Evolução diária dos custos estimados',fields:[COST_FIELD,'Criado em'],definition:'Coortes por criação, não competência financeira ou dia do pagamento.',calculation:TERMS.cost.calculation+' Reutilizar dailyEvolution/ExecutiveChart C2/C3: só dias civis do recorte (máximo 60); sem custo válido, lacuna.'})}>
    <ExecutiveChart days={data.days} compact series={[{label:'Custo estimado',color:'var(--bo-chart-1)',value:d=>d.cost.value}]} valueLabel={(v,axis)=>axis&&v!==null?(v/1000).toLocaleString('pt-BR',{maximumFractionDigits:1})+'k':currencyLabel(v)} label="Custo operacional diário" onDay={d=>open('Custo em '+civilLabel(d.date)+' · '+coverage(d.cost),d.rows)}/>
   </Panel>
   <Panel title="Custos por recorrência informada" definition={recurrenceDefinition}><GroupChart groups={data.recurrenceBuckets} value={g=>g.cost.value} valueLabel={currencyLabel} label="Custos por recorrência" onGroup={g=>open(g.label+' · '+coverage(g.cost),g.rows)}/><p className={styles.note}>Recorrentes: {data.recurrence.count}/{data.count} chamados; cobertura de recorrência {data.recurrence.valid}/{data.count}. Participação no custo válido: {percentLabel(data.recurrentShare)}. Recorte operacional; não parcela contábil adicional.</p></Panel>
  </div>
  <Panel title="Análise de custos por contrato ou chamado" definition={tableDefinition} description="Ordenação inicial: maior custo estimado. Aprofunde o contexto e os registros de suporte.">
   <div className={styles.controls}><label>Mostrar <select aria-label="Tipo de análise de custos" value={costUi.mode} onChange={e=>setCostUi(ui=>({...ui,mode:e.target.value,page:1,sort:'cost',direction:'desc'}))}><option value="contracts">Contratos</option><option value="calls">Chamados</option></select></label><button className={styles.link} onClick={()=>open('Desvios do SLA simulado · não financeiros',data.adherence.over)}>Examinar {data.adherence.over.length} concluídos fora do SLA</button></div>
   <div className={styles.columnInfo}>{['cost','mean','recurrence','sla','pressure'].map(key=><span key={key}>{TERMS[key].title}<IndicatorInfo definition={info(key)}/></span>)}</div>
   {table.total?<DataTable label="Tabela de análise de custos" limit={5} columns={columns} rows={table.rows} sortField={costUi.sort} sortDirection={costUi.direction} onSort={sort}/>:<EmptyState onClear={()=>dispatch({type:'reset'})}/>}
   <Pagination {...table} pageSize={costUi.size} onPage={page=>setCostUi(ui=>({...ui,page}))} onPageSize={size=>setCostUi(ui=>({...ui,size:Number(size),page:1}))}/>
  </Panel>
  <div className={styles.grid}>
   <Panel title="Distribuição dos custos estimados" definition={groupDefinition('Distribuição dos custos estimados',dimension)} description="Todos os grupos do recorte; a ordem considera soma de custos válidos.">
    <label className={styles.selector}>Analisar por <select aria-label="Agrupar custos por" value={dimension} onChange={e=>setDimension(e.target.value)}>{COST_DIMENSIONS.map(field=><option key={field}>{field}</option>)}</select></label><GroupChart groups={groups} value={g=>g.cost.value} valueLabel={currencyLabel} label={'Custo por '+dimension} limit={5} onGroup={g=>open(dimension+' · '+g.label+' · '+coverage(g.cost),g.rows)}/><p className={styles.note}>Custo associado a técnicos é dos chamados atribuídos, sem remuneração, disponibilidade ou horas de mão de obra inferidas.</p>
   </Panel>
   <Panel title="Composição financeira de custos" definition={externalDefinition(COST_EXTERNAL[1],state,view)}><ExternalMetric definition={externalDefinition({...COST_EXTERNAL[1],title:'Composição contábil indisponível'},state,view)}/><p className={styles.note}>Somente o custo agregado do chamado foi informado. Aberturas exigem fontes externas:</p><ul className={styles.sources}><li>Mão de obra — folha, apontamentos e custeio.</li><li>Peças — consumo, compras e estoque.</li><li>Deslocamento e logística — viagens, fretes e rotas realizadas.</li><li>Terceiros — contratos e documentos fiscais.</li><li>Apropriação de recorrências — ordens e regras financeiras.</li></ul><p className={styles.note}>Nenhuma fatia, valor ou proporção financeira foi estimada. Chamados recorrentes podem envolver qualquer componente de custo; os recortes não devem ser somados como parcelas.</p></Panel>
  </div>
  <details className={styles.disclosure} open><summary>Custos e desempenho temporal — análise descritiva</summary><Panel title="Custos e desempenho temporal" definition={temporalDefinition}>
   <div className={styles.pairs}>{data.pairs.map(pair=><article key={pair.field}><h3>{pair.field==='TA'?'TA — Tempo até a chegada':'TB — Tempo de resolução simulado'} × custo</h3><p><strong>{numberLabel(pair.meanTime.value)} min</strong> · custo médio {currencyLabel(pair.meanCost.value)}</p><p>N pareado: {pair.rows.length}/{data.count} chamados com custo e {pair.field} válidos.</p><button className={styles.link} onClick={()=>open(pair.field+' e custo válidos',pair.rows)}>Ver pares de {pair.field}</button></article>)}</div>
   <div className={styles.tableScroll}><table className={styles.temporal} aria-label="Custos e tempos por elegibilidade SLA"><thead><tr><th>População SLA</th><th>Chamados</th><th>Custo estimado</th><th>Custo médio</th><th>TA médio (min)</th><th>TB médio (min)</th></tr></thead><tbody>{data.performance.map(g=><tr key={g.label}><td><button className={styles.link} onClick={()=>open(g.label,g.rows)}>{g.label}</button></td><td>{g.count}</td><td>{currencyLabel(g.cost.value)}<small>{coverage(g.cost)}</small></td><td>{currencyLabel(g.mean.value)}<small>N={g.mean.count}</small></td><td>{numberLabel(g.ta.value)}<small>N={g.ta.count}</small></td><td>{numberLabel(g.tb.value)}<small>N={g.tb.count}</small></td></tr>)}</tbody></table></div><p className={styles.note}>Grupos SLA disjuntos. Médias dos grupos usam N independente; pares acima exigem custo e tempo válidos simultaneamente. Nenhuma causalidade ou correlação estatística inferida.</p>
  </Panel></details>
  <Panel title="Oportunidades de investigação" definition={explain({title:'Oportunidades de investigação',fields:[COST_FIELD,'Recorrencia_30d','Impacto_Contrato','Motivo_Criticidade','Insight_ORQUESTRA'],definition:'Sugestões demonstrativas apoiadas por registros, sem meta/orçamento aprovado ou previsão de economia.',calculation:'Custo recorrente: regra >0 C4. Desvios: concluídos fora do SLA C1. Contratos: custos ordenados por soma válida. Textos de insight fornecidos são BASE sintética. Grupos podem se sobrepor; não somar como economia.',unit:'R$ e chamados'})}>
   <div className={styles.insights}><article><h3>Revisar repetição</h3><p>{currencyLabel(data.recurrentCost.value)} associados a {data.recurrence.count} chamados com recorrência positiva. Investigar componentes e equipamentos.</p><button className={styles.link} onClick={()=>open('Investigação de recorrências',data.recurrence.rows)}>Examinar recorrentes</button></article><article><h3>Examinar desvios do SLA simulado</h3><p>{data.adherence.over.length} concluídos elegíveis acima de 100% de consumo. Não significa estouro financeiro.</p><button className={styles.link} onClick={()=>open('Desvios do SLA simulado · não financeiros',data.adherence.over)}>Examinar desvios de SLA</button></article></div>
   <p className={styles.note}><a href="#/contratos-margem">Contratos & Margem</a> · <a href="#/visao-geral">Visão Geral</a> · <a href="#/chamados">Chamados</a> — filtros e busca permanecem na navegação.</p>
  </Panel>
  <p className={shared.sourceFooter}>HIST_60_DIAS · dados sintéticos acadêmicos. Custo estimado não é custo realizado OTIS, remuneração ou TCO completo. Sem composição financeira, causalidade ou economia comprovada. TA/TB e SLA seguem definições demonstrativas aprovadas. Supervisor e snapshots independentes.</p>
  {path.map((node,index)=><CostDrill key={index} node={node} period={view.period} explain={explain} onClose={()=>setPath(old=>old.slice(0,-1))} onGroup={deepen} onDetail={setSelected}/>)}
  {selected&&<ChamadoDetail row={selected} onClose={()=>setSelected(null)}/>}
 </div>;
}
function CostDrill({node,period,explain,onClose,onGroup,onDetail}){
 const data=useMemo(()=>costAnalysis(node.rows,period),[node.rows,period]);
 const groupInfo=(field)=>explain({title:'Custo por '+field,fields:[field,COST_FIELD],definition:'Custos agregados dos chamados deste contexto; sem causalidade comprovada.',calculation:'Agrupar '+field+' e somar custos válidos com a regra C3; exibir N válido/total e acesso aos registros. Ausentes agrupados em Não informado.',unit:'R$'},node.rows);
 return <Dialog wide title={node.title} onClose={onClose}>
  <p className={styles.breadcrumb}>Custo estimado → desvio de SLA ou concentração de custo → contrato → equipamento → chamado → insight</p><p>{node.rows.length} chamados no contexto · {civilLabel(period.from)} a {civilLabel(period.to)} · {coverage(data.cost)}. Sem desvio financeiro inferido.</p>
  <div className={styles.detailCards}>{[['cost',currencyLabel(data.cost.value),coverage(data.cost)],['mean',currencyLabel(data.mean.value),'N='+data.mean.count],['sla',percentLabel(data.adherence.value),data.adherence.within.length+'/'+data.adherence.count+' elegíveis'],['recurrent',currencyLabel(data.recurrentCost.value),coverage(data.recurrentCost)]].map(([key,value,subtitle])=><KpiCard key={key} title={TERMS[key].title} value={value} subtitle={subtitle} tone={DRILL_TONES[key]} accent definition={explain(TERMS[key],node.rows)}/>)}</div>
  {data.adherence.over.length>0&&data.adherence.over.length<node.rows.length&&<p><button className={styles.link} onClick={()=>onGroup('Desvios do SLA simulado · neste contexto',data.adherence.over)}>Examinar desvios de SLA deste contexto ({data.adherence.over.length})</button></p>}
  <details open><summary>Contratos e equipamentos deste contexto</summary><div className={styles.grid}>{['Contrato','Unidade'].map(field=><Panel key={field} title={'Custo por '+field} definition={groupInfo(field)}><GroupChart groups={costGroups(node.rows,field)} value={g=>g.cost.value} valueLabel={currencyLabel} label={'Aprofundar '+field} limit={5} onGroup={g=>onGroup((field==='Unidade'?'Equipamento':'Contrato')+' '+g.label,g.rows)}/></Panel>)}</div></details>
  <details><summary>Insights sintéticos fornecidos · BASE</summary><p className={styles.note}>Associações históricas não comprovam causa. Campos fornecidos mantêm texto original.</p>{groupRecords(node.rows,'Insight_ORQUESTRA').map(g=><p key={g.label}><button className={styles.link} onClick={()=>onGroup('Insight fornecido · '+g.label,g.rows)}>{g.label} · {g.count} chamados</button></p>)}</details>
  <RecordExplorer label="Chamados da análise de custos" rows={node.rows} onDetail={onDetail}/>
 </Dialog>;
}
