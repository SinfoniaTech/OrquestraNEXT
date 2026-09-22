import AnimatedNumber from './AnimatedNumber.jsx';
import Icon from './icons.jsx';
import { FLUXO_ETAPAS } from '../data/chamadosData.js';
import styles from '../chamados.module.css';

/**
 * Faixa "Fluxo de chamados": 4 etapas em sequência com contagem derivada.
 * A etapa em que o protagonista está fica destacada; ao trocar de estágio
 * (a cena remonta), a etapa atual recebe um breve realce de entrada e a
 * contagem anima do valor do estágio anterior para o atual.
 */
export default function FluxoChamados({ counts, prevCounts, currentStep }) {
  return (
    <ol className={styles.fluxo}>
      {FLUXO_ETAPAS.map((etapa, i) => {
        const active = etapa.id === currentStep;
        return (
          <li
            key={etapa.id}
            className={`${styles.fluxoStep} ${active ? styles.fluxoStepActive : ''} ${i > 0 ? styles.fluxoArrow : ''}`}
          >
            {i > 0 ? <Icon name="chevron-right" size={14} className={styles.fluxoArrowIcon} /> : null}
            <div className={styles.fluxoStepBody}>
              <span className={styles.fluxoLabel}>{etapa.label}</span>
              <span className={styles.fluxoCount}>
                <AnimatedNumber
                  value={counts[etapa.id]}
                  from={prevCounts ? prevCounts[etapa.id] : null}
                  format={(v) => v.toLocaleString('pt-BR')}
                />
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
