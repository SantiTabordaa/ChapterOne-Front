const BACKEND_BASE = "http://localhost:8080";
const API_BASE = `${BACKEND_BASE}/api`;

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} al pedir ${path}`);
  }
  return (await response.json()) as T;
}

export function assetUrl(path?: string | null): string | undefined {
  if (!path) {
    return undefined;
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  // Normalize backslashes to forward slashes and ensure leading slash
  let p = path.replace(/\\\\/g, "/").replace(/\\/g, "/");
  if (!p.startsWith("/")) p = "/" + p;
  // Collapse duplicate slashes
  p = p.replace(/\/\/+/, "/");
  return `${BACKEND_BASE}${p}`;
}
