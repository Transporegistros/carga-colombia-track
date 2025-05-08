
import { BarChart3, DollarSign, Fuel, MapPin, Truck } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { formatCurrency } from "@/lib/formatCurrency";
import { getDatosResumen, getViajes, getGastos } from "@/lib/mockData";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const Dashboard = () => {
  const resumen = getDatosResumen();
  const viajesRecientes = getViajes().slice(0, 5);
  const gastosRecientes = getGastos().slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido a TranspoRegistrosPlus</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Vehículos"
          value={resumen.totalVehiculos}
          icon={<Truck className="h-5 w-5" />}
          description="Total en flota"
        />
        <StatsCard 
          title="Viajes Activos"
          value={resumen.viajesActivos}
          icon={<MapPin className="h-5 w-5" />}
          description="En curso actualmente"
        />
        <StatsCard 
          title="Gastos del Mes"
          value={formatCurrency(resumen.gastosMes)}
          icon={<DollarSign className="h-5 w-5" />}
          description="Total acumulado"
          trend="neutral"
          trendValue="Este mes"
        />
        <StatsCard 
          title="Combustible"
          value={formatCurrency(resumen.combustibleMes)}
          icon={<Fuel className="h-5 w-5" />}
          description="Gasto del mes"
          trend="up"
          trendValue="5% vs. mes pasado"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Viajes Recientes</span>
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription>Los últimos 5 viajes registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Origen</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viajesRecientes.map(viaje => (
                  <TableRow key={viaje.id}>
                    <TableCell className="font-medium">{viaje.vehiculoId.substring(0, 6)}</TableCell>
                    <TableCell>{viaje.origen}</TableCell>
                    <TableCell>{viaje.destino}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        viaje.estado === 'completado' ? 'bg-green-100 text-green-800' :
                        viaje.estado === 'en-curso' ? 'bg-blue-100 text-blue-800' :
                        viaje.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {viaje.estado === 'completado' ? 'Completado' :
                         viaje.estado === 'en-curso' ? 'En curso' :
                         viaje.estado === 'pendiente' ? 'Pendiente' :
                         'Cancelado'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Gastos Recientes</span>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription>Los últimos 5 gastos registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gastosRecientes.map(gasto => (
                  <TableRow key={gasto.id}>
                    <TableCell className="font-medium">{new Date(gasto.fecha).toLocaleDateString('es-CO')}</TableCell>
                    <TableCell className="capitalize">{gasto.tipo}</TableCell>
                    <TableCell>{gasto.ubicacion || 'N/A'}</TableCell>
                    <TableCell>{formatCurrency(gasto.monto)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
