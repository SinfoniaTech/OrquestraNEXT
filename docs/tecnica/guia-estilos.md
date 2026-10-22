# Como alterar tamanho dos cards e espaçamentos

O projeto usa CSS Modules: cada JSX importa seu arquivo `.module.css`. Não há uma única variável global que controle todos os cards. Identifique primeiro o modo e a página; depois procure a classe aplicada no componente.

## Onde editar

| Área | Arquivo relativo à raiz | Seletores principais |
| --- | --- | --- |
| Supervisor Feira no celular | `src/feira/supervisor/Supervisor.module.css` | `.list`, `.alert`, `.call`, `.compactBody`, `.compactActions` e regras de `dialog` |
| Notebook Feira / simulação | `src/feira/FeiraApp.module.css` | `.metrics`, `.grid`, `.bottom`, `.panel`, `.alerts` |
| Pareamento e controles sincronizados | `src/feira/SyncFeira.module.css` | Consulte as classes importadas por `SyncedFeiraApp.jsx` |
| Visão Geral / Performance | `src/platform/pages/PerformancePage.module.css` | `.cards`, `.cards article`, `.panel`, `.charts`, `.insights` |
| Componentes de consulta compartilhados | `src/platform/components/Consultation.module.css` | `.kpiGrid`, `.kpi`, `.analysisGrid`, `.analysisCard`, `.dialog`, `.detailGrid` |
| Margens do conteúdo e shell | `src/platform/BackofficePlatform.module.css` | `.content`, `.pageHeading`, `.shell`, `.header` |
| Outras páginas do BackOffice | `src/platform/pages/<Pagina>.module.css` | Grid, cards e painéis específicos da página |
| Barra da apresentação atual | `src/presentation/Presentation.module.css` | Classes usadas em `PresentationBar.jsx` |
| Cenas originais | `src/views/` | Estilos locais da cena; preservar o legado salvo pedido específico |

Os estilos da Plataforma também atendem à apresentação guiada, pois as páginas são compartilhadas. `src/styles/theme.css` contém variáveis do controlador; não controla todos os temas do produto.

## Qual propriedade controla o quê

| Objetivo | Propriedade |
| --- | --- |
| Mais ou menos cards por linha | `grid-template-columns` no contêiner |
| Distância entre cards | `gap`, `row-gap`, `column-gap` |
| Espaço interno do card | `padding` |
| Distância antes/depois do bloco | `margin`, `margin-top`, `margin-bottom` |
| Altura mínima | `min-height` |
| Largura de um modal/card limitado | `width`, `max-width`, `min()` |
| Arredondamento | `border-radius` |
| Densidade do texto | `font-size`, `line-height` |

Em um grid com `1fr`, a largura do card resulta da largura disponível, do número de colunas e do `gap`. Prefira `min-height` e conteúdo natural a uma altura fixa para evitar cortes.

## Exemplo: Visão Geral

Em `src/platform/pages/PerformancePage.module.css`, a regra inicial contém seis colunas, espaçamento de 9px e altura mínima de 129px. Para quatro colunas com mais respiro, uma alteração possível é:

```css
.cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}
.cards article {
  min-height: 145px;
  box-sizing: border-box;
}
```

Isso é um exemplo para edição futura; não foi aplicado ao produto. Preserve/adapte os breakpoints existentes: nessa página, até 1100px são três colunas e até 640px são duas. Se o objetivo é o espaço interno do indicador compartilhado, confira também a classe `.kpi` em `Consultation.module.css` e o JSX que a aplica.

## Supervisor Feira: atenção à cascata

`Supervisor.module.css` tem revisões sucessivas e seletores repetidos. O `.list` possui uma regra inicial com `gap:12px` e uma posterior com `gap:10px`. A regra vencedora depende também do breakpoint e da especificidade. Altere o bloco efetivo, conferindo o painel **Computed/Calculado** nas ferramentas do navegador.

Para a lista, ajuste `.list` e o padding da raiz do card (`.alert`/`.call`, conforme o componente). Para o aviso compacto, procure `.theme dialog:has([data-alert-summary])`, `.compactBody` e `.compactActions`. Cabeçalho, corpo, botões e largura do diálogo têm regras próprias. Não remova os estados de cor, foco, temas ou movimento reduzido para ajustar dimensões.

## Conferir a alteração

1. Abra o modo/página correto com `npm run dev` e inspecione o elemento para confirmar a classe e a regra vencedora.
2. Verifique desktop, tablet e celular, além de textos longos e listas vazias. No Supervisor, confira Light/Dark, resumo, ficha e foco do teclado.
3. Revise as regras `@media` do arquivo: elas podem substituir colunas, espaçamento e padding.
4. Execute build e os testes visuais/funcionais pertinentes se alterar a interface. Recarregue o endereço realmente servido; o serviço Feira usa `dist` e precisa de build atualizado.

O presente trabalho apenas documenta esses pontos; nenhuma dimensão ou regra visual foi alterada.
