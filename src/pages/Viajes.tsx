
import { useState } from "react";
import { getViajes, getVehiculos, addViaje } from "@/lib/mockData";
import { Viaje, Vehiculo } from "@/types";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Plus, Search, Calendar, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Viajes = () => {
  const [viajes, setViajes] = useState<Viaje[]>(getViajes());
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const vehiculos = getVehiculos();
  
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  
  const [newViaje, setNewViaje] = useState<Omit<Viaje, "id">>({
    vehiculoId: "",
    fechaSalida: format(new Date(), "yyyy-MM-dd"),
    origen: "",
    destino: "",
    carga: "",
    estado: "pendiente",
    conductor: "",
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewViaje({
      ...newViaje,
      [name]: value
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewViaje({
      ...newViaje,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addViaje(newViaje);
    setViajes([...viajes, created]);
    setOpen(false);
    setNewViaje({
      vehiculoId: "",
      fechaSalida: format(new Date(), "yyyy-MM-dd"),
      origen: "",
      destino: "",
      carga: "",
      estado: "pendiente",
      conductor: "",
    });
    
    toast.success("Viaje agregado correctamente");
  };
  
  const getVehiculoPlaca = (vehiculoId: string) => {
    const vehiculo = vehiculos.find(v => v.id === vehiculoId);
    return vehiculo ? vehiculo.placa : "Desconocido";
  };
  
  const filteredViajes = viajes.filter(viaje => {
    // Filtrado por búsqueda
    const searchMatch = 
      viaje.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      viaje.destino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      viaje.conductor.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Filtrado por estado
    const estadoMatch = filtroEstado === "todos" || viaje.estado === filtroEstado;
    
    return searchMatch && estadoMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Viajes</h1>
          <p className="text-muted-foreground">Gestiona los viajes de tus vehículos</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar viaje..."
              className="pl-8 w-full sm:w-[220px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex gap-2 whitespace-nowrap">
                <Plus className="h-4 w-4" />
                Nuevo Viaje
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Viaje</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehiculoId">Vehículo</Label>
                    <Select 
                      required
                      value={newViaje.vehiculoId}
                      onValueChange={(value) => handleSelectChange("vehiculoId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un vehículo" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehiculos.map((vehiculo) => (
                          <SelectItem key={vehiculo.id} value={vehiculo.id}>
                            {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fechaSalida">Fecha de Salida</Label>
                    <Input
                      id="fechaSalida"
                      name="fechaSalida"
                      type="date"
                      required
                      value={newViaje.fechaSalida}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="origen">Origen</Label>
                      <Input
                        id="origen"
                        name="origen"
                        required
                        placeholder="Ciudad de origen"
                        value={newViaje.origen}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="destino">Destino</Label>
                      <Input
                        id="destino"
                        name="destino"
                        required
                        placeholder="Ciudad de destino"
                        value={newViaje.destino}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="carga">Tipo de Carga</Label>
                    <Input
                      id="carga"
                      name="carga"
                      required
                      placeholder="Descripción de la carga"
                      value={newViaje.carga}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="conductor">Conductor</Label>
                    <Input
                      id="conductor"
                      name="conductor"
                      required
                      placeholder="Nombre del conductor"
                      value={newViaje.conductor}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit">Registrar Viaje</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={filtroEstado === "todos" ? "default" : "outline"}
          size="sm"
          onClick={() => setFiltroEstado("todos")}
        >
          Todos
        </Button>
        <Button
          variant={filtroEstado === "pendiente" ? "default" : "outline"}
          size="sm"
          onClick={() => setFiltroEstado("pendiente")}
          className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900 border-yellow-200"
        >
          Pendientes
        </Button>
        <Button
          variant={filtroEstado === "en-curso" ? "default" : "outline"}
          size="sm"
          onClick={() => setFiltroEstado("en-curso")}
          className="bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900 border-blue-200"
        >
          En Curso
        </Button>
        <Button
          variant={filtroEstado === "completado" ? "default" : "outline"}
          size="sm"
          onClick={() => setFiltroEstado("completado")}
          className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 border-green-200"
        >
          Completados
        </Button>
        <Button
          variant={filtroEstado === "cancelado" ? "default" : "outline"}
          size="sm"
          onClick={() => setFiltroEstado("cancelado")}
          className="bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900 border-red-200"
        >
          Cancelados
        </Button>
      </div>
      
      {filteredViajes.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-semibold">No hay viajes registrados</h3>
          <p className="text-muted-foreground">
            {searchTerm || filtroEstado !== "todos" ? "No se encontraron viajes con esos criterios" : "Registra tu primer viaje para comenzar"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredViajes.map((viaje) => (
            <Card key={viaje.id} className="overflow-hidden">
              <CardHeader className={`
                ${viaje.estado === 'completado' ? 'bg-green-50' :
                  viaje.estado === 'en-curso' ? 'bg-blue-50' :
                  viaje.estado === 'pendiente' ? 'bg-yellow-50' :
                  'bg-red-50'}
                pb-3
              `}>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="font-bold text-xl">{getVehiculoPlaca(viaje.vehiculoId)}</span>
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(viaje.fechaSalida), "PPP", { locale: es })}
                  </CardDescription>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-medium flex flex-col">
                    <span>{viaje.origen}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 mx-2" />
                  <span className="text-sm font-medium flex flex-col">
                    <span>{viaje.destino}</span>
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estado:</span>
                    <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${
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
                  </div>
                  {viaje.fechaLlegada && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Llegada:</span>
                      <span className="font-medium">
                        {format(new Date(viaje.fechaLlegada), "PPP", { locale: es })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Carga:</span>
                    <span className="font-medium">{viaje.carga}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Conductor:</span>
                    <span className="font-medium">{viaje.conductor}</span>
                  </div>
                  {viaje.distancia && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Distancia:</span>
                      <span className="font-medium">{viaje.distancia} km</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 p-3 flex justify-between">
                <Button variant="outline" size="sm">
                  Editar
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`/gastos?viaje=${viaje.id}`}>Registrar Gasto</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Viajes;
