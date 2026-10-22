import {IndicatorInfo} from './ConsultationUI.jsx';
import styles from './ExternalMetric.module.css';
export default function ExternalMetric({definition}){
 return <div className={styles.metric} data-testid={'ext-'+definition.title}><span className={styles.badge}>EXT</span><strong>{definition.title}</strong><span>Integração pendente</span><IndicatorInfo definition={definition}/></div>;
}
