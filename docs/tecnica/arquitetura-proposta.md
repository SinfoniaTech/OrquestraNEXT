# Arquitetura proposta — novo BackOffice NEXT

Atualização de escopo autorizada pelo usuário em 15/10/2026. Documento de planejamento: não implementado. Substitui a obrigação de equivalência visual do BackOffice, mas não apaga o diagnóstico e a referência legada.

## Objetivo e limites

Reestruturar o BackOffice como plataforma operacional/executiva baseada em referencias/telas/ e no XLSX. Preservar Supervisor, suas cenas, dados e dependências transitivas nesta fase. As imagens não são fontes numéricas. Nenhuma integração real ou autenticação é presumida.

## Composição proposta

```text
Entrada / escolha de experiência
├── Login / acesso demonstrativo
├── Novo BackOffice
│   ├── Shell desktop: 12 menus + cabeçalho + filtros + conteúdo
│   ├── Plataforma: consulta histórica livre
│   ├── Apresentação: navegação manual, estado temporal estável
│   └── Feira: evolução temporal determinística com controles
├── Adaptador de acesso ao Supervisor legado
│   └── Supervisor/cenas existentes, sem mudança de componentes/dados
└── Acesso legado compatível, enquanto aprovado
    └── SceneController + roteiro antigo recuperável
```

Camadas do novo BackOffice:
1. Importação validada, somente após autorização: histórico e snapshots em saídas distintas, com metadados.
2. Domínio: funções puras de consulta, agregação e contrato de indicadores; nenhuma regra arbitrária de TA/TB/SLA.
3. Estado de filtros: único conjunto selecionado antes de cards, gráficos, tabelas e exportação.
4. Sessão de apresentação/Feira: seleção explícita de fonte e momento. Relógio simulado único; separado do relógio do navegador.
5. UI: estrutura conforme PNGs, componentes reutilizados quando adequados e adaptadores onde necessário.
6. Proveniência: BASE/CALC/EXT por indicador, definições e drill-down.

Não é necessário manter o layout antigo do BackOffice ou consolidar suas cópias antes de criar o novo. Preferir construção paralela com migração por página para reduzir risco. Não duplicar regras novas entre árvores. Não introduzir backend/router/store/biblioteca gráfica sem necessidade demonstrada.

## Substituição gradual e recuperação

- Referência recuperável: SHA 43dd0283728d8c78ae9017ae5acae8a1cf3101d5. Confirmar disponibilidade e procedimento de recuperação antes de substituir pontos de entrada.
- Proposta: manter acesso legado durante migração e trocar a entrada principal somente após validação. URLs finais e retirada do acesso legado exigem aprovação.
- Registrar página antiga → nova, componentes mantidos/substituídos, motivo técnico, dados e evidências de aceite.
- Não refatorar automaticamente dependências importadas pelo Supervisor. Compartilhamento novo deve ser isolado ou aprovado com teste de impacto.
- Substituição planejada não é regressão visual do BackOffice; regressão é perder requisito aprovado, dados, navegação ou compatibilidade deliberadamente mantida.
- Não executar git reset/revert, criar tag ou publicar retorno sem autorização. Recuperabilidade não significa reverter trabalho do usuário.

## Proteção do Supervisor

Escopo congelado: layout/mobile, navegação, criticidade, alertas, notificações, animações, transições, detalhes e temporizadores; inclui tutorial, componentes, CSS, dados e shell que o afetam. Comparar arquivos/imports e comportamento com o SHA de referência. App/controlador poderão futuramente receber adaptação de entrada aprovada; teste garante que montagem, hash e timers do Supervisor continuam equivalentes.

Integração real ao novo domínio é entrega posterior, fora do escopo atual. Ao acessar a demo, avisar que usa dados roteirizados independentes e evolução temporizada própria. Não repassar o ID filtrado como se fosse a mesma ocorrência. Congelar relógio da Feira antes da saída; retorno restaura BackOffice e filtros; retomada somente explícita.

## Fluxo principal

LOGIN → VISÃO GERAL → FILTROS → INDICADORES → DETALHAMENTO → INSIGHTS.

De Chamados/SLA/Riscos/Equipamentos, ação proposta “Ver demonstração do Supervisor”. Transição com aviso de fonte independente e possibilidade de cancelar; abre experiência legada; retorno claro ao BackOffice preserva contexto. Nova navegação não deve tomar setas/atalhos do Supervisor; somente um consumidor de hash/teclado por vez. Autenticação real, seleção de cena de entrada e política de retorno aguardam Q08/Q13.

Apresentação do novo BackOffice não avança snapshots ou muda números por timer. Supervisor legado conserva seus timers: sua ativação é explícita e informada; não é sincronização do novo modo manual.

## UX e critérios técnicos

Resolução principal 1366×768, notebooks 14–16 polegadas; evitar corte de ações/menu. Tabelas podem rolar horizontalmente dentro do conteúdo sem destruir o shell; estados vazios/EXT e explicações devem caber e ser acessíveis por teclado. Login + 12 destinos confirmados; três páginas ainda sem PNG. Não inventar arte final para elas como se já homologada.
