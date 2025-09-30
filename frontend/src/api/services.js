import api from './api';

export const authService = {
    login: (formData) => api.post('/usuario/inicio-sesion', formData),
    register: (userData) => api.post('/usuario/registro', userData),
    getProfile: () => api.get('/usuario/perfil')
};

export const postService = {
    getAll: () => api.get('/publicaciones/'),
    getById: (id) => api.get(`/publicaciones/post/?id=${id}`),
    create: (postData) => api.post('/publicaciones/', postData),
    update: (id, postData) => api.put(`/publicaciones/${id}`, postData),
    delete: (id) => api.delete(`/publicaciones/${id}`)
  }