import { apiGet } from "./client";
import type { Genero } from "../entities/genero";

export async function fetchGeneros(): Promise<Genero[]> {
  return apiGet<Genero[]>("/generos");
}
