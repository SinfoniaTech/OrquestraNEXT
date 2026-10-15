import {Dialog,StatusBadge,CriticalityBadge} from '../components/ConsultationUI.jsx';
import {dateLabel,percentageLabel,HISTORY,SOURCE} from '../services/chamados.js';
import {TEMPORAL_DEFINITIONS,SYNTHETIC_TIME_NOTICE} from '../services/temporalDefinitions.js';
import {eventAt,EVENT_FIELDS} from '../services/temporal.js';
import styles from '../components/Consultation.module.css';
const DATE_FIELDS=['Criado em','Contactado','Aceito','Chegou ao Edifício','Saída','Momento_Dataset'];
const GROUPS=[
 {title:'Contexto',fields:['ID_Chamado','Cliente','Contrato','Unidade','Tipo de Unidade','Categoria do Chamado','Problema','Descrição do Problema','Origem','Fabricante','Tipo Controle','Tipo Máquina','Código ROT','Componente Principal','Subcomponente','Defeito','Falha','Fechamento']},
 {title:'Operação',fields:['Técnico','Supervisor','Área','Rota','Status','Endereço','Unidade de Negócio','VIP','Corporativo','Passageiro Preso','Carro Parado']},
 {title:'Tempo',fields:['Criado em','Contactado','Aceito','Chegou ao Edifício','Saída','TA','TB','SLA_min','ETA_min','Percentual_SLA','Momento_Dataset']},
 {title:'Inteligência',fields:['Criticidade_ORQUESTRA','Motivo_Criticidade','Recorrencia_30d','Insight_ORQUESTRA','Impacto_Contrato','Custo_Estimado_R$']}
];
const LABELS={'TA':TEMPORAL_DEFINITIONS.TA.label,'TB':TEMPORAL_DEFINITIONS.TB.label,'ID_Chamado':'Identificador','Criticidade_ORQUESTRA':'Criticidade ORQUESTRA','Motivo_Criticidade':'Motivo da criticidade','Insight_ORQUESTRA':'Insight ORQUESTRA','Impacto_Contrato':'Impacto do contrato','SLA_min':'SLA informado','ETA_min':'ETA do técnico informado','Percentual_SLA':'SLA consumido (informado)','Recorrencia_30d':'Recorrência em 30 dias (informada)','Custo_Estimado_R$':'Custo operacional estimado','Momento_Dataset':'Referência dos dados'};
function display(row,field){
 const value=row[field];
 if(EVENT_FIELDS.includes(field)&&eventAt(row,field,HISTORY.metadata.reference).state==='future')return 'Evento posterior à referência; não apresentado como realizado';
 if(value===null)return row.Status!=='Concluído'&&['TA','TB','Saída','Chegou ao Edifício','Fechamento'].includes(field)?'Ainda não disponível':'Não informado';
 if(DATE_FIELDS.includes(field))return dateLabel(value)+' · São Paulo';
 if(field==='Percentual_SLA')return percentageLabel(value);
 if(['SLA_min','ETA_min'].includes(field))return value+' min · valor informado';
 if(['TA','TB'].includes(field))return value+' min · valor materializado sintético';
 if(field==='Custo_Estimado_R$')return value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})+' · estimativa sintética';
 if(field==='Status')return <StatusBadge value={value}/>;
 if(field==='Criticidade_ORQUESTRA')return <CriticalityBadge value={value}/>;
 return String(value);
}
export default function ChamadoDetail({row,onClose}){
 return <Dialog wide title={'Chamado '+row.ID_Chamado} onClose={onClose}>
  <div className={styles.detailBadges}><StatusBadge value={row.Status}/><CriticalityBadge value={row.Criticidade_ORQUESTRA}/><span className={styles.classification}>BASE</span></div>
  <p className={styles.detailNote}>Registro histórico na referência de {dateLabel(HISTORY.metadata.reference)}. Não representa acompanhamento em tempo real.</p>
  {GROUPS.map(group=><section className={styles.detailSection} key={group.title}><h3>{group.title}</h3><dl className={styles.detailGrid}>
   {group.fields.map(field=><div key={field} className={['Descrição do Problema','Insight_ORQUESTRA','Motivo_Criticidade'].includes(field)?styles.fullField:undefined}><dt>{LABELS[field]??field}</dt><dd>{display(row,field)}</dd></div>)}
  </dl></section>)}
  <div className={styles.detailCaution}>SLA restante não é inferido: marco contratual e relógio ainda em validação. ETA refere-se ao técnico, não à logística de peças. {SYNTHETIC_TIME_NOTICE}</div>
  <details className={styles.provenance}><summary>Origem e rastreabilidade</summary><p>BASE · {SOURCE} · America/Sao_Paulo</p><p>{HISTORY.metadata.sourceFile}</p><code>{HISTORY.metadata.sourceSha256}</code><p>Todos os campos são fornecidos pela base; nulos permanecem ausentes. Nenhum cálculo de receita, margem, estoque ou disponibilidade foi realizado.</p></details>
 </Dialog>;
}
