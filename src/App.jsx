import { lazy, Suspense } from 'react';
import SceneController from './components/SceneController.jsx';

const BackofficePlatform = lazy(() => import('./platform/BackofficePlatform.jsx'));

/** A apresentação continua como entrada padrão; o modo novo é opt-in. */
export default function App() {
  const platform = new URLSearchParams(window.location.search).get('modo') === 'plataforma';
  if (!platform) return <SceneController />;
  return (
    <Suspense fallback={<p role="status">Carregando BackOffice…</p>}>
      <BackofficePlatform />
    </Suspense>
  );
}
