import { useState } from 'react';
import styles from './MockView.module.css';

/**
 * Componente base das visualizações MOCK de demonstração.
 *
 * Cada mock é apenas uma configuração diferente deste componente (título,
 * descrição e cor de destaque). Eles existem SOMENTE para demonstrar o
 * funcionamento do container e serão substituídos pelas aplicações reais.
 *
 * Inclui propositadamente elementos interativos (contador e campo de texto)
 * e conteúdo longo (para gerar rolagem) — assim é fácil comprovar, durante
 * a apresentação, que o estado interno e a posição de scroll de cada
 * visualização são preservados ao trocar de abas.
 */
export function MockView({ title, description, accent }) {
  const [clicks, setClicks] = useState(0);
  const [note, setNote] = useState('');

  return (
    <div className={styles.mock} style={{ '--mock-accent': accent }}>
      <header className={styles.header}>
        <p className={styles.badge}>visualização de demonstração</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </header>

      <section className={styles.statePanel}>
        <h2 className={styles.panelTitle}>Teste de preservação de estado</h2>
        <p className={styles.panelHint}>
          Interaja abaixo, role a página, troque de aba e volte: o estado e a
          posição de rolagem desta visualização devem permanecer exatamente
          como você os deixou.
        </p>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.counterButton}
            onClick={() => setClicks((value) => value + 1)}
          >
            Cliques: {clicks}
          </button>
          <input
            className={styles.noteInput}
            type="text"
            placeholder="Digite algo e troque de aba…"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </div>
      </section>

      <div className={styles.content}>
        {Array.from({ length: 10 }, (_, index) => (
          <section key={index} className={styles.block}>
            <span className={styles.blockIndex}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className={styles.blockBody}>
              <div className={styles.blockLine} />
              <div className={styles.blockLine} />
              <div className={`${styles.blockLine} ${styles.blockLineShort}`} />
            </div>
          </section>
        ))}
        <p className={styles.endNote}>
          Fim do conteúdo de teste — a rolagem desta visualização termina aqui.
        </p>
      </div>
    </div>
  );
}
