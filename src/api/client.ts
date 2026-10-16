const BACKEND_BASE = "http://localhost:8080";
const API_BASE = `${BACKEND_BASE}/api`;

export function getAuthToken(): string | null {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

function buildHeaders(extraHeaders?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    ...extraHeaders,
  };
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: buildHeaders(),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} al pedir ${path}`);
  }
  return (await response.json()) as T;
}

export async function apiGetOptional<T>(path: string): Promise<T | null> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: buildHeaders(),
  });
  if (response.status === 204 || response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} al pedir ${path}`);
  }
  return (await response.json()) as T;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} al enviar ${path}`);
  }
  return (await response.json()) as T;
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} al actualizar ${path}`);
  }
  return (await response.json()) as T;
}

export async function apiDelete(path: string): Promise<void> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: buildHeaders(),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} al eliminar ${path}`);
  }
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
