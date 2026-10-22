import {useMemo,useState} from 'react';
import {useConsultation} from '../filters/ConsultationContext.jsx';
import {executiveAnalysis,performanceDefinition,estimatedCost,currencyLabel,FINANCIAL_EXTERNAL,externalDefinition} from '../services/performance.js';
import {SOURCE,CRITICALITY_ORDER,civilLabel} from '../services/chamados.js';
import {percentLabel} from '../services/sla.js';
import {FilterBar,KpiCard,IndicatorInfo,Dialog} from '../components/ConsultationUI.jsx';
import ExternalMetric from '../components/ExternalMetric.jsx';
import ExecutiveChart from '../components/ExecutiveChart.jsx';
import RecordExplorer from '../components/RecordExplorer.jsx';
import ChamadoDetail from './ChamadoDetail.jsx';
import styles from './PerformancePage.module.css';
import shared from '../components/Consultation.module.css';
function ContractsTable({groups,onRecords}){
 return <div className={styles.tableWrap}><table className={styles.table} aria-label="Contratos sob pressão operacional"><thead><tr><th>Contrato / Cliente</th><th>Impacto Alto</th><th>Total no contrato</th><th>Custo estimado</th><th>SLA simulado</th><th>Vermelhos históricos</th><th>Fatores nos eventos Alto</th></tr></thead>
 <tbody>{groups.map(g=><tr key={g.label}><td><button aria-label={'Abrir contrato '+g.label} onClick={()=>onRecords('Contrato '+g.label+' · todos os chamados filtrados',g.rows)}>{g.label}</button><small>{g.clients.join(' · ')||'Cliente não informado'}</small></td>
 <td><button aria-label={'Impacto Alto de '+g.label} onClick={()=>onRecords('Impacto Alto · '+g.label,g.high)}>{g.high.length}</button></td><td>{g.count}</td>
 <td className={styles.nowrap}><button aria-label={'Custo de '+g.label} onClick={()=>onRecords('Custo estimado · '+g.label,g.cost.rows)}>{currencyLabel(g.cost.value)}</button><small>{g.cost.count}/{g.count} com custo</small></td>
 <td><button aria-label={'SLA de '+g.label} onClick={()=>onRecords('Concluídos elegíveis · '+g.label,g.adherence.rows)}>{percentLabel(g.adherence.value)}</button><small>{g.adherence.within.length}/{g.adherence.count} elegíveis</small></td>
 <td><button aria-label={'Vermelhos de '+g.label} onClick={()=>onRecords('Vermelhos históricos · '+g.label,g.reds)}>{g.reds.length}</button></td>
 <td className={styles.factors}>{g.reasons.slice(0,2).map(r=><small key={r.label}>{r.label} ({r.count})</small>)}</td></tr>)}</tbody></table>{!groups.length&&<p className={styles.note}>Nenhum contrato com evento de impacto Alto neste recorte.</p>}</div>;
}
function AnalysisPanel({title,description,definition,children}){
 return <section className={styles.panel} aria-label={title}><div className={styles.heading}><div><h2>{title}</h2><p>{description}</p></div><IndicatorInfo definition={definition}/></div>{children}</section>;
}
export default function PerformancePage(){
 const {state,dispatch,view}=useConsultation();
 const data=useMemo(()=>executiveAnalysis(view.records,view.period),[view.records,view.period.from,view.period.to]);
 const [allContracts,setAllContracts]=useState(false),[drill,setDrill]=useState(null),[selected,setSelected]=useState(null);
 const explain=config=>performanceDefinition(config,state,view);
 const open=(title,rows)=>setDrill({title,rows});
 const coverage=data.cost.count+'/'+data.total;
 const cards=[
  {title:'Contratos com chamados',value:data.contractCount,subtitle:'Histórico · sem afirmar vigência',rows:data.contractRows,fields:['Contrato'],definition:'Contratos distintos encontrados no recorte histórico. Presença de chamado não comprova contrato ativo.',calculation:'Contar Contrato distinto não ausente.',unit:'contratos distintos'},
  {title:'Aderência ao SLA simulada',value:percentLabel(data.adherence.value),subtitle:data.adherence.within.length+'/'+data.adherence.count+' concluídos elegíveis',rows:data.adherence.rows,fields:['Status','SLA_min','Percentual_SLA'],definition:'Aderência demonstrativa entre concluídos elegíveis; sem validade contratual oficial OTIS.',calculation:'Reutiliza a C1: Status = Concluído, SLA_min finito >0 e Percentual_SLA finito >=0; cumpridos se Percentual_SLA <=1. Cumpridos ÷ elegíveis ×100. N='+data.adherence.count+'. Sem elegíveis, não calculável.',unit:'%'},
  {title:'Custo estimado no período',value:currencyLabel(data.cost.value),subtitle:coverage+' registros com custo válido',rows:data.cost.rows,fields:['Custo_Estimado_R$'],definition:'Soma do custo estimado sintético dos atendimentos do recorte, incluindo todos os status; não TCO contábil ou gasto financeiro comprovado.',calculation:'Somar Custo_Estimado_R$ finito e não negativo; N válido='+data.cost.count+' de '+data.total+'. Sem custo válido, indisponível. Arredondamento somente na apresentação.',unit:'R$'},
  {title:'Contratos sob pressão',value:data.risk.contracts,subtitle:'Histórico · algum impacto Alto',rows:data.risk.pressure,fields:['Contrato','Impacto_Contrato'],definition:'Contratos distintos associados a pelo menos um registro de impacto Alto, conforme C2; não significa margem negativa.',calculation:'Impacto_Contrato = Alto; contar Contrato distinto não ausente.',unit:'contratos distintos'},
  {title:'Críticos no histórico',value:data.risk.red.length,subtitle:'Vermelho · inclui concluídos',rows:data.risk.red,fields:['Criticidade_ORQUESTRA'],definition:'Registros históricos classificados Vermelho, incluindo concluídos.',calculation:'Contar ID_Chamado com Criticidade_ORQUESTRA = Vermelho.'},
  {title:'Prioridades ativas',value:data.risk.active.length,subtitle:'NA REFERÊNCIA · não concluídos',rows:data.risk.active,fields:['Status','Criticidade_ORQUESTRA'],definition:'Não concluídos em Laranja/Vermelho na referência fixa, não monitoramento em tempo real.',calculation:'Reutiliza C2: Status != Concluído AND cor em {Laranja,Vermelho}.'}
 ];
 const contractDefinition=explain({title:'Contratos sob pressão operacional',fields:['Contrato','Cliente','Impacto_Contrato','Custo_Estimado_R$','Status','SLA_min','Percentual_SLA','Criticidade_ORQUESTRA','Motivo_Criticidade'],definition:'Selecionar contratos com algum evento Alto. Indicadores de custo/SLA/total/cor consideram todos os chamados filtrados de cada contrato, enquanto quantidade Alto e seus motivos usam somente os eventos Alto.',calculation:'Agrupar por Contrato; selecionar grupos com Impacto Alto. Ordenar N Alto decrescente, desempate identificador crescente. Mostrar até cinco; lista completa disponível. Custo=soma válida; SLA=regra C1 com N próprio; motivos=textos completos mais frequentes nos registros Alto (até dois).'});
 const dailyDefinition=(title,fields,definition,calculation,unit)=>explain({title,fields:['Criado em',...fields],definition,calculation,unit});
 const days=data.days;
 return <div className={shared.consultation}>
  <div className={shared.referenceLine}><span>HISTÓRICO · {SOURCE}</span><span>{civilLabel(view.period.from)}–{civilLabel(view.period.to)} · referência: 06/10/2026, 22h (São Paulo)</span></div>
  <div className={styles.cards}>{cards.map((card,i)=><div key={card.title} className={i===2?styles.money:i===5?styles.active:undefined}><KpiCard {...card} definition={explain(card)}/><button className={styles.cardLink} onClick={()=>open(card.title,card.rows)}>Ver {card.rows.length} registros</button></div>)}</div>
  <FilterBar state={state} dispatch={dispatch} total={data.total}/>
  <p className={styles.context}><strong data-testid="performance-total">{data.total}</strong> chamados no recorte · custo com cobertura {coverage} · {data.risk.nonConcluded} não concluídos na referência. Histórico e operação na referência têm populações distintas.</p>
  <div className={styles.external} aria-label="Informações financeiras externas">{FINANCIAL_EXTERNAL.map(metric=><ExternalMetric key={metric.title} definition={externalDefinition(metric,state,view)}/>)}</div>
  <section className={styles.panel} aria-label="Contratos em destaque">
   <div className={styles.heading}><div><h2>Contratos sob pressão operacional</h2><p>Até 5 destaques de {data.contracts.length}. Ordem: quantidade Alto ↓, identificador ↑. Não é ranking de margem.</p></div><div className={styles.controls}><button className={styles.topButton} onClick={()=>setAllContracts(true)}>Lista completa ({data.contracts.length})</button><IndicatorInfo definition={contractDefinition}/></div></div>
   <ContractsTable groups={data.contracts.slice(0,5)} onRecords={open}/>
   <p className={styles.note}>Total, custo, SLA e Vermelhos: todos os chamados filtrados do contrato. Eventos Alto e seus fatores: apenas registros com impacto Alto. Sem receita ou margem inferidas.</p>
  </section>
  <div className={styles.charts}>
   <AnalysisPanel title="Evolução do custo estimado" description="Custo sintético em R$ por data de criação" definition={dailyDefinition('Evolução do custo estimado',['Custo_Estimado_R$'],'Custo estimado dos registros de cada dia de criação; não fluxo de caixa ou competência contábil.','Reutilizar dias da C2; somar custos válidos de cada dia e informar N válido/total. Sem custo válido, lacuna, não zero.','R$')}>
    <ExecutiveChart days={days} series={[{label:'Estimativa',color:'#1973db',value:d=>d.cost.value}]} valueLabel={(v,axis)=>v===null?'—':axis?(v/1000).toLocaleString('pt-BR',{maximumFractionDigits:1})+'k':currencyLabel(v)} label="Custo diário" onDay={d=>open('Custo em '+civilLabel(d.date)+' · '+d.cost.count+'/'+d.total+' com custo',d.cost.rows)}/>
   </AnalysisPanel>
   <AnalysisPanel title="Evolução da aderência simulada" description="Concluídos elegíveis por data de criação" definition={dailyDefinition('Evolução da aderência simulada',['Status','SLA_min','Percentual_SLA'],'Aplicar a mesma aderência da C1 à coorte de chamados criados em cada dia; não mede resolução no dia.','Por dia: concluídos elegíveis cumpridos ÷ concluídos elegíveis ×100. Não calcular média de percentuais diários. Sem elegíveis, lacuna, não 0%.','%')}>
    <ExecutiveChart days={days} series={[{label:'Aderência',color:'#07916d',value:d=>d.adherence.value===null?null:d.adherence.value*100}]} valueLabel={(v)=>v===null?'—':v.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%'} label="SLA diário" onDay={d=>open('SLA em '+civilLabel(d.date)+' · '+d.adherence.within.length+'/'+d.adherence.count+' elegíveis',d.adherence.rows)}/>
   </AnalysisPanel>
   <AnalysisPanel title="Evolução da criticidade histórica" description="Cores registradas por data de criação" definition={dailyDefinition('Evolução da criticidade histórica',['Criticidade_ORQUESTRA'],'Classificação materializada por dia de criação, incluindo concluídos; não evolução de cor de um mesmo chamado.','Reutilizar dailyEvolution da C2: contar por dia e cor. Dias sem chamados têm contagem zero. Sem extrapolação ou recálculo.','chamados')}>
    <ExecutiveChart days={days} series={CRITICALITY_ORDER.map((label,i)=>({label,color:['#07916d','#d8ad14','#ed7c15','#df2347'][i],value:d=>d.colors[i].count}))} valueLabel={v=>v.toLocaleString('pt-BR',{maximumFractionDigits:1})} label="Criticidade diária" onDay={d=>open('Criticidade em '+civilLabel(d.date),d.rows)}/>
   </AnalysisPanel>
  </div>
  <AnalysisPanel title="Fatores operacionais e aprofundamento" description="Observações do recorte, sem meta, causa ou comparação inventadas" definition={explain({title:'Fatores operacionais e aprofundamento',fields:['Status','Criticidade_ORQUESTRA','Motivo_Criticidade','Recorrencia_30d','Componente Principal','Categoria do Chamado','Insight_ORQUESTRA'],definition:'Síntese descritiva com suporte, sem causalidade ou predição. Campos originais disponíveis no detalhe.',calculation:'Reutilizar C2: não concluídos Laranja/Vermelho; registros com Recorrencia_30d >=3; motivos completos por frequência. Grupos podem se sobrepor; não somar.'})}>
   <div className={styles.insights}>
    <article className={styles.insight}><h3>Atenção na referência</h3><p>{data.risk.active.length} prioridades entre {data.risk.nonConcluded} não concluídos. Laranja é janela de intervenção; Vermelho também exige apoio.</p><button onClick={()=>open('Prioridades ativas',data.risk.active)}>Examinar prioridades</button></article>
    <article className={styles.insight}><h3>Repetição registrada</h3><p>{data.risk.units} unidades distintas em {data.risk.recurrent.length} registros com recorrência ≥ 3. Investigar associação por componente; repetição não comprova causa.</p><button onClick={()=>open('Registros com recorrência elevada',data.risk.recurrent)}>Examinar registros</button></article>
    <article className={styles.insight}><h3>Motivo mais frequente</h3><p>{data.risk.reasons[0]?data.risk.reasons[0].label+' ('+data.risk.reasons[0].count+' chamados).':'Nenhum motivo no recorte.'} Texto completo fornecido, sem inferir causa.</p><button onClick={()=>open('Motivo mais frequente',data.risk.reasons[0]?.rows??[])}>Examinar suporte</button></article>
   </div>
   <p className={styles.note}><a href="#/chamados">Chamados</a> · <a href="#/sla-criticidade">SLA & Criticidade</a> · <a href="#/riscos-tendencias">Riscos & Tendências</a> — os filtros permanecem na navegação.</p>
  </AnalysisPanel>
  <p className={shared.sourceFooter}>Dados sintéticos acadêmicos. Custo estimado não é TCO contábil. SLA da simulação sem validade contratual oficial. Sem meta/plano ou base comparável aprovada, não se afirma desvio. Snapshots e Supervisor separados.</p>
  {allContracts&&<Dialog wide title="Todos os contratos sob pressão operacional" onClose={()=>setAllContracts(false)}><ContractsTable groups={data.contracts} onRecords={open}/><p className={styles.note}>Mesmas regras e filtros da lista inicial; contratos com algum evento Alto.</p></Dialog>}
  {drill&&<Dialog wide title={drill.title} onClose={()=>setDrill(null)}><RecordExplorer label="Chamados da visão executiva" rows={drill.rows} onDetail={setSelected}/></Dialog>}
  {selected&&<ChamadoDetail row={selected} onClose={()=>setSelected(null)}/>}
 </div>;
}
