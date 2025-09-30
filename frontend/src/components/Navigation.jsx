import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../api/services';

function Navigation() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [location]);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authService.getProfile();
        setCurrentUser(response.data);
      } catch (error) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="nav-links">
          <Link to="/" className="nav-link">Inicio</Link>
          
          {currentUser ? (
            <>
              <Link to="/create" className="nav-link">Crear</Link>
              <span className="nav-link" style={{color: '#0077b5'}}>
                {currentUser.nombre_usuario}
              </span>
              <button 
                className="nav-link" 
                onClick={handleLogout}
                style={{border: 'none', background: 'transparent', color: '#b0b0b0', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit'}}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Iniciar Sesión</Link>
              <Link to="/register" className="nav-link">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;