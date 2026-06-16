import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchClubesListado } from "../api/club";

interface ClubListado {
  id_club: number;
  nombre_club: string;
  descripcion?: string | null;
  genero?: string | null;
  cantidad_integrantes: number;
  es_privado: boolean;
}

export default function ClubesPage() {
  const [clubs, setClubs] = useState<ClubListado[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<ClubListado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    fetchClubesListado()
      .then((data) => {
        if (active) {
          setClubs(data);
          // Extraer géneros únicos
          const uniqueGenres = Array.from(
            new Set(data.map((c) => c.genero).filter((g) => g !== null && g !== undefined))
          ) as string[];
          setGenres(uniqueGenres.sort());
        }
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

  // Filtrar clubes cuando cambien los filtros
  useEffect(() => {
    let filtered = clubs;

    // Filtrar por nombre
    if (searchName) {
      filtered = filtered.filter((club) =>
        club.nombre_club.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filtrar por género
    if (selectedGenre) {
      filtered = filtered.filter((club) => club.genero === selectedGenre);
    }

    setFilteredClubs(filtered);
  }, [clubs, searchName, selectedGenre]);

  return (
    <div className="page">
      <section className="catalog">
        <div className="catalog-header-centered">
          <h2>Clubes</h2>
        </div>

        {loading ? (
          <p className="status-text">Cargando clubes...</p>
        ) : error ? (
          <p className="status-text error-text">{error}</p>
        ) : (
          <>
            <div className="filters-container">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="filter-input"
              />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="filter-select"
              >
                <option value="">Todos los géneros</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {filteredClubs.length === 0 ? (
              <p className="status-text">
                No se encontraron clubes con esos filtros
              </p>
            ) : (
              <div className="clubs-grid">
                {filteredClubs.map((club) => (
                  <article key={club.id_club} className="club-card">
                    <Link
                      to={`/clubes/${encodeURIComponent(club.id_club)}`}
                      className="club-card-link"
                    >
                      <div className="club-card-header">
                        <div className="club-avatar">
                          <span>{club.nombre_club.slice(0, 1).toUpperCase()}</span>
                        </div>
                        <h3>{club.nombre_club}</h3>
                        {club.es_privado && <span className="lock-icon">🔒</span>}
                      </div>
                      
                      <p className="club-description">
                        {club.descripcion || "Sin descripción"}
                      </p>

                      <div className="club-footer">
                        <div className="club-left">
                          {club.genero && (
                            <span className="genre-tag">{club.genero}</span>
                          )}
                        </div>
                        <div className="club-right">
                          <span className="members">
                            👥 {club.cantidad_integrantes}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
