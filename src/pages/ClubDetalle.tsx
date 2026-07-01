import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchClubById } from "../api/club";
import { assetUrl } from "../api/client";
import type { Club } from "../entities/club";

export default function ClubDetalle() {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const postsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    const idNum = Number(id);
    if (!Number.isFinite(idNum)) {
      setError("ID de club inválido");
      setLoading(false);
      return;
    }
    let active = true;
    fetchClubById(idNum)
      .then((data) => {
        if (active) setClub(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Error cargando club");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleCompartir = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  if (loading) {
    return (
      <div className="page">
        <p className="status-text">Cargando club...</p>
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

  if (!club) {
    return (
      <div className="page">
        <p className="status-text">Club no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="book-detail-grid">
        <div className="book-cover-container">
          {club.libroMes && (
            <Link to={`/libros/${club.libroMes.idLibro}`} className="club-book-month">
              <span className="club-book-month-label">Libro del mes</span>
              <div className="club-book-month-cover">
                {club.libroMes.urlPortada ? (
                  <img src={assetUrl(club.libroMes.urlPortada)} alt={club.libroMes.titulo} />
                ) : (
                  <span>{club.libroMes.titulo.slice(0, 1)}</span>
                )}
              </div>
              <p className="club-book-month-title">{club.libroMes.titulo}</p>
              {club.mesAnio && <p className="club-book-month-date">{club.mesAnio}</p>}
            </Link>
          )}
          <div className="club-detail-actions">
            <button className="primary">Unirme</button>
            <button className="ghost" onClick={() => postsRef.current?.scrollIntoView({ behavior: "smooth" })}>
              Ver posteos
            </button>
            <button className="ghost" onClick={handleCompartir}>
              Compartir
            </button>
          </div>
        </div>

        <div className="book-info">
          <h1>
            {club.nombreClub}
            {club.privado && <span className="lock-icon"> 🔒</span>}
          </h1>
          <div className="club-detail-meta">
            {club.genero && <span className="genre-tag">{club.genero.nombreGen}</span>}
            {club.admin && (
              <span className="club-detail-admin">
                Admin: {club.admin.nombre} {club.admin.apellido}
              </span>
            )}
            <span className="club-detail-members">{club.cantidadUsuarios} miembros</span>
          </div>

          {club.descrip && (
            <div className="book-synopsis">
              <h2>Descripción</h2>
              <p>{club.descrip}</p>
            </div>
          )}

          {club.posteos && club.posteos.length > 0 && (
            <div className="club-posts-section" ref={postsRef}>
              <h2>Posteos</h2>
              {club.posteos.map((post) => (
                <div key={post.idPosteo} className="club-post-card">
                  <div className="club-post-header">
                    <span className="club-post-author">
                      {post.usuario?.nombre} {post.usuario?.apellido}
                    </span>
                    <span className="club-post-date">
                      {new Date(post.fechaHoraCreacion).toLocaleDateString("es-AR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="club-post-content">{post.contenido}</p>
                </div>
              ))}
            </div>
          )}

          {club.posteos && club.posteos.length === 0 && (
            <div className="club-posts-section" ref={postsRef}>
              <h2>Posteos</h2>
              <p className="status-text">Este club aún no tiene posteos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
