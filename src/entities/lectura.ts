import type { Libro } from "./libro";
import type { Resena } from "./resena";

export type EstadoLectura = "quiero leer" | "leyendo" | "leido";

export interface Lectura {
  idLectura: number;
  idUsuario: number;
  username: string;
  libro: Libro;
  estado: EstadoLectura | string;
  fechaIni?: string | null;
  fechaFin?: string | null;
  resena?: Resena | null;
}
