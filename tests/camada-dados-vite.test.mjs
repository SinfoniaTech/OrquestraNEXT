import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'vite';
import {createRequire} from 'node:module';
import {mkdtemp,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
const require=createRequire(import.meta.url);
test('Vite empacota JSONs locais; consulta funciona com navegador offline',async()=>{
 const out=await mkdtemp(join(tmpdir(),'orquestra-data-offline-'));
 await build({configFile:false,base:'/OrquestraNEXT/',logLevel:'warn',build:{
  outDir:out,emptyOutDir:false,minify:false,
  lib:{entry:resolve('tests/data-offline-entry.mjs'),formats:['es'],fileName:()=> 'probe.mjs'}
 }});
 const {chromium}=require(process.env.ORQUESTRA_PLAYWRIGHT||'/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
 const browser=await chromium.launch({executablePath:process.env.ORQUESTRA_CHROME||'/usr/bin/google-chrome',headless:true});
 try{
  const context=await browser.newContext({offline:true,timezoneId:'Asia/Tokyo'});
  const page=await context.newPage();
  const requests=[];page.on('request',r=>requests.push(r.url()));
  await page.addScriptTag({type:'module',content:await readFile(join(out,'probe.mjs'),'utf8')});
  await page.waitForFunction(()=>typeof globalThis.orquestraDataProbe==='function');
  const data=await page.evaluate(()=>globalThis.orquestraDataProbe());
  assert.equal(data.total,736);assert.deepEqual(data.snapshots,[10,16,24]);
  assert.equal(data.reference,'2026-10-06 22:00:00');
  assert.equal(data.status.Concluído,724);
  assert.deepEqual(requests,[],'Consulta não solicita rede');
 }finally{await browser.close();}
});
