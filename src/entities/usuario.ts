import type { Solicitud } from "./solicitud";

export interface Usuario {
  idUsuario: number;
  nombre?: string | null;
  apellido?: string | null;
  email: string;
  urlFotoPerfil?: string | null;
  admin: boolean;
  username: string;
  password: string;
  solicitudes?: Solicitud[];
}
