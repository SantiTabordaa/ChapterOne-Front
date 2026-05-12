import type { Club } from "./club";
import type { Libro } from "./libro";

export interface HistorialClub {
  idHistorial: number;
  club?: Club | null;
  libro?: Libro | null;
  mesAnio: string;
}
