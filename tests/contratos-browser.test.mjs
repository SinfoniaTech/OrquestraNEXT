import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {DEFAULT_STATE,selectView} from '../src/platform/services/chamados.js';
import {contractAnalysis,contractPage} from '../src/platform/services/contratos.js';
import {currencyLabel} from '../src/platform/services/performance.js';
import {percentLabel} from '../src/platform/services/sla.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.ORQUESTRA_PLAYWRIGHT||'/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base='http://127.0.0.1:5199/OrquestraNEXT/',dist=process.env.ORQUESTRA_TEST_DIST||'/tmp/orquestra-c4/dist',evidence='/tmp/orquestra-c4/evidence';mkdirSync(evidence,{recursive:true});
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','5199','--strictPort','--outDir',dist],{stdio:'pipe'});
let log='',browser;server.stdout.on('data',d=>log+=d);server.stderr.on('data',d=>log+=d);
async function poll(fn){for(let i=0;i<200;i++){if(await fn())return;await new Promise(r=>setTimeout(r,40));}throw Error('Condição não atingida');}
try{
 await poll(async()=>{try{return(await fetch(base)).ok;}catch{return false;}});assert.equal(server.exitCode,null,log);
 browser=await chromium.launch({executablePath:process.env.ORQUESTRA_CHROME||'/usr/bin/google-chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1366,height:768},timezoneId:'Asia/Tokyo'});await context.addInitScript(()=>sessionStorage.setItem('orquestra.platform.demo','active'));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const nav=()=>page.getByRole('navigation',{name:'Menu principal'}),total=async()=>Number(await page.getByTestId('contracts-total').innerText());
 const close=()=>page.getByRole('button',{name:'Fechar diálogo',exact:true}).last().click();
 const card=title=>page.getByTestId('kpi-'+title).locator('strong').innerText();
 const table=()=>page.getByRole('table',{name:'Tabela de contratos'});
 const choose=async(label,values)=>{await page.getByRole('button',{name:new RegExp('^'+label+':')}).click();for(const name of values)await page.getByRole('group',{name:'Opções de '+label,exact:true}).getByRole('checkbox',{name,exact:true}).check();await page.getByRole('heading',{name:'Contratos & Margem',exact:true,level:1}).click();};
 const view=selectView(DEFAULT_STATE),data=contractAnalysis(view.records,view.period);
 await page.goto(base+'?modo=plataforma#/contratos-margem');await page.getByTestId('contracts-total').waitFor();
 await test('C4 síntese reconcilia quatro cards e seis gráficos',async()=>{
  assert.equal(await total(),736);assert.equal(await card('Contratos com chamados'),'12');assert.equal(await card('Custo operacional estimado'),currencyLabel(data.cost.value));assert.equal(await card('Contratos sob pressão'),'12');assert.equal(await card('Recorrência operacional'),percentLabel(data.recurrence.value));
  assert.equal(await table().locator('tbody tr').count(),10);assert.equal(await page.getByRole('region',{name:'Custo estimado por contrato',exact:true}).getByRole('button',{name:/^Custo estimado por contrato ·/}).count(),12);
  for(const name of ['Volume por contrato','SLA simulado por contrato','Recorrência por categoria ou componente','Evolução do volume de chamados','Evolução dos custos estimados'])await page.getByRole('region',{name,exact:true}).waitFor();
  const boxes=await page.getByTestId(/^kpi-/).evaluateAll(els=>els.map(el=>el.getBoundingClientRect().bottom));assert.equal(boxes.length,4);assert.ok(boxes.every(b=>b<768));await page.screenshot({path:evidence+'/contratos-desktop.png'});
 });
 await test('C4 finanças EXT não possuem valores inventados',async()=>{
  for(const title of ['Receita contratada','Margem operacional','Rentabilidade','TCO completo']){const ext=page.getByTestId('ext-'+title);assert.match(await ext.innerText(),/EXT/);assert.match(await ext.innerText(),/Integração pendente/);assert.doesNotMatch(await ext.innerText(),/R\$|\d%/);await ext.getByRole('button').click();assert.match(await page.getByRole('dialog').innerText(),/Não conectada|não conectada/);await close();}
 });
 await test('C4 ordenação, paginação e contexto da carteira sobrevivem à navegação',async()=>{
  await page.getByRole('button',{name:'Ordenar por Custo estimado',exact:true}).click();
  const expected=contractPage(data.groups,{sort:'cost',direction:'asc'});assert.match(await table().locator('tbody tr').first().innerText(),new RegExp(expected.rows[0].label));
  await page.getByRole('button',{name:'Próxima página',exact:true}).click();assert.equal(await table().locator('tbody tr').count(),2);
  const ids=await table().locator('tbody tr').allTextContents();await nav().getByRole('link',{name:'Visão Geral',exact:true}).click();await page.getByTestId('performance-total').waitFor();await nav().getByRole('link',{name:'Contratos & Margem',exact:true}).click();await table().waitFor();assert.deepEqual(await table().locator('tbody tr').allTextContents(),ids);
  await page.getByRole('combobox',{name:'Registros por página',exact:true}).selectOption('25');assert.equal(await table().locator('tbody tr').count(),12);await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();
 });
 await test('C4 contrato → indicadores → equipamento → chamado preserva retornos',async()=>{
  await page.getByRole('button',{name:'Abrir contrato CT-2026-007',exact:true}).click();const contract=page.getByRole('dialog',{name:'Contrato CT-2026-007',exact:true});await contract.waitFor();assert.match(await contract.innerText(),/90 chamados/);assert.match(await contract.innerText(),/TA médio/);assert.match(await contract.innerText(),/TB médio/);
  await contract.getByRole('button',{name:'Sobre Aderência ao SLA simulado',exact:true}).click();assert.match(await page.getByRole('dialog',{name:'Aderência ao SLA simulado',exact:true}).innerText(),/90 chamados no recorte/);await close();
  const units=contract.getByRole('region',{name:'Equipamentos com chamados',exact:true});const unit=await units.locator('button').filter({hasText:/chamados/}).first().innerText();await units.locator('button').filter({hasText:/chamados/}).first().click();const equipment=page.getByRole('dialog',{name:/^Equipamento /});await equipment.waitFor();
  const records=equipment.getByRole('table',{name:'Chamados do equipamento'});const id=await records.locator('tbody tr').first().locator('td').first().innerText();await records.getByRole('button',{name:id,exact:true}).click();await page.getByRole('dialog').last().waitFor();assert.match(await page.getByRole('dialog').last().innerText(),new RegExp(id));await close();assert.ok((await equipment.innerText()).includes(unit.split('\n')[0]));await close();await contract.waitFor();
  await contract.getByRole('button',{name:'Examinar recorrentes',exact:true}).click();await page.getByRole('table',{name:'Chamados dos contratos'}).waitFor();await close();await contract.getByText('Insights sintéticos fornecidos · BASE',{exact:true}).click();assert.match(await contract.innerText(),/BASE/);await close();assert.equal(await total(),736);
 });
 await test('C4 cada gráfico e indicador leva a registros do suporte coerente',async()=>{
  const region=page.getByRole('region',{name:'Custo estimado por contrato',exact:true});await region.getByRole('button',{name:/CT-2026-007/}).click();assert.match(await page.getByRole('dialog').innerText(),/90 registros de suporte/);await close();
  await page.getByRole('region',{name:'SLA simulado por contrato',exact:true}).getByRole('button',{name:/CT-2026-007/}).click();assert.match(await page.getByRole('dialog').innerText(),/88 registros de suporte/);await close();
  const rec=page.getByRole('region',{name:'Recorrência por categoria ou componente',exact:true});await rec.getByRole('combobox').selectOption('Componente Principal');await rec.getByRole('button',{name:/^Proporção recorrente ·/}).first().click();await page.getByRole('table',{name:'Chamados dos contratos'}).waitFor();await close();
  await page.getByRole('button',{name:/^Volume contratual diário em 06\/10\/2026/}).click();assert.match(await page.getByRole('dialog').innerText(),/14 registros de suporte/);await close();
 });
 await test('C4 filtros AND/OR e busca sincronizam cards, tabela, gráficos e páginas anteriores',async()=>{
  await page.getByLabel('Período',{exact:true}).selectOption('7');await choose('Área',['SP-Sul']);await choose('Criticidade',['Laranja','Vermelho']);const s={...DEFAULT_STATE,days:7,filters:{Área:['SP-Sul'],Criticidade_ORQUESTRA:['Laranja','Vermelho']}};const v=selectView(s),a=contractAnalysis(v.records,v.period);assert.ok(a.count>0);assert.equal(await total(),a.count);assert.equal(await card('Custo operacional estimado'),currencyLabel(a.cost.value));
  assert.equal(await page.getByRole('region',{name:'Volume por contrato',exact:true}).getByRole('button',{name:/^Volume por contrato ·/}).count(),a.groups.length);
  await nav().getByRole('link',{name:'Chamados',exact:true}).click();assert.equal(await page.getByRole('searchbox',{name:'Buscar chamados'}).inputValue(),'');await nav().getByRole('link',{name:'Visão Geral',exact:true}).click();assert.equal(Number(await page.getByTestId('performance-total').innerText()),a.count);await nav().getByRole('link',{name:'Contratos & Margem',exact:true}).click();assert.equal(await total(),a.count);
  await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();await page.getByRole('searchbox',{name:'Buscar chamados'}).fill('hospital sao paulo');await poll(async()=>await total()===selectView({...DEFAULT_STATE,search:'hospital são paulo'}).summary.total);assert.equal(await table().locator('tbody tr').count(),1);
  await page.getByRole('searchbox',{name:'Buscar chamados'}).fill('CT-2026-007');await poll(async()=>await total()===90);assert.equal(await table().locator('tbody tr').count(),1);await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();
 });
 await test('C4 explicações acessíveis em cards, colunas, gráficos e insights',async()=>{
  const infos=page.getByRole('button',{name:/^Sobre /});assert.equal(await infos.count(),22);
  for(let i=0;i<await infos.count();i++){await infos.nth(i).focus();await page.keyboard.press('Enter');const text=await page.getByRole('dialog').innerText();for(const marker of ['Campos de origem','Regra de cálculo','População considerada','Período de criação','Valores ausentes','Unidade','Fonte e referência'])assert.ok(text.includes(marker));await page.keyboard.press('Escape');}
 });
 await test('C4 estado vazio e nenhum concluído não fabricam custos ou SLA',async()=>{
  await page.getByRole('searchbox',{name:'Buscar chamados'}).fill('nenhum-c4-xyz');await poll(async()=>await total()===0);assert.equal(await card('Custo operacional estimado'),'—');assert.equal(await card('Recorrência operacional'),'—');await page.getByText('Nenhum registro encontrado',{exact:true}).waitFor();assert.doesNotMatch(await page.locator('main').innerText(),/NaN|Infinity/);
  await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();await choose('Status',['Aberto']);await page.getByRole('button',{name:/^Abrir contrato /}).first().click();assert.equal(await page.getByRole('dialog').getByTestId('kpi-Aderência ao SLA simulado').locator('strong').innerText(),'—');await close();await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();
 });
 await test('C4 notebook/móvel e consulta offline carregada sem erro',async()=>{
  await context.setOffline(true);await page.getByLabel('Período',{exact:true}).selectOption('1');assert.equal(await total(),14);await page.getByRole('button',{name:/^Abrir contrato /}).first().click();await page.getByRole('dialog').waitFor();await close();await context.setOffline(false);await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.getByRole('region',{name:'Custo estimado por contrato',exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:evidence+'/contratos-analises.png'});
  await page.getByRole('button',{name:'Abrir contrato CT-2026-007',exact:true}).click();await page.screenshot({path:evidence+'/contratos-detalhe.png'});await close();
  await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.locator('main').evaluate(el=>el.scrollTop=0);await page.screenshot({path:evidence+'/contratos-mobile.png'});
  await page.getByRole('button',{name:/^Abrir contrato /}).first().click();assert.ok(await page.getByRole('dialog').evaluate(el=>el.scrollWidth<=el.clientWidth+1));await close();assert.deepEqual(errors,[]);
 });
}finally{await browser?.close();server.kill('SIGTERM');}
