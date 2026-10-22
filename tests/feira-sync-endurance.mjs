// Ensaio real de serviço compilado com dois clientes; não substitui teste físico LAN.
import {createRequire} from 'node:module';import assert from 'node:assert/strict';import {createFeiraServer} from '../server/feira-server.mjs';
const require=createRequire(import.meta.url),{chromium}=require('/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const app=await createFeiraServer({port:0,dist:process.env.ORQUESTRA_TEST_DIST||'/tmp/orquestra-c91/delivery'});let browser;
try{browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});const a=await browser.newContext({viewport:{width:1366,height:768}}),b=await browser.newContext({viewport:{width:390,height:844}}),desktop=await a.newPage(),mobile=await b.newPage(),errors=[];for(const p of [desktop,mobile])p.on('pageerror',e=>errors.push(e.message));
 async function pair(page,mode,code){await page.goto(app.origin+'/OrquestraNEXT/?modo='+mode);await page.getByLabel('Código de acesso',{exact:true}).fill(code);await page.getByRole('button',{name:'Conectar',exact:true}).click();await page.getByTestId('sync-connection').getByText('Sincronizado',{exact:true}).waitFor();}
 await pair(desktop,'feira',app.session.adminCode);await desktop.getByRole('button',{name:'Assumir controle',exact:true}).click();await pair(mobile,'supervisor-feira',app.session.viewerCode);
 const speeds=(process.env.ORQUESTRA_ENDURANCE_SPEEDS??'1,2').split(',').map(Number);assert.ok(speeds.length&&speeds.every(s=>[1,2].includes(s)));
 for(const speed of speeds){
  if(speed===1)await desktop.getByRole('button',{name:'Iniciar',exact:true}).click();else{await desktop.getByLabel('Velocidade da sessão').selectOption('2');await desktop.getByRole('button',{name:'Reiniciar',exact:true}).click();}
  for(const [phase,total] of [16,24,27,30,34,37,41,44,48,51,55].map((total,i)=>[i+1,total])){await mobile.waitForFunction(phase=>document.querySelector('[data-testid="mobile-moment"]')?.textContent.startsWith('T'+String(phase).padStart(2,'0')),phase,{timeout:55000});assert.equal(app.session.getState().view.summary.total,total);console.log('Serviço real '+speed+'×: T'+phase+', '+total+' registros, dois clientes.');}
  await mobile.waitForFunction(()=>document.querySelector('[data-testid="mobile-moment"]')?.textContent.startsWith('T00'),null,{timeout:60000});assert.equal(app.session.getState().view.summary.total,10);console.log('OK ciclo sincronizado real '+speed+'×; retorno T00 sem pausa inesperada.');
 }
 assert.deepEqual(errors,[]);console.log('OK ciclos reais '+speeds.join(',')+'× (336s/velocidade), lease/heartbeat/SSE/POST, sem erros JS. Validação física pendente.');
}finally{await browser?.close();await app.close();}
