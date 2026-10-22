import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {mkdirSync,readdirSync,readFileSync} from 'node:fs';
import {join,resolve,dirname} from 'node:path';

// Exercise native ESM served by Vite; production bundles cannot expose stale dev transforms.
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.ORQUESTRA_PLAYWRIGHT||'/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.env.ORQUESTRA_DEV_URL||'http://127.0.0.1:5209/OrquestraNEXT/';
const evidence=process.env.ORQUESTRA_DEV_EVIDENCE||'/tmp/orquestra-inicializacao/dev';
mkdirSync(evidence,{recursive:true});
// A separate dependency cache avoids changing another running dev server's optimization state.
const server=process.env.ORQUESTRA_DEV_URL?null:spawn(process.execPath,['--input-type=module','-e',
 `import {createServer} from 'vite';const server=await createServer({cacheDir:${JSON.stringify(join(evidence,'vite-cache'))},server:{host:'127.0.0.1',port:5209,strictPort:true}});await server.listen();`],{stdio:'pipe'});
let log='',browser;
server?.stdout.on('data',d=>log+=d);server?.stderr.on('data',d=>log+=d);
async function ready(){for(let i=0;i<200;i++){if(server&&server.exitCode!==null)throw Error(log);try{if((await fetch(base)).ok)return;}catch{}await new Promise(r=>setTimeout(r,40));}throw Error('Vite indisponível: '+log);}
function importsFromService(folder){
 const names=new Set();
 for(const entry of readdirSync(folder,{withFileTypes:true})){
  const path=join(folder,entry.name);
  if(entry.isDirectory()){for(const name of importsFromService(path))names.add(name);}
  else if(/\.(jsx?|mjs)$/.test(entry.name)){
   for(const match of readFileSync(path,'utf8').matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]([^'"]*chamados\.js)['"]/g)){
    if(resolve(dirname(path),match[2])!==resolve('src/platform/services/chamados.js'))continue;
    for(const name of match[1].split(','))names.add(name.trim().split(/\s+as\s+/)[0]);
   }
  }
 }
 return names;
}
try{
 await ready();
 browser=await chromium.launch({executablePath:process.env.ORQUESTRA_CHROME||'/usr/bin/google-chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 // The existing app has no root favicon; keep every application/module error visible.
 page.on('console',m=>{if(m.type()==='error'&&new URL(m.location().url||base).pathname!=='/favicon.ico')errors.push(m.text());});
 await page.addInitScript(()=>sessionStorage.setItem('orquestra.platform.demo','active'));
 await page.goto(base+'?modo=plataforma#/visao-geral');
 await test('inicialização dev: módulo servido exporta estado inicial, reducer e seletor',async()=>{
  const response=await fetch(base+'src/platform/services/chamados.js');assert.equal(response.status,200);
  const source=await response.text();assert.match(source,/export const DEFAULT_STATE\s*=/);
  const contract=await page.evaluate(async()=>{const m=await import('./src/platform/services/chamados.js');return {days:m.DEFAULT_STATE.days,total:m.selectView(m.DEFAULT_STATE).summary.total,reset:m.consultationReducer({...m.DEFAULT_STATE,days:7},{type:'reset'}).days};});
  assert.deepEqual(contract,{days:60,total:736,reset:60});
 });
 await test('inicialização dev: todas importações nomeadas do serviço têm export correspondente',async()=>{
  const names=[...new Set([...importsFromService('src/platform'),...importsFromService('tests')])].sort();
  assert.ok(names.includes('DEFAULT_STATE'));assert.ok(names.includes('consultationReducer'));assert.ok(names.includes('selectView'));
  const absent=await page.evaluate(async names=>{const m=await import('./src/platform/services/chamados.js');return names.filter(name=>!(name in m));},names);
  assert.deepEqual(absent,[]);
 });
 for(const [route,heading,id] of [['visao-geral','Performance Operacional & Financeira','performance-total'],['chamados','Chamados',null],['tecnicos','Técnicos','technicians-total'],['pecas','Peças','components-total']]){
  await test('inicialização dev: #/'+route+' carrega diretamente e após refresh',async()=>{
   await page.goto(base+'?modo=plataforma#/'+route);
   for(let attempt=0;attempt<2;attempt++){
    if(attempt)await page.reload();
    await page.getByRole('heading',{name:heading,exact:true,level:1}).waitFor();
    if(id){await page.getByTestId(id).waitFor();assert.equal(Number(await page.getByTestId(id).innerText()),736);}
    if(route==='chamados')await page.getByRole('table',{name:'Tabela de chamados'}).waitFor();
    if(route==='pecas'){await page.getByRole('table',{name:'Tabela de componentes'}).waitFor();assert.equal(await page.getByTestId(/^kpi-/).count(),5);}
   }
   await page.screenshot({path:join(evidence,route+'.png')});
  });
 }
 await test('inicialização dev: Feira ESM carrega, avança e refresh restaura T0',async()=>{
  await page.clock.install();
  await page.goto(base+'?modo=feira');
  await page.getByRole('heading',{name:'Modo Feira — Simulação',exact:true}).waitFor();
  assert.match(await page.getByTestId('feira-total').innerText(),/\n10\n/);
  const model=await page.evaluate(async()=>{const m=await import('./src/feira/temporalState.js');return m.advance(m.initialState(),45000).phase;});
  assert.equal(model,1);
  await page.clock.runFor(27000);
  assert.match(await page.getByTestId('feira-state').innerText(),/^T01/);
  await page.reload();await page.getByTestId('feira-state').waitFor();
  assert.match(await page.getByTestId('feira-state').innerText(),/^T0/);
 });
 await test('inicialização dev: módulos conectados e primitivos compartilhados têm ESM válido',async()=>{
  const modules=await page.evaluate(async()=>{const [p,t,ui,synced]=await Promise.all([import('./src/feira/sync/protocol.js'),import('./src/feira/sync/transport.js'),import('./src/platform/components/OperationalUI.jsx'),import('./src/feira/SyncedFeiraApp.jsx')]);return [p.PROTOCOL_VERSION,typeof t.createSyncClient,typeof ui.Dialog,typeof ui.CriticalityBadge,typeof synced.default];});
  assert.deepEqual(modules,[1,'function','function','function','function']);
 });
 await test('inicialização dev: nenhuma falha ESM, erro JS ou erro de console nas rotas Plataforma e Feira',()=>assert.deepEqual(errors,[]));
}finally{await browser?.close();server?.kill('SIGTERM');}
