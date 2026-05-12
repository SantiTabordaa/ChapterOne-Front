import type { Club } from "./club";
import type { Libro } from "./libro";

export interface Genero {
  idGenero: number;
  nombreGen: string;
  clubes?: Club[];
  libros?: Libro[];
}
