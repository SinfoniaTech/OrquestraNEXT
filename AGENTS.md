# ORQUESTRA — instruções permanentes

## Início de uma sessão

1. Consulte primeiro [docs/CONTINUIDADE_CODEX.md](docs/CONTINUIDADE_CODEX.md), após identificar as instruções AGENTS.md aplicáveis.
2. Confirme que está na raiz OrquestraNEXT. Verifique branch, HEAD e `git status --short --branch --untracked-files=all` antes de modificar arquivos. O diretório pai pode ser outro repositório.
3. Compare o estado real com a continuidade. Preserve alterações locais, arquivos não rastreados e evidências; não use reset, clean, descarte, troca de branch ou stash para limpar a árvore.
4. Identifique a User Story existente no [Product Backlog](docs/produto/backlog.md), o escopo e as autorizações vigentes do usuário. Tarefas transversais podem usar histórias existentes; não crie duplicatas.
5. Leia apenas especificações, relatórios e código pertinentes à tarefa. Aprofunde a investigação se houver divergência ou evidência insuficiente. Continuidade orienta a inspeção, não a substitui.

## Implementação e preservação

- Preserve arquitetura e regras de negócio aprovadas. Reutilize camada de dados, filtros, serviços e componentes compartilhados antes de criar alternativas.
- Preserve Supervisor e dez cenas originais, fixtures, estilos, animações, temporizadores, teclado, hashes e comportamento de retorno, salvo autorização expressa para alterá-los. Não corrija legado incidentalmente.
- Mantenha HIST_60_DIAS, snapshots T0/T1/T2 e fixtures do Supervisor separados. Não edite dataset/JSON gerado nem invente regras geradoras ou políticas de merge sem autorização.
- Diferencie BASE (campo fornecido), CALC (agregação explicável) e EXT (fonte indisponível, sem valor fictício). Informe população, N, nulos, período, unidade e fonte dos indicadores. Preserve os contratos TA/TB/SLA/criticidade/recorrência/custos aprovados.
- Imagens são referências de UX; não comprovam dados ou regras. Consulta histórica não implica tempo real, cadastro mestre, causalidade ou avaliação individual validada.

## Validação e encerramento

1. Execute os testes proporcionais e a regressão aplicável dentro do escopo autorizado; registre comandos, data, resultado e limites. Documentação apenas pede revisão de diff, links e coerência, sem executar testes/build desnecessários.
2. Diferencie validação executada agora de evidências anteriores. Testes/build não homologam uma entrega nem comprovam publicação. Para falhas de desenvolvimento, inspecione também o que o servidor efetivamente entrega; build/preview não comprova o estado de um Vite antigo.
3. Após trabalho relevante, atualize o relatório específico, o Product Backlog e a continuidade oficial. Registre mudanças locais não versionadas, pendências, limitações e uma próxima ação concreta com seu estado de autorização.
4. Substitua estados superados nos quadros atuais. Preserve evidências nos relatórios específicos; não copie logs/transcrições para a continuidade nem mantenha documentos concorrentes de retomada.
5. Ao encerrar, informe o que mudou, como foi verificado, riscos e o que aguarda decisão. Não avance para outra entrega sem homologação e autorização do escopo seguinte.

## Autorizações

- Commit, push, deploy, instalação de dependências e mudanças fora do escopo precisam de autorização explícita. Se ela já estiver válida no pedido/sessão, prossiga apenas dentro de seus limites; não solicite a mesma autorização novamente.
- Autorização de implementação/testes não implica autorização de commit ou publicação. Não reutilize autorizações já consumidas de entregas anteriores.
- Não inicie/encerre servidores do usuário silenciosamente. Confirme porta/processo e comunique intervenções necessárias dentro da tarefa autorizada; não presuma servidor ativo entre sessões.
- A instrução atual do usuário prevalece sobre orientações locais. Esclareça incompatibilidades materiais antes de executar ações dependentes.

## Responsabilidade dos documentos

- Este AGENTS.md contém orientações estáveis, sem histórico de entregas.
- [Continuidade](docs/CONTINUIDADE_CODEX.md): ponto único de retomada, estado verificável, limites, próxima ação e prompt padrão.
- [Índice](docs/README.md): localização dos documentos, sem duplicar estado detalhado.
- [Backlog](docs/produto/backlog.md) e [plano incremental](docs/produto/plano-incremental.md): histórias, critérios, dependências e processo.
- Relatórios de entrega/correção e evidências: resultados específicos e histórico técnico. Um gate antigo nesses relatórios não é uma nova autorização.
