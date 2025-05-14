export interface User {
  id: string;
  email: string;
  nombre?: string;
  rol?: string;
  empresa_id?: string;
  empresa_nombre?: string;
}

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

export interface RegistroAuditoria {
  id: string;
  usuario_id: string;
  tabla: string;
  accion: string;
  registro_id: string;
  detalles: any;
  ip_address: string | null;
  timestamp: string;
}
