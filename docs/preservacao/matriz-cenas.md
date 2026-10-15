# Matriz de preservação
> Escopo revisado em 15/10/2026: este documento registra a referência legada, não obriga equivalência visual do novo BackOffice. Preservação comportamental/visual permanece obrigatória para o Supervisor (posições 3–10 e experiência completa). Posições 1–2 ficam documentadas e recuperáveis. Decisões atuais: [arquitetura proposta](../tecnica/arquitetura-proposta.md).


Fonte: src/scenes.config.js e código no SHA de referência. Cenário padrão sem query stage. Atrasos são desde a montagem; não são garantia de pintura. CSS completa a transição depois do evento.

| Posição | Cena | Estado e marcos | Preservar |
| --- | --- | --- | --- |
| 1 | backoffice-1-principal | Painel Operacional inicial; Executivo/Chamados/placeholders pelo menu | Troca interna, rolagem ao topo, período padrão por tela |
| 2 | backoffice-2-chamados | Chegadas 8170,8181,8182 em 2,5/6,5/10,5 s | Fila, contagens, feed, alertas, filtros e detalhe manual |
| 3 | supervisor-cena-1-tela | Cinco normais, Smart Fit no fim; entrada/cascata; encerra escalonamento em 1,6 s | Sem prioritários e sem modal inicial; retorno após cascata não a repete |
| 4 | supervisor-cena-2-normal-para-media | Foco 0,9 s; Média 2,3 s; fim 3,7 s | Não sobe; detalhe acompanha etapa; mensagem sem prioritários some |
| 5 | supervisor-cena-2-media-sobe | Já Média; destaque 0,7 s; subida 1,2 s, FLIP 700 ms | Só reordena, sem nova prioridade |
| 6 | supervisor-cena-3-media-para-alta | Foco 0,9 s; Alta 2,3 s; fim 3,7 s; já no topo | Mesmo ID e defeito; prazo 50 min; sem deslocamento artificial |
| 7 | supervisor-cena-4-aviso-alta | Pulso 0,5 s; sino/badges 0,8 s; modal 1,1 s | Laranja, risco SLA; expandir/recolher/fechar/reabrir/abrir completo |
| 8 | supervisor-cena-5-demanda-critica | Hospital já crítico surge no fim; seis registros; CSS 700 ms | Contexto humano, tempo decorrido 00h35, sem SLA; sem subida |
| 9 | supervisor-cena-6-demanda-critica-sobe | Subida hospital 0,9 s, FLIP 700 ms | Hospital primeiro, Smart Fit Alta segundo, quatro normais |
| 10 | supervisor-cena-7-aviso-estourado | Pulso 0,5 s; badges 0,8 s; modal 1,1 s | Demanda prioritária sem SLA, apesar do nome da pasta |

## Oráculos de dados

Na posição 2, chegadas 0/1/2/3: total 1245/1246/1247/1248; abertas 57/58/58/58; atendimento 20/20/21/22; concluídas sempre 1168. Fixtures JavaScript, não XLSX.

Smart Fit CH-0008181: Normal → Média → Alta, mesmo defeito; 6h40 → 3h10 → 50 min. Hospital CH-0008182: já crítico por contexto humano. Não unificar modelos pelo ID sem aprovação.

## Transversais

- Setas, PageUp/PageDown, Espaço, Home/End e H; sem loop; extremos bloqueados.
- Campos editáveis/modificadores protegidos; Espaço em botão/link pertence ao elemento; linha da fila captura Enter/Espaço.
- Hash direto e refresh mantêm posição; inválido volta à primeira; replaceState evita poluir histórico.
- Key da posição remonta a cena e reinicia estados; limpeza de timers/listeners e cancelamento de RAF.
- Detalhe não pausa roteiro; volta mostra etapa atingida. Aba Chamados retorna; outras são cenário.
- Modal fecha por Escape/fundo/cabeçalho/Fechar; expansão interna e abrir completo preservados. Fechar não zera badgeAlertas, embora zere notificações/pulso: comportamento observado a decidir.
- Ligar/WhatsApp são visuais; abas Linha do Tempo/Histórico do Supervisor são inertes.
- Movimento reduzido: CSS/FLIP sem animação; roteiro Supervisor continua temporizado. BackOffice antecipa chegadas.
- Fade global 250 ms; rolagem própria, isolamento do palco. Split suporta até duas cenas, mas não é usado atualmente.
- Query stage de ensaio é caso separado; aberto usa 1,5/4,1/6,7 s. Sete estágios auxiliares não integram estas dez posições.

Comentários antigos e nomes de pasta não substituem o comportamento executável. Verificação dinâmica completa pendente.
