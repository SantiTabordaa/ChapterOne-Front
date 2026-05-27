import { apiGet } from "./client";
import type { Club } from "../entities/club";

export async function fetchClubes(): Promise<Club[]> {
  return apiGet<Club[]>(`/clubes`);
}

export async function fetchClubById(id: number): Promise<Club> {
  return apiGet<Club>(`/clubes/${id}`);
}
