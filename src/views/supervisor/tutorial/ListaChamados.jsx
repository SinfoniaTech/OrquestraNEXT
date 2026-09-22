import supStyles from '../SupervisorView.module.css';
import styles from './tutorial.module.css';
import { SlidersHorizontalIcon } from '../components/icons.jsx';

/**
 * Tela "Chamados" com a lista controlada pela cena.
 *
 * Espelha o markup do ChamadosView (título, subtítulo com a contagem, barra de
 * ordenação e a <section> da lista) usando as mesmas classes, mas recebe os
 * chamados por props e delega a renderização de cada item (renderItem) — é
 * assim que a cena embrulha o card em animações sem alterar o ChamadoCard.
 *
 * "Sem chamados prioritários": aparece logo abaixo de "N eventos ativos
 * agora." enquanto TODOS os chamados forem NORMAL e some (recolhendo e
 * subindo a lista) quando surge um chamado de outra criticidade. Por padrão a
 * regra é deduzida da própria lista; a cena pode forçar o valor com
 * `semPrioritarios` (a Cena 2 faz isso para a mensagem sumir no instante em
 * que o card vira MÉDIA, antes de a lista ser reordenada).
 */
export default function ListaChamados({ chamados, renderItem, listaRef, semPrioritarios }) {
  const todosNormais = chamados.every((chamado) => chamado.prioridade === 'normal');
  const mostrarMensagem = semPrioritarios ?? todosNormais;

  return (
    <>
      <section className={`${supStyles.titleSection} ${supStyles.titleSectionCompact}`}>
        <h1 className={`${supStyles.title} ${supStyles.titleCompact}`}>Chamados</h1>
        <div className={supStyles.subtitleRow}>
          <p className={supStyles.subtitle}>{chamados.length} eventos ativos agora.</p>
          <div className={supStyles.sortBar}>
            Ordenar por: Tempo p/ Estourar SLA
            <SlidersHorizontalIcon size={14} />
          </div>
        </div>

        <div
          className={`${styles.semPrioritarios} ${mostrarMensagem ? '' : styles.semPrioritariosOculto}`}
          aria-hidden={!mostrarMensagem}
        >
          <div className={styles.semPrioritariosInterno}>
            <p className={styles.semPrioritariosTexto}>Sem chamados prioritários</p>
          </div>
        </div>
      </section>

      <section className={supStyles.list} aria-label="Lista de chamadas" ref={listaRef}>
        {chamados.map((chamado, indice) => renderItem(chamado, indice))}
      </section>
    </>
  );
}
