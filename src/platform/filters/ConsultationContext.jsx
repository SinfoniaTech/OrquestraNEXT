import {createContext,useContext,useMemo,useReducer,useState,useCallback} from 'react';
import {consultationReducer,DEFAULT_STATE,selectView} from '../services/chamados.js';
const Context=createContext(null);
export function ConsultationProvider({children}){
 const [state,baseDispatch]=useReducer(consultationReducer,DEFAULT_STATE);
 const [contractUi,setContractUi]=useState({sort:'count',direction:'desc',page:1,size:10});
 const [costUi,setCostUi]=useState({sort:'cost',direction:'desc',page:1,size:10,mode:'contracts'});
 const [technicianUi,setTechnicianUi]=useState({sort:'count',direction:'desc',page:1,size:10});
 const [equipmentUi,setEquipmentUi]=useState({sort:'registered',direction:'desc',page:1,size:10});
 const dispatch=useCallback(action=>{
  baseDispatch(action);
  if(action.type==='reset'){
   setTechnicianUi({sort:'count',direction:'desc',page:1,size:10});
   setEquipmentUi({sort:'registered',direction:'desc',page:1,size:10});
   setCostUi({sort:'cost',direction:'desc',page:1,size:10,mode:'contracts'});
   setContractUi({sort:'count',direction:'desc',page:1,size:10});
  }else if(['period','field','remove','recurrence','search'].includes(action.type)){
   setEquipmentUi(ui=>({...ui,page:1}));
   setTechnicianUi(ui=>({...ui,page:1}));
   setCostUi(ui=>({...ui,page:1}));
   setContractUi(ui=>({...ui,page:1}));
  }
 },[]);
 const view=useMemo(()=>selectView(state),[state]);
 const value=useMemo(()=>({state,dispatch,view,contractUi,setContractUi,costUi,setCostUi,equipmentUi,setEquipmentUi,technicianUi,setTechnicianUi}),[state,view,dispatch,contractUi,costUi,equipmentUi,technicianUi]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useConsultation(){
 const value=useContext(Context);
 if(!value)throw new Error('Consulta requer ConsultationProvider');
 return value;
}
