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