import type { Libro } from "./libro";

export interface Autor {
  idAutor: number;
  nombre: string;
  apellido: string;
  pseudonimo?: string | null;
  nacionalidad?: string | null;
  urlFoto?: string | null;
  libros?: Libro[];
}
