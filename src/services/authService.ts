
import { supabase } from "@/lib/supabase";
import { User } from "@/types";

/**
 * Obtiene el ID de la empresa del usuario actual
 */
export async function obtenerEmpresaIdUsuarioActual(): Promise<string | null> {
  try {
    const { data: perfilData } = await supabase.auth.getUser();
    
    if (!perfilData.user) {
      return null;
    }
    
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('empresa_id')
      .eq('id', perfilData.user.id)
      .single();
    
    return perfil?.empresa_id || null;
  } catch (error) {
    console.error("Error al obtener empresa del usuario:", error);
    return null;
  }
}

/**
 * Comprueba si el usuario tiene un permiso específico
 */
export async function verificarPermiso(modulo: string, accion: 'crear' | 'editar' | 'eliminar' | 'ver'): Promise<boolean> {
  try {
    const { data: perfilData } = await supabase.auth.getUser();
    
    if (!perfilData.user) {
      return false;
    }
    
    const { data, error } = await supabase
      .rpc('tiene_permiso', { 
        modulo_ruta: modulo,
        accion: accion 
      });
    
    if (error) {
      console.error('Error al verificar permiso:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error al verificar permiso:', error);
    return false;
  }
}

/**
 * Obtiene el perfil completo del usuario actual
 */
export async function obtenerPerfilUsuarioActual(): Promise<User | null> {
  try {
    const { data: perfilData } = await supabase.auth.getUser();
    
    if (!perfilData.user) {
      return null;
    }
    
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', perfilData.user.id)
      .single();
    
    if (!perfil) {
      return null;
    }
    
    return {
      id: perfilData.user.id,
      email: perfilData.user.email || '',
      nombre: perfil.nombre || '',
      rol: perfil.cargo || 'usuario',
      empresa_id: perfil.empresa_id
    };
  } catch (error) {
    console.error("Error al obtener perfil del usuario:", error);
    return null;
  }
}
