import { useRef, useState } from 'react';
import QuadroSupervisor from '../supervisor/tutorial/QuadroSupervisor.jsx';
import ListaChamados from '../supervisor/tutorial/ListaChamados.jsx';
import ItemLista from '../supervisor/tutorial/ItemLista.jsx';
import ChamadoCard from '../supervisor/components/ChamadoCard.jsx';
import DetalheDoTutorial from '../supervisor/tutorial/DetalheDoTutorial.jsx';
import { useChamadoAberto } from '../supervisor/tutorial/hooks.js';
import { ID_CRITICO_HOSPITAL, listaHospitalCriticoAntesDaSubida } from '../supervisor/tutorial/dados.js';
import tutorial from '../supervisor/tutorial/tutorial.module.css';

/** CENA 12 — Entrada suave da segunda demanda.
 * A demanda hospitalar já chega como CRÍTICA, mas entra em uma posição própria
 * no fim da lista. A cena NÃO a move para o topo automaticamente.
 */
export default function SupervisorCena5({ isActive = true, side = 'full' }) {
  const lista = listaHospitalCriticoAntesDaSubida();
  const [fase] = useState('entrada');
  const listaRef = useRef(null);
  const mainRef = useRef(null);
  const { chamadoAberto, abrir, voltar, selecionarAba } = useChamadoAberto(mainRef);

  return (
    <QuadroSupervisor mainRef={mainRef} onSelectNav={selecionarAba}>
      {chamadoAberto ? (
        <DetalheDoTutorial chamadoId={chamadoAberto} etapaAlvo={chamadoAberto === ID_CRITICO_HOSPITAL ? "critica" : "alta"} onVoltar={voltar} />
      ) : (
        <ListaChamados
          chamados={lista}
          listaRef={listaRef}
          semPrioritarios={false}
          renderItem={(chamado, indice) => {
            const ehCritico = chamado.id === ID_CRITICO_HOSPITAL;
            const classe = ehCritico && fase === 'entrada' ? tutorial.criticoSurge : '';
            return (
              <ItemLista key={chamado.id} id={chamado.id} indice={indice} className={classe}>
                <ChamadoCard chamado={chamado} onOpen={abrir} />
              </ItemLista>
            );
          }}
        />
      )}
    </QuadroSupervisor>
  );
}
