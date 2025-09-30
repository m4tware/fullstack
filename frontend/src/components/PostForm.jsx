import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../api/services';

function PostForm() {
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postService.getById(id);
      
      if (response.data && response.data.length > 0) {
        const post = response.data[0];
        setFormData({
          titulo: post.titulo,
          contenido: post.contenido
        });
      } else {
        setError('Publicación no encontrada');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Error al cargar la publicación');
    } finally {
      setLoading(false);
    }
  };

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

    if (!formData.titulo.trim() || !formData.contenido.trim()) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        await postService.update(id, {
          titulo: formData.titulo,
          contenido: formData.contenido
        });
      } else {
        await postService.create({
          titulo: formData.titulo,
          contenido: formData.contenido
        });
      }
      
      navigate('/');
    } catch (error) {
      console.error('Error saving post:', error);
      
      if (error.response?.status === 403) {
        setError('No tiene permiso para realizar esta acción');
      } else if (error.response?.status === 404) {
        setError('Publicación no encontrada');
      } else {
        setError(`Error al ${isEditing ? 'actualizar' : 'crear'} la publicación`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading && isEditing) {
    return (
      <div className="container">
        <div style={{textAlign: 'center', color: '#666666'}}>Cargando publicación...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-card">
          <h1 className="form-title">
            {isEditing ? 'Editar Publicación' : 'Crear Publicación'}
          </h1>
          <p className="form-subtitle">
            {isEditing ? 'Reformule sus ideas' : 'Comparta sus ideas'}
          </p>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Título</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Ingrese el título de la publicación"
                maxLength={30}
              />
              {/*<div className="form-text">Máximo 40 caracteres</div>*/}
            </div>

            <div className="form-group">
              <label className="form-label">Contenido</label>
              <textarea
                name="contenido"
                value={formData.contenido}
                onChange={handleChange}
                required
                className="form-input form-textarea"
                placeholder="¿Que tiene por contar?"
                rows={8}
                maxLength={50}
              />
            </div>

            <div className="form-actions">
              <button 
                type="button"
                className="btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
              >
                {loading && <span className="loading-spinner"></span>}
                {loading ? (isEditing ? 'Actualizando...' : 'Creando...') : (isEditing ? 'Actualizar' : 'Publicar')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostForm;