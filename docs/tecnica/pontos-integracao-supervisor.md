# Pontos de integração futura — observados e propostos

Nenhuma ponte implementada nesta entrega.

## Fronteiras atuais

- App.jsx monta somente SceneController. Separação de modos precisa ocorrer acima dele para evitar concorrência do hash/teclado.
- Posições 3–10 são adaptadores de tutorial, não estado conectado ao BackOffice.
- src/views/supervisor/index.jsx expõe SupervisorView completo, mas ele não integra as dez posições configuradas.
- DetalheDoTutorial passa dados por props para ChamadoDetalheView; restante usa lookup de fixture.
- QuadroSupervisor reutiliza CSS/header do Supervisor e barra tutorial. Essas dependências não podem ser refatoradas incidentalmente.
- ID compartilhado entre fixtures não prova que um registro histórico seja a mesma ocorrência.

## Ponte mínima proposta para US19

BackOffice mantém fonte/filtros/tela em estado próprio. Botão “Ver demonstração do Supervisor” abre aviso de fonte roteirizada independente e timers próprios. Escolha inicial (tutorial ou Supervisor completo) precisa de aceite. Não mapear ID do histórico ao mock silenciosamente.

Pausar relógio da Feira ao sair; cancelar não perde estado. Ao entrar, desmontar consumidores de teclado/hash incompatíveis; montar legado por adaptador externo. Voltar restaura filtros/seleção/rolagem conforme contrato aprovado, sem retomar Feira automaticamente. Não modificar Supervisor para executar essa ponte. Integrar fonte comum será outra etapa.

## Aceite/testes futuros

Ida/cancelar/volta, refresh e links; filtro preservado; aviso claro; nenhum anúncio de tempo real; pausa/reinício; ausência de timers residuais; comportamento original do Supervisor. UI nova em 1366×768 e foco do retorno validado. Nenhuma escrita em cadastro/estoque ou comunicação externa.
