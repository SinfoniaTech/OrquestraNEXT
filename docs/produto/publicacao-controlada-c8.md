# C8 — homologação, versionamento e preparação de publicação

15/10/2026, America/Sao_Paulo. Usuário homologou visualmente C8 para continuidade e autorizou commit/envio de feature/next-evolucao ao origin. Substituir o conteúdo público do Pages depende de confirmação explícita do destino. Nenhuma publicação foi executada nesta preparação; main não será alterada. Modo Feira permanece não iniciado e sem escopo autorizado.

## Revisão e validação antes do commit

Raiz OrquestraNEXT e branch feature/next-evolucao confirmadas; HEAD inicial a5aea32e828d0258a9700c6eef0c4682a05ffe12. Conjunto inicial C8: 35 arquivos (14 modificados/21 não rastreados), sem staging. Produto, testes, documentação e evidências conhecidos; sem arquivo inesperado, temporário indevido ou padrões de credenciais identificados. Documentação de aceite/preparação e novas evidências desta revalidação acrescentadas ao conjunto autorizado, sem alterar código funcional.

**292 testes distintos aprovados =283 Node/browser +9 Python**, reexecutados nesta sessão. Importador --check e build de produção aprovados. A primeira tentativa de iniciar Vite novo encontrou limite ambiental EMFILE; nova execução integral usando a opção existente ORQUESTRA_DEV_URL=http://127.0.0.1:5173/OrquestraNEXT/ passou. Nenhuma mudança de código, testes ou limites do sistema para contornar essa falha; servidor do usuário preservado. A configuração de teste sem URL externa continua disponível, sujeita aos recursos do ambiente.

Verificação adicional do artefato de produção: acesso direto/refresh em /visao-geral, /chamados, /tecnicos e /pecas; apresentação original e Supervisor nas cenas 1/3/10; 1366×768 sem overflow, assets HTTP e JavaScript sem erros. Regressão completa inclui dez hashes/cenas, teclado/alertas/timers/FLIP/revisita/movimento reduzido e nove páginas/12 menus. Build usa /OrquestraNEXT. JSONs são importados e empacotados em JavaScript; não há JSON externo exigindo outro caminho de publicação. 43 arquivos no artefato; assets do index presentes na base correta.

Supervisor, dez cenas, dataset, src/data, importador, regras SLA/TA/TB/criticidade/recorrência/custos, App/main e dependências/configuração preservados. XLSX SHA256: 1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe.

Evidências: [regressão](evidencias/versionamento-c8-regression.txt), [Python](evidencias/versionamento-c8-python.txt), [importador](evidencias/versionamento-c8-import.txt), [build](evidencias/versionamento-c8-build.txt), [produção/refresh](evidencias/versionamento-c8-smoke.txt), [limite EMFILE observado](evidencias/versionamento-c8-emfile.txt), [manifesto SHA256 do artefato](evidencias/versionamento-c8-artifact.json).

## Repositório e estado público observado

- Remoto origin: https://github.com/SinfoniaTech/OrquestraNEXT.git.
- Antes do envio: feature/next-evolucao ainda não existia no remoto; main a350cd0a494fac9dc092233d79cfc3f0fa8db42d; gh-pages 429d377d13e9bdf29a7e44c5ade937a4d5fdd83a.
- Site público respondeu HTTP 200; index.html coincide byte a byte com origin/gh-pages:index.html. Último workflow Pages bem-sucedido aponta para gh-pages no mesmo 429d377.
- Único workflow listado: pages-build-deployment dinâmico do GitHub. Sem .github/workflows no código local/main inspecionado; envio da feature separado da branch de artefatos.
- Consulta anônima à API administrativa Pages retornou 404. Isso não demonstra site ausente; fonte observada confirmada pela correspondência do HTML/ref/workflow. Não foram alteradas configurações administrativas.

[Dados da inspeção](evidencias/versionamento-c8-pages.json). Confirmação do SHA C8 criado/enviado e situação remota final ficam na continuidade e no quadro atual do backlog; esta preparação não presume que um comando de push tenha sucesso.

## Destino proposto — não executar sem confirmação

**URL:** https://sinfoniatech.github.io/OrquestraNEXT/.

**Branch que receberia artefatos:** gh-pages, raiz, no origin acima. package.json declara homepage nesse endereço; deploy=gh-pages -d dist e predeploy=npm run build. A biblioteca instalada usa gh-pages como branch padrão e push habilitado. Vite base=/OrquestraNEXT. Não executar npm run deploy antecipadamente, pois ele altera o conteúdo público.

**Impacto:** substituir o bundle atualmente público, associado a 429d377, pelo build validado da C8. Apresentação original continua como entrada padrão e dez cenas/Supervisor preservados; novo BackOffice com nove páginas funcionais passa a estar disponível via ?modo=plataforma. Dados sintéticos locais ficam empacotados no bundle. Não representa estoque/logística real ou autenticação corporativa. Não haverá merge em main.

**Artefato preparado:** /tmp/orquestra-publicacao-c8/dist, manifesto acima. /tmp não é backup permanente; antes de publicar, confirmar que o artefato corresponde ao commit aprovado e não a trabalho funcional posterior. Conteúdo público antigo deve continuar intacto enquanto a confirmação não vier. SHA observado 429d377 registrado para recuperação controlada se necessária; nenhuma reversão destrutiva executada.

Riscos/limites: aviso preexistente de chunk>500kB; teste local não é garantia de cache/CDN do Pages ou disponibilidade futura de servidor; publicação requer verificação remota posterior dos assets/rotas e confirmação do workflow. Gatilho original do módulo vazio no Vite antigo continua indeterminado, com regressão ESM preservada.

## Encerramento autorizado

Criar commit C8 somente após conferir staging/stat/cached --check e conteúdo, com mensagem `feat: implementa inteligencia de pecas e componentes C8`. Enviar somente feature/next-evolucao ao origin, sem force/rebase/merge/troca de branch. Confirmar SHA remoto e sincronização. Depois atualizar continuidade/backlog com fatos verificados; solicitar autorização antes de eventual commit complementar documental.

Próxima decisão: confirmação do destino/impacto acima antes de substituir a versão pública. Próxima etapa de desenvolvimento: Modo Feira, sem implementação nesta sessão.
