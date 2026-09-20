import styles from './index.module.css';

/**
 * Cena de exemplo C — título grande sobre fundo âmbar.
 *
 * Compartilha a position 2 com a exemplo-b no scenes.config.js, então as
 * duas aparecem em tela dividida: esta fica na metade direita (aparece
 * depois no array) e recebe side="right".
 */
export default function ExemploC({ isActive = true, side = 'full' }) {
  return (
    <div className={styles.scene}>
      <h1 className={styles.title}>Cena C</h1>
    </div>
  );
}
