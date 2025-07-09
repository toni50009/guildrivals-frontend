// src/components/RotaProtegida.jsx
import { Navigate } from "react-router-dom";
import { getUsuarioLogado } from "../utils/user";

export default function RotaProtegida({ children }) {
  const usuario = getUsuarioLogado();

  if (!usuario) {
    return <Navigate to="/" />;
  }

  return children;
}
