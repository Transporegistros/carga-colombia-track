
import { useState } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import { getGastos, getVehiculos } from "@/lib/mockData";
import { BarChart, PieChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { format, subDays, isBefore, isAfter } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";

const EXPENSE_COLORS = {
  combustible: "#ffcc00",
  peaje: "#1a73e8",
  alimentacion: "#34a853",
  hospedaje: "#ea4335",
  mantenimiento: "#fb8c00",
  otro: "#9b59b6"
};

const Reportes = () => {
  const allGastos = getGastos();
  const vehiculos = getVehiculos();

  // Fecha por defecto: último mes
  const today = new Date();
  const lastMonth = subDays(today, 30);
  
  const [vehiculoId, setVehiculoId] = useState<string>("todos");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: lastMonth,
    to: today
  });

  // Filtrar gastos por vehículo y rango de fechas
  const filteredGastos = allGastos.filter(gasto => {
    // Filtrado por vehículo
    const vehiculoMatch = vehiculoId === "todos" || gasto.vehiculoId === vehiculoId;
    
    // Filtrado por rango de fechas
    let dateMatch = true;
    if (dateRange?.from) {
      dateMatch = dateMatch && isAfter(new Date(gasto.fecha), new Date(dateRange.from));
    }
    if (dateRange?.to) {
      dateMatch = dateMatch && isBefore(new Date(gasto.fecha), new Date(dateRange.to));
    }
    
    return vehiculoMatch && dateMatch;
  });
  
  // Calcular estadísticas
  const totalGastos = filteredGastos.reduce((sum, gasto) => sum + gasto.monto, 0);
  
  // Datos para la gráfica por tipo de gasto
  const gastosPorTipo = Object.entries(
    filteredGastos.reduce((acc, gasto) => {
      acc[gasto.tipo] = (acc[gasto.tipo] || 0) + gasto.monto;
      return acc;
    }, {} as Record<string, number>)
  ).map(([tipo, monto]) => ({
    tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
    monto,
    porcentaje: Math.round((monto / totalGastos) * 100)
  }));

  // Datos para la gráfica por vehículo
  const gastosPorVehiculo = Object.entries(
    filteredGastos.reduce((acc, gasto) => {
      acc[gasto.vehiculoId] = (acc[gasto.vehiculoId] || 0) + gasto.monto;
      return acc;
    }, {} as Record<string, number>)
  ).map(([id, monto]) => {
    const vehiculo = vehiculos.find(v => v.id === id);
    return {
      placa: vehiculo ? vehiculo.placa : "Desconocido",
      monto
    };
  }).sort((a, b) => b.monto - a.monto); // Ordenar de mayor a menor

  // Datos para la gráfica por fecha (últimos días)
  const gastosPorFecha = filteredGastos.reduce((acc, gasto) => {
    const date = format(new Date(gasto.fecha), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = {
        fecha: date,
        combustible: 0,
        peaje: 0,
        alimentacion: 0,
        hospedaje: 0,
        mantenimiento: 0,
        otro: 0,
        total: 0
      };
    }
    acc[date][gasto.tipo] += gasto.monto;
    acc[date].total += gasto.monto;
    return acc;
  }, {} as Record<string, any>);

  const gastosPorFechaArray = Object.values(gastosPorFecha)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(-14); // Mostrar últimos 14 días con datos

  // Exportar reporte
  const exportarCSV = () => {
    // Crear encabezados del CSV
    const headers = "Fecha,Tipo,Vehículo,Descripción,Ubicación,Monto\n";
    
    // Crear filas de datos
    const rows = filteredGastos.map(gasto => {
      const vehiculo = vehiculos.find(v => v.id === gasto.vehiculoId);
      const placaVehiculo = vehiculo ? vehiculo.placa : "Desconocido";
      
      return [
        gasto.fecha,
        gasto.tipo,
        placaVehiculo,
        gasto.descripcion || "",
        gasto.ubicacion || "",
        gasto.monto
      ].join(",");
    }).join("\n");
    
    // Combinar y crear enlace de descarga
    const csv = headers + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reporte-gastos-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Mostrar mensaje de éxito
    alert("Reporte exportado correctamente");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reportes</h1>
        <p className="text-muted-foreground">Análisis y estadísticas de gastos</p>
      </div>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Filtros de Reporte</CardTitle>
          <CardDescription>Personaliza el período y vehículos a incluir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2 w-full sm:w-1/3">
              <label className="text-sm font-medium">Período</label>
              <DatePickerWithRange
                className="w-full"
                date={dateRange}
                onSelect={setDateRange}
              />
            </div>
            <div className="space-y-2 w-full sm:w-1/3">
              <label className="text-sm font-medium">Vehículo</label>
              <Select 
                value={vehiculoId}
                onValueChange={setVehiculoId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un vehículo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los vehículos</SelectItem>
                  {vehiculos.map((vehiculo) => (
                    <SelectItem key={vehiculo.id} value={vehiculo.id}>
                      {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end w-full sm:w-1/3">
              <Button className="w-full" onClick={exportarCSV}>
                Exportar reporte (CSV)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Resumen de Gastos</CardTitle>
            <CardDescription>
              {dateRange?.from && dateRange?.to ? (
                <>
                  Período del {format(dateRange.from, "PPP", { locale: es })} al {format(dateRange.to, "PPP", { locale: es })}
                </>
              ) : "Todos los gastos"}
              {vehiculoId !== "todos" && (
                <>
                  {" - "}Vehículo: {vehiculos.find(v => v.id === vehiculoId)?.placa || ""}
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-2xl font-bold">{formatCurrency(totalGastos)}</div>
              <div className="text-muted-foreground mt-1">Total de {filteredGastos.length} gastos</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-center">Distribución por Tipo</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gastosPorTipo}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ tipo, porcentaje }) => `${tipo}: ${porcentaje}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="monto"
                    >
                      {gastosPorTipo.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={EXPENSE_COLORS[entry.tipo.toLowerCase() as keyof typeof EXPENSE_COLORS] || "#bbb"}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-center">Gastos por Vehículo</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    layout="vertical"
                    data={gastosPorVehiculo.slice(0, 5)}
                    margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                    <YAxis dataKey="placa" type="category" />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="monto" fill="#1a73e8" name="Monto" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Evolución de Gastos</CardTitle>
            <CardDescription>Gastos diarios por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={gastosPorFechaArray}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis tickFormatter={(value) => `$${value/1000}K`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="combustible" stackId="a" name="Combustible" fill={EXPENSE_COLORS.combustible} />
                <Bar dataKey="peaje" stackId="a" name="Peajes" fill={EXPENSE_COLORS.peaje} />
                <Bar dataKey="mantenimiento" stackId="a" name="Mantenimiento" fill={EXPENSE_COLORS.mantenimiento} />
                <Bar dataKey="alimentacion" stackId="a" name="Alimentación" fill={EXPENSE_COLORS.alimentacion} />
                <Bar dataKey="hospedaje" stackId="a" name="Hospedaje" fill={EXPENSE_COLORS.hospedaje} />
                <Bar dataKey="otro" stackId="a" name="Otros" fill={EXPENSE_COLORS.otro} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reportes;
