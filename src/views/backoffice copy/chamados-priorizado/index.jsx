/**
 * CENA "CHAMADOS — PRIORIZADO" — #CH-0008182 priorizado como Crítica (14:04).
 * Cena fina dentro da pasta backoffice: apenas renderiza a view com a tela
 * Chamados no estágio correspondente. Não está em scenes.config.js; adicione-
 * a por lá quando quiser incluí-la na apresentação.
 */
import BackofficeView from '../BackofficeView.jsx';

export default function ChamadosPriorizadoScene() {
  return <BackofficeView telaInicial="chamadas" stageChamados="priorizado" />;
}
