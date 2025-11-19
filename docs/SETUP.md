# 🚀 Guía de Setup - Sisteamguis

## Requisitos Previos

- Node.js 18+
- npm 8+
- Git
- Cuenta Supabase
- Google Cloud Project con Maps API

## Instalación Paso a Paso

### 1. Descargar/Clonar Proyecto

```bash
cd sisteamguis-project
```

### 2. Configurar Entorno

**Web:**
```bash
cp web/.env.example web/.env.local
# Editar web/.env.local con tus credenciales
```

**Móvil:**
```bash
cp mobile/.env.example mobile/.env.local
# Editar mobile/.env.local con tus credenciales
```

### 3. Instalar Dependencias

**Web:**
```bash
cd web
npm install
```

**Móvil:**
```bash
cd mobile
npm install
```

### 4. Configurar Supabase

1. Crear cuenta en https://supabase.com
2. Crear nuevo proyecto
3. Obtener URL y API Key
4. Ir a SQL Editor
5. Ejecutar `backend/sisteamguis-schema.sql`

### 5. Configurar Google Maps

1. Ir a https://console.cloud.google.com
2. Crear nuevo proyecto
3. Habilitar Maps JavaScript API
4. Crear API Key
5. Agregar a variables de entorno

### 6. Ejecutar Aplicación

**Web:**
```bash
cd web
npm run dev
# Acceder a http://localhost:5173
```

**Móvil:**
```bash
cd mobile
npm start
# Presionar 'a' para Android
```

## Troubleshooting

**Error: Cannot find module**
```bash
npm install
```

**Error: Supabase connection**
- Verificar URL y API Key en .env.local

**Error: Google Maps not loading**
- Verificar API Key y restricciones en Google Cloud

## Documentación Completa

Ver `/docs/` para documentación detallada
