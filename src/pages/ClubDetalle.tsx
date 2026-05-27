import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchClubById } from "../api/club";
import type { Club } from "../entities/club";

export default function ClubDetalle() {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          <div className="book-cover">
            <div className="book-cover-placeholder">
              <span>{club.nombreClub.slice(0, 1)}</span>
            </div>
          </div>
        </div>
        <div className="book-info">
          <h1>{club.nombreClub}</h1>
          {club.descrip && <div className="book-synopsis"><h2>Descripción</h2><p>{club.descrip}</p></div>}
          {club.genero && <p>Género: {club.genero.nombreGen}</p>}
          {club.admin && <p>Administrador: {club.admin.nombre} {club.admin.apellido}</p>}
          <div style={{ marginTop: 12 }}>
            <button className="primary">Unirme</button>
            <button className="ghost">Ver posteos</button>
          </div>
        </div>
      </div>
    </div>
  );
}
