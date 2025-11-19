import { useEffect, useState, useCallback } from 'react';
import { puestosService } from '../services/puestosService';

export const usePuestos = () => {
  // Asumimos un ID de tianguis fijo o desde variable de entorno
  const tianguisId = import.meta.env.VITE_TIANGUIS_ID || '1'; 
  const [puestos, setPuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    puestosService.getPuestos(tianguisId)
      .then(data => {
        setPuestos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err);
        setLoading(false);
      });

    // Suscribirse a cambios en tiempo real de Supabase
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