export const TEMPORAL_DEFINITIONS=Object.freeze({
 TA:Object.freeze({label:'TA — Tempo até a chegada (min)',definition:'Intervalo entre abertura (Criado em) e Chegou ao Edifício, em minutos. Definição confirmada pelo responsável pela geração da massa sintética e verificada numericamente nos registros comparáveis.'}),
 TB:Object.freeze({label:'TB — Tempo de resolução simulado (min)',definition:'Intervalo entre chegada ao edifício e encerramento técnico simulado, em minutos, confirmado pelo responsável pela geração. O encerramento técnico não foi persistido como evento na planilha. TB não equivale a permanência até Saída nem a SLA restante.'})
});
export const SYNTHETIC_TIME_NOTICE='Definições exclusivas da massa sintética; não confirmam conceitos ou contratos oficiais da OTIS. Valores materializados preservados, sem recalcular TA/TB. Saída inclui permanência adicional após resolução: 3–10 min no histórico e 5 min nos snapshots.';
