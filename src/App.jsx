import {lazy,Suspense} from 'react';
import FeiraErrorBoundary from './feira/FeiraErrorBoundary.jsx';
import {resolveMode} from './modes.js';
import {InvalidMode} from './presentation/ModeMenu.jsx';
const SceneController=lazy(()=>import('./components/SceneController.jsx'));
const SyncedFeiraApp=lazy(()=>import('./feira/SyncedFeiraApp.jsx'));
const FeiraApp=lazy(()=>import('./feira/FeiraApp.jsx'));
const BackofficePlatform=lazy(()=>import('./platform/BackofficePlatform.jsx'));
export default function App(){
 const mode=resolveMode(window.location.search,Boolean(window.__ORQUESTRA_SYNC__));
 if(mode==='invalido')return <InvalidMode/>;
 if(mode==='legado')return <Suspense fallback={<p role="status">Carregando apresentação antiga…</p>}><SceneController/></Suspense>;
 if(mode==='supervisor-feira'||mode==='feira-conectada')return <FeiraErrorBoundary><Suspense fallback={<p role="status">Conectando à Feira local…</p>}><SyncedFeiraApp mobile={mode==='supervisor-feira'}/></Suspense></FeiraErrorBoundary>;
 if(mode==='feira')return <FeiraErrorBoundary><Suspense fallback={<p role="status">Carregando Modo Feira…</p>}><FeiraApp/></Suspense></FeiraErrorBoundary>;
 return <Suspense fallback={<p role="status">Carregando BackOffice…</p>}><BackofficePlatform presentation={mode==='apresentacao'}/></Suspense>;
}
