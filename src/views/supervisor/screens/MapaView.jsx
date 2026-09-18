import styles from '../SupervisorView.module.css';
import { CHAMADOS, REGIOES } from '../data/chamados.js';

/** Lookup de prioridade por id: colore o contador de SLA como na lista. */
const POR_ID = new Map(CHAMADOS.map((chamado) => [chamado.id, chamado]));

/**
 * Tela "Mapa" (/mapa): Mapa operacional — distribuição das chamadas por
 * região. Cada região mostra seus indicadores (ativos, críticos, técnicos
 * e TB médio) e as linhas dos chamados abertos, com o contador de SLA na
 * cor da prioridade do chamado (vermelho crítico, laranja alta, amarelo
 * média), consistente com a lista de chamados.
 */
export default function MapaView() {
  return (
    <>
      <section className={styles.titleSection}>
        <h1 className={styles.title}>Mapa operacional</h1>
        <p className={styles.subtitle}>Distribuição das chamadas por região</p>
      </section>

      <section className={styles.list} aria-label="Distribuição por região">
        {REGIOES.map((regiao) => (
          <article
            key={regiao.nome}
            className={`${styles.panel} ${styles.cardShadow}`}
          >
            <header className={styles.regionHeader}>
              <h2 className={styles.regionName}>{regiao.nome}</h2>
            </header>

            <dl className={styles.regionStats}>
              <div className={styles.regionStat}>
                <dt className={styles.regionStatLabel}>Ativos</dt>
                <dd className={styles.regionStatValue}>{regiao.ativos}</dd>
              </div>
              <div className={styles.regionStat}>
                <dt className={styles.regionStatLabel}>Críticos</dt>
                <dd
                  className={`${styles.regionStatValue} ${
                    regiao.criticos > 0 ? styles.regionStatValueCritico : ''
                  }`}
                >
                  {regiao.criticos}
                </dd>
              </div>
              <div className={styles.regionStat}>
                <dt className={styles.regionStatLabel}>Técnicos</dt>
                <dd className={styles.regionStatValue}>{regiao.tecnicos}</dd>
              </div>
              <div className={styles.regionStat}>
                <dt className={styles.regionStatLabel}>TB médio</dt>
                <dd className={styles.regionStatValue}>{regiao.tbMedio}</dd>
              </div>
            </dl>

            <ul className={styles.regionChamados}>
              {regiao.chamados.map((chamado) => {
                const prioridade =
                  POR_ID.get(chamado.id)?.prioridade ?? 'media';

                return (
                  <li key={chamado.id} className={styles.regionChamado}>
                    <span className={styles.regionChamadoTexto}>
                      <span className={styles.regionChamadoId}>
                        #{chamado.id}
                      </span>{' '}
                      · {chamado.defeito}
                    </span>
                    <span
                      className={`${styles.regionTempo} ${styles[prioridade]}`}
                    >
                      {chamado.tempo}
                    </span>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </section>
    </>
  );
}
