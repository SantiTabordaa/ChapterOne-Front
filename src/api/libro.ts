import { Libro } from "../entities";
import { apiGet } from "./client";

export async function fetchLibroById(id: number): Promise<Libro> {
  return apiGet<Libro>(`/libros/${id}`);
}

export async function fetchLibros(): Promise<Libro[]> {
  return apiGet<Libro[]>(`/libros`);
}

export async function fetchLibrosRecomendados(
  cantidad: number = 5,
): Promise<Libro[]> {
  return apiGet<Libro[]>(`/libros/recomendados?limite=${cantidad}`);
}
