import supStyles from '../SupervisorView.module.css';
import styles from './tutorial.module.css';
import { AlertTriangleIcon, EllipsisIcon, RadioIcon } from '../components/icons.jsx';

/**
 * Barra de navegação inferior das cenas do tutorial.
 *
 * Espelha o BottomNav do app (mesmas classes, mesmos ícones), com duas
 * diferenças pedidas para a visão do Supervisor no tutorial:
 * - sem o item "Mapa", que não faz parte desta visão;
 * - o selo do item "Alertas" não é fixo: só aparece quando a cena manda
 *   (badgeAlertas > 0), isto é, quando a demanda crítica passa a existir.
 *
 * A aba ativa é sempre "Chamados". Os itens só avisam a cena (onSelectItem);
 * quem decide o que fazer é ela — hoje, tocar em "Chamados" fecha o detalhe
 * de um chamado aberto (ver useChamadoAberto).
 */
export default function BarraInferior({ activeItem = 'chamados', badgeAlertas = 0, onSelectItem }) {
  const itens = [
    { id: 'chamados', label: 'Chamados', Icone: RadioIcon, badge: 0 },
    { id: 'alertas', label: 'Alertas', Icone: AlertTriangleIcon, badge: badgeAlertas },
    { id: 'mais', label: 'Mais', Icone: EllipsisIcon, badge: 0 },
  ];

  return (
    <nav className={supStyles.bottomNav} aria-label="Navegação do aplicativo">
      {itens.map(({ id, label, Icone, badge }) => {
        const ativo = id === activeItem;

        return (
          <button
            key={id}
            type="button"
            className={`${supStyles.navItem} ${ativo ? supStyles.navItemActive : ''}`}
            aria-current={ativo ? 'page' : undefined}
            onClick={() => onSelectItem?.(id)}
          >
            <Icone size={20} />
            {label}
            {badge > 0 ? (
              <span className={`${supStyles.navBadge} ${styles.selo}`}>{badge}</span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
