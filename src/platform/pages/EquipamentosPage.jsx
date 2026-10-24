import {useMemo,useState} from 'react';
import {useConsultation} from '../filters/ConsultationContext.jsx';
import {equipmentAnalysis,equipmentPage,equipmentDefinition,EQUIPMENT_TERMS as TERMS,EQUIPMENT_AVAILABILITY} from '../services/equipamentos.js';
import {externalDefinition,currencyLabel} from '../services/performance.js';
import {SOURCE,CRITICALITY_ORDER,civilLabel,dateLabel} from '../services/chamados.js';
import {groupRecords,validNumber,numberLabel,percentLabel} from '../services/sla.js';
import {FilterBar,KpiCard,IndicatorInfo,Dialog,Pagination,EmptyState,CriticalityBadge} from '../components/ConsultationUI.jsx';
import DataTable from '../components/DataTable.jsx';
import RecordExplorer from '../components/RecordExplorer.jsx';
import GroupChart from '../components/GroupChart.jsx';
import ExecutiveChart from '../components/ExecutiveChart.jsx';
import ExternalMetric from '../components/ExternalMetric.jsx';
import ChamadoDetail from './ChamadoDetail.jsx';
import shared from '../components/Consultation.module.css';
import styles from './EquipamentosPage.module.css';
const CHART_LIMIT=5; // barras visíveis nos gráficos antes de "Ver mais itens…"
const COLLAPSED_ROWS=5; // linhas visíveis da tabela antes de "Ver mais itens…"
function Panel({title,definition,description,children}){return <section className={styles.panel} aria-label={title}><div className={styles.heading}><div><h2>{title}</h2>{description&&<p>{description}</p>}</div><IndicatorInfo definition={definition}/></div>{children}</section>;}
function UnitTable({rows,ui,onSort,onUnit,label='Tabela de equipamentos'}){
 const columns=[
  {key:'unit',label:'Unidade',sortKey:'unit',render:g=><button className={styles.link} aria-label={'Abrir unidade '+g.label} onClick={()=>onUnit(g)}>{g.label}</button>},
  {key:'client',label:'Cliente',sortKey:'client',render:g=>g.clients.join(' · ')},
  {key:'type',label:'Tipo de equipamento',sortKey:'type',render:g=>g.types.join(' · ')},
  {key:'component',label:'Componentes predominantes',render:g=>g.components.slice(0,2).map(c=><small key={c.label}>{c.label} ({c.count})</small>)},
  {key:'count',label:'Chamados no período',sortKey:'count',render:g=>g.count},
  {key:'registered',label:'Recorrência registrada',sortKey:'registered',render:g=><><strong>Máx. {numberLabel(g.maxRecurrence)}</strong><small>Último: {validNumber(g.latest.Recorrencia_30d)?g.latest.Recorrencia_30d:'Não informado'}</small><small>{g.recurrenceCoverage}/{g.count} válidos</small></>},
  {key:'last',label:'Última ocorrência',sortKey:'last',render:g=>dateLabel(g.latest['Criado em'])},
  {key:'criticality',label:'Cor da última ocorrência',sortKey:'criticality',render:g=><CriticalityBadge value={g.latest.Criticidade_ORQUESTRA??'Não informado'}/>},
  {key:'insight',label:'Insight ORQUESTRA',render:g=><details className={styles.inlineDetail}><summary>Insight BASE do último chamado</summary><p>{g.latest.Insight_ORQUESTRA??'Não informado'}</p></details>},
  {key:'action',label:'Ação',render:g=><button className={styles.link} aria-label={'Detalhar unidade '+g.label} onClick={()=>onUnit(g)}>Detalhar ↗</button>}
 ];
 return <DataTable label={label} columns={columns} rows={rows} sortField={ui.sort} sortDirection={ui.direction} onSort={onSort}/>;
}
function Insights({groups,onInsight}){return <div className={styles.insightList}>{groups.map(g=><article key={g.label}><p><span className={styles.base}>BASE · sintético</span> {g.label}</p><button className={styles.link} onClick={()=>onInsight(g)}>Ver {g.count} chamados associados ao insight</button></article>)}{!groups.length&&<p>Nenhum insight neste contexto.</p>}</div>;}
export default function EquipamentosPage(){
 const {state,dispatch,view,equipmentUi,setEquipmentUi}=useConsultation();
 const data=useMemo(()=>equipmentAnalysis(view.records,view.period),[view.records,view.period]);
 const table=equipmentPage(data.units,equipmentUi);
 const [typeGroup,setTypeGroup]=useState(null),[unit,setUnit]=useState(null),[drill,setDrill]=useState(null),[insight,setInsight]=useState(null),[selected,setSelected]=useState(null),[tableOpen,setTableOpen]=useState(false);
 const canCollapse=table.rows.length>COLLAPSED_ROWS,collapsed=canCollapse&&!tableOpen;
 const typeData=useMemo(()=>typeGroup?equipmentAnalysis(typeGroup.rows,view.period):null,[typeGroup,view.period]);
 const explain=(config,rows=view.records)=>{
  const scope={...state,filters:{...state.filters}};
  if(rows!==view.records)for(const field of ['Unidade','Tipo de Unidade','Componente Principal']){const values=[...new Set(rows.map(r=>r[field]).filter(v=>v!=null&&v!==''))];if(values.length===1)scope.filters[field]=values;}
  return equipmentDefinition(config,scope,{...view,records:rows,summary:{...view.summary,total:rows.length}});
 };
 const info=(key,rows)=>explain(TERMS[key],rows);
 const open=(title,rows)=>setDrill({title,rows});
 const sort=field=>setEquipmentUi(ui=>({...ui,sort:field,direction:ui.sort===field&&ui.direction==='asc'?'desc':'asc',page:1}));
 const cards=[
  {...TERMS.units,value:data.unitCount,subtitle:'Presença no recorte · não parque instalado',rows:view.records.filter(r=>r.Unidade!=null&&r.Unidade!=='')},
  {...TERMS.elevated,value:data.risk.units,subtitle:'Algum registro ≥ 3 · não soma de eventos',rows:data.risk.recurrent},
  {...TERMS.occurrences,value:data.total,subtitle:'Todos os status · registros encontrados',rows:view.records},
  {...TERMS.types,value:data.typeCount,subtitle:'Tipos presentes nos chamados filtrados',rows:view.records.filter(r=>r['Tipo de Unidade']!=null&&r['Tipo de Unidade']!=='')}
 ];
 const tableDefinition=explain({title:'Equipamentos com maior recorrência',fields:['Unidade','Cliente','Tipo de Unidade','Componente Principal','Criado em','ID_Chamado','Recorrencia_30d','Criticidade_ORQUESTRA','Insight_ORQUESTRA'],definition:'Uma linha por unidade no recorte. Componentes predominantes por contagem; cor e insight são do último chamado por criação, não diagnóstico atual do equipamento.',calculation:TERMS.registered.calculation+' Ordem padrão: máximo registrado desc, Unidade asc no empate. Alternativas por volume, data, cliente, tipo e cor da última ocorrência. Ausentes por último, ordenação antes da paginação. Componentes completos por frequência, texto asc no empate; mostrar dois e o restante no detalhe.'});
 const componentDefinition=explain({title:'Ocorrências por componente principal',fields:['Componente Principal'],definition:'Componentes associados aos registros, sem afirmar causa de falha.',calculation:'Reutilizar groupRecords C1: agrupar Componente Principal, contar chamados, ordenar contagem desc e texto asc. Nulos em Não informado. Não são peças consumidas.',unit:'chamados'});
 const colorsDefinition=explain({title:'Criticidade histórica por tipo',fields:['Tipo de Unidade','Criticidade_ORQUESTRA'],definition:'Distribuição das quatro cores fornecidas, incluindo concluídos. Não representa a cor atual das unidades.',calculation:'Agrupar Tipo de Unidade e contar registros por cor materializada. Barras =contagem de cor/total de chamados do tipo; textos são contagens e botões levam aos respectivos registros. Nenhum recálculo de criticidade.',unit:'chamados e % do tipo'});
 const insightDefinition=rows=>explain({title:'Investigação de padrões e recorrências',fields:['Unidade','Componente Principal','Recorrencia_30d','Motivo_Criticidade','Insight_ORQUESTRA'],definition:'Sugestões demonstrativas com suporte histórico, sem diagnóstico probabilístico, causa comprovada ou ML treinado.',calculation:'Recorrência elevada =registros >=3 (C2). Agrupar componentes por contagem e insights pelo texto completo. Recomendar investigação do contexto, sem estimar probabilidade, intervenção automática ou economia. Grupos podem se sobrepor.'},rows);
 return <div className={shared.consultation}>
  <div className={shared.referenceLine}><span>HISTÓRICO · {SOURCE}</span><span>{civilLabel(view.period.from)}–{civilLabel(view.period.to)} · referência: 06/10/2026, 22h (São Paulo)</span></div>

  {/* Indicadores: o link "Ver N registros" é a prop `action` do KpiCard (renderizado dentro do card) */}
  <div className={styles.cards}>
   {cards.map(card=>
    <KpiCard key={card.title} {...card} accent definition={explain(card)} action={{label:'Ver '+card.rows.length+' registros',onClick:()=>open(card.title,card.rows)}}/>
   )}
  </div>

  {/* Card externo em linha própria, como em Contratos & Margem */}
  <div className={styles.external}>
   <div className={styles.externalCard}>
    <ExternalMetric definition={externalDefinition(EQUIPMENT_AVAILABILITY,state,view)}/>
    <p>Uptime indisponível. Integração de telemetria e calendário operacional necessária.</p>
   </div>
  </div>

  <FilterBar state={state} dispatch={dispatch} total={data.total}/>
  <p className={styles.note}><strong data-testid="equipment-total">{data.total}</strong> chamados filtrados · {data.unitCount} unidades · {data.withoutUnit} registros sem unidade. Em “Mais filtros”: Unidade, Categoria, Componente Principal e Recorrência.</p>
  <Panel title="Equipamentos com maior recorrência" definition={tableDefinition} description="Quantidade de chamados ≠ recorrência registrada. Máximo e último valor materializado são explicitados.">
   <div className={styles.columnInfo}>{['registered','last'].map(key=><span key={key}>{TERMS[key].title}<IndicatorInfo definition={info(key)}/></span>)}</div>
   {table.total?<div className={styles.collapsible+(collapsed?' '+styles.collapsed:'')}>
    <UnitTable rows={collapsed?table.rows.slice(0,COLLAPSED_ROWS):table.rows} ui={equipmentUi} onSort={sort} onUnit={setUnit}/>
    {canCollapse&&<button type="button" className={styles.moreButton} aria-expanded={tableOpen} onClick={()=>setTableOpen(v=>!v)}>{tableOpen?'Ver menos':'Ver mais itens…'}</button>}
   </div>:<EmptyState onClear={()=>dispatch({type:'reset'})}/>}
   {!collapsed&&<Pagination {...table} pageSize={equipmentUi.size} onPage={page=>setEquipmentUi(ui=>({...ui,page}))} onPageSize={size=>setEquipmentUi(ui=>({...ui,size:Number(size),page:1}))}/>}
  </Panel>
  <div className={styles.grid}>
   <Panel title="Ocorrências por componente principal" definition={componentDefinition}><GroupChart groups={data.components} value={g=>g.count} valueLabel={numberLabel} label="Ocorrências por componente" limit={CHART_LIMIT} scrollOnExpand onGroup={g=>open('Componente '+g.label,g.rows)}/></Panel>
   <Panel title={TERMS.typeRecurrence.title} definition={info('typeRecurrence')} description="Numerador e denominador: unidades distintas dentro do mesmo tipo."><GroupChart groups={data.types} value={g=>g.value} valueLabel={percentLabel} label="Recorrência positiva por tipo" limit={CHART_LIMIT} scrollOnExpand tone="teal" onGroup={setTypeGroup}/><ul className={styles.typeNotes}>{data.types.map(g=><li key={g.label}>{g.label}: {g.positiveUnits}/{g.units} unidades · cobertura de recorrência {g.knownUnits}/{g.units} unidades</li>)}</ul></Panel>
   <Panel title="Evolução diária das ocorrências" definition={explain({title:'Evolução diária das ocorrências',fields:['Criado em'],definition:'Volume de chamados pela data de criação, não eventos de transição de um mesmo equipamento.',calculation:'Reutilizar dailyEvolution C2 e ExecutiveChart C3: contar chamados por dia civil no recorte. Dias sem chamados =0. Máximo 60 dias, sem extrapolação.',unit:'chamados/dia'})}><ExecutiveChart days={data.days} series={[{label:'Chamados',color:'#1973db',value:d=>d.total}]} valueLabel={numberLabel} label="Ocorrências de equipamentos" onDay={d=>open('Ocorrências em '+civilLabel(d.date),d.rows)}/></Panel>
   <Panel title="Criticidade histórica por tipo" definition={colorsDefinition}><div className={styles.legend}>{CRITICALITY_ORDER.map(c=><CriticalityBadge value={c} key={c}/>)}</div>{data.types.map(g=><div className={styles.colorRow} key={g.label}><strong>{g.label} · {g.count} chamados</strong><div className={styles.stack} role="img" aria-label={g.label+': '+g.colors.map(c=>c.label+' '+c.rows.length).join(', ')}>{g.colors.map((c,i)=><i key={c.label} className={styles['color'+i]} style={{width:(g.count?c.rows.length/g.count*100:0)+'%'}}/>)}</div><div className={styles.colorButtons}>{g.colors.map(c=><button key={c.label} className={styles.link} aria-label={g.label+' · '+c.label+': '+c.rows.length+' chamados'} onClick={()=>open(g.label+' · '+c.label,c.rows)}>{c.label}: {c.rows.length}</button>)}</div></div>)}</Panel>
  </div>
  <Panel title="Investigação de padrões e recorrências" definition={insightDefinition(view.records)}><div className={styles.suggestions}><article><h3>Revisar histórico de repetição</h3><p>{data.risk.units} unidades distintas em {data.risk.recurrent.length} registros com recorrência ≥3. Investigar componentes e contexto de manutenção.</p><button className={styles.link} onClick={()=>open('Registros com recorrência elevada',data.risk.recurrent)}>Examinar recorrências e insights</button></article><article><h3>Componente mais frequente</h3><p>{data.components[0]?data.components[0].label+' · '+data.components[0].count+' ocorrências.':'Sem componentes no recorte.'} Associação com ocorrências não comprova causa.</p><button className={styles.link} onClick={()=>open('Componente mais frequente',data.components[0]?.rows??[])}>Examinar suporte</button></article></div><p className={styles.note}><a href="#/chamados">Chamados</a> · <a href="#/contratos-margem">Contratos & Margem</a> · <a href="#/custos-tco">Custos / TCO</a> — filtros e busca preservados.</p></Panel>
  <p className={shared.sourceFooter}>Dados sintéticos acadêmicos · HIST_60_DIAS. Unidades com chamados não são parque instalado/ativo. Disponibilidade real EXT. Custo estimado não é realizado OTIS. TA/TB/SLA demonstrativos; sem causalidade ou ML validado. Supervisor/snapshots separados.</p>
  {typeGroup&&typeData&&<Dialog wide title={'Tipo de equipamento · '+typeGroup.label} onClose={()=>setTypeGroup(null)}><p className={styles.breadcrumb}>Carteira → Tipo de equipamento → Unidade → Histórico → Recorrência → Insight → Chamado</p><p>{typeGroup.positiveUnits}/{typeGroup.units} unidades com algum registro de recorrência positiva (&gt;0) · cobertura {typeGroup.knownUnits}/{typeGroup.units}. {typeGroup.count} chamados no tipo.</p><IndicatorInfo definition={explain(TERMS.typeRecurrence,typeGroup.rows)}/><p><button className={styles.link} onClick={()=>open('Recorrência positiva · '+typeGroup.label,typeGroup.positiveRows)}>Examinar registros positivos do tipo</button></p><UnitTable label="Unidades do tipo selecionado" rows={equipmentPage(typeData.units,{...equipmentUi,size:50,page:1}).ordered} ui={equipmentUi} onSort={sort} onUnit={setUnit}/></Dialog>}
  {unit&&<Dialog wide title={'Unidade '+unit.label} onClose={()=>setUnit(null)}>
   <p className={styles.breadcrumb}>Carteira → Tipo de equipamento → Unidade → Histórico → Recorrência → Insight → Chamado</p>
   <details open><summary>Identificação fornecida · BASE</summary><dl className={styles.identity}>{['Unidade','Tipo de Unidade','Cliente','Contrato','Área','Fabricante','Tipo Controle','Tipo Máquina'].map(field=><div key={field}><dt>{field}</dt><dd>{groupRecords(unit.rows,field).map(g=>g.label).join(' · ')}</dd></div>)}</dl><p className={styles.note}>Valores observados nos chamados filtrados, sem cadastro mestre inferido.</p></details>
   <div className={styles.detailCards}>{[
    ['occurrences',unit.count,unit.count+' registros'],['ta',numberLabel(unit.ta.value),unit.ta.count+'/'+unit.count+' válidos'],['tb',numberLabel(unit.tb.value),unit.tb.count+'/'+unit.count+' válidos'],['sla',percentLabel(unit.adherence.value),unit.adherence.within.length+'/'+unit.adherence.count+' elegíveis'],['cost',currencyLabel(unit.cost.value),unit.cost.count+'/'+unit.count+' custos válidos'],['registered',numberLabel(unit.maxRecurrence),'Máximo observado · '+unit.recurrenceCoverage+'/'+unit.count+' válidos']
   ].map(([key,value,subtitle])=><KpiCard key={key} title={TERMS[key].title} value={value} subtitle={subtitle} definition={info(key,unit.rows)}/>)}</div>
   <Panel title="Criticidade histórica da unidade" definition={info('colors',unit.rows)}><div className={styles.colorButtons}>{unit.risk.colors.map(c=><button key={c.label} className={styles.link} onClick={()=>open(unit.label+' · '+c.label,c.rows)}><CriticalityBadge value={c.label}/> {c.rows.length}</button>)}</div></Panel>
   <Panel title="Recorrências e componentes da unidade" definition={insightDefinition(unit.rows)}><p>{unit.recurrence.count}/{unit.count} chamados com recorrência positiva; {unit.risk.recurrent.length} registros ≥3. Cobertura de recorrência: {unit.recurrenceCoverage}/{unit.count}.</p><p>Recomendação demonstrativa: examinar contexto, componente e registros de repetição antes de decidir manutenção; sem diagnóstico de causa.</p><button className={styles.link} onClick={()=>open('Recorrências da unidade '+unit.label,unit.recurrence.rows)}>Examinar recorrências e insights da unidade</button><GroupChart groups={unit.components} value={g=>g.count} valueLabel={numberLabel} label="Componentes da unidade" limit={CHART_LIMIT} scrollOnExpand onGroup={g=>open(unit.label+' · '+g.label,g.rows)}/></Panel>
   <details open><summary>Histórico cronológico — criação descendente</summary><p className={styles.note}>Somente o recorte filtrado, incluindo todos os status. Empate por ID crescente.</p><ol className={styles.history}>{unit.history.map(row=><li key={row.ID_Chamado}><div><time>{dateLabel(row['Criado em'])}</time><button className={styles.link} aria-label={'Abrir histórico '+row.ID_Chamado} onClick={()=>setSelected(row)}>{row.ID_Chamado}</button><strong>{row['Categoria do Chamado']??'Categoria não informada'}</strong></div><p>{row['Componente Principal']??'Componente não informado'} · Recorrência BASE: {validNumber(row.Recorrencia_30d)?row.Recorrencia_30d:'Não informada'} · <CriticalityBadge value={row.Criticidade_ORQUESTRA??'Não informado'}/></p><details><summary>Contexto técnico BASE</summary>{['Subcomponente','Defeito','Falha','Fechamento','Status'].map(field=><p key={field}><strong>{field}:</strong> {row[field]??'Não informado'}</p>)}</details></li>)}</ol></details>
   <details><summary>Categorias, defeitos, falhas e fechamentos</summary><IndicatorInfo definition={explain({title:'Agrupamentos técnicos da unidade',fields:['Categoria do Chamado','Componente Principal','Subcomponente','Defeito','Falha','Fechamento'],definition:'Campos BASE agrupados com contagem CALC de chamados; associação não comprova causa.',calculation:'Agrupar pelo texto completo de cada campo e contar chamados do contexto; frequências desc, texto asc no empate. Nulos em Não informado; grupos de campos diferentes podem se sobrepor e não são somados.'},unit.rows)}/>{['Categoria do Chamado','Componente Principal','Subcomponente','Defeito','Falha','Fechamento'].map(field=><div key={field}><h3>{field} · campo BASE, contagem CALC</h3><div className={styles.groupLinks}>{groupRecords(unit.rows,field).map(g=><button key={g.label} className={styles.link} onClick={()=>open(field+' · '+g.label,g.rows)}>{g.label} ({g.count})</button>)}</div></div>)}</details>
   <details><summary>Insights sintéticos fornecidos · BASE</summary><IndicatorInfo definition={insightDefinition(unit.rows)}/><Insights groups={unit.insights} onInsight={setInsight}/></details>
  </Dialog>}
  {drill&&<Dialog wide title={drill.title} onClose={()=>setDrill(null)}><p>{drill.rows.length} registros de suporte do contexto filtrado.</p><details open><summary>Insights dos registros · BASE sintética</summary><Insights groups={groupRecords(drill.rows,'Insight_ORQUESTRA')} onInsight={setInsight}/></details><RecordExplorer label="Chamados dos equipamentos" rows={drill.rows} onDetail={setSelected}/></Dialog>}
  {insight&&<Dialog wide title="Chamados associados ao insight" onClose={()=>setInsight(null)}><p><span className={styles.base}>BASE · sintético</span> {insight.label}</p><p>Associação histórica não comprova causa nem modelo ML validado.</p><RecordExplorer label="Suporte do insight de equipamentos" rows={insight.rows} onDetail={setSelected}/></Dialog>}
  {selected&&<ChamadoDetail row={selected} onClose={()=>setSelected(null)}/>}
 </div>;
}