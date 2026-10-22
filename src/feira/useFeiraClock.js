import {useEffect,useState,useSyncExternalStore} from 'react';
import {EXTENDED_SEQUENCE} from './data/index.js';
import {createFeiraClock} from './temporalState.js';
export default function useFeiraClock(){
 const [clock]=useState(()=>createFeiraClock({sequence:EXTENDED_SEQUENCE}));
 const state=useSyncExternalStore(clock.subscribe,clock.getState);
 useEffect(()=>{
  clock.start();
  // Ao retornar, remove apenas o bloqueio de visibilidade, mantendo pausa explícita.
  const visible=()=>{if(document.hidden)clock.dispatch({type:'pause',reason:'hidden'});else clock.dispatch({type:'visible'});};
  const blur=()=>clock.dispatch({type:'pause',reason:'manual'});
  const route=()=>clock.dispatch({type:'pause',reason:'manual'});
  if(document.hidden)visible();
  document.addEventListener('visibilitychange',visible);window.addEventListener('blur',blur);window.addEventListener('hashchange',route);
  return ()=>{clock.stop();document.removeEventListener('visibilitychange',visible);window.removeEventListener('blur',blur);window.removeEventListener('hashchange',route);};
 },[clock]);
 return [state,clock.dispatch];
}
