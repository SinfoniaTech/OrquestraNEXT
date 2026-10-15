# Resultado US03/US04 — integração de dados

## Proteção inicial e permanente

Branch feature/next-evolucao, HEAD 43dd0283728d8c78ae9017ae5acae8a1cf3101d5. No início havia 20 arquivos docs/ e 3 tests/ não versionados, sem alterações em arquivos rastreados. Nenhum git add, commit, tag, push ou deploy executado.

Proposta de registro permanente: após autorização, commit dedicado dos documentos/testes/evidências da proteção; depois commit separado da camada e testes; referência legada por tag/branch publicada e/ou bundle em armazenamento durável aprovado. Conservar SHA anterior e registrar SHA de cada aceite. /tmp não é proteção permanente. Enquanto não autorizados esses registros, arquivos novos continuam não versionados; não afirmar backup durável completo.

## Resultado da importação

| Fonte | Registros | Campos | Referência São Paulo |
| --- | --- | --- | --- |
| HIST_60_DIAS | 736, IDs únicos | 46 | 06/10/2026 22h |
| T0_Abertura | 10 | 46 | 08/09/2026 08h |
| T1_Acompanhamento | 16 | 46 | 08/09/2026 08h30 |
| T2_Desfecho | 24 | 46 | 08/09/2026 09h30 |

Histórico: Concluído 724; Em atendimento 4; Técnico a caminho 4; Contactado 2; Aberto 2. Criticidade: Amarelo 345; Verde 253; Laranja 72; Vermelho 66. TA null 8; TB null 12. Valores dos quatro conjuntos e de todos os campos confrontados diretamente com Excel, incluindo datas e nulos; nenhuma divergência. SHA XLSX preservado: 1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe.

## Testes executados

- 9 Python: reconversão --check, comparação de todos os campos das quatro abas e rejeição de aba/cabeçalho/ID/tipo/categoria/data/fórmula inválidos em cópias temporárias; sem saída parcial após erro de validação.
- 9 Node: schema/IDs, contagens, snapshots, nulos, consultas, limites inclusivos, datas inválidas e metadados CALC.
- 1 Vite + Chrome offline: módulo empacotado, consulta sem rede, timezone do browser Asia/Tokyo, referência local correta.
- 15 regressões anteriores: todas aprovadas; cenas/Supervisor intactos.
- 34 casos distintos aprovados. Os 9 de consulta/datas também passaram em TZ=UTC e TZ=Asia/Tokyo, além da rodada normal.
- Build atual aprovado, saída temporária, sem substituir dist local/publicação. Módulo novo verificado em build de biblioteca separado porque telas ainda não o importam.

Logs e resumo de importação em evidencias/. Nenhuma dependência instalada.

## Aceites e limites

US03 atendida: conversão validada e offline. US04 atendida para separação/acesso às fontes; reprodução e política de atualização ficam em US14, não implementadas. Nenhum filtro visual/tela novo. BASE e CALC explicados em metadados, EXT somente contrato sem valores fictícios.

Diferenças tratadas: datas da planilha são naive; agora offset explícito aprovado, sem alterar horário local. Percentual fonte usa fração, não escala 0–100. Python sistema sem openpyxl: usado pacote já presente no runtime. Helpers temporais limitados a 2026 do demonstrador. Não foi estabelecida fórmula para TA/TB/SLA/ETA/criticidade.

## Próxima entrega, somente após autorização

Estrutura de navegação e filtros do novo BackOffice, usando esta API e UX 1366×768. Aprovar fluxo login/demo/URLs e desenho das páginas sem PNG antes de finalizar tais telas. Regras ainda não validadas não podem virar cards calculados. Preservar Supervisor e snapshots. Nenhuma implementação dessa próxima entrega foi iniciada.
