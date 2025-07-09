// src/utils/user.js
import api from "../services/api";

export function salvarUsuario(usuario) {
  localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
}

export function getUsuarioLogado() {
  const data = localStorage.getItem("usuarioLogado");
  return data ? JSON.parse(data) : null;
}

export function logoutUsuario() {
  localStorage.removeItem("usuarioLogado");
}

export async function getUsuarioBackend() {
  try {
    const response = await api.get("/api/usuario");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário no backend:", error);
    return null;
  }
}
