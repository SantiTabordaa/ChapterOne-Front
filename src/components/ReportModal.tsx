import { useState } from "react";
import type { FormEvent } from "react";

const MOTIVOS_SUGERIDOS = [
  "Contiene spoilers sin aviso",
  "Lenguaje ofensivo o inapropiado",
  "Spam o contenido irrelevante",
];

interface ReportModalProps {
  isOpen: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
}

export function ReportModal({
  isOpen,
  loading = false,
  onClose,
  onConfirm,
}: ReportModalProps) {
  const [motivoSeleccionado, setMotivoSeleccionado] = useState<string>(
    MOTIVOS_SUGERIDOS[0],
  );
  const [detalleExtra, setDetalleExtra] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const extra = detalleExtra.trim();
    const motivoFinal = extra
      ? motivoSeleccionado
        ? `${motivoSeleccionado}: ${extra}`
        : extra
      : motivoSeleccionado || "Contenido inapropiado o spoiler";
    onConfirm(motivoFinal);
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <form
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="modal-header">
          <p className="eyebrow">Moderación</p>
          <h3 id="report-modal-title">Denunciar reseña</h3>
          <p className="modal-subtitle">
            Indicá el motivo por el cual considerás que esta reseña debe ser
            revisada por un administrador.
          </p>
        </div>

        <div className="modal-reason-chips">
          {MOTIVOS_SUGERIDOS.map((opcion) => {
            const activo = motivoSeleccionado === opcion;
            return (
              <button
                key={opcion}
                type="button"
                className={`modal-chip ${activo ? "active" : ""}`}
                onClick={() => setMotivoSeleccionado(opcion)}
                disabled={loading}
              >
                {opcion}
              </button>
            );
          })}
          <button
            type="button"
            className={`modal-chip ${motivoSeleccionado === "" ? "active" : ""}`}
            onClick={() => setMotivoSeleccionado("")}
            disabled={loading}
          >
            Otro motivo
          </button>
        </div>

        <div className="modal-field">
          <label htmlFor="report-detail-input">
            Detalle adicional (opcional)
          </label>
          <textarea
            id="report-detail-input"
            className="review-textarea"
            rows={3}
            placeholder="Escribí más detalles si querés aclarar el motivo..."
            value={detalleExtra}
            onChange={(e) => setDetalleExtra(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="primary" disabled={loading}>
            {loading ? "Enviando..." : "Enviar denuncia"}
          </button>
        </div>
      </form>
    </div>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Eliminar",
  loading = false,
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <p className="eyebrow">Confirmación</p>
          <h3>{title}</h3>
          <p className="modal-subtitle">{message}</p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="primary"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Procesando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
