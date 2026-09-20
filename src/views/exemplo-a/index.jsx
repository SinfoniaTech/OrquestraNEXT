import styles from './index.module.css';

/**
 * Cena de exemplo A — título grande sobre fundo roxo.
 *
 * Uma cena é qualquer pasta de src/views/ com um componente React como
 * export default neste index.jsx. O controlador entrega duas props:
 *
 *   - isActive: true para as cenas visíveis (a cena "sabe" que está no palco);
 *   - side: "full" | "left" | "right" — posição na tela, para a cena se
 *     adaptar quando divide a tela com outra.
 *
 * A animação de entrada vive no CSS e reinicia a cada visita porque o
 * controlador remonta a cena a cada posição (key = posição atual).
 */
export default function ExemploA({ isActive = true, side = 'full' }) {
  return (
    <div className={styles.scene}>
      <h1 className={styles.title}>Cena A</h1>
    </div>
  );
}
