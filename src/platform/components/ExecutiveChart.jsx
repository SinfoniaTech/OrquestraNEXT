import {useEffect,useRef,useState} from 'react';
import styles from '../pages/PerformancePage.module.css';
import {civilLabel} from '../services/chamados.js';
export default function ExecutiveChart({days,series,valueLabel,onDay,label,compact=false}){
 const chartWrap=useRef(null);const [chartWidth,setChartWidth]=useState(compact?333:300);
 useEffect(()=>{
  if(!chartWrap.current||typeof ResizeObserver==='undefined')return;
  const obs=new ResizeObserver(entries=>{const e=entries[0];const w=Math.round(e?.contentRect?.width??0);if(w>0)setChartWidth(w);});
  obs.observe(chartWrap.current);return ()=>obs.disconnect();
 },[]);
 const aspect=compact?142/333:128/300;
 const chartHeight=Math.max(80,Math.round(chartWidth*aspect));
 const padL=35,padR=20,padBottom=21;
 const spanX=Math.max(10,chartWidth-padL-padR);
 const x=i=>padL+(days.length===1?spanX/2:i*spanX/(days.length-1));
 const bottomY=chartHeight-padBottom;
 const topY=Math.round(chartHeight*0.17);
 const dateY=chartHeight-4;
 const values=days.flatMap(d=>series.map(s=>s.value(d))).filter(v=>v!==null);
 const maximum=Math.max(1,...values);
 const y=value=>bottomY-(value/maximum)*(bottomY-topY);
 const x0=points=>points[0].x;
 return <><div ref={chartWrap}><svg className={styles.chart} viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={label}>
  {[0,maximum/2,maximum].map((n,i)=><g key={i}><line x1={padL} x2={padL+spanX} y1={y(n)} y2={y(n)} stroke="#e7eef7"/><text x="0" y={y(n)+4}>{valueLabel(n,true)}</text></g>)}
  {series.map(s=>{
   const runs=[];let run=[];
   days.forEach((d,i)=>{const value=s.value(d);if(value===null){if(run.length)runs.push(run);run=[];}else run.push({x:x(i),y:y(value)});});if(run.length)runs.push(run);
   return <g key={s.label}>{series.length===1&&runs.map((points,i)=>points.length>1&&<polygon key={'a'+i} points={[x0(points)+','+bottomY,...points.map(p=>p.x+','+p.y),points.at(-1).x+','+bottomY].join(' ')} fill={s.color} opacity=".1"/>)}{runs.map((points,i)=>points.length===1?<circle key={i} cx={points[0].x} cy={points[0].y} r="3" fill={s.color}/>:<polyline key={i} points={points.map(p=>p.x+','+p.y).join(' ')} fill="none" stroke={s.color} strokeWidth="1.5"/>)}</g>;
  })}
  {days.filter((d,i)=>i===0||i===days.length-1||i===Math.floor(days.length/2)).map(d=><text key={d.date} x={x(days.indexOf(d))} y={dateY} textAnchor="middle">{civilLabel(d.date).slice(0,5)}</text>)}
 </svg></div>
 <div className={styles.legend}>{series.map(s=><span key={s.label}><i style={{background:s.color}}/>{s.label}</span>)}</div>
 <div className={styles.days} aria-label={label+' por dia'}>{days.map(d=><button key={d.date} aria-label={label+' em '+civilLabel(d.date)+': '+series.map(s=>s.label+' '+valueLabel(s.value(d),false)).join(', ')} onClick={()=>onDay(d)}>{civilLabel(d.date).slice(0,5)} · {series.map(s=>valueLabel(s.value(d),false)).join(' / ')}</button>)}</div></>;
}
