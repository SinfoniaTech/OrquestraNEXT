import {useMemo,useState} from 'react';
import {useConsultation} from '../filters/ConsultationContext.jsx';
import {slaAnalysis,timeGroups,slaDefinition,numberLabel,percentLabel} from '../services/sla.js';
import {TEMPORAL_DEFINITIONS,SYNTHETIC_TIME_NOTICE} from '../services/temporalDefinitions.js';
import {SOURCE,civilLabel,etaLabel,slaRemainingLabel} from '../services/chamados.js';
import {FilterBar,KpiCard,IndicatorInfo,CriticalityBadge,StatusBadge,Dialog,Pagination} from '../components/ConsultationUI.jsx';
import DataTable from '../components/DataTable.jsx';
import ChamadoDetail from './ChamadoDetail.jsx';
import shared from '../components/Consultation.module.css';
import styles from './SlaCriticidadePage.module.css';

export default function SlaCriticidadePage(){
 const {state,dispatch,view}=useConsultation();
 const analysis=useMemo(()=>slaAnalysis(view.records),[view.records]);
 const [group,setGroup]=useState('Área'),[drill,setDrill]=useState(null),[selected,setSelected]=useState(null),[drillPage,setDrillPage]=useState(1),[drillSize,setDrillSize]=useState(10);
 const groups=useMemo(()=>timeGroups(view.records,group),[view.records,group]);
 const explain=config=>slaDefinition(config,state,view);
 const openList=(title,rows)=>{setDrill({title,rows});setDrillPage(1);setDrillSize(10);};
 const meanDefinition=(field,data)=>explain({title:TEMPORAL_DEFINITIONS[field].label,fields:[field],definition:TEMPORAL_DEFINITIONS[field].definition+' '+SYNTHETIC_TIME_NOTICE,calculation:'Média dos valores materializados: soma de '+field+' finito e não negativo ÷ N válido do próprio campo. Todos os status; sem elegíveis, não calculável. Nenhum marco é reconstruído.',unit:'minutos',eligible:data.count});
 const consumptionDefinition=explain({title:'Consumo médio informado',fields:['Percentual_SLA'],definition:'Média simples do consumo materializado de SLA, em todos os status; não é criticidade nem aderência e não representa consumo agregado de um contrato.',calculation:'Soma de Percentual_SLA válido ÷ N válido × 100; sem ponderação por SLA_min. Sem elegíveis, não calculável.',unit:'%',eligible:analysis.consumption.count});
 const criticalDefinition=explain({title:'Criticidade histórica',fields:['Criticidade_ORQUESTRA'],definition:'Distribuição da classificação fornecida em todos os status do recorte.',calculation:'Contar IDs por Criticidade_ORQUESTRA; participação = contagem ÷ total filtrado × 100. Nenhuma cor é derivada do SLA.',missing:'Categoria ausente permanece ausente, sem ser classificada por inferência.'});
 const priorityDefinition=explain({title:'Atenção operacional na referência',fields:['Status','Criticidade_ORQUESTRA','Motivo_Criticidade'],definition:'Somente não concluídos Laranja/Vermelho na referência da demonstração; não monitoramento em tempo real.',calculation:'Status != Concluído AND criticidade em {Laranja,Vermelho}. Vermelho primeiro, depois criação mais antiga.',eligible:analysis.priority.length,missing:'Não inferir cor por percentual de SLA; usar classificação materializada.'});
 const columns=[
  {key:'ID_Chamado',label:'Chamado',render:r=><button className={shared.idButton} onClick={()=>setSelected(r)}>{r.ID_Chamado}</button>},
  {key:'Cliente',label:'Cliente'},{key:'Unidade',label:'Equipamento'},{key:'Status',label:'Status',render:r=><StatusBadge value={r.Status}/>},
  {key:'Criticidade_ORQUESTRA',label:'Criticidade',render:r=><CriticalityBadge value={r.Criticidade_ORQUESTRA}/>},
  {key:'Passageiro Preso',label:'Passageiro preso'},{key:'Carro Parado',label:'Carro parado'},
  {key:'Motivo_Criticidade',label:'Motivo informado'},{key:'Percentual_SLA',label:'Consumo informado',render:r=>percentLabel(r.Percentual_SLA)},
  {key:'sla',label:'SLA restante',render:slaRemainingLabel},{key:'eta',label:'ETA técnico',render:etaLabel},
  {key:'action',label:'Detalhe',render:r=><button className={shared.rowAction} onClick={()=>setSelected(r)} aria-label={'Ver detalhes de '+r.ID_Chamado}>Ver ↗</button>}
 ];
 const cards=[
  {title:'Aderência ao SLA',value:percentLabel(analysis.adherence.value),subtitle:analysis.adherence.within.length+' dentro / '+analysis.adherence.count+' concluídos elegíveis',definition:explain({title:'Aderência ao SLA',fields:['Status','SLA_min','Percentual_SLA'],definition:'Cumprimento segundo consumo materializado, apenas entre concluídos elegíveis. Regra aprovada para demonstração, não certificação contratual.',calculation:'Elegíveis: Status = Concluído, SLA_min finito > 0 e Percentual_SLA finito >= 0. Aderência = contagem com Percentual_SLA <= 1 ÷ elegíveis × 100; > 1 é ultrapassado. Sem elegíveis, não calculável.',unit:'%',eligible:analysis.adherence.count,missing:'Ausentes, inválidos, SLA_min <= 0 e não concluídos são excluídos do denominador. Zero Percentual_SLA informado é válido.'}),rows:analysis.adherence.rows},
  ...['TA','TB'].map(field=>({title:TEMPORAL_DEFINITIONS[field].label,value:numberLabel(analysis[field.toLowerCase()].value),subtitle:analysis[field.toLowerCase()].count+' válidos · média em minutos',definition:meanDefinition(field,analysis[field.toLowerCase()]),rows:analysis[field.toLowerCase()].rows})),
  {title:'Consumo médio informado',value:percentLabel(analysis.consumption.value),subtitle:analysis.consumption.count+' valores de Percentual_SLA',definition:consumptionDefinition,rows:analysis.consumption.rows},
  {title:'Ocorrências com passageiro preso',value:analysis.passengers.length,subtitle:'Marcador Sim · todos os status',definition:explain({title:'Ocorrências com passageiro preso',fields:['Passageiro Preso'],definition:'Chamados do recorte marcados Sim; inclui concluídos, não é quantidade de pessoas atualmente presas.',calculation:'Contar IDs com Passageiro Preso = Sim.',missing:'Ausente não é Sim nem quantidade zero de pessoas.'}),rows:analysis.passengers}
 ];
 return <div className={shared.consultation}>
  <div className={shared.referenceLine}><span>HISTÓRICO · {SOURCE}</span><span>{civilLabel(view.period.from)}–{civilLabel(view.period.to)} · referência 06/10/2026, 22h (São Paulo)</span></div>
  <div className={styles.cards}>{cards.map(card=><div key={card.title}><KpiCard {...card}/>{card.rows&&<span className={styles.kpiAction}><button onClick={()=>openList(card.title,card.rows)}>Ver {card.rows.length} registros</button></span>}</div>)}</div>
  <FilterBar state={state} dispatch={dispatch} total={view.summary.total}/>
  <p className={styles.note} role="status"><strong data-testid="sla-total">{analysis.total}</strong> chamados no recorte. Todos os painéis respeitam os mesmos filtros; cada indicador informa seus elegíveis.</p>
  <div className={styles.grid}>
   <section className={styles.panel} aria-label="Criticidade histórica">
    <div className={styles.title}><div><h2>Criticidade histórica</h2><p>Todos os status · classificação fornecida pela base.</p></div><IndicatorInfo definition={criticalDefinition}/></div>
    <div className={styles.colors}>{analysis.criticalities.map(item=><button key={item.label} className={styles.colorButton} aria-label={'Ver criticidade '+item.label} onClick={()=>openList('Criticidade: '+item.label,item.rows)}><CriticalityBadge value={item.label}/><strong data-testid={'sla-cor-'+item.label}>{item.rows.length}</strong><small>{analysis.total?percentLabel(item.rows.length/analysis.total):'—'}</small></button>)}</div>
    <p className={styles.note}><strong>Laranja: janela de intervenção.</strong> Vermelho: condição crítica, exige apoio à decisão. Consumo do SLA é uma dimensão distinta; não determina a cor nesta página.</p>
   </section>
   <section className={styles.panel} aria-label="Faixas de consumo do SLA">
    <div className={styles.title}><div><h2>Consumo do SLA por faixa</h2><p>Percentual_SLA materializado · separado de criticidade.</p></div><IndicatorInfo definition={explain({title:'Consumo do SLA por faixa',fields:['Percentual_SLA'],definition:'Distribuição do consumo materializado entre todos os status; não equivale a criticidade nem aderência dos concluídos.',calculation:'Contar IDs nas faixas contínuas: 0 <= p <= 0,5; 0,5 < p <= 0,8; 0,8 < p <= 1; p > 1. Fração 1 = 100%. Barra = contagem ÷ total filtrado. Não alterar p.',eligible:analysis.consumption.count,missing:'Percentuais ausentes, negativos ou não finitos ficam fora das faixas; zero válido permanece na primeira faixa.'})}/></div>
    <ul className={styles.list}>{analysis.bands.map(band=><li key={band.id}><button className={styles.row} aria-label={'Ver faixa '+band.label} onClick={()=>openList('Consumo: '+band.label,band.rows)}><span>{band.label}</span><strong data-testid={'sla-band-'+band.id}>{band.rows.length}</strong><span className={styles.track} aria-hidden="true"><span className={styles.fill} style={{width:(analysis.total?band.rows.length/analysis.total*100:0)+'%'}}/></span></button></li>)}</ul>
    <p className={styles.note}>Faixas contínuas aprovadas para demonstração. Todos os status; apenas Percentual_SLA válido. Não são níveis de criticidade.</p>
    <button className={shared.outlineButton} onClick={()=>openList('Concluídos dentro do SLA',analysis.adherence.within)}>Dentro: {analysis.adherence.within.length}</button>{' '}
    <button className={shared.outlineButton} onClick={()=>openList('Concluídos acima do SLA',analysis.adherence.over)}>Ultrapassado: {analysis.adherence.over.length}</button>
   </section>
   <section className={styles.panel} aria-label="Tempos por agrupamento">
    <div className={styles.title}><div><h2>TA e TB por agrupamento</h2><p>Médias em minutos da massa sintética. N válido por campo.</p></div><IndicatorInfo definition={explain({title:'TA e TB por agrupamento',fields:['TA','TB',group],definition:'Agrupamento dos valores materializados em minutos: TA até chegada, TB resolução simulada. Encerramento técnico não persistido. Definições sintéticas, sem validade oficial OTIS.',calculation:'Para cada grupo: soma de TA/TB válido ÷ N válido do respectivo campo. Nulos excluídos independentemente.',unit:'minutos'})}/></div>
    <label>Agrupar por <select className={styles.select} aria-label="Agrupar tempos por" value={group} onChange={e=>setGroup(e.target.value)}>{['Área','Categoria do Chamado','Cliente','Tipo de Unidade'].map(field=><option key={field}>{field}</option>)}</select></label>
    <div className={styles.tableWrap}><table className={styles.miniTable}><thead><tr><th>{group}</th><th>TA médio (min) · N</th><th>TB médio (min) · N</th></tr></thead><tbody>{groups.map(item=><tr key={item.label}><td><button onClick={()=>openList(group+': '+item.label,item.rows)}>{item.label}</button></td><td>{numberLabel(item.ta.value)} · {item.ta.count}</td><td>{numberLabel(item.tb.value)} · {item.tb.count}</td></tr>)}</tbody></table></div>
    {!groups.length&&<p>Nenhum grupo no recorte.</p>}
   </section>
   <section className={styles.panel} aria-label="Motivos de criticidade">
    <div className={styles.title}><div><h2>Principais motivos informados</h2><p>Textos completos de Motivo_Criticidade, sem inferir causalidade.</p></div><IndicatorInfo definition={explain({title:'Principais motivos informados',fields:['Motivo_Criticidade'],definition:'Frequência de justificativas completas fornecidas, em todos os status. Motivos compostos não são separados em eventos.',calculation:'Agrupar IDs pelo texto exato de Motivo_Criticidade, ordenar por contagem decrescente. Barra = contagem ÷ total filtrado.',missing:'Ausente aparece como Não informado, não é descartado.'})}/></div>
    <ul className={styles.list+' '+styles.scroll}>{analysis.reasons.map(item=><li key={item.label}><button className={styles.row} onClick={()=>openList('Motivo: '+item.label,item.rows)}><span>{item.label}</span><strong>{item.count}</strong><span className={styles.track} aria-hidden="true"><span className={styles.fill} style={{width:(analysis.total?item.count/analysis.total*100:0)+'%'}}/></span></button></li>)}</ul>
    {!analysis.reasons.length&&<p>Nenhum motivo no recorte.</p>}
   </section>
  </div>
  <section className={shared.resultsCard} aria-label="Ocorrências prioritárias">
   <div className={shared.resultsHeading}><div><h2>Atenção operacional na referência <span className={shared.resultCount} data-testid="sla-active">{analysis.priority.length}</span></h2><p>De {analysis.active} não concluídos · Laranja ou Vermelho. Históricos concluídos não são alertas ativos.</p></div><IndicatorInfo definition={priorityDefinition}/></div>
   {analysis.priority.length?<DataTable label="Chamados prioritários" columns={columns} rows={analysis.priority}/>:<p className={styles.note}>Nenhuma ocorrência ativa Laranja ou Vermelho no recorte.</p>}
  </section>
  <p className={shared.sourceFooter}>Resultados de SLA da simulação, sem validade contratual oficial OTIS. {SYNTHETIC_TIME_NOTICE} Dados sintéticos HIST_60_DIAS. Snapshots T0/T1/T2 separados. SLA restante continua em validação contratual; não calculado.</p>
  {drill&&!selected&&<Dialog title={drill.title} wide onClose={()=>setDrill(null)}><p>{drill.rows.length} chamados deste aprofundamento · filtros da página preservados.</p>{drill.rows.length?<DataTable label="Chamados do aprofundamento" columns={columns} rows={drill.rows.slice((drillPage-1)*drillSize,drillPage*drillSize)}/>:<p>Nenhum registro neste grupo.</p>}<Pagination page={drillPage} pages={Math.max(1,Math.ceil(drill.rows.length/drillSize))} total={drill.rows.length} pageSize={drillSize} onPage={setDrillPage} onPageSize={value=>{setDrillSize(Number(value));setDrillPage(1);}}/></Dialog>}
  {selected&&<ChamadoDetail row={selected} onClose={()=>setSelected(null)}/>}
 </div>;
}
