import { useEffect, useState } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Obtener usuario actual al cargar
    authService.getCurrentUser()
      .then(user => {
        setUser(user);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });

    // Escuchar cambios (login/logout) en tiempo real
    const { data: { subscription } } = authService.onAuthChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return { user, loading, error };
};