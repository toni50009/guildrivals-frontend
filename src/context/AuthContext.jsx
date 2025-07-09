import { createContext, useContext, useEffect, useState } from "react";
import axios from "../services/api"; // seu axios já configurado com withCredentials

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const verificarLogin = async () => {
    try {
      const response = await axios.get("/api/usuario");
      setUsuario(response.data);
    } catch (error) {
      console.error("Erro ao verificar login:", error);
      setUsuario(null);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    verificarLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, carregando }}>
      {children}
    </AuthContext.Provider>
  );
};

// Aqui está o seu hook personalizado sem erro
export const useAuth = () => useContext(AuthContext);
