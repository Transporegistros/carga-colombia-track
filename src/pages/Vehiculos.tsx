
import { useState } from "react";
import { getVehiculos, addVehiculo } from "@/lib/mockData";
import { Vehiculo } from "@/types";
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
import { Truck, Plus, Search, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>(getVehiculos());
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [newVehiculo, setNewVehiculo] = useState({
    placa: "",
    modelo: "",
    marca: "",
    tipo: "",
    capacidad: 0,
    propietario: "",
    telefono: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVehiculo({
      ...newVehiculo,
      [name]: name === 'capacidad' ? parseFloat(value) : value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addVehiculo(newVehiculo);
    setVehiculos([...vehiculos, created]);
    setOpen(false);
    setNewVehiculo({
      placa: "",
      modelo: "",
      marca: "",
      tipo: "",
      capacidad: 0,
      propietario: "",
      telefono: ""
    });
    
    toast.success("Vehículo agregado correctamente", {
      description: `${created.marca} ${created.modelo} placa ${created.placa}`
    });
  };
  
  const filteredVehiculos = vehiculos.filter(vehiculo =>
    vehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.propietario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Vehículos</h1>
          <p className="text-muted-foreground">Administra tu flota de vehículos</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar vehículo..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex gap-2 whitespace-nowrap">
                <Plus className="h-4 w-4" />
                Nuevo Vehículo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Vehículo</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="placa">Placa</Label>
                    <Input
                      id="placa"
                      name="placa"
                      required
                      placeholder="ABC123"
                      value={newVehiculo.placa}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Input
                      id="marca"
                      name="marca"
                      required
                      placeholder="Kenworth"
                      value={newVehiculo.marca}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input
                      id="modelo"
                      name="modelo"
                      required
                      placeholder="2023"
                      value={newVehiculo.modelo}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Input
                      id="tipo"
                      name="tipo"
                      required
                      placeholder="Tractocamión"
                      value={newVehiculo.tipo}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="capacidad">Capacidad (kg)</Label>
                    <Input
                      id="capacidad"
                      name="capacidad"
                      required
                      type="number"
                      placeholder="35000"
                      value={newVehiculo.capacidad || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="propietario">Propietario</Label>
                    <Input
                      id="propietario"
                      name="propietario"
                      required
                      placeholder="Juan Pérez"
                      value={newVehiculo.propietario}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      required
                      placeholder="3101234567"
                      value={newVehiculo.telefono}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit">Guardar Vehículo</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {filteredVehiculos.length === 0 ? (
        <div className="text-center py-12">
          <Truck className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-semibold">No hay vehículos</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "No se encontraron vehículos con esa búsqueda" : "Agrega tu primer vehículo para comenzar"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehiculos.map((vehiculo) => (
            <Card key={vehiculo.id} className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      <span className="font-bold text-xl">{vehiculo.placa}</span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {vehiculo.marca} {vehiculo.modelo}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="font-medium">{vehiculo.tipo}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Capacidad:</span>
                    <span className="font-medium">{vehiculo.capacidad.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Propietario:</span>
                    <span className="font-medium">{vehiculo.propietario}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Teléfono:</span>
                    <span className="font-medium">{vehiculo.telefono}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 p-3 flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <a href={`/viajes?vehiculo=${vehiculo.id}`}>Ver Viajes</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`/gastos?vehiculo=${vehiculo.id}`}>Ver Gastos</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vehiculos;
