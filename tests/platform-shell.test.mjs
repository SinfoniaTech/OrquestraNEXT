import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import {PAGES} from '../src/platform/navigation.js';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.ORQUESTRA_PLAYWRIGHT||'/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const port='5189',base='http://127.0.0.1:'+port+'/OrquestraNEXT/';
const evidence=process.env.ORQUESTRA_SHELL_EVIDENCE||'/tmp/orquestra-shell-a/evidence';
mkdirSync(evidence,{recursive:true});
const poll=async(fn)=>{const end=Date.now()+8000;while(Date.now()<end){if(await fn())return;await new Promise(r=>setTimeout(r,40));}throw new Error('Condição não atingida');};
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',port,'--strictPort','--outDir',process.env.ORQUESTRA_TEST_DIST||'/tmp/orquestra-shell-a/dist'],{stdio:'pipe'});
let log='';server.stdout.on('data',d=>log+=d);server.stderr.on('data',d=>log+=d);
let browser;const errors=[];
try{
 await poll(async()=>{try{return (await fetch(base)).ok;}catch{return false;}});
 assert.equal(server.exitCode,null,log);
 browser=await chromium.launch({executablePath:process.env.ORQUESTRA_CHROME||'/usr/bin/google-chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1366,height:768}});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400 && new URL(r.url()).pathname!='/favicon.ico')errors.push(r.status()+' '+r.url());});
 const heading=text=>page.getByRole('heading',{name:text==='Visão Geral'?'Performance Operacional & Financeira':text,exact:true,level:1});
 await test('acesso independente é demonstrativo, sem credenciais corporativas',async()=>{
  await page.goto(base+'?modo=plataforma#/login');
  await page.getByRole('heading',{name:'Acesse o Orquestra'}).waitFor();
  assert.equal(await page.locator('input').count(),0);
  assert.match(await page.locator('main').innerText(),/Sem senha ou autenticação corporativa/);
  await page.screenshot({path:evidence+'/login.png'});
  await page.getByRole('button',{name:'Acessar demonstração'}).click();
  await heading('Visão Geral').waitFor();
  assert.match(await page.locator('body').innerText(),/DEMO · Dados sintéticos/);
 });
 await test('12 menus e logo acessíveis; placeholders sem métricas',async()=>{
  assert.equal(PAGES.length,12);
  const nav=page.getByRole('navigation',{name:'Menu principal'});
  assert.equal(await nav.getByRole('link').count(),12);
  assert.ok(await nav.locator('..').getByRole('img',{name:'Orquestra',exact:true}).isVisible());
  for(const item of PAGES){
   await nav.getByRole('link',{name:item.label,exact:true}).click();
   await heading(item.label).waitFor();
   assert.equal(await nav.getByRole('link',{name:item.label,exact:true}).getAttribute('aria-current'),'page');
   if(item.id==='visao-geral'){
    await page.getByTestId('performance-total').waitFor();
    assert.match(await page.getByRole('main').innerText(),/HIST_60_DIAS/);
   }else if(item.id==='tecnicos'){
    await page.getByTestId('technicians-total').waitFor();
    assert.match(await page.getByRole('main').innerText(),/HIST_60_DIAS/);
   }else if(item.id==='equipamentos'){
    await page.getByTestId('equipment-total').waitFor();
    assert.match(await page.getByRole('main').innerText(),/HIST_60_DIAS/);
   }else if(item.id==='custos-tco'){
    await page.getByTestId('costs-total').waitFor();
    assert.match(await page.getByRole('main').innerText(),/HIST_60_DIAS/);
   }else if(item.id==='contratos-margem'){
    await page.getByRole('table',{name:'Tabela de contratos'}).waitFor();
    assert.match(await page.getByRole('main').innerText(),/HIST_60_DIAS/);
   }else if(item.id==='chamados'){
    await page.getByRole('table',{name:'Tabela de chamados'}).waitFor();
    assert.match(await page.getByRole('main').innerText(),/HIST_60_DIAS/);
   }else if(item.id==='riscos-tendencias'){
    await page.getByTestId('risk-total').waitFor();
    assert.match(await page.getByRole('main').innerText(),/HIST_60_DIAS/);
   }else if(item.id==='sla-criticidade'){
    assert.match(await page.getByRole('main').innerText(),/HIST_60_DIAS/);
    await page.getByTestId('sla-total').waitFor();
   }else{
    assert.match(await page.getByRole('main').innerText(),/Desenvolvimento pendente/);
    assert.doesNotMatch(await page.getByRole('main').innerText(),/R\$|736|1\.248|92,4%/);
   }
  }
  await nav.getByRole('link',{name:'Visão Geral',exact:true}).click();await heading('Visão Geral').waitFor();
  await page.screenshot({path:evidence+'/plataforma.png'});
  const rects=await nav.getByRole('link').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom};}));
  assert.ok(rects.every(r=>r.top>=0 && r.bottom<=768),'12 entradas visíveis em 1366x768');
 });
 await test('refresh, histórico e endereço desconhecido são previsíveis',async()=>{
  await page.getByRole('navigation',{name:'Menu principal'}).getByRole('link',{name:'Chamados',exact:true}).click();await heading('Chamados').waitFor();
  await page.reload();await heading('Chamados').waitFor();
  await page.getByRole('navigation',{name:'Menu principal'}).getByRole('link',{name:'Peças',exact:true}).click();await heading('Peças').waitFor();
  await page.goBack();await heading('Chamados').waitFor();
  await page.goto(base+'?modo=plataforma#/nao-existe');await heading('Página não encontrada').waitFor();
  await page.getByRole('link',{name:'Ir para Visão Geral',exact:true}).click();await heading('Visão Geral').waitFor();
 });
 await test('atalho ao conteúdo mantém rota e foca main',async()=>{
  const skip=page.getByRole('link',{name:'Ir para o conteúdo'});
  await skip.focus();await skip.press('Enter');
  assert.equal(new URL(page.url()).hash,'#/visao-geral');
  assert.equal(await page.locator('main').evaluate(el=>el===document.activeElement),true);
 });
 await test('menu compacto móvel, Escape e ausência de overflow horizontal',async()=>{
  await page.setViewportSize({width:390,height:844});
  const opener=page.getByRole('button',{name:'Abrir menu',exact:true});
  await opener.click();
  await page.getByRole('navigation',{name:'Menu principal'}).getByRole('link',{name:'Chamados',exact:true}).click();await heading('Chamados').waitFor();
  assert.equal(await opener.getAttribute('aria-expanded'),'false');
  await opener.click();await page.keyboard.press('Escape');
  assert.equal(await opener.getAttribute('aria-expanded'),'false');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
  await page.screenshot({path:evidence+'/mobile.png'});
  await page.setViewportSize({width:1366,height:768});
 });
 await test('apresentação original permanece padrão e recupera demo ao voltar',async()=>{
  await page.getByRole('link',{name:'Apresentação original',exact:true}).click();
  await page.getByRole('button',{name:'Próxima cena',exact:true}).waitFor();
  assert.equal(new URL(page.url()).search,'');
  assert.equal(new URL(page.url()).hash,'#/1');
  await page.goBack();await heading('Chamados').waitFor();
 });
 await test('saída retorna login; URL direta não simula sessão autenticada',async()=>{
  await page.getByRole('button',{name:'Sair da demonstração'}).click();
  await page.getByRole('button',{name:'Acessar demonstração'}).waitFor();
  await page.goto(base+'?modo=plataforma#/chamados');
  await page.getByRole('button',{name:'Acessar demonstração'}).waitFor();
  assert.deepEqual(errors,[]);
 });
}finally{
 writeFileSync(evidence+'/observations.json',JSON.stringify({errors},null,2));
 await browser?.close();server.kill('SIGTERM');
}
