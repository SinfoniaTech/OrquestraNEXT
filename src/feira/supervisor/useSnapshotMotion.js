import {useLayoutEffect,useRef} from 'react';
import {CRITICALITY} from './presentation.js';
// Visual durations only; operational time and changes belong to the snapshot.
export function useSnapshotMotion(ref,stamp,changes,context,departuresRef){
 const previous=useRef(new Map()),previousContext=useRef(context),previousStamp=useRef(stamp);
 useLayoutEffect(()=>{
  const animations=[],ghosts=[],media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const nodes=[...(ref.current?.querySelectorAll('[data-call-id]')??[])];
  const next=new Map(nodes.map(node=>[node.dataset.callId,{rect:node.getBoundingClientRect(),clone:node.cloneNode(true)}]));
  const sameRun=value=>value.slice(0,value.lastIndexOf(':'));
  const changed=previousStamp.current!==stamp&&sameRun(previousStamp.current)===sameRun(stamp);
  const animate=(node,frames,options)=>{const animation=node.animate(frames,options);animations.push(animation);return animation;};
  if(changed&&previousContext.current===context&&!media.matches){
   const byId=new Map(changes.map(change=>[change.id,change]));
   for(const node of nodes){
    const old=previous.current.get(node.dataset.callId),delta=old?old.rect.top-next.get(node.dataset.callId).rect.top:0,change=byId.get(node.dataset.callId);
    if(delta)animate(node,[{transform:`translateY(${delta}px)`},{transform:'translateY(0)'}],{id:'feira-move',duration:450,easing:'ease-out'});
    if(change?.criticality)animate(node,[{boxShadow:'0 0 0 0 transparent'},{boxShadow:'0 0 0 4px var(--motion-color)'},{boxShadow:'0 0 0 0 transparent'}],{id:'feira-criticality',duration:700,iterations:2,easing:'ease-in-out'});
    else if(change?.isNew)animate(node,[{opacity:.6},{opacity:1}],{id:'feira-new',duration:500,easing:'ease-out'});
    if(change?.status){const badge=node.querySelector('[data-call-status]');if(badge)animate(badge,[{boxShadow:'0 0 0 0 transparent'},{boxShadow:'0 0 0 3px var(--focus)'},{boxShadow:'0 0 0 0 transparent'}],{id:'feira-status',duration:700,iterations:2,easing:'ease-in-out'});}
   }
   for(const change of changes){
    const old=previous.current.get(change.id);
    if(!change.concluded||!old||next.has(change.id)||!departuresRef?.current||old.rect.bottom<0||old.rect.top>innerHeight)continue;
    const ghost=old.clone;ghost.removeAttribute('data-call-id');ghost.dataset.exitCallId=change.id;ghost.disabled=true;ghost.tabIndex=-1;ghost.setAttribute('aria-hidden','true');
    const priority=CRITICALITY[change.criticality?.to],tone=priority?.tone;if(tone){ghost.dataset.tone=tone;const badge=ghost.querySelector('[data-call-priority]');if(badge){badge.textContent=priority.label;badge.style.backgroundColor=`var(--${tone}-bg)`;badge.style.color=`var(--${tone}-ink)`;}}
    ghost.querySelector('[data-call-changes]')?.remove();
    const status=ghost.querySelector('[data-call-status]');if(status)(status.firstElementChild??status).textContent='Concluído';
    const action=ghost.querySelector('[data-call-action]');if(action)action.textContent='Concluído nesta atualização';
    Object.assign(ghost.style,{position:'absolute',top:old.rect.top+'px',left:old.rect.left+'px',width:old.rect.width+'px',margin:'0'});
    departuresRef.current.append(ghost);ghosts.push(ghost);
    animate(ghost,[{opacity:.95},{opacity:.95,offset:.7},{opacity:0}],{id:'feira-concluded',duration:1400,easing:'ease-out'}).finished.then(()=>ghost.remove()).catch(()=>{});
   }
  }
  previous.current=next;previousContext.current=context;previousStamp.current=stamp;
  const cancel=()=>{animations.forEach(animation=>animation.cancel());ghosts.forEach(ghost=>ghost.remove());};
  const preference=()=>{if(media.matches)cancel();};media.addEventListener('change',preference);
  // Cancel before measuring the next layout; prevents accumulating FLIP transforms.
  return ()=>{media.removeEventListener('change',preference);cancel();};
 },[ref,stamp,changes,context,departuresRef]);
}
