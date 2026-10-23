import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  actualizarEstadoLectura,
  eliminarDeReadlist,
  fetchMisLecturas,
} from "../api/lectura";
import { fetchLibrosRecomendados } from "../api/libro";
import { assetUrl, getAuthToken } from "../api/client";
import type { EstadoLectura, Lectura } from "../entities/lectura";
import type { Libro } from "../entities/libro";

type FiltroEstado = "todos" | EstadoLectura;

const ETIQUETAS_ESTADO: Record<EstadoLectura, string> = {
  "quiero leer": "Quiero leer",
  leyendo: "Leyendo",
  leido: "Leído",
};

function formatearFecha(fechaStr?: string | null): string | null {
  if (!fechaStr) return null;
  const d = new Date(fechaStr);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ReadlistPage() {
  const navigate = useNavigate();
  const [lecturas, setLecturas] = useState<Lectura[]>([]);
  const [recomendados, setRecomendados] = useState<Libro[]>([]);
  const [filtro, setFiltro] = useState<FiltroEstado>("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [procesandoId, setProcesandoId] = useState<number | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    let active = true;
    fetchMisLecturas()
      .then((data) => {
        if (active) {
          setLecturas(data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Error al cargar tu lista de lectura",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    fetchLibrosRecomendados(3)
      .then((data) => {
        if (active) {
          setRecomendados(data);
        }
      })
      .catch(() => {
        // Ignoramos error de recomendaciones secundarias
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleCambiarEstado = async (
    idLectura: number,
    nuevoEstado: EstadoLectura,
  ) => {
    setProcesandoId(idLectura);
    try {
      const actualizada = await actualizarEstadoLectura(idLectura, nuevoEstado);
      setLecturas((prev) =>
        prev.map((item) =>
          item.idLectura === idLectura ? actualizada : item,
        ),
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar el estado de lectura",
      );
    } finally {
      setProcesandoId(null);
    }
  };

  const handleEliminar = async (idLectura: number, titulo: string) => {
    if (!window.confirm(`¿Quitar "${titulo}" de tu lista de lectura?`)) {
      return;
    }
    setProcesandoId(idLectura);
    try {
      await eliminarDeReadlist(idLectura);
      setLecturas((prev) =>
        prev.filter((item) => item.idLectura !== idLectura),
      );
      fetchLibrosRecomendados(3)
        .then(setRecomendados)
        .catch(() => {});
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "No se pudo eliminar el libro de tu lista",
      );
    } finally {
      setProcesandoId(null);
    }
  };

  const normalizar = (estado: string): EstadoLectura => {
    const clean = estado.trim().toLowerCase().replace("leído", "leido");
    if (clean === "leyendo" || clean === "leido") return clean;
    return "quiero leer";
  };

  const conteo = {
    todos: lecturas.length,
    "quiero leer": lecturas.filter((l) => normalizar(l.estado) === "quiero leer")
      .length,
    leyendo: lecturas.filter((l) => normalizar(l.estado) === "leyendo").length,
    leido: lecturas.filter((l) => normalizar(l.estado) === "leido").length,
  };

  const lecturasFiltradas =
    filtro === "todos"
      ? lecturas
      : lecturas.filter((l) => normalizar(l.estado) === filtro);

  return (
    <div className="page">
      <section className="catalog">
        <div className="catalog-header">
          <div>
            <p className="eyebrow">Biblioteca Personal</p>
            <h2 style={{ margin: "6px 0 0" }}>Mi Lista de Lectura</h2>
          </div>

          <div className="tab-list">
            <button
              type="button"
              className={`tab ${filtro === "todos" ? "active" : ""}`}
              onClick={() => setFiltro("todos")}
            >
              Todos ({conteo.todos})
            </button>
            <button
              type="button"
              className={`tab ${filtro === "quiero leer" ? "active" : ""}`}
              onClick={() => setFiltro("quiero leer")}
            >
              Quiero leer ({conteo["quiero leer"]})
            </button>
            <button
              type="button"
              className={`tab ${filtro === "leyendo" ? "active" : ""}`}
              onClick={() => setFiltro("leyendo")}
            >
              Leyendo ({conteo.leyendo})
            </button>
            <button
              type="button"
              className={`tab ${filtro === "leido" ? "active" : ""}`}
              onClick={() => setFiltro("leido")}
            >
              Leídos ({conteo.leido})
            </button>
          </div>
        </div>

        {loading ? (
          <p className="status-text">Cargando tu lista de lectura...</p>
        ) : error ? (
          <p className="status-text error-text">{error}</p>
        ) : lecturasFiltradas.length === 0 ? (
          <div className="readlist-empty">
            <h3>
              {filtro === "todos"
                ? "Todavía no tenés libros en tu lista de lectura"
                : `No tenés libros con el estado "${ETIQUETAS_ESTADO[filtro]}"`}
            </h3>
            <p>
              Explorá el catálogo para agregar tus próximas lecturas y llevar el
              seguimiento de tu progreso.
            </p>
            <Link to="/libros" className="primary">
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <div className="readlist-grid">
            {lecturasFiltradas.map((lectura) => {
              const libro = lectura.libro;
              const estadoActual = normalizar(lectura.estado);
              const fechaIni = formatearFecha(lectura.fechaIni);
              const fechaFin = formatearFecha(lectura.fechaFin);
              const deshabilitado = procesandoId === lectura.idLectura;

              return (
                <article key={lectura.idLectura} className="readlist-card">
                  <Link
                    to={`/libros/${libro.idLibro}`}
                    className="readlist-card-cover"
                  >
                    <span
                      className={`readlist-status-badge status-${estadoActual.replace(" ", "-")}`}
                    >
                      {ETIQUETAS_ESTADO[estadoActual]}
                    </span>
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
                  </Link>

                  <div className="readlist-card-body">
                    <Link to={`/libros/${libro.idLibro}`}>
                      <h3>{libro.titulo}</h3>
                    </Link>
                    <p className="book-card-details">
                      {libro.autores
                        ?.map((autor) => `${autor.nombre} ${autor.apellido}`)
                        .join(", ") || "Anónimo"}
                    </p>

                    {(fechaIni || fechaFin) && (
                      <div className="readlist-dates">
                        {fechaIni && <span>Inicio: {fechaIni}</span>}
                        {fechaFin && <span>Fin: {fechaFin}</span>}
                      </div>
                    )}

                    {lectura.resena ? (
                      <Link
                        to={`/libros/${libro.idLibro}#resenas`}
                        className="readlist-review-badge"
                        title={lectura.resena.contenido || "Ver tu reseña"}
                      >
                        <span className="readlist-review-stars">
                          ★ {lectura.resena.puntaje.toFixed(1)}/5
                        </span>
                        <span className="readlist-review-link">
                          Ver tu reseña →
                        </span>
                      </Link>
                    ) : estadoActual === "leido" ? (
                      <Link
                        to={`/libros/${libro.idLibro}#resenas`}
                        className="readlist-write-review-link"
                      >
                        Escribir reseña
                      </Link>
                    ) : null}

                    <div className="readlist-card-controls">
                      <select
                        className="readlist-select"
                        value={estadoActual}
                        disabled={deshabilitado}
                        onChange={(e) =>
                          handleCambiarEstado(
                            lectura.idLectura,
                            e.target.value as EstadoLectura,
                          )
                        }
                        aria-label="Cambiar estado de lectura"
                      >
                        <option value="quiero leer">Quiero leer</option>
                        <option value="leyendo">Leyendo</option>
                        <option value="leido">Leído</option>
                      </select>

                      <button
                        type="button"
                        className="readlist-remove-btn"
                        disabled={deshabilitado}
                        onClick={() =>
                          handleEliminar(lectura.idLectura, libro.titulo)
                        }
                        title="Quitar de mi lista"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="catalog">
        <div className="catalog-header">
          <div>
            <p className="eyebrow">Sugerencias según tus géneros</p>
            <h2 style={{ margin: "6px 0 0" }}>
              Tus próximas lecturas recomendadas
            </h2>
          </div>
        </div>
        {recomendados.length === 0 ? (
          <p className="status-text">
            Agregá libros a tu lista de lectura para descubrir recomendaciones de tus géneros favoritos.
          </p>
        ) : (
          <div className="catalog-grid">
            {recomendados.map((libro) => (
              <Link
                key={`rec-readlist-${libro.idLibro}`}
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
    </div>
  );
}
