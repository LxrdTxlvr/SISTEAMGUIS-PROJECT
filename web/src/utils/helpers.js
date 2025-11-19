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