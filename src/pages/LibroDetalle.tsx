import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchLibroById } from "../api/libro";
import {
  eliminarDeReadlist,
  fetchMiLecturaPorLibro,
  guardarEnReadlist,
} from "../api/lectura";
import {
  actualizarResena,
  crearResena,
  denunciarResena,
  desestimarDenunciaResena,
  eliminarResena,
  fetchResenasPorLibro,
} from "../api/resena";
import type { Libro } from "../entities/libro";
import type { EstadoLectura, Lectura } from "../entities/lectura";
import type { Resena } from "../entities/resena";
import {
  assetUrl,
  getAuthToken,
  getCurrentUserId,
  isCurrentUserAdmin,
} from "../api/client";
import { ConfirmModal, ReportModal } from "../components/ReportModal";

type OrdenResenas = "recientes" | "mayor" | "menor";

const ETIQUETAS_ESTADO: Record<EstadoLectura, string> = {
  "quiero leer": "Quiero leer",
  leyendo: "Leyendo",
  leido: "Leído",
};

function formatearFechaResena(fechaStr?: string | null): string {
  if (!fechaStr) return "";
  const partes = fechaStr.split("-");
  if (partes.length === 3) {
    const fecha = new Date(
      Number(partes[0]),
      Number(partes[1]) - 1,
      Number(partes[2]),
    );
    if (!isNaN(fecha.getTime())) {
      return fecha.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  }
  return fechaStr;
}

function renderEstrellas(puntaje: number): string {
  const llenas = Math.round(puntaje);
  return "★".repeat(Math.max(0, Math.min(5, llenas))) +
    "☆".repeat(Math.max(0, 5 - Math.min(5, llenas)));
}

function obtenerFechaHoyISO(): string {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function LibroDetalle() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [libro, setLibro] = useState<Libro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [lecturaActual, setLecturaActual] = useState<Lectura | null>(null);
  const [guardandoLectura, setGuardandoLectura] = useState(false);
  const [mensajeLectura, setMensajeLectura] = useState<string | null>(null);

  // Estado de reseñas
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [cargandoResenas, setCargandoResenas] = useState(true);
  const [ordenResenas, setOrdenResenas] = useState<OrdenResenas>("recientes");
  const [puntajeForm, setPuntajeForm] = useState<number>(5);
  const [contenidoForm, setContenidoForm] = useState<string>("");
  const [fechaResenaForm, setFechaResenaForm] = useState<string>(() =>
    obtenerFechaHoyISO(),
  );
  const [editandoResenaId, setEditandoResenaId] = useState<number | null>(null);
  const [enviandoResena, setEnviandoResena] = useState(false);
  const [errorResena, setErrorResena] = useState<string | null>(null);
  const [mensajeResena, setMensajeResena] = useState<string | null>(null);
  const [resenaADenunciar, setResenaADenunciar] = useState<Resena | null>(null);
  const [resenaAEliminar, setResenaAEliminar] = useState<{
    idResena: number;
    esMia: boolean;
  } | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(Boolean(token));
    setIsAdmin(isCurrentUserAdmin());
    setCurrentUserId(getCurrentUserId());
  }, []);

  useEffect(() => {
    if (!id) return;
    const libroId = parseInt(id, 10);

    let active = true;
    setLoading(true);
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

    setCargandoResenas(true);
    fetchResenasPorLibro(libroId)
      .then((lista) => {
        if (active) {
          setResenas(lista);
        }
      })
      .catch(() => {
        if (active) {
          setResenas([]);
        }
      })
      .finally(() => {
        if (active) {
          setCargandoResenas(false);
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

  const refrescarLibroYLectura = async (libroId: number) => {
    try {
      const [libroActualizado, lectura] = await Promise.all([
        fetchLibroById(libroId),
        getAuthToken() ? fetchMiLecturaPorLibro(libroId) : Promise.resolve(null),
      ]);
      setLibro(libroActualizado);
      if (getAuthToken()) {
        setLecturaActual(lectura);
      }
    } catch {
      // Ignoramos errores secundarios de refresco
    }
  };

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
    if (!lecturaActual || !libro) return;
    setGuardandoLectura(true);
    setMensajeLectura(null);
    try {
      await eliminarDeReadlist(lecturaActual.idLectura);
      setLecturaActual(null);
      setMensajeLectura("Eliminado de tu lista de lectura");
      const [ nuevasResenas, libroActualizado ] = await Promise.all([
        fetchResenasPorLibro(libro.idLibro),
        fetchLibroById(libro.idLibro),
      ]);
      setResenas(nuevasResenas);
      setLibro(libroActualizado);
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

  useEffect(() => {
    if (!loading && location.hash === "#resenas") {
      const el = document.getElementById("resenas");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [loading, location.hash]);

  const miResena = resenas.find(
    (r) =>
      (currentUserId != null && r.idUsuario === currentUserId) ||
      (lecturaActual != null && r.idLectura === lecturaActual.idLectura),
  );

  const resenasOrdenadas = [...resenas].sort((a, b) => {
    const aEsMia =
      (currentUserId != null && a.idUsuario === currentUserId) ||
      (lecturaActual != null && a.idLectura === lecturaActual.idLectura);
    const bEsMia =
      (currentUserId != null && b.idUsuario === currentUserId) ||
      (lecturaActual != null && b.idLectura === lecturaActual.idLectura);

    if (aEsMia && !bEsMia) return -1;
    if (!aEsMia && bEsMia) return 1;

    if (ordenResenas === "mayor") {
      if (b.puntaje !== a.puntaje) return b.puntaje - a.puntaje;
    } else if (ordenResenas === "menor") {
      if (a.puntaje !== b.puntaje) return a.puntaje - b.puntaje;
    }

    const fechaA = a.fechaResena ?? "";
    const fechaB = b.fechaResena ?? "";
    if (fechaB !== fechaA) return fechaB.localeCompare(fechaA);
    return b.idResena - a.idResena;
  });

  const handleIniciarEdicion = (resena: Resena) => {
    setEditandoResenaId(resena.idResena);
    setPuntajeForm(resena.puntaje);
    setContenidoForm(resena.contenido ?? "");
    setFechaResenaForm(resena.fechaResena || obtenerFechaHoyISO());
    setErrorResena(null);
    setMensajeResena(null);
  };

  const handleCancelarEdicion = () => {
    setEditandoResenaId(null);
    setPuntajeForm(5);
    setContenidoForm("");
    setFechaResenaForm(obtenerFechaHoyISO());
    setErrorResena(null);
  };

  const handleSubmitResena = async (e: FormEvent) => {
    e.preventDefault();
    if (!libro) return;

    const textoLimpio = contenidoForm.trim();
    if (puntajeForm < 1 || puntajeForm > 5) {
      setErrorResena("El puntaje debe estar entre 1 y 5 estrellas.");
      return;
    }

    setEnviandoResena(true);
    setErrorResena(null);
    setMensajeResena(null);

    try {
      if (editandoResenaId != null) {
        const actualizada = await actualizarResena(editandoResenaId, {
          idLibro: libro.idLibro,
          puntaje: puntajeForm,
          contenido: textoLimpio,
          fechaResena: fechaResenaForm || undefined,
        });
        setResenas((prev) =>
          prev.map((r) => (r.idResena === actualizada.idResena ? actualizada : r)),
        );
        setEditandoResenaId(null);
        setMensajeResena("Tu reseña fue actualizada correctamente.");
      } else {
        const creada = await crearResena({
          idLibro: libro.idLibro,
          puntaje: puntajeForm,
          contenido: textoLimpio,
          fechaResena: fechaResenaForm || undefined,
        });
        setResenas((prev) => {
          const sinPrevia = prev.filter((r) => r.idResena !== creada.idResena);
          return [creada, ...sinPrevia];
        });
        setMensajeResena("¡Tu reseña fue publicada y quedó en la página!");
      }

      setContenidoForm("");
      setPuntajeForm(5);
      setFechaResenaForm(obtenerFechaHoyISO());
      await refrescarLibroYLectura(libro.idLibro);
    } catch (err) {
      setErrorResena(
        err instanceof Error
          ? err.message
          : "No se pudo guardar la reseña. Intentá nuevamente.",
      );
    } finally {
      setEnviandoResena(false);
    }
  };

  const handleEliminarResena = (idResena: number, esMia: boolean) => {
    setResenaAEliminar({ idResena, esMia });
  };

  const confirmarEliminarResena = async () => {
    if (!libro || !resenaAEliminar) return;
    const { idResena } = resenaAEliminar;
    setEnviandoResena(true);
    setErrorResena(null);
    setMensajeResena(null);
    try {
      await eliminarResena(idResena);
      setResenas((prev) => prev.filter((r) => r.idResena !== idResena));
      if (editandoResenaId === idResena) {
        handleCancelarEdicion();
      }
      setMensajeResena("Reseña eliminada.");
      setResenaAEliminar(null);
      await refrescarLibroYLectura(libro.idLibro);
    } catch (err) {
      setErrorResena(
        err instanceof Error ? err.message : "No se pudo eliminar la reseña.",
      );
      setResenaAEliminar(null);
    } finally {
      setEnviandoResena(false);
    }
  };

  const handleDenunciarResena = (resena: Resena) => {
    setResenaADenunciar(resena);
  };

  const confirmarDenunciaResena = async (motivo: string) => {
    if (!resenaADenunciar) return;
    setEnviandoResena(true);
    setErrorResena(null);
    setMensajeResena(null);
    try {
      const actualizada = await denunciarResena(
        resenaADenunciar.idResena,
        motivo,
      );
      setResenas((prev) =>
        prev.map((r) =>
          r.idResena === actualizada.idResena ? actualizada : r,
        ),
      );
      setResenaADenunciar(null);
      setMensajeResena(
        "La reseña fue denunciada y será revisada por un administrador.",
      );
    } catch (err) {
      setErrorResena(
        err instanceof Error ? err.message : "No se pudo denunciar la reseña.",
      );
      setResenaADenunciar(null);
    } finally {
      setEnviandoResena(false);
    }
  };

  const handleDesestimarDenuncia = async (idResena: number) => {
    setEnviandoResena(true);
    setErrorResena(null);
    setMensajeResena(null);
    try {
      const actualizada = await desestimarDenunciaResena(idResena);
      setResenas((prev) =>
        prev.map((r) =>
          r.idResena === actualizada.idResena ? actualizada : r,
        ),
      );
      setMensajeResena("Se quitó la denuncia de la reseña.");
    } catch (err) {
      setErrorResena(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar el estado de la denuncia.",
      );
    } finally {
      setEnviandoResena(false);
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

  const mostrarFormulario = isLoggedIn && (!miResena || editandoResenaId != null);

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
              <span>★ {libro.valoracion}/5 estrellas</span>
            )}
            <span>
              {resenas.length}{" "}
              {resenas.length === 1 ? "reseña" : "reseñas"}
            </span>
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

          {/* Sección de Reseñas */}
          <section id="resenas" className="book-reviews-section">
            <div className="book-reviews-header">
              <div>
                <p className="eyebrow">Comunidad</p>
                <h2>Reseñas de lectores ({resenas.length})</h2>
              </div>

              {resenas.length > 1 && (
                <select
                  className="review-sort-select"
                  value={ordenResenas}
                  onChange={(e) =>
                    setOrdenResenas(e.target.value as OrdenResenas)
                  }
                  aria-label="Ordenar reseñas"
                >
                  <option value="recientes">Más recientes</option>
                  <option value="mayor">Mayor puntaje</option>
                  <option value="menor">Menor puntaje</option>
                </select>
              )}
            </div>

            {mensajeResena && (
              <p className="review-feedback success">{mensajeResena}</p>
            )}
            {errorResena && (
              <p className="review-feedback error">{errorResena}</p>
            )}

            {!isLoggedIn && (
              <div className="review-login-prompt">
                <p>
                  ¿Ya leíste <strong>{libro.titulo}</strong>? Iniciá sesión para
                  dejar tu puntaje y compartir tu reseña con la comunidad.
                </p>
                <Link to="/login" className="ghost">
                  Iniciar sesión
                </Link>
              </div>
            )}

            {mostrarFormulario && (
              <form className="review-form-card" onSubmit={handleSubmitResena}>
                <h3>
                  {editandoResenaId != null
                    ? "Editar tu reseña"
                    : "Escribir una nueva reseña"}
                </h3>
                <p className="review-form-subtitle">
                  Al publicar tu reseña, el libro quedará marcado como{" "}
                  <strong>Leído</strong> en tu lista.
                </p>

                <div className="review-rating-row">
                  <label htmlFor="puntaje-select">Tu valoración:</label>
                  <div className="star-picker" role="group" aria-label="Seleccionar estrellas">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${puntajeForm >= star ? "filled" : ""}`}
                        onClick={() => setPuntajeForm(star)}
                        title={`${star} ${star === 1 ? "estrella" : "estrellas"}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <select
                    id="puntaje-select"
                    className="review-score-select"
                    value={puntajeForm}
                    onChange={(e) => setPuntajeForm( parseFloat(e.target.value) )}
                  >
                    <option value={5}>5.0 ★ Excelente</option>
                    <option value={4.5}>4.5 ★ Muy bueno</option>
                    <option value={4}>4.0 ★ Bueno</option>
                    <option value={3.5}>3.5 ★ Interesante</option>
                    <option value={3}>3.0 ★ Regular</option>
                    <option value={2.5}>2.5 ★ Flojo</option>
                    <option value={2}>2.0 ★ Malo</option>
                    <option value={1.5}>1.5 ★ Muy malo</option>
                    <option value={1}>1.0 ★ No recomendado</option>
                  </select>

                  <div className="review-date-field">
                    <label htmlFor="fecha-resena-input">Fecha:</label>
                    <input
                      id="fecha-resena-input"
                      type="date"
                      className="review-date-input"
                      value={fechaResenaForm}
                      max={obtenerFechaHoyISO()}
                      onChange={(e) => setFechaResenaForm(e.target.value)}
                      disabled={enviandoResena}
                      required
                    />
                  </div>
                </div>

                <textarea
                  className="review-textarea"
                  rows={4}
                  placeholder="Contanos qué te pareció la historia, los personajes o el estilo del autor (opcional)..."
                  value={contenidoForm}
                  onChange={(e) => setContenidoForm(e.target.value)}
                  disabled={enviandoResena}
                />

                <div className="review-form-actions">
                  <button
                    type="submit"
                    className="primary"
                    disabled={enviandoResena}
                  >
                    {enviandoResena
                      ? "Guardando..."
                      : editandoResenaId != null
                        ? "Guardar cambios"
                        : "Publicar reseña"}
                  </button>
                  {editandoResenaId != null && (
                    <button
                      type="button"
                      className="ghost"
                      onClick={handleCancelarEdicion}
                      disabled={enviandoResena}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            )}

            {cargandoResenas ? (
              <p className="status-text">Cargando reseñas...</p>
            ) : resenasOrdenadas.length === 0 ? (
              <div className="review-empty">
                <p>
                  Todavía no hay reseñas para este libro. ¡Sé el primero en
                  compartir tu opinión!
                </p>
              </div>
            ) : (
              <div className="review-list">
                {resenasOrdenadas.map((resena) => {
                  const esMia =
                    (currentUserId != null &&
                      resena.idUsuario === currentUserId) ||
                    (lecturaActual != null &&
                      resena.idLectura === lecturaActual.idLectura);
                  const nombreMostrar =
                    resena.nombreUsuario || resena.apellidoUsuario
                      ? `${resena.nombreUsuario ?? ""} ${resena.apellidoUsuario ?? ""}`.trim()
                      : resena.username || "Lector de ChapterOne";
                  const inicial = nombreMostrar.slice(0, 1).toUpperCase();

                  return (
                    <article
                      key={resena.idResena}
                      className={`review-card ${esMia ? "review-card-own" : ""} ${isAdmin && resena.denunciada ? "review-card-reported" : ""}`}
                    >
                      <div className="review-card-header">
                        <div className="review-author">
                          <div className="review-avatar">
                            {resena.urlFotoPerfil ? (
                              <img
                                src={assetUrl(resena.urlFotoPerfil) ?? resena.urlFotoPerfil}
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
                              {esMia && (
                                <span className="review-own-badge">
                                  Tu reseña
                                </span>
                              )}
                              {resena.denunciada && (
                                <span className="review-reported-badge">
                                  Denunciada
                                </span>
                              )}
                            </div>
                            {resena.fechaResena && (
                              <span className="review-date">
                                {formatearFechaResena(resena.fechaResena)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="review-rating-badge">
                          <span className="review-stars">
                            {renderEstrellas(resena.puntaje)}
                          </span>
                          <span className="review-score">
                            {resena.puntaje.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {resena.contenido && resena.contenido.trim() !== "" && (
                        <p className="review-content">{resena.contenido}</p>
                      )}

                      {isAdmin &&
                        resena.denunciada &&
                        resena.motivoDenuncia && (
                          <p className="review-report-reason">
                            <strong>Motivo de denuncia:</strong>{" "}
                            {resena.motivoDenuncia}
                          </p>
                        )}

                      {isLoggedIn && editandoResenaId !== resena.idResena && (
                        <div className="review-card-actions">
                          {(esMia || isAdmin) && (
                            <>
                              <button
                                type="button"
                                className="review-action-btn"
                                onClick={() => handleIniciarEdicion(resena)}
                                disabled={enviandoResena}
                              >
                                {esMia ? "Editar reseña" : "Editar (Admin)"}
                              </button>
                              <button
                                type="button"
                                className="review-action-btn danger"
                                onClick={() =>
                                  handleEliminarResena(resena.idResena, esMia)
                                }
                                disabled={enviandoResena}
                              >
                                {esMia ? "Eliminar" : "Eliminar (Admin)"}
                              </button>
                            </>
                          )}

                          {isAdmin && resena.denunciada && (
                            <button
                              type="button"
                              className="review-action-btn"
                              onClick={() =>
                                handleDesestimarDenuncia(resena.idResena)
                              }
                              disabled={enviandoResena}
                            >
                              Quitar denuncia
                            </button>
                          )}

                          {!esMia && !resena.denunciada && (
                            <button
                              type="button"
                              className="review-action-btn report"
                              onClick={() => handleDenunciarResena(resena)}
                              disabled={enviandoResena}
                            >
                              Denunciar
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
        </div>
      </div>

      <ReportModal
        key={resenaADenunciar?.idResena ?? "closed"}
        isOpen={resenaADenunciar != null}
        loading={enviandoResena}
        onClose={() => setResenaADenunciar(null)}
        onConfirm={confirmarDenunciaResena}
      />

      <ConfirmModal
        isOpen={resenaAEliminar != null}
        title="Eliminar reseña"
        message={
          resenaAEliminar?.esMia
            ? "¿Seguro que querés eliminar tu reseña de este libro?"
            : "¿Seguro que querés eliminar esta reseña como administrador?"
        }
        loading={enviandoResena}
        onClose={() => setResenaAEliminar(null)}
        onConfirm={confirmarEliminarResena}
      />
    </div>
  );
}
