import { useEffect, useMemo, useState } from 'react';
import BarChart from '../components/BarChart.jsx';
import SectionCard from '../components/SectionCard.jsx';
import KpiCard from '../components/KpiCard.jsx';
import AnimatedKpi from '../components/AnimatedKpi.jsx';
import FluxoChamados from '../components/FluxoChamados.jsx';
import FilaChamados from '../components/FilaChamados.jsx';
import DetalheChamadoPanel from '../components/DetalheChamadoPanel.jsx';
import AlertasSla from '../components/AlertasSla.jsx';
import FeedEventos from '../components/FeedEventos.jsx';
import Icon from '../components/icons.jsx';
import { prefersReducedMotion } from '../components/AnimatedNumber.jsx';
import {
  ARRIVAL_INITIAL_DELAY_MS,
  ARRIVAL_INTERVAL_MS,
  ARRIVAL_TOTAL,
  BACKGROUND_ARRIVALS,
  FEED_BASE,
  FEED_CHEGADAS,
  FEED_ESTAGIO,
  INITIAL_QUEUE,
  META_TA_LABEL,
  PAGE_ARRIVALS,
  PAGE_ARRIVAL_INITIAL_DELAY_MS,
  PAGE_ARRIVAL_INTERVAL_MS,
  PAGE_BASE_ROWS,
  PROTAGONISTA,
  PROTAGONISTA_ESTAGIOS,
  REGIOES,
  STAGES,
  STAGE_FLUXO,
  STAGE_HORAS,
  TA_MEDIO_LABEL,
  TIMELINE_PROTAGONISTA,
  computeCounts,
  feedChegada,
  fmtNum,
  horaLte,
  pageCounts,
} from '../data/chamadosData.js';
import bk from '../BackofficeView.module.css';
import styles from '../chamados.module.css';

/**
 * TELA "CHAMADOS" — dashboard de acompanhamento em tempo real.
 *
 * Recebe `stage` opcional (repouso, aberto, priorizado, encaminhado, alerta,
 * em-atendimento, concluido). Sem `stage`, renderiza a operação normal
 * (equivalente a "repouso"). Todos os números são derivados de
 * chamadosData.js via computeCounts — KPIs, fluxo, rodapé, alertas e feed
 * acompanham as chegadas e transições automaticamente.
 */

/** Relógio simulado na sequência de chegadas: 14:00 -> 14:02 distribuído
 *  igualmente entre as chegadas (2 chegadas de fundo + protagonista). */
function horaSimulada(arrived) {
  const segundosTotais = 120; // 14:00 até 14:02
  const secs = Math.floor((arrived * segundosTotais) / ARRIVAL_TOTAL);
  const mins = 14 * 60 + Math.floor(secs / 60);
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
}

/** SLA em risco = linha de base (5) + protagonista (quando em risco). */
const riscoFromProt = (p) => 5 + (p && p.slaPct >= 70 && p.status !== 'concluido' ? 1 : 0);

export default function ChamadosScreen({ stage = null }) {
  const isDemo = Boolean(stage);
  // modo "página": operação normal (sem stage ou estágio repouso) — ao abrir
  // /ficar ativa, a fila começa com 8168..8151 e 8170/8181/8182 chegam um a um
  const isPageMode = !isDemo || stage === 'repouso';
  // sequência de chegadas (só anima no estágio "aberto")
  const [arrived, setArrived] = useState(0);
  // chegadas da abertura da página (modo normal/repouso)
  const [pageArrived, setPageArrived] = useState(0);
  // chamado selecionado na fila (null = painel fechado; nunca abre sozinho)
  const [selectedId, setSelectedId] = useState(null);

  /* --- sequência de chegadas: 600ms + 1,2s entre cada uma ------------- */
  useEffect(() => {
    setSelectedId(null); // ao mudar de estágio, o painel volta fechado
    if (stage !== 'aberto') return undefined;
    if (prefersReducedMotion()) {
      setArrived(ARRIVAL_TOTAL); // estado final imediato, sem sequência
      return undefined;
    }
    setArrived(0);
    const timers = [];
    for (let i = 1; i <= ARRIVAL_TOTAL; i++) {
      timers.push(
        setTimeout(() => setArrived(i), ARRIVAL_INITIAL_DELAY_MS + (i - 1) * ARRIVAL_INTERVAL_MS),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [stage]);

  /* --- abertura da página: 2s + 2,5s entre cada chegada (8155->8157) --- */
  useEffect(() => {
    if (!isPageMode) return undefined;
    if (prefersReducedMotion()) {
      setPageArrived(PAGE_ARRIVALS.length); // estado final imediato, sem sequência
      return undefined;
    }
    setPageArrived(0);
    const timers = [];
    for (let i = 1; i <= PAGE_ARRIVALS.length; i++) {
      timers.push(
        setTimeout(() => setPageArrived(i), PAGE_ARRIVAL_INITIAL_DELAY_MS + (i - 1) * PAGE_ARRIVAL_INTERVAL_MS),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [isPageMode, stage]);

  /* --- contexto do estágio (chegadas presentes + protagonista) ------- */
  const ctx = useMemo(() => {
    if (!isDemo || stage === 'repouso') {
      return { bg: 0, prot: null, fluxoStep: null, hora: STAGE_HORAS.repouso };
    }
    if (stage === 'aberto') {
      const protOn = arrived >= ARRIVAL_TOTAL;
      return {
        bg: Math.min(arrived, BACKGROUND_ARRIVALS.length),
        prot: protOn ? PROTAGONISTA_ESTAGIOS.aberto : null,
        fluxoStep: protOn ? STAGE_FLUXO.aberto : null,
        hora: horaSimulada(arrived),
      };
    }
    return {
      bg: BACKGROUND_ARRIVALS.length,
      prot: PROTAGONISTA_ESTAGIOS[stage],
      fluxoStep: STAGE_FLUXO[stage],
      hora: STAGE_HORAS[stage],
    };
  }, [isDemo, stage, arrived]);

  /* --- contagens SEMPRE derivadas ------------------------------------ */
  const counts = useMemo(
    () =>
      isPageMode
        ? pageCounts(pageArrived)
        : computeCounts(
            BACKGROUND_ARRIVALS.slice(0, ctx.bg).map((c) => c.status),
            ctx.prot?.status ?? null,
          ),
    [isPageMode, pageArrived, ctx],
  );

  // contagens do estágio anterior (ponto de partida das contagens animadas)
  const prevCounts = useMemo(() => {
    if (!isDemo || stage === 'repouso' || stage === 'aberto') return null;
    const prev = STAGES[STAGES.indexOf(stage) - 1];
    if (prev === 'repouso') return computeCounts([], null);
    return computeCounts(BACKGROUND_ARRIVALS.map((c) => c.status), PROTAGONISTA_ESTAGIOS[prev].status);
  }, [isDemo, stage]);

  // estado do protagonista no estágio anterior (transição de cor do SLA)
  const protPrev = useMemo(() => {
    if (!isDemo) return null;
    const idx = STAGES.indexOf(stage);
    if (idx <= 1) return null; // repouso/aberto: sem estado anterior
    return PROTAGONISTA_ESTAGIOS[STAGES[idx - 1]] ?? null;
  }, [isDemo, stage]);

  /* --- fila: modo página (base 8154..8148 + chegadas) ou modo demo --- */
  const rows = useMemo(() => {
    if (isPageMode) {
      // chegadas da abertura entram pelo topo, do mais recente para o mais antigo
      return [...PAGE_ARRIVALS.slice(0, pageArrived).slice().reverse(), ...PAGE_BASE_ROWS];
    }
    const list = [];
    if (ctx.prot) {
      list.push({
        ...PROTAGONISTA,
        ...ctx.prot,
        timeline: TIMELINE_PROTAGONISTA.filter((ev) => horaLte(ev.hora, ctx.hora)),
      });
    }
    if (ctx.bg > 0) list.push(...BACKGROUND_ARRIVALS.slice(0, ctx.bg).slice().reverse());
    // #CH-0008182 já entrou como protagonista acima; a fila base da página
    // também o contém, então no modo demo ele é removido para não duplicar
    list.push(...INITIAL_QUEUE.filter((c) => c.id !== PROTAGONISTA.id));
    return list;
  }, [isPageMode, pageArrived, ctx]);

  // ids que chegam durante ESTA renderização (modo página: abertura da tela;
  // modo demo: só o "aberto" anima, demais estágios são estáticos)
  const arrivalKind = useMemo(() => {
    if (isPageMode) {
      const kinds = {};
      PAGE_ARRIVALS.slice(0, pageArrived).forEach((c) => {
        kinds[c.id] = 'background';
      });
      return kinds;
    }
    if (stage !== 'aberto') return {};
    const kinds = {};
    BACKGROUND_ARRIVALS.slice(0, ctx.bg).forEach((c) => {
      kinds[c.id] = 'background';
    });
    if (ctx.prot) kinds[PROTAGONISTA.id] = 'protagonista';
    return kinds;
  }, [isPageMode, pageArrived, stage, ctx]);

  /* --- alertas de SLA (derivados da própria fila) -------------------- */
  const alerts = useMemo(
    () =>
      rows.filter((r) => r.status !== 'concluido' && r.slaPct >= 70).sort((a, b) => b.slaPct - a.slaPct),
    [rows],
  );

  /* --- feed da integração (mais recente no topo) -------------------- */
  const feed = useMemo(() => {
    // modo página: cada chegada da abertura gera um evento no topo do feed
    if (isPageMode) {
      const chegadas = PAGE_ARRIVALS.slice(0, pageArrived).map(feedChegada).reverse();
      return [...chegadas, ...FEED_BASE].slice(0, 7);
    }
    const items = [];
    if (isDemo && stage !== 'repouso') {
      if (stage === 'aberto') {
        items.push(...FEED_CHEGADAS.slice(0, Math.min(arrived, ARRIVAL_TOTAL)).slice().reverse());
      } else {
        items.push(FEED_ESTAGIO[stage], ...FEED_CHEGADAS.slice().reverse());
      }
    }
    return [...items, ...FEED_BASE].slice(0, 7);
  }, [isPageMode, pageArrived, isDemo, stage, arrived]);

  /* --- gráfico por região (derivado da fila) ------------------------- */
  const porRegiao = useMemo(() => REGIOES.map((reg) => rows.filter((r) => r.regiao === reg).length), [rows]);

  const selecionado = rows.find((r) => r.id === selectedId) ?? null;
  const totalFila = counts.abertas + counts.atendimento; // N do rodapé
  const pctConcluidas = `${((counts.concluidos / counts.total) * 100).toLocaleString('pt-BR', {
    maximumFractionDigits: 1,
  })}% do total`;

  return (
    <div className={styles.chamadosRoot}>
      {isDemo ? (
        <div className={styles.chipHora}>
          <Icon name="clock" size={12} />
          Hora simulada {ctx.hora}
        </div>
      ) : null}

      {/* KPIs — 6 cards no mesmo estilo da Gestão Técnica */}
      <div className={bk.kpiGrid}>
        <AnimatedKpi
          label="Total de Chamadas"
          value={counts.total}
          from={prevCounts?.total ?? null}
          format={fmtNum}
          sub="+6% vs. mês anterior"
          subTone="success"
        />
        <AnimatedKpi
          label="Abertas"
          value={counts.abertas}
          from={prevCounts?.abertas ?? null}
          sub="12 acima do previsto"
          subTone="warning"
        />
        <AnimatedKpi
          label="Em Atendimento"
          value={counts.atendimento}
          from={prevCounts?.atendimento ?? null}
          sub="8 críticas"
          subTone="critical"
        />
        <AnimatedKpi
          label="SLA em risco"
          value={alerts.length}
          from={prevCounts ? riscoFromProt(protPrev) : null}
          sub="acima de 70% do prazo"
          subTone={alerts.length > 5 ? 'warning' : 'muted'}
        />
        <AnimatedKpi
          label="Concluídas"
          value={counts.concluidos}
          from={prevCounts?.concluidos ?? null}
          format={fmtNum}
          sub={pctConcluidas}
          subTone="muted"
        />
        <KpiCard label="TA Médio" value={TA_MEDIO_LABEL} sub={META_TA_LABEL} subTone="success" />
      </div>

      {/* Fluxo de chamados — 4 etapas, etapa do protagonista destacada */}
      <section className={styles.fluxoCard}>
        <div className={styles.fluxoHeader}>
          <h2 className={bk.sectionTitle}>Fluxo de chamados</h2>
          <p className={bk.sectionSubtitle}>
            Ciclo do chamado no backoffice — execução consolidada dos sistemas OTIS
          </p>
        </div>
        <FluxoChamados counts={counts} prevCounts={prevCounts} currentStep={ctx.fluxoStep} />
      </section>

      {/* Fila de chamados — largura total */}
      <SectionCard
        title="Fila de chamados"
        subtitle="Ordenada por chegada (mais recente no topo) — clique em uma linha para ver os detalhes"
      >
        <FilaChamados
          rows={rows}
          totalN={totalFila}
          protPrev={protPrev}
          arrivalKind={arrivalKind}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </SectionCard>

      {/* Linha inferior: alertas, feed da integração e região */}
      <div className={bk.chartGrid3}>
        <SectionCard title="Alertas de SLA" subtitle="Chamados com 70% ou mais do prazo consumido">
          <AlertasSla alerts={alerts} onSelect={setSelectedId} />
        </SectionCard>
        <SectionCard title="Eventos da integração" subtitle="Últimos eventos recebidos — mais recente no topo">
          <FeedEventos items={feed} />
        </SectionCard>
        <SectionCard title="Chamados por região" subtitle="Distribuição da fila ativa">
          <BarChart
            labels={REGIOES}
            series={[{ key: 'ativos', name: 'Chamados ativos', values: porRegiao }]}
          />
        </SectionCard>
      </div>

      {/* Painel de detalhes — SOBRE a fila, sem reflow; só abre ao clicar */}
      {selecionado ? (
        <DetalheChamadoPanel chamado={selecionado} onClose={() => setSelectedId(null)} />
      ) : null}

    </div>
  );
}
