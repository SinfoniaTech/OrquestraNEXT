import history from '../data/orquestra/generated/HIST_60_DIAS.json' with {type:'json'};
const text=value=>typeof value==='string'?value.trim():'';
const same=(a,b,key)=>!!text(a[key])&&text(a[key])===text(b[key]);
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
 const known=cases.filter(item=>text(item.Fechamento)).length;
 return {available:supported,solution:supported?top[0]:null,count:supported?top[1]:0,total:cases.length,known,missing:cases.length-known,scope,
  summary:supported?`${top[1]} de ${cases.length} casos ${scope==='same-equipment'?'deste equipamento':'em equipamentos semelhantes'}: “${top[0]}”.`:null,
  reason:!Number.isFinite(cutoff)?'Referência temporal inválida.':!cases.length?'Sem ocorrências históricas compatíveis anteriores à referência.':!known?'Sem solução registrada nos casos compatíveis.':'Sem solução histórica predominante com pelo menos dois registros.',
  cases:[...cases].sort((a,b)=>Date.parse(b.Saída)-Date.parse(a.Saída)),
  source:{...dataset.metadata,cutoff:reference,from:cases.length?cases.reduce((m,r)=>r.Saída<m?r.Saída:m,cases[0].Saída):null,to:cases.length?cases.reduce((m,r)=>r.Saída>m?r.Saída:m,cases[0].Saída):null}};
}
