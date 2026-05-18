import { apiGet } from "./client";
import type { AutorListado } from "../entities/autorListado";
import type { Autor } from "../entities/autor";
import type { Libro } from "../entities/libro";

export async function fetchAutoresListado(): Promise<AutorListado[]> {
  return apiGet<AutorListado[]>("/autores/listado");
}

// Mapea DTO del backend (snake_case o camelCase) al tipo Autor del frontend
function mapAutorDto(dto: any): Autor {
  return {
    idAutor: dto.id_autor ?? dto.idAutor,
    nombre: dto.nombre,
    apellido: dto.apellido,
    pseudonimo: dto.pseudonimo ?? dto.pseudonimo ?? null,
    nacionalidad: dto.nacionalidad ?? dto.nacionalidad ?? null,
    fechaNacimiento: dto.fechaNacimiento ?? dto.fecha_nacimiento ?? null,
    fechaFallecimiento:
      dto.fechaFallecimiento ?? dto.fecha_fallecimiento ?? null,
    resumen: dto.resumen ?? null,
    urlFoto: dto.url_foto ?? dto.urlFoto ?? null,
    lugarNacimiento: dto.lugarNacimiento || dto.lugar_nacimiento || null,
    lugarFallecimiento:
      dto.lugarFallecimiento || dto.lugar_fallecimiento || null,
    libros: dto.libros
      ? dto.libros.map(
          (l: any): Libro => ({
            idLibro: l.id_libro ?? l.idLibro,
            titulo: l.titulo,
            sinopsis: l.sinopsis ?? null,
            saga: l.saga
              ? {
                  idSaga: l.saga.id_saga ?? l.saga.idSaga,
                  nombre: l.saga.nombre,
                }
              : undefined,
            nroTomo: l.nro_tomo ?? l.nroTomo ?? null,
            cantPag: l.cant_pag ?? l.cantPag ?? null,
            urlPortada: l.url_portada ?? l.urlPortada ?? null,
            valoracion: l.valoracion ?? null,
            autores: l.autores
              ? l.autores.map((a: any) => ({
                  idAutor: a.id_autor ?? a.idAutor,
                  nombre: a.nombre,
                  apellido: a.apellido,
                }))
              : undefined,
            generos: l.generos
              ? l.generos.map((g: any) => ({
                  idGenero: g.id_genero ?? g.idGenero,
                  nombreGen: g.nombre_gen ?? g.nombreGen,
                }))
              : undefined,
          }),
        )
      : undefined,
  };
}

export async function fetchAutorById(id: number): Promise<Autor> {
  const dto = await apiGet<any>(`/autores/${id}`);
  return mapAutorDto(dto);
}
