
import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Modulo } from '@/types';
import { supabase } from '@/lib/supabase';

// Define functions to be used by the hook
async function obtenerModulosPermitidos(rol: string): Promise<Modulo[]> {
  try {
    if (!rol) return [];
    
    // Si es admin, devolver todos los módulos activos
    if (rol === 'admin') {
      const { data, error } = await supabase
        .from('modulos')
        .select('*')
        .eq('activo', true)
        .order('orden');
      
      if (error) throw error;
      return data || [];
    }
    
    // Para otros roles, usar la función RPC para obtener módulos permitidos
    const { data, error } = await supabase
      .rpc('obtener_modulos_por_rol', { rol_usuario: rol });
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error al obtener módulos permitidos:', err);
    return [];
  }
}

// Verificar si un usuario tiene permiso específico para un módulo
async function verificarPermiso(modulo: string, accion: 'crear' | 'editar' | 'eliminar' | 'ver'): Promise<boolean> {
  try {
    // Verificar si el usuario está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Verificar si es administrador (tiene todos los permisos)
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('cargo')
      .eq('id', user.id)
      .single();
    
    if (perfil?.cargo === 'admin') return true;
    
    // Para otros roles, usar la función RPC para verificar el permiso específico
    const { data, error } = await supabase
      .rpc('tiene_permiso', { 
        modulo_ruta: modulo,
        accion: accion 
      });
    
    if (error) {
      console.error('Error al verificar permiso:', error);
      return false;
    }
    
    return data || false;
  } catch (err) {
    console.error('Error al verificar permiso:', err);
    return false;
  }
}

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

  return { modulos, loading, error, verificarPermiso };
}

export { obtenerModulosPermitidos, verificarPermiso };
