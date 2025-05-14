
import { supabase } from '@/lib/supabase';
import { Modulo } from '@/types';

/**
 * Verifica si un usuario tiene permiso específico para un módulo
 * @param modulo Ruta del módulo
 * @param accion Acción a verificar (crear, editar, eliminar, ver)
 * @returns Verdadero si tiene permiso, falso si no
 */
export async function verificarPermiso(modulo: string, accion: 'crear' | 'editar' | 'eliminar' | 'ver'): Promise<boolean> {
  try {
    // Verificar si el usuario está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Verificar si es administrador (tiene todos los permisos)
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('cargo')
      .eq('id', user.id)
      .maybeSingle();
    
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

/**
 * Obtiene los módulos permitidos para un rol específico
 * @param rol Rol del usuario
 * @returns Lista de módulos permitidos
 */
export async function obtenerModulosPermitidos(rol: string): Promise<Modulo[]> {
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

/**
 * Obtiene todos los módulos del sistema
 * @returns Lista de todos los módulos
 */
export async function obtenerTodosModulos(): Promise<Modulo[]> {
  try {
    const { data, error } = await supabase
      .from('modulos')
      .select('*')
      .order('orden');
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error al obtener todos los módulos:', err);
    return [];
  }
}

/**
 * Actualiza los permisos de un rol para un módulo específico
 */
export async function actualizarPermisosRol(
  rol: string, 
  moduloId: string, 
  permisos: { crear: boolean; editar: boolean; eliminar: boolean; ver: boolean }
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('permisos_rol')
      .upsert({
        rol,
        modulo_id: moduloId,
        ...permisos
      }, { onConflict: 'rol,modulo_id' });
    
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error al actualizar permisos:', err);
    return false;
  }
}

export type { Modulo };
