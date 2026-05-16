import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLibros } from "../api/libro";
import type { Libro } from "../entities/libro";
import { assetUrl } from "../api/client";


export default function LibrosPage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchLibros()
      .then((data) => {
        if (active) {
          setLibros(data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Error cargando libros");
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
  }, []);

  return (
    <div className="page">
      <section className="catalog">
        <div className="catalog-header">
          <h2>Libros</h2>
        </div>
        {loading ? (
          <p className="status-text">Cargando libros...</p>
        ) : error ? (
          <p className="status-text error-text">{error}</p>
        ) : (
          <div className="catalog-grid">
            {libros.map((libro) => (
              <Link
                key={libro.idLibro}
                to={`/libros/${libro.idLibro}`}
                className="catalog-card-link"
              >
                <article className="catalog-card">
                  <h3>{libro.titulo}</h3>
                  <p>
                    {libro.saga?.nombre ? `${libro.saga.nombre} · ` : ""}
                    {libro.cantPag
                      ? `${libro.cantPag} paginas`
                      : "Sin paginas"}
                  </p>
                  {libro.sinopsis ? <p>{libro.sinopsis}</p> : null}
                  <div className="catalog-card-cover">
                    {libro.urlPortada ? (
                      <img src={assetUrl(libro.urlPortada)} alt={libro.titulo} />
                    ) : (
                      <div className="catalog-card-placeholder">
                        <span>{libro.titulo.slice(0, 1)}</span>
                      </div>
                    )}
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
