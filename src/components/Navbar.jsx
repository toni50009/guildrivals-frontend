import { useNavigate } from "react-router-dom";
import logo from "../assets/imagens/guildrivals.png";
import { logoutUsuario } from "../utils/user";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUsuario();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary px-3">
      <div className="d-flex w-100 align-items-center justify-content-center">
        <ul className="navbar-nav flex-row">
          <li className="nav-item mx-2 border-bottom border-secondary">
            <a className="nav-link" href="/home">
              Home
            </a>
          </li>
          <li className="nav-item mx-2 border-bottom border-secondary">
            <a className="nav-link" href="/ranking">
              Ranking
            </a>
          </li>
          <img src={logo} alt="Logo" style={{ width: "40px" }} />
          <li className="nav-item mx-2 border-bottom border-secondary">
            <a className="nav-link" href="/conta">
              Conta
            </a>
          </li>
          <li className="nav-item mx-2 border-bottom border-secondary">
            <button
              className="nav-link btn btn-link text-light"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
