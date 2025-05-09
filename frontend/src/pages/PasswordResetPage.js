import React, { useState } from 'react';
import api from '../services/api';

const PasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('users/password_reset/', { email });
      setSent(true);
    } catch (err) {
      setError('No se pudo enviar el correo. Verifica el email.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2 className="auth-title">Recuperar contraseña</h2>
        {sent ? (
          <div className="auth-msg-success">Si el correo existe, recibirás instrucciones para restablecer tu contraseña.</div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <input type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} required className="auth-input" />
            <button type="submit" className="auth-btn-main">Enviar</button>
            {error && <div className="auth-msg-error">{error}</div>}
          </form>
        )}
        <div className="auth-links">
          <a href="/login">Volver a iniciar sesión</a>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
