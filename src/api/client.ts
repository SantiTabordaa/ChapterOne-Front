const BACKEND_BASE = "http://localhost:8080";
const API_BASE = `${BACKEND_BASE}/api`;

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} al pedir ${path}`);
  }
  return (await response.json()) as T;
}

export function assetUrl(path?: string | null): string | null {
  if (!path) {
    return null;
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${BACKEND_BASE}${path}`;
}
