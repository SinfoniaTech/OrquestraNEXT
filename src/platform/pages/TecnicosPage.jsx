import {useMemo,useState} from 'react';
import {useConsultation} from '../filters/ConsultationContext.jsx';
import {technicianAnalysis,technicianGroups,technicianPage,technicianDefinition,TECHNICIAN_TERMS as TERMS,TECHNICIAN_EXTERNAL} from '../services/tecnicos.js';
import {equipmentAnalysis} from '../services/equipamentos.js';
import {groupRecords,numberLabel,percentLabel} from '../services/sla.js';
import {externalDefinition,currencyLabel} from '../services/performance.js';
import {SOURCE,civilLabel,dateLabel} from '../services/chamados.js';
import {FilterBar,KpiCard,IndicatorInfo,Dialog,Pagination,EmptyState,CriticalityBadge} from '../components/ConsultationUI.jsx';
import DataTable from '../components/DataTable.jsx';
import GroupChart from '../components/GroupChart.jsx';
import RecordExplorer from '../components/RecordExplorer.jsx';
import ExternalMetric from '../components/ExternalMetric.jsx';
import ChamadoDetail from './ChamadoDetail.jsx';
import shared from '../components/Consultation.module.css';
import styles from './TecnicosPage.module.css';
function Panel({title,definition,children,description}){return <section className={styles.panel} aria-label={title}><div className={styles.heading}><div><h2>{title}</h2>{description&&<p>{description}</p>}</div><IndicatorInfo definition={definition}/></div>{children}</section>;}
function TechnicianTable({rows,ui,onSort,onTechnician,label='Tabela de técnicos'}){
 const columns=[{key:'name',label:'Técnico',sortKey:'name',render:g=><button className={styles.link} onClick={()=>onTechnician(g)} aria-label={'Abrir técnico '+g.label}>{g.label}</button>},
 ...[['area','Área','areas'],['supervisor','Supervisor','supervisors'],['route','Rota','routes']].map(([key,label,field])=>({key,label,sortKey:key,render:g=>g[field].length===1?g[field][0]:<details><summary>{g[field].length} vínculos</summary>{g[field].map(v=><small key={v}>{v}</small>)}</details>})),
 {key:'count',label:'Chamados vinculados',sortKey:'count',render:g=>g.count},{key:'completed',label:'Concluídos',sortKey:'completed',render:g=>g.completed.length},
 ...[['ta','TA médio (min)'],['tb','TB médio (min)']].map(([key,label])=>({key,label,sortKey:key,render:g=><>{numberLabel(g[key].value)}<small>N {g[key].count}/{g.count} · {g[key].excluded} ausentes/inválidos</small></>})),
 {key:'elevated',label:'Criticidade elevada',sortKey:'elevated',render:g=><>{g.elevated.length}<small>Laranja/Vermelho históricos</small></>},
 {key:'cost',label:'Custo estimado associado',sortKey:'cost',render:g=><>{currencyLabel(g.cost.value)}<small>N {g.cost.count}/{g.count}</small></>},
 {key:'action',label:'Ação',render:g=><button className={styles.link} onClick={()=>onTechnician(g)} aria-label={'Detalhar técnico '+g.label}>Ver ↗</button>}];
 return <div className={styles.tableViewport}><DataTable label={label} columns={columns} rows={rows} sortField={ui.sort} sortDirection={ui.direction} onSort={onSort}/></div>;
}
export default function TecnicosPage(){
 const {state,dispatch,view,technicianUi,setTechnicianUi}=useConsultation();
 const data=useMemo(()=>technicianAnalysis(view.records),[view.records]),table=technicianPage(data.technicians,technicianUi);
 const [area,setArea]=useState(null),[technician,setTechnician]=useState(null),[unit,setUnit]=useState(null),[drill,setDrill]=useState(null),[selected,setSelected]=useState(null),[insight,setInsight]=useState(null);
 const scopeView=rows=>({...view,records:rows,summary:{...view.summary,total:rows.length}});
 const explain=(config,rows=view.records)=>{
  const scoped={...state,filters:{...state.filters}};
  if(rows!==view.records)for(const field of ['Técnico','Área','Supervisor','Rota','Unidade']){
   const values=[...new Set(rows.map(r=>r[field]).filter(v=>v!=null&&v!==''))];
   if(values.length===1)scoped.filters[field]=values;
  }
  return technicianDefinition(config,scoped,scopeView(rows));
 };
 const externalInfo=metric=>({...externalDefinition(metric,state,view),calculation:'Indisponível: nenhuma fórmula aplicada ou valor simulado. O recorte histórico contextualiza a explicação; não comprova cobertura da fonte externa.',sourceFile:'Fonte externa não conectada; nenhum cadastro operacional disponibilizado'});
 const info=(key,rows)=>explain(TERMS[key],rows);
 const open=(title,rows)=>setDrill({title,rows});
 const sort=field=>setTechnicianUi(ui=>({...ui,sort:field,direction:ui.sort===field&&ui.direction==='asc'?'desc':'asc',page:1}));
 const openUnit=row=>{const g=equipmentAnalysis(view.records.filter(r=>r.Unidade===row.Unidade),view.period).units[0];if(g)setUnit(g);};
 const metrics=(g)=>[
 ['assigned',g.count,g.count+' chamados vinculados',g.rows],['completed',g.completed.length,g.completed.length+'/'+g.count+' concluídos',g.completed],
 ['ta',numberLabel(g.ta.value),g.ta.count+'/'+g.count+' válidos · '+g.ta.excluded+' ausentes/inválidos',g.ta.rows],
 ['tb',numberLabel(g.tb.value),g.tb.count+'/'+g.count+' válidos · '+g.tb.excluded+' ausentes/inválidos',g.tb.rows],
 ['cost',currencyLabel(g.cost.value),g.cost.count+'/'+g.count+' válidos · '+g.cost.excluded+' ausentes/inválidos',g.cost.rows]
 ];
 const metricCards=(entries,rows)=>entries.map(([key,value,subtitle,support])=><div key={key}><KpiCard title={TERMS[key].title} value={value} subtitle={subtitle} definition={explain({...TERMS[key],eligible:support.length},rows)}/><button className={styles.cardLink} onClick={()=>open(TERMS[key].title,support)}>Ver {support.length} registros</button></div>);
 const chart=(title,groups,value,format,definition,onGroup,label=title)=><Panel title={title} definition={definition}><GroupChart groups={groups} value={value} valueLabel={format} label={label} onGroup={onGroup}/></Panel>;
 const chartDefinition=(title,fields,calculation)=>explain({title,fields,definition:'Análise dos atendimentos vinculados no contexto filtrado. Comparação descritiva; volume/tempo não classifica produtividade ou eficiência individual. Considerar complexidade, área, rota e categoria.',calculation,unit:'chamados, minutos ou R$ conforme indicador'});
 const groupTime=(key)=>[...data.technicians].filter(g=>g[key].count).sort((a,b)=>b[key].value-a[key].value||a.label.localeCompare(b.label,'pt-BR'));
 const patterns=rows=><><IndicatorInfo definition={info('patterns',rows)}/>{['Categoria do Chamado','Componente Principal','Falha','Insight_ORQUESTRA'].map(field=><details key={field}><summary>{field} · BASE / contagem CALC</summary><div className={styles.groupLinks}>{groupRecords(rows,field).map(g=><button key={g.label} className={styles.link} onClick={()=>field==='Insight_ORQUESTRA'?setInsight(g):open(field+' · '+g.label,g.rows)}>{g.label} ({g.count})</button>)}</div></details>)}</>;
 return <div className={shared.consultation}>
  <div className={shared.referenceLine}><span>HISTÓRICO · {SOURCE}</span><span>{civilLabel(view.period.from)}–{civilLabel(view.period.to)} · referência 06/10/2026 às 22h (São Paulo)</span></div>
  <div className={styles.cards}>
   {metricCards([['technicians',data.technicians.length,'Nomes identificados · não quadro ativo',data.rows],...metrics(data).map(e=>e[0]==='assigned'?[e[0],e[1],data.count+'/'+data.total+' vinculados · '+data.unassigned+' sem técnico',e[3]]:e)],view.records)}
   <div className={styles.externalCard}><ExternalMetric definition={externalInfo(TECHNICIAN_EXTERNAL[0])}/><p>Informação não disponibilizada. Sem inferência de capacidade por chamados em andamento.</p></div>
  </div>
  <FilterBar state={state} dispatch={dispatch} total={data.total}/>
  <p className={styles.note}><strong data-testid="technicians-total">{data.total}</strong> chamados filtrados · {data.count} vinculados · {data.unassigned} sem técnico. Análise da operação, sem avaliação automatizada de trabalhadores. Tempos e custos referem-se aos vinculados.</p>
  <Panel title="Técnicos — Capacidade e Performance Operacional" definition={info('links')} description="Vínculos observados nos atendimentos; não cadastro permanente. Explore Área → Técnico → Atendimentos → Equipamento → Chamado → Insight.">
   {table.total?<TechnicianTable rows={table.rows} ui={technicianUi} onSort={sort} onTechnician={setTechnician}/>:<EmptyState onClear={()=>dispatch({type:'reset'})}/>}
   <Pagination {...table} pageSize={technicianUi.size} onPage={page=>setTechnicianUi(ui=>({...ui,page}))} onPageSize={size=>setTechnicianUi(ui=>({...ui,size:Number(size),page:1}))}/>
  </Panel>
  <div className={styles.grid}>
   {chart('Distribuição histórica por status',data.statuses,g=>g.count,numberLabel,info('status',data.rows),g=>open(g.label,g.rows))}
   <Panel title="Operação na referência temporal" definition={info('status',data.rows)} description="06/10/2026 às 22h · não representa disponibilidade atual da força de trabalho."><p>{data.active.length} chamados vinculados não concluídos · {data.active.filter(r=>['Laranja','Vermelho'].includes(r.Criticidade_ORQUESTRA)).length} Laranja/Vermelho não concluídos.</p><button className={styles.link} onClick={()=>open('Não concluídos na referência',data.active)}>Examinar operação na referência</button></Panel>
   {chart('Chamados por técnico',data.technicians,g=>g.count,numberLabel,chartDefinition('Chamados por técnico',['Técnico'],'Agrupar Técnico e contar chamados; contagem desc, nome asc no empate; não ranking de produtividade.'),setTechnician)}
   {chart('TA médio por técnico',groupTime('ta'),g=>g.ta.value,numberLabel,info('ta',data.rows),setTechnician)}
   {chart('TB médio por técnico',groupTime('tb'),g=>g.tb.value,numberLabel,info('tb',data.rows),setTechnician)}
   <Panel title="Cobertura das médias por técnico" definition={info('ta',data.rows)}><p>Valores em minutos. Complexidade, área, categoria e rota devem contextualizar a comparação. Menor TB não comprova melhor desempenho.</p><ul className={styles.typeNotes}>{data.technicians.map(g=><li key={g.label}>{g.label}: TA N {g.ta.count}/{g.count} · TB N {g.tb.count}/{g.count}</li>)}</ul></Panel>
   {chart('Chamados por área',data.areas,g=>g.count,numberLabel,chartDefinition('Chamados por área',['Área','Técnico'],'Agrupar Área dos chamados vinculados, contar registros e aprofundar até técnico.'),g=>setArea({...g,field:'Área'}))}
   {chart('Chamados por rota',data.routes,g=>g.count,numberLabel,chartDefinition('Chamados por rota',['Rota','Técnico'],'Agrupar Rota dos chamados vinculados, contar registros. Rota é declarada, não trajeto calculado.'),g=>setArea({...g,field:'Rota'}))}
   {chart('Chamados por supervisor',data.supervisors,g=>g.count,numberLabel,chartDefinition('Chamados por supervisor',['Supervisor','Técnico'],'Agrupar Supervisor observado no chamado, preservar vínculos múltiplos e contar registros.'),g=>setArea({...g,field:'Supervisor'}))}
   <Panel title="Criticidade dos atendimentos" definition={info('elevated',data.rows)}><GroupChart groups={data.colors} value={g=>g.count} valueLabel={numberLabel} label="Criticidade histórica" onGroup={g=>open(g.label,g.rows)}/><div className={styles.legend}>{data.colors.map(g=><CriticalityBadge key={g.label} value={g.label}/>)}</div><p className={styles.note}>Inclui concluídos. Cores BASE, sem classificação do profissional.</p></Panel>
   {chart('Custos dos atendimentos vinculados ao técnico',[...data.technicians].sort((a,b)=>(b.cost.value??-1)-(a.cost.value??-1)||a.label.localeCompare(b.label,'pt-BR')),g=>g.cost.value,currencyLabel,info('cost',data.rows),setTechnician)}
   <Panel title="Investigar desvios e recorrências" definition={info('patterns',data.rows)}><p>{data.adherence.over.length} chamados com SLA simulado excedido · {data.recurrence.count} com recorrência positiva. Associação não comprova causa nem responsabilidade do técnico.</p><button className={styles.link} onClick={()=>open('SLA simulado excedido',data.adherence.over)}>Investigar SLA excedido</button><p><button className={styles.link} onClick={()=>open('Recorrências dos atendimentos',data.recurrence.rows)}>Examinar recorrências e insights</button></p></Panel>
  </div>
  <Panel title="Dependências de integrações externas" definition={externalInfo(TECHNICIAN_EXTERNAL[0])}><div className={styles.grid}>{TECHNICIAN_EXTERNAL.slice(1).map(metric=><ExternalMetric key={metric.title} definition={externalInfo(metric)}/>)}</div></Panel>
  <p className={shared.sourceFooter}>Dados sintéticos acadêmicos · HIST_60_DIAS. Custos estimados dos chamados não representam remuneração. Disponibilidade, skills e capacidade reais EXT. Sem julgamento automatizado individual. Supervisor e snapshots independentes. <a href="#/visao-geral">Visão Geral</a> · <a href="#/equipamentos">Equipamentos</a> · <a href="#/chamados">Chamados</a> — filtros preservados.</p>
  {area&&<Dialog wide title={area.field+' · '+area.label} onClose={()=>setArea(null)}><p>{area.count} chamados no agrupamento filtrado. Vínculos observados, sem cadastro permanente.</p><IndicatorInfo definition={explain(TERMS.links,area.rows)}/><TechnicianTable label="Técnicos do agrupamento" rows={technicianPage(technicianGroups(area.rows),technicianUi).ordered} ui={technicianUi} onSort={sort} onTechnician={setTechnician}/></Dialog>}
  {technician&&<Dialog wide title={'Técnico '+technician.label} onClose={()=>setTechnician(null)}>
   <p className={styles.breadcrumb}>Área → Técnico → Atendimentos → Equipamento → Chamado → Insight</p>
   <p>{civilLabel(view.period.from)}–{civilLabel(view.period.to)} · vínculos observados no recorte, sem cadastro mestre.</p>
   <dl className={styles.identity}>{['Técnico','Área','Supervisor','Rota','Cliente','Contrato'].map(field=><div key={field}><dt>{field} · BASE</dt><dd>{groupRecords(technician.rows,field).map(g=>g.label).join(' · ')}</dd></div>)}</dl>
   <IndicatorInfo definition={info('links',technician.rows)}/>
   <div className={styles.detailCards}>{metricCards(metrics(technician),technician.rows)}<KpiCard title={TERMS.sla.title} value={percentLabel(technician.adherence.value)} subtitle={technician.adherence.within.length+'/'+technician.adherence.count+' elegíveis'} definition={info('sla',technician.rows)}/>{[['meanCost',technician.meanCost],['recurringCost',technician.recurringCost]].map(([key,m])=><KpiCard key={key} title={TERMS[key].title} value={currencyLabel(m.value)} subtitle={'N '+m.count+' válidos'} definition={info(key,technician.rows)}/>)}</div>
   <Panel title="Status e criticidade do técnico" definition={info('status',technician.rows)}><div className={styles.groupLinks}>{[...technician.statuses,...technician.colors].map(g=><button className={styles.link} key={g.label} onClick={()=>open(technician.label+' · '+g.label,g.rows)}>{g.label}: {g.count}</button>)}</div><IndicatorInfo definition={info('elevated',technician.rows)}/><p>{technician.active.length} não concluídos na referência · {technician.active.filter(r=>['Laranja','Vermelho'].includes(r.Criticidade_ORQUESTRA)).length} Laranja/Vermelho ainda não concluídos.</p><button className={styles.link} onClick={()=>open('SLA excedido · '+technician.label,technician.adherence.over)}>Ver {technician.adherence.over.length} registros com SLA excedido</button></Panel>
   <Panel title="Equipamentos atendidos" definition={explain({...TERMS.patterns,fields:['Unidade','Técnico'],calculation:'Agrupar Unidade nos chamados do técnico. Histórico do equipamento abre o recorte global filtrado; população ampliada explicitamente.'},technician.rows)}><div className={styles.groupLinks}>{groupRecords(technician.rows,'Unidade').map(g=><button key={g.label} className={styles.link} onClick={()=>openUnit(g.rows[0])}>Equipamento {g.label} ({g.count})</button>)}</div></Panel>
   <Panel title="Categorias, componentes e insights" definition={info('patterns',technician.rows)}><p>{technician.recurrence.count}/{technician.count} chamados com recorrência positiva · {technician.recurrence.valid} valores válidos. Não atribuir causa ao técnico.</p><button className={styles.link} onClick={()=>open('Recorrências · '+technician.label,technician.recurrence.rows)}>Examinar recorrências</button>{patterns(technician.rows)}</Panel>
   <RecordExplorer label="Atendimentos do técnico" rows={technician.rows} onDetail={setSelected}/>
  </Dialog>}
  {drill&&<Dialog wide title={drill.title} onClose={()=>setDrill(null)}><p>{drill.rows.length} registros de suporte do contexto.</p>{patterns(drill.rows)}<RecordExplorer label="Suporte dos técnicos" rows={drill.rows} onDetail={setSelected}/></Dialog>}
  {selected&&<ChamadoDetail row={selected} onClose={()=>setSelected(null)} onEquipment={openUnit}/>}
  {unit&&<Dialog wide title={'Equipamento '+unit.label+' · Histórico'} onClose={()=>setUnit(null)}><p>Histórico no recorte global filtrado: {unit.count} chamados. Inclui outros técnicos do mesmo equipamento quando presentes no recorte. Técnico/atendimento anteriores preservados ao fechar.</p><IndicatorInfo definition={explain({...TERMS.patterns,fields:['Unidade','Criado em','ID_Chamado'],calculation:'Filtrar Unidade no recorte global; criação desc, ID asc no empate. Campos e insights BASE; contagens CALC.'},unit.rows)}/><dl className={styles.identity}>{['Tipo de Unidade','Cliente','Contrato','Fabricante','Tipo Controle','Tipo Máquina'].map(field=><div key={field}><dt>{field} · BASE</dt><dd>{groupRecords(unit.rows,field).map(g=>g.label).join(' · ')}</dd></div>)}</dl><ol className={styles.history}>{unit.history.map(row=><li key={row.ID_Chamado}><time>{dateLabel(row['Criado em'])}</time> · <button className={styles.link} onClick={()=>{setUnit(null);setSelected(row);}}>{row.ID_Chamado}</button> · {row.Técnico??'Não informado'} · <CriticalityBadge value={row.Criticidade_ORQUESTRA}/><p>{row['Componente Principal']}</p><details><summary>Insight BASE do chamado</summary><p>{row.Insight_ORQUESTRA}</p></details></li>)}</ol><p><a href="#/equipamentos">Abrir página Equipamentos com os filtros atuais</a></p></Dialog>}
  {insight&&<Dialog wide title="Insight dos atendimentos" onClose={()=>setInsight(null)}><p>BASE · sintético · {insight.label}</p><p>Associação não comprova causa ou responsabilidade individual.</p><RecordExplorer label="Chamados do insight de técnicos" rows={insight.rows} onDetail={setSelected}/></Dialog>}
 </div>;
}
