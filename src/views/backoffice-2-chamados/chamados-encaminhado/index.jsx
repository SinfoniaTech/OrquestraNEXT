/**
 * CENA "CHAMADOS — ENCAMINHADO" — #CH-0008182 ao supervisor da região Centro (14:05).
 * Cena fina dentro da pasta backoffice: apenas renderiza a view com a tela
 * Chamados no estágio correspondente. Não está em scenes.config.js; adicione-
 * a por lá quando quiser incluí-la na apresentação.
 */
import BackofficeView from '../BackofficeView.jsx';

export default function ChamadosEncaminhadoScene() {
  return <BackofficeView telaInicial="chamadas" stageChamados="encaminhado" />;
}
