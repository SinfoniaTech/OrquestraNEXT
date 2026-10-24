export const SOURCES = Object.freeze(['T0_Abertura', 'T1_Acompanhamento', 'T2_Desfecho']);
export const DURATIONS = Object.freeze([45000, 45000, 45000, 10000]);
export function initialState(sequence) {
 if(sequence&&(!Array.isArray(sequence.sources)||!sequence.sources.length||new Set(sequence.sources).size!==sequence.sources.length||!Array.isArray(sequence.durations)||sequence.durations.length!==sequence.sources.length+1||sequence.durations.some(ms=>!Number.isFinite(ms)||ms<=0)))throw new RangeError('Sequência temporal inválida');
 return {phase:0, remaining:(sequence?.durations??DURATIONS)[0], speed:1, pauses:[], cycle:0, ...(sequence?{sequence}: {})};
}
export function advance(state, milliseconds) {
 if(state.pauses.length || milliseconds <= 0) return state;
 if(!Number.isFinite(milliseconds)) throw new TypeError('Tempo decorrido inválido');
 const durations=state.sequence?.durations??DURATIONS;
 let remaining=state.remaining-milliseconds*state.speed, phase=state.phase, cycle=state.cycle;
 while(remaining<=0){phase=(phase+1)%durations.length;if(phase===0)cycle++;remaining+=durations[phase];}
 return {...state,phase,cycle,remaining};
}
export function control(state, action) {
 switch(action.type){
  case 'pause': return state.pauses.includes(action.reason)?state:{...state,pauses:[...state.pauses,action.reason]};
  case 'visible': return {...state,pauses:[...state.pauses.filter(p=>p!=='hidden'),...(state.pauses.includes('manual')?[]:['manual'])]};
  case 'close-detail': return {...state,pauses:state.pauses.filter(p=>p!=='detail')};
  case 'resume': return {...state,pauses:state.pauses.filter(p=>p==='detail'||p==='hidden')};
  case 'speed': if(![1,2].includes(action.value))throw new RangeError('Velocidade inválida');return {...state,speed:action.value};
  case 'restart': return {...initialState(state.sequence),speed:state.speed,cycle:state.cycle+1,pauses:state.pauses.filter(p=>p==='hidden')};
  default: throw new RangeError('Controle desconhecido');
 }
}
export const snapshotIndex = state => Math.min(state.phase,(state.sequence?.sources.length??3)-1);
// Um único scheduler; relógio e funções de agendamento injetáveis para testes.
export function createFeiraClock({now=()=>performance.now(),schedule=(f,ms)=>setTimeout(f,ms),cancel=id=>clearTimeout(id),maxElapsed=Infinity,wallNow=null,sequence}={}) {
 let state=initialState(sequence), last=0,lastWall=0, timer=null, active=false, generation=0;
 const listeners=new Set();
 const notify=()=>listeners.forEach(fn=>fn());
 function clear(){generation++;if(timer!==null)cancel(timer);timer=null;}
 function settle(){const current=now(),elapsed=Math.max(0,current-last),wall=wallNow?.(),interrupted=elapsed>maxElapsed||(wallNow&&wall-lastWall>maxElapsed);state=interrupted?control(state,{type:"pause",reason:"interruption"}):advance(state,elapsed);last=current;if(wallNow)lastWall=wall;}
 function queue(){
  clear();if(!active||state.pauses.length)return;
  const token=generation;
  timer=schedule(()=>{if(!active||token!==generation)return;timer=null;settle();notify();queue();},Math.min(250,state.remaining/state.speed));
 }
 return {
  getState:()=>state,
  subscribe(fn){listeners.add(fn);return ()=>listeners.delete(fn);},
  start(){if(active)return;active=true;last=now();if(wallNow)lastWall=wallNow();queue();},
  stop(){active=false;clear();},
  dispatch(action){if(active)settle();state=control(state,action);notify();queue();},
 };
}
