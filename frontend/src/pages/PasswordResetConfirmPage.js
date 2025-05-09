import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const PasswordResetConfirmPage = () => {
  const { uidb64, token } = useParams();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    try {
      await api.post('users/password_reset_confirm/', {
        uidb64,
        token,
        new_password: password
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('No se pudo cambiar la contraseña. El enlace puede haber expirado.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2 className="auth-title">Nueva contraseña</h2>
        {success ? (
          <div className="auth-msg-success">¡Contraseña cambiada! Redirigiendo al login...</div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="auth-input"
            />
            <input
              type="password"
              placeholder="Repetir nueva contraseña"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
              required
              className="auth-input"
            />
            <button type="submit" className="auth-btn-main">Cambiar contraseña</button>
            {error && <div className="auth-msg-error">{error}</div>}
          </form>
        )}
      </div>
    </div>
  );
};

export default PasswordResetConfirmPage;
