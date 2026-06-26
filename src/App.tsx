import { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AutoresPage from "./pages/AutoresPage";
import LibroDetalle from "./pages/LibroDetalle";
import AutorDetalle from "./pages/AutorDetalle";
import GenerosPage from "./pages/GenerosPage";
import LibrosPage from "./pages/LibrosPage";
import ClubesPage from "./pages/ClubesPage";
import ClubDetalle from "./pages/ClubDetalle";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PasswordRecoveryPage from "./pages/PasswordRecoveryPage";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [urlFotoPerfil, setUrlFotoPerfil] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setToken(sessionStorage.getItem("token"));
      setUrlFotoPerfil(sessionStorage.getItem("urlFotoPerfil"));
    } else {
      setToken(localStorage.getItem("token"));
      setUrlFotoPerfil(localStorage.getItem("urlFotoPerfil"));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="app-shell">
      <nav className="top-nav">
        <NavLink to="/" end className="brand">
          <img src="/inicio.png" alt="Inicio" className="brand-image" />
        </NavLink>
        <div className="nav-links">
          <NavLink to="/libros">Libros</NavLink>
          <NavLink to="/autores">Autores</NavLink>
          <NavLink to="/generos">Generos</NavLink>
          <NavLink to="/clubes">Clubes</NavLink>
        </div>

        {token ? (
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <img
              src={urlFotoPerfil || "/default-avatar.png"} // Si por algún motivo es null, pon una imagen por defecto en tu carpeta public
              alt="Perfil del usuario"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%", // Esto hace el circulito
                objectFit: "cover", // Evita que la foto se deforme si no es cuadrada
                border: "2px solid #ccc", // Opcional: un bordecito para que resalte
              }}
            />
            <button
              onClick={handleLogout}
              style={{
                cursor: "pointer",
                background: "none",
                border: "none",
                color: "var(--primary-color, #000)",
              }}
            >
              Salir
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="primary nav-cta">
            Entrar
          </NavLink>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/libros" element={<LibrosPage />} />
        <Route path="/autores" element={<AutoresPage />} />
        <Route path="/autores/:id" element={<AutorDetalle />} />
        <Route path="/libros/:id" element={<LibroDetalle />} />
        <Route path="/generos" element={<GenerosPage />} />
        <Route path="/clubes" element={<ClubesPage />} />
        <Route path="/clubes/:id" element={<ClubDetalle />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
      </Routes>
    </div>
  );
}

export default App;
