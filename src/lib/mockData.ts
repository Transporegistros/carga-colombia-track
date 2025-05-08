
import { Vehiculo, Viaje, Gasto, DatosResumen } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Datos de vehículos
const vehiculosMock: Vehiculo[] = [
  {
    id: uuidv4(),
    placa: 'ABC123',
    modelo: '2020',
    marca: 'Kenworth',
    tipo: 'Tractocamión',
    capacidad: 35000,
    propietario: 'Juan Pérez',
    telefono: '3101234567'
  },
  {
    id: uuidv4(),
    placa: 'XYZ789',
    modelo: '2019',
    marca: 'Chevrolet',
    tipo: 'Turbo',
    capacidad: 10000,
    propietario: 'María López',
    telefono: '3157654321'
  },
  {
    id: uuidv4(),
    placa: 'DEF456',
    modelo: '2021',
    marca: 'International',
    tipo: 'Tractocamión',
    capacidad: 34000,
    propietario: 'Carlos Rodríguez',
    telefono: '3209876543'
  },
];

// Datos de viajes
let viajesMock: Viaje[] = [];

// Generar viajes para cada vehículo
vehiculosMock.forEach(vehiculo => {
  const origenes = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga'];
  const destinos = ['Cartagena', 'Santa Marta', 'Ipiales', 'Pasto', 'Villavicencio'];
  const cargas = ['Alimentos', 'Electrodomésticos', 'Material de construcción', 'Productos agrícolas', 'Muebles'];
  const conductores = ['Roberto Gómez', 'Pedro Martínez', 'José Fernández', 'Luis Herrera', 'Antonio Jiménez'];
  
  const estadosPosibles: ('pendiente' | 'en-curso' | 'completado' | 'cancelado')[] = 
    ['pendiente', 'en-curso', 'completado', 'completado', 'en-curso'];
    
  // Crear 2-3 viajes por vehículo
  const numViajes = 2 + Math.floor(Math.random() * 2);
  
  for (let i = 0; i < numViajes; i++) {
    const estado = estadosPosibles[Math.floor(Math.random() * estadosPosibles.length)];
    const origen = origenes[Math.floor(Math.random() * origenes.length)];
    const destino = destinos[Math.floor(Math.random() * destinos.length)];
    
    // Fechas: últimos 30 días para salida, algunos tienen fecha de llegada
    const hoy = new Date();
    const fechaSalidaObj = new Date(hoy);
    fechaSalidaObj.setDate(hoy.getDate() - Math.floor(Math.random() * 30));
    
    let fechaLlegadaObj;
    if (estado === 'completado') {
      fechaLlegadaObj = new Date(fechaSalidaObj);
      fechaLlegadaObj.setDate(fechaSalidaObj.getDate() + 1 + Math.floor(Math.random() * 3));
    }
    
    viajesMock.push({
      id: uuidv4(),
      vehiculoId: vehiculo.id,
      fechaSalida: fechaSalidaObj.toISOString().split('T')[0],
      fechaLlegada: fechaLlegadaObj ? fechaLlegadaObj.toISOString().split('T')[0] : undefined,
      origen,
      destino,
      carga: cargas[Math.floor(Math.random() * cargas.length)],
      estado,
      distancia: 100 + Math.floor(Math.random() * 900),
      conductor: conductores[Math.floor(Math.random() * conductores.length)]
    });
  }
});

// Datos de gastos
let gastosMock: Gasto[] = [];

// Generar gastos para cada viaje
viajesMock.forEach(viaje => {
  const tiposDeGasto: ('combustible' | 'peaje' | 'alimentacion' | 'hospedaje' | 'mantenimiento' | 'otro')[] = 
    ['combustible', 'peaje', 'alimentacion', 'hospedaje', 'mantenimiento', 'otro'];
    
  const ubicaciones = ['Estación de servicio Terpel', 'Peaje Las Palmas', 'Restaurante La Parada', 'Hotel El Viajero', 'Taller Mecánico Central', 'Varios'];
  
  // Crear 3-6 gastos por viaje
  const numGastos = 3 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < numGastos; i++) {
    const tipoGasto = tiposDeGasto[Math.floor(Math.random() * tiposDeGasto.length)];
    
    // Fecha del gasto dentro del período del viaje
    const fechaViajeObj = new Date(viaje.fechaSalida);
    const fechaGastoObj = new Date(fechaViajeObj);
    const diasRandom = Math.floor(Math.random() * 2);
    fechaGastoObj.setDate(fechaViajeObj.getDate() + diasRandom);
    
    // Montos según el tipo de gasto
    let monto;
    switch (tipoGasto) {
      case 'combustible':
        monto = 200000 + Math.floor(Math.random() * 300000);
        break;
      case 'peaje':
        monto = 10000 + Math.floor(Math.random() * 40000);
        break;
      case 'alimentacion':
        monto = 30000 + Math.floor(Math.random() * 50000);
        break;
      case 'hospedaje':
        monto = 80000 + Math.floor(Math.random() * 120000);
        break;
      case 'mantenimiento':
        monto = 100000 + Math.floor(Math.random() * 400000);
        break;
      default:
        monto = 20000 + Math.floor(Math.random() * 50000);
    }
    
    gastosMock.push({
      id: uuidv4(),
      viajeId: viaje.id,
      vehiculoId: viaje.vehiculoId,
      tipo: tipoGasto,
      fecha: fechaGastoObj.toISOString().split('T')[0],
      monto,
      descripcion: `Gasto de ${tipoGasto}`,
      ubicacion: ubicaciones[tiposDeGasto.indexOf(tipoGasto)],
      kilometraje: tipoGasto === 'combustible' ? 1000 + Math.floor(Math.random() * 9000) : undefined
    });
  }
});

// Datos de resumen para el dashboard
const datosResumen: DatosResumen = {
  totalVehiculos: vehiculosMock.length,
  viajesActivos: viajesMock.filter(v => v.estado === 'en-curso').length,
  gastosMes: gastosMock.reduce((total, gasto) => {
    const fechaGasto = new Date(gasto.fecha);
    const hoy = new Date();
    if (fechaGasto.getMonth() === hoy.getMonth() && fechaGasto.getFullYear() === hoy.getFullYear()) {
      return total + gasto.monto;
    }
    return total;
  }, 0),
  combustibleMes: gastosMock.reduce((total, gasto) => {
    const fechaGasto = new Date(gasto.fecha);
    const hoy = new Date();
    if (gasto.tipo === 'combustible' && fechaGasto.getMonth() === hoy.getMonth() && fechaGasto.getFullYear() === hoy.getFullYear()) {
      return total + gasto.monto;
    }
    return total;
  }, 0)
};

// Función para obtener todos los vehículos
export const getVehiculos = (): Vehiculo[] => {
  return [...vehiculosMock];
};

// Función para obtener un vehículo por ID
export const getVehiculoById = (id: string): Vehiculo | undefined => {
  return vehiculosMock.find(v => v.id === id);
};

// Función para agregar un nuevo vehículo
export const addVehiculo = (vehiculo: Omit<Vehiculo, 'id'>): Vehiculo => {
  const newVehiculo = {
    ...vehiculo,
    id: uuidv4()
  };
  vehiculosMock.push(newVehiculo);
  return newVehiculo;
};

// Función para obtener todos los viajes
export const getViajes = (): Viaje[] => {
  return [...viajesMock];
};

// Función para obtener los viajes de un vehículo
export const getViajesByVehiculo = (vehiculoId: string): Viaje[] => {
  return viajesMock.filter(v => v.vehiculoId === vehiculoId);
};

// Función para obtener un viaje por ID
export const getViajeById = (id: string): Viaje | undefined => {
  return viajesMock.find(v => v.id === id);
};

// Función para agregar un nuevo viaje
export const addViaje = (viaje: Omit<Viaje, 'id'>): Viaje => {
  const newViaje = {
    ...viaje,
    id: uuidv4()
  };
  viajesMock.push(newViaje);
  return newViaje;
};

// Función para obtener todos los gastos
export const getGastos = (): Gasto[] => {
  return [...gastosMock];
};

// Función para obtener los gastos de un viaje
export const getGastosByViaje = (viajeId: string): Gasto[] => {
  return gastosMock.filter(g => g.viajeId === viajeId);
};

// Función para obtener los gastos de un vehículo
export const getGastosByVehiculo = (vehiculoId: string): Gasto[] => {
  return gastosMock.filter(g => g.vehiculoId === vehiculoId);
};

// Función para agregar un nuevo gasto
export const addGasto = (gasto: Omit<Gasto, 'id'>): Gasto => {
  const newGasto = {
    ...gasto,
    id: uuidv4()
  };
  gastosMock.push(newGasto);
  return newGasto;
};

// Función para obtener los datos de resumen
export const getDatosResumen = (): DatosResumen => {
  return { ...datosResumen };
};
