
export interface Vehiculo {
  id: string;
  placa: string;
  modelo: string;
  marca: string;
  tipo: string;
  capacidad: number;
  propietario: string;
  telefono: string;
  imagen?: string;
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
  distancia?: number;
  conductor: string;
}

export interface Gasto {
  id: string;
  viajeId: string;
  vehiculoId: string;
  tipo: 'combustible' | 'peaje' | 'alimentacion' | 'hospedaje' | 'mantenimiento' | 'otro';
  fecha: string;
  monto: number;
  descripcion?: string;
  ubicacion?: string;
  kilometraje?: number;
}

export interface DatosResumen {
  totalVehiculos: number;
  viajesActivos: number;
  gastosMes: number;
  combustibleMes: number;
}

export interface User {
  id: string;
  email: string;
  nombre?: string;
  rol?: string;
  empresa_id?: string;
  empresa_nombre?: string;
}
