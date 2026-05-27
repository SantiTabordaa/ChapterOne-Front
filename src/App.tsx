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
        <NavLink to="/login" className="primary nav-cta">Entrar</NavLink>
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
