// Presentation only: no fixture, clock, ordering or operational inference.
export const CRITICALITY = Object.freeze({
 Verde: {label:'Verde', tone:'green'}, Amarelo:{label:'Amarelo',tone:'yellow'},
 Laranja:{label:'Laranja · Intervenção',tone:'orange'}, Vermelho:{label:'Vermelho · Crítico',tone:'red'},
});
export const EVENT_FIELDS = ['Criado em','Contactado','Aceito','Chegou ao Edifício','Saída','Fechamento'];
export function fieldValue(row, field) {
 if (row.events?.[field]?.state === 'future') return 'Evento posterior à referência — oculto';
 return row[field] == null || row[field] === '' ? 'Não informado' : String(row[field]);
}
export function visibleRows(view, tab, scope) {
 if (tab === 'alertas') return view.ordered.filter(row => row.Status !== 'Concluído' && ['Laranja','Vermelho'].includes(row.Criticidade_ORQUESTRA));
 return view.ordered.filter(row => scope === 'Ativos' ? row.Status !== 'Concluído' : row.Status === 'Concluído');
}
export function changeLabels(change) {
 if (!change) return [];
 return [change.isNew && 'Novo chamado', change.criticality && `Cor: ${change.criticality.from} → ${change.criticality.to}`,
 change.status && `Status: ${change.status.from} → ${change.status.to}`, change.concluded && 'Chamado concluído'].filter(Boolean);
}
export function temporalSummary(row) {
 if (row.events?.['Criado em']?.state === 'future') return 'Abertura posterior à referência — oculta';
 return row['Criado em'] ? `Abertura · ${String(row['Criado em']).slice(11,16)}` : 'Abertura não informada';
}
