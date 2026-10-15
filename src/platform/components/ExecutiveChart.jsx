import styles from '../pages/PerformancePage.module.css';
import {civilLabel} from '../services/chamados.js';
export default function ExecutiveChart({days,series,valueLabel,onDay,label}){
 const values=days.flatMap(d=>series.map(s=>s.value(d))).filter(v=>v!==null);
 const maximum=Math.max(1,...values),x=i=>35+(days.length===1?120:i*240/(days.length-1)),y=value=>125-value/maximum*100;
 return <><svg className={styles.chart} viewBox="0 0 300 160" role="img" aria-label={label}>
  {[0,maximum/2,maximum].map((n,i)=><g key={i}><line x1="35" x2="280" y1={y(n)} y2={y(n)} stroke="#e7eef7"/><text x="0" y={y(n)+4}>{valueLabel(n,true)}</text></g>)}
  {series.map(s=>{
   const runs=[];let run=[];
   days.forEach((d,i)=>{const value=s.value(d);if(value===null){if(run.length)runs.push(run);run=[];}else run.push({x:x(i),y:y(value)});});if(run.length)runs.push(run);
   return <g key={s.label}>{runs.map((points,i)=>points.length===1?<circle key={i} cx={points[0].x} cy={points[0].y} r="3" fill={s.color}/>:<polyline key={i} points={points.map(p=>p.x+','+p.y).join(' ')} fill="none" stroke={s.color} strokeWidth="2"/>)}</g>;
  })}
  {days.filter((d,i)=>i===0||i===days.length-1||i===Math.floor(days.length/2)).map(d=><text key={d.date} x={x(days.indexOf(d))} y="151" textAnchor="middle">{civilLabel(d.date).slice(0,5)}</text>)}
 </svg><div className={styles.legend}>{series.map(s=><span key={s.label}><i style={{background:s.color}}/>{s.label}</span>)}</div>
 <div className={styles.days} aria-label={label+' por dia'}>{days.map(d=><button key={d.date} aria-label={label+' em '+civilLabel(d.date)+': '+series.map(s=>s.label+' '+valueLabel(s.value(d),false)).join(', ')} onClick={()=>onDay(d)}>{civilLabel(d.date).slice(0,5)} · {series.map(s=>valueLabel(s.value(d),false)).join(' / ')}</button>)}</div></>;
}
