# 🚀 GUÍA COMPLETA: DESARROLLO DE SISTEAMGUIS
## Sistema de Gestión de Tianguis - React & React Native

---

# PARTE 1: INSTALACIÓN DE ENTORNOS DE DESARROLLO

## 1.1 Requisitos Previos (Windows, macOS, Linux)

### Node.js y npm
```bash
# Descargar e instalar desde: https://nodejs.org/
# Versión recomendada: LTS (v18+)

# Verificar instalación:
node --version
npm --version
```

### Git
```bash
# Descargar desde: https://git-scm.com/
# Verificar:
git --version
```

### Visual Studio Code
- Descargar desde: https://code.visualstudio.com/
- Extensiones recomendadas:
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
  - Supabase
  - Thunder Client (o Postman)

---

## 1.2 Instalación para APP WEB (React)

### Paso 1: Crear el proyecto
```bash
# Con Vite (MÁS RÁPIDO - Recomendado)
npm create vite@latest sisteamguis-web -- --template react
cd sisteamguis-web

# O con Create React App
npx create-react-app sisteamguis-web
cd sisteamguis-web
```

### Paso 2: Instalar dependencias principales
```bash
npm install

# Dependencias necesarias:
npm install @react-google-maps/api        # Google Maps
npm install @supabase/supabase-js          # Supabase
npm install zustand                        # State management
npm install react-router-dom               # Routing
npm install axios                          # HTTP client
npm install date-fns                       # Date utilities
npm install tailwindcss postcss autoprefixer # Tailwind CSS
npm install react-toastify                 # Notificaciones
npm install react-modal                    # Modales
npm install react-icons                    # Iconos
npm install lodash-es                      # Utilidades
npm install workbox-window                 # Service workers (offline)
```

### Paso 3: Configurar Tailwind CSS (opcional pero recomendado)
```bash
npx tailwindcss init -p

# Configura tailwind.config.js:
# Edita el archivo generado para incluir tus archivos:
# content: [
#   "./src/**/*.{js,jsx,ts,tsx}",
# ]
```

### Paso 4: Estructura de archivos
```bash
# Crear carpetas
mkdir -p src/components/{auth,map,modals,sidebar,layout,common}
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/store
mkdir -p src/styles
mkdir -p src/assets/{icons,images}

### Crear archivos .env (dónde y cómo)

Crea el archivo `.env.local` en la raíz de cada proyecto (el mismo nivel que package.json).

- Para la app web (desde la carpeta raíz del repo):
```bash
cd sisteamguis-web
cp .env.example .env.local
```

- Para la app móvil (si usas Expo o RN, en la carpeta del proyecto móvil):
```bash
cd ../sisteamguis-mobile
cp .env.example .env.local
```

- Comandos alternativos en Windows:
  - PowerShell:
  ```powershell
  Copy-Item .env.example .env.local
  ```
  - CMD:
  ```cmd
  copy .env.example .env.local
  ```

Rellena `.env.local` con las variables necesarias (ejemplo):
```env
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
VITE_TIANGUIS_ID=1
VITE_TIANGUIS_LAT=19.4326
VITE_TIANGUIS_LNG=-99.1332
```

Nota: no subir `.env.local` a Git (ya se añadió a .gitignore).

### Paso 5: Archivos de configuración
```bash
# En la raíz del proyecto:
# .gitignore ya debe existir, agrega:
echo ".env.local" >> .gitignore
echo "node_modules/" >> .gitignore
echo ".DS_Store" >> .gitignore
```

---

## 1.3 Instalación para APP MÓVIL (React Native)

### Requisitos previos (Android)

#### Windows / macOS / Linux:
```bash
# 1. Descargar Android Studio desde:
# https://developer.android.com/studio

# 2. Instalar JDK (si no está incluido)
# Android Studio incluye JDK 11+

# 3. Verificar instalación:
java -version
```

### Paso 1: Crear proyecto React Native
```bash
# Con Expo CLI (MÁS FÁCIL para principiantes)
npx create-expo-app sisteamguis-mobile
cd sisteamguis-mobile

# O con React Native CLI (MÁS CONTROL)
npx react-native init sisteamguis-mobile
cd sisteamguis-mobile
```

### Paso 2: Instalar dependencias principales
```bash
npm install

# Dependencias para móvil:
npm install @react-google-maps/api        # NOTA: No disponible en RN, usaremos react-native-maps
npm install react-native-maps              # Google Maps para React Native
npm install react-native-geolocation-service # Geolocalización
npm install @supabase/supabase-js          # Supabase
npm install zustand                        # State management
npm install react-native-async-storage     # Storage local
npm install react-navigation               # Navegación
npm install @react-navigation/native       # Nav native
npm install @react-navigation/bottom-tabs  # Bottom tab navigation
npm install react-native-screens           # Optimización nativa
npm install react-native-safe-area-context # Safe area
npm install react-native-gesture-handler   # Gestos
npm install axios                          # HTTP client
npm install date-fns                       # Date utilities
npm install react-native-netinfo           # Detectar conectividad
npm install react-native-document-picker   # Seleccionar archivos
npm install @react-native-async-storage/async-storage # Storage mejorado
```

### Paso 3: Configuración Android

#### En `app.json` (para Expo):
```json
{
  "expo": {
    "name": "Sisteamguis",
    "slug": "sisteamguis",
    "version": "1.0.0",
    "assetBundlePatterns": ["**/*"],
    "android": {
      "package": "com.sisteamguis",
      "versionCode": 1,
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "INTERNET",
        "WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

#### En `AndroidManifest.xml` (para React Native CLI):
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### Paso 4: Estructura de archivos móvil
```bash
mkdir -p src/screens/{auth,map,settings}
mkdir -p src/components/{map,modals,common}
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/store
mkdir -p src/styles
mkdir -p src/assets/{icons,images}

cp .env.example .env.local
```

---

# PARTE 2: CONFIGURACIÓN DE SUPABASE

## 2.1 Crear cuenta y proyecto en Supabase

### Paso 1: Registrarse
1. Ir a https://supabase.com
2. Crear cuenta (GitHub, Google o email)
3. Crear nueva organización

### Paso 2: Crear proyecto
1. Click en "New Project"
2. Llenar datos:
   - Name: `sisteamguis`
   - Database Password: (guardar en lugar seguro)
   - Region: (elegir la más cercana, ej: us-east-1)
3. Click "Create new project" (esperar ~2 minutos)

### Paso 3: Obtener credenciales
1. Ir a Settings → API
2. Copiar:
   - `SUPABASE_URL` (Project URL)
   - `SUPABASE_ANON_KEY` (anon public key)
3. Guardar en `.env.local` de ambos proyectos

### Paso 4: Ejecutar schema SQL
1. Ir a SQL Editor en Supabase
2. Click "New query"
3. Copiar y pegar el contenido de `sisteamguis-schema.sql`
4. Click "Run"
5. Verificar que se crearon todas las tablas

---

## 2.2 Configuración de Google Maps API

### Paso 1: Crear proyecto en Google Cloud Console
1. Ir a https://console.cloud.google.com/
2. Crear nuevo proyecto: `sisteamguis`
3. Esperar creación

### Paso 2: Habilitar APIs
1. Buscar y habilitar:
   - **Maps JavaScript API**
   - **Maps SDK for Android**
   - **Maps Static API**
   - **Geolocation API**

### Paso 3: Crear credenciales (API Key)
1. Ir a Credenciales → "Create Credentials"
2. Seleccionar "API Key"
3. Copiar la clave
4. Restringir permisos:
   - HTTP referrers: `localhost:*`, `tudominio.com`
   - Android apps: Agregar huella digital del app
5. Guardar en `.env.local`:
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyD...
   GOOGLE_MAPS_API_KEY=AIzaSyD...
   ```

---

# PARTE 3: IMPLEMENTACIÓN WEB (REACT)

## 3.1 Archivo de Configuración Supabase

**`src/services/supabaseClient.js`**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Función para verificar conectividad
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('tianguis')
      .select('count', { count: 'exact', head: true });
    return !error;
  } catch (error) {
    return false;
  }
};
```

## 3.2 Servicio de Autenticación

**`src/services/authService.js`**
```javascript
import { supabase } from './supabaseClient';

export const authService = {
  // Login
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // Logout
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Escuchar cambios de autenticación
  onAuthChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};
```

## 3.3 Servicio de Puestos

**`src/services/puestosService.js`**
```javascript
import { supabase } from './supabaseClient';

export const puestosService = {
  // Obtener todos los puestos
  getPuestos: async (tianguisId) => {
    const { data, error } = await supabase
      .from('puestos')
      .select('*')
      .eq('tianguis_id', tianguisId)
      .order('numero');
    if (error) throw error;
    return data;
  },

  // Obtener puesto por ID
  getPuestoById: async (puestoId) => {
    const { data, error } = await supabase
      .from('puestos')
      .select('*')
      .eq('id', puestoId)
      .single();
    if (error) throw error;
    return data;
  },

  // Actualizar estado del puesto
  updatePuestoEstado: async (puestoId, estado) => {
    const { data, error } = await supabase
      .from('puestos')
      .update({ estado })
      .eq('id', puestoId)
      .select();
    if (error) throw error;
    return data;
  },

  // Suscribirse a cambios en tiempo real
  subscribeToPuestos: (tianguisId, callback) => {
    return supabase
      .from('puestos')
      .on('*', payload => {
        callback(payload);
      })
      .subscribe();
  },
};
```

## 3.4 Servicio de Asignaciones

**`src/services/asignacionesService.js`**
```javascript
import { supabase } from './supabaseClient';

export const asignacionesService = {
  // Crear nueva asignación
  crearAsignacion: async (asignacion) => {
    const { data, error } = await supabase
      .from('asignaciones')
      .insert([asignacion])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Obtener asignaciones de hoy
  getAsignacionesHoy: async (tianguisId) => {
    const hoy = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('vista_asignaciones_activas')
      .select('*')
      .eq('tianguis_id', tianguisId)
      .eq('fecha_asignacion', hoy);
    if (error) throw error;
    return data;
  },

  // Actualizar asignación
  updateAsignacion: async (asignacionId, cambios) => {
    const { data, error } = await supabase
      .from('asignaciones')
      .update(cambios)
      .eq('id', asignacionId)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Eliminar asignación
  deleteAsignacion: async (asignacionId) => {
    const { error } = await supabase
      .from('asignaciones')
      .delete()
      .eq('id', asignacionId);
    if (error) throw error;
  },
};
```

## 3.5 Hook para Autenticación

**`src/hooks/useAuth.js`**
```javascript
import { useEffect, useState } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Obtener usuario actual
    authService.getCurrentUser()
      .then(user => {
        setUser(user);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = authService.onAuthChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return { user, loading, error };
};
```

## 3.6 Hook para Puestos

**`src/hooks/usePuestos.js`**
```javascript
import { useEffect, useState, useCallback } from 'react';
import { puestosService } from '../services/puestosService';

export const usePuestos = (tianguisId) => {
  const [puestos, setPuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tianguisId) return;

    setLoading(true);
    puestosService
      .getPuestos(tianguisId)
      .then(data => {
        setPuestos(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });

    // Suscribirse a cambios
    const subscription = puestosService.subscribeToPuestos(tianguisId, (payload) => {
      if (payload.eventType === 'UPDATE') {
        setPuestos(prev => 
          prev.map(p => p.id === payload.new.id ? payload.new : p)
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [tianguisId]);

  const updatePuestoEstado = useCallback(async (puestoId, estado) => {
    try {
      await puestosService.updatePuestoEstado(puestoId, estado);
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  return { puestos, loading, error, updatePuestoEstado };
};
```

## 3.7 Componente Principal del Mapa

**`src/components/map/MapContainer.jsx`**
```javascript
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, MarkerClusterer, Marker, InfoWindow } from '@react-google-maps/api';
import { usePuestos } from '../../hooks/usePuestos';
import { PuestoMarker } from './PuestoMarker';
import './MapContainer.css';

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 80px)',
};

const mapOptions = {
  zoom: 17,
  center: { lat: parseFloat(import.meta.env.VITE_TIANGUIS_LAT), lng: parseFloat(import.meta.env.VITE_TIANGUIS_LNG) },
  gestureHandling: 'greedy',
};

export const MapContainer = ({ tianguisId, onPuestoClick, adminLocation }) => {
  const { puestos, loading } = usePuestos(tianguisId);
  const [selectedPuesto, setSelectedPuesto] = useState(null);
  const [map, setMap] = useState(null);

  if (loading) return <div className="loading">Cargando puestos...</div>;

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        options={mapOptions}
        onLoad={map => setMap(map)}
      >
        {/* Marcador del Admin */}
        {adminLocation && (
          <Marker
            position={adminLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#FF0000',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 2,
            }}
            title="Tu ubicación"
          />
        )}

        {/* Puestos */}
        {puestos.map((puesto) => (
          <PuestoMarker
            key={puesto.id}
            puesto={puesto}
            onClick={() => {
              setSelectedPuesto(puesto);
              onPuestoClick(puesto);
            }}
          />
        ))}

        {/* Info Window */}
        {selectedPuesto && (
          <InfoWindow
            position={{
              lat: selectedPuesto.latitud,
              lng: selectedPuesto.longitud,
            }}
            onCloseClick={() => setSelectedPuesto(null)}
          >
            <div className="info-window">
              <h3>Puesto {selectedPuesto.numero}</h3>
              <p>Estado: {selectedPuesto.estado}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};
```

## 3.8 Componente del Marcador del Puesto

**`src/components/map/PuestoMarker.jsx`**
```javascript
import React from 'react';
import { Marker } from '@react-google-maps/api';

export const PuestoMarker = ({ puesto, onClick }) => {
  const getMarkerColor = (estado) => {
    return estado === 'ocupado' ? '#0066FF' : '#00CC66';
  };

  const markerIcon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 15,
    fillColor: getMarkerColor(puesto.estado),
    fillOpacity: 0.9,
    strokeColor: '#fff',
    strokeWeight: 2,
  };

  return (
    <Marker
      position={{
        lat: parseFloat(puesto.latitud),
        lng: parseFloat(puesto.longitud),
      }}
      icon={markerIcon}
      onClick={onClick}
      label={{
        text: puesto.numero.toString(),
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
      }}
    />
  );
};
```

## 3.9 Componente del Formulario Modal

**`src/components/modals/PuestoModal.jsx`**
```javascript
import React, { useState } from 'react';
import Modal from 'react-modal';
import { PuestoForm } from './PuestoForm';
import './PuestoModal.css';

export const PuestoModal = ({ isOpen, puesto, onClose, onSubmit, loading }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header">
        <h2>Puesto #{puesto?.numero}</h2>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      <div className="modal-body">
        <PuestoForm
          puesto={puesto}
          onSubmit={onSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </div>
    </Modal>
  );
};
```

## 3.10 Página Principal (Dashboard)

**`src/pages/DashboardPage.jsx`**
```javascript
import React, { useState, useEffect } from 'react';
import { MapContainer } from '../components/map/MapContainer';
import { PuestoModal } from '../components/modals/PuestoModal';
import { asignacionesService } from '../services/asignacionesService';
import { useAuth } from '../hooks/useAuth';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [selectedPuesto, setSelectedPuesto] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [adminLocation, setAdminLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Obtener ubicación del admin
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setAdminLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error('Error de geolocalización:', error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const handlePuestoClick = (puesto) => {
    setSelectedPuesto(puesto);
    setModalOpen(true);
  };

  const handleModalSubmit = async (datos) => {
    setLoading(true);
    try {
      const asignacion = {
        puesto_id: selectedPuesto.id,
        tianguis_id: import.meta.env.VITE_TIANGUIS_ID,
        cliente_nombre: datos.nombre,
        cliente_telefono: datos.telefono,
        cliente_categoria: datos.categoria,
        nombre_puesto: datos.nombre_puesto,
        fecha_asignacion: new Date().toISOString().split('T')[0],
        admin_asignado: user.id,
      };

      await asignacionesService.crearAsignacion(asignacion);
      setModalOpen(false);
      // Mostrar toast de éxito
    } catch (error) {
      console.error('Error al crear asignación:', error);
      // Mostrar toast de error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <MapContainer
        tianguisId={import.meta.env.VITE_TIANGUIS_ID}
        onPuestoClick={handlePuestoClick}
        adminLocation={adminLocation}
      />
      <PuestoModal
        isOpen={modalOpen}
        puesto={selectedPuesto}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        loading={loading}
      />
    </div>
  );
};
```

---

# PARTE 4: IMPLEMENTACIÓN MÓVIL (REACT NATIVE)

## 4.1 Configuración Inicial

**`src/services/supabaseClient.js`** (igual que web)
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## 4.2 Hook para Geolocalización

**`src/hooks/useLocation.js`** (Móvil)
```javascript
import { useEffect, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permiso de Ubicación',
          message: 'Necesitamos acceso a tu ubicación',
          buttonNeutral: 'Preguntarme después',
          buttonNegative: 'Cancelar',
          buttonPositive: 'Aceptar',
        }
      );
      
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        startTracking();
      }
    } catch (err) {
      setError(err);
    }
  };

  const startTracking = () => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
        fastestInterval: 5000,
        minInterval: 5000,
      }
    );

    return () => Geolocation.clearWatch(watchId);
  };

  return { location, error, loading };
};
```

## 4.3 Componente de Mapa Móvil

**`src/components/map/MapView.jsx`** (React Native)
```javascript
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { usePuestos } from '../../hooks/usePuestos';
import { useLocation } from '../../hooks/useLocation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const MapViewComponent = ({ tianguisId, onPuestoPress }) => {
  const { puestos, loading: puestosLoading } = usePuestos(tianguisId);
  const { location } = useLocation();
  const [mapRef, setMapRef] = useState(null);

  const initialRegion = {
    latitude: parseFloat(process.env.TIANGUIS_LAT),
    longitude: parseFloat(process.env.TIANGUIS_LNG),
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const getMarkerColor = (estado) => {
    return estado === 'ocupado' ? '#0066FF' : '#00CC66';
  };

  if (puestosLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={setMapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
      >
        {/* Marcador del Admin */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Tu ubicación"
            pinColor="#FF0000"
          />
        )}

        {/* Puestos */}
        {puestos.map((puesto) => (
          <Marker
            key={puesto.id}
            coordinate={{
              latitude: parseFloat(puesto.latitud),
              longitude: parseFloat(puesto.longitud),
            }}
            pinColor={getMarkerColor(puesto.estado)}
            onPress={() => onPuestoPress(puesto)}
            title={`Puesto ${puesto.numero}`}
          />
        ))}
      </MapView>
    </View>
  );
};
```

---

# PARTE 5: CONFIGURACIÓN OFFLINE & SINCRONIZACIÓN

## 5.1 Hook para Estado de Red

**`src/hooks/useNetworkStatus.js`** (Web & Móvil)
```javascript
import { useEffect, useState } from 'react';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
```

## 5.2 Servicio de Sincronización

**`src/services/syncService.js`**
```javascript
import { supabase } from './supabaseClient';

export const syncService = {
  // Guardar cambio offline
  saveOfflineChange: async (tipo_cambio, tabla_afectada, datos) => {
    const user = await supabase.auth.getUser();
    
    try {
      const { data, error } = await supabase
        .from('cambios_offline')
        .insert([{
          user_id: user.data.user.id,
          tipo_cambio,
          tabla_afectada,
          datos_cambio: datos,
          sincronizado: false,
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      // Si no hay conexión, guardar en localStorage
      const pendingChanges = JSON.parse(
        localStorage.getItem('pendingChanges') || '[]'
      );
      pendingChanges.push({
        tipo_cambio,
        tabla_afectada,
        datos_cambio: datos,
      });
      localStorage.setItem('pendingChanges', JSON.stringify(pendingChanges));
      return null;
    }
  },

  // Sincronizar cambios pendientes
  syncPendingChanges: async () => {
    const user = await supabase.auth.getUser();
    
    // Obtener cambios no sincronizados
    const { data: cambios, error } = await supabase
      .from('cambios_offline')
      .select('*')
      .eq('user_id', user.data.user.id)
      .eq('sincronizado', false);

    if (error) throw error;

    // Procesar cada cambio
    for (const cambio of cambios) {
      try {
        await procesarCambio(cambio);
        
        // Marcar como sincronizado
        await supabase
          .from('cambios_offline')
          .update({ sincronizado: true, fecha_sincronizacion: new Date() })
          .eq('id', cambio.id);
      } catch (err) {
        console.error('Error sincronizando cambio:', err);
      }
    }
  },

  // Obtener cambios del localStorage si existen
  getSyncLocalChanges: () => {
    return JSON.parse(localStorage.getItem('pendingChanges') || '[]');
  },

  // Limpiar localStorage después de sincronizar
  clearLocalChanges: () => {
    localStorage.removeItem('pendingChanges');
  },
};

const procesarCambio = async (cambio) => {
  switch (cambio.tabla_afectada) {
    case 'asignaciones':
      if (cambio.tipo_cambio === 'crear') {
        await supabase
          .from('asignaciones')
          .insert([cambio.datos_cambio]);
      }
      break;
    case 'puestos':
      if (cambio.tipo_cambio === 'actualizar') {
        await supabase
          .from('puestos')
          .update(cambio.datos_cambio)
          .eq('id', cambio.datos_cambio.id);
      }
      break;
    default:
      break;
  }
};
```

## 5.3 Componente con Sincronización Automática

**`src/components/common/SyncManager.jsx`**
```javascript
import { useEffect } from 'react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { syncService } from '../../services/syncService';
import { toast } from 'react-toastify';

export const SyncManager = () => {
  const isOnline = useNetworkStatus();

  useEffect(() => {
    if (isOnline) {
      // Intentar sincronizar cuando se reconecte
      syncService.syncPendingChanges()
        .then(() => {
          toast.success('Datos sincronizados correctamente');
          syncService.clearLocalChanges();
        })
        .catch(error => {
          toast.error('Error al sincronizar: ' + error.message);
        });
    }
  }, [isOnline]);

  return null; // Component sin UI
};
```

---

# PARTE 6: EJECUTAR LOS PROYECTOS

## 6.1 App Web

```bash
cd sisteamguis-web

# Modo desarrollo
npm run dev

# Acceder a: http://localhost:5173
```

## 6.2 App Móvil (con Expo)

```bash
cd sisteamguis-mobile

# Modo desarrollo
npm start

# En terminal, presionar:
# 'a' para abrir en Android emulator
# 'i' para abrir en iOS (macOS)
# 'w' para abrir en web browser
```

## 6.3 App Móvil (con React Native CLI)

```bash
cd sisteamguis-mobile

# Terminal 1: Metro bundler
npm start

# Terminal 2: Compilar para Android
npm run android

# O compilar y ejecutar directamente:
npx react-native run-android
```

---

# PARTE 7: CHECKLIST DE CONFIGURACIÓN

- [ ] Node.js v18+ instalado
- [ ] Cuenta de Supabase creada
- [ ] Schema SQL ejecutado en Supabase
- [ ] Google Cloud Console configurado
- [ ] API Key de Google Maps obtenida
- [ ] Archivo `.env.local` configurado (web)
- [ ] Archivo `.env.local` configurado (móvil)
- [ ] Dependencias instaladas (web)
- [ ] Dependencias instaladas (móvil)
- [ ] Componentes básicos creados
- [ ] Servicios de Supabase configurados
- [ ] Autenticación funcionando
- [ ] Mapa cargando correctamente
- [ ] Geolocalización habilitada
- [ ] Sincronización offline configurada

---

# PARTE 8: TROUBLESHOOTING COMÚN

### Error: "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### Error: Google Maps API Key no válida
- Verificar que la API Key esté restringida correctamente
- Verificar dominio en Google Cloud Console
- Esperar 5-10 minutos para que se propaguen cambios

### Error: Geolocalización no funciona en móvil
- Verificar permisos en `AndroidManifest.xml`
- Verificar que el emulador tenga Google Play Services instalados
- En Android Studio: AVD Manager → Editar emulador → Aceptar Google Play

### Error: "Supabase connection refused"
- Verificar URL y API Key en `.env.local`
- Verificar conexión a internet
- Verificar que el proyecto Supabase esté activo

### Componentes de Google Maps no se renderizan
```bash
npm install @react-google-maps/api @googlemaps/js-api-loader
```

---

# PARTE 9: PRÓXIMOS PASOS RECOMENDADOS

1. **Testing**
   - Configurar Jest y React Testing Library
   - Escribir tests para servicios
   - Pruebas E2E con Cypress

2. **Despliegue**
   - Deployar web en Vercel o Netlify
   - Buildear APK para Android
   - Implementar CI/CD con GitHub Actions

3. **Optimizaciones**
   - Code splitting
   - Lazy loading de componentes
   - Optimización de imágenes
   - Caching de puestos

4. **Funcionalidades Avanzadas**
   - Reportes de ocupación
   - Historial de asignaciones
   - Notificaciones push
   - Modo oscuro

---

**¡Proyecto listo para comenzar! 🚀**
