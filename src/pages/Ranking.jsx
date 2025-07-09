import "../App.css";
import { useEffect, useState } from "react";
import fundo from "../assets/imagens/background-guildrivals.png";
import Navbar from "../components/Navbar";
import api from "../services/api"; // seu axios já configurado

export default function Ranking() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    async function buscarRanking() {
      try {
        const response = await api.get("/api/ranking");
        // Ordena pelo backend ou aqui:
        const ordenado = response.data.sort((a, b) => b.vitorias - a.vitorias);
        setRanking(ordenado);
      } catch (error) {
        console.error("Erro ao carregar ranking:", error);
      }
    }

    buscarRanking();
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

      <div className="container mt-5 text-center">
        <h2 className="mb-4 bg-dark p-2">🏆 Ranking de Jogadores</h2>
        <div
          className="table-responsive"
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            borderRadius: "8px",
          }}
        >
          <table className="zanon-table table table-dark table-bordered table-hover mb-0">
            <thead className="sticky-top bg-dark">
              <tr>
                <th>#</th>
                <th>Nome do Player</th>
                <th>Vitórias</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((player, index) => (
                <tr key={index}>
                  <td>
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : index + 1}
                  </td>
                  <td>{player.name}</td>
                  <td>{player.vitorias}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
