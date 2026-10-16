import type { Autor } from "./autor";
import type { Genero } from "./genero";
import type { HistorialClub } from "./historialClub";
import type { Saga } from "./saga";

export interface Libro {
  idLibro: number;
  titulo: string;
  sinopsis?: string | null;
  saga?: Saga | string | null;
  nroTomo?: number | null;
  cantPag?: number | null;
  urlPortada?: string | null;
  valoracion?: number | null;
  autores?: Autor[];
  generos?: (Genero | string)[];
  historialesLibro?: HistorialClub[];
}
