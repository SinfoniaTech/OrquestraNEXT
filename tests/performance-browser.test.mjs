import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {DEFAULT_STATE,selectView} from '../src/platform/services/chamados.js';
import {executiveAnalysis,currencyLabel} from '../src/platform/services/performance.js';
import {percentLabel} from '../src/platform/services/sla.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.ORQUESTRA_PLAYWRIGHT||'/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base='http://127.0.0.1:5197/OrquestraNEXT/',dist=process.env.ORQUESTRA_TEST_DIST||'/tmp/orquestra-c3/dist',evidence='/tmp/orquestra-c3/evidence';mkdirSync(evidence,{recursive:true});
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','5197','--strictPort','--outDir',dist],{stdio:'pipe'});
let log='',browser;server.stdout.on('data',d=>log+=d);server.stderr.on('data',d=>log+=d);
async function poll(fn){for(let i=0;i<200;i++){if(await fn())return;await new Promise(r=>setTimeout(r,40));}throw Error('Condição não atingida');}
try{
 await poll(async()=>{try{return(await fetch(base)).ok;}catch{return false;}});assert.equal(server.exitCode,null,log);
 browser=await chromium.launch({executablePath:process.env.ORQUESTRA_CHROME||'/usr/bin/google-chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1366,height:768},timezoneId:'Asia/Tokyo'});
 await context.addInitScript(()=>sessionStorage.setItem('orquestra.platform.demo','active'));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const nav=()=>page.getByRole('navigation',{name:'Menu principal'});
 const total=async()=>Number(await page.getByTestId('performance-total').innerText());
 const value=title=>page.getByTestId('kpi-'+title).locator('strong').innerText();
 const close=()=>page.getByRole('button',{name:'Fechar diálogo',exact:true}).last().click();
 const choose=async(label,values)=>{await page.getByRole('button',{name:new RegExp('^'+label+':')}).click();for(const name of values)await page.getByRole('group',{name:'Opções de '+label,exact:true}).getByRole('checkbox',{name,exact:true}).check();await page.getByRole('heading',{name:'Performance Operacional & Financeira',exact:true,level:1}).click();};
 await page.goto(base+'?modo=plataforma#/visao-geral');await page.getByTestId('performance-total').waitFor();
 await test('Visão Geral executiva reconcilia os seis cards e os mostra no notebook',async()=>{
  assert.equal(await total(),736);assert.equal(await value('Contratos com chamados'),'12');assert.equal(await value('Aderência ao SLA simulada'),'91,9%');assert.equal(await value('Custo estimado no período'),currencyLabel(696734.6));assert.equal(await value('Contratos sob pressão'),'12');assert.equal(await value('Críticos no histórico'),'66');assert.equal(await value('Prioridades ativas'),'1');
  const rects=await page.locator('[data-testid^="kpi-"]').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().bottom));assert.ok(rects.every(bottom=>bottom<768));
  await page.screenshot({path:evidence+'/performance-desktop.png'});
 });
 await test('EXT não possui números financeiros nem integração simulada',async()=>{
  for(const name of ['Receita','Margem','TCO contábil']){const ext=page.getByTestId('ext-'+name);assert.match(await ext.innerText(),/EXT/);assert.match(await ext.innerText(),/Integração pendente/);assert.doesNotMatch(await ext.innerText(),/R\$|\d+%/);await ext.getByRole('button',{name:'Sobre '+name,exact:true}).click();assert.match(await page.getByRole('dialog').innerText(),/Não conectada|não conectada/);await close();}
 });
 await test('cinco contratos inicialmente e lista completa de doze, com populações distintas',async()=>{
  const table=page.getByRole('table',{name:'Contratos sob pressão operacional'});assert.equal(await table.locator('tbody tr').count(),5);assert.match(await table.locator('tbody tr').first().innerText(),/CT-2026-007/);
  await page.getByRole('button',{name:'Lista completa (12)',exact:true}).click();assert.equal(await page.getByRole('dialog').locator('tbody tr').count(),12);await close();
  await table.getByRole('button',{name:'Impacto Alto de CT-2026-007',exact:true}).click();assert.match(await page.getByRole('dialog').innerText(),/61 chamados/);await close();
  await table.getByRole('button',{name:'Abrir contrato CT-2026-007',exact:true}).click();assert.match(await page.getByRole('dialog').innerText(),/90 chamados/);
  await page.getByRole('dialog').getByRole('button',{name:'Próxima página',exact:true}).click();
  await page.getByRole('dialog').getByRole('button',{name:/Ver detalhes/}).first().click();assert.match(await page.getByRole('dialog').last().innerText(),/Tempo de resolução simulado/);await close();assert.match(await page.getByRole('dialog').innerText(),/Página 2 de 9/);await close();
 });
 await test('gráficos oferecem registros elegíveis e suporte por dia',async()=>{
  assert.equal(await page.getByRole('button',{name:/^Custo diário em /}).count(),60);
  const sla=page.getByRole('button',{name:/^SLA diário em 06\/10\/2026/});await sla.click();assert.match(await page.getByRole('dialog').innerText(),/2 chamados/);await close();
  await page.getByRole('button',{name:/^Criticidade diária em 06\/10\/2026/}).click();assert.match(await page.getByRole('dialog').innerText(),/14 chamados/);await close();
  await page.getByRole('button',{name:/^Custo diário em 06\/10\/2026/}).click();assert.match(await page.getByRole('dialog').innerText(),/14 chamados/);await close();
 });
 await test('AND/OR, busca e contexto preservados nas quatro páginas funcionais',async()=>{
  await choose('Área',['SP-Sul']);await choose('Criticidade',['Laranja','Vermelho']);
  const state={...DEFAULT_STATE,filters:{Área:['SP-Sul'],Criticidade_ORQUESTRA:['Laranja','Vermelho']}},view=selectView(state),a=executiveAnalysis(view.records,view.period);
  await poll(async()=>await total()===a.total);assert.equal(await value('Custo estimado no período'),currencyLabel(a.cost.value));assert.equal(await value('Aderência ao SLA simulada'),percentLabel(a.adherence.value));
  for(const [name,id] of [['Chamados','result-count'],['SLA & Criticidade','sla-total'],['Riscos & Tendências','risk-total']]){await nav().getByRole('link',{name,exact:true}).click();assert.equal(Number(await page.getByTestId(id).innerText()),a.total);}
  await nav().getByRole('link',{name:'Visão Geral',exact:true}).click();assert.equal(await total(),a.total);
  await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();await page.getByRole('searchbox',{name:'Buscar chamados'}).fill('HOSPITAL SAO PAULO');
  const n=selectView({...DEFAULT_STATE,search:'hospital são paulo'}).summary.total;await poll(async()=>await total()===n);
  await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();
 });
 await test('vazio e ausência de concluídos não fabricam custo ou aderência',async()=>{
  await page.getByRole('searchbox',{name:'Buscar chamados'}).fill('nenhum-registro-c3-xyz');await poll(async()=>await total()===0);
  assert.equal(await value('Custo estimado no período'),'—');assert.equal(await value('Aderência ao SLA simulada'),'—');assert.match(await page.locator('main').innerText(),/Nenhum contrato/);assert.doesNotMatch(await page.locator('main').innerText(),/NaN|Infinity/);
  await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();await choose('Status',['Aberto']);assert.equal(await value('Aderência ao SLA simulada'),'—');
  await page.getByRole('button',{name:/^SLA diário em 06\/10\/2026/}).click();assert.match(await page.getByRole('dialog').innerText(),/0 chamados/);await close();
  await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();
 });
 await test('catorze explicações descrevem fonte, fórmula, população e cobertura',async()=>{
  const infos=page.getByRole('button',{name:/^Sobre /});assert.equal(await infos.count(),14);
  for(let i=0;i<await infos.count();i++){await infos.nth(i).click();const text=await page.getByRole('dialog').innerText();for(const marker of ['Campos de origem','Regra de cálculo','População considerada','Período de criação','Valores ausentes'])assert.ok(text.includes(marker));await page.keyboard.press('Escape');}
 });
 await test('offline carregado e responsividade mantêm a consulta sem erros',async()=>{
  await context.setOffline(true);await page.getByLabel('Período',{exact:true}).selectOption('1');await poll(async()=>await total()===14);await page.getByRole('button',{name:/^Custo diário em /}).click();await page.getByRole('dialog').waitFor();await close();await context.setOffline(false);await page.getByLabel('Período',{exact:true}).selectOption('60');await poll(async()=>await total()===736);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.getByRole('region',{name:'Evolução do custo estimado'}).scrollIntoViewIfNeeded();await page.screenshot({path:evidence+'/performance-analises.png'});
  await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.locator('main').evaluate(el=>el.scrollTop=0);await page.screenshot({path:evidence+'/performance-mobile.png'});assert.deepEqual(errors,[]);
 });
}finally{await browser?.close();server.kill('SIGTERM');}
