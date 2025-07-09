import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fundo from "../assets/imagens/background-guildrivals.png";
import { getUsuarioBackend } from "../utils/user"; // agora vem do backend
import Navbar from "../components/Navbar";

export default function Home() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  const iniciarBatalha = () => {
    navigate("/battle");
  };

  useEffect(() => {
    const carregarUsuario = async () => {
      const user = await getUsuarioBackend();
      if (!user) {
        navigate("/");
      } else {
        setUsuario(user);
      }
    };
    carregarUsuario();
  }, []);

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
      <Navbar />
      <div
        className="container d-flex flex-column justify-content-center align-items-center py-5"
        style={{ backdropFilter: "brightness(0.1)", borderRadius: "10px" }}
      >
        {usuario ? (
          <>
            <div className="text-center bg-dark bg-opacity-75 p-4 rounded shadow">
              <h1 className="display-5 text-warning">
                Bem-vindo, {usuario.name}!
              </h1>
              <p className="lead">
                Você está logado no <strong>Guild Rivals</strong>.
              </p>
              <button
                className="btn btn-warning me-3 shadow"
                onClick={iniciarBatalha}
              >
                Iniciar Batalha
              </button>
            </div>

            <div
              className="mt-4 bg-secondary bg-opacity-75 p-3 rounded w-100"
              style={{ maxWidth: "400px" }}
            >
              <h5 className="text-center text-light mb-3">Seus Dados</h5>
              <table className="table table-dark table-borderless text-center mb-0">
                <tbody>
                  <tr>
                    <td>Partidas Jogadas:</td>
                    <td>{usuario.partidas_jogadas}</td>
                  </tr>
                  <tr>
                    <td>Vitórias:</td>
                    <td>{usuario.vitorias}</td>
                  </tr>
                  <tr>
                    <td>Derrotas:</td>
                    <td>{usuario.derrotas}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center text-light mt-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
