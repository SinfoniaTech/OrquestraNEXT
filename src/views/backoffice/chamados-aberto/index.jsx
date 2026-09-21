/**
 * CENA "CHAMADOS — ABERTO" — sequência de chegadas: #CH-0008161 e #CH-0008162
 * entram um a um e o protagonista #CH-0008163 chega por último (14:02).
 * Cena fina dentro da pasta backoffice: apenas renderiza a view com a tela
 * Chamados no estágio correspondente. Não está em scenes.config.js; adicione-
 * a por lá quando quiser incluí-la na apresentação.
 */
import BackofficeView from '../BackofficeView.jsx';

export default function ChamadosAbertoScene() {
  return <BackofficeView telaInicial="chamadas" stageChamados="aberto" />;
}
