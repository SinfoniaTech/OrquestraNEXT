# Fontes e integridade

## Três fontes distintas

| Fonte | Finalidade | Regras |
| --- | --- | --- |
| HIST_60_DIAS | Consulta histórica, filtros, indicadores explicáveis | 736 registros/46 campos/736 IDs; referência 06/10/2026 22h; criação 08/08–06/10/2026 |
| T0/T1/T2 | Evolução operacional em momentos conhecidos | 10/16/24 registros, em 08/09/2026 08h/08h30/09h30; ligação por ID_Chamado |
| JavaScript da apresentação | Narrativa atual e dados visuais legados | Preservar fixtures e tempos; não apresentá-los como agregação do XLSX |

Fontes de apoio: RESUMO_60_DIAS para reconciliação, FILTROS_DEMO para cenários, LEIA-ME e guia DOCX para contexto. Não somar apoio ao histórico.

Histórico: 724 concluídos e 12 não concluídos; criticidade 253 Verde,345 Amarelo,72 Laranja,66 Vermelho. Não chamar 66 de críticos abertos. Hash SHA256 XLSX: 1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe.

JS: backofficeData fornece KPIs/séries/textos fixos; chamadosData fornece contagens-base, fila, chegadas, protagonista e feed; supervisor/data fornece listas/detalhes/regiões; tutorial/dados fornece Smart Fit e hospital. IDs compartilhados não comprovam integração ou igualdade semântica.

## Importação proposta

Converter XLSX para JSON antes da execução, com validação de abas/cabeçalhos/tipos/IDs, fonte e momento. Não implementar agora. Preservar originais, nulos e campos textuais; não preencher ausências com zero. Filtro de período usa Criado em; fuso e limites aguardam Q04/Q05. Criticidade pronta deve ser preservada. Percentual_SLA é fração; exibição percentual é valor ×100, sem presumir fórmula geradora.

Não há fórmulas Excel em nenhuma aba. Valores derivados são materializados: não se conhece algoritmo só por observar correlação. Dicionário registra regras pendentes.

## Temporalidade e snapshots

Não concatenar snapshots nem somar seus totais; mesmo ID reaparece atualizado. Proposta de chave de versão: fonte + momento + ID. Ausência posterior não prova conclusão/exclusão: validar semântica de snapshot completo antes de implementar substituição integral ou merge.

Feira deve reproduzir estados conhecidos. Não antecipar estado final nem inventar transições intermediárias. Pausa congela relógio e avanço; retomada sem duplicar eventos; reinício determinístico. Histórico não se torna automaticamente log de eventos. Fontes e modos devem estar visíveis.

## Possibilidades e limites

Suportados: contagem de chamados, distribuição de status/criticidade, custo estimado, agrupamentos por contrato/cliente/área/técnico/equipamento e motivos/insights fornecidos. TA/TB, aderência SLA e recorrência agregada exigem definições aprovadas.

Não suportados por esta base: receita, margem, TCO completo, estoque, depósitos/distâncias logísticas, skills, disponibilidade de técnicos e de ativos, número de pessoas presas e efeitos causais de ações. Usar EXT quando houver integração pendente; nunca inventar valor.

Todos os dados são sintéticos acadêmicos, não oficiais OTIS. Custo estimado não é P&L/TCO contábil e Impacto_Contrato é classificação simulada.

## Classificação revisada

BASE = campo fornecido; CALC = indicador derivado com fórmula aprovada; EXT = dependência externa ainda indisponível. Dados de demonstração permanecem sintéticos, independentemente da classe. Mock JavaScript é referência de cenário, não valor BASE do XLSX. Preservar JS legado sem exigir que a plataforma use suas regras.
