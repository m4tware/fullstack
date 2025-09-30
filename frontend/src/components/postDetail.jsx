import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postService } from '../api/services';

function PostDetail() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postService.getById(id);
      if (response.data && response.data.length > 0) {
        setPost(response.data[0]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{textAlign: 'center', color: '#888'}}>Cargando publicación...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Publicación no encontrada</h3>
          <p>La publicación que busca no existe</p>
          <Link to="/" className="nav-link">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{marginBottom: '2rem'}}>
        <Link to="/" className="nav-link" style={{display: 'inline-block', marginBottom: '1rem'}}>
          ← Volver al inicio
        </Link>
      </div>

      <div className="post-card" style={{maxWidth: '800px', margin: '0 auto'}}>
        {/* Autor */}
        <div className="author-info">
          <div className="author-avatar">
            {post.autor?.nombre_usuario?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="author-name">
            {post.autor?.nombre_usuario || `Usuario ${post.usuario_id}`}
          </div>
        </div>

        {/* Título */}
        <h1 className="post-title" style={{fontSize: '1.8rem', marginBottom: '1.5rem'}}>
          {post.titulo}
        </h1>

        {/* Contenido completo */}
        <div className="post-content" style={{
          fontSize: '1.1rem',
          lineHeight: '1.7',
          whiteSpace: 'pre-wrap'
        }}>
          {post.contenido}
        </div>

        {/* Fecha */}
        <div className="post-date" style={{marginTop: '2rem'}}>
          Publicado el {new Date(post.fecha_creacion).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;