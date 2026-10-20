import {PRESENTATION_STEPS,presentationIndex} from './itinerary.js';
import styles from './Presentation.module.css';
export default function PresentationBar({route}){
 const index=presentationIndex(route),step=PRESENTATION_STEPS[index];
 const go=id=>{window.location.hash='/'+id;};
 return <section className={styles.bar} aria-label="Roteiro da apresentação" data-testid="presentation-guide">
  <div className={styles.caption}><strong data-testid="presentation-step">{step?`${index+1} / ${PRESENTATION_STEPS.length} · ${step.label}`:'Endereço fora do roteiro'}</strong><p>{step?.purpose??'Use Início para abrir a Visão Geral ou escolha uma das nove telas implementadas.'}</p><span>APRESENTAÇÃO MANUAL · Histórico sintético · Sem avanço temporal</span></div>
  <nav aria-label="Controles da apresentação"><button type="button" disabled={index<=0} onClick={()=>go(PRESENTATION_STEPS[index-1].id)}>← Voltar</button><button type="button" onClick={()=>go('visao-geral')}>Início</button><button type="button" disabled={index<0||index===PRESENTATION_STEPS.length-1} onClick={()=>go(PRESENTATION_STEPS[index+1].id)}>Avançar →</button></nav>
 </section>;
}
