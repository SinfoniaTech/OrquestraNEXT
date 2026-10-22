# Correção de inicialização — após C7

15/10/2026, America/Sao_Paulo. Prioridade exclusiva: restaurar a plataforma antes da homologação C7. Nenhuma C8, mudança de dataset, refatoração funcional, instalação, commit, push ou deploy.

## Mecanismo observado e limite do diagnóstico

ConsultationContext.jsx:2 importa consultationReducer, DEFAULT_STATE e selectView de ../services/chamados.js. DEFAULT_STATE é o estado inicial de 60 dias do reducer/consulta; também é utilizado pelo reset e pelos testes das páginas. A exportação existe no serviço atual (linha 24) e no HEAD 05ec7d5, anterior à C7. A diferença C7 acrescenta filtros Técnico/Supervisor/Rota e Rota na busca; não remove, renomeia ou muda essa exportação. Não há divergência de contrato no código salvo.

O processo Vite antigo da porta 5173, na raiz correta, respondia HTTP200 ao módulo chamados.js com apenas 167 bytes: corpo JavaScript vazio e source map com sourcesContent=[""]. Portanto, esse módulo servido não exportava DEFAULT_STATE nem os demais símbolos. O ETag também correspondia ao conteúdo vazio. Uma URL com query distinta e um servidor novo entregaram o arquivo completo (~31kB), com export const DEFAULT_STATE. No Chrome, a URL original reproduziu exatamente o SyntaxError reportado e body vazio.

A causa imediata é estado de transformação/módulo vazio retido pelo processo de desenvolvimento, divergindo do arquivo em disco. Não foi determinado o evento que produziu essa versão vazia. Uma leitura transitória durante salvamento é hipótese, não fato demonstrado. O diff não sustenta atribuir remoção de export à C7.

## Correção mínima

Registrada a falha antes da intervenção, encerrado somente o processo Vite 5173 identificado (PID 83288) e reiniciado na mesma pasta/host/porta com o comando existente: npm run dev -- --host 127.0.0.1 --port 5173 --strictPort. O reinício invalidou o estado antigo de transformação. O servidor auxiliar 5207 criado para diagnóstico foi encerrado; o servidor de homologação 5173 permaneceu ativo.

Nenhum arquivo de produto foi alterado nesta correção. Não foi adicionada exportação artificial, fallback, cache-buster no código, limpeza de dependências/dataset ou alteração na arquitetura. Os arquivos src/ que aparecem modificados no Git pertencem à C7 local anterior e foram preservados.

## Nova proteção de regressão

Criado tests/platform-dev.test.mjs, sete testes de desenvolvimento Vite com Chrome:

- Módulo efetivamente servido contém DEFAULT_STATE; import ESM nativo confirma estado inicial, reducer/reset e seletor (60 dias/736 chamados).
- Importações nomeadas do serviço em src/platform e tests resolvidas para o arquivo exato, incluindo imports relativos dos serviços consumidores; nenhuma exportação ausente.
- Visão Geral, Chamados, Técnicos e Peças carregam por URL direta e após refresh (quatro testes).
- Sem falhas ESM, erros JS ou console de aplicação nessas rotas.

Peças continua com “Desenvolvimento pendente”, sem KPIs fictícios. O único 404 acessório observado foi /favicon.ico já ausente; o teste exclui somente esse recurso, mantendo todas falhas de aplicação/módulos como erro.

Por padrão a suíte cria/encerra um servidor Vite próprio na porta 5209, com cacheDir temporário separado para não interferir na otimização de outro servidor aberto. ORQUESTRA_DEV_URL permite validar a instância real 5173 sem iniciar/encerrar o servidor do usuário. ORQUESTRA_DEV_EVIDENCE define capturas/cache temporário. Usa exclusivamente Node/Playwright/Chrome já existentes.

Os testes anteriores exercitavam build/preview; essa cobertura não detectava o estado interno de uma instância Vite antiga. Agora a suíte também verifica os módulos não empacotados e as rotas em desenvolvimento.

## Validação

Servidor real restaurado 5173: sete testes aprovados, quatro rotas diretas e após refresh, sem tela branca ou SyntaxError. Capturas após correção em evidencias/inicializacao-visao-geral.png, inicializacao-chamados.png, inicializacao-tecnicos.png e inicializacao-pecas.png; falha anterior em inicializacao-antes.png e inicializacao-antes.txt.

Regressão: **262 testes distintos aprovados =253 Node/browser +9 Python**, incluindo todos 255 anteriores e os 7 novos. Build de produção aprovado em /tmp/orquestra-inicializacao/dist, base /OrquestraNEXT. Aviso preexistente de bundle>500kB mantido. Evidências: inicializacao-regression.txt, inicializacao-dev.txt, inicializacao-build.txt e inicializacao-python.txt.

Supervisor e dez cenas: regressões de hashes/refresh, teclado, Smart Fit Normal→Média→Alta, hospital/contexto humano, alertas/modais, temporizadores, saída/revisita e movimento reduzido aprovadas. Sem diferenças em src/views, src/scenes, src/components, src/styles, src/data, scripts, datasets, referencias, App/main/scenes.config, package/lock/Vite em relação ao HEAD C6. Dataset SHA256 intacto: 1cac22e44d8ff50a51ebb01e3d50893cc7d929361380aba5836ee794354addbe.

Arquivos desta correção: teste platform-dev.test.mjs criado; este relatório/evidências criados; continuidade e README de testes atualizados. Arquivos funcionais C7 anteriores preservados integralmente. Branch feature/next-evolucao, HEAD 05ec7d5, nada staged. C7 permanece sem commit e aguardando homologação. Sem C8, commit, push ou deploy.

## Limite operacional

A tela branca foi resolvida na instância local 5173 e em servidor novo de regressão. Não há correção de código a replicar: se outra instância antiga apresentar o mesmo módulo vazio, precisa de reinício próprio. Um teste de servidor novo não garante o estado de processos antigos em outras máquinas. O gatilho original da transformação vazia permanece indeterminado.
