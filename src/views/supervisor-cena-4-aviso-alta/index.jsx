import { useCallback, useRef, useState } from 'react';
import tutorial from '../supervisor/tutorial/tutorial.module.css';
import QuadroSupervisor from '../supervisor/tutorial/QuadroSupervisor.jsx';
import ListaChamados from '../supervisor/tutorial/ListaChamados.jsx';
import ItemLista from '../supervisor/tutorial/ItemLista.jsx';
import ChamadoCard from '../supervisor/components/ChamadoCard.jsx';
import AvisoCritico from '../supervisor/tutorial/AvisoCritico.jsx';
import DetalheDoTutorial from '../supervisor/tutorial/DetalheDoTutorial.jsx';
import { useChamadoAberto, useRoteiro } from '../supervisor/tutorial/hooks.js';
import { ALERTA_ALTA, DETALHE_ALVO, ID_ALVO, listaComAlvoEm } from '../supervisor/tutorial/dados.js';

const LISTA = listaComAlvoEm('alta');

/** CENA 4 — O alerta aparece como uma cena própria assim que a demanda
 * Smart Fit já está ALTA, último estágio antes do estouro do SLA.
 */
export default function SupervisorCena4({ isActive = true, side = 'full' }) {
  const [avisoAberto, setAvisoAberto] = useState(false);
  const [notificacoes, setNotificacoes] = useState(0);
  const [badgeAlertas, setBadgeAlertas] = useState(0);
  const [sinoTocando, setSinoTocando] = useState(false);
  const [pulsando, setPulsando] = useState(false);
  const mainRef = useRef(null);
  const { chamadoAberto, abrir, voltar, selecionarAba } = useChamadoAberto(mainRef);

  const fecharAviso = useCallback(() => {
    setAvisoAberto(false);
    setNotificacoes(0);
    setSinoTocando(false);
    setPulsando(false);
  }, []);

  const abrirChamadoDoAviso = useCallback(() => {
    fecharAviso();
    abrir(ID_ALVO);
  }, [fecharAviso, abrir]);

  useRoteiro([
    [500, () => setPulsando(true)],
    [800, () => { setSinoTocando(true); setNotificacoes(1); setBadgeAlertas(1); }],
    [1100, () => setAvisoAberto(true)],
  ]);

  return (
    <QuadroSupervisor
      mainRef={mainRef}
      notificacoes={notificacoes}
      onOpenNotifications={() => setAvisoAberto(true)}
      badgeAlertas={badgeAlertas}
      onSelectNav={selecionarAba}
      sinoTocando={sinoTocando}
      sobreposicao={
        avisoAberto ? (
          <AvisoCritico
            alerta={ALERTA_ALTA}
            detalhe={DETALHE_ALVO}
            modo="risco"
            onClose={fecharAviso}
            onAbrirChamado={abrirChamadoDoAviso}
          />
        ) : null
      }
    >
      {chamadoAberto ? (
        <DetalheDoTutorial chamadoId={chamadoAberto} etapaAlvo="alta" onVoltar={voltar} />
      ) : (
        <ListaChamados
          chamados={LISTA}
          renderItem={(chamado, indice) => (
            <ItemLista key={chamado.id} id={chamado.id} indice={indice} className={chamado.id === ID_ALVO && pulsando ? `${tutorial.onda} ${tutorial.corAlta}` : ''}>
              <ChamadoCard chamado={chamado} onOpen={abrir} />
            </ItemLista>
          )}
        />
      )}
    </QuadroSupervisor>
  );
}
