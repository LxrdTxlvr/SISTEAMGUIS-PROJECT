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

// src/utils/helpers.js
export const formatearFecha = (fecha) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(fecha).toLocaleDateString('es-MX', options);
};

export const formatearHora = (fecha) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(fecha).toLocaleTimeString('es-MX', options);
};

export const formatearFechaHora = (fecha) => {
  return `${formatearFecha(fecha)} ${formatearHora(fecha)}`;
};

export const formatearTelefono = (telefono) => {
  const cleaned = telefono.replace(/\D/g, '');
  if (cleaned.length < 7) return telefono;
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return cleaned;
};

export const normalizarTelefono = (telefono) => {
  return telefono.replace(/\D/g, '');
};

export const calcularDistancia = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radio de la tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c;
  return distancia.toFixed(2);
};

export const generarReporteOcupacion = (puestos) => {
  const total = puestos.length;
  const ocupados = puestos.filter(p => p.estado === 'ocupado').length;
  const libres = total - ocupados;
  const porcentaje = Math.round((ocupados / total) * 100);

  return {
    total,
    ocupados,
    libres,
    porcentaje,
    tasaOcupacion: `${porcentaje}%`,
  };
};

export const agruparPuestosPorCategoria = (asignaciones) => {
  return asignaciones.reduce((acc, asignacion) => {
    const categoria = asignacion.cliente_categoria || 'Sin categoría';
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(asignacion);
    return acc;
  }, {});
};

export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarTelefono = (telefono) => {
  const cleaned = normalizarTelefono(telefono);
  return cleaned.length >= 7;
};

export const generarID = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const reintentar = async (fn, intentos = 3, delay = 1000) => {
  for (let i = 0; i < intentos; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === intentos - 1) throw error;
      await sleep(delay * (i + 1));
    }
  }
};

export const descargarCSV = (datos, nombreArchivo = 'datos.csv') => {
  const headers = Object.keys(datos[0] || {});
  const csv = [
    headers.join(','),
    ...datos.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escapar comillas y envolver en comillas si contiene comas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  a.click();
  URL.revokeObjectURL(url);
};

// src/utils/validators.js
export const validadores = {
  nombre: (valor) => {
    if (!valor?.trim()) return 'El nombre es requerido';
    if (valor.length < 2) return 'El nombre debe tener al menos 2 caracteres';
    if (valor.length > 100) return 'El nombre no puede exceder 100 caracteres';
    return null;
  },

  telefono: (valor) => {
    if (!valor?.trim()) return 'El teléfono es requerido';
    const cleaned = normalizarTelefono(valor);
    if (cleaned.length < 7) return 'El teléfono debe tener al menos 7 dígitos';
    if (cleaned.length > 15) return 'El teléfono no puede exceder 15 dígitos';
    return null;
  },

  categoria: (valor) => {
    if (!valor) return 'La categoría es requerida';
    return null;
  },

  nombrePuesto: (valor) => {
    if (!valor?.trim()) return 'El nombre del puesto es requerido';
    if (valor.length < 3) return 'El nombre del puesto debe tener al menos 3 caracteres';
    if (valor.length > 100) return 'El nombre del puesto no puede exceder 100 caracteres';
    return null;
  },

  email: (valor) => {
    if (valor && !validarEmail(valor)) return 'El email no es válido';
    return null;
  },

  descripcion: (valor) => {
    if (valor && valor.length > 500) return 'La descripción no puede exceder 500 caracteres';
    return null;
  },
};

// src/utils/mapUtils.js
export const calcularCoordenadaPuesto = (numero, filas = 8, columnas = 10, espacioPixeles = 30) => {
  const fila = Math.floor((numero - 1) / columnas);
  const columna = (numero - 1) % columnas;
  
  return {
    x: columna * espacioPixeles,
    y: fila * espacioPixeles,
  };
};

export const generarPuestosEnGrid = (tianguisLat, tianguisLng, filas = 8, columnas = 10) => {
  const puestos = [];
  const espacioMetros = 5; // Cada puesto ocupa ~5 metros
  const latPorMetro = 1 / 111320; // Conversión aproximada
  const lngPorMetro = 1 / (111320 * Math.cos((tianguisLat * Math.PI) / 180));

  for (let i = 1; i <= filas * columnas; i++) {
    const fila = Math.floor((i - 1) / columnas);
    const columna = (i - 1) % columnas;

    const lat = tianguisLat + (fila * espacioMetros * latPorMetro);
    const lng = tianguisLng + (columna * espacioMetros * lngPorMetro);

    puestos.push({
      numero: i,
      latitud: lat,
      longitud: lng,
    });
  }

  return puestos;
};

export const crearZonaPuesto = (latitud, longitud, radioMetros = 3) => {
  const latPorMetro = 1 / 111320;
  const lngPorMetro = 1 / (111320 * Math.cos((latitud * Math.PI) / 180));

  return {
    norte: latitud + (radioMetros * latPorMetro),
    sur: latitud - (radioMetros * latPorMetro),
    este: longitud + (radioMetros * lngPorMetro),
    oeste: longitud - (radioMetros * lngPorMetro),
  };
};

export const puntoEnZona = (lat, lng, zona) => {
  return lat <= zona.norte &&
         lat >= zona.sur &&
         lng <= zona.este &&
         lng >= zona.oeste;
};
