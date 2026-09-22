import { ORIGEM_TONE, ORIGENS } from '../data/chamadosData.js';
import styles from '../chamados.module.css';

/**
 * Card "Eventos da integração" — feed com os últimos eventos, mais recente
 * no topo. Cada item tem horário, texto e selo da origem (Sistema OTIS,
 * Orquestra Backoffice, Visão do Supervisor). Itens novos (montados após
 * uma chegada ou nova cena) entram deslizando no topo.
 */
export default function FeedEventos({ items }) {
  return (
    <ul className={styles.feedList}>
      {items.map((ev) => (
        <li key={`${ev.hora}-${ev.texto}`} className={styles.feedItem}>
          <span className={styles.feedHora}>{ev.hora}</span>
          <div className={styles.feedBody}>
            <p className={styles.feedTexto}>{ev.texto}</p>
            <span className={`${styles.feedOrigem} ${styles[`origem-${ORIGEM_TONE[ev.origem]}`]}`}>
              {ORIGENS[ev.origem]}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
