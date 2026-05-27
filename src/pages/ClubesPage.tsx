import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchClubes } from "../api/club";
import type { Club } from "../entities/club";

export default function ClubesPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchClubes()
      .then((data) => {
        if (active) setClubs(data);
      })
      .catch((err) => {
        if (active)
          setError(
            err instanceof Error ? err.message : "Error cargando clubes",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page">
      <section className="catalog">
        <div className="catalog-header">
          <h2>Clubes</h2>
        </div>
        {loading ? (
          <p className="status-text">Cargando clubes...</p>
        ) : error ? (
          <p className="status-text error-text">{error}</p>
        ) : (
          <div className="catalog-grid">
            {clubs.map((club) => {
              const raw: any = club as any;
              const idVal = raw.idClub ?? raw.id_club ?? raw.id ?? null;
              const idStr = idVal != null ? String(idVal) : null;
              const hasId = idStr !== null;
              const key = hasId ? idStr : JSON.stringify(club);

              const content = (
                <>
                  <div className="avatar">
                    {club.nombreClub ? (
                      <span>{club.nombreClub.slice(0, 1)}</span>
                    ) : (
                      <span>?</span>
                    )}
                  </div>
                  <h3>{club.nombreClub}</h3>
                  <p>{club.descrip || "Sin descripción"}</p>
                </>
              );

              return (
                <article key={key} className="catalog-card">
                  {hasId ? (
                    <Link
                      to={`/clubes/${encodeURIComponent(idStr as string)}`}
                      className="card-link"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="card-link">{content}</div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
