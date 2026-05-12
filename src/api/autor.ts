import { apiGet } from "./client";
import type { AutorListado } from "../entities/autorListado";

export async function fetchAutoresListado(): Promise<AutorListado[]> {
  return apiGet<AutorListado[]>("/autores/listado");
}
