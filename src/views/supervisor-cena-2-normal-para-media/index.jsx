import CenaTransicao from '../supervisor/tutorial/CenaTransicao.jsx';

/**
 * CENA 2 — Transição de criticidade: a demanda do Hospital Central Paulista
 * (elevador de leitos) passa de NORMAL para MÉDIA.
 *
 * Começa igual à Cena 1 (lista toda NORMAL, com "Sem chamados prioritários").
 * Ao virar MÉDIA, a mensagem some e, como o SLA encolhe para 3h10, a demanda
 * permanece na mesma posição nesta cena. A subida ao topo acontece na cena seguinte.
 *
 * Toda a mecânica (fases, animações e tempos) está em
 * supervisor/tutorial/CenaTransicao.jsx; esta cena só escolhe as etapas.
 *
 * Props do controlador (README): isActive e side ("full" | "left" | "right").
 */
export default function SupervisorCena2({ isActive = true, side = 'full' }) {
  return <CenaTransicao de="normal" para="media" movimentar={false} />;
}
