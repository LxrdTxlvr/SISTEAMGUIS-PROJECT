// src/utils/constants.js
export const PUESTOS_CONFIG = {
  TOTAL_PUESTOS: 80,
  FILAS: 8,
  COLUMNAS: 10,
};

export const ESTADO_PUESTO = {
  LIBRE: 'libre',
  OCUPADO: 'ocupado',
};

export const COLORES = {
  PUESTO_LIBRE: '#00CC66',      // Verde
  PUESTO_OCUPADO: '#0066FF',    // Azul
  ADMIN_LOCATION: '#FF0000',    // Rojo
  MAPAS_FONDO: '#F5F5F5',
};

export const CATEGORIAS = [
  { id: 'comida', label: 'Comida', icon: '🍽️' },
  { id: 'bebidas', label: 'Bebidas', icon: '🥤' },
  { id: 'ropa', label: 'Ropa', icon: '👕' },
  { id: 'accesorios', label: 'Accesorios', icon: '👜' },
  { id: 'artesanias', label: 'Artesanías', icon: '🎨' },
  { id: 'electronica', label: 'Electrónica', icon: '📱' },
  { id: 'juguetes', label: 'Juguetes', icon: '🧸' },
  { id: 'libros', label: 'Libros', icon: '📚' },
  { id: 'plantas', label: 'Plantas', icon: '🌿' },
  { id: 'otros', label: 'Otros', icon: '📦' },
];

export const TIANGUIS_LOCATION = {
  LAT: parseFloat(process.env.REACT_APP_TIANGUIS_LAT || '20.6596'),
  LNG: parseFloat(process.env.REACT_APP_TIANGUIS_LNG || '-87.0739'),
  NAME: process.env.REACT_APP_TIANGUIS_NAME || 'Tianguis Central',
  STREET: process.env.REACT_APP_TIANGUIS_STREET || 'Calle Principal',
};

export const MAP_DEFAULTS = {
  ZOOM: 17,
  ZOOM_MIN: 15,
  ZOOM_MAX: 20,
};

export const ESTADO_PAGO = {
  PENDIENTE: 'pendiente',
  PAGADO: 'pagado',
  PARCIAL: 'parcial',
};

export const API_LIMITS = {
  MAX_FOTO_SIZE: 5242880, // 5MB
  TIMEOUT_SYNC: 30000,    // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const MENSAJES = {
  EXITO: {
    REGISTRO_EXITOSO: 'Cliente registrado exitosamente',
    ACTUALIZADO: 'Datos actualizados correctamente',
    SINCRONIZADO: 'Cambios sincronizados',
  },
  ERROR: {
    CONEXION: 'Error de conexión. Intenta de nuevo.',
    DATOS_REQUERIDOS: 'Por favor completa todos los campos requeridos',
    TELEFONO_INVALIDO: 'El teléfono debe tener al menos 7 dígitos',
    ARCHIVO_GRANDE: 'El archivo es demasiado grande (máx 5MB)',
    PERMISO_DENEGADO: 'Permiso denegado',
    UBICACION_NO_DISPONIBLE: 'No se pudo obtener tu ubicación',
  },
  INFO: {
    MODO_OFFLINE: 'Trabajando en modo offline. Se sincronizará cuando estés online.',
    SINCRONIZANDO: 'Sincronizando cambios...',
    CARGANDO: 'Cargando datos...',
  },
};

export const RUTAS = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  MAPA: '/mapa',
  REPORTES: '/reportes',
  CONFIGURACION: '/configuracion',
};