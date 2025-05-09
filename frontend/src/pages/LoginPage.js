import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('users/login/', { username, password });
      login(res.data.access);
      navigate('/tasks');
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2 className="auth-title">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="text" placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} required className="auth-input" />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required className="auth-input" />
          <button type="submit" className="auth-btn-main">Entrar</button>
          {error && <div className="auth-msg-error">{error}</div>}
        </form>
        <div className="auth-links">
          <a href="/password-reset">¿Olvidaste tu contraseña?</a>
          <a href="/register">¿No tienes cuenta? Regístrate aquí</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
