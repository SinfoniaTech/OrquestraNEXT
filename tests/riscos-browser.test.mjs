import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {DEFAULT_STATE,selectView} from '../src/platform/services/chamados.js';
import {riskAnalysis} from '../src/platform/services/riscos.js';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.ORQUESTRA_PLAYWRIGHT||'/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dist=process.env.ORQUESTRA_TEST_DIST||'/tmp/orquestra-c2/dist',base='http://127.0.0.1:5195/OrquestraNEXT/',evidence='/tmp/orquestra-c2/evidence';mkdirSync(evidence,{recursive:true});
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','5195','--strictPort','--outDir',dist],{stdio:'pipe'});
let log='',browser;server.stdout.on('data',d=>log+=d);server.stderr.on('data',d=>log+=d);
async function poll(fn){for(let i=0;i<200;i++){if(await fn())return;await new Promise(r=>setTimeout(r,40));}throw Error('Condição não atingida');}
try{
 await poll(async()=>{try{return (await fetch(base)).ok;}catch{return false;}});assert.equal(server.exitCode,null,log);
 browser=await chromium.launch({executablePath:process.env.ORQUESTRA_CHROME||'/usr/bin/google-chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1366,height:768},timezoneId:'Asia/Tokyo'});await context.addInitScript(()=>sessionStorage.setItem('orquestra.platform.demo','active'));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const nav=()=>page.getByRole('navigation',{name:'Menu principal'});
 const total=async()=>Number(await page.getByTestId('risk-total').innerText());
 const card=title=>page.getByTestId('kpi-'+title);
 const close=async()=>page.getByRole('button',{name:'Fechar diálogo',exact:true}).last().click();
 const choose=async(label,values)=>{await page.getByRole('button',{name:new RegExp('^'+label+':')}).click();const group=page.getByRole('group',{name:'Opções de '+label,exact:true});for(const value of values)await group.getByRole('checkbox',{name:value,exact:true}).check();await page.getByRole('heading',{name:'Riscos & Tendências',level:1,exact:true}).click();};
 await page.goto(base+'?modo=plataforma#/riscos-tendencias');await page.getByTestId('risk-total').waitFor();
 await test('cards reconciliam histórico, distintos e prioridade ativa',async()=>{
  assert.equal(await total(),736);for(const [name,n] of [['Ocorrências Críticas — Histórico',66],['Ocorrências em Laranja — Histórico',72],['Equipamentos com Recorrência Elevada',19],['Contratos sob Pressão Operacional',12],['Ocorrências Ativas Prioritárias',1]])assert.equal(Number(await card(name).locator('strong').innerText()),n);
  assert.equal((await page.locator('[data-testid^="risk-cor-"]').allTextContents()).map(Number).reduce((a,b)=>a+b,0),736);
  assert.equal(await page.getByRole('button',{name:/^Explorar dia /}).count(),60);
  await page.screenshot({path:evidence+'/riscos-desktop.png'});
 });
 await test('drill-down, ordenação, paginação e detalhe retornam à lista',async()=>{
  await page.getByRole('button',{name:'Explorar cor Vermelho',exact:true}).click();
  await page.getByRole('table',{name:'Aprofundamento de riscos'}).waitFor();
  const dialog=page.getByRole('dialog');assert.match(await dialog.innerText(),/66 registros/);
  await dialog.getByLabel('Ordenar registros de risco').selectOption('Cliente');
  await dialog.getByRole('button',{name:'Próxima página',exact:true}).click();
  assert.match(await dialog.innerText(),/Página 2 de 7/);
  await dialog.getByRole('button',{name:/Ver detalhes/}).first().click();
  assert.match(await page.getByRole('dialog').last().innerText(),/Tempo até a chegada/);await close();
  assert.match(await page.getByRole('dialog').innerText(),/Página 2 de 7/);await close();
 });
 await test('agrupamentos de recorrência e evidências diárias são consultáveis',async()=>{
  await page.getByLabel('Agrupar recorrência por').selectOption('Componente Principal');
  await page.getByRole('region',{name:'Recorrência por equipamento ou componente'}).getByRole('button').nth(1).click();
  await page.getByRole('table',{name:'Aprofundamento de riscos'}).waitFor();await close();
  await page.getByRole('button',{name:'Explorar dia 06/10/2026: 14 chamados',exact:true}).click();assert.match(await page.getByRole('dialog').innerText(),/14 registros/);await close();
 });
 await test('AND área e OR cores conciliam cards, cores e lista; filtros persistem entre páginas',async()=>{
  await choose('Criticidade',['Laranja','Vermelho']);await choose('Área',['SP-Sul']);
  const expected=riskAnalysis(selectView({...DEFAULT_STATE,filters:{Criticidade_ORQUESTRA:['Laranja','Vermelho'],Área:['SP-Sul']}}).records);
  await poll(async()=>await total()===expected.total);
  assert.equal(Number(await card('Equipamentos com Recorrência Elevada').locator('strong').innerText()),expected.units);
  assert.equal((await page.locator('[data-testid^="risk-cor-"]').allTextContents()).map(Number).reduce((a,b)=>a+b,0),expected.total);
  await nav().getByRole('link',{name:'Chamados',exact:true}).click();assert.equal(Number(await page.getByTestId('result-count').innerText()),expected.total);
  await nav().getByRole('link',{name:'SLA & Criticidade',exact:true}).click();assert.equal(Number(await page.getByTestId('sla-total').innerText()),expected.total);
  await nav().getByRole('link',{name:'Riscos & Tendências',exact:true}).click();assert.equal(await total(),expected.total);
  await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();await poll(async()=>await total()===736);
 });
 await test('busca, estado vazio e hoje usam relógio simulado',async()=>{
  await page.getByRole('searchbox',{name:'Buscar chamados'}).fill('nao-existe-risco-xyz');await poll(async()=>await total()===0);
  assert.doesNotMatch(await page.locator('main').innerText(),/NaN|Infinity/);
  assert.match(await page.locator('main').innerText(),/Nenhum registro/);
  await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();
  await page.getByLabel('Período',{exact:true}).selectOption('1');await poll(async()=>await total()===14);
  assert.equal(await page.getByRole('button',{name:/^Explorar dia /}).count(),1);
  await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();
 });
 await test('doze explicações acessíveis descrevem unidades, fórmulas e fontes',async()=>{
  const infos=page.getByRole('button',{name:/^Sobre /});assert.equal(await infos.count(),12);
  for(let i=0;i<await infos.count();i++){await infos.nth(i).click();const text=await page.getByRole('dialog').innerText();for(const t of ['CALC','Campos de origem','Regra de cálculo','População considerada','HIST_60_DIAS'])assert.ok(text.includes(t));await page.keyboard.press('Escape');}
  assert.match(await page.locator('main').innerText(),/sem modelo de Machine Learning/);
 });
 await test('offline, notebook e móvel mantêm leitura e detalhamento',async()=>{
  await context.setOffline(true);await page.getByLabel('Período',{exact:true}).selectOption('7');await poll(async()=>await total()===93);
  await page.getByRole('button',{name:'Explorar cor Vermelho',exact:true}).click();await page.getByRole('dialog').waitFor();await close();await context.setOffline(false);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.getByRole('region',{name:'Evolução diária da criticidade'}).scrollIntoViewIfNeeded();await page.screenshot({path:evidence+'/riscos-analises.png'});
  await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('main').evaluate(el=>el.scrollTop=0);await page.screenshot({path:evidence+'/riscos-mobile.png'});assert.deepEqual(errors,[]);
 });
}finally{await browser?.close();server.kill('SIGTERM');}
