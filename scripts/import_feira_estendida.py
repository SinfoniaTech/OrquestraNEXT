#!/usr/bin/env python3
"""Importa somente as quatro abas Feira; reutiliza normalização histórica sem alterá-la."""
import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import re
import openpyxl
from import_orquestra import normalize, ENUMS

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'datasets/ORQUESTRA_Modo_Feira_Estendido_12_Estados.xlsx'
OUTPUT = ROOT / 'src/feira/data/generated.json'
COUNTS = [10,16,24,27,30,34,37,41,44,48,51,55]
RANK = {s:i for i,s in enumerate(['Aberto','Contactado','Técnico a caminho','Em atendimento','Concluído'])}

def table(workbook, name):
    iterator = iter(workbook[name].values)
    header = next(iterator)
    for row in iterator:
        if row and isinstance(row[0],str) and re.fullmatch(r'T\d{2}',row[0]):
            yield dict(zip(header,row))

def require(condition, message):
    if not condition:
        raise ValueError(message)

def convert(source=SOURCE, output=OUTPUT, check=False):
    workbook = openpyxl.load_workbook(source,read_only=True,data_only=False)
    try:
        fields = next(workbook['T0_Abertura'].values)
        require(len(fields)==46,'Schema original deve conter 46 campos')
        script = list(table(workbook,'FEIRA_ROTEIRO'))
        require([r['ID_Snapshot'] for r in script]==[f'T{i:02}' for i in range(12)],'Ordem dos 12 estados inválida')
        rules = dict(list(workbook['FEIRA_REGRAS'].values)[1:])
        require('SNAPSHOTS' in rules and 'DURAÇÃO' in rules,'Regras sintéticas ausentes')
        header, *raw = list(workbook['FEIRA_ESTENDIDA'].values)
        require(tuple(header)==tuple(fields)+('ID_Snapshot','Origem_Cenario'),'Schema estendido incompatível')
        grouped = {r['ID_Snapshot']:[] for r in script}
        for values in raw:
            if not values or not values[0]:
                continue
            require(len(values)==48,'Registro deve conter 48 campos')
            require(not any(isinstance(v,str) and v.startswith('=') for v in values),'Fórmula em dados operacionais')
            row = {k:normalize(k,v) for k,v in zip(header,values)}
            require(row['ID_Snapshot'] in grouped,'Snapshot desconhecido')
            for field, allowed in ENUMS.items():
                require(row[field] in allowed,f'Enum inválido: {field}')
            grouped[row['ID_Snapshot']].append(row)
        snapshots=[]; expected_events=[]; previous={}; previous_reference=None
        source_hash=hashlib.sha256(Path(source).read_bytes()).hexdigest()
        for index,step in enumerate(script):
            snap=step['ID_Snapshot']; rows=grouped[snap]
            reference=normalize('Momento_Dataset',step['Horario_Operacional'])
            require(reference.startswith('2026-09-08T'),'Dia operacional incompatível')
            require(previous_reference is None or reference>previous_reference,'Horários fora de ordem')
            previous_reference=reference
            require(step['Duracao_1x_s']==27,'Duração incompatível')
            require(len(rows)==COUNTS[index]==step['Chamados_Total'],f'Contagem incompatível em {snap}')
            current={r['ID_Chamado']:r for r in rows}
            require(len(current)==len(rows) and None not in current,f'IDs duplicados/ausentes: {snap}')
            require(previous.keys()<=current.keys(),'Chamado removido da sequência')
            for id,row in current.items():
                require(row['Momento_Dataset']==reference,'Referência de registro divergente')
                require(row['Criado em'] is not None,'Criação ausente')
                for key in ['Criado em','Contactado','Aceito','Chegou ao Edifício','Saída']:
                    require(row[key] is None or row[key]<=reference,f'Evento futuro em {snap}/{id}/{key}')
                require(row['TA'] is None or row['Chegou ao Edifício'] is not None,'TA sem chegada')
                require(row['Status']=='Concluído' or (row['TB'] is None and row['Fechamento'] is None),'Conclusão antecipada')
                old=previous.get(id)
                if old:
                    require(all(row[k]==old[k] for k in ['Unidade','Cliente','Contrato','Criado em']),'Identidade alterada')
                    require(RANK[row['Status']]>=RANK[old['Status']],'Status regrediu')
                    for key,kind in [('Status','STATUS'),('Criticidade_ORQUESTRA','CRITICIDADE')]:
                        if old[key]!=row[key]:expected_events.append((snap,id,kind,old[key],row[key]))
                else:expected_events.append((snap,id,'NOVO',None,row['Status']))
            active=[r for r in rows if r['Status']!='Concluído']; colors=Counter(r['Criticidade_ORQUESTRA'] for r in active)
            changes=[e for e in expected_events if e[0]==snap]
            for column,actual in [('Ativos',len(active)),('Concluidos_Acumulados',len(rows)-len(active)),('Novos',sum(e[2]=='NOVO' for e in changes)),('Mudancas_Status',sum(e[2]=='STATUS' for e in changes)),('Mudancas_Criticidade',sum(e[2]=='CRITICIDADE' for e in changes))]+[(color+'_Ativo',colors[color]) for color in ['Verde','Amarelo','Laranja','Vermelho']]:
                require(step[column]==actual,f'Indicador roteiro divergente: {snap}/{column}')
            metadata={'sourceFile':Path(source).name,'sourceSha256':source_hash,'sheet':snap,'kind':'snapshot','timezone':'America/Sao_Paulo','reference':reference,'synthetic':True,'fieldCount':48,'recordCount':len(rows),'schemaVersion':1}
            snapshots.append({'id':snap,'label':step['Fase'],'durationMs':step['Duracao_1x_s']*1000,'highlight':step['Destaque_Observado'],'metadata':metadata,'records':rows})
            previous=current
        require(snapshots[0]['metadata']['reference']=='2026-09-08T08:00:00-03:00' and snapshots[-1]['metadata']['reference']=='2026-09-08T17:00:00-03:00','Limites do dia operacional incompatíveis')
        events=list(table(workbook,'FEIRA_EVENTOS'))
        actual=[]
        for event in events:
            event['Horario_Observacao']=normalize('Momento_Dataset',event['Horario_Observacao'])
            snap=next(s for s in snapshots if s['id']==event['ID_Snapshot'])
            require(event['Horario_Observacao']==snap['metadata']['reference'],'Horário de observação divergente')
            row=next((r for r in snap['records'] if r['ID_Chamado']==event['ID_Chamado']),None)
            require(row is not None and row['Unidade']==event['Unidade'],'Evento sem chamado/unidade correspondente')
            actual.append(tuple(event[k] for k in ['ID_Snapshot','ID_Chamado','Tipo_Mudanca','Valor_Anterior','Valor_Atual']))
        require(len(actual)==189 and Counter(actual)==Counter(expected_events),'Auditoria de 189 eventos divergente')
        require(sum(len(s['records']) for s in snapshots)==417 and len(previous)==55,'Totais divergentes')
        result={'schemaVersion':1,'sourceSha256':source_hash,'finalWaitMs':12000,'rules':rules,'snapshots':snapshots,'events':events}
        rendered=json.dumps(result,ensure_ascii=False,indent=2,allow_nan=False)+'\n'
        if check:
            require(Path(output).exists() and Path(output).read_text(encoding='utf-8')==rendered,'Importação desatualizada')
        else:
            Path(output).parent.mkdir(parents=True,exist_ok=True);Path(output).write_text(rendered,encoding='utf-8')
        print('Feira estendida: 12 snapshots, 417 registros, 55 IDs finais, 189 eventos; '+('--check OK' if check else 'gerado'))
        return result
    finally:
        workbook.close()

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source',type=Path,default=SOURCE);parser.add_argument('--output',type=Path,default=OUTPUT);parser.add_argument('--check',action='store_true')
    args=parser.parse_args();convert(args.source,args.output,args.check)
