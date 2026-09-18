import { useEffect, useRef } from 'react';
import styles from '../SupervisorView.module.css';
import {
  AlertTriangleIcon,
  ChevronDownIcon,
  XIcon,
} from './icons.jsx';

/**
 * Modal "Alerta – Risco de Estouro de SLA".
 *
 * Fiel à referência: overlay com blur, cartão com sombra crítica, cabeçalho
 * em fundo crítica-soft (o cabeçalho inteiro é um botão que fecha, com o ✕
 * à direita), lista de ações recomendadas e rodapé com as ações
 * "Ver detalhes" (primário, navy) e "Fechar" (outline).
 *
 * Acessibilidade: role="dialog" + aria-modal, Esc fecha, foco inicial no
 * botão primário e retorno do foco ao elemento que abriu o modal.
 */
export default function SlaAlertModal({ alerta, onClose, onVerDetalhes }) {
  const primaryRef = useRef(null);
  const openerRef = useRef(null);

  useEffect(() => {
    openerRef.current = document.activeElement;
    primaryRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (openerRef.current instanceof HTMLElement) {
        openerRef.current.focus();
      }
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Alerta de risco de estouro de SLA"
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.modalHeader}
          onClick={onClose}
          aria-label="Fechar alerta"
        >
          <span className={styles.modalIconWrap}>
            <AlertTriangleIcon size={20} />
          </span>
          <span className={styles.modalTitles}>
            <span className={styles.modalTitle}>{alerta.titulo}</span>
            <span className={styles.modalText}>
              O chamado <strong>#{alerta.chamadoId}</strong> está com risco de
              estourar o SLA em{' '}
              <strong className={styles.modalMinutos}>
                {alerta.minutos} minutos
              </strong>
              .
            </span>
          </span>
          <XIcon size={20} className={styles.modalCloseIcon} />
        </button>

        <div className={styles.modalBody}>
          <div className={styles.modalSection}>
            <p className={styles.modalSectionTitle}>AÇÃO RECOMENDADA</p>
            <ul className={styles.modalList}>
              {alerta.acoes.map((acao) => (
                <li key={acao}>• {acao}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            ref={primaryRef}
            className={styles.primaryButton}
            onClick={onVerDetalhes}
          >
            Ver detalhes
            <ChevronDownIcon size={16} />
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
