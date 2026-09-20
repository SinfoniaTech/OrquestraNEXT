import styles from './index.module.css';

/**
 * Cena de exemplo B — título grande sobre fundo azul-petróleo.
 *
 * Compartilha a position 2 com a exemplo-c no scenes.config.js, então as
 * duas aparecem em tela dividida: esta fica na metade esquerda (aparece
 * primeiro no array) e recebe side="left".
 */
export default function ExemploB({ isActive = true, side = 'full' }) {
  return (
    <div className={styles.scene}>
      <h1 className={styles.title}>Cena B</h1>
    </div>
  );
}
