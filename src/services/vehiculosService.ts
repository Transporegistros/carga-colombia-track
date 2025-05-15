
import { supabase } from "@/lib/supabase";
import { Vehiculo } from "@/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

/**
 * Obtiene todos los vehículos de la empresa del usuario actual
 */
export async function obtenerVehiculos(): Promise<Vehiculo[]> {
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
    
    // Obtenemos los vehículos de la empresa
    const { data, error } = await supabase
      .from('vehiculos')
      .select('*')
      .eq('empresa_id', perfil.empresa_id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error al obtener vehículos:", error);
      toast.error("Error al cargar los vehículos: " + error.message);
      return [];
    }
    
    return data || [];
  } catch (error: any) {
    console.error("Error al obtener vehículos:", error);
    toast.error("Error al cargar los vehículos: " + error.message);
    return [];
  }
}

/**
 * Agrega un nuevo vehículo
 */
export async function agregarVehiculo(vehiculo: Omit<Vehiculo, 'id'>): Promise<Vehiculo | null> {
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
    
    const nuevoVehiculo = {
      ...vehiculo,
      empresa_id: perfil.empresa_id,
      created_by: perfilData.user.id
    };
    
    const { data, error } = await supabase
      .from('vehiculos')
      .insert(nuevoVehiculo)
      .select()
      .single();
    
    if (error) {
      console.error("Error al agregar vehículo:", error);
      toast.error("Error al guardar el vehículo: " + error.message);
      return null;
    }
    
    // Registramos en auditoría (opcional ya que hay triggers)
    await supabase
      .from('auditoria')
      .insert({
        tabla: 'vehiculos',
        accion: 'crear',
        registro_id: data.id,
        detalles: nuevoVehiculo,
        usuario_id: perfilData.user.id
      });
    
    return data;
  } catch (error: any) {
    console.error("Error al agregar vehículo:", error);
    toast.error("Error al guardar el vehículo: " + error.message);
    return null;
  }
}

/**
 * Actualiza un vehículo existente
 */
export async function actualizarVehiculo(id: string, vehiculo: Partial<Vehiculo>): Promise<Vehiculo | null> {
  try {
    const { data: perfilData } = await supabase.auth.getUser();
    
    if (!perfilData.user) {
      throw new Error("Usuario no autenticado");
    }
    
    // Verificar permisos
    const { data: tienePermiso } = await supabase
      .rpc('tiene_permiso', { modulo_ruta: 'vehiculos', accion: 'editar' });
    
    if (!tienePermiso) {
      toast.error("No tienes permisos para editar vehículos");
      return null;
    }
    
    const { data, error } = await supabase
      .from('vehiculos')
      .update(vehiculo)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error al actualizar vehículo:", error);
      toast.error("Error al actualizar el vehículo: " + error.message);
      return null;
    }
    
    return data;
  } catch (error: any) {
    console.error("Error al actualizar vehículo:", error);
    toast.error("Error al actualizar el vehículo: " + error.message);
    return null;
  }
}

/**
 * Elimina un vehículo
 */
export async function eliminarVehiculo(id: string): Promise<boolean> {
  try {
    const { data: perfilData } = await supabase.auth.getUser();
    
    if (!perfilData.user) {
      throw new Error("Usuario no autenticado");
    }
    
    // Verificar permisos
    const { data: tienePermiso } = await supabase
      .rpc('tiene_permiso', { modulo_ruta: 'vehiculos', accion: 'eliminar' });
    
    if (!tienePermiso) {
      toast.error("No tienes permisos para eliminar vehículos");
      return false;
    }
    
    const { error } = await supabase
      .from('vehiculos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error al eliminar vehículo:", error);
      toast.error("Error al eliminar el vehículo: " + error.message);
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error("Error al eliminar vehículo:", error);
    toast.error("Error al eliminar el vehículo: " + error.message);
    return false;
  }
}
