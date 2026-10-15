import {createContext,useContext,useMemo,useReducer} from 'react';
import {consultationReducer,DEFAULT_STATE,selectView} from '../services/chamados.js';
const Context=createContext(null);
export function ConsultationProvider({children}){
 const [state,dispatch]=useReducer(consultationReducer,DEFAULT_STATE);
 const view=useMemo(()=>selectView(state),[state]);
 const value=useMemo(()=>({state,dispatch,view}),[state,view]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useConsultation(){
 const value=useContext(Context);
 if(!value)throw new Error('Consulta requer ConsultationProvider');
 return value;
}
