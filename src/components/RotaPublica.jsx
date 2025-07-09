// src/components/RotaPublica.jsx
import { Navigate } from "react-router-dom";
import { getUsuarioLogado } from "../utils/user";

export default function RotaPublica({ children }) {
  const usuario = getUsuarioLogado();

  if (usuario) {
    return <Navigate to="/home" />;
  }

  return children;
}
