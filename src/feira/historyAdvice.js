import history from '../data/orquestra/generated/HIST_60_DIAS.json' with {type:'json'};
const text=value=>typeof value==='string'?value.trim():'';
const same=(a,b,key)=>!!text(a[key])&&text(a[key])===text(b[key]);
// Wording only: exact source labels retain their grouping and original evidence.
const wording=new Map([
 ['Conjunto de degraus ajustado',['Verificar o conjunto de degraus.','foi registrado ajuste desse conjunto']],
 ['Dispositivo inspecionado e operação normalizada',['Verificar o dispositivo.','foram registradas inspeção do dispositivo e normalização da operação']],
 ['Placa revisada e teste funcional',['Verificar a placa.','foram registrados revisão da placa e teste funcional']],
 ['Interface reinicializada/substituída',['Verificar a interface.','foi registrada reinicialização ou substituição da interface']],
 ['Sensor ajustado/substituído',['Verificar o sensor.','foi registrado ajuste ou substituição do sensor']],
 ['Contato reparado',['Verificar o contato.','foi registrado reparo do contato']],
 ['Parâmetros do inversor corrigidos',['Verificar os parâmetros do inversor.','foi registrada correção desses parâmetros']],
 ['Sistema do corrimão ajustado',['Verificar o sistema do corrimão.','foi registrado ajuste desse sistema']],
 ['Sensor de porta ajustado',['Verificar o sensor de porta.','foi registrado ajuste desse componente']],
 ['Resgate concluído e equipamento normalizado',['Avaliar os registros de resgate.','foram registrados resgate e normalização do equipamento']],
 ['Conjunto mecânico revisado',['Verificar o conjunto mecânico.','foi registrada revisão desse conjunto']],
 ['Fonte substituída',['Verificar a fonte.','foi registrada substituição da fonte']],
]);
const guidance=new Map([
 ['Conjunto de degraus ajustado','O técnico deve verificar o conjunto de degraus para confirmar a necessidade de ajuste.'],
 ['Dispositivo inspecionado e operação normalizada','O técnico deve inspecionar o dispositivo para avaliar sua condição atual.'],
 ['Placa revisada e teste funcional','O técnico deve verificar a placa para avaliar a necessidade de revisão e teste funcional.'],
 ['Interface reinicializada/substituída','O técnico deve verificar a interface para avaliar a necessidade de reinicialização ou substituição.'],
 ['Sensor ajustado/substituído','O técnico deve verificar o sensor para avaliar a necessidade de ajuste ou substituição.'],
 ['Contato reparado','O técnico deve inspecionar o contato para avaliar a necessidade de reparo.'],
 ['Parâmetros do inversor corrigidos','O técnico deve verificar os parâmetros do inversor para confirmar se precisam de correção.'],
 ['Sistema do corrimão ajustado','O técnico deve verificar o sistema do corrimão para confirmar a necessidade de ajuste.'],
 ['Sensor de porta ajustado','O técnico deve verificar o componente para confirmar a necessidade de ajuste.'],
 ['Resgate concluído e equipamento normalizado','O técnico deve avaliar os registros para orientar a verificação atual do equipamento.'],
 ['Conjunto mecânico revisado','O técnico deve inspecionar o conjunto mecânico para avaliar a necessidade de revisão.'],
 ['Fonte substituída','O técnico deve verificar a fonte para avaliar a necessidade de substituição.'],
]);
export function historicalWording(solution,count,total,scope){
 if(!Number.isSafeInteger(count)||!Number.isSafeInteger(total)||count<2||total<count)return {action:null,support:null,guidance:null,percentage:null,percentLabel:null};
 const percentage=count/total*100,rounded=Math.round(percentage*10)/10;
 // Avoid rounded 0% or 100% when the underlying ratio is neither boundary.
 const percentLabel=count===total?'100%':rounded===100?'>99,9%':rounded===0?'<0,1%':new Intl.NumberFormat('pt-BR',{maximumFractionDigits:1}).format(percentage)+'%';
 const [action,record]=wording.get(solution)??['Consultar o fechamento predominante.','foi registrado o mesmo fechamento técnico'];
 const population=scope==='same-equipment'?'atendimentos deste equipamento':'atendimentos semelhantes';
 return {action,percentage,percentLabel,guidance:guidance.get(solution)??'O técnico deve consultar o registro histórico antes de definir a verificação necessária.',support:`Em ${percentLabel} dos ${population}, ${record}.`};
}
// Allowlisted technical fields: no customer, address, technician or supervisor identity.
export function historicalCaseEvidence(item){
 const fields=['Problema','Falha','Defeito','Componente Principal','Subcomponente','Tipo de Unidade'];
 const facts=fields.filter(key=>text(item[key])).map(key=>({label:key,value:text(item[key])}));
 const closure=text(item.Fechamento),known=wording.has(closure);
 const outcome=known?closure.match(/(?:operação|equipamento) normalizad[oa]/i)?.[0]:null;
 return {id:text(item.ID_Chamado),date:text(item.Saída)||null,facts,
  intervention:known?closure:closure?'Fechamento em texto livre não exibido na Feira; consulte o registro de origem.':'Intervenção não documentada.',
  outcome:outcome??'Resultado não documentado separadamente. O status Concluído não comprova a resolução da falha.'};
}
// Retrospective CALC only. Never reads future snapshots or changes BASE priority.
export function historyAdvice(row,reference,dataset=history){
 const cutoff=Date.parse(reference),seen=new Set();
 const eligible=Number.isFinite(cutoff)?dataset.records.filter(item=>{
  const created=Date.parse(item['Criado em']),end=Date.parse(item.Saída),id=text(item.ID_Chamado);
  if(!id||id===row.ID_Chamado||seen.has(id)||item.Status!=='Concluído'||!Number.isFinite(created)||!Number.isFinite(end)||end<created||end>cutoff)return false;
  seen.add(id);return true;
 }):[];
 const matching=eligible.filter(item=>['Problema','Componente Principal','Tipo de Unidade'].every(key=>same(row,item,key)));
 const equipment=matching.filter(item=>same(row,item,'Unidade')&&same(row,item,'Cliente'));
 const scope=equipment.length?'same-equipment':'similar-equipment',cases=equipment.length?equipment:matching;
 const groups=new Map();for(const item of cases){const solution=text(item.Fechamento);if(solution)groups.set(solution,(groups.get(solution)??0)+1);}
 const ranked=[...groups].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'pt-BR'));
 const top=ranked[0],supported=!!top&&top[1]>=2&&(!ranked[1]||top[1]>ranked[1][1]);
 const presentation=supported?historicalWording(top[0],top[1],cases.length,scope):{action:null,support:null,guidance:null,percentage:null,percentLabel:null};
 const known=cases.filter(item=>text(item.Fechamento)).length;
 return {available:supported,solution:supported?top[0]:null,count:supported?top[1]:0,total:cases.length,known,missing:cases.length-known,scope,
  ...presentation,summary:presentation.support,noIndication:'Não foi identificada indicação histórica consistente.',
  reason:!Number.isFinite(cutoff)?'Referência temporal inválida.':!cases.length?'Sem ocorrências históricas compatíveis anteriores à referência.':!known?'Sem solução registrada nos casos compatíveis.':'Sem solução histórica predominante com pelo menos dois registros.',
  cases:[...cases].sort((a,b)=>Date.parse(b.Saída)-Date.parse(a.Saída)),
  source:{...dataset.metadata,cutoff:reference,from:cases.length?cases.reduce((m,r)=>r.Saída<m?r.Saída:m,cases[0].Saída):null,to:cases.length?cases.reduce((m,r)=>r.Saída>m?r.Saída:m,cases[0].Saída):null}};
}
