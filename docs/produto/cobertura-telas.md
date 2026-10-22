# Login e 12 menus — cobertura confirmada de escopo

A atualização do usuário confirma as 13 identidades. Há dez PNGs; pendência das três últimas é visual, não mais funcional. Prioridade de UX: 1366×768 em notebooks de 14–16 polegadas. PNGs orientam aparência, não valores.

| ID | Tela | Referência | Histórias / dados / aceite específico |
| --- | --- | --- | --- |
| T01 | Login | PNG 1 | US06; definir demo/autenticação, sem simular segurança real |
| T02 | Visão Geral | PNG 2 | US10; síntese histórica, filtros e drill-down, BASE/CALC/EXT |
| T03 | Contratos & Margem | PNG 3 | US13; análise por contrato; receita/margem EXT |
| T04 | Custos / TCO | PNG 4 | US13; custo estimado CALC; TCO completo EXT, não sinônimos |
| T05 | Riscos & Tendências | PNG 5 | US11; motivos e janelas comparáveis; sem previsão inventada |
| T06 | Chamados | PNG 6 | US09; consulta/paginação/detalhe e ponte US19 |
| T07 | SLA & Criticidade | PNG 7 | US11; contexto e SLA separados; regras pendentes bloqueiam recálculo |
| T08 | Técnicos | PNG 8 | US12; registros por técnico; atividade/disponibilidade/skills EXT |
| T09 | Equipamentos | PNG 9 | US12; unidade, componente e histórico; disponibilidade EXT |
| T10 | Peças | PNG 10 | US18-A; shell e dependências; estoque/depósito/logística EXT |
| T11 | Padrões & Insights | Sem imagem confirmada | US10-B; definição visual pendente; insights fonte e suporte rastreáveis |
| T12 | Contratos — BackOffice | Sem imagem confirmada | US13-B; visual e operações pendentes; distinto de análise financeira |
| T13 | Integrações | Sem imagem confirmada | US18-A; catálogo EXT, não afirmar conexão ativa; visual pendente |

## Tarefas por lacuna

- US06-A: login/demo, destinos/erros/saída; autenticação real requer contrato específico.
- US10-B: desenhar Padrões & Insights para aprovação antes da UI final.
- US13-B: definir Contratos — BackOffice como consulta ou cadastro; escrita não é presumida.
- US18-A: entregar páginas Peças/Integrações com EXT e critérios locais, sem aguardar integração real.
- US15-A: menu, busca, período, foco, explicações e ações cabem em 1366×768; testar altura, zoom e rolagem.
- US19: ação clara das páginas operacionais para demo Supervisor e retorno preservando contexto.

Rastreabilidade de liberação: tela → história → componente → fonte/BASE-CALC-EXT → card/explicação → teste. Dez referências gráficas disponíveis; três layouts aguardam homologação. Não exigir preservação visual do BackOffice anterior para encerrar tela nova.

## Entrega B

T06 Chamados funcional com histórico, filtros compartilhados, seis indicadores, distribuições, atenção e detalhe. Referência visual adaptada aos 736 registros, sem números ilustrativos inventados. SLA restante numérico aguarda regra. Demais onze menus mantêm estado anterior. [Evidências](entrega-b-chamados.md).

## Entrega C1

T07 SLA & Criticidade funcional com valores da base (sem copiar métricas da imagem), filtros da B, aderência elegível, TA/TB, consumo/faixas, cores, motivos, agrupamentos e prioridades. Aprofundamento em listas e detalhe. Não implementa projeções/previsão automática da ilustração. SLA restante contratual segue pendente. Duas páginas funcionais, dez menus em desenvolvimento. [Relatório](entrega-c1-sla-criticidade.md).

## C2 — T05 Riscos & Tendências

Página funcional com cinco cards, cores, evolução diária de até 60 dias, área, recorrência por unidade/componente/categoria, contratos com impacto Alto, motivos completos, sugestões demonstrativas e registros ordenáveis. Reutiliza filtros e detalhe. Não reproduz seis meses ou variações ilustrativas da imagem. Três páginas funcionais; nove destinos pendentes. [Entrega C2](entrega-c2-riscos.md).

## C3 — T02 Visão Geral

Performance Operacional & Financeira na rota /visao-geral, primeira página após acesso demo. Seis cards, tabela até cinco contratos com lista completa, três gráficos diários, EXT financeiro e observações explicáveis. Não usa valores, metas, variações ou seis meses ilustrativos da referência. Menu permanece Visão Geral. Entrada padrão da aplicação segue apresentação original. Quatro páginas funcionais, oito destinos pendentes. [Relatório C3](entrega-c3-performance.md).

## C4 — T03 Contratos & Margem

Carteira operacional/econômica com quatro cards sustentados, quatro fontes financeiras EXT, tabela ordenável/paginada, detalhes por contrato/equipamento/chamado, seis gráficos e insights com suporte. Cinco páginas funcionais, sete destinos pendentes; nenhuma página de Equipamentos ou Contratos — BackOffice criada. [Relatório C4](entrega-c4-contratos.md). Referência T03 utilizada para hierarquia visual, sem números financeiros ou trimestre inventados. Aguardando homologação.

## C5 — T04 Custos / TCO

Cinco cards sustentados, TCO e composição financeira EXT, evolução diária, recorrentes/zero/desconhecidos, distribuição por contrato/área/técnico/equipamento/categoria/componente e demais campos disponíveis. Tabela carteira/chamados, pares custo×TA/TB, grupos SLA e aprofundamento com insights. Sem valores financeiros ilustrativos, 12 meses, trimestre ou causalidade inferidos. Seis páginas funcionais/seis destinos pendentes. [Entrega e evidências](entrega-c5-custos.md). Aguardando homologação C5.

## C6 — T09 Equipamentos

Carteira de 54 unidades no histórico completo, quatro tipos existentes (social/serviço/hospitalar/escada rolante), recorrência elevada C2, volume/máximo/último valor separados, identificação/histórico técnico/desempenho e insights com suporte. Quatro gráficos por componente, tipo (>0 por unidade), dia e cores; disponibilidade EXT sem percentual inventado. Sete páginas funcionais/cinco destinos pendentes. [Entrega C6](entrega-c6-equipamentos.md). Aguardando homologação; Feira planejada como próxima prioridade, sem implementação.


## C7 — T08 Técnicos

16 técnicos observados/736 vinculados/724 concluídos, TA35,4/N728, TB49,2/N724 e custo associado R$ 696.734,60/N736 no histórico completo. Carteira, múltiplos vínculos, status/criticidade, área/rota/supervisor, custos/recorrência/SLA e detalhe até equipamento/histórico/insight. Fontes reais de força de trabalho EXT. Oito páginas funcionais/quatro pendentes. [Relatório](entrega-c7-tecnicos.md). C6 aprovada para continuidade e commitada 05ec7d5; C7 aguarda homologação. Próxima prioridade C8 — Peças e Componentes, seguida da Feira, não iniciadas.


## C8 — T10 Peças

Referência 10_Pecas.png adaptada a análise sustentada: 10 componentes/11 subcomponentes/736 ocorrências/19 unidades com recorrência elevada/66 Vermelhos e R$ 696.734,60 de atendimentos. Carteira/detalhe/equipamento/ocorrência/histórico/insight, categorias/falhas/clientes/contratos/custos e filtros compartilhados. Disponibilidade por depósito e recomendações logísticas EXT; sem preço/saldo/consumo/compra/reserva/despacho. Nove páginas funcionais/três pendentes, 292 testes aprovados. [Relatório](entrega-c8-pecas.md). C8 aguarda homologação e não tem commit.
