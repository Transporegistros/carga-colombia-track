
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
  IconComponent?: React.ComponentType<any>; // Added for AppSidebar
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
  usuario?: {
    email: string;
    nombre?: string;
  };
}

// Add missing types for mockData.ts
export interface Vehiculo {
  id: string;
  placa: string;
  modelo: string;
  marca: string;
  tipo: string;
  capacidad: number;
  propietario: string;
  telefono: string;
}

export interface Viaje {
  id: string;
  vehiculoId: string;
  fechaSalida: string;
  fechaLlegada?: string;
  origen: string;
  destino: string;
  carga: string;
  estado: 'pendiente' | 'en-curso' | 'completado' | 'cancelado';
  distancia: number;
  conductor: string;
}

export interface Gasto {
  id: string;
  viajeId: string;
  vehiculoId: string;
  tipo: 'combustible' | 'peaje' | 'alimentacion' | 'hospedaje' | 'mantenimiento' | 'otro';
  fecha: string;
  monto: number;
  descripcion: string;
  ubicacion?: string;
  kilometraje?: number;
}

export interface DatosResumen {
  totalVehiculos: number;
  viajesActivos: number;
  gastosMes: number;
  combustibleMes: number;
}
