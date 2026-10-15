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
