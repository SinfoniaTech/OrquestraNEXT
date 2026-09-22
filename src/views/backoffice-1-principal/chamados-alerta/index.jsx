/**
 * CENA "CHAMADOS — ALERTA" — 73% do SLA consumido, chamado em risco (14:24).
 * Cena fina dentro da pasta backoffice: apenas renderiza a view com a tela
 * Chamados no estágio correspondente. Não está em scenes.config.js; adicione-
 * a por lá quando quiser incluí-la na apresentação.
 */
import BackofficeView from '../BackofficeView.jsx';

export default function ChamadosAlertaScene() {
  return <BackofficeView telaInicial="chamadas" stageChamados="alerta" />;
}
