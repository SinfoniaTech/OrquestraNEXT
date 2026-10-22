import HistoryEvidence from '../HistoryEvidence.jsx';
import {Dialog,StatusBadge} from '../../platform/components/OperationalUI.jsx';
import {TEMPORAL_DEFINITIONS,SYNTHETIC_TIME_NOTICE} from '../../platform/services/temporalDefinitions.js';
import {EVENT_FIELDS,fieldValue} from './presentation.js';
import {FeiraPriority} from './SupervisorParts.jsx';
import styles from './Supervisor.module.css';
export default function SupervisorDetail({row,metadata,onClose,online,returnToAlert=false}) {
 const group = (title, fields) => <section className={styles.detailSection}><h3>{title}</h3><dl>{fields.map(field=><div key={field}><dt>{field}</dt><dd>{fieldValue(row,field)}{['TA','TB','SLA_min','ETA_min'].includes(field)&&row[field]!=null?' min':''}</dd></div>)}</dl></section>;
 return <Dialog title={'Chamado '+row.ID_Chamado} onClose={onClose} wide><div className={styles.detail}>
  {returnToAlert&&<button type="button" className={styles.backToAlert} onClick={onClose}>← Voltar ao alerta</button>}
  {!online&&<p role="alert" className={styles.warning}>Sem sincronização. Último estado confirmado; as informações podem estar desatualizadas.</p>}
  <p className={styles.warning}>Pausa global confirmada. Fechar mantém a pausa; somente o notebook autorizado pode retomar.</p>
  <div className={styles.badges}><FeiraPriority value={row.Criticidade_ORQUESTRA}/><span className={styles.status}><StatusBadge value={row.Status}/></span></div>
  {group('Evento e local',['Cliente','Unidade','Tipo de Unidade','Contrato','Endereço','Categoria do Chamado','Problema','Descrição do Problema'])}
  {group('Contexto técnico',['Componente Principal','Subcomponente','Defeito','Falha','Técnico','Supervisor'])}
  {group('Impacto temporal — valores da fonte',['TA','TB','SLA_min','ETA_min','Percentual_SLA'])}
  <p>Percentual_SLA: fração materializada; 1 = 100%. ETA_min refere-se ao técnico, não à logística de peças. Não representa previsão atualizada após chegada ou conclusão.</p>
  <p>{TEMPORAL_DEFINITIONS.TA.definition}</p><p>{TEMPORAL_DEFINITIONS.TB.definition}</p><p>{SYNTHETIC_TIME_NOTICE}</p>
  {group('Histórico disponível nesta fotografia',EVENT_FIELDS)}
  <p>Eventos posteriores à referência ficam ocultos. Esta lista não reconstrói o encerramento técnico nem consulta snapshots futuros.</p>
  <HistoryEvidence row={row} reference={metadata.reference}/>
  {group('Motivo e orientação demonstrativa',['Motivo_Criticidade','Insight_ORQUESTRA','Recorrencia_30d'])}
  <p>Cor e insight fornecidos pela massa sintética. {row.Status==='Concluído'?'Resultado histórico; não é alerta ativo.':'Laranja indica janela de intervenção; Vermelho indica condição crítica.'} Não constituem previsão comprovada de ML ou despacho efetivo.</p>
  <section className={styles.detailSection}><h3>Informações externas — EXT</h3><p>Disponibilidade e localização atual do técnico, estoque, ETA logístico, custo unitário real e despacho não estão disponíveis. Não há ações operacionais reais nesta demonstração.</p></section>
  <details><summary>Fonte e rastreabilidade</summary><p>BASE · {metadata.sheet} · {metadata.reference} · {metadata.timezone}</p><p>{metadata.sourceFile}</p><code>{metadata.sourceSha256}</code></details>
 </div></Dialog>;
}
