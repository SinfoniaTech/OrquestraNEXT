import {useEffect,useMemo,useRef,useState} from 'react';
import {MenuIcon,BellIcon,RadioIcon,AlertTriangleIcon,EllipsisIcon} from '../views/supervisor/components/icons.jsx';
import logo from '../assets/orquestra-logo13.png';
import ReadingSnapshot from './ReadingSnapshot.jsx';
import {useTransitionHighlights} from './useTransitionHighlights.js';
import SupervisorDetail from './supervisor/SupervisorDetail.jsx';
import {SupervisorCall,SupervisorAlertDialog} from './supervisor/SupervisorParts.jsx';
import {visibleRows} from './supervisor/presentation.js';
import {useSnapshotMotion} from './supervisor/useSnapshotMotion.js';
import styles from './supervisor/Supervisor.module.css';
export default function SupervisorFeira({data,online,onOpen,onClose,resyncId=0}) {
 const [selected,setSelected]=useState(null),[scope,setScope]=useState('Ativos'),[tab,setTab]=useState('alertas'),[notice,setNotice]=useState(null),[pending,setPending]=useState(null);
 const listRef=useRef(null),departuresRef=useRef(null),opening=useRef(false),headingRef=useRef(null),openerRef=useRef(null);
 useEffect(()=>{if(selected&&selected.sessionId!==data.sessionId){setSelected(null);setNotice('Sessão substituída. Confira o estado atual.');}},[data.sessionId,selected]);
 const stamp=`${data.sessionId}:${data.state.cycle}:${data.view.snapshotId??data.view.index}`;
 // Heartbeat revisions contain a new array; stable snapshot identity prevents animation replay.
 const changes=useMemo(()=>data.view.changes,[data.sessionId,data.state.cycle,data.view.snapshotId,data.view.index]);
 const highlights=useTransitionHighlights(data,online,resyncId,`${tab}:${scope}`);
 const byId=new Map(highlights.map(change=>[change.id,change]));
 useSnapshotMotion(listRef,stamp,highlights,`${tab}:${scope}`,departuresRef);
 const rows=visibleRows(data.view,tab,scope),alerts=data.view.alerts.length;
 async function open(row,fromAlert=false) {
  if(opening.current||!online)return;
  openerRef.current=document.activeElement;opening.current=true;setPending(row.ID_Chamado);setNotice(null);
  try {const confirmed=await onOpen(row);if(confirmed?.row)setSelected({...confirmed,fromAlert,screen:fromAlert?'alert':'full'});else setNotice('Não foi possível abrir a fotografia. Confira a conexão e tente novamente.');}
  catch {setNotice('Falha ao abrir o detalhe. Nenhum dado sem confirmação será apresentado.');}
  finally {opening.current=false;setPending(null);}
 }
 function closeSelected() {if(selected?.screen==='full'&&selected.fromAlert){setSelected({...selected,screen:'alert'});return;}setSelected(null);onClose();requestAnimationFrame(()=>openerRef.current?.isConnected&&openerRef.current.focus());}
 function navigate(next) {setTab(next);setNotice(null);requestAnimationFrame(()=>headingRef.current?.focus());}
 return <main className={styles.app}>
  <header className={styles.header}><div className={styles.brand}><span aria-hidden="true"><MenuIcon/></span><img src={logo} alt="ORQUESTRA"/><button type="button" aria-label={`Alertas ativos: ${alerts}`} onClick={()=>navigate('alertas')}><BellIcon/>{alerts>0&&<span className={styles.bellCount}>{alerts}</span>}</button></div><div className={styles.headerTitle}><h1>Supervisor Feira</h1><strong data-testid="mobile-moment">{data.view.snapshotId??'T'+data.view.index} · {data.view.metadata.reference.slice(11,16)}</strong></div><p>{online?'Estado recebido do notebook':'Sem conexão; último estado confirmado'} · {data.playback.status==='paused'?'Operação pausada':'Operação em reprodução'}</p></header>
  <div className={styles.content}>
   {notice&&<p role="status" className={styles.warning}>{notice}</p>}
   <section className={styles.metrics} aria-label="Indicadores operacionais"><div>Ativos<strong data-testid="mobile-active">{data.view.summary.active}</strong></div><div>Atenção<strong data-testid="mobile-attention">{data.view.summary.attention}</strong></div><div>Total na fonte<strong data-testid="mobile-total">{data.view.summary.total}</strong></div></section>
   <div className={styles.titleRow}><h2 ref={headingRef} tabIndex={-1}>{tab==='chamados'?'Chamados':tab==='alertas'?'Alertas':'Sobre a operação'}</h2><span>{data.view.index+1}/{data.view.snapshotCount} estados</span></div>
   {tab!=='mais'?<>
    {tab==='chamados'?<label className={styles.filter}>Mostrar <select aria-label="Mostrar chamados mobile" value={scope} onChange={e=>setScope(e.target.value)}><option>Ativos</option><option>Concluídos</option></select></label>:<p className={styles.warning}>Consulta independente: a operação continua durante a leitura.</p>}
    <p className={styles.caption}>{rows.length} ocorrências · prioridade recebida do notebook{tab==='chamados'&&scope==='Concluídos'?' · histórico, sem alerta ativo':''}</p>
    {tab==='chamados'&&alerts>0&&<button className={styles.alertLink} onClick={()=>navigate('alertas')}>{alerts} ocorrências em atenção · Ver alertas →</button>}
    <p className={styles.changeNotice} role="status" aria-live="polite" aria-atomic="true">{highlights.length?`Nesta atualização: ${highlights.filter(c=>c.isNew).length} novos · ${highlights.filter(c=>c.criticality).length} mudanças de criticidade · ${highlights.filter(c=>c.status).length} mudanças de status · ${highlights.filter(c=>c.concluded).length} concluídos.`:'Estado recebido. Sem novos destaques.'}</p>
    <section ref={listRef} className={styles.list} aria-label={tab==='alertas'?'Alertas ativos do Supervisor Feira':'Chamados do Supervisor Feira'}>{rows.length?rows.map(row=>{return <SupervisorCall alertEntry={tab==='alertas'} key={row.ID_Chamado} reference={data.view.metadata.reference} row={row} change={byId.get(row.ID_Chamado)} onOpen={row=>open(row,tab==='alertas')} disabled={!online||pending!==null} busy={pending===row.ID_Chamado}/>;}):<p className={styles.empty}>{tab==='alertas'?'Nenhum alerta ativo neste estado.':'Nenhum chamado neste grupo.'}</p>}</section>
   </>:<section className={styles.about}><h3>{data.view.phaseLabel}</h3><p>{data.view.observedHighlight}</p><p>12 estados · 27 s por estado em 1× · ciclo de 5 min 36 s em 1×. Relógio operacional discreto; o celular não avança os dados.</p><h3>Mudanças observadas</h3><p>{changes.filter(d=>d.isNew).length} novos · {changes.filter(d=>d.status).length} mudanças de status · {changes.filter(d=>d.criticality).length} mudanças de cor · {changes.filter(d=>d.concluded).length} concluídos.</p><p>Comparação por ID entre snapshots, auditada em FEIRA_EVENTOS. Verde, Amarelo, Laranja e Vermelho são valores da fonte, independentes de SLA. Concluídos não são alertas ativos.</p><p>Insights demonstrativos fornecidos pela massa sintética; não são previsão comprovada de ML. Estoque, localização atual e disponibilidade real do técnico são EXT.</p><details><summary>Fonte e limites</summary><p>BASE/CALC · {data.view.metadata.sheet} · {data.view.metadata.reference} · {data.view.metadata.timezone}</p><p>{data.view.metadata.sourceFile}</p><p>Consultas fixam uma fotografia local. Somente o operador controla a reprodução global.</p></details></section>}
  </div>
  <nav className={styles.nav} aria-label="Navegação do Supervisor Feira">{[['chamados','Chamados',RadioIcon],['alertas','Alertas',AlertTriangleIcon],['mais','Mais',EllipsisIcon]].map(([id,label,Icon])=><button key={id} type="button" aria-current={tab===id?'page':undefined} onClick={()=>navigate(id)}><Icon size={20}/>{label}{id==='alertas'&&alerts>0&&<span className={styles.count}>{alerts}</span>}</button>)}</nav>
  <div ref={departuresRef} className={styles.departures} aria-hidden="true" inert/>
  {selected&&(selected.screen==='alert'?<SupervisorAlertDialog row={selected.row} metadata={selected.metadata} reading={<ReadingSnapshot selected={selected} data={data} online={online} onLatest={()=>{const latest=onOpen(selected.row);if(latest)setSelected({...selected,...latest});}}/>} online={online} onClose={closeSelected} onFull={()=>{setSelected({...selected,screen:'full'});}}/>:<SupervisorDetail row={selected.row} metadata={selected.metadata} reading={<ReadingSnapshot selected={selected} data={data} online={online} onLatest={()=>{const latest=onOpen(selected.row);if(latest)setSelected({...selected,...latest});}}/>} online={online} onClose={closeSelected} returnToAlert={selected.fromAlert}/>)}
 </main>;
}
