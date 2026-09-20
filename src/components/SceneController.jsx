import { Suspense, useCallback, useEffect, useState } from 'react';
import { scenesConfig } from '../scenes.config.js';
import { getSceneComponent, hasScene } from '../scenes/sceneIndex.js';
import styles from './SceneController.module.css';

/**
 * Controlador de cenas — o palco da apresentação ao vivo.
 *
 * Responsabilidades:
 * - montar a linha do tempo de posições a partir de src/scenes.config.js;
 * - navegar por teclado (setas, Espaço, PageUp/PageDown, Home, End e H);
 * - manter a posição atual sincronizada com o hash da URL (#/3);
 * - renderizar as cenas de forma lazy (React.lazy + Suspense), montadas
 *   do zero a cada entrada (key = posição), para reiniciar animações;
 * - exibir controles discretos (indicador + botões), ocultáveis com H.
 *
 * Este componente NÃO conhece cena específica nenhuma: as cenas vêm do
 * glob de src/scenes/sceneIndex.js e a ordem vem exclusivamente do
 * scenes.config.js. Adicionar ou reordenar cenas nunca exige mexer aqui.
 */

/* ---------------------------------------------------------------------------
 * Linha do tempo das posições — calculada uma única vez, no carregamento.
 * ------------------------------------------------------------------------- */

/**
 * Converte a configuração bruta na lista ordenada de posições:
 *   [{ position: 1, scenes: ['exemplo-a'] },
 *    { position: 2, scenes: ['exemplo-b', 'exemplo-c'] }]
 */
function buildTimeline(config) {
  // Validação: nome inexistente ou entrada malformada é ignorada com aviso.
  const validEntries = [];
  for (const entry of config) {
    if (!entry || typeof entry.scene !== 'string' || !Number.isFinite(entry.position)) {
      console.error('[scenes] Entrada malformada em scenes.config.js (esperado { scene, position }):', entry);
      continue;
    }
    if (!hasScene(entry.scene)) {
      console.error(
        `[scenes] A cena "${entry.scene}" (position ${entry.position}) não existe em src/views/${entry.scene}/index.jsx — entrada ignorada.`,
      );
      continue;
    }
    validEntries.push(entry);
  }

  // sort estável: dentro da mesma position, a ordem do array é preservada
  // ("quem vem primeiro no array fica à esquerda" na tela dividida).
  const sorted = [...validEntries].sort((a, b) => a.position - b.position);

  // Agrupa por position, com no máximo 2 cenas por posição.
  const byPosition = new Map();
  for (const entry of sorted) {
    const bucket = byPosition.get(entry.position) ?? [];
    if (bucket.length >= 2) {
      console.warn(
        `[scenes] A position ${entry.position} tem mais de 2 cenas. Usando apenas as duas primeiras ("${bucket[0].scene}" e "${bucket[1].scene}"); "${entry.scene}" foi ignorada.`,
      );
      continue;
    }
    bucket.push(entry);
    byPosition.set(entry.position, bucket);
  }

  return Array.from(byPosition.entries()).map(([position, entries]) => ({
    position,
    scenes: entries.map((entry) => entry.scene),
  }));
}

const timeline = buildTimeline(scenesConfig);

/* ---------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------- */

/** true quando o evento de teclado veio de um campo editável. */
function isEditableTarget(target) {
  if (!(target instanceof Element)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

/**
 * true quando o alvo já ativa algo nativamente com Espaço (botão/link).
 * Nesses casos o Espaço pertence ao elemento — evita pular duas posições
 * (ativação nativa + atalho global).
 */
function isActivatableTarget(target) {
  return target instanceof Element && (target.tagName === 'BUTTON' || target.tagName === 'A');
}

/** Lê o hash (#/3) e devolve o índice 0-based da posição, ou null. */
function parseSceneHash() {
  if (timeline.length === 0) return null;
  const match = window.location.hash.match(/^#\/(\d+)$/);
  if (!match) return null;
  const index = Number.parseInt(match[1], 10) - 1;
  if (index >= 0 && index < timeline.length) return index;
  console.warn(`[scenes] Hash ${window.location.hash} não corresponde a nenhuma posição — usando a primeira.`);
  return null;
}

/* ---------------------------------------------------------------------------
 * Componente
 * ------------------------------------------------------------------------- */

export default function SceneController() {
  // Posição atual = índice na lista ordenada de posições (0-based).
  const [currentIndex, setCurrentIndex] = useState(() => parseSceneHash() ?? 0);
  const [showControls, setShowControls] = useState(true);

  const hasScenes = timeline.length > 0;
  const atFirst = currentIndex <= 0;
  const atLast = currentIndex >= timeline.length - 1;

  const goPrev = useCallback(() => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((index) => Math.min(index + 1, timeline.length - 1));
  }, []);

  // Espelha a posição atual no hash (#/3) — replaceState para não poluir o
  // histórico do navegador a cada navegação. F5 mantém a cena atual.
  useEffect(() => {
    if (!hasScenes) return;
    const hash = `#/${currentIndex + 1}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash);
    }
  }, [currentIndex, hasScenes]);

  // Navegação pelo hash: digitar/colar #/2 durante os ensaios troca a cena.
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentIndex(parseSceneHash() ?? 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Atalhos globais de teclado do apresentador.
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Não captura teclas de campos editáveis nem atalhos com modificadores.
      if (isEditableTarget(event.target)) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      switch (event.key) {
        case 'ArrowRight':
        case 'PageDown':
          event.preventDefault();
          goNext();
          break;
        case ' ':
          if (isActivatableTarget(event.target)) return; // Espaço do botão/link focado
          event.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          event.preventDefault();
          goPrev();
          break;
        case 'Home':
          event.preventDefault();
          setCurrentIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setCurrentIndex(timeline.length - 1);
          break;
        case 'h':
        case 'H':
          setShowControls((visible) => !visible);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  // Configuração vazia ou sem cenas válidas: mensagem legível, não tela branca.
  if (!hasScenes) {
    return (
      <div className={styles.empty}>
        <h1 className={styles.emptyTitle}>Nenhuma cena para apresentar</h1>
        <p className={styles.emptyText}>
          Verifique <code>src/scenes.config.js</code>: a configuração está vazia ou nenhuma
          entrada aponta para uma pasta existente em <code>src/views/</code>. Cada cena é uma
          pasta com um <code>index.jsx</code> que exporta um componente por padrão (export
          default).
        </p>
      </div>
    );
  }

  const current = timeline[currentIndex];
  const isSplit = current.scenes.length === 2;

  return (
    <div className={styles.controller}>
      {/*
        key = posição atual: trocar de posição REMONTA o palco, então cada
        cena entra do zero (animações CSS e estados internos reiniciam).
        O fade de entrada (~250ms, só opacity) vive no CSS da .stage.
      */}
      <main key={currentIndex} className={styles.stage}>
        <Suspense fallback={<div className={styles.loading} />}>
          {current.scenes.map((sceneName, index) => {
            const Scene = getSceneComponent(sceneName);
            const side = isSplit ? (index === 0 ? 'left' : 'right') : 'full';
            return (
              <div key={sceneName} className={styles.scenePane}>
                <Scene isActive side={side} />
              </div>
            );
          })}
        </Suspense>
      </main>

      {showControls && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.button}
            onClick={goPrev}
            disabled={atFirst}
            aria-label="Cena anterior"
            title="Cena anterior (←)"
          >
            ◀
          </button>
          <span className={styles.indicator} aria-live="polite">
            {currentIndex + 1} / {timeline.length}
          </span>
          <button
            type="button"
            className={styles.button}
            onClick={goNext}
            disabled={atLast}
            aria-label="Próxima cena"
            title="Próxima cena (→)"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
