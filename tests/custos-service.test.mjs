import test from 'node:test';
import assert from 'node:assert/strict';
import {HISTORY,DEFAULT_STATE,selectView,periodRange} from '../src/platform/services/chamados.js';
import {costAnalysis,costMetrics,costGroups,costCalls,costTablePage,costDefinition,COST_FIELD,COST_DIMENSIONS,COST_EXTERNAL} from '../src/platform/services/custos.js';
import {externalDefinition} from '../src/platform/services/performance.js';
const rows=HISTORY.records,period=periodRange(60),a=costAnalysis(rows,period);
const near=(x,y)=>assert.ok(Math.abs(x-y)<1e-7,`${x} ≠ ${y}`);
test('C5 soma válida e média conciliam fonte e população completa',()=>{
 assert.equal(a.count,736);assert.equal(a.cost.count,736);near(a.cost.value,696734.6);near(a.mean.value,696734.6/736);assert.equal(a.mean.count,736);
});
test('C5 nulos negativos strings e não finitos não viram custos zero',()=>{
 const r=[{[COST_FIELD]:null},{[COST_FIELD]:0},{[COST_FIELD]:10},{[COST_FIELD]:-1},{[COST_FIELD]:NaN},{[COST_FIELD]:'5'},{[COST_FIELD]:Infinity}];
 const d=costMetrics(r);assert.equal(d.cost.value,10);assert.equal(d.cost.count,2);assert.equal(d.mean.value,5);assert.equal(d.mean.count,2);assert.equal(d.mean.excluded,5);
});
test('C5 custos associados aos técnicos excluem nome ausente no card e conservam grupo desconhecido',()=>{
 assert.equal(a.technicianCount,16);near(a.technicianCost.value,a.cost.value);
 const r=[{...rows[0],'Técnico':null,[COST_FIELD]:10},{...rows[1],'Técnico':'Pessoa',[COST_FIELD]:20}];const d=costAnalysis(r,period);assert.equal(d.technicianCost.value,20);assert.equal(d.technicianCost.total,1);assert.equal(d.technicianCount,1);
 const groups=costGroups(r,'Técnico');assert.equal(groups.find(g=>g.label==='Não informado').cost.value,10);near(groups.reduce((s,g)=>s+g.cost.value,0),30);
});
for(const field of ['Contrato','Área','Técnico','Unidade','Categoria do Chamado','Componente Principal'])test('C5 agrupamento por '+field+' reconcilia custo e chamados',()=>{
 const groups=costGroups(rows,field);assert.equal(groups.reduce((s,g)=>s+g.count,0),736);near(groups.reduce((s,g)=>s+(g.cost.value??0),0),a.cost.value);
 for(const g of groups)near(g.cost.value,rows.filter(r=>r[field]===g.label).reduce((s,r)=>s+r[COST_FIELD],0));
 assert.ok(groups.every((g,i)=>!i||groups[i-1].cost.value>=g.cost.value));
});
test('C5 custo de recorrência usa chamados positivos sem multiplicar eventos',()=>{
 assert.equal(a.recurrence.count,412);near(a.recurrentCost.value,401718);assert.equal(a.recurrentCost.count,412);near(a.recurrentShare,401718/696734.6);
 const r=[{...rows[0],Recorrencia_30d:7,[COST_FIELD]:10},{...rows[1],Recorrencia_30d:0,[COST_FIELD]:20}];assert.equal(costAnalysis(r,period).recurrentCost.value,10);
});
test('C5 recorrentes zeros e desconhecidos formam partição disjunta',()=>{
 const r=[0,2,null,-1,'4',Infinity].map((v,i)=>({...rows[0],ID_Chamado:String(i),Recorrencia_30d:v,[COST_FIELD]:10}));const d=costAnalysis(r,period);
 assert.deepEqual(d.recurrenceBuckets.map(g=>g.count),[1,1,4]);assert.equal(d.recurrenceBuckets.reduce((s,g)=>s+g.cost.value,0),60);assert.equal(new Set(d.recurrenceBuckets.flatMap(g=>g.rows)).size,6);
});
test('C5 custo e tempo pareados exigem ambos os valores válidos',()=>{
 const d=costAnalysis([{...rows[0],[COST_FIELD]:10,TA:null,TB:5},{...rows[1],[COST_FIELD]:null,TA:30,TB:10},{...rows[2],[COST_FIELD]:20,TA:0,TB:null}],period);
 assert.equal(d.pairs[0].rows.length,1);assert.equal(d.pairs[0].meanCost.value,20);assert.equal(d.pairs[0].meanTime.value,0);assert.equal(d.pairs[1].rows.length,1);assert.equal(d.pairs[1].meanCost.value,10);assert.equal(d.pairs[1].meanTime.value,5);
 assert.deepEqual(a.pairs.map(p=>p.rows.length),[728,724]);
});
test('C5 grupos SLA reaproveitam elegibilidade e cobrem todos sem sobreposição',()=>{
 assert.deepEqual(a.performance.map(g=>g.count),[665,59,12]);assert.equal(a.performance.reduce((s,g)=>s+g.count,0),736);near(a.performance.reduce((s,g)=>s+g.cost.value,0),a.cost.value);assert.ok(a.performance[1].rows.every(r=>r.Status==='Concluído'&&r.Percentual_SLA>1));
});
test('C5 filtros cumulativos alimentam cards gráficos e carteira',()=>{
 const v=selectView({...DEFAULT_STATE,days:7,filters:{Área:['SP-Sul'],Criticidade_ORQUESTRA:['Laranja','Vermelho']},search:'SP-SUL'}),d=costAnalysis(v.records,v.period);assert.ok(d.count>0);assert.equal(d.count,v.summary.total);near(d.groups.reduce((s,g)=>s+g.cost.value,0),d.cost.value);assert.equal(d.days.reduce((s,g)=>s+g.total,0),d.count);
});
test('C5 série diária respeita dias civis lacunas e limite disponível',()=>{
 assert.equal(a.days.length,60);assert.equal(a.days[0].date,'2026-08-08');assert.equal(a.days.at(-1).date,'2026-10-06');near(a.days.reduce((s,d)=>s+(d.cost.value??0),0),a.cost.value);
 const d=costAnalysis([{...rows[0],'Criado em':'2026-10-06T00:00:00-03:00',[COST_FIELD]:null}],periodRange(7));assert.equal(d.days.at(-1).total,1);assert.equal(d.days.at(-1).cost.value,null);assert.equal(d.days[0].total,0);
});
test('C5 carteira e chamados ordenam por custo e média antes da página',()=>{
 const calls=costCalls(rows),sorted=costTablePage(calls,{sort:'cost',direction:'desc',page:1,size:10});assert.equal(sorted.total,736);assert.equal(sorted.pages,74);assert.equal(sorted.rows[0].label,'CH-20261001-0661');
 assert.deepEqual(costTablePage(calls,{sort:'cost',direction:'desc',page:2,size:10}).rows,sorted.ordered.slice(10,20));
 const contracts=costTablePage(a.groups,{sort:'mean',direction:'asc',size:25});assert.equal(contracts.rows.length,12);assert.ok(contracts.ordered.every((g,i)=>!i||contracts.ordered[i-1].mean.value<=g.mean.value));
});
test('C5 desempate determinístico nulos por último e busca preservada',()=>{
 const calls=costCalls([{...rows[0],ID_Chamado:'B',[COST_FIELD]:10},{...rows[0],ID_Chamado:'A',[COST_FIELD]:10},{...rows[0],ID_Chamado:'C',[COST_FIELD]:null}]);
 for(const direction of ['asc','desc'])assert.deepEqual(costTablePage(calls,{sort:'cost',direction}).ordered.map(g=>g.label),['A','B','C']);assert.equal(costTablePage(a.groups,{search:'hospital life'}).total,1);
});
test('C5 vazio todos ausentes e custo zero não fabricam médias ou participação',()=>{
 const d=costAnalysis([],period);assert.equal(d.cost.value,null);assert.equal(d.mean.value,null);assert.equal(d.recurrentShare,null);assert.equal(d.groups.length,0);
 const z=costAnalysis([{...rows[0],[COST_FIELD]:0,Recorrencia_30d:1}],period);assert.equal(z.cost.value,0);assert.equal(z.mean.value,0);assert.equal(z.recurrentShare,null);
 assert.equal(costMetrics([{[COST_FIELD]:null}]).mean.value,null);
});
test('C5 explicabilidade mantém cobertura fontes EXT e limites financeiros',()=>{
 const v=selectView(DEFAULT_STATE),d=costDefinition({title:'Custo',fields:[COST_FIELD],definition:'Estimativa',calculation:'Soma',unit:'R$'},DEFAULT_STATE,v);assert.equal(d.classification,'CALC');assert.equal(d.source,'HIST_60_DIAS');assert.match(d.calculation,/736\/736/);assert.match(d.missing,/grupo separado/);
 assert.equal(COST_EXTERNAL.length,2);for(const metric of COST_EXTERNAL){const ext=externalDefinition(metric,DEFAULT_STATE,v);assert.equal(ext.classification,'EXT');assert.match(ext.calculation,/Indisponível/);assert.match(ext.source,/pendente/);}
});
test('C5 dados materializados intactos sem novas regras de SLA ou pressão',()=>{
 const before=JSON.stringify(HISTORY);costAnalysis(rows,period);for(const field of COST_DIMENSIONS)costGroups(rows,field);assert.equal(JSON.stringify(HISTORY),before);assert.equal(a.risk.contracts,12);assert.equal(a.adherence.value,665/724);assert.throws(()=>costGroups(rows,'financeiro'),RangeError);
});
