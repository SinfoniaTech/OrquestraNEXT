import Icon from '../components/icons.jsx';
import styles from '../BackofficeView.module.css';

/**
 * Tela placeholder para os módulos do menu que a referência expõe sem
 * conteúdo próprio (Chamados, Contratos, Equipamentos...). Mantém a
 * navegação viva dentro da View, no visual da referência.
 */
export default function PlaceholderScreen({ item }) {
  return (
    <div className={styles.placeholder}>
      <span className={styles.placeholderIcon}>
        <Icon name={item.icon} size={28} />
      </span>
      <h2 className={styles.placeholderTitle}>{item.label}</h2>
      <p className={styles.placeholderText}>
        Módulo em construção. A execução deste domínio permanece nos sistemas OTIS;
        esta camada exibirá os indicadores consolidados quando a integração for conectada.
      </p>
    </div>
  );
}
