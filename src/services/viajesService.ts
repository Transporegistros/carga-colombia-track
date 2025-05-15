
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/**
 * Obtiene todos los viajes de la empresa del usuario actual
 */
export async function obtenerViajes(): Promise<any[]> {
  try {
    const { data: perfilData } = await supabase.auth.getUser();
    
    if (!perfilData.user) {
      throw new Error("Usuario no autenticado");
    }
    
    // Obtenemos el perfil del usuario para saber a qué empresa pertenece
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('empresa_id')
      .eq('id', perfilData.user.id)
      .single();
    
    if (!perfil?.empresa_id) {
      throw new Error("Usuario no asociado a una empresa");
    }
    
    // Obtenemos los viajes de la empresa
    const { data, error } = await supabase
      .from('viajes')
      .select('*')
      .eq('empresa_id', perfil.empresa_id)
      .order('fecha_salida', { ascending: false });
    
    if (error) {
      console.error("Error al obtener viajes:", error);
      toast.error("Error al cargar los viajes: " + error.message);
      return [];
    }
    
    return data || [];
  } catch (error: any) {
    console.error("Error al obtener viajes:", error);
    toast.error("Error al cargar los viajes: " + error.message);
    return [];
  }
}

/**
 * Agrega un nuevo viaje
 */
export async function agregarViaje(viaje: any): Promise<any | null> {
  try {
    const { data: perfilData } = await supabase.auth.getUser();
    
    if (!perfilData.user) {
      throw new Error("Usuario no autenticado");
    }
    
    // Obtenemos el perfil del usuario para saber a qué empresa pertenece
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('empresa_id')
      .eq('id', perfilData.user.id)
      .single();
    
    if (!perfil?.empresa_id) {
      throw new Error("Usuario no asociado a una empresa");
    }
    
    const nuevoViaje = {
      ...viaje,
      empresa_id: perfil.empresa_id,
      created_by: perfilData.user.id
    };
    
    const { data, error } = await supabase
      .from('viajes')
      .insert(nuevoViaje)
      .select()
      .single();
    
    if (error) {
      console.error("Error al agregar viaje:", error);
      toast.error("Error al guardar el viaje: " + error.message);
      return null;
    }
    
    return data;
  } catch (error: any) {
    console.error("Error al agregar viaje:", error);
    toast.error("Error al guardar el viaje: " + error.message);
    return null;
  }
}

/**
 * Actualiza un viaje existente
 */
export async function actualizarViaje(id: string, viaje: any): Promise<any | null> {
  try {
    const { data: perfilData } = await supabase.auth.getUser();
    
    if (!perfilData.user) {
      throw new Error("Usuario no autenticado");
    }
    
    // Verificar permisos
    const { data: tienePermiso } = await supabase
      .rpc('tiene_permiso', { modulo_ruta: 'viajes', accion: 'editar' });
    
    if (!tienePermiso) {
      toast.error("No tienes permisos para editar viajes");
      return null;
    }
    
    const { data, error } = await supabase
      .from('viajes')
      .update(viaje)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error al actualizar viaje:", error);
      toast.error("Error al actualizar el viaje: " + error.message);
      return null;
    }
    
    return data;
  } catch (error: any) {
    console.error("Error al actualizar viaje:", error);
    toast.error("Error al actualizar el viaje: " + error.message);
    return null;
  }
}

/**
 * Elimina un viaje
 */
export async function eliminarViaje(id: string): Promise<boolean> {
  try {
    const { data: perfilData } = await supabase.auth.getUser();
    
    if (!perfilData.user) {
      throw new Error("Usuario no autenticado");
    }
    
    // Verificar permisos
    const { data: tienePermiso } = await supabase
      .rpc('tiene_permiso', { modulo_ruta: 'viajes', accion: 'eliminar' });
    
    if (!tienePermiso) {
      toast.error("No tienes permisos para eliminar viajes");
      return false;
    }
    
    const { error } = await supabase
      .from('viajes')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error al eliminar viaje:", error);
      toast.error("Error al eliminar el viaje: " + error.message);
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error("Error al eliminar viaje:", error);
    toast.error("Error al eliminar el viaje: " + error.message);
    return false;
  }
}

/**
 * Obtiene viajes activos (pendientes o en curso)
 */
export async function obtenerViajesActivos(): Promise<any[]> {
  try {
    const { data: perfilData } = await supabase.auth.getUser();
    
    if (!perfilData.user) {
      throw new Error("Usuario no autenticado");
    }
    
    // Obtenemos el perfil del usuario para saber a qué empresa pertenece
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('empresa_id')
      .eq('id', perfilData.user.id)
      .single();
    
    if (!perfil?.empresa_id) {
      throw new Error("Usuario no asociado a una empresa");
    }
    
    // Obtenemos los viajes activos de la empresa
    const { data, error } = await supabase
      .from('viajes')
      .select('*')
      .eq('empresa_id', perfil.empresa_id)
      .in('estado', ['pendiente', 'en-curso'])
      .order('fecha_salida', { ascending: false });
    
    if (error) {
      console.error("Error al obtener viajes activos:", error);
      toast.error("Error al cargar los viajes activos: " + error.message);
      return [];
    }
    
    return data || [];
  } catch (error: any) {
    console.error("Error al obtener viajes activos:", error);
    toast.error("Error al cargar los viajes activos: " + error.message);
    return [];
  }
}
