import Badge from './Badge.jsx';
import Icon from './icons.jsx';
import { PRIORIDADES } from '../data/chamadosData.js';
import styles from '../chamados.module.css';

/** Classe de cada prioridade (mesmas cores do supervisor). */
const CLASSES = {
  critica: styles.prioCritica,
  alta: styles.prioAlta,
  media: styles.prioMedia,
  normal: styles.prioNormal,
};

/**
 * BADGE DE PRIORIDADE DO CHAMADO (CRÍTICA / ALTA / MÉDIA / NORMAL).
 *
 * Cópia do padrão da tela Chamados do supervisor (PriorityBadge): pill de
 * fundo SÓLIDO, ícone de alerta (shield-alert na crítica; triangle-alert nas
 * demais) e texto em caixa alta, com as mesmas cores da referência
 * (vermelho / laranja / amarelo / verde). Prioridades sem equivalente na
 * tela do supervisor (ex.: "Em análise", estado transitório do protagonista
 * ao entrar) mantêm o Badge neutro padrão da view.
 */
export default function PrioridadeBadge({ prioridade }) {
  const config = PRIORIDADES[prioridade];
  const classe = CLASSES[prioridade];

  if (!classe) {
    return <Badge text={config.label} tone={config.tone} />;
  }

  return (
    <span className={`${styles.prioBadge} ${classe}`}>
      <Icon name={config.icone} size={12} />
      {config.label}
    </span>
  );
}