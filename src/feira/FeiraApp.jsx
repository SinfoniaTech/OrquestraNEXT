import useFeiraClock from './useFeiraClock.js';
import {selectFeira} from './selectors.js';
import {FeiraPanel} from './FeiraPanel.jsx';
// Caminho standalone explícito preservado; não é fallback do modo conectado.
export default function FeiraApp(){
 const [state,dispatch]=useFeiraClock();
 return <FeiraPanel standalone state={state} dispatch={dispatch} view={selectFeira(state)}/>;
}
