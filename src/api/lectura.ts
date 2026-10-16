import type { EstadoLectura, Lectura } from "../entities/lectura";
import { apiDelete, apiGet, apiGetOptional, apiPost, apiPut } from "./client";

export async function fetchMisLecturas(): Promise<Lectura[]> {
  return apiGet<Lectura[]>("/lecturas/mis-lecturas");
}

export async function fetchMiLecturaPorLibro(
  idLibro: number,
): Promise<Lectura | null> {
  return apiGetOptional<Lectura>(`/lecturas/libro/${idLibro}`);
}

export async function guardarEnReadlist(
  idLibro: number,
  estado: EstadoLectura,
): Promise<Lectura> {
  return apiPost<Lectura>("/lecturas", { idLibro, estado });
}

export async function actualizarEstadoLectura(
  idLectura: number,
  estado: EstadoLectura,
): Promise<Lectura> {
  return apiPut<Lectura>(`/lecturas/${idLectura}`, { estado });
}

export async function eliminarDeReadlist(idLectura: number): Promise<void> {
  return apiDelete(`/lecturas/${idLectura}`);
}
