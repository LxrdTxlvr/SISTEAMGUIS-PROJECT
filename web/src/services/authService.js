import { supabase } from './supabaseClient'

export const authService = {
  // Login
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  // Logout
  logout: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Escuchar cambios de autenticación
  onAuthChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  },
}
