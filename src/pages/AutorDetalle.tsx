import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAutorById } from "../api/autor";
import { apiGet } from "../api/client";
import type { Autor } from "../entities/autor";
import { assetUrl } from "../api/client";

function formatDate(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function AutorDetalle() {
  const { id } = useParams<{ id: string }>();
  const [autor, setAutor] = useState<Autor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let active = true;
    fetchAutorById(parseInt(id, 10))
      .then(async (data) => {
        if (!active) return;
        setAutor(data);
        if (data.libros && data.libros.length > 0) {
          const missing = data.libros
            .filter((b) => !b.urlPortada)
            .map((b) => b.idLibro);
          if (missing.length > 0) {
            try {
              const fetched = await Promise.all(
                missing.map((idLibro) => apiGet<any>(`/libros/${idLibro}`)),
              );
              const map = new Map<number, string>();
              fetched.forEach((f) => {
                if (f && (f.url_portada || f.urlPortada)) {
                  map.set(
                    f.id_libro ?? f.idLibro,
                    f.url_portada ?? f.urlPortada,
                  );
                }
              });

              if (map.size > 0) {
                setAutor((prev) => {
                  if (!prev) return prev;
                  const libros = prev.libros?.map((lb) => ({
                    ...lb,
                    urlPortada: lb.urlPortada ?? map.get(lb.idLibro) ?? null,
                  }));
                  return { ...prev, libros };
                });
              }
            } catch (e) {}
          }
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Error cargando el autor",
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

  useEffect(() => {
    if (!autor) return;
  }, [autor]);

  if (loading) {
    return (
      <div className="page">
        <p className="status-text">Cargando autor...</p>
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

  if (!autor) {
    return (
      <div className="page">
        <p className="status-text">Autor no encontrado.</p>
      </div>
    );
  }

  const nacimiento = formatDate(autor.fechaNacimiento);
  const fallecimiento = formatDate(autor.fechaFallecimiento);

  const nacimientoLinea = (() => {
    const parts: string[] = [];
    if (nacimiento) parts.push(nacimiento);
    if (autor.lugarNacimiento) parts.push(autor.lugarNacimiento);
    return parts.length > 0 ? parts.join(", ") : null;
  })();

  const fallecimientoLinea = (() => {
    const parts: string[] = [];
    if (fallecimiento) parts.push(fallecimiento);
    if (autor.lugarFallecimiento) parts.push(autor.lugarFallecimiento);
    return parts.length > 0 ? parts.join(", ") : null;
  })();

  return (
    <div className="page">
      <div className="author-detail-grid">
        <div className="author-card">
          <div className="author-top">
            <div className="avatar-large">
              {autor.urlFoto ? (
                <img
                  src={assetUrl(autor.urlFoto) ?? ""}
                  alt={`${autor.nombre} ${autor.apellido}`}
                />
              ) : (
                <div className="avatar-placeholder">
                  <span>{autor.nombre.slice(0, 1)}</span>
                </div>
              )}
            </div>

            <div className="author-info">
              <h1>
                {autor.nombre} {autor.apellido}
              </h1>
              {autor.pseudonimo && (
                <p className="muted">"{autor.pseudonimo}"</p>
              )}
              <div className="author-meta">
                <p>{autor.nacionalidad ?? "Sin nacionalidad"}</p>
                {nacimientoLinea && <p>Nacimiento: {nacimientoLinea}</p>}
                {fallecimientoLinea && (
                  <p>Fallecimiento: {fallecimientoLinea}</p>
                )}
              </div>
            </div>
          </div>

          {autor.resumen && (
            <div className="author-summary">
              <h2>Sobre el escritor</h2>
              <p>{autor.resumen}</p>
            </div>
          )}

          <div className="author-actions">
            <button className="primary">Seguir autor</button>
            <button className="ghost">Agregar a favoritos</button>
          </div>
        </div>

        <div className="author-books">
          <h2>Libros</h2>
          {autor.libros && autor.libros.length > 0 ? (
            <ul className="book-list">
              {autor.libros.map((libro) => (
                <li className="book-item" key={libro.idLibro}>
                  <Link to={`/libros/${libro.idLibro}`} className="book-link">
                    <div className="book-thumb">
                      {libro.urlPortada ? (
                        <img
                          src={assetUrl(libro.urlPortada)!}
                          alt={libro.titulo}
                        />
                      ) : (
                        <div className="book-thumb-placeholder">
                          {libro.titulo.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className="book-title">
                      {libro.titulo}
                      {libro.nroTomo ? ` #${libro.nroTomo}` : ""}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Sin libros asociados.</p>
          )}
        </div>
      </div>
    </div>
  );
}
