import test from 'node:test';
import assert from 'node:assert/strict';
import {getDataset,instant} from '../src/data/orquestra/index.js';
import {eventAt,projectSnapshot,EVENT_FIELDS} from '../src/platform/services/temporal.js';
import {TEMPORAL_DEFINITIONS} from '../src/platform/services/temporalDefinitions.js';
import {slaAnalysis} from '../src/platform/services/sla.js';
const sources=['HIST_60_DIAS','T0_Abertura','T1_Acompanhamento','T2_Desfecho'];
test('TA é criação até chegada em minutos, por fonte, sem misturar estados',()=>{
 for(const [i,source] of sources.entries()){
  const rows=getDataset(source).records.filter(r=>r.TA!==null);
  assert.equal(rows.length,[728,2,9,20][i]);
  for(const r of rows)assert.equal(r.TA,(instant(r['Chegou ao Edifício'])-instant(r['Criado em']))/60000);
 }
});
test('permanência adicional corresponde ao contrato sintético confirmado',()=>{
 for(const source of sources){
  const rows=getDataset(source).records.filter(r=>r.TB!==null);
  for(const r of rows){const extra=(instant(r['Saída'])-instant(r['Chegou ao Edifício']))/60000-r.TB;
   assert.ok(source==='HIST_60_DIAS'?extra>=3&&extra<=10:extra===5);
  }
 }
});
test('marcos presentes respeitam a sequência e ausências TA/TB são preservadas',()=>{
 for(const source of sources)for(const row of getDataset(source).records){
  assert.equal(row.TA===null,row['Chegou ao Edifício']===null);
  assert.equal(row.TB===null,row['Saída']===null);
  const times=EVENT_FIELDS.map(f=>row[f]).filter(v=>v!==null).map(instant);
  assert.deepEqual(times,[...times].sort((a,b)=>a-b));
 }
});
test('nulos não viram zero, nem eventos realizados',()=>{
 const row=getDataset('HIST_60_DIAS').records.find(r=>r.TA===null);
 assert.deepEqual(eventAt(row,'Chegou ao Edifício',row.Momento_Dataset),{state:'absent',value:null});
 assert.equal(row.TA,null);
});
test('duas saídas posteriores à referência são identificadas sem corrigir snapshots',()=>{
 const found=[];
 for(const source of sources.slice(1)){const d=getDataset(source);for(const row of d.records)if(eventAt(row,'Saída',d.metadata.reference).state==='future')found.push([source,row.ID_Chamado]);}
 assert.deepEqual(found,[['T1_Acompanhamento','CH-20260908-006'],['T2_Desfecho','CH-20260908-017']]);
});
test('projeção oculta eventos futuros e não cria evento de encerramento técnico',()=>{
 for(const source of sources.slice(1)){
  const d=getDataset(source),before=JSON.stringify(d),projection=projectSnapshot(d,d.metadata.reference);
  assert.ok(projection.available);
  for(const {record,events} of projection.records){
   assert.deepEqual(Object.keys(record),Object.keys(d.records[0]));
   for(const f of EVENT_FIELDS)if(events[f].state==='future'){assert.equal(record[f],null);assert.equal(events[f].value,null);}
   assert.equal(record.TB,d.records.find(r=>r.ID_Chamado===record.ID_Chamado).TB);
  }assert.equal(JSON.stringify(d),before);
 }
});
test('snapshot não é liberado antes da referência; limite exato é inclusivo',()=>{
 const d=getDataset('T1_Acompanhamento');
 assert.equal(projectSnapshot(d,'2026-09-08T08:29:59-03:00').available,false);
 assert.deepEqual(projectSnapshot(d,'2026-09-08T08:29:59-03:00').records,[]);
 assert.equal(projectSnapshot(d,d.metadata.reference).records.length,16);
});
test('avanço do relógio sozinho não promove uma saída futura a evento confirmado',()=>{
 const d=getDataset('T1_Acompanhamento');
 const item=projectSnapshot(d,'2026-09-08T09:00:00-03:00').records.find(r=>r.record.ID_Chamado==='CH-20260908-006');
 assert.equal(item.events['Saída'].state,'future');assert.equal(item.record['Saída'],null);
 assert.throws(()=>projectSnapshot(getDataset('HIST_60_DIAS'),d.metadata.reference),/Snapshot/);
 assert.throws(()=>eventAt(item.record,'Encerramento técnico',d.metadata.reference),/Marco/);
});
test('TA/TB padronizados têm definição sintética em minutos',()=>{
 assert.equal(TEMPORAL_DEFINITIONS.TA.label,'TA — Tempo até a chegada (min)');
 assert.equal(TEMPORAL_DEFINITIONS.TB.label,'TB — Tempo de resolução simulado (min)');
 assert.match(TEMPORAL_DEFINITIONS.TB.definition,/não foi persistido/);
});
test('indicadores C1 permanecem reconciliados sem substituir materializados',()=>{
 const d=getDataset('HIST_60_DIAS'),before=JSON.stringify(d),a=slaAnalysis(d.records);
 assert.equal(a.ta.count,728);assert.equal(a.tb.count,724);
 assert.equal(a.adherence.within.length,665);assert.equal(a.adherence.over.length,59);
 assert.equal(a.adherence.value,665/724);
 assert.deepEqual(a.bands.map(b=>b.rows.length),[257,325,95,59]);
 assert.equal(a.priority.length,1);assert.equal(JSON.stringify(d),before);
});
