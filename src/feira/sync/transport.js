import {acceptState,uuid} from './protocol.js';
// Timers deste cliente medem conectividade/lease; nunca avançam snapshots ou SLA.
export function createSyncClient({base,fetcher=(...args)=>fetch(...args),events=url=>new EventSource(url),now=()=>performance.now()}={}){
 let value={connection:'connecting',data:null,identity:null,error:null,resyncId:0,recovered:false},csrf=null,stream=null,watch=null,retry=null,active=false,epoch=0,failures=0,lastMessage=0,queue=Promise.resolve(),heartbeatPending=false,pinnedVersion=null,pinnedDataset=null,recoveryTimer=null,wasDisconnected=false;
 const tabId=uuid(),listeners=new Set(),aborts=new Set();
 const update=patch=>{value={...value,...patch};listeners.forEach(fn=>fn());};
 async function request(path,body){
  const abort=new AbortController();aborts.add(abort);const timeout=setTimeout(()=>abort.abort(),5000);
  try{const response=await fetcher(base+path,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined,cache:'no-store',credentials:'same-origin',signal:abort.signal});if(!response.headers.get('content-type')?.includes('application/json'))throw Error('Serviço local de sincronização indisponível nesta origem');const data=await response.json();if(!response.ok){const error=new Error(data.error??'Falha na comunicação');error.status=response.status;error.state=data.state;throw error;}return data;}finally{clearTimeout(timeout);aborts.delete(abort);}
 }
 function apply(state){const data=acceptState(value.data,state);if(data!==value.data)update({data});}
 function disconnect(message){epoch++;stream?.close();stream=null;if(!active)return;wasDisconnected=!!value.data;update({recovered:false,connection:'offline',error:message??'Sem sincronização. Último estado recebido congelado.'});if(retry===null)retry=setTimeout(()=>{retry=null;connect();},Math.min(10000,1000*2**Math.min(failures++,4))+Math.random()*250);}
 function command(action,args={}){
  const captured=epoch;
  const result=queue.catch(()=>{}).then(async()=>{
   if(!active||captured!==epoch||value.connection!=='online'||!value.data)throw Error('Sem sincronização; conecte antes de enviar comandos');
   try{const ack=await request('commands',{sessionId:value.data.sessionId,csrf,tabId,commandId:uuid(),baseRevision:value.data.revision,action,args});if(captured!==epoch||!active)throw Error('Conexão mudou; confirme o estado atual');apply(ack.state);update({error:null});return ack.state;
   }catch(error){if(captured===epoch&&active){if(error.state){try{apply(error.state);}catch{disconnect('A sessão mudou. Conecte novamente.');}}if(error.status===401){epoch++;update({connection:'pairing',identity:null,error:'Sessão expirada ou revogada. Faça novo pareamento.'});stream?.close();}else if(!error.status)disconnect(error.message);else update({error:error.message});}throw error;}
  });queue=result;return result;
 }
 async function connect(){
  if(!active)return;if(retry!==null){clearTimeout(retry);retry=null;}const current=++epoch;update({resyncId:value.resyncId+1});stream?.close();stream=null;update({connection:'connecting'});
  try{
   const boot=await request('bootstrap');if(!active||current!==epoch)return;if((pinnedVersion&&pinnedVersion!==boot.state.appVersion)||(pinnedDataset&&pinnedDataset!==boot.state.datasetVersion)){update({connection:'incompatible',error:'Versão mudou. Recarregue esta página antes de conectar.'});return;}pinnedVersion=boot.state.appVersion;pinnedDataset=boot.state.datasetVersion;
   if(value.data&&value.data.sessionId!==boot.state.sessionId){update({data:null,error:'Nova sessão. Confira o notebook antes de iniciar.'});}
   csrf=boot.csrf;lastMessage=now();apply(boot.state);update({identity:boot.identity,error:null});
   stream=events(base+'events');stream.addEventListener('state',event=>{if(!active||current!==epoch)return;try{apply(JSON.parse(event.data));lastMessage=now();failures=0;const recovered=wasDisconnected;wasDisconnected=false;update({connection:'online',...(recovered?{recovered:true}:{})});if(recovered){clearTimeout(recoveryTimer);recoveryTimer=setTimeout(()=>update({recovered:false}),4000);}}catch(error){disconnect(error.message);}});
   stream.onerror=()=>{if(active&&current===epoch)disconnect();};
  }catch(error){if(!active||current!==epoch)return;if(error.status===401)update({connection:'pairing',identity:null,error:value.data?'Sessão expirada, revogada ou serviço reiniciado. Faça novo pareamento.':null});else disconnect(error.message);}
 }
 function watchConnection(){
  if(['online','connecting'].includes(value.connection)&&stream&&now()-lastMessage>3500){disconnect('Heartbeat ausente. Último estado recebido congelado.');return;}
  if(value.connection==='online'&&!heartbeatPending){heartbeatPending=true;command('heartbeat').catch(()=>{}).finally(()=>{heartbeatPending=false;});}
 }
 return {tabId,getState:()=>value,subscribe(fn){listeners.add(fn);return ()=>listeners.delete(fn);},command,
  start(){if(active)return;active=true;connect();watch=setInterval(watchConnection,2000);},
  stop(){clearTimeout(recoveryTimer);active=false;epoch++;stream?.close();stream=null;if(watch)clearInterval(watch);watch=null;if(retry)clearTimeout(retry);retry=null;for(const abort of aborts)abort.abort();},
  async pair(code){await request('pair',{code});update({data:null,error:null});await connect();},
  reconnect(){if(active)connect();},
  async claim(){return command('acquire');},
  release(){if(!value.data||!csrf)return;const body={sessionId:value.data.sessionId,csrf,tabId,commandId:uuid(),baseRevision:value.data.revision,action:'release',args:{}};navigator.sendBeacon?.(base+'commands',new Blob([JSON.stringify(body)],{type:'application/json'}));},
 };
}
