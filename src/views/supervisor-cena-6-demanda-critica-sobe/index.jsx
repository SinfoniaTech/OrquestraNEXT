import { useRef, useState } from 'react';
import QuadroSupervisor from '../supervisor/tutorial/QuadroSupervisor.jsx';
import ListaChamados from '../supervisor/tutorial/ListaChamados.jsx';
import ItemLista from '../supervisor/tutorial/ItemLista.jsx';
import ChamadoCard from '../supervisor/components/ChamadoCard.jsx';
import DetalheDoTutorial from '../supervisor/tutorial/DetalheDoTutorial.jsx';
import { useChamadoAberto, useFlip, useRoteiro } from '../supervisor/tutorial/hooks.js';
import { ID_CRITICO_HOSPITAL, listaHospitalCriticoAntesDaSubida, listaHospitalCriticoFinal } from '../supervisor/tutorial/dados.js';
import tutorial from '../supervisor/tutorial/tutorial.module.css';

/** CENA 13 — A demanda CRÍTICA sobe ao topo.
 * Usa a mesma mecânica FLIP das transições de criticidade: captura a posição
 * atual, reordena a lista e anima suavemente todos os itens envolvidos.
 */
export default function SupervisorCena6({ isActive = true, side = 'full' }) {
  const inicial = listaHospitalCriticoAntesDaSubida();
  const final = listaHospitalCriticoFinal();
  const [lista, setLista] = useState(inicial);
  const [movendo, setMovendo] = useState(false);
  const listaRef = useRef(null);
  const mainRef = useRef(null);
  const { chamadoAberto, abrir, voltar, selecionarAba } = useChamadoAberto(mainRef);
  const capturar = useFlip(listaRef, lista, { duracao: 700 });

  useRoteiro([
    [900, () => {
      capturar();
      setMovendo(true);
      setLista(final);
    }],
  ]);

  return (
    <QuadroSupervisor mainRef={mainRef} onSelectNav={selecionarAba}>
      {chamadoAberto ? (
        <DetalheDoTutorial chamadoId={chamadoAberto} etapaAlvo={chamadoAberto === ID_CRITICO_HOSPITAL ? "critica" : "alta"} onVoltar={voltar} />
      ) : (
        <ListaChamados
          chamados={lista}
          listaRef={listaRef}
          semPrioritarios={false}
          renderItem={(chamado, indice) => (
            <ItemLista
              key={chamado.id}
              id={chamado.id}
              indice={indice}
              className={chamado.id === ID_CRITICO_HOSPITAL && movendo ? `${tutorial.elevado} ${tutorial.onda} ${tutorial.corCritica}` : ''}
            >
              <ChamadoCard chamado={chamado} onOpen={abrir} />
            </ItemLista>
          )}
        />
      )}
    </QuadroSupervisor>
  );
}
