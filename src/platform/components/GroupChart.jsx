import styles from '../pages/ContratosPage.module.css';
import ShowMore from './ShowMore.jsx';
// Barras acessíveis: valor e suporte disponíveis sem depender de cor ou hover.
// `limit` (opcional): lista inicial reduzida a N barras, com "Ver mais itens…".
export default function GroupChart({groups,value,valueLabel,onGroup,label,limit}){
 const max=Math.max(1,...groups.map(g=>value(g)??0));
 const bars=list=><div className={styles.bars+(limit?' '+styles.barsFlat:'')} aria-label={label}>{list.length?list.map(g=><button key={g.label} aria-label={label+' · '+g.label+': '+valueLabel(value(g))} onClick={()=>onGroup(g)}><span>{g.label}</span><span className={styles.track}><i style={{width:(value(g)??0)/max*100+'%'}}/></span><strong>{valueLabel(value(g))}</strong></button>):<p>Nenhum grupo neste recorte.</p>}</div>;
 if(!limit)return bars(groups);
 return <ShowMore total={groups.length} limit={limit}>{count=>bars(groups.slice(0,count))}</ShowMore>;
}
