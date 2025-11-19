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