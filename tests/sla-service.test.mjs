import test from 'node:test';
import assert from 'node:assert/strict';
import {HISTORY,DEFAULT_STATE,selectView} from '../src/platform/services/chamados.js';
import {adherence,average,consumptionBand,slaAnalysis,timeGroups,slaDefinition} from '../src/platform/services/sla.js';
const records=HISTORY.records,a=slaAnalysis(records);
test('aderência aprovada reconcilia 665 dentro e 59 acima entre 724 concluídos',()=>{
 assert.equal(a.adherence.count,724);assert.equal(a.adherence.within.length,665);assert.equal(a.adherence.over.length,59);
 assert.equal(a.adherence.value,665/724);assert.ok(a.adherence.rows.every(r=>r.Status==='Concluído'));
});
test('elegibilidade de aderência exclui abertos, nulos, inválidos e SLA zero; 100% cumpre',()=>{
 const base={Status:'Concluído',SLA_min:60,Percentual_SLA:1};
 const input=[base,{...base,Percentual_SLA:1.0001},{...base,Percentual_SLA:0},{...base,Status:'Aberto'},
  {...base,SLA_min:null},{...base,SLA_min:0},{...base,Percentual_SLA:null},{...base,Percentual_SLA:NaN},{...base,Percentual_SLA:-1}];
 const data=adherence(input);assert.equal(data.count,3);assert.equal(data.within.length,2);assert.equal(data.over.length,1);
 assert.equal(adherence([]).value,null);
});
test('médias usam N por campo e preservam materializados',()=>{
 assert.equal(a.ta.count,728);assert.equal(a.tb.count,724);assert.equal(a.ta.excluded,8);assert.equal(a.tb.excluded,12);
 assert.equal(a.ta.value,records.filter(r=>r.TA!==null).reduce((s,r)=>s+r.TA,0)/728);
 assert.equal(a.tb.value,records.filter(r=>r.TB!==null).reduce((s,r)=>s+r.TB,0)/724);
});
test('média exclui ausentes sem trocar por zero; zero informado participa',()=>{
 assert.deepEqual(average([{TA:null},{TA:0},{TA:10},{TA:undefined},{TA:NaN},{TA:-1}],'TA').count,2);
 assert.equal(average([{TA:null},{TA:0},{TA:10}],'TA').value,5);assert.equal(average([{TA:null}],'TA').value,null);
});
test('faixas contínuas não têm lacunas nem sobreposição nos limites',()=>{
 for(const [value,band] of [[0,'low'],[.5,'low'],[.50001,'medium'],[.8,'medium'],[.80001,'high'],[1,'high'],[1.00001,'over']])assert.equal(consumptionBand(value),band);
 for(const value of [null,undefined,NaN,Infinity,-1,'0.5'])assert.equal(consumptionBand(value),null);
});
test('distribuições reconciliam o total sem recodificar criticidade pelo consumo',()=>{
 assert.deepEqual(a.bands.map(x=>x.rows.length),[257,325,95,59]);
 assert.deepEqual(a.criticalities.map(x=>x.rows.length),[253,345,72,66]);
 assert.equal(a.bands.reduce((s,x)=>s+x.rows.length,0),736);
 const sample={...records[0],Criticidade_ORQUESTRA:'Vermelho',Percentual_SLA:0};
 assert.equal(slaAnalysis([sample]).criticalities.find(x=>x.label==='Vermelho').rows.length,1);
 assert.equal(slaAnalysis([sample]).bands[0].rows.length,1);
});
test('passageiro preso conta ocorrências, atenção exclui concluídos',()=>{
 assert.equal(a.passengers.length,74);assert.equal(a.priority.length,1);assert.equal(a.active,12);
 assert.ok(a.priority.every(r=>r.Status!=='Concluído'&&['Laranja','Vermelho'].includes(r.Criticidade_ORQUESTRA)));
});
test('motivos completos são grupos exclusivos e preservam textos compostos',()=>{
 assert.equal(a.reasons.reduce((sum,g)=>sum+g.count,0),736);
 assert.ok(a.reasons.some(g=>g.label.includes(';')));
 assert.ok(a.reasons.every(g=>g.rows.every(r=>r.Motivo_Criticidade===g.label)));
});
test('agrupamentos por área/categoria/cliente/equipamento preservam N independente',()=>{
 for(const field of ['Área','Categoria do Chamado','Cliente','Tipo de Unidade']){
  const groups=timeGroups(records,field);assert.equal(groups.reduce((s,g)=>s+g.count,0),736);
  assert.equal(groups.reduce((s,g)=>s+g.ta.count,0),728);assert.equal(groups.reduce((s,g)=>s+g.tb.count,0),724);
 }
});
test('análise consome somente recorte compartilhado, inclusive vazio',()=>{
 const view=selectView({...DEFAULT_STATE,days:7,filters:{Área:['SP-Sul'],Criticidade_ORQUESTRA:['Laranja','Vermelho']}});
 const result=slaAnalysis(view.records);assert.equal(result.total,view.summary.total);
 assert.deepEqual(result.priority,view.summary.attention);
 const empty=slaAnalysis([]);assert.equal(empty.ta.value,null);assert.equal(empty.adherence.value,null);assert.equal(empty.priority.length,0);
});
test('explicação mantém origem, filtros, elegíveis e regra específica',()=>{
 const state={...DEFAULT_STATE,filters:{Cliente:['Hospital Life']}},view=selectView(state);
 const definition=slaDefinition({title:'Teste',fields:['TA'],definition:'Média informada',calculation:'Soma / N.',eligible:4},state,view);
 assert.equal(definition.source,'HIST_60_DIAS');assert.equal(definition.classification,'CALC');
 assert.match(definition.calculation,/Elegíveis: 4/);assert.ok(definition.fields.includes('TA'));
 assert.deepEqual(definition.filters,state.filters);assert.equal(definition.population,view.summary.total);
});
