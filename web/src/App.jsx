import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { useAuth } from './hooks/useAuth';
import { Toast } from './components/common/Toast';

function App() {
  const { user, loading } = useAuth();

  // Mientras Supabase verifica si hay usuario, mostramos "Cargando..."
  // para evitar parpadeos o redirecciones falsas.
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Cargando sistema...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Si ya estás logueado y vas al Login, te manda al Dashboard */}
        <Route 
          path="/login" 
          element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
        />
        
        {/* RUTA PROTEGIDA: Si no estás logueado, te manda al Login */}
        <Route 
          path="/dashboard" 
          element={user ? <DashboardPage /> : <Navigate to="/login" replace />} 
        />
        
        {/* Cualquier otra ruta te redirige según tu estado */}
        <Route 
          path="*" 
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
      <Toast />
    </BrowserRouter>
  );
}

export default App;