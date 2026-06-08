const BACKEND_BASE = "http://localhost:8080";

type LoginRequest = {
  username: string;
  password: string;
};

export async function LoginRequest(data: LoginRequest) {
  const response = await fetch(`${BACKEND_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`GUARDA WACHIN: ${response.status}`);
  }

  const text = await response.json();
  console.log("Server response", text);
  return text;
}
