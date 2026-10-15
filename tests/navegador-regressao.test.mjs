import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
const require=createRequire(import.meta.url);
const pw=process.env.ORQUESTRA_PLAYWRIGHT || '/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright';
const {chromium}=require(pw);
const port=process.env.ORQUESTRA_TEST_PORT || '5187';
const out=process.env.ORQUESTRA_TEST_DIST || '/tmp/orquestra-protecao-43dd028/dist';
const evidence=process.env.ORQUESTRA_TEST_EVIDENCE || '/tmp/orquestra-protecao-43dd028/evidence';
const base='http://127.0.0.1:'+port+'/OrquestraNEXT/';
mkdirSync(evidence,{recursive:true});
const poll=async(fn,ms=8000)=>{const end=Date.now()+ms;while(Date.now()<end){if(await fn())return;await new Promise(r=>setTimeout(r,50));}throw new Error('Condição não atingida no prazo');};
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',port,'--strictPort','--outDir',out],{stdio:['ignore','pipe','pipe']});
let serverLog='';server.stdout.on('data',d=>serverLog+=d);server.stderr.on('data',d=>serverLog+=d);
let browser;
const errors=[];
const observations=[];
try {
 await poll(async()=>{try{return (await fetch(base)).ok;}catch{return false;}});
 assert.equal(server.exitCode,null,'preview próprio deve estar ativo: '+serverLog);
 browser=await chromium.launch({executablePath:process.env.ORQUESTRA_CHROME || '/usr/bin/google-chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1366,height:768}});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error' && !m.text().startsWith('Failed to load resource:'))errors.push(m.text());});
 page.on('requestfailed',r=>errors.push('requestfailed '+r.url()));
 page.on('response',r=>{if(r.status()>=400){const msg=r.status()+' '+r.url(); if(new URL(r.url()).pathname==='/favicon.ico')observations.push(msg);else errors.push(msg);}});
 const open=async n=>{
  await page.goto(base+'#/'+n);
  await page.getByRole('button',{name:'Próxima cena',exact:true}).waitFor();
  await page.waitForFunction(()=>document.querySelectorAll('main a,main h1,main h2').length>0);
 };
 const ids=()=>page.locator('[data-flip-id]').evaluateAll(es=>es.map(e=>e.dataset.flipId));
 const card=id=>page.getByRole('link').filter({hasText:id});
 const body=()=>page.locator('body').innerText();
 const until=async text=>poll(async()=>(await body()).includes(text));

 await test('dez hashes diretos carregam e mantêm posição após refresh',async()=>{
  for(let n=1;n<=10;n++){
   await open(n);
   assert.match(await body(),new RegExp(n+' / 10'));
   await page.reload();
   await page.getByRole('button',{name:'Próxima cena',exact:true}).waitFor();
   await page.waitForFunction(()=>document.querySelectorAll('main a,main h1,main h2').length>0);
   assert.equal(new URL(page.url()).hash,'#/'+n);
   await page.screenshot({path:evidence+'/cena-'+n+'.png'});
  }
 });
 await test('teclado, extremos, H, foco editável, hash inválido',async()=>{
  await open(1);
  assert.equal(await page.getByRole('button',{name:'Cena anterior',exact:true}).isEnabled(),false);
  await page.locator('body').press('ArrowRight');await poll(()=>Promise.resolve(page.url().endsWith('#/2')));
  await page.locator('body').press('End');await poll(()=>Promise.resolve(page.url().endsWith('#/10')));
  assert.equal(await page.getByRole('button',{name:'Próxima cena',exact:true}).isEnabled(),false);
  await page.locator('body').press('Home');await poll(()=>Promise.resolve(page.url().endsWith('#/1')));
  await page.locator('body').press('h');assert.equal(await page.getByRole('button',{name:'Próxima cena',exact:true}).count(),0);
  await page.locator('body').press('h');
  await page.getByRole('searchbox',{name:'Buscar',exact:true}).fill('ensaio');
  await page.getByRole('searchbox',{name:'Buscar',exact:true}).press('ArrowRight');
  assert.equal(new URL(page.url()).hash,'#/1');
  await page.getByRole('searchbox',{name:'Buscar',exact:true}).press('Tab');
  await page.keyboard.press('PageDown');await poll(()=>Promise.resolve(page.url().endsWith('#/2')));
  await page.locator('body').press('PageUp');await poll(()=>Promise.resolve(page.url().endsWith('#/1')));
  await page.locator('body').press('Space');await poll(()=>Promise.resolve(page.url().endsWith('#/2')));
  await page.goto(base+'#/999');await poll(()=>Promise.resolve(page.url().endsWith('#/1')));
  await page.getByRole('button',{name:'Próxima cena',exact:true}).click();await poll(()=>Promise.resolve(page.url().endsWith('#/2')));
  await page.getByRole('button',{name:'Cena anterior',exact:true}).click();await poll(()=>Promise.resolve(page.url().endsWith('#/1')));
  await page.keyboard.press('Control+ArrowRight');assert.equal(new URL(page.url()).hash,'#/1');
 });
 await test('posição 2: três chegadas, contagem final e detalhe',async()=>{
  await open(2);
  await poll(async()=>(await body()).includes('1.248'),15000);
  const row=page.getByRole('button',{name:'Abrir detalhes do chamado #CH-0008182',exact:true});
  await row.click();
  await page.getByRole('dialog').waitFor();
  assert.match(await page.getByRole('dialog').innerText(),/8182/);
  await page.keyboard.press('Escape');
  await poll(async()=>await page.getByRole('dialog').count()===0);
 });
 await test('normal→média sem subida; detalhe segue etapa durante roteiro',async()=>{
  await open(4);
  assert.equal((await ids()).at(-1),'CH-0008181');
  await card('CH-0008181').click();
  await until('Faltam 3h10 para SLA');
  await page.getByRole('button',{name:'Chamadas',exact:true}).click();
  assert.equal((await ids()).at(-1),'CH-0008181');
  assert.match(await card('CH-0008181').innerText(),/MÉDIA/);
  assert.equal(await page.getByText('Sem chamados prioritários',{exact:true}).locator('xpath=../..').getAttribute('aria-hidden'),'true');
 });
 await test('média sobe com Web Animation; alta mantém topo',async()=>{
  await open(5);
  await poll(async()=>(await ids())[0]==='CH-0008181');
  const animation=await page.locator('[data-flip-id="CH-0008181"]').evaluate(e=>e.getAnimations().map(a=>({duration:a.effect.getTiming().duration,state:a.playState})));
  assert.ok(animation.some(a=>a.duration===700),'FLIP de 700ms observado');
  await open(6);await poll(async()=>(await card('CH-0008181').innerText()).includes('Faltam 50 min para SLA'));
  assert.equal((await ids())[0],'CH-0008181');
  assert.match(await card('CH-0008181').innerText(),/ALTA/);
  await page.screenshot({path:evidence+'/supervisor-alta.png'});
 });
 await test('hospital entra no fim, sobe e exibe tempo decorrido sem SLA',async()=>{
  await open(8);
  assert.equal((await ids()).at(-1),'CH-0008182');
  assert.match(await card('CH-0008182').innerText(),/Tempo decorrido/);
  assert.doesNotMatch(await card('CH-0008182').innerText(),/Faltam/);
  await card('CH-0008182').click();
  await until('Tempo decorrido: 00h35');
  await page.getByRole('button',{name:'Chamadas',exact:true}).click();
  await open(9);await poll(async()=>(await ids())[0]==='CH-0008182');
  assert.equal((await ids())[1],'CH-0008181');
 });
 await test('alertas alta/crítico, notificações, expandir, fechar, reabrir e detalhe',async()=>{
  for(const n of [7,10]){
   await open(n);
   const dialog=page.getByRole('dialog');
   await dialog.waitFor();
   const txt=await dialog.innerText();
   assert.match(txt,n===7?/risco de estourar o SLA/:/demanda crítica/);
   assert.ok(await page.getByRole('button',{name:/Alertas/}).innerText().then(t=>t.includes('1')));
   await dialog.getByRole('button',{name:'Ver detalhes',exact:true}).click();
   await dialog.getByRole('button',{name:'Abrir chamado completo',exact:true}).waitFor({state:'visible'});
   await page.screenshot({path:evidence+'/modal-'+n+'.png'});
   await dialog.getByRole('button',{name:'Recolher detalhes',exact:true}).click();
   await page.keyboard.press('Escape');await poll(async()=>await dialog.count()===0);
   // Identificador acessível do sino é conferido no componente de referência.
   await page.getByRole('button',{name:/notifica/i}).click();
   await dialog.waitFor();
   await dialog.getByRole('button',{name:'Ver detalhes',exact:true}).click();
   await dialog.getByRole('button',{name:'Abrir chamado completo',exact:true}).click();
   await poll(async()=>await dialog.count()===0);
   await until(n===7?'Faltam 50 min para SLA':'Tempo decorrido: 00h35');
  }
 });
 await test('saída antes dos timers e revisita reinicia sem modal residual',async()=>{
  await open(7);
  await page.locator('body').press('Home');await poll(()=>Promise.resolve(page.url().endsWith('#/1')));
  await new Promise(r=>setTimeout(r,1500));
  assert.equal(await page.getByRole('dialog').count(),0);
  await open(3);assert.equal((await ids()).length,5);
  assert.match(await body(),/Sem chamados prioritários/);
 });
 await test('movimento reduzido mantém conteúdo e evolução; sem FLIP',async()=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await open(5);await poll(async()=>(await ids())[0]==='CH-0008181');
  const active=await page.locator('[data-flip-id]').evaluateAll(es=>es.flatMap(e=>e.getAnimations()).filter(a=>a.playState==='running').length);
  assert.equal(active,0);
  await page.emulateMedia({reducedMotion:'no-preference'});
 });
 await test('nenhum erro JS/console/chunk observado',()=>assert.deepEqual(errors,[]));
} finally {
 writeFileSync(evidence+'/observations.json',JSON.stringify({errors,observations,viewport:'1366x768',browser:'Chrome headless'},null,2));
 await browser?.close();
 server.kill('SIGTERM');
}
