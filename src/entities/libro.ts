import type { Autor } from "./autor";
import type { Genero } from "./genero";
import type { HistorialClub } from "./historialClub";
import type { Saga } from "./saga";

export interface Libro {
  idLibro: number;
  titulo: string;
  sinopsis?: string | null;
  saga?: Saga | null;
  nroTomo?: number | null;
  cantPag?: number | null;
  valoracion?: number | null;
  autores?: Autor[];
  generos?: Genero[];
  historialesLibro?: HistorialClub[];
}
