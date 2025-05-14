
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RegistroAuditoria {
  id: string;
  usuario_id: string;
  tabla: string;
  accion: string;
  registro_id: string;
  detalles: any;
  ip_address: string | null;
  timestamp: string;
  usuario?: {
    email: string;
    nombre?: string;
  };
}

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
        usuario:usuario_id(
          email:email,
          nombre:perfiles(nombre)
        )
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
    return (data || []).map(registro => ({
      ...registro,
      usuario: {
        email: registro.usuario?.email || 'Usuario desconocido',
        nombre: registro.usuario?.nombre?.[0]?.nombre || undefined
      }
    }));
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
    let query = supabase
      .from('auditoria')
      .select('*')
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
    const { error } = await supabase
      .from('auditoria')
      .insert({
        tabla,
        registro_id,
        accion: 'ver',
        detalles: detalles || null
      });

    if (error) {
      console.error('Error al registrar visualización en auditoría:', error);
    }
  } catch (error) {
    console.error('Error al registrar visualización en auditoría:', error);
  }
}
