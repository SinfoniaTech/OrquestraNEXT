import PresentationContainer from './components/PresentationContainer.jsx';

/**
 * Ponto de entrada da aplicação.
 *
 * Toda a lógica do apresentador (estado da aba ativa, viewport, barra de
 * abas e registro de visualizações) vive em <PresentationContainer /> e
 * seus filhos. Este componente existe apenas para montar o apresentador.
 */
export default function App() {
  return <PresentationContainer />;
}
