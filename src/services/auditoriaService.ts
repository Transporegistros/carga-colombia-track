
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Exportamos el tipo RegistroAuditoria para que pueda ser usado en otros archivos
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
      // Tratar la información del usuario de forma más segura
      let userEmail = 'Usuario desconocido';
      
      // Comprobamos explícitamente si registro.usuario es null o undefined
      if (registro.usuario !== null && registro.usuario !== undefined && typeof registro.usuario === 'object') {
        // Utilizar type assertion para ayudar a TypeScript a entender que usuario no es null aquí
        const usuarioObj = registro.usuario as { email?: string };
        
        // Verificamos que registro.usuario.email existe y no es null/undefined
        if (usuarioObj.email) {
          userEmail = usuarioObj.email;
        }
      }
      
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
