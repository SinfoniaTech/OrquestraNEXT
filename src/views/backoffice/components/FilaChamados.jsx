import { useState } from 'react';
import Badge from './Badge.jsx';
import Icon from './icons.jsx';
import PrioridadeBadge from './PrioridadeBadge.jsx';
import SlaBar from './SlaBar.jsx';
import { PRIORIDADES, STATUS_LABEL, STATUS_TONE } from '../data/chamadosData.js';
import bk from '../BackofficeView.module.css';
import styles from '../chamados.module.css';

/**
 * FILA DE CHAMADOS — largura total, ordenada por chegada (mais recente no
 * topo). Colunas: ID, Local · Equipamento, Ocorrência, Prioridade (badge),
 * Região, Status (badge), SLA (barra + tempo), Responsável e seta indicando
 * linha clicável. A linha do protagonista tem barra de acento à esquerda;
 * linhas que chegam na cena "aberto" entram deslizando no topo.
 *
 * Acessibilidade: cada linha é focável e abre o painel de detalhes por
 * clique, Enter ou Espaço. O Espaço da linha focada NÃO navega entre cenas
 * (stopPropagation), mesmo tratamento que o controlador dá a botões focados.
 */
const COLS = [
  { key: 'id', label: 'ID' },
  { key: 'localEquipamento', label: 'Local · Equipamento' },
  { key: 'ocorrencia', label: 'Ocorrência' },
  { key: 'prioridade', label: 'Prioridade' },
  { key: 'regiao', label: 'Região' },
  { key: 'status', label: 'Status' },
  { key: 'sla', label: 'SLA restante' },
  { key: 'responsavel', label: 'Responsável' },
  { key: 'acao', label: '' },
];

const MAX_VISIBLE = 10;

export default function FilaChamados({ rows, totalN, protPrev = null, arrivalKind = {}, selectedId, onSelect }) {
  // chips de filtro (estado puramente local de UI)
  const [filtros, setFiltros] = useState({ status: 'Todos', prioridade: 'Todas', regiao: 'Todas' });
  const setFiltro = (grupo, valor) => setFiltros((f) => ({ ...f, [grupo]: valor }));

  const filtradas = rows.filter(
    (r) =>
      (filtros.status === 'Todos' || STATUS_LABEL[r.status] === filtros.status) &&
      (filtros.prioridade === 'Todas' || PRIORIDADES[r.prioridade].label === filtros.prioridade) &&
      (filtros.regiao === 'Todas' || r.regiao === filtros.regiao),
  );
  const visiveis = filtradas.slice(0, MAX_VISIBLE);

  return (
    <>
      <div className={bk.filterRow}>
        <FiltroChips
          label="Status"
          options={['Todos', 'Aberto', 'Encaminhado ao supervisor', 'Em atendimento']}
          active={filtros.status}
          onChange={(v) => setFiltro('status', v)}
        />
        <FiltroChips
          label="Prioridade"
          options={['Todas', 'Crítica', 'Alta', 'Média', 'Normal']}
          active={filtros.prioridade}
          onChange={(v) => setFiltro('prioridade', v)}
        />
        <FiltroChips
          label="Região"
          options={['Todas', 'Centro', 'Zona Sul', 'Zona Norte', 'Zona Leste', 'Zona Oeste']}
          active={filtros.regiao}
          onChange={(v) => setFiltro('regiao', v)}
        />
      </div>

      <div className={bk.tableScroll}>
        <table className={bk.table}>
          <thead>
            <tr className={bk.tableHeadRow}>
              {COLS.map((col) => (
                <th key={col.key} className={bk.tableHeadCell} scope="col">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visiveis.map((r) => (
              <tr
                key={r.id}
                tabIndex={0}
                role="button"
                aria-label={`Abrir detalhes do chamado ${r.codigo}`}
                className={rowClasses(r, selectedId, arrivalKind)}
                onClick={() => onSelect(r.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation(); // Espaço da linha focada ativa a linha, não a cena
                    onSelect(r.id);
                  }
                }}
              >
                <td className={`${bk.tableCell} ${bk.tableCellStrong} ${styles.cellId}`}>{r.codigo}</td>
                <td className={bk.tableCell}>{r.localEquipamento}</td>
                <td className={bk.tableCell}>{r.ocorrencia}</td>
                <td className={bk.tableCell}>
                  <PrioridadeBadge prioridade={r.prioridade} />
                </td>
                <td className={bk.tableCell}>{r.regiao ?? '—'}</td>
                <td className={bk.tableCell}>
                  <Badge text={STATUS_LABEL[r.status]} tone={STATUS_TONE[r.status]} />
                </td>
                <td className={bk.tableCell}>
                  <SlaBar
                    pct={r.slaPct}
                    prevPct={r.protagonista && protPrev ? protPrev.slaPct : null}
                    remaining={r.slaRestante}
                    concluded={r.status === 'concluido'}
                  />
                </td>
                <td className={bk.tableCell}>{r.responsavel ?? '—'}</td>
                <td className={bk.tableCell}>
                  <Icon name="chevron-right" size={14} className={styles.rowArrow} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.filaFooter}>
        Mostrando {visiveis.length} de {totalN.toLocaleString('pt-BR')}
      </p>
    </>
  );
}

/** Classes de uma linha: protagonista/selecionada/chegando. */
function rowClasses(r, selectedId, arrivalKind) {
  const classes = [bk.tableRow, styles.filaRow];
  if (r.protagonista) classes.push(styles.rowProtagonista);
  if (r.id === selectedId) classes.push(styles.rowSelected);
  const kind = arrivalKind[r.id];
  if (kind === 'background') classes.push(styles.rowArriving);
  if (kind === 'protagonista') classes.push(styles.rowArrivingProtagonista);
  return classes.filter(Boolean).join(' ');
}

/** Um grupo de chips de filtro (reusa os chips da Gestão Técnica). */
function FiltroChips({ label, options, active, onChange }) {
  return (
    <span className={styles.filtroGrupo} role="group" aria-label={`Filtro por ${label}`}>
      <span className={bk.filterLabel}>{label}:</span>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`${bk.filterChip} ${opt === active ? bk.filterChipActive : ''}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </span>
  );
}

