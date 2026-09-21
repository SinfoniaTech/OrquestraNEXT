import { useEffect } from 'react';
import Badge from './Badge.jsx';
import Icon from './icons.jsx';
import SlaBar from './SlaBar.jsx';
import { ORIGEM_TONE, ORIGENS, PRIORIDADES, STATUS_LABEL, STATUS_TONE } from '../data/chamadosData.js';
import styles from '../chamados.module.css';

/**
 * PAINEL "DETALHES DO CHAMADO" — abre SOMENTE ao clicar em uma linha da
 * fila. Painel lateral (~1/3 da largura) que desliza da direita SOBRE a
 * fila, sem reflow da tabela (posição absoluta + transform/opacity).
 *
 * Fechar: botão X, tecla Esc ou clique no pano de fundo. Nenhuma outra tecla
 * é capturada — as setas e o Espaço continuam navegando entre as cenas.
 *
 * Conteúdo: cabeçalho (ID, status, prioridade), bloco de dados e LINHA DO
 * TEMPO vertical com selo de origem de cada evento. A entrada escalonada
 * dos eventos roda quando o painel ABRE (montagem), com atraso por índice;
 * trocar de chamado com o painel aberto troca o conteúdo (key por chamado).
 */
export default function DetalheChamadoPanel({ chamado, onClose }) {
  // Esc fecha o painel; nenhum outro atalho é capturado.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const concluido = chamado.status === 'concluido';

  return (
    <>
      {/* pano de fundo transparente: clique fora fecha */}
      <div className={styles.backdrop} onClick={onClose} />

      <aside
        className={styles.panel}
        role="dialog"
        aria-label={`Detalhes do chamado ${chamado.codigo}`}
      >
        <header className={styles.panelHeader}>
          <div>
            <h3 className={styles.panelCodigo}>{chamado.codigo}</h3>
            <div className={styles.panelBadges}>
              <Badge text={STATUS_LABEL[chamado.status]} tone={STATUS_TONE[chamado.status]} />
              <Badge
                text={PRIORIDADES[chamado.prioridade].label}
                tone={PRIORIDADES[chamado.prioridade].tone}
              />
            </div>
          </div>
          <button type="button" className={styles.panelClose} onClick={onClose} aria-label="Fechar detalhes">
            <Icon name="x" size={16} />
          </button>
        </header>

        <div className={styles.panelDados}>
          <Dado label="Local" value={chamado.local} />
          <Dado label="Equipamento" value={chamado.equipamento} />
          <Dado label="Contrato" value={chamado.contrato} />
          <Dado label="Ocorrência" value={chamado.ocorrencia} />
          <Dado label="Região" value={chamado.regiao ?? '—'} />
          <Dado label="Responsável" value={chamado.responsavel ?? '—'} />
          <div className={styles.dadoItem}>
            <span className={styles.dadoLabel}>SLA de chegada</span>
            <SlaBar pct={chamado.slaPct} remaining={chamado.slaRestante} concluded={concluido} />
          </div>
        </div>

        {/* Linha do tempo — key por chamado reexecuta a entrada escalonada */}
        <h4 className={styles.timelineTitle}>Linha do tempo</h4>
        <ol className={styles.timeline} key={chamado.id}>
          {chamado.timeline.map((ev, i) => (
            <li key={`${ev.hora}-${i}`} className={styles.timelineEvent} style={{ '--tl-i': i }}>
              <span className={styles.timelineHora}>{ev.hora}</span>
              <div className={styles.timelineBody}>
                <p className={styles.timelineDesc}>{ev.desc}</p>
                <span className={`${styles.timelineOrigem} ${styles[`origem-${ORIGEM_TONE[ev.origem]}`]}`}>
                  {ORIGENS[ev.origem]}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </aside>
    </>
  );
}

/** Campo do bloco de dados do painel. */
function Dado({ label, value }) {
  return (
    <div className={styles.dadoItem}>
      <span className={styles.dadoLabel}>{label}</span>
      <span className={styles.dadoValor}>{value}</span>
    </div>
  );
}
