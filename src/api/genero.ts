import { apiGet } from "./client";
import type { GeneroListado } from "../entities/generoListado";

export async function fetchGeneros(): Promise<GeneroListado[]> {
  return apiGet<GeneroListado[]>("/generos");
}
