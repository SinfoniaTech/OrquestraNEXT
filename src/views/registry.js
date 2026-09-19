import { VisaoGeral } from './mocks/VisaoGeral.jsx';
import { Dashboard } from './mocks/Dashboard.jsx';
import BackofficeView from './backoffice/BackofficeView.jsx';
import SupervisorView from './supervisor/SupervisorView.jsx';

/**
 * REGISTRO CENTRAL DAS VISUALIZAÇÕES DO APRESENTADOR.
 *
 * Este arquivo é a fonte única de verdade sobre "o que pode ser exibido".
 * A ORDEM do array define a ordem das abas na barra inferior.
 *
 * Como adicionar uma nova visualização:
 *   1. crie o componente da página (ex.: src/views/MinhaPagina.jsx);
 *   2. importe-o e adicione uma entrada abaixo;
 *   3. pronto — a nova aba surge automaticamente, sem tocar no container.
 *
 * Cada entrada precisa de:
 *   - id:         identificador único (usado como chave de seleção e nos
 *                 ids de acessibilidade "view-tab-<id>" / "view-pane-<id>");
 *   - label:      nome exibido na aba;
 *   - component:  componente React renderizado dentro do Viewport quando
 *                 a aba estiver ativa.
 */
export const viewRegistry = [
  { id: 'backoffice', label: 'Backoffice', component: BackofficeView },
  { id: 'supervisor', label: 'Supervisor', component: SupervisorView },
  { id: 'visao-geral', label: 'Visão Geral', component: VisaoGeral },
  { id: 'dashboard', label: 'Dashboard', component: Dashboard },
];
