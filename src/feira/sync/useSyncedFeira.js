import {useEffect,useState,useSyncExternalStore} from 'react';
import {createSyncClient} from './transport.js';
export default function useSyncedFeira(){
 const [client]=useState(()=>createSyncClient({base:import.meta.env.BASE_URL.replace(/\/$/,'')+'/api/'}));
 const state=useSyncExternalStore(client.subscribe,client.getState);
 useEffect(()=>{client.start();const visible=()=>{if(!document.hidden)client.reconnect();};document.addEventListener('visibilitychange',visible);return ()=>{document.removeEventListener('visibilitychange',visible);client.stop();};},[client]);
 return [state,client];
}
