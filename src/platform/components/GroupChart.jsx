import {useRef} from 'react';
import styles from '../pages/ContratosPage.module.css';
import ShowMore from './ShowMore.jsx';
// Barras acessíveis: valor e suporte disponíveis sem depender de cor ou hover.
// `limit` (opcional): lista inicial reduzida a N barras, com "Ver mais itens…".
// `scrollOnExpand` (opcional): ao expandir, mantém a altura da lista recolhida e rola por dentro
//   (o card não estica). Sem ele, o card cresce, como em Contratos.
// `tone` (opcional): teal | green | violet | amber — cor das barras fora do .grid de Contratos (padrão: azul).
export default function GroupChart({groups,value,valueLabel,onGroup,label,limit,tone,scrollOnExpand=false}){
 const collapsedHeight=useRef(0);
 const max=Math.max(1,...groups.map(g=>value(g)??0));
 const bars=(list,expanded=false)=>{
  const scroll=scrollOnExpand&&limit&&expanded&&collapsedHeight.current>0;
  // Enquanto recolhida, guarda a altura natural da lista; é o limite da rolagem depois de expandir.
  const ref=el=>{if(el&&scrollOnExpand&&limit&&!expanded)collapsedHeight.current=el.offsetHeight;};
  const flat=limit&&!scroll;
  return <div ref={ref} className={styles.bars+(flat?' '+styles.barsFlat:'')+(tone?' '+styles['tone_'+tone]:'')} style={scroll?{maxHeight:collapsedHeight.current,overflow:'auto',scrollbarWidth:'thin'}:undefined} aria-label={label}>{list.length?list.map(g=><button key={g.label} aria-label={label+' · '+g.label+': '+valueLabel(value(g))} onClick={()=>onGroup(g)}><span>{g.label}</span><span className={styles.track}><i style={{width:(value(g)??0)/max*100+'%'}}/></span><strong>{valueLabel(value(g))}</strong></button>):<p>Nenhum grupo neste recorte.</p>}</div>;
 };
 if(!limit)return bars(groups);
 return <ShowMore total={groups.length} limit={limit}>{count=>bars(groups.slice(0,count),count>limit)}</ShowMore>;
}