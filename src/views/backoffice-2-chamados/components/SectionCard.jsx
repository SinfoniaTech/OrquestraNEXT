import styles from '../BackofficeView.module.css';

/**
 * Card de seção — container branco com borda, título e subtítulo,
 * usado para agrupar gráficos, tabelas e listas da referência.
 */
export default function SectionCard({ title, subtitle, action, children, className }) {
  return (
    <section className={`${styles.sectionCard} ${className ?? ''}`}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionHeaderText}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          {subtitle ? <p className={styles.sectionSubtitle}>{subtitle}</p> : null}
        </div>
        {action ?? null}
      </div>
      {children}
    </section>
  );
}
