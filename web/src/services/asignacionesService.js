import { supabase } from './supabaseClient';

export const asignacionesService = {
  crearAsignacion: async (asignacion) => {
    const { data, error } = await supabase
      .from('asignaciones')
      .insert([asignacion])
      .select();
    if (error) throw error;
    return data[0];
  }
};