import styles from '../SupervisorView.module.css';
import PriorityBadge from './PriorityBadge.jsx';

/**
 * Card de um chamado na lista de chamadas abertas.
 *
 * Estrutura fiel à referência:
 * - faixa vertical colorida à esquerda (cor da criticidade);
 * - badge de prioridade + identificador do chamado;
 * - local · equipamento, defeito e chip opcional (ex.: "Passageiro preso");
 * - à direita, tempo restante de SLA (texto + contador hh:mm).
 *
 * O card crítico recebe a sombra avermelhada (cardCritical). Ao clicar,
 * onOpen recebe o id do chamado — o SupervisorView abre a tela de detalhe
 * (rota /chamados/:id da referência). Sem onOpen, o card mantém apenas a
 * aparência de link.
 */
export default function ChamadoCard({ chamado, onOpen = null }) {
  const classes = [
    styles.card,
    chamado.prioridade === 'critica' ? styles.cardCritical : styles.cardShadow,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <a
      href={`#${chamado.id}`}
      className={classes}
      onClick={(event) => {
        event.preventDefault();
        onOpen?.(chamado.id);
      }}
    >
      <span
        className={`${styles.cardBar} ${styles[chamado.prioridade]}`}
        aria-hidden="true"
      />
      <div className={styles.cardBody}>
        <div className={styles.cardInfo}>
          <div className={styles.cardTop}>
            <PriorityBadge prioridade={chamado.prioridade} />
            <span className={styles.cardId}>#{chamado.id}</span>
          </div>
          <p className={styles.cardLocal}>
            {chamado.local} · {chamado.equipamento}
          </p>
          <p className={styles.cardDefeito}>{chamado.defeito}</p>
          {chamado.tag ? (
            <span className={styles.cardTag}>{chamado.tag}</span>
          ) : null}
        </div>
        <div className={`${styles.cardSla} ${styles[chamado.prioridade]}`}>
          <span className={styles.slaTexto}>{chamado.slaTexto}</span>
          <span className={styles.slaTempo}>{chamado.slaTempo}</span>
        </div>
      </div>
    </a>
  );
}
