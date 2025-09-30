import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/services';

function Register() {
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    contrasena: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.contrasena !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await authService.register({
        nombre_usuario: formData.nombre_usuario,
        contrasena: formData.contrasena
      });
      
      navigate('/login', { 
        state: { message: 'Registro exitoso. Ahora inicie sesión.' } 
      });
    } catch (error) {
      if (error.response?.status === 400) {
        setError('El usuario ya existe. Intente con otro nombre de usuario.');
      } else {
        setError('Error en el registro. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-card">
          <h1 className="form-title">Registrarse</h1>
          <p className="form-subtitle">Cree una nueva cuenta</p>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nombre de Usuario</label>
              <input
                type="text"
                name="nombre_usuario"
                value={formData.nombre_usuario}
                onChange={handleChange}
                required
                minLength={3}
                className="form-input"
                placeholder="Ingrese un nombre de usuario"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                required
                minLength={6}
                className="form-input"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Repita la contraseña"
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
              >
                {loading && <span className="loading-spinner"></span>}
                {loading ? 'Registrando...' : 'Registrarse'}
              </button>
            </div>
          </form>

          <div className="form-link">
            <span>¿Ya tiene cuenta? </span>
            <Link to="/login">Inicie Sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;