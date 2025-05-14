
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RegistroAuditoria } from "@/types";
import { useAuth } from "@/context/AuthContext";

/**
 * Obtiene los registros de auditoría (para administradores)
 */
export async function obtenerRegistrosAuditoria(
  limite = 100,
  desde?: string,
  hasta?: string,
  tabla?: string,
  accion?: string
): Promise<RegistroAuditoria[]> {
  try {
    let query = supabase
      .from('auditoria')
      .select(`
        *,
        usuario:usuario_id(email)
      `)
      .order('timestamp', { ascending: false })
      .limit(limite);

    if (desde) {
      query = query.gte('timestamp', desde);
    }

    if (hasta) {
      query = query.lte('timestamp', hasta);
    }

    if (tabla) {
      query = query.eq('tabla', tabla);
    }

    if (accion) {
      query = query.eq('accion', accion);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al obtener registros de auditoría:', error);
      toast.error('Error al cargar los registros de auditoría: ' + error.message);
      return [];
    }

    // Formatear los datos para que sean más fáciles de usar
    return (data || []).map(registro => {
      // Asegurarnos que el usuario sea un objeto con las propiedades esperadas
      const userEmail = registro.usuario?.email || 'Usuario desconocido';
      
      return {
        ...registro,
        usuario: {
          email: userEmail,
          nombre: undefined // Lo obtendremos de otra consulta si es necesario
        }
      };
    });
  } catch (error: any) {
    console.error('Error al obtener registros de auditoría:', error);
    toast.error('Error al cargar los registros de auditoría: ' + error.message);
    return [];
  }
}

/**
 * Obtiene los registros de auditoría del usuario actual
 */
export async function obtenerMisRegistrosAuditoria(
  limite = 50,
  desde?: string,
  hasta?: string,
  tabla?: string,
  accion?: string
): Promise<RegistroAuditoria[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }
    
    let query = supabase
      .from('auditoria')
      .select('*')
      .eq('usuario_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(limite);

    if (desde) {
      query = query.gte('timestamp', desde);
    }

    if (hasta) {
      query = query.lte('timestamp', hasta);
    }

    if (tabla) {
      query = query.eq('tabla', tabla);
    }

    if (accion) {
      query = query.eq('accion', accion);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al obtener mis registros de auditoría:', error);
      toast.error('Error al cargar los registros de auditoría: ' + error.message);
      return [];
    }

    return data || [];
  } catch (error: any) {
    console.error('Error al obtener mis registros de auditoría:', error);
    toast.error('Error al cargar los registros de auditoría: ' + error.message);
    return [];
  }
}

/**
 * Registra una acción de "ver" manualmente (las otras se registran automáticamente por triggers)
 */
export async function registrarVisualizacion(tabla: string, registro_id: string, detalles?: any): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Usuario no autenticado, no se puede registrar la visualización');
      return;
    }
    
    const { error } = await supabase
      .from('auditoria')
      .insert({
        tabla,
        registro_id,
        accion: 'ver',
        detalles: detalles || null,
        usuario_id: user.id
      });

    if (error) {
      console.error('Error al registrar visualización en auditoría:', error);
    }
  } catch (error) {
    console.error('Error al registrar visualización en auditoría:', error);
  }
}
