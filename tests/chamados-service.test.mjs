import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_STATE,HISTORY,periodRange,selectHistorical,selectView,sortRecords,consultationReducer,recurrenceMatches,metricDefinition,etaLabel,slaRemainingLabel,dateLabel} from '../src/platform/services/chamados.js';
const base=()=>({...DEFAULT_STATE,filters:{},recurrence:[]});
const sum=o=>Object.values(o).reduce((a,b)=>a+b,0);
test('períodos inclusivos usam data civil da demonstração, não hoje real',()=>{
 const ranges=[[1,'2026-10-06',14],[7,'2026-09-30',93],[15,'2026-09-22',202],[30,'2026-09-07',395],[60,'2026-08-08',736]];
 for(const [days,from,count] of ranges){
  assert.equal(periodRange(days).from,from);assert.equal(periodRange(days).to,'2026-10-06');
  const v=selectView({...base(),days});assert.equal(v.summary.total,count);
  assert.ok(v.records.every(r=>r['Criado em'].slice(0,10)>=from&&r['Criado em'].slice(0,10)<='2026-10-06'));
 }
 assert.throws(()=>periodRange(8));
});
test('criticidade OR Laranja/Vermelho mantém histórico concluído separado',()=>{
 const rows=selectHistorical({...base(),filters:{Criticidade_ORQUESTRA:['Laranja','Vermelho']}});
 assert.equal(rows.length,138);assert.ok(rows.every(r=>['Laranja','Vermelho'].includes(r.Criticidade_ORQUESTRA)));
});
test('status selecionado usa valor fonte exato',()=>{
 const rows=selectHistorical({...base(),filters:{Status:['Em atendimento']}});
 assert.equal(rows.length,4);assert.ok(rows.every(r=>r.Status==='Em atendimento'));
});
test('campos diferentes usam AND e valores do mesmo campo usam OR',()=>{
 const filters={Criticidade_ORQUESTRA:['Laranja','Vermelho'],Área:['SP-Sul']};
 const rows=selectHistorical({...base(),filters});
 const expected=HISTORY.records.filter(r=>filters.Criticidade_ORQUESTRA.includes(r.Criticidade_ORQUESTRA)&&r.Área==='SP-Sul');
 assert.ok(rows.length>0);assert.deepEqual(rows,expected);
});
test('cliente, tipo e categoria podem restringir cumulativamente',()=>{
 const row=HISTORY.records[0],filters={Cliente:[row.Cliente],'Tipo de Unidade':[row['Tipo de Unidade']],'Categoria do Chamado':[row['Categoria do Chamado']]};
 const rows=selectHistorical({...base(),filters});
 assert.ok(rows.length>0);assert.ok(rows.every(r=>r.Cliente===row.Cliente&&r['Tipo de Unidade']===row['Tipo de Unidade']&&r['Categoria do Chamado']===row['Categoria do Chamado']));
});
test('busca tolera acentos, caixa, espaços e combina com filtros',()=>{
 const a=selectHistorical({...base(),search:' HOSPITAL   SAO PAULO '});
 const b=selectHistorical({...base(),search:'hospital são paulo'});
 assert.ok(a.length>0);assert.deepEqual(a,b);
 const c=selectHistorical({...base(),search:'hospital sao paulo',filters:{Status:['Concluído']}});
 assert.ok(c.every(r=>r.Status==='Concluído'));assert.ok(c.length<=a.length);
});
test('remoção de chip preserva outros filtros e volta à página 1',()=>{
 const s={...base(),page:3,filters:{Área:['SP-Sul'],Criticidade_ORQUESTRA:['Laranja','Vermelho']}};
 const next=consultationReducer(s,{type:'remove',field:'Criticidade_ORQUESTRA',value:'Laranja'});
 assert.deepEqual(next.filters,{Área:['SP-Sul'],Criticidade_ORQUESTRA:['Vermelho']});assert.equal(next.page,1);
 assert.deepEqual(s.filters.Criticidade_ORQUESTRA,['Laranja','Vermelho']);
});
test('limpar restaura 60 dias, busca, ordenação e paginação padrão',()=>{
 const next=consultationReducer({...base(),days:1,search:'abc',filters:{Status:['Aberto']},recurrence:['zero'],page:2},{type:'reset'});
 assert.deepEqual(next,base());assert.equal(selectHistorical(next).length,736);
});
test('total, distribuições e paginação conciliam para qualquer recorte',()=>{
 for(const state of [base(),{...base(),days:1},{...base(),filters:{Área:['SP-Sul']}},{...base(),filters:{Criticidade_ORQUESTRA:['Laranja','Vermelho']}},{...base(),search:'zzzznenhum'}]){
  const v=selectView(state);assert.equal(sum(v.summary.statuses),v.summary.total);assert.equal(sum(v.summary.criticalities),v.summary.total);
  assert.equal(v.ordered.length,v.records.length);assert.ok(v.rows.length<=10);
 }
});
test('ordenação antecede paginação e não modifica fonte',()=>{
 const firstId=HISTORY.records[0].ID_Chamado;
 const state={...base(),sortField:'ID_Chamado',sortDirection:'asc',page:2};
 const v=selectView(state);
 const expected=[...HISTORY.records].sort((a,b)=>a.ID_Chamado.localeCompare(b.ID_Chamado,'pt-BR',{numeric:true}));
 assert.deepEqual(v.rows,expected.slice(10,20));assert.equal(v.summary.total,736);
 assert.equal(HISTORY.records[0].ID_Chamado,firstId);
 assert.equal(selectView({...state,page:999}).page,74);
});
test('estado vazio não inventa porcentagem nem página negativa',()=>{
 const v=selectView({...base(),search:'zzzznenhum',page:50});
 assert.equal(v.summary.total,0);assert.deepEqual(v.rows,[]);assert.equal(v.page,1);assert.equal(v.pages,1);assert.equal(v.summary.attention.length,0);
});
test('TA/TB nulos preservados; ETA e SLA não inferem regras desconhecidas',()=>{
 const row=HISTORY.records.find(r=>r.TA===null&&r.TB===null);
 const selected=selectHistorical({...base(),search:row.ID_Chamado})[0];
 assert.equal(selected.TA,null);assert.equal(selected.TB,null);
 assert.equal(slaRemainingLabel(selected),'Regra em validação');
 assert.equal(etaLabel({...row,ETA_min:null}),'Não informado');
 assert.equal(etaLabel({...row,ETA_min:0}),'0 min (base)');
});
test('atenção exclui concluídos mesmo que historicamente Vermelhos',()=>{
 const s=selectView(base()).summary;
 assert.equal(s.criticalities.Vermelho,66);assert.equal(s.active,12);assert.equal(s.attention.length,1);
 assert.ok(s.attention.every(r=>r.Status!=='Concluído'&&['Laranja','Vermelho'].includes(r.Criticidade_ORQUESTRA)));
 assert.equal(selectView({...base(),filters:{Status:['Concluído']}}).summary.attention.length,0);
});
test('recorrência usa faixas fornecidas, OR e nulos preservados',()=>{
 assert.equal(recurrenceMatches(null,['zero']),false);
 assert.equal(recurrenceMatches(null,[]),true);
 const v=selectHistorical({...base(),recurrence:['zero','three-plus']});
 assert.ok(v.every(r=>r.Recorrencia_30d===0||r.Recorrencia_30d>=3));
 assert.equal(v.length,HISTORY.records.filter(r=>r.Recorrencia_30d===0||r.Recorrencia_30d>=3).length);
});
test('explicação CALC rastreia população, período, filtros e campos',()=>{
 const state={...base(),days:7,filters:{Área:['SP-Sul']},recurrence:['three-plus'],search:'hospital'};
 const view=selectView(state),d=metricDefinition({title:'Atenção',attention:true},state,view);
 assert.equal(d.classification,'CALC');assert.equal(d.source,'HIST_60_DIAS');assert.equal(d.population,view.summary.total);
 assert.match(d.period,/30\/09\/2026/);assert.ok(d.fields.includes('Recorrencia_30d'));assert.ok(d.fields.includes('Status'));
 assert.equal(d.sourceHash,HISTORY.metadata.sourceSha256);assert.equal(d.timezone,'America/Sao_Paulo');
});
test('filtros futuros usam mesmo serviço sem uma segunda importação',()=>{
 const row=HISTORY.records[0];
 const v=selectHistorical({...base(),filters:{Contrato:[row.Contrato],Unidade:[row.Unidade]}});
 assert.ok(v.length>0);assert.ok(v.every(r=>r.Contrato===row.Contrato&&r.Unidade===row.Unidade));
 assert.equal(dateLabel('2026-10-06T22:00:00-03:00'),'06/10/2026 22:00');
});
test('ordenação mantém ausentes no fim nos dois sentidos',()=>{
 const rows=[{ID_Chamado:'a',Técnico:null},{ID_Chamado:'b',Técnico:'Ana'}];
 for(const direction of ['asc','desc'])assert.equal(sortRecords(rows,'Técnico',direction).at(-1).Técnico,null);
});
