import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { scenesConfig } from '../src/scenes.config.js';
import * as b from '../src/views/backoffice-1-principal/data/chamadosData.js';
import * as s from '../src/views/supervisor/tutorial/dados.js';

test('dez posições ordenadas, únicas e com uma entrada principal cada', () => {
 const walk = d => readdirSync(d,{withFileTypes:true}).flatMap(e => e.isDirectory()?walk(join(d,e.name)):[join(d,e.name)]);
 const names=walk('src/views').filter(p=>p.endsWith('/index.jsx')).map(p=>basename(dirname(p)));
 assert.equal(scenesConfig.length,10);
 assert.deepEqual(scenesConfig.map(e=>e.position),[1,2,3,4,5,6,7,8,9,10]);
 assert.equal(new Set(scenesConfig.map(e=>e.scene)).size,10);
 for(const e of scenesConfig) assert.equal(names.filter(n=>n===e.scene).length,1,e.scene);
});
test('chegadas e contagens da página conciliam a linha de base',()=>{
 assert.deepEqual(b.PAGE_ARRIVALS.map(r=>r.id),[8170,8181,8182]);
 assert.deepEqual([0,1,2,3].map(n=>b.pageCounts(n).total),[1245,1246,1247,1248]);
 assert.deepEqual([0,1,2,3].map(n=>b.pageCounts(n).atendimento),[20,20,21,22]);
 for(const n of [0,1,2,3]){
  const c=b.pageCounts(n);
  assert.equal(c.total,c.abertas+c.atendimento+c.concluidos);
  assert.equal(c.concluidos,1168);
 }
});
test('Smart Fit mantém identidade/defeito e evolui Normal, Média, Alta',()=>{
 const stages=Object.values(s.ETAPAS_ALVO);
 assert.deepEqual(stages.map(c=>c.prioridade),['normal','media','alta']);
 assert.equal(new Set(stages.map(c=>c.id)).size,1);
 assert.equal(new Set(stages.map(c=>c.defeito)).size,1);
 assert.deepEqual(stages.map(c=>c.slaTempo),['06h40','03h10','00h50']);
 assert.equal(s.listaComAlvoEm('normal').at(-1).id,s.ID_ALVO);
 assert.equal(s.listaComAlvoNaPosicaoBase('media').at(-1).id,s.ID_ALVO);
 assert.equal(s.listaComAlvoEm('media')[0].id,s.ID_ALVO);
 assert.equal(s.listaComAlvoEm('alta')[0].id,s.ID_ALVO);
});
test('hospital prioritário por contexto, não por SLA; subida separada',()=>{
 assert.equal(s.DEMANDA_CRITICA_HOSPITAL.prioridade,'critica');
 assert.equal(s.DEMANDA_CRITICA_HOSPITAL.semSla,true);
 assert.equal(s.listaHospitalCriticoAntesDaSubida().at(-1).id,s.ID_CRITICO_HOSPITAL);
 assert.deepEqual(s.listaHospitalCriticoFinal().slice(0,2).map(c=>c.id),[s.ID_CRITICO_HOSPITAL,s.ID_ALVO]);
 assert.equal(s.listaHospitalCriticoFinal().length,6);
 assert.equal(new Set(s.listaHospitalCriticoFinal().map(c=>c.id)).size,6);
});
test('ordenação de SLA é numérica e não modifica entrada',()=>{
 const rows=[{slaTempo:'01h05'},{slaTempo:'00h12'},{slaTempo:'-00h05'}];
 const before=rows.map(r=>r.slaTempo);
 assert.deepEqual(s.ordenarPorSla(rows).map(r=>r.slaTempo),['-00h05','00h12','01h05']);
 assert.deepEqual(rows.map(r=>r.slaTempo),before);
});
