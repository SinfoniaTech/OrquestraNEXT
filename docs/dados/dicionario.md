# Dicionário dos 46 campos

Fonte: datasets/ORQUESTRA_MVP_Base_60_Dias_Filtros_FINAL.xlsx, HIST_60_DIAS, cabeçalho linha 1; nulos observados em 736 registros. Tipos são físicos do Excel lido, não contrato de API. Zero nulos observado não garante obrigatoriedade em futuras cargas. Datas são células datetime sem fuso explícito.

Nenhuma aba contém fórmulas Excel. Todas as regras geradoras não fornecidas permanecem pendentes; não deduzi-las por correlação. Sem recálculo de TA/TB/SLA/criticidade autorizado. Textos devem ser preservados; números ficam numéricos; datas terão parsing explícito após Q04; Sim/Não pode ser convertido por adapter após contrato aprovado. Nulo permanece nulo, nunca zero/false por padrão.

| Nº | Campo | Tipo observado | Nulos HIST | Definição / cálculo / validação |
| --- | --- | --- | --- | --- |
| 1 | ID_Chamado | str | 0 | Identificador do chamado; unicidade por fonte/momento. Não é chave global entre cenários. |
| 2 | Categoria do Chamado | str | 0 | Categoria fornecida da ocorrência; enum observado não constitui catálogo definitivo. |
| 3 | Problema | str | 0 | Resumo do problema; preservar texto. |
| 4 | Descrição do Problema | str | 0 | Descrição detalhada fornecida; sem geração automática. |
| 5 | Status | str | 0 | Etapa fornecida; histórico: Aberto, Contactado, Técnico a caminho, Em atendimento, Concluído. Não equivale a criticidade. |
| 6 | Origem | str | 0 | Sistema/canal declarado, não conexão ativa: IoT, Monitoramento Remoto, Central de Atendimento, Aplicativo Cliente. |
| 7 | Unidade | str | 0 | Código do equipamento; não presumir unicidade global fora da fonte. |
| 8 | Tipo de Unidade | str | 0 | Elevador Social, Serviço, Hospitalar ou Escada Rolante no histórico; preservar valor completo. |
| 9 | Tipo Controle | str | 0 | Tipo de controle fornecido. |
| 10 | Tipo Máquina | str | 0 | Tipo de máquina fornecido. |
| 11 | Fabricante | str | 0 | Fabricante declarado; OTIS no histórico não prova dado oficial. |
| 12 | Código ROT | str | 0 | Código técnico fornecido; sem decodificação ROT presumida. |
| 13 | Componente Principal | str | 0 | Componente associado à ocorrência; não implica peça consumida. |
| 14 | Subcomponente | str | 0 | Subcomponente fornecido; sem catálogo externo. |
| 15 | Defeito | str | 0 | Descrição/classificação de defeito fornecida. |
| 16 | Falha | str | 0 | Descrição/classificação de falha; diferença formal de Defeito pendente. |
| 17 | Fechamento | str | 12 | Descrição de encerramento; nulo não deve virar conclusão presumida. |
| 18 | Cliente | str | 0 | Cliente vinculado ao chamado; não é cadastro mestre. |
| 19 | VIP | str | 0 | Marcador Sim/Não; conversão booleana proposta sem inferir prioridade. |
| 20 | Corporativo | str | 0 | Marcador Sim/Não; significado contratual detalhado pendente. |
| 21 | Contrato | str | 0 | Identificador contratual fornecido; presença não comprova vigência ou receita. |
| 22 | Área | str | 0 | Área operacional fornecida; SP-Centro/Norte/Oeste/Sul/Leste, GRU e ABC. |
| 23 | Técnico | str | 0 | Nome atribuído no registro; presença não comprova disponibilidade/atividade atual. |
| 24 | Supervisor | str | 0 | Supervisor atribuído; não presumir cadastro/autorização. |
| 25 | Rota | str | 0 | Rota declarada; não é trajeto geográfico calculado. |
| 26 | Endereço | str | 0 | Endereço textual; não possui coordenadas ou distância calculada. |
| 27 | Unidade de Negócio | str | 0 | Agrupamento organizacional fornecido; não inferir hierarquia universal. |
| 28 | Criado em | datetime | 0 | Data/hora de criação; campo de filtro temporal indicado pelo guia. Fuso/limites Q04/Q05. |
| 29 | Contactado | datetime | 2 | Marco de contato; nulo significa ausente na fonte, não horário zero. |
| 30 | Aceito | datetime | 4 | Marco de aceite; sem inferir duração/fórmula. |
| 31 | Chegou ao Edifício | datetime | 8 | Marco de chegada; sem assumir contrato de TA por correlação. |
| 32 | Saída | datetime | 12 | Marco de saída, após encerramento técnico simulado mais permanência adicional: 3–10 min no histórico e 5 min nos snapshots; não assumir encerramento de SLA. |
| 33 | TA | int | 8 | Inteiro materializado em minutos. TA = chegada menos abertura, confirmado para massa sintética pelo responsável via usuário na C1.1; não definição oficial OTIS. Ver evidências abaixo. |
| 34 | TB | int | 12 | Inteiro materializado em minutos. TB = encerramento técnico simulado menos chegada, confirmado pelo responsável via usuário na C1.1. Encerramento não persistido; diferente de Saída e de SLA restante. |
| 35 | Passageiro Preso | str | 0 | Sim/Não, contexto humano; não informa quantidade de pessoas. |
| 36 | Carro Parado | str | 0 | Sim/Não; não informa duração total de indisponibilidade. |
| 37 | SLA_min | int | 0 | Prazo em minutos pelo nome do campo; evento medido, pausas e fórmula de cumprimento pendentes Q02. |
| 38 | ETA_min | int | 0 | Estimativa em minutos pelo nome; instante/base de previsão e significado de zero pendentes Q02. |
| 39 | Percentual_SLA | float/int | 0 | Fração numérica materializada (1 = 100%); apresentação ×100. Fórmula geradora/relógio Q02; não recomputar pela data atual. |
| 40 | Recorrencia_30d | int | 0 | Contagem fornecida para janela de 30 dias; chave, inclusão do atual e taxa agregada Q03. Não somar como eventos únicos. |
| 41 | Criticidade_ORQUESTRA | str | 0 | Classificação fornecida Verde/Amarelo/Laranja/Vermelho; multifatorial no LEIA-ME. Pesos/limiares Q03; preservar sem recalcular. |
| 42 | Motivo_Criticidade | str | 0 | Justificativa textual fornecida; exibir origem, não inferir algoritmo completo. |
| 43 | Insight_ORQUESTRA | str | 0 | Insight sintético fornecido; não prova previsão, causalidade ou recomendação validada. |
| 44 | Custo_Estimado_R$ | float/int | 0 | Valor monetário sintético estimado em reais; composição/fórmula geradora não fornecida. Soma/média só no recorte explícito; não TCO/P&L. |
| 45 | Impacto_Contrato | str | 0 | Baixo/Médio/Alto fornecido; agregação de contrato sob pressão Q09, não margem. |
| 46 | Momento_Dataset | datetime | 0 | Data/hora do estado da fonte; diferente de criação e da data real de acesso. Fuso Q04. |

## Nulos por fonte operacional

Mesmos 46 cabeçalhos; validar por fonte, não aplicar obrigatoriedade histórica aos estados iniciais.

| Campo | T0 (10) | T1 (16) | T2 (24) |
| --- | --- | --- | --- |
| ID_Chamado | 0 | 0 | 0 |
| Categoria do Chamado | 0 | 0 | 0 |
| Problema | 0 | 0 | 0 |
| Descrição do Problema | 0 | 0 | 0 |
| Status | 0 | 0 | 0 |
| Origem | 0 | 0 | 0 |
| Unidade | 0 | 0 | 0 |
| Tipo de Unidade | 0 | 0 | 0 |
| Tipo Controle | 0 | 0 | 0 |
| Tipo Máquina | 0 | 0 | 0 |
| Fabricante | 0 | 0 | 0 |
| Código ROT | 0 | 0 | 0 |
| Componente Principal | 0 | 0 | 0 |
| Subcomponente | 0 | 0 | 0 |
| Defeito | 0 | 0 | 0 |
| Falha | 0 | 0 | 0 |
| Fechamento | 10 | 14 | 12 |
| Cliente | 0 | 0 | 0 |
| VIP | 0 | 0 | 0 |
| Corporativo | 0 | 0 | 0 |
| Contrato | 0 | 0 | 0 |
| Área | 0 | 0 | 0 |
| Técnico | 0 | 0 | 0 |
| Supervisor | 0 | 0 | 0 |
| Rota | 0 | 0 | 0 |
| Endereço | 0 | 0 | 0 |
| Unidade de Negócio | 0 | 0 | 0 |
| Criado em | 0 | 0 | 0 |
| Contactado | 2 | 0 | 0 |
| Aceito | 3 | 1 | 0 |
| Chegou ao Edifício | 8 | 7 | 4 |
| Saída | 10 | 14 | 12 |
| TA | 8 | 7 | 4 |
| TB | 10 | 14 | 12 |
| Passageiro Preso | 0 | 0 | 0 |
| Carro Parado | 0 | 0 | 0 |
| SLA_min | 0 | 0 | 0 |
| ETA_min | 0 | 0 | 0 |
| Percentual_SLA | 0 | 0 | 0 |
| Recorrencia_30d | 0 | 0 | 0 |
| Criticidade_ORQUESTRA | 0 | 0 | 0 |
| Motivo_Criticidade | 0 | 0 | 0 |
| Insight_ORQUESTRA | 0 | 0 | 0 |
| Custo_Estimado_R$ | 0 | 0 | 0 |
| Impacto_Contrato | 0 | 0 | 0 |
| Momento_Dataset | 0 | 0 | 0 |

## Regras transversais

- Validar 46 nomes e posições; falha deve identificar fonte/linha/campo. Sem descartar silenciosamente valores desconhecidos.
- ID único por histórico e por snapshot; repetição entre snapshots representa versão, não duplicidade global.
- Preservar precisão de origem; arredondar somente apresentação. Não tratar ausente como zero em médias; mostrar N válido/nulos após fórmula aprovada.
- Percentual_SLA observado 0,0333–1,7667; componentes legados usam pontos percentuais, portanto adapter é obrigatório.
- Faixas do guia 0–50/51–80/81–100/>100 precisam de limites contínuos para decimais, Q05. Criticidade é outro campo.
- Verificar coerência temporal como diagnóstico, sem corrigir automaticamente; significado de cada marco aguarda validação.
- Custos sem composição não autorizam margem/receita; nomes de técnicos não autorizam disponibilidade. EXT em métricas sem fonte.
- Decisões de negócio: [pendências](../produto/pendencias.md); origem e separação: [fontes](fontes.md).

## Uso no escopo revisado

Os 46 campos são BASE quando lidos diretamente do XLSX. Agregação/transformação produz CALC, sem autorizar regra geradora desconhecida. Métricas sem fonte são EXT e não recebem valor inventado. Definições pendentes continuam bloqueando cálculos, não a exibição fiel do campo fornecido com sua origem.

## Agregações aprovadas para a demonstração C1

Em 15/10/2026 o usuário aprovou expressamente aderência = concluídos com SLA_min finito > 0 e Percentual_SLA finito >= 0 e <= 1 / todos os concluídos com SLA_min finito > 0 e Percentual_SLA finito >= 0. Sem denominador, não calculável. Faixas de Percentual_SLA: [0;0,5], ]0,5;0,8], ]0,8;1], ]1;+infinito[. Consumo é fração, apresentado em %. Não significa cor de criticidade. TA/TB: média aritmética dos valores materializados informados (finitos e não negativos), zero válido incluído, ausentes excluídos; unidade ainda em validação. Não recomputar marcos, consumo original, criticidade ou prazo restante. As pendências anteriores permanecem para definições operacionais/contratuais; essas agregações estão autorizadas para demonstração.

## C1.1 — definições confirmadas da massa sintética — 15/10/2026

**Proveniência:** informação fornecida pelo usuário, que transmite a confirmação do responsável pela geração. Não é documentação oficial OTIS nem descoberta do script gerador (não localizado no repositório). As pendências anteriores de conceito/unidade foram resolvidas para esta massa; continuam abertas para operação/contrato reais.

| Campo | Definição confirmada pelo responsável | Evidência numérica independente |
| --- | --- | --- |
| TA | Chegada ao edifício menos abertura, em minutos | Histórico 728/728; T0 2/2; T1 9/9; T2 20/20 comparáveis coincidem |
| TB | Encerramento técnico simulado menos chegada, em minutos | Não há marco explícito de encerramento para verificação direta; valor preservado |
| Saída | Encerramento técnico simulado mais permanência adicional | Chegada→saída menos TB fica entre 3 e 10 min nos 724 concluídos históricos; é 5 min nos 2 comparáveis T1 e 12 T2; T0 não tem TB |
| Encerramento técnico | Usado na geração, não persistido como campo | Não criar timestamp nem classificá-lo como evento BASE |

TA — Tempo até a chegada (min). TB — Tempo de resolução simulado (min). Não são duração de deslocamento puro, permanência total no local ou prazo restante. Valores originais, nulos e cálculos de aderência permanecem intactos.

Histórico: TA N=728 (8 ausentes), TB N=724 (12 ausentes); médias 35,385989 e 49,172652 min. Cada média usa o próprio N válido, exclui nulos e inclui zero materializado válido. Sem elegíveis, não calculável. Ausência não prova falha de carga: acompanha marcos ainda indisponíveis nesta massa.

A correlação observada de Percentual_SLA com TA/TB não se torna fórmula contratual nem autorização de recálculo. SLA é resultado demonstrativo, sem validade oficial OTIS. Supervisor usa siglas com outros sentidos em alguns contextos; permanece separado e intacto.

[Contrato de visibilidade, testes e entrega](../produto/entrega-c11-tempos.md).

## Agregação de custo C3

Custo_Estimado_R$ mantém valor BASE por chamado. Soma CALC usa valores finitos não negativos no recorte explícito, incluindo todos os status, e expõe N válido/total; zero informado permanece válido. Sem valor elegível, indisponível, não zero. Exibição em R$ com duas casas, sem arredondar materializados. Gráfico usa coorte de criação do chamado, não data de despesa/competência. Receita, margem e TCO contábil continuam sem fonte (EXT). [Resultado C3](../produto/entrega-c3-performance.md).

## Proporção de recorrência autorizada na C4

Recorrencia_30d BASE permanece intacta. CALC aprovado pelo usuário: contar chamados cujo valor finito não negativo é >0 e dividir por todos os chamados do recorte/contexto, não somar o campo como eventos únicos. Cobertura = valores finitos não negativos / total; ausentes/invalidos não satisfazem >0 e permanecem no denominador total. Sem população ou qualquer valor válido, indisponível; zeros informados válidos produzem 0%. Histórico completo: 412/736 =56,0%, cobertura 736/736. Aplica-se a contrato/categoria/componente/equipamento; não altera a regra C2 de recorrência elevada >=3. [Contrato C4](../produto/entrega-c4-contratos.md).
