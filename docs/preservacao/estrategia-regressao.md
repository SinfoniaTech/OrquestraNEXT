# Próxima etapa proposta — regressão

Plano original. Proteção mínima posteriormente autorizada e executada; testes em tests/ e resultados em resultado-protecao-minima.md. Cobertura ampliada continua pendente.

## Ajuste de escopo após replanejamento

A referência visual obrigatória é o Supervisor: posições 3–10 e fluxos do Supervisor completo. BackOffice 1–2 deve ser caracterizado/recuperável, mas sua substituição planejada não exige pixel a pixel do antigo. Não executar a suíte antiga como gate que bloqueie redesign aprovado. Novo BackOffice será validado pelos requisitos/PNGs, filtros e explicabilidade em 1366×768. Replanejamento deve ser aprovado antes da execução.

## Autorização necessária

Autorizar testes e eventual configuração fora de docs/, infraestrutura estritamente necessária, instalação somente após inventário, servidor local e build que grava dist. Não publicar ou criar commits automaticamente. Identificar SHA publicado e ambiente. Planejar uso de cópia isolada autorizada ou áreas de evidência; não alterar fonte para facilitar captura sem aceite.

## Sequência

1. Inventariar ferramentas instaladas, Node e lockfile; escolher runner de browser e testes de dados com menor dependência. Não instalar por padrão.
2. Congelar referência por SHA, fonte/hash e perfil de captura; sem resetar checkout do usuário.
3. Testes de dados puros: dez nomes únicos/resolvíveis, contagens 1245→1248, ordens dos IDs, fixture hospital sem SLA. Colisões auxiliares conhecidas documentadas; não introduzir teste que exige sua correção nesta fase.
4. Browser: dez hashes diretos, refresh, extremos, teclado/modificadores/inputs/H, navegação de ida/volta e reinício.
5. Posição 2: marcos das três chegadas, fila/feed/alertas/contagens, filtros e detalhe; query stage separada.
6. Posições 3–10: início, mudança e fim; modal expandido/recolhido, Escape/fundo/sino, detalhe por card e aviso; sair antes de cada timer e verificar isolamento ao retornar.
7. Executar em StrictMode e produção; movimento normal/reduzido, detalhe aberto durante transição, navegação rápida e ciclos repetidos.
8. Capturar aparência e transições em viewport homologada; validar 1366×768 como resolução principal confirmada; 1672×941, 1024×768 e 768×1024 como complementos propostos. Fontes/navegador/escala fixos. Baseline de preservação do Supervisor é a aplicação atual. No novo BackOffice, usar UX/PNGs aprovados e contratos de dados; não exigir equivalência com telas antigas.
9. Build/preview sob /OrquestraNEXT; verificar chunks/refresh/assets. Só com autorização de escrita.
10. Gerar relatório e diferenças; nenhum deploy.

## Arquivos futuros propostos

- tests/apresentacao-config.test.js
- tests/dados-roteiro.test.js
- tests/e2e/navegacao.spec.js
- tests/e2e/backoffice.spec.js
- tests/e2e/supervisor-roteiro.spec.js
- tests/e2e/acessibilidade.spec.js
- Configuração do runner e baseline visual, nomes/localização após inventário aprovado.

## Oráculos e aceite

Matriz-cenas é referência do legado; somente Supervisor exige equivalência integral, enquanto novo BackOffice atende ao contrato revisado. Usar observação de estado e relógio controlado quando suportado; CSS e Web Animations precisam de verificação visual própria, não só fake timers. Capturar fases antes/durante/depois, mascarar apenas conteúdo comprovadamente não determinístico. Não esconder diferenças reais com tolerância ampla.

Aprovação exige: dez cenas navegáveis, marcos de dados e interações preservados, sem novos erros console/chunks, timers sem vazamento observável, nenhuma divergência visual não explicada e Git restrito ao escopo autorizado. Zero testes executados não é aprovação. Falhas preexistentes devem aparecer separadas de regressões e não ser corrigidas silenciosamente.

Para a ponte futura: sinalizar demo independente, entrar/voltar sem perder filtros e sem sincronização fictícia; relógio Feira pausado, sem retomada silenciosa. Novo modo manual não produz mudanças por timer; entrada explícita no Supervisor informa seus tempos legados.

Para Feira futura: T0/T1/T2 reconciliados separadamente, pausa congela todos os derivados, retomada sem duplicação, reinício determinístico e ausência de informação futura. Para Plataforma: mesma população filtrada em cards/tabela/gráficos/exportação, nulos e denominador zero, EXT sem números fabricados.
