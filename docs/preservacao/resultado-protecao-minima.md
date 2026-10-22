# Resultado — proteção técnica mínima

Data: 15/10/2026. Referência: 43dd0283728d8c78ae9017ae5acae8a1cf3101d5, branch feature/next-evolucao.

## Escopo executado

Sem mudanças funcionais. Nenhuma instalação, refatoração, deploy, commit, git add ou importação de dados. Build direcionado a /tmp/orquestra-protecao-43dd028/dist; dist local e site publicado não substituídos.

## Ambiente e resultados

Node 24.16.0, Playwright 1.62.1 já presente no runtime, Chrome 155.0.8059.79 instalado, headless, viewport 1366×768. Preview de produção próprio na porta 5187, encerrado ao concluir.

- Build Vite: aprovado, 132 módulos; aviso esperado de outDir fora do projeto, sem erro.
- Testes node:test de dados: 5 aprovados.
- Testes browser: 10 aprovados.
- Total final: **15 aprovados, 0 falhas, 0 ignorados**, aproximadamente 42,7 s.
- Erros JS, console não relacionados a resposta HTTP e respostas de recursos/chunks: nenhum observado na rodada final. Requisições HTTP falhas são verificadas separadamente; favicon ausente seria observação, não erro de chunk.
- Fonte atual e recuperação coincidem: diff de src vazio; git diff contra referência vazio para src, package/lock, vite config, datasets e referencias.

Log final e observações em evidencias/. Capturas iniciais de dez cenas, modais e transição em /tmp/orquestra-protecao-43dd028/evidence. São marcos de observação, inclusive durante fade; não constituem comparação pixel a pixel homologada.

## Comportamentos protegidos

Dez hashes e refresh; botões/teclado, extremos, Home/End/H, PageUp/PageDown/Espaço, campo editável e Ctrl; hash inválido. Chegadas e contagem final BackOffice/detalhe/Escape. Smart Fit: etapa Média sem subida, detalhe acompanha roteiro; subida da Média com Web Animation de 700 ms; Alta no topo. Hospital entra no fim, sobe e usa contexto crítico sem SLA. Dois alertas: notificações/badge, expandir/recolher, Escape, sino e detalhe completo. Saída antes do timer sem modal residual em outra cena; revisita inicial. Movimento reduzido sem FLIP mantendo evolução do conteúdo.

Testes puros verificam identidade/defeito, tempos fornecidos, ordem e não mutação da entrada de ordenação.

## Ajustes dos testes e limitações

Rodada inicial expôs problemas no harness: foco ainda em input, prazo de espera menor que terceira chegada e seletores ambíguos nas duas camadas do crossfade. Segunda rodada encontrou asserção textual inadequada: mensagem recolhida permanece no DOM com aria-hidden. Corrigidos somente testes, usando roles/aria-hidden e espera da condição. Um 404 genérico inicial não reapareceu; monitoramento final registra URLs de recursos. Não foi atribuído a defeito funcional sem evidência.

Limites: Chromium/produção somente; sem Firefox/WebKit, suíte completa em StrictMode/dev ou snapshot visual homologado. Fluxos completos de SupervisorView fora das dez cenas (Mapa/Mais etc.) não montados nesta suíte. Amostra verifica uma animação FLIP, não todas as curvas/quadros. Ausência de modal residual não prova ausência absoluta de vazamento de memória. Sete colisões auxiliares, badgeAlertas persistente e inconsistências semânticas TA/TB/SLA continuam preexistentes e não foram corrigidas.

## Recuperação comprovada

Git archive extraído e comparado; git bundle --all verificado e clonado em /tmp/orquestra-protecao-43dd028/recovered; HEAD recuperado igual ao SHA acima e src idêntico. Ver [procedimento](recuperacao.md). Bundle inclui apenas conteúdo versionado; docs/tests ainda não commitados ficam fora.

## Backlog

US01: proteção mínima validada no escopo das cenas; cobertura visual completa e SupervisorView isolado pendentes. US02: inspeção validada, resolução de colisões não implementada. US15: verificação parcial em 1366×768, não auditoria completa. US16: build/local e recuperação validados; publicação/cross-browser pendentes. US19: pontos de integração documentados, ponte não implementada. US03/04 (camada de dados) não iniciadas.

## Condições para próxima entrega

Aprovar resultados/limites e autorizar separadamente US03/04. Importar HIST_60_DIAS preservando T0/T1/T2 e fixtures; validar 46 campos, tipos, IDs, nulos, escala percentual e referência. Resolver contrato de datas/fuso antes de normalização temporal. Semântica TA/TB/SLA/criticidade pendente: preservar campos, não criar fórmulas. Regras de merge dos snapshots só antes de reprodução temporal. Não usar autenticação/EXT como dados reais. Sem instalação sem nova aprovação.

Nenhuma camada de dados criada nesta entrega.
