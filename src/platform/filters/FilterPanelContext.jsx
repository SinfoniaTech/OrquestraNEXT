import {createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';

/*
 * Estado do card "Explorar o histórico" (filtros).
 *
 * O card nasce FECHADO e só abre ao clicar no ícone de filtro, posicionado no
 * cabeçalho da página, à esquerda da etiqueta "Histórico consultável".
 * O <FilterBar/> de cada página continua sendo usado como antes; ele apenas
 * projeta (portal) o seu conteúdo no "slot" logo abaixo do h1 + parágrafo.
 * Sem este provider, FilterBar volta a renderizar inline (comportamento antigo).
 */
const Context=createContext(null);

export function useFilterPanelState(resetKey){
 const [open,setOpen]=useState(false);
 const [slot,setSlot]=useState(null);
 const [available,setAvailable]=useState(0);
 // O card volta a nascer fechado a cada página nova.
 useEffect(()=>{setOpen(false);},[resetKey]);
 const toggle=useCallback(()=>setOpen(v=>!v),[]);
 const register=useCallback(()=>{setAvailable(n=>n+1);return ()=>setAvailable(n=>Math.max(0,n-1));},[]);
 return useMemo(()=>({open,setOpen,toggle,slot,setSlot,available,register}),[open,toggle,slot,available,register]);
}

export const FilterPanelProvider=Context.Provider;
export function useFilterPanel(){return useContext(Context);}

export function countActiveFilters(state){
 const fields=Object.values(state.filters??{}).reduce((n,values)=>n+values.length,0);
 return fields+(state.recurrence?.length??0)+(state.search?1:0)+(state.days!==60?1:0);
}
