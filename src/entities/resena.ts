import type { Lectura } from "./lectura";

export interface Resena {
  idResena: number;
  contenido: string;
  puntaje: number;
  fechaResena: string;
  lectura: Lectura;
}
