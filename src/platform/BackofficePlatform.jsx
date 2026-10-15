import PecasPage from './pages/PecasPage.jsx';
import TecnicosPage from './pages/TecnicosPage.jsx';
import {useEffect,useRef,useState} from 'react';
import logo from '../assets/orquestra-logo13.png';
import {MENU_GROUPS,PAGES,pageFromHash} from './navigation.js';
import styles from './BackofficePlatform.module.css';
import {ConsultationProvider,useConsultation} from './filters/ConsultationContext.jsx';
import EquipamentosPage from './pages/EquipamentosPage.jsx';
import CustosPage from './pages/CustosPage.jsx';
import ContratosPage from './pages/ContratosPage.jsx';
import PerformancePage from './pages/PerformancePage.jsx';
import RiscosPage from './pages/RiscosPage.jsx';
import ChamadosPage from './pages/ChamadosPage.jsx';
import SlaCriticidadePage from './pages/SlaCriticidadePage.jsx';

function Icon({name='home',size=20,...props}){
 const paths={
 home:'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9',
 file:'M14 2H5v20h14V7L14 2Zm0 0v6h5M8 12h8M8 16h6',
 database:'M21 6c0 2-4 4-9 4S3 8 3 6s4-4 9-4 9 2 9 4ZM3 6v12c0 2 4 4 9 4s9-2 9-4V6M3 12c0 2 4 4 9 4s9-2 9-4',
 alert:'m12 3 10 18H2L12 3Zm0 6v5m0 3v1',
 phone:'M7 3 3 5c0 9 7 16 16 16l2-4-5-3-2 3c-3-1-6-4-7-7l3-2-3-5Z',
 chart:'M4 21V11h3v10M11 21V4h3v17M18 21V8h3v13',
 users:'M16 21v-2c0-4-12-4-12 0v2M10 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-7c5 0 5 7 0 7m1 3c3 0 4 2 4 5',
 equipment:'M3 3h18v7H3V3Zm0 11h18v7H3v-7Zm4-8h1m-1 11h1m5-11h5m-5 11h5',
 box:'m12 2 10 5v10l-10 5-10-5V7l10-5Zm0 10L2 7m10 5 10-5M12 12v10M7 4l10 5',
 spark:'m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z',
 link:'m10 14 4-4M8 16l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 10a4 4 0 0 0 6 0l5-5a4 4 0 0 0-6-6l-2 2',
 arrow:'M4 12h16m-6-6 6 6-6 6',
 menu:'M3 6h18M3 12h18M3 18h18',
 close:'m6 6 12 12M6 18 18 6',
 shield:'m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Zm-4 10 3 3 5-6'
 };
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]??paths.home}/></svg>;
}
const SESSION_KEY='orquestra.platform.demo';
function readSession(){try{return sessionStorage.getItem(SESSION_KEY)==='active';}catch{return false;}}
function saveSession(active){try{active?sessionStorage.setItem(SESSION_KEY,'active'):sessionStorage.removeItem(SESSION_KEY);}catch{/* Demo também funciona sem storage. */}}

function DemoLogin({onEnter,legacyUrl}){
 return <div className={styles.login}>
  <section className={styles.loginBrand} aria-label="ORQUESTRA">
   <img src={logo} alt="Orquestra" className={styles.loginLogo}/>
   <p className={styles.eyebrow}>INTELIGÊNCIA OPERACIONAL</p>
   <h1>Informação que orienta.<br/><span>Decisões que transformam.</span></h1>
   <p className={styles.loginIntro}>Conecte o histórico da operação a uma visão clara de contexto, prioridades e oportunidades.</p>
   <div className={styles.brandFeatures}>
    <div><Icon name="database"/><span><strong>Dados com contexto</strong>Origem e referência de cada informação.</span></div>
    <div><Icon name="chart"/><span><strong>Uma operação, várias perspectivas</strong>Do histórico de chamados à visão executiva.</span></div>
    <div><Icon name="shield"/><span><strong>Inteligência explicável</strong>Critérios claros para apoiar decisões.</span></div>
   </div>
   <p className={styles.brandFooter}>ORQUESTRA <span>Antecipar o crítico. Aprender com o histórico.</span></p>
  </section>
  <main className={styles.loginMain}>
   <span className={styles.loginTag}>PROJETO ACADÊMICO · NEXT FIAP</span>
   <div className={styles.loginCard}>
    <span className={styles.demoLabel}>AMBIENTE DE DEMONSTRAÇÃO</span>
    <h2>Acesse o Orquestra</h2>
    <p>Explore a nova estrutura do BackOffice.</p>
    <div className={styles.demoNotice}><Icon name="shield" size={22}/><p><strong>Acesso demonstrativo</strong>Sem senha ou autenticação corporativa. Os dados do projeto são sintéticos e não representam registros reais ou oficiais da OTIS.</p></div>
    <button className={styles.primaryButton} onClick={onEnter}>Acessar demonstração <Icon name="arrow"/></button>
    <a className={styles.legacyLink} href={legacyUrl}>Abrir apresentação original <span aria-hidden="true">↗</span></a>
   </div>
   <p className={styles.loginFooter}>Inteligência operacional e executiva</p>
  </main>
 </div>;
}

export default function BackofficePlatform(){return <ConsultationProvider><PlatformShell/></ConsultationProvider>;}

function PlatformShell(){
 const {dispatch}=useConsultation();
 const [active,setActive]=useState(readSession);
 const [route,setRoute]=useState(()=>pageFromHash(window.location.hash));
 const [menuOpen,setMenuOpen]=useState(false);
 const heading=useRef(null);
 const menuButton=useRef(null);
 const sidebarRef=useRef(null);
 const legacyUrl=window.location.pathname+'#/1';
 useEffect(()=>{
  const listener=()=>{setRoute(pageFromHash(window.location.hash));setMenuOpen(false);};
  window.addEventListener('hashchange',listener);
  return ()=>window.removeEventListener('hashchange',listener);
 },[]);
 const login=!active || route==='login';
 const page=PAGES.find(p=>p.id===route);
 useEffect(()=>{
  document.title=login?'ORQUESTRA · Acesso demonstrativo': 'ORQUESTRA · '+(page?.title??page?.label??'Página não encontrada');
  if(!login)heading.current?.focus();
 },[login,route,page]);
 useEffect(()=>{
  if(!menuOpen)return;
  sidebarRef.current?.querySelector('a')?.focus();
  const close=e=>{
   if(e.key==='Escape'){setMenuOpen(false);menuButton.current?.focus();}
   if(e.key==='Tab'){
    const elements=[...sidebarRef.current.querySelectorAll('a,button')].filter(el=>el.getClientRects().length);
    const first=elements[0],last=elements.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
   }
  };
  window.addEventListener('keydown',close);
  return ()=>window.removeEventListener('keydown',close);
 },[menuOpen]);
 const enter=()=>{saveSession(true);setActive(true);window.location.hash='/visao-geral';};
 const exit=()=>{dispatch({type:'reset'});saveSession(false);setActive(false);window.location.hash='/login';};
 if(login)return <div className={styles.root}><DemoLogin onEnter={enter} legacyUrl={legacyUrl}/></div>;
 return <div className={styles.root}>
  <a className={styles.skipLink} href="#platform-content" onClick={e=>{e.preventDefault();document.getElementById('platform-content')?.focus();}}>Ir para o conteúdo</a>
  <div className={styles.shell}>
   {menuOpen&&<button className={styles.backdrop} aria-label="Fechar navegação" onClick={()=>setMenuOpen(false)}/>}
   <aside ref={sidebarRef} className={styles.sidebar+' '+(menuOpen?styles.sidebarOpen:'')}>
    <a className={styles.brand} href="#/visao-geral" aria-label="Orquestra — Visão Geral"><img src={logo} alt="Orquestra"/></a>
    <button className={styles.drawerClose} aria-label="Fechar menu" onClick={()=>{setMenuOpen(false);menuButton.current?.focus();}}><Icon name="close"/></button>
    <nav id="platform-menu-content" aria-label="Menu principal" className={styles.navigation}>
     {MENU_GROUPS.map(group=><div className={styles.navGroup} key={group.label}>
      <p className={styles.navGroupLabel}>{group.label}</p>
      {group.items.map(item=><a key={item.id} href={'#/'+item.id} className={styles.navItem+' '+(route===item.id?styles.navActive:'')} aria-current={route===item.id?'page':undefined}>
       <Icon name={item.icon} size={18}/><span>{item.label}</span>
      </a>)}
     </div>)}
    </nav>
    <div className={styles.sidebarBottom}><span className={styles.smallRing}/><p><strong>Orquestra</strong><span>Operações que geram valor</span></p></div>
   </aside>
   <div className={styles.workspace}>
    <header className={styles.header}>
     <div className={styles.headerWelcome}>
      <button ref={menuButton} className={styles.menuButton} aria-label={menuOpen?'Recolher menu':'Abrir menu'} aria-expanded={menuOpen} aria-controls="platform-menu-content" onClick={()=>setMenuOpen(v=>!v)}><Icon name={menuOpen?'close':'menu'}/></button>
      <div><strong>Bem-vindo(a)!</strong><span>Inteligência para a operação e para a gestão.</span></div>
     </div>
     <div className={styles.headerActions}><span className={styles.environment}>DEMO · Dados sintéticos</span><span className={styles.avatar} aria-hidden="true">D</span><button className={styles.exitButton} onClick={exit}>Sair da demonstração</button></div>
    </header>
    <main id="platform-content" className={styles.content} tabIndex={-1}>
     <div className={styles.breadcrumb}>BACKOFFICE <span>/</span> {page?.title??page?.label??'Página não encontrada'}</div>
     <div className={styles.pageHeading}>
      <div><span className={styles.headingLine}/><h1 ref={heading} tabIndex={-1}>{page?.title??page?.label??'Página não encontrada'}</h1><p>{page?.description??'Este endereço não corresponde a uma página da plataforma.'}</p></div>
      <span className={styles.phaseBadge}>{['visao-geral','contratos-margem','custos-tco','tecnicos','equipamentos','pecas','chamados','sla-criticidade','riscos-tendencias'].includes(route)?'Histórico consultável':'Estrutura inicial'}</span>
     </div>
     {route==='pecas'?<PecasPage/>:route==='tecnicos'?<TecnicosPage/>:route==='equipamentos'?<EquipamentosPage/>:route==='custos-tco'?<CustosPage/>:route==='contratos-margem'?<ContratosPage/>:route==='visao-geral'?<PerformancePage/>:route==='chamados'?<ChamadosPage/>:route==='sla-criticidade'?<SlaCriticidadePage/>:route==='riscos-tendencias'?<RiscosPage/>:page?<section className={styles.pendingCard} aria-label="Estado da página">
      <div className={styles.pendingGraphic}><Icon name={page.icon} size={36}/><span className={styles.graphicLine}/><span className={styles.graphicDot}/></div>
      <span className={styles.sectionEyebrow}>CONSTRUINDO O NOVO BACKOFFICE</span>
      <h2>{page.id==='visao-geral'?'Um novo olhar sobre a operação.':'Espaço preparado para '+page.label.toLocaleLowerCase('pt-BR')+'.'}</h2>
      <p>Esta página faz parte da nova navegação do Orquestra.<br/>Suas funcionalidades serão disponibilizadas nas próximas entregas.</p>
      <span className={styles.pendingStatus}><span/>Desenvolvimento pendente</span>
      {page.id==='visao-geral'&&<a className={styles.secondaryButton} href="#/chamados">Conhecer a área de Chamados <Icon name="arrow" size={17}/></a>}
     </section>:<section className={styles.pendingCard}><h2>Vamos voltar ao início?</h2><a className={styles.secondaryButton} href="#/visao-geral">Ir para Visão Geral</a></section>}
     {!['visao-geral','contratos-margem','custos-tco','tecnicos','equipamentos','pecas','chamados','sla-criticidade','riscos-tendencias'].includes(route)&&<div className={styles.contextStrip}><Icon name="shield" size={18}/><p><strong>Uma evolução por etapas.</strong> A consulta histórica está disponível em Chamados, SLA & Criticidade e Riscos & Tendências. As demais páginas continuam em desenvolvimento.</p></div>}
     <footer className={styles.footer}><span>ORQUESTRA · NEXT FIAP</span><a href={legacyUrl}>Apresentação original <span aria-hidden="true">↗</span></a></footer>
    </main>
   </div>
  </div>
 </div>;
}
