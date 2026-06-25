import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
import { LoginRequest, RegisterRequest } from "../api/auth.ts";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface AuthFormProps {
  type: "login" | "register";
}
interface CustomJwtPayload extends JwtPayload {
  urlFotoPerfil: string;
  admin?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //agregar bloque try catch

    if (type === "login") {
      try {
        const response = await LoginRequest({ username, password });
        const token = response.token;
        const decodedData = jwtDecode<CustomJwtPayload>(token);
        //DEBUG
        console.log(decodedData);
        // Handle "Remember Me" for login
        if (rememberMe) {
          localStorage.setItem("token", token);
          localStorage.setItem("urlFotoPerfil", decodedData.urlFotoPerfil);
          localStorage.setItem("username", decodedData.sub || "");
        } else {
          sessionStorage.setItem("token", token);
        }
        return;
      } catch (error: any) {
        setErrorMessage(error.message);
      }
    }

    if (type === "register") {
      try {
        await RegisterRequest({
          nombre,
          apellido,
          username,
          password,
          email,
          profileImage,
        });
        window.location.href = "/login";
        return;
      } catch (error: any) {
        setErrorMessage(error.message);
      }
    }
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
            <label>Foto de Perfil (hasta 5MB)</label>
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

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{errorMessage}</span>
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
