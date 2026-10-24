import http from 'node:http';import {readFile,realpath,stat} from 'node:fs/promises';import {resolve,sep,extname} from 'node:path';import {fileURLToPath} from 'node:url';import {createHash} from 'node:crypto';import {networkInterfaces} from 'node:os';
import {createSession,SessionError} from './feira-session.mjs';
const BASE='/OrquestraNEXT',ROOT=fileURLToPath(new URL('../',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.woff2':'font/woff2'};
export async function createFeiraServer({host='127.0.0.1',port=5180,dist=resolve(ROOT,'dist'),session:providedSession}={}){
 const root=await realpath(dist),index=await readFile(resolve(root,'index.html'),'utf8');
 const entry=index.match(/<script[^>]*src="([^"]+)"/i)?.[1];
 if(!entry||!entry.startsWith(BASE+'/assets/'))throw Error('Build inválido. Execute npm run build antes de iniciar.');
 const entryPath=await realpath(resolve(root,entry.slice(BASE.length+1)));
 if(!entryPath.startsWith(root+sep)||!(await readFile(entryPath,'utf8')).includes('__ORQUESTRA_SYNC__'))throw Error('Build sem C9.1. Execute npm run build antes de iniciar.');
 const session=providedSession??createSession({appVersion:createHash('sha256').update(index).digest('hex').slice(0,16)});
 let lastState,lastFrame;const metrics={frames:0,payloadBytes:0,slowReplacements:0,maxPendingPerStream:0,authorizationErrors:0};
 const streams=new Set(),buckets=new Map(),pairFailures=new Map();let origin;
 function json(res,status,value){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));}
 async function body(req){
  if(!req.headers['content-type']?.startsWith('application/json'))throw new SessionError(415,'JSON obrigatório');
  let text='';for await(const part of req){text+=part;if(Buffer.byteLength(text)>8192)throw new SessionError(413,'Requisição muito grande');}
  try{const value=JSON.parse(text);if(!value||typeof value!=='object'||Array.isArray(value))throw Error();return value;}catch{throw new SessionError(400,'JSON inválido');}
 }
 function rate(req,id=req.socket.remoteAddress){let b=buckets.get(id);if(!b||Date.now()-b.at>60000)b={at:Date.now(),count:0};b.count++;buckets.set(id,b);if(buckets.size>128)buckets.delete(buckets.keys().next().value);if(b.count>200)throw new SessionError(429,'Muitas requisições; aguarde um minuto');}
 const server=http.createServer(async(req,res)=>{
  let client;
  try{
   res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'");
   if(req.headers.host!==new URL(origin).host)throw new SessionError(403,'Host não permitido');
   if(req.headers.origin&&req.headers.origin!==origin)throw new SessionError(403,'Origem não permitida');
   const url=new URL(req.url,origin);
   if(req.method==='POST'&&req.headers.origin!==origin)throw new SessionError(403,'Origem do comando obrigatória');
   if(url.pathname.startsWith(BASE+'/api/')){
    res.setHeader('Cache-Control','no-store');
    if(url.pathname===BASE+'/api/pair'&&req.method==='POST'){
     rate(req);const input=await body(req),ip=req.socket.remoteAddress;let attempt=pairFailures.get(ip);if(!attempt||Date.now()-attempt.at>60000)attempt={at:Date.now(),count:0};if(attempt.count>=5)throw new SessionError(429,'Muitas tentativas de código; aguarde um minuto');let paired;try{paired=session.pair(input.code);}catch(error){attempt.count++;pairFailures.set(ip,attempt);throw error;}
     res.setHeader('Set-Cookie',`orquestra_feira=${paired.token}; HttpOnly; SameSite=Strict; Path=${BASE}/api/${paired.client.role==='viewer'?'; Max-Age=21600':''}`);
     return json(res,200,{paired:true});
    }
    const token=req.headers.cookie?.split(';').map(s=>s.trim()).find(s=>s.startsWith('orquestra_feira='))?.slice('orquestra_feira='.length);
    client=session.authenticate(token);
    if(req.method==='POST')rate(req,client.id);
    if(req.method==='GET'&&url.pathname===BASE+'/api/bootstrap')return json(res,200,session.bootstrap(client));
    if(req.method==='GET'&&url.pathname===BASE+'/api/state')return json(res,200,session.getState());
    if(req.method==='POST'&&url.pathname===BASE+'/api/commands')return json(res,200,session.execute(client,await body(req)));
    if(req.method==='GET'&&url.pathname===BASE+'/api/events'){
     if(streams.size>=48||[...streams].filter(s=>s.clientId===client.id).length>=4)throw new SessionError(429,'Limite de conexões SSE');
     res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-store','Connection':'keep-alive','X-Accel-Buffering':'no'});
     res.write('retry: 1000\n\n');
     const stream={clientId:client.id,res,pending:false};streams.add(stream);
     // Um estado pendente substitui o anterior enquanto o socket está ocupado.
     // DTOs completos maiores (55 chamados) não provocam filas/reconexões em rajadas.
     let blocked=false,pending=null;
     const send=state=>{
      if(res.destroyed)return;
      try{session.authenticate(token);}catch{res.end();return;}
      if(blocked){if(pending)metrics.slowReplacements++;pending=state;stream.pending=true;metrics.maxPendingPerStream=1;return;}
      if(lastState!==state){lastState=state;lastFrame=`id: ${state.sessionId}:${state.revision}\nevent: state\ndata: ${JSON.stringify(state)}\n\n`;metrics.frames++;metrics.payloadBytes=Buffer.byteLength(lastFrame);}
      blocked=!res.write(lastFrame);
     };
     res.on('drain',()=>{blocked=false;if(pending){const latest=pending;pending=null;stream.pending=false;send(latest);}});
     send(session.getState());const unsubscribe=session.subscribe(send);
     res.on('close',()=>{unsubscribe();streams.delete(stream);});return;
    }
    throw new SessionError(404,'Endpoint não disponível');
   }
   if(req.method!=='GET'&&req.method!=='HEAD')throw new SessionError(405,'Método não permitido');
   if(url.pathname===BASE){res.writeHead(302,{Location:BASE+'/'+url.search});return res.end();}
   if(url.pathname===BASE+'/local-config.js'){res.writeHead(200,{'Content-Type':'text/javascript','Cache-Control':'no-store'});return res.end('window.__ORQUESTRA_SYNC__ = true;');}
   if(!url.pathname.startsWith(BASE+'/'))throw new SessionError(404,'Página não encontrada');
   const relative=decodeURIComponent(url.pathname.slice(BASE.length+1)),path=await realpath(resolve(root,relative||'index.html'));
   if(!path.startsWith(root+sep)||!(await stat(path)).isFile())throw new SessionError(404,'Arquivo não permitido');
   let content=await readFile(path);
   if(path===resolve(root,'index.html'))content=Buffer.from(index.replace('</head>',`<script src="${BASE}/local-config.js"></script></head>`));
   res.writeHead(200,{'Content-Type':mime[extname(path)]??'application/octet-stream','Cache-Control':extname(path)==='.html'?'no-store':'public, max-age=3600'});res.end(req.method==='HEAD'?undefined:content);
  }catch(error){if(error.status===401||error.status===403)metrics.authorizationErrors++;if(!res.headersSent)json(res,error.status??(error.code==='ENOENT'?404:500),{error:error.status?error.message:error.code==='ENOENT'?'Arquivo não encontrado':'Falha no serviço local',...(client?{state:session.getState()}: {})});else res.destroy();}
 });
 server.requestTimeout=10000;server.headersTimeout=10000;server.maxHeadersCount=40;
 try{await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,host,resolve);});}catch(error){session.close();throw error;}
 const address=server.address();origin=`http://${host}:${address.port}`;
 return {server,session,origin,diagnostics:()=>({...metrics,streams:streams.size,pending:[...streams].filter(stream=>stream.pending).length}),async close(){session.close();for(const {res}of streams)res.end();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2),option=(name,fallback)=>{const i=args.indexOf(name);return i<0?fallback:args[i+1];};
 if(args.includes('--list-addresses')){try{for(const [name,addresses] of Object.entries(networkInterfaces()))for(const a of addresses??[])if(a.family==='IPv4')console.log(name,a.address);}catch{console.error('Não foi possível listar interfaces neste ambiente. Consulte o IP nas configurações de rede e informe --host explicitamente.');process.exitCode=1;}}
 else{
  try{
   const host=option('--host','127.0.0.1'),port=Number(option('--port','5180'));
   if(!/^(?:\d{1,3}\.){3}\d{1,3}$/.test(host)||host==='0.0.0.0'||!Number.isInteger(port)||port<1024||port>65535)throw Error('Use um IP IPv4 específico e porta entre 1024 e 65535');
   const app=await createFeiraServer({host,port,dist:resolve(option('--dist','dist'))});
   console.log(`BackOffice local: ${app.origin}${BASE}/?modo=feira&sessao=${app.session.sessionId}`);
   console.log(`Supervisor local: ${app.origin}${BASE}/?modo=supervisor-feira&sessao=${app.session.sessionId}`);
   console.log('Código ADMIN (somente operador):',app.session.adminCode);console.log('Código SUPERVISOR (pareamento por 30 min):',app.session.viewerCode);
   console.log('Sessão nova T00 pausada. HTTP local; use rede dedicada. Ctrl+C encerra.');
   let closing=false;const stop=async()=>{if(closing)return;closing=true;await app.close();process.exitCode=0;};process.on('SIGINT',stop);process.on('SIGTERM',stop);
  }catch(error){console.error('Não foi possível iniciar:',error.message);process.exitCode=1;}
 }
}
