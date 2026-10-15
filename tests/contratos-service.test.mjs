import test from 'node:test';
import assert from 'node:assert/strict';
import {HISTORY,DEFAULT_STATE,selectView,periodRange} from '../src/platform/services/chamados.js';
import {contractAnalysis,contractMetrics,contractPage,recurrenceRatio,technicalGroups,contractDefinition,CONTRACT_EXTERNAL} from '../src/platform/services/contratos.js';
import {externalDefinition} from '../src/platform/services/performance.js';
const rows=HISTORY.records,period=periodRange(60),data=contractAnalysis(rows,period);
test('C4 carteira reconcilia todos os contratos distintos e volume',()=>{
 assert.equal(data.contractCount,12);assert.equal(data.count,736);assert.equal(data.unassigned,0);
 assert.equal(data.groups.reduce((s,g)=>s+g.count,0),736);assert.deepEqual(new Set(data.groups.map(g=>g.label)),new Set(rows.map(r=>r.Contrato)));
});
test('C4 custos reconcilia soma da fonte por contrato e cobertura',()=>{
 assert.ok(Math.abs(data.cost.value-696734.6)<1e-6);
 for(const g of data.groups){assert.equal(g.cost.count,g.count);assert.equal(g.cost.value,rows.filter(r=>r.Contrato===g.label).reduce((s,r)=>s+r['Custo_Estimado_R$'],0));}
 assert.ok(Math.abs(data.groups.reduce((s,g)=>s+g.cost.value,0)-data.cost.value)<1e-6);
});
test('C4 inclui contratos sem Alto e classifica pressão sem faixas inventadas',()=>{
 const result=contractAnalysis([{...rows[0],Contrato:'A',Impacto_Contrato:'Baixo'},{...rows[0],Contrato:'B',Impacto_Contrato:'Alto'}],period);
 assert.equal(result.groups.length,2);assert.equal(result.risk.contracts,1);assert.equal(result.groups.find(g=>g.label==='A').pressure,'Sem impacto Alto no recorte');assert.equal(result.groups.find(g=>g.label==='B').pressure,'Sob pressão');
 assert.equal(contractMetrics([{Impacto_Contrato:null}]).pressure,'Sem informação de impacto');
 assert.match(contractMetrics([{Impacto_Contrato:null},{Impacto_Contrato:'Baixo'}]).pressure,/parcial/);
});
test('C4 recorrência é proporção de chamados positivos sobre total, sem soma de eventos',()=>{
 const n=rows.filter(r=>r.Recorrencia_30d>0).length;
 assert.equal(data.recurrence.count,n);assert.equal(data.recurrence.value,n/736);assert.equal(data.recurrence.valid,736);
 const r=recurrenceRatio([{Recorrencia_30d:0},{Recorrencia_30d:8},{Recorrencia_30d:null},{Recorrencia_30d:-1},{Recorrencia_30d:'4'}]);assert.equal(r.value,1/5);assert.equal(r.valid,2);assert.equal(r.excluded,3);
});
test('C4 SLA por contrato usa concluídos elegíveis, não consumo médio',()=>{
 for(const g of data.groups){const eligible=g.rows.filter(r=>r.Status==='Concluído'&&Number.isFinite(r.SLA_min)&&r.SLA_min>0&&Number.isFinite(r.Percentual_SLA)&&r.Percentual_SLA>=0);assert.equal(g.adherence.count,eligible.length);assert.equal(g.adherence.value,eligible.length?eligible.filter(r=>r.Percentual_SLA<=1).length/eligible.length:null);}
 assert.equal(data.groups.reduce((s,g)=>s+g.adherence.count,0),724);assert.equal(data.groups.reduce((s,g)=>s+g.adherence.within.length,0),665);
});
test('C4 custos/TA/TB nulos excluídos e zeros válidos',()=>{
 const m=contractMetrics([{'Custo_Estimado_R$':null,TA:null,TB:0},{'Custo_Estimado_R$':0,TA:0,TB:null},{'Custo_Estimado_R$':-2,TA:10,TB:10}]);
 assert.equal(m.cost.value,0);assert.equal(m.cost.count,1);assert.equal(m.ta.value,5);assert.equal(m.ta.count,2);assert.equal(m.tb.value,5);
 assert.equal(contractMetrics([{}]).cost.value,null);assert.equal(contractMetrics([{}]).ta.value,null);
});
test('C4 vazio e recorrência toda ausente são indisponíveis',()=>{
 const empty=contractAnalysis([],period);assert.equal(empty.contractCount,0);assert.equal(empty.cost.value,null);assert.equal(empty.recurrence.value,null);assert.equal(empty.adherence.value,null);
 assert.equal(recurrenceRatio([{Recorrencia_30d:null}]).value,null);assert.equal(recurrenceRatio([{Recorrencia_30d:0}]).value,0);
});
test('C4 contratos ausentes não criam entidade e custo geral mantém esses registros',()=>{
 const d=contractAnalysis([{...rows[0],Contrato:null},{...rows[1],Contrato:''}],period);assert.equal(d.groups.length,0);assert.equal(d.unassigned,2);assert.equal(d.cost.count,2);
});
test('C4 ordenação numérica precede paginação e desempata por contrato',()=>{
 const all=contractPage(data.groups,{sort:'count',direction:'desc',size:10});assert.equal(all.total,12);assert.equal(all.pages,2);assert.equal(all.rows.length,10);assert.equal(all.ordered[0].label,'CT-2026-007');
 assert.deepEqual(contractPage(data.groups,{sort:'count',direction:'desc',page:2,size:10}).rows,all.ordered.slice(10));
 for(const key of ['count','cost','sla','high','recurrence']){const d=contractPage(data.groups,{sort:key,direction:'asc'});assert.equal(d.total,12);assert.equal(d.rows.length,10);}
 const g=[{...data.groups[0],label:'B',count:2},{...data.groups[0],label:'A',count:2}];assert.deepEqual(contractPage(g).ordered.map(g=>g.label),['A','B']);
});
test('C4 busca por cliente ou contrato ignora acentos/caixa e combina palavras',()=>{
 const g={...data.groups[0],clients:['Hospital São Paulo'],label:'CT-A'};
 assert.equal(contractPage([g],{search:'HOSPITAL SAO PAULO'}).total,1);assert.equal(contractPage([g],{search:'ct-a hospital'}).total,1);assert.equal(contractPage([g],{search:'ausente'}).total,0);
});
test('C4 ordenação preserva indisponíveis por último nos dois sentidos',()=>{
 const groups=[{...data.groups[0],label:'A',cost:{value:null}},{...data.groups[0],label:'B',cost:{value:0}}];
 for(const direction of ['asc','desc'])assert.deepEqual(contractPage(groups,{sort:'cost',direction}).ordered.map(g=>g.label),['B','A']);
 assert.equal(contractPage(data.groups,{page:999}).page,2);
});
test('C4 filtros cumulativos alimentam carteira, gráficos e suporte únicos',()=>{
 const state={...DEFAULT_STATE,days:7,filters:{Área:['SP-Sul'],Criticidade_ORQUESTRA:['Laranja','Vermelho']},search:'SP-SUL'};const view=selectView(state),d=contractAnalysis(view.records,view.period);
 assert.ok(view.records.length>0);assert.equal(d.count,view.summary.total);assert.equal(d.groups.reduce((s,g)=>s+g.count,0),d.count);assert.equal(d.days.reduce((s,g)=>s+g.total,0),d.count);assert.equal(d.days.length,7);
 assert.ok(d.groups.every(g=>g.rows.every(r=>r['Área']==='SP-Sul'&&['Laranja','Vermelho'].includes(r.Criticidade_ORQUESTRA))));
});
test('C4 séries diárias conciliam volume e custo sem misturar unidades',()=>{
 assert.equal(data.days.length,60);assert.equal(data.days.reduce((s,d)=>s+d.total,0),736);assert.ok(Math.abs(data.days.reduce((s,d)=>s+(d.cost.value??0),0)-data.cost.value)<1e-6);
 const d=contractAnalysis([{...rows[0],'Criado em':'2026-10-06T00:00:00-03:00','Custo_Estimado_R$':null}],periodRange(7));assert.equal(d.days.at(-1).total,1);assert.equal(d.days.at(-1).cost.value,null);assert.equal(d.days[0].total,0);
});
test('C4 categorias, componentes e equipamentos permitem reconciliar recorrência e chamados',()=>{
 for(const groups of [data.categories,data.components,data.equipment]){assert.equal(groups.reduce((s,g)=>s+g.count,0),736);assert.equal(groups.reduce((s,g)=>s+g.recurrence.count,0),data.recurrence.count);}
 assert.equal(technicalGroups([{Unidade:null}], 'Unidade')[0].label,'Não informado');
});
test('C4 explicabilidade e quatro fontes EXT nunca fabricam finanças',()=>{
 const v=selectView(DEFAULT_STATE),d=contractDefinition({title:'Recorrência',fields:['Recorrencia_30d'],definition:'Proporção',calculation:'Positivos/total',unit:'%'},DEFAULT_STATE,v);assert.equal(d.population,736);assert.equal(d.classification,'CALC');assert.equal(d.source,'HIST_60_DIAS');assert.match(d.missing,/denominador total/);
 assert.equal(CONTRACT_EXTERNAL.length,4);for(const m of CONTRACT_EXTERNAL){const ext=externalDefinition(m,DEFAULT_STATE,v);assert.equal(ext.classification,'EXT');assert.match(ext.calculation,/Indisponível/);assert.match(ext.source,/pendente/);}
});
test('C4 agregações preservam dados e regras materializadas',()=>{
 const before=JSON.stringify(HISTORY);contractAnalysis(rows,period);contractPage(data.groups);assert.equal(JSON.stringify(HISTORY),before);
});
