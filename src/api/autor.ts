import { apiGet } from "./client";
import type { AutorListado } from "../entities/autorListado";
import type { Autor } from "../entities/autor";

export async function fetchAutoresListado(): Promise<AutorListado[]> {
  return apiGet<AutorListado[]>("/autores/listado");
}

export async function fetchAutorById(id: number): Promise<Autor> {
  return apiGet<Autor>(`/autores/${id}`);
}
