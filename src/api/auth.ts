const BACKEND_BASE = "http://localhost:8080";

type LoginRequest = {
  username: string;
  password: string;
};
type RegisterRequest = {
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  password: string;
  profileImage: File | null;
};

export async function LoginRequest(data: LoginRequest) {
  const response = await fetch(`${BACKEND_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`GUARDA WACHIN LOGIN: ${response.status}`);
  }

  const text = await response.json();
  console.log("Server response", text);
  return text;
}

export async function RegisterRequest(data: RegisterRequest) {
  const response = await fetch(`${BACKEND_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  console.log(`DEBUG: ${data}`);

  if (!response.ok) {
    throw new Error(`GUARDA WACHIN REGISTRO: ${response.status}`);
  }

  const text = await response.json();
  console.log("Server response", text);
  return text;
}
