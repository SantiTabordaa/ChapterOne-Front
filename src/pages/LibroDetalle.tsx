import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchLibroById } from "../api/libro";
import {
  eliminarDeReadlist,
  fetchMiLecturaPorLibro,
  guardarEnReadlist,
} from "../api/lectura";
import type { Libro } from "../entities/libro";
import type { EstadoLectura, Lectura } from "../entities/lectura";
import { assetUrl, getAuthToken } from "../api/client";

const ETIQUETAS_ESTADO: Record<EstadoLectura, string> = {
  "quiero leer": "Quiero leer",
  leyendo: "Leyendo",
  leido: "Leído",
};

export default function LibroDetalle() {
  const { id } = useParams<{ id: string }>();
  const [libro, setLibro] = useState<Libro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lecturaActual, setLecturaActual] = useState<Lectura | null>(null);
  const [guardandoLectura, setGuardandoLectura] = useState(false);
  const [mensajeLectura, setMensajeLectura] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(Boolean(token));
  }, []);

  useEffect(() => {
    if (!id) return;
    const libroId = parseInt(id, 10);

    let active = true;
    fetchLibroById(libroId)
      .then((data) => {
        if (active) {
          setLibro(data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Error cargando el libro",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    if (getAuthToken()) {
      fetchMiLecturaPorLibro(libroId)
        .then((lectura) => {
          if (active) {
            setLecturaActual(lectura);
          }
        })
        .catch(() => {
          // Si falla la consulta individual no bloqueamos la vista del libro
        });
    }

    return () => {
      active = false;
    };
  }, [id]);

  const handleSeleccionarEstado = async (nuevoEstado: EstadoLectura) => {
    if (!libro) return;
    setGuardandoLectura(true);
    setMensajeLectura(null);
    try {
      const guardada = await guardarEnReadlist(libro.idLibro, nuevoEstado);
      setLecturaActual(guardada);
      setMensajeLectura(
        `Guardado en tu lista como "${ETIQUETAS_ESTADO[nuevoEstado]}"`,
      );
    } catch (err) {
      setMensajeLectura(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar tu lista de lectura",
      );
    } finally {
      setGuardandoLectura(false);
    }
  };

  const handleQuitarDeLista = async () => {
    if (!lecturaActual) return;
    setGuardandoLectura(true);
    setMensajeLectura(null);
    try {
      await eliminarDeReadlist(lecturaActual.idLectura);
      setLecturaActual(null);
      setMensajeLectura("Eliminado de tu lista de lectura");
    } catch (err) {
      setMensajeLectura(
        err instanceof Error
          ? err.message
          : "No se pudo quitar el libro de tu lista",
      );
    } finally {
      setGuardandoLectura(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p className="status-text">Cargando libro...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="status-text error-text">{error}</p>
      </div>
    );
  }

  if (!libro) {
    return (
      <div className="page">
        <p className="status-text">Libro no encontrado.</p>
      </div>
    );
  }

  const autores = libro.autores ?? [];
  const estadoNormalizado = lecturaActual?.estado
    ?.trim()
    .toLowerCase()
    .replace("leído", "leido") as EstadoLectura | undefined;

  return (
    <div className="page">
      <div className="book-detail-grid">
        <div className="book-cover-container">
          <div className="book-cover">
            {libro.urlPortada ? (
              <img src={assetUrl(libro.urlPortada) ?? ""} alt={libro.titulo} />
            ) : (
              <div className="book-cover-placeholder">
                <span>{libro.titulo.slice(0, 1)}</span>
              </div>
            )}
          </div>

          {isLoggedIn && (
            <div className="book-readlist-panel">
              <div className="book-actions">
                <button
                  type="button"
                  disabled={guardandoLectura}
                  className={estadoNormalizado === "leido" ? "primary" : "ghost"}
                  onClick={() => handleSeleccionarEstado("leido")}
                >
                  {estadoNormalizado === "leido"
                    ? "✓ Leído"
                    : "Marcar como leído"}
                </button>
                <button
                  type="button"
                  disabled={guardandoLectura}
                  className={
                    estadoNormalizado === "quiero leer" ? "primary" : "ghost"
                  }
                  onClick={() => handleSeleccionarEstado("quiero leer")}
                >
                  {estadoNormalizado === "quiero leer"
                    ? "✓ En Quiero leer"
                    : "Agregar a lista"}
                </button>
              </div>

              <div className="book-actions-secondary">
                <button
                  type="button"
                  disabled={guardandoLectura}
                  className={
                    estadoNormalizado === "leyendo" ? "primary" : "ghost"
                  }
                  onClick={() => handleSeleccionarEstado("leyendo")}
                >
                  {estadoNormalizado === "leyendo"
                    ? "✓ Leyendo actualmente"
                    : "Marcar como leyendo"}
                </button>

                {lecturaActual && (
                  <button
                    type="button"
                    disabled={guardandoLectura}
                    className="readlist-remove-btn"
                    onClick={handleQuitarDeLista}
                  >
                    Quitar de mi lista
                  </button>
                )}
              </div>

              {mensajeLectura && (
                <p className="readlist-feedback">{mensajeLectura}</p>
              )}
            </div>
          )}
        </div>
        <div className="book-info">
          <h1>{libro.titulo}</h1>
          {autores.length > 0 && (
            <div className="book-authors">
              {autores.map((autor, index) => (
                <p key={autor.idAutor}>
                  {index === 0 && "Por "}
                  <Link to={`/autores/${autor.idAutor}`}>
                    {autor.nombre} {autor.apellido}
                  </Link>
                  {index < autores.length - 1 ? "," : ""}
                </p>
              ))}
            </div>
          )}
          {libro.saga && (
            <p className="book-saga">
              {libro.saga} {libro.nroTomo ? `#${libro.nroTomo}` : ""}
            </p>
          )}
          <div className="book-meta">
            {libro.cantPag && <span>{libro.cantPag} páginas</span>}
            {libro.valoracion != null && (
              <span>{libro.valoracion}/5 estrellas</span>
            )}
          </div>
          {libro.sinopsis && (
            <div className="book-synopsis">
              <h2>Sinopsis</h2>
              <p>{libro.sinopsis}</p>
            </div>
          )}
          {libro.generos && libro.generos.length > 0 && (
            <div className="book-genres">
              <h2>Género</h2>
              <div className="tag-list">
                {libro.generos.map((genero) => (
                  <span key={genero} className="tag">
                    {genero}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
