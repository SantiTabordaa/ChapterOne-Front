import { useEffect, useState } from "react";
import { fetchGeneros } from "../api/genero";
import type { Genero } from "../entities/genero";

const genreIcons: Record<string, string> = {
  fantasia: "🐉",
  "ciencia ficcion": "🚀",
  misterio: "🔍",
  romance: "❤️",
  historia: "🏛️",
  terror: "👻",
  aventura: "⛰️",
  ficcion: "📖",
  poesia: "📝",
  drama: "🎭",
  comedia: "😄",
  biografia: "👤",
  ensayo: "📜",
  infantil: "🧒",
  juvenil: "🌟",
};

const genreColors: Record<string, string> = {
  fantasia: "rgba(180, 120, 240, 0.07)",
  "ciencia ficcion": "rgba(80, 160, 220, 0.07)",
  misterio: "rgba(180, 140, 100, 0.07)",
  romance: "rgba(230, 140, 160, 0.07)",
  historia: "rgba(200, 170, 120, 0.07)",
  terror: "rgba(160, 100, 120, 0.07)",
  aventura: "rgba(140, 200, 120, 0.07)",
  ficcion: "rgba(160, 180, 200, 0.07)",
  poesia: "rgba(220, 190, 140, 0.07)",
  drama: "rgba(200, 150, 130, 0.07)",
  comedia: "rgba(240, 210, 100, 0.07)",
  biografia: "rgba(170, 190, 200, 0.07)",
  ensayo: "rgba(180, 180, 170, 0.07)",
  infantil: "rgba(140, 220, 200, 0.07)",
  juvenil: "rgba(240, 200, 80, 0.07)",
};

function getGenreIcon(nombre: string): string {
  const key = nombre.toLowerCase().trim();
  return genreIcons[key] || "📚";
}

function getGenreColor(nombre: string): string {
  const key = nombre.toLowerCase().trim();
  return genreColors[key] || "rgba(200, 180, 160, 0.07)";
}

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
          setError(
            err instanceof Error ? err.message : "Error cargando generos",
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
          <h2>Géneros</h2>
        </div>
        {loading ? (
          <p className="status-text">Cargando generos...</p>
        ) : error ? (
          <p className="status-text error-text">{error}</p>
        ) : (
          <div className="generos-grid">
            {generos.map((genero) => (
              <article
                key={genero.idGenero}
                className="genero-card"
                style={{
                  background: `
                    linear-gradient(145deg, ${getGenreColor(genero.nombreGen)}, ${getGenreColor(genero.nombreGen)}),
                    linear-gradient(145deg, #fffaf2, #fdf0e0)
                  `,
                }}
              >
                <span className="genero-icon">
                  {getGenreIcon(genero.nombreGen)}
                </span>
                <h3>{genero.nombreGen}</h3>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
