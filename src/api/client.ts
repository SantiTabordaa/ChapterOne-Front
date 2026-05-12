const API_BASE = "http://localhost:8080/api";

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} al pedir ${path}`);
  }
  return (await response.json()) as T;
}
