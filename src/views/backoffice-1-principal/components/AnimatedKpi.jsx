import { useEffect, useState } from 'react';
import KpiCard from './KpiCard.jsx';
import AnimatedNumber from './AnimatedNumber.jsx';
import styles from '../chamados.module.css';

/**
 * KPI com valor animado + breve destaque quando o valor muda (chegadas e
 * transições de estágio). Reusa o KpiCard existente; `value` e `from` são
 * números, `format` converte para o texto exibido (ex.: pt-BR 1.254).
 */
export default function AnimatedKpi({ label, value, from = null, format = String, sub, subTone = 'muted' }) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 900);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className={flash ? styles.kpiFlash : undefined}>
      <KpiCard
        label={label}
        value={<AnimatedNumber value={value} from={from} format={format} />}
        sub={sub}
        subTone={subTone}
      />
    </div>
  );
}
