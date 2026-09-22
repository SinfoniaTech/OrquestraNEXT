import { useEffect, useRef, useState } from 'react';

/** true quando o usuário pede movimento reduzido (animações desligadas). */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Número com contagem animada (transform/opacity-free, só texto):
 * - na montagem, se `from` for informado, anima de `from` até `value`
 *   (usado para animar o KPI do valor do estágio anterior até o atual);
 * - nas mudanças seguintes, anima sempre a partir do último valor exibido
 *   (usado na sequência de chegadas do estágio "aberto");
 * - com prefers-reduced-motion, salta direto para o valor final.
 */
export default function AnimatedNumber({ value, from = null, format = String, durationMs = 650 }) {
  const reduced = prefersReducedMotion();
  const [display, setDisplay] = useState(() => (reduced ? value : (from ?? value)));
  // espelha o valor exibido p/ retomar de onde parou se for interrompido
  const displayRef = useRef(display);
  const fromRef = useRef(from);

  useEffect(() => {
    const startValue = fromRef.current ?? displayRef.current;
    fromRef.current = null; // `from` só vale na montagem
    if (reduced || startValue === value) {
      setDisplay(value);
      displayRef.current = value;
      return undefined;
    }
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / durationMs);
      const eased = 1 - (1 - t) ** 3; // easeOutCubic
      const v = Math.round(startValue + (value - startValue) * eased);
      displayRef.current = v;
      setDisplay(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs, reduced]);

  return <>{format(display)}</>;
}
