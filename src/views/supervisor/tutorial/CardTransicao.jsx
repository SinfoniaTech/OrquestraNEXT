import { useLayoutEffect, useRef, useState } from 'react';
import ChamadoCard from '../components/ChamadoCard.jsx';
import styles from './CardTransicao.module.css';

/**
 * O card do chamado-alvo mudando de criticidade (ex.: NORMAL → MÉDIA).
 *
 * Empilha DUAS instâncias do ChamadoCard original (a criticidade de origem
 * embaixo, a de destino em cima, sobrepostas). Quando `escalado` liga, a de
 * cima aparece em fade: o que é igual nas duas (local, equipamento, id) fica
 * sólido, e o que muda (faixa lateral, pill, texto do problema, tempo de SLA,
 * sombra) faz a transição de verdade — sem tocar no ChamadoCard.
 *
 * As duas versões podem ter alturas diferentes (a CRÍTICA tem o chip
 * "Paciente preso"): a altura do contêiner é medida e animada de uma para a
 * outra, e os cards abaixo acompanham a mudança em vez de "pular".
 *
 * Só uma camada é interativa/lida por leitor de tela por vez (inert +
 * aria-hidden na outra) — a visível abre o detalhe do chamado (onOpen).
 */
export default function CardTransicao({ de, para, escalado, onOpen = null }) {
  const origemRef = useRef(null);
  const destinoRef = useRef(null);
  // null = ainda não medido (a primeira medição não anima: acontece antes da pintura).
  const [altura, setAltura] = useState(null);

  useLayoutEffect(() => {
    const camada = escalado ? destinoRef.current : origemRef.current;
    if (camada) setAltura(camada.offsetHeight);
  }, [escalado]);

  return (
    <div className={styles.pilha} style={altura == null ? undefined : { height: altura }}>
      <div
        ref={origemRef}
        className={`${styles.camada} ${styles.origem} ${escalado ? styles.origemOculta : ''}`}
        aria-hidden={escalado}
        inert={escalado}
      >
        <ChamadoCard chamado={de} onOpen={onOpen} />
      </div>
      <div
        ref={destinoRef}
        className={`${styles.camada} ${styles.destino} ${escalado ? styles.visivel : ''}`}
        aria-hidden={!escalado}
        inert={!escalado}
      >
        <ChamadoCard chamado={para} onOpen={onOpen} />
      </div>
    </div>
  );
}
