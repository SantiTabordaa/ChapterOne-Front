import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AutoresPage from "./pages/AutoresPage";
import LibroDetalle from "./pages/LibroDetalle";
import AutorDetalle from "./pages/AutorDetalle";
import GenerosPage from "./pages/GenerosPage";
import LibrosPage from "./pages/LibrosPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PasswordRecoveryPage from "./pages/PasswordRecoveryPage";

function App() {
  return (
    <div className="app-shell">
      <nav className="top-nav">
        <div className="brand">
          <span className="brand-mark">ChapterOne</span>
          <span className="brand-sub">wiki social</span>
        </div>
        <div className="nav-links">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/libros">Libros</NavLink>
          <NavLink to="/autores">Autores</NavLink>
          <NavLink to="/generos">Generos</NavLink>
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
      </Routes>
    </div>
  );
}

export default App;
