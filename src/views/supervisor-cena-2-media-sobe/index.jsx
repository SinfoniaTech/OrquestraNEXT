import { useRef, useState } from 'react';
import QuadroSupervisor from '../supervisor/tutorial/QuadroSupervisor.jsx';
import ListaChamados from '../supervisor/tutorial/ListaChamados.jsx';
import ItemLista from '../supervisor/tutorial/ItemLista.jsx';
import ChamadoCard from '../supervisor/components/ChamadoCard.jsx';
import DetalheDoTutorial from '../supervisor/tutorial/DetalheDoTutorial.jsx';
import { useChamadoAberto, useFlip, useRoteiro } from '../supervisor/tutorial/hooks.js';
import { ID_ALVO, listaComAlvoEm, listaComAlvoNaPosicaoBase } from '../supervisor/tutorial/dados.js';
import styles from '../supervisor/tutorial/tutorial.module.css';

/**
 * CENA 10 — Reordenação da demanda Smart Fit.
 *
 * A criticidade MÉDIA já foi aplicada na cena anterior. Nesta cena nenhuma
 * mudança de status acontece: o único evento apresentado é a subida da
 * demanda para o topo da lista.
 *
 * A movimentação usa o mesmo FLIP de useFlip empregado nas transições do
 * tutorial, com a mesma curva e duração, para que a subida tenha exatamente
 * o mesmo comportamento visual da reordenação já existente.
 */
export default function SupervisorCena2MediaSobe({ isActive = true, side = 'full' }) {
  const [lista, setLista] = useState(() => listaComAlvoNaPosicaoBase('media'));
  const listaFinal = listaComAlvoEm('media');
  const listaRef = useRef(null);
  const mainRef = useRef(null);
  const [movendo, setMovendo] = useState(false);
  const { chamadoAberto, abrir, voltar, selecionarAba } = useChamadoAberto(mainRef);

  const capturar = useFlip(listaRef, lista);

  useRoteiro([
    [700, () => setMovendo(true)],
    [1200, () => {
      capturar();
      setLista(listaFinal);
    }],
  ]);

  return (
    <QuadroSupervisor mainRef={mainRef} onSelectNav={selecionarAba}>
      {chamadoAberto ? (
        <DetalheDoTutorial chamadoId={chamadoAberto} etapaAlvo="media" onVoltar={voltar} />
      ) : (
        <ListaChamados
          chamados={lista}
          listaRef={listaRef}
          semPrioritarios={false}
          renderItem={(chamado, indice) => {
            const ehAlvo = chamado.id === ID_ALVO;
            return (
              <ItemLista
                key={chamado.id}
                id={chamado.id}
                indice={indice}
                className={ehAlvo && movendo ? styles.elevado : ''}
              >
                <ChamadoCard chamado={chamado} onOpen={abrir} />
              </ItemLista>
            );
          }}
        />
      )}
    </QuadroSupervisor>
  );
}
