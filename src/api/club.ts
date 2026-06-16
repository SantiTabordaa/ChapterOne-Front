import { apiGet } from "./client";
import type { Club } from "../entities/club";

interface ClubListado {
  id_club: number;
  nombre_club: string;
  descripcion?: string | null;
  genero?: string | null;
  cantidad_integrantes: number;
  es_privado: boolean;
}

export async function fetchClubes(): Promise<Club[]> {
  return apiGet<Club[]>(`/clubes`);
}

export async function fetchClubById(id: number): Promise<Club> {
  return apiGet<Club>(`/clubes/${id}`);
}

export async function fetchClubesListado(): Promise<ClubListado[]> {
  return apiGet<ClubListado[]>(`/clubes/listado`);
}
