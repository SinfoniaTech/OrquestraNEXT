import CenaTransicao from '../supervisor/tutorial/CenaTransicao.jsx';

/** CENA 3 — A mesma demanda da Smart Fit passa de MÉDIA para ALTA.
 * O contexto permanece exatamente igual; somente o tempo para o SLA diminui.
 */
export default function SupervisorCena3({ isActive = true, side = 'full' }) {
  return <CenaTransicao de="media" para="alta" />;
}
