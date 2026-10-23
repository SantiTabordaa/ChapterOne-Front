import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLibros } from "../api/libro";
import { fetchAutoresListado } from "../api/autor";
import { fetchClubesListado, type ClubListado } from "../api/club";
import { eliminarResena, fetchResenas } from "../api/resena";
import { fetchMisLecturas } from "../api/lectura";
import {
  assetUrl,
  getAuthToken,
  getCurrentUserId,
  isCurrentUserAdmin,
} from "../api/client";
import type { Libro } from "../entities/libro";
import type { AutorListado } from "../entities/autorListado";
import type { Resena } from "../entities/resena";
import type { Lectura } from "../entities/lectura";

function formatearFechaCorta(fechaStr?: string | null): string | null {
  if (!fechaStr) return null;
  const d = new Date(fechaStr);
  if (Number.isNaN(d.getTime())) return fechaStr;
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function renderEstrellas(puntaje: number): string {
  const llenas = Math.round(Math.max(1, Math.min(5, puntaje)));
  return "★".repeat(llenas) + "☆".repeat(5 - llenas);
}

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    Boolean(getAuthToken()),
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isCurrentUserAdmin());
  const [currentUserId, setCurrentUserId] = useState<number | null>(() =>
    getCurrentUserId(),
  );
  const [libros, setLibros] = useState<Libro[]>([]);
  const [autores, setAutores] = useState<AutorListado[]>([]);
  const [clubes, setClubes] = useState<ClubListado[]>([]);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [misLecturas, setMisLecturas] = useState<Lectura[]>([]);
  const [loading, setLoading] = useState(true);
  const [eliminandoResenaId, setEliminandoResenaId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    let active = true;
    const token = getAuthToken();
    const loggedIn = Boolean(token);
    setIsAuthenticated(loggedIn);
    setIsAdmin(isCurrentUserAdmin());
    setCurrentUserId(getCurrentUserId());

    Promise.allSettled([
      fetchLibros(),
      fetchAutoresListado(),
      fetchClubesListado(),
      fetchResenas(),
      loggedIn ? fetchMisLecturas() : Promise.resolve([] as Lectura[]),
    ])
      .then(
        ([librosRes, autoresRes, clubesRes, resenasRes, misLecturasRes]) => {
          if (!active) return;

          if (librosRes.status === "fulfilled") {
            setLibros(librosRes.value);
          }
          if (autoresRes.status === "fulfilled") {
            setAutores(autoresRes.value);
          }
          if (clubesRes.status === "fulfilled") {
            setClubes(clubesRes.value);
          }
          if (resenasRes.status === "fulfilled") {
            setResenas(resenasRes.value);
          }
          if (misLecturasRes.status === "fulfilled") {
            setMisLecturas(misLecturasRes.value);
          }
        },
      )
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const librosOrdenados = [...libros].sort(
    (a, b) => (b.valoracion ?? 0) - (a.valoracion ?? 0),
  );
  const libroDestacado = librosOrdenados[0] ?? null;
  const topLibros = librosOrdenados.slice(0, 5);

  const topClubes = [...clubes]
    .sort((a, b) => b.cantidad_integrantes - a.cantidad_integrantes)
    .slice(0, 3);

  const ultimasResenas = [...resenas]
    .sort((a, b) => {
      const timeA = a.fechaResena ? new Date(a.fechaResena).getTime() : 0;
      const timeB = b.fechaResena ? new Date(b.fechaResena).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      return b.idResena - a.idResena;
    })
    .slice(0, 3);

  const lecturasEnCurso = misLecturas.filter(
    (l) => l.estado.trim().toLowerCase() === "leyendo",
  );

  const handleEliminarResenaHome = async (resena: Resena) => {
    const esMia =
      currentUserId != null && resena.idUsuario === currentUserId;
    const msg = esMia
      ? "¿Seguro que querés eliminar tu reseña?"
      : "¿Seguro que querés eliminar esta reseña como administrador?";
    if (!window.confirm(msg)) return;

    setEliminandoResenaId(resena.idResena);
    try {
      await eliminarResena(resena.idResena);
      setResenas((prev) =>
        prev.filter((item) => item.idResena !== resena.idResena),
      );
      const librosActualizados = await fetchLibros();
      setLibros(librosActualizados);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "No se pudo eliminar la reseña.",
      );
    } finally {
      setEliminandoResenaId(null);
    }
  };

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
            géneros. Guardá tus hallazgos, armá tu lista de lectura y compartí
            reseñas con tu club.
          </p>
          <div className="hero-actions">
            <Link className="primary" to="/libros">
              Explorar catálogo
            </Link>
            <Link className="ghost" to="/clubes">
              Explorar clubes
            </Link>
            {isAuthenticated && (
              <Link className="ghost" to="/mi-lista">
                Mi lista de lectura
              </Link>
            )}
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-card">
            <div className="panel-header">
              <span className="badge">Destacado de la comunidad</span>
              {libroDestacado?.valoracion != null &&
                libroDestacado.valoracion > 0 && (
                  <span className="hero-featured-rating">
                    ⭐ {libroDestacado.valoracion.toFixed(1)}
                  </span>
                )}
            </div>

            {loading ? (
              <p className="status-text">Cargando libro destacado...</p>
            ) : libroDestacado ? (
              <div className="hero-featured-book">
                <Link
                  to={`/libros/${libroDestacado.idLibro}`}
                  className="hero-featured-cover"
                >
                  {libroDestacado.urlPortada ? (
                    <img
                      src={assetUrl(libroDestacado.urlPortada)}
                      alt={libroDestacado.titulo}
                    />
                  ) : (
                    <div className="catalog-card-placeholder">
                      <span>{libroDestacado.titulo.slice(0, 1)}</span>
                    </div>
                  )}
                </Link>

                <div className="hero-featured-info">
                  <Link to={`/libros/${libroDestacado.idLibro}`}>
                    <h3>{libroDestacado.titulo}</h3>
                  </Link>
                  <p className="hero-featured-author">
                    {libroDestacado.autores
                      ?.map((a) => `${a.nombre} ${a.apellido}`)
                      .join(", ") || "Autor desconocido"}
                  </p>
                  {libroDestacado.sinopsis && (
                    <p className="hero-featured-synopsis">
                      {libroDestacado.sinopsis}
                    </p>
                  )}
                  {libroDestacado.generos &&
                    libroDestacado.generos.length > 0 && (
                      <div className="panel-tags">
                        {libroDestacado.generos.slice(0, 3).map((gen) => (
                          <span key={gen}>{gen}</span>
                        ))}
                      </div>
                    )}
                  <Link
                    to={`/libros/${libroDestacado.idLibro}`}
                    className="hero-featured-cta"
                  >
                    Ver ficha del libro →
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h3>Explorá el catálogo</h3>
                <p className="panel-copy">
                  Descubrí los libros mejor puntuados de la comunidad y sumá tus
                  propias reseñas.
                </p>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="highlights">
        <div className="highlight-card">
          <p className="highlight-label">Libros en catálogo</p>
          <p className="highlight-value">{loading ? "—" : libros.length}</p>
          <p className="highlight-detail">Obras disponibles para explorar</p>
        </div>
        <div className="highlight-card">
          <p className="highlight-label">Autores registrados</p>
          <p className="highlight-value">{loading ? "—" : autores.length}</p>
          <p className="highlight-detail">Biografías y bibliografías</p>
        </div>
        <div className="highlight-card">
          <p className="highlight-label">Clubes de lectura</p>
          <p className="highlight-value">{loading ? "—" : clubes.length}</p>
          <p className="highlight-detail">Comunidades abiertas y privadas</p>
        </div>
        <div className="highlight-card">
          <p className="highlight-label">Reseñas publicadas</p>
          <p className="highlight-value">{loading ? "—" : resenas.length}</p>
          <p className="highlight-detail">Valoraciones de lectores</p>
        </div>
      </section>

      {isAuthenticated && (
        <section className="catalog">
          <div className="home-section-header">
            <div>
              <p className="eyebrow">Tu actividad</p>
              <h2>Mis lecturas en curso</h2>
            </div>
            <Link to="/mi-lista" className="section-link">
              Ir a Mi Lista ({misLecturas.length}) →
            </Link>
          </div>

          {loading ? (
            <p className="status-text">Cargando tus lecturas...</p>
          ) : lecturasEnCurso.length === 0 ? (
            <div className="home-reading-empty">
              <div>
                <h3>No tenés ningún libro marcado como "Leyendo" ahora mismo</h3>
                <p>
                  Actualizá el estado desde tu lista personal o elegí tu próxima
                  lectura en el catálogo.
                </p>
              </div>
              <div className="home-reading-empty-actions">
                <Link to="/mi-lista" className="ghost">
                  Ver Mi Lista
                </Link>
                <Link to="/libros" className="primary">
                  Buscar libros
                </Link>
              </div>
            </div>
          ) : (
            <div className="home-reading-grid">
              {lecturasEnCurso.map((lectura) => {
                const { libro } = lectura;
                const fechaInicio = formatearFechaCorta(lectura.fechaIni);

                return (
                  <Link
                    key={lectura.idLectura}
                    to={`/libros/${libro.idLibro}`}
                    className="home-reading-card"
                  >
                    <div className="home-reading-cover">
                      {libro.urlPortada ? (
                        <img
                          src={assetUrl(libro.urlPortada)}
                          alt={libro.titulo}
                        />
                      ) : (
                        <div className="catalog-card-placeholder">
                          <span>{libro.titulo.slice(0, 1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="home-reading-body">
                      <span className="readlist-status-badge status-leyendo home-reading-badge">
                        Leyendo
                      </span>
                      <h3>{libro.titulo}</h3>
                      <p className="book-card-details">
                        {libro.autores
                          ?.map((a) => `${a.nombre} ${a.apellido}`)
                          .join(", ") || "Anónimo"}
                      </p>
                      {fechaInicio && (
                        <span className="home-reading-date">
                          Iniciado el {fechaInicio}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}

      <section className="catalog">
        <div className="home-section-header">
          <div>
            <p className="eyebrow">Favoritos de los lectores</p>
            <h2>Top libros mejor valorados</h2>
          </div>
          <Link to="/libros" className="section-link">
            Ver catálogo completo →
          </Link>
        </div>

        {loading ? (
          <p className="status-text">Cargando libros destacados...</p>
        ) : topLibros.length === 0 ? (
          <p className="status-text">Todavía no hay libros cargados.</p>
        ) : (
          <div className="home-top-books-grid">
            {topLibros.map((libro) => (
              <Link
                key={libro.idLibro}
                to={`/libros/${libro.idLibro}`}
                className="catalog-card-link"
              >
                <article className="catalog-card">
                  <div className="catalog-card-cover">
                    {libro.valoracion != null && (
                      <div className="book-card-rating">
                        <span>⭐</span>
                        <span>{libro.valoracion.toFixed(1)}</span>
                      </div>
                    )}
                    {libro.urlPortada ? (
                      <img
                        src={assetUrl(libro.urlPortada)}
                        alt={libro.titulo}
                      />
                    ) : (
                      <div className="catalog-card-placeholder">
                        <span>{libro.titulo.slice(0, 1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="catalog-card-body">
                    <h3>{libro.titulo}</h3>
                    <p className="book-card-details">
                      <span>
                        {libro.autores
                          ?.map((autor) => `${autor.nombre} ${autor.apellido}`)
                          .join(", ") || "Anónimo"}
                      </span>
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="catalog">
        <div className="home-section-header">
          <div>
            <p className="eyebrow">Comunidades activas</p>
            <h2>Clubes destacados</h2>
          </div>
          <Link to="/clubes" className="section-link">
            Ver todos los clubes →
          </Link>
        </div>

        {loading ? (
          <p className="status-text">Cargando clubes...</p>
        ) : topClubes.length === 0 ? (
          <p className="status-text">Todavía no hay clubes creados.</p>
        ) : (
          <div className="clubs-grid">
            {topClubes.map((club) => (
              <article key={club.id_club} className="club-card">
                <Link
                  to={`/clubes/${encodeURIComponent(club.id_club)}`}
                  className="club-card-link"
                >
                  <div className="club-card-header">
                    <div className="club-avatar">
                      <span>{club.nombre_club.slice(0, 1).toUpperCase()}</span>
                    </div>
                    <h3>{club.nombre_club}</h3>
                    {club.es_privado && <span className="lock-icon">🔒</span>}
                  </div>

                  <p className="club-description">
                    {club.descripcion || "Sin descripción"}
                  </p>

                  <div className="club-footer">
                    <div className="club-left">
                      {club.genero && (
                        <span className="genre-tag">{club.genero}</span>
                      )}
                    </div>
                    <div className="club-right">
                      <span className="members">
                        👥 {club.cantidad_integrantes}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="catalog">
        <div className="home-section-header">
          <div>
            <p className="eyebrow">Opiniones recientes</p>
            <h2>Últimas reseñas de la comunidad</h2>
          </div>
          <Link to="/libros" className="section-link">
            Explorar libros para reseñar →
          </Link>
        </div>

        {loading ? (
          <p className="status-text">Cargando reseñas recientes...</p>
        ) : ultimasResenas.length === 0 ? (
          <p className="status-text">Todavía no se publicaron reseñas.</p>
        ) : (
          <div className="home-reviews-grid">
            {ultimasResenas.map((resena) => {
              const nombreMostrar =
                [resena.nombreUsuario, resena.apellidoUsuario]
                  .filter(Boolean)
                  .join(" ") ||
                resena.username ||
                "Lector";
              const inicial = nombreMostrar.slice(0, 1).toUpperCase();
              const fecha = formatearFechaCorta(resena.fechaResena);

              return (
                <article key={resena.idResena} className="review-card">
                  <div className="review-card-header">
                    <div className="review-author">
                      <div className="review-avatar">
                        {resena.urlFotoPerfil ? (
                          <img
                            src={assetUrl(resena.urlFotoPerfil)}
                            alt={nombreMostrar}
                          />
                        ) : (
                          <span>{inicial}</span>
                        )}
                      </div>
                      <div>
                        <div className="review-author-name">
                          <strong>{nombreMostrar}</strong>
                          {resena.username && (
                            <span className="review-username">
                              @{resena.username}
                            </span>
                          )}
                        </div>
                        {fecha && <span className="review-date">{fecha}</span>}
                      </div>
                    </div>

                    <div className="review-rating-badge">
                      <span className="review-stars">
                        {renderEstrellas(resena.puntaje)}
                      </span>
                      <span>{resena.puntaje.toFixed(1)}</span>
                    </div>
                  </div>

                  {resena.contenido?.trim() ? (
                    <p className="review-content home-review-excerpt">
                      "{resena.contenido}"
                    </p>
                  ) : (
                    <div
                      className="review-content home-review-spacer"
                      aria-hidden="true"
                    />
                  )}

                  {(resena.idLibro ||
                    isAdmin ||
                    (currentUserId != null &&
                      resena.idUsuario === currentUserId)) && (
                    <div className="home-review-footer">
                      {resena.idLibro ? (
                        <Link
                          to={`/libros/${resena.idLibro}#resenas`}
                          className="home-review-book-link"
                        >
                          📖 {resena.tituloLibro || "Ver libro"} →
                        </Link>
                      ) : (
                        <span />
                      )}

                      {(isAdmin ||
                        (currentUserId != null &&
                          resena.idUsuario === currentUserId)) && (
                        <button
                          type="button"
                          className="review-action-btn danger"
                          disabled={eliminandoResenaId === resena.idResena}
                          onClick={() => handleEliminarResenaHome(resena)}
                        >
                          {eliminandoResenaId === resena.idResena
                            ? "Eliminando..."
                            : currentUserId != null &&
                                resena.idUsuario === currentUserId
                              ? "Eliminar"
                              : "Eliminar (Admin)"}
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {!isAuthenticated && (
        <section className="cta">
          <div>
            <h2>Sumate a la comunidad lectora</h2>
            <p>
              Guardá tus lecturas, llevá el registro de tus libros leídos,
              participá en clubes y compartí tus reseñas.
            </p>
          </div>
          <div className="cta-actions">
            <Link to="/register" className="primary">
              Crear cuenta
            </Link>
            <Link to="/login" className="ghost">
              Iniciar sesión
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
