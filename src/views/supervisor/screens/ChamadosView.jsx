import styles from '../SupervisorView.module.css';
import { CHAMADOS } from '../data/chamados.js';
import ChamadoCard from '../components/ChamadoCard.jsx';
import { SlidersHorizontalIcon } from '../components/icons.jsx';

/**
 * Tela "Chamados" (tela inicial do app): chamadas abertas priorizadas por
 * criticidade e tempo restante de SLA.
 *
 * É a antiga lista do SupervisorView, extraída para que o shell comporte as
 * quatro telas da bottom nav. Clicar em um chamado invoca onOpen com o id —
 * o SupervisorView abre a tela de detalhe (rota /chamados/:id da referência).
 */
export default function ChamadosView({ onOpen = null }) {
  const eventosAtivos = CHAMADOS.length;

  return (
    <>
      <section
        className={`${styles.titleSection} ${styles.titleSectionCompact}`}
      >
        <h1 className={`${styles.title} ${styles.titleCompact}`}>Chamados</h1>
        <div className={styles.subtitleRow}>
          <p className={styles.subtitle}>{eventosAtivos} eventos ativos agora.</p>
          <div className={styles.sortBar}>
            Ordenar por: Tempo p/ Estourar SLA
            <SlidersHorizontalIcon size={14} />
          </div>
        </div>
      </section>

      <section className={styles.list} aria-label="Lista de chamadas">
        {CHAMADOS.map((chamado) => (
          <ChamadoCard key={chamado.id} chamado={chamado} onOpen={onOpen} />
        ))}
      </section>
    </>
  );
}
