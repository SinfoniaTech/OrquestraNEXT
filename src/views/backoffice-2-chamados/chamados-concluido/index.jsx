/**
 * CENA "CHAMADOS — CONCLUÍDO" — concluído com TA 28 min, TB 1h10 (15:12).
 * Cena fina dentro da pasta backoffice: apenas renderiza a view com a tela
 * Chamados no estágio correspondente. Não está em scenes.config.js; adicione-
 * a por lá quando quiser incluí-la na apresentação.
 */
import BackofficeView from '../BackofficeView.jsx';

export default function ChamadosConcluidoScene() {
  return <BackofficeView telaInicial="chamadas" stageChamados="concluido" />;
}
