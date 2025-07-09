import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarioLogado, salvarUsuario } from "../utils/user";
import fundo from "../assets/imagens/background-guildrivals.png";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Conta() {
  const [usuario, setUsuario] = useState(null);
  const [editandoCampo, setEditandoCampo] = useState(null);
  const [novoValor, setNovoValor] = useState("");
  const [erros, setErros] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUsuarioLogado();
    if (!user) navigate("/login");
    else setUsuario(user);

    return () => {
      setEditandoCampo(null);
      setErros({});
    };
  }, []);

  const iniciarEdicao = (campo) => {
    setEditandoCampo(campo);
    setNovoValor(usuario[campo]);
    setErros({});
  };

  const salvarEdicao = async () => {
    try {
      setErros({});
      const payload = { [editandoCampo]: novoValor };
      await api.get("/sanctum/csrf-cookie"); // Importante para garantir sessão
      const response = await api.put("/api/usuario/atualizar", payload);

      const usuarioAtualizado = { ...usuario, ...response.data.usuario };
      salvarUsuario(usuarioAtualizado);
      setUsuario(usuarioAtualizado);
      setEditandoCampo(null);
    } catch (error) {
      const campo = editandoCampo;
      const mensagem =
        error?.response?.data?.message || "Erro ao atualizar informação.";
      setErros((prev) => ({ ...prev, [campo]: mensagem }));
    }
  };

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
      {/* NAVBAR */}
      <Navbar />
      {/* CONTEÚDO */}
      <div
        className="container d-flex flex-column justify-content-center align-items-center py-5"
        style={{ backdropFilter: "brightness(0.1)", borderRadius: "10px" }}
      >
        {usuario ? (
          <div
            className="bg-dark bg-opacity-75 p-4 rounded shadow text-light"
            style={{ maxWidth: "500px", width: "100%" }}
          >
            <h2 className="text-warning text-center mb-4">Minha Conta</h2>

            {/* Nome */}
            <div className="mb-3">
              <label className="form-label">Nome:</label>
              {editandoCampo === "name" ? (
                <>
                  <input
                    type="text"
                    className="form-control"
                    value={novoValor}
                    onChange={(e) => setNovoValor(e.target.value)}
                  />
                  {erros.name && (
                    <div className="text-danger mt-1">{erros.name}</div>
                  )}
                  <button
                    className="btn btn-success mt-2"
                    onClick={salvarEdicao}
                  >
                    Salvar
                  </button>
                </>
              ) : (
                <div className="d-flex justify-content-between align-items-center">
                  <span>{usuario.name}</span>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => iniciarEdicao("name")}
                    disabled={!!editandoCampo}
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email:</label>
              {editandoCampo === "email" ? (
                <>
                  <input
                    type="email"
                    className="form-control"
                    value={novoValor}
                    onChange={(e) => setNovoValor(e.target.value)}
                  />
                  {erros.email && (
                    <div className="text-danger mt-1">{erros.email}</div>
                  )}
                  <button
                    className="btn btn-success mt-2"
                    onClick={salvarEdicao}
                  >
                    Salvar
                  </button>
                </>
              ) : (
                <div className="d-flex justify-content-between align-items-center">
                  <span>{usuario.email}</span>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => iniciarEdicao("email")}
                    disabled={!!editandoCampo}
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>

            {/* Senha */}
            <div className="mb-3">
              <label className="form-label">Senha:</label>
              {editandoCampo === "password" ? (
                <>
                  <input
                    type="password"
                    className="form-control"
                    value={novoValor}
                    onChange={(e) => setNovoValor(e.target.value)}
                  />
                  {erros.password && (
                    <div className="text-danger mt-1">{erros.password}</div>
                  )}
                  <button
                    className="btn btn-success mt-2"
                    onClick={salvarEdicao}
                  >
                    Salvar
                  </button>
                </>
              ) : (
                <div className="d-flex justify-content-between align-items-center">
                  <span>********</span>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => iniciarEdicao("password")}
                    disabled={!!editandoCampo}
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>
          </div>
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
