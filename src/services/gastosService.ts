
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

/**
 * Obtiene todos los gastos de un tipo específico para la empresa del usuario actual
 */
export async function obtenerGastosPorTipo(tipo: string): Promise<any[]> {
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
    
    // Obtenemos los gastos del tipo especificado para la empresa
    const { data, error } = await supabase
      .from('gastos')
      .select('*')
      .eq('empresa_id', perfil.empresa_id)
      .eq('tipo', tipo)
      .order('fecha', { ascending: false });
    
    if (error) {
      console.error(`Error al obtener gastos de ${tipo}:`, error);
      toast.error(`Error al cargar los gastos de ${tipo}: ${error.message}`);
      return [];
    }
    
    return data || [];
  } catch (error: any) {
    console.error(`Error al obtener gastos de ${tipo}:`, error);
    toast.error(`Error al cargar los gastos de ${tipo}: ${error.message}`);
    return [];
  }
}

/**
 * Agrega un nuevo gasto
 */
export async function agregarGasto(gasto: any): Promise<any | null> {
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
    
    const nuevoGasto = {
      ...gasto,
      empresa_id: perfil.empresa_id,
      created_by: perfilData.user.id
    };
    
    const { data, error } = await supabase
      .from('gastos')
      .insert(nuevoGasto)
      .select()
      .single();
    
    if (error) {
      console.error("Error al agregar gasto:", error);
      toast.error(`Error al guardar el gasto de ${gasto.tipo}: ${error.message}`);
      return null;
    }
    
    return data;
  } catch (error: any) {
    console.error("Error al agregar gasto:", error);
    toast.error(`Error al guardar el gasto: ${error.message}`);
    return null;
  }
}

/**
 * Actualiza un gasto existente
 */
export async function actualizarGasto(id: string, gasto: any): Promise<any | null> {
  try {
    const { data: perfilData } = await supabase.auth.getUser();
    
    if (!perfilData.user) {
      throw new Error("Usuario no autenticado");
    }
    
    // Verificar permisos
    const { data: tienePermiso } = await supabase
      .rpc('tiene_permiso', { modulo_ruta: 'gastos', accion: 'editar' });
    
    if (!tienePermiso) {
      toast.error("No tienes permisos para editar gastos");
      return null;
    }
    
    const { data, error } = await supabase
      .from('gastos')
      .update(gasto)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error al actualizar gasto:", error);
      toast.error(`Error al actualizar el gasto: ${error.message}`);
      return null;
    }
    
    return data;
  } catch (error: any) {
    console.error("Error al actualizar gasto:", error);
    toast.error(`Error al actualizar el gasto: ${error.message}`);
    return null;
  }
}

/**
 * Elimina un gasto
 */
export async function eliminarGasto(id: string): Promise<boolean> {
  try {
    const { data: perfilData } = await supabase.auth.getUser();
    
    if (!perfilData.user) {
      throw new Error("Usuario no autenticado");
    }
    
    // Verificar permisos
    const { data: tienePermiso } = await supabase
      .rpc('tiene_permiso', { modulo_ruta: 'gastos', accion: 'eliminar' });
    
    if (!tienePermiso) {
      toast.error("No tienes permisos para eliminar gastos");
      return false;
    }
    
    const { error } = await supabase
      .from('gastos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error al eliminar gasto:", error);
      toast.error(`Error al eliminar el gasto: ${error.message}`);
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error("Error al eliminar gasto:", error);
    toast.error(`Error al eliminar el gasto: ${error.message}`);
    return false;
  }
}
