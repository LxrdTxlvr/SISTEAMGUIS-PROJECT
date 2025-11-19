// ============================================
// EJEMPLOS DE CÓDIGO LISTOS PARA USAR
// Sisteamguis - Copiar y Pegar
// ============================================

// ============================================
// 1. HOOK PARA SINCRONIZACIÓN AUTOMÁTICA
// ============================================
// Archivo: src/hooks/useSyncManager.js

import { useEffect, useState } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { syncService } from '../services/syncService';

export const useSyncManager = () => {
  const isOnline = useNetworkStatus();
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    if (!isOnline) return;

    setSyncStatus('syncing');
    
    syncService.syncPendingChanges()
      .then(() => {
        setSyncStatus('success');
        setLastSync(new Date());
        setTimeout(() => setSyncStatus('idle'), 3000);
      })
      .catch(error => {
        setSyncStatus('error');
        console.error('Sync error:', error);
        setTimeout(() => setSyncStatus('idle'), 5000);
      });
  }, [isOnline]);

  return { syncStatus, lastSync, isOnline };
};

// ============================================
// 2. COMPONENTE DE INDICADOR DE SINCRONIZACIÓN
// ============================================
// Archivo: src/components/common/SyncStatus.jsx

import React from 'react';
import { useSyncManager } from '../../hooks/useSyncManager';
import './SyncStatus.css';

export const SyncStatus = () => {
  const { syncStatus, lastSync, isOnline } = useSyncManager();

  return (
    <div className={`sync-status sync-${syncStatus}`}>
      <div className="sync-indicator">
        {syncStatus === 'syncing' && (
          <span className="spinner">⟳</span>
        )}
        {syncStatus === 'success' && (
          <span className="success">✓</span>
        )}
        {syncStatus === 'error' && (
          <span className="error">✗</span>
        )}
      </div>
      
      <div className="sync-info">
        {!isOnline && <p className="offline">Modo Offline</p>}
        {isOnline && syncStatus === 'syncing' && <p>Sincronizando...</p>}
        {isOnline && syncStatus === 'success' && (
          <p>Última sync: {lastSync?.toLocaleTimeString()}</p>
        )}
        {isOnline && syncStatus === 'error' && <p>Error en sincronización</p>}
      </div>
    </div>
  );
};

// ============================================
// 3. PÁGINA DE LOGIN COMPLETA
// ============================================
// Archivo: src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './LoginPage.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Sisteamguis</h1>
          <p>Gestión de Tianguis</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="btn-login">
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-footer">
          <p>¿No tienes cuenta? Contacta al administrador</p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 4. STORE ZUSTAND PARA PUESTOS
// ============================================
// Archivo: src/store/puestosStore.js

import create from 'zustand';
import { puestosService } from '../services/puestosService';

export const usePuestosStore = create((set) => ({
  puestos: [],
  loading: false,
  error: null,
  filtro: 'todos', // 'todos', 'libres', 'ocupados'

  // Acciones
  fetchPuestos: async (tianguisId) => {
    set({ loading: true });
    try {
      const data = await puestosService.getPuestos(tianguisId);
      set({ puestos: data, error: null });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  updatePuestoEstado: async (puestoId, estado) => {
    try {
      await puestosService.updatePuestoEstado(puestoId, estado);
      set((state) => ({
        puestos: state.puestos.map((p) =>
          p.id === puestoId ? { ...p, estado } : p
        ),
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  setFiltro: (filtro) => set({ filtro }),

  getPuestosFiltrados: (state) => {
    if (state.filtro === 'libres') {
      return state.puestos.filter((p) => p.estado === 'libre');
    } else if (state.filtro === 'ocupados') {
      return state.puestos.filter((p) => p.estado === 'ocupado');
    }
    return state.puestos;
  },
}));

// ============================================
// 5. SERVICIO PARA GUARDAR CAMBIOS OFFLINE
// ============================================
// Archivo: src/services/offlineService.js

const STORE_NAME = 'sisteamguis-offline';

export const offlineService = {
  // Guardar un cambio offline
  saveChange: async (cambio) => {
    try {
      const changes = await offlineService.getChanges();
      changes.push({
        ...cambio,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(STORE_NAME, JSON.stringify(changes));
      return cambio;
    } catch (error) {
      console.error('Error guardando cambio offline:', error);
      throw error;
    }
  },

  // Obtener todos los cambios pendientes
  getChanges: async () => {
    try {
      const data = localStorage.getItem(STORE_NAME);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error obteniendo cambios:', error);
      return [];
    }
  },

  // Eliminar un cambio después de sincronizar
  removeChange: async (changeId) => {
    try {
      const changes = await offlineService.getChanges();
      const filtered = changes.filter((c) => c.id !== changeId);
      localStorage.setItem(STORE_NAME, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removiendo cambio:', error);
      throw error;
    }
  },

  // Limpiar todos los cambios
  clearChanges: async () => {
    try {
      localStorage.removeItem(STORE_NAME);
    } catch (error) {
      console.error('Error limpiando cambios:', error);
      throw error;
    }
  },

  // Contar cambios pendientes
  countChanges: async () => {
    const changes = await offlineService.getChanges();
    return changes.length;
  },
};

// ============================================
// 6. COMPONENTE DE LISTA DE PUESTOS
// ============================================
// Archivo: src/components/sidebar/PuestoListItem.jsx

import React from 'react';
import './PuestoListItem.css';

export const PuestoListItem = ({ puesto, onClick, isSelected }) => {
  const getEstadoIcon = (estado) => {
    return estado === 'ocupado' ? '●' : '○';
  };

  const getEstadoLabel = (estado) => {
    return estado === 'ocupado' ? 'Ocupado' : 'Libre';
  };

  return (
    <div
      className={`puesto-list-item ${puesto.estado} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="puesto-number">#{puesto.numero}</div>
      
      <div className="puesto-details">
        <p className="puesto-name">{puesto.nombre_puesto || 'Sin asignar'}</p>
        <p className="puesto-vendor">{puesto.cliente_nombre || 'Disponible'}</p>
      </div>

      <div className={`puesto-status ${puesto.estado}`}>
        <span className="icon">{getEstadoIcon(puesto.estado)}</span>
        <span className="label">{getEstadoLabel(puesto.estado)}</span>
      </div>
    </div>
  );
};

// ============================================
// 7. HOOK PARA DEBOUNCE (BÚSQUEDA)
// ============================================
// Archivo: src/hooks/useDebounce.js

import { useEffect, useState } from 'react';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Uso:
// const searchTerm = useDebounce(inputValue, 300);
// useEffect(() => {
//   if (searchTerm) {
//     buscarPuestos(searchTerm);
//   }
// }, [searchTerm]);

// ============================================
// 8. COMPONENTE DE TOAST PERSONALIZADO
// ============================================
// Archivo: src/components/common/Toast.jsx

import React, { useEffect, useState } from 'react';
import './Toast.css';

export const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {type === 'success' && <span className="icon">✓</span>}
        {type === 'error' && <span className="icon">✗</span>}
        {type === 'info' && <span className="icon">ℹ</span>}
        {type === 'warning' && <span className="icon">⚠</span>}
        <p>{message}</p>
      </div>
    </div>
  );
};

// ============================================
// 9. INTERCEPTOR PARA AXIOS (GLOBAL)
// ============================================
// Archivo: src/services/apiInterceptor.js

import axios from 'axios';
import { supabase } from './supabaseClient';

export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        await supabase.auth.signOut();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// ============================================
// 10. CONSULTAS SQL ÚTILES
// ============================================
// Archivo: backend/queries.sql

-- Obtener ocupación actual
SELECT 
  COUNT(*) as total_puestos,
  COUNT(CASE WHEN estado = 'ocupado' THEN 1 END) as ocupados,
  ROUND(COUNT(CASE WHEN estado = 'ocupado' THEN 1 END)::numeric / COUNT(*) * 100, 2) as porcentaje_ocupacion
FROM puestos
WHERE tianguis_id = 'TIANGUIS_ID';

-- Obtener asignaciones de hoy
SELECT 
  a.id,
  p.numero,
  c.nombre,
  c.nombre_puesto,
  c.categoria,
  c.telefono,
  a.estado_pago
FROM asignaciones a
JOIN puestos p ON a.puesto_id = p.id
JOIN clientes c ON a.cliente_id = c.id
WHERE a.tianguis_id = 'TIANGUIS_ID'
  AND a.fecha_asignacion = CURRENT_DATE
ORDER BY p.numero;

-- Clientes que más frecuentan el tianguis
SELECT 
  c.nombre,
  c.nombre_puesto,
  COUNT(*) as total_asignaciones,
  MAX(a.fecha_asignacion) as ultima_visita
FROM clientes c
LEFT JOIN asignaciones a ON c.id = a.cliente_id
GROUP BY c.id, c.nombre, c.nombre_puesto
ORDER BY COUNT(*) DESC
LIMIT 10;

-- Cambios pendientes de sincronizar
SELECT 
  user_id,
  COUNT(*) as cambios_pendientes
FROM cambios_offline
WHERE sincronizado = false
GROUP BY user_id;

// ============================================
// 11. ARCHIVO .ENV COMPLETO
// ============================================
// Archivo: .env.example

# SUPABASE
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxx...

# GOOGLE MAPS
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# APP CONFIG
VITE_APP_NAME=Sisteamguis
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# TIANGUIS
VITE_TIANGUIS_LAT=20.6596
VITE_TIANGUIS_LNG=-87.0739
VITE_TIANGUIS_NAME=Tianguis Central
VITE_TIANGUIS_STREET=Calle Principal
VITE_TIANGUIS_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# FEATURES
VITE_ENABLE_OFFLINE=true
VITE_ENABLE_GPS=true
VITE_AUTO_SYNC_INTERVAL=30000
VITE_DEBUG=false

// ============================================
// 12. PACKAGE.JSON SCRIPTS
// ============================================
// Archivo: package.json (sección scripts)

{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx",
    "lint:fix": "eslint src --ext js,jsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,css}\"",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "type-check": "tsc --noEmit",
    "dev:debug": "vite --debug",
    "build:analyze": "vite build --analyze"
  }
}

// ============================================
// 13. DOCKERFILE PARA DESPLIEGUE
// ============================================
// Archivo: Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]

// ============================================
// 14. DOCKER-COMPOSE PARA DESARROLLO LOCAL
// ============================================
// Archivo: docker-compose.yml

version: '3.8'
services:
  web:
    build: ./web
    ports:
      - "5173:5173"
    volumes:
      - ./web/src:/app/src
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
      - VITE_GOOGLE_MAPS_API_KEY=${VITE_GOOGLE_MAPS_API_KEY}
    command: npm run dev

  mobile:
    build: ./mobile
    ports:
      - "8081:8081"
    volumes:
      - ./mobile/src:/app/src
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    command: npm start

// ============================================
// 15. GITHUB ACTIONS CI/CD
// ============================================
// Archivo: .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

// ============================================
// FIN DE EJEMPLOS
// ============================================
