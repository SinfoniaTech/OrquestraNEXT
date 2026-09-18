import { useCallback, useRef, useState } from 'react';
import styles from './SupervisorView.module.css';
import { ALERTA_SLA } from './data/chamados.js';
import SupervisorHeader from './components/SupervisorHeader.jsx';
import BottomNav from './components/BottomNav.jsx';
import SlaAlertModal from './components/SlaAlertModal.jsx';
import ChamadosView from './screens/ChamadosView.jsx';
import ChamadoDetalheView from './screens/ChamadoDetalheView.jsx';
import MapaView from './screens/MapaView.jsx';
import AlertasView from './screens/AlertasView.jsx';
import MaisView from './screens/MaisView.jsx';

/**
 * VISUALIZAÇÃO "SUPERVISOR"
 *
 * Reconstrução em React da referência elevate-decision-hero: painel mobile
 * (largura de celular mesmo em desktop) com as quatro telas do app —
 * Chamados (chamadas abertas priorizadas por criticidade e SLA), Mapa
 * (distribuição das chamadas por região), Alertas (chamados em risco de
 * estouro de SLA) e Mais (gestão e indicadores) —, além do alerta modal de
 * risco de SLA e da navegação inferior do app.
 *
 * Estrutura:
 * - .stage: palco que centraliza o "aparelho" dentro do painel do
 *   apresentador (fundo cinza ao redor);
 * - .shell: o aparelho em si (448px, altura cheia, rolagem própria) —
 *   header sticky, tela ativa, bottom nav e o overlay do modal vivem aqui;
 * - telas em ./screens/: qual delas renderizar depende do item ativo da
 *   bottom nav (navAtiva), espelhando as rotas da referência; clicar em um
 *   chamado sobrepõe a tela de detalhe (ChamadoDetalheView, como a rota
 *   /chamados/:id), sem sair do shell;
 * - estado local: visibilidade do modal, contagem de notificações, tela
 *   ativa e chamado aberto em detalhe.
 *
 * Nenhum estilo global é criado: todos os tokens (--sup-*) e regras vivem
 * no CSS Module desta view.
 */
export default function SupervisorView() {
  // O modal abre por padrão, como na referência, e há 1 notificação pendente.
  const [alertaVisivel, setAlertaVisivel] = useState(true);
  const [notificacoes, setNotificacoes] = useState(1);
  const [navAtiva, setNavAtiva] = useState('chamados');
  // Id do chamado aberto em detalhe — sobrepõe a tela da bottom nav, como a
  // rota /chamados/:id da referência; null = nenhum detalhe aberto.
  const [chamadoAberto, setChamadoAberto] = useState(null);

  const shellRef = useRef(null);

  const abrirAlerta = useCallback(() => setAlertaVisivel(true), []);

  const fecharAlerta = useCallback(() => {
    setAlertaVisivel(false);
    setNotificacoes(0); // alerta lido: some o badge do sino
  }, []);

  // Abre o detalhe de um chamado (clique no card da lista ou "Ver detalhes"
  // do modal). O shell volta ao topo, como uma navegação de rota faria.
  const abrirChamado = useCallback((id) => {
    setChamadoAberto(id);
    shellRef.current?.scrollTo({ top: 0 });
  }, []);

  // "Ver detalhes" do modal: fecha o alerta e abre o detalhe do chamado em
  // risco, como na referência.
  const verDetalhes = useCallback(() => {
    fecharAlerta();
    abrirChamado(ALERTA_SLA.chamadoId);
  }, [fecharAlerta, abrirChamado]);

  // Volta do detalhe para a tela de onde veio (lista de chamados).
  const voltarChamado = useCallback(() => {
    setChamadoAberto(null);
    shellRef.current?.scrollTo({ top: 0 });
  }, []);

  // Troca de tela pela bottom nav; um detalhe aberto é fechado e o shell
  // volta ao topo, como uma navegação de rota faria.
  const selecionarNav = useCallback((id) => {
    setChamadoAberto(null);
    setNavAtiva(id);
    shellRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className={styles.stage}>
      <div className={styles.shell} ref={shellRef}>
        <SupervisorHeader
          notificacoes={notificacoes}
          onOpenNotifications={abrirAlerta}
        />

        <main className={styles.main}>
          {chamadoAberto ? (
            <ChamadoDetalheView
              chamadoId={chamadoAberto}
              onVoltar={voltarChamado}
            />
          ) : navAtiva === 'mapa' ? (
            <MapaView />
          ) : navAtiva === 'alertas' ? (
            <AlertasView />
          ) : navAtiva === 'mais' ? (
            <MaisView />
          ) : (
            <ChamadosView onOpen={abrirChamado} />
          )}
        </main>

        <BottomNav activeItem={navAtiva} onSelectItem={selecionarNav} />

        {alertaVisivel ? (
          <SlaAlertModal
            alerta={ALERTA_SLA}
            onClose={fecharAlerta}
            onVerDetalhes={verDetalhes}
          />
        ) : null}
      </div>
    </div>
  );
}
