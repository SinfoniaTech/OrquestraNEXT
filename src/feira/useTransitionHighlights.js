import {useEffect,useState} from 'react';
import {consecutive,selectHighlights} from './highlights.js';
const EMPTY=[];
export function useTransitionHighlights(data,online=true,resyncId=0,context=''){
 const next={sessionId:data.sessionId,cycle:data.state.cycle,index:data.view.index,online,resyncId,context};
 const key=JSON.stringify(next);
 const [tracking,setTracking]=useState(()=>({...next,key,changes:EMPTY}));
 // Derive before children commit: one transition, no replay on unrelated renders.
 if(tracking.key!==key){setTracking({...next,key,changes:consecutive(tracking,next)?selectHighlights(data.view):EMPTY});}
 useEffect(()=>{if(!tracking.changes.length)return;const timer=setTimeout(()=>setTracking(value=>value.key===tracking.key?{...value,changes:EMPTY}:value),5000);return ()=>clearTimeout(timer);},[tracking.key,tracking.changes]);
 return tracking.key===key?tracking.changes:EMPTY;
}
