import styles from '../pages/ContratosPage.module.css';
// Barras acessíveis: valor e suporte disponíveis sem depender de cor ou hover.
export default function GroupChart({groups,value,valueLabel,onGroup,label}){
 const max=Math.max(1,...groups.map(g=>value(g)??0));
 return <div className={styles.bars} aria-label={label}>{groups.length?groups.map(g=><button key={g.label} aria-label={label+' · '+g.label+': '+valueLabel(value(g))} onClick={()=>onGroup(g)}><span>{g.label}</span><span className={styles.track}><i style={{width:(value(g)??0)/max*100+'%'}}/></span><strong>{valueLabel(value(g))}</strong></button>):<p>Nenhum grupo neste recorte.</p>}</div>;
}
