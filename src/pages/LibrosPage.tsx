import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLibros, fetchLibrosRecomendados } from '../api/libro';
import type { Libro } from '../entities/libro';
import { assetUrl, getAuthToken } from '../api/client';

export default function LibrosPage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [recomendados, setRecomendados] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecomendados, setLoadingRecomendados] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoggedIn = Boolean(getAuthToken());

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

    if (getAuthToken()) {
      setLoadingRecomendados(true);
      fetchLibrosRecomendados(4)
        .then((data) => {
          if (active) {
            setRecomendados(data);
          }
        })
        .catch(() => {
          // Si falla no interrumpimos el catálogo general
        })
        .finally(() => {
          if (active) {
            setLoadingRecomendados(false);
          }
        });
    }

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page">
      {isLoggedIn && (
        <section className="catalog">
          <div className="catalog-header">
            <div>
              <p className="eyebrow">Basado en los géneros que leés</p>
              <h2 style={{ margin: '6px 0 0' }}>Recomendados para vos</h2>
            </div>
          </div>
          {loadingRecomendados ? (
            <p className="status-text">Cargando recomendaciones...</p>
          ) : recomendados.length === 0 ? (
            <p className="status-text">
              Agregá libros a tu lista de lectura para recibir recomendaciones basadas en tus géneros favoritos.
            </p>
          ) : (
            <div className="catalog-grid">
              {recomendados.map((libro) => (
                <Link
                  key={`rec-${libro.idLibro}`}
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
      )}

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
