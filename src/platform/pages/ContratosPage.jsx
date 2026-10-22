import {useMemo,useState} from 'react';
import {useConsultation} from '../filters/ConsultationContext.jsx';
import {contractAnalysis,contractPage,contractDefinition,CONTRACT_TERMS as TERMS,CONTRACT_EXTERNAL} from '../services/contratos.js';
import {currencyLabel,externalDefinition} from '../services/performance.js';
import {percentLabel,numberLabel,groupRecords} from '../services/sla.js';
import {SOURCE,civilLabel} from '../services/chamados.js';
import {FilterBar,KpiCard,IndicatorInfo,Dialog,Pagination,CriticalityBadge,EmptyState} from '../components/ConsultationUI.jsx';
import DataTable from '../components/DataTable.jsx';
import RecordExplorer from '../components/RecordExplorer.jsx';
import ExecutiveChart from '../components/ExecutiveChart.jsx';
import GroupChart from '../components/GroupChart.jsx';
import ExternalMetric from '../components/ExternalMetric.jsx';
import ChamadoDetail from './ChamadoDetail.jsx';
import shared from '../components/Consultation.module.css';
import styles from './ContratosPage.module.css';
function Panel({title,definition,children,description}){return <section className={styles.panel} aria-label={title}><div className={styles.heading}><div><h2>{title}</h2>{description&&<p>{description}</p>}</div><IndicatorInfo definition={definition}/></div>{children}</section>;}
function TechnicalList({groups,onRecords,onEquipment,field}){return <div className={styles.technical}>{groups.map(g=><button key={g.label} onClick={()=>onEquipment?onEquipment(g):onRecords(field+' · '+g.label,g.rows)}><span>{g.label}</span><strong>{g.count} chamados</strong><small>{g.recurrence.count}/{g.count} recorrentes · {g.high.length} Alto</small></button>)}{!groups.length&&<p>Nenhum registro neste recorte.</p>}</div>;}
export default function ContratosPage(){
 const {state,dispatch,view,contractUi,setContractUi}=useConsultation();
 const data=useMemo(()=>contractAnalysis(view.records,view.period),[view.records,view.period]);
 const table=contractPage(data.groups,contractUi);
 const [contractId,setContractId]=useState(null),[drill,setDrill]=useState(null),[selected,setSelected]=useState(null),[equipment,setEquipment]=useState(null),[recField,setRecField]=useState('Categoria do Chamado');
 const contract=data.groups.find(g=>g.label===contractId),detail=useMemo(()=>contract?contractAnalysis(contract.rows,view.period):null,[contract,view.period]);
 const explain=(config,rows=view.records)=>{
  const scope={...state,filters:{...state.filters}};
  if(rows!==view.records)for(const field of ['Contrato','Unidade']){
   const values=[...new Set(rows.map(r=>r[field]).filter(v=>v!=null&&v!==''))];
   if(values.length===1)scope.filters[field]=values;
  }
  return contractDefinition(config,scope,{...view,records:rows,summary:{...view.summary,total:rows.length}});
 };
 const term=(key,rows)=>explain(TERMS[key],rows);
 const open=(title,rows)=>setDrill({title,rows});
 const sort=field=>setContractUi(ui=>({...ui,sort:field,direction:ui.sort===field&&ui.direction==='asc'?'desc':'asc',page:1}));
 const cards=[
  {title:'Contratos com chamados',value:data.contractCount,subtitle:'Presentes no recorte · sem afirmar vigência',rows:view.records.filter(r=>r.Contrato!=null&&r.Contrato!==''),fields:['Contrato'],definition:'Contratos distintos com chamados no período filtrado; não cadastro de vigência.',calculation:'Contar Contrato distinto não ausente. Sem contrato informado, chamado permanece na população geral.',unit:'contratos distintos'},
  {...TERMS.cost,value:currencyLabel(data.cost.value),subtitle:data.cost.count+'/'+data.count+' registros com custo válido',rows:data.cost.rows},
  {title:'Contratos sob pressão',value:data.risk.contracts,subtitle:'Algum impacto Alto · sem inferir margem',rows:data.risk.pressure,fields:['Contrato','Impacto_Contrato'],definition:'Proxy operacional aprovado na C2, contratos com pelo menos um evento Alto.',calculation:'Reutilizar riskAnalysis: contar Contrato distinto nos registros Impacto_Contrato = Alto.',unit:'contratos distintos'},
  {...TERMS.recurrence,value:percentLabel(data.recurrence.value),subtitle:data.recurrence.count+'/'+data.count+' chamados · cobertura '+data.recurrence.valid+'/'+data.count,rows:data.recurrence.rows}
 ];
 const tableDefinition=explain({title:'Indicadores da carteira',fields:['Contrato','Cliente',...Object.values(TERMS).flatMap(t=>t.fields)],definition:'Todos os contratos presentes no recorte, incluindo os que não têm impacto Alto. Cada linha usa todos os chamados filtrados do contrato.',calculation:'Agrupar Contrato não ausente. Volume=IDs; custo=soma válida C3; SLA=concluídos elegíveis C1; Alto=registros Alto C2; recorrência=positivos/total. Pressão=algum Alto, sem pesos. Ordenar antes de paginar, ausentes por último e ID crescente no desempate. Busca compartilhada ignora acentos e caixa, combina palavras por AND. Indicadores por coluna têm explicação própria.'});
 const technicalDefinition=(title,field,rows)=>explain({title,fields:[field,'Recorrencia_30d','Impacto_Contrato'],definition:'Associações históricas por '+field+', sem causalidade comprovada.',calculation:'Agrupar todos os registros do contexto; volume=contagem, recorrentes=Recorrencia_30d >0 sobre total do grupo, Alto=Impacto_Contrato Alto. Ordenar volume desc, texto asc. Nulos agrupados em Não informado. Não somar recorrências.'},rows);
 const chartDefinition=(title,key)=>explain({...TERMS[key],title,fields:['Contrato',...TERMS[key].fields],definition:TERMS[key].definition+' Cada barra considera todos os chamados filtrados do contrato.'});
 const columns=[
  {key:'contract',label:'Contrato',sortKey:'contract',render:g=><button className={styles.link} aria-label={'Abrir contrato '+g.label} onClick={()=>setContractId(g.label)}>{g.label}</button>},
  {key:'client',label:'Cliente',sortKey:'client',render:g=>g.clients.join(' · ')},
  {key:'count',label:'Chamados',sortKey:'count',render:g=><button className={styles.link} onClick={()=>open('Chamados · '+g.label,g.rows)}>{g.count}</button>},
  {key:'cost',label:'Custo estimado',sortKey:'cost',render:g=><><button className={styles.link} onClick={()=>open('Custo · '+g.label,g.cost.rows)}>{currencyLabel(g.cost.value)}</button><small>{g.cost.count}/{g.count} válidos</small></>},
  {key:'sla',label:'SLA simulado',sortKey:'sla',render:g=><><button className={styles.link} onClick={()=>open('SLA · '+g.label,g.adherence.rows)}>{percentLabel(g.adherence.value)}</button><small>{g.adherence.within.length}/{g.adherence.count} elegíveis</small></>},
  {key:'high',label:'Impacto Alto',sortKey:'high',render:g=><button className={styles.link} onClick={()=>open('Impacto Alto · '+g.label,g.risk.pressure)}>{g.risk.pressure.length}</button>},
  {key:'recurrence',label:'Recorrentes',sortKey:'recurrence',render:g=><><button className={styles.link} onClick={()=>open('Recorrentes · '+g.label,g.recurrence.rows)}>{percentLabel(g.recurrence.value)}</button><small>{g.recurrence.count}/{g.count} · cobertura {g.recurrence.valid}/{g.count}</small></>},
  {key:'pressure',label:'Pressão operacional',sortKey:'pressure',render:g=><span className={g.risk.pressure.length?styles.pressure:styles.neutral}>{g.pressure}</span>},
  {key:'action',label:'Ação',render:g=><button className={styles.link} aria-label={'Analisar '+g.label} onClick={()=>setContractId(g.label)}>Analisar ↗</button>}
 ];
 const timeDefinition=(title,key)=>explain({...TERMS[key],title,fields:['Criado em',...TERMS[key].fields],definition:'Coorte diária por criação no período filtrado; não competência financeira nem resolução no dia.',calculation:TERMS[key].calculation+' Agrupar por dia civil de São Paulo, incluir só dias do recorte. Sem custo válido: lacuna; sem chamados: volume zero.'});
 const insightDefinition=rows=>explain({title:'Insight ORQUESTRA',fields:['Insight_ORQUESTRA','Motivo_Criticidade','Impacto_Contrato','Recorrencia_30d','Unidade','Categoria do Chamado','Componente Principal'],definition:'Observações descritivas e sugestões demonstrativas baseadas nos registros. Não são predição ML nem prova de causa.',calculation:'Contar impactos Alto, recorrências >0 e motivos completos por frequência. Sugestões de investigação levam aos registros de suporte; grupos podem se sobrepor. Texto Insight_ORQUESTRA é BASE sintética, agrupado sem reescrita.'},rows);
 const Insights=({analysis})=><div className={styles.insights}>
  <article><h3>Pressão observada</h3><p>{analysis.risk.pressure.length} registros de impacto Alto. Revisar os fatores informados com a operação.</p><button className={styles.link} onClick={()=>open('Evidências de pressão',analysis.risk.pressure)}>Examinar impacto Alto</button></article>
  <article><h3>Investigar repetição</h3><p>{analysis.recurrence.count}/{analysis.count} chamados com recorrência positiva; {analysis.risk.units} unidades distintas com recorrência ≥ 3. Examinar equipamentos e componentes associados.</p><button className={styles.link} onClick={()=>open('Evidências de recorrência',analysis.recurrence.rows)}>Examinar recorrentes</button></article>
  <article><h3>Fator predominante</h3><p>{analysis.risk.reasons[0]?analysis.risk.reasons[0].label+' · '+analysis.risk.reasons[0].count+' chamados.':'Nenhum fator no recorte.'} Associação histórica não comprova causa.</p><button className={styles.link} onClick={()=>open('Fator predominante',analysis.risk.reasons[0]?.rows??[])}>Examinar fator</button></article>
 </div>;
 return <div className={shared.consultation}>
  <div className={shared.referenceLine}><span>HISTÓRICO · {SOURCE}</span><span>{civilLabel(view.period.from)}–{civilLabel(view.period.to)} · referência: 06/10/2026, 22h (São Paulo)</span></div>
  <div className={styles.cards}>{cards.map(card=><div key={card.title}><KpiCard {...card} definition={explain(card)}/><button className={styles.cardLink} onClick={()=>open(card.title,card.rows)}>Ver {card.rows.length} registros</button></div>)}</div>
  <div className={styles.external} aria-label="Indicadores financeiros externos">{CONTRACT_EXTERNAL.map(metric=><ExternalMetric key={metric.title} definition={externalDefinition(metric,state,view)}/>)}</div>
  <FilterBar state={state} dispatch={dispatch} total={data.count}/>
  <p className={styles.note}><strong data-testid="contracts-total">{data.count}</strong> chamados filtrados · {data.contractCount} contratos · {data.unassigned} chamados sem contrato informado. Busca compartilhada inclui cliente e contrato.</p>
  <Panel title="Carteira de contratos" definition={tableDefinition} description="Custos e pressão operacionais · indicadores financeiros dependem de integração externa">
   <div className={styles.columnInfo} aria-label="Definições das colunas">{['count','cost','sla','high','recurrence','pressure'].map(key=><span key={key}>{TERMS[key].title}<IndicatorInfo definition={term(key)}/></span>)}</div>
   {table.total?<DataTable label="Tabela de contratos" columns={columns} rows={table.rows} sortField={contractUi.sort} sortDirection={contractUi.direction} onSort={sort}/>:<EmptyState onClear={()=>dispatch({type:'reset'})}/>}
   <Pagination {...table} pageSize={contractUi.size} onPage={page=>setContractUi(ui=>({...ui,page}))} onPageSize={size=>setContractUi(ui=>({...ui,size:Number(size),page:1}))}/>
  </Panel>
  <div className={styles.grid}>
   {[['Custo estimado por contrato','cost',g=>g.cost.value,currencyLabel,g=>g.cost.rows],['Volume por contrato','count',g=>g.count,numberLabel,g=>g.rows],['SLA simulado por contrato','sla',g=>g.adherence.value,percentLabel,g=>g.adherence.rows]].map(([title,key,value,format,rows])=><Panel key={key} title={title} definition={chartDefinition(title,key)}><GroupChart groups={contractPage(data.groups,{sort:key==='count'?'count':key,direction:'desc',size:50}).ordered} value={value} valueLabel={format} label={title} onGroup={g=>open(title+' · '+g.label,rows(g))}/></Panel>)}
   <Panel title="Recorrência por categoria ou componente" definition={technicalDefinition('Recorrência por categoria ou componente',recField)}><label className={styles.selector}>Agrupar por <select aria-label="Agrupar recorrência contratual" value={recField} onChange={e=>setRecField(e.target.value)}>{['Categoria do Chamado','Componente Principal'].map(f=><option key={f}>{f}</option>)}</select></label><GroupChart groups={recField==='Categoria do Chamado'?data.categories:data.components} value={g=>g.recurrence.value} valueLabel={percentLabel} label="Proporção recorrente" onGroup={g=>open('Recorrentes · '+g.label,g.recurrence.rows)}/></Panel>
   <Panel title="Evolução do volume de chamados" definition={timeDefinition('Evolução do volume de chamados','count')}><ExecutiveChart days={data.days} series={[{label:'Chamados',color:'#1973db',value:d=>d.total}]} valueLabel={numberLabel} label="Volume contratual diário" onDay={d=>open('Chamados em '+civilLabel(d.date),d.rows)}/></Panel>
   <Panel title="Evolução dos custos estimados" definition={timeDefinition('Evolução dos custos estimados','cost')}><ExecutiveChart days={data.days} series={[{label:'Custo estimado',color:'#07916d',value:d=>d.cost.value}]} valueLabel={(v,axis)=>axis&&v!==null?(v/1000).toLocaleString('pt-BR',{maximumFractionDigits:1})+'k':currencyLabel(v)} label="Custo contratual diário" onDay={d=>open('Custo em '+civilLabel(d.date)+' · '+d.cost.count+'/'+d.total+' válidos',d.cost.rows)}/></Panel>
  </div>
  <Panel title="Insight ORQUESTRA" definition={insightDefinition(view.records)}><Insights analysis={data}/><p className={styles.note}><a href="#/visao-geral">Visão Geral</a> · <a href="#/chamados">Chamados</a> · <a href="#/sla-criticidade">SLA & Criticidade</a> — filtros e busca preservados.</p></Panel>
  <p className={shared.sourceFooter}>Dados sintéticos acadêmicos. Pressão operacional não mede margem. TA/TB em minutos e SLA da simulação não são definições oficiais OTIS. Sem vigência, receita, cobertura ou rentabilidade contratual disponíveis. Histórico, snapshots e Supervisor separados.</p>
  {contract&&detail&&<Dialog wide title={'Contrato '+contract.label} onClose={()=>setContractId(null)}>
   <p className={styles.breadcrumb}>Carteira → Contrato → Indicadores → Equipamentos → Chamados → Insights</p>
   <p>Cliente: {contract.clients.join(' · ')} · Área: {contract.areas.join(' · ')} · {civilLabel(view.period.from)} a {civilLabel(view.period.to)}</p>
   <details><summary>Identificação disponível na base</summary>{['Tipo de Unidade','Unidade de Negócio','Supervisor','Rota'].map(field=><p key={field}><strong>{field} · BASE:</strong> {groupRecords(contract.rows,field).map(g=>g.label).join(' · ')}</p>)}</details>
   <div className={styles.detailExternal}><ExternalMetric definition={externalDefinition({title:'Vigência, valor e cobertura contratual',fields:['Vigência','Valor contratado','Cobertura contratual'],source:'Cadastro mestre de contratos',reason:'Histórico de chamados não contém cadastro contratual.'},state,{...view,summary:{total:contract.count}})}/></div>
   <div className={styles.detailCards}>{[
    ['count',detail.count,detail.rows,detail.count+' chamados'],['cost',currencyLabel(detail.cost.value),detail.cost.rows,detail.cost.count+'/'+detail.count+' válidos'],['sla',percentLabel(detail.adherence.value),detail.adherence.rows,detail.adherence.within.length+'/'+detail.adherence.count+' elegíveis'],['ta',numberLabel(detail.ta.value),detail.ta.rows,detail.ta.count+'/'+detail.count+' válidos'],['tb',numberLabel(detail.tb.value),detail.tb.rows,detail.tb.count+'/'+detail.count+' válidos'],['recurrence',percentLabel(detail.recurrence.value),detail.recurrence.rows,detail.recurrence.count+'/'+detail.count+' · cobertura '+detail.recurrence.valid+'/'+detail.count],['high',detail.risk.pressure.length,detail.risk.pressure,detail.pressure]
   ].map(([key,value,rows,subtitle])=><div key={key}><KpiCard title={TERMS[key].title} value={value} subtitle={subtitle} definition={term(key,contract.rows)}/><button className={styles.cardLink} onClick={()=>open(TERMS[key].title+' · '+contract.label,rows)}>Ver {rows.length} registros</button></div>)}</div>
   <Panel title="Criticidade do contrato" definition={term('colors',contract.rows)}><div className={styles.colors}>{detail.risk.colors.map(g=><button key={g.label} onClick={()=>open(contract.label+' · '+g.label,g.rows)}><CriticalityBadge value={g.label}/><strong>{g.rows.length}</strong></button>)}</div></Panel>
   <div className={styles.detailGrid}>{[['Categorias predominantes','Categoria do Chamado',detail.categories],['Componentes associados','Componente Principal',detail.components],['Equipamentos com chamados','Unidade',detail.equipment]].map(([title,field,groups])=><Panel key={field} title={title} definition={technicalDefinition(title,field,contract.rows)}><TechnicalList field={field} groups={groups} onRecords={open} onEquipment={field==='Unidade'?setEquipment:undefined}/></Panel>)}</div>
   <Panel title="Fatores de criticidade do contrato" definition={explain({title:'Fatores de criticidade do contrato',fields:['Motivo_Criticidade'],definition:'Textos completos fornecidos na base, sem prova de causalidade.',calculation:'Agrupar Motivo_Criticidade completo e ordenar contagens decrescentes.'},contract.rows)}><div className={styles.technical}>{detail.risk.reasons.map(g=><button key={g.label} onClick={()=>open(g.label,g.rows)}>{g.label} · {g.count}</button>)}</div></Panel>
   <Panel title="Insight ORQUESTRA" definition={insightDefinition(contract.rows)}><Insights analysis={detail}/><details><summary>Insights sintéticos fornecidos · BASE</summary>{groupRecords(contract.rows,'Insight_ORQUESTRA').map(g=><p key={g.label}><button className={styles.link} onClick={()=>open('Insight fornecido · '+g.label,g.rows)}>{g.label} ({g.count})</button></p>)}</details></Panel>
  </Dialog>}
  {equipment&&<Dialog wide title={'Equipamento '+equipment.label} onClose={()=>setEquipment(null)}><p>Unidade BASE · {equipment.count} chamados no contrato e recorte selecionados. Recorrentes: {equipment.recurrence.count}/{equipment.count}; impacto Alto: {equipment.high.length}. Associação não comprova causa.</p><div className={styles.columnInfo}>{['count','recurrence','high'].map(key=><span key={key}>{TERMS[key].title}<IndicatorInfo definition={term(key,equipment.rows)}/></span>)}</div><RecordExplorer label="Chamados do equipamento" rows={equipment.rows} onDetail={setSelected}/></Dialog>}
  {drill&&<Dialog wide title={drill.title} onClose={()=>setDrill(null)}><p>{drill.rows.length} registros de suporte do recorte filtrado; ordenação antes da paginação.</p><RecordExplorer label="Chamados dos contratos" rows={drill.rows} onDetail={setSelected}/></Dialog>}
  {selected&&<ChamadoDetail row={selected} onClose={()=>setSelected(null)}/>}
 </div>;
}
