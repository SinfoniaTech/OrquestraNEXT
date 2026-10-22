export const ACCESS_MODES = Object.freeze([
 {id:'apresentacao',label:'Apresentação guiada',hash:'/visao-geral',description:'Nove telas atuais, dados históricos e navegação manual.'},
 {id:'plataforma',label:'Plataforma livre',hash:'/visao-geral',description:'BackOffice com acesso demonstrativo e navegação livre.'},
 {id:'feira',label:'Feira — evolução temporal',description:'No serviço local, operação sincronizada. No site estático, simulação independente sinalizada.'},
 {id:'supervisor-feira',label:'Supervisor Feira',description:'Exige serviço autoritativo no notebook e pareamento. O site estático não sincroniza um celular.'},
 {id:'legado',label:'Legado — dez cenas',hash:'/1',description:'Apresentação antiga preservada, com dados e temporizadores próprios, independentes do histórico.'},
]);
export function resolveMode(search, synced=false){
 const params=new URLSearchParams(search),values=params.getAll('modo');
 if(!values.length)return 'apresentacao';
 if(values.length!==1||!ACCESS_MODES.some(mode=>mode.id===values[0]))return 'invalido';
 return values[0]==='feira'&&(synced||params.has('sessao'))?'feira-conectada':values[0];
}
export function modeHref(id){
 const mode=ACCESS_MODES.find(mode=>mode.id===id);
 if(!mode)throw new RangeError('Modo desconhecido');
 return '?modo='+mode.id+(mode.hash?'#'+mode.hash:'');
}
