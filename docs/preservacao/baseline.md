# Referência da versão atual
> Escopo revisado em 15/10/2026: este documento registra a referência legada, não obriga equivalência visual do novo BackOffice. Preservação comportamental/visual permanece obrigatória para o Supervisor (posições 3–10 e experiência completa). Posições 1–2 ficam documentadas e recuperáveis. Decisões atuais: [arquitetura proposta](../tecnica/arquitetura-proposta.md).


| Item | Observado |
| --- | --- |
| Data | 15/10/2026 |
| Raiz | /home/p2dutra/Documents/ChatGPT/Projeto_Challenge_OTIS/OrquestraNEXT |
| Branch | feature/next-evolucao |
| SHA | 43dd0283728d8c78ae9017ae5acae8a1cf3101d5 |
| Mensagem | docs: adiciona dataset e referencias para o NEXT |
| main local | a350cd0, referência local de origin/main |
| Estado inicial Etapa 2 | Git limpo, sem arquivos não versionados |

Dataset XLSX, guia DOCX e dez imagens já estão versionados; não há não versionados/ignorados nessas duas árvores. A branch atual não mostrou upstream. Não houve fetch: referências locais não comprovam estado remoto. Não foi identificado o SHA efetivamente publicado. node_modules e dist existem, são ignorados e não comprovam compilação do SHA atual.

## Contrato de preservação

Na referência legada, registrar dez posições e hashes #/1 a #/10. Na evolução, preservar integralmente o Supervisor e manter BackOffice antigo recuperável. Compatibilidade de acesso legado é proposta até corte aprovado; não exige organização visual antiga do BackOffice novo. Registrar limitações existentes separadamente de melhorias. [Matriz](matriz-cenas.md).

Evidência disponível: inspeção de código e funções puras em memória. Não há baseline visual homologada ou teste completo das dez cenas no navegador. Não certificar equivalência com o site público antes dessa comparação.

## Build e publicação

package.json: dev = vite; build = vite build; preview = vite preview; predeploy = npm run build; deploy = gh-pages -d dist. Deploy aciona build e publica: não executar nesta etapa.

Vite base /OrquestraNEXT; homepage https://sinfoniatech.github.io/OrquestraNEXT. Lockfile: React/React DOM 19.3.0, Vite 8.3.0, plugin React 6.1.1, gh-pages 6.3.0. Engines de Vite/plugin: Node ^20.19.0 || >=22.12.0. Sem workflow .github ou scripts de testes/lint versionados identificados.

Futura liberação exige assets/dados no subdiretório, refresh e hashes antigos, testes aprovados e procedimento de retorno. Segurança de dependências depende de auditoria posterior. Build, commits e publicação requerem autorização aplicável.
