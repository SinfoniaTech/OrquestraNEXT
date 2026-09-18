import { MockView } from '../mocks/MockView.jsx';

/**
 * Placeholder "Backoffice" — primeira aba do seletor principal.
 * Será substituído pela aplicação real de Backoffice quando ela for
 * implementada; por ora reutiliza o MockView para demonstrar a navegação.
 */
export function BackofficeView() {
  return (
    <MockView
      title="Backoffice"
      description="Visualização placeholder. Este espaço será ocupado pela aplicação real de Backoffice. A segunda aba, Supervisor, já contém a primeira visualização real do OrquestraNEXT."
      accent="#1b0435"
    />
  );
}
