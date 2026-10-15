# Explicabilidade BASE/CALC/EXT dos cards

Requisito transversal de todas as histórias e telas, inclusive cards novos e gráficos com KPI. Mocks legados permanecem como referência recuperável e no Supervisor; não alimentar novos cards como se fossem XLSX. Mudança visual nesses cards será atividade futura autorizada.

## Contrato de cada card

Antes de liberar qualquer card, registrar: identificador e título; pergunta respondida; fonte/aba/versão; população e exclusões; período e momento de referência; unidade; fórmula aprovada ou campo materializado; tratamento de nulos e denominador; filtros aplicáveis; arredondamento só na apresentação; regra de comparação e cobertura do período anterior; acesso aos registros de suporte; estado vazio, erro e indisponibilidade.

Detalhe explicativo acessível por teclado e sem depender só de hover. Mudança de filtros deve recalcular explicação/denominador e drill-down de forma coerente. Zero significa zero calculado; ausência é indisponível. Denominador zero deve mostrar não calculável, não 0%.

## Catálogo inicial, sujeito a validação

| Família | Regra sustentável / pendência |
| --- | --- |
| Chamados | Contar IDs únicos na fonte e recorte escolhido |
| Não concluídos | Status diferente de Concluído; não chamar de críticos |
| Criticidade | Contar campo fornecido por cor; distinguir abertos e histórico |
| Clientes/contratos/unidades/técnicos | Distintos presentes no recorte; não chamar de ativos/disponíveis sem cadastro |
| TA/TB médio | Bloqueado Q01; depois média dos elegíveis com N válido/nulos explícitos |
| Aderência/consumo SLA | Preservar consumo fornecido; aderência bloqueada Q02 |
| Recorrência | Distribuir Recorrencia_30d; taxa agregada bloqueada Q03; não somar como eventos únicos |
| Custo | Soma/média de Custo_Estimado_R$ rotulada estimativa sintética; definir granularidade |
| Impacto | Distribuição fornecida; regra de contrato sob pressão bloqueada Q09 |
| Variação/tendência | Comparar janelas equivalentes completas; sem base anterior mostrar indisponível |
| Insights | Mostrar motivo/insight fonte e registros associados; não inferir causalidade ou modelo preditivo |

Toda instância de card precisa preencher esse contrato; a tabela não autoriza automaticamente fórmulas pendentes.

## Classificação obrigatória

- BASE: campo disponível na fonte, sem alegar fórmula geradora conhecida.
- CALC: indicador calculado; informar fórmula aprovada e campos BASE de entrada. Soma/média/distintos são CALC.
- EXT: depende de integração não disponibilizada, com pequeno selo visual textual EXT junto ao título/valor indisponível.

Todo card registra classe, definição, origem e regra (ou ausência de cálculo). DEMO identifica natureza sintética; não substitui BASE/CALC/EXT. Informação mista deve separar parcelas e classes. O texto EXT é definido; detalhe gráfico/posicionamento final precisa de homologação UX em 1366×768.

## EXT — integração externa pendente

Selo textual EXT = depende de integração ainda não disponibilizada. Ao acioná-lo, explicar fonte necessária, campos, finalidade, última sincronização (se inexistente, dizer não conectado), e o que impede cálculo. Não sugerir integração ativa.

Card EXT não recebe número plausível, zero, variação ou gráfico inventado. Mostrar “Integração pendente”/“Dados indisponíveis”; não usar verde “dados atualizados”. Se parte for local, separar métricas por origem; não esconder mistura. Exportações e detalhe mantêm proveniência e indisponibilidade. Dado sintético válido é DEMO, não EXT automaticamente.

Aplicar EXT a receita/margem/TCO completo, custo de técnico, estoque/depósito/ETA logístico, skills, geolocalização, disponibilidade operacional e integrações externas. Classificação de contrato sob pressão permanece pendente até regra aprovada; não substituir Impacto_Contrato por margem.

Aceite: nenhum card sem metadados; todos EXT identificam dependência; teclado abre explicação; vazio/nulo não viram zero; filtros e drill-down conciliam; nenhuma causalidade não sustentada.

## Escopo aprovado C1

As restrições de Q01/Q02 acima foram parcialmente resolvidas pelo usuário para a demonstração: média dos valores informados TA/TB com unidade em validação; aderência baseada no Percentual_SLA materializado entre concluídos elegíveis; faixas contínuas de consumo. [Contrato e resultados](entrega-c1-sla-criticidade.md). SLA restante, definições operacionais e fórmulas geradoras não foram aprovados. C1 apresenta dez explicações CALC e listas de suporte; passageiro preso conta ocorrências históricas, não pessoas atualmente presas.

## C1.1 — TA/TB e SLA da simulação

Substituída a pendência de unidade/conceito apenas para a massa: TA — Tempo até a chegada (min); TB — Tempo de resolução simulado (min). Definições confirmadas pelo responsável via usuário; evidência numérica separada no dicionário. Médias CALC dos materializados, N independente e nulos preservados. Nenhum horário de resolução foi registrado na planilha; não criar evento BASE. Resultados SLA são da simulação e não possuem validade contratual oficial. [Entrega C1.1](entrega-c11-tempos.md).

## C2 — risco histórico e operação na referência

Cards contam: Vermelho, Laranja, Unidade distinta nos registros com Recorrencia_30d >=3, Contrato distinto nos registros de impacto Alto e não concluídos Laranja/Vermelho. Doze explicações CALC incluem os sete painéis de análise. Motivos compostos agrupados inteiros; evolução por data de criação e cor histórica, não transição de estados. Sugestões demonstrativas têm predicado, lista de suporte e exemplo BASE identificado. Sem modelo de ML, causalidade, margem negativa presumida ou número EXT inventado. [Contrato e evidências](entrega-c2-riscos.md).

## C3 — Síntese executiva

Custos estimados: soma de Custo_Estimado_R$ finito não negativo, N válido/total explícito; nulos não viram zero e sem elegíveis resulta indisponível. Nenhum arredondamento de origem; apresentação em reais com duas casas. Receita/margem/TCO contábil são EXT, com fonte necessária, não conectada, sem última sincronização/valor. Contratos com chamados não significa vigência. Contratos sob pressão selecionados por algum impacto Alto, mas custo/SLA/total/cor usam todos os registros filtrados do contrato; N Alto e motivos somente os eventos Alto. Gráficos diários por criação, não competência contábil ou dia de resolução; SLA sem elegíveis tem lacuna. [Contrato C3](entrega-c3-performance.md).

## C4 — Contratos & Margem

22 explicações na página principal, mais indicadores e painéis no detalhe com população e filtros contextuais de contrato/equipamento. Pressão binária reaproveita presença de Alto; cobertura ausente/parcial explícita, sem novos limiares. Proporção recorrente = chamados com Recorrencia_30d finita >0 / todos os chamados do contexto; ausentes/invalidos não contam no numerador e têm cobertura separada. Sem qualquer valor válido ou sem população: indisponível. Custos, SLA e médias reutilizam regras aprovadas. Receita contratada/margem/rentabilidade/TCO completo e vigência/valor/cobertura contratuais EXT, sem valores. BASE sintética identificada, sugestões com suporte e sem causalidade. [Regras, N, testes e aceite C4](entrega-c4-contratos.md).

## C5 — Custos / TCO

Custos totais reutilizam C3; médias reutilizam average C1 com N válido. Técnico informado é atribuição do chamado, não remuneração/mão de obra. Custo recorrente usa chamados >0 da C4, sem multiplicar eventos; grupos positivos/zero/desconhecidos são disjuntos. Participação monetária exige total válido >0. TA/TB×custo exigem ambos válidos e N pareado; grupos SLA reutilizam C1 com N independentes e sem causalidade. Desvio é somente de SLA simulado aprovado, sem juízo financeiro. TCO e composição financeira são EXT, sem rateio artificial. 19 explicações na página, cobertura de custo e filtros contextuais no detalhe. [Regras, N e testes](entrega-c5-custos.md).

## C6 — Equipamentos

Unidades/tipos distintos com chamados não são cadastro instalado/ativo. Card elevada mantém >=3 C2; gráfico por tipo usa Unidade distinta com algum >0 / Unidade distinta do próprio tipo, com cobertura de recorrência por unidade; sem cobertura, indisponível. Recorrência da tabela é máximo válido e último valor BASE identificados, nunca soma nem volume de chamados. Cor/insight são do último chamado por criação/ID, sem estado atual inferido. Disponibilidade EXT exige operação/exposição/paradas/telemetria; TA/TB não permitem uptime. 13 explicações principais e detalhe com campos BASE/contagens CALC, N/filtros contextuais e suporte. Sem causalidade, probabilidade ou ML treinado. [Regras e evidências](entrega-c6-equipamentos.md).
