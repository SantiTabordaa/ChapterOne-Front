import type { Club } from "./club";
import type { Usuario } from "./usuario";

export interface PosteoClub {
  idPosteo: number;
  contenido: string;
  fechaHoraCreacion: string;
  usuario?: Usuario | null;
  club?: Club | null;
}
