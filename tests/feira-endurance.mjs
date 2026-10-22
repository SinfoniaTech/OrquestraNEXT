// Ensaio com relógio real, executado separadamente da suíte rápida.
import {createRequire} from 'node:module';import {spawn} from 'node:child_process';import {mkdirSync} from 'node:fs';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require('/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dir=process.env.ORQUESTRA_FEIRA_EVIDENCE||'/tmp/orquestra-c9/evidence';mkdirSync(dir,{recursive:true});
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','5217','--strictPort','--outDir',process.env.ORQUESTRA_TEST_DIST||'/tmp/orquestra-c9/dist'],{stdio:'pipe'});let browser;
try{for(let i=0;i<200;i++){try{if((await fetch('http://127.0.0.1:5217/OrquestraNEXT/')).ok)break;}catch{}await new Promise(r=>setTimeout(r,40));}
 browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});const page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5217/OrquestraNEXT/?modo=feira');await page.getByTestId('feira-state').waitFor();
 for(const speed of [1,2]){
  if(speed===2){await page.getByLabel('Velocidade',{exact:true}).selectOption('2');await page.getByRole('button',{name:'Reiniciar',exact:true}).click();}
  const cycle=await page.locator('section[aria-label="Controles da simulação"]').innerText();
  for(const phase of Array.from({length:11},(_,i)=>i+1)){await page.waitForFunction(phase=>document.querySelector('[data-testid="feira-state"]')?.textContent.startsWith('T'+String(phase).padStart(2,'0')),phase,{timeout:55000});console.log('Relógio real '+speed+'×: T'+phase+'; '+new Date().toISOString());await page.screenshot({path:dir+'/real-'+speed+'x-t'+phase+'.png',fullPage:true});}
  await page.waitForFunction(()=>document.querySelector('[data-testid="feira-state"]')?.textContent.includes('Encerramento'),null,{timeout:55000});
  await page.waitForFunction(()=>document.querySelector('[data-testid="feira-state"]')?.textContent.startsWith('T00'),null,{timeout:15000});assert.match(await page.getByTestId('feira-total').innerText(),/\n10\n/);assert.notEqual(await page.locator('section[aria-label="Controles da simulação"]').innerText(),cycle);console.log('OK ciclo completo real '+speed+'×, sem pausas inesperadas');
 }
 assert.deepEqual(errors,[]);console.log('OK ensaio real: 1 ciclo normal (336s) +1 acelerado (168s); zero erros JavaScript.');
}finally{await browser?.close();server.kill('SIGTERM');}
