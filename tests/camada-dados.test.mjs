import test from 'node:test';
import assert from 'node:assert/strict';
import {getDataset,getById,query,countBy,describeField,FIELDS,SOURCES,boundary,instant,formatLocal,distribution} from '../src/data/orquestra/index.js';

test('736 registros, 46 campos, IDs únicos e metadados offline',()=>{
 const d=getDataset();
 assert.equal(d.records.length,736);assert.equal(FIELDS.length,46);
 assert.equal(new Set(d.records.map(r=>r.ID_Chamado)).size,736);
 for(const r of d.records)assert.deepEqual(Object.keys(r),FIELDS);
 assert.equal(d.metadata.reference,'2026-10-06T22:00:00-03:00');
 assert.equal(d.metadata.synthetic,true);
 assert.equal(d.metadata.sourceSha256,'1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe');
 assert.ok(Object.isFrozen(d.records[0]));
});
test('reconciliação independente de status e criticidade históricos',()=>{
 assert.deepEqual(countBy(query(),'Status'),{'Concluído':724,'Em atendimento':4,'Técnico a caminho':4,'Contactado':2,'Aberto':2});
 assert.deepEqual(countBy(query(),'Criticidade_ORQUESTRA'),{Amarelo:345,Verde:253,Laranja:72,Vermelho:66});
});
test('snapshots separados com relógios e contagens próprios',()=>{
 assert.deepEqual(SOURCES,['HIST_60_DIAS','T0_Abertura','T1_Acompanhamento','T2_Desfecho']);
 for(const [s,n,time] of [['T0_Abertura',10,'08:00:00'],['T1_Acompanhamento',16,'08:30:00'],['T2_Desfecho',24,'09:30:00']]){
  const d=getDataset(s);assert.equal(d.records.length,n);
  assert.equal(d.metadata.reference,'2026-09-08T'+time+'-03:00');
  assert.ok(d.records.every(r=>r.Momento_Dataset===d.metadata.reference));
  assert.equal(query({source:s}).length,n);
 }
 assert.throws(()=>getDataset('TODOS'),/desconhecida/);
});
test('nulos preservados, TA/TB/percentual não recalculados',()=>{
 const rows=query();
 assert.equal(rows.filter(r=>r.TA===null).length,8);
 assert.equal(rows.filter(r=>r.TB===null).length,12);
 assert.equal(rows[0].TA,40);assert.equal(rows[0].TB,81);
 assert.equal(rows[0].Percentual_SLA,0.6722);
 assert.equal(rows[0].Custo_Estimado_R$,1403.2);
});
test('consultas básicas cumulativas, busca por ID e proveniência BASE',()=>{
 const rows=query({filters:{Criticidade_ORQUESTRA:['Laranja','Vermelho'],Área:['SP-Sul']}});
 assert.ok(rows.length>0);
 assert.ok(rows.every(r=>['Laranja','Vermelho'].includes(r.Criticidade_ORQUESTRA)&&r.Área==='SP-Sul'));
 assert.equal(getById('HIST_60_DIAS',rows[0].ID_Chamado),rows[0]);
 assert.equal(getById('HIST_60_DIAS','inexistente'),null);
 assert.equal(describeField('TA').classification,'BASE');
 assert.throws(()=>query({filters:{inexistente:[]}}),/desconhecido/);
 assert.throws(()=>query({filters:{Status:'Aberto'}}),/lista/);
});
test('60 dias civis inclusivos, Criado em e limites do dia local',()=>{
 assert.equal(query({from:'2026-08-08',to:'2026-10-06'}).length,736);
 assert.equal(boundary('2026-08-08'),Date.parse('2026-08-08T03:00:00Z'));
 assert.equal(boundary('2026-10-06',true),Date.parse('2026-10-07T02:59:59.999Z'));
 const first=query()[0];assert.equal(formatLocal(first['Criado em']),'2026-08-08 08:49:00');
 const a=query({from:'2026-08-08',to:'2026-08-08'});
 assert.ok(a.length>0 && a.every(r=>r['Criado em'].startsWith('2026-08-08')));
 assert.equal(query({from:'2026-10-07',to:'2026-10-07'}).length,0);
 assert.ok(instant('2026-10-06T23:59:59-03:00')<boundary('2026-10-06',true));
 assert.ok(instant('2026-10-07T00:00:00-03:00')>boundary('2026-10-06',true));
});
test('datas ambíguas, inválidas e intervalo invertido falham explicitamente',()=>{
 for(const bad of ['2026-02-30','2026-13-01','06/10/2026','2026-10-06T22:00:00Z'])assert.throws(()=>boundary(bad));
 assert.throws(()=>instant('2026-10-06T25:00:00-03:00'));
 assert.throws(()=>instant('2026-10-06T22:00:00'));
 assert.throws(()=>query({from:'2026-10-06',to:'2026-08-08'}),/invertido/);
});
test('mesmo resultado independentemente do timezone do processo',()=>{
 assert.equal(formatLocal(getDataset().metadata.reference),'2026-10-06 22:00:00');
 assert.equal(boundary('2026-10-06'),1791255600000);
});

test('distribuição CALC explica fonte, população e filtros sem mutá-los',()=>{
 const filters={Área:['SP-Sul']}; const d=distribution({field:'Status',filters});
 assert.equal(d.metadata.classification,'CALC');assert.equal(d.metadata.sheet,'HIST_60_DIAS');
 assert.equal(d.metadata.population,281);assert.equal(Object.values(d.values).reduce((a,b)=>a+b,0),281);
 assert.equal(Object.isFrozen(filters),false);assert.equal(Object.isFrozen(filters.Área),false);
 assert.deepEqual(d.metadata.filters,filters);assert.equal(d.metadata.dateField,'Criado em');
});
