import React from "react";
import { useNavigate } from "react-router-dom";

export default function ButtonExit() {
  const navigate = useNavigate();
  const fugirBatalha = () => {
    navigate("/home");
  };

  return (
    <button
      className="btn p-1 btn-success position-absolute top-0 start-0 m-2"
      onClick={fugirBatalha}
    >
      Voltar para a Home
    </button>
  );
}
