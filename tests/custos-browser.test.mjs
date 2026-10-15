import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {DEFAULT_STATE,selectView} from '../src/platform/services/chamados.js';
import {costAnalysis,costGroups,costCalls,costTablePage} from '../src/platform/services/custos.js';
import {currencyLabel} from '../src/platform/services/performance.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.ORQUESTRA_PLAYWRIGHT||'/home/p2dutra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base='http://127.0.0.1:5201/OrquestraNEXT/',dist=process.env.ORQUESTRA_TEST_DIST||'/tmp/orquestra-c5/dist',evidence='/tmp/orquestra-c5/evidence';mkdirSync(evidence,{recursive:true});
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','5201','--strictPort','--outDir',dist],{stdio:'pipe'});
let log='',browser;server.stdout.on('data',d=>log+=d);server.stderr.on('data',d=>log+=d);
async function poll(fn){for(let i=0;i<200;i++){if(await fn())return;await new Promise(r=>setTimeout(r,40));}throw Error('Condição não atingida');}
try{
 await poll(async()=>{try{return(await fetch(base)).ok;}catch{return false;}});assert.equal(server.exitCode,null,log);
 browser=await chromium.launch({executablePath:process.env.ORQUESTRA_CHROME||'/usr/bin/google-chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1366,height:768},timezoneId:'Asia/Tokyo'});await context.addInitScript(()=>sessionStorage.setItem('orquestra.platform.demo','active'));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const nav=()=>page.getByRole('navigation',{name:'Menu principal'}),total=async()=>Number(await page.getByTestId('costs-total').innerText());
 const close=()=>page.getByRole('button',{name:'Fechar diálogo',exact:true}).last().click();
 const card=title=>page.getByTestId('kpi-'+title).locator('strong').innerText();
 const table=()=>page.getByRole('table',{name:'Tabela de análise de custos'});
 const choose=async(label,values)=>{await page.getByRole('button',{name:new RegExp('^'+label+':')}).click();for(const name of values)await page.getByRole('group',{name:'Opções de '+label,exact:true}).getByRole('checkbox',{name,exact:true}).check();await page.getByRole('heading',{name:'Custos / TCO',exact:true,level:1}).click();};
 const view=selectView(DEFAULT_STATE),data=costAnalysis(view.records,view.period);
 await page.goto(base+'?modo=plataforma#/custos-tco');await page.getByTestId('costs-total').waitFor();
 await test('C5 cinco cards conciliam custos média técnicos recorrentes e pressão',async()=>{
  assert.equal(await total(),736);assert.equal(await card('Custo operacional estimado'),currencyLabel(data.cost.value));assert.equal(await card('Custo médio estimado por chamado'),currencyLabel(data.mean.value));assert.equal(await card('Custo estimado associado a técnicos'),currencyLabel(data.technicianCost.value));assert.equal(await card('Custo estimado associado a recorrências'),currencyLabel(data.recurrentCost.value));assert.equal(await card('Contratos sob pressão operacional'),'12');
  const boxes=await page.getByTestId(/^kpi-/).evaluateAll(es=>es.map(e=>e.getBoundingClientRect().bottom));assert.equal(boxes.length,5);assert.ok(boxes.every(b=>b<=768));await page.screenshot({path:evidence+'/custos-desktop.png'});
 });
 await test('C5 TCO e composição são EXT sem parcelas ou números financeiros fictícios',async()=>{
  for(const title of ['TCO contábil completo','Composição contábil indisponível']){const ext=page.getByTestId('ext-'+title);assert.match(await ext.innerText(),/EXT/);assert.doesNotMatch(await ext.innerText(),/R\$|\d%/);await ext.getByRole('button').click();assert.match(await page.getByRole('dialog').innerText(),/Não conectada|não conectada/);await close();}
  assert.match(await page.getByRole('region',{name:'Composição financeira de custos',exact:true}).innerText(),/Mão de obra|Peças|Terceiros/);
  await page.getByRole('button',{name:'Sobre Custo estimado associado a técnicos',exact:true}).click();assert.match(await page.getByRole('dialog').innerText(),/Não é remuneração/);await close();
 });
 await test('C5 agrupamentos por contrato área técnico equipamento categoria e componente sincronizam',async()=>{
  const region=page.getByRole('region',{name:'Distribuição dos custos estimados',exact:true}),select=page.getByRole('combobox',{name:'Agrupar custos por',exact:true});
  for(const field of ['Contrato','Área','Técnico','Unidade','Categoria do Chamado','Componente Principal']){await select.selectOption(field);const expected=costGroups(view.records,field);const buttons=region.getByRole('button',{name:new RegExp('^Custo por '+field+' ·')});assert.equal(await buttons.count(),expected.length);assert.match(await buttons.first().innerText(),new RegExp(expected[0].label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));await buttons.first().click();const dialog=page.getByRole('dialog').last();assert.match(await dialog.innerText(),new RegExp(expected[0].count+' chamados no contexto'));assert.equal(await dialog.getByTestId('kpi-Custo operacional estimado').locator('strong').innerText(),currencyLabel(expected[0].cost.value));await close();}
  await select.selectOption('Contrato');
 });
 await test('C5 tabela alterna contratos/chamados ordena média e pagina antes de navegar',async()=>{
  await page.getByRole('button',{name:'Ordenar por Custo médio',exact:true}).click();const expected=costTablePage(data.groups,{sort:'mean',direction:'asc'});assert.match(await table().locator('tbody tr').first().innerText(),new RegExp(expected.rows[0].label));
  await page.getByRole('button',{name:'Próxima página',exact:true}).click();assert.equal(await table().locator('tbody tr').count(),2);const before=await table().locator('tbody tr').allTextContents();await nav().getByRole('link',{name:'Contratos & Margem',exact:true}).click();await page.getByTestId('contracts-total').waitFor();await nav().getByRole('link',{name:'Custos / TCO',exact:true}).click();await table().waitFor();assert.deepEqual(await table().locator('tbody tr').allTextContents(),before);
  await page.getByRole('combobox',{name:'Tipo de análise de custos',exact:true}).selectOption('calls');await page.getByRole('button',{name:'Abrir chamado de custo CH-20261001-0661',exact:true}).waitFor();assert.equal(await table().locator('tbody tr').count(),10);await page.getByRole('button',{name:'Próxima página',exact:true}).click();const page2=costTablePage(costCalls(view.records),{sort:'cost',direction:'desc',page:2});assert.match(await table().locator('tbody tr').first().innerText(),new RegExp(page2.rows[0].label));await page.getByRole('combobox',{name:'Registros por página',exact:true}).selectOption('25');assert.equal(await table().locator('tbody tr').count(),25);await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();
 });
 await test('C5 custo → desvio SLA → contrato → equipamento → chamado → insight e retorno',async()=>{
  await page.getByRole('button',{name:'Explorar 736 chamados',exact:true}).first().click();const costRoot=page.getByRole('dialog').last();await costRoot.getByRole('button',{name:'Examinar desvios de SLA deste contexto (59)',exact:true}).click();const first=page.getByRole('dialog').last();assert.match(await first.innerText(),/59 chamados no contexto/);await first.screenshot({path:evidence+'/custos-desvios.png'});
  await first.getByRole('button',{name:/^Aprofundar Contrato ·/}).first().click();const contract=page.getByRole('dialog').last();assert.match(await contract.innerText(),/Contrato CT-/);await contract.getByRole('button',{name:/^Aprofundar Unidade ·/}).first().click();const equipment=page.getByRole('dialog').last();assert.match(await equipment.innerText(),/Equipamento /);
  const records=equipment.getByRole('table',{name:'Chamados da análise de custos'}),id=await records.locator('tbody tr').first().locator('td').first().innerText();await records.getByRole('button',{name:id,exact:true}).click();const detail=page.getByRole('dialog').last();assert.match(await detail.innerText(),new RegExp(id));assert.match(await detail.innerText(),/Insight/);await close();await equipment.getByText('Insights sintéticos fornecidos · BASE',{exact:true}).click();assert.match(await equipment.innerText(),/Associações históricas/);await close();await contract.waitFor();await close();await first.waitFor();await close();await costRoot.waitFor();await close();assert.equal(await total(),736);
 });
 await test('C5 recorrência e série diária levam ao conjunto de suporte',async()=>{
  await page.getByRole('region',{name:'Custos por recorrência informada',exact:true}).getByRole('button',{name:/^Custos por recorrência · Recorrentes/}).click();assert.match(await page.getByRole('dialog').innerText(),/412 chamados no contexto/);await close();
  await page.getByRole('button',{name:/^Custo operacional diário em 06\/10\/2026/}).click();assert.match(await page.getByRole('dialog').innerText(),/14 chamados no contexto/);await close();
  await page.getByRole('button',{name:'Ver pares de TA',exact:true}).click();assert.match(await page.getByRole('dialog').innerText(),/728 chamados no contexto/);await close();await page.getByRole('button',{name:'Ver pares de TB',exact:true}).click();assert.match(await page.getByRole('dialog').innerText(),/724 chamados no contexto/);await close();
 });
 await test('C5 filtros AND/OR busca e contexto conservados entre seis páginas',async()=>{
  await page.getByLabel('Período',{exact:true}).selectOption('7');await choose('Área',['SP-Sul']);await choose('Criticidade',['Laranja','Vermelho']);const s={...DEFAULT_STATE,days:7,filters:{Área:['SP-Sul'],Criticidade_ORQUESTRA:['Laranja','Vermelho']}};const v=selectView(s),a=costAnalysis(v.records,v.period);assert.ok(a.count>0);assert.equal(await total(),a.count);assert.equal(await card('Custo operacional estimado'),currencyLabel(a.cost.value));assert.equal(await card('Custo médio estimado por chamado'),currencyLabel(a.mean.value));
  await nav().getByRole('link',{name:'Visão Geral',exact:true}).click();assert.equal(Number(await page.getByTestId('performance-total').innerText()),a.count);await nav().getByRole('link',{name:'Contratos & Margem',exact:true}).click();assert.equal(Number(await page.getByTestId('contracts-total').innerText()),a.count);await nav().getByRole('link',{name:'Custos / TCO',exact:true}).click();await page.getByTestId('costs-total').waitFor();assert.equal(await total(),a.count);
  await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();await page.getByRole('searchbox',{name:'Buscar chamados'}).fill('CT-2026-007');await poll(async()=>await total()===90);assert.equal(await table().locator('tbody tr').count(),1);await page.getByRole('button',{name:'Remover Busca: CT-2026-007',exact:true}).click();await poll(async()=>await total()===736);
 });
 await test('C5 explicações por teclado mostram origem fórmula cobertura nulos e período',async()=>{
  const infos=page.getByRole('button',{name:/^Sobre /});assert.equal(await infos.count(),19);
  for(let i=0;i<await infos.count();i++){await infos.nth(i).focus();await page.keyboard.press('Enter');const text=await page.getByRole('dialog').innerText();for(const marker of ['Campos de origem','Regra de cálculo','População considerada','Período de criação','Valores ausentes','Unidade','Fonte e referência'])assert.ok(text.includes(marker));await page.keyboard.press('Escape');}
 });
 await test('C5 vazio e não concluídos mantêm resultados indisponíveis sem fabricação',async()=>{
  await page.getByRole('searchbox',{name:'Buscar chamados'}).fill('nenhum-c5-xyz');await poll(async()=>await total()===0);assert.equal(await card('Custo operacional estimado'),'—');assert.equal(await card('Custo médio estimado por chamado'),'—');assert.equal(await card('Custo estimado associado a recorrências'),'—');await page.getByText('Nenhum registro encontrado',{exact:true}).waitFor();assert.doesNotMatch(await page.locator('main').innerText(),/NaN|Infinity/);
  await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();await choose('Status',['Aberto']);await page.getByRole('button',{name:/^Abrir análise de custo /}).first().click();assert.equal(await page.getByRole('dialog').getByTestId('kpi-Aderência ao SLA simulado').locator('strong').innerText(),'—');await close();await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();
 });
 await test('C5 notebook/móvel offline carregado e custo alto individual sem erro',async()=>{
  await context.setOffline(true);await page.getByLabel('Período',{exact:true}).selectOption('1');assert.equal(await total(),14);await page.getByRole('button',{name:/^Abrir análise de custo /}).first().click();await close();await context.setOffline(false);await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.getByRole('region',{name:'Distribuição dos custos estimados',exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:evidence+'/custos-analises.png'});
  await page.getByRole('combobox',{name:'Tipo de análise de custos',exact:true}).selectOption('calls');await page.getByRole('button',{name:'Abrir chamado de custo CH-20261001-0661',exact:true}).click();assert.match(await page.getByRole('dialog').innerText(),/CH-20261001-0661/);await close();
  await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.locator('main').evaluate(el=>el.scrollTop=0);await page.screenshot({path:evidence+'/custos-mobile.png'});await page.getByRole('combobox',{name:'Tipo de análise de custos',exact:true}).selectOption('contracts');await page.getByRole('button',{name:/^Abrir análise de custo /}).first().click();assert.ok(await page.getByRole('dialog').evaluate(el=>el.scrollWidth<=el.clientWidth+1));await close();assert.deepEqual(errors,[]);
 });
}finally{await browser?.close();server.kill('SIGTERM');}
