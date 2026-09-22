import { useCallback, useRef, useState } from 'react';
import QuadroSupervisor from '../supervisor/tutorial/QuadroSupervisor.jsx';
import ListaChamados from '../supervisor/tutorial/ListaChamados.jsx';
import ItemLista from '../supervisor/tutorial/ItemLista.jsx';
import ChamadoCard from '../supervisor/components/ChamadoCard.jsx';
import AvisoCritico from '../supervisor/tutorial/AvisoCritico.jsx';
import DetalheDoTutorial from '../supervisor/tutorial/DetalheDoTutorial.jsx';
import { useChamadoAberto, useRoteiro } from '../supervisor/tutorial/hooks.js';
import { ALERTA_CRITICO, DETALHE_CRITICO_HOSPITAL, ID_CRITICO_HOSPITAL, listaHospitalCriticoFinal } from '../supervisor/tutorial/dados.js';
import tutorial from '../supervisor/tutorial/tutorial.module.css';

const LISTA = listaHospitalCriticoFinal();

/** CENA 14 — Alerta da demanda hospitalar já classificada como CRÍTICA.
 * O popup aparece como cena própria e informa que a demanda deve ser
 * priorizada imediatamente, sem atribuir sua criticidade a SLA.
 */
export default function SupervisorCena7({ isActive = true, side = 'full' }) {
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
    abrir(ID_CRITICO_HOSPITAL);
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
            alerta={ALERTA_CRITICO}
            detalhe={DETALHE_CRITICO_HOSPITAL}
            modo="critico"
            onClose={fecharAviso}
            onAbrirChamado={abrirChamadoDoAviso}
          />
        ) : null
      }
    >
      {chamadoAberto ? (
        <DetalheDoTutorial chamadoId={chamadoAberto} etapaAlvo="critica" onVoltar={voltar} />
      ) : (
        <ListaChamados
          chamados={LISTA}
          semPrioritarios={false}
          renderItem={(chamado, indice) => (
            <ItemLista
              key={chamado.id}
              id={chamado.id}
              indice={indice}
              className={chamado.id === ID_CRITICO_HOSPITAL && pulsando ? `${tutorial.onda} ${tutorial.corCritica}` : ''}
            >
              <ChamadoCard chamado={chamado} onOpen={abrir} />
            </ItemLista>
          )}
        />
      )}
    </QuadroSupervisor>
  );
}
