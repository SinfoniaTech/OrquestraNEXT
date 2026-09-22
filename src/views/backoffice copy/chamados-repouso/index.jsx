/**
 * CENA "CHAMADOS — REPOUSO" — fila já populada, linha de base (14:00).
 * Cena fina dentro da pasta backoffice: apenas renderiza a view com a tela
 * Chamados no estágio correspondente. Não está em scenes.config.js; adicione-
 * a por lá quando quiser incluí-la na apresentação.
 */
import BackofficeView from '../BackofficeView.jsx';

export default function ChamadosRepousoScene() {
  return <BackofficeView telaInicial="chamadas" stageChamados="repouso" />;
}
