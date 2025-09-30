import axios from 'axios';

//USAR EN LOCAL/WEB
//const API_BASE = 'http://localhost:8000';

// USAR EN DOCKER!!
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;