import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Verificar conexión
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('tianguis')
      .select('count', { count: 'exact', head: true })
    return !error
  } catch (error) {
    return false
  }
}
