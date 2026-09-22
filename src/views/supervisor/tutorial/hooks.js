import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/** true quando o usuário pede menos movimento (o projeto inteiro respeita isso). */
export function prefereMenosMovimento() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Roteiro temporal da cena.
 *
 *   useRoteiro([
 *     [1200, () => setFase('destaque')],
 *     [3000, () => setFase('escalado')],
 *   ]);
 *
 * Cada passo é [atraso em ms desde a entrada da cena, ação]. Como o
 * controlador remonta a cena a cada visita, o roteiro reinicia sozinho.
 *
 * - Os timers são limpos ao desmontar (sair da cena no meio do roteiro não
 *   deixa nada rodando) e, no StrictMode de desenvolvimento, o efeito roda
 *   duas vezes sem duplicar passos.
 * - O roteiro é lido só na montagem: as ações devem usar apenas funções
 *   estáveis (setters de useState, o retorno de useFlip).
 */
export function useRoteiro(passos) {
  useEffect(() => {
    const timers = passos.map(([atraso, acao]) => setTimeout(acao, atraso));
    return () => timers.forEach(clearTimeout);
  }, []);
}

/**
 * FLIP (First, Last, Invert, Play) para reordenar itens de uma lista com
 * deslize suave, sem lib e sem mexer nos componentes originais.
 *
 * Uso:
 *   const capturar = useFlip(listaRef, lista);
 *   // ...no momento da troca:
 *   capturar();          // 1. "First": guarda a posição atual dos itens
 *   setLista(novaOrdem); // 2. "Last": o React reordena o DOM
 *   // o efeito abaixo inverte e anima cada item até o lugar novo.
 *
 * Cada item precisa do atributo data-flip-id (o <ItemLista> já coloca).
 * A captura é explícita (e não a cada render) porque as animações de
 * entrada deslocam os itens e distorceriam a medição.
 */
export function useFlip(containerRef, dependencia, { duracao = 700 } = {}) {
  const antes = useRef(null);

  const capturar = useCallback(() => {
    const posicoes = new Map();
    containerRef.current?.querySelectorAll('[data-flip-id]').forEach((no) => {
      posicoes.set(no.dataset.flipId, no.getBoundingClientRect().top);
    });
    antes.current = posicoes;
  }, [containerRef]);

  useLayoutEffect(() => {
    const posicoes = antes.current;
    antes.current = null;
    if (!posicoes || !containerRef.current || prefereMenosMovimento()) return;

    containerRef.current.querySelectorAll('[data-flip-id]').forEach((no) => {
      const topoAntes = posicoes.get(no.dataset.flipId);
      if (topoAntes == null) return;
      const deslocamento = topoAntes - no.getBoundingClientRect().top;
      if (!deslocamento) return;
      no.animate(
        [{ transform: `translateY(${deslocamento}px)` }, { transform: 'translateY(0)' }],
        { duration: duracao, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
    });
  }, [dependencia, containerRef, duracao]);

  return capturar;
}

/**
 * Detalhe do chamado nas cenas: clicar num card abre a tela de detalhe dele
 * (como na rota /chamados/:id do app) e "← Chamadas" — ou a aba "Chamados" da
 * barra inferior — volta para a lista.
 *
 *   const mainRef = useRef(null);
 *   const { chamadoAberto, abrir, voltar, selecionarAba } = useChamadoAberto(mainRef);
 *
 *   <QuadroSupervisor mainRef={mainRef} onSelectNav={selecionarAba}>
 *     {chamadoAberto ? <DetalheDoTutorial ... onVoltar={voltar} /> : <ListaChamados ... />}
 *   </QuadroSupervisor>
 *
 * - chamadoAberto: id do chamado aberto (null = mostrando a lista);
 * - abrir(id) / voltar(): trocam de tela e devolvem a rolagem ao topo, como
 *   uma navegação de rota faria (o SupervisorView original faz o mesmo);
 * - selecionarAba(id): a barra inferior do app fecha o detalhe ao tocar em
 *   "Chamados"; as outras abas não fazem parte do tutorial e são ignoradas.
 *
 * Enquanto o detalhe está aberto o roteiro da cena continua rodando; ao
 * voltar, a lista aparece já no estado em que a cena estiver.
 */
export function useChamadoAberto(mainRef) {
  const [chamadoAberto, setChamadoAberto] = useState(null);

  const abrir = useCallback(
    (id) => {
      setChamadoAberto(id);
      mainRef.current?.scrollTo({ top: 0 });
    },
    [mainRef],
  );

  const voltar = useCallback(() => {
    setChamadoAberto(null);
    mainRef.current?.scrollTo({ top: 0 });
  }, [mainRef]);

  const selecionarAba = useCallback(
    (id) => {
      if (id === 'chamados') voltar();
    },
    [voltar],
  );

  return { chamadoAberto, abrir, voltar, selecionarAba };
}
