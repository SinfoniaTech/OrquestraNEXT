/**
 * CENA "CHAMADOS — EM ATENDIMENTO" — técnico designado, ETA 4 min (14:26).
 * Cena fina dentro da pasta backoffice: apenas renderiza a view com a tela
 * Chamados no estágio correspondente. Não está em scenes.config.js; adicione-
 * a por lá quando quiser incluí-la na apresentação.
 */
import BackofficeView from '../BackofficeView.jsx';

export default function ChamadosEmAtendimentoScene() {
  return <BackofficeView telaInicial="chamadas" stageChamados="em-atendimento" />;
}
