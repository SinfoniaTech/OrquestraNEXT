import {getDataset,query,countBy,formatLocal} from '../src/data/orquestra/index.js';
globalThis.orquestraDataProbe=()=>({
 total:query({from:'2026-08-08',to:'2026-10-06'}).length,
 snapshots:['T0_Abertura','T1_Acompanhamento','T2_Desfecho'].map(s=>getDataset(s).records.length),
 reference:formatLocal(getDataset().metadata.reference),
 status:countBy(query(),'Status')
});
