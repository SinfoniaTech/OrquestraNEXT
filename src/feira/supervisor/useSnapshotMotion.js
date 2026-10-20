import {useLayoutEffect,useRef} from 'react';
// Same FLIP technique as the tutorial, driven exclusively by confirmed snapshots.
export function useSnapshotMotion(ref, stamp, changes, context) {
 const previous = useRef(new Map()), previousContext = useRef(context);
 useLayoutEffect(() => {
  const animations = [];
  const nodes = [...(ref.current?.querySelectorAll('[data-call-id]') ?? [])];
  const next = new Map(nodes.map(node => [node.dataset.callId,node.getBoundingClientRect().top]));
  if (previousContext.current === context && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
   for (const node of nodes) {
    const old = previous.current.get(node.dataset.callId), delta = old == null ? 0 : old-next.get(node.dataset.callId);
    if (delta) animations.push(node.animate([{transform:`translateY(${delta}px)`},{transform:'translateY(0)'}],{duration:450,easing:'ease-out'}));
    if (previous.current.size && changes.some(change => change.id === node.dataset.callId)) animations.push(node.animate([{opacity:.55},{opacity:1}],{duration:500}));
   }
  }
  previous.current = next;
  previousContext.current = context;
  // Cancel before the next layout measurement: overlapping FLIP transforms
  // otherwise feed animated coordinates back into rapid snapshot updates.
  return () => animations.forEach(animation => animation.cancel());
 },[ref,stamp,changes,context]);
}
