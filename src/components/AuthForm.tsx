import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
import { LoginRequest, RegisterRequest } from "../api/auth.ts";
import { jwtDecode, JwtPayload } from "jwt-decode";
import "./AuthForm.css";

interface AuthFormProps {
  type: "login" | "register";
}
interface CustomJwtPayload extends JwtPayload {
  uid?: number;
  rol?: string;
  urlFotoPerfil?: string;
}

const passwordValida = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return regex.test(password);
};

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const guardarSesionYRedirigir = (token: string, persistir: boolean) => {
    const decodedData = jwtDecode<CustomJwtPayload>(token);
    const storage = persistir ? localStorage : sessionStorage;
    const foto =
      decodedData.urlFotoPerfil &&
      decodedData.urlFotoPerfil !== "noPhotoSelected"
        ? decodedData.urlFotoPerfil
        : "";

    storage.setItem("token", token);
    storage.setItem("urlFotoPerfil", foto);
    storage.setItem("username", decodedData.sub || "");
    if (decodedData.uid != null) {
      storage.setItem("uid", String(decodedData.uid));
    }
    if (decodedData.rol) {
      storage.setItem("rol", decodedData.rol);
    }
    window.location.href = "/";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (type === "login") {
      try {
        const response = await LoginRequest({ username, password });
        guardarSesionYRedirigir(response.token, rememberMe);
        return;
      } catch (error: any) {
        setErrorMessage(error.message);
      }
    }

    if (type === "register") {
      if (!passwordValida(password)) {
        setErrorMessage(
          "La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula y una minúscula.",
        );
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Las contraseñas ingresadas no coinciden.");
        return;
      }
      try {
        const registerRes = await RegisterRequest({
          nombre,
          apellido,
          username,
          password,
          email,
          profileImage,
        });
        const token =
          registerRes?.token ||
          (await LoginRequest({ username, password })).token;
        guardarSesionYRedirigir(token, rememberMe);
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
            type="text"
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
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            required
          />
          {type === "register" && (
            <>
              <p className="password-hint">
                Mínimo 8 caracteres, al menos una mayúscula y una minúscula.
              </p>
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                required
              />
            </>
          )}
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
          <div className="auth-error-alert" role="alert">
            <strong>Error: </strong>
            <span>{errorMessage}</span>
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
