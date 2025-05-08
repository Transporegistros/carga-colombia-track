
import { useState } from "react";
import { getGastos, getVehiculos, addGasto } from "@/lib/mockData";
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
import { Fuel, Plus, Search, Truck } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const Combustible = () => {
  const allGastos = getGastos();
  const combustibleGastos = allGastos.filter(g => g.tipo === "combustible");
  
  const [gastos, setGastos] = useState(combustibleGastos);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const vehiculos = getVehiculos();
  
  const [newGasto, setNewGasto] = useState({
    viajeId: "",
    vehiculoId: "",
    tipo: "combustible" as const,
    fecha: format(new Date(), "yyyy-MM-dd"),
    monto: 0,
    ubicacion: "",
    descripcion: "",
    kilometraje: 0
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGasto({
      ...newGasto,
      [name]: name === "monto" || name === "kilometraje" ? parseFloat(value) : value
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewGasto({
      ...newGasto,
      [name]: value
    });
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
      ubicacion: "",
      descripcion: "",
      kilometraje: 0
    });
    
    toast.success("Gasto de combustible registrado correctamente", {
      description: `${formatCurrency(created.monto)}`
    });
  };
  
  const getVehiculoPlaca = (vehiculoId: string) => {
    const vehiculo = vehiculos.find(v => v.id === vehiculoId);
    return vehiculo ? vehiculo.placa : "Desconocido";
  };
  
  const filteredGastos = gastos.filter(gasto => 
    (gasto.descripcion && gasto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (gasto.ubicacion && gasto.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calcular totales
  const totalGastos = filteredGastos.reduce((sum, gasto) => sum + gasto.monto, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Combustible</h1>
          <p className="text-muted-foreground">Registro de gastos de combustible</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar registro..."
              className="pl-8 w-full sm:w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex gap-2 whitespace-nowrap">
                <Plus className="h-4 w-4" />
                Nuevo Registro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Combustible</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
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
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="kilometraje">Kilometraje</Label>
                      <Input
                        id="kilometraje"
                        name="kilometraje"
                        type="number"
                        required
                        placeholder="0"
                        value={newGasto.kilometraje || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ubicacion">Estación de servicio</Label>
                      <Input
                        id="ubicacion"
                        name="ubicacion"
                        placeholder="Nombre de la estación"
                        value={newGasto.ubicacion || ""}
                        onChange={handleInputChange}
                      />
                    </div>
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
                  <Button type="submit">Registrar Combustible</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Gastos de Combustible
            </span>
            <span>{formatCurrency(totalGastos)}</span>
          </CardTitle>
          <CardDescription>
            {filteredGastos.length} registros de combustible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Kilometraje</TableHead>
                  <TableHead>Estación</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGastos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No hay registros de combustible
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGastos.map(gasto => (
                    <TableRow key={gasto.id}>
                      <TableCell className="font-medium">
                        {format(new Date(gasto.fecha), "PPP", { locale: es })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          {getVehiculoPlaca(gasto.vehiculoId)}
                        </div>
                      </TableCell>
                      <TableCell>{gasto.kilometraje?.toLocaleString() || "N/A"} km</TableCell>
                      <TableCell>{gasto.ubicacion || "N/A"}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(gasto.monto)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Combustible;
