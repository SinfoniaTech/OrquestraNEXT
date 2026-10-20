import {historyAdvice} from './historyAdvice.js';
export default function HistoryEvidence({row,reference}){
 const advice=historyAdvice(row,reference);
 return <section aria-label="Evidência histórica para diagnóstico" data-testid="history-evidence">
  <h3>Histórico para apoiar o diagnóstico</h3>
  <p>{advice.available?advice.summary:advice.reason}</p>
  <p>Hipótese para avaliação técnica; fechamento registrado não comprova a causa nem garante a solução atual.</p>
  <details><summary>Ver ocorrências e critérios usados</summary>
   <p>CALC · HIST_60_DIAS · dados sintéticos. Correspondência exata de problema, componente principal e tipo de unidade. {advice.scope==='same-equipment'?'Mesmo cliente e unidade.':'Equipamentos semelhantes; não são ocorrências comprovadas deste equipamento.'}</p>
   <p>N={advice.total} concluídos compatíveis; {advice.known} com fechamento; {advice.missing} sem solução registrada. Uma hipótese exige ao menos dois registros da mesma solução e liderança sem empate; não é probabilidade de sucesso.</p>
   <p>Corte: {reference}. Somente concluídos com criação e saída válidas, saída anterior ou igual ao corte. Saída é limite de elegibilidade, não data inferida do texto Fechamento. Sem consulta de snapshots futuros.</p>
   <p>Período das saídas: {advice.source.from??'Não disponível'} até {advice.source.to??'Não disponível'}. Referência da base histórica: {advice.source.reference}. Análise retrospectiva da base disponível.</p>
   <ul>{advice.cases.map(item=><li key={item.ID_Chamado}><strong>{item.ID_Chamado}</strong> · {item.Cliente} · {item.Unidade} · {item.Saída}<br/>{item.Problema} · {item['Componente Principal']}<br/>Fechamento: {item.Fechamento||'Não informado'}</li>)}</ul>
   <p>Fonte: {advice.source.sourceFile} · {advice.source.sheet} · {advice.source.timezone}</p><code>{advice.source.sourceSha256}</code>
  </details>
 </section>;
}
