import test from 'node:test';
import assert from 'node:assert/strict';
import {HISTORY,DEFAULT_STATE,selectView,periodRange,sortRecords} from '../src/platform/services/chamados.js';
import {equipmentAnalysis,equipmentPage,equipmentDefinition,EQUIPMENT_AVAILABILITY} from '../src/platform/services/equipamentos.js';
import {externalDefinition} from '../src/platform/services/performance.js';
const rows=HISTORY.records,period=periodRange(60),a=equipmentAnalysis(rows,period);
const near=(x,y)=>assert.ok(Math.abs(x-y)<1e-7);
test('C6 unidades distintas e ocorrências conciliam histórico sem inventar parque',()=>{
 assert.equal(a.total,736);assert.equal(a.unitCount,54);assert.equal(a.withoutUnit,0);assert.equal(a.units.reduce((s,g)=>s+g.count,0),736);assert.deepEqual(new Set(a.units.map(g=>g.label)),new Set(rows.map(r=>r.Unidade)));
});
test('C6 recorrência elevada reutiliza >=3 sem somar eventos',()=>{
 assert.equal(a.risk.units,19);const expected=new Set(rows.filter(r=>r.Recorrencia_30d>=3).map(r=>r.Unidade));assert.equal(a.risk.units,expected.size);assert.equal(a.units.filter(g=>g.maxRecurrence>=3).length,19);
});
test('C6 tipos correspondem somente às quatro categorias da fonte',()=>{
 assert.equal(a.typeCount,4);assert.deepEqual(new Set(a.types.map(g=>g.label)),new Set(['Escada Rolante','Elevador Social','Elevador Hospitalar','Elevador de Serviço']));assert.equal(a.types.reduce((s,g)=>s+g.count,0),736);
});
for(const [type,numerator,denominator] of [['Escada Rolante',17,18],['Elevador Social',14,15],['Elevador Hospitalar',12,13],['Elevador de Serviço',7,8]])test('C6 recorrência positiva em '+type+' usa denominador próprio',()=>{
 const g=a.types.find(g=>g.label===type);assert.equal(g.positiveUnits,numerator);assert.equal(g.units,denominator);assert.equal(g.knownUnits,denominator);assert.equal(g.value,numerator/denominator);assert.ok(g.positiveRows.every(r=>r.Recorrencia_30d>0));
});
test('C6 componentes contam chamados não peças ou causas',()=>{
 assert.equal(a.components.reduce((s,g)=>s+g.count,0),736);assert.equal(a.components[0].label,'Painel/Comando');assert.equal(a.components[0].count,163);
});
test('C6 valor de recorrência não é quantidade de chamados',()=>{
 const r=[{...rows[0],ID_Chamado:'A',Unidade:'X',Recorrencia_30d:7,'Criado em':'2026-10-05T10:00:00-03:00'},{...rows[0],ID_Chamado:'B',Unidade:'X',Recorrencia_30d:2,'Criado em':'2026-10-06T10:00:00-03:00'}];const g=equipmentAnalysis(r,period).units[0];assert.equal(g.count,2);assert.equal(g.maxRecurrence,7);assert.equal(g.latest.Recorrencia_30d,2);assert.equal(g.recurrence.count,2);
});
test('C6 último chamado cor e insight são do mesmo registro no recorte',()=>{
 for(const g of a.units){const latest=sortRecords(g.rows,'Criado em','desc')[0];assert.equal(g.latest.ID_Chamado,latest.ID_Chamado);assert.equal(g.latest.Criticidade_ORQUESTRA,latest.Criticidade_ORQUESTRA);assert.equal(g.latest.Insight_ORQUESTRA,latest.Insight_ORQUESTRA);}
 const r=[{...rows[0],ID_Chamado:'B'},{...rows[0],ID_Chamado:'A'}];assert.equal(equipmentAnalysis(r,period).units[0].latest.ID_Chamado,'A');
});
test('C6 histórico cronológico e agrupamentos técnicos preservam o suporte da unidade',()=>{
 for(const g of a.units){assert.deepEqual(g.history,sortRecords(g.rows,'Criado em','desc'));assert.ok(g.history.every(r=>r.Unidade===g.label));assert.equal(g.components.reduce((s,c)=>s+c.count,0),g.count);assert.equal(g.insights.reduce((s,c)=>s+c.count,0),g.count);}
});
test('C6 ordenação padrão por máximo e alternativas precedem paginação',()=>{
 const all=equipmentPage(a.units);assert.equal(all.total,54);assert.equal(all.pages,6);assert.equal(all.rows.length,10);assert.ok(all.ordered.every((g,i)=>!i||all.ordered[i-1].maxRecurrence>=g.maxRecurrence));assert.deepEqual(equipmentPage(a.units,{page:2}).rows,all.ordered.slice(10,20));
 const byCount=equipmentPage(a.units,{sort:'count',direction:'desc'});assert.equal(byCount.rows[0].count,34);assert.equal(equipmentPage(a.units,{size:25}).rows.length,25);
});
test('C6 desempates nulos e criticidade não recalculam classificação',()=>{
 const g=a.units[0],groups=[{...g,label:'B',maxRecurrence:2},{...g,label:'A',maxRecurrence:2},{...g,label:'C',maxRecurrence:null}];for(const direction of ['asc','desc'])assert.deepEqual(equipmentPage(groups,{direction}).ordered.map(g=>g.label),['A','B','C']);
 const colors=equipmentPage(a.units,{sort:'criticality',direction:'desc'}).ordered;assert.equal(colors[0].latest.Criticidade_ORQUESTRA,'Vermelho');assert.equal(equipmentPage(a.units,{page:999}).page,6);
});
test('C6 filtros cumulativos de Unidade e Componente restringem toda análise',()=>{
 const seed=rows.find(r=>r['Tipo de Unidade']==='Escada Rolante'&&r.Recorrencia_30d>=3);const v=selectView({...DEFAULT_STATE,filters:{Unidade:[seed.Unidade],'Componente Principal':[seed['Componente Principal']],'Tipo de Unidade':['Escada Rolante']}}),d=equipmentAnalysis(v.records,v.period);assert.ok(d.total>0);assert.equal(d.unitCount,1);assert.equal(d.typeCount,1);assert.equal(d.components.length,1);assert.equal(d.days.reduce((s,g)=>s+g.total,0),d.total);assert.ok(d.units[0].rows.every(r=>r.Unidade===seed.Unidade&&r['Componente Principal']===seed['Componente Principal']));
});
test('C6 cores por tipo e série diária conciliam chamados filtrados',()=>{
 assert.equal(a.days.length,60);assert.equal(a.days.reduce((s,d)=>s+d.total,0),736);for(const g of a.types)assert.equal(g.colors.reduce((s,c)=>s+c.rows.length,0),g.count);
 const v=selectView({...DEFAULT_STATE,days:7,filters:{Área:['SP-Sul'],Criticidade_ORQUESTRA:['Laranja','Vermelho']}}),d=equipmentAnalysis(v.records,v.period);assert.equal(d.days.length,7);assert.equal(d.types.reduce((s,g)=>s+g.count,0),v.summary.total);
});
test('C6 TA TB SLA e custos por unidade reutilizam elegibilidades aprovadas',()=>{
 assert.equal(a.units.reduce((s,g)=>s+g.ta.count,0),728);assert.equal(a.units.reduce((s,g)=>s+g.tb.count,0),724);assert.equal(a.units.reduce((s,g)=>s+g.adherence.count,0),724);assert.equal(a.units.reduce((s,g)=>s+g.adherence.within.length,0),665);near(a.units.reduce((s,g)=>s+(g.cost.value??0),0),696734.6);
 const g=equipmentAnalysis([{...rows[0],TA:null,TB:0,'Custo_Estimado_R$':0,Status:'Aberto'}],period).units[0];assert.equal(g.ta.value,null);assert.equal(g.tb.value,0);assert.equal(g.cost.value,0);assert.equal(g.adherence.value,null);
});
test('C6 ausentes e inválidos não fabricam entidades recorrência ou componente',()=>{
 const d=equipmentAnalysis([{...rows[0],Unidade:null,'Tipo de Unidade':null,'Componente Principal':null,Recorrencia_30d:null}],period);assert.equal(d.unitCount,0);assert.equal(d.withoutUnit,1);assert.equal(d.typeCount,0);assert.equal(d.components[0].label,'Não informado');assert.equal(d.types[0].value,null);
 const g=equipmentAnalysis([{...rows[0],Recorrencia_30d:null},{...rows[1],Unidade:rows[0].Unidade,Recorrencia_30d:-1}],period).units[0];assert.equal(g.maxRecurrence,null);assert.equal(g.recurrenceCoverage,0);
});
test('C6 recorrência por tipo não confunde unidade positiva com registro ou elevação',()=>{
 const r=[{...rows[0],Unidade:'A','Tipo de Unidade':'T',Recorrencia_30d:1},{...rows[0],Unidade:'A','Tipo de Unidade':'T',Recorrencia_30d:1},{...rows[0],Unidade:'B','Tipo de Unidade':'T',Recorrencia_30d:0},{...rows[0],Unidade:'C','Tipo de Unidade':'T',Recorrencia_30d:null}];const d=equipmentAnalysis(r,period),t=d.types[0];assert.equal(t.positiveUnits,1);assert.equal(t.units,3);assert.equal(t.knownUnits,2);assert.equal(t.value,1/3);assert.equal(d.risk.units,0);
});
test('C6 vazio e ausência completa de recorrência são indisponíveis',()=>{
 const d=equipmentAnalysis([],period);assert.equal(d.unitCount,0);assert.equal(d.typeCount,0);assert.equal(d.total,0);assert.equal(d.units.length,0);assert.equal(equipmentPage([]).pages,1);
 assert.equal(equipmentAnalysis([{...rows[0],Recorrencia_30d:null}],period).types[0].value,null);assert.equal(equipmentAnalysis([{...rows[0],Recorrencia_30d:0}],period).types[0].value,0);
});
test('C6 explicabilidade e disponibilidade EXT não calculam uptime',()=>{
 const v=selectView(DEFAULT_STATE),d=equipmentDefinition({title:'Unidades',fields:['Unidade'],definition:'Presença',calculation:'Distintos',unit:'unidades'},DEFAULT_STATE,v);assert.equal(d.classification,'CALC');assert.equal(d.source,'HIST_60_DIAS');assert.equal(d.population,736);assert.match(d.missing,/nulos\/inválidos não viram zero/);const ext=externalDefinition(EQUIPMENT_AVAILABILITY,DEFAULT_STATE,v);assert.equal(ext.classification,'EXT');assert.match(ext.definition,/Uptime/);assert.match(ext.calculation,/Indisponível/);
});
test('C6 operações não alteram histórico ou regras materializadas',()=>{
 const before=JSON.stringify(HISTORY);equipmentAnalysis(rows,period);equipmentPage(a.units);assert.equal(JSON.stringify(HISTORY),before);
});
