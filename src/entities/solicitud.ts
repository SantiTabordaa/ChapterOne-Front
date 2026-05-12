import type { Club } from "./club";
import type { Usuario } from "./usuario";

export interface Solicitud {
  idSolicitud: number;
  estado: string;
  fechaSolicitud?: string | null;
  fechaUnion?: string | null;
  rol?: string | null;
  usuario: Usuario;
  club: Club;
}
