import { useEffect, useState } from "react";
import { fetchAutoresListado } from "../api/autor";
import type { AutorListado } from "../entities/autorListado";

export default function AutoresPage() {
  const [autores, setAutores] = useState<AutorListado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchAutoresListado()
      .then((data) => {
        if (active) {
          setAutores(data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Error cargando autores");
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
          <h2>Autores</h2>
        </div>
        {loading ? (
          <p className="status-text">Cargando autores...</p>
        ) : error ? (
          <p className="status-text error-text">{error}</p>
        ) : (
          <div className="catalog-grid">
            {autores.map((autor) => (
              <article key={autor.id_autor} className="catalog-card">
                <div className="avatar">
                  {autor.url_foto ? (
                    <img src={autor.url_foto} alt={autor.nombre} />
                  ) : (
                    <span>{autor.nombre.slice(0, 1)}</span>
                  )}
                </div>
                <h3>
                  {autor.nombre} {autor.apellido}
                </h3>
                <p>
                  {autor.pseudonimo ? `"${autor.pseudonimo}" · ` : ""}
                  {autor.nacionalidad || "Sin nacionalidad"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
