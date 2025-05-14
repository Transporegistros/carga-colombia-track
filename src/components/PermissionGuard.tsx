
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { verificarPermiso } from "@/services/permisosService";

interface PermissionGuardProps {
  children: ReactNode;
  modulo: string;
  accion: 'crear' | 'editar' | 'eliminar' | 'ver';
  fallback?: ReactNode;
}

export function PermissionGuard({ children, modulo, accion, fallback = null }: PermissionGuardProps) {
  const { user } = useAuth();
  const [tienePermiso, setTienePermiso] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      if (!user) {
        setTienePermiso(false);
        setLoading(false);
        return;
      }

      // Los administradores siempre tienen todos los permisos
      if (user.rol === 'admin') {
        setTienePermiso(true);
        setLoading(false);
        return;
      }

      try {
        const result = await verificarPermiso(modulo, accion);
        setTienePermiso(result);
      } catch (error) {
        console.error("Error al verificar permiso:", error);
        setTienePermiso(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, [user, modulo, accion]);

  if (loading) {
    return null; // o un spinner pequeño si prefieres
  }

  if (!tienePermiso) {
    return fallback;
  }

  return <>{children}</>;
}
