import {PAGES} from '../platform/navigation.js';
const script=[
 ['visao-geral','Comece pela carteira, pelos indicadores e pelos limites das fontes financeiras.'],
 ['riscos-tendencias','Identifique recorrências e oportunidades de intervenção com evidência.'],
 ['sla-criticidade','Explique tempos, aderência e criticidade sem confundir suas definições.'],
 ['chamados','Aprofunde uma ocorrência, consulte o histórico e explore os filtros.'],
 ['contratos-margem','Relacione a pressão operacional aos contratos e às lacunas financeiras.'],
 ['custos-tco','Examine os custos estimados e as dependências de um TCO completo.'],
 ['equipamentos','Investigue unidades, componentes e recorrências observadas.'],
 ['tecnicos','Explore os vínculos e atendimentos históricos, sem inferir disponibilidade real.'],
 ['pecas','Conclua com inteligência de componentes; estoque e logística são fontes externas.'],
];
export const PRESENTATION_STEPS=Object.freeze(script.map(([id,purpose])=>Object.freeze({...PAGES.find(page=>page.id===id),purpose})));
export function presentationIndex(route){return PRESENTATION_STEPS.findIndex(step=>step.id===route);}
