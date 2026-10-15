export const TIMEZONE = 'America/Sao_Paulo';
export const HISTORY_REFERENCE = '2026-10-06T22:00:00-03:00';
export const HISTORY_RANGE = Object.freeze({from:'2026-08-08',to:'2026-10-06'});
// Apenas datas civis aprovadas do demonstrador (2026, offset SP -03:00).
// Sem Date.parse de texto local ambíguo; anos adicionais exigem contrato.
export function boundary(value, end=false) {
 if(typeof value !== 'string' || !/^2026-\d{2}-\d{2}$/.test(value)) throw new TypeError('Data civil esperada: 2026-MM-DD');
 const [year,month,day]=value.split('-').map(Number);
 const d=new Date(Date.UTC(year,month-1,day));
 if(d.getUTCFullYear()!==year || d.getUTCMonth()!==month-1 || d.getUTCDate()!==day) throw new RangeError('Data civil inválida');
 return Date.parse(value+(end?'T23:59:59.999-03:00':'T00:00:00.000-03:00'));
}
export function instant(value) {
 if(typeof value!=='string' || !/^2026-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?-03:00$/.test(value)) throw new TypeError('Data/hora requer offset São Paulo explícito');
 boundary(value.slice(0,10));
 const hour=Number(value.slice(11,13)), minute=Number(value.slice(14,16)), second=Number(value.slice(17,19));
 if(hour>23 || minute>59 || second>59) throw new RangeError('Horário inválido');
 return Date.parse(value);
}
export function formatLocal(value) {
 instant(value);
 return value.slice(0,19).replace('T',' ');
}
