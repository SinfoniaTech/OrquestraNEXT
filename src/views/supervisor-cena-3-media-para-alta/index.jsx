import CenaTransicao from '../supervisor/tutorial/CenaTransicao.jsx';

/**
 * CENA 3 — Transição de criticidade: a demanda do Hospital Central Paulista
 * (elevador de leitos) passa de MÉDIA para ALTA.
 *
 * Continua de onde a Cena 2 terminou (a demanda MÉDIA no topo da lista).
 * Ao virar ALTA o problema evolui para desnível na parada da UTI.
 *
 * Toda a mecânica (fases, animações e tempos) está em
 * supervisor/tutorial/CenaTransicao.jsx; esta cena só escolhe as etapas.
 *
 * Props do controlador (README): isActive e side ("full" | "left" | "right").
 */
export default function SupervisorCena3({ isActive = true, side = 'full' }) {
  return <CenaTransicao de="media" para="alta" />;
}
