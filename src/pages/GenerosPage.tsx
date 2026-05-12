import { useEffect, useState } from "react";
import { fetchGeneros } from "../api/genero";
import type { Genero } from "../entities/genero";

export default function GenerosPage() {
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchGeneros()
      .then((data) => {
        if (active) {
          setGeneros(data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Error cargando generos");
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
          <h2>Generos</h2>
        </div>
        {loading ? (
          <p className="status-text">Cargando generos...</p>
        ) : error ? (
          <p className="status-text error-text">{error}</p>
        ) : (
          <div className="catalog-grid">
            {generos.map((genero) => (
              <article key={genero.idGenero} className="catalog-card">
                <h3>{genero.nombreGen}</h3>
                <p>
                  {genero.libros
                    ? `${genero.libros.length} libros asociados`
                    : "Sin libros asociados"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
