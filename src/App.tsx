import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AutoresPage from "./pages/AutoresPage";
import LibroDetalle from "./pages/LibroDetalle";
import AutorDetalle from "./pages/AutorDetalle";
import GenerosPage from "./pages/GenerosPage";
import LibrosPage from "./pages/LibrosPage";

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
        <button className="primary nav-cta">Entrar</button>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/libros" element={<LibrosPage />} />
        <Route path="/autores" element={<AutoresPage />} />
        <Route path="/autores/:id" element={<AutorDetalle />} />
        <Route path="/libros/:id" element={<LibroDetalle />} />
        <Route path="/generos" element={<GenerosPage />} />
      </Routes>
    </div>
  );
}

export default App;
