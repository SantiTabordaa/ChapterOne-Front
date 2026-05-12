import type { Libro } from "./libro";
import type { Resena } from "./resena";
import type { Usuario } from "./usuario";

export interface Lectura {
  idLectura: number;
  usuario: Usuario;
  libro: Libro;
  estado: string;
  fechaIni?: string | null;
  fechaFin?: string | null;
  resena?: Resena | null;
}
