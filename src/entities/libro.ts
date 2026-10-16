import type { Autor } from "./autor";

export interface Libro {
  idLibro: number;
  titulo: string;
  sinopsis?: string | null;
  saga?: string | null;
  nroTomo?: number | null;
  cantPag?: number | null;
  urlPortada?: string | null;
  valoracion?: number | null;
  autores?: Autor[];
  generos?: string[];
}
