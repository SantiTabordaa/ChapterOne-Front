import { apiGet } from "./client";
import type { Libro } from "../entities/libro";

export async function fetchLibros(): Promise<Libro[]> {
  return apiGet<Libro[]>("/libros");
}
