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

