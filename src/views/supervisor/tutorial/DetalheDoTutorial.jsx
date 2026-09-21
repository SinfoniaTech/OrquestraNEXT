import ChamadoDetalheView from '../screens/ChamadoDetalheView.jsx';
import styles from './tutorial.module.css';
import { DETALHES_ALVO, ETAPAS_ALVO, ID_ALVO } from './dados.js';

/**
 * Depois de clicar num botão da tela de detalhe (Ligar técnico, WhatsApp,
 * "← Chamadas"...), o foco é solto: com um botão focado, o Espaço do
 * apresentador ativaria o botão em vez de avançar a cena.
 */
function soltarFocoDoBotao(event) {
  event.target.closest?.('button')?.blur();
}

/**
 * Tela de detalhe do chamado aberto pelo clique no card, nas cenas do tutorial.
 *
 * Reaproveita o ChamadoDetalheView do app (mesma tela do print de referência:
 * "← Chamadas", pill de criticidade, abas, EVENTO, IMPACTO TEMPORAL e AÇÕES
 * SUGERIDAS). Para os chamados que já existem em data/chamados.js basta o id
 * (a tela os busca sozinha). A demanda do tutorial só existe em dados.js, e o
 * detalhe dela depende da criticidade em que ela está agora — por isso a cena
 * informa `etapaAlvo` ('normal' | 'media' | 'alta' | 'critica').
 *
 * Entra com um fade + leve deslize lateral (ver .detalheEntra).
 */
export default function DetalheDoTutorial({ chamadoId, etapaAlvo, onVoltar }) {
  const ehAlvo = chamadoId === ID_ALVO;

  return (
    <div className={styles.detalheEntra} onClick={soltarFocoDoBotao}>
      <ChamadoDetalheView
        chamadoId={chamadoId}
        onVoltar={onVoltar}
        chamado={ehAlvo ? ETAPAS_ALVO[etapaAlvo] : null}
        detalhe={ehAlvo ? DETALHES_ALVO[etapaAlvo] : null}
      />
    </div>
  );
}
