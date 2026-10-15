# Referência recuperável — procedimento sem sobrescrever trabalho

SHA: 43dd0283728d8c78ae9017ae5acae8a1cf3101d5. Objeto de commit presente no repositório atual. Não foi criada tag/branch/commit ou alterado o checkout atual.

## Evidência de recuperação

- /tmp/orquestra-protecao-43dd028/reference.tar: SHA256 4850901ebf83d6e59e145bc0143cbaa488df2e8cc7c6f81d9af7ddf624ca9a0b.
- /tmp/orquestra-protecao-43dd028/reference.bundle: SHA256 0825cdb75d417c2f2ecb27fccf0a5b9b263fe513f422b0e3d8b85d1289e30c66.
- git bundle verify aprovado: histórico completo, sem pré-requisitos externos.
- Clone do bundle em /tmp/orquestra-protecao-43dd028/recovered: HEAD correto; src idêntico por comparação recursiva.
- Archive extraído em /tmp/orquestra-protecao-43dd028/reference: src idêntico.
- Manifesto SHA256 por arquivo src em evidencias/source-sha256.json.

## Reproduzir em diretório novo autorizado

1. Conferir SHA256 do bundle contra este registro e executar git bundle verify.
2. Clonar o bundle em outro diretório vazio, nunca sobre o projeto atual.
3. Selecionar o SHA acima em detached HEAD apenas na cópia.
4. Comparar fontes com manifesto e preparar dependências somente se autorizado.
5. Validar build/testes da cópia antes de qualquer decisão de retorno/publicação.

Não executar reset --hard, limpar arquivos do usuário ou substituir deploy como parte da recuperação. Esta demonstração recuperou fontes, não certificou o artefato público do GitHub Pages.

## Retenção

/tmp é temporário e pode ser limpo; o bundle não é backup permanente fora da máquina. O commit permanece recuperável enquanto seu objeto Git estiver disponível. Antes de substituir/remover referências legadas, aprovar armazenamento durável do bundle ou referência remota. Documentos/testes não commitados não fazem parte do archive/bundle e precisam de preservação separada quando autorizada. Nenhum push/commit realizado aqui.

## Referência permanente até C2 — autorização de 15/10/2026

Commit local 03d8cedb20cc0754cbe07c01c08e0e62c688a428, branch feature/next-evolucao, mensagem: feat: consolida novo BackOffice até C2 e testes de regressão. Inclui 116 arquivos revisados; 117 testes e build aprovados antes do commit. Planilha/referências e Supervisor/cenas sem alterações. Sem push/deploy. Essa referência preserva as entregas até C2 independentemente de /tmp. C3 permanece em alterações locais e não faz parte desse commit. Recuperação sugerida: checkout isolado desse SHA, preservando alterações atuais; não usar reset destrutivo. SHA publicado continua dependendo de homologação de publicação, não inferir que este commit local foi publicado.
