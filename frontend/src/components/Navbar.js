import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {


  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar-taskmaster">
      <div className="navbar-logo">TaskMaster</div>
      <div className="navbar-links">
        <Link to="/kanban">Kanban</Link>
        <Link to="/tasks">Tareas</Link>
        <Link to="/categories">Categorías</Link>
        <Link to="/profile">Perfil</Link>

        <button className="navbar-logout" onClick={handleLogout}>Cerrar sesión</button>
      </div>

    </nav>
  );
};

export default Navbar;
