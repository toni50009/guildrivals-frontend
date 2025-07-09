import React from "react";
import { useNavigate } from "react-router-dom";

export default function ButtonExit() {
  const navigate = useNavigate();
  const fugirBatalha = () => {
    navigate("/home");
  };

  return (
    <button
      className="btn p-3 btn-danger position-absolute top-0 start-0 m-2"
      onClick={fugirBatalha}
    >
      Sair
    </button>
  );
}
