import styles from './tutorial.module.css';

/**
 * Embrulho de um item da lista de chamados. É nele (e não no ChamadoCard, que
 * não muda) que ficam as animações: entrada escalonada, esmaecer, anel de
 * destaque e o deslize da reordenação (data-flip-id, usado por useFlip).
 *
 * Props:
 * - id: id do chamado (identifica o item no FLIP);
 * - indice: posição na lista (define o atraso da entrada escalonada);
 * - escalonar: toca a entrada (fade + subida) com atraso por posição;
 *   ATENÇÃO: desligue depois da entrada — se o item for movido no DOM com
 *   a classe ainda ligada, a animação de entrada repete;
 * - esmaecido: baixa a opacidade (foco no item que importa);
 * - className: classes de estado extras (destaque, onda, elevado...).
 */
export default function ItemLista({
  id,
  indice = 0,
  escalonar = false,
  esmaecido = false,
  className = '',
  children,
}) {
  const classes = [
    styles.item,
    escalonar ? styles.escalonar : '',
    esmaecido ? styles.esmaecido : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={{ '--i': indice }} data-flip-id={id}>
      {children}
    </div>
  );
}
