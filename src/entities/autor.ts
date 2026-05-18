import type { Libro } from "./libro";

export interface Autor {
  idAutor: number;
  nombre: string;
  apellido: string;
  pseudonimo?: string | null;
  nacionalidad?: string | null;
  fechaNacimiento?: string | null;
  fechaFallecimiento?: string | null;
  resumen?: string | null;
  urlFoto?: string | null;
  libros?: Libro[];
  lugarNacimiento?: string | null;
  lugarFallecimiento?: string | null;
}
