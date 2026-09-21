import styles from '../SupervisorView.module.css';
import { CHAMADOS, DETALHES_CHAMADOS } from '../data/chamados.js';
import PriorityBadge from '../components/PriorityBadge.jsx';
import {
  ChevronLeftIcon,
  MessageCircleIcon,
  PhoneIcon,
} from '../components/icons.jsx';

/** Lookup do chamado pelo id (a lista de chamados é a fonte da verdade). */
const POR_ID = new Map(CHAMADOS.map((chamado) => [chamado.id, chamado]));

/**
 * Tela de detalhe do chamado (rota /chamados/:id da referência).
 *
 * Sobreposta à tela ativa da bottom nav quando um chamado é aberto — o
 * header, a bottom nav e o modal de alerta continuam no shell. Na
 * referência, apenas a aba "Resumo" tem conteúdo: "Linha do Tempo" e
 * "Histórico" são exibidas inertes (placeholder), como aqui.
 *
 * Seções (fiéis à referência):
 * - cabeçalho: link "← Chamadas", badge de prioridade + id e tempo
 *   restante de SLA colorido pela criticidade;
 * - EVENTO: defeito, cliente, equipamento, endereço · região e chip
 *   opcional (ex.: "Passageiro preso");
 * - IMPACTO TEMPORAL: solução prevista (SLA), tempo decorrido (TA) e
 *   tempo restante (TB);
 * - AÇÕES SUGERIDAS PELO ORQUESTRA: status do técnico, peça mais rápida
 *   e a lista de ações recomendadas;
 * - rodapé: "Ligar técnico" (primário) e "WhatsApp" (outline) — mocks
 *   visuais, sem ação real.
 */
export default function ChamadoDetalheView({
  chamadoId,
  onVoltar,
  chamado: chamadoProp = null,
  detalhe: detalheProp = null,
}) {
  // chamado/detalhe são opcionais: quando não vêm por props, a tela busca
  // pelo id em data/chamados.js (comportamento original). As cenas do
  // tutorial os informam para exibir a demanda fictícia, que só existe lá.
  const chamado = chamadoProp ?? POR_ID.get(chamadoId);
  const detalhe = detalheProp ?? DETALHES_CHAMADOS[chamadoId];

  // Defensivo: id sem chamado/detalhe correspondente (dados desalinhados).
  if (!chamado || !detalhe) {
    return (
      <section className={styles.titleSection}>
        <h1 className={styles.title}>Chamado não encontrado</h1>
        <p className={styles.subtitle}>
          O chamado #{chamadoId} não existe nesta operação.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className={styles.titleSection}>
        <button type="button" className={styles.voltarLink} onClick={onVoltar}>
          <ChevronLeftIcon size={16} />
          Chamadas
        </button>

        <h1 className={styles.detalheTituloRow}>
          <PriorityBadge prioridade={chamado.prioridade} />
          <span className={styles.cardId}>#{chamado.id}</span>
        </h1>
        <p className={`${styles.detalheSla} ${styles[chamado.prioridade]}`}>
          {chamado.slaTexto}
        </p>

        <div className={styles.tabs}>
          <span className={`${styles.tab} ${styles.tabAtiva}`}>Resumo</span>
          <span className={styles.tab} title="Conteúdo ainda não implementado">
            Linha do Tempo
          </span>
          <span className={styles.tab} title="Conteúdo ainda não implementado">
            Histórico
          </span>
        </div>
      </section>

      <div className={styles.list}>
        <section
          className={`${styles.panel} ${styles.cardShadow}`}
          aria-label="Evento do chamado"
        >
          <h2 className={styles.panelTitle}>EVENTO</h2>
          <p className={styles.detalheDefeito}>{chamado.defeito}</p>
          <p className={styles.detalheLinha}>{chamado.local}</p>
          <p className={styles.detalheLinha}>{chamado.equipamento}</p>
          <p className={styles.detalheLinha}>
            {detalhe.endereco} · {detalhe.regiao}
          </p>
          {chamado.tag ? (
            <span className={styles.cardTag}>{chamado.tag}</span>
          ) : null}
        </section>

        <section
          className={`${styles.panel} ${styles.cardShadow}`}
          aria-label="Impacto temporal"
        >
          <h2 className={styles.panelTitle}>IMPACTO TEMPORAL</h2>
          <dl className={styles.impactoGrid}>
            <div className={styles.impactoItem}>
              <dt className={styles.impactoLabel}>Solução prevista (SLA)</dt>
              <dd className={styles.impactoValor}>
                {detalhe.impacto.slaPrevista}
              </dd>
            </div>
            <div className={styles.impactoItem}>
              <dt className={styles.impactoLabel}>Tempo decorrido (TA)</dt>
              <dd className={styles.impactoValor}>{detalhe.impacto.ta}</dd>
            </div>
            <div className={styles.impactoItem}>
              <dt className={styles.impactoLabel}>Tempo restante (TB)</dt>
              <dd
                className={`${styles.impactoValor} ${
                  styles[chamado.prioridade]
                }`}
              >
                {detalhe.impacto.tb}
              </dd>
            </div>
          </dl>
        </section>

        <section
          className={`${styles.panel} ${styles.cardShadow}`}
          aria-label="Ações sugeridas pelo Orquestra"
        >
          <h2 className={styles.panelTitle}>AÇÕES SUGERIDAS PELO ORQUESTRA</h2>

          <div className={styles.recursoCard}>
            <h3 className={styles.recursoTitulo}>Status do técnico</h3>
            <p className={styles.recursoNome}>
              {detalhe.tecnico.nome} – {detalhe.tecnico.status}
            </p>
            <p className={styles.recursoMeta}>
              Distância: {detalhe.tecnico.distancia} · ETA:{' '}
              {detalhe.tecnico.eta}
            </p>
          </div>

          <div className={styles.recursoCard}>
            <h3 className={styles.recursoTitulo}>Peça mais rápida</h3>
            <p className={styles.recursoNome}>{detalhe.peca.local}</p>
            <p className={styles.recursoMeta}>
              {detalhe.peca.endereco} · ETA: {detalhe.peca.eta}
            </p>
            <p className={styles.recursoMeta}>
              {detalhe.peca.itens.join(' · ')}
            </p>
          </div>

          <ul className={styles.padroesList}>
            {detalhe.acoes.map((acao) => (
              <li key={acao}>• {acao}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className={styles.detalheAcoes}>
        <button type="button" className={styles.primaryButton}>
          <PhoneIcon size={16} />
          Ligar técnico
        </button>
        <button type="button" className={styles.secondaryButton}>
          <MessageCircleIcon size={16} />
          WhatsApp
        </button>
      </div>
    </>
  );
}
