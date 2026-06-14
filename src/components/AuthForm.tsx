import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
import { LoginRequest, RegisterRequest } from "../api/auth.ts";

interface AuthFormProps {
  type: "login" | "register";
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "login") {
      await LoginRequest({ username, password });
      // Handle "Remember Me" for login
      if (rememberMe) {
        localStorage.setItem("rememberedUser", email);
      } else {
        localStorage.removeItem("rememberedUser");
      }
      return;
    }

    if (type === "register") {
      await RegisterRequest({
        nombre,
        apellido,
        username,
        password,
        email,
        profileImage,
      });
      return;
    }

    const formData = new FormData();
    if (type === "register") {
      formData.append("nombre", nombre);
      formData.append("apellido", apellido);
      formData.append("email", email);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }
    }

    console.log("Form data:", Object.fromEntries(formData.entries()));
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{type === "login" ? "Bienvenido" : "Crea tu Cuenta"}</h2>

        {type === "register" && (
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {type === "register" && (
          <div className="form-group">
            <label>Foto de Perfil</label>
            <ImageUploader onImageUpload={setProfileImage} />
          </div>
        )}

        {type === "login" && (
          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Recuérdame</label>
          </div>
        )}

        <button type="submit" className="primary auth-button">
          {type === "login" ? "Entrar" : "Registrarse"}
        </button>

        <div className="form-footer">
          {type === "login" ? (
            <>
              <p>
                ¿No tienes una cuenta? <a href="/register">Regístrate</a>
              </p>
              <a href="/password-recovery">¿Olvidaste tu contraseña?</a>
            </>
          ) : (
            <p>
              ¿Ya tienes una cuenta? <a href="/login">Inicia Sesión</a>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
