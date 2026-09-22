import { useCallback, useRef, useState } from 'react';
import styles from './BackofficeView.module.css';
import { MENU_SECTIONS, TELAS } from './data/backofficeData.js';
import { STAGES } from './data/chamadosData.js';
import Sidebar from './components/Sidebar.jsx';
import TopHeader from './components/TopHeader.jsx';
import GestaoTecnicaScreen from './screens/GestaoTecnicaScreen.jsx';
import GestaoExecutivaScreen from './screens/GestaoExecutivaScreen.jsx';
import ChamadosScreen from './screens/ChamadosScreen.jsx';
import PlaceholderScreen from './screens/PlaceholderScreen.jsx';

/**
 * VISUALIZAÇÃO "BACKOFFICE"
 *
 * Reconstrução em React da referência exec-tech-nexus (ORQUESTRA | OTIS):
 * aplicação web desktop com sidebar de 256px, header sticky com busca e
 * seletor de período, e duas telas reais — Gestão Técnica e Gestão
 * Executiva — além de placeholders para os demais módulos do menu.
 *
 * Estrutura:
 * - .stage: palco que ocupa todo o painel do apresentador;
 * - Sidebar (esquerda, sticky) + coluna principal (header + conteúdo com
 *   rolagem própria);
 * - a navegação interna é por estado (telaAtiva), espelhando as rotas
 *   "/" e "/gestao-executiva" da referência — sem sair da View;
 *   nesta cena, a tela inicial padrão é "Chamados" (id 'chamadas');
 * - itens do menu sem rota na referência abrem a PlaceholderScreen;
 * - abaixo de lg (1024px) a sidebar é ocultada e aparece a subnav
 *   horizontal com as duas telas principais, como na referência.
 *
 * Isolamento: todos os tokens usam o prefixo --bk-* e vivem na raiz da
 * view (.stage) — nada vaza para o container ou outras views.
 */
/**
 * Extrai um estágio válido da query string (?stage=alerta) — usado apenas
 * para ensaio, na rota normal de Chamados. Retorna undefined se ausente ou
 * inválido (a URL de cenas usa hash, então a query sobrevive à navegação).
 */
function stageFromQueryString() {
  const value = new URLSearchParams(window.location.search).get('stage');
  return STAGES.includes(value) ? value : undefined;
}

export default function BackofficeView({ telaInicial, stageChamados }) {
  const [telaAtiva, setTelaAtiva] = useState(telaInicial ?? 'chamadas');
  const [periodo, setPeriodo] = useState(TELAS[telaInicial ?? 'chamadas']?.periodo);
  const mainRef = useRef(null);

  // Estágio de ensaio via ?stage=... — lido uma única vez (não é reativo).
  const stageEnsaioRef = useRef();
  if (stageEnsaioRef.current === undefined) {
    stageEnsaioRef.current = stageChamados ?? (telaInicial == null ? stageFromQueryString() : undefined);
  }

  // Troca de tela pelo menu/subnav e volta o conteúdo ao topo, como uma
  // navegação de rota faria. O período assume o padrão da tela de destino.
  const selecionarTela = useCallback((item) => {
    const id = typeof item === 'string' ? item : item.id;
    setTelaAtiva(id);
    if (TELAS[id]) setPeriodo(TELAS[id].periodo);
    mainRef.current?.scrollTo({ top: 0 });
  }, []);

  const meta = TELAS[telaAtiva];
  const itemAtivo = MENU_SECTIONS.flatMap((s) => s.items).find((i) => i.id === telaAtiva);

  return (
    <div className={styles.stage}>
      <Sidebar telaAtiva={telaAtiva} onSelect={selecionarTela} />

      <div className={styles.mainColumn}>
        <TopHeader
          title={meta?.title ?? itemAtivo?.label ?? ''}
          subtitle={meta?.subtitle ?? ''}
          periodo={periodo}
          onChangePeriodo={setPeriodo}
        />

        {/* subnav mobile — visível apenas abaixo de lg, como na referência */}
        <div className={styles.mobileNav}>
          {MENU_SECTIONS[0].items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.mobileNavItem} ${item.id === telaAtiva ? styles.mobileNavItemActive : ''}`}
              onClick={() => selecionarTela(item)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <main className={styles.main} ref={mainRef}>
          {telaAtiva === 'gestao-tecnica' ? (
            <GestaoTecnicaScreen />
          ) : telaAtiva === 'gestao-executiva' ? (
            <GestaoExecutivaScreen />
          ) : telaAtiva === 'chamadas' ? (
            <ChamadosScreen stage={stageEnsaioRef.current} />
          ) : (
            <PlaceholderScreen item={itemAtivo} />
          )}
        </main>
      </div>
    </div>
  );
}

