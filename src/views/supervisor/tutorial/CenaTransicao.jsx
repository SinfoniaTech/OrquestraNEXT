import { useRef, useState } from 'react';
import ChamadoCard from '../components/ChamadoCard.jsx';
import DetalheDoTutorial from './DetalheDoTutorial.jsx';
import QuadroSupervisor from './QuadroSupervisor.jsx';
import ListaChamados from './ListaChamados.jsx';
import ItemLista from './ItemLista.jsx';
import CardTransicao from './CardTransicao.jsx';
import { useChamadoAberto, useFlip, useRoteiro } from './hooks.js';
import { ETAPAS_ALVO, ID_ALVO, listaComAlvoEm } from './dados.js';
import styles from './tutorial.module.css';

/** Cor da onda que se expande quando o card assume a nova criticidade. */
const COR_DA_ONDA = {
  media: styles.corMedia,
  alta: styles.corAlta,
  critica: styles.corCritica,
};

/**
 * Cena de TRANSIÇÃO DE CRITICIDADE (Cenas 2, 3 e 4 do roteiro).
 *
 * As três cenas são o mesmo mecanismo com etapas diferentes; cada uma só diz
 * de qual criticidade a demanda parte (`de`) e para qual vai (`para`):
 *
 *   Cena 2: <CenaTransicao de="normal" para="media" />
 *   Cena 3: <CenaTransicao de="media"  para="alta" />
 *   Cena 4: <CenaTransicao de="alta"   para="critica" />
 *
 * Cada cena começa exatamente onde a anterior terminou (mesma tela, mesma
 * demanda), então a sequência lê como um único caso evoluindo. Fases:
 *
 *   inicio   → a tela já está montada (sem entrada, é continuação);
 *   destaque → anel azul pulsando na demanda; o resto da lista esmaece;
 *   escalado → o card assume a nova criticidade (faixa, pill, problema, SLA e
 *              sombra) com uma onda na cor dela. Se a lista era só NORMAL, é
 *              aqui que "Sem chamados prioritários" recolhe e some;
 *   movendo  → SÓ se o novo tempo de SLA muda a posição na lista (ordenada
 *              por tempo para estourar SLA): a demanda desliza até o novo
 *              lugar e os outros abrem espaço (FLIP);
 *   fim      → o brilho da lista volta ao normal e a cena fica parada.
 *
 * Os atrasos (ms desde a entrada) estão no useRoteiro abaixo.
 *
 * Clicar em qualquer card abre a tela de detalhe daquele chamado (como no
 * app); a da demanda do tutorial mostra a criticidade em que ela está NO
 * MOMENTO. "← Chamadas" (ou a aba "Chamados") volta para a lista. O roteiro
 * segue rodando por trás do detalhe: ao voltar, a lista aparece no estado em
 * que a cena estiver.
 */
export default function CenaTransicao({ de, para, movimentar = true }) {
  // Listas calculadas uma vez: a cena remonta a cada visita.
  const [{ inicial, final }] = useState(() => ({
    inicial: listaComAlvoEm(de),
    final: listaComAlvoEm(para),
  }));
  const [lista, setLista] = useState(inicial);
  const [fase, setFase] = useState('inicio');
  const listaRef = useRef(null);
  const mainRef = useRef(null);
  const { chamadoAberto, abrir, voltar, selecionarAba } = useChamadoAberto(mainRef);

  // Deslize da reordenação: capturar() antes de setLista().
  const capturar = useFlip(listaRef, lista);

  const mudaDeLugar = inicial.map((c) => c.id).join() !== final.map((c) => c.id).join();

  const passos = [
    [900, () => setFase('destaque')],
    [2300, () => setFase('escalado')],
  ];
  if (mudaDeLugar && movimentar) {
    passos.push(
      [
        3900,
        () => {
          capturar();
          setLista(final);
          setFase('movendo');
        },
      ],
      [5200, () => setFase('fim')],
    );
  } else {
    passos.push([3700, () => setFase('fim')]);
  }
  useRoteiro(passos);

  const escalado = fase === 'escalado' || fase === 'movendo' || fase === 'fim';
  // Criticidade em que a demanda está agora: é a que o detalhe deve mostrar.
  const etapaAtual = escalado ? para : de;
  // Enquanto a cena "olha" para a demanda, o resto fica em segundo plano.
  const emFoco = fase === 'destaque' || fase === 'escalado' || fase === 'movendo';

  // "Sem chamados prioritários" só existe enquanto a lista inicial é toda
  // NORMAL, e some no instante em que a demanda deixa de ser NORMAL.
  const comecaSoNormal = inicial.every((c) => c.prioridade === 'normal');
  const semPrioritarios = comecaSoNormal && !escalado;

  const classeDaDemanda =
    fase === 'destaque'
      ? styles.destaque
      : fase === 'escalado'
        ? `${styles.onda} ${COR_DA_ONDA[para]}`
        : fase === 'movendo'
          ? styles.elevado
          : '';

  return (
    <QuadroSupervisor mainRef={mainRef} onSelectNav={selecionarAba}>
      {chamadoAberto ? (
        <DetalheDoTutorial chamadoId={chamadoAberto} etapaAlvo={etapaAtual} onVoltar={voltar} />
      ) : (
        <ListaChamados
          chamados={lista}
          listaRef={listaRef}
          semPrioritarios={semPrioritarios}
          renderItem={(chamado, indice) => {
            const ehAlvo = chamado.id === ID_ALVO;
            return (
              <ItemLista
                key={chamado.id}
                id={chamado.id}
                indice={indice}
                esmaecido={emFoco && !ehAlvo}
                className={ehAlvo ? classeDaDemanda : ''}
              >
                {ehAlvo ? (
                  <CardTransicao
                    de={ETAPAS_ALVO[de]}
                    para={ETAPAS_ALVO[para]}
                    escalado={escalado}
                    onOpen={abrir}
                  />
                ) : (
                  <ChamadoCard chamado={chamado} onOpen={abrir} />
                )}
              </ItemLista>
            );
          }}
        />
      )}
    </QuadroSupervisor>
  );
}
