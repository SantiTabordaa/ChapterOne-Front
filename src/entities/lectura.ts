import type { Libro } from "./libro";
import type { Resena } from "./resena";
import type { Usuario } from "./usuario";

export type EstadoLectura = "quiero leer" | "leyendo" | "leido";

export interface Lectura {
  idLectura: number;
  idUsuario?: number;
  username?: string;
  usuario?: Usuario;
  libro: Libro;
  estado: EstadoLectura | string;
  fechaIni?: string | null;
  fechaFin?: string | null;
  resena?: Resena | null;
}
