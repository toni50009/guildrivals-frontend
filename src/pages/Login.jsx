import React, { useState } from "react";
import "./Login.css";
import logo from "../assets/imagens/guildrivals.png";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { salvarUsuario } from "../utils/user";

export default function Login() {
  const [name, setName] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      // 🔐 Primeiro: obtém o cookie CSRF

      await api.get("/sanctum/csrf-cookie");
      console.log("Cookie XSRF-TOKEN:", document.cookie);
      // 🚪 Envia os dados para login
      const response = await api.post("/api/login", {
        name,
        password: senha,
      });

      console.log("Dados recebidos:", response.data);
      salvarUsuario(response.data.user);
      alert("Login realizado com sucesso!");
      navigate("/home");
    } catch (error) {
      console.error("Erro ao logar:", error);
      setErro("Nome ou senha inválidos.");
    }
  };

  return (
    <div
      className="container-fluid d-flex flex-column align-items-center justify-content-center bg-light"
      style={{
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <header className="login-header">
        <img src={logo} alt="Logo" className="logo" />
      </header>

      <div className="login-form w-auto p-3 bg-secondary-subtle border border-primary-subtle">
        <h2 className="text-center">Faça login para jogar</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              type="text"
              placeholder="Digite seu nome"
              required
              className="form-custom"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              required
              className="form-custom"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {erro && <p className="text-danger">{erro}</p>}

          <button type="submit" className="btn-custom">
            Entrar
          </button>
        </form>

        <p className="cadastro-link">
          <Link to="/cadastro">Cadastre-se agora!</Link>
        </p>
      </div>
    </div>
  );
}
