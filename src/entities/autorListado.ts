export interface AutorListado {
  id_autor: number;
  nombre: string;
  apellido: string;
  pseudonimo?: string | null;
  nacionalidad?: string | null;
  url_foto?: string | null;
}
