import React, { useState } from 'react';
import './AuthForm.css';
import ImageUploader from './ImageUploader';

interface AuthFormProps {
  type: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    if (type === 'register') {
      formData.append('name', name);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
    } else {
      // Handle "Remember Me" for login
      if (rememberMe) {
        // Logic to save credentials, e.g., in localStorage
        localStorage.setItem('rememberedUser', email);
      } else {
        localStorage.removeItem('rememberedUser');
      }
    }

    console.log('Form data:', Object.fromEntries(formData.entries()));
    // Here you would typically make an API call to your backend
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{type === 'login' ? 'Bienvenido' : 'Crea tu Cuenta'}</h2>

        {type === 'register' && (
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        {type === 'register' && (
          <div className="form-group">
            <label>Foto de Perfil</label>
            <ImageUploader onImageUpload={setProfileImage} />
          </div>
        )}

        {type === 'login' && (
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
          {type === 'login' ? 'Entrar' : 'Registrarse'}
        </button>

        <div className="form-footer">
          {type === 'login' ? (
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
