import React, { useState } from "react";
import logo from "../assets/imagens/guildrivals.png";
import "./Login.css";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const [erros, setErros] = useState({
    name: "",
    email: "",
    senha: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErros({ name: "", email: "", senha: "" });

    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/cadastrar", {
        name,
        email,
        password: senha,
      });

      alert("Cadastro realizado com sucesso!");
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const backendErros = error.response?.data?.errors || {};
        console.log("Erros recebidos:", backendErros);
        setErros((prev) => ({
          ...prev,
          name: backendErros.name?.[0] || "",
          email: backendErros.email?.[0] || "",
          senha: backendErros.password?.[0] || "",
        }));
      } else {
        console.error("Erro ao cadastrar:", error);
        alert("Erro inesperado. Tente novamente.");
      }
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

      <div className="login-form w-auto bg-secondary-subtle p-2 b-2 border border-primary-subtle">
        <h2 className="text-center">Criar nova conta</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              type="text"
              className="form-custom"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {erros.name && (
              <small className="text-danger w-50">{erros.name}</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-custom"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {erros.email && (
              <small className="text-danger w-50">{erros.email}</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-custom"
              placeholder="Digite uma senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            {erros.senha && (
              <small className="text-danger">{erros.senha}</small>
            )}
          </div>

          <button type="submit" className="btn-custom">
            Cadastrar
          </button>
        </form>

        <p className="cadastro-link">
          Já tem conta? <a href="/">Fazer login</a>
        </p>
      </div>
    </div>
  );
}
