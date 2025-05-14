
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { obtenerRegistrosAuditoria, obtenerMisRegistrosAuditoria, RegistroAuditoria } from "@/services/auditoriaService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Search, Loader2, Database, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

function formatDateTime(date: string): string {
  return format(new Date(date), "dd MMM yyyy HH:mm:ss", { locale: es });
}

function getBadgeColorByAccion(accion: string) {
  switch (accion) {
    case 'crear':
      return 'bg-green-500';
    case 'editar':
      return 'bg-blue-500';
    case 'eliminar':
      return 'bg-red-500';
    case 'ver':
      return 'bg-gray-500';
    default:
      return 'bg-primary';
  }
}

export default function Auditoria() {
  const { user } = useAuth();
  const [registros, setRegistros] = useState<RegistroAuditoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabActiva, setTabActiva] = useState("todos");
  const [filtroTabla, setFiltroTabla] = useState("");
  const [filtroAccion, setFiltroAccion] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [fechas, setFechas] = useState<DateRange | undefined>({ from: undefined, to: undefined });

  const cargarRegistros = async () => {
    setLoading(true);
    try {
      let resultado;
      const desde = fechas?.from ? format(fechas.from, 'yyyy-MM-dd') : undefined;
      const hasta = fechas?.to ? format(fechas.to, 'yyyy-MM-dd') + 'T23:59:59' : undefined;
      
      if (tabActiva === "todos" && user?.rol === 'admin') {
        resultado = await obtenerRegistrosAuditoria(100, desde, hasta, filtroTabla || undefined, filtroAccion || undefined);
      } else {
        resultado = await obtenerMisRegistrosAuditoria(100, desde, hasta, filtroTabla || undefined, filtroAccion || undefined);
      }
      setRegistros(resultado);
    } catch (error) {
      console.error("Error al cargar registros de auditoría:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRegistros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabActiva]);

  const handleFiltrarClick = () => {
    cargarRegistros();
  };

  const handleResetearFiltros = () => {
    setFiltroTabla("");
    setFiltroAccion("");
    setBusqueda("");
    setFechas({ from: undefined, to: undefined });
    cargarRegistros();
  };

  const registrosFiltrados = registros.filter(registro => {
    const busquedaLower = busqueda.toLowerCase();
    const contieneTermino = 
      registro.tabla.toLowerCase().includes(busquedaLower) ||
      registro.accion.toLowerCase().includes(busquedaLower) ||
      (registro.usuario?.email && registro.usuario.email.toLowerCase().includes(busquedaLower)) ||
      (registro.usuario?.nombre && registro.usuario.nombre.toLowerCase().includes(busquedaLower));
    return contieneTermino;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Auditoría del Sistema</h1>
          <p className="text-muted-foreground">
            {user?.rol === 'admin' ? 
              'Visualiza todos los registros de actividad en el sistema' : 
              'Visualiza tu actividad en el sistema'
            }
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Registros de Auditoría
          </CardTitle>
          <CardDescription>
            Monitorea las acciones realizadas en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user?.rol === 'admin' ? (
            <Tabs value={tabActiva} onValueChange={setTabActiva} className="mb-6">
              <TabsList>
                <TabsTrigger value="todos">Todos los Registros</TabsTrigger>
                <TabsTrigger value="mis-registros">Mis Registros</TabsTrigger>
              </TabsList>
            </Tabs>
          ) : null}

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex gap-2 flex-1">
              <Input 
                placeholder="Buscar..." 
                value={busqueda} 
                onChange={(e) => setBusqueda(e.target.value)} 
                className="max-w-sm"
              />
              <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <DatePickerWithRange 
                date={fechas}
                onSelect={setFechas}
                className="min-w-[240px]"
              />
              <Select value={filtroTabla} onValueChange={setFiltroTabla}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tabla" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las tablas</SelectItem>
                  <SelectItem value="vehiculos">Vehículos</SelectItem>
                  <SelectItem value="viajes">Viajes</SelectItem>
                  <SelectItem value="gastos">Gastos</SelectItem>
                  <SelectItem value="perfiles">Usuarios</SelectItem>
                  <SelectItem value="empresas">Empresas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filtroAccion} onValueChange={setFiltroAccion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Acción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las acciones</SelectItem>
                  <SelectItem value="crear">Crear</SelectItem>
                  <SelectItem value="editar">Editar</SelectItem>
                  <SelectItem value="eliminar">Eliminar</SelectItem>
                  <SelectItem value="ver">Ver</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleResetearFiltros} className="whitespace-nowrap">
                  Resetear
                </Button>
                <Button onClick={handleFiltrarClick} className="whitespace-nowrap">
                  Filtrar
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {registrosFiltrados.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Database className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No se encontraron registros</h3>
                  <p className="text-muted-foreground">
                    No hay registros de auditoría que coincidan con los criterios de búsqueda.
                  </p>
                </div>
              ) : (
                <div className="relative overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha y hora</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Tabla</TableHead>
                        <TableHead>Acción</TableHead>
                        <TableHead>ID de Registro</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrosFiltrados.map((registro) => (
                        <TableRow key={registro.id}>
                          <TableCell className="font-mono text-xs">
                            {formatDateTime(registro.timestamp)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <div>
                                {registro.usuario?.nombre || registro.usuario?.email || "Usuario desconocido"}
                                {registro.usuario?.nombre && registro.usuario?.email && (
                                  <div className="text-xs text-muted-foreground">{registro.usuario.email}</div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {registro.tabla}
                          </TableCell>
                          <TableCell>
                            <Badge className={cn(getBadgeColorByAccion(registro.accion), "text-white")}>
                              {registro.accion}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs truncate max-w-[100px]">
                            {registro.registro_id}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
