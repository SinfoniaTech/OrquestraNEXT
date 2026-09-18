import { useCallback, useState } from 'react';
import { viewRegistry } from '../views/registry.js';
import Viewport from './Viewport.jsx';
import TabBar from './TabBar.jsx';
import styles from './PresentationContainer.module.css';

/**
 * Camada externa do apresentador — a única dona do estado da aba ativa.
 *
 * Responsabilidades:
 * - manter o estado "visualização ativa" (activeViewId);
 * - montar o layout geral: área de visualização (flexível) em cima e barra
 *   de abas (fixa) embaixo;
 * - fornecer o registro de visualizações para os filhos via props.
 *
 * Este componente NÃO conhece nenhuma visualização específica: as
 * visualizações disponíveis vivem exclusivamente no registro
 * (src/views/registry.js). Adicionar uma nova página nunca exige mexer aqui.
 */
export default function PresentationContainer() {
  const [selectedViewId, setSelectedViewId] = useState(
    () => viewRegistry[0]?.id ?? null,
  );

  const handleSelectView = useCallback((viewId) => {
    setSelectedViewId(viewId);
  }, []);

  // Garantia defensiva: se o id selecionado não existir no registro
  // (ex.: registro alterado em runtime), cai de volta para a primeira aba.
  const activeViewId = viewRegistry.some((view) => view.id === selectedViewId)
    ? selectedViewId
    : viewRegistry[0]?.id ?? null;

  return (
    <div className={styles.container}>
      <Viewport registry={viewRegistry} activeViewId={activeViewId} />
      <TabBar
        registry={viewRegistry}
        activeViewId={activeViewId}
        onSelectView={handleSelectView}
      />
    </div>
  );
}
