import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '', first_name: '', last_name: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('users/register/', form);
      navigate('/login');
    } catch (err) {
      setError('Error al registrar. Verifica los datos.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2 className="auth-title">Registro</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input name="username" placeholder="Usuario" value={form.username} onChange={handleChange} required className="auth-input" />
          <input name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} required className="auth-input" />
          <input name="first_name" placeholder="Nombre" value={form.first_name} onChange={handleChange} className="auth-input" />
          <input name="last_name" placeholder="Apellido" value={form.last_name} onChange={handleChange} className="auth-input" />
          <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required className="auth-input" />
          <input name="password2" type="password" placeholder="Repetir Contraseña" value={form.password2} onChange={handleChange} required className="auth-input" />
          <button type="submit" className="auth-btn-main">Registrar</button>
          {error && <div className="auth-msg-error">{error}</div>}
        </form>
        <div className="auth-links">
          <a href="/login">¿Ya tienes cuenta? Inicia sesión</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
