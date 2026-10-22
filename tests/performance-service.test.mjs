import test from 'node:test';
import assert from 'node:assert/strict';
import {HISTORY,DEFAULT_STATE,selectView,periodRange} from '../src/platform/services/chamados.js';
import {executiveAnalysis,estimatedCost,currencyLabel,performanceDefinition,externalDefinition,FINANCIAL_EXTERNAL} from '../src/platform/services/performance.js';
import {adherence} from '../src/platform/services/sla.js';
const rows=HISTORY.records,a=executiveAnalysis(rows,periodRange(60));
test('síntese executiva reconcilia custo, SLA, contratos, histórico e ativos',()=>{
 assert.equal(a.total,736);assert.equal(a.contractCount,12);assert.equal(a.cost.count,736);assert.ok(Math.abs(a.cost.value-696734.6)<1e-6);
 assert.equal(currencyLabel(a.cost.value),'R$ 696.734,60');assert.equal(a.adherence.value,665/724);assert.equal(a.risk.contracts,12);
 assert.equal(a.risk.red.length,66);assert.equal(a.risk.active.length,1);
});
test('custos excluem ausentes e inválidos, sem transformar nulo em zero',()=>{
 const c=estimatedCost([{ 'Custo_Estimado_R$':null},{'Custo_Estimado_R$':0},{'Custo_Estimado_R$':12.34},{'Custo_Estimado_R$':NaN},{'Custo_Estimado_R$':-1}]);
 assert.equal(c.value,12.34);assert.equal(c.count,2);assert.equal(c.excluded,3);assert.equal(c.total,5);
 assert.equal(estimatedCost([]).value,null);assert.equal(estimatedCost([{'Custo_Estimado_R$':0}]).value,0);assert.equal(currencyLabel(null),'—');
});
test('cinco primeiros contratos são ordenados por N Alto, com desempate por ID',()=>{
 assert.deepEqual(a.contracts.slice(0,5).map(g=>g.label),['CT-2026-007','CT-2026-011','CT-2026-001','CT-2026-005','CT-2026-008']);
 assert.deepEqual(a.contracts.map(g=>g.high.length),[61,52,44,30,28,26,25,20,20,18,15,12]);
 assert.ok(a.contracts.findIndex(g=>g.label==='CT-2026-004')<a.contracts.findIndex(g=>g.label==='CT-2026-009'));
});
test('lista completa tem doze contratos; não confundir eventos Alto e todos os chamados',()=>{
 assert.equal(a.contracts.length,12);const c=a.contracts[0];assert.equal(c.high.length,61);assert.equal(c.count,90);
 assert.equal(c.cost.count,90);assert.equal(c.adherence.count,88);
 assert.equal(a.contracts.reduce((s,g)=>s+g.count,0),736);
 assert.ok(Math.abs(a.contracts.reduce((s,g)=>s+g.cost.value,0)-a.cost.value)<1e-6);
});
test('indicadores do contrato usam todos os seus registros filtrados',()=>{
 for(const c of a.contracts){assert.equal(c.adherence.value,adherence(c.rows).value);assert.equal(c.cost.value,estimatedCost(c.rows).value);assert.ok(c.high.every(r=>r.Impacto_Contrato==='Alto'));assert.equal(c.reasons.reduce((s,g)=>s+g.count,0),c.high.length);}
});
test('contrato sem Alto não entra na tabela, mas participa da síntese geral',()=>{
 const base=rows[0],records=[{...base,ID_Chamado:'A',Contrato:'C-A',Impacto_Contrato:'Baixo'},{...base,ID_Chamado:'B',Contrato:'C-B',Impacto_Contrato:'Alto'}];
 const data=executiveAnalysis(records,periodRange(60));assert.equal(data.contractCount,2);assert.equal(data.contracts.length,1);assert.equal(data.contracts[0].label,'C-B');assert.equal(data.cost.count,2);
});
test('série de custos reconcilia o total e respeita os 60 dias',()=>{
 assert.equal(a.days.length,60);assert.equal(a.days[0].date,'2026-08-08');assert.equal(a.days.at(-1).date,'2026-10-06');
 assert.ok(Math.abs(a.days.reduce((s,d)=>s+(d.cost.value??0),0)-a.cost.value)<1e-6);
 assert.equal(a.days.reduce((s,d)=>s+d.cost.count,0),736);
});
test('SLA por dia reutiliza elegibilidade, não média de percentuais diários',()=>{
 for(const d of a.days)assert.equal(d.adherence.value,adherence(d.rows).value);
 assert.equal(a.days.reduce((s,d)=>s+d.adherence.count,0),724);
 assert.equal(a.days.reduce((s,d)=>s+d.adherence.within.length,0),665);
});
test('dia sem elegíveis ou custo tem lacuna e não percentual zero fabricado',()=>{
 const data=executiveAnalysis([{...rows[0],Status:'Aberto','Criado em':'2026-10-06T00:00:00-03:00','Custo_Estimado_R$':null}],periodRange(7));
 assert.equal(data.days.at(-1).total,1);assert.equal(data.days.at(-1).adherence.value,null);assert.equal(data.days.at(-1).cost.value,null);
 assert.equal(data.days[0].total,0);assert.equal(data.days[0].cost.value,null);
});
test('limites temporais preservam a data civil de São Paulo',()=>{
 const data=executiveAnalysis([{...rows[0],'Criado em':'2026-10-05T23:59:59-03:00'},{...rows[1],'Criado em':'2026-10-06T00:00:00-03:00'}],periodRange(7));
 assert.equal(data.days.at(-2).total,1);assert.equal(data.days.at(-1).total,1);
});
test('filtros compartilhados limitam todos os indicadores e listas de suporte',()=>{
 const view=selectView({...DEFAULT_STATE,filters:{Área:['SP-Sul'],Criticidade_ORQUESTRA:['Laranja','Vermelho']},days:7}),data=executiveAnalysis(view.records,view.period);
 assert.equal(data.total,view.summary.total);assert.equal(data.risk.red.length+data.risk.orange.length,data.total);
 assert.equal(data.days.reduce((s,d)=>s+d.total,0),data.total);assert.ok(data.contracts.every(g=>g.rows.every(r=>r['Área']==='SP-Sul')));
});
test('vazio e contrato ausente não inventam entidade ou custo',()=>{
 const data=executiveAnalysis([],periodRange(1));assert.equal(data.contractCount,0);assert.equal(data.cost.value,null);assert.equal(data.adherence.value,null);assert.equal(data.contracts.length,0);
 const missing=executiveAnalysis([{...rows[0],Contrato:null}],periodRange(60));assert.equal(missing.contractCount,0);assert.equal(missing.contracts.length,0);
});
test('explicabilidade CALC e EXT mantém origem, cobertura e indisponibilidade',()=>{
 const view=selectView(DEFAULT_STATE),d=performanceDefinition({title:'Custo',fields:['Custo_Estimado_R$'],definition:'Estimativa',calculation:'Soma',unit:'R$'},DEFAULT_STATE,view);
 assert.equal(d.source,'HIST_60_DIAS');assert.equal(d.classification,'CALC');assert.equal(d.population,736);
 for(const metric of FINANCIAL_EXTERNAL){const ext=externalDefinition(metric,DEFAULT_STATE,view);assert.equal(ext.classification,'EXT');assert.match(ext.calculation,/Indisponível/);assert.match(ext.source,/pendente/);assert.equal(ext.sourceHash,'Não disponível');}
});
test('agregações não modificam TA, TB, SLA, criticidade ou dados originais',()=>{
 const before=JSON.stringify(HISTORY);executiveAnalysis(rows,periodRange(60));assert.equal(JSON.stringify(HISTORY),before);
});
