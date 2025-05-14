
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Modulo {
  id: string;
  nombre: string;
  descripcion: string | null;
  ruta: string;
  icono: string | null;
  activo: boolean;
  orden: number;
}

export interface PermisoRol {
  id: string;
  rol: string;
  modulo_id: string;
  crear: boolean;
  editar: boolean;
  eliminar: boolean;
  ver: boolean;
}

/**
 * Obtiene los módulos permitidos para el rol del usuario actual
 */
export async function obtenerModulosPermitidos(rol: string): Promise<Modulo[]> {
  try {
    const { data, error } = await supabase
      .rpc('obtener_modulos_por_rol', { rol_usuario: rol });

    if (error) {
      console.error('Error al obtener módulos permitidos:', error);
      toast.error('Error al cargar los módulos: ' + error.message);
      return [];
    }

    return data || [];
  } catch (error: any) {
    console.error('Error al obtener módulos permitidos:', error);
    toast.error('Error al cargar los módulos: ' + error.message);
    return [];
  }
}

/**
 * Verifica si el usuario tiene permiso para realizar una acción específica
 */
export async function verificarPermiso(modulo: string, accion: 'crear' | 'editar' | 'eliminar' | 'ver'): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('tiene_permiso', { modulo_ruta: modulo, accion });

    if (error) {
      console.error('Error al verificar permiso:', error);
      return false;
    }

    return data || false;
  } catch (error) {
    console.error('Error al verificar permiso:', error);
    return false;
  }
}

/**
 * Obtiene todos los módulos del sistema (solo administradores)
 */
export async function obtenerTodosModulos(): Promise<Modulo[]> {
  try {
    const { data, error } = await supabase
      .from('modulos')
      .select('*')
      .order('orden');

    if (error) {
      console.error('Error al obtener todos los módulos:', error);
      toast.error('Error al cargar los módulos: ' + error.message);
      return [];
    }

    return data || [];
  } catch (error: any) {
    console.error('Error al obtener todos los módulos:', error);
    toast.error('Error al cargar los módulos: ' + error.message);
    return [];
  }
}

/**
 * Obtiene los permisos de un rol específico
 */
export async function obtenerPermisosRol(rol: string): Promise<PermisoRol[]> {
  try {
    const { data, error } = await supabase
      .from('permisos_rol')
      .select('*')
      .eq('rol', rol);

    if (error) {
      console.error('Error al obtener permisos del rol:', error);
      toast.error('Error al cargar los permisos: ' + error.message);
      return [];
    }

    return data || [];
  } catch (error: any) {
    console.error('Error al obtener permisos del rol:', error);
    toast.error('Error al cargar los permisos: ' + error.message);
    return [];
  }
}
