import {useEffect,useId,useState} from 'react';
import {historyAdvice,historicalCaseEvidence} from './historyAdvice.js';
import styles from './HistoryEvidence.module.css';
export default function HistoryEvidence({row,reference,compact=false}){
 const advice=historyAdvice(row,reference),id=useId(),[expanded,setExpanded]=useState(false);
 useEffect(()=>setExpanded(false),[row.ID_Chamado,reference]);
 const current=['Problema','Falha','Defeito','Componente Principal','Subcomponente','Tipo de Unidade'].filter(key=>typeof row[key]==='string'&&row[key].trim());
 return <section className={styles.section} aria-label="Evidência histórica para diagnóstico" data-testid="history-evidence">
  {!compact&&<><h3>O que o histórico sugere</h3><p>{advice.available?advice.action:advice.noIndication}</p>{advice.available&&<p>{advice.support}</p>}<p>{advice.guidance??'Sem base histórica suficiente para orientar uma intervenção; o técnico deve avaliar a falha registrada.'}</p></>}
  <button type="button" className={styles.toggle} aria-expanded={expanded} aria-controls={id} onClick={()=>setExpanded(value=>!value)}><span aria-hidden="true">{expanded?'▾':'▸'}</span>{expanded?'Ocultar evidências técnicas':'Ver evidências técnicas'}</button>
  <div id={id} className={styles.body} hidden={!expanded} data-testid="technical-evidence">
   <h4>Evidência histórica de manutenção</h4>
   <p>Fonte histórica sintética. Documentação técnica, medições e procedimentos de fabricante não estão disponíveis nesta base.</p>
   <h4>Falha consultada · {row.ID_Chamado}</h4>
   <dl className={styles.facts}>{current.map(key=><div key={key}><dt>{key}</dt><dd>{row[key]}</dd></div>)}</dl>
   <p>Critérios de semelhança: mesmo problema, componente principal e tipo de unidade. {advice.scope==='same-equipment'?'Registros deste equipamento, identificados pelo vínculo de cliente e unidade.':'Registros de equipamentos semelhantes; não são ocorrências comprovadas deste equipamento.'} Falha e defeito são contexto registrado; não são critérios adicionais de agrupamento.</p>
   <p>CALC · {advice.available?advice.support:advice.noIndication} {advice.available?`Intervenção predominante em ${advice.count} de ${advice.total} atendimentos elegíveis.`:advice.reason}</p>
   <p>N={advice.total} concluídos compatíveis; {advice.known} com fechamento; {advice.missing} sem intervenção registrada. O denominador inclui os fechamentos ausentes. Exige ao menos dois registros do mesmo fechamento e liderança sem empate.</p>
   <p>Percentual de ocorrência histórica; não representa probabilidade de diagnóstico, necessidade confirmada de intervenção ou garantia de solução. A sugestão do sistema é uma inferência para verificação técnica.</p>
   <p>Período das saídas: {advice.source.from??'Não disponível'} até {advice.source.to??'Não disponível'}. Corte: {reference}. Somente concluídos com criação e saída válidas, saída anterior ou igual ao corte. Sem dados futuros.</p>
   <h4>Registros de suporte e referência de origem</h4>
   {advice.cases.length?<ul className={styles.cases}>{advice.cases.map(item=>{const evidence=historicalCaseEvidence(item);return <li key={evidence.id}><strong>Registro {evidence.id}</strong>{evidence.date&&<p>Saída registrada: {evidence.date}</p>}<dl className={styles.facts}>{evidence.facts.map(fact=><div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl><p>Intervenção / Fechamento: {evidence.intervention}</p><p>Resultado registrado: {evidence.outcome}</p><p>Referência: {advice.source.sheet??'HIST_60_DIAS'} · ID_Chamado {evidence.id}.</p></li>;})}</ul>:<p>Não há atendimentos elegíveis para sustentar esta recomendação.</p>}
   <p>Fonte: {advice.source.sourceFile??'Não disponível'} · {advice.source.sheet??'HIST_60_DIAS'} · {advice.source.timezone??'Fuso não informado'}. Referência da base: {advice.source.reference??'Não disponível'}.</p>{advice.source.sourceSha256&&<p>Identificador da fonte: <code>{advice.source.sourceSha256}</code></p>}
  </div>
 </section>;
}
