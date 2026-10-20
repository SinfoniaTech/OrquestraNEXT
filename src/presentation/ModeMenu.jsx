import {ACCESS_MODES,modeHref} from '../modes.js';
import styles from './Presentation.module.css';
export default function ModeMenu(){
 return <details className={styles.modeMenu}><summary>Modos de acesso</summary><nav aria-label="Escolher modo" className={styles.modeList}>{ACCESS_MODES.map(mode=><a href={modeHref(mode.id)} key={mode.id}><strong>{mode.label}</strong><span>{mode.description}</span></a>)}</nav></details>;
}
export function InvalidMode(){
 return <main className={styles.invalid}><h1>Modo não reconhecido</h1><p>Escolha uma experiência do ORQUESTRA. A apresentação atual abre pela Visão Geral.</p><a href={modeHref('apresentacao')}>Abrir nova apresentação</a><ModeMenu/></main>;
}
