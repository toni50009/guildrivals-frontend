import React from "react";
import "./CardItem.css";

export default function CardItem({ carta, onClick, disabled }) {
  if (!carta) return null;

  return (
    <div
      className={`card card-item bg-dark text-warning text-center ${
        disabled ? "disabled-card" : ""
      }`}
      style={{
        width: "100px",
        height: "auto",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="card-body p-2 d-flex flex-column text-align-center justify-content-between">
        <img
          src={`${carta.imagem}`}
          alt={carta.nome}
          className="img-fluid mb-1"
          style={{ height: "70px", width: "100%", objectFit: "contain" }}
        />
        <small className="fw-bold">{carta.nome}</small>
        <small>{carta.descricao}</small>
        <small>Custa {carta.custo} mana</small>
      </div>
    </div>
  );
}
