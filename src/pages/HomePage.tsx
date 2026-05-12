import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="page">
      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">ChapterOne Club</p>
          <h1>
            Un lector, un club, una historia compartida. Tu comunidad literaria
            en un solo lugar.
          </h1>
          <p className="lead">
            ChapterOne es una wiki social para descubrir libros, autores y
            generos. Guarda tus hallazgos, arma listas y comparte reseñas con
            tu club.
          </p>
          <div className="hero-actions">
            <Link className="primary" to="/libros">
              Explorar catalogo
            </Link>
            <Link className="ghost" to="/autores">
              Ver autores
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="panel-card">
            <div className="panel-header">
              <span className="badge">WIKI LIVE</span>
              <span className="status">Actualizado hoy</span>
            </div>
            <h3>Explora por categoria</h3>
            <p className="panel-copy">
              Accede rapido a los listados mas consultados y participa con
              reseñas, lecturas y debates.
            </p>
            <div className="panel-tags">
              <span>Top libros</span>
              <span>Autores trending</span>
              <span>Generos en alza</span>
            </div>
          </div>
        </div>
      </header>

      <section className="highlights">
        <div className="highlight-card">
          <p className="highlight-label">Lectores activos</p>
          <p className="highlight-value">1.248</p>
          <p className="highlight-detail">Ultimos 30 dias</p>
        </div>
        <div className="highlight-card">
          <p className="highlight-label">Clubes creados</p>
          <p className="highlight-value">86</p>
          <p className="highlight-detail">Abiertos y privados</p>
        </div>
        <div className="highlight-card">
          <p className="highlight-label">Resenas publicadas</p>
          <p className="highlight-value">3.6k</p>
          <p className="highlight-detail">Calidad verificada</p>
        </div>
      </section>

      <section className="feature-grid">
        <article>
          <h3>Catalogo vivo</h3>
          <p>
            Libros, autores y sagas conectados. Unifica la busqueda por genero y
            explora reseñas sin friccion.
          </p>
        </article>
        <article>
          <h3>Clubes con identidad</h3>
          <p>
            Cada club tiene su propia biblioteca, posteos y solicitudes. Del
            historial mensual al debate diario.
          </p>
        </article>
        <article>
          <h3>Lecturas a tu ritmo</h3>
          <p>
            Seguimiento de lectura y valoraciones. Deja reseñas y mantene el
            progreso sincronizado.
          </p>
        </article>
      </section>

      <section className="cta">
        <div>
          <h2>Sumate a la comunidad lectora</h2>
          <p>
            Guarda tus lecturas, crea listas compartidas y encuentra tu proxima
            historia favorita.
          </p>
        </div>
        <button className="primary">Crear cuenta</button>
      </section>
    </div>
  );
}
