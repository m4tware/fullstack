import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService, authService } from '../api/services';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    checkAuth();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postService.getAll();
      setPosts(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const profile = await authService.getProfile();
        setCurrentUser(profile.data);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  };

  const deletePost = async (postId) => {
    if (window.confirm('¿Eliminar publicación?')) {
      try {
        await postService.delete(postId);
        fetchPosts();
      } catch (error) {
        alert('Error eliminando');
      }
    }
  };

  const getAuthorName = (post) => {
    if (currentUser && currentUser.id === post.usuario_id) return 'Tú';
    return post.autor?.nombre_usuario || `Usuario ${post.usuario_id}`;
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{textAlign: 'center', color: '#888'}}>Cargando...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="blog-header">
        <h1 className="blog-title">Blog</h1>
        <p className="blog-subtitle">Comparta sus ideas</p>
        {currentUser && (
          <button 
            className="btn-create"
            onClick={() => navigate('/create')}
          >
            Crear Publicación
          </button>
        )}
      </div>

      {/* Contenido */}
      <div className="container">
        {posts.length === 0 ? (
          <div className="empty-state">
            <h3>No hay publicaciones</h3>
            <p>Sea el primero en compartir</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map(post => {
              const isAuthor = currentUser && currentUser.id === post.usuario_id;
              const authorName = getAuthorName(post);
              
              return (
                <div key={post.id} className="post-card">
                  {/* Autor */}
                  <div className="author-info">
                    <div className="author-avatar">
                      {getInitial(authorName)}
                    </div>
                    <div className="author-name">{authorName}</div>
                    {isAuthor && <div className="author-badge">Tú</div>}
                  </div>

                  {/* Título */}
                  <h3 
                    className="post-title"
                    style={{cursor: 'pointer'}}
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    {post.titulo}
                  </h3>
                  
                  {/* Contenido */}
                  <div className="post-content">{post.contenido}</div>
                  
                  {/* Fecha de Creación */}
                  <div className="post-date">
                    {new Date(post.fecha_creacion).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>

                  {/* Acciones */}
                  {isAuthor && (
                    <div className="actions">
                      <button 
                        className="btn-action"
                        onClick={() => navigate(`/edit/${post.id}`)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-action"
                        onClick={() => deletePost(post.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostList;