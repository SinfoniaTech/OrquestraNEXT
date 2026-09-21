import { useRef, useState } from 'react';
import ChamadoCard from '../supervisor/components/ChamadoCard.jsx';
import QuadroSupervisor from '../supervisor/tutorial/QuadroSupervisor.jsx';
import ListaChamados from '../supervisor/tutorial/ListaChamados.jsx';
import ItemLista from '../supervisor/tutorial/ItemLista.jsx';
import DetalheDoTutorial from '../supervisor/tutorial/DetalheDoTutorial.jsx';
import { useChamadoAberto, useRoteiro } from '../supervisor/tutorial/hooks.js';
import { listaComAlvoEm } from '../supervisor/tutorial/dados.js';

const LISTA = listaComAlvoEm('normal');

/**
 * CENA 1 — Navegar até a tela do Supervisor (situação amena da operação).
 *
 * Só mostra a tela: 5 chamados, TODOS com criticidade NORMAL, sem pop-up e
 * sem selos de notificação. Como só há chamados NORMAL, a tela exibe
 * "Sem chamados prioritários" logo abaixo de "5 eventos ativos agora." (regra
 * do ListaChamados; a mensagem some assim que surge outra criticidade, o que
 * acontece na Cena 2). A barra inferior aparece sem o item "Mapa".
 *
 * A demanda do tutorial (elevador de leitos do Hospital Central Paulista) já
 * está na lista como NORMAL — é ela que vai evoluir nas Cenas 2 a 4.
 *
 * Animação (uma única sequência, tocada quando a cena entra):
 *   1. o "celular" chega de baixo com fade;
 *   2. os cards entram em cascata, de cima para baixo;
 *   3. a aba "Chamados" da barra inferior recebe o "toque" e fica ativa.
 * Tudo em tutorial/tutorial.module.css; a cena só liga as classes.
 *
 * Clicar em qualquer card abre o detalhe daquele chamado; "← Chamadas" (ou a
 * aba "Chamados") volta para a lista. A cascata só toca na chegada: ao voltar
 * do detalhe a lista já aparece pronta.
 *
 * Props do controlador (README): isActive e side ("full" | "left" | "right").
 */
export default function SupervisorCena1({ isActive = true, side = 'full' }) {
  const [entrou, setEntrou] = useState(false);
  const mainRef = useRef(null);
  const { chamadoAberto, abrir, voltar, selecionarAba } = useChamadoAberto(mainRef);

  // A cascata termina em ~1,3 s; depois disso a classe sai (senão tocaria de
  // novo toda vez que a lista voltasse do detalhe).
  useRoteiro([[1600, () => setEntrou(true)]]);

  return (
    <QuadroSupervisor entrada mainRef={mainRef} onSelectNav={selecionarAba}>
      {chamadoAberto ? (
        <DetalheDoTutorial chamadoId={chamadoAberto} etapaAlvo="normal" onVoltar={voltar} />
      ) : (
        <ListaChamados
          chamados={LISTA}
          renderItem={(chamado, indice) => (
            <ItemLista key={chamado.id} id={chamado.id} indice={indice} escalonar={!entrou}>
              <ChamadoCard chamado={chamado} onOpen={abrir} />
            </ItemLista>
          )}
        />
      )}
    </QuadroSupervisor>
  );
}
