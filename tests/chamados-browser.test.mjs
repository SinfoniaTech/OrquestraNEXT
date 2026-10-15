import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import {HISTORY,DEFAULT_STATE,selectView,selectHistorical} from '../src/platform/services/chamados.js';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.ORQUESTRA_PLAYWRIGHT||'/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dist=process.env.ORQUESTRA_TEST_DIST||'/tmp/orquestra-entrega-b/dist';
const base='http://127.0.0.1:5191/OrquestraNEXT/';
const evidence='/tmp/orquestra-entrega-b/evidence';mkdirSync(evidence,{recursive:true});
const poll=async fn=>{const end=Date.now()+8000;while(Date.now()<end){if(await fn())return;await new Promise(r=>setTimeout(r,40));}throw new Error('Condição não atingida');};
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','5191','--strictPort','--outDir',dist],{stdio:'pipe'});
let log='';server.stdout.on('data',d=>log+=d);server.stderr.on('data',d=>log+=d);
const errors=[];let browser;
try{
 await poll(async()=>{try{return (await fetch(base)).ok;}catch{return false;}});
 assert.equal(server.exitCode,null,log);
 browser=await chromium.launch({executablePath:process.env.ORQUESTRA_CHROME||'/usr/bin/google-chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1366,height:768},timezoneId:'Asia/Tokyo'});
 await context.addInitScript(()=>sessionStorage.setItem('orquestra.platform.demo','active'));
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(r.status()+' '+r.url());});
 page.on('requestfailed',r=>{if(!r.url().endsWith('/favicon.ico'))errors.push(r.url());});
 const total=async()=>Number(await page.getByTestId('result-count').innerText());
 const nav=()=>page.getByRole('navigation',{name:'Menu principal'});
 const clear=async()=>{
  if(!page.url().endsWith('#/chamados'))await nav().getByRole('link',{name:'Chamados',exact:true}).click();
  await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();
  await poll(async()=>await total()===736);
 };
 const choose=async(label,values)=>{
  await page.getByRole('button',{name:new RegExp('^'+label+':')}).click();
  const group=page.getByRole('group',{name:'Opções de '+label,exact:true});
  for(const value of values)await group.getByRole('checkbox',{name:value,exact:true}).check();
  await page.getByRole('heading',{name:'Chamados',exact:true,level:1}).click();
 };
 const advanced=async()=>{const b=page.getByRole('button',{name:/^Mais filtros/});if(await b.getAttribute('aria-expanded')==='false')await b.click();};
 const consistency=async expected=>{
  await poll(async()=>await total()===expected);
  assert.equal(Number(await page.getByTestId('kpi-Total no período').locator('strong').innerText()),expected);
  for(const kind of ['status','criticidade']){
   const counts=await page.locator('[data-testid^="'+kind+'-"]').allTextContents();
   assert.equal(counts.map(Number).reduce((a,b)=>a+b,0),expected);
  }
 };
 await page.goto(base+'?modo=plataforma#/chamados');
 await page.getByRole('table',{name:'Tabela de chamados'}).waitFor();
 await test('736 históricos, 724 concluídos, 66 Vermelhos, só 1 atenção ativa',async()=>{
  await consistency(736);
  assert.equal(await page.getByTestId('kpi-Concluídos no recorte').locator('strong').innerText(),'724');
  assert.equal(await page.getByTestId('criticidade-Vermelho').innerText(),'66');
  assert.equal(await page.getByTestId('attention-count').innerText(),'1');
  assert.match(await page.locator('main').innerText(),/06\/10\/2026, 22h/);
  await page.screenshot({path:evidence+'/chamados-desktop.png'});
 });
 await test('períodos inclusivos com relógio fixo mesmo em browser Tóquio',async()=>{
  for(const [days,n] of [[1,14],[7,93],[15,202],[30,395],[60,736]]){
   await page.getByLabel('Período',{exact:true}).selectOption(String(days));await consistency(n);
  }
 });
 await test('OR de criticidade e AND de área; remover chip preserva restrição',async()=>{
  await clear();await choose('Criticidade',['Laranja','Vermelho']);await consistency(138);
  await choose('Área',['SP-Sul']);
  const expected=HISTORY.records.filter(r=>r.Área==='SP-Sul'&&['Laranja','Vermelho'].includes(r.Criticidade_ORQUESTRA)).length;
  await consistency(expected);
  await page.getByRole('button',{name:'Remover Criticidade: Laranja',exact:true}).click();
  await consistency(HISTORY.records.filter(r=>r.Área==='SP-Sul'&&r.Criticidade_ORQUESTRA==='Vermelho').length);
  assert.ok(await page.getByRole('button',{name:'Remover Área: SP-Sul',exact:true}).isVisible());
  await page.screenshot({path:evidence+'/filtros-cumulativos.png'});
 });
 await test('status, cliente, equipamento, categoria e recorrência funcionam juntos',async()=>{
  await clear();const r=HISTORY.records[0];
  await choose('Status',['Concluído']);await choose('Cliente',[r.Cliente]);await choose('Tipo de Equipamento',[r['Tipo de Unidade']]);
  await advanced();await choose('Categoria',[r['Categoria do Chamado']]);await choose('Recorrência',['Sem recorrência (0)']);
  const n=HISTORY.records.filter(x=>x.Status==='Concluído'&&x.Cliente===r.Cliente&&x['Tipo de Unidade']===r['Tipo de Unidade']&&x['Categoria do Chamado']===r['Categoria do Chamado']&&x.Recorrencia_30d===0).length;
  assert.ok(n>0);await consistency(n);
 });
 await test('busca sem acentos/caixa, vazio e limpeza completa',async()=>{
  await clear();const input=page.getByRole('searchbox',{name:'Buscar chamados'});
  await input.fill('HOSPITAL SAO PAULO');const n=selectHistorical({...DEFAULT_STATE,search:'hospital são paulo'}).length;
  await consistency(n);await input.fill('hospital são paulo');await consistency(n);
  await input.fill('zzzznenhum');await consistency(0);
  assert.ok(await page.getByText('Nenhum registro encontrado',{exact:true}).isVisible());
  assert.equal(await page.getByRole('table',{name:'Tabela de chamados'}).count(),0);
  await page.getByRole('button',{name:'Limpar consulta',exact:true}).click();await consistency(736);
  assert.equal(await input.inputValue(),'');assert.equal(await page.getByLabel('Período',{exact:true}).inputValue(),'60');
 });
 await test('ordenação/página/contexto permanecem no detalhe e entre menus',async()=>{
  await clear();await choose('Área',['SP-Sul']);
  await page.getByLabel('Ordenar por',{exact:true}).selectOption('Cliente');
  // Controle explícito define ascendente antes da paginação.
  if(await page.getByRole('button',{name:'Ordem decrescente',exact:true}).count())await page.getByRole('button',{name:'Ordem decrescente',exact:true}).click();
  await page.getByRole('button',{name:'Próxima página',exact:true}).click();
  await page.getByText('Página 2 de 29',{exact:true}).waitFor();
  const rows=await page.getByRole('table',{name:'Tabela de chamados'}).locator('tbody tr').allTextContents();
  const expected=selectView({...DEFAULT_STATE,filters:{Área:['SP-Sul']},sortField:'Cliente',sortDirection:'asc',page:2});
  assert.ok(rows[0].includes(expected.rows[0].ID_Chamado));
  const opener=page.getByRole('button',{name:'Ver detalhes de '+expected.rows[0].ID_Chamado,exact:true});
  await opener.click();const dialog=page.getByRole('dialog');
  await dialog.waitFor();assert.match(await dialog.innerText(),/Contexto[\s\S]*Operação[\s\S]*Tempo[\s\S]*Inteligência/);
  await page.screenshot({path:evidence+'/detalhe.png'});
  await page.keyboard.press('Escape');await poll(async()=>await dialog.count()===0);
  assert.equal(await opener.evaluate(el=>el===document.activeElement),true);
  assert.deepEqual(await page.getByRole('table',{name:'Tabela de chamados'}).locator('tbody tr').allTextContents(),rows);
  await nav().getByRole('link',{name:'Equipamentos',exact:true}).click();await page.getByText('Desenvolvimento pendente',{exact:true}).waitFor();
  await nav().getByRole('link',{name:'Chamados',exact:true}).click();await page.getByText('Página 2 de 29',{exact:true}).waitFor();
  await consistency(281);assert.deepEqual(await page.getByRole('table',{name:'Tabela de chamados'}).locator('tbody tr').allTextContents(),rows);
 });
 await test('detalhe de TA/TB ausentes informa ausência, não zero',async()=>{
  await clear();const row=HISTORY.records.find(r=>r.TA===null&&r.TB===null);
  await page.getByRole('searchbox',{name:'Buscar chamados'}).fill(row.ID_Chamado);await consistency(1);
  await page.getByRole('button',{name:'Ver detalhes de '+row.ID_Chamado,exact:true}).click();
  const dialog=page.getByRole('dialog');await dialog.waitFor();
  for(const field of ['TA','TB'])assert.match(await dialog.locator('dt').filter({hasText:new RegExp('^'+field+' —')}).locator('..').innerText(),/Ainda não disponível/);
  assert.match(await dialog.innerText(),/ETA refere-se ao técnico/);
  assert.match(await dialog.innerText(),/SLA restante não é inferido/);
  await dialog.getByRole('button',{name:'Fechar diálogo'}).click();
 });
 await test('todos os cards implementados têm explicação de fonte/população/cálculo',async()=>{
  await clear();await choose('Área',['SP-Sul']);
  const names=['Total no período','Abertos no recorte','Contactados no recorte','Técnicos a caminho','Em atendimento','Concluídos no recorte','Chamados por status','Criticidade histórica','Atenção na referência'];
  for(const title of names){
   await page.getByRole('button',{name:'Sobre '+title,exact:true}).click();const dialog=page.getByRole('dialog');await dialog.waitFor();
   const text=await dialog.innerText();
   for(const term of ['CALC','Campos de origem','Regra de cálculo','281 chamados','America/Sao_Paulo','HIST_60_DIAS','Valores ausentes','Unidade'])assert.ok(text.includes(term),title+' '+term);
   if(title==='Total no período')await page.screenshot({path:evidence+'/explicabilidade.png'});
   await page.keyboard.press('Escape');await poll(async()=>await dialog.count()===0);
  }
 });
 await test('consulta e detalhe funcionam offline depois de carregados',async()=>{
  await clear();await context.setOffline(true);
  try{
   await choose('Criticidade',['Vermelho']);await consistency(66);
   await page.getByRole('button',{name:/^Ver detalhes de /}).first().click();await page.getByRole('dialog').waitFor();
   await page.keyboard.press('Escape');assert.equal(await total(),66);
  }finally{await context.setOffline(false);}
 });
 await test('1366x768 e mobile sem overflow; analítica acessível',async()=>{
  await clear();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.getByRole('region',{name:'Atenção na referência',exact:true}).scrollIntoViewIfNeeded();
  await page.screenshot({path:evidence+'/analitica.png'});
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('heading',{name:'Chamados',exact:true,level:1}).scrollIntoViewIfNeeded();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:evidence+'/chamados-mobile.png'});
  await page.setViewportSize({width:1366,height:768});
 });
 await test('sem erros de execução/rede na nova consulta',()=>assert.deepEqual(errors,[]));
}finally{
 writeFileSync(evidence+'/observations.json',JSON.stringify({errors},null,2));
 await browser?.close();server.kill('SIGTERM');
}
