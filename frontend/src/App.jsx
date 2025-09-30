import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import PostDetail from './components/postDetail';
import './App.css';

// Router protegido por Auth
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          {/* Publico - Lista de Publicaciones */}
          <Route path="/" element={<PostList />} />
          
          {/* Publico - Publicación específica */}
          <Route path="/post/:id" element={<PostDetail />} />
          
          {/* Publico - Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Router protegido - Solo usuarios autenticados */}
          <Route 
            path="/create" 
            element={
              <ProtectedRoute>
                <PostForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit/:id" 
            element={
              <ProtectedRoute>
                <PostForm />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;