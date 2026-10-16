import type { Solicitud } from "./solicitud";

export type RolUsuario = "user" | "admin" | "moderator";

export interface Usuario {
  idUsuario: number;
  nombre?: string | null;
  apellido?: string | null;
  email: string;
  urlFotoPerfil?: string | null;
  rol: RolUsuario | string;
  username: string;
  solicitudes?: Solicitud[];
}
