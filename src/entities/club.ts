import type { Genero } from "./genero";
import type { HistorialClub } from "./historialClub";
import type { Libro } from "./libro";
import type { PosteoClub } from "./posteoClub";
import type { Solicitud } from "./solicitud";
import type { Usuario } from "./usuario";

export interface Club {
  idClub: number;
  nombreClub: string;
  descrip?: string | null;
  genero?: Genero | null;
  admin?: Usuario | null;
  privado: boolean;
  cantidadUsuarios: number;
  libroMes?: Libro | null;
  mesAnio?: string | null;
  posteos?: PosteoClub[];
  historialesClub?: HistorialClub[];
  solicitudes?: Solicitud[];
}
