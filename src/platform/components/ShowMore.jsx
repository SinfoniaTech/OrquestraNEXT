import {useId,useState} from 'react';
import styles from './ShowMore.module.css';

/*
 * Lista/tabela com estado inicial reduzido.
 *
 * Mostra apenas `limit` itens; sobre o último item aparece um gradiente
 * (de baixo para cima) com o botão "Ver mais itens…". Ao clicar, o card cresce
 * e a listagem completa original é exibida.
 *
 * Uso: <ShowMore total={itens.length} limit={5}>{count=>renderiza(itens.slice(0,count))}</ShowMore>
 * Se total <= limit, nada muda (sem gradiente e sem botão).
 */
export default function ShowMore({total,limit=5,children,label='Ver mais itens…',lessLabel='Ver menos'}){
 const [expanded,setExpanded]=useState(false),id=useId();
 if(total<=limit)return children(total);
 return <div className={styles.frame}>
  <div id={id} key={expanded?'full':'short'} className={styles.content}>{children(expanded?total:limit)}</div>
  {expanded
   ?<button type="button" className={styles.less} aria-expanded="true" aria-controls={id} onClick={()=>setExpanded(false)}>{lessLabel}</button>
   :<div className={styles.fade}><button type="button" className={styles.more} aria-expanded="false" aria-controls={id} onClick={()=>setExpanded(true)}>{label}</button></div>}
 </div>;
}
