import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchLibroById } from "../api/libro";
import type { Libro } from "../entities/libro";
import { assetUrl } from "../api/client";

export default function LibroDetalle() {
  const { id } = useParams<{ id: string }>();
  const [libro, setLibro] = useState<Libro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let active = true;
    fetchLibroById(parseInt(id, 10))
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

    return () => {
      active = false;
    };
  }, [id]);

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
          <div className="book-actions">
            <button className="primary">Marcar como leido</button>
            <button className="ghost">Agregar a lista</button>
          </div>
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
              {libro.saga.nombre} #{libro.nroTomo}
            </p>
          )}
          <div className="book-meta">
            {libro.cantPag && <span>{libro.cantPag} páginas</span>}
            {libro.valoracion && <span>{libro.valoracion}/5 estrellas</span>}
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
                  <span key={genero.idGenero} className="tag">
                    {genero.nombreGen}
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
