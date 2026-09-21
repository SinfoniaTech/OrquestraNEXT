import { useEffect, useState } from 'react';
import sup from '../SupervisorView.module.css';
import styles from './AvisoCritico.module.css';
import {
  AlertTriangleIcon,
  ChevronDownIcon,
  MessageCircleIcon,
  PhoneIcon,
  XIcon,
} from '../components/icons.jsx';
import { PackageIcon, UserIcon } from './icones.jsx';

/**
 * Depois de clicar, o botão devolve o foco: com um botão focado, o Espaço do
 * apresentador ativaria o botão em vez de avançar a cena.
 */
const soltarFoco = (event) => event.currentTarget.blur();

/**
 * O aviso de chamado crítico da Cena 5: sobe até o Supervisor e, ao clicar em
 * "Ver detalhes", CRESCE mostrando os detalhes do chamado ali mesmo — sem
 * sair da tela nem abrir a lista geral de chamados.
 *
 * Espelha o SlaAlertModal do app (mesmas classes: overlay, cartão, cabeçalho
 * crítico, "Ação recomendada" e rodapé), acrescentando o estado expandido:
 *   - AÇÕES SUGERIDAS PELO ORQUESTRA: status do técnico e peça mais rápida;
 *   - IMPACTO TEMPORAL: solução prevista (SLA), tempo decorrido (TA) e
 *     tempo restante (TB);
 *   - Ligar técnico / WhatsApp (só visuais aqui) e "Abrir chamado completo",
 *     que chama onAbrirChamado: a cena fecha o aviso e abre a tela de detalhe
 *     do chamado (a mesma do clique no card);
 *   - o botão vira "Recolher detalhes" (seta para cima).
 *
 * Como cresce: a área de detalhes fica sempre no DOM, numa linha de grid que
 * vai de 0fr a 1fr; o cartão (altura automática, com teto de 85%) acompanha
 * e, passando do teto, o corpo passa a rolar por dentro. Os blocos entram em
 * cascata. Tudo em AvisoCritico.module.css, sem JS de animação.
 *
 * Esc, clique fora, cabeçalho e "Fechar" fecham o aviso (como no app). O
 * <div> externo só posiciona o aviso dentro do shell e recebe a animação de
 * subida.
 */
export default function AvisoCritico({ alerta, detalhe, onClose, onAbrirChamado }) {
  const [expandido, setExpandido] = useState(false);

  useEffect(() => {
    const aoTeclar = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', aoTeclar);
    // Solta o foco inicial (ver soltarFoco): Espaço/setas seguem navegando as cenas.
    document.activeElement?.blur?.();
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [onClose]);

  const alternar = (event) => {
    setExpandido((atual) => !atual);
    soltarFoco(event);
  };

  const { tecnico, peca, impacto } = detalhe;

  return (
    <div className={styles.aviso}>
      <div className={sup.overlay} onClick={onClose}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Alerta de risco de estouro de SLA"
          className={sup.modal}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className={sup.modalHeader}
            onClick={onClose}
            aria-label="Fechar alerta"
          >
            <span className={sup.modalIconWrap}>
              <AlertTriangleIcon size={20} />
            </span>
            <span className={sup.modalTitles}>
              <span className={sup.modalTitle}>{alerta.titulo}</span>
              <span className={sup.modalText}>
                O chamado <strong>#{alerta.chamadoId}</strong> está com risco de estourar o SLA em{' '}
                <strong className={sup.modalMinutos}>{alerta.minutos} minutos</strong>.
              </span>
            </span>
            <XIcon size={20} className={sup.modalCloseIcon} />
          </button>

          <div className={sup.modalBody}>
            <div className={sup.modalSection}>
              <p className={sup.modalSectionTitle}>AÇÃO RECOMENDADA</p>
              <ul className={sup.modalList}>
                {alerta.acoes.map((acao) => (
                  <li key={acao}>• {acao}</li>
                ))}
              </ul>
            </div>

            <div
              id="aviso-detalhes"
              className={`${styles.detalhes} ${expandido ? styles.detalhesAberto : ''}`}
              aria-hidden={!expandido}
              inert={!expandido}
            >
              <div className={styles.detalhesInterno}>
                <div className={styles.detalhesConteudo}>
                  <section
                    className={styles.bloco}
                    style={{ '--k': 0 }}
                    aria-label="Ações sugeridas pelo Orquestra"
                  >
                    <p className={sup.modalSectionTitle}>AÇÕES SUGERIDAS PELO ORQUESTRA</p>

                    <div className={`${styles.recurso} ${sup.cardShadow}`}>
                      <span className={styles.recursoIcone}>
                        <UserIcon size={20} />
                      </span>
                      <div className={styles.recursoTexto}>
                        <h3 className={styles.recursoTitulo}>Status do técnico</h3>
                        <p className={styles.recursoLinha}>
                          {tecnico.nome} – {tecnico.status}
                        </p>
                        <p className={styles.recursoLinha}>
                          Distância: {tecnico.distancia} · ETA: {tecnico.eta}
                        </p>
                      </div>
                    </div>

                    <div className={`${styles.recurso} ${sup.cardShadow}`}>
                      <span className={styles.recursoIcone}>
                        <PackageIcon size={20} />
                      </span>
                      <div className={styles.recursoTexto}>
                        <h3 className={styles.recursoTitulo}>Peça mais rápida</h3>
                        <p className={styles.recursoLinha}>{peca.local}</p>
                        <p className={styles.recursoLinha}>
                          {peca.endereco} · ETA: {peca.eta}
                        </p>
                        <p className={styles.recursoLinha}>{peca.itens.join(' · ')}</p>
                      </div>
                    </div>
                  </section>

                  <section
                    className={`${styles.painel} ${sup.cardShadow} ${styles.bloco}`}
                    style={{ '--k': 1 }}
                    aria-label="Impacto temporal"
                  >
                    <p className={sup.modalSectionTitle}>IMPACTO TEMPORAL</p>
                    <dl className={styles.impacto}>
                      <div className={styles.tile}>
                        <dt className={styles.tileRotulo}>Solução prevista (SLA)</dt>
                        <dd className={styles.tileValor}>{impacto.slaPrevista}</dd>
                      </div>
                      <div className={styles.tile}>
                        <dt className={styles.tileRotulo}>Tempo decorrido (TA)</dt>
                        <dd className={styles.tileValor}>{impacto.ta}</dd>
                      </div>
                      <div className={styles.tile}>
                        <dt className={styles.tileRotulo}>Tempo restante (TB)</dt>
                        <dd className={`${styles.tileValor} ${styles.tileCritico}`}>{impacto.tb}</dd>
                      </div>
                    </dl>
                  </section>

                  <div className={`${styles.botoes} ${styles.bloco}`} style={{ '--k': 2 }}>
                    <button type="button" className={sup.primaryButton} onClick={soltarFoco}>
                      <PhoneIcon size={16} />
                      Ligar técnico
                    </button>
                    <button
                      type="button"
                      className={`${sup.primaryButton} ${styles.whatsapp}`}
                      onClick={soltarFoco}
                    >
                      <MessageCircleIcon size={16} />
                      WhatsApp
                    </button>
                  </div>

                  <button
                    type="button"
                    className={`${sup.secondaryButton} ${styles.abrirCompleto} ${styles.bloco}`}
                    style={{ '--k': 3 }}
                    onClick={(event) => {
                      soltarFoco(event);
                      onAbrirChamado?.();
                    }}
                  >
                    Abrir chamado completo
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={sup.modalActions}>
            <button
              type="button"
              className={sup.primaryButton}
              onClick={alternar}
              aria-expanded={expandido}
              aria-controls="aviso-detalhes"
            >
              {expandido ? 'Recolher detalhes' : 'Ver detalhes'}
              <ChevronDownIcon
                size={16}
                className={`${styles.seta} ${expandido ? styles.setaAberta : ''}`}
              />
            </button>
            <button type="button" className={sup.secondaryButton} onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
