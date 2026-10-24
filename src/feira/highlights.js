const severity={Verde:0,Amarelo:1,Laranja:2,Vermelho:3};
// Facts come from the audited snapshot diff; priority only selects presentation.
export function selectHighlights(view){
 const rows=new Map(view.rows.map(row=>[row.ID_Chamado,row]));
 const audited=(change,type,detail)=>view.auditEvents.some(event=>event.ID_Chamado===change.id&&event.Tipo_Mudanca===type&&(!detail||(event.Valor_Anterior===detail.from&&event.Valor_Atual===detail.to)));
 const ranked=view.changes.flatMap(change=>{
  const row=rows.get(change.id);if(!row)return [];
  const c={...change,isNew:change.isNew&&audited(change,'NOVO'),status:change.status&&audited(change,'STATUS',change.status)?change.status:null,criticality:change.criticality&&audited(change,'CRITICIDADE',change.criticality)?change.criticality:null};
  c.concluded=!!c.status&&change.concluded;
  const active=row.Status!=='Concluído',elevated=c.criticality&&severity[c.criticality.to]>severity[c.criticality.from];
  const rank=active&&row.Criticidade_ORQUESTRA==='Vermelho'&&(elevated||c.isNew)?0:active&&elevated&&row.Criticidade_ORQUESTRA==='Laranja'?1:active&&elevated&&severity[row.Criticidade_ORQUESTRA]>=2?2:active&&c.status&&severity[row.Criticidade_ORQUESTRA]>=2?3:active&&c.isNew&&severity[row.Criticidade_ORQUESTRA]>=2?4:c.concluded&&(severity[row.Criticidade_ORQUESTRA]>=2||severity[c.criticality?.from]>=2)?5:Infinity;
  return Number.isFinite(rank)?[{change:c,rank}]:[];
 }).sort((a,b)=>a.rank-b.rank||Number(b.change.isNew)-Number(a.change.isNew)||a.change.id.localeCompare(b.change.id));
 // One signal per priority class avoids spending both slots on equivalent red changes.
 return ranked.filter((item,index)=>ranked.findIndex(other=>other.rank===item.rank)===index).slice(0,2).map(item=>item.change);
}
export function consecutive(previous,next){
 return previous.sessionId===next.sessionId&&previous.cycle===next.cycle&&next.index===previous.index+1&&previous.online&&next.online&&previous.resyncId===next.resyncId&&previous.context===next.context;
}
