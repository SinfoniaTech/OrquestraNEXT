import SceneController from './components/SceneController.jsx';

/**
 * Ponto de entrada da aplicação.
 *
 * Toda a lógica do controlador de cenas (descoberta das cenas em
 * src/views/, ordem em src/scenes.config.js, navegação por teclado,
 * sincronização com a URL e layout do palco) vive em <SceneController />
 * e nos módulos que ele usa. Este componente existe apenas para montá-lo.
 */
export default function App() {
  return <SceneController />;
}

