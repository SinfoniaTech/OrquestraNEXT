import { useState } from 'react';
import { PERIODOS } from '../data/backofficeData.js';
import Icon from './icons.jsx';
import styles from '../BackofficeView.module.css';

/**
 * Header superior da área de conteúdo — sticky, fundo card com blur,
 * borda inferior. Contém campo de busca (ícone de lupa absoluto),
 * título + subtítulo da tela ativa e seletor de período à direita
 * (botão primário com chevron, como o "Últimos 6 meses" da referência).
 */
export default function TopHeader({ title, subtitle, periodo, onChangePeriodo }) {
  const [busca, setBusca] = useState('');
  const [aberto, setAberto] = useState(false);

  return (
    <header className={styles.topHeader}>
      <div className={styles.searchWrap}>
        <Icon name="search" size={16} className={styles.searchIcon} />
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar contrato, cliente, equipamento..."
          className={styles.searchInput}
          aria-label="Buscar"
        />
      </div>

      <div className={styles.topHeaderInfo}>
        <h1 className={styles.topHeaderTitle}>{title}</h1>
        <p className={styles.topHeaderSubtitle}>{subtitle}</p>
      </div>

      <div className={styles.periodWrap}>
        <button
          type="button"
          className={styles.periodButton}
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-haspopup="listbox"
        >
          {periodo}
          <Icon name="chevron-down" size={14} />
        </button>
        {aberto ? (
          <ul className={styles.periodMenu} role="listbox" aria-label="Período">
            {PERIODOS.map((p) => (
              <li key={p}>
                <button
                  type="button"
                  role="option"
                  aria-selected={p === periodo}
                  className={`${styles.periodOption} ${p === periodo ? styles.periodOptionActive : ''}`}
                  onClick={() => {
                    onChangePeriodo(p);
                    setAberto(false);
                  }}
                >
                  {p}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </header>
  );
}
