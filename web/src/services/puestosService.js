import { supabase } from './supabaseClient';

export const puestosService = {
  // Obtener todos los puestos (si no tienes tianguis_id aún, trae todos)
  getPuestos: async (tianguisId) => {
    let query = supabase.from('puestos').select('*').order('numero');
    // Descomenta la siguiente línea si ya usas tianguis_id en tu BD
    // if (tianguisId) query = query.eq('tianguis_id', tianguisId);
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Actualizar estado
  updatePuestoEstado: async (puestoId, estado) => {
    const { data, error } = await supabase
      .from('puestos')
      .update({ estado })
      .eq('id', puestoId)
      .select();
    if (error) throw error;
    return data;
  },

  // Suscripción Realtime
  subscribeToPuestos: (tianguisId, callback) => {
    return supabase
      .channel('puestos-db-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'puestos' }, 
        callback
      )
      .subscribe();
  },
};