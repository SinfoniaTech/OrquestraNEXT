import { useCallback, useRef, useState } from 'react';
import ChamadoCard from '../supervisor/components/ChamadoCard.jsx';
import QuadroSupervisor from '../supervisor/tutorial/QuadroSupervisor.jsx';
import ListaChamados from '../supervisor/tutorial/ListaChamados.jsx';
import ItemLista from '../supervisor/tutorial/ItemLista.jsx';
import AvisoCritico from '../supervisor/tutorial/AvisoCritico.jsx';
import DetalheDoTutorial from '../supervisor/tutorial/DetalheDoTutorial.jsx';
import { useChamadoAberto, useRoteiro } from '../supervisor/tutorial/hooks.js';
import {
  ALERTA_CRITICO,
  DETALHE_ALVO,
  ID_ALVO,
  listaComAlvoEm,
} from '../supervisor/tutorial/dados.js';
import tutorial from '../supervisor/tutorial/tutorial.module.css';

const LISTA = listaComAlvoEm('critica');

/**
 * CENA 5 — Toda demanda CRÍTICA gera um aviso que sobe até o Supervisor.
 *
 * Começa exatamente onde a Cena 4 termina: a demanda crítica já está no topo
 * da lista, e AINDA não há nenhum selo de notificação — eles só existem a
 * partir do momento em que a demanda crítica passa a existir para o
 * Supervisor. Roteiro:
 *
 *   0 ms      lista parada, sem notificação em lugar nenhum;
 *   900 ms    o card crítico "estala" (onda vermelha), o sino balança e os
 *             selos surgem: no sino do header e na aba "Alertas" da barra
 *             inferior;
 *   1700 ms   o aviso sobe de baixo da tela, com o véu desfocado, o cartão
 *             pulsando em vermelho e a "ação recomendada" entrando item a
 *             item — para o Supervisor atuar já e direcionar esforços.
 *
 * Interação:
 *   - "Ver detalhes" NÃO sai da tela: o próprio pop-up cresce e mostra os
 *     detalhes do chamado (técnico, peça, impacto temporal e ações); o botão
 *     vira "Recolher detalhes". Ver AvisoCritico.jsx;
 *   - "Abrir chamado completo" (no pop-up expandido) fecha o aviso e abre a
 *     tela de detalhe do chamado crítico — a mesma que abre ao clicar no card
 *     da lista; "← Chamadas" volta para a lista;
 *   - clicar fora, "Fechar", o cabeçalho ou Esc fecham o aviso e limpam o
 *     selo do sino (como no app); o selo da aba "Alertas" permanece, porque a
 *     demanda continua crítica; o sino reabre o aviso.
 *
 * Props do controlador (README): isActive e side ("full" | "left" | "right").
 */
export default function SupervisorCena5({ isActive = true, side = 'full' }) {
  const [notificacoes, setNotificacoes] = useState(0);
  const [badgeAlertas, setBadgeAlertas] = useState(0);
  const [sinoTocando, setSinoTocando] = useState(false);
  const [pulsando, setPulsando] = useState(false);
  const [avisoAberto, setAvisoAberto] = useState(false);

  const mainRef = useRef(null);
  const { chamadoAberto, abrir, voltar, selecionarAba } = useChamadoAberto(mainRef);

  const abrirAviso = useCallback(() => setAvisoAberto(true), []);

  const fecharAviso = useCallback(() => {
    setAvisoAberto(false);
    setNotificacoes(0); // alerta lido: some o selo do sino
    setSinoTocando(false);
    setPulsando(false);
  }, []);

  // "Abrir chamado completo": lê o aviso (fecha, limpando o selo do sino) e
  // entra na demanda.
  const abrirChamadoDoAviso = useCallback(() => {
    fecharAviso();
    abrir(ID_ALVO);
  }, [fecharAviso, abrir]);

  useRoteiro([
    [
      900,
      () => {
        setPulsando(true);
        setSinoTocando(true);
        setNotificacoes(1);
        setBadgeAlertas(1);
      },
    ],
    [1700, () => setAvisoAberto(true)],
  ]);

  return (
    <QuadroSupervisor
      mainRef={mainRef}
      notificacoes={notificacoes}
      onOpenNotifications={abrirAviso}
      badgeAlertas={badgeAlertas}
      onSelectNav={selecionarAba}
      sinoTocando={sinoTocando}
      sobreposicao={
        avisoAberto ? (
          <AvisoCritico
            alerta={ALERTA_CRITICO}
            detalhe={DETALHE_ALVO}
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
          renderItem={(chamado, indice) => (
            <ItemLista
              key={chamado.id}
              id={chamado.id}
              indice={indice}
              className={
                chamado.id === ID_ALVO && pulsando ? `${tutorial.onda} ${tutorial.corCritica}` : ''
              }
            >
              <ChamadoCard chamado={chamado} onOpen={abrir} />
            </ItemLista>
          )}
        />
      )}
    </QuadroSupervisor>
  );
}
