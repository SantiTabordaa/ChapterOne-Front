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
  const formData = new FormData();

  if (data.nombre) formData.append("nombre", data.nombre);
  formData.append("apellido", data.apellido);
  formData.append("email", data.email);
  formData.append("username", data.username);
  formData.append("password", data.password);

  if (data.profileImage) {
    formData.append("profileImage", data.profileImage);
  }

  const response = await fetch(`${BACKEND_BASE}/api/auth/register`, {
    method: "POST",
    // headers: { "Content-Type": "multipart/form-data" },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    const errorMessage =
      errorData?.message || `Ocurrió un error: ${response.status}`;

    throw new Error(errorMessage);
  }

  const text = await response.json();
  console.log("Server response", text);
  return text;
}
