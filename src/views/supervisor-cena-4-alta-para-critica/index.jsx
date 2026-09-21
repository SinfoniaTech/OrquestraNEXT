import CenaTransicao from '../supervisor/tutorial/CenaTransicao.jsx';

/**
 * CENA 4 — Transição de criticidade: a demanda do Hospital Central Paulista
 * (elevador de leitos) passa de ALTA para CRÍTICA.
 *
 * Continua de onde a Cena 3 terminou. Ao virar CRÍTICA o card ganha o chip
 * "Paciente preso" (e cresce para acomodá-lo). O aviso desta criticidade é
 * a Cena 5.
 *
 * Toda a mecânica (fases, animações e tempos) está em
 * supervisor/tutorial/CenaTransicao.jsx; esta cena só escolhe as etapas.
 *
 * Props do controlador (README): isActive e side ("full" | "left" | "right").
 */
export default function SupervisorCena4({ isActive = true, side = 'full' }) {
  return <CenaTransicao de="alta" para="critica" />;
}
