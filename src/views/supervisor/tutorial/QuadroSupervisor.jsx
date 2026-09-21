import supStyles from '../SupervisorView.module.css';
import styles from './tutorial.module.css';
import SupervisorHeader from '../components/SupervisorHeader.jsx';
import BarraInferior from './BarraInferior.jsx';

/**
 * "Celular" do Supervisor para as cenas do tutorial.
 *
 * Reaproveita exatamente a mesma estrutura do SupervisorView (stage → shell →
 * header + main + barra inferior + overlay) e o mesmo CSS Module — inclusive os
 * tokens --sup-*, que vivem na classe .stage. A diferença é que aqui o estado
 * vem de FORA (props), para o roteiro da cena controlar o que aparece.
 *
 * Props:
 * - notificacoes / onOpenNotifications: badge e clique do sino do header;
 * - badgeAlertas: selo do item "Alertas" da barra inferior (0 = sem selo);
 * - onSelectNav: toque num item da barra inferior (recebe o id do item);
 * - entrada: toca a animação de chegada do "aparelho" (Cena 1);
 * - sinoTocando: balança o sino (Cena 5);
 * - sobreposicao: nó renderizado por cima de tudo, dentro do shell (o aviso);
 * - mainRef: acesso ao contêiner de rolagem (as cenas o usam para voltar
 *   ao topo ao abrir/fechar o detalhe de um chamado).
 */
export default function QuadroSupervisor({
  notificacoes = 0,
  onOpenNotifications,
  badgeAlertas = 0,
  onSelectNav,
  entrada = false,
  sinoTocando = false,
  sobreposicao = null,
  mainRef,
  children,
}) {
  const classes = [
    supStyles.stage,
    entrada ? styles.entrada : '',
    sinoTocando ? styles.sinoTocando : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div className={supStyles.shell}>
        <SupervisorHeader
          notificacoes={notificacoes}
          onOpenNotifications={onOpenNotifications}
        />

        <main className={supStyles.main} ref={mainRef}>
          {children}
        </main>

        {/* A tela do tutorial é sempre a aba "Chamados"; a barra inferior é só cenário. */}
        <BarraInferior
          activeItem="chamados"
          badgeAlertas={badgeAlertas}
          onSelectItem={onSelectNav}
        />

        {sobreposicao}
      </div>
    </div>
  );
}
