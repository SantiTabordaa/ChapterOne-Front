import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AutoresPage from "./pages/AutoresPage";
import LibroDetalle from "./pages/LibroDetalle";
import GenerosPage from "./pages/GenerosPage";
import LibrosPage from "./pages/LibrosPage";

const features = [
  {
    title: "Catalogo vivo",
    copy:
      "Libros, autores y sagas conectados. Unifica la busqueda por genero y explora reseñas sin friccion."
  },
  {
    title: "Clubes con identidad",
    copy:
      "Cada club tiene su propia biblioteca, posteos y solicitudes. Del historial mensual al debate diario."
  },
  {
    title: "Lecturas a tu ritmo",
    copy:
      "Seguimiento de lectura y valoraciones. Deja reseñas y mantene el progreso sincronizado."
  }
];

const mockHighlights = [
  {
    label: "Lectores activos",
    value: "1.248",
    detail: "Ultimos 30 dias"
  },
  {
    label: "Clubes creados",
    value: "86",
    detail: "Abiertos y privados"
  },
  {
    label: "Resenas publicadas",
    value: "3.6k",
    detail: "Calidad verificada"
  }
];

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
        <Route path="/libros/:id" element={<LibroDetalle />} />
        <Route path="/generos" element={<GenerosPage />} />
      </Routes>
    </div>
  );
}

export default App;
