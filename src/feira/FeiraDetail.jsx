import {Dialog,CriticalityBadge,StatusBadge} from '../platform/components/OperationalUI.jsx';
import {TEMPORAL_DEFINITIONS,SYNTHETIC_TIME_NOTICE} from '../platform/services/temporalDefinitions.js';
import styles from './FeiraApp.module.css';
export default function FeiraDetail({row,metadata,onClose,connectionWarning}){
 const display=(field)=>row.events[field]?.state==='future'?'Evento posterior à referência — oculto':row[field]==null?'Não informado':String(row[field]);
 return <Dialog title={'Chamado '+row.ID_Chamado} onClose={onClose} wide>
  {connectionWarning&&<p role="alert">{connectionWarning}</p>}
  <p>BASE · {metadata.sheet} · {metadata.reference} · {metadata.timezone}</p>
  <p>Simulação pausada. Fechar este detalhe mantém a pausa; selecione Retomar para continuar.</p>
  <StatusBadge value={row.Status}/> <CriticalityBadge value={row.Criticidade_ORQUESTRA}/>
  <dl className={styles.detailFields}>{['Cliente','Unidade','Contrato','Categoria do Chamado','Problema','Descrição do Problema','Componente Principal','Subcomponente','Técnico','Criado em','Contactado','Aceito','Chegou ao Edifício','Saída','Fechamento','TA','TB','SLA_min','ETA_min','Percentual_SLA','Recorrencia_30d','Motivo_Criticidade','Insight_ORQUESTRA'].map(field=><div key={field}><dt>{field}</dt><dd>{display(field)}{field==='Percentual_SLA'&&row[field]!=null?' (fração materializada; 1 = 100%)':''}</dd></div>)}</dl>
  <p>{TEMPORAL_DEFINITIONS.TA.definition}</p><p>{TEMPORAL_DEFINITIONS.TB.definition}</p><p>{SYNTHETIC_TIME_NOTICE}</p>
  <p>Criticidade materializada; {row.Status==='Concluído'?'resultado histórico, sem alerta ativo.':'ocorrência ativa na referência.'} Insight fornecido pela massa sintética; não é previsão comprovada de Machine Learning. SLA/ETA não são atualizados entre snapshots.</p>
  <details><summary>Fonte e rastreabilidade</summary><p>{metadata.sourceFile} · {metadata.sheet} · {metadata.reference}</p><code>{metadata.sourceSha256}</code></details>
 </Dialog>;
}
