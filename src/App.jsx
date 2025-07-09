import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import Conta from "./pages/Conta";
import Ranking from "./pages/Ranking";
import RotaProtegida from "./components/RotaProtegida";
import RotaPublica from "./components/RotaPublica";
import Battle from "./pages/Battle";

export default function App() {
  return (
    <Routes>
      {/* Página de login acessível apenas se não estiver logado */}
      <Route
        path="/"
        element={
          <RotaPublica>
            <Login />
          </RotaPublica>
        }
      />

      {/* Página de cadastro acessível apenas se não estiver logado */}
      <Route
        path="/cadastro"
        element={
          <RotaPublica>
            <Cadastro />
          </RotaPublica>
        }
      />

      {/* Demais páginas protegidas */}
      <Route
        path="/home"
        element={
          <RotaProtegida>
            <Home />
          </RotaProtegida>
        }
      />

      <Route
        path="/conta"
        element={
          <RotaProtegida>
            <Conta />
          </RotaProtegida>
        }
      />

      <Route
        path="/ranking"
        element={
          <RotaProtegida>
            <Ranking />
          </RotaProtegida>
        }
      />

      <Route
        path="/battle"
        element={
          <RotaProtegida>
            <Battle />
          </RotaProtegida>
        }
      />
    </Routes>
  );
}
