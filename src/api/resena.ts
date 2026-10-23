import type { Resena, ResenaInput } from "../entities/resena";
import { apiDelete, apiGet, apiPost, apiPut } from "./client";

export async function fetchResenas(): Promise<Resena[]> {
  return apiGet<Resena[]>("/resenas");
}

export async function fetchResenasPorLibro(idLibro: number): Promise<Resena[]> {
  return apiGet<Resena[]>(`/resenas/libro/${idLibro}`);
}

export async function crearResena(input: ResenaInput): Promise<Resena> {
  return apiPost<Resena>("/resenas", input);
}

export async function actualizarResena(
  idResena: number,
  input: ResenaInput,
): Promise<Resena> {
  return apiPut<Resena>(`/resenas/${idResena}`, input);
}

export async function eliminarResena(idResena: number): Promise<void> {
  return apiDelete(`/resenas/${idResena}`);
}

export async function denunciarResena(
  idResena: number,
  motivo?: string,
): Promise<Resena> {
  return apiPost<Resena>(`/resenas/${idResena}/denunciar`, { motivo });
}

export async function desestimarDenunciaResena(
  idResena: number,
): Promise<Resena> {
  return apiPut<Resena>(`/resenas/${idResena}/desestimar-denuncia`, {});
}
