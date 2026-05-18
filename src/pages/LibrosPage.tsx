import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLibros } from '../api/libro';
import type { Libro } from '../entities/libro';
import { assetUrl } from '../api/client';

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
          setError(
            err instanceof Error ? err.message : 'Error cargando libros',
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
                          .join(', ') || 'Anónimo'}
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
