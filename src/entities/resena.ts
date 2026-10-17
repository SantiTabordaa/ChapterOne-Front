import type { Lectura } from "./lectura";

export interface Resena {
  idResena: number;
  contenido?: string | null;
  puntaje: number;
  fechaResena: string;
  idLectura?: number;
  idLibro?: number;
  tituloLibro?: string;
  idUsuario?: number;
  username?: string;
  nombreUsuario?: string;
  apellidoUsuario?: string;
  urlFotoPerfil?: string | null;
  lectura?: Lectura;
}

export interface ResenaInput {
  idLibro?: number;
  idLectura?: number;
  puntaje: number;
  contenido?: string;
  fechaResena?: string;
}
