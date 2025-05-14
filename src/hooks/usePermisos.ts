
import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Modulo, obtenerModulosPermitidos } from '@/services/permisosService';

export function usePermisos() {
  const { user } = useAuth();
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarModulos = async () => {
      if (!user) {
        setModulos([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const rol = user.rol || 'usuario';
        const modulosPermitidos = await obtenerModulosPermitidos(rol);
        
        setModulos(modulosPermitidos);
      } catch (err: any) {
        console.error("Error al cargar módulos permitidos:", err);
        setError(err.message || "Error desconocido al cargar módulos");
      } finally {
        setLoading(false);
      }
    };

    cargarModulos();
  }, [user]);

  return { modulos, loading, error };
}
