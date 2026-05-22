// src/pages/PasswordRecoveryPage.tsx
import React, { useState } from 'react';
import '../components/AuthForm.css'; // Reusing styles

const PasswordRecoveryPage: React.FC = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Password recovery requested for:', email);
        // Here you would make an API call to your backend
        alert('Si el correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.');
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Recuperar Contraseña</h2>
                <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '2rem' }}>
                    Ingresa tu correo y te enviaremos un enlace para restablecer la contraseña.
                </p>
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
                <button type="submit" className="primary auth-button">Enviar Enlace</button>
                 <div className="form-footer">
                    <a href="/login">Volver a Iniciar Sesión</a>
                </div>
            </form>
        </div>
    );
};

export default PasswordRecoveryPage;
