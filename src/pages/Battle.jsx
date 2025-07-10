import React, { useState, useEffect, useRef } from "react";
import InfoPlayer from "../components/InfoPlayer";
import LogBatalha from "../components/LogBatalha";
import CardItem from "../components/CardItem";
import ButtonExit from "../components/ButtonExit";
import ButtonComplete from "../components/ButtonComplete";
import ModalConfirmacao from "../components/ModalConfirmacao";
import acoes from "../data/acoesGuildRivals.json";
import fundo from "../assets/imagens/background-guildrivals.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Battle.css";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Battle() {
  const [classeSelecionada, setClasseSelecionada] = useState(null);
  const [logs, setLogs] = useState([]);
  const [turnoAtual, setTurnoAtual] = useState("player");
  const [vidaPlayer, setVidaPlayer] = useState(100);
  const [vidaBot, setVidaBot] = useState(100);
  const [armaduraPlayer, setArmaduraPlayer] = useState(0);
  const [armaduraBot, setArmaduraBot] = useState(0);
  const [manaPlayer, setManaPlayer] = useState(0);
  const [manaBot, setManaBot] = useState(0);
  const [acoesBloqueadas, setAcoesBloqueadas] = useState(false);
  const [fimDeJogo, setFimDeJogo] = useState(false);
  const fimDeJogoRef = useRef(false);
  const [resultado, setResultado] = useState(null);

  const { usuario } = useAuth();

  const [classeInimigo, setClasseInimigo] = useState(null);

  useEffect(() => {
    const classes = ["Lutador", "Mago", "Ladino"];
    const aleatoria = classes[Math.floor(Math.random() * classes.length)];
    setClasseInimigo(aleatoria);
  }, []);

  const registrarResultado = async (tipo) => {
    try {
      await api.post(`/api/usuario/${tipo}`); // tipo pode ser 'vitoria' ou 'derrota'
    } catch (error) {
      console.error(`Erro ao registrar ${tipo}:`, error);
    }
  };

  useEffect(() => {
    fimDeJogoRef.current = fimDeJogo;
  }, [fimDeJogo]);

  const nomeJogador = usuario?.name || "Jogador";

  const adicionarLog = (texto) => setLogs((prev) => [...prev, texto]);
  const verificarFimDeJogo = (vidaAlvo, alvo) => {
    if (vidaAlvo <= 0) {
      if (alvo === "bot") {
        adicionarLog(`${nomeJogador} derrotou o Inimigo!`);
        setResultado("vitória");
        registrarResultado("vitoria");
      } else {
        adicionarLog("Você foi derrotado!");
        setResultado("derrota");
        registrarResultado("derrota");
      }

      setFimDeJogo(true);
    }
  };
  const aplicarEfeitoCarta = (carta, alvo) => {
    const tipo = carta.tipo;
    const valor = Number(carta.valor);

    // Efeito: DANO
    if (tipo === "DANO") {
      if (alvo === "player") {
        setArmaduraPlayer((prevArmadura) => {
          const danoAbsorvido = Math.min(prevArmadura, valor);
          const danoRestante = Math.max(valor - prevArmadura, 0);

          setVidaPlayer((prevVida) => {
            const novaVida = Math.max(prevVida - danoRestante, 0);
            adicionarLog(
              danoAbsorvido > 0
                ? `Causou ${danoRestante} de dano (absorvido ${danoAbsorvido} pela armadura)`
                : `Causou ${danoRestante} de dano`
            );
            verificarFimDeJogo(novaVida, "player");
            return novaVida;
          });

          return Math.max(prevArmadura - danoAbsorvido, 0);
        });
      } else {
        setArmaduraBot((prevArmadura) => {
          const danoAbsorvido = Math.min(prevArmadura, valor);
          const danoRestante = Math.max(valor - prevArmadura, 0);

          setVidaBot((prevVida) => {
            const novaVida = Math.max(prevVida - danoRestante, 0);
            adicionarLog(
              danoAbsorvido > 0
                ? `Causou ${danoRestante} de dano ao inimigo (absorvido ${danoAbsorvido} pela armadura)`
                : `Causou ${danoRestante} de dano ao inimigo`
            );
            verificarFimDeJogo(novaVida, "bot");
            return novaVida;
          });

          return Math.max(prevArmadura - danoAbsorvido, 0);
        });
      }
    }

    // Efeito: CURA
    if (tipo === "CURA") {
      adicionarLog(
        alvo === "player"
          ? `Você se curou em ${valor} de vida`
          : `O inimigo se curou em ${valor} de vida`
      );
      if (alvo === "player") {
        setVidaPlayer((prev) => Math.min(prev + valor, 100));
      } else {
        setVidaBot((prev) => Math.min(prev + valor, 100));
      }
    }

    // Efeito: ARMADURA
    if (tipo === "ARMADURA") {
      adicionarLog(
        alvo === "player"
          ? `Você recebeu ${valor} de armadura`
          : `O inimigo recebeu ${valor} de armadura`
      );
      if (alvo === "player") {
        setArmaduraPlayer((prev) => prev + valor);
      } else {
        setArmaduraBot((prev) => prev + valor);
      }
    }

    // Efeito: CURAMANA
    if (tipo === "CURAMANA") {
      adicionarLog(
        alvo === "player"
          ? "Você recuperou 1 de mana"
          : "O inimigo recuperou 1 de mana"
      );
      if (alvo === "player") {
        setManaPlayer((prev) => prev + 1);
      } else {
        setManaBot((prev) => prev + 1);
      }
    }
  };
  const passarTurno = () => {
    if (fimDeJogoRef.current) return;

    setTurnoAtual((turnoAnterior) => {
      const novoTurno = turnoAnterior === "player" ? "bot" : "player";

      adicionarLog(
        novoTurno === "player" ? `Vez de ${nomeJogador}` : "Vez do Inimigo"
      );

      if (novoTurno === "player") {
        setManaPlayer((prev) => prev + 1);
        setAcoesBloqueadas(false);
      } else {
        setTimeout(() => {
          if (!fimDeJogoRef.current) botJogar();
        }, 1000);
      }

      return novoTurno;
    });
  };

  const botJogar = () => {
    if (fimDeJogoRef.current) return;

    const novaMana = manaBot + 1;
    setManaBot(novaMana);

    const acoesDisponiveis = acoes.filter(
      (a) => a.classe === classeInimigo && a.custo <= novaMana
    );

    if (acoesDisponiveis.length === 0) {
      adicionarLog("Inimigo não possui ações disponíveis.");
      setTimeout(() => {
        if (!fimDeJogoRef.current) passarTurno();
      }, 1000);
      return;
    }

    const acaoEscolhida =
      acoesDisponiveis[Math.floor(Math.random() * acoesDisponiveis.length)];
    const tipo = acaoEscolhida.tipo;
    const alvo = tipo === "DANO" ? "player" : "bot";

    adicionarLog(`Inimigo usou ${acaoEscolhida.nome}`);

    setTimeout(() => {
      if (fimDeJogoRef.current) return;
      aplicarEfeitoCarta(acaoEscolhida, alvo);
      setManaBot(novaMana - acaoEscolhida.custo);

      setTimeout(() => {
        if (!fimDeJogoRef.current) passarTurno();
      }, 1000);
    }, 500);
  };

  const aoJogarAcao = (carta) => {
    if (turnoAtual !== "player" || acoesBloqueadas || fimDeJogoRef.current)
      return;

    if (manaPlayer < carta.custo) {
      adicionarLog(`Sem mana para realizar esta ação`);
      return;
    }

    setAcoesBloqueadas(true);
    adicionarLog(`${nomeJogador} usou ${carta.nome}`);
    setManaPlayer((prev) => prev - carta.custo);

    const tipo = carta.tipo;
    const alvo = tipo === "DANO" ? "bot" : "player";

    aplicarEfeitoCarta(carta, alvo);

    setTimeout(() => {
      if (!fimDeJogoRef.current) passarTurno();
    }, 1000);
  };

  const handleSelecionarClasse = (classe) => {
    setClasseSelecionada(classe);
    if (!classeInimigo) return; // evita erro enquanto ainda não foi sorteado

    setLogs([
      `${nomeJogador} escolheu a classe ${classe}.`,
      `Inimigo escolheu a classe ${classeInimigo}.`,
      "A batalha vai começar!",
    ]);
  };

  const classes = [
    { nome: "Lutador", descricao: "Dano moderado, muita armadura." },
    { nome: "Mago", descricao: "Dano alto, muita cura." },
    { nome: "Ladino", descricao: "Dano moderado, possui armadura e cura." },
  ];

  const cartas = acoes.filter((acao) => acao.classe === classeSelecionada);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${fundo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
      }}
    >
      <div className="container-fluid vh-100 p-2 position-relative ">
        <div className="position-relative">
          {fimDeJogo ? <ButtonComplete /> : <ButtonExit />}
        </div>

        {!classeSelecionada && (
          <div
            className="position-absolute top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", zIndex: 999 }}
          >
            <div className="d-flex flex-column gap-4">
              {classes.map((cls) => (
                <div
                  key={cls.nome}
                  onClick={() => handleSelecionarClasse(cls.nome)}
                  className="p-4 rounded shadow"
                  style={{
                    backgroundColor: "#3e2f23",
                    color: "#f5f5f5",
                    cursor: "pointer",
                    width: "220px",
                    textAlign: "center",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <h4>{cls.nome}</h4>
                  <p>{cls.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="d-flex w-100 h-100 justify-content-center align-items-center">
          <div className="wrapper w-auto">
            <section className="mb-3 mt-5">
              <InfoPlayer
                id="bot"
                nome="Bot"
                vida={vidaBot}
                armadura={armaduraBot}
                mana={manaBot}
              />
            </section>

            <section className="mb-3">
              <LogBatalha logs={logs} />
            </section>

            <section>
              <InfoPlayer
                id="player"
                nome="Você"
                vida={vidaPlayer}
                armadura={armaduraPlayer}
                mana={manaPlayer}
              />

              <div className="d-flex flex-wrap justify-content-center gap-2 mt-2">
                {classeSelecionada &&
                  cartas.map((carta) => (
                    <CardItem
                      key={carta.id}
                      carta={carta}
                      onClick={() => aoJogarAcao(carta)}
                      disabled={
                        acoesBloqueadas || turnoAtual !== "player" || fimDeJogo
                      }
                    />
                  ))}
              </div>
            </section>

            <ModalConfirmacao />
          </div>
        </div>
      </div>
    </div>
  );
}
