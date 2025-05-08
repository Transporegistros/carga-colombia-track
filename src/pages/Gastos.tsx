
import { useState } from "react";
import { getGastos, getVehiculos, getViajes, addGasto } from "@/lib/mockData";
import { Gasto, Vehiculo, Viaje } from "@/types";
import { formatCurrency } from "@/lib/formatCurrency";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Plus, Search, Filter, Truck, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const tiposGasto = [
  { value: "combustible", label: "Combustible" },
  { value: "peaje", label: "Peaje" },
  { value: "alimentacion", label: "Alimentación" },
  { value: "hospedaje", label: "Hospedaje" },
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "otro", label: "Otro" }
];

const Gastos = () => {
  const [gastos, setGastos] = useState<Gasto[]>(getGastos());
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const vehiculos = getVehiculos();
  const viajes = getViajes();
  const [selectedTipo, setSelectedTipo] = useState("todos");
  
  const [newGasto, setNewGasto] = useState<Omit<Gasto, "id">>({
    viajeId: "",
    vehiculoId: "",
    tipo: "combustible",
    fecha: format(new Date(), "yyyy-MM-dd"),
    monto: 0,
    descripcion: "",
    ubicacion: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGasto({
      ...newGasto,
      [name]: name === "monto" || name === "kilometraje" ? parseFloat(value) : value
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === "viajeId") {
      const viaje = viajes.find(v => v.id === value);
      if (viaje) {
        // Auto-fill vehiculoId when a trip is selected
        setNewGasto({
          ...newGasto,
          viajeId: value,
          vehiculoId: viaje.vehiculoId
        });
      }
    } else {
      setNewGasto({
        ...newGasto,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addGasto(newGasto);
    setGastos([...gastos, created]);
    setOpen(false);
    setNewGasto({
      viajeId: "",
      vehiculoId: "",
      tipo: "combustible",
      fecha: format(new Date(), "yyyy-MM-dd"),
      monto: 0,
      descripcion: "",
      ubicacion: ""
    });
    
    toast.success("Gasto registrado correctamente", {
      description: `${formatCurrency(created.monto)} - ${created.tipo}`
    });
  };
  
  const getVehiculoPlaca = (vehiculoId: string) => {
    const vehiculo = vehiculos.find(v => v.id === vehiculoId);
    return vehiculo ? vehiculo.placa : "Desconocido";
  };
  
  const getViajeInfo = (viajeId: string) => {
    const viaje = viajes.find(v => v.id === viajeId);
    return viaje ? `${viaje.origen} → ${viaje.destino}` : "Viaje desconocido";
  };
  
  const filteredGastos = gastos.filter(gasto => {
    // Filtrado por búsqueda
    const searchMatch = 
      (gasto.descripcion && gasto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (gasto.ubicacion && gasto.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()));
      
    // Filtrado por tipo
    const tipoMatch = selectedTipo === "todos" || gasto.tipo === selectedTipo;
    
    return searchMatch || tipoMatch;
  });

  // Calcular totales
  const totalGastos = filteredGastos.reduce((sum, gasto) => sum + gasto.monto, 0);
  const gastosPorTipo = tiposGasto.map(tipo => ({
    tipo: tipo.label,
    valor: filteredGastos
      .filter(g => g.tipo === tipo.value)
      .reduce((sum, g) => sum + g.monto, 0)
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gastos</h1>
          <p className="text-muted-foreground">Registra y consulta los gastos de tus viajes</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar gasto..."
              className="pl-8 w-full sm:w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex gap-2 whitespace-nowrap">
                <Plus className="h-4 w-4" />
                Nuevo Gasto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Gasto</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="viajeId">Viaje</Label>
                    <Select 
                      value={newGasto.viajeId}
                      onValueChange={(value) => handleSelectChange("viajeId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un viaje (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {viajes.map((viaje) => (
                          <SelectItem key={viaje.id} value={viaje.id}>
                            {getVehiculoPlaca(viaje.vehiculoId)} - {viaje.origen} a {viaje.destino}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehiculoId">Vehículo</Label>
                    <Select 
                      required
                      value={newGasto.vehiculoId}
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo de Gasto</Label>
                      <Select 
                        required
                        value={newGasto.tipo}
                        onValueChange={(value) => handleSelectChange("tipo", value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposGasto.map((tipo) => (
                            <SelectItem key={tipo.value} value={tipo.value}>
                              {tipo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fecha">Fecha</Label>
                      <Input
                        id="fecha"
                        name="fecha"
                        type="date"
                        required
                        value={newGasto.fecha}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="monto">Monto (COP)</Label>
                      <Input
                        id="monto"
                        name="monto"
                        type="number"
                        required
                        placeholder="0"
                        value={newGasto.monto || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    {newGasto.tipo === "combustible" && (
                      <div className="space-y-2">
                        <Label htmlFor="kilometraje">Kilometraje</Label>
                        <Input
                          id="kilometraje"
                          name="kilometraje"
                          type="number"
                          placeholder="0"
                          value={newGasto.kilometraje || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ubicacion">Ubicación</Label>
                    <Input
                      id="ubicacion"
                      name="ubicacion"
                      placeholder="Lugar donde se realizó el gasto"
                      value={newGasto.ubicacion || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Input
                      id="descripcion"
                      name="descripcion"
                      placeholder="Detalles adicionales"
                      value={newGasto.descripcion || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit">Registrar Gasto</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={selectedTipo === "todos" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedTipo("todos")}
        >
          Todos
        </Button>
        {tiposGasto.map(tipo => (
          <Button
            key={tipo.value}
            variant={selectedTipo === tipo.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTipo(tipo.value)}
          >
            {tipo.label}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Resumen de Gastos</span>
              <span>{formatCurrency(totalGastos)}</span>
            </CardTitle>
            <CardDescription>
              {filteredGastos.length} gastos {selectedTipo !== "todos" && `de tipo ${selectedTipo}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tabla">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tabla">Vista de tabla</TabsTrigger>
                <TabsTrigger value="tarjetas">Vista de tarjetas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tabla" className="mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Vehículo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGastos.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No hay gastos registrados
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredGastos.map(gasto => (
                          <TableRow key={gasto.id}>
                            <TableCell className="font-medium">
                              {format(new Date(gasto.fecha), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell>{getVehiculoPlaca(gasto.vehiculoId)}</TableCell>
                            <TableCell className="capitalize">{gasto.tipo}</TableCell>
                            <TableCell>
                              {gasto.descripcion || (gasto.ubicacion ? `En ${gasto.ubicacion}` : "Sin descripción")}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(gasto.monto)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="tarjetas" className="mt-4">
                {filteredGastos.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-semibold">No hay gastos registrados</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || selectedTipo !== "todos" ? "No se encontraron gastos con esos criterios" : "Registra tu primer gasto para comenzar"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredGastos.map(gasto => (
                      <Card key={gasto.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                              <CardTitle className="text-lg">{formatCurrency(gasto.monto)}</CardTitle>
                              <CardDescription className="mt-1 flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(gasto.fecha), "PPP", { locale: es })}
                              </CardDescription>
                            </div>
                            <div className={`p-2 rounded-full ${
                              gasto.tipo === 'combustible' ? 'bg-yellow-100 text-yellow-800' :
                              gasto.tipo === 'peaje' ? 'bg-blue-100 text-blue-800' :
                              gasto.tipo === 'mantenimiento' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {gasto.tipo === 'combustible' && <Fuel className="h-4 w-4" />}
                              {gasto.tipo === 'peaje' && <Receipt className="h-4 w-4" />}
                              {gasto.tipo !== 'combustible' && gasto.tipo !== 'peaje' && <DollarSign className="h-4 w-4" />}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Tipo:</span>
                              <span className="font-medium capitalize">{gasto.tipo}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Vehículo:</span>
                              <span className="font-medium">{getVehiculoPlaca(gasto.vehiculoId)}</span>
                            </div>
                            {gasto.viajeId && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Viaje:</span>
                                <span className="font-medium">{getViajeInfo(gasto.viajeId)}</span>
                              </div>
                            )}
                            {gasto.ubicacion && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Ubicación:</span>
                                <span className="font-medium">{gasto.ubicacion}</span>
                              </div>
                            )}
                            {gasto.kilometraje && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Kilometraje:</span>
                                <span className="font-medium">{gasto.kilometraje} km</span>
                              </div>
                            )}
                            {gasto.descripcion && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Descripción:</span>
                                <span className="font-medium">{gasto.descripcion}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Gastos;
