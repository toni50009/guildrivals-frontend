import React from "react";
import { FaHeart, FaShieldAlt, FaTint } from "react-icons/fa";

export default function InfoPlayer({ vida, armadura, mana, identificador }) {
  return (
    <div className="d-flex w-100 justify-content-center">
      <div className="d-flex w-auto justify-content-center gap-2 bg-dark p-2 border rounded m-2 w-md-custom-30">
        <div>
          <FaShieldAlt style={{ color: "gray" }} /> Armadura: {armadura}
        </div>
        <div>
          <FaHeart style={{ color: "red" }} /> {identificador} Vida: {vida}
        </div>
        <div>
          <FaTint style={{ color: "blue" }} /> Mana: {mana}
        </div>
      </div>
    </div>
  );
}
