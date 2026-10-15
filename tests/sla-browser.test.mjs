import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {DEFAULT_STATE,selectView} from '../src/platform/services/chamados.js';
import {slaAnalysis,percentLabel} from '../src/platform/services/sla.js';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.ORQUESTRA_PLAYWRIGHT||'/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dist=process.env.ORQUESTRA_TEST_DIST||'/tmp/orquestra-c1/dist',base='http://127.0.0.1:5193/OrquestraNEXT/';
const evidence='/tmp/orquestra-c1/evidence';mkdirSync(evidence,{recursive:true});
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','5193','--strictPort','--outDir',dist],{stdio:'pipe'});
let log='',browser;server.stdout.on('data',d=>log+=d);server.stderr.on('data',d=>log+=d);
async function poll(fn){for(let i=0;i<200;i++){if(await fn())return;await new Promise(r=>setTimeout(r,40));}throw Error('Condição não atingida');}
try{
 await poll(async()=>{try{return (await fetch(base)).ok;}catch{return false;}});assert.equal(server.exitCode,null,log);
 browser=await chromium.launch({executablePath:process.env.ORQUESTRA_CHROME||'/usr/bin/google-chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1366,height:768},timezoneId:'Asia/Tokyo'});
 await context.addInitScript(()=>sessionStorage.setItem('orquestra.platform.demo','active'));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const nav=()=>page.getByRole('navigation',{name:'Menu principal'});
 const total=async()=>Number(await page.getByTestId('sla-total').innerText());
 const close=async()=>page.getByRole('button',{name:'Fechar diálogo',exact:true}).click();
 await page.goto(base+'?modo=plataforma#/sla-criticidade');
 await page.getByTestId('sla-total').waitFor();
 await test('C1 reconcilia 736, aderência 91,9%, N TA/TB e atenção atual',async()=>{
  assert.equal(await total(),736);
  assert.equal(await page.getByTestId('kpi-Aderência ao SLA').locator('strong').innerText(),'91,9%');
  assert.match(await page.getByTestId('kpi-TA — Tempo até a chegada (min)').innerText(),/728 válidos/);
  assert.match(await page.getByTestId('kpi-TB — Tempo de resolução simulado (min)').innerText(),/724 válidos/);
  assert.equal(await page.getByTestId('sla-active').innerText(),'1');
  assert.equal(await page.getByTestId('sla-cor-Vermelho').innerText(),'66');
  await page.screenshot({path:evidence+'/sla-desktop.png'});
 });
 await test('criticidade, faixa e motivo aprofundam em lista e detalhe com retorno',async()=>{
  await page.getByRole('button',{name:'Ver criticidade Vermelho',exact:true}).click();
  assert.match(await page.getByRole('dialog').innerText(),/66 chamados/);
  await page.getByRole('table',{name:'Chamados do aprofundamento'}).getByRole('button',{name:/Ver detalhes/}).first().click();
  assert.match(await page.getByRole('dialog').innerText(),/Motivo da criticidade|Motivo_Criticidade|Motivo/);
  await close();assert.match(await page.getByRole('dialog').innerText(),/66 chamados/);await close();
  await page.getByRole('button',{name:'Ver faixa >100%',exact:true}).click();assert.match(await page.getByRole('dialog').innerText(),/59 chamados/);await close();
  await page.getByRole('region',{name:'Motivos de criticidade'}).getByRole('button').nth(1).click();
  await page.getByRole('table',{name:'Chamados do aprofundamento'}).waitFor();await close();
 });
 await test('drill de tempos inclui grupos e médias explicam unidade/denominador',async()=>{
  await page.getByLabel('Agrupar tempos por').selectOption('Cliente');
  await page.getByRole('region',{name:'Tempos por agrupamento'}).locator('tbody button').first().click();
  await page.getByRole('table',{name:'Chamados do aprofundamento'}).waitFor();await close();
  await page.getByRole('button',{name:'Sobre TA — Tempo até a chegada (min)',exact:true}).click();
  const dialog=page.getByRole('dialog');assert.match(await dialog.innerText(),/728 de 736/);assert.match(await dialog.innerText(),/minutos/);
  await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
 });
 await test('filtros compartilhados persistem entre SLA e Chamados e limitam todos os painéis',async()=>{
  await page.getByLabel('Período',{exact:true}).selectOption('7');
  await page.getByRole('button',{name:'Área: Todos',exact:true}).click();
  await page.getByRole('group',{name:'Opções de Área',exact:true}).getByRole('checkbox',{name:'SP-Sul',exact:true}).check();
  await page.getByRole('heading',{name:'SLA & Criticidade',exact:true,level:1}).click();
  const expected=slaAnalysis(selectView({...DEFAULT_STATE,days:7,filters:{Área:['SP-Sul']}}).records);
  await poll(async()=>await total()===expected.total);
  assert.equal(await page.getByTestId('kpi-Aderência ao SLA').locator('strong').innerText(),percentLabel(expected.adherence.value));
  assert.equal((await page.locator('[data-testid^="sla-band-"]').allTextContents()).map(Number).reduce((a,b)=>a+b,0),expected.total);
  await nav().getByRole('link',{name:'Chamados',exact:true}).click();
  assert.equal(Number(await page.getByTestId('result-count').innerText()),expected.total);
  assert.equal(await page.getByLabel('Período',{exact:true}).inputValue(),'7');
  await nav().getByRole('link',{name:'SLA & Criticidade',exact:true}).click();assert.equal(await total(),expected.total);
 });
 await test('vazio não exibe NaN ou aderência zero fabricada',async()=>{
  await page.getByRole('searchbox',{name:'Buscar chamados'}).fill('nenhum-registro-xyz');
  await poll(async()=>await total()===0);
  assert.equal(await page.getByTestId('kpi-Aderência ao SLA').locator('strong').innerText(),'—');
  assert.equal(await page.getByTestId('kpi-TA — Tempo até a chegada (min)').locator('strong').innerText(),'—');
  assert.doesNotMatch(await page.locator('main').innerText(),/NaN|Infinity/);
  await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();await poll(async()=>await total()===736);
 });
 await test('explicações de todos os dez painéis e SLA restante pendente',async()=>{
  const infos=page.getByRole('button',{name:/^Sobre /});assert.equal(await infos.count(),10);
  for(let i=0;i<await infos.count();i++){await infos.nth(i).click();const text=await page.getByRole('dialog').innerText();for(const marker of ['CALC','Campos de origem','Regra de cálculo','População considerada','HIST_60_DIAS'])assert.ok(text.includes(marker));await close();}
  assert.match(await page.locator('main').innerText(),/SLA restante continua em validação contratual/);
 });
 await test('offline carregado, notebook/móvel sem overflow e sem erros JS',async()=>{
  await context.setOffline(true);await page.getByLabel('Período',{exact:true}).selectOption('1');await poll(async()=>await total()===14);
  await page.getByRole('button',{name:'Ver criticidade Amarelo',exact:true}).click();await page.getByRole('dialog').waitFor();await close();
  await context.setOffline(false);await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.getByRole('region',{name:'Motivos de criticidade'}).scrollIntoViewIfNeeded();await page.screenshot({path:evidence+'/sla-analise.png'});
  await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('main').evaluate(el=>el.scrollTop=0);await page.screenshot({path:evidence+'/sla-mobile.png'});
  assert.deepEqual(errors,[]);
 });
}finally{await browser?.close();server.kill('SIGTERM');}
