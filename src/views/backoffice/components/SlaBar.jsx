import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './AnimatedNumber.jsx';
import styles from '../chamados.module.css';

/**
 * Barra de consumo do SLA + tempo restante na mesma célula.
 * - tom por consumo (verde/amarelo/laranja/vermelho, via tokens --bk-*);
 * - `prevPct`/`prevTone` permitem TRANSITIR da cor do estágio anterior
 *   para a atual (a cena remonta do zero, então o ponto de partida é dado);
 * - pulso lento enquanto o tom estiver laranja ou vermelho.
 * Não é uma duplicata do ProgressBar genérico: aqui o preenchimento e a
 * cor transicionam e há pulso de alerta.
 */
export default function SlaBar({ pct, prevPct = null, remaining, concluded = false }) {
  const reduced = prefersReducedMotion();
  const currentTone = concluded ? 'success' : toneFor(pct);
  // ponto de partida: cor do estágio anterior (transição, ex.: laranja -> verde)
  const startTone = prevPct == null || reduced ? currentTone : toneFor(prevPct);

  const [tone, setTone] = useState(startTone);
  const widthPct = Math.min(pct, 100);
  const [width, setWidth] = useState(reduced || prevPct == null ? `${widthPct}%` : `${Math.min(prevPct, 100)}%`);
  const rafRef = useRef(null);

  // Após a montagem, transiciona para o estado atual (cor + largura).
  useEffect(() => {
    if (reduced || prevPct == null) return undefined;
    rafRef.current = requestAnimationFrame(() => {
      setTone(currentTone);
      setWidth(`${widthPct}%`);
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, [currentTone, widthPct, prevPct, reduced]);

  const pulsing = tone === 'orange' || tone === 'critical';
  return (
    <div className={styles.slaCell}>
      <div className={styles.slaTrack} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`${styles.slaFill} ${styles[`slaFill-${tone}`]} ${pulsing ? styles.slaPulse : ''}`}
          style={{ width }}
        />
      </div>
      <span className={styles.slaText}>
        {pct}%{remaining ? ` · ${remaining}` : ''}
      </span>
    </div>
  );
}

function toneFor(pct) {
  if (pct > 100) return 'critical';
  if (pct >= 70) return 'orange';
  if (pct >= 50) return 'warning';
  return 'success';
}
