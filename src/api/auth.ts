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
  // 1. Creamos el FormData
  const formData = new FormData();

  // 2. Agregamos los campos de texto
  // (Asegúrate de agregar todos los campos que espera tu backend)
  if (data.nombre) formData.append("nombre", data.nombre);
  formData.append("apellido", data.apellido);
  formData.append("email", data.email);
  formData.append("username", data.username);
  formData.append("password", data.password);

  // 3. Agregamos el archivo (si existe)
  // OJO: El nombre "file" o "profilePicture" debe coincidir EXACTAMENTE
  // con lo que espera tu @RequestParam en Spring Boot.
  if (data.profileImage) {
    formData.append("profileImage", data.profileImage);
  }

  const response = await fetch(`${BACKEND_BASE}/api/auth/register`, {
    method: "POST",
    // headers: { "Content-Type": "multipart/form-data" },
    body: formData,
  });
  console.log(`DEBUG: ${data}`);

  if (!response.ok) {
    throw new Error(`GUARDA WACHIN REGISTRO: ${response.status}`);
  }

  const text = await response.json();
  console.log("Server response", text);
  return text;
}
