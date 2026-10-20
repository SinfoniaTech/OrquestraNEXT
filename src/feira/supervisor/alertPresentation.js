// Presentation of approved snapshot facts; no clock, new threshold or mutation.
const number = value => typeof value === 'number' && Number.isFinite(value);
const format = value => new Intl.NumberFormat('pt-BR',{maximumFractionDigits:1}).format(value);
export function alertPresentation(row, reference) {
 const fraction=row.Percentual_SLA, duration=row.SLA_min;
 const valid=number(fraction)&&fraction>=0&&number(duration)&&duration>0;
 const elapsed=(Date.parse(reference)-Date.parse(row['Criado em']))/60000;
 // FEIRA_REGRAS: active consumption = elapsed since creation / SLA_min.
 // Reject inconsistent original materializations, future dates and rounded ambiguity.
 const consistent=valid&&row.Status!=='Concluído'&&Number.isFinite(elapsed)&&elapsed>=0&&Math.abs(elapsed/duration-fraction)<=0.000051;
 const remaining=consistent?Math.max(0,duration-elapsed):null;
 const reason=typeof row.Motivo_Criticidade==='string'?row.Motivo_Criticidade:'';
 const slaReason=/SLA|tempo acumulado/i.test(reason);
 const trapped=row['Passageiro Preso']==='Sim';
 const recurrence=/recorr[eê]ncia/i.test(reason);
 const nature=trapped?'Demanda crítica por impacto':slaReason&&valid?(fraction>=1?'SLA excedido':'Risco de SLA'):recurrence?'Recorrência relevante':'Prioridade operacional';
 const urgency=trapped?'Passageiro preso registrado.':slaReason&&valid?(fraction>=1?'Consumo atingiu ou ultrapassou o SLA.':'Consumo de SLA motivou a prioridade.'):recurrence?'Recorrência registrada no motivo da prioridade.':`Criticidade ${row.Criticidade_ORQUESTRA} informada na fonte.`;
 // Only explicit statements of waiting AND unavailability count as confirmed.
 const recorded=String(row['Descrição do Problema']??'').split(/[.;\n]/).find(part=>/^\s*(?:Atendimento\s+)?aguardando (?:peça|componente)\s*(?:por|[-—–:])\s*indisponibilidade registrada\s*$/i.test(part));
 let factor={level:'Não informado',text:'Impedimento não registrado.'};
 let recommendation=trapped?'Acompanhar atendimento crítico.':'Confirmar impedimento operacional com a equipe.';
 if(recorded){factor={level:'Confirmado',text:'Atendimento aguardando peça — indisponibilidade registrada.'};recommendation='Verificar disponibilidade do recurso registrado com a equipe.';}
 else if(['Aberto','Contactado','Técnico a caminho'].includes(row.Status)&&!row['Chegou ao Edifício']&&remaining!==null&&remaining>0&&number(row.ETA_min)&&row.ETA_min>remaining){factor={level:'Possível fator',text:'ETA do técnico ultrapassa a janela disponível.'};recommendation=trapped?'Acompanhar atendimento crítico e confirmar chegada do técnico.':'Confirmar chegada prevista do técnico.';}
 else if(slaReason&&valid&&fraction>=1&&!trapped)recommendation='Priorizar análise desta ocorrência com a equipe.';
 else if(recurrence&&!trapped)recommendation='Comparar ocorrências anteriores deste equipamento.';
 return {nature,urgency,factor,recommendation,slaRelated:slaReason&&!trapped,sla:{valid,fraction:valid?fraction:null,percent:valid?format(fraction*100):null,remaining,exceeded:valid&&fraction>=1,time:remaining===null?'Tempo restante não calculável nesta simulação':remaining===0?'Prazo consumido no snapshot':`≈ ${format(remaining)} min restantes no snapshot`}};
}
