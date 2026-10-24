import {randomUUID,randomBytes,timingSafeEqual,randomInt} from 'node:crypto';
import {EXTENDED_SEQUENCE} from '../src/feira/data/index.js';
import {createFeiraClock} from '../src/feira/temporalState.js';
import {selectFeira} from '../src/feira/selectors.js';
import {PROTOCOL_VERSION} from '../src/feira/sync/protocol.js';
export class SessionError extends Error{constructor(status,message){super(message);this.status=status;}}
const requireThat=(condition,status,message)=>{if(!condition)throw new SessionError(status,message);};
export const SUPERVISOR_SESSION_MS=6*60*60*1000;
const monotonicNow=()=>performance.now();
const secret=()=>randomBytes(24).toString('base64url');
function equal(a,b){if(typeof a!=='string'||typeof b!=='string')return false;const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);}
export function createSession({now=monotonicNow,wallNow=now===monotonicNow?Date.now:now,clockOptions={},maintenance=true,appVersion='local',leaseMs=6000,lockMs=15000,sequence=EXTENDED_SEQUENCE}={}){
 const sessionId=randomUUID(),adminCode=secret(),viewerCode=String(randomInt(100000,1000000)),created=now();
 const clock=createFeiraClock({sequence,...clockOptions,now,wallNow,maxElapsed:5000});clock.dispatch({type:'pause',reason:'manual'});
 const clients=new Map(),listeners=new Set(),commands=new Map(),history=new Map(),locks=new Map();let controller=null,revision=0,current,stopped=false,signature='',hasStarted=false,commandInProgress=false;
 const publicLocks=()=>[...locks.values()].map(({id,clientId,tabId,callId})=>({id,clientId,tabId,callId}));
 function semantic(){const s=clock.getState();return JSON.stringify([s.phase,s.cycle,s.speed,s.pauses,publicLocks(),controller&&[controller.clientId,controller.tabId]]);}
 function publish(){
  if(stopped)return;
  const state=clock.getState(),view=selectFeira(state);revision++;
  current={protocolVersion:PROTOCOL_VERSION,sessionId,serverInstanceId:sessionId,revision,appVersion,datasetVersion:view.metadata.sourceSha256,state,view,locks:publicLocks(),controller:controller?{clientId:controller.clientId,tabId:controller.tabId}:null,
   playback:{started:hasStarted,status:state.pauses.length?'paused':'running',speed:state.speed,remainingSimulatedMs:state.remaining,remainingWallMs:state.remaining/state.speed},sentAt:new Date().toISOString()};
  signature=semantic();history.set(revision,signature);if(history.size>120)history.delete(history.keys().next().value);
  for(const fn of listeners)fn(current);
 }
 const unsubscribe=clock.subscribe(()=>{if(!commandInProgress&&semantic()!==signature)publish();});publish();clock.start();
 // The lease owns administrative commands, never the lifetime of playback.
 function expireController(){if(controller&&now()-controller.seen>leaseMs){controller=null;return true;}return false;}
 function maintain(){
  if(stopped)return;
  expireController();
  let expired=false;for(const [id,lock] of locks)if(now()-lock.seen>lockMs){locks.delete(id);expired=true;}
  if(expired){clock.dispatch({type:'pause',reason:'manual'});if(!locks.size)clock.dispatch({type:'close-detail'});}
  for(const [id,entry] of commands)if(now()-entry.time>600000)commands.delete(id);
  publish();
 }
 const timer=maintenance?setInterval(maintain,1000):null;
 function pair(code){
  requireThat(now()-created<1800000,401,'Código expirado. Reinicie o serviço para novo pareamento.');
  const role=equal(code,adminCode)?'controller':equal(code,viewerCode)?'viewer':null;
  requireThat(role,401,'Código de acesso inválido');for(const [token,client] of clients)if(client.expiresAt!==null&&now()>=client.expiresAt)clients.delete(token);
  requireThat(clients.size<48,429,'Limite de sessões de navegador atingido');
  const token=secret(),client={id:randomUUID(),role,csrf:secret(),expiresAt:role==='viewer'?now()+SUPERVISOR_SESSION_MS:null};clients.set(token,client);return {token,client};
 }
 function validateClient(client){requireThat(client&&[...clients.values()].includes(client),401,'Sessão encerrada ou revogada. Faça novo pareamento.');requireThat(client.expiresAt===null||now()<client.expiresAt,401,'Sessão Supervisor expirada após seis horas. Faça novo pareamento.');return client;}
 function authenticate(token){return validateClient(clients.get(token));}
 function authorize(client,body){validateClient(client);requireThat(body.sessionId===sessionId,409,'Sessão obsoleta; conecte novamente');requireThat(equal(body.csrf,client.csrf),403,'Proteção de comando inválida');requireThat(typeof body.tabId==='string'&&/^[a-f0-9-]{36}$/i.test(body.tabId),400,'Aba inválida');}
 function bootstrap(client){validateClient(client);return {identity:{id:client.id,role:client.role},csrf:client.csrf,state:current};}
 function execute(client,body){
  authorize(client,body);if(expireController())publish();requireThat(typeof body.commandId==='string'&&/^[a-f0-9-]{36}$/i.test(body.commandId),400,'ID de comando inválido');
  const key=client.id+':'+body.commandId,cached=commands.get(key);if(cached){requireThat(cached.intent===JSON.stringify([body.action,body.args,body.tabId]),409,'ID de comando reutilizado para outra intenção');return cached.result;}
  const action=body.action,args=body.args??{},administrative=['acquire','start','resume','pause','restart','speed','release','revoke-session'];
  requireThat([...administrative,'heartbeat','open-detail','close-detail'].includes(action),400,'Operação desconhecida');
  if(administrative.includes(action))requireThat(client.role==='controller',403,'Controle exclusivo do notebook');
  if(!['acquire','heartbeat','release'].includes(action))requireThat(Number.isSafeInteger(body.baseRevision)&&history.get(body.baseRevision)===semantic(),409,'Estado mudou; confira a referência atual e tente novamente');
  const owns=()=>controller?.clientId===client.id&&controller?.tabId===body.tabId;
  if(administrative.includes(action)&&action!=='acquire')requireThat(owns(),403,'Esta aba não detém o controle');
  commandInProgress=true;
  try{switch(action){
   case 'acquire':requireThat(!controller||owns(),409,'Controle em outra aba; aguarde sua liberação');controller={clientId:client.id,tabId:body.tabId,seen:now()};break;
   case 'heartbeat':if(owns())controller.seen=now();for(const lock of locks.values())if(lock.clientId===client.id&&lock.tabId===body.tabId)lock.seen=now();break;
   case 'release':controller=null;break;
   case 'start':case 'resume':requireThat(locks.size===0,409,'Há detalhe aberto; feche ou reinicie o ciclo');hasStarted=true;clock.dispatch({type:'resume'});break;
   case 'pause':clock.dispatch({type:'pause',reason:'manual'});break;
   case 'restart':hasStarted=true;locks.clear();clock.dispatch({type:'restart'});break;
   case 'speed':requireThat([1,2].includes(args.value),400,'Velocidade inválida');clock.dispatch({type:'speed',value:args.value});break;
   case 'revoke-session':{const entry=[...clients].find(([,value])=>value.id===args.clientId);requireThat(entry&&entry[1].role==='viewer',400,'Sessão Supervisor não encontrada');clients.delete(entry[0]);break;}
   // Compatibility ACK for older clients: reads never lock or pause the operation.
   case 'open-detail':requireThat(current.view.rows.some(r=>r.ID_Chamado===args.callId),400,'Chamado não disponível nesta referência');break;
   case 'close-detail':break;
  }
  }finally{commandInProgress=false;}
  if(!['heartbeat','open-detail','close-detail'].includes(action))publish();
  const result={accepted:true,commandId:body.commandId,appliedRevision:current.revision,state:current};
  commands.set(key,{time:now(),intent:JSON.stringify([body.action,body.args,body.tabId]),result});if(commands.size>1000)commands.delete(commands.keys().next().value);
  return result;
 }
 return {sessionId,adminCode,viewerCode,pair,authenticate,authorize,bootstrap,execute,maintain,getState:()=>current,
  subscribe(fn){listeners.add(fn);return ()=>listeners.delete(fn);},
  close(){if(stopped)return;stopped=true;if(timer)clearInterval(timer);unsubscribe();clock.stop();listeners.clear();clients.clear();commands.clear();},
 };
}
