# 🏗️ Arquitectura de Sisteamguis

## Diagrama General

```
┌─────────────┐
│   Admin     │
├─────────────┤
│   Web App   │ React
│   Mobile    │ React Native
└──────┬──────┘
       │
       ▼
┌──────────────┐
│   Supabase   │
├──────────────┤
│ PostgreSQL   │
│ Auth         │
│ Realtime     │
└──────┬───────┘
       │
       ├─▶ Google Maps API
       ├─▶ Geolocation API
       └─▶ Storage
```

## Estructura de Carpetas

```
sisteamguis-project/
├── web/
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── services/      # Servicios (API, Auth)
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Funciones auxiliares
│   │   ├── store/         # State management
│   │   └── styles/        # Estilos CSS
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── mobile/
│   ├── src/
│   │   ├── screens/       # Pantallas
│   │   ├── components/    # Componentes
│   │   ├── services/      # Servicios
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utilidades
│   │   └── styles/        # Estilos
│   ├── android/
│   ├── .env.example
│   ├── package.json
│   ├── app.json
│   └── index.js
│
├── backend/
│   ├── migrations/
│   ├── sisteamguis-schema.sql
│   └── functions/
│
├── docs/
│   ├── SETUP.md
│   ├── DATABASE.md
│   ├── ARCHITECTURE.md (este archivo)
│   ├── GUIA_DESARROLLO_SISTEAMGUIS.md
│   └── RESUMEN_EJECUTIVO.md
│
└── README.md
```

## Flujo de Datos

1. **Admin interactúa** con la app (web o móvil)
2. **App captura datos** y guarda localmente (offline-first)
3. **Cuando hay conexión**, sync automático a Supabase
4. **Cambios se propagan** en tiempo real a otras instancias
5. **Auditoría registra** todos los cambios

## Stack Tecnológico

### Frontend Web
- React 18+
- Vite
- React Router
- Zustand (state)
- Google Maps API
- Tailwind CSS

### Frontend Móvil
- React Native
- Expo
- React Navigation
- React Native Maps
- AsyncStorage
- Zustand

### Backend
- Supabase (BaaS)
- PostgreSQL
- JWT Auth
- RLS (Row-Level Security)
- Realtime Subscriptions

### Externo
- Google Maps API
- Google Cloud Console

## Flujos Principales

### 1. Registro de Cliente
```
Usuario toca puesto
  ↓
App abre formulario modal
  ↓
Ingresa datos (nombre, teléfono, categoría, puesto)
  ↓
Valida datos
  ↓
Guarda en caché local
  ↓
Si online: envía a Supabase
Si offline: en cola de sincronización
  ↓
UI actualiza estado del puesto (Ocupado)
```

### 2. Sincronización Offline/Online
```
App detecta cambio de conectividad
  ↓
Si está online:
  - Lee cambios pendientes de localStorage
  - Envía a Supabase
  - Marca como sincronizado
  - Limpia caché
  ↓
Si está offline:
  - Guarda cambio en localStorage
  - Muestra indicador offline
  - Espera conexión
```

### 3. Actualización en Tiempo Real
```
Cambio en una instancia (web o móvil)
  ↓
Se envía a Supabase
  ↓
Webhook/Realtime notifica a otras instancias
  ↓
Otras apps reciben actualización
  ↓
UI se actualiza sin necesidad de recargar
```

## Consideraciones de Seguridad

1. **Autenticación**: JWT via Supabase Auth
2. **Autorización**: RLS en base de datos
3. **Datos**: HTTPS para todas las conexiones
4. **API Keys**: Restringidas por dominio/app
5. **Auditoría**: Todos los cambios registrados

## Performance

- Lazy loading de componentes
- Code splitting
- Caching de datos
- Índices en BD
- Compresión de assets

## Escalabilidad

- Multiusuario simultáneo
- Sincronización automática
- Caché distribuido
- Base de datos escalable (Supabase)
- CDN para assets estáticos

Para más detalles técnicos, ver documentación en `/docs/`
