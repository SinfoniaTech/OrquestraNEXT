import {useMemo,useRef,useState,useEffect} from 'react';
import {useConsultation} from '../filters/ConsultationContext.jsx';
import {riskAnalysis,dailyEvolution,recurrenceGroups,riskDefinition,suggestionGroups} from '../services/riscos.js';
import {SOURCE,CRITICALITY_ORDER,civilLabel} from '../services/chamados.js';
import {percentLabel} from '../services/sla.js';
import {FilterBar,KpiCard,IndicatorInfo,CriticalityBadge,Dialog} from '../components/ConsultationUI.jsx';
import RecordExplorer from '../components/RecordExplorer.jsx';
import ShowMore from '../components/ShowMore.jsx';
import ChamadoDetail from './ChamadoDetail.jsx';
import shared from '../components/Consultation.module.css';
import styles from './RiscosPage.module.css';
const RiskSection=({title,description,definition,children,wide=false,state,view})=><section className={styles.panel+' '+(wide?styles.wide:'')} aria-label={title}><div className={styles.title}><div><h2>{title}</h2><p>{description}</p></div><IndicatorInfo definition={riskDefinition({title,...definition},state,view)}/></div>{children}</section>;
export default function RiscosPage(){
 const {state,dispatch,view}=useConsultation();
 const data=useMemo(()=>riskAnalysis(view.records),[view.records]);
 const days=useMemo(()=>dailyEvolution(view.records,view.period),[view.records,view.period]);
 const [recField,setRecField]=useState('Unidade'),[drill,setDrill]=useState(null),[selected,setSelected]=useState(null);
 const recurrence=useMemo(()=>recurrenceGroups(view.records,recField),[view.records,recField]);
 const suggestions=useMemo(()=>suggestionGroups(data),[data]);
 const open=(title,rows)=>setDrill({title,rows});
 const info=config=>riskDefinition(config,state,view);
 const cards=[
  {title:'Ocorrências Críticas — Histórico',value:data.red.length,subtitle:'Vermelho · todos os status',tone:'orange',rows:data.red,fields:['Criticidade_ORQUESTRA'],definition:'Ocorrências classificadas Vermelho no período, incluindo concluídos.',calculation:'Contar IDs com Criticidade_ORQUESTRA = Vermelho.'},
  {title:'Ocorrências em Laranja — Histórico',value:data.orange.length,subtitle:'Janela de intervenção · histórico',tone:'orange',rows:data.orange,fields:['Criticidade_ORQUESTRA'],definition:'Ocorrências Laranja no período, incluindo concluídos. Não equivale a alertas atualmente abertos.',calculation:'Contar IDs com Criticidade_ORQUESTRA = Laranja.'},
  {title:'Equipamentos com Recorrência Elevada',value:data.units,subtitle:data.recurrent.length+' registros com recorrência ≥ 3',rows:data.recurrent,fields:['Unidade','Recorrencia_30d'],definition:'Unidades distintas com pelo menos um registro filtrado cuja recorrência materializada é >= 3.',calculation:'Filtrar Recorrencia_30d >= 3 e contar Unidade distinta não ausente. Não somar recorrências como chamados.',unit:'equipamentos distintos'},
  {title:'Contratos sob Pressão Operacional',value:data.contracts,subtitle:'Impacto Alto · sem inferir margem',rows:data.pressure,fields:['Contrato','Impacto_Contrato'],definition:'Contratos distintos associados a registros com Impacto_Contrato Alto. Não comprova margem negativa.',calculation:'Filtrar Impacto_Contrato = Alto e contar Contrato distinto não ausente.',unit:'contratos distintos'},
  {title:'Ocorrências Ativas Prioritárias',value:data.active.length,subtitle:'NA REFERÊNCIA · não concluídos',rows:data.active,fields:['Status','Criticidade_ORQUESTRA'],definition:'Não concluídos em Laranja/Vermelho na referência fixa, não em tempo real.',calculation:'Status != Concluído AND Criticidade_ORQUESTRA em {Laranja,Vermelho}.'}
 ];

 const maximum=Math.max(1,...days.map(d=>d.total));
 const chartWrap=useRef(null);const [chartWidth,setChartWidth]=useState(600);
 useEffect(()=>{
  if(!chartWrap.current||typeof ResizeObserver==='undefined')return;
  const obs=new ResizeObserver(entries=>{const e=entries[0];const w=Math.round(e?.contentRect?.width??0);if(w>0)setChartWidth(w);});
  obs.observe(chartWrap.current);return ()=>obs.disconnect();
 },[]);
 const chartSpan=Math.max(10,chartWidth-70);const xPos=i=>40+(days.length===1?chartSpan/2:i*chartSpan/(days.length-1));
 const points=accessor=>days.map((d,i)=>xPos(i)+','+(160-accessor(d)/maximum*130)).join(' ');
 return <div className={shared.consultation}>
  <div className={shared.referenceLine}><span>HISTÓRICO · {SOURCE}</span><span>{civilLabel(view.period.from)}–{civilLabel(view.period.to)} · referência: 06/10/2026, 22h (São Paulo)</span></div>
  <div className={styles.cards}>{cards.map((card,i)=><KpiCard key={card.title} {...card} tone={i<2?'orange':i===4?'orange':undefined} accent definition={info(card)} action={{label:'Ver '+card.rows.length+' registros',onClick:()=>open(card.title,card.rows)}}/>)}</div>
  <FilterBar state={state} dispatch={dispatch} total={data.total}/>
  <p className={styles.note} role="status"><strong data-testid="risk-total">{data.total}</strong> chamados filtrados · {data.nonConcluded} não concluídos na referência.</p>
  <div className={styles.notice}><strong>Laranja: janela de intervenção.</strong> O ORQUESTRA apoia decisões em todas as criticidades, inclusive Vermelho. As cores são classificações fornecidas; não representam uma sequência obrigatória nem foram recalculadas.</div>
  <div className={styles.grid}>
   <RiskSection state={state} view={view} title="Distribuição de criticidade" description="Histórico filtrado · todos os status" definition={{fields:['Criticidade_ORQUESTRA'],definition:'Distribuição das cores materializadas, sem recálculo.',calculation:'Contar IDs por cor. Proporção = contagem ÷ total filtrado × 100; sem total, não calculável.'}}>
    <div className={styles.colors}>{data.colors.map(g=><button key={g.label} className={styles.color} onClick={()=>open('Criticidade: '+g.label,g.rows)} aria-label={'Explorar cor '+g.label}><CriticalityBadge value={g.label}/><strong data-testid={'risk-cor-'+g.label}>{g.rows.length}</strong><small>{data.total?percentLabel(g.rows.length/data.total):'—'}</small></button>)}</div>
   </RiskSection>
   <RiskSection state={state} view={view} title="Evolução diária da criticidade" description="Agrupamento pela criação · não acompanha mudanças de estado de um mesmo chamado" definition={{fields:['Criado em','Criticidade_ORQUESTRA'],definition:'Volume diário por data de criação e cor registrada no estado histórico. Não demonstra transição entre cores ou predição.',calculation:'Contar IDs por dia civil em São Paulo e por cor; incluir dias sem chamados com contagem zero. Somente dias do período filtrado.'}}>
    <div className={styles.legend}><span>Total</span>{CRITICALITY_ORDER.map(color=><span key={color}><i className={styles.dot+' '+styles[color]}/>{color}</span>)}</div>
    <div className={styles.chartScroll} ref={chartWrap}><svg className={styles.chart} viewBox={`0 0 ${chartWidth} 200`} role="img" aria-label="Contagens diárias de chamados e criticidade"><line x1="40" y1="160" x2={40+chartSpan} y2="160" stroke="#cedbed"/>{[0,Math.ceil(maximum/2),maximum].map((n,i)=><g key={i}><text x="6" y={165-n/maximum*130}>{n}</text><line x1="40" x2={40+chartSpan} y1={160-n/maximum*130} y2={160-n/maximum*130} stroke="#e8eff7"/></g>)}<polyline points={points(d=>d.total)} fill="none" stroke="#142d53" strokeWidth="1.5" strokeDasharray="4 3"/>{CRITICALITY_ORDER.map((color,c)=><g key={color}><polyline points={points(d=>d.colors[c].count)} fill="none" stroke={['#0a9870','#efbd24','#f57a12','#e32646'][c]} strokeWidth="1.5"/>{days.length===1&&<circle cx={40+chartSpan/2} cy={160-days[0].colors[c].count/maximum*130} r="3" fill={['#0a9870','#efbd24','#f57a12','#e32646'][c]}/>}</g>)}{days.filter((d,i)=>i===0||i===days.length-1||i%Math.max(1,Math.ceil(days.length/5))===0).map(d=><text key={d.date} x={xPos(days.indexOf(d))} y="185" textAnchor="middle">{civilLabel(d.date).slice(0,5)}</text>)}</svg></div>
    <div className={styles.days} aria-label="Aprofundamento diário">{days.map(day=><button className={styles.day} key={day.date} aria-label={'Explorar dia '+civilLabel(day.date)+': '+day.total+' chamados'} onClick={()=>open('Criação em '+civilLabel(day.date),day.rows)}>{civilLabel(day.date).slice(0,5)} · {day.total}</button>)}</div>
   </RiskSection>
   <RiskSection state={state} view={view} title="Riscos por área" description="Concentração histórica e proporção Laranja/Vermelho dentro de cada área" definition={{fields:['Área','Criticidade_ORQUESTRA'],definition:'Contagem por área e cor; proporção de cores Laranja/Vermelho entre todos os registros da própria área.',calculation:'Agrupar por Área; contar por cor. Proporção local = (Laranja + Vermelho) ÷ total da área. Não usa apenas ativos.'}}>
    <div className={styles.tableWrap}><ShowMore total={data.areas.length} limit={5}>{count=><table className={styles.table}><thead><tr><th>Área</th>{CRITICALITY_ORDER.map(c=><th key={c}>{c}</th>)}<th>L/V na área</th></tr></thead><tbody>{data.areas.slice(0,count).map(g=><tr key={g.label}><td><button onClick={()=>open('Área: '+g.label,g.rows)}>{g.label} ({g.count})</button></td>{g.colors.map(c=><td key={c.label}><button aria-label={g.label+' '+c.label} onClick={()=>open(g.label+' · '+c.label,c.rows)}>{c.rows.length}</button></td>)}<td>{percentLabel(g.risk.length/g.count)}</td></tr>)}</tbody></table>}</ShowMore></div>
   </RiskSection>
   <RiskSection state={state} view={view} title="Recorrência por equipamento ou componente" description="Somente registros com Recorrencia_30d ≥ 3 · não soma de recorrências" definition={{fields:['Unidade','Componente Principal','Categoria do Chamado','Recorrencia_30d'],definition:'Grupos de registros com recorrência elevada materializada. Exibe chamados e unidades distintas, não eventos adicionais estimados.',calculation:'Filtrar Recorrencia_30d >= 3; agrupar pelo campo escolhido e contar registros / Unidade distinta.'}}>
    <label>Agrupar recorrência por <select className={styles.select} aria-label="Agrupar recorrência por" value={recField} onChange={e=>setRecField(e.target.value)}>{['Unidade','Componente Principal','Categoria do Chamado'].map(f=><option key={f}>{f}</option>)}</select></label>
    <ShowMore total={recurrence.length} limit={5}>{count=><ul className={styles.list}>{recurrence.slice(0,count).map(g=><li key={g.label}><button className={styles.row} onClick={()=>open(recField+': '+g.label,g.rows)}><span>{g.label}</span><strong>{g.count} chamados · {g.units} unidades</strong></button></li>)}</ul>}</ShowMore>{!recurrence.length&&<p>Nenhuma recorrência elevada neste recorte.</p>}
   </RiskSection>
   <RiskSection state={state} view={view} title="Fatores de criticidade informados" description="Textos completos; justificativas compostas não são divididas" definition={{fields:['Motivo_Criticidade'],definition:'Agrupamento por justificativa exata da fonte, incluindo motivos compostos.',calculation:'Agrupar pelo texto completo Motivo_Criticidade, contar IDs e ordenar por frequência. Não atribuir causalidade.'}}>
    <ShowMore total={data.reasons.length} limit={5}>{count=><ul className={styles.list}>{data.reasons.slice(0,count).map(g=><li key={g.label}><button className={styles.row} onClick={()=>open('Motivo: '+g.label,g.rows)}><span>{g.label}</span><strong>{g.count}</strong></button></li>)}</ul>}</ShowMore>
   </RiskSection>
   <RiskSection state={state} view={view} title="Contratos e pressão operacional" description="Somente registros com Impacto_Contrato Alto · sem informação de margem" definition={{fields:['Contrato','Impacto_Contrato'],definition:'Concentração de registros com impacto Alto por contrato.',calculation:'Filtrar Impacto_Contrato = Alto e agrupar por Contrato. Contar chamados; card conta contratos distintos presentes.'}}>
    <ShowMore total={data.contractsGroups.length} limit={5}>{count=><ul className={styles.list}>{data.contractsGroups.slice(0,count).map(g=><li key={g.label}><button className={styles.row} onClick={()=>open('Contrato com impacto Alto: '+g.label,g.rows)}><span>{g.label}</span><strong>{g.count} chamados</strong></button></li>)}</ul>}</ShowMore>
   </RiskSection>
   <RiskSection state={state} view={view} wide title="Oportunidades de intervenção e investigação" description="Regras demonstrativas explicáveis · sem modelo de Machine Learning" definition={{fields:['Insight_ORQUESTRA','Motivo_Criticidade','Recorrencia_30d','Categoria do Chamado','Componente Principal','Percentual_SLA','Impacto_Contrato','Status','Criticidade_ORQUESTRA'],definition:'Observações históricas e sugestões demonstrativas, sem comprovação de causa ou previsão de falha.',calculation:'Regras: não concluído Laranja/Vermelho → revisar atendimento; Laranja histórico → investigar janela; recorrência >=3 → examinar repetição; impacto Alto → revisar contrato operacional. Grupos podem se sobrepor e não devem ser somados.'}}>
    <ShowMore total={suggestions.length} limit={5}>{count=>suggestions.slice(0,count).map(g=><article className={styles.suggestion} key={g.id}><h3>{g.title}</h3><p><strong>Observação:</strong> {g.rows.length} registros. {g.observation}</p><p><strong>Sugestão demonstrativa:</strong> {g.suggestion}</p><button onClick={()=>open(g.title,g.rows)}>Examinar evidências</button><details><summary>Exemplo de contexto BASE</summary><p>Primeiro registro do grupo, sem alegar representatividade: {g.rows[0].ID_Chamado}</p><p>Motivo: {g.rows[0].Motivo_Criticidade??'Não informado'}</p><p>Insight sintético fornecido: {g.rows[0].Insight_ORQUESTRA??'Não informado'}</p><button onClick={()=>setSelected(g.rows[0])}>Abrir contexto completo</button></details></article>)}</ShowMore>
    {!suggestions.length&&<p>Nenhuma sugestão destas regras para o recorte. Isso não certifica ausência de risco.</p>}
   </RiskSection>
  </div>
  <section className={shared.resultsCard} aria-label="Registros de risco filtrados"><div className={shared.resultsHeading}><div><h2>Registros do recorte</h2><p>Busca, filtros e ordenação compartilhados; todos os status. Aprofunde os cards para subconjuntos específicos.</p></div></div><RecordExplorer rows={view.records} onDetail={setSelected}/></section>
  <p className={shared.sourceFooter}>Fonte HIST_60_DIAS · dados sintéticos · sem atualização em tempo real, predição ou causalidade comprovada. SLA informado é resultado da simulação. Snapshots e Supervisor mantidos separados.</p>
  {drill&&<Dialog title={drill.title} wide onClose={()=>setDrill(null)}><p>{drill.rows.length} registros de suporte; filtros preservados.</p><RecordExplorer rows={drill.rows} label="Aprofundamento de riscos" onDetail={setSelected}/></Dialog>}
  {selected&&<ChamadoDetail row={selected} onClose={()=>setSelected(null)}/>}
 </div>;
}
